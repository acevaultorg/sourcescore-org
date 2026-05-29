// /claims/tag/[tag]/ — per-tag programmatic listing of every claim carrying
// that tag. Internal-linking surface + finite-public-dataset SEO compound.
//
// Generated statically across every tag present in the catalog (computed at
// build via lib/claims-build.ts loadTagIndex). Each page lists the claims +
// brief metadata + cross-links to other related tags.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadTagIndex, tagToSlug } from "@/lib/claims-build";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export async function generateStaticParams() {
  const index = await loadTagIndex();
  return index.map((entry) => ({ tag: entry.slug }));
}

type PageProps = { params: Promise<{ tag: string }> };

async function loadTagPage(tagSlug: string) {
  const index = await loadTagIndex();
  return index.find((entry) => entry.slug === tagSlug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const entry = await loadTagPage(tag);
  if (!entry) return { title: "Tag not found" };

  const title = `Claims tagged "${entry.label}" — SourceScore VERITAS`;
  const description = `${entry.claims.length} verified AI/ML claim${entry.claims.length === 1 ? "" : "s"} tagged "${entry.label}". Each has 2+ primary sources, HMAC-SHA256 signature, ready-to-paste citation.`;
  return {
    // Content-value audit (2026-05-29): tag archive pages are navigational
    // aggregations. Thin ones (<6 claims, ~under 250w of links) are noindexed
    // so they don't dilute index quality; the claim pages carry the value +
    // stay indexed. Rich tag hubs (≥6 claims) stay indexed. Kept live + follow.
    robots: entry.claims.length < 6 ? { index: false, follow: true } : undefined,
    title,
    description,
    alternates: { canonical: `https://sourcescore.org/claims/tag/${entry.slug}/` },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/claims/tag/${entry.slug}/`,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const entry = await loadTagPage(tag);
  if (!entry) notFound();

  // Sibling tags — other tags that co-occur on any of these claims.
  const allIndex = await loadTagIndex();
  const cooccurring = new Map<string, number>();
  for (const c of entry.claims) {
    for (const t of c.tags ?? []) {
      const s = tagToSlug(t);
      if (s === entry.slug) continue;
      cooccurring.set(s, (cooccurring.get(s) ?? 0) + 1);
    }
  }
  const siblings = allIndex
    .filter((e) => cooccurring.has(e.slug))
    .map((e) => ({ ...e, cooccur: cooccurring.get(e.slug)! }))
    .sort((a, b) => b.cooccur - a.cooccur)
    .slice(0, 10);

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
              { name: entry.label, url: `https://sourcescore.org/claims/tag/${entry.slug}/` },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            url: `https://sourcescore.org/claims/tag/${entry.slug}/`,
            name: `Claims tagged "${entry.label}"`,
            description: `${entry.claims.length} verified AI/ML claim${entry.claims.length === 1 ? "" : "s"} tagged "${entry.label}".`,
            isPartOf: { "@id": "https://sourcescore.org/claims/" },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: entry.claims.length,
              itemListElement: entry.claims.map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://sourcescore.org/claims/${c.id}/`,
                name: c.statement,
              })),
            },
          }),
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
        <a href="/claims/tags/" className="hover:underline">
          Tags
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">{entry.label}</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Tag</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {entry.label}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          {entry.claims.length} verified claim{entry.claims.length === 1 ? "" : "s"} carrying
          this tag. Each has 2+ primary sources and an HMAC-SHA256 signature.
        </p>
      </header>

      <section className="mb-12">
        <ul className="space-y-3 pl-0 list-none">
          {entry.claims.map((c) => (
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

      {siblings.length > 0 && (
        <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-lg font-semibold mb-4">Related tags</h2>
          <div className="flex flex-wrap gap-2">
            {siblings.map((s) => (
              <a
                key={s.slug}
                href={`/claims/tag/${s.slug}/`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm"
              >
                <span>{s.label}</span>
                <span className="text-xs text-zinc-500">{s.cooccur}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
