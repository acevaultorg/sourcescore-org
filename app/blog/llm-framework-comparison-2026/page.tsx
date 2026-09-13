// 4th blog post — LLM framework comparison 2026.
//
// Strategic role: meta-post that drives readers to all 7 integration guides.
// Highest internal-link compound; targets high-volume "best LLM framework
// 2026" search queries.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE =
  "LLM framework comparison 2026 — LangChain vs LlamaIndex vs OpenAI tools vs DSPy vs Pydantic AI vs Vercel AI SDK vs Anthropic SDK";
const SUBTITLE =
  "Seven LLM frameworks own most of 2026 dev mindshare. They optimize for different things — orchestration, retrieval, type-safety, vendor-native, deployment ergonomics. Pick by archetype + audience + commitment.";
const SLUG = "llm-framework-comparison-2026";
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
  about: [
    { "@type": "Thing", name: "LangChain" },
    { "@type": "Thing", name: "LlamaIndex" },
    { "@type": "Thing", name: "OpenAI tool calling" },
    { "@type": "Thing", name: "DSPy" },
    { "@type": "Thing", name: "Pydantic AI" },
    { "@type": "Thing", name: "Vercel AI SDK" },
    { "@type": "Thing", name: "Anthropic SDK" },
  ],
};

export default function FrameworkComparisonPost() {
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
              { name: "LLM framework comparison 2026", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Framework comparison 2026</span>
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
          We ship integration guides for seven LLM frameworks at SourceScore VERITAS:{" "}
          <a href="/docs/integrations/langchain/">LangChain</a>,{" "}
          <a href="/docs/integrations/llamaindex/">LlamaIndex</a>,{" "}
          <a href="/docs/integrations/openai-tools/">OpenAI tools</a>,{" "}
          <a href="/docs/integrations/dspy/">DSPy</a>,{" "}
          <a href="/docs/integrations/pydantic-ai/">Pydantic AI</a>,{" "}
          <a href="/docs/integrations/vercel-ai-sdk/">Vercel AI SDK</a>, and{" "}
          <a href="/docs/integrations/anthropic-sdk/">Anthropic SDK</a>.
          Picking between them is the most-asked question we get from new
          users. This post is the honest answer.
        </p>

        <h2>The seven frameworks at a glance</h2>

        <table>
          <thead>
            <tr>
              <th>Framework</th>
              <th>First release</th>
              <th>Optimized for</th>
              <th>Language</th>
              <th>Commitment level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="/docs/integrations/langchain/">LangChain</a></td>
              <td>2022-10</td>
              <td>Orchestration breadth</td>
              <td>Python + JS/TS</td>
              <td>High (many concepts)</td>
            </tr>
            <tr>
              <td><a href="/docs/integrations/llamaindex/">LlamaIndex</a></td>
              <td>2022-11</td>
              <td>Retrieval-first RAG</td>
              <td>Python + JS/TS</td>
              <td>High</td>
            </tr>
            <tr>
              <td><a href="/docs/integrations/openai-tools/">OpenAI tools</a></td>
              <td>2023-06</td>
              <td>OpenAI-native function calling</td>
              <td>Any (SDK in many)</td>
              <td>Low (just JSON-schema)</td>
            </tr>
            <tr>
              <td><a href="/docs/integrations/dspy/">DSPy</a></td>
              <td>2023</td>
              <td>Programs not prompts</td>
              <td>Python</td>
              <td>High (paradigm shift)</td>
            </tr>
            <tr>
              <td><a href="/docs/integrations/pydantic-ai/">Pydantic AI</a></td>
              <td>2024</td>
              <td>Type-safe tool calls</td>
              <td>Python</td>
              <td>Medium</td>
            </tr>
            <tr>
              <td><a href="/docs/integrations/vercel-ai-sdk/">Vercel AI SDK</a></td>
              <td>2023</td>
              <td>Next.js + edge streaming</td>
              <td>JS/TS</td>
              <td>Medium</td>
            </tr>
            <tr>
              <td><a href="/docs/integrations/anthropic-sdk/">Anthropic SDK</a></td>
              <td>2023</td>
              <td>Claude-native tool use</td>
              <td>Python + JS/TS</td>
              <td>Low</td>
            </tr>
          </tbody>
        </table>

        <h2>Pick by archetype</h2>

        <h3>You&apos;re building a RAG pipeline over a custom corpus</h3>
        <p>
          <strong>Start with LlamaIndex.</strong> It was built for this
          shape — your corpus, your embeddings, your retrieval. The
          mental model is&apos;document → node → index → retriever →
          query engine&apos; and it stays consistent. Cost: you&apos;ll
          buy into LlamaIndex&apos;s opinions about chunking + retrieval +
          response synthesis.
        </p>
        <p>
          If LlamaIndex&apos;s abstractions feel heavy for your use case,
          drop down to <a href="/docs/integrations/openai-tools/">OpenAI
          tools</a> (or Anthropic SDK if you&apos;re on Claude) and roll
          your own retrieval. Often the right call for small corpora
          (&lt;10k documents) where you&apos;ve already invested in
          embeddings.
        </p>

        <h3>You&apos;re building a multi-step agent that calls tools</h3>
        <p>
          <strong>Start with the vendor SDK</strong> if you&apos;re
          committed to one model family —{" "}
          <a href="/docs/integrations/openai-tools/">OpenAI tools</a> if
          GPT, <a href="/docs/integrations/anthropic-sdk/">Anthropic
          SDK</a> if Claude. Native function-calling is the cleanest
          shape; you skip the orchestration overhead entirely.
        </p>
        <p>
          If you need vendor-portability or type-safety:{" "}
          <a href="/docs/integrations/pydantic-ai/">Pydantic AI</a> wraps
          tool calls in typed Pydantic models. Same agent code, swap the
          provider with a single import line. The type-safety is real
          (validators catch the model&apos;s hallucinated arguments before
          they hit your function).
        </p>

        <h3>You&apos;re building a Next.js app with streaming UI</h3>
        <p>
          <strong>
            <a href="/docs/integrations/vercel-ai-sdk/">Vercel AI SDK</a>
          </strong>{" "}
          — full stop. It&apos;s designed for the edge-streaming UI
          pattern (chat interfaces, streaming responses) on Next.js, and
          it includes React hooks that make streaming UI a one-liner.
          Going outside it costs you the streaming ergonomics.
        </p>

        <h3>You&apos;re doing research / want optimizers / care about evals</h3>
        <p>
          <strong><a href="/docs/integrations/dspy/">DSPy</a></strong>{" "}
          (Stanford). The paradigm is different — you write programs
          composed of modules + signatures, and a separate compile step
          optimizes the prompts + few-shot examples for you against your
          eval set. The learning curve is steep (you&apos;re writing
          programs, not prompts), but for research + evaluation-driven
          development it&apos;s the only framework that takes evals
          seriously as a first-class concept.
        </p>

        <h3>You&apos;re building a complex pipeline with many components</h3>
        <p>
          <strong><a href="/docs/integrations/langchain/">LangChain</a></strong>{" "}
          remains the breadth winner. Hundreds of integrations, every
          conceivable retrieval + generation + tool primitive, plus
          LangSmith for observability. The trade-off: you buy into a lot
          of abstractions, and breaking changes have been common
          historically.
        </p>

        <h2>The honest gotchas</h2>

        <h3>LangChain</h3>
        <ul>
          <li>Breadth comes at the cost of stability. APIs have changed multiple times.</li>
          <li>Documentation is mixed — some excellent, some out-of-date.</li>
          <li>Strong if you treat it as a toolkit (pick the pieces you need); weak if you adopt the full stack uncritically.</li>
        </ul>

        <h3>LlamaIndex</h3>
        <ul>
          <li>If your problem isn&apos;t RAG-shaped, you&apos;re fighting the framework.</li>
          <li>The "ServiceContext" pattern was rewritten in 2024; many tutorials online are stale.</li>
        </ul>

        <h3>OpenAI tools</h3>
        <ul>
          <li>Locks you into OpenAI. Switching vendors means rewriting the tool layer.</li>
          <li>No built-in orchestration — you write the agent loop yourself (which is often what you want).</li>
        </ul>

        <h3>DSPy</h3>
        <ul>
          <li>Steep learning curve. Treat as a different language, not a library.</li>
          <li>Compile times can be long (optimization is real work).</li>
          <li>Strongest fit for research + evaluation-driven projects, not quick prototypes.</li>
        </ul>

        <h3>Pydantic AI</h3>
        <ul>
          <li>Python-only as of 2026.</li>
          <li>Newer (less battle-tested than alternatives).</li>
          <li>Strongest if you already use Pydantic elsewhere in your codebase.</li>
        </ul>

        <h3>Vercel AI SDK</h3>
        <ul>
          <li>Optimized for Next.js + edge — outside that, you&apos;re paying for unused ceremony.</li>
          <li>Heavy reliance on Vercel ecosystem (fine if you&apos;re already there).</li>
        </ul>

        <h3>Anthropic SDK</h3>
        <ul>
          <li>Locks you into Claude.</li>
          <li>Minimalist by design — no orchestration, no built-in observability. You build that yourself.</li>
        </ul>

        <h2>Our recommendation by archetype</h2>
        <p>
          If you&apos;re starting from scratch and just want the path of
          least resistance:
        </p>
        <ul>
          <li>RAG over your docs → <a href="/docs/integrations/llamaindex/">LlamaIndex</a></li>
          <li>Single-vendor agent (GPT) → <a href="/docs/integrations/openai-tools/">OpenAI tools</a> directly</li>
          <li>Single-vendor agent (Claude) → <a href="/docs/integrations/anthropic-sdk/">Anthropic SDK</a> directly</li>
          <li>Multi-vendor typed agent → <a href="/docs/integrations/pydantic-ai/">Pydantic AI</a></li>
          <li>Next.js chat app → <a href="/docs/integrations/vercel-ai-sdk/">Vercel AI SDK</a></li>
          <li>Research + evals → <a href="/docs/integrations/dspy/">DSPy</a></li>
          <li>Complex multi-step pipeline → <a href="/docs/integrations/langchain/">LangChain</a></li>
        </ul>

        <h2>How VERITAS fits in any of these</h2>
        <p>
          SourceScore VERITAS is the verification layer. Any of these
          frameworks can call our <code>/api/v1/verify</code> endpoint to
          check whether the LLM&apos;s output asserts a fact we&apos;ve
          hand-verified. The public API is free with no account, key, or signup.
        </p>
        <p>
          Each of the seven integration guides above shows the canonical
          pattern in that framework — typed tool, retrieval-then-cite,
          generate-then-verify, etc. Pick the framework that fits your
          archetype; we work with all of them.
        </p>

        <h2>Two predictions for late 2026 / 2027</h2>
        <ol>
          <li>
            The framework count will drop. Anthropic&apos;s Model Context
            Protocol (released 2024-11) is the cross-vendor standard
            that could absorb a lot of the per-vendor SDKs. Watch which
            frameworks adopt MCP as a first-class concept.
          </li>
          <li>
            Type-safety wins. Pydantic AI&apos;s premise — typed inputs
            and outputs catch errors statically — is reasonable. The
            untyped variants will either add types (LangChain has been
            trying) or get eaten by Pydantic AI + similar.
          </li>
        </ol>

        <h2>Resources</h2>
        <ul>
          <li><a href="/docs/integrations/">All 7 integration guides</a> — drop-in patterns for each framework</li>
          <li><a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a> — when each pattern applies</li>
          <li><a href="/playground/">Playground</a> — try /verify before wiring it in</li>
          <li><a href="/quickstart/">Quickstart</a> — first call in 5 minutes</li>
        </ul>
      </section>
    </article>
  );
}
