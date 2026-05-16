// /concepts/rag-vs-veritas/ — comparison pillar. Highest-intent
// query class: "rag vs X" / "is rag dead" / "alternative to rag".
// Aleyda 10-char #8 Differentiated — we explain when we're not the right
// tool, honestly. Trust signal.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE =
  "RAG vs signed-claim verification (VERITAS) — when to use each";
const SUBTITLE =
  "RAG retrieves prose chunks. VERITAS retrieves typed atomic claims with signatures. They're different shapes, different use cases, different cost models. Most production systems use both.";
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
          <strong>VERITAS</strong> (or any signed-claim system) is the
          right tool when you need <em>atomic facts with verification</em>{" "}
          — specific assertions like &quot;GPT-4 was released on
          2023-03-14&quot; with sources you can cite and signatures you
          can re-verify. Bounded coverage; high precision on what it
          covers.
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
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Returns</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Semantically similar text</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Verified facts with confidence + signature</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Trust model</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Trust the corpus you indexed</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Trust the curation methodology + HMAC signature</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Scale</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Millions of chunks easy</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Limited by curation effort (today: 91, target Q3: ~150)</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Hallucination on covered domain</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">~10-15%</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">&lt;1%</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Coverage</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Whatever you index</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Whatever the catalog covers (AI/ML today; new verticals Y2)</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Citation precision</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Chunk-level (paragraph at best)</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Fact-level (single assertion)</td></tr>
              <tr><td className="p-3 border-b border-zinc-100 dark:border-zinc-900 font-medium">Auditability</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Manual</td><td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Programmatic (signature)</td></tr>
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
        context += "Verified atomic facts (cite [claim_id]):\\n"
        context += "\\n".join(f"- {c.statement} [{c.id}]" for c in veritas_claims)

    if rag_chunks:
        context += "\\n\\nDocumentation context (cite [chunk_id]):\\n"
        context += "\\n".join(f"- {c.text} [{c.id}]" for c in rag_chunks)

    return await llm.generate(
        f"Use the verified facts first. Cite every assertion.\\n\\n{context}\\n\\nQ: {question}"
    )`}</code></pre>
        <p>
          The model is instructed to prefer verified facts over RAG
          chunks when both cover the same assertion. Verification badges
          in the UI distinguish the two — clicking [claim_id] opens
          the canonical SourceScore page; clicking [chunk_id] opens
          your indexed source.
        </p>

        <h2 id="cost-comparison">Cost comparison</h2>
        <p>For a typical production query (~1,000 queries/day):</p>
        <ul>
          <li>
            <strong>RAG:</strong> embedding model API ~$0.0001/query +
            vector DB hosted ~$30/mo + storage. ~$0.001/query total.
          </li>
          <li>
            <strong>VERITAS Free tier:</strong> 1,000 calls/mo free,
            then ~€0.0004/call on the next tier (Indie €19 for 50,000
            calls = ~€0.00038/call). Volume tiers (€99 / €499) drop
            per-call cost further.
          </li>
          <li>
            <strong>Hybrid:</strong> additive. ~$0.0018/query for both
            layers.
          </li>
        </ul>
        <p>
          The marginal cost of adding VERITAS to an existing RAG stack
          is small relative to the value of reducing hallucination on
          covered atoms. The ROI is dominated by your hallucination cost
          — if it&apos;s zero, neither matters; if it&apos;s high, both
          are cheap.
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
          If you don&apos;t have RAG yet: start with VERITAS for atomic
          facts (covers ~40-60% of typical AI/ML domain queries). Add
          RAG once your application has shipped and you&apos;ve seen
          which queries fall outside the VERITAS catalog. The data tells
          you which layer to invest in.
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
