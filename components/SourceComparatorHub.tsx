import { sources, getSource } from "@/data/sources";
import {
  comparisonsForSource,
  type ComparisonForSource,
} from "@/data/comparisons";
import { ScoreBadge } from "@/components/ScoreBadge";
import { gradeColorClass } from "@/lib/types";

// Day 24 — Per-source comparator hub.
// One hub page per source that appears in ≥1 comparator pair (124 of 130
// sources as of Day 23). Lists every X-vs-Y battle the source is part of
// with partner score deltas, JSON-LD ItemList for LLM citation, and
// cross-links back to source detail + each canonical comparator URL.
//
// Layer 5 archetype stack (compounds with Day 18 pattern):
//   - programmatic_unique_data_page × +55 (each hub has different content)
//   - comparison_vs_competitor_page × +60 (lists comparison pairs)
//   - ai_visibility_optimized_page × +70 (extraction-bait headings)
//   - schema_markup_article_person_org × +20 (JSON-LD ItemList + Article)
//   - internal_linking_hub_spoke × +15 (hub for every comparator the source has)
//   - sitemap_addition × +12

export interface SourceComparatorHubProps {
  /** Source slug — caller verifies it exists in data/sources.ts. */
  slug: string;
}

/**
 * Compute the BIGGEST score gap among all this source's comparator pairs.
 * Returns the partner with the largest absolute index-score delta vs this source.
 */
function biggestContrast(
  thisSlug: string,
  pairs: ComparisonForSource[],
): { partner: string; delta: number } | null {
  if (pairs.length === 0) return null;
  const me = getSource(thisSlug);
  if (!me) return null;
  let best = pairs[0];
  let bestDelta = 0;
  for (const p of pairs) {
    const partner = getSource(p.partner);
    if (!partner) continue;
    const delta = Math.abs(me.scores.index.value - partner.scores.index.value);
    if (delta > bestDelta) {
      bestDelta = delta;
      best = p;
    }
  }
  return { partner: best.partner, delta: bestDelta };
}

export function SourceComparatorHub({ slug }: SourceComparatorHubProps) {
  const me = getSource(slug);
  if (!me) {
    // Defensive — caller (route's generateStaticParams) should never pass
    // an unknown slug, but if it does, render a minimal valid page.
    throw new Error(`SourceComparatorHub: unknown slug "${slug}"`);
  }
  const pairs = comparisonsForSource(slug);
  if (pairs.length === 0) {
    throw new Error(
      `SourceComparatorHub: source "${slug}" has zero comparator pairs — ` +
        `route should have filtered this out via sourcesWithComparators.`,
    );
  }

  const contrast = biggestContrast(slug, pairs);
  const contrastPartner = contrast ? getSource(contrast.partner) : null;

  // Sort pairs by absolute index-score delta (biggest contrast first — most
  // search-intent-rich), then alphabetically.
  const sortedPairs = [...pairs].sort((a, b) => {
    const aPartner = getSource(a.partner);
    const bPartner = getSource(b.partner);
    if (!aPartner || !bPartner) return 0;
    const aDelta = Math.abs(me.scores.index.value - aPartner.scores.index.value);
    const bDelta = Math.abs(me.scores.index.value - bPartner.scores.index.value);
    if (aDelta !== bDelta) return bDelta - aDelta;
    return aPartner.name.localeCompare(bPartner.name);
  });

  // Means across this source's comparator partners
  const partnerSources = pairs
    .map((p) => getSource(p.partner))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const partnerMean =
    partnerSources.length > 0
      ? Math.round(
          partnerSources.reduce((a, s) => a + s.scores.index.value, 0) /
            partnerSources.length,
        )
      : 0;
  const globalMean = Math.round(
    sources.reduce((a, s) => a + s.scores.index.value, 0) / sources.length,
  );

  // JSON-LD: ItemList of comparator pairs (LLM extraction-bait)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${me.name} comparisons — every SourceScore head-to-head`,
    description: `${pairs.length} canonical "${me.name} vs X" comparisons scored on Discipline, Modern Reference, and Velocity.`,
    url: `https://sourcescore.org/source/${slug}/comparisons/`,
    numberOfItems: pairs.length,
    itemListElement: sortedPairs.map((p, i) => {
      const partner = getSource(p.partner);
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          name: partner ? `${me.name} vs ${partner.name}` : p.slug,
          url: `https://sourcescore.org/compare/${p.slug}/`,
          description: p.summary,
        },
      };
    }),
  };

  // JSON-LD: Article schema (with DefinedTerm for the hub concept)
  const headlineClaim =
    contrastPartner && contrast && contrast.delta > 0
      ? `${me.name} ranges from a ${contrast.delta}-point gap with ${contrastPartner.name} to direct head-to-heads with ${pairs.length} other sources.`
      : `${me.name} appears in ${pairs.length} ${pairs.length === 1 ? "comparator pair" : "comparator pairs"} across the SourceScore index.`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${me.name} comparisons — ${pairs.length} head-to-heads`,
    description: headlineClaim,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: me.verified,
    dateModified: me.verified,
    url: `https://sourcescore.org/source/${slug}/comparisons/`,
    mainEntity: {
      "@type": "DefinedTerm",
      name: `${me.name} comparator hub`,
      description: `Every SourceScore "${me.name} vs X" comparison page. Partner mean: ${partnerMean}. Global mean: ${globalMean}.`,
      inDefinedTermSet: "https://sourcescore.org/methodology/",
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="text-caption text-dim mb-6 flex gap-2 flex-wrap"
      >
        <a href="/" className="hover:text-text">
          SourceScore
        </a>
        <span aria-hidden="true">/</span>
        <a href="/sources/" className="hover:text-text">
          Sources
        </a>
        <span aria-hidden="true">/</span>
        <a href={`/source/${slug}/`} className="hover:text-text">
          {me.name}
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Comparisons</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {me.name.toUpperCase()} · {pairs.length}{" "}
        {pairs.length === 1 ? "COMPARISON" : "COMPARISONS"}
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Every <span className="text-brand">{me.name}</span> head-to-head
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {pairs.length === 1
          ? `${me.name} appears in one canonical SourceScore comparison.`
          : `${me.name} appears in ${pairs.length} canonical SourceScore comparisons. Each is a real "X vs Y" search-intent page scored on Citation Discipline, Modern Reference, and Citation Velocity.`}
      </p>

      {/* CALLOUT — biggest contrast partner ─────────────── */}
      {contrast && contrastPartner && contrast.delta > 0 && (
        <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
          <div className="text-eyebrow text-brand mb-2">Biggest score gap</div>
          <p className="text-heading-2 font-bold text-text leading-snug">
            <a
              href={`/source/${contrastPartner.slug}/`}
              className="hover:text-brand transition-colors"
            >
              {contrastPartner.name}
            </a>{" "}
            sits {contrast.delta} index-points{" "}
            {contrastPartner.scores.index.value > me.scores.index.value
              ? "above"
              : "below"}{" "}
            <span className="text-brand">{me.name}</span> ·{" "}
            <a
              href={`/compare/${
                [me.slug, contrastPartner.slug].sort().join("-vs-")
              }/`}
              className="text-brand hover:underline"
            >
              full comparison →
            </a>
          </p>
        </section>
      )}

      {/* MEANS GRID ─────────────────────────────────────── */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">{me.name}</div>
          <div className="font-bold text-text text-heading-3">
            {me.scores.index.value}
          </div>
          <div className="text-caption text-muted mt-1">
            SourceScore Index ({me.scores.index.grade})
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Partner mean</div>
          <div className="font-bold text-text text-heading-3">
            {partnerMean}
          </div>
          <div className="text-caption text-muted mt-1">
            Average index across the {pairs.length}{" "}
            {pairs.length === 1 ? "partner" : "partners"} {me.name} is compared
            with
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Global mean</div>
          <div className="font-bold text-text text-heading-3">{globalMean}</div>
          <div className="text-caption text-muted mt-1">
            Average index across all {sources.length} sources
          </div>
        </div>
      </section>

      {/* PAIR LIST ─────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-eyebrow text-brand mb-3">
          All {me.name} comparisons (sorted by score gap)
        </h2>
        <ol className="space-y-3">
          {sortedPairs.map((p, i) => {
            const partner = getSource(p.partner);
            if (!partner) return null;
            const delta = me.scores.index.value - partner.scores.index.value;
            const deltaSign = delta > 0 ? "+" : "";
            return (
              <li
                key={p.slug}
                className="p-4 rounded-card border border-border bg-panel hover:border-brand/40 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-caption text-dim font-mono">
                      #{i + 1}
                    </span>
                    <a
                      href={`/compare/${p.slug}/`}
                      className="text-heading-3 font-semibold text-text hover:text-brand transition-colors"
                    >
                      {me.name} vs {partner.name}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm">
                    <ScoreBadge
                      value={partner.scores.index.value}
                      grade={partner.scores.index.grade}
                      size="sm"
                    />
                    <span
                      className={`font-mono ${
                        delta > 0
                          ? "text-pos"
                          : delta < 0
                            ? "text-neg"
                            : "text-muted"
                      }`}
                    >
                      {deltaSign}
                      {delta}
                    </span>
                  </div>
                </div>
                <p className="text-body-sm text-muted leading-snug mb-2">
                  {p.summary}
                </p>
                <div className="flex gap-3 text-caption text-dim flex-wrap">
                  <a
                    href={`/source/${partner.slug}/`}
                    className="hover:text-brand"
                  >
                    {partner.name} profile →
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={`/compare/${p.slug}/discipline/`}
                    className="hover:text-brand"
                  >
                    Discipline-only
                  </a>
                  <a
                    href={`/compare/${p.slug}/modern-reference/`}
                    className="hover:text-brand"
                  >
                    Modern&nbsp;Reference-only
                  </a>
                  <a
                    href={`/compare/${p.slug}/velocity/`}
                    className="hover:text-brand"
                  >
                    Velocity-only
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* BACK TO SOURCE ────────────────────────────────── */}
      <section className="border-t border-border pt-8 mt-8 text-body-sm text-muted">
        <a
          href={`/source/${slug}/`}
          className="text-brand hover:underline"
        >
          ← {me.name} full SourceScore profile
        </a>
      </section>
    </article>
  );
}
