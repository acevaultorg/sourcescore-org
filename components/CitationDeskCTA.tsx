// Cross-property funnel CTA → CitationDesk (the operator's AI-visibility SaaS).
//
// Per the 2026-06-19 strategic decision (TaskPrio mqkx5yh8q913j0): SourceScore
// is the FREE authority/citation top-of-funnel for CitationDesk. The honest
// bridge: a SourceScore visitor checks how citable OTHER sources are → CitationDesk
// shows how citable THEIR OWN site/brand is to ChatGPT, Claude, Perplexity & Gemini
// (free AI Visibility Score). Minimal, honest, no dark patterns, no interstitials.
//
// CitationDesk is an OWNED sister property, not an affiliate.
//
// ⚠️ SUPERSEDED 2026-08-29 (BacklinkPilot cycle 1 hygiene check): this comment
// previously said "passes authority; no rel=sponsored" — a deliberate 2026-06-19
// choice to pass SEO authority sister-to-sister. The fleet's own later audit
// (BACKLINK-AUTOPILOT-PROMPT.md, 2026-08-27) independently flagged citationdesk.com
// -> sourcescore.org as a template-repeated, site-wide, followed link (footer,
// identical anchor across 259 pages) — the exact "PBN fingerprint" pattern the
// audit warns the fleet already tripped once. This CTA is the RECIPROCAL half of
// that same pair (sourcescore.org -> citationdesk.com, site-wide via home +
// methodology + claim + playground + footer). Two owned properties linking to each
// other, site-wide, followed, both directions = the textbook shape regardless of
// intent — Google's spam systems detect the pattern, not the ownership story.
// `nofollow` costs NOTHING here: the funnel this CTA exists for is 100%
// human-click-driven (the visible copy + placement), never SEO-authority-driven.
// Added `nofollow` alongside `noopener`; the funnel is unaffected, the risk is not.
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

function citationDeskHref(source: string, targetUrl?: string): string {
  const url = new URL(CITATIONDESK_TOOL);
  url.searchParams.set("utm_source", "sourcescore");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "owned-ai-visibility");
  url.searchParams.set("utm_content", source);
  if (targetUrl) {
    url.searchParams.set("url", targetUrl);
    url.searchParams.set("autorun", "1");
  }
  return url.toString();
}

type Props = {
  /** "panel" = full card (home, methodology). "strip" = slim inline (claim footer, verify result). */
  variant?: "panel" | "strip";
  /** Funnel-source label for analytics (e.g. "home", "claim", "playground", "methodology"). */
  source?: string;
  /** Optional URL to prefill and run in CitationDesk's checker. */
  targetUrl?: string;
  /** Intent label used to separate generic cross-sells from own-site checks. */
  intent?: string;
};

export function CitationDeskCTA({
  variant = "panel",
  source = "generic",
  targetUrl,
  intent = "ai-visibility",
}: Props) {
  const href = citationDeskHref(source, targetUrl);

  if (variant === "strip") {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow noopener"
        data-clarity-upgrade={`citationdesk-cta-${source}`}
        className={`group block rounded-card border border-brand/30 bg-surface-brand hover:bg-brand/10 hover:border-brand/50 transition-colors p-4`}
        data-event="citationdesk_cta"
        data-event-source={source}
        data-event-intent={intent}
        data-event-prefilled={targetUrl ? "yes" : "no"}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 px-2 py-0.5 rounded-pill bg-brand/15 text-brand text-caption font-mono uppercase tracking-wide whitespace-nowrap shrink-0">
            Sister tool
          </span>
          <span className="text-body-sm leading-snug">
            <strong className="text-text">Is your own site ready to be cited by AI?</strong>{" "}
            <span className="text-muted">
              CitationDesk audits the page signals that help ChatGPT, Claude, Perplexity &amp; Gemini cite you —{" "}
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
      href={href}
      target="_blank"
      rel="nofollow noopener"
      data-clarity-upgrade={`citationdesk-cta-${source}`}
      className={`group block rounded-card-lg border border-brand/30 bg-surface-brand hover:bg-brand/10 hover:border-brand/50 transition-colors p-6 sm:p-7`}
      data-event="citationdesk_cta"
      data-event-source={source}
      data-event-intent={intent}
      data-event-prefilled={targetUrl ? "yes" : "no"}
    >
      <div className="text-eyebrow text-brand mb-2">Sister tool &middot; CitationDesk</div>
      <h2 className="text-heading-2 font-bold tracking-tight text-text mb-2">
        Is <span className="text-brand">your own</span> site ready for AI citations?
      </h2>
      <p className="text-body text-muted leading-relaxed max-w-2xl mb-5">
        You just checked how citable sources are. CitationDesk audits the page
        signals on <strong className="text-text">your</strong> site that help AI
        engines retrieve and cite it, then shows the highest-leverage fix. It is
        a readiness audit, not a claim that an AI engine already cites you.
      </p>
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-brand/50 bg-brand/15 text-brand font-semibold group-hover:bg-brand/25 transition-colors text-body-sm">
        Get your free AI Visibility Score &rarr;
      </span>
    </a>
  );
}
