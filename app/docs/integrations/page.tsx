// VERITAS-Reborn — integrations index.
//
// Hub-and-spoke parent page for per-framework integration guides. Aleyda
// Solis 10-char #4 Extractable + #10 Transactable — devs find the guide
// for their stack in one click.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Integrations — SourceScore VERITAS",
  description:
    "Drop-in guides for wiring SourceScore VERITAS claim verification into LangChain, LlamaIndex, OpenAI tool-calls, and other LLM frameworks. Python + JavaScript examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/" },
  openGraph: {
    title: "Integrations — SourceScore VERITAS",
    description: "LangChain · LlamaIndex · OpenAI tool-calls — drop-in claim verification.",
    url: "https://sourcescore.org/docs/integrations/",
    type: "website",
  },
};

const guides = [
  {
    slug: "langchain",
    name: "LangChain",
    status: "ready",
    summary:
      "Retrieve-then-cite + generate-then-verify patterns. Drop-in Python + JS examples for grounding LangChain chain responses in signed VERITAS claims.",
  },
  {
    slug: "llamaindex",
    name: "LlamaIndex",
    status: "ready",
    summary:
      "Custom retriever wrapping the VERITAS /search endpoint + post-process node verification. Compatible with QueryEngine + ChatEngine.",
  },
  {
    slug: "haystack",
    name: "Haystack",
    status: "ready",
    summary:
      "Two Haystack 2.x components: a retriever that pulls signed VERITAS claims, and a verifier that drops any document not backed by a high-confidence claim. Wire them into a normal Pipeline with PromptBuilder + OpenAIGenerator.",
  },
  {
    slug: "openai-tools",
    name: "OpenAI Tool Calls",
    status: "ready",
    summary:
      "Expose VERITAS as native function-calls in the OpenAI Chat Completions API. The model auto-invokes verify_claim() when uncertain.",
  },
  {
    slug: "vercel-ai-sdk",
    name: "Vercel AI SDK",
    status: "ready",
    summary:
      "Wire VERITAS into Next.js + AI SDK chains. Two patterns: tool() function-calling via streamText, and post-stream verification for free-form completions. TypeScript-first.",
  },
  {
    slug: "dspy",
    name: "DSPy",
    status: "ready",
    summary:
      "Stanford's compound-AI-system framework. Custom dspy.Retrieve backed by the VERITAS catalog + verify-and-flag post-processor module. Compatible with DSPy optimizers — they tune prompts around the retriever, not the catalog.",
  },
  {
    slug: "pydantic-ai",
    name: "Pydantic AI",
    status: "ready",
    summary:
      "Type-safe claim verification as a Pydantic AI tool. The model calls verify_claim() with a structured input, gets back a typed VerificationResult envelope. Validators catch errors early; downstream code is type-safe.",
  },
  {
    slug: "anthropic-sdk",
    name: "Anthropic SDK",
    status: "ready",
    summary:
      "Expose VERITAS as a Claude tool via the Anthropic SDK. tool_use → execute → tool_result loop. Python + TypeScript examples. Pairs with a system prompt that instructs Claude to self-verify before asserting.",
  },
  {
    slug: "instructor",
    name: "Instructor",
    status: "ready",
    summary:
      "Jason Liu's structured-output library. Pydantic models with model_validator hooks that look up claims via VERITAS at parse-time; failed verification triggers Instructor's automatic retry. Type-safe verified-claim outputs end-to-end.",
  },
];

export default function IntegrationsIndex() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/docs/" className="hover:underline">Docs</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Integrations</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Integrations
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Drop-in guides for grounding LLM responses with signed, sourced
          claims. Each guide is copy-paste runnable and covers retrieve-then-
          cite + generate-then-verify patterns.
        </p>
      </header>

      <section className="mb-10">
        <ul className="space-y-4 pl-0 list-none">
          {guides.map((g) => (
            <li key={g.slug} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
              <a href={`/docs/integrations/${g.slug}/`} className="block">
                <h2 className="text-xl font-semibold mb-2">{g.name}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{g.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Need a framework that isn't listed?{" "}
          <a href="/contact/" className="underline">Tell us</a> — the next
          guide is whichever framework gets the most requests this month.
        </p>
      </section>
    </main>
  );
}
