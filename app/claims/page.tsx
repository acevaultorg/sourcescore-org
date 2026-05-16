// Claims index — consumer browser for the VERITAS-Reborn catalog (Day 1).
//
// Static page; lists every claim with subject, statement, confidence,
// and link to per-claim detail page. Bot-citation surface + dev-discovery
// landing for the API.

import type { Metadata } from "next";
import { loadFullClaims } from "@/lib/claims-build";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Verified AI/ML Claims — SourceScore VERITAS",
  description:
    "Signed, sourced, citable claims about AI/ML research and model releases. Each claim has 2+ primary sources, an HMAC-SHA256 signature, and a stable JSON API endpoint for LLM developers building grounded retrieval systems.",
  alternates: {
    canonical: "https://sourcescore.org/claims/",
    types: {
      "application/json": "https://sourcescore.org/api/v1/claims.json",
      "application/rss+xml": "https://sourcescore.org/claims/feed.xml",
    },
  },
  openGraph: {
    title: "Verified AI/ML Claims — SourceScore VERITAS",
    description:
      "Signed, sourced claims for grounded LLM retrieval. Browse the catalog or fetch via /api/v1/claims.json.",
    url: "https://sourcescore.org/claims/",
    type: "website",
  },
};

export default async function ClaimsIndexPage() {
  const claims = await loadFullClaims();

  // Group by tag-derived theme for browsability. Cheap categorization at v0:
  // foundational papers vs model releases vs organizations. Built off the tags
  // — kept as a 1-line classification, not a separate metadata field.
  const foundational = claims.filter((c) =>
    c.tags?.includes("foundational"),
  );
  const releases = claims.filter(
    (c) =>
      !c.tags?.includes("foundational") &&
      !c.tags?.includes("company") &&
      (c.predicate === "released_on" ||
        c.predicate === "context_window_tokens" ||
        c.predicate === "parameter_count" ||
        c.predicate === "architecture"),
  );
  const organizations = claims.filter((c) => c.tags?.includes("company"));

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "SourceScore VERITAS — AI/ML Claims Catalog",
            description: `Signed, sourced, citable claims about AI/ML research and model releases. v0.1 catalog (${claims.length} hand-verified claims spanning 1997-2025). Each claim has ≥2 primary sources and an HMAC-SHA256 signature. Suited for grounded LLM retrieval and citation.`,
            url: "https://sourcescore.org/claims/",
            license: "https://creativecommons.org/licenses/by/4.0/",
            creator: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            distribution: [
              {
                "@type": "DataDownload",
                encodingFormat: "application/json",
                contentUrl: "https://sourcescore.org/api/v1/claims.json",
                name: "Full claim catalog (light per-claim summaries)",
              },
              {
                "@type": "DataDownload",
                encodingFormat: "application/json",
                contentUrl: "https://sourcescore.org/api/v1/methodology.json",
                name: "Verification methodology metadata",
              },
            ],
            keywords:
              "ai, ml, llm, claim verification, grounded retrieval, source citation, fact checking",
            dateModified: new Date().toISOString().slice(0, 10),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Claims", url: "https://sourcescore.org/claims/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Claims</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          Verified AI/ML Claims
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          {claims.length} signed, sourced claims for grounded LLM retrieval.
          Each claim has 2+ primary sources, an HMAC-SHA256 signature, and a
          stable JSON API endpoint.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            href="/playground/"
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300"
          >
            Try the playground
          </a>
          <a
            href="/quickstart/"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Quickstart (5 min)
          </a>
          <a
            href="/docs/"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            API docs
          </a>
          <a
            href="/api/v1/claims.json"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Full catalog JSON
          </a>
          <a
            href="/pricing/"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Pricing
          </a>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Browse by topic</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="/topics/foundational-papers/"
            className="block border border-zinc-200 dark:border-zinc-800 rounded p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <p className="font-semibold mb-1">Foundational papers</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Transformer, LSTM, BERT, RLHF, RAG, LoRA, FlashAttention — the canonical reading list.
            </p>
          </a>
          <a
            href="/topics/llm-releases-2024-2025/"
            className="block border border-zinc-200 dark:border-zinc-800 rounded p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <p className="font-semibold mb-1">2024-2025 LLM releases</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              GPT-4o, Claude Opus 4, Gemini Ultra, Llama 3.x, DeepSeek-R1, Phi-4, Qwen, OpenAI o1.
            </p>
          </a>
          <a
            href="/topics/multimodal-ai/"
            className="block border border-zinc-200 dark:border-zinc-800 rounded p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <p className="font-semibold mb-1">Multimodal AI</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              CLIP, DALL·E, Stable Diffusion, Imagen, Flamingo, Sora, Whisper.
            </p>
          </a>
          <a
            href="/topics/rag-and-retrieval/"
            className="block border border-zinc-200 dark:border-zinc-800 rounded p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <p className="font-semibold mb-1">RAG &amp; retrieval</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              FAISS, Pinecone, Weaviate, Self-RAG, LangChain, LlamaIndex, MCP.
            </p>
          </a>
        </div>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="/topics/" className="underline">All topic hubs</a>
          {" · "}
          <a href="/claims/tags/" className="underline">Browse by tag</a>
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Browse by year</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013"].map((y) => (
            <a
              key={y}
              href={`/claims/year/${y}/`}
              className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {y}
            </a>
          ))}
        </div>
      </section>

      <ClaimSection title="Foundational papers" claims={foundational} />
      <ClaimSection title="Model releases" claims={releases} />
      <ClaimSection title="Organizations" claims={organizations} />
    </main>
  );
}

function ClaimSection({
  title,
  claims,
}: {
  title: string;
  claims: Awaited<ReturnType<typeof loadFullClaims>>;
}) {
  if (claims.length === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">
        {title}{" "}
        <span className="text-sm text-zinc-500 font-normal">({claims.length})</span>
      </h2>
      <ul className="space-y-3 pl-0 list-none">
        {claims.map((c) => (
          <li
            key={c.id}
            className="border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-b-0"
          >
            <a
              href={`/claims/${c.id}/`}
              className="block hover:bg-zinc-50 dark:hover:bg-zinc-900 -mx-2 px-2 py-1 rounded"
            >
              <p className="font-medium leading-snug">{c.statement}</p>
              <p className="mt-1 text-xs text-zinc-500">
                <span className="font-mono">{c.id}</span> · {c.sources.length}{" "}
                source{c.sources.length === 1 ? "" : "s"} ·{" "}
                {Math.round(c.confidence * 100)}% confidence
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
