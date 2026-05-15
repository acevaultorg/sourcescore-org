import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  bestLists,
  getBestList,
  bestListSourcesByDim,
  DIMENSION_META,
  ALL_DIMENSIONS,
  dimFromSegment,
  type DimensionKey,
} from "@/data/best-lists";
import { categorySlug } from "@/data/sources";
import { gradeColorClass } from "@/lib/types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

// Day 25 — Best-list × dimension faceted leaderboards.
// Same source pool as the parent /best/<slug>/ page, re-sorted by ONE
// of the three sub-scores. Real "best X by Y" search-intent — different
// leader, different rank order, different deltas per dim. 12 best-lists
// × 3 dims = 36 new pages, +36 JSON twins.
//
// Layer 5 archetype stack per page:
//   programmatic_unique_data_page × +55  (per-list-per-dim re-sort)
//   ai_visibility_optimized_page × +70   (dim-specific quotable claims)
//   internal_linking_hub_spoke × +15     (every entry deep-links to /source/)
//   schema_markup_article_person_org × +20  (ItemList + Article + DefinedTerm)
//   sitemap_addition × +12

export function generateStaticParams() {
  // Cartesian product: every best-list × every dimension.
  const out: Array<{ slug: string; dim: string }> = [];
  for (const b of bestLists) {
    for (const dim of ALL_DIMENSIONS) {
      out.push({ slug: b.slug, dim: DIMENSION_META[dim].routeSegment });
    }
  }
  return out;
}

type PageProps = { params: Promise<{ slug: string; dim: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, dim: dimSegment } = await params;
  const list = getBestList(slug);
  const dim = dimFromSegment(dimSegment);
  if (!list || !dim) return { title: "List not found" };

  const dimMeta = DIMENSION_META[dim];
  const items = bestListSourcesByDim(slug, dim);
  if (!items || items.length === 0) return { title: "List not found" };
  const leader = items[0];

  const title = `${list.title} — ranked by ${dimMeta.label}`;
  const description = `${list.title} re-sorted by ${dimMeta.label} (one of the three SourceScore sub-scores). ${leader.name} leads at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100). Different signal, different ranking than the composite Index view.`;

  // Re-use the parent best-list's existing OG image
  const ogImage = `https://sourcescore.org/og/best/${slug}.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sourcescore.org/best/${slug}/${dimSegment}/`,
      types: {
        "application/json": `https://sourcescore.org/api/best/${slug}/${dimSegment}.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/best/${slug}/${dimSegment}/`,
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

export default async function BestListDimensionPage({ params }: PageProps) {
  const { slug, dim: dimSegment } = await params;
  const list = getBestList(slug);
  const dim = dimFromSegment(dimSegment);
  if (!list || !dim) notFound();

  const items = bestListSourcesByDim(slug, dim);
  if (!items || items.length === 0) notFound();

  const dimMeta = DIMENSION_META[dim];
  const leader = items[0];
  const trailer = items[items.length - 1];

  // Compute composite-rank vs dim-rank for each source — surfaces
  // "punches above weight" / "punches below weight" insights
  const baseList = list.select();
  const baseRankBySlug = new Map(baseList.map((s, i) => [s.slug, i + 1]));

  // Means
  const dimMean = Math.round(
    items.reduce((a, s) => a + s.scores[dim].value, 0) / items.length,
  );
  const indexMean = Math.round(
    items.reduce((a, s) => a + s.scores.index.value, 0) / items.length,
  );

  // Sibling dims for cross-link rail
  const otherDims: DimensionKey[] = ALL_DIMENSIONS.filter((d) => d !== dim);

  // JSON-LD: ItemList + Article + DefinedTerm
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title(list.title, dimMeta.label),
    description: `${list.title} ranked by ${dimMeta.label}. ${items.length} sources. Mean ${dimMeta.short} score: ${dimMean}.`,
    url: `https://sourcescore.org/best/${slug}/${dimSegment}/`,
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
    headline: title(list.title, dimMeta.label),
    description: `${leader.name} leads ${list.title.toLowerCase()} on ${dimMeta.label} at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100).`,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: leader.verified,
    dateModified: leader.verified,
    url: `https://sourcescore.org/best/${slug}/${dimSegment}/`,
    mainEntity: {
      "@type": "DefinedTerm",
      name: `${list.title} by ${dimMeta.label}`,
      description: `${list.title} re-sorted by ${dimMeta.label} only. Different signal than the composite SourceScore Index. Mean ${dimMeta.short} = ${dimMean}; mean Index = ${indexMean}.`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Best lists", url: "https://sourcescore.org/best/" },
              { name: list.intent, url: `https://sourcescore.org/best/${slug}/` },
              { name: `By ${dimMeta.short}`, url: `https://sourcescore.org/best/${slug}/${dimSegment}/` },
            ])
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
        <a href="/best/" className="hover:text-text">
          Best lists
        </a>
        <span aria-hidden="true">/</span>
        <a href={`/best/${slug}/`} className="hover:text-text">
          {list.intent}
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">By {dimMeta.short}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {list.intent.toUpperCase()} · BY {dimMeta.short.toUpperCase()}
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        {list.title} <span className="text-brand">by {dimMeta.label}</span>
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        Same {items.length} sources, re-sorted by {dimMeta.label} only —
        different signal than the composite Index. The leader changes:{" "}
        <strong className="text-text">{leader.name}</strong> takes the top
        position at{" "}
        <span className={gradeColorClass(leader.scores[dim].grade)}>
          {leader.scores[dim].grade} · {leader.scores[dim].value}
        </span>
        .
      </p>

      {/* Callout — quote-ready */}
      <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
        <div className="text-eyebrow text-brand mb-2">
          Leader by {dimMeta.short}
        </div>
        <p className="text-heading-2 font-bold text-text leading-snug">
          <a
            href={`/source/${leader.slug}/`}
            className="hover:text-brand transition-colors"
          >
            {leader.name}
          </a>{" "}
          leads {list.title.toLowerCase()} on {dimMeta.label} at{" "}
          <span className={gradeColorClass(leader.scores[dim].grade)}>
            {leader.scores[dim].grade} · {leader.scores[dim].value}
          </span>
        </p>
      </section>

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
          <div className="font-bold text-text text-heading-3">{indexMean}</div>
          <div className="text-caption text-muted mt-1">
            Average SourceScore Index across the same {items.length} sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Δ vs composite</div>
          <div
            className={`font-bold text-heading-3 ${
              dimMean > indexMean
                ? "text-pos"
                : dimMean < indexMean
                  ? "text-neg"
                  : "text-text"
            }`}
          >
            {dimMean > indexMean ? "+" : ""}
            {dimMean - indexMean}
          </div>
          <div className="text-caption text-muted mt-1">
            {dimMean > indexMean
              ? `These sources score higher on ${dimMeta.short} than overall`
              : dimMean < indexMean
                ? `These sources score lower on ${dimMeta.short} than overall`
                : "Same as composite mean"}
          </div>
        </div>
      </section>

      {/* SIBLING DIMS — cross-link chips */}
      <section className="mb-8">
        <div className="text-eyebrow text-brand mb-3">
          Same list, different signal
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/best/${slug}/`}
            className="px-3 py-1.5 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
          >
            Composite Index (default)
          </a>
          {otherDims.map((d) => (
            <a
              key={d}
              href={`/best/${slug}/${DIMENSION_META[d].routeSegment}/`}
              className="px-3 py-1.5 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
            >
              By {DIMENSION_META[d].short}
            </a>
          ))}
        </div>
      </section>

      {/* Ranked list — listicle layout */}
      <ol className="space-y-3 mb-12">
        {items.map((s, i) => {
          const baseRank = baseRankBySlug.get(s.slug);
          const rankDelta = baseRank ? baseRank - (i + 1) : 0;
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
                    <strong
                      className={gradeColorClass(s.scores.index.grade)}
                    >
                      {s.scores.index.grade} · {s.scores.index.value}
                    </strong>
                  </span>
                  <span className="text-dim">·</span>
                  <a
                    href={`/category/${categorySlug(s.category)}/`}
                    className="text-muted hover:text-brand"
                  >
                    {s.category}
                  </a>
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

      {/* Editorial rationale */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">
          Why this ranking is different
        </h2>
        <p>
          The composite SourceScore Index averages all three sub-scores —
          Citation Discipline, Modern Reference, and Citation Velocity. This
          page surfaces the SAME source pool but ranks ONLY by{" "}
          <strong className="text-text">{dimMeta.label}</strong>.
          {trailer.slug !== leader.slug && (
            <>
              {" "}
              The biggest re-shuffle: {(() => {
                const biggestUp = [...items]
                  .map((s, i) => ({
                    s,
                    delta: (baseRankBySlug.get(s.slug) ?? i + 1) - (i + 1),
                  }))
                  .sort((a, b) => b.delta - a.delta)[0];
                if (biggestUp && biggestUp.delta > 0) {
                  return (
                    <>
                      <strong className="text-text">{biggestUp.s.name}</strong>{" "}
                      jumps {biggestUp.delta} positions vs the composite Index
                      ranking
                    </>
                  );
                }
                return null;
              })()}
              .
            </>
          )}
        </p>
        <p>
          Use this view when {dimMeta.label.toLowerCase()} is the signal that
          matters for your citation decision. The composite Index is the safer
          default; this dim-faceted view is the precision lens.
        </p>
      </section>

      {/* Methodology cross-link */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a
          href={`/best/${slug}/`}
          className="text-brand hover:underline"
        >
          ← {list.title} (composite Index)
        </a>
        <span className="text-dim">·</span>
        <a
          href={`/methodology/${dimMeta.routeSegment}/`}
          className="text-muted hover:text-brand"
        >
          {dimMeta.label} methodology →
        </a>
        <span className="text-dim">·</span>
        <a href="/best/" className="text-muted hover:text-brand">
          All best-lists →
        </a>
      </nav>
    </article>
  );
}

function title(listTitle: string, dimLabel: string): string {
  return `${listTitle} — ranked by ${dimLabel}`;
}
