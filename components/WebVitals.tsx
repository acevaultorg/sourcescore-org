"use client";

// Real-user Core Web Vitals → Plausible custom events. Gives AAERA Performance
// instrumentation (per rules/aceusergrowth.md v3 Part 21) without requiring an
// account-specific Cloudflare Web Analytics token. Numbers are rounded to keep
// Plausible cardinality low; ratings are Google's "good"/"needs-improvement"/
// "poor" thresholds. Fires only when window.plausible exists (i.e. the
// Plausible script loaded), so no errors when analytics is disabled.

import { useEffect } from "react";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

export function WebVitals() {
  useEffect(() => {
    let cancelled = false;
    void import("web-vitals").then(({ onCLS, onINP, onLCP, onTTFB, onFCP }) => {
      if (cancelled) return;
      const send = (event: string) => (m: { value: number; rating: string }) => {
        if (typeof window.plausible !== "function") return;
        // CLS is fractional; multiply by 1000 to keep integer cardinality.
        const value = event === "cls" ? Math.round(m.value * 1000) : Math.round(m.value);
        window.plausible(event, { props: { value, rating: m.rating } });
      };
      onLCP(send("lcp"));
      onINP(send("inp"));
      onCLS(send("cls"));
      onTTFB(send("ttfb"));
      onFCP(send("fcp"));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
