import type { Metadata } from "next";
import { sources, categorySlug } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import { allGrades, gradeSlug, gradeRange, gradeColorClass } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "All sources scored — SourceScore" },
  description:
    "Browse every source scored by SourceScore. 130 hand-scored sources across 12 categories, each with full breakdown across Citation Discipline, Modern Reference, and Citation Velocity.",
  alternates: { canonical: "https://sourcescore.org/sources/" },
};

export default function SourcesIndexPage() {
  const groupedByCategory = sources.reduce<Record<string, typeof sources>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  const categories = Object.keys(groupedByCategory).sort();
  const gradeCounts = Object.fromEntries(
    allGrades.map((g) => [g, sources.filter((s) => s.scores.index.grade === g).length])
  );

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-display-2 font-bold tracking-tight mb-3">All sources</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-4 max-w-2xl">
        {sources.length} hand-scored sources across {categories.length} categories.
        Each links to a full SourceScore breakdown.
      </p>

      {/* Guide cross-link — passes link equity + funnels readers into the
          broad-audience pillars (the three signals = the dimensions scored below). */}
      <p className="text-body-sm text-muted leading-relaxed mb-8 max-w-2xl">
        New here?{" "}
        <a
          href="/blog/how-to-tell-if-a-source-is-reliable/"
          className="text-brand font-medium hover:underline"
        >
          How to tell if a source is reliable
        </a>{" "}
        explains the three signals behind every score below — or learn{" "}
        <a
          href="/blog/can-you-cite-chatgpt-ai-as-a-source/"
          className="text-brand font-medium hover:underline"
        >
          whether you can cite ChatGPT as a source
        </a>
        .
      </p>

      {/* Browse by grade — quick filter chips */}
      <section className="mb-10">
        <div className="text-eyebrow text-brand mb-3">Browse by grade</div>
        <div className="flex flex-wrap gap-2">
          {allGrades.map((g) => (
            <a
              key={g}
              href={`/grade/${gradeSlug(g)}/`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm transition-colors"
            >
              <span className={`font-bold ${gradeColorClass(g)}`}>{g}</span>
              <span className="text-dim font-mono text-caption">{gradeRange(g)}</span>
              <span className="text-muted">{gradeCounts[g]}</span>
            </a>
          ))}
          <a
            href="/grade/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-pill border border-brand/40 bg-surface-brand hover:bg-brand/15 text-body-sm font-semibold text-brand transition-colors"
          >
            How grades work →
          </a>
        </div>
      </section>

      {categories.map((cat) => {
        const list = groupedByCategory[cat]!.sort((a, b) => b.scores.index.value - a.scores.index.value);
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-heading-2 font-bold mb-4">
              <a href={`/category/${categorySlug(cat)}/`} className="hover:text-brand transition-colors">
                {cat}
              </a>
              <span className="text-body-sm font-normal text-dim ml-2">{list.length}</span>
            </h2>
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
