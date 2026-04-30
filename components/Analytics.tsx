// Privacy-first analytics scaffold — Plausible (primary) + CF Web Analytics
// (passive). Plausible defaults to the production domain so the script ships
// even when build env vars are missing in Cloudflare Pages (the failure mode
// observed 2026-04-30 — env unset, script omitted, Plausible verification
// failed). CF Web Analytics stays env-gated because its token is account-
// specific and has no safe fallback.
//
// Plausible's script ignores localhost by default, so dev sessions don't
// leak events even with the domain hardcoded.
//
// To override:
//   - Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN=<other> for a non-prod domain
//   - Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN=  (empty) to disable entirely
//   - Set NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN=<token> to enable CF Web

const PLAUSIBLE_DOMAIN =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "sourcescore.org";
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
