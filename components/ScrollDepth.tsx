"use client";

// Scroll-depth → Plausible custom events. Fires at 25/50/75/100% — the
// canonical pattern from rules/aceusergrowth.md v3 Part 14 (Engagement
// instrumentation). Once-per-threshold-per-pageview, deduped via a Set so
// rage-scrolling doesn't spam events.
//
// Pairs with WebVitals.tsx — same shape, same Plausible custom-event channel,
// closes the AAERA Engagement instrumentation gap. Total client overhead:
// one passive scroll listener + four boolean checks per scroll tick.

import { useEffect } from "react";

const THRESHOLDS = [25, 50, 75, 100] as const;

export function ScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      if (typeof window.plausible !== "function") return;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const viewHeight = window.innerHeight;
      const scrolled = window.scrollY + viewHeight;
      const pct = (scrolled / docHeight) * 100;
      for (const t of THRESHOLDS) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          window.plausible("scroll", { props: { depth: t } });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
