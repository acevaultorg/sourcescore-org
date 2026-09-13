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
    "Guides for adding SourceScore catalog retrieval and explicit evidence review to LangChain, LlamaIndex, OpenAI tool calls, and other LLM frameworks.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/" },
  openGraph: {
    title: "Integrations — SourceScore VERITAS",
    description: "LangChain · LlamaIndex · OpenAI tool calls — candidate retrieval and evidence review.",
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
      "Retrieve-then-cite + generate-then-review patterns. Python + JS examples for retrieving VERITAS candidate records and comparing cited evidence.",
  },
  {
    slug: "llamaindex",
    name: "LlamaIndex",
    status: "ready",
    summary:
      "Custom retriever wrapping VERITAS search plus candidate annotation. Compatible with QueryEngine and ChatEngine; evidence review remains separate.",
  },
  {
    slug: "haystack",
    name: "Haystack",
    status: "ready",
    summary:
      "Two Haystack 2.x components: a candidate-record retriever and an evidence-review stage. A bestMatch is similarity, not a truth verdict.",
  },
  {
    slug: "langgraph",
    name: "LangGraph",
    status: "ready",
    summary:
      "A StateGraph with candidate retrieval and evidence-review nodes. Compare generated assertions with returned statements and sources before assigning support.",
  },
  {
    slug: "openai-tools",
    name: "OpenAI Tool Calls",
    status: "ready",
    summary:
      "Expose catalog search and candidate retrieval as native OpenAI function calls, with exact-statement and evidence comparison before citation.",
  },
  {
    slug: "vercel-ai-sdk",
    name: "Vercel AI SDK",
    status: "ready",
    summary:
      "Wire VERITAS into Next.js + AI SDK chains for tool-based candidate retrieval and post-stream review. TypeScript-first.",
  },
  {
    slug: "dspy",
    name: "DSPy",
    status: "ready",
    summary:
      "Custom dspy.Retrieve backed by the VERITAS catalog plus a candidate-review module. Optimize against labeled support, not candidate rate.",
  },
  {
    slug: "pydantic-ai",
    name: "Pydantic AI",
    status: "ready",
    summary:
      "Type-safe candidate retrieval as a Pydantic AI tool. Schema validation catches shape errors; factual support remains a separate decision.",
  },
  {
    slug: "anthropic-sdk",
    name: "Anthropic SDK",
    status: "ready",
    summary:
      "Expose candidate retrieval as a Claude tool via the Anthropic SDK. Python and TypeScript loops plus an evidence-review prompt and application guardrail.",
  },
  {
    slug: "instructor",
    name: "Instructor",
    status: "ready",
    summary:
      "Jason Liu's structured-output library. Pydantic models retrieve VERITAS candidates at parse time; schema retries remain separate from factual evidence review.",
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
          Integration guides for retrieving curated, sourced claim records and
          reviewing their evidence before an LLM assertion is used.
          Treat framework samples as starting points: pin current dependency
          versions and test the review boundary in your own application.
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
