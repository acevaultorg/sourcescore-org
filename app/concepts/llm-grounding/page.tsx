// /concepts/llm-grounding/ — SEO pillar page for "llm grounding" + adjacent
// high-intent queries ("ground llm responses", "llm hallucination
// grounding", "what is llm grounding").
//
// Format: standalone explainer (Wikipedia-rival) that's useful even
// without VERITAS. Aleyda 10-char #2 Useful + #4 Extractable + #8
// Differentiated.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE = "LLM grounding — definition, patterns, and how to implement it";
const SUBTITLE =
  "Grounding constrains a language model's output to verifiable, retrievable facts. Three patterns work in production: prompt-stuffing, retrieval-augmented generation, and signed-claim verification. Trade-offs explained.";
const SLUG = "llm-grounding";
const CANONICAL = `https://sourcescore.org/concepts/${SLUG}/`;

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
    url: "https://sourcescore.org",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  about: [
    { "@type": "Thing", name: "LLM grounding" },
    { "@type": "Thing", name: "Retrieval-Augmented Generation" },
    { "@type": "Thing", name: "LLM hallucination" },
    { "@type": "Thing", name: "Citation verification" },
  ],
};

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "LLM grounding",
  description:
    "The practice of constraining a language model's generated output to facts that can be verified against an external source. Grounding is the inverse of free-form generation: instead of trusting the model's parametric memory, you provide retrieval evidence the model must cite.",
  inDefinedTermSet: "https://sourcescore.org/concepts/",
  url: CANONICAL,
};

export default function LlmGroundingConcept() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
              { name: "LLM grounding", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">LLM grounding</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2 id="definition">Definition</h2>
        <p>
          <strong>LLM grounding</strong> is the practice of constraining
          a language model&apos;s generated output to facts that can be
          verified against an external source. Grounding is the inverse
          of free-form generation: instead of trusting the model&apos;s
          parametric memory, you provide retrieval evidence the model
          must cite.
        </p>
        <p>
          The point of grounding is not to make the model say less.
          It&apos;s to make the model&apos;s assertions{" "}
          <em>auditable</em>. Every fact the model emits should be
          traceable to a specific external statement — preferably with
          author, publication date, and a canonical URL.
        </p>

        <h2 id="why-it-matters">Why it matters</h2>
        <p>
          Modern LLMs hallucinate confidently. They generate fluent,
          plausible, structurally-correct text that is sometimes
          factually wrong. The error rate depends heavily on domain:
          frontier models in 2026 score &lt;5% hallucination on
          well-trodden questions (capitals, recent news the training set
          covered) and 15-40% on long-tail technical questions (which
          version of a library shipped which feature in what month).
        </p>
        <p>
          Grounding doesn&apos;t fix hallucination — it makes hallucination{" "}
          <em>detectable</em>. When every assertion has a citation, an
          unverified assertion stands out. A reviewer (human or software)
          can flag, strip, or follow the citation to verify.
        </p>

        <h2 id="three-patterns">Three patterns that work in production</h2>

        <h3 id="pattern-prompt-stuffing">1. Prompt-stuffing</h3>
        <p>
          The simplest grounding pattern: paste a curated set of facts
          into the model&apos;s context window and instruct it to answer
          using only those facts.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`SYSTEM: You are a precise assistant. Answer using ONLY the facts below.
Cite every fact with [n]. If the facts don't cover the question, say so.

[1] The Transformer architecture was introduced in Attention Is All You Need (Vaswani et al., 2017).
[2] GPT-4 was released by OpenAI on 2023-03-14.
[3] Llama 2 was released by Meta on 2023-07-18.

USER: When was the Transformer introduced?
ASSISTANT: The Transformer was introduced in 2017 by Vaswani et al. [1]`}</code></pre>
        <p>
          <strong>When to use:</strong> small fact catalogs (&lt;50
          claims), short context windows, low query volume. Prompt-stuffing
          is the right starting point because it has no infrastructure
          requirement.
        </p>
        <p>
          <strong>When it breaks:</strong> the catalog grows past what
          fits in the context window. Once you have 500+ facts you&apos;re
          paying tokens for 495 irrelevant facts on every query.
        </p>

        <h3 id="pattern-rag">2. Retrieval-augmented generation (RAG)</h3>
        <p>
          Index your fact corpus with embeddings. At query time, retrieve
          the top-K relevant chunks. Insert them into the prompt as
          context. Generate.
        </p>
        <p>
          This is the most common production pattern — Pinecone, Weaviate,
          Qdrant, pgvector, plus a chain library (LangChain / LlamaIndex)
          to orchestrate retrieve-then-stuff.
        </p>
        <p>
          <strong>When to use:</strong> large unstructured corpus
          (documents, articles, knowledge bases). RAG handles
          variable-shape content well.
        </p>
        <p>
          <strong>When it breaks:</strong> the retrieved chunks are noisy
          or unverified. Embeddings retrieve <em>semantically similar</em>
          content, not <em>factually-correct</em> content. The model
          still drifts off the chunks because chunks aren&apos;t typed
          contracts — they&apos;re prose. Hallucination rate drops from
          ~30% to ~10% in typical RAG deployments, not to ~0%.
        </p>

        <h3 id="pattern-signed-claims">3. Signed-claim verification</h3>
        <p>
          Instead of (or in addition to) retrieving prose chunks, retrieve
          structured claims with signatures. Each claim is{" "}
          <code>(subject, predicate, object)</code> with verified primary
          sources and a confidence score.
        </p>
        <p>
          The model can&apos;t drift off a typed claim the way it drifts
          off prose. And because every claim ships with a signature, the
          chain can re-verify integrity locally — useful for high-stakes
          deployments where you need to prove a claim wasn&apos;t modified
          mid-flight.
        </p>
        <p>
          This is the pattern SourceScore VERITAS implements. The catalog
          ships as a JSON twin (
          <a href="/api/v1/claims.json"><code>/api/v1/claims.json</code></a>
          ) plus per-claim envelopes signed with HMAC-SHA256.
        </p>
        <p>
          <strong>When to use:</strong> high-precision domains where
          users notice wrong facts. Medical, financial, scientific,
          technical-reference. Any domain where &quot;close enough&quot; is
          not close enough.
        </p>
        <p>
          <strong>When it&apos;s wrong:</strong> if your domain isn&apos;t
          covered by an existing signed-claim catalog, you have to build
          your own — which costs engineering time. RAG is cheaper to
          stand up.
        </p>

        <h2 id="comparison">Comparing the three patterns</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800"></th>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">Prompt-stuff</th>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">RAG</th>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">Signed claims</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Setup cost</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Minutes</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Days</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Minutes (consume) / weeks (build)</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Per-query latency</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Low (no retrieval step)</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">~50-200ms retrieval</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">~50-150ms verification</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Hallucination rate</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">~5% (within scope)</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">~10-15%</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">&lt;1% on verified claims</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Auditability</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Manual</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Manual</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Programmatic (signature)</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Catalog size limit</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">~50-100 facts</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Millions of chunks</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Limited by curation effort</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Domain coverage</td>
                <td className="p-3">Whatever you paste</td>
                <td className="p-3">Whatever you index</td>
                <td className="p-3">Whatever the catalog covers</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="combining">Combining patterns in production</h2>
        <p>
          The patterns are not mutually exclusive. A typical production
          architecture stacks them:
        </p>
        <ol>
          <li>
            <strong>RAG</strong> over your unstructured corpus (docs,
            articles, knowledge base) for breadth.
          </li>
          <li>
            <strong>Signed claims</strong> for the high-precision sub-
            domain where you need verifiable atoms (e.g., VERITAS for
            AI/ML facts, your own signed catalog for product facts).
          </li>
          <li>
            <strong>Prompt-stuffing</strong> for invariant facts that
            apply to every query (e.g., the user&apos;s timezone, the
            current date).
          </li>
        </ol>
        <p>
          The model retrieves from all three at query time. The output
          attaches the strongest available citation to each assertion:
          signed claim id when possible, RAG chunk URL otherwise,
          prompt-stuffed fact when needed.
        </p>

        <h2 id="failure-modes">Failure modes to watch for</h2>
        <ul>
          <li>
            <strong>Citation hallucination.</strong> The model invents
            citation ids that don&apos;t exist. Mitigation: validate every
            cited id against the actual catalog before display.
          </li>
          <li>
            <strong>Confidence inflation.</strong> The model wraps an
            unverified claim in a fake citation to look grounded.
            Mitigation: post-process verification of cited facts.
          </li>
          <li>
            <strong>Out-of-scope drift.</strong> The model answers a
            question the catalog doesn&apos;t cover by pretending it
            does. Mitigation: explicit &quot;say so when uncovered&quot;
            instruction + UI fallback for unverified responses.
          </li>
          <li>
            <strong>Catalog staleness.</strong> The grounding source
            ages out. Mitigation: each claim ships with a{" "}
            <code>lastVerified</code> date; surface this in the citation
            UI so users can judge.
          </li>
        </ul>

        <h2 id="how-to-implement">How to implement grounding today</h2>
        <p>If you&apos;re building an LLM application right now:</p>
        <ol>
          <li>
            Start with <strong>prompt-stuffing</strong> — paste 20-50
            key facts into the system message. Ship Day 1.
          </li>
          <li>
            Add <strong>RAG</strong> when your fact corpus outgrows the
            context window. Days to weeks.
          </li>
          <li>
            Layer <strong>signed claims</strong> on top for the high-
            precision sub-domain. Free tier available via{" "}
            <a href="/quickstart/">VERITAS quickstart</a>; 5-minute
            integration.
          </li>
        </ol>
        <p>
          Most production LLM applications eventually do all three.
          Start simple, layer up as you learn where hallucination is
          actually costing you.
        </p>

        <h2 id="references">Further reading</h2>
        <ul>
          <li>
            <a href="/blog/verify-ai-facts-five-lines-python/">
              Verifying AI-generated facts in 5 lines of Python
            </a>{" "}
            — hands-on tutorial for the signed-claim pattern
          </li>
          <li>
            <a href="/blog/why-no-performance-claims/">
              Why VERITAS doesn&apos;t ship performance-comparison claims
            </a>{" "}
            — methodology rigor for signed catalogs
          </li>
          <li>
            <a href="/docs/integrations/langchain/">
              LangChain + VERITAS integration guide
            </a>
          </li>
          <li>
            <a href="/methodology/">SourceScore methodology</a> — the rules
            for what makes it into the verified-claim catalog
          </li>
          <li>
            <a href="/claims/">Browse the catalog</a> — 296 verified AI/ML
            claims, each with primary sources and signatures
          </li>
        </ul>
      </section>
    </article>
  );
}
