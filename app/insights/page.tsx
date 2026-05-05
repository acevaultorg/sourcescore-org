import type { Metadata } from "next";
import { INSIGHTS, rowsForInsight } from "@/data/insights";
import { gradeColorClass } from "@/lib/types";

// Day 30 — Insights index.
// Top-level hub for all stat pages. Each insight is a cite-ready answer
// to one specific question about score-profile patterns.

export const metadata: Metadata = {
  title: { absolute: "Insights — score-profile patterns across the SourceScore dataset" },
  description:
    "Eight cite-ready stat pages surfacing extremes across 130 information sources: which sources punch above their composite Index on each dimension, which lag, which are most balanced, which are most lopsided.",
  alternates: {
    canonical: "https://sourcescore.org/insights/",
    types: {
      "application/json": "https://sourcescore.org/api/insights.json",
    },
  },
  openGraph: {
    title: "SourceScore Insights — score-profile patterns",
    description:
      "Cite-ready stat pages surfacing the extremes across 130 information sources.",
    url: "https://sourcescore.org/insights/",
    type: "article",
  },
};

export default function InsightsIndexPage() {
  // Compute the leader for each insight at build time so the index card
  // shows a real source name instead of "see inside".
  const leaderByInsight = INSIGHTS.map((insight) => {
    const rows = rowsForInsight(insight);
    return { insight, leader: rows[0] };
  });

  // JSON-LD: ItemList of insights
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SourceScore Insights",
    description: "Eight stat pages surfacing extremes across 130 information sources.",
    url: "https://sourcescore.org/insights/",
    numberOfItems: INSIGHTS.length,
    itemListElement: INSIGHTS.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "WebPage",
        name: i.title,
        url: `https://sourcescore.org/insights/${i.slug}/`,
        description: i.summary,
      },
    })),
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="text-caption text-dim mb-6 flex gap-2 flex-wrap"
      >
        <a href="/" className="hover:text-text">
          SourceScore
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Insights</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        STATS · {INSIGHTS.length} CITE-READY ANSWERS
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        SourceScore <span className="text-brand">Insights</span>
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-10">
        Eight stat pages surfacing the extremes across the 130-source
        SourceScore dataset. Each insight answers ONE specific question —
        useful when you want a precise cite-ready answer ("the source with
        the largest Citation Velocity lead over its composite Index is X").
      </p>

      <ul className="grid sm:grid-cols-2 gap-4 mb-12">
        {leaderByInsight.map(({ insight, leader }) => (
          <li
            key={insight.slug}
            className="p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <a href={`/insights/${insight.slug}/`} className="block">
              <h2 className="text-heading-3 font-bold text-text hover:text-brand mb-2 leading-snug">
                {insight.title}
              </h2>
              <p className="text-body-sm text-muted leading-relaxed mb-3">
                {insight.summary}
              </p>
              {leader && (
                <div className="flex items-baseline gap-2 text-caption text-dim">
                  <span>Leader:</span>
                  <strong className="text-text">{leader.source.name}</strong>
                  <span className={gradeColorClass(leader.source.scores.index.grade)}>
                    {leader.source.scores.index.grade}
                  </span>
                  <span className="font-mono text-pos">
                    {leader.signal >= 0 && insight.kind === "dim-vs-composite"
                      ? "+"
                      : ""}
                    {insight.kind === "dim-vs-composite"
                      ? leader.signal
                      : `spread ${leader.spread}`}
                  </span>
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>

      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">
          How to use these
        </h2>
        <p>
          The composite SourceScore Index averages three sub-scores —
          Citation Discipline, Modern Reference, and Citation Velocity. Most
          sources score similarly across all three. The interesting cases
          are at the edges: sources that PUNCH ABOVE on one dimension but
          have a lower composite, or sources where one dimension is
          notably weaker than the average.
        </p>
        <p>
          Use these insight pages when the citation context cares about ONE
          dimension specifically. For example, if you need a source whose
          Modern Reference score is unusually strong (current refs, fresh
          underlying data), the "Modern Reference outperforms" page surfaces
          the right candidates.
        </p>
      </section>

      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href="/sources/" className="text-muted hover:text-brand">
          ← All 130 sources
        </a>
        <span className="text-dim">·</span>
        <a href="/grade/" className="text-muted hover:text-brand">
          By grade →
        </a>
        <span className="text-dim">·</span>
        <a href="/best/" className="text-muted hover:text-brand">
          Curated best-lists →
        </a>
        <span className="text-dim">·</span>
        <a href="/methodology/" className="text-muted hover:text-brand">
          Methodology →
        </a>
      </nav>
    </article>
  );
}
