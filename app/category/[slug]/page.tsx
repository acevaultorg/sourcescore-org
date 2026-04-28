import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allCategories,
  categorySlug,
  categoryFromSlug,
  sourcesInCategory,
} from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";

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
  return {
    title: `${category} — sources scored on the SourceScore Index`,
    description: `${list.length} ${category.toLowerCase()} sources scored across Citation Discipline, Modern Reference, and Citation Velocity. Top source: ${top?.name} (${top?.scores.index.grade} ${top?.scores.index.value}).`,
    alternates: { canonical: `https://sourcescore.org/category/${slug}/` },
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
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {list.length} sources in the {category.toLowerCase()} category, ranked by SourceScore Index.
        Average Index across this category: <strong className="text-text">{avgIndex}</strong>.
      </p>

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
