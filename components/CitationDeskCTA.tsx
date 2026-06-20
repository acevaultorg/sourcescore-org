// Cross-property funnel CTA → CitationDesk (the operator's AI-visibility SaaS).
//
// Per the 2026-06-19 strategic decision (TaskPrio mqkx5yh8q913j0): SourceScore
// is the FREE authority/citation top-of-funnel for CitationDesk. The honest
// bridge: a SourceScore visitor checks how citable OTHER sources are → CitationDesk
// shows how citable THEIR OWN site/brand is to ChatGPT, Claude, Perplexity & Gemini
// (free AI Visibility Score). Minimal, honest, no dark patterns, no interstitials.
//
// CitationDesk is an OWNED sister property, not an affiliate → a normal external
// link (passes authority; no rel=sponsored). target=_blank + rel=noopener keeps the
// SourceScore session alive and passes the referrer for funnel attribution.
//
// Click tracking mirrors the fleet's dual pattern already used across the site:
// data-clarity-upgrade (Clarity — the live fleet analytics; ClarityClickListener
// fires the custom event) + a Plausible event class. So the funnel is measurable.
//
// One component, SourceScore brand design tokens. The site is forced dark
// (`<html class="dark">` in app/layout.tsx), so these render consistently on the
// brand-token pages (home, methodology) AND the zinc reader-mode pages (claim,
// playground). Pure presentational (no client hooks) → safe to import into both
// server components and the client Playground. Copy-owned per
// cross-project-learning L4 — no runtime coupling to CitationDesk, just a link.

const CITATIONDESK_TOOL = "https://citationdesk.com/tools/citation-readiness/";

type Props = {
  /** "panel" = full card (home, methodology). "strip" = slim inline (claim footer, verify result). */
  variant?: "panel" | "strip";
  /** Funnel-source label for analytics (e.g. "home", "claim", "playground", "methodology"). */
  source?: string;
};

export function CitationDeskCTA({ variant = "panel", source = "generic" }: Props) {
  const track = `plausible-event-name=citationdesk_cta plausible-event-source=${source}`;

  if (variant === "strip") {
    return (
      <a
        href={CITATIONDESK_TOOL}
        target="_blank"
        rel="noopener"
        data-clarity-upgrade={`citationdesk-cta-${source}`}
        className={`group block rounded-card border border-brand/30 bg-surface-brand hover:bg-brand/10 hover:border-brand/50 transition-colors p-4 ${track}`}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 px-2 py-0.5 rounded-pill bg-brand/15 text-brand text-caption font-mono uppercase tracking-wide whitespace-nowrap shrink-0">
            Sister tool
          </span>
          <span className="text-body-sm leading-snug">
            <strong className="text-text">Is your own site getting cited by AI?</strong>{" "}
            <span className="text-muted">
              CitationDesk shows how visible you are to ChatGPT, Claude, Perplexity &amp; Gemini —{" "}
            </span>
            <span className="text-brand font-semibold whitespace-nowrap group-hover:underline">
              get your free AI Visibility Score &rarr;
            </span>
          </span>
        </div>
      </a>
    );
  }

  // panel (default)
  return (
    <a
      href={CITATIONDESK_TOOL}
      target="_blank"
      rel="noopener"
      data-clarity-upgrade={`citationdesk-cta-${source}`}
      className={`group block rounded-card-lg border border-brand/30 bg-surface-brand hover:bg-brand/10 hover:border-brand/50 transition-colors p-6 sm:p-7 ${track}`}
    >
      <div className="text-eyebrow text-brand mb-2">Sister tool &middot; CitationDesk</div>
      <h2 className="text-heading-2 font-bold tracking-tight text-text mb-2">
        How citable is <span className="text-brand">your own</span> site to AI?
      </h2>
      <p className="text-body text-muted leading-relaxed max-w-2xl mb-5">
        You just checked how citable sources are. CitationDesk does it for{" "}
        <strong className="text-text">your</strong> site or brand &mdash; it tracks
        whether ChatGPT, Claude, Perplexity &amp; Gemini actually cite you, and
        shows the fixes to get cited. From the same team behind SourceScore.
      </p>
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-brand/50 bg-brand/15 text-brand font-semibold group-hover:bg-brand/25 transition-colors text-body-sm">
        Get your free AI Visibility Score &rarr;
      </span>
    </a>
  );
}
