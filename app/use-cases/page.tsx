// /use-cases/ — index of concrete deployment patterns for VERITAS.
//
// High-intent buyer pages. Each use-case bundles: problem statement,
// pattern overview, integration code snippet, expected outcome. Aleyda
// Solis 10-char #10 Transactable — every page has clear next-action.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "Use cases — SourceScore VERITAS" },
  description:
    "Deployment patterns for SourceScore VERITAS: AI agent grounding, RAG pipeline verification, research citation, content moderation. Concrete code + expected outcomes.",
  alternates: { canonical: "https://sourcescore.org/use-cases/" },
  openGraph: {
    title: "Use cases — SourceScore VERITAS",
    description: "Concrete deployment patterns for grounded LLM applications.",
    url: "https://sourcescore.org/use-cases/",
    type: "website",
  },
};

const USE_CASES = [
  {
    slug: "ai-agent-grounding",
    title: "AI agent grounding",
    summary:
      "Stop agents from hallucinating release dates, parameter counts, and architectural facts in multi-step tool-using chains. Drop verify_claim into the agent's tool catalog.",
    audience: "Agent developers using LangChain/LlamaIndex/OpenAI tools",
  },
  {
    slug: "rag-pipeline-verification",
    title: "RAG pipeline verification",
    summary:
      "Add a verification layer to existing RAG. Retrieval pulls the right doc but the model still emits wrong numbers; verify-then-respond catches the gap.",
    audience: "Teams running production RAG with hallucination tickets",
  },
  {
    slug: "research-citation",
    title: "Research citation tooling",
    summary:
      "Programmatic citations for academic + research AI tools. Stable claim IDs, primary sources with verbatim excerpts, HMAC signatures for reproducibility.",
    audience: "Research labs, academic AI projects, citation-required builds",
  },
  {
    slug: "customer-support-bot",
    title: "Customer-support chatbot grounding",
    summary:
      "Stop bots from hallucinating product pricing, integrations, rate limits, AI/ML facts. Two-catalog pattern (your own product facts + SourceScore VERITAS) with route-to-human on unverified claims.",
    audience: "SaaS support teams, product chatbot builders",
  },
  {
    slug: "content-moderation",
    title: "Content moderation — fact-check LLM outputs",
    summary:
      "Pre-publish verification gate for newsletter generators, blog assistants, report drafters. Extract atomic claims, verify each, flag or strip unverified before publish.",
    audience: "Editorial AI tools, content-generation platforms, marketing automation",
  },
];

export default function UseCasesIndex() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SourceScore VERITAS — Use cases",
    description: "Concrete deployment patterns for grounded LLM applications.",
    itemListElement: USE_CASES.map((u, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: u.title,
      url: `https://sourcescore.org/use-cases/${u.slug}/`,
      description: u.summary,
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Use cases", url: "https://sourcescore.org/use-cases/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Use cases</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Use cases
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Concrete deployment patterns for grounding LLM applications with
          signed, sourced claims. Each use case bundles problem statement,
          integration pattern, code snippet, and expected outcomes.
        </p>
      </header>

      <section className="mb-10">
        <ul className="space-y-4 pl-0 list-none">
          {USE_CASES.map((u) => (
            <li
              key={u.slug}
              className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <a href={`/use-cases/${u.slug}/`} className="block">
                <h2 className="text-xl font-semibold mb-2">{u.title}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {u.summary}
                </p>
                <p className="text-xs text-zinc-500">
                  <strong>For:</strong> {u.audience}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <p>
          Need a use case that isn&apos;t listed?{" "}
          <a href="/contact/" className="underline">Tell us</a> — the next
          published use case is whichever pattern gets the most requests
          this month.
        </p>
      </section>
    </main>
  );
}
