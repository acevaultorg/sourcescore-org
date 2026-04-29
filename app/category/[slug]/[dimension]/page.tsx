import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  sources,
  allCategories,
  categorySlug,
  categoryFromSlug,
  sourcesInCategory,
} from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import { gradeColorClass } from "@/lib/types";

// Day 20 — Category × dimension intersection pages.
// Layer 5 archetype stack:
//   - programmatic_unique_data_page  ×+55
//   - ai_visibility_optimized_page   ×+70
//   - internal_linking_hub_spoke     ×+15
//   - schema_markup_article_person_org ×+20
//   - sitemap_addition               ×+12
//   - faceted_filtering              ×+25 (category × dim slice)
//
// 12 categories × 3 dimensions = 36 ranked-leaderboard pages, each
// targeting "best [category] sources by [dimension]" search intent.
// Coexists with /category/[slug]/grade/[letter]/ — Next.js routes the
// literal `grade` segment first; this dynamic [dimension] only matches
// the 3 valid dim slugs.

type DimensionKey = "discipline" | "modern-reference" | "velocity";

type DimensionMeta = {
  key: "discipline" | "modernReference" | "velocity";
  pathSegment: DimensionKey;
  label: string;
  short: string;
  description: string;
  weight: string;
  methodologyHref: string;
  rankingHref: string;
};

const DIMS: Record<DimensionKey, DimensionMeta> = {
  discipline: {
    key: "discipline",
    pathSegment: "discipline",
    label: "Citation Discipline",
    short: "Discipline",
    description:
      "How rigorously each source backs its factual claims with verifiable evidence.",
    weight: "35%",
    methodologyHref: "/methodology/citation-discipline/",
    rankingHref: "/discipline/",
  },
  "modern-reference": {
    key: "modernReference",
    pathSegment: "modern-reference",
    label: "Modern Citation Reference",
    short: "Modern Reference",
    description:
      "How fit each source is for citation in modern (LLM-era) writing — machine-readability, schema, freshness signals, AI-corpus presence.",
    weight: "30%",
    methodologyHref: "/methodology/modern-reference/",
    rankingHref: "/modern-reference/",
  },
  velocity: {
    key: "velocity",
    pathSegment: "velocity",
    label: "Citation Velocity",
    short: "Velocity",
    description:
      "How often tier-1 publications and AI engines cite each source per week — the most volatile sub-score.",
    weight: "35%",
    methodologyHref: "/methodology/citation-velocity/",
    rankingHref: "/velocity/",
  },
};

const DIM_KEYS: DimensionKey[] = ["discipline", "modern-reference", "velocity"];

export function generateStaticParams() {
  const params: Array<{ slug: string; dimension: string }> = [];
  for (const c of allCategories) {
    const s = categorySlug(c);
    for (const d of DIM_KEYS) {
      params.push({ slug: s, dimension: d });
    }
  }
  return params;
}

type PageProps = { params: Promise<{ slug: string; dimension: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, dimension } = await params;
  if (!DIM_KEYS.includes(dimension as DimensionKey)) {
    return { title: "Category × dimension not found" };
  }
  const category = categoryFromSlug(slug);
  if (!category) return { title: "Category not found" };

  const dim = DIMS[dimension as DimensionKey];
  const list = [...sourcesInCategory(category)].sort(
    (a, b) => b.scores[dim.key].value - a.scores[dim.key].value
  );
  const top = list[0];
  const ogImage = `https://sourcescore.org/og/category/${slug}.svg`;
  const description = top
    ? `${list.length} ${category.toLowerCase()} sources ranked by ${dim.label}. Top: ${top.name} (${top.scores[dim.key].grade} · ${top.scores[dim.key].value}).`
    : `${list.length} ${category.toLowerCase()} sources ranked by ${dim.label}.`;

  return {
    title: `${category} sources ranked by ${dim.label} — SourceScore`,
    description: description.slice(0, 200),
    alternates: {
      canonical: `https://sourcescore.org/category/${slug}/${dimension}/`,
    },
    openGraph: {
      title: `${category} × ${dim.short} — SourceScore`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/category/${slug}/${dimension}/`,
      type: "article",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: `${category} × ${dim.short}` },
      ],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function CategoryDimensionPage({ params }: PageProps) {
  const { slug, dimension } = await params;
  if (!DIM_KEYS.includes(dimension as DimensionKey)) notFound();
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const dim = DIMS[dimension as DimensionKey];
  const list = [...sourcesInCategory(category)].sort(
    (a, b) => b.scores[dim.key].value - a.scores[dim.key].value
  );
  const top = list[0];

  // Category mean for this dimension
  const catMean =
    list.length > 0
      ? Math.round(list.reduce((a, s) => a + s.scores[dim.key].value, 0) / list.length)
      : 0;

  // Global mean across the whole dataset for context
  const globalMean = Math.round(
    sources.reduce((a, s) => a + s.scores[dim.key].value, 0) / sources.length
  );

  const otherDims = DIM_KEYS.filter((d) => d !== dimension);

  // JSON-LD ItemList for LLM extraction-bait
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} sources ranked by ${dim.label}`,
    description: `${list.length} ${category.toLowerCase()} sources scored on ${dim.label} — category mean ${catMean}, global mean ${globalMean}.`,
    url: `https://sourcescore.org/category/${slug}/${dimension}/`,
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
        headline: `${top.name} leads ${category.toLowerCase()} on ${dim.label}`,
        description: `${top.name} scores ${top.scores[dim.key].grade} · ${top.scores[dim.key].value} on ${dim.label}, the highest among ${list.length} ${category.toLowerCase()} sources on SourceScore.`,
        author: { "@type": "Organization", name: "SourceScore" },
        publisher: { "@type": "Organization", name: "SourceScore" },
        datePublished: top.verified,
        dateModified: top.verified,
        url: `https://sourcescore.org/category/${slug}/${dimension}/`,
        mainEntity: {
          "@type": "DefinedTerm",
          name: `${dim.label} (${category})`,
          description: `${dim.label} ranking among ${list.length} ${category.toLowerCase()} sources. Mean: ${catMean}. Top source: ${top.name} (${top.scores[dim.key].grade} · ${top.scores[dim.key].value}).`,
          inDefinedTermSet: `https://sourcescore.org${dim.methodologyHref}`,
        },
      }
    : null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
        <a href="/sources/" className="hover:text-text">Sources</a>
        <span aria-hidden="true">/</span>
        <a href={`/category/${slug}/`} className="hover:text-text">{category}</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{dim.short}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {category.toUpperCase()} · {dim.short.toUpperCase()} · {list.length} sources
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        {category} sources ranked by{" "}
        <span className="text-brand">{dim.label}</span>
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {dim.description}
      </p>

      {/* TOP-OF-CATEGORY CALLOUT — quote-ready ─────────── */}
      {top && (
        <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
          <div className="text-eyebrow text-brand mb-2">Category leader</div>
          <p className="text-heading-2 font-bold text-text leading-snug">
            <a
              href={`/${dim.pathSegment}/${top.slug}/`}
              className="hover:text-brand transition-colors"
            >
              {top.name}
            </a>{" "}
            leads {category.toLowerCase()} on {dim.label} —{" "}
            <span className={`${gradeColorClass(top.scores[dim.key].grade)}`}>
              {top.scores[dim.key].grade} · {top.scores[dim.key].value}
            </span>
            <span className="text-muted font-normal text-body-lg">
              {" "}
              · {list.length} sources scored
            </span>
          </p>
        </section>
      )}

      {/* MEAN/CONTEXT GRID ──────────────────────────────── */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Category mean</div>
          <div className="font-bold text-text text-heading-3">{catMean}</div>
          <div className="text-caption text-muted mt-1">
            Average {dim.short} across {list.length} {category.toLowerCase()} sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Global mean</div>
          <div className="font-bold text-text text-heading-3">{globalMean}</div>
          <div className="text-caption text-muted mt-1">
            Average across all SourceScore sources
          </div>
        </div>
        <div className="p-4 rounded-card border border-border bg-panel">
          <div className="text-eyebrow text-brand mb-1">Δ vs global</div>
          <div className="font-bold text-text text-heading-3">
            {catMean > globalMean ? "+" : ""}
            {catMean - globalMean}
          </div>
          <div className="text-caption text-muted mt-1">
            {catMean > globalMean
              ? `${category} averages above global on ${dim.short}`
              : catMean < globalMean
                ? `${category} averages below global on ${dim.short}`
                : "Equal to global mean"}
          </div>
        </div>
      </section>

      {/* RANKED LEADERBOARD ─────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-heading-1 font-bold tracking-tight mb-5">
          {category} ranked by {dim.short}
        </h2>
        <ol className="space-y-2">
          {list.map((s, i) => {
            const score = s.scores[dim.key];
            const delta = score.value - catMean;
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
                      href={`/${dim.pathSegment}/${s.slug}/`}
                      className="font-semibold text-text hover:text-brand"
                    >
                      {s.name}
                    </a>
                    <span className="text-caption text-dim font-mono">{s.domain}</span>
                  </div>
                  <p className="text-body-sm text-muted leading-snug line-clamp-2 mb-2">
                    {score.rationale}
                  </p>
                  <div className="text-caption text-dim flex flex-wrap gap-3">
                    <span>
                      vs cat. mean:{" "}
                      <span
                        className={
                          delta > 0
                            ? "text-pos"
                            : delta < 0
                              ? "text-neg"
                              : "text-text"
                        }
                      >
                        {delta > 0 ? "+" : ""}
                        {delta}
                      </span>
                    </span>
                    <span>·</span>
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
                  label={dim.short}
                />
              </li>
            );
          })}
        </ol>
      </section>

      {/* OTHER DIMENSIONS FOR THIS CATEGORY ─────────────── */}
      <section className="mb-10 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Other {category} rankings
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a
            href={`/category/${slug}/`}
            className="block p-4 rounded-card border border-brand/40 bg-surface-brand hover:bg-brand/15 transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">SourceScore Index</div>
            <div className="text-body-sm text-text">Composite ranking</div>
            <div className="text-caption text-muted mt-1">
              All {list.length} sources by overall score
            </div>
          </a>
          {otherDims.map((d) => {
            const om = DIMS[d];
            const omTop = [...list].sort(
              (a, b) => b.scores[om.key].value - a.scores[om.key].value
            )[0];
            return (
              <a
                key={d}
                href={`/category/${slug}/${d}/`}
                className="block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
              >
                <div className="text-eyebrow text-brand mb-1">{om.short}</div>
                {omTop ? (
                  <>
                    <div className="text-body-sm text-text">{omTop.name}</div>
                    <div className="text-caption text-muted mt-1">
                      Leader · {omTop.scores[om.key].grade} ·{" "}
                      {omTop.scores[om.key].value}
                    </div>
                  </>
                ) : (
                  <div className="text-body-sm text-text">No sources</div>
                )}
              </a>
            );
          })}
        </div>
      </section>

      {/* OTHER CATEGORIES ON THIS DIMENSION ─────────────── */}
      <section className="border-t border-border pt-8 mb-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Other categories on {dim.short}
        </h2>
        <div className="flex flex-wrap gap-2">
          {allCategories
            .filter((c) => c !== category)
            .map((c) => (
              <a
                key={c}
                href={`/category/${categorySlug(c)}/${dimension}/`}
                className="px-3 py-1.5 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm text-muted hover:text-text transition-colors"
              >
                {c}
              </a>
            ))}
        </div>
      </section>

      {/* Bottom nav */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={`/category/${slug}/`} className="text-muted hover:text-brand">
          ← All {category} sources
        </a>
        <span className="text-dim">·</span>
        <a href={dim.rankingHref} className="text-muted hover:text-brand">
          All sources ranked by {dim.short} →
        </a>
        <span className="text-dim">·</span>
        <a href={dim.methodologyHref} className="text-muted hover:text-brand">
          {dim.short} methodology →
        </a>
      </nav>
    </article>
  );
}
