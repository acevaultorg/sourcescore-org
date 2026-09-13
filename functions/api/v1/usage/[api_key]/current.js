// Legacy per-key usage route. The public API has no user accounts, issued keys,
// paid plans, metered billing, or usage dashboard, so this endpoint stays
// explicitly unavailable regardless of environment configuration.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== "GET") {
    return json({ error: "Method Not Allowed", allow: "GET" }, 405);
  }

  return json(
    {
      error: "Per-key usage is not available.",
      detail:
        "The public API needs no account or key. SourceScore has no live paid plan, metered billing, or usage dashboard.",
      docs: "https://sourcescore.org/docs/",
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
