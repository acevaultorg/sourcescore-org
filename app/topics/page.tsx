// VERITAS-Reborn — /topics/ index.
//
// Hub-and-spoke landing for /topics/[slug]/ topic-curated claim pages.
// Each topic is a CollectionPage that groups claims by theme + adds
// editorial intro + DefinedTermSet. Compounds:
//   - SEO: every topic = new long-tail landing page
//   - Engagement: visitors browse claims thematically (more pages/session)
//   - LLM citation: DefinedTermSet + Article schema per hub

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { TOPICS } from "@/lib/topics";
import { loadFullClaims } from "@/lib/claims-build";

export const metadata: Metadata = {
  title: { absolute: "Topics — curated AI/ML claim collections — SourceScore VERITAS" },
  description:
    "Browse verified AI/ML claims by theme: foundational papers, multimodal AI, RAG and retrieval, 2024-2025 LLM releases. Each hub curates claims with editorial intro and primary sources.",
  alternates: { canonical: "https://sourcescore.org/topics/" },
  openGraph: {
    title: "Topics — SourceScore VERITAS",
    description: "Curated AI/ML claim collections by theme.",
    url: "https://sourcescore.org/topics/",
    type: "website",
  },
};

export default async function TopicsIndex() {
  const all = await loadFullClaims();

  const topicsWithCounts = TOPICS.map((t) => ({
    ...t,
    count: all.filter(t.claimFilter).length,
  }));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SourceScore VERITAS — curated AI/ML topic hubs",
    description:
      "Curated topic-based collections of verified AI/ML claims. Each hub groups claims around a theme with editorial intro and primary sources.",
    itemListElement: topicsWithCounts.map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: t.title,
      url: `https://sourcescore.org/topics/${t.slug}/`,
      description: t.metaDescription,
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
              { name: "Topics", url: "https://sourcescore.org/topics/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Topics</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Topics
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Curated collections of verified AI/ML claims grouped by theme. Each
          hub bundles editorial intro, primary-source-backed claims, and
          DefinedTerm definitions for LLM extraction.
        </p>
      </header>

      <section className="mb-10">
        <ul className="space-y-4 pl-0 list-none">
          {topicsWithCounts.map((t) => (
            <li
              key={t.slug}
              className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <a href={`/topics/${t.slug}/`} className="block">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-xl font-semibold">{t.title}</h2>
                  <span className="text-xs text-zinc-500 whitespace-nowrap mt-1">
                    {t.count} claim{t.count === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t.subtitle}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <p>
          New topic ideas?{" "}
          <a href="/contact/" className="underline">Tell us</a>. We bundle
          new hubs as the catalog crosses 150+ claims and theme density
          justifies the editorial overhead.
        </p>
      </section>
    </main>
  );
}
