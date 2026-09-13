// Legacy Stripe webhook route. SourceScore has no live checkout, billing, or
// subscription product. It stays closed until a real, tested commerce system
// is deliberately shipped; environment variables alone must never activate a
// partial handler that acknowledges events without persisting them.

const CORS = {
  "Access-Control-Allow-Origin": "https://stripe.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Stripe-Signature, Content-Type",
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
      error: "Stripe billing is not available for SourceScore.",
      detail:
        "No checkout or subscription product is live, and this endpoint does not accept or acknowledge Stripe events.",
    },
    503,
  );
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
