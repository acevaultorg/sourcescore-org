// Privacy-first analytics scaffold — Plausible (primary) + CF Web Analytics
// (passive). Both are env-gated so non-deploy builds + dev sessions don't
// leak events. Ships Day 1 per the Day-1 Analytics Mandate (rules/aceusergrowth
// v3 Part 14) so no future ship has to backfill.
//
// To activate:
//   - Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN=sourcescore.org in deploy env
//   - Set NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN=<token> for CF Web Analytics
// If unset, the scripts no-op cleanly.

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const CF_TOKEN = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN;

export function Analytics() {
  return (
    <>
      {PLAUSIBLE_DOMAIN ? (
        <script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.outbound-links.tagged-events.js"
        />
      ) : null}
      {CF_TOKEN ? (
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={`{"token":"${CF_TOKEN}"}`}
        />
      ) : null}
    </>
  );
}
