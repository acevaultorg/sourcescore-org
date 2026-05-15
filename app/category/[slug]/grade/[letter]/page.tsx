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
import {
  allGrades,
  gradeFromSlug,
  gradeSlug,
  gradeLabel,
  gradeRange,
  gradeColorClass,
  type GradeLetter,
} from "@/lib/types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

// Cross-faceted programmatic-SEO route — /category/<cat>/grade/<letter>/.
// Targets long-tail queries like "A-grade news sources for AI citation",
// "B-grade academic journals", "F-grade tabloids" — 12 categories × 6 grades
// = up to 72 facets. We emit ONLY facets with ≥1 source (HCU-safe; no thin
// pages). The route is fully prerendered via generateStaticParams.
//
// Layer 5 archetype stack per facet page:
//   programmatic_unique_data_page × +55  (one URL per cat × grade intersect)
//   internal_linking_hub_spoke    × +15  (links to /source/, /category/, /grade/)
//   ai_visibility_optimized_page  × +70  (extractable headings, scoped POV)
//   schema_markup_article_person_org × +20  (Article schema with about[])
//   sitemap_addition × +12

type FacetParams = { slug: string; letter: string };

export function generateStaticParams(): FacetParams[] {
  // Emit only intersections that have ≥1 source — avoids HCU thin-content
  // signal on empty facet pages.
  const params: FacetParams[] = [];
  for (const category of allCategories) {
    for (const grade of allGrades) {
      const has = sources.some(
        (s) => s.category === category && s.scores.index.grade === grade
      );
      if (has) params.push({ slug: categorySlug(category), letter: gradeSlug(grade) });
    }
  }
  return params;
}

type PageProps = { params: Promise<FacetParams> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, letter } = await params;
  const category = categoryFromSlug(slug);
  const grade = gradeFromSlug(letter);
  if (!category || !grade) return { title: "Facet not found" };

  const list = sources.filter(
    (s) => s.category === category && s.scores.index.grade === grade
  );
  if (list.length === 0) return { title: "Facet not found" };

  const ogImage = `https://sourcescore.org/og/grade/${letter}.svg`;
  const description = `${list.length} ${grade}-grade ${category.toLowerCase()} source${list.length === 1 ? "" : "s"} on the SourceScore Index — ${gradeLabel(grade)} citation quality across Discipline, Modern Reference, and Velocity. Score range ${gradeRange(grade)}.`;

  return {
    title: `${grade}-grade ${category} sources — SourceScore`,
    description,
    alternates: {
      canonical: `https://sourcescore.org/category/${slug}/grade/${letter}/`,
    },
    openGraph: {
      title: `${grade} ${category} sources`,
      description,
      url: `https://sourcescore.org/category/${slug}/grade/${letter}/`,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${grade}-grade ${category} sources on SourceScore`,
        },
      ],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function CategoryGradeFacetPage({ params }: PageProps) {
  const { slug, letter } = await params;
  const category = categoryFromSlug(slug);
  const grade = gradeFromSlug(letter);
  if (!category || !grade) notFound();

  const list = sources
    .filter((s) => s.category === category && s.scores.index.grade === grade)
    .sort((a, b) => b.scores.index.value - a.scores.index.value);
  if (list.length === 0) notFound();

  // Sibling facets — same category, every other grade that has sources
  const categorySources = sourcesInCategory(category);
  const siblingGrades = allGrades.filter(
    (g) => g !== grade && categorySources.some((s) => s.scores.index.grade === g)
  );

  // Sibling facets — same grade, every other category that has sources
  const siblingCategories = allCategories.filter(
    (c) =>
      c !== category &&
      sources.some(
        (s) => s.category === c && s.scores.index.grade === grade
      )
  );

  // Sub-score averages within this facet
  const avg = (key: "discipline" | "modernReference" | "velocity") =>
    list.length
      ? Math.round(
          list.reduce((a, s) => a + s.scores[key].value, 0) / list.length
        )
      : 0;
  const avgDiscipline = avg("discipline");
  const avgModern = avg("modernReference");
  const avgVelocity = avg("velocity");

  // JSON-LD Article schema with full source list under about[]
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${grade}-grade ${category} sources on the SourceScore Index`,
    description: `${list.length} ${category.toLowerCase()} source${list.length === 1 ? "" : "s"} score${list.length === 1 ? "s" : ""} ${grade} on the SourceScore Index. Score range ${gradeRange(grade)}.`,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: "2026-04-28",
    dateModified: "2026-04-28",
    url: `https://sourcescore.org/category/${slug}/grade/${letter}/`,
    about: list.map((s) => ({
      "@type": "WebSite",
      name: s.name,
      url: `https://${s.domain}`,
    })),
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Sources", url: "https://sourcescore.org/sources/" },
              { name: category, url: `https://sourcescore.org/category/${slug}/` },
              { name: grade, url: `https://sourcescore.org/grade/${letter}/` },
              { name: `${grade}-grade ${category}`, url: `https://sourcescore.org/category/${slug}/grade/${letter}/` },
            ])
          ),
        }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2 flex-wrap">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/sources/" className="hover:text-text">Sources</a>
        <span aria-hidden="true">/</span>
        <a href={`/category/${slug}/`} className="hover:text-text">{category}</a>
        <span aria-hidden="true">/</span>
        <a href={`/grade/${letter}/`} className="hover:text-text">{grade}</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{grade}-grade {category}</span>
      </nav>

      <div className={`text-eyebrow mb-3 ${gradeColorClass(grade)}`}>
        {gradeLabel(grade).toUpperCase()} CITATION QUALITY · {category.toUpperCase()}
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        <span className={gradeColorClass(grade)}>{grade}</span>-grade {category} sources
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-6">
        {list.length} {category.toLowerCase()} source{list.length === 1 ? "" : "s"} score{list.length === 1 ? "s" : ""}{" "}
        <strong className="text-text">{grade}</strong> ({gradeRange(grade)}) on the SourceScore Index.
        Within this facet, the mean Citation Discipline is{" "}
        <strong className="text-text">{avgDiscipline}</strong>, Modern Reference{" "}
        <strong className="text-text">{avgModern}</strong>, and Citation Velocity{" "}
        <strong className="text-text">{avgVelocity}</strong>.
      </p>

      {/* Source list */}
      <ol className="space-y-2 mb-12">
        {list.map((s, i) => (
          <li
            key={s.slug}
            className="flex items-center gap-4 p-3 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <span className="text-caption text-dim font-mono w-6 text-right">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <a
                href={`/source/${s.slug}/`}
                className="font-semibold text-text hover:text-brand"
              >
                {s.name}
              </a>
              <div className="text-caption text-dim font-mono">{s.domain}</div>
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

      {/* Why this facet matters */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">
          What {grade}-grade {category.toLowerCase()} sources have in common
        </h2>
        <p>
          Every source on this page combines two filters: a <strong className="text-text">{category}</strong>{" "}
          publication category and a <strong className="text-text">{grade}-grade</strong> SourceScore Index.
          That intersection means these sources share a structural profile — they meet the editorial
          and citation-quality bar of {grade}-grade ({gradeRange(grade)}) AND they operate within the
          {" "}{category.toLowerCase()} category's specific publication norms.
        </p>
        <p>
          The within-facet sub-score means above ({avgDiscipline} / {avgModern} / {avgVelocity}) tell you
          how this facet differs from the {grade}-grade average overall. A higher Discipline mean than
          the {grade} average means {category.toLowerCase()} sources in this band cite more rigorously
          than other {grade}-grade categories; a lower Modern Reference mean usually flags structural
          access limitations (paywalls, legacy infrastructure) typical of {category.toLowerCase()}
          publishing.
        </p>
      </section>

      {/* Sibling-grade facets within this category */}
      {siblingGrades.length > 0 && (
        <section className="mb-10 border-t border-border pt-8">
          <h2 className="text-heading-2 font-bold mb-4">
            Other {category.toLowerCase()} grades
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {siblingGrades.map((g) => {
              const count = categorySources.filter((s) => s.scores.index.grade === g).length;
              return (
                <a
                  key={g}
                  href={`/category/${slug}/grade/${gradeSlug(g)}/`}
                  className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
                >
                  <div className={`text-eyebrow mb-1 ${gradeColorClass(g)}`}>
                    {g} · {gradeRange(g)}
                  </div>
                  <div className="font-semibold text-text">
                    {count} {category.toLowerCase()} source{count === 1 ? "" : "s"}
                  </div>
                  <div className="text-caption text-muted mt-1 capitalize">
                    {gradeLabel(g)}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Sibling-category facets within this grade */}
      {siblingCategories.length > 0 && (
        <section className="mb-10 border-t border-border pt-8">
          <h2 className="text-heading-2 font-bold mb-4">
            Other {grade}-grade categories
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {siblingCategories.map((c) => {
              const count = sources.filter(
                (s) => s.category === c && s.scores.index.grade === grade
              ).length;
              const cSlug = categorySlug(c);
              return (
                <a
                  key={c}
                  href={`/category/${cSlug}/grade/${letter}/`}
                  className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
                >
                  <div className="text-eyebrow text-brand mb-1">{c}</div>
                  <div className="font-semibold text-text">
                    {count} {grade}-grade source{count === 1 ? "" : "s"}
                  </div>
                  <div className="text-caption text-muted mt-1">
                    on the SourceScore Index
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Parent links */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={`/category/${slug}/`} className="text-muted hover:text-brand">
          ← All {category} ({categorySources.length})
        </a>
        <span className="text-dim">·</span>
        <a href={`/grade/${letter}/`} className="text-muted hover:text-brand">
          All {grade}-grade sources →
        </a>
        <span className="text-dim">·</span>
        <a href="/methodology/sourcescore-index/" className="text-muted hover:text-brand">
          Methodology + worked examples →
        </a>
      </nav>
    </article>
  );
}
