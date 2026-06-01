// Blog index. Post list is the single source of truth at data/blog-posts.json,
// also consumed by scripts/generate-rss.mjs so /feed.xml never drifts from this
// index (the two were previously separate hardcoded lists — RSS lagged at 4 of 8).

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import blogPosts from "@/data/blog-posts.json";

interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  publishedDate: string;
  tags: string[];
}

const POSTS: PostMeta[] = blogPosts;

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
              {p.summary}
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
