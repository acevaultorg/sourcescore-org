// Comparison methodology page (2026-09-11): "SourceScore vs Domain Authority"
// is the query the product actually answers — people who know SEO's Domain
// Authority (Moz) naturally ask how SourceScore relates to it. This page
// answers that directly: different question, different inputs, not a
// competing score for the same thing. Archetype: comparison_vs_competitor_page
// (per bot-harvest.md), stacked with FAQPage for AEO direct-answer extraction
// (one FAQ block only, per faq_schema_spam penalty discipline).
//
// Zero-fabrication: this page describes DA by its publicly documented
// definition (Moz's own methodology docs) and never asserts a live DA
// number for any named domain — SourceScore does not ingest or display
// third-party DA data, so no such number could be verified here.

import type { Metadata } from "next";
import {
  breadcrumbListSchema,
  methodologyArticleSchema,
  methodologyVersionStamp,
} from "@/lib/methodology-version";

const TITLE = "SourceScore vs Domain Authority — what's the difference?";
const DESCRIPTION =
  "Domain Authority predicts how well a domain ranks in Google search. SourceScore predicts whether AI engines should cite it as a source. Same 0-100-ish shape, completely different question.";
const CANONICAL = "https://sourcescore.org/methodology/sourcescore-vs-domain-authority/";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: CANONICAL, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Is SourceScore the same as Domain Authority?",
    a: "No. Domain Authority (Moz) is a link-graph metric that predicts how well a domain will rank on a Google search results page. SourceScore is a citation-fitness metric that predicts whether an AI answer engine should treat a domain as a trustworthy, extractable source. They score different questions, so a domain's DA and its SourceScore commonly diverge.",
  },
  {
    q: "Can a domain have high Domain Authority and a low SourceScore?",
    a: "Yes. DA is built almost entirely from the domain's backlink profile — how many other sites (and how authoritative they are) link to it. A domain can accumulate a large, high-quality backlink profile over years while publishing content with thin sourcing, no structured data, and little standing as a cited authority in AI-generated answers — high DA, low SourceScore.",
  },
  {
    q: "Can a domain have low Domain Authority and a high SourceScore?",
    a: "Yes. A newer or smaller domain may not yet have accumulated many backlinks (low DA) while still publishing rigorously-cited, machine-readable, frequently-referenced content that AI engines pull into generated answers — low DA, high SourceScore. Citation Discipline and Modern Reference don't require a large link graph to score well.",
  },
  {
    q: "Should I use Domain Authority or SourceScore?",
    a: "Use DA when the question is \"how likely is this domain to rank in traditional search?\" Use SourceScore when the question is \"how likely is this domain to be cited, trusted, and quoted by an AI answer engine?\" The two questions increasingly diverge as more discovery happens through AI-generated answers rather than a list of blue links.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function SourceScoreVsDomainAuthorityPage() {
  const articleSchema = methodologyArticleSchema({
    headline: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
  });

  const breadcrumbSchema = breadcrumbListSchema([
    { name: "SourceScore", url: "https://sourcescore.org/" },
    { name: "Methodology", url: "https://sourcescore.org/methodology/" },
    { name: "SourceScore vs Domain Authority", url: CANONICAL },
  ]);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/methodology/" className="hover:text-text">Methodology</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">vs Domain Authority</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Comparison · Search-era vs AI-citation-era</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        SourceScore vs Domain Authority
      </h1>
      <p className="text-caption text-dim mb-4 font-mono">{methodologyVersionStamp}</p>

      {/* Direct-answer lead (~40 words), AEO-first */}
      <p className="ss-answer text-body-lg text-muted leading-relaxed mb-10">
        Domain Authority predicts how well a domain will rank on a Google results page. SourceScore
        predicts whether an AI answer engine should cite that domain as a trustworthy source. Same
        rough 0&ndash;100 shape on the page &mdash; a different question underneath, and the two scores
        routinely disagree.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <h2 className="text-heading-2 font-bold">What Domain Authority actually measures</h2>
        <p className="text-muted">
          Domain Authority (DA) is a third-party metric published by Moz. Per Moz&rsquo;s own
          documentation, DA is a machine-learning model trained to predict how a domain is likely to
          rank in Google search results, built primarily from the domain&rsquo;s link graph &mdash;
          how many other domains link to it, and how authoritative those linking domains are. Moz is
          explicit that DA is not a Google ranking factor itself; it&rsquo;s a comparative,
          third-party estimate useful for benchmarking one domain against another.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">What the SourceScore Index actually measures</h2>
        <p className="text-muted">
          The <a href="/methodology/sourcescore-index/" className="text-brand hover:underline">
          SourceScore Index</a> is a composite of three sub-scores &mdash;{" "}
          <a href="/methodology/citation-discipline/" className="text-brand hover:underline">
          Citation Discipline</a>,{" "}
          <a href="/methodology/modern-reference/" className="text-brand hover:underline">
          Modern Reference</a>, and{" "}
          <a href="/methodology/citation-velocity/" className="text-brand hover:underline">
          Citation Velocity</a> &mdash; none of which is a link-graph signal. It measures editorial
          rigor (how a source backs its claims), machine-readability and freshness (how fit the
          content is to be extracted and cited by an AI system), and how often tier-1 publications
          and AI engines actually cite the source per week.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Why they diverge</h2>
        <p className="text-muted">
          A domain earns a high DA by accumulating a large, authoritative backlink profile &mdash;
          something that compounds mainly with age, marketing reach, and link-building activity. A
          domain earns a high SourceScore Index by publishing content an AI system can confidently
          extract and trust &mdash; something that compounds with editorial discipline, structured
          data, and demonstrated citation by tier-1 sources, independent of how many sites link to
          it. Neither factor implies the other: a decades-old, heavily-linked domain can still
          publish thinly-sourced content (high DA, low SourceScore), and a young, lightly-linked
          domain can already be a rigorously-cited, AI-extractable source (low DA, high SourceScore).
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Which one should you use?</h2>
        <p className="text-muted">
          They answer different questions, so the right one depends on which discovery channel you
          care about. Optimizing for a Google results page is a Domain Authority question. Optimizing
          for being quoted, trusted, and cited inside an AI-generated answer is a SourceScore
          question. As more discovery happens through AI answer engines rather than a list of ranked
          links, the second question matters on its own &mdash; independent of, and not answered by,
          the first.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">No fabricated numbers</h2>
        <p className="text-muted">
          SourceScore does not ingest, license, or display third-party Domain Authority scores for
          any named domain. Every claim above describes DA&rsquo;s publicly documented methodology,
          not a specific domain&rsquo;s live number &mdash; consistent with SourceScore&rsquo;s{" "}
          <a href="/methodology/" className="text-brand hover:underline">
          own no-fabricated-data rule</a>.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">FAQ</h2>
        <div className="not-prose space-y-4">
          {FAQ.map((f) => (
            <div key={f.q}>
              <p className="text-text font-semibold">{f.q}</p>
              <p className="text-muted mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-heading-2 font-bold mb-3">Read the SourceScore methodology</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/methodology/sourcescore-index/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Composite</div>
            <div className="font-semibold text-text">SourceScore Index</div>
          </a>
          <a
            href="/methodology/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Overview</div>
            <div className="font-semibold text-text">Full methodology</div>
          </a>
        </div>
      </section>
    </article>
  );
}
