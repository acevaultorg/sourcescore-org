// CF Pages Function — VERITAS-Reborn /api/v1/verify (POST)
//
// Submit a natural-language claim string; the function finds the best
// catalog match by keyword overlap and returns a verified envelope OR
// `notVerified: true` if no match clears the confidence threshold.
//
// Request body (JSON):
//   {
//     "claim": "Llama 3.1 was released in July 2024",
//     "vertical": "ai-ml",                            // optional filter
//     "minConfidence": 0.85                           // optional, default 0.85
//   }
//
// Response (JSON, v0):
//   {
//     "apiVersion": "v1",
//     "methodology": "https://sourcescore.org/methodology/",
//     "query": "<echo>",
//     "matches": [{ claim, matchScore, rationale }, ...],
//     "bestMatch": { ...summary } | undefined,
//     "notVerified": true | undefined,
//     "signature": { ...HMAC over response payload }
//   }
//
// Threshold logic (v0):
//   - matchScore is keyword-overlap-derived, 0.0-1.0
//   - "best match" = highest scoring above minMatchScore (0.20 default)
//   - "verified" = bestMatch exists AND best match's claim.confidence ≥ minConfidence
//   - else `notVerified: true`
//
// Day 30+: replace keyword with semantic-similarity scoring (sentence
// transformer embeddings via Vectorize). The threshold logic stays.

const MIN_CLAIM_LEN = 5;
const MAX_CLAIM_LEN = 1000;
const DEFAULT_MIN_CONFIDENCE = 0.85;
const DEFAULT_MIN_MATCH_SCORE = 0.2;
const MAX_MATCHES_RETURNED = 5;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed", allow: "POST" }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be JSON." }, 400);
  }

  const claim = typeof body?.claim === "string" ? body.claim.trim() : "";
  if (claim.length < MIN_CLAIM_LEN || claim.length > MAX_CLAIM_LEN) {
    return json(
      {
        error: `\`claim\` must be a string between ${MIN_CLAIM_LEN} and ${MAX_CLAIM_LEN} chars.`,
      },
      400,
    );
  }

  const vertical = typeof body?.vertical === "string" ? body.vertical : undefined;
  const minConfidence = clamp(
    typeof body?.minConfidence === "number" ? body.minConfidence : DEFAULT_MIN_CONFIDENCE,
    0,
    1,
  );

  let index;
  try {
    index = await loadIndex(env, new URL(request.url));
  } catch (err) {
    return json({ error: "Catalog index unavailable.", detail: String(err) }, 503);
  }

  let candidates = index.claims;
  if (vertical) candidates = candidates.filter((c) => c.vertical === vertical);

  const ranked = rankCandidates(candidates, claim);
  const topN = ranked.slice(0, MAX_MATCHES_RETURNED);

  const bestRaw = ranked[0];
  const bestMatch =
    bestRaw && bestRaw.matchScore >= DEFAULT_MIN_MATCH_SCORE && bestRaw.claim.confidence >= minConfidence
      ? toSummary(bestRaw.claim)
      : undefined;

  const responsePayload = {
    apiVersion: "v1",
    methodology: index.methodology,
    query: claim,
    matches: topN.map((m) => ({
      claim: toSummary(m.claim),
      matchScore: round2(m.matchScore),
      rationale: m.rationale,
    })),
    ...(bestMatch ? { bestMatch } : { notVerified: true }),
  };

  // Sign the verification response so consumers can prove the answer came
  // from sourcescore.org. Skips signing if SOURCESCORE_SIGNING_SECRET is
  // unset (dev/preview) — signature field omitted.
  const secret = env.SOURCESCORE_SIGNING_SECRET;
  if (secret && secret.length >= 16) {
    responsePayload.signature = await signResponse(responsePayload, secret);
  }

  return json(responsePayload, 200);
}

// ── helpers ────────────────────────────────────────────────────────────────

async function loadIndex(env, requestUrl) {
  const indexUrl = new URL("/claims-index.json", requestUrl);
  const res = await env.ASSETS.fetch(indexUrl);
  if (!res.ok) throw new Error(`asset fetch ${indexUrl.pathname} → ${res.status}`);
  return res.json();
}

function rankCandidates(claims, queryClaim) {
  const queryTerms = tokenize(queryClaim);
  if (queryTerms.length === 0) return [];

  const out = [];
  for (const c of claims) {
    const fields = [
      { value: c.subject, weight: 5 },
      { value: c.object, weight: 3 },
      { value: c.statement ?? "", weight: 2 },
      { value: c.predicate.replace(/_/g, " "), weight: 2 },
      { value: (c.tags ?? []).join(" "), weight: 3 },
    ];

    // Maximum possible score given query terms × weights (upper bound used to
    // normalize matchScore into 0.0-1.0).
    const maxPossible =
      queryTerms.length * fields.reduce((acc, f) => acc + f.weight, 0);

    let raw = 0;
    const hits = [];
    for (const { value, weight } of fields) {
      const haystack = value.toLowerCase();
      for (const t of queryTerms) {
        if (haystack.includes(t)) {
          raw += weight;
          hits.push(t);
        }
      }
    }

    if (raw === 0) continue;

    const matchScore = raw / maxPossible;
    const uniqueHits = Array.from(new Set(hits)).slice(0, 5);
    const rationale = `Keyword overlap on: ${uniqueHits.join(", ")}.`;
    out.push({ claim: c, matchScore, rationale });
  }
  out.sort((a, b) => b.matchScore - a.matchScore);
  return out;
}

function tokenize(s) {
  return Array.from(
    new Set(
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
        .split(/\s+/)
        .filter((t) => t.length >= 2),
    ),
  );
}

function toSummary(c) {
  return {
    id: c.id,
    vertical: c.vertical,
    subject: c.subject,
    predicate: c.predicate,
    object: c.object,
    statement: c.statement,
    confidence: c.confidence,
    signatureShort: c.signatureShort,
    detailUrl: c.detailUrl,
  };
}

async function signResponse(payload, secret) {
  // Sign a canonical projection of the response — keyed to query+bestMatch
  // so the consumer can verify "I asked X, sourcescore answered Y at time Z".
  const canonical = JSON.stringify({
    apiVersion: payload.apiVersion,
    query: payload.query,
    bestMatchId: payload.bestMatch?.id ?? null,
    notVerified: payload.notVerified ?? false,
  });
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(canonical));
  return {
    algorithm: "HMAC-SHA256",
    signedBy: "did:web:sourcescore.org",
    signedAt: new Date().toISOString(),
    signature: toHex(buf),
  };
}

function toHex(buf) {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

function clamp(n, lo, hi) {
  return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS,
      // POST endpoints don't cache — request body affects response.
      "Cache-Control": "no-store",
    },
  });
}
