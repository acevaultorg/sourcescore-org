// CF Pages Function — TollBit bot forwarding for sourcescore.org
//
// Intercepts AI bot User-Agents and 307s them to tollbit.sourcescore.org
// (TollBit-managed paywall subdomain provisioned via NS delegation 2026-05-15).
//
// Mirrors txtfeed's bot forwarding (Vercel TollBit integration) — but as a
// CF Pages Function since sourcescore is on Cloudflare Pages, not Vercel.
//
// TollBit licenses active 2026-05-15:
//   - Summarization: $0.01 per 1,000 pages ($0.00001/scrape)
//   - Full Display:  $0.05 per 1,000 pages ($0.00005/scrape)
//
// Property ID: qnts1sjwvy7gdkif5ctnv6ix
// Dashboard:   https://app.tollbit.com/property/qnts1sjwvy7gdkif5ctnv6ix
//
// Price-elasticity experiment: low rates test whether TollBit marketplace
// adoption is rate-sensitive (per fleet/LEARNED.md 2026-05-15 L12).

const AI_BOT_REGEX = /\b(GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|CCBot|Amazonbot|Bytespider|Meta-ExternalAgent|meta-webindexer|meta-externalagent|Anthropic-AI|cohere-ai|Diffbot|FacebookBot|Omgilibot|YouBot)\b/i;

const SKIP_EXTENSIONS = /\.(css|js|mjs|json|xml|txt|map|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf|eot|mp4|webm|mp3|wav|pdf)$/i;

const SKIP_PATHS = [
  '/_next/',
  '/_static/',
  '/api/',
  '/favicon',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/ads.txt',
  '/.well-known/',
];

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const ua = request.headers.get('User-Agent') || '';

  if (SKIP_EXTENSIONS.test(url.pathname)) {
    return next();
  }
  if (SKIP_PATHS.some((p) => url.pathname.startsWith(p))) {
    return next();
  }

  if (AI_BOT_REGEX.test(ua)) {
    const target = `https://tollbit.sourcescore.org${url.pathname}${url.search}`;
    return new Response(null, {
      status: 307,
      headers: {
        Location: target,
        'Cache-Control': 'no-store',
        'X-TollBit-Forward': 'sourcescore',
      },
    });
  }

  return next();
}
