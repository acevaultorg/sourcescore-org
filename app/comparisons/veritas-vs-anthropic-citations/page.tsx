// /comparisons/veritas-vs-anthropic-citations/ — buyer-intent direct competitor.
//
// Targets "VERITAS vs Anthropic Citations API" / "alternative to
// Anthropic Citations" / "Claude API citations grounding" queries.
// Aleyda Solis 10-char #10 Transactable.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "VERITAS vs Anthropic Citations API — when to use each grounding approach";
const SUBTITLE =
  "Anthropic Citations API (2025-01-23) grounds Claude responses in user-supplied documents. SourceScore VERITAS grounds in a signed, sourced, externally-citable claim catalog. They solve different parts of the hallucination problem — when to use which, and when to combine.";
const CANONICAL = "https://sourcescore.org/comparisons/veritas-vs-anthropic-citations/";
const PUBLISHED = "2026-05-17";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: SUBTITLE,
    url: CANONICAL,
    type: "article",
    publishedTime: PUBLISHED,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SUBTITLE },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: TITLE,
  description: SUBTITLE,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  mainEntityOfPage: CANONICAL,
  author: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    url: "https://sourcescore.org/",
  },
  editor: {
    "@type": "Person",
    "@id": "https://sourcescore.org/about/#person-editorial-lead",
    name: "SourceScore Editorial Team",
    url: "https://sourcescore.org/about/",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
};

export default function VeritasVsAnthropicCitationsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Comparisons", url: "https://sourcescore.org/comparisons/" },
              { name: "VERITAS vs Anthropic Citations API", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/comparisons/" className="hover:underline">Comparisons</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">vs Anthropic Citations API</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Comparison · Head-to-head · Buyer intent
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>At a glance</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Anthropic Citations API</th>
                <th>SourceScore VERITAS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Released</td>
                <td>2025-01-23</td>
                <td>2026-05-09 (v0.1)</td>
              </tr>
              <tr>
                <td>Source of truth</td>
                <td>User-supplied documents at request time</td>
                <td>Curated catalog of pre-verified atomic claims</td>
              </tr>
              <tr>
                <td>Cite-format</td>
                <td>Sentence-level character-range citations into your docs</td>
                <td>Stable claim ID + HMAC signature + canonical /claims/[id]/ URL</td>
              </tr>
              <tr>
                <td>Locked to provider</td>
                <td>Yes — Claude API only</td>
                <td>No — works with any LLM (OpenAI, Anthropic, Google, Llama, local)</td>
              </tr>
              <tr>
                <td>Verifiability outside the model</td>
                <td>Not signed — trust Anthropic</td>
                <td>HMAC-SHA256 — recompute locally with shared secret</td>
              </tr>
              <tr>
                <td>External citability</td>
                <td>No public URL for the cited fact</td>
                <td>Every claim has stable public /claims/[id]/ page</td>
              </tr>
              <tr>
                <td>Pricing</td>
                <td>Same as Claude API tokens (input + output)</td>
                <td>1,000/mo free; €19-499/mo paid tiers</td>
              </tr>
              <tr>
                <td>Latency</td>
                <td>Within Claude API call (single round-trip)</td>
                <td>~80ms separate API call</td>
              </tr>
              <tr>
                <td>Scope</td>
                <td>Whatever docs you upload</td>
                <td>AI/ML vertical today; expanding</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>What Anthropic Citations API does</h2>
        <p>
          You upload context documents to Claude (PDF, plain text). The
          model generates a response that includes inline cite annotations
          pointing to specific character ranges in your uploaded
          documents. Anthropic returns the citations as structured JSON
          alongside the model output:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`{
  "type": "text",
  "text": "Llama 3.1 was released July 23, 2024.",
  "citations": [{
    "type": "page_location",
    "cited_text": "...released on July 23, 2024 with three sizes...",
    "document_index": 0,
    "start_char_index": 1432,
    "end_char_index": 1494
  }]
}`}</code></pre>
        <p>
          Strong for: pure RAG-style use cases where the user supplies
          their own documents and wants citations back to where in
          those documents each claim came from.
        </p>

        <h2>What SourceScore VERITAS does</h2>
        <p>
          You query a curated catalog of pre-verified claims. Each
          claim has ≥2 primary sources, HMAC-SHA256 signature, stable
          16-hex ID, and a public canonical URL.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`{
  "id": "abc123def456gh78",
  "subject": "Llama 3.1",
  "predicate": "released_on",
  "object": "2024-07-23",
  "confidence": 1.0,
  "sources": [
    { "url": "...", "title": "...", "publisher": "Meta AI", ... },
    { "url": "...", "title": "...", "publisher": "Hugging Face", ... }
  ],
  "signature": "hmac-sha256:7a2f...",
  "citationUrl": "https://sourcescore.org/claims/abc123def456gh78/"
}`}</code></pre>
        <p>
          Strong for: factual grounding where the user does NOT supply
          documents, you need citation URLs that survive outside the
          assistant context, you want to verify provenance independently
          of the LLM provider, or you&apos;re running multi-LLM
          deployments.
        </p>

        <h2>When to use Anthropic Citations API</h2>
        <ul>
          <li>
            You&apos;re building a Claude-API-exclusive product
          </li>
          <li>
            Users supply documents at runtime (legal contract analysis,
            PDF Q&A, research-paper chat)
          </li>
          <li>
            Citations only need to be valid in-session, not externally
            citable
          </li>
          <li>
            Single-vendor stack is OK
          </li>
          <li>
            Latency-critical (single round-trip beats two)
          </li>
        </ul>

        <h2>When to use VERITAS</h2>
        <ul>
          <li>
            You&apos;re building multi-LLM (OpenAI + Anthropic + Llama)
            and need the same grounding layer across providers
          </li>
          <li>
            You need <em>externally-citable</em> URLs for verified
            facts (newsroom AI, research tool, content moderation
            output, blog assistants)
          </li>
          <li>
            You need <em>cryptographically verifiable</em> proof the
            answer wasn&apos;t tampered with mid-flight
          </li>
          <li>
            You want pre-curated AI/ML facts the catalog already
            covers (model release dates, paper authorship,
            architectural facts) without forcing users to upload
            their own corpus
          </li>
          <li>
            You want a free public catalog (browseable, no signup) as
            part of your trust signal
          </li>
        </ul>

        <h2>When to use both</h2>
        <p>
          The cleanest pattern combines them: use Anthropic Citations
          API for user-supplied docs (legal contract, research paper
          the user uploaded), and use VERITAS for the AI/ML reference
          layer (when did Llama 3.1 release, who wrote &quot;Attention
          Is All You Need&quot;, what&apos;s Mixtral 8x7B&apos;s
          architecture). User-facing response gets both kinds of
          citations: ones into their document + ones to the public
          reference catalog.
        </p>

        <h2>What VERITAS does NOT do</h2>
        <ul>
          <li>
            Cite into user-uploaded documents — that&apos;s Anthropic
            Citations API&apos;s job
          </li>
          <li>
            Work without a network call (we&apos;re an API)
          </li>
          <li>
            Cover topics outside the AI/ML vertical today (Y2+
            expansion: finance, regulation, health-research)
          </li>
          <li>
            Real-time facts — catalog is curated, weekly-updated, not
            second-by-second live
          </li>
        </ul>

        <h2>What Anthropic Citations does NOT do</h2>
        <ul>
          <li>
            Provide externally-citable URLs (citations only valid in
            response context)
          </li>
          <li>
            Cryptographically sign citations
          </li>
          <li>
            Work with non-Claude LLMs
          </li>
          <li>
            Pre-verify facts — the model emits whatever the documents
            say, including any errors they contain
          </li>
        </ul>

        <h2>Verdict</h2>
        <p>
          They&apos;re complementary, not competitive. Anthropic
          Citations API solves the user-doc-RAG citation problem
          well within the Claude API. VERITAS solves the
          shared-knowledge-base + cryptographic-provenance + multi-LLM
          problem. Most production AI products end up using both.
        </p>
        <p>
          Pick Anthropic Citations API if: pure Claude stack + user-doc
          RAG.
          <br />
          Pick VERITAS if: multi-LLM, external citations needed,
          cryptographic provenance required, or AI/ML reference facts.
          <br />
          Pick both if: production AI assistant where users care about
          fact-quality and you want to grant the broadest verification
          surface.
        </p>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/comparisons/veritas-vs-search-grounding/">VERITAS vs LLM search-grounding</a>
            {" "}(Perplexity, ChatGPT search)
          </li>
          <li>
            <a href="/comparisons/veritas-vs-wikipedia/">VERITAS vs Wikipedia</a>
          </li>
          <li>
            <a href="/comparisons/veritas-vs-wolfram-alpha/">VERITAS vs Wolfram Alpha</a>
          </li>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a> — the
            broader pattern
          </li>
          <li>
            <a href="/docs/integrations/anthropic-sdk/">Anthropic SDK integration</a>
            {" "}— use VERITAS alongside Anthropic Citations API
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Already on Claude API? Pair Anthropic Citations API for
          user-supplied doc RAG + VERITAS for AI/ML reference facts.
          Browse the{" "}
          <a href="/claims/" className="underline">346 verified claims</a>
          {" "}or run the{" "}
          <a href="/quickstart/" className="underline">5-min quickstart</a>.
        </p>
      </footer>
    </article>
  );
}
