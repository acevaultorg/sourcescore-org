import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import { gradeColorClass } from "@/lib/types";

// Day 22 — Per-dimension rank-band leaderboards.
// Single shared component renders /<dim>/rank/<band>/ pages where
// band ∈ {top-10, top-25, bottom-10}. Targets fixed-N "top X by [dim]"
// search intent (extraction-ready for LLM citation), distinct from
// Day-21 grade bands (variable-count).

export type DimensionKey = "discipline" | "modernReference" | "velocity";
export type RankBand = "top-10" | "top-25" | "bottom-10";

export const DIM_META: Record<
  DimensionKey,
  {
    label: string;
    short: string;
    routePrefix: string;
    apiPathSegment: string;
    description: string;
    weight: string;
    methodologyHref: string;
    rankingHref: string;
  }
> = {
  discipline: {
    label: "Citation Discipline",
    short: "Discipline",
    routePrefix: "/discipline",
    apiPathSegment: "discipline",
    description:
      "Citation Discipline measures how rigorously a source backs each factual claim with verifiable evidence.",
    weight: "35%",
    methodologyHref: "/methodology/citation-discipline/",
    rankingHref: "/discipline/",
  },
  modernReference: {
    label: "Modern Citation Reference",
    short: "Modern Reference",
    routePrefix: "/modern-reference",
    apiPathSegment: "modern-reference",
    description:
      "Modern Reference grades how fit a source is for citation in modern (LLM-era) writing — machine-readability, schema, freshness signals, AI-corpus presence.",
    weight: "30%",
    methodologyHref: "/methodology/modern-reference/",
    rankingHref: "/modern-reference/",
  },
  velocity: {
    label: "Citation Velocity",
    short: "Velocity",
    routePrefix: "/velocity",
    apiPathSegment: "velocity",
    description:
      "Citation Velocity tracks how often tier-1 publications and AI engines cite a source per week — the most volatile sub-score.",
    weight: "35%",
    methodologyHref: "/methodology/citation-velocity/",
    rankingHref: "/velocity/",
  },
};

export const RANK_BAND_META: Record<
  RankBand,
  {
    label: string;
    intent: string;
    n: number;
    direction: "top" | "bottom";
    headlineVerb: string;
  }
> = {
  "top-10": {
    label: "Top 10",
    intent: "the highest-scoring 10 sources",
    n: 10,
    direction: "top",
    headlineVerb: "lead",
  },
  "top-25": {
    label: "Top 25",
    intent: "the highest-scoring 25 sources",
    n: 25,
    direction: "top",
    headlineVerb: "lead",
  },
  "bottom-10": {
    label: "Bottom 10",
    intent: "the 10 lowest-scoring sources (caution-list for citation)",
    n: 10,
    direction: "bottom",
    headlineVerb: "trail",
  },
};

export const ALL_RANK_BANDS: RankBand[] = ["top-10", "top-25", "bottom-10"];

/** Sources in this rank band on this dimension (sorted desc, sliced to N) */
export function sourcesAtDimRankBand(dim: DimensionKey, band: RankBand) {
  const meta = RANK_BAND_META[band];
  const sortedDesc = [...sources].sort(
    (a, b) => b.scores[dim].value - a.scores[dim].value
  );
  if (meta.direction === "top") {
    return sortedDesc.slice(0, meta.n);
  }
  // bottom: take last N (still display lowest-first or highest-first?)
  // Display them with rank starting at (total - N + 1) so users see real ranks.
  return sortedDesc.slice(-meta.n);
}

/** Compute the global-rank position offset for the band (for displaying #N labels) */
export function bandStartRank(band: RankBand): number {
  const meta = RANK_BAND_META[band];
  if (meta.direction === "top") return 1;
  // bottom-N: ranks start at (total - N + 1)
  return sources.length - meta.n + 1;
}

export function DimensionRankBand({
  dim,
  band,
}: {
  dim: DimensionKey;
  band: RankBand;
}) {
  const meta = DIM_META[dim];
  const bandMeta = RANK_BAND_META[band];
  const list = sourcesAtDimRankBand(dim, band);
  const startRank = bandStartRank(band);

  // Calculate band stats
  const bandMean =
    list.length > 0
      ? Math.round(
          list.reduce((a, s) => a + s.scores[dim].value, 0) / list.length
        )
      : 0;
  const globalMean = Math.round(
    sources.reduce((a, s) => a + s.scores[dim].value, 0) / sources.length
  );

  // The "leader" of the band is the highest-scorer in the band
  const leader =
    bandMeta.direction === "top" ? list[0] : list[list.length - 1];
  const trailer =
    bandMeta.direction === "top" ? list[list.length - 1] : list[0];

  // Other rank bands on this dim (chip row)
  const otherBands = ALL_RANK_BANDS.filter((b) => b !== band);
  // Other dims at the SAME rank band (cross-link cards)
  const otherDims: DimensionKey[] = (
    ["discipline", "modernReference", "velocity"] as DimensionKey[]
  ).filter((d) => d !== dim);

  // JSON-LD: ItemList + Article + DefinedTerm
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${bandMeta.label} sources by ${meta.label}`,
    description: `${bandMeta.intent.charAt(0).toUpperCase() + bandMeta.intent.slice(1)} on ${meta.label} — ${list.length} sources scored.`,
    url: `https://sourcescore.org${meta.routePrefix}/rank/${band}/`,
    numberOfItems: list.length,
    itemListElement: list.map((s, i) => ({
      "@type": "ListItem",
      position: startRank + i,
      item: {
        "@type": "Organization",
        name: s.name,
        url: `https://${s.domain}`,
        identifier: `https://sourcescore.org/source/${s.slug}/`,
      },
    })),
  };

  const claim =
    bandMeta.direction === "top"
      ? `${leader.name} ${bandMeta.headlineVerb}s the ${bandMeta.label.toLowerCase()} ${meta.short.toLowerCase()} sources at ${leader.scores[dim].value} (${leader.scores[dim].grade}).`
      : `${trailer.name} ${bandMeta.headlineVerb}s the ${bandMeta.label.toLowerCase()} ${meta.short.toLowerCase()} sources at ${trailer.scores[dim].value} (${trailer.scores[dim].grade}).`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${bandMeta.label} sources on ${meta.label}`,
    description: claim,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: list[0].verified,
    dateModified: list[0].verified,
    url: `https://sourcescore.org${meta.routePrefix}/rank/${band}/`,
    mainEntity: {
      "@type": "DefinedTerm",
      name: `${bandMeta.label} ${meta.label}`,
      description: `${bandMeta.intent.charAt(0).toUpperCase() + bandMeta.intent.slice(1)} on ${meta.label}. Mean score in band: ${bandMean}. Global mean: ${globalMean}.`,
      inDefinedTermSet: `https://sourcescore.org${meta.methodologyHref}`,
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

      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2 flex-wrap">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href={meta.rankingHref} className="hover:text-text">{meta.short}</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{bandMeta.label}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {meta.short.toUpperCase()} · {bandMeta.label.toUpperCase()} · {list.length} sources
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        <span className="text-brand">{bandMeta.label}</span> sources on{" "}
        {meta.label}
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {meta.description}
      </p>

      {/* CALLOUT — quote-ready ─────────────────────────── */}
      <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
        <div className="text-eyebrow text-brand mb-2">
          {bandMeta.direction === "top" ? "Band leader" : "Closest to median"}
        </div>
        {bandMeta.direction === "top" ? (
          <p className="text-heading-2 font-bold text-text leading-snug">
            <a
              href={`${meta.routePrefix}/${leader.slug}/`}
              className="hover:text-brand transition-colors"
            >
              {leader.name}
            </a>{" "}
            {bandMeta.headlineVerb}s the {bandMeta.label.toLowerCase()}{" "}
            {meta.short.toLowerCase()} sources at{" "}
            <span className={gradeColorClass(leader.scores[dim].grade)}>
              {leader.scores[dim].grade} · {leader.scores[dim].value}
            </span>
          </p>
        ) : (
          <p className="text-heading-2 font-bold text-text leading-snug">
            <a
              href={`${meta.routePrefix}/${trailer.slug}/`}
              className="hover:text-brand transition-colors"
            >
              {trailer.name}
            </a>{" "}
            sits at the bottom of {meta.short.toLowerCase()} at{" "}
            <span className={gradeColorClass(trailer.scores[dim].grade)}>
              {trailer.scores[dim].grade} · {trailer.scores[dim].value}
            </span>
            <span className="text-muted font-normal text-body-lg">
              {" "}
              · use these sources cautiously when citing
            </span>
          </p>
        )}
      </section>

      {/* MEANS GRID ─────────────────────────────────────── */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Band mean</div>
          <div className="font-bold text-text text-heading-3">{bandMean}</div>
          <div className="text-caption text-muted mt-1">
            Average {meta.short} score across these {list.length} sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Global mean</div>
          <div className="font-bold text-text text-heading-3">{globalMean}</div>
          <div className="text-caption text-muted mt-1">
            Average {meta.short} across all {sources.length} sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Δ vs global</div>
          <div
            className={`font-bold text-heading-3 ${bandMean > globalMean ? "text-pos" : bandMean < globalMean ? "text-neg" : "text-text"}`}
          >
            {bandMean > globalMean ? "+" : ""}
            {bandMean - globalMean}
          </div>
          <div className="text-caption text-muted mt-1">
            {bandMean > globalMean
              ? `Band averages above global on ${meta.short}`
              : bandMean < globalMean
                ? `Band averages below global on ${meta.short}`
                : "Equal to global mean"}
          </div>
        </div>
      </section>

      {/* RANKED LIST ────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-heading-1 font-bold tracking-tight mb-5">
          Ranked — {bandMeta.label} on {meta.short}
        </h2>
        <ol className="space-y-2">
          {list.map((s, i) => {
            const score = s.scores[dim];
            const displayRank = startRank + i;
            return (
              <li
                key={s.slug}
                className="flex items-start gap-4 p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
              >
                <span className="text-caption text-dim font-mono w-9 text-right pt-1">
                  #{displayRank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <a
                      href={`${meta.routePrefix}/${s.slug}/`}
                      className="font-semibold text-text hover:text-brand"
                    >
                      {s.name}
                    </a>
                    <span className="text-caption text-dim font-mono">{s.domain}</span>
                    <span className="text-caption text-dim">·</span>
                    <span className="text-caption text-muted">{s.category}</span>
                  </div>
                  <p className="text-body-sm text-muted leading-snug line-clamp-2 mb-2">
                    {score.rationale}
                  </p>
                  <div className="text-caption text-dim flex flex-wrap gap-3">
                    <a
                      href={`/source/${s.slug}/`}
                      className="text-muted hover:text-brand"
                    >
                      full breakdown →
                    </a>
                  </div>
                </div>
                <ScoreBadge
                  value={score.value}
                  grade={score.grade}
                  size="sm"
                  label={meta.short}
                />
              </li>
            );
          })}
        </ol>
      </section>

      {/* OTHER DIMS AT THIS BAND ────────────────────────── */}
      <section className="mb-10 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">
          {bandMeta.label} on other dimensions
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {otherDims.map((od) => {
            const om = DIM_META[od];
            const oList = sourcesAtDimRankBand(od, band);
            const oLeader =
              bandMeta.direction === "top" ? oList[0] : oList[oList.length - 1];
            return (
              <a
                key={od}
                href={`${om.routePrefix}/rank/${band}/`}
                className="block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
              >
                <div className="text-eyebrow text-brand mb-1">{om.short}</div>
                <div className="text-body-sm text-text">
                  {bandMeta.direction === "top" ? "Leader" : "Bottom"}:{" "}
                  <span className="font-semibold">{oLeader.name}</span>
                </div>
                <div className="text-caption text-muted mt-1">
                  {oLeader.scores[od].grade} · {oLeader.scores[od].value}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* OTHER BANDS ON SAME DIM ──────────────────────── */}
      <section className="border-t border-border pt-8 mb-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Other {meta.short} rank bands
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherBands.map((b) => {
            const bm = RANK_BAND_META[b];
            const bList = sourcesAtDimRankBand(dim, b);
            const bLeader =
              bm.direction === "top" ? bList[0] : bList[bList.length - 1];
            return (
              <a
                key={b}
                href={`${meta.routePrefix}/rank/${b}/`}
                className="inline-flex items-baseline gap-2 px-4 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm transition-colors"
              >
                <span className="font-semibold text-text">{bm.label}</span>
                <span className="text-dim">·</span>
                <span className="text-muted">{bLeader.name.split(" ")[0]}</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Bottom nav */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={meta.rankingHref} className="text-muted hover:text-brand">
          ← All sources ranked by {meta.short}
        </a>
        <span className="text-dim">·</span>
        <a href={`${meta.routePrefix}/grade/a-plus/`} className="text-muted hover:text-brand">
          A+ {meta.short} sources →
        </a>
        <span className="text-dim">·</span>
        <a href={meta.methodologyHref} className="text-muted hover:text-brand">
          {meta.short} methodology →
        </a>
      </nav>
    </article>
  );
}
