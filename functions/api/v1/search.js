// CF Pages Function — VERITAS-Reborn /api/v1/search?q=<query>
//
// Free, no-auth, public-read. Returns ClaimSummary[] matching the query.
//
// v0 implementation: keyword-overlap scoring across
// (subject, predicate, object, statement, tags). The full index lives at
// /claims-index.json (emitted by scripts/generate-claims-json.ts). We fetch
// it via env.ASSETS — Pages caches it after first load.
//
// Day 30+ migration: replace keyword scoring with sentence-transformer
// embeddings + vector store (Vectorize on CF). For 26 claims at v0, keyword
// is plenty.
//
// CORS: permissive (Access-Control-Allow-Origin: *) — public-read endpoint,
// no credentials. Developers call from browsers + servers + LLM agents alike.
//
// Rate limit: relies on CF network-level DDoS + future per-API-key tier
// limits (Day 8+ when Postgres lands).

const MAX_RESULTS = 50;
const MIN_QUERY_LEN = 2;
const MAX_QUERY_LEN = 500;

// Common English function words filtered before matching so high-frequency
// words don't inflate relevance scores. Mirrors functions/api/v1/verify.js.
const STOPWORDS = new Set(
  "a about after all also am an and any are as at be because been before being between both but by came can come could did do does doing during each few for from get got had has have he her here him his how i if in into is it its just like made make many me more most my no nor not now of off on only or other our out over own said same she should so some such than that the their them then there these they this those through to too under until up very was we well were what when where which while who will with would you your".split(
    " ",
  ),
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Max-Age": "86400",
};

const CACHE_HEADERS = {
  // CF edge caches for 5 min; browsers cache for 1 min. Search index doesn't
  // change between deploys, so this is safe.
  "Cache-Control": "public, max-age=60, s-maxage=300",
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== "GET") {
    return json({ error: "Method Not Allowed", allow: "GET" }, 405);
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  if (q.length < MIN_QUERY_LEN) {
    return json(
      {
        error: "Query parameter `q` is required and must be at least 2 characters.",
        example: `${url.origin}/api/v1/search?q=llama`,
      },
      400,
    );
  }
  if (q.length > MAX_QUERY_LEN) {
    return json({ error: `Query too long; max ${MAX_QUERY_LEN} chars.` }, 400);
  }

  const limit = clamp(parseInt(url.searchParams.get("limit") ?? "20", 10), 1, MAX_RESULTS);

  let index;
  try {
    index = await loadIndex(env, url);
  } catch (err) {
    return json({ error: "Catalog index unavailable.", detail: String(err) }, 503);
  }

  const results = rankClaims(index.claims, q).slice(0, limit);

  return json(
    {
      apiVersion: "v1",
      methodology: index.methodology,
      query: q,
      count: results.length,
      results: results.map((c) => ({
        id: c.id,
        vertical: c.vertical,
        subject: c.subject,
        predicate: c.predicate,
        object: c.object,
        statement: c.statement,
        confidence: c.confidence,
        signatureShort: c.signatureShort,
        detailUrl: c.detailUrl,
      })),
    },
    200,
  );
}

// ── helpers ────────────────────────────────────────────────────────────────

async function loadIndex(env, requestUrl) {
  // CF Pages exposes built site assets via env.ASSETS.
  const indexUrl = new URL("/claims-index.json", requestUrl);
  const res = await env.ASSETS.fetch(indexUrl);
  if (!res.ok) {
    throw new Error(`asset fetch ${indexUrl.pathname} → ${res.status}`);
  }
  return res.json();
}

function rankClaims(claims, query) {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const scored = [];
  for (const c of claims) {
    const score = scoreClaim(c, terms);
    if (score > 0) scored.push({ claim: c, score });
  }
  scored.sort((a, b) => b.score - a.score || a.claim.subject.localeCompare(b.claim.subject));
  return scored.map((s) => s.claim);
}

function scoreClaim(claim, terms) {
  // Weighted keyword overlap. Subject + tags are higher-signal than predicate.
  const fields = [
    { value: claim.subject, weight: 5 },
    { value: claim.object, weight: 3 },
    { value: claim.statement ?? "", weight: 2 },
    { value: claim.predicate.replace(/_/g, " "), weight: 2 },
    { value: (claim.tags ?? []).join(" "), weight: 3 },
  ];

  let score = 0;
  for (const { value, weight } of fields) {
    const haystack = value.toLowerCase();
    for (const t of terms) {
      if (haystack.includes(t)) score += weight;
    }
  }

  // Slight boost for higher-confidence claims so ties break toward stronger evidence.
  return score * (0.5 + 0.5 * claim.confidence);
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

function clamp(n, lo, hi) {
  return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : lo;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS,
      ...(status === 200 ? CACHE_HEADERS : {}),
    },
  });
}
