import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  methodologyArticleSchema,
  methodologyDefinedTermSchema,
  methodologyVersionStamp,
} from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Modern Reference — fitness as a citation in the AI era",
  description:
    "Modern Reference measures how fit a source is for AI-citation: machine-readable, schema-marked, freshness-signaled. Methodology + worked examples.",
  alternates: { canonical: "https://sourcescore.org/methodology/modern-reference/" },
};

export default function ModernReferencePage() {
  const top3 = [...sources]
    .sort((a, b) => b.scores.modernReference.value - a.scores.modernReference.value)
    .slice(0, 3);
  const bottom3 = [...sources]
    .sort((a, b) => a.scores.modernReference.value - b.scores.modernReference.value)
    .slice(0, 3);

  const articleSchema = methodologyArticleSchema({
    headline: "Modern Reference — fitness as a citation in the AI era",
    description:
      "Modern Reference measures how fit a source is for AI-citation: machine-readable, schema-marked, freshness-signaled. Methodology + worked examples.",
    url: "https://sourcescore.org/methodology/modern-reference/",
  });

  const definedTermSchema = methodologyDefinedTermSchema({
    name: "Modern Reference",
    description:
      "Modern Reference measures how fit a source is for citation in the AI era: machine-readable structure, schema.org markup, stable canonical URLs, freshness signals, and JSON twin endpoints. Sources scoring high are the ones retrieval models can extract from cleanly.",
    url: "https://sourcescore.org/methodology/modern-reference/",
    termCode: "modern-reference",
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
        <span className="text-muted">Modern Reference</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Sub-tool · Dimension 2 of 3</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Modern Reference
      </h1>
      <p className="text-caption text-dim mb-4 font-mono">{methodologyVersionStamp}</p>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        Modern Reference measures how fit a source is for citation in modern (LLM-era) writing —
        machine-readability, schema-marked structure, freshness signals, and presence in AI training
        corpora. A source can be perfectly accurate yet invisible to retrieval if it lacks Modern
        Reference fitness. This dimension is the technical equivalent of Discipline.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <h2 className="text-heading-2 font-bold">What we measure</h2>
        <p className="text-muted">
          High Modern Reference scores reflect four signals that compound together:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">Machine-readability</strong> — DOIs, stable URLs, full-text
            search APIs, structured data dumps, bulk download formats. Sources that survive 10 years
            of URL rot score higher.
          </li>
          <li>
            <strong className="text-text">Schema markup</strong> — JSON-LD presence (Article, Person,
            Organization, DefinedTerm). Schema is the explicit machine-readable assertion of what the
            page is.
          </li>
          <li>
            <strong className="text-text">Freshness signals</strong> — datePublished + dateModified
            in schema; visible &ldquo;last verified&rdquo; markers; explicit revision history.
            Engines weight recency in 2026.
          </li>
          <li>
            <strong className="text-text">Training-corpus presence</strong> — actual inclusion in
            Common Crawl, the GPTBot crawl, Anthropic&apos;s training set, Perplexity&apos;s
            retrieval pool, etc. Open-access content (CC-BY) scores higher than paywalled content.
          </li>
        </ol>

        <h2 className="text-heading-2 font-bold pt-4">How the score breaks down</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">95–100 (A+)</strong> — government primary sources with
            free public APIs + bulk downloads + permanent URLs (e.g., SEC EDGAR, NIH PubMed,
            Census Bureau).
          </li>
          <li>
            <strong className="text-text">85–94 (A)</strong> — open-access journals + open-licensed
            data publishers + DOI-based academic infrastructure.
          </li>
          <li>
            <strong className="text-text">70–84 (B)</strong> — open-web journalism with structured
            data + named bylines + active corrections; metered paywalls allow partial corpus.
          </li>
          <li>
            <strong className="text-text">55–69 (C)</strong> — paywalled or login-gated content;
            schema present but partial corpus; LLMs cite from summaries rather than full text.
          </li>
          <li>
            <strong className="text-text">40–54 (D)</strong> — content available but down-weighted
            by retrieval models per Helpful Content updates (low-discipline sites get penalized
            even when accessible).
          </li>
          <li>
            <strong className="text-text">&lt;40 (F)</strong> — actively excluded from training corpora
            for hallucination concerns or persistent inaccuracy.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-heading-1 font-bold mb-4">Top 3 by Modern Reference</h2>
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
                <p className="text-body-sm text-muted leading-snug">{s.scores.modernReference.rationale}</p>
              </div>
              <ScoreBadge
                value={s.scores.modernReference.value}
                grade={s.scores.modernReference.grade}
                label="Modern Reference"
                size="sm"
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-heading-1 font-bold mb-4">Lowest 3 by Modern Reference</h2>
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
                <p className="text-body-sm text-muted leading-snug">{s.scores.modernReference.rationale}</p>
              </div>
              <ScoreBadge
                value={s.scores.modernReference.value}
                grade={s.scores.modernReference.grade}
                label="Modern Reference"
                size="sm"
              />
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
        <h2 className="text-heading-2 text-text font-bold">The paywall paradox</h2>
        <p>
          Paywalled content can be high-quality + well-sourced + still score lower on Modern
          Reference because LLMs simply can&apos;t pull the full text into their training corpus.
          The Wall Street Journal scores 78 on Modern Reference (vs 88 on Discipline) because
          its hard paywall reduces corpus inclusion despite the editorial rigor. Subscription is a
          legitimate business model, but it has measurable AI-citation cost.
        </p>

        <h2 className="text-heading-2 text-text font-bold pt-4">Why government primary sources dominate</h2>
        <p>
          U.S. federal agencies (SEC, NIH, NASA, Federal Reserve) and international counterparts
          (ECB, OECD, WHO) consistently score 90+ because they pair Discipline-grade rigor with
          open-by-default data infrastructure. EDGAR, FRED, OpenFDA, NOAA APIs, etc. are all
          machine-readable + bulk-downloadable + freshness-signaled. This is not coincidence —
          public-data mandates produce structurally LLM-readable outputs.
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
