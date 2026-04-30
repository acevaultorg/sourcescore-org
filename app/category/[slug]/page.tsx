import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allCategories,
  categorySlug,
  categoryFromSlug,
  sourcesInCategory,
} from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import { allGrades, gradeSlug, gradeRange, gradeColorClass } from "@/lib/types";

// Programmatic-SEO category pages — one per unique category in the dataset.
// Each is a fully static page rendered at build time with generateStaticParams.
// Layer 5 archetype: programmatic_unique_data_page × +55 (per bot-harvest.md).

export function generateStaticParams() {
  return allCategories.map((c) => ({ slug: categorySlug(c) }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return { title: "Category not found" };

  const list = sourcesInCategory(category);
  const top = list[0];
  const ogImage = `https://sourcescore.org/og/category/${slug}.svg`;
  const description = `${list.length} ${category.toLowerCase()} sources scored across Citation Discipline, Modern Reference, and Citation Velocity. Top source: ${top?.name} (${top?.scores.index.grade} ${top?.scores.index.value}).`;
  return {
    title: `${category} — sources scored on the SourceScore Index`,
    description,
    alternates: { canonical: `https://sourcescore.org/category/${slug}/` },
    openGraph: {
      title: `${category} — SourceScore`,
      description,
      url: `https://sourcescore.org/category/${slug}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${category} on SourceScore` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const list = sourcesInCategory(category);
  const avgIndex =
    list.length > 0
      ? Math.round(list.reduce((a, s) => a + s.scores.index.value, 0) / list.length)
      : 0;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/sources/" className="hover:text-text">Sources</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{category}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Category · {list.length} sources</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        {category} — scored on the SourceScore Index
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-6">
        {list.length} sources in the {category.toLowerCase()} category, ranked by SourceScore Index.
        Average Index across this category: <strong className="text-text">{avgIndex}</strong>.
      </p>

      {/* Dimension-faceted children — Day 20 leaderboards per sub-score */}
      <section className="mb-8">
        <div className="text-eyebrow text-brand mb-3">
          Rank {category.toLowerCase()} by sub-score
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { path: "discipline", short: "Citation Discipline", key: "discipline" },
              { path: "modern-reference", short: "Modern Reference", key: "modernReference" },
              { path: "velocity", short: "Citation Velocity", key: "velocity" },
            ] as const
          ).map((d) => {
            const sortedTop = [...list].sort(
              (a, b) => b.scores[d.key].value - a.scores[d.key].value
            )[0];
            return (
              <a
                key={d.path}
                href={`/category/${slug}/${d.path}/`}
                className="inline-flex items-baseline gap-2 px-4 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 text-body-sm transition-colors"
              >
                <span className="font-semibold text-text">{d.short}</span>
                {sortedTop && (
                  <>
                    <span className="text-dim">·</span>
                    <span className="text-muted">
                      <span className="text-brand font-semibold">
                        {sortedTop.name.split(" ")[0]}
                      </span>{" "}
                      leads
                    </span>
                  </>
                )}
              </a>
            );
          })}
        </div>
      </section>

      {/* Grade-faceted children — only show grades that have ≥1 source in this category */}
      <section className="mb-10">
        <div className="text-eyebrow text-brand mb-3">Filter {category.toLowerCase()} by grade</div>
        <div className="flex flex-wrap gap-2">
          {allGrades
            .map((g) => ({ g, count: list.filter((s) => s.scores.index.grade === g).length }))
            .filter(({ count }) => count > 0)
            .map(({ g, count }) => (
              <a
                key={g}
                href={`/category/${slug}/grade/${gradeSlug(g)}/`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm transition-colors"
              >
                <span className={`font-bold ${gradeColorClass(g)}`}>{g}</span>
                <span className="text-dim font-mono text-caption">{gradeRange(g)}</span>
                <span className="text-muted">{count}</span>
              </a>
            ))}
        </div>
      </section>

      <ol className="space-y-2 mb-12">
        {list.map((s, i) => (
          <li
            key={s.slug}
            className="flex items-center gap-4 p-3 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <span className="text-caption text-dim font-mono w-6 text-right">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <a href={`/source/${s.slug}/`} className="font-semibold text-text hover:text-brand">
                {s.name}
              </a>
              <div className="text-caption text-dim font-mono">{s.domain}</div>
              <div className="text-body-sm text-muted leading-snug mt-1 line-clamp-1">
                {s.summary}
              </div>
            </div>
            <ScoreBadge
              value={s.scores.index.value}
              grade={s.scores.index.grade}
              label="SourceScore Index"
              size="sm"
            />
          </li>
        ))}
      </ol>

      {/* Day 28 — Top-10 leaderboard (only when category has ≥10 sources) */}
      {list.length >= 10 && (
        <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
          <div className="text-eyebrow text-brand mb-2">Top 10 leaderboard</div>
          <h2 className="text-heading-2 font-bold text-text mb-2">
            Just want the top 10 {category.toLowerCase()} sources?
          </h2>
          <p className="text-body-sm text-muted leading-relaxed mb-4">
            Drilled-down leaderboard of the 10 highest-scoring{" "}
            {category.toLowerCase()} sources, with sibling views by Citation
            Discipline, Modern Reference, and Citation Velocity.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/category/${slug}/top-10/`}
              className="px-4 py-2 rounded-btn border border-brand/40 bg-panel text-body-sm text-brand font-semibold hover:bg-panel-hi"
            >
              Top 10 by Index →
            </a>
            <a
              href={`/category/${slug}/top-10/discipline/`}
              className="px-3 py-2 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
            >
              By Discipline
            </a>
            <a
              href={`/category/${slug}/top-10/modern-reference/`}
              className="px-3 py-2 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
            >
              By Modern Reference
            </a>
            <a
              href={`/category/${slug}/top-10/velocity/`}
              className="px-3 py-2 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40"
            >
              By Velocity
            </a>
          </div>
        </section>
      )}

      <section className="border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">Other categories</h2>
        <div className="flex flex-wrap gap-2">
          {allCategories
            .filter((c) => c !== category)
            .map((c) => (
              <a
                key={c}
                href={`/category/${categorySlug(c)}/`}
                className="px-3 py-1.5 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm text-muted hover:text-text transition-colors"
              >
                {c}
              </a>
            ))}
        </div>
      </section>
    </article>
  );
}
