// Microsoft Clarity helper module — typed wrappers around window.clarity.
// All functions are no-ops in SSR + when Clarity isn't loaded (env-gated).
//
// Reference: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api
//
// Used for:
//   - clarityTag(name, value)     — segment sessions by archetype, grade, etc.
//                                    Surfaces in Clarity dashboard filter UI.
//   - clarityUpgrade(reason)      — flag this session for prioritized recording
//                                    (ensures high-intent sessions get captured
//                                     even when daily recording quota is hit).
//   - clarityEvent(name)          — fire a custom event name into the session
//                                    timeline. Pairs nicely with Plausible
//                                    custom events for cross-tool funnels.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    clarity?: (
      action: "set" | "upgrade" | "event" | "identify" | "consent" | "stop",
      ...args: any[]
    ) => void;
  }
}

const isReady = (): boolean =>
  typeof window !== "undefined" && typeof window.clarity === "function";

/**
 * Set a custom tag for the current session. Tags surface in the Clarity
 * dashboard filter UI — operators can filter heatmaps + recordings by
 * tag value. Common patterns: `archetype` (page type), `grade` (A+/A/B/etc),
 * `category` (source vertical).
 *
 * Multi-value tags work — call multiple times with the same `name` and
 * different `value`s; Clarity stores them as a list.
 */
export function clarityTag(name: string, value: string): void {
  if (!isReady()) return;
  window.clarity!("set", name, value);
}

/**
 * Flag the current session for prioritized recording. Use on high-intent
 * moments (CTA clicks, conversion events) so those sessions are guaranteed
 * recorded even when daily recording quota is hit.
 *
 * Reason string is free-form; it appears in the Clarity dashboard alongside
 * the recording. Keep it short + descriptive (e.g. "hero-subtool-click",
 * "top5-leaderboard-click", "methodology-page-cta").
 */
export function clarityUpgrade(reason: string): void {
  if (!isReady()) return;
  window.clarity!("upgrade", reason);
}

/**
 * Fire a custom event into the session timeline. Distinct from `clarityTag`:
 * tags are session-level metadata, events are time-series points within a
 * session. Use events for actions ("clicked-share", "scroll-to-bottom"),
 * use tags for context ("archetype=source-detail", "grade=A+").
 */
export function clarityEvent(name: string): void {
  if (!isReady()) return;
  window.clarity!("event", name);
}
