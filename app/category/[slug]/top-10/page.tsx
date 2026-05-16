import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allCategories,
  categorySlug,
  categoryFromSlug,
  sourcesInCategory,
} from "@/data/sources";
import { ALL_DIMENSIONS, DIMENSION_META } from "@/data/best-lists";
import { gradeColorClass } from "@/lib/types";
import { ScoreBadge } from "@/components/ScoreBadge";
import { breadcrumbListSchema, datasetSchema } from "@/lib/methodology-version";

// Day 28 — Per-category top-10 fixed-N leaderboard.
// Distinct from Day 20 `/category/<slug>/<dim>/` which lists ALL sources
// in the category. Day 28 caps at 10 — the "top 10 [category] sources"
// query intent. Sibling pages at /top-10/<dim>/ re-rank the SAME pool by
// dimension. Generated only for categories with ≥10 sources (Academic 19,
// Government 30, Magazine 12, News 27, Tech News 11) — 5 of 12 categories.
//
// Layer 5 archetype stack:
//   programmatic_unique_data_page × +55 (per-category × top-N)
//   ai_visibility_optimized_page × +70 (cite-ready "top 10 X" claims)
//   internal_linking_hub_spoke × +15 (every entry → /source/)
//   schema_markup_article_person_org × +20 (ItemList + Article)
//   sitemap_addition × +12

const TOP_N = 10;
const MIN_CATEGORY_SIZE = 10;

function eligibleCategories() {
  return allCategories.filter(
    (c) => sourcesInCategory(c).length >= MIN_CATEGORY_SIZE,
  );
}

export function generateStaticParams() {
  return eligibleCategories().map((c) => ({ slug: categorySlug(c) }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return { title: "Page not found" };
  const list = sourcesInCategory(category);
  if (list.length < MIN_CATEGORY_SIZE) return { title: "Page not found" };

  const top = list.slice(0, TOP_N);
  const leader = top[0];
  const tenth = top[TOP_N - 1];

  const title = `Top 10 ${category.toLowerCase()} sources — SourceScore`;
  const description = `The 10 highest-scoring ${category.toLowerCase()} sources by composite SourceScore Index. ${leader.name} leads at ${leader.scores.index.grade} (${leader.scores.index.value}/100); ${tenth.name} closes the list at ${tenth.scores.index.grade} (${tenth.scores.index.value}).`;

  // Re-use the parent-category OG image
  const ogImage = `https://sourcescore.org/og/category/${slug}.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sourcescore.org/category/${slug}/top-10/`,
      types: {
        "application/json": `https://sourcescore.org/api/category/${slug}/top-10.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/category/${slug}/top-10/`,
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

export default async function CategoryTopNPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const fullList = sourcesInCategory(category);
  if (fullList.length < MIN_CATEGORY_SIZE) notFound();

  const items = fullList.slice(0, TOP_N);
  const leader = items[0];

  const indexMean = Math.round(
    items.reduce((a, s) => a + s.scores.index.value, 0) / items.length,
  );
  const categoryMean = Math.round(
    fullList.reduce((a, s) => a + s.scores.index.value, 0) / fullList.length,
  );

  // JSON-LD: ItemList + Article
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top 10 ${category.toLowerCase()} sources by SourceScore Index`,
    description: `The 10 highest-scoring ${category.toLowerCase()} sources from a ${fullList.length}-source category. Mean Index: ${indexMean}.`,
    url: `https://sourcescore.org/category/${slug}/top-10/`,
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
    headline: `Top 10 ${category.toLowerCase()} sources — SourceScore`,
    description: `${leader.name} leads top-10 ${category.toLowerCase()} sources at ${leader.scores.index.grade} (${leader.scores.index.value}/100).`,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: leader.verified,
    dateModified: leader.verified,
    url: `https://sourcescore.org/category/${slug}/top-10/`,
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
            ])
          ),
        }}
      />
      {/* Dataset schema — per-category top-10 JSON twin */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `Top 10 ${category.toLowerCase()} sources — SourceScore`,
              description: `The 10 highest-scoring ${category.toLowerCase()} sources by composite SourceScore Index. From a ${fullList.length}-source category. Mean Index of top 10: ${indexMean}; category mean: ${categoryMean}. Leader: ${leader.name}.`,
              url: `https://sourcescore.org/category/${slug}/top-10/`,
              apiUrl: `https://sourcescore.org/api/category/${slug}/top-10.json`,
              identifier: `category-${slug}--top-10`,
              keywords: [
                "AI citation",
                "SourceScore",
                category,
                "top 10",
                "ranked",
              ],
              dateModified: leader.verified,
              isPartOf: {
                name: `${category} catalog`,
                url: `https://sourcescore.org/category/${slug}/`,
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
        <span className="text-muted">Top 10</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        TOP 10 · {category.toUpperCase()} · {fullList.length} sources in
        category
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Top 10 <span className="text-brand">{category.toLowerCase()}</span>{" "}
        sources
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        The 10 highest-scoring {category.toLowerCase()} sources by composite
        SourceScore Index, drawn from {fullList.length} sources in the
        category. <strong className="text-text">{leader.name}</strong> leads
        at{" "}
        <span className={gradeColorClass(leader.scores.index.grade)}>
          {leader.scores.index.grade} · {leader.scores.index.value}
        </span>
        .
      </p>

      {/* MEANS GRID */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Top-10 mean</div>
          <div className="font-bold text-text text-heading-3">{indexMean}</div>
          <div className="text-caption text-muted mt-1">
            Average Index across these 10 sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">
            {category} mean
          </div>
          <div className="font-bold text-text text-heading-3">
            {categoryMean}
          </div>
          <div className="text-caption text-muted mt-1">
            Average across all {fullList.length} {category.toLowerCase()}{" "}
            sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Δ vs category</div>
          <div
            className={`font-bold text-heading-3 ${
              indexMean > categoryMean ? "text-pos" : "text-neg"
            }`}
          >
            +{indexMean - categoryMean}
          </div>
          <div className="text-caption text-muted mt-1">
            Top-10 lift over the full {category.toLowerCase()} cohort
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
            className="px-3 py-1.5 rounded-btn border border-brand/40 bg-surface-brand text-body-sm text-brand"
          >
            Composite Index (default)
          </a>
          {ALL_DIMENSIONS.map((d) => (
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
        {items.map((s, i) => (
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
              </div>
              <p className="text-body-sm text-muted leading-snug mb-2">
                {s.summary}
              </p>
              <div className="flex gap-3 text-caption flex-wrap">
                <span>
                  <span className="text-dim">Disc </span>
                  <strong className={gradeColorClass(s.scores.discipline.grade)}>
                    {s.scores.discipline.grade} · {s.scores.discipline.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Mod-Ref </span>
                  <strong
                    className={gradeColorClass(s.scores.modernReference.grade)}
                  >
                    {s.scores.modernReference.grade} ·{" "}
                    {s.scores.modernReference.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Vel </span>
                  <strong className={gradeColorClass(s.scores.velocity.grade)}>
                    {s.scores.velocity.grade} · {s.scores.velocity.value}
                  </strong>
                </span>
              </div>
            </div>
            <ScoreBadge
              value={s.scores.index.value}
              grade={s.scores.index.grade}
              label="Index"
              size="sm"
            />
          </li>
        ))}
      </ol>

      {/* Editorial */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">
          How we picked these 10
        </h2>
        <p>
          The composite SourceScore Index averages three sub-scores — Citation
          Discipline (35%), Modern Citation Reference (30%), and Citation
          Velocity (35%) — into a single 0-100 number per source. This page
          surfaces the 10 highest composite scores within{" "}
          <strong className="text-text">{category.toLowerCase()}</strong>{" "}
          ({fullList.length} total). Use the sibling chips above to re-rank
          the same 10 sources by a single dimension instead.
        </p>
        <p>
          Top-10 mean is{" "}
          <strong className="text-text">+{indexMean - categoryMean}</strong>{" "}
          points above the full-category mean — the lift is the value of the
          shortlist. {fullList.length - TOP_N} sources sit below this bar
          but stay viable in their category page.
        </p>
      </section>

      {/* Cross-links */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={`/category/${slug}/`} className="text-brand hover:underline">
          ← All {fullList.length} {category.toLowerCase()} sources
        </a>
        <span className="text-dim">·</span>
        <a href="/best/" className="text-muted hover:text-brand">
          Curated best-lists →
        </a>
        <span className="text-dim">·</span>
        <a href="/grade/" className="text-muted hover:text-brand">
          Browse by grade →
        </a>
      </nav>
    </article>
  );
}
