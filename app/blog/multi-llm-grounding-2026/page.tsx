// 6th blog post — Multi-LLM grounding patterns.
//
// Targets buyer-intent queries: "multi-LLM grounding", "switch LLMs
// production", "OpenAI Anthropic Gemini deployment", "LLM provider
// portability". Aleyda Solis 10-char #2 Useful + #8 Differentiated.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-17";
const MODIFIED = "2026-09-13";
const TITLE =
  "Multi-LLM grounding in 2026 — build once, deploy across OpenAI, Anthropic, Google, and open-weight";
const SUBTITLE =
  "Single-provider lock-in is fragile in 2026. Pricing shifts, capability changes, and outages all argue for portability. Here's an architecture pattern that keeps evidence retrieval and citation review LLM-agnostic across providers.";
const SLUG = "multi-llm-grounding-2026";
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
  dateModified: MODIFIED,
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
    { "@type": "Thing", name: "Multi-LLM architecture" },
    { "@type": "Thing", name: "LLM grounding" },
    { "@type": "Thing", name: "Provider portability" },
    { "@type": "Thing", name: "LLM router" },
  ],
};

export default function MultiLlmGroundingPost() {
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
              { name: "Multi-LLM grounding 2026", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Multi-LLM grounding 2026</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Blog · Architecture · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>The single-provider problem</h2>
        <p>
          A provider that fits one workload today may not fit its next
          workload, geography, budget, or reliability target. Without an
          adapter boundary, changing providers also means rewriting routing,
          evidence, and citation behavior.
        </p>
        <p>
          Model deprecations, pricing changes, outages, and capability gaps
          can all make a single-provider design expensive to change. A
          <strong>portable evidence layer</strong> reduces that coupling. This
          post shows the architecture; measure the switching value in your own stack.
        </p>

        <h2>Why portability matters</h2>
        <ul>
          <li>
            <strong>Pricing changes.</strong> Token prices and billing units
            differ by provider and model. Use current provider price sheets and
            your own token mix before making a routing decision.
          </li>
          <li>
            <strong>Capability depends on the workload.</strong> Evaluate
            coding, extraction, long-context, reasoning, and structured-output
            tasks separately on your own examples.
          </li>
          <li>
            <strong>Availability differs.</strong> A second tested provider can
            offer a fallback, but failover only helps when prompts, tools,
            safety rules, and output validation work on both paths.
          </li>
          <li>
            <strong>Regulatory and data-residency needs vary.</strong>
            {" "}Check each provider&apos;s current contract, processing
            region, retention controls, and certifications against your own
            obligations; a model name alone does not establish compliance.
          </li>
          <li>
            <strong>Hosted and self-managed options have different trade-offs.</strong>
            {" "}Compare measured quality, operations work, privacy controls,
            throughput, and total cost rather than assuming either route wins.
          </li>
        </ul>

        <h2>The architecture pattern</h2>
        <p>
          Three layers, each provider-agnostic:
        </p>
        <ol>
          <li>
            <strong>Router</strong> — selects which LLM provider to
            call per request based on rules (task type, cost budget,
            latency SLA, user tier).
          </li>
          <li>
            <strong>Adapter</strong> — normalizes input + output across
            provider APIs. OpenAI tools, Anthropic tool-use, Google
            function-calling, Llama function-calling all have different
            request shapes; the adapter hides this.
          </li>
          <li>
            <strong>Evidence layer</strong> — candidate-record retrieval
            and citation review applied to LLM output regardless of which
            provider produced it. The same catalog and canonical URLs are
            available after a provider switch.
          </li>
        </ol>

        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`# Python — multi-LLM grounding skeleton
from openai import OpenAI
from anthropic import Anthropic
import google.generativeai as genai
import os, requests

# Pin models in deployment configuration and retest before changing them.
OPENAI_MODEL = os.environ["OPENAI_MODEL"]
ANTHROPIC_MODEL = os.environ["ANTHROPIC_MODEL"]
GEMINI_MODEL = os.environ["GEMINI_MODEL"]
GEMINI_API_KEY = os.environ["GEMINI_API_KEY"]

class LlmRouter:
    def __init__(self):
        self.openai = OpenAI()
        self.anthropic = Anthropic()
        genai.configure(api_key=GEMINI_API_KEY)
        self.gemini = genai.GenerativeModel(GEMINI_MODEL)

    def call(self, task: str, provider: str = None) -> str:
        # Router: pick provider based on task + budget + SLA
        provider = provider or self._pick_provider(task)
        if provider == "openai":
            r = self.openai.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[{"role": "user", "content": task}],
                temperature=0,
            )
            return r.choices[0].message.content
        elif provider == "anthropic":
            r = self.anthropic.messages.create(
                model=ANTHROPIC_MODEL,
                max_tokens=1024,
                messages=[{"role": "user", "content": task}],
            )
            return r.content[0].text
        elif provider == "gemini":
            r = self.gemini.generate_content(task)
            return r.text
        raise ValueError(f"unknown provider: {provider}")

    def _pick_provider(self, task: str) -> str:
        # Toy heuristic — real router uses cost + quality data
        if "code" in task.lower(): return "anthropic"
        if "long" in task.lower(): return "gemini"
        return "openai"

def find_evidence_candidates(response: str) -> dict:
    """Retrieve SourceScore catalog candidates for human or programmatic
    comparison with each assertion. A match is not a truth verdict."""
    assertions = extract_assertions(response)  # split into atomic claims
    candidates = []
    for a in assertions:
        r = requests.post(
            "https://sourcescore.org/api/v1/verify",
            json={"claim": a, "minConfidence": 0.85},
            timeout=8,
        )
        match = r.json().get("bestMatch")
        if match:
            candidates.append({"assertion": a, "candidate": match})
    return {"response": response, "candidates_for_review": candidates}

# Usage
router = LlmRouter()
raw = router.call("When was Llama 3.1 released?", provider="anthropic")
review_packet = find_evidence_candidates(raw)`}</code></pre>

        <p>
          The grounding layer is provider-agnostic — it sees only the
          response text. Switch the router&apos;s provider per request
          (cost, capability, latency, failover) without changing the
          candidate-retrieval logic. Compare each assertion with the
          returned record and its cited evidence before publishing it.
        </p>

        <h2>Adapter options to evaluate</h2>
        <ul>
          <li>
            <a href="/docs/integrations/vercel-ai-sdk/">Vercel AI SDK</a>
            {" "}— a TypeScript option for normalizing provider calls and
            streaming; verify current provider support in its documentation.
          </li>
          <li>
            <a href="/docs/integrations/dspy/">DSPy</a> — Python; signature
            programming + provider abstraction.
          </li>
          <li>
            <a href="/docs/integrations/langchain/">LangChain</a> — broad
            provider support; sometimes heavy abstraction.
          </li>
          <li>
            <a href="/docs/integrations/instructor/">Instructor</a> —
            structured output across providers via Pydantic models.
          </li>
          <li>
            <strong>Proxy-style adapters</strong> — centralize routing and
            credentials, at the cost of another operational dependency.
          </li>
          <li>
            <strong>Hosted model gateways</strong> — offer one integration
            surface across vendors; review data handling, routing transparency,
            pricing, and failure behavior before adopting one.
          </li>
        </ul>

        <h2>Routing rules to validate in production</h2>
        <ol>
          <li>
            <strong>Task type → evaluated model.</strong> Maintain a small,
            versioned test set for each task family and route only after a model
            clears your quality and safety threshold.
          </li>
          <li>
            <strong>User tier → cost budget.</strong> Set explicit per-request
            and monthly limits, then select the least expensive model that
            passes the relevant task evaluation.
          </li>
          <li>
            <strong>Latency target → measured route.</strong> Benchmark first
            token and completion time from your deployment regions. Streaming
            improves perceived responsiveness but does not guarantee a target.
          </li>
          <li>
            <strong>Provider error → tested fallback.</strong> Bound retries,
            preserve safety and evidence checks across routes, and tell users
            when the system returns a reduced-capability result.
          </li>
          <li>
            <strong>Regulatory zone → approved deployment.</strong>
            {" "}Route only to configurations your legal and security review
            has approved for the relevant data, region, and customer.
          </li>
        </ol>

        <h2>Why grounding-layer portability matters</h2>
        <p>
          The temptation is to use a provider&apos;s built-in
          grounding feature: Anthropic Citations API, OpenAI&apos;s
          search-grounded responses, or built-in retrieval. These can preserve
          useful provider-native context and citation metadata.
        </p>
        <p>
          But when you switch providers (cost, capability, outage),
          the grounding layer disappears with the provider. Your
          users see citations on Monday and none on Tuesday because
          you failed over to a different model. That&apos;s a trust
          collapse.
        </p>
        <p>
          A <em>provider-agnostic</em> grounding layer (like
          SourceScore VERITAS, or a self-built RAG pipeline against a
          shared knowledge store) survives provider switches. The
          review workflow can stay consistent — same catalog and same
          canonical URLs — regardless of which LLM produced the raw
          response. A returned candidate still needs an entailment or
          editorial check.
        </p>

        <h2>Provider-locked grounding still has its place</h2>
        <p>
          Anthropic Citations API and OpenAI&apos;s search-grounded
          responses excel at user-uploaded-doc citations within a
          single provider. The clean pattern: use both.
        </p>
        <ul>
          <li>
            User-supplied document RAG → use the provider&apos;s
            native citation API
          </li>
          <li>
            Shared knowledge base + cross-provider facts (model
            release dates, paper authorship, organizational facts) →
            use a portable grounding layer like VERITAS
          </li>
        </ul>
        <p>
          See <a href="/comparisons/veritas-vs-anthropic-citations/">VERITAS vs Anthropic Citations API</a>
          {" "}for the full head-to-head.
        </p>

        <h2>Getting started</h2>
        <ol>
          <li>
            Pick an adapter library that fits your stack (Vercel AI
            SDK for TS, DSPy or LiteLLM for Python).
          </li>
          <li>
            Wrap your LLM calls behind the adapter. No business
            logic should hit provider SDKs directly.
          </li>
          <li>
            Add a router with at minimum 2 providers + automatic
            failover.
          </li>
          <li>
            Add a grounding layer that doesn&apos;t care which
            provider produced the response. Run the same{" "}
            <a href="/quickstart/">5-min quickstart</a> regardless of
            backend.
          </li>
          <li>
            Test the failover by killing each provider in turn and
            confirming citations still render.
          </li>
        </ol>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/blog/llm-grounding-strategies-2026/">Six grounding strategies and their trade-offs</a>
          </li>
          <li>
            <a href="/blog/llm-framework-comparison-2026/">LLM framework comparison 2026</a>
          </li>
          <li>
            <a href="/comparisons/veritas-vs-anthropic-citations/">VERITAS vs Anthropic Citations API</a>
          </li>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding (concept reference)</a>
          </li>
          <li>
            <a href="/topics/llm-releases-2024-2025/">LLM releases 2024-2025</a>
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Build the grounding layer once, route across providers. Browse the{" "}
          <a href="/claims/" className="underline">384 reviewed claim records</a>
          {" "}or run the{" "}
          <a href="/quickstart/" className="underline">5-min quickstart</a>{" "}
          — works with any LLM provider.
        </p>
      </footer>
    </article>
  );
}
