import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "FAQ — SourceScore" },
  description:
    "Frequently asked questions about SourceScore: what the score measures, how to use it, the rubric, scoring frequency, who runs the site, corrections.",
  alternates: { canonical: "https://sourcescore.org/faq/" },
};

const faqs = [
  {
    q: "What is SourceScore?",
    a: "SourceScore is a transparent, methodology-first index of source quality in the AI-citation era. We score web sources against a published 6-dimension rubric (originality, methodology disclosure, citation density, authority signals, freshness, transparency of correction) and publish the scores so anyone can re-derive them from the underlying signals.",
  },
  {
    q: "Why does this exist?",
    a: "AI engines (ChatGPT, Claude, Perplexity, Gemini) surface a small subset of sources as authoritative citations. The criteria are opaque — there is no public list, no published ranking, no transparent rubric describing which sources LLMs cite most often or why. SourceScore publishes a transparent rubric and ranks sources against it so publishers, researchers, and operators can understand where their site stands and what would move it.",
  },
  {
    q: "How is a SourceScore computed?",
    a: "Every score is the weighted sum of six dimensions defined on the methodology page: (1) originality of the underlying claims; (2) methodology disclosure — does the source explain how it gets its data; (3) citation density — does it link back to primary sources; (4) authority signals — author bylines, Person + Organization schema, ownership transparency; (5) freshness — datePublished + dateModified discipline; (6) correction transparency — how does the source handle errors. Each dimension has explicit sub-signals you can verify by reading the source.",
  },
  {
    q: "Are higher scores always better?",
    a: "Higher scores reflect a source that better matches the rubric — which is a strong proxy for citation-worthiness in an LLM-era retrieval system. They are not absolute truth or rank ordering of journalistic merit. A source can be excellent at one purpose (long-form narrative reporting) and score lower than a reference dataset that is purpose-built for the rubric. Read the per-dimension breakdown, not just the headline number.",
  },
  {
    q: "How often are scores updated?",
    a: "The full index re-runs monthly. Individual high-traffic sources are re-scored on demand when their publisher updates infrastructure (new schema, byline policy, methodology page) or when a notable event materially changes the freshness or correction-policy state. Each source page shows the Last scored date.",
  },
  {
    q: "Can I pay to raise my score?",
    a: "No. SourceScore does not accept payment of any kind in exchange for inclusion, ranking position, or score adjustment. Methodology changes are versioned and announced before they apply. If a publisher disagrees with a score, they can file a correction request (see the question below) and we re-verify against the rubric.",
  },
  {
    q: "How do I submit a correction or appeal a score?",
    a: "Email the address on the contact page with the source URL, the specific dimension you think is mis-scored, and the evidence you think the rubric missed (a methodology page we did not detect, a corrections page, schema we did not parse). We re-verify within 14 days. If the correction holds, the score updates and the source page logs the date and reason.",
  },
  {
    q: "Who runs SourceScore?",
    a: "SourceScore is operated by a small independent team. It is a sister project to HoldLens (an SEC-filings reference index) and other reference-grade fleet sites. The methodology is our intellectual property; the public-source data we score is credited to its publishers. SourceScore is not affiliated with OpenAI, Anthropic, Google, Perplexity, or any AI-engine provider.",
  },
  {
    q: "What data sources do you draw from?",
    a: "We score what the open web exposes — published methodology pages, byline structures, schema.org markup, citation patterns, datePublished/dateModified fields, robots and llms.txt files, and the visible correction policy of each source. Where a publisher exposes additional structured data (RSS feeds, sitemap-news, dataset endpoints) we factor that in. We do not score behind paywalls or login walls.",
  },
  {
    q: "Why am I seeing a score for a source I had not heard of?",
    a: "The index is broad on purpose. Many high-citation sources in AI engines are niche reference sites, datasets, and methodology-heavy projects rather than household-name news brands. Part of what SourceScore documents is the gap between editorial reputation and AI-citation reality — and they often diverge.",
  },
  {
    q: "Can I embed a SourceScore badge on my site?",
    a: "Yes — every source page has an embed snippet (an iframe-based badge that updates when the score updates). The badge is free to use; we ask that you do not modify the markup so the underlying score and Last scored date remain visible. Embed instructions are on each source page.",
  },
  {
    q: "Is SourceScore affiliated with any AI engine or publisher?",
    a: "No. SourceScore is independent. We do not accept funding from AI engines, publishers, SEO platforms, or PR firms. Methodology decisions are made by the editorial team; revenue (where it exists) comes from non-affecting sources — display ads outside the source pages and embedded badge usage. Affiliate disclosures, where they apply, are shown on the affected page.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-display-2 font-bold tracking-tight mb-4">
          Frequently asked questions
        </h1>
        <p className="text-body-lg text-muted leading-relaxed mb-8">
          A quick reference for publishers, researchers, and operators using
          SourceScore. The{" "}
          <a href="/methodology/" className="text-brand hover:underline">
            methodology page
          </a>{" "}
          has the full rubric, weighting, and source-coverage detail.
        </p>

        <dl className="space-y-8">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-heading-3 font-bold leading-snug mb-2">
                {q}
              </dt>
              <dd className="text-body text-text leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-12 pt-6 border-t border-muted/30 text-body-sm text-muted">
          <p>
            Question not covered here?{" "}
            <a href="/contact/" className="text-brand hover:underline">
              Contact us
            </a>{" "}
            and we will add it.
          </p>
        </section>
      </article>
    </>
  );
}
