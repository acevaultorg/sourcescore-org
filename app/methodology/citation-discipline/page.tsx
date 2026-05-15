import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  methodologyArticleSchema,
  methodologyDefinedTermSchema,
  methodologyVersionStamp,
} from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "Citation Discipline — how SourceScore measures evidence rigor" },
  description:
    "Citation Discipline measures how rigorously a source backs each factual claim with verifiable evidence. The methodology + worked examples.",
  alternates: { canonical: "https://sourcescore.org/methodology/citation-discipline/" },
};

export default function CitationDisciplinePage() {
  const top3 = [...sources]
    .sort((a, b) => b.scores.discipline.value - a.scores.discipline.value)
    .slice(0, 3);
  const bottom3 = [...sources]
    .sort((a, b) => a.scores.discipline.value - b.scores.discipline.value)
    .slice(0, 3);

  const articleSchema = methodologyArticleSchema({
    headline: "Citation Discipline — how SourceScore measures evidence rigor",
    description:
      "Citation Discipline measures how rigorously a source backs each factual claim with verifiable evidence. The methodology + worked examples.",
    url: "https://sourcescore.org/methodology/citation-discipline/",
  });

  const definedTermSchema = methodologyDefinedTermSchema({
    name: "Citation Discipline",
    description:
      "Citation Discipline measures how rigorously a source backs each factual claim with a verifiable external source. It is the most heavily weighted of the three SourceScore sub-scores because AI retrieval models increasingly skip uncited claims at the page level.",
    url: "https://sourcescore.org/methodology/citation-discipline/",
    termCode: "discipline",
  });

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/methodology/" className="hover:text-text">Methodology</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Citation Discipline</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Sub-tool · Dimension 1 of 3</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Citation Discipline
      </h1>
      <p className="text-caption text-dim mb-4 font-mono">{methodologyVersionStamp}</p>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        Citation Discipline measures how rigorously a source backs each factual claim with a
        verifiable external source. It&apos;s the most important of the three sub-scores for AI-citation
        because retrieval models increasingly skip uncited claims at the page level — not just at the
        domain level.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <h2 className="text-heading-2 font-bold">What we measure</h2>
        <p className="text-muted">
          High Discipline scores reflect five overlapping signals:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">Inline citation per factual claim</strong> — every assertion
            beyond common knowledge cites a primary source via footnote, link, or reference.
          </li>
          <li>
            <strong className="text-text">Public corrections process</strong> — errors are logged
            with timestamps and disclosed alongside the original article. The presence of a
            corrections column is itself a signal.
          </li>
          <li>
            <strong className="text-text">Multi-source verification policy</strong> — editorial
            policy requires ≥2 independent sources before publishing material claims.
          </li>
          <li>
            <strong className="text-text">Peer review</strong> — applicable for academic
            publications; the strongest possible discipline signal.
          </li>
          <li>
            <strong className="text-text">Named-author byline accountability</strong> — the
            person responsible for the claim is identifiable.
          </li>
        </ol>

        <h2 className="text-heading-2 font-bold pt-4">How the score breaks down</h2>
        <p className="text-muted">
          Scores 0–100 map to letter grades on the SourceScore A+ to F scale. Specific anchors:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">95–100 (A+)</strong> — government primary sources under
            legal disclosure obligation OR peer-reviewed journals with mandatory data disclosure.
          </li>
          <li>
            <strong className="text-text">85–94 (A)</strong> — wire services + major dailies with
            multi-source verification policy + public corrections process.
          </li>
          <li>
            <strong className="text-text">70–84 (B)</strong> — established editorial brands with
            named bylines + variable per-article rigor (long features rigorous, shorter aggregation
            looser).
          </li>
          <li>
            <strong className="text-text">55–69 (C)</strong> — mixed staff + contributor models;
            corrections inconsistent; some pieces single-sourced from PR.
          </li>
          <li>
            <strong className="text-text">40–54 (D)</strong> — opinion + commentary heavy; corrections
            policy weak or absent.
          </li>
          <li>
            <strong className="text-text">&lt;40 (F)</strong> — tabloid-format reporting; rejected as
            a reliable source by major reference works (e.g., Wikipedia&apos;s 2017 RfC on Daily Mail).
          </li>
        </ul>
      </section>

      {/* TOP 3 ─────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-heading-1 font-bold mb-4">Top 3 by Discipline</h2>
        <ol className="space-y-2">
          {top3.map((s, i) => (
            <li
              key={s.slug}
              className="flex items-start gap-4 p-4 rounded-card border border-border bg-panel"
            >
              <span className="text-caption text-dim font-mono w-6 text-right pt-1">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <a href={`/source/${s.slug}/`} className="font-semibold text-text hover:text-brand">
                  {s.name}
                </a>
                <div className="text-caption text-dim font-mono mb-1.5">{s.domain}</div>
                <p className="text-body-sm text-muted leading-snug">{s.scores.discipline.rationale}</p>
              </div>
              <ScoreBadge
                value={s.scores.discipline.value}
                grade={s.scores.discipline.grade}
                label="Discipline"
                size="sm"
              />
            </li>
          ))}
        </ol>
      </section>

      {/* BOTTOM 3 ──────────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-heading-1 font-bold mb-4">Lowest 3 by Discipline</h2>
        <ol className="space-y-2">
          {bottom3.map((s, i) => (
            <li
              key={s.slug}
              className="flex items-start gap-4 p-4 rounded-card border border-border bg-panel"
            >
              <span className="text-caption text-dim font-mono w-6 text-right pt-1">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <a href={`/source/${s.slug}/`} className="font-semibold text-text hover:text-brand">
                  {s.name}
                </a>
                <div className="text-caption text-dim font-mono mb-1.5">{s.domain}</div>
                <p className="text-body-sm text-muted leading-snug">{s.scores.discipline.rationale}</p>
              </div>
              <ScoreBadge
                value={s.scores.discipline.value}
                grade={s.scores.discipline.grade}
                label="Discipline"
                size="sm"
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
        <h2 className="text-heading-2 text-text font-bold">How Discipline differs from the other sub-scores</h2>
        <p>
          A source can have high <strong className="text-text">Modern Reference</strong> (machine-readable,
          structured, schema-marked) but low Discipline if its content is opinion-heavy or relies on
          single sources. Wikipedia scores 96 on Discipline because of its enforced WP:V verifiability
          policy + public talk pages where citation gaps are flagged within hours; it would only score
          this high if rigor were structurally enforced.
        </p>
        <p>
          A source can have high <strong className="text-text">Citation Velocity</strong> (cited
          frequently) but low Discipline if quantity comes from format (listicles, quizzes, viral
          aggregation) rather than from sourced reporting. BuzzFeed scores 65 on Velocity but 30 on
          Discipline.
        </p>

        <h2 className="text-heading-2 text-text font-bold pt-4">Why Discipline is the most-weighted sub-score</h2>
        <p>
          AI engines weight Discipline heavily because uncited claims fail the engine&apos;s own
          accuracy tests. A source that cites everything is more trustworthy as a downstream
          citation, regardless of whether the source itself is well-known. The Discipline score
          predicts whether an LLM will use the source as a fallback when a query has no obvious
          authoritative match.
        </p>

        <h2 className="text-heading-2 text-text font-bold pt-4">Frequently asked</h2>
        <p>
          <strong className="text-text">Q: Why does a peer-reviewed journal score 95+ but a wire service score 88?</strong><br />
          Peer review enforces methodology + reviewer cycles before publication; wire services enforce
          multi-source verification + corrections processes but operate on shorter timelines without
          formal third-party review.
        </p>
        <p>
          <strong className="text-text">Q: How is Discipline different from &ldquo;trust&rdquo;?</strong><br />
          Discipline is a process measure (does this source have a rigorous method for backing claims?).
          Trust is a downstream outcome of Discipline + Modern Reference + Velocity. Discipline is the
          most-controllable of the three; sources can improve Discipline by adopting better citation
          practices regardless of their existing brand recognition.
        </p>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-heading-2 font-bold mb-3">Other dimensions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a
            href="/methodology/sourcescore-index/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Composite</div>
            <div className="font-semibold text-text">SourceScore Index</div>
          </a>
          <a
            href="/methodology/modern-reference/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Sub-score 2 of 3</div>
            <div className="font-semibold text-text">Modern Reference</div>
          </a>
          <a
            href="/methodology/citation-velocity/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Sub-score 3 of 3</div>
            <div className="font-semibold text-text">Citation Velocity</div>
          </a>
        </div>
      </section>
    </article>
  );
}
