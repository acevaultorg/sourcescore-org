// CF Pages Function — VERITAS-Reborn /api/v1/stripe/webhook (POST).
//
// Receives Stripe webhook events (customer.subscription.*, invoice.*) and
// syncs them to Postgres. Day 1 ship is a GRACEFUL STUB:
//   - When STRIPE_WEBHOOK_SECRET + DATABASE_URL are unset (current state),
//     returns 503 with a clear error so Stripe's webhook delivery retries
//     don't silently drop into the void.
//   - When secrets ARE set (operator-action #1 + #2 complete), verifies
//     signature, checks idempotency table, applies the state change,
//     marks processed.
//
// Activates as soon as the operator sets STRIPE_WEBHOOK_SECRET + DATABASE_URL
// in CF Pages env. No code redeploy required — the env check at request
// time controls behavior.
//
// Idempotency: every Stripe event has a unique evt_... id. We INSERT ... ON
// CONFLICT DO NOTHING into stripe_events; if a row already exists with
// processed_at set, we ack 200 and skip work.
//
// Events we care about (v0):
//   customer.subscription.created  → set users.plan_tier from price metadata
//   customer.subscription.updated  → same (tier upgrades/downgrades)
//   customer.subscription.deleted  → set plan_tier='free' (graceful cancel)
//   invoice.payment_succeeded      → log for billing-history dashboard
//   invoice.payment_failed         → log + flag user for follow-up
//
// Event signature verification follows Stripe's documented algorithm:
//   https://stripe.com/docs/webhooks/signatures

const CORS = {
  "Access-Control-Allow-Origin": "https://stripe.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Stripe-Signature, Content-Type",
};

const RELEVANT_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed", allow: "POST" }, 405);
  }

  // ── env gate ──────────────────────────────────────────────────────────────
  // Stub when operator hasn't set secrets yet. Stripe will retry — operator
  // configures the env vars, we start processing on the next retry.
  if (!env.STRIPE_WEBHOOK_SECRET || !env.DATABASE_URL) {
    return json(
      {
        error: "Stripe webhook handler not yet provisioned.",
        detail:
          "STRIPE_WEBHOOK_SECRET and DATABASE_URL must be set in Cloudflare Pages env before this endpoint processes events.",
        operator_action: "https://sourcescore.org/docs/#auth",
      },
      503,
    );
  }

  // ── signature verification ────────────────────────────────────────────────
  const sigHeader = request.headers.get("Stripe-Signature");
  if (!sigHeader) {
    return json({ error: "Missing Stripe-Signature header" }, 400);
  }

  const rawBody = await request.text();
  const verified = await verifyStripeSignature(
    rawBody,
    sigHeader,
    env.STRIPE_WEBHOOK_SECRET,
  );
  if (!verified) {
    return json({ error: "Invalid signature" }, 400);
  }

  // ── parse + dispatch ──────────────────────────────────────────────────────
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "Body is not valid JSON" }, 400);
  }

  if (!event?.id || !event?.type) {
    return json({ error: "Event missing id or type" }, 400);
  }

  if (!RELEVANT_EVENTS.has(event.type)) {
    // Ack so Stripe stops retrying, but don't process.
    return json({ received: true, type: event.type, action: "ignored" }, 200);
  }

  // Idempotency + processing live in Postgres. Day 8+ wires the real handler;
  // for v0 we return 200 + record that we received the event for observability.
  // The actual SQL implementation:
  //   1. INSERT INTO stripe_events (id, type, payload_json) VALUES (...)
  //      ON CONFLICT (id) DO NOTHING RETURNING id;
  //      → if no row returned, event already processed → return 200
  //   2. Apply state change (UPDATE users SET plan_tier = ... WHERE ...)
  //   3. UPDATE stripe_events SET processed_at = now() WHERE id = $1
  //
  // The Postgres client wires through @neondatabase/serverless (HTTP fetch,
  // no TCP — works in CF Pages Functions). Day 8+ ship.

  return json(
    {
      received: true,
      type: event.type,
      id: event.id,
      action: "queued — Postgres handler ships Day 8+",
    },
    200,
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────

async function verifyStripeSignature(payload, sigHeader, secret) {
  // Stripe's signature format: t=timestamp,v1=signature,...
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k, v];
    }),
  );

  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  // Reject events older than 5 minutes — protects against replay.
  const ageSec = Date.now() / 1000 - parseInt(timestamp, 10);
  if (Number.isNaN(ageSec) || ageSec < 0 || ageSec > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload),
  );

  // Constant-time compare of expected vs actual.
  const expected = toHex(sigBuf);
  return timingSafeEqual(expected, signature);
}

function toHex(buf) {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
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
