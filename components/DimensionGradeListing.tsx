import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  allGrades,
  gradeColorClass,
  gradeLabel,
  gradeRange,
  gradeSlug,
  type GradeLetter,
} from "@/lib/types";

// Day 21 — Per-dimension grade pages.
// Single shared component renders /discipline/grade/<letter>/,
// /modern-reference/grade/<letter>/, and /velocity/grade/<letter>/ pages.
// Targets "Which sources earn A+ on Citation Velocity specifically?"
// search intent — distinct from /grade/<letter>/ which is composite-Index.

export type DimensionKey = "discipline" | "modernReference" | "velocity";

export const DIM_META: Record<
  DimensionKey,
  {
    label: string;
    short: string;
    routePrefix: string;     // e.g. "/discipline"
    apiPathSegment: string;  // e.g. "discipline" (matches dir name in /api/)
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

/** Sources that earned the given grade on the given dimension, sorted desc by value */
export function sourcesAtDimGrade(dim: DimensionKey, grade: GradeLetter) {
  return sources
    .filter((s) => s.scores[dim].grade === grade)
    .sort((a, b) => b.scores[dim].value - a.scores[dim].value);
}

/** Mean score for the dimension across the whole dataset */
export function globalDimMean(dim: DimensionKey): number {
  return Math.round(
    sources.reduce((a, s) => a + s.scores[dim].value, 0) / sources.length
  );
}

export function DimensionGradeListing({
  dim,
  grade,
}: {
  dim: DimensionKey;
  grade: GradeLetter;
}) {
  const meta = DIM_META[dim];
  const list = sourcesAtDimGrade(dim, grade);
  const top = list[0];
  const meanInGrade =
    list.length > 0
      ? Math.round(
          list.reduce((a, s) => a + s.scores[dim].value, 0) / list.length
        )
      : 0;
  const globalMean = globalDimMean(dim);
  const totalAtThisDim = sources.length;
  const sharePct = Math.round((list.length / totalAtThisDim) * 100);

  // Other dims sliced at the SAME grade (cross-link cards)
  const otherDims: DimensionKey[] = (
    ["discipline", "modernReference", "velocity"] as DimensionKey[]
  ).filter((d) => d !== dim);

  // Other grades on the SAME dimension (chip row)
  const otherGradesOnDim = allGrades.filter((g) => g !== grade);

  // JSON-LD: ItemList + Article + DefinedTerm
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${grade}-grade sources on ${meta.label}`,
    description: `${list.length} sources scored ${grade} (${gradeRange(grade)}) on ${meta.label}.`,
    url: `https://sourcescore.org${meta.routePrefix}/grade/${gradeSlug(grade)}/`,
    numberOfItems: list.length,
    itemListElement: list.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: s.name,
        url: `https://${s.domain}`,
        identifier: `https://sourcescore.org/source/${s.slug}/`,
      },
    })),
  };

  const articleSchema = top
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${list.length} sources earn ${grade} on ${meta.label}`,
        description: `${list.length} sources (${sharePct}% of ${totalAtThisDim} scored) earn ${grade} on ${meta.label}. ${top.name} leads at ${top.scores[dim].value}.`,
        author: { "@type": "Organization", name: "SourceScore" },
        publisher: { "@type": "Organization", name: "SourceScore" },
        datePublished: top.verified,
        dateModified: top.verified,
        url: `https://sourcescore.org${meta.routePrefix}/grade/${gradeSlug(grade)}/`,
        mainEntity: {
          "@type": "DefinedTerm",
          name: `${grade}-grade ${meta.label}`,
          description: `${meta.label} grade band ${grade} (${gradeRange(grade)}). ${list.length} sources qualify, mean ${meanInGrade}.`,
          inDefinedTermSet: `https://sourcescore.org${meta.methodologyHref}`,
        },
      }
    : null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2 flex-wrap">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href={meta.rankingHref} className="hover:text-text">{meta.short}</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Grade {grade}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {meta.short.toUpperCase()} · GRADE {grade} · {gradeRange(grade)} · {list.length} sources
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        <span className={gradeColorClass(grade)}>{grade}</span>-grade sources on{" "}
        <span className="text-brand">{meta.label}</span>
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {meta.description} Score range {gradeRange(grade)} = {gradeLabel(grade)}.
      </p>

      {/* CALLOUT — quote-ready ─────────────────────────── */}
      {top && (
        <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
          <div className="text-eyebrow text-brand mb-2">Top of grade</div>
          <p className="text-heading-2 font-bold text-text leading-snug">
            <a
              href={`${meta.routePrefix}/${top.slug}/`}
              className="hover:text-brand transition-colors"
            >
              {top.name}
            </a>{" "}
            leads {grade}-grade {meta.short} sources at{" "}
            <span className={gradeColorClass(grade)}>
              {top.scores[dim].grade} · {top.scores[dim].value}
            </span>
            <span className="text-muted font-normal text-body-lg">
              {" "}
              · {list.length} sources qualify ({sharePct}% of {totalAtThisDim})
            </span>
          </p>
        </section>
      )}

      {/* MEANS GRID ─────────────────────────────────────── */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Mean in grade</div>
          <div className="font-bold text-text text-heading-3">{meanInGrade}</div>
          <div className="text-caption text-muted mt-1">
            Average {meta.short} score among the {list.length} {grade}-grade sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Global mean</div>
          <div className="font-bold text-text text-heading-3">{globalMean}</div>
          <div className="text-caption text-muted mt-1">
            Average {meta.short} across all {totalAtThisDim} sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Share of dataset</div>
          <div className="font-bold text-text text-heading-3">{sharePct}%</div>
          <div className="text-caption text-muted mt-1">
            {list.length} of {totalAtThisDim} sources earn {grade} on {meta.short}
          </div>
        </div>
      </section>

      {/* RANKED LIST ────────────────────────────────────── */}
      {list.length === 0 ? (
        <section className="mb-12 p-6 rounded-card border border-border bg-panel">
          <p className="text-body text-muted">
            No sources currently earn {grade} on {meta.label}.
          </p>
        </section>
      ) : (
        <section className="mb-12">
          <h2 className="text-heading-1 font-bold tracking-tight mb-5">
            Ranked — {grade} on {meta.short}
          </h2>
          <ol className="space-y-2">
            {list.map((s, i) => {
              const score = s.scores[dim];
              return (
                <li
                  key={s.slug}
                  className="flex items-start gap-4 p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
                >
                  <span className="text-caption text-dim font-mono w-7 text-right pt-1">
                    #{i + 1}
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
      )}

      {/* OTHER DIMS AT THIS GRADE ───────────────────────── */}
      <section className="mb-10 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Grade {grade} on other dimensions
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {/* Composite */}
          <a
            href={`/grade/${gradeSlug(grade)}/`}
            className="block p-4 rounded-card border border-brand/40 bg-surface-brand hover:bg-brand/15 transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">SourceScore Index (composite)</div>
            <div className="text-body-sm text-text">Grade {grade}</div>
            <div className="text-caption text-muted mt-1">
              {sources.filter((s) => s.scores.index.grade === grade).length} sources
            </div>
          </a>
          {otherDims.map((od) => {
            const om = DIM_META[od];
            const oList = sourcesAtDimGrade(od, grade);
            return (
              <a
                key={od}
                href={`${om.routePrefix}/grade/${gradeSlug(grade)}/`}
                className="block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
              >
                <div className="text-eyebrow text-brand mb-1">{om.short}</div>
                <div className="text-body-sm text-text">Grade {grade}</div>
                <div className="text-caption text-muted mt-1">
                  {oList.length} sources
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* OTHER GRADES ON SAME DIM ────────────────────── */}
      <section className="border-t border-border pt-8 mb-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Other {meta.short} grade bands
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherGradesOnDim.map((g) => {
            const count = sourcesAtDimGrade(dim, g).length;
            return (
              <a
                key={g}
                href={`${meta.routePrefix}/grade/${gradeSlug(g)}/`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm transition-colors"
              >
                <span className={`font-bold ${gradeColorClass(g)}`}>{g}</span>
                <span className="text-dim font-mono text-caption">{gradeRange(g)}</span>
                <span className="text-muted">{count}</span>
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
        <a href="/grade/" className="text-muted hover:text-brand">
          Composite-Index grade catalog →
        </a>
        <span className="text-dim">·</span>
        <a href={meta.methodologyHref} className="text-muted hover:text-brand">
          {meta.short} methodology →
        </a>
      </nav>
    </article>
  );
}
