// /concepts/rag-vs-veritas/ — comparison pillar. Highest-intent
// query class: "rag vs X" / "is rag dead" / "alternative to rag".
// Aleyda 10-char #8 Differentiated — we explain when we're not the right
// tool, honestly. Trust signal.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE =
  "RAG vs curated claim retrieval (VERITAS) — when to use each";
const SUBTITLE =
  "RAG retrieves prose chunks. VERITAS retrieves typed records from a bounded curated catalog. They are different shapes with complementary uses; neither retrieval method proves an answer true.";
const SLUG = "rag-vs-veritas";
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
    { "@type": "Thing", name: "Retrieval-Augmented Generation" },
    { "@type": "Thing", name: "Signed-claim verification" },
    { "@type": "Thing", name: "LLM grounding patterns" },
  ],
};

export default function RagVsVeritas() {
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
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
              { name: "RAG vs VERITAS", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">RAG vs VERITAS</span>
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
        <h2 id="tldr">TL;DR</h2>
        <p>
          <strong>RAG</strong> is the right tool when your knowledge lives
          in <em>prose</em> — documentation, articles, customer-support
          tickets, internal wikis. You vector-index it, retrieve
          semantically similar chunks at query time, paste them into the
          prompt as context. Works at any scale; tolerates messy
          unstructured input.
        </p>
        <p>
          <strong>VERITAS</strong> is useful when you need <em>atomic claim records</em>{" "}
          — specific assertions like &quot;GPT-4 was released on
          2023-03-14&quot; with sources you can inspect. Coverage is bounded,
          and candidate retrieval still needs statement/evidence comparison.
        </p>
        <p>
          They&apos;re complementary. RAG covers breadth; VERITAS covers
          atoms. Most production LLM applications eventually run both.
        </p>

        <h2 id="shape-difference">The shape difference</h2>
        <p>The two systems retrieve different things:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">Aspect</th>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">RAG</th>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">VERITAS</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Retrieves</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Prose chunks (200-2000 tokens)</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Atomic claims (subject + predicate + object)</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Returns</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Retrieved prose chunks</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Candidate claim records with cited evidence</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Trust model</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Inspect the indexed corpus and answer support</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Inspect the curation method, record, and cited evidence</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Scale</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Depends on corpus and infrastructure</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Limited by curation effort (384 records today)</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Accuracy</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Measure on your task and corpus</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Measure candidate entailment on your assertions</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Coverage</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Whatever you index</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">AI/ML catalog only today</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Citation precision</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Chunk-level (paragraph at best)</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Fact-level (single assertion)</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Auditability</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Depends on stored chunks and citations</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Stable record URLs + cited evidence; HMAC is source-issued only</td></tr>
              <tr><td className="p-3 font-medium">Infra requirement</td><td className="p-3">Vector DB + embedding model</td><td className="p-3">HTTP fetch (zero infra)</td></tr>
            </tbody>
          </table>
        </div>

        <h2 id="why-rag-leaks">Why RAG alone leaks</h2>
        <p>
          RAG works well most of the time and fails in a specific class
          of cases:
        </p>
        <ol>
          <li>
            <strong>Semantic-similar but factually-wrong chunks.</strong>{" "}
            A chunk about &quot;OpenAI launched ChatGPT in 2022&quot;
            retrieves on a query about GPT-4. Embeddings see the same
            topic; the dates are different. The model stitches the
            retrieved date into the wrong context.
          </li>
          <li>
            <strong>Multiple chunks contradict.</strong> Two retrieved
            chunks disagree on a fact. The model picks one — sometimes
            the wrong one — without surfacing the contradiction.
          </li>
          <li>
            <strong>Chunk boundaries split facts.</strong> The relevant
            fact is at the boundary between two retrieved chunks. The
            model gets half of it; fabricates the other half.
          </li>
          <li>
            <strong>Indexed corpus is wrong.</strong> RAG retrieves
            faithfully from a corpus. If the corpus has wrong facts, RAG
            confidently surfaces them as authoritative.
          </li>
          <li>
            <strong>Citation drift.</strong> The model cites &quot;chunk
            #4 says X&quot; but actually emitted X from its parametric
            memory and pasted the chunk citation as plausible cover.
          </li>
        </ol>
        <p>
          Signed-claim verification doesn&apos;t have these failure modes
          because the unit is the typed fact, not a prose chunk. Either
          the catalog has the claim (return it, confidence-stamped) or
          it doesn&apos;t (return null, force fallback path).
        </p>

        <h2 id="why-veritas-alone-leaks">Why VERITAS alone is insufficient</h2>
        <p>The signed-claim approach has its own limits:</p>
        <ol>
          <li>
            <strong>Coverage gaps.</strong> If the user asks about
            something the catalog doesn&apos;t cover — say, a specific
            product feature or a niche academic result — VERITAS returns
            null and your code falls through to whatever else you have.
            Without RAG as the fallback, your application is silent.
          </li>
          <li>
            <strong>Curation latency.</strong> New facts (a model
            released yesterday) take time to verify and enter the
            catalog. RAG over a freshly-indexed news corpus is faster.
          </li>
          <li>
            <strong>Prose vs claim shape.</strong> Some queries
            genuinely want explanatory prose, not a typed fact.
            &quot;How does attention work?&quot; isn&apos;t an atomic
            claim — it&apos;s a paragraph. RAG over the right corpus
            answers; VERITAS doesn&apos;t.
          </li>
          <li>
            <strong>Subjective questions.</strong> &quot;Is GPT-4 better
            than Claude 3 for code generation?&quot; isn&apos;t a fact —
            it&apos;s an evaluation. VERITAS explicitly doesn&apos;t ship
            performance-comparison claims (see{" "}
            <a href="/blog/why-no-performance-claims/">the methodology
            post</a>
            ). RAG over benchmark reports + community discussion fills
            this gap.
          </li>
        </ol>

        <h2 id="hybrid">The hybrid pattern</h2>
        <p>Three layers, ordered by precision:</p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`# Pseudocode
async def answer(question):
    # Layer 1 — VERITAS for atomic facts (high precision)
    veritas_claims = await veritas_search(question, limit=3)

    # Layer 2 — RAG for explanatory context
    rag_chunks = await vector_search(question, limit=5)

    # Layer 3 — model prompt with both, ordered by trust
    context = ""
    if veritas_claims:
        context += "Candidate atomic records (cite only after evidence review):\\n"
        context += "\\n".join(f"- {c.statement} [{c.id}]" for c in veritas_claims)

    if rag_chunks:
        context += "\\n\\nDocumentation context (cite [chunk_id]):\\n"
        context += "\\n".join(f"- {c.text} [{c.id}]" for c in rag_chunks)

    return await llm.generate(
        f"Use a record only when its exact statement and evidence support the answer. "
        f"Cite every supported assertion.\\n\\n{context}\\n\\nQ: {question}"
    )`}</code></pre>
        <p>
          The model is instructed to use a candidate only when its exact
          statement supports the answer. Candidate-record links in the UI
          distinguish the two evidence paths — clicking [claim_id] opens
          the canonical SourceScore page; clicking [chunk_id] opens
          your indexed source.
        </p>

        <h2 id="cost-comparison">Cost comparison</h2>
        <p>
          The public VERITAS API is currently free with no account-level meter.
          RAG cost depends on your embedding model, vector store, retrieval
          pattern, cache hit rate, and hosting. Measure both paths in your own
          stack instead of relying on a universal per-query estimate. Proposed
          higher-volume VERITAS prices are a demand test, not purchasable plans.
        </p>

        <h2 id="when-rag-only">When to use RAG only (skip VERITAS)</h2>
        <ul>
          <li>Your domain isn&apos;t AI/ML and isn&apos;t covered by any other signed-claim catalog.</li>
          <li>Your queries are explanatory, not factual (how does X work, why is Y, summarize Z).</li>
          <li>You have a high-quality indexed corpus you trust completely.</li>
          <li>Latency is dominant; you can&apos;t afford the verification step.</li>
        </ul>

        <h2 id="when-veritas-only">When to use VERITAS only (skip RAG)</h2>
        <ul>
          <li>Your application is bounded to AI/ML facts.</li>
          <li>You don&apos;t have time to build a RAG pipeline.</li>
          <li>You need zero-infra grounding — VERITAS is one HTTP call, no vector DB.</li>
          <li>You need programmatic auditability of cited facts (signatures).</li>
        </ul>

        <h2 id="is-rag-dead">Is RAG dead?</h2>
        <p>
          No. The &quot;RAG is dead&quot; takes you see on Twitter are
          marketing for the framing-of-the-month, not a methodological
          shift. RAG remains the default pattern for indexing your own
          corpus of prose, and that need isn&apos;t going away.
        </p>
        <p>
          What&apos;s changed is the recognition that RAG isn&apos;t a
          complete grounding solution — it&apos;s one layer in a stack.
          Signed-claim verification, tool-use grounding, prompt-stuffed
          invariants, and structured-output schemas all sit alongside
          RAG in a production-grade pipeline.
        </p>

        <h2 id="getting-started">Getting started</h2>
        <p>
          If you have RAG today: add VERITAS as a parallel retrieval
          step. Five lines of code change, no infrastructure change. See
          the{" "}
          <a href="/blog/verify-ai-facts-five-lines-python/">5-line
          Python tutorial</a>
          .
        </p>
        <p>
          If you don&apos;t have RAG yet, test the VERITAS catalog against a
          representative query set before designing around it. Add broader
          retrieval when your observed questions fall outside the catalog;
          do not assume a universal coverage percentage.
        </p>

        <h2 id="references">Further reading</h2>
        <ul>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a> — the broader concept
          </li>
          <li>
            <a href="/concepts/hallucination/">LLM hallucination</a> — what grounding fixes
          </li>
          <li>
            <a href="/blog/verify-ai-facts-five-lines-python/">5-line Python verification tutorial</a>
          </li>
          <li>
            <a href="/docs/integrations/langchain/">LangChain integration</a> — including a retrieve-then-cite pattern that mirrors classic RAG flow
          </li>
          <li>
            <a href="/quickstart/">Quickstart</a>
          </li>
        </ul>
      </section>
    </article>
  );
}
