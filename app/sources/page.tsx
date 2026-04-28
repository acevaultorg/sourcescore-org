import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";

export const metadata: Metadata = {
  title: "All sources scored — SourceScore",
  description: "Browse every source scored by SourceScore. Day 1 ships 10 hand-scored examples.",
  alternates: { canonical: "https://sourcescore.org/sources/" },
};

export default function SourcesIndexPage() {
  const groupedByCategory = sources.reduce<Record<string, typeof sources>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  const categories = Object.keys(groupedByCategory).sort();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-display-2 font-bold tracking-tight mb-3">All sources</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-10 max-w-2xl">
        Day 1 ships {sources.length} hand-scored sources across {categories.length} categories.
        Each links to a full SourceScore breakdown.
      </p>

      {categories.map((cat) => {
        const list = groupedByCategory[cat]!.sort((a, b) => b.scores.index.value - a.scores.index.value);
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-heading-2 font-bold mb-4">{cat}</h2>
            <ul className="space-y-2">
              {list.map((s) => (
                <li
                  key={s.slug}
                  className="flex items-center gap-4 p-3 rounded-card border border-border bg-panel hover:bg-panel-hi"
                >
                  <div className="flex-1 min-w-0">
                    <a href={`/source/${s.slug}/`} className="font-semibold text-text hover:text-brand">
                      {s.name}
                    </a>
                    <div className="text-caption text-dim font-mono">{s.domain}</div>
                  </div>
                  <ScoreBadge
                    value={s.scores.index.value}
                    grade={s.scores.index.grade}
                    label="SourceScore Index"
                    size="sm"
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </article>
  );
}
