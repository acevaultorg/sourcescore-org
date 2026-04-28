import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";

export const metadata: Metadata = {
  title: "SourceScore — the AI-Citation Quality Index",
  description:
    "Score any source on Discipline, Modern Reference fitness, and Citation Velocity. Reference index for AI-citation quality.",
  alternates: { canonical: "https://sourcescore.org/" },
};

export default function HomePage() {
  // Top 5 by Index for the hero leaderboard.
  const top = [...sources].sort((a, b) => b.scores.index.value - a.scores.index.value).slice(0, 5);
  // Full sample list (10) for below-fold table.
  const all = [...sources].sort((a, b) => b.scores.index.value - a.scores.index.value);

  return (
    <>
      {/* HERO ────────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-20 sm:pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill border border-brand/30 bg-surface-brand text-brand text-caption font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
            <span>Methodology v0.1 · 101 sources scored · 10k+ index in development</span>
          </div>

          <h1 className="text-display-1 sm:text-[3.5rem] sm:leading-[1.05] font-bold tracking-tight max-w-4xl">
            How citable is any source <span className="text-brand">in the AI era?</span>
          </h1>

          <p className="mt-5 text-body-lg text-muted max-w-2xl leading-relaxed">
            SourceScore grades every URL you paste on three things AI engines actually weigh:
            how rigorously the source cites others, how fit it is as a modern citation, and how often
            tier-1 publications cite it. One paste, four numbers, one grade.
          </p>

          {/* Sub-tool cards — the 4-concept bundle */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                href: "/",
                label: "SourceScore Index",
                desc: "Composite weighted grade across all three sub-scores.",
                badge: "Composite",
              },
              {
                href: "/discipline/",
                label: "Citation Discipline",
                desc: "How rigorously a source cites its own evidence.",
                badge: "Score",
              },
              {
                href: "/modern-reference/",
                label: "Modern Reference",
                desc: "Fitness as a citation in 2026+ AI-era writing.",
                badge: "Reference",
              },
              {
                href: "/velocity/",
                label: "Citation Velocity",
                desc: "How often tier-1 sources cite this URL per week.",
                badge: "Tracker",
              },
            ].map((t) => (
              <a
                key={t.href}
                href={t.href}
                className="group block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 hover:shadow-hover-lift transition-all"
              >
                <div className="text-eyebrow text-brand mb-1.5">{t.badge}</div>
                <div className="font-semibold text-text mb-1.5 group-hover:text-brand transition-colors">
                  {t.label}
                </div>
                <div className="text-body-sm text-muted leading-snug">{t.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOP-5 LEADERBOARD ─────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="text-heading-1 font-bold tracking-tight">Top 5 by SourceScore Index</h2>
            <a
              href="#full-table"
              className="text-body-sm text-brand hover:underline whitespace-nowrap"
            >
              See all 101 sources →
            </a>
          </div>

          <ol className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {top.map((s, i) => (
              <li key={s.slug}>
                <a
                  href={`/source/${s.slug}/`}
                  className="block h-full p-4 rounded-card border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 hover:shadow-hover-lift transition-all"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-eyebrow text-dim">#{i + 1}</span>
                    <ScoreBadge
                      value={s.scores.index.value}
                      grade={s.scores.index.grade}
                      label="SourceScore Index"
                      size="sm"
                    />
                  </div>
                  <div className="font-semibold text-text leading-tight mb-1">{s.name}</div>
                  <div className="text-caption text-muted font-mono mb-2.5">{s.domain}</div>
                  <div className="text-body-sm text-muted leading-snug line-clamp-2">{s.summary}</div>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FULL TABLE ───────────────────────────────────────────────── */}
      <section className="border-t border-border" id="full-table">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-heading-1 font-bold tracking-tight mb-2">All sources scored</h2>
          <p className="text-body text-muted mb-6 max-w-2xl">
            101 sources scored across A+ to D grades. Each row links to the full breakdown with
            the underlying signals you can re-derive.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-card border border-border bg-panel">
            <table className="min-w-full text-body-sm">
              <thead className="text-caption uppercase tracking-wider text-dim border-b border-border-bright">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Source</th>
                  <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-right font-semibold px-4 py-3">Index</th>
                  <th className="text-right font-semibold px-4 py-3 hidden md:table-cell">Discipline</th>
                  <th className="text-right font-semibold px-4 py-3 hidden md:table-cell">Modern</th>
                  <th className="text-right font-semibold px-4 py-3 hidden lg:table-cell">Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {all.map((s) => (
                  <tr key={s.slug} className="hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <a href={`/source/${s.slug}/`} className="block hover:text-brand">
                        <div className="font-semibold text-text">{s.name}</div>
                        <div className="text-caption text-dim font-mono">{s.domain}</div>
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted hidden sm:table-cell">{s.category}</td>
                    <td className="px-4 py-3 text-right">
                      <ScoreBadge
                        value={s.scores.index.value}
                        grade={s.scores.index.grade}
                        label="Index"
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <ScoreBadge
                        value={s.scores.discipline.value}
                        grade={s.scores.discipline.grade}
                        label="Discipline"
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <ScoreBadge
                        value={s.scores.modernReference.value}
                        grade={s.scores.modernReference.grade}
                        label="Modern Reference"
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <ScoreBadge
                        value={s.scores.velocity.value}
                        grade={s.scores.velocity.grade}
                        label="Velocity"
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHAT IS THIS — explainer ─────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-heading-1 font-bold tracking-tight mb-4">
            What does &ldquo;AI-Citation Quality&rdquo; mean?
          </h2>
          <div className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
            <p>
              When ChatGPT, Claude, or Perplexity answer a question, they pull from a small subset of sources
              they consider trustworthy. Two factors decide whether a source makes that subset:
              <strong className="text-text"> citation discipline</strong> (does the source rigorously cite its own evidence?) and
              <strong className="text-text"> modern reference fitness</strong> (is the source structured for machine retrieval — schema markup,
              freshness signals, machine-readable archives?).
            </p>
            <p>
              SourceScore measures both, plus
              <strong className="text-text"> citation velocity</strong> (how often the source is cited by other tier-1 sources per week).
              Together these three sub-scores compose the
              <strong className="text-text"> SourceScore Index</strong> &mdash; a single 0&ndash;100 grade per source.
            </p>
            <p>
              We ship 25 hand-scored sources at this stage of v0.1. Methodology is intentionally
              transparent: every score has explicit signals you can re-derive. The production index will
              expand to 10,000+ sources via the same methodology, with weekly velocity refreshes and
              quarterly discipline re-audits.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/methodology/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand hover:bg-brand/15 transition-colors text-body-sm font-semibold"
            >
              Read the full methodology →
            </a>
            <a
              href="/about/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-text transition-colors text-body-sm"
            >
              About SourceScore
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
