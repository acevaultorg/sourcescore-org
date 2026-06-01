// Blog index — single post at launch; expands as operator publishes more.
//
// Posts list lives inline for v0; when post count exceeds ~5, refactor to
// a data/blog-posts.ts catalog + auto-build the index.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

interface PostMeta {
  slug: string;
  title: string;
  subtitle: string;
  publishedDate: string;
  tags: string[];
}

const POSTS: PostMeta[] = [
  {
    slug: "how-to-tell-if-a-source-is-reliable",
    title: "How to tell if a source is reliable: a 3-signal checklist",
    subtitle:
      "A practical way to judge any source — does credible work cite it, does it stay current and correct itself, and are people citing it now — plus how to check 130+ sources instantly on the SourceScore Index.",
    publishedDate: "2026-05-31",
    tags: ["source-reliability", "credibility", "evaluating-sources", "citation", "guide", "fact-checking"],
  },
  {
    slug: "multi-llm-grounding-2026",
    title:
      "Multi-LLM grounding in 2026 — build once, deploy across OpenAI, Anthropic, Google, and open-weight",
    subtitle:
      "Single-provider lock-in is fragile in 2026. Pricing shifts, capability changes, and outages all argue for portability. The architecture pattern that keeps your grounding layer LLM-agnostic — same verification, citation, and source-quality across every provider.",
    publishedDate: "2026-05-17",
    tags: ["multi-llm", "architecture", "portability", "router", "adapter", "grounding"],
  },
  {
    slug: "llm-grounding-strategies-2026",
    title:
      "Six grounding strategies that actually reduce LLM hallucination (and the trade-offs)",
    subtitle:
      "Prompt engineering buys 10-30%. Retrieval-augmented generation buys another 20-40%. Signed-claim verification closes the long tail. Six strategies, their measured impact, and when to combine.",
    publishedDate: "2026-05-17",
    tags: ["grounding", "hallucination", "rag", "verification", "production", "patterns"],
  },
  {
    slug: "llm-framework-comparison-2026",
    title:
      "LLM framework comparison 2026 — LangChain vs LlamaIndex vs OpenAI tools vs DSPy vs Pydantic AI vs Vercel AI SDK vs Anthropic SDK",
    subtitle:
      "Seven LLM frameworks own most of 2026 dev mindshare. They optimize for different things — orchestration, retrieval, type-safety, vendor-native, deployment ergonomics. Pick by archetype + audience + commitment.",
    publishedDate: "2026-05-16",
    tags: ["framework", "comparison", "langchain", "llamaindex", "openai", "anthropic", "dspy", "pydantic-ai", "vercel-ai-sdk"],
  },
  {
    slug: "why-no-performance-claims",
    title:
      "Why VERITAS doesn't ship performance-comparison claims (and what we ship instead)",
    subtitle:
      "Benchmark numbers vary by prompt format, model version, shot count, and evaluation harness. Shipping them as 'verified claims' is the surest way to make the catalog wrong by Thursday. Here's the alternative.",
    publishedDate: "2026-05-16",
    tags: ["methodology", "trust", "benchmarks", "veritas"],
  },
  {
    slug: "verify-ai-facts-five-lines-python",
    title: "Verifying AI-generated facts in 5 lines of Python",
    subtitle:
      "Drop SourceScore VERITAS into your LLM pipeline as a post-generation check. Every claim the model emits gets a confidence score + canonical citation before the user sees it.",
    publishedDate: "2026-05-16",
    tags: ["tutorial", "python", "veritas", "hallucination"],
  },
  {
    slug: "launching-veritas",
    title:
      "Stop hallucinating: a developer API for grounding LLM responses with signed, sourced claims",
    subtitle:
      "VERITAS is a free-tier-friendly API that returns hand-verified AI/ML claims with their primary sources, an HMAC-SHA256 signature, and a ready-to-paste citation.",
    publishedDate: "2026-05-16",
    tags: ["launch", "veritas", "api", "llm-grounding"],
  },
];

export const metadata: Metadata = {
  title: { absolute: "Blog — SourceScore" },
  description:
    "Posts on AI-citation quality, LLM grounding, and the SourceScore methodology.",
  alternates: {
    canonical: "https://sourcescore.org/blog/",
    types: {
      "application/rss+xml": "https://sourcescore.org/feed.xml",
    },
  },
  openGraph: {
    title: "Blog — SourceScore",
    description: "Posts on AI-citation quality and LLM grounding.",
    url: "https://sourcescore.org/blog/",
    type: "website",
  },
};

export default function BlogIndex() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Blog", url: "https://sourcescore.org/blog/" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": "https://sourcescore.org/blog/#blog",
            name: "SourceScore Blog",
            url: "https://sourcescore.org/blog/",
            description:
              "Posts on AI-citation quality, LLM grounding, and the SourceScore methodology.",
            publisher: { "@id": "https://sourcescore.org/#organization" },
            blogPost: POSTS.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `https://sourcescore.org/blog/${p.slug}/`,
              datePublished: p.publishedDate,
            })),
          }),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Blog</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Blog
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Posts on AI-citation quality, LLM grounding, and the SourceScore
          methodology.
        </p>
      </header>

      <ul className="space-y-8 pl-0 list-none">
        {POSTS.map((p) => (
          <li
            key={p.slug}
            className="border-b border-zinc-200 dark:border-zinc-800 pb-8 last:border-b-0"
          >
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              {p.publishedDate} · {p.tags.join(" · ")}
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight mb-2">
              <a
                href={`/blog/${p.slug}/`}
                className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400"
              >
                {p.title}
              </a>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {p.subtitle}
            </p>
            <p className="mt-3">
              <a
                href={`/blog/${p.slug}/`}
                className="text-sm text-zinc-900 dark:text-zinc-100 underline"
              >
                Read →
              </a>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
