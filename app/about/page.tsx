import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SourceScore",
  description:
    "SourceScore is the reference index for AI-citation quality. About the project and the operator.",
  alternates: { canonical: "https://sourcescore.org/about/" },
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-display-2 font-bold tracking-tight mb-4">About SourceScore</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-8">
        SourceScore exists because nobody had built a transparent, methodology-first index of source
        quality in the LLM era. We built it.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <h2 className="text-heading-2 font-bold">Why this exists</h2>
        <p className="text-muted">
          AI engines surface a small subset of sources as authoritative citations. The criteria are
          opaque: there's no public list, no published ranking, no transparent rubric. SourceScore
          publishes a transparent rubric and ranks sources against it. Anyone can re-derive any score
          from the underlying signals.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Who we are</h2>
        <p className="text-muted">
          SourceScore is operated by a small independent team. The site is a sister project to
          HoldLens (sec-filings reference index) and other reference-grade fleet sites. The
          methodology is our intellectual property; the underlying public-source data we score is
          credited to its publishers.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Editorial policy</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>No paid placements. Scores cannot be purchased.</li>
          <li>Methodology changes are versioned and announced.</li>
          <li>Every score has explicit signals you can verify.</li>
          <li>Corrections are timestamped and public.</li>
          <li>We do not auto-generate or fabricate data.</li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">Get in touch</h2>
        <p className="text-muted">
          Questions about methodology, corrections, or partnership requests:{" "}
          <a href="/contact/" className="text-brand hover:underline">contact us</a>.
        </p>
      </section>
    </article>
  );
}
