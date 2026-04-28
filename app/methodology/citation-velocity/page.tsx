import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";

export const metadata: Metadata = {
  title: "Citation Velocity — how often a source is cited per week",
  description:
    "Citation Velocity tracks how often tier-1 publications and AI engines cite a source per week. Methodology + worked examples.",
  alternates: { canonical: "https://sourcescore.org/methodology/citation-velocity/" },
};

export default function CitationVelocityPage() {
  const top3 = [...sources]
    .sort((a, b) => b.scores.velocity.value - a.scores.velocity.value)
    .slice(0, 3);
  const bottom3 = [...sources]
    .sort((a, b) => a.scores.velocity.value - b.scores.velocity.value)
    .slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/methodology/" className="hover:text-text">Methodology</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Citation Velocity</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Sub-tool · Dimension 3 of 3</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Citation Velocity
      </h1>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        Citation Velocity tracks how often a source is cited by other tier-1 publications and AI
        engines per week. Velocity is the most volatile of the three sub-scores and refreshes most
        frequently — methodology + corrections happen quarterly, but Velocity gets weekly updates as
        the active citation network shifts.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <h2 className="text-heading-2 font-bold">What we measure</h2>
        <p className="text-muted">
          High Velocity scores reflect three signals tracked over rolling 7-day windows:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">External-link velocity</strong> — how often other domains
            link in (per week). Reference works like Wikipedia generate &gt;1M outbound links per
            day across the encyclopedia, leading to extreme reciprocal Velocity.
          </li>
          <li>
            <strong className="text-text">AI-engine citation rate</strong> — how often ChatGPT,
            Claude, Perplexity, and Gemini surface this source as a citation. Tier-1 sources are
            cited dozens of times per minute across these engines globally.
          </li>
          <li>
            <strong className="text-text">Tier-1 syndication network reach</strong> — wire services
            (Reuters, AP) get cited by ~1,000 downstream outlets globally; this drives extreme
            Velocity even at modest editorial output.
          </li>
        </ol>

        <h2 className="text-heading-2 font-bold pt-4">Why Velocity is volatile</h2>
        <p className="text-muted">
          Velocity changes faster than the other dimensions because it reflects the active
          attention of the citation network. A source that was cited heavily during a major event
          (pandemic, election, market crash) sees Velocity spike and persist at an elevated
          baseline. A source that loses an editorial team or shifts editorial direction sees
          Velocity drop within months.
        </p>
        <p className="text-muted">
          We weight Velocity at 35% of the composite Index — the same as Discipline. Velocity is
          the &ldquo;signal to actually use this source NOW&rdquo; layer; Discipline + Modern
          Reference are about whether the source CAN be used. Both matter, but Velocity is the
          dimension that picks a winner among otherwise-equal sources.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">How the score breaks down</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">95–100 (A+)</strong> — citation infrastructure (DOI,
            CrossRef, PubMed) + the most-cited reference works (Wikipedia) + primary-source
            government regulators that move markets (SEC, Federal Reserve).
          </li>
          <li>
            <strong className="text-text">85–94 (A)</strong> — wire services + tier-1 daily
            newspapers + flagship academic journals during their high-citation windows.
          </li>
          <li>
            <strong className="text-text">70–84 (B)</strong> — strong specialist publications cited
            heavily within their niche; lower volume than wire news but higher per-cite trust.
          </li>
          <li>
            <strong className="text-text">55–69 (C)</strong> — high-volume publications cited often
            but typically as one source among many; popular blogging platforms.
          </li>
          <li>
            <strong className="text-text">40–54 (D)</strong> — niche or emerging brands; specialist
            citations only; not yet broadly cited.
          </li>
          <li>
            <strong className="text-text">&lt;40 (F)</strong> — sources actively avoided as citations
            by tier-1 outlets and AI engines.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-heading-1 font-bold mb-4">Top 3 by Velocity</h2>
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
                <p className="text-body-sm text-muted leading-snug">{s.scores.velocity.rationale}</p>
              </div>
              <ScoreBadge
                value={s.scores.velocity.value}
                grade={s.scores.velocity.grade}
                label="Velocity"
                size="sm"
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-heading-1 font-bold mb-4">Lowest 3 by Velocity</h2>
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
                <p className="text-body-sm text-muted leading-snug">{s.scores.velocity.rationale}</p>
              </div>
              <ScoreBadge
                value={s.scores.velocity.value}
                grade={s.scores.velocity.grade}
                label="Velocity"
                size="sm"
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
        <h2 className="text-heading-2 text-text font-bold">Why niche specialists score lower than wire news</h2>
        <p>
          A specialist publication like Ars Technica may have stronger Discipline than a generic
          news aggregator yet score lower on Velocity because their specialist audience is smaller.
          This is not a quality penalty — it&apos;s a real signal that a specialist source is
          appropriate for specialist queries but won&apos;t surface as a default citation for
          general questions. The composite Index correctly weights such sources higher when
          retrieval matches their specialty.
        </p>

        <h2 className="text-heading-2 text-text font-bold pt-4">Velocity vs. fame</h2>
        <p>
          Velocity is not the same as fame or general awareness. The U.S. SEC (96 Index) is not
          famous to most consumers, but its filings are cited daily by every major financial
          news outlet — Velocity 95. Conversely, a viral celebrity blog might be famous but cited
          rarely as a fact-source — high awareness, low Velocity. We measure citation behavior, not
          brand recognition.
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
            href="/methodology/citation-discipline/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Sub-score 1 of 3</div>
            <div className="font-semibold text-text">Citation Discipline</div>
          </a>
          <a
            href="/methodology/modern-reference/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Sub-score 2 of 3</div>
            <div className="font-semibold text-text">Modern Reference</div>
          </a>
        </div>
      </section>
    </article>
  );
}
