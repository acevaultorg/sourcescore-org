// /concepts/ index — pillar pages for high-intent AI-engineering search
// queries. Each page is its own canonical SEO pillar; this index lets
// crawlers + devs discover them.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Concepts — SourceScore VERITAS",
  description:
    "In-depth explainers on LLM grounding, hallucination control, retrieval-augmented generation, and citation signing. Each concept page is a standalone canonical resource.",
  alternates: { canonical: "https://sourcescore.org/concepts/" },
  openGraph: {
    title: "Concepts — SourceScore VERITAS",
    description: "Pillar explainers on grounding, hallucination, RAG, citation signing.",
    url: "https://sourcescore.org/concepts/",
    type: "website",
  },
};

const concepts = [
  {
    slug: "llm-grounding",
    title: "LLM grounding",
    summary:
      "What it means to ground a language model's output in verified sources, the three patterns that work, and where VERITAS fits.",
    status: "live",
  },
  {
    slug: "hallucination",
    title: "LLM hallucination",
    summary:
      "Five categories of LLM hallucination, the six root causes, measured rates by query type, and the mitigation ladder from prompt engineering to signed-claim verification.",
    status: "live",
  },
  {
    slug: "rag-vs-veritas",
    title: "RAG vs signed-claim verification",
    summary:
      "RAG retrieves prose chunks; VERITAS retrieves typed atomic claims with signatures. Comparison table, when to use each, the hybrid pattern most production systems converge on.",
    status: "live",
  },
];

export default function ConceptsIndex() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Concepts</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Concepts
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          In-depth explainers on the foundational ideas that VERITAS is
          built around. Each page is a standalone resource — useful even
          if you never integrate the API.
        </p>
      </header>

      <ul className="space-y-4 pl-0 list-none">
        {concepts.map((c) => (
          <li
            key={c.slug}
            className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <a href={`/concepts/${c.slug}/`} className="block">
              <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{c.summary}</p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
