// Microsoft Clarity — heatmaps + session recordings (free, privacy-first
// when configured correctly). Per rules/aceusergrowth.md v3 Part 14, this
// is layer 6 of the canonical 7-layer Day-1 analytics stack: synthetic
// pageview metrics (Plausible + GA) tell you WHAT users do; Clarity tells
// you WHY (rage clicks, dead clicks, scroll-and-leave, session replays).
//
// Project ID is account-specific so this stays env-gated (same shape as
// CF Web Analytics token, intentionally NOT defaulted like Plausible was).
//
// Privacy: in Clarity project settings, set Cookies = Disabled. That puts
// Clarity in fingerprinting-free mode — GDPR-compliant without a consent
// banner. With cookies enabled, Clarity uses first-party cookies and
// requires explicit user consent under EU/UK/CA privacy law.

"use client";

import Script from "next/script";

// Hardcoded fallback to canonical sourcescore.org Clarity project (wk6sqdp5vn).
// Project ID is a public client-side identifier (visible in rendered HTML),
// safe to commit. Env var override allowed for fork/staging deploys.
// Set 2026-05-08 after env-var-only wiring through GitLab CI Variables +
// .next/cache bust still failed to bake the value into static export.
const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wk6sqdp5vn";

export function Clarity() {
  if (!CLARITY_PROJECT_ID) return null;
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}
