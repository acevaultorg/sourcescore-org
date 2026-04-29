import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  allGrades,
  gradeColorClass,
  gradeRange,
  gradeSlug,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Modern Citation Reference Score — fitness as a citation in the AI era",
  description:
    "Modern Reference grades how fit a source is for AI-era citation: machine-readable, schema-marked, structured, fresh.",
  alternates: { canonical: "https://sourcescore.org/modern-reference/" },
};

export default function ModernReferencePage() {
  const ranked = [...sources].sort((a, b) => b.scores.modernReference.value - a.scores.modernReference.value);
  const gradeBuckets = allGrades
    .map((g) => ({ g, count: ranked.filter((s) => s.scores.modernReference.grade === g).length }))
    .filter(({ count }) => count > 0);
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-eyebrow text-brand mb-3">SourceScore sub-tool · 2 of 4</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Modern Citation Reference</h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-6">
        Modern Reference grades how fit a source is for citation in modern (LLM-era) writing.
        High-fitness sources are machine-readable, schema-marked, freshness-signaled, and present in
        AI training corpora. Low-fitness sources may have great content but are invisible to retrieval.
      </p>
      <a
        href="/methodology/modern-reference/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand hover:bg-brand/15 transition-colors text-body-sm font-semibold mb-10"
      >
        Full methodology + worked examples →
      </a>

      {/* Grade-faceted children — Day 21 per-dim grade pages */}
      <section className="mb-10">
        <div className="text-eyebrow text-brand mb-3">Filter Modern Reference by grade</div>
        <div className="flex flex-wrap gap-2">
          {gradeBuckets.map(({ g, count }) => (
            <a
              key={g}
              href={`/modern-reference/grade/${gradeSlug(g)}/`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm transition-colors"
            >
              <span className={`font-bold ${gradeColorClass(g)}`}>{g}</span>
              <span className="text-dim font-mono text-caption">{gradeRange(g)}</span>
              <span className="text-muted">{count}</span>
            </a>
          ))}
        </div>
      </section>

      <h2 className="text-heading-1 font-bold mb-4">Ranking — 130 sources</h2>
      <ol className="space-y-2 mb-12">
        {ranked.map((s, i) => (
          <li
            key={s.slug}
            className="flex items-center gap-4 p-3 rounded-card border border-border bg-panel hover:bg-panel-hi"
          >
            <span className="text-caption text-dim font-mono w-6 text-right">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <a href={`/source/${s.slug}/`} className="font-semibold text-text hover:text-brand">
                {s.name}
              </a>
              <div className="text-caption text-dim font-mono">{s.domain}</div>
            </div>
            <ScoreBadge
              value={s.scores.modernReference.value}
              grade={s.scores.modernReference.grade}
              label="Modern Reference"
              size="sm"
            />
          </li>
        ))}
      </ol>

      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
        <h2 className="text-heading-2 text-text font-bold mb-3">How Modern Reference is scored</h2>
        <p>
          Modern Reference combines four signals: presence in major LLM training corpora,
          structured-data quality (Article + Organization + DefinedTerm schema, JSON-LD), freshness
          signals (datePublished + dateModified, last-verified visibility), and machine-readability
          (DOIs, stable URLs, full-text search APIs).
        </p>
        <p>
          Government primary sources with public APIs score highest. User-generated platforms with
          mixed-quality posts score lowest because retrieval models down-weight them after the 2024
          Helpful Content shifts.
        </p>
      </section>
    </article>
  );
}
