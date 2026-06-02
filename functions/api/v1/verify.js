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
//   - matchScore (0.0-1.0): per query term, credit the strongest field it hits
//     (word-boundary match w/ prefix tolerance — stopwords filtered), summed
//     and normalized by query-length × MAX_FIELD_WEIGHT. A query whose every
//     term hits the subject scores 1.0; genuine claims land ~0.55-0.85.
//   - "best match" = highest scoring above minMatchScore (0.30 default)
//   - "verified" = bestMatch exists AND best match's claim.confidence ≥ minConfidence
//   - else `notVerified: true`
//
// Ranking: SEMANTIC by default (Workers AI bge-m3 embedding → Vectorize cosine,
// `method:"semantic"`, floor 0.50) which understands meaning — so "my favorite
// model of car is fast" correctly returns notVerified. Falls back to keyword
// overlap (`method:"keyword"`, floor 0.30) when the AI/VECTORIZE bindings are
// absent or error, so /verify can never break. The envelope shape is identical
// either way; the `method` field tells the caller which path ran.

const MIN_CLAIM_LEN = 5;
const MAX_CLAIM_LEN = 1000;
const DEFAULT_MIN_CONFIDENCE = 0.85;
const DEFAULT_MIN_MATCH_SCORE = 0.3;
const SEMANTIC_MIN_SCORE = 0.5; // cosine-similarity floor (bge-m3) for a "verified" semantic match
const MAX_MATCHES_RETURNED = 5;
const MAX_FIELD_WEIGHT = 5; // highest single-field weight (subject) — matchScore denominator basis

// Common English function words. Filtered before matching so high-frequency
// filler words don't drive false matches — the failure mode that made unrelated
// queries score ~0.3 and the bestMatch gate never trip. Deliberately excludes
// AI-domain content words ("model", "data", "open", "fast"). (2026-05-29)
const STOPWORDS = new Set(
  "a about after all also am an and any are as at be because been before being between both but by came can come could did do does doing during each few for from get got had has have he her here him his how i if in into is it its just like made make many me more most my no nor not now of off on only or other our out over own said same she should so some such than that the their them then there these they this those through to too under until up very was we well were what when where which while who will with would you your".split(
    " ",
  ),
);

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

  // Prefer SEMANTIC ranking (Workers AI embed → Vectorize cosine) when the
  // bindings are present; fall back to keyword overlap otherwise AND on any
  // error, so /verify never breaks. Semantic understands meaning — it kills
  // the keyword false-positive class ("my favorite model of car is fast").
  let ranked;
  let method = "keyword";
  if (env.AI && env.VECTORIZE) {
    try {
      ranked = await rankSemantic(env, claim, candidates);
      method = "semantic";
    } catch {
      ranked = undefined; // fall through to keyword
    }
  }
  if (!ranked) ranked = rankCandidates(candidates, claim);

  const topN = ranked.slice(0, MAX_MATCHES_RETURNED);
  const minMatch = method === "semantic" ? SEMANTIC_MIN_SCORE : DEFAULT_MIN_MATCH_SCORE;

  const bestRaw = ranked[0];
  const bestMatch =
    bestRaw && bestRaw.matchScore >= minMatch && bestRaw.claim.confidence >= minConfidence
      ? toSummary(bestRaw.claim)
      : undefined;

  const responsePayload = {
    apiVersion: "v1",
    methodology: index.methodology,
    query: claim,
    minConfidence,
    method,
    // Honesty note: matchScore is semantic similarity, not an entailment/truth verdict.
    // A false query ("GPT-5 released in 2023") can still surface a topically-similar
    // real claim (GPT-4) at a high score — so consumers must compare, not trust the score.
    note:
      "matchScore is semantic similarity to your query (0-1), NOT a verdict that your query is true. Returned claims are the nearest VERIFIED catalog entries — compare each claim.statement to your input to ground your own assertion. A false query can still surface a topically-similar real claim at a high score.",
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

// Semantic ranking: embed the query (Workers AI · bge-m3) and ask Vectorize for
// the nearest claim vectors (cosine). Returns matches in the SAME shape as
// rankCandidates so the envelope logic is identical. Throws on any binding/embed
// failure so the caller falls back to keyword overlap — production never breaks.
async function rankSemantic(env, queryClaim, candidates) {
  const emb = await env.AI.run("@cf/baai/bge-m3", { text: [queryClaim] });
  const vec = emb && emb.data && emb.data[0];
  if (!Array.isArray(vec)) throw new Error("embed shape mismatch");
  const res = await env.VECTORIZE.query(vec, { topK: MAX_MATCHES_RETURNED });
  // Map id → full claim so we can hydrate (and honor any vertical pre-filter).
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const out = [];
  for (const m of res.matches || []) {
    const claim = byId.get(m.id);
    if (!claim) continue; // filtered out by vertical, or stale id in the index
    const score = clamp(m.score, 0, 1);
    out.push({
      claim,
      matchScore: score,
      rationale: `Semantic similarity ${round2(score)} (vector embedding match).`,
    });
  }
  // Vectorize returns matches sorted by score desc; keep that order.
  return out;
}

function rankCandidates(claims, queryClaim) {
  const queryTerms = tokenize(queryClaim);
  if (queryTerms.length === 0) return [];

  // Normalize so a query whose every term hits the strongest field (subject)
  // scores 1.0. Per-term we credit the BEST field it hits (not the sum across
  // all fields) — this measures coverage × field-quality, so a genuine match
  // (~0.7+) cleanly separates from incidental overlap (<0.2). The old formula
  // divided by query-length × sum-of-all-weights, which made score track query
  // length instead of match quality (correct match 0.32 vs nonsense 0.30).
  const denom = queryTerms.length * MAX_FIELD_WEIGHT;

  const out = [];
  for (const c of claims) {
    const fields = [
      { words: wordSet(c.subject), weight: 5 },
      { words: wordSet(c.object), weight: 3 },
      { words: wordSet(c.statement ?? ""), weight: 2 },
      { words: wordSet(c.predicate.replace(/_/g, " ")), weight: 2 },
      { words: wordSet((c.tags ?? []).join(" ")), weight: 3 },
    ];

    let raw = 0;
    const hits = [];
    for (const t of queryTerms) {
      // Credit only the strongest field a term hits — measures coverage ×
      // field-quality, not summed redundancy. Word-boundary match (with prefix
      // tolerance for plurals/tenses) so "rain" no longer matches "Pretraining".
      let best = 0;
      for (const { words, weight } of fields) {
        if (weight > best && wordHit(words, t)) best = weight;
      }
      if (best > 0) {
        raw += best;
        hits.push(t);
      }
    }

    if (raw === 0) continue;

    const matchScore = Math.min(1, raw / denom);
    const uniqueHits = Array.from(new Set(hits)).slice(0, 5);
    const rationale = `Keyword overlap on: ${uniqueHits.join(", ")}.`;
    out.push({ claim: c, matchScore, rationale });
  }
  out.sort((a, b) => b.matchScore - a.matchScore);
  return out;
}

// Split a field value into a set of lowercased words for boundary-aware matching.
function wordSet(value) {
  return new Set(
    String(value)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
      .split(/[\s.-]+/)
      .filter(Boolean),
  );
}

// A query term hits a field if it equals a word, or shares a ≥3-char prefix
// with one (model↔models, release↔released) — NOT if it's merely a substring
// inside a longer word ("rain" inside "pretraining").
function wordHit(words, term) {
  if (words.has(term)) return true;
  if (term.length < 3) return false;
  for (const w of words) {
    if (w.length >= 3 && (w.startsWith(term) || term.startsWith(w))) return true;
  }
  return false;
}

function tokenize(s) {
  return Array.from(
    new Set(
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s.-]/gu, " ")
        .split(/\s+/)
        .filter((t) => t.length >= 2 && !STOPWORDS.has(t)),
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
