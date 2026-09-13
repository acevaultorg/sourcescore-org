// CF Pages Function — VERITAS /api/v1/auth/signup (POST).
//
// The public API is currently unauthenticated, so it does not need accounts or
// keys. Higher-volume paid access is a demand test only: there is no checkout,
// billing, account creation, key provisioning, dashboard, or SLA. Keep this
// legacy endpoint as an explicit, truthful 503 instead of implying that setting
// an environment variable activates an unfinished commerce path.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed", allow: "POST" }, 405);
  }

  return json(
    {
      error: "Account signup is not available.",
      detail:
        "The free public API needs no account or key. Proposed higher-volume access is not for sale; use the API-access page to share demand without creating an account or payment commitment.",
      free_api_docs: "https://sourcescore.org/docs/#quick-start",
      higher_volume_interest: "https://sourcescore.org/api-access/",
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
