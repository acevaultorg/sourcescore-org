// Global click listener that flags Clarity sessions for prioritized recording
// when the user clicks any element with a `data-clarity-upgrade` attribute.
// Pairs with Plausible's class-based event tagging without needing per-CTA
// JS handlers (preserves static-export compatibility).
//
// Usage in markup:
//   <a href="/x" data-clarity-upgrade="hero-subtool-click">...</a>
//
// On click, fires `clarity('upgrade', 'hero-subtool-click')` which guarantees
// the current session gets recorded even if the daily recording quota is
// exhausted. Use sparingly — operator-cost is no per-click overhead in
// Clarity, but flagging too many sessions burns the prioritized-recording
// budget.

"use client";

import { useEffect } from "react";
import { clarityUpgrade } from "@/lib/clarity";

export function ClarityClickListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const flagged = target.closest<HTMLElement>("[data-clarity-upgrade]");
      if (!flagged) return;
      const reason = flagged.dataset.clarityUpgrade;
      if (!reason) return;
      clarityUpgrade(reason);
      // GA4 mirror — the fleet metrics layer reads conversions from GA4 key
      // events, so the funnel stays measurable now that Plausible is retired.
      // CitationDesk CTA clicks (the site's one conversion action) fire the
      // stable event name `citationdesk_cta` with the placement as a param.
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof gtag === "function") {
        if (reason.startsWith("citationdesk-cta-")) {
          gtag("event", "citationdesk_cta", { source: reason.slice("citationdesk-cta-".length) });
        } else {
          gtag("event", "cta_click", { cta: reason });
        }
      }
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
