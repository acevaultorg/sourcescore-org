import type { Metadata } from "next";
import {
  methodologyArticleSchema,
  methodologyVersion,
  methodologyVersionStamp,
} from "@/lib/methodology-version";
import { CitationDeskCTA } from "@/components/CitationDeskCTA";

export const metadata: Metadata = {
  title: `Methodology v${methodologyVersion.version} — how SourceScore is computed`,
  description:
    "Transparent methodology for the SourceScore Index, Citation Discipline, Modern Reference, and Citation Velocity sub-scores.",
  alternates: { canonical: "https://sourcescore.org/methodology/" },
};

export default function MethodologyPage() {
  const articleSchema = methodologyArticleSchema({
    headline: "SourceScore Methodology",
    description:
      "Transparent methodology for the SourceScore Index, Citation Discipline, Modern Reference, and Citation Velocity sub-scores.",
    url: "https://sourcescore.org/methodology/",
  });

  // Container DefinedTermSet — names the vocabulary as its own entity and
  // enumerates its 4 member terms via hasDefinedTerm. Lets LLM retrieval models
  // anchor on the SET as a citable thing ("SourceScore Methodology Vocabulary")
  // and traverse to individual terms in one schema hop.
  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: `SourceScore Methodology v${methodologyVersion.version} — Vocabulary`,
    description:
      "The four canonical concepts SourceScore uses to grade citation quality: Citation Discipline, Modern Reference, Citation Velocity, and the composite SourceScore Index.",
    url: "https://sourcescore.org/methodology/",
    inLanguage: "en",
    hasDefinedTerm: [
      {
        "@type": "DefinedTerm",
        name: "SourceScore Index",
        termCode: "index",
        url: "https://sourcescore.org/methodology/sourcescore-index/",
      },
      {
        "@type": "DefinedTerm",
        name: "Citation Discipline",
        termCode: "discipline",
        url: "https://sourcescore.org/methodology/citation-discipline/",
      },
      {
        "@type": "DefinedTerm",
        name: "Modern Reference",
        termCode: "modern-reference",
        url: "https://sourcescore.org/methodology/modern-reference/",
      },
      {
        "@type": "DefinedTerm",
        name: "Citation Velocity",
        termCode: "velocity",
        url: "https://sourcescore.org/methodology/citation-velocity/",
      },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />
      <div className="text-eyebrow text-brand mb-3">{methodologyVersionStamp}</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Methodology</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        Every SourceScore is the product of four publicly described sub-scores. This page documents
        the v0.1 scoring rubric so anyone can re-derive a score from the underlying signals.
      </p>

      <section className="mb-10 grid sm:grid-cols-2 gap-3">
        <a
          href="/methodology/sourcescore-index/"
          className="block p-5 rounded-card-lg border border-brand/40 bg-surface-brand hover:bg-brand/15 transition-colors"
        >
          <div className="text-eyebrow text-brand mb-1">Composite · 35/30/35 weights</div>
          <div className="font-semibold text-text mb-1">SourceScore Index</div>
          <div className="text-body-sm text-muted">
            How the composite is calculated, with per-grade anchors + worked examples.
          </div>
        </a>
        <a
          href="/methodology/citation-discipline/"
          className="block p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
        >
          <div className="text-eyebrow text-brand mb-1">Sub-score 1 · 35% weight</div>
          <div className="font-semibold text-text mb-1">Citation Discipline</div>
          <div className="text-body-sm text-muted">
            How rigorously a source backs each factual claim with verifiable evidence.
          </div>
        </a>
        <a
          href="/methodology/modern-reference/"
          className="block p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
        >
          <div className="text-eyebrow text-brand mb-1">Sub-score 2 · 30% weight</div>
          <div className="font-semibold text-text mb-1">Modern Reference</div>
          <div className="text-body-sm text-muted">
            Fitness as a citation in AI-era writing — schema, freshness, machine-readability.
          </div>
        </a>
        <a
          href="/methodology/citation-velocity/"
          className="block p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
        >
          <div className="text-eyebrow text-brand mb-1">Sub-score 3 · 35% weight</div>
          <div className="font-semibold text-text mb-1">Citation Velocity</div>
          <div className="text-body-sm text-muted">
            How often tier-1 publications and AI engines cite a source per week.
          </div>
        </a>
      </section>

      {/* Reader-facing application of the methodology — cross-links the
          broad-audience pillar so high-authority /methodology/ passes equity to it. */}
      <p className="text-body-sm text-muted leading-relaxed mb-10 max-w-2xl">
        Want the plain-English version? See{" "}
        <a
          href="/blog/how-to-tell-if-a-source-is-reliable/"
          className="text-brand font-medium hover:underline"
        >
          how to tell if a source is reliable
        </a>{" "}
        — the same three signals, applied by hand to any source you&rsquo;re vetting.
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

        <h2 className="text-heading-2 font-bold pt-4">VERITAS Claim Verification methodology</h2>
        <p className="text-muted">
          The companion product on this domain,{" "}
          <a href="/claims/" className="text-brand hover:underline">VERITAS</a>, applies the same
          trust-signal thinking to atomic claims rather than whole sources. A claim is published
          only when:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            <span className="text-text font-semibold">Source convergence &ge; 2 primary documents.</span>{" "}
            One of those must be primary (preprint authored by the work&rsquo;s authors,
            official-blog from the entity making the claim, model-card on Hugging Face, or
            github-release tag). Aggregator sites alone are insufficient.
          </li>
          <li>
            <span className="text-text font-semibold">Confidence &ge; 0.70</span>, calibrated as:
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><code>1.00</code> &mdash; primary-source confirmation + independent verification</li>
              <li><code>0.95</code> &mdash; primary-source single attestation</li>
              <li><code>0.85</code> &mdash; strong secondary-source convergence (&ge;3 independent sources agree)</li>
              <li><code>0.70</code> &mdash; single secondary source, no contradictions found</li>
              <li><code>&lt; 0.70</code> &mdash; not published in v0</li>
            </ul>
          </li>
          <li>
            <span className="text-text font-semibold">Performance comparisons excluded</span> from
            v0 because benchmark numbers depend on prompt format, decoding strategy, evaluation
            harness version, and shot count. Six dimensions of methodology drift make any single
            &ldquo;model X scores Y on benchmark Z&rdquo; claim unreproducible. A future methodology
            version adds them back with explicit benchmark-version + prompt-format metadata bundled
            into the envelope.
          </li>
          <li>
            <span className="text-text font-semibold">Signed with HMAC-SHA256</span> by{" "}
            <code>did:web:sourcescore.org</code>. Migration to W3C Verifiable Credentials with
            Ed25519 keys is on the Y2 roadmap for enterprise customers wanting offline verification.
          </li>
        </ul>
        <p className="text-muted">
          Machine-readable methodology + tier reference + endpoint index:{" "}
          <a href="/api/v1/methodology.json" className="text-brand hover:underline">
            /api/v1/methodology.json
          </a>
          . Full developer docs (curl + JS + Python examples):{" "}
          <a href="/docs/" className="text-brand hover:underline">/docs/</a>.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Grade scale</h2>
        <p className="text-muted">
          Scores 0–100 map to letter grades on an academic-style scale: A+ ≥ 95, A ≥ 85, B ≥ 70,
          C ≥ 55, D ≥ 40, F &lt; 40. Grade letters are intentionally familiar so the meaning is
          obvious to a reader who has never visited the site before. Per-grade source rankings:{" "}
          <a href="/grade/a-plus/" className="text-brand hover:underline">A+</a>,{" "}
          <a href="/grade/a/" className="text-brand hover:underline">A</a>,{" "}
          <a href="/grade/b/" className="text-brand hover:underline">B</a>,{" "}
          <a href="/grade/c/" className="text-brand hover:underline">C</a>,{" "}
          <a href="/grade/d/" className="text-brand hover:underline">D</a>,{" "}
          <a href="/grade/f/" className="text-brand hover:underline">F</a> — or see the{" "}
          <a href="/grade/" className="text-brand hover:underline">grading-scale overview</a>.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Current limitations (honest)</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>v0.1 publishes 130 hand-scored sources; production scales to 10,000+ via the same rubric.</li>
          <li>
            Velocity scores are static estimates in v0.1. A future version will refresh
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

      {/* CitationDesk funnel — SourceScore measures source citability; its
          sister product measures YOUR site's AI citability (2026-06-19 decision). */}
      <div className="mt-12">
        <CitationDeskCTA variant="panel" source="methodology" />
      </div>
    </article>
  );
}
