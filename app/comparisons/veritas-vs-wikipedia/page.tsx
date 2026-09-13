// /comparisons/veritas-vs-wikipedia/

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "VERITAS vs Wikipedia API — when to use each for LLM grounding";
const SUBTITLE =
  "Wikipedia is a free, vast knowledge encyclopedia. VERITAS is a typed, signed claim-verification API. They aren't competitors — they solve different shapes of the same problem.";
const CANONICAL = "https://sourcescore.org/comparisons/veritas-vs-wikipedia/";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: SUBTITLE, url: CANONICAL, type: "article" },
};

export default function VeritasVsWikipediaPage() {
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
              { name: "VERITAS vs Wikipedia", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/comparisons/" className="hover:underline">Comparisons</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">VERITAS vs Wikipedia</span>
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
        <h2>At a glance</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Wikipedia API</th>
              <th>SourceScore VERITAS</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Content shape</td><td>Free-text articles</td><td>Atomic claims (subject + predicate + object)</td></tr>
            <tr><td>Coverage</td><td>Vast (any topic)</td><td>Narrow (AI/ML v0)</td></tr>
            <tr><td>Verification</td><td>Community-edited; revision history</td><td>Editorial review with cited primary evidence; source count per record</td></tr>
            <tr><td>Integrity metadata</td><td>None</td><td>SourceScore-issued HMAC tag, not publicly verifiable</td></tr>
            <tr><td>Atomic-claim lookup</td><td>Requires parsing prose</td><td>Direct (verify endpoint)</td></tr>
            <tr><td>Cost</td><td>Free, rate-limited</td><td>Public v0 endpoints are free; paid tiers are not live</td></tr>
            <tr><td>Latency</td><td>Provider and request dependent</td><td>Provider and request dependent</td></tr>
            <tr><td>Update frequency</td><td>Community-maintained</td><td>Catalog updates as reviewed</td></tr>
            <tr><td>Best for</td><td>Reference lookup, summary</td><td>Verify-then-respond, agent grounding</td></tr>
          </tbody>
        </table>

        <h2>Honest verdict per use case</h2>

        <h3>Use Wikipedia when:</h3>
        <ul>
          <li>You need broad knowledge coverage — geography, history, biography, general science</li>
          <li>Free-text content (summaries, narrative) fits your application</li>
          <li>You can benchmark and accept the provider latency in your own stack</li>
          <li>You do not need SourceScore&apos;s structured integrity metadata</li>
          <li>Your application is non-commercial OR comfortable parsing prose</li>
        </ul>

        <h3>Use VERITAS when:</h3>
        <ul>
          <li>You need atomic verified claims for AI/ML facts (model releases, paper dates, parameter counts)</li>
          <li>You&apos;re building a generate-then-verify pipeline</li>
          <li>You need structured claim records and cited evidence</li>
          <li>You need structured JSON outputs (not prose to parse)</li>
        </ul>

        <h3>Use both when:</h3>
        <p>
          Most production grounding pipelines do both. Wikipedia
          handles general-knowledge queries (&quot;capital of France&quot;,
          &quot;founder of Apple&quot;); VERITAS handles AI/ML specifics
          where cited evidence + atomic-claim shape matter. Cascade: try
          VERITAS first for AI/ML topics, fall through to Wikipedia
          for broader queries.
        </p>

        <h2>Concrete: the &quot;Transformer paper&quot; query</h2>
        <p>
          Both Wikipedia and VERITAS can answer &quot;Who wrote the
          Transformer paper?&quot;
        </p>
        <ul>
          <li>
            <strong>Wikipedia:</strong> Article on &quot;Attention is
            all you need&quot; — narrative paragraphs naming Vaswani
            et al. Your application parses the article. Response time depends on
            the request and provider. No signature.
          </li>
          <li>
            <strong>VERITAS:</strong>{" "}
            <code>POST /api/v1/verify
            {`{claim: "Transformer paper authors"}`}</code> returns:
            <code>{`{bestMatch: {subject: "Transformer architecture",
            predicate: "introduced_in_paper", object: "Attention Is All
            You Need (Vaswani et al., 2017)"}, signature: {...HMAC-SHA256...}}`}</code>.
            The HMAC field is SourceScore-issued integrity metadata, not a public signature.
          </li>
        </ul>
        <p>
          For a chatbot, Wikipedia&apos;s prose may be richer. For a
          production agent loop that needs to cite the fact in an
          audit trail, VERITAS&apos;s typed record with cited evidence is cleaner.
        </p>

        <h2>What we&apos;re not</h2>
        <p>
          VERITAS doesn&apos;t replace Wikipedia. Wikipedia covers
          everything; we cover AI/ML. Our methodology (cited primary
          evidence, source counts, and editorial review) doesn&apos;t scale
          to all human knowledge. Wikipedia&apos;s open community model
          does. The right move for most production systems is to use
          both.
        </p>

        <h2>Related</h2>
        <ul>
          <li><a href="/comparisons/veritas-vs-wolfram-alpha/">VERITAS vs Wolfram Alpha</a></li>
          <li><a href="/comparisons/veritas-vs-search-grounding/">VERITAS vs LLM search-grounding</a></li>
          <li><a href="/concepts/llm-grounding/">LLM grounding concept</a></li>
          <li><a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a></li>
        </ul>
      </section>
    </article>
  );
}
