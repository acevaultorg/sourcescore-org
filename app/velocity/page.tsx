import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";

export const metadata: Metadata = {
  title: "Citation Velocity Tracker — how often a source is cited per week",
  description:
    "Citation Velocity tracks how often a source is cited by other tier-1 publications and AI engines per week.",
  alternates: { canonical: "https://sourcescore.org/velocity/" },
};

export default function VelocityPage() {
  const ranked = [...sources].sort((a, b) => b.scores.velocity.value - a.scores.velocity.value);
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-eyebrow text-brand mb-3">SourceScore sub-tool · 3 of 4</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Citation Velocity Tracker</h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-6">
        Citation Velocity tracks how often tier-1 publications and AI engines cite a source per
        week. High velocity = the source is part of the active citation network; low velocity = the
        source exists but is rarely surfaced. Velocity is the most volatile of the three sub-scores
        and refreshes most frequently.
      </p>
      <a
        href="/methodology/citation-velocity/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand hover:bg-brand/15 transition-colors text-body-sm font-semibold mb-10"
      >
        Full methodology + worked examples →
      </a>

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
              value={s.scores.velocity.value}
              grade={s.scores.velocity.grade}
              label="Citation Velocity"
              size="sm"
            />
          </li>
        ))}
      </ol>

      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
        <h2 className="text-heading-2 text-text font-bold mb-3">How Velocity is scored</h2>
        <p>
          Velocity combines three signals: external-link velocity (how often other domains link in
          per week), AI-engine citation rate (how often ChatGPT / Claude / Perplexity / Gemini
          surface this source as a citation), and tier-1 syndication network reach.
        </p>
        <p>
          Wire services and government primary sources have the highest velocity. Reference works
          like Wikipedia have extreme velocity because they are the default fallback citation in
          most AI-engine answers.
        </p>
      </section>
    </article>
  );
}
