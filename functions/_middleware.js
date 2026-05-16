// CF Pages Function — TollBit bot forwarding + analytics log streaming
//
// Two concerns in one function:
//   1. Bot paywall: AI bot User-Agents get 307'd to tollbit.sourcescore.org
//      (TollBit-managed paywall subdomain, NS-delegated 2026-05-15).
//   2. Analytics: every non-skipped request streams a log line to TollBit
//      at https://log.tollbit.com/log so the dashboard at
//      https://app.tollbit.com/property/qnts1sjwvy7gdkif5ctnv6ix can show
//      bot traffic + geo + UA breakdown.
//
// Mirrors txtfeed's bot forwarding (Vercel TollBit integration) — but as a
// CF Pages Function since sourcescore is on Cloudflare Pages, not Vercel.
//
// Integrated approach: TollBit's documented setup creates a separate
// CloudFlare Worker on top of an existing Worker. Since this Pages Function
// already intercepts every request, the documented "integrate this logging
// code with that worker" path applies — logging joins the existing function
// rather than running as a sibling Worker Route (which would conflict with
// Pages routing).
//
// TollBit licenses active 2026-05-15:
//   - Summarization: $0.01 per 1,000 pages ($0.00001/scrape)
//   - Full Display:  $0.05 per 1,000 pages ($0.00005/scrape)
//
// Property ID: qnts1sjwvy7gdkif5ctnv6ix
// Dashboard:   https://app.tollbit.com/property/qnts1sjwvy7gdkif5ctnv6ix
//
// Env required for log streaming: TOLLBIT_LOG_TOKEN (CF Pages → Settings →
// Environment variables, Production scope, mark Encrypted). Without the
// token the paywall still works; only the analytics layer is dark.

const AI_BOT_REGEX = /\b(GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|CCBot|Amazonbot|Bytespider|Meta-ExternalAgent|meta-webindexer|meta-externalagent|Anthropic-AI|cohere-ai|Diffbot|FacebookBot|Omgilibot|YouBot)\b/i;

const SKIP_EXTENSIONS = /\.(css|js|mjs|json|xml|txt|map|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|pdf)$/i;

const SKIP_PATHS = [
  '/_next/',
  '/_static/',
  '/api/',
  '/favicon',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-ai.xml',
  '/llms.txt',
  '/ads.txt',
  '/feed.xml',
  '/.well-known/',
  // ── VERITAS product surface ──────────────────────────────────────────
  // AI bots must reach these freely so the LLM-citation strategy compounds
  // (per rules/aceusergrowth.md Part 23 + Aleyda Solis 10-characteristic
  // checklist: Accessible · Extractable · Recognizable · Credible). The
  // dev-API product is monetized via Stripe metered billing (€19/€99/€499
  // tiers), not via TollBit pay-per-crawl. Paywalling these surfaces would
  // gate the entire VERITAS revenue trajectory for marginal TollBit upside.
  '/claims/',
  '/blog/',
  '/embed/',
  '/docs/',
  '/pricing/',
  '/signup/',
  '/dashboard/',
  '/about/',
  '/methodology/',
  // The og/ directory serves visual share previews for both products —
  // bots that follow OG images (Twitter/LinkedIn/Slack previews) should
  // get them, not a paywall page.
  '/og/',
];

const TOLLBIT_LOG_ENDPOINT = 'https://log.tollbit.com/log';

function buildLogMessage(request, response) {
  const cf = request.cf || {};
  const url = new URL(request.url);
  return {
    timestamp: new Date().toISOString(),
    ip_address: request.headers.get('cf-connecting-ip'),
    geo_country: cf.country,
    geo_city: cf.city,
    geo_postal_code: cf.postalCode,
    geo_latitude: cf.latitude,
    geo_longitude: cf.longitude,
    host: request.headers.get('host'),
    url: url.pathname + url.search,
    request_method: request.method,
    request_protocol: cf.httpProtocol,
    request_user_agent: request.headers.get('user-agent'),
    request_latency: null,
    request_referer: request.headers.get('referer'),
    response_state: null,
    response_status: response.status,
    response_reason: response.statusText,
    response_body_size: response.headers.get('content-length'),
  };
}

async function shipLog(token, body) {
  try {
    await fetch(TOLLBIT_LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        TollbitKey: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Best-effort — never let log shipping break the user-facing request.
  }
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const ua = request.headers.get('User-Agent') || '';

  if (SKIP_EXTENSIONS.test(url.pathname)) {
    return next();
  }
  if (SKIP_PATHS.some((p) => url.pathname.startsWith(p))) {
    return next();
  }

  // Compute the response: bots get a 307 to the paywall, humans pass through.
  let response;
  if (AI_BOT_REGEX.test(ua)) {
    const target = `https://tollbit.sourcescore.org${url.pathname}${url.search}`;
    response = new Response(null, {
      status: 307,
      headers: {
        Location: target,
        'Cache-Control': 'no-store',
        'X-TollBit-Forward': 'sourcescore',
      },
    });
  } else {
    response = await next();
  }

  // Stream log to TollBit (non-blocking, best-effort).
  // No-op when env var unset — paywall stays functional even without analytics.
  const token = env && env.TOLLBIT_LOG_TOKEN;
  if (token) {
    const log = buildLogMessage(request, response);
    context.waitUntil(shipLog(token, log));
  }

  return response;
}
