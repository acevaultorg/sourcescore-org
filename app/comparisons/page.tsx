// /comparisons/ — index of head-to-head comparisons. High buyer-intent SEO.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "Comparisons — SourceScore VERITAS vs alternatives" },
  description:
    "Honest head-to-head: VERITAS vs Wikipedia API, vs Wolfram Alpha, vs LLM search-grounding (Perplexity / ChatGPT search). When to use each.",
  alternates: { canonical: "https://sourcescore.org/comparisons/" },
  openGraph: {
    title: "Comparisons — SourceScore VERITAS vs alternatives",
    description: "Honest head-to-head comparisons for LLM grounding.",
    url: "https://sourcescore.org/comparisons/",
    type: "website",
  },
};

const COMPARISONS = [
  {
    slug: "veritas-vs-wikipedia",
    title: "VERITAS vs Wikipedia API",
    summary:
      "Wikipedia is a knowledge encyclopedia; VERITAS is a verification API. They optimize for different use cases. When to use each + when to use both.",
  },
  {
    slug: "veritas-vs-wolfram-alpha",
    title: "VERITAS vs Wolfram Alpha",
    summary:
      "Wolfram Alpha computes; VERITAS verifies. Computational answers vs source-backed claims. Honest comparison + complementary use cases.",
  },
  {
    slug: "veritas-vs-search-grounding",
    title: "VERITAS vs LLM search-grounding (Perplexity, ChatGPT search)",
    summary:
      "LLM-with-search grounds via live web. VERITAS grounds via signed verified-claim envelopes. Latency, reliability, citation quality, signature trade-offs.",
  },
  {
    slug: "veritas-vs-anthropic-citations",
    title: "VERITAS vs Anthropic Citations API",
    summary:
      "Anthropic Citations API grounds in user-supplied docs (Claude only, in-context citations). VERITAS grounds in a signed externally-citable claim catalog (any LLM, public URLs, HMAC-verifiable). Complementary patterns — when to use each + when to use both.",
  },
];

export default function ComparisonsIndex() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "SourceScore VERITAS comparisons",
            description: "Head-to-head comparisons with alternative LLM-grounding approaches.",
            itemListElement: COMPARISONS.map((c, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: c.title,
              url: `https://sourcescore.org/comparisons/${c.slug}/`,
              description: c.summary,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Comparisons", url: "https://sourcescore.org/comparisons/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Comparisons</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Comparisons
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Honest head-to-head: where SourceScore VERITAS fits next to
          other LLM-grounding approaches. We&apos;ll tell you when our
          tool isn&apos;t the right one.
        </p>
      </header>

      <section className="mb-10">
        <ul className="space-y-4 pl-0 list-none">
          {COMPARISONS.map((c) => (
            <li
              key={c.slug}
              className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <a href={`/comparisons/${c.slug}/`} className="block">
                <h2 className="text-xl font-semibold mb-2">{c.title}</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {c.summary}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
