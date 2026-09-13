import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { SourceTrustChecker, type CheckerRow } from "@/components/SourceTrustChecker";

export const metadata: Metadata = {
  title: { absolute: "AI Source-Trust Checker — is any source citable by AI? | SourceScore" },
  description:
    "Free instant check: paste any URL or source and see its AI-citation trust grade (Discipline, Modern Reference, Velocity) across our hand-scored index. No signup. Grab an embeddable trust badge.",
  alternates: { canonical: "https://sourcescore.org/check/" },
};

export default function CheckPage() {
  const rows: CheckerRow[] = sources.map((s) => ({
    slug: s.slug,
    name: s.name,
    domain: s.domain,
    category: s.category,
    summary: s.summary,
    i: s.scores.index.value,
    ig: s.scores.index.grade,
    d: s.scores.discipline.value,
    dg: s.scores.discipline.grade,
    m: s.scores.modernReference.value,
    mg: s.scores.modernReference.grade,
    v: s.scores.velocity.value,
    vg: s.scores.velocity.grade,
  }));

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Source-Trust Checker",
    url: "https://sourcescore.org/check/",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description:
      "Check any source's AI-citation trust grade against SourceScore's hand-scored reliability index. Free, instant, no signup.",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "SourceScore", item: "https://sourcescore.org/" },
      { "@type": "ListItem", position: 2, name: "AI Source-Trust Checker", item: "https://sourcescore.org/check/" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-14 sm:pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill border border-brand/30 bg-surface-brand text-brand text-caption font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
          <span>Free · instant · no signup</span>
        </div>

        <h1 className="text-display-2 font-bold tracking-tight mb-4">
          Is your source <span className="text-brand">citable by AI?</span>
        </h1>
        <p className="text-body-lg text-muted leading-relaxed mb-8 max-w-2xl">
          Paste any URL or source name. See its hand-scored citation discipline,
          modern-reference fitness, and estimated citation velocity as one
          0&ndash;100 SourceScore Index grade. Then inspect every signal behind
          the result or grab an embeddable badge for your own site.
        </p>

        <SourceTrustChecker rows={rows} total={sources.length} />

        {/* Below-fold trust + explainer (AEO-extractable). */}
        <div className="mt-14 pt-10 border-t border-border prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
          <h2 className="text-heading-1 font-bold tracking-tight text-text">
            What the AI-Trust grade measures
          </h2>
          <p>
            SourceScore evaluates three observable signals associated with a useful modern reference:{" "}
            <strong className="text-text">citation discipline</strong> (does it rigorously cite its own evidence?),{" "}
            <strong className="text-text">modern-reference fitness</strong> (is it structured for machine retrieval —
            schema, freshness, machine-readable archives?), and{" "}
            <strong className="text-text">citation velocity</strong> (an estimated measure of how often tier-1 sources
            cite it). Together they compose the <strong className="text-text">SourceScore Index</strong>, a single
            0&ndash;100 rubric grade. It is not a measurement of any AI engine&rsquo;s private ranking system.
          </p>
          <p>
            The check runs entirely in your browser against {sources.length} hand-scored sources — we never show a
            grade we haven&rsquo;t verified. Unknown domains get an honest &ldquo;not scored yet&rdquo; instead of a
            fabricated number.
          </p>
          <div className="not-prose flex flex-wrap gap-3 pt-2">
            <a
              href="/methodology/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand hover:bg-brand/15 transition-colors text-body-sm font-semibold"
            >
              Read the full methodology →
            </a>
            <a
              href="/sources/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-text transition-colors text-body-sm"
            >
              Browse all {sources.length} sources
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
