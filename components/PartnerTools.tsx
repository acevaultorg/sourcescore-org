// PartnerTools — the site's only affiliate surface, dormant by default.
//
// Renders NOTHING (no wrapper, no heading, no whitespace, no layout shift)
// until at least one partner URL env var is set — see lib/partners.ts. That is
// deliberate: the slot can sit in the page today and go live the moment a
// program approves, with no code edit and no deploy lag beyond the rebuild.
//
// COMPLIANCE (rules/affiliate-team-standard.md + /disclosure/):
//   - rel="sponsored nofollow noopener" on every outbound partner link
//   - FTC disclosure sentence immediately adjacent to the links, linking /disclosure/
//   - no prices, no fake scarcity, no "click to support us", no interruption
//   - explicit statement that paid links never touch a score
//
// TRACKING: `data-event` / `data-event-*` attributes only. The delegated
// listener in components/Analytics.tsx forwards them to BOTH live analytics
// vendors already on the site — Microsoft Clarity (clarity('event', …) +
// clarity('set', …)) and GA4 (gtag('event', …)). No new vendor, no client
// component, no hydration cost — this stays a pure server component.
//   fires: affiliate_click  { partner: <slug>, source: <placement> }
// Deliberately NOT using data-clarity-upgrade here: ClarityClickListener
// mirrors that to a second GA4 event (`cta_click`), and the conversion funnel
// is cleaner with exactly one event per affiliate click.

import { activePartners } from "@/lib/partners";

type Props = {
  /** "panel" = full card (score pages). "strip" = compact (leaderboard/hub pages). */
  variant?: "panel" | "strip";
  /** Placement label for analytics, e.g. "source-detail", "sources-hub". */
  source?: string;
  /**
   * Spacing owned by the CALLER but applied to this component's own root.
   * Callers must not wrap <PartnerTools> in a spacing div — an empty wrapper
   * with a margin would still push the page around while the layer is dormant.
   */
  className?: string;
};

export function PartnerTools({
  variant = "panel",
  source = "generic",
  className = "",
}: Props) {
  // The dormant path. No fragment, no wrapper, no whitespace, no margin.
  if (activePartners.length === 0) return null;

  const isStrip = variant === "strip";

  return (
    <section
      className={`${
        isStrip
          ? "rounded-card border border-border bg-panel p-4"
          : "rounded-card-lg border border-border bg-panel p-6 sm:p-7"
      }${className ? ` ${className}` : ""}`}
      aria-labelledby={`partner-tools-${source}`}
    >
      <div className="text-eyebrow text-dim mb-2">Track this continuously</div>
      <h2
        id={`partner-tools-${source}`}
        className={
          isStrip
            ? "text-heading-3 font-bold tracking-tight text-text mb-2"
            : "text-heading-2 font-bold tracking-tight text-text mb-2"
        }
      >
        Monitor AI citations over time
      </h2>
      <p className="text-body-sm text-muted leading-relaxed mb-5 max-w-2xl">
        A SourceScore grade is a hand-scored snapshot. These independent
        third-party tools track how often AI engines actually cite a domain,
        week over week. We do not build them and we do not rank them.
      </p>

      <ul className="space-y-3">
        {activePartners.map((partner) => (
          <li key={partner.slug}>
            <a
              href={partner.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              data-event="affiliate_click"
              data-event-partner={partner.slug}
              data-event-source={source}
              className="group flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-btn border border-border bg-bg hover:border-brand/40 hover:bg-surface-brand transition-colors px-4 py-3"
            >
              <span className="text-body font-semibold text-text group-hover:text-brand transition-colors">
                {partner.name}
              </span>
              <span className="text-caption font-mono uppercase tracking-wide text-dim">
                Paid link
              </span>
              {partner.note ? (
                <span className="w-full text-body-sm text-muted leading-relaxed">
                  {partner.note}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>

      {/* FTC disclosure — immediately adjacent to the links, not just in the footer. */}
      <p className="mt-4 text-caption text-dim leading-relaxed">
        Disclosure: the links above are affiliate links. If you sign up we may
        earn a commission, at no extra cost to you. They never influence any
        score, grade, or ranking on this site — see our{" "}
        <a href="/disclosure/" className="text-brand hover:underline">
          affiliate disclosure
        </a>
        .
      </p>
    </section>
  );
}
