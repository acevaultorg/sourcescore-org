// VERITAS-Reborn — public changelog.
//
// Hand-curated ship log; reverse-chronological. Aleyda Solis 10-char #9
// Fresh + #7 Credible — devs evaluating the API check changelog cadence
// as a proxy for "is this maintained."

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Changelog — SourceScore VERITAS",
  description:
    "Public ship log for SourceScore VERITAS. Endpoint additions, catalog expansions, methodology updates, breaking-change notices, retired surfaces. Reverse-chronological.",
  alternates: {
    canonical: "https://sourcescore.org/changelog/",
    types: {
      "application/rss+xml": "https://sourcescore.org/feed.xml",
    },
  },
  openGraph: {
    title: "Changelog — SourceScore VERITAS",
    description: "Public ship log for the SourceScore VERITAS claim verification API.",
    url: "https://sourcescore.org/changelog/",
    type: "website",
  },
};

type Entry = {
  date: string;
  kind: "feat" | "fix" | "docs" | "data" | "breaking";
  title: string;
  body: string;
};

const entries: Entry[] = [
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 91 → 102 (Batch 5 — foundational methods, benchmarks, vector DB companies)",
    body:
      "11 new hand-verified claims, each with ≥2 primary sources. Foundational methods: ELMo (Peters et al., 2018), Latent Diffusion Models (Rombach et al., 2021), ELECTRA (Clark et al., 2020), Codex (Chen et al., 2021). Models: GPT-3 introduced_in_paper (Brown et al., 2020) — adds the foundational-paper predicate to the existing GPT-3 parameter_count claim. Benchmarks: GLUE (Wang et al., 2018), SuperGLUE (Wang et al., 2019). Vector DB companies: Pinecone (2019), Weaviate (2019), Qdrant (2021). Inference platforms: Replicate (2019).",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/glossary/ — 35-term AI/ML glossary with DefinedTermSet schema",
    body:
      "Plain-language definitions for 35 terms used across SourceScore and VERITAS — grounding · RAG · hallucination · claim envelope · HMAC-SHA256 · transformer · MoE · tokenizer · YMYL · matchScore · llms.txt · methodology version · primary source · verbatim excerpt · etc. Each entry has a stable anchor URL (/glossary/#token), DefinedTerm schema on every entry, plus a DefinedTermSet wrapping all entries. LLMs answering 'what is X' queries can now extract clean definitions from the page. Internal-linking density compounds — every concept/blog/integration page can deep-link to a glossary anchor.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/playground/ — interactive in-browser verification demo",
    body:
      "Type a free-form claim, see VERITAS verify it live against the signed catalog. Pure client-side JavaScript calling /api/v1/verify — same endpoint your code will use, with the request shape and response shown side-by-side. Six sample claims pre-staged for one-click trying. No signup, no key, no quota for read-only access. Activation-stage UX so devs understand the product without writing code first.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/concepts/ pillar pages — LLM grounding, hallucination, RAG vs VERITAS",
    body:
      "Three standalone explainers (Wikipedia-rival depth) on high-intent search queries: definition of LLM grounding + 3 production patterns (prompt-stuffing / RAG / signed claims); five categories of hallucination + six root causes + mitigation ladder; RAG vs signed-claim verification comparison + hybrid pattern. TechArticle + DefinedTerm schema so LLMs can extract definitions cleanly.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/docs/integrations/ — 4 drop-in framework guides",
    body:
      "LangChain (retrieve-then-cite + generate-then-verify + signature-verify patterns); LlamaIndex (custom Retriever + NodePostprocessor); OpenAI tool-calls + Anthropic Claude tool-use; Vercel AI SDK (streamText + tool() function-calling). Each guide is copy-paste runnable in Python or JavaScript.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/quickstart/ — 5-minute self-serve onboarding",
    body:
      "Three sequential code blocks (curl + JS + Python) cover verify → search → fetch-envelope. HowTo + BreadcrumbList schema. No signup gate; free tier covers first 1,000 calls per month for read-only catalog access.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 76 → 91 (Batch 4 — methods + datasets + organizations)",
    body:
      "15 new hand-verified claims (24 drafted, 9 deduped against pre-existing entries after build caught case-insensitive collisions). Foundational methods: Chain-of-Thought, ReAct, LoRA, QLoRA, DPO, FlashAttention, RoPE, BPE, SentencePiece, RAG. Models + datasets: T5, C4, The Pile, RedPajama, CLIP, Whisper, DALL·E 2, Stable Diffusion. Organizations: Stability AI, EleutherAI, Together AI, Mistral, AI21 Labs, Hugging Face. Each has ≥2 primary sources with verbatim excerpts.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Per-tag claim browsing + Related-claims surface",
    body:
      "New /claims/tag/[tag]/ programmatic pages (one per unique tag) and /claims/tags/ index grouped by frequency buckets. Each /claims/[id]/ now shows top 5 related claims by shared-tag overlap with confidence tie-break. Tag chips on per-claim pages now link to tag pages — internal-linking density compounds.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Framework integration guides",
    body:
      "/docs/integrations/ index with three drop-in guides: LangChain (retrieve-then-cite + generate-then-verify patterns), LlamaIndex (custom Retriever + NodePostprocessor), OpenAI tool-calls (native function-calling with search_claims + verify_claim). Each guide is copy-paste runnable, Python + JavaScript where applicable, with TechArticle + BreadcrumbList schema.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/embed/claim/[id] embeddable widget",
    body:
      "Iframe-embeddable claim card (CSP frame-ancestors *). Drop it into any blog, docs page, or knowledge base — renders the signed statement + primary source + click-through to the canonical page. CC-BY 4.0 with embedded attribution. Snippet generator on every /claims/[id]/ page.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Per-claim OG images + /claims/feed.xml RSS",
    body:
      "76 hand-rendered 1200×630 SVG OG images, one per claim (gradient background + verified-claim eyebrow + confidence% + wrapped statement + signing strip + source publisher + canonical URL footer). Plus a full claims RSS feed at /claims/feed.xml so devs can subscribe to catalog updates in Feedly/Inoreader.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "POST /api/v1/verify — match a free-form claim against the catalog",
    body:
      "Single-claim verification endpoint. Returns top-5 ranked matches with normalized matchScore + rationale; bestMatch surfaces iff matchScore ≥0.20 AND confidence ≥minConfidence (default 0.85). Optionally signs the response with HMAC-SHA256 if SOURCESCORE_SIGNING_SECRET is set on the worker.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "GET /api/v1/search — keyword search over the catalog",
    body:
      "Search across subject (×5), tags (×3), object (×3), statement (×2), predicate (×2). Returns top-K matches with score. Permissive CORS. Browser cache 60s, CDN cache 5min.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Day 1 launch — VERITAS-Reborn",
    body:
      "Public launch of the signed-claim verification API. 26 seed claims with 16-hex stable IDs derived from canonical fields, ≥2 primary sources each, HMAC-SHA256 signed envelopes. Endpoints: catalog (/api/v1/claims.json), per-claim envelope (/api/v1/claims/{id}.json), methodology (/api/v1/methodology.json). TypeScript SDK + OpenAPI 3.1.0 spec.",
  },
];

const kindLabel: Record<Entry["kind"], string> = {
  feat: "feature",
  fix: "fix",
  docs: "docs",
  data: "catalog",
  breaking: "breaking",
};

const kindColor: Record<Entry["kind"], string> = {
  feat: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  fix: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  docs: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  data: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
  breaking: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

export default function ChangelogPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Changelog", url: "https://sourcescore.org/changelog/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Changelog</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Changelog
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Every shipped feature, catalog expansion, and methodology
          update on the SourceScore VERITAS API. Reverse-chronological.
        </p>
      </header>

      <section className="space-y-8">
        {entries.map((e, i) => (
          <article
            key={`${e.date}-${i}`}
            className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-5"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <time className="text-sm font-mono text-zinc-500">{e.date}</time>
              <span
                className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded ${kindColor[e.kind]}`}
              >
                {kindLabel[e.kind]}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2 leading-snug">{e.title}</h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {e.body}
            </p>
          </article>
        ))}
      </section>

      <footer className="mt-14 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Subscribe to catalog updates via{" "}
          <a href="/claims/feed.xml" className="underline">
            /claims/feed.xml
          </a>{" "}
          (RSS) or browse the full{" "}
          <a href="/claims/" className="underline">
            verified claim catalog
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
