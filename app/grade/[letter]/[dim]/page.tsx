import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sources } from "@/data/sources";
import {
  allGrades,
  gradeFromSlug,
  gradeSlug,
  gradeLabel,
  gradeRange,
  gradeColorClass,
  type GradeLetter,
} from "@/lib/types";
import {
  ALL_DIMENSIONS,
  DIMENSION_META,
  dimFromSegment,
  type DimensionKey,
} from "@/data/best-lists";
import { ScoreBadge } from "@/components/ScoreBadge";

// Day 27 — Composite-grade × sub-score faceted leaderboards.
// Distinct from Day 21 `/<dim>/grade/<letter>/` which redefines the
// grade based on the dim-specific score. Day 27 keeps the COMPOSITE
// grade definition and re-sorts the same source pool by ONE sub-score.
// Surfaces "of the elite tier (composite A+), who's BEST on Discipline?"
// — different leader, different rank deltas, different insight.
//
// Only generated for grades with ≥3 sources (skips D + F which have 1
// each — re-sorting a 1-item list is meaningless content).
//
// Layer 5 archetype stack per page (same compound as Day 25):
//   programmatic_unique_data_page × +55 (per-grade × per-dim re-sort)
//   ai_visibility_optimized_page × +70 (dim-specific quotable claims)
//   internal_linking_hub_spoke × +15 (every entry → /source/)
//   schema_markup_article_person_org × +20 (ItemList + Article + DefinedTerm)
//   sitemap_addition × +12

const MIN_GRADE_SIZE = 3;

/** Returns sources at the given composite-grade tier, re-sorted by dim. */
function gradeSourcesByDim(grade: GradeLetter, dim: DimensionKey) {
  return sources
    .filter((s) => s.scores.index.grade === grade)
    .sort((a, b) => b.scores[dim].value - a.scores[dim].value);
}

/** Composite-grade tier members in default (composite) rank order. */
function gradeSourcesByComposite(grade: GradeLetter) {
  return sources
    .filter((s) => s.scores.index.grade === grade)
    .sort((a, b) => b.scores.index.value - a.scores.index.value);
}

export function generateStaticParams() {
  const out: Array<{ letter: string; dim: string }> = [];
  for (const grade of allGrades) {
    const tier = sources.filter((s) => s.scores.index.grade === grade);
    if (tier.length < MIN_GRADE_SIZE) continue; // skip D + F (1 source each)
    for (const dim of ALL_DIMENSIONS) {
      out.push({
        letter: gradeSlug(grade),
        dim: DIMENSION_META[dim].routeSegment,
      });
    }
  }
  return out;
}

type PageProps = { params: Promise<{ letter: string; dim: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { letter, dim: dimSegment } = await params;
  const grade = gradeFromSlug(letter);
  const dim = dimFromSegment(dimSegment);
  if (!grade || !dim) return { title: "Page not found" };
  const items = gradeSourcesByDim(grade, dim);
  if (items.length < MIN_GRADE_SIZE) return { title: "Page not found" };

  const dimMeta = DIMENSION_META[dim];
  const leader = items[0];

  const title = `${grade} sources by ${dimMeta.label} — SourceScore`;
  const description = `${items.length} sources hold composite SourceScore grade ${grade}. Re-ranked by ${dimMeta.label} only, ${leader.name} leads at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100). Different leader than the composite ranking.`;

  // Re-use the composite-grade page's existing OG image
  const ogImage = `https://sourcescore.org/og/grade/${letter}.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sourcescore.org/grade/${letter}/${dimSegment}/`,
      types: {
        "application/json": `https://sourcescore.org/api/grade/${letter}/${dimSegment}.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/grade/${letter}/${dimSegment}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function GradeDimensionPage({ params }: PageProps) {
  const { letter, dim: dimSegment } = await params;
  const grade = gradeFromSlug(letter);
  const dim = dimFromSegment(dimSegment);
  if (!grade || !dim) notFound();

  const items = gradeSourcesByDim(grade, dim);
  if (items.length < MIN_GRADE_SIZE) notFound();

  const dimMeta = DIMENSION_META[dim];
  const leader = items[0];

  // Composite-rank lookup for "rank delta" surfacing (same source pool,
  // different sort)
  const baseList = gradeSourcesByComposite(grade);
  const baseRankBySlug = new Map(baseList.map((s, i) => [s.slug, i + 1]));

  // Means
  const dimMean = Math.round(
    items.reduce((a, s) => a + s.scores[dim].value, 0) / items.length,
  );
  const compositeMean = Math.round(
    items.reduce((a, s) => a + s.scores.index.value, 0) / items.length,
  );

  // Sibling dims
  const otherDims: DimensionKey[] = ALL_DIMENSIONS.filter((d) => d !== dim);

  // Compute biggest-mover for narrative
  const biggestUp = [...items]
    .map((s, i) => ({
      s,
      delta: (baseRankBySlug.get(s.slug) ?? i + 1) - (i + 1),
    }))
    .sort((a, b) => b.delta - a.delta)[0];

  // JSON-LD: ItemList + Article + DefinedTerm
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${grade} sources ranked by ${dimMeta.label}`,
    description: `${items.length} composite-${grade} sources re-sorted by ${dimMeta.label}. Mean ${dimMeta.short}: ${dimMean}.`,
    url: `https://sourcescore.org/grade/${letter}/${dimSegment}/`,
    numberOfItems: items.length,
    itemListElement: items.map((s, i) => ({
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${grade}-tier sources ranked by ${dimMeta.label}`,
    description: `${leader.name} leads ${grade}-tier sources on ${dimMeta.label} at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100).`,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: leader.verified,
    dateModified: leader.verified,
    url: `https://sourcescore.org/grade/${letter}/${dimSegment}/`,
    mainEntity: {
      "@type": "DefinedTerm",
      name: `${grade} grade by ${dimMeta.label}`,
      description: `Composite ${grade}-tier (range ${gradeRange(grade)}) sources, re-sorted by ${dimMeta.label}. Mean ${dimMeta.short} = ${dimMean}; mean composite = ${compositeMean}.`,
      inDefinedTermSet: `https://sourcescore.org/methodology/${dimMeta.routeSegment}/`,
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

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="text-caption text-dim mb-6 flex gap-2 flex-wrap"
      >
        <a href="/" className="hover:text-text">
          SourceScore
        </a>
        <span aria-hidden="true">/</span>
        <a href="/grade/" className="hover:text-text">
          Grades
        </a>
        <span aria-hidden="true">/</span>
        <a href={`/grade/${letter}/`} className="hover:text-text">
          {grade}
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">By {dimMeta.short}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {grade} TIER · BY {dimMeta.short.toUpperCase()} ·{" "}
        {items.length} sources
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        <span className={gradeColorClass(grade)}>{grade}</span>-tier sources{" "}
        <span className="text-brand">by {dimMeta.label}</span>
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        The same {items.length} sources that hold composite SourceScore{" "}
        <strong className={gradeColorClass(grade)}>{grade}</strong>{" "}
        ({gradeRange(grade)}) re-ranked by {dimMeta.label} only.{" "}
        <strong className="text-text">{leader.name}</strong> takes the top
        position at{" "}
        <span className={gradeColorClass(leader.scores[dim].grade)}>
          {leader.scores[dim].grade} · {leader.scores[dim].value}
        </span>
        .
      </p>

      {/* Callout — biggest mover */}
      {biggestUp && biggestUp.delta > 0 && (
        <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
          <div className="text-eyebrow text-brand mb-2">Biggest mover</div>
          <p className="text-heading-2 font-bold text-text leading-snug">
            <a
              href={`/source/${biggestUp.s.slug}/`}
              className="hover:text-brand transition-colors"
            >
              {biggestUp.s.name}
            </a>{" "}
            jumps {biggestUp.delta} positions in the {dimMeta.short} ranking
            vs the composite — punches above weight on {dimMeta.label}.
          </p>
        </section>
      )}

      {/* MEANS GRID */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">
            {dimMeta.short} mean
          </div>
          <div className="font-bold text-text text-heading-3">{dimMean}</div>
          <div className="text-caption text-muted mt-1">
            Average {dimMeta.short} across these {items.length} sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Composite mean</div>
          <div className="font-bold text-text text-heading-3">
            {compositeMean}
          </div>
          <div className="text-caption text-muted mt-1">
            Average SourceScore Index across the same sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Δ vs composite</div>
          <div
            className={`font-bold text-heading-3 ${
              dimMean > compositeMean
                ? "text-pos"
                : dimMean < compositeMean
                  ? "text-neg"
                  : "text-text"
            }`}
          >
            {dimMean > compositeMean ? "+" : ""}
            {dimMean - compositeMean}
          </div>
          <div className="text-caption text-muted mt-1">
            {dimMean > compositeMean
              ? `These ${grade}-tier sources score higher on ${dimMeta.short}`
              : dimMean < compositeMean
                ? `These ${grade}-tier sources score lower on ${dimMeta.short}`
                : "Same as composite mean"}
          </div>
        </div>
      </section>

      {/* SIBLING DIMS chips */}
      <section className="mb-8">
        <div className="text-eyebrow text-brand mb-3">
          Same tier, different signal
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/grade/${letter}/`}
            className="px-3 py-1.5 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
          >
            Composite Index (default)
          </a>
          {otherDims.map((d) => (
            <a
              key={d}
              href={`/grade/${letter}/${DIMENSION_META[d].routeSegment}/`}
              className="px-3 py-1.5 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
            >
              By {DIMENSION_META[d].short}
            </a>
          ))}
        </div>
      </section>

      {/* Ranked list */}
      <ol className="space-y-3 mb-12">
        {items.map((s, i) => {
          const baseRank = baseRankBySlug.get(s.slug) ?? i + 1;
          const rankDelta = baseRank - (i + 1);
          return (
            <li
              key={s.slug}
              className="flex items-start gap-4 p-4 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
            >
              <div className="text-display-3 font-bold tracking-tight text-brand w-12 flex-shrink-0 leading-none pt-1">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <a
                    href={`/source/${s.slug}/`}
                    className="font-bold text-text hover:text-brand text-heading-3"
                  >
                    {s.name}
                  </a>
                  <span className="text-caption text-dim font-mono">
                    {s.domain}
                  </span>
                  {rankDelta !== 0 && (
                    <span
                      className={`text-caption font-mono ${
                        rankDelta > 0 ? "text-pos" : "text-neg"
                      }`}
                      title={`${rankDelta > 0 ? "Up" : "Down"} ${Math.abs(rankDelta)} vs composite Index ranking`}
                    >
                      {rankDelta > 0 ? "↑" : "↓"}
                      {Math.abs(rankDelta)}
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-muted leading-snug mb-2">
                  {s.summary}
                </p>
                <div className="flex gap-3 text-caption flex-wrap">
                  <span>
                    <span className="text-dim">{dimMeta.short} </span>
                    <strong className={gradeColorClass(s.scores[dim].grade)}>
                      {s.scores[dim].grade} · {s.scores[dim].value}
                    </strong>
                  </span>
                  <span className="text-dim">·</span>
                  <span>
                    <span className="text-dim">Index </span>
                    <strong className={gradeColorClass(s.scores.index.grade)}>
                      {s.scores.index.grade} · {s.scores.index.value}
                    </strong>
                  </span>
                </div>
              </div>
              <ScoreBadge
                value={s.scores[dim].value}
                grade={s.scores[dim].grade}
                label={dimMeta.short}
                size="sm"
              />
            </li>
          );
        })}
      </ol>

      {/* Editorial */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">
          Why this ranking is different
        </h2>
        <p>
          The composite SourceScore Index averages all three sub-scores —
          Citation Discipline, Modern Reference, and Citation Velocity. This
          page surfaces the SAME composite-{grade} sources but ranks ONLY by{" "}
          <strong className="text-text">{dimMeta.label}</strong>. Sources can
          hold the same composite grade with very different sub-score
          profiles — this view reveals the ranking that emerges when one
          dimension is the only signal.
        </p>
        <p>
          Use this view when {dimMeta.label.toLowerCase()} is the
          decision-relevant signal for your citation. The composite Index is
          the safer default; this dim-faceted view is the precision lens.
        </p>
      </section>

      {/* Methodology cross-link */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={`/grade/${letter}/`} className="text-brand hover:underline">
          ← {grade} tier (composite Index)
        </a>
        <span className="text-dim">·</span>
        <a
          href={`/methodology/${dimMeta.routeSegment}/`}
          className="text-muted hover:text-brand"
        >
          {dimMeta.label} methodology →
        </a>
        <span className="text-dim">·</span>
        <a href="/grade/" className="text-muted hover:text-brand">
          All grades →
        </a>
      </nav>
    </article>
  );
}
