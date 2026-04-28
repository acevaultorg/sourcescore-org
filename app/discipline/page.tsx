import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";

export const metadata: Metadata = {
  title: "Citation Discipline Score — how rigorously a source cites its evidence",
  description:
    "Citation Discipline grades how strictly a source backs each factual claim with a verifiable source. One of the four SourceScore sub-tools.",
  alternates: { canonical: "https://sourcescore.org/discipline/" },
};

export default function DisciplinePage() {
  const ranked = [...sources].sort((a, b) => b.scores.discipline.value - a.scores.discipline.value);
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-eyebrow text-brand mb-3">SourceScore sub-tool · 1 of 4</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Citation Discipline Score</h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-10">
        Citation Discipline measures how rigorously a source backs each factual claim with a verifiable
        external source. High-discipline sources cite primary evidence inline; low-discipline sources
        opine without sourcing. AI engines weigh discipline heavily — uncited claims are increasingly
        skipped by retrieval models.
      </p>

      <h2 className="text-heading-1 font-bold mb-4">Ranking — 25 sources</h2>
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
              value={s.scores.discipline.value}
              grade={s.scores.discipline.grade}
              label="Citation Discipline"
              size="sm"
            />
          </li>
        ))}
      </ol>

      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
        <h2 className="text-heading-2 text-text font-bold mb-3">How Discipline is scored</h2>
        <p>
          A source earns a high Discipline score by demonstrating consistent inline citation,
          public corrections processes, dual-source verification policies, and (where applicable)
          peer review. Government primary sources and peer-reviewed journals score highest because
          discipline is enforced by law or by editorial process.
        </p>
        <p>
          Lower Discipline scores apply to platforms that mix professional + amateur authorship
          without a per-piece citation requirement, or to formats (listicles, quizzes) where
          evidence is structurally absent.
        </p>
      </section>
    </article>
  );
}
