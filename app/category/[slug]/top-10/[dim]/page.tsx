import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allCategories,
  categorySlug,
  categoryFromSlug,
  sourcesInCategory,
} from "@/data/sources";
import {
  ALL_DIMENSIONS,
  DIMENSION_META,
  dimFromSegment,
  type DimensionKey,
} from "@/data/best-lists";
import { gradeColorClass } from "@/lib/types";
import { ScoreBadge } from "@/components/ScoreBadge";
import { breadcrumbListSchema, datasetSchema } from "@/lib/methodology-version";

// Day 28 — Per-category top-10 × dim facet.
// Same top-10 pool as `/category/<slug>/top-10/` (composite-sorted),
// re-sorted by ONE sub-score. Different leader, different rank deltas,
// different insight. "Of the top-10 news sources, who's BEST on
// Citation Velocity?" — different question than the composite ranking.
//
// Generated only for the 5 categories with ≥10 sources × 3 dims = 15 pages.
// Total Day 28 = 5 base + 15 dim-faceted = 20 new pages.
//
// Layer 5 archetype stack (same compound as the base):
//   programmatic_unique_data_page × +55
//   ai_visibility_optimized_page × +70
//   internal_linking_hub_spoke × +15
//   schema_markup_article_person_org × +20
//   sitemap_addition × +12

const TOP_N = 10;
const MIN_CATEGORY_SIZE = 10;

function eligibleCategories() {
  return allCategories.filter(
    (c) => sourcesInCategory(c).length >= MIN_CATEGORY_SIZE,
  );
}

export function generateStaticParams() {
  const out: Array<{ slug: string; dim: string }> = [];
  for (const cat of eligibleCategories()) {
    for (const dim of ALL_DIMENSIONS) {
      out.push({
        slug: categorySlug(cat),
        dim: DIMENSION_META[dim].routeSegment,
      });
    }
  }
  return out;
}

type PageProps = { params: Promise<{ slug: string; dim: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, dim: dimSegment } = await params;
  const category = categoryFromSlug(slug);
  const dim = dimFromSegment(dimSegment);
  if (!category || !dim) return { title: "Page not found" };
  const fullList = sourcesInCategory(category);
  if (fullList.length < MIN_CATEGORY_SIZE) return { title: "Page not found" };

  // Top-10 pool from composite, then re-sorted by dim
  const pool = fullList.slice(0, TOP_N);
  const items = [...pool].sort(
    (a, b) => b.scores[dim].value - a.scores[dim].value,
  );
  const dimMeta = DIMENSION_META[dim];
  const leader = items[0];

  const pageTitle = `Top 10 ${category.toLowerCase()} sources by ${dimMeta.label}`;
  const title = `${pageTitle} — SourceScore`;
  const description = `The top-10 ${category.toLowerCase()} sources by composite Index, re-ranked by ${dimMeta.label} only. ${leader.name} leads at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100) — different leader than the composite ranking.`;

  const ogImage = `https://sourcescore.org/og/category/${slug}.svg`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `https://sourcescore.org/category/${slug}/top-10/${dimSegment}/`,
      types: {
        "application/json": `https://sourcescore.org/api/category/${slug}/top-10/${dimSegment}.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/category/${slug}/top-10/${dimSegment}/`,
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

export default async function CategoryTopNDimPage({ params }: PageProps) {
  const { slug, dim: dimSegment } = await params;
  const category = categoryFromSlug(slug);
  const dim = dimFromSegment(dimSegment);
  if (!category || !dim) notFound();

  const fullList = sourcesInCategory(category);
  if (fullList.length < MIN_CATEGORY_SIZE) notFound();

  // Pool = top-10 by composite Index (the SAME pool as the base page)
  const pool = fullList.slice(0, TOP_N);

  // Items = same pool, re-sorted by dim
  const items = [...pool].sort(
    (a, b) => b.scores[dim].value - a.scores[dim].value,
  );
  const dimMeta = DIMENSION_META[dim];
  const leader = items[0];

  // Composite-rank lookup for "rank delta" surfacing
  const baseRankBySlug = new Map(pool.map((s, i) => [s.slug, i + 1]));

  // Means
  const dimMean = Math.round(
    items.reduce((a, s) => a + s.scores[dim].value, 0) / items.length,
  );
  const compositeMean = Math.round(
    items.reduce((a, s) => a + s.scores.index.value, 0) / items.length,
  );

  // Sibling dims
  const otherDims: DimensionKey[] = ALL_DIMENSIONS.filter((d) => d !== dim);

  // Biggest mover
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
    name: `Top 10 ${category.toLowerCase()} sources by ${dimMeta.label}`,
    description: `The 10 highest-composite ${category.toLowerCase()} sources, re-sorted by ${dimMeta.label} only. Mean ${dimMeta.short}: ${dimMean}.`,
    url: `https://sourcescore.org/category/${slug}/top-10/${dimSegment}/`,
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
    headline: `Top 10 ${category.toLowerCase()} sources by ${dimMeta.label}`,
    description: `${leader.name} leads top-10 ${category.toLowerCase()} on ${dimMeta.label} at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100).`,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: leader.verified,
    dateModified: leader.verified,
    url: `https://sourcescore.org/category/${slug}/top-10/${dimSegment}/`,
    mainEntity: {
      "@type": "DefinedTerm",
      name: `Top 10 ${category} by ${dimMeta.label}`,
      description: `Top-10 ${category.toLowerCase()} sources (composite Index) re-sorted by ${dimMeta.label}. Mean ${dimMeta.short} = ${dimMean}; mean composite = ${compositeMean}.`,
      inDefinedTermSet: `https://sourcescore.org/methodology/${dimMeta.methodologySlug}/`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Sources", url: "https://sourcescore.org/sources/" },
              { name: category, url: `https://sourcescore.org/category/${slug}/` },
              { name: "Top 10", url: `https://sourcescore.org/category/${slug}/top-10/` },
              { name: dimMeta.short, url: `https://sourcescore.org/category/${slug}/top-10/${dimSegment}/` },
            ])
          ),
        }}
      />
      {/* Dataset schema — top-10-by-dim JSON twin */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `Top 10 ${category.toLowerCase()} sources by ${dimMeta.label}`,
              description: `Top 10 ${category.toLowerCase()} sources (composite Index) re-sorted by ${dimMeta.label}. Mean ${dimMeta.short}: ${dimMean}; mean composite: ${compositeMean}. Leader on ${dimMeta.short}: ${leader.name}.`,
              url: `https://sourcescore.org/category/${slug}/top-10/${dimSegment}/`,
              apiUrl: `https://sourcescore.org/api/category/${slug}/top-10/${dimSegment}.json`,
              identifier: `category-${slug}--top-10--${dimSegment}`,
              keywords: [
                "AI citation",
                "SourceScore",
                category,
                dimMeta.label,
                "top 10",
              ],
              dateModified: leader.verified,
              isPartOf: {
                name: `Top 10 ${category.toLowerCase()}`,
                url: `https://sourcescore.org/category/${slug}/top-10/`,
              },
              about: { name: category, type: "Thing" },
            })
          ),
        }}
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
        <a href="/sources/" className="hover:text-text">
          Sources
        </a>
        <span aria-hidden="true">/</span>
        <a href={`/category/${slug}/`} className="hover:text-text">
          {category}
        </a>
        <span aria-hidden="true">/</span>
        <a
          href={`/category/${slug}/top-10/`}
          className="hover:text-text"
        >
          Top 10
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">By {dimMeta.short}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        TOP 10 {category.toUpperCase()} · BY {dimMeta.short.toUpperCase()}
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Top 10 {category.toLowerCase()}{" "}
        <span className="text-brand">by {dimMeta.label}</span>
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        The same 10 {category.toLowerCase()} sources from the composite
        top-10, re-ranked by {dimMeta.label} only.{" "}
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
            Average {dimMeta.short} across these 10 sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Composite mean</div>
          <div className="font-bold text-text text-heading-3">
            {compositeMean}
          </div>
          <div className="text-caption text-muted mt-1">
            Average SourceScore Index across the same 10 sources
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
              ? `Top-10 ${category.toLowerCase()} score higher on ${dimMeta.short}`
              : dimMean < compositeMean
                ? `Top-10 ${category.toLowerCase()} score lower on ${dimMeta.short}`
                : "Same as composite mean"}
          </div>
        </div>
      </section>

      {/* SIBLING DIM views */}
      <section className="mb-8">
        <div className="text-eyebrow text-brand mb-3">
          Same top-10 pool, different signal
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/category/${slug}/top-10/`}
            className="px-3 py-1.5 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
          >
            Composite Index (default)
          </a>
          {otherDims.map((d) => (
            <a
              key={d}
              href={`/category/${slug}/top-10/${DIMENSION_META[d].routeSegment}/`}
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
          The composite top-10 ranks by the SourceScore Index — an average of
          Citation Discipline, Modern Reference, and Citation Velocity. This
          page surfaces the SAME 10 {category.toLowerCase()} sources but
          ranks ONLY by{" "}
          <strong className="text-text">{dimMeta.label}</strong>. Sources
          that lead the composite top-10 may not lead on a single dimension —
          this view is the precision lens.
        </p>
        <p>
          Use this view when {dimMeta.label.toLowerCase()} is the
          decision-relevant signal for your citation. The composite ranking
          is the safer default; this dim-faceted view shows which top-10
          source actually leads on the dimension you care about.
        </p>
      </section>

      {/* Cross-links */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a
          href={`/category/${slug}/top-10/`}
          className="text-brand hover:underline"
        >
          ← Top 10 {category.toLowerCase()} (composite Index)
        </a>
        <span className="text-dim">·</span>
        <a
          href={`/methodology/${dimMeta.methodologySlug}/`}
          className="text-muted hover:text-brand"
        >
          {dimMeta.label} methodology →
        </a>
        <span className="text-dim">·</span>
        <a href={`/category/${slug}/`} className="text-muted hover:text-brand">
          All {fullList.length} {category.toLowerCase()} →
        </a>
      </nav>
    </article>
  );
}
