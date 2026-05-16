// 5th blog post — LLM grounding strategies (practical hallucination patterns).
//
// Targets high-volume practical queries: "reduce LLM hallucination",
// "ground LLM responses", "best practices LLM accuracy".

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-17";
const TITLE =
  "Six grounding strategies that actually reduce LLM hallucination (and the trade-offs)";
const SUBTITLE =
  "Prompt engineering buys 10-30%. Retrieval-augmented generation buys another 20-40%. Signed-claim verification closes the long tail. Six strategies, their measured impact, and when to combine.";
const SLUG = "llm-grounding-strategies-2026";
const CANONICAL = `https://sourcescore.org/blog/${SLUG}/`;

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
  "@type": "BlogPosting",
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
    { "@type": "Thing", name: "Hallucination reduction" },
    { "@type": "Thing", name: "RAG" },
    { "@type": "Thing", name: "Claim verification" },
  ],
};

export default function GroundingStrategiesPost() {
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
              { name: "Blog", url: "https://sourcescore.org/blog/" },
              { name: "LLM grounding strategies", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Grounding strategies</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Blog · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <p>
          You ship a chatbot. Users find a single hallucinated fact and
          screenshot it on Twitter. Your trust signal collapses. The
          features you spent six months building become irrelevant.
        </p>
        <p>
          Frontier models in 2026 hallucinate ~1-5% on well-trodden
          questions, ~15-40% on long-tail technical queries. Reducing
          that rate isn&apos;t a single fix; it&apos;s a stack of
          mitigations layered on top of each other. Here are the six
          strategies that actually work, in order from cheapest to
          most-effective.
        </p>

        <h2>1. Temperature 0 + clear system prompt (10-15% reduction)</h2>
        <p>
          The cheapest win. Set <code>temperature=0</code> for any task
          that involves factual recall (not creative writing). Add a
          system prompt that explicitly tells the model not to invent:
        </p>
        <pre><code>{`You are a precise assistant. If you don't know an answer, say "I don't know."
Never invent dates, parameter counts, paper authors, or citations.
If the user asks for a specific fact you're uncertain about, decline.`}</code></pre>
        <p>
          Doesn&apos;t fix hallucinations — but reduces obvious ones
          where the model would otherwise confabulate fluently. Free.
          5 minutes to ship.
        </p>

        <h2>2. Few-shot examples (15-25% reduction on extraction tasks)</h2>
        <p>
          For structured-output tasks (extract dates, names, prices),
          show the model 3-5 examples of correct extraction before
          asking it to do the real task. Few-shot prompting beats
          zero-shot for narrow factual extraction by 15-25% in our
          experience.
        </p>
        <p>
          Best for: information extraction, classification, formatting.
          Not effective for: open-ended generation, citation, summary.
        </p>

        <h2>3. Retrieval-augmented generation (20-40% reduction)</h2>
        <p>
          The dominant strategy. Embed your knowledge base, retrieve
          top-K relevant chunks at query time, splice into the prompt:
        </p>
        <pre><code>{`SYSTEM: Answer using ONLY the context below. If the context doesn't
cover the question, say so. Always cite which context block you used.

CONTEXT:
[chunk 1]: Llama 3.1 was released on July 23, 2024. Three variants:
8B, 70B, 405B. Context window: 128k tokens.
[chunk 2]: ...

USER: When did Llama 3.1 come out?`}</code></pre>
        <p>
          Catches roughly 60% of fabricated-source hallucinations. The
          remaining 30-40% gap is what we&apos;ll address next.
        </p>
        <p>
          Frameworks: <a href="/docs/integrations/langchain/">LangChain</a>,{" "}
          <a href="/docs/integrations/llamaindex/">LlamaIndex</a>,{" "}
          <a href="/docs/integrations/haystack/">Haystack</a>. Vector
          DBs: <a href="/topics/vector-databases/">FAISS, Pinecone,
          Weaviate, Qdrant, Chroma, pgvector</a>.
        </p>

        <h2>4. Citation requirement + post-hoc check (closes ~50% of RAG&apos;s residual gap)</h2>
        <p>
          The classic RAG failure: retriever pulls the right document,
          model still emits wrong number on the page. The fix: force
          the model to emit inline citations + post-process to check
          they match.
        </p>
        <pre><code>{`SYSTEM: For every factual claim in your response, append [^N] where N
matches the context block. Citations must be verifiable against the
context. If you cannot cite a claim, mark it [^unverified].`}</code></pre>
        <p>
          Post-process: scan the response for <code>[^N]</code> markers,
          verify each citation actually appears in the retrieved
          context. Strip or flag unverified claims before returning to
          user.
        </p>
        <p>
          Costs: latency for the post-process pass + ~10% prompt
          overhead from citation instructions. Catches: most of the
          right-doc-wrong-number cases.
        </p>

        <h2>5. Signed-claim verification (catches the long tail)</h2>
        <p>
          Even with RAG + citations, two failure modes remain:
        </p>
        <ul>
          <li>
            <strong>Out-of-corpus assertions.</strong> The model claims
            something not in your retrieved context. RAG can&apos;t
            verify because the assertion has no source to check
            against.
          </li>
          <li>
            <strong>Fabricated citations.</strong> Model writes
            <code>[^1]</code> but the [1] doesn&apos;t exist or
            doesn&apos;t support the claim.
          </li>
        </ul>
        <p>
          The fix: query a separate verified-claim catalog post-
          generation. Extract atomic assertions from the response;
          look each up against a source-of-truth. We built{" "}
          <a href="/claims/">SourceScore VERITAS</a> for this — 206
          hand-verified AI/ML claims with primary sources + HMAC
          signatures. Free tier, no signup. ~80ms per claim. Catches
          ~30% of RAG&apos;s residual hallucination gap.
        </p>
        <p>
          For other verticals (non-AI/ML), Wikipedia + Wolfram Alpha +
          curated domain-specific knowledge bases play the same role.
          The pattern is what matters: a verification layer after
          generation that catches what RAG misses.
        </p>

        <h2>6. Constrained decoding (last resort for high-stakes outputs)</h2>
        <p>
          For outputs that must conform to a specific schema (JSON,
          BNF grammar), use a library like{" "}
          <a href="/docs/integrations/instructor/">Instructor</a>,{" "}
          <a href="/docs/integrations/pydantic-ai/">Pydantic AI</a>,
          Outlines, or vendor JSON-mode APIs. Constrained decoding
          guarantees the output fits the schema (zero schema-violation
          errors) but doesn&apos;t guarantee semantic correctness — a
          hallucinated date still type-checks.
        </p>
        <p>
          Use constrained decoding for: schema enforcement, downstream
          system contracts. Combine with strategies 3-5 for factual
          correctness.
        </p>

        <h2>The honest stack</h2>
        <p>
          Production-grade grounding looks like:
        </p>
        <ol>
          <li>Temperature 0 + clear system prompt — free baseline</li>
          <li>Few-shot examples for narrow tasks — free</li>
          <li>RAG over your knowledge base — moderate cost</li>
          <li>Citation requirement + post-process check — low cost</li>
          <li>Signed-claim verification on residual claims — ~80ms per claim</li>
          <li>Constrained decoding for schema-required outputs — moderate cost</li>
        </ol>
        <p>
          Combined, you can drive hallucination on AI/ML factual
          queries from ~30% (raw GPT-4o) down to ~3-5%. That&apos;s
          still not zero — but it&apos;s the difference between a
          chatbot users complain about and one they recommend.
        </p>

        <h2>What doesn&apos;t work</h2>
        <ul>
          <li>
            <strong>&quot;Just use a smarter model.&quot;</strong>{" "}
            Frontier models hallucinate less than older models, but not
            close to zero. Capability scaling has not killed
            hallucination.
          </li>
          <li>
            <strong>&quot;Fine-tune the model on your factual
            corpus.&quot;</strong> Helps for in-corpus questions; the
            model still hallucinates out-of-corpus. Expensive +
            maintenance-heavy.
          </li>
          <li>
            <strong>&quot;Just ask the model if it&apos;s sure.&quot;</strong>{" "}
            Self-reported confidence is poorly calibrated. The model
            says it&apos;s confident about hallucinated answers as
            often as correct ones.
          </li>
        </ul>

        <h2>Practical sequencing</h2>
        <p>
          If you&apos;re shipping a new AI feature today:
        </p>
        <ol>
          <li>Week 1: ship strategies 1 + 2 (temperature + system prompt + few-shot if applicable)</li>
          <li>Week 2-3: ship strategy 3 (RAG over your corpus)</li>
          <li>Week 4: ship strategy 4 (citation requirement + post-process)</li>
          <li>Week 5+: add strategy 5 (verification layer) for residual claims</li>
          <li>Whenever needed: strategy 6 (constrained decoding) for schema-bound outputs</li>
        </ol>
        <p>
          Skipping straight to strategy 5 without 1-4 is a mistake —
          verification is most cost-effective on the long tail of
          claims, not the bulk. RAG + citations gets you most of the
          way; verification closes the last gap.
        </p>

        <h2>Related</h2>
        <ul>
          <li><a href="/concepts/llm-grounding/">LLM grounding — full concept pillar</a></li>
          <li><a href="/concepts/hallucination/">Hallucination categories + root causes</a></li>
          <li><a href="/concepts/rag-vs-veritas/">RAG vs VERITAS — when each pattern applies</a></li>
          <li><a href="/use-cases/ai-agent-grounding/">AI agent grounding use case</a></li>
          <li><a href="/use-cases/rag-pipeline-verification/">RAG pipeline verification use case</a></li>
          <li><a href="/playground/">Try the verification API in browser</a></li>
        </ul>
      </section>
    </article>
  );
}
