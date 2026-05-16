// /comparisons/veritas-vs-search-grounding/ — vs Perplexity / ChatGPT search / Bing grounding.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "VERITAS vs LLM search-grounding (Perplexity, ChatGPT search)";
const SUBTITLE =
  "LLM-with-search grounds via live web retrieval. VERITAS grounds via signed verified-claim envelopes. Latency, reliability, citation quality, signature integrity — trade-offs explained.";
const CANONICAL = "https://sourcescore.org/comparisons/veritas-vs-search-grounding/";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: SUBTITLE, url: CANONICAL, type: "article" },
};

export default function VeritasVsSearchGroundingPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: TITLE,
            description: SUBTITLE,
            datePublished: "2026-05-17",
            dateModified: "2026-05-17",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org/" },
            publisher: {
              "@type": "Organization",
              name: "SourceScore",
              logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
            },
            mainEntityOfPage: CANONICAL,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Comparisons", url: "https://sourcescore.org/comparisons/" },
              { name: "VERITAS vs LLM search-grounding", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/comparisons/" className="hover:underline">Comparisons</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">VERITAS vs search-grounding</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Two different grounding philosophies</h2>
        <p>
          <strong>LLM-with-search (Perplexity, ChatGPT search, Bing,
          You.com, Brave Search AI):</strong> the model issues a search
          query at response-time. Pulls live web results. Generates an
          answer citing the fetched pages.
        </p>
        <p>
          <strong>SourceScore VERITAS:</strong> the model (or your
          application code) queries a hand-curated verified-claim API.
          Returns a signed atomic claim envelope.
        </p>
        <p>
          Both are valid grounding patterns. They optimize for
          different properties: search-grounding for recency +
          breadth; VERITAS for citation integrity + signature + atomic
          shape.
        </p>

        <h2>At a glance</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>LLM-with-search</th>
              <th>SourceScore VERITAS</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Source</td><td>Live web search results</td><td>Hand-curated catalog</td></tr>
            <tr><td>Coverage</td><td>Whatever&apos;s on the web</td><td>AI/ML (v0); narrow but deep</td></tr>
            <tr><td>Latency</td><td>~2-10s (search + read + generate)</td><td>~80ms (single envelope fetch)</td></tr>
            <tr><td>Recency</td><td>Up-to-the-minute</td><td>Weekly + on-event refresh</td></tr>
            <tr><td>Citation quality</td><td>Variable (depends on retrieved pages)</td><td>Always ≥2 primary sources</td></tr>
            <tr><td>Signature</td><td>None</td><td>HMAC-SHA256 on every envelope</td></tr>
            <tr><td>Reliability</td><td>Variable (search index quality matters)</td><td>Deterministic (catalog hand-verified)</td></tr>
            <tr><td>Cost</td><td>$5-20/1000 queries</td><td>Free 1k/mo, then €19+</td></tr>
            <tr><td>Atomic-claim shape</td><td>Free-text response with citations</td><td>Subject + predicate + object envelope</td></tr>
          </tbody>
        </table>

        <h2>The recency trade-off</h2>
        <p>
          Search-grounding wins for recent events: today&apos;s news,
          this week&apos;s product release, breaking research papers.
          VERITAS&apos;s catalog refreshes weekly + on major events,
          but isn&apos;t real-time.
        </p>
        <p>
          However: for the AI/ML niche where VERITAS specializes,
          search-grounding routinely surfaces stale or unreliable
          sources. We&apos;ve seen search-grounded LLMs cite a 2023
          blog post about Claude 3 capabilities (incorrect by 2025) or
          a fan-wiki page about Llama 3.1 with the wrong context
          window. The web is noisy; hand verification beats search
          ranking for established facts.
        </p>

        <h2>The signature trade-off</h2>
        <p>
          Search-grounding has no signature. If you log a search-
          grounded response for an audit trail, you log free text plus
          a list of URLs. Those URLs can rot, change, or be tampered.
          The audit trail degrades over time.
        </p>
        <p>
          VERITAS&apos;s HMAC-SHA256 signature gives you a
          cryptographically-anchored response: log the envelope, log
          the signature, log the public DID (did:web:sourcescore.org).
          Three years later you can verify the response was genuine
          and unmodified.
        </p>
        <p>
          For regulated industries (finance, legal, healthcare-research,
          academic citation), signed envelopes matter. For general
          consumer apps, they don&apos;t.
        </p>

        <h2>The atomic-claim shape trade-off</h2>
        <p>
          Search-grounding emits free-text responses with citations
          interleaved. Your downstream code must parse the response to
          extract structured information.
        </p>
        <p>
          VERITAS emits structured atomic claims:
          <code>{`{subject: "Llama 3.1", predicate: "released_on", object: "2024-07-23"}`}</code>.
          Your downstream code consumes the structure directly. Useful
          for fact-only displays, citation databases, structured
          report generation.
        </p>

        <h2>Honest verdict per use case</h2>

        <h3>Use search-grounding when:</h3>
        <ul>
          <li>You need recent events (today&apos;s news, this month&apos;s product launches)</li>
          <li>You need broad knowledge coverage</li>
          <li>You&apos;re fine with ~2-10s latency</li>
          <li>You don&apos;t need cryptographic signatures</li>
          <li>Your application generates free-text responses (chat, search)</li>
        </ul>

        <h3>Use VERITAS when:</h3>
        <ul>
          <li>Your domain is AI/ML (or future Y2 verticals)</li>
          <li>You need sub-100ms latency</li>
          <li>You need cryptographic signatures for audit trails</li>
          <li>You need atomic claim shape</li>
          <li>You need deterministic responses (same query → same answer)</li>
          <li>You&apos;re building generate-then-verify pipelines</li>
        </ul>

        <h3>Use both when:</h3>
        <p>
          Sophisticated agents do both. Search-grounding for breaking
          news / breadth; VERITAS for AI/ML facts requiring signature
          + structure. The agent decides which tool to invoke based on
          query shape.
        </p>

        <h2>What we&apos;re not</h2>
        <p>
          VERITAS isn&apos;t a web search engine. We can&apos;t
          retrieve fresh news. We don&apos;t crawl. Our catalog is
          weekly-refreshed at best.
        </p>
        <p>
          We&apos;re not trying to replace Perplexity or ChatGPT
          search for general-knowledge queries. We&apos;re a precision
          tool for the verification pass that happens AFTER retrieval
          — or the deterministic-answer pass for established facts that
          don&apos;t need re-searching every time.
        </p>

        <h2>Related</h2>
        <ul>
          <li><a href="/comparisons/veritas-vs-wikipedia/">VERITAS vs Wikipedia</a></li>
          <li><a href="/comparisons/veritas-vs-wolfram-alpha/">VERITAS vs Wolfram Alpha</a></li>
          <li><a href="/concepts/llm-grounding/">LLM grounding concept</a></li>
          <li><a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a></li>
        </ul>
      </section>
    </article>
  );
}
