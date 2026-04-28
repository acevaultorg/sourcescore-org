import { sources, categorySlug, sourcesInCategory } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import { gradeColorClass, type Source } from "@/lib/types";

// Shared rendering for /discipline/[slug]/, /modern-reference/[slug]/,
// /velocity/[slug]/ — single component, three dimensions, 390 pages.

export type DimensionKey = "discipline" | "modernReference" | "velocity";

export const DIMENSION_META: Record<
  DimensionKey,
  {
    label: string;
    short: string;
    routePrefix: string;
    rankingHref: string;
    methodologyHref: string;
    description: string;
    weightInComposite: string;
  }
> = {
  discipline: {
    label: "Citation Discipline",
    short: "Discipline",
    routePrefix: "/discipline",
    rankingHref: "/discipline/",
    methodologyHref: "/methodology/citation-discipline/",
    description:
      "Citation Discipline measures how rigorously a source backs each factual claim with verifiable evidence. High-Discipline sources cite primary evidence inline; low-Discipline sources opine without sourcing.",
    weightInComposite: "35%",
  },
  modernReference: {
    label: "Modern Citation Reference",
    short: "Modern Reference",
    routePrefix: "/modern-reference",
    rankingHref: "/modern-reference/",
    methodologyHref: "/methodology/modern-reference/",
    description:
      "Modern Reference grades how fit a source is for citation in modern (LLM-era) writing. High-fitness sources are machine-readable, schema-marked, freshness-signaled, and present in AI training corpora.",
    weightInComposite: "30%",
  },
  velocity: {
    label: "Citation Velocity",
    short: "Velocity",
    routePrefix: "/velocity",
    rankingHref: "/velocity/",
    methodologyHref: "/methodology/citation-velocity/",
    description:
      "Citation Velocity tracks how often tier-1 publications and AI engines cite a source per week. The most volatile of the three sub-scores; refreshes most frequently.",
    weightInComposite: "35%",
  },
};

/** Compute global rank within dimension (1 = highest score) */
export function dimensionRank(s: Source, dim: DimensionKey): number {
  const sorted = [...sources].sort(
    (a, b) => b.scores[dim].value - a.scores[dim].value
  );
  return sorted.findIndex((x) => x.slug === s.slug) + 1;
}

/** Compute rank within the source's category for this dimension */
export function categoryDimensionRank(
  s: Source,
  dim: DimensionKey
): { rank: number; total: number } {
  const peers = sourcesInCategory(s.category).sort(
    (a, b) => b.scores[dim].value - a.scores[dim].value
  );
  return {
    rank: peers.findIndex((x) => x.slug === s.slug) + 1,
    total: peers.length,
  };
}

/** Mean score for a dimension within a category */
export function categoryDimensionMean(category: string, dim: DimensionKey): number {
  const peers = sourcesInCategory(category);
  if (peers.length === 0) return 0;
  return Math.round(
    peers.reduce((a, s) => a + s.scores[dim].value, 0) / peers.length
  );
}

/** Mean score for a dimension across the whole dataset */
export function globalDimensionMean(dim: DimensionKey): number {
  return Math.round(
    sources.reduce((a, s) => a + s.scores[dim].value, 0) / sources.length
  );
}

export function SourceDimensionDetail({
  source,
  dim,
}: {
  source: Source;
  dim: DimensionKey;
}) {
  const meta = DIMENSION_META[dim];
  const score = source.scores[dim];
  const rank = dimensionRank(source, dim);
  const total = sources.length;
  const catRank = categoryDimensionRank(source, dim);
  const catMean = categoryDimensionMean(source.category, dim);
  const globalMean = globalDimensionMean(dim);

  // Other-dimension cross-links for this same source
  const otherDims: DimensionKey[] = (
    ["discipline", "modernReference", "velocity"] as DimensionKey[]
  ).filter((d) => d !== dim);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2 flex-wrap">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href={meta.rankingHref} className="hover:text-text">{meta.short}</a>
        <span aria-hidden="true">/</span>
        <a href={`/source/${source.slug}/`} className="hover:text-text">{source.name}</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{meta.short} detail</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {meta.short.toUpperCase()} · {meta.weightInComposite} of composite
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-2">
        <a href={`/source/${source.slug}/`} className="hover:text-brand transition-colors">
          {source.name}
        </a>{" "}
        — {meta.short}
      </h1>
      <div className="text-body-sm text-muted font-mono mb-2">
        {source.domain} ·{" "}
        <a
          href={`/category/${categorySlug(source.category)}/`}
          className="hover:text-brand"
        >
          {source.category}
        </a>
      </div>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {meta.description}
      </p>

      {/* Hero score badge */}
      <section className="mb-10 p-6 rounded-card-lg border border-border bg-panel">
        <div className="flex items-baseline gap-4 flex-wrap mb-3">
          <ScoreBadge
            value={score.value}
            grade={score.grade}
            label={meta.label}
            size="lg"
          />
          <div className={`text-display-3 font-bold tracking-tight ${gradeColorClass(score.grade)}`}>
            {score.grade} · {score.value}
          </div>
        </div>
        <p className="text-body text-text leading-relaxed">{score.rationale}</p>
      </section>

      {/* Signals */}
      {score.signals.length > 0 && (
        <section className="mb-10">
          <h2 className="text-heading-2 font-bold mb-3">
            What drives this {meta.short} score
          </h2>
          <ul className="space-y-2">
            {score.signals.map((sig, i) => (
              <li
                key={i}
                className="p-4 rounded-card border border-border bg-panel"
              >
                <div className="font-semibold text-text mb-1">{sig.label}</div>
                <div className="text-body-sm text-muted leading-snug">{sig.detail}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Rank context */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Global rank</div>
          <div className="font-bold text-text text-heading-3">
            #{rank} of {total}
          </div>
          <div className="text-caption text-muted mt-1">
            By {meta.short} across all SourceScore sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">In-category rank</div>
          <div className="font-bold text-text text-heading-3">
            #{catRank.rank} of {catRank.total}
          </div>
          <div className="text-caption text-muted mt-1">
            Among {source.category.toLowerCase()} sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Vs. averages</div>
          <div className="text-body-sm text-text">
            Cat. mean: <strong>{catMean}</strong>
            <br />
            Global mean: <strong>{globalMean}</strong>
          </div>
          <div className="text-caption text-muted mt-1">
            {score.value > catMean
              ? `+${score.value - catMean} above category`
              : score.value < catMean
                ? `${score.value - catMean} below category`
                : "Equal to category mean"}
          </div>
        </div>
      </section>

      {/* Other dimensions for this source */}
      <section className="mb-10 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Other dimensions for {source.name}
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {/* Composite Index */}
          <a
            href={`/source/${source.slug}/`}
            className="block p-4 rounded-card border border-brand/40 bg-surface-brand hover:bg-brand/15 transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">SourceScore Index</div>
            <div className="flex items-baseline gap-2">
              <span
                className={`font-bold ${gradeColorClass(source.scores.index.grade)}`}
              >
                {source.scores.index.grade} · {source.scores.index.value}
              </span>
            </div>
            <div className="text-caption text-muted mt-1">Composite</div>
          </a>
          {otherDims.map((d) => {
            const om = DIMENSION_META[d];
            const oScore = source.scores[d];
            return (
              <a
                key={d}
                href={`${om.routePrefix}/${source.slug}/`}
                className="block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
              >
                <div className="text-eyebrow text-brand mb-1">{om.short}</div>
                <div className="flex items-baseline gap-2">
                  <span className={`font-bold ${gradeColorClass(oScore.grade)}`}>
                    {oScore.grade} · {oScore.value}
                  </span>
                </div>
                <div className="text-caption text-muted mt-1">
                  {om.weightInComposite} weight
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Bottom nav */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={`/source/${source.slug}/`} className="text-muted hover:text-brand">
          ← Full {source.name} breakdown
        </a>
        <span className="text-dim">·</span>
        <a href={meta.rankingHref} className="text-muted hover:text-brand">
          All sources ranked by {meta.short} →
        </a>
        <span className="text-dim">·</span>
        <a href={meta.methodologyHref} className="text-muted hover:text-brand">
          {meta.short} methodology →
        </a>
      </nav>
    </article>
  );
}
