// CF Pages Function — VERITAS-Reborn /api/v1/auth/signup (POST).
//
// Day 1 graceful stub. Activates when DATABASE_URL + STRIPE_SECRET_KEY +
// STRIPE_PRICE_INDIE_BASE (etc.) are set in CF Pages env. Until then,
// returns 503 with operator-action hint so calling clients (signup page +
// SDK) display "Coming soon" cleanly rather than crashing.
//
// Day 8+ wired flow:
//   Request body: { email, tier: 'free' | 'indie' | 'startup' | 'scale' }
//   1. Validate email format + tier
//   2. If tier == 'free': create user in Postgres + issue API key + return key
//   3. If tier != 'free': create Stripe Customer + Stripe Checkout Session for
//      tier's base price + metered overage price; return checkoutUrl. Webhook
//      then provisions user + key when Stripe confirms payment.
//   Response: { apiKey, user: { id, email, tier }, checkoutUrl? }
//
// API key format: sk_live_<base64url(32 bytes)> ~ 43 chars. Server stores
// SHA-256(key) only; plaintext returned once at signup, never re-fetched.
//
// CORS: permissive POST + OPTIONS. Origin = sourcescore.org by default; SDK
// calls from any origin work (free tier evaluation is public).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const VALID_TIERS = new Set(["free", "indie", "startup", "scale"]);

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed", allow: "POST" }, 405);
  }

  // Day 1 gate: stub until operator provisions Postgres + Stripe.
  if (!env.DATABASE_URL) {
    return json(
      {
        error: "Signup not yet provisioned.",
        detail:
          "Free tier needs no auth — call /api/v1/* directly. For paid tiers, email contact@acevault.org for early-access invoice (manual key issuance, <24h).",
        free_tier_path: "https://sourcescore.org/docs/#quick-start",
        paid_early_access:
          "mailto:contact@acevault.org?subject=Early-access%20signup",
        operator_action: "Provision Postgres + Stripe per /docs/#auth roadmap.",
      },
      503,
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be JSON." }, 400);
  }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const tier = typeof body?.tier === "string" ? body.tier.toLowerCase() : "free";

  if (!isValidEmail(email)) {
    return json({ error: "Invalid email format." }, 400);
  }
  if (!VALID_TIERS.has(tier)) {
    return json({ error: `Invalid tier; must be one of: ${[...VALID_TIERS].join(", ")}` }, 400);
  }

  // ── Day 8+ Postgres path (skeleton) ──────────────────────────────────────
  // The actual SQL implementation (using @neondatabase/serverless or pg
  // over HTTP through Cloudflare Hyperdrive) lands when env vars are set.
  //
  // Pseudo-code:
  //   const db = sql(env.DATABASE_URL);
  //   const userRow = await db`
  //     INSERT INTO users (email, plan_tier)
  //     VALUES (${email}, ${tier})
  //     ON CONFLICT (email) DO UPDATE SET plan_tier = EXCLUDED.plan_tier
  //     RETURNING id, email, plan_tier, created_at
  //   `;
  //   const apiKey = `sk_live_${b64url(crypto.getRandomValues(new Uint8Array(32)))}`;
  //   const keyHash = await sha256Hex(apiKey);
  //   await db`
  //     INSERT INTO api_keys (user_id, key_hash, key_prefix, label)
  //     VALUES (${userRow.id}, ${keyHash}, ${apiKey.slice(0, 12)}, 'signup-default')
  //   `;
  //
  //   if (tier === 'free') {
  //     return json({ apiKey, user: userRow });
  //   }
  //
  //   // Paid tier: create Stripe Checkout Session
  //   const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  //   const session = await stripe.checkout.sessions.create({
  //     customer_email: email,
  //     line_items: [
  //       { price: env[`STRIPE_PRICE_${tier.toUpperCase()}_BASE`], quantity: 1 },
  //       { price: env[`STRIPE_PRICE_${tier.toUpperCase()}_METERED`] },
  //     ],
  //     mode: 'subscription',
  //     success_url: 'https://sourcescore.org/dashboard/?welcome=1',
  //     cancel_url: 'https://sourcescore.org/pricing/',
  //     metadata: { user_id: userRow.id, tier },
  //   });
  //   return json({ user: userRow, checkoutUrl: session.url });

  return json(
    {
      error: "Signup handler stub — Postgres path not yet wired in v0.",
      detail:
        "DATABASE_URL is set, but the full INSERT + Stripe Checkout integration ships when SDK + dashboard + webhook handler land together (Day 8+). For now, email contact@acevault.org.",
    },
    503,
  );
}

// ── helpers ────────────────────────────────────────────────────────────────

function isValidEmail(s) {
  // Lightweight RFC 5322-lite. Server-side validation is friendly; Stripe
  // validates strictly during checkout, so we don't over-engineer here.
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(s) && s.length <= 254;
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
