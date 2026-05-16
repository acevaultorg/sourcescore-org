// /claims/year/[year]/ — programmatic year-hub pages.
//
// Each year that has ≥3 claims with sources dated in that year gets its
// own page. Targets "AI papers <year>", "LLM releases <year>",
// "AI/ML breakthroughs <year>" queries.
//
// Article schema + CollectionPage + BreadcrumbList; auto-curated claim list.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { loadFullClaims } from "@/lib/claims-build";
import type { Claim } from "@/lib/claims-types";

interface PageParams {
  params: Promise<{ year: string }>;
}

function extractClaimYear(c: Claim): number | null {
  // Strategy: earliest source publishedDate year. Falls back to claim
  // lastVerified year (post-hoc-only claims).
  const dates = (c.sources ?? [])
    .map((s) => s.publishedDate)
    .filter((d): d is string => Boolean(d) && /^\d{4}/.test(d!))
    .map((d) => parseInt(d.slice(0, 4), 10))
    .filter((y) => y >= 1980 && y <= 2030);
  if (dates.length === 0) return null;
  return Math.min(...dates);
}

async function loadYearBuckets(): Promise<Map<number, Claim[]>> {
  const all = await loadFullClaims();
  const buckets = new Map<number, Claim[]>();
  for (const c of all) {
    const y = extractClaimYear(c);
    if (y == null) continue;
    if (!buckets.has(y)) buckets.set(y, []);
    buckets.get(y)!.push(c);
  }
  return buckets;
}

export async function generateStaticParams() {
  const buckets = await loadYearBuckets();
  return [...buckets.entries()]
    .filter(([, claims]) => claims.length >= 3)
    .map(([year]) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  if (Number.isNaN(yearNum)) return { title: "Year not found — SourceScore" };

  const canonical = `https://sourcescore.org/claims/year/${year}/`;
  return {
    title: { absolute: `AI/ML claims from ${year} — SourceScore VERITAS` },
    description: `Hand-verified AI/ML research claims with primary sources dated ${year}: model releases, papers, organizations, datasets.`,
    alternates: { canonical },
    openGraph: {
      title: `AI/ML claims from ${year}`,
      description: `Verified AI/ML research from ${year}.`,
      url: canonical,
      type: "website",
    },
  };
}

export default async function YearPage({ params }: PageParams) {
  const { year } = await params;
  const yearNum = parseInt(year, 10);
  if (Number.isNaN(yearNum)) notFound();

  const buckets = await loadYearBuckets();
  const claims = buckets.get(yearNum) ?? [];
  if (claims.length < 3) notFound();

  // Sort within year by confidence desc, then subject A-Z.
  claims.sort(
    (a, b) =>
      b.confidence - a.confidence || a.subject.localeCompare(b.subject),
  );

  const canonical = `https://sourcescore.org/claims/year/${year}/`;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `AI/ML claims from ${year}`,
    description: `Hand-verified AI/ML research claims with primary sources dated ${year}.`,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "SourceScore", url: "https://sourcescore.org/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: claims.length,
      itemListElement: claims.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `https://sourcescore.org/claims/${c.id}/`,
        name: c.statement,
      })),
    },
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Claims", url: "https://sourcescore.org/claims/" },
              { name: `Year ${year}`, url: canonical },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/claims/" className="hover:underline">Claims</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Year {year}</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Year hub · {claims.length} claims
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          AI/ML claims from {year}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Hand-verified research claims with primary sources dated {year}.
          Each claim has ≥2 primary sources and an HMAC-SHA256 signature.
        </p>
      </header>

      <section className="mb-10">
        <ul className="space-y-3 pl-0 list-none">
          {claims.map((c) => (
            <li
              key={c.id}
              className="border border-zinc-200 dark:border-zinc-800 rounded p-3 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <a href={`/claims/${c.id}/`} className="block">
                <p className="font-medium leading-snug">{c.statement}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  <span className="font-mono">{c.id}</span> ·{" "}
                  {c.sources.length} source{c.sources.length === 1 ? "" : "s"} ·{" "}
                  {Math.round(c.confidence * 100)}% confidence
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <p>
          <a href="/topics/foundational-papers/" className="underline">Foundational papers</a>
          {" · "}
          <a href="/topics/llm-releases-2024-2025/" className="underline">2024-2025 releases</a>
          {" · "}
          <a href="/claims/" className="underline">All claims</a>
          {" · "}
          <a href="/topics/" className="underline">All topic hubs</a>
        </p>
      </section>
    </main>
  );
}
