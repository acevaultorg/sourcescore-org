import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology v0.1 — how SourceScore is computed",
  description:
    "Transparent methodology for the SourceScore Index, Citation Discipline, Modern Reference, and Citation Velocity sub-scores.",
  alternates: { canonical: "https://sourcescore.org/methodology/" },
};

export default function MethodologyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-eyebrow text-brand mb-3">v0.1 · 2026-04-28</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Methodology</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        Every SourceScore is the product of four publicly described sub-scores. This page documents
        the v0.1 scoring rubric so anyone can re-derive a score from the underlying signals.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-6">
        <h2 className="text-heading-2 font-bold">The four sub-scores</h2>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>
            <span className="text-text font-semibold">SourceScore Index</span> — a composite weighted
            mean. Day-1 weights: Discipline 35% + Modern Reference 30% + Citation Velocity 35%.
          </li>
          <li>
            <span className="text-text font-semibold">Citation Discipline</span> — measures rigor of
            evidence-citation: inline citations, dual-source verification, public corrections process,
            peer-review (where applicable).
          </li>
          <li>
            <span className="text-text font-semibold">Modern Reference</span> — measures fitness as a
            citation in AI-era writing: structured-data quality (JSON-LD, Article + DefinedTerm),
            freshness signals (datePublished + dateModified), training-corpus presence,
            machine-readability (DOIs, stable URLs, full-text APIs).
          </li>
          <li>
            <span className="text-text font-semibold">Citation Velocity</span> — measures how often
            the source is cited per week by tier-1 publications and AI engines.
          </li>
        </ol>

        <h2 className="text-heading-2 font-bold pt-4">Grade scale</h2>
        <p className="text-muted">
          Scores 0–100 map to letter grades on an academic-style scale: A+ ≥ 95, A ≥ 85, B ≥ 70,
          C ≥ 55, D ≥ 40, F &lt; 40. Grade letters are intentionally familiar so the meaning is
          obvious to a reader who has never visited the site before.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Day-1 limitations (honest)</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>v0.1 publishes 75 hand-scored sources; production scales to 10,000+ via the same rubric.</li>
          <li>
            Velocity scores are static estimates on Day 1. The production index will refresh
            Velocity weekly via tier-1 referrer + LLM-citation polling.
          </li>
          <li>
            Discipline scores are domain-level. Per-author Discipline (relevant for platforms like
            Medium) is on the v0.2 roadmap.
          </li>
          <li>
            Methodology v0.1 weights are unverified — we will calibrate against actual LLM-citation
            outcomes after the first 30 days of operator usage and re-tune in v0.2.
          </li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">No fabricated data</h2>
        <p className="text-muted">
          Every numeric score traces to a specific signal a researcher can re-derive (regulatory
          filings, public ethics codes, academic indexes, structured-data audits, citation-corpus
          data). Sources whose data we cannot verify are excluded rather than fabricated.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Versioning</h2>
        <p className="text-muted">
          The methodology is semver-tracked. Major bumps (vX.0) change scoring weights or add
          sub-scores; minor bumps (v0.X) refine signals or add sources. Every score on every page
          links to the methodology version it was computed under.
        </p>
      </section>
    </article>
  );
}
