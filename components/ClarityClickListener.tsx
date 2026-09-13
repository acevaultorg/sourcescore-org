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
      // Analytics.tsx owns GA4 + Clarity custom events via `data-event`.
      // Keeping this listener upgrade-only prevents CitationDesk and other
      // CTA clicks from being counted twice in GA4.
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
