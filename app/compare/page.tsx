import type { Metadata } from "next";
import { getSource } from "@/data/sources";
import { comparisons, comparisonSlug } from "@/data/comparisons";
import { ScoreBadge } from "@/components/ScoreBadge";
import { datasetSchema, breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "Compare sources — SourceScore" },
  description:
    `Side-by-side SourceScore comparisons. ${comparisons.length} pairs of sources across academic, news, government, and tech, compared on all three sub-scores.`,
  alternates: { canonical: "https://sourcescore.org/compare/" },
};

export default function CompareIndexPage() {
  // Group by primary category of the first source for visual scanning
  const grouped: Record<string, typeof comparisons> = {};
  comparisons.forEach((c) => {
    const a = getSource(c.a);
    if (!a) return;
    (grouped[a.category] ??= []).push(c);
  });
  const groupKeys = Object.keys(grouped).sort();

  const dsSchema = datasetSchema({
    name: "SourceScore comparator pairs",
    description: `Machine-readable JSON record of ${comparisons.length} curated source-vs-source comparison pairs scored across Citation Discipline, Modern Reference, and Citation Velocity.`,
    url: "https://sourcescore.org/compare/",
    apiUrl: "https://sourcescore.org/api/comparisons.json",
    identifier: "compare-index",
    keywords: ["source comparison", "AI citation", "SourceScore", "head-to-head", "vs"],
    dateModified: "2026-04-29",
  });

  // ItemList (2026-10-01): names every comparison this hub links to.
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SourceScore source comparisons",
    url: "https://sourcescore.org/compare/",
    numberOfItems: comparisons.length,
    itemListElement: comparisons.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://sourcescore.org/compare/${comparisonSlug(c.a, c.b)}/`,
      name: `${getSource(c.a)?.name ?? c.a} vs ${getSource(c.b)?.name ?? c.b}`,
    })),
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Compare", url: "https://sourcescore.org/compare/" },
            ])
          ),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Compare</span>
      </nav>
      <div className="text-eyebrow text-brand mb-3">{comparisons.length} comparisons</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Compare sources head-to-head
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-10">
        Two sources side by side on the SourceScore Index and its three sub-scores. Open any pair to
        see why each one scores what it does on Citation Discipline, Modern Reference, and Citation
        Velocity.
      </p>

      {groupKeys.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="text-heading-2 font-bold mb-4">{cat}</h2>
          <ol className="space-y-2">
            {grouped[cat]!.map((c) => {
              const a = getSource(c.a)!;
              const b = getSource(c.b)!;
              return (
                <li key={comparisonSlug(c.a, c.b)}>
                  <a
                    href={`/compare/${comparisonSlug(c.a, c.b)}/`}
                    className="grid grid-cols-[1fr_auto_1fr_auto] sm:grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-3 p-3 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-text truncate group-hover:text-brand">{a.name}</div>
                      <div className="text-caption text-dim font-mono truncate">{a.domain}</div>
                    </div>
                    <ScoreBadge
                      value={a.scores.index.value}
                      grade={a.scores.index.grade}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-text truncate group-hover:text-brand">{b.name}</div>
                      <div className="text-caption text-dim font-mono truncate">{b.domain}</div>
                    </div>
                    <ScoreBadge
                      value={b.scores.index.value}
                      grade={b.scores.index.grade}
                      size="sm"
                    />
                    <span className="hidden sm:inline text-caption text-brand whitespace-nowrap">
                      Compare →
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

    </article>
  );
}
