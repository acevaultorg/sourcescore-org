// /claims/tags/ — full tag-index page. Lists every unique tag in the
// VERITAS catalog with member count. Cluster-navigation surface for
// readers + bots; programmatic-SEO depth (each tag has its own indexed
// /claims/tag/<slug>/ page).

import type { Metadata } from "next";
import { loadTagIndex } from "@/lib/claims-build";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Claim tags — SourceScore VERITAS",
  description:
    "All tags carrying verified AI/ML claims in the SourceScore VERITAS catalog. Click any tag to see the claims it groups.",
  alternates: { canonical: "https://sourcescore.org/claims/tags/" },
  openGraph: {
    title: "Claim tags — SourceScore VERITAS",
    description:
      "Every tag in the VERITAS catalog with claim counts. Cluster-navigate by topic.",
    url: "https://sourcescore.org/claims/tags/",
    type: "website",
  },
};

export default async function TagsIndex() {
  const index = await loadTagIndex();

  // Bucket size groups for visual rhythm.
  const big = index.filter((e) => e.claims.length >= 5);
  const mid = index.filter((e) => e.claims.length >= 2 && e.claims.length < 5);
  const small = index.filter((e) => e.claims.length === 1);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Claims", url: "https://sourcescore.org/claims/" },
              { name: "Tags", url: "https://sourcescore.org/claims/tags/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <a href="/claims/" className="hover:underline">
          Claims
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Tags</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Claim tags
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          {index.length} tags across the VERITAS catalog. Each links to a
          listing of every claim carrying it.
        </p>
      </header>

      <TagBucket title="High-frequency (≥5 claims)" tags={big} weight="lg" />
      <TagBucket title="Medium-frequency (2-4 claims)" tags={mid} weight="md" />
      <TagBucket title="Long-tail (1 claim)" tags={small} weight="sm" />
    </main>
  );
}

function TagBucket({
  title,
  tags,
  weight,
}: {
  title: string;
  tags: Awaited<ReturnType<typeof loadTagIndex>>;
  weight: "lg" | "md" | "sm";
}) {
  if (tags.length === 0) return null;
  const baseClass =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors";
  const sizeClass =
    weight === "lg"
      ? "text-base"
      : weight === "md"
        ? "text-sm"
        : "text-xs text-zinc-600 dark:text-zinc-400";
  return (
    <section className="mb-10">
      <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <a
            key={t.slug}
            href={`/claims/tag/${t.slug}/`}
            className={`${baseClass} ${sizeClass}`}
          >
            <span className="font-medium">{t.label}</span>
            <span className="text-xs text-zinc-500">{t.claims.length}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
