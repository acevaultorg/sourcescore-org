// CF Pages Function — /api/v1/usage/{api_key}/current (GET).
//
// Returns month-to-date usage for the requesting API key. Day 1 stub;
// activates when DATABASE_URL is set.
//
// Day 8+ flow:
//   1. SHA-256(path_param) → key_hash
//   2. SELECT api_key + user from Postgres WHERE key_hash = $1 AND revoked_at IS NULL
//   3. SELECT COUNT(*) FROM usage_events WHERE api_key_id = $api_key.id
//      AND occurred_at >= date_trunc('month', now())
//   4. Compare against tier's includedClaims
//   5. Return { tier, includedClaims, mtdClaims, projectedOverageEur, ... }
//
// Auth: API key in URL path (allows public dashboard widgets to embed
// usage charts without exposing Authorization header to client JS). The
// key is treated as a bearer-equivalent secret; if exposed, can be
// rotated via /api/v1/auth/key/rotate.
//
// Rate limit: lower than the main read endpoints (10 req/min per key) — this
// is a stats endpoint, not a hot path. Enforcement Day 8+.
//
// Tier table is fetched at runtime from /api/v1/methodology.json rather than
// imported here — avoids bundling TypeScript module across the CF Functions
// build boundary. The tier table changes infrequently; CDN caches it for 5min.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export async function onRequest(context) {
  const { request, env, params } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== "GET") {
    return json({ error: "Method Not Allowed", allow: "GET" }, 405);
  }

  const apiKey = params?.api_key;
  if (typeof apiKey !== "string" || !apiKey.startsWith("sk_")) {
    return json(
      { error: "Invalid API key format. Expected sk_live_... or sk_test_..." },
      400,
    );
  }

  if (!env.DATABASE_URL) {
    return json(
      {
        error: "Usage endpoint not yet provisioned.",
        detail:
          "Per-key usage tracking requires DATABASE_URL to be set in CF Pages env. Free-tier evaluation has no per-key tracking (you don't have a key yet).",
        operator_action: "Provision Postgres + run scripts/migrations/001_init.sql.",
      },
      503,
    );
  }

  // Day 8+ Postgres path (stub):
  //   const db = sql(env.DATABASE_URL);
  //   const keyHash = await sha256Hex(apiKey);
  //   const keyRow = await db`
  //     SELECT ak.id AS api_key_id, ak.user_id, ak.key_prefix, ak.last_used_at,
  //            u.plan_tier
  //       FROM api_keys ak
  //       JOIN users u ON u.id = ak.user_id
  //      WHERE ak.key_hash = ${keyHash}
  //        AND ak.revoked_at IS NULL
  //   `.first();
  //   if (!keyRow) return json({ error: 'API key not found or revoked' }, 401);
  //
  //   const tierDef = TIERS.find(t => t.name === keyRow.plan_tier);
  //   const mtdCount = await db`
  //     SELECT COUNT(*) AS n
  //       FROM usage_events
  //      WHERE user_id = ${keyRow.user_id}
  //        AND occurred_at >= date_trunc('month', now())
  //   `.first().n;
  //
  //   const overage = Math.max(0, mtdCount - tierDef.includedClaims);
  //   const projectedOverageEur = overage * tierDef.overageEurPerClaim;
  //
  //   return json({
  //     tier: tierDef.name,
  //     includedClaims: tierDef.includedClaims,
  //     mtdClaims: mtdCount,
  //     remaining: Math.max(0, tierDef.includedClaims - mtdCount),
  //     projectedOverageEur,
  //     monthStart: new Date(new Date().setUTCDate(1)).toISOString(),
  //     lastUsedAt: keyRow.last_used_at,
  //     keyPrefix: keyRow.key_prefix,
  //   });

  return json(
    {
      error: "Usage handler stub — Postgres lookup not yet wired in v0.",
      detail:
        "DATABASE_URL is set; full per-key MTD aggregation ships when Day 8+ auth + usage logging lands.",
    },
    503,
  );
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS,
      "Cache-Control": "no-store",
    },
  });
}
