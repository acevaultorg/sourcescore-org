// Microsoft Clarity — heatmaps + session recordings (free, privacy-first
// when configured correctly). Per rules/aceusergrowth.md v3 Part 14, this
// is layer 6 of the canonical 7-layer Day-1 analytics stack: synthetic
// pageview metrics (Plausible + GA) tell you WHAT users do; Clarity tells
// you WHY (rage clicks, dead clicks, scroll-and-leave, session replays).
//
// Renders as a plain inline <script> element so the snippet appears in
// the initial static HTML (not deferred via next/script client hydration).
// Required for HTML-only analytics audits (fleet-health dashboards that
// fetch + parse HTML without executing JS) and crawlers that don't run JS.
// Earlier `next/script strategy="afterInteractive"` version baked the
// snippet into the JS bundle but left initial HTML signal-free.
//
// Project ID is a public identifier (visible in rendered HTML), safe to
// commit as fallback. Env var override allowed for fork/staging deploys.
//
// Privacy: in Clarity project settings, set Cookies = Disabled. That puts
// Clarity in fingerprinting-free mode — GDPR-compliant without a consent
// banner. With cookies enabled, Clarity uses first-party cookies and
// requires explicit user consent under EU/UK/CA privacy law.

const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wk6sqdp5vn";

export function Clarity() {
  if (!CLARITY_PROJECT_ID) return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        // Guarded by the fleet-agent gate in app/layout.tsx, which runs immediately
        // before this. Clarity has no documented runtime opt-out the way GA4 has
        // ga-disable-<ID>, so the only way to stop it recording an agent session is
        // to never inject the tag at all.
        __html: `if(!window.__FLEET_AGENT__){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");}`,
      }}
    />
  );
}
