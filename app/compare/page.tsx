import type { Metadata } from "next";
import { getSource } from "@/data/sources";
import { comparisons, comparisonSlug } from "@/data/comparisons";
import { ScoreBadge } from "@/components/ScoreBadge";

export const metadata: Metadata = {
  title: "Compare sources — SourceScore",
  description:
    "Side-by-side SourceScore comparisons. 25 curated pairs across academic, news, government, and tech sources.",
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

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-eyebrow text-brand mb-3">Comparator · {comparisons.length} pairs</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Compare sources head-to-head
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-10">
        Side-by-side SourceScore breakdowns across the four sub-scores. Click any pair to see why
        each side scores what it does on Citation Discipline, Modern Reference, and Citation Velocity.
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

      <section className="border-t border-border pt-8 prose prose-invert max-w-none">
        <p className="text-muted text-body-sm">
          Pairs are alphabetically canonicalized — typing <code>/compare/x-vs-y/</code> resolves
          to the same page as <code>/compare/y-vs-x/</code> via canonical sort. Adding a new pair
          is one row in <code>data/comparisons.ts</code>; the page generates automatically.
        </p>
      </section>
    </article>
  );
}
