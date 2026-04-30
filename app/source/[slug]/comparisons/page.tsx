import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSource } from "@/data/sources";
import {
  comparisonsForSource,
  sourcesWithComparators,
} from "@/data/comparisons";
import { SourceComparatorHub } from "@/components/SourceComparatorHub";

// Day 24 — Per-source comparator hub route.
// One page per source that appears in ≥1 comparator pair (124 of 130 as of
// Day 23). Each hub lists every "X vs Y" battle the source is in with
// score deltas + cross-links. JSON twin at /api/source/<slug>/comparisons.json.

export function generateStaticParams() {
  // Filter: only generate hubs for sources that actually have comparator pairs.
  // Sources without pairs would render thin pages (HCU risk per
  // concept-finder-methodology v2.1.1 AP-9). Skip them.
  return sourcesWithComparators.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const me = getSource(slug);
  const pairs = comparisonsForSource(slug);
  if (!me || pairs.length === 0) return { title: "Source not found" };

  const title = `${me.name} comparisons — every SourceScore head-to-head`;
  const description =
    pairs.length === 1
      ? `${me.name} appears in 1 SourceScore comparator pair. Scored on Discipline, Modern Reference, and Velocity.`
      : `${me.name} appears in ${pairs.length} SourceScore comparator pairs. Each is a real "X vs Y" search-intent page scored on Discipline, Modern Reference, and Velocity.`;

  // Re-use the source's existing OG image — same brand, same scores
  const ogImage = `https://sourcescore.org/og/source/${slug}.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sourcescore.org/source/${slug}/comparisons/`,
      types: {
        "application/json": `https://sourcescore.org/api/source/${slug}/comparisons.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/source/${slug}/comparisons/`,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${me.name} SourceScore comparator hub`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SourceComparatorHubPage({ params }: PageProps) {
  const { slug } = await params;
  const me = getSource(slug);
  const pairs = comparisonsForSource(slug);
  if (!me || pairs.length === 0) notFound();

  return <SourceComparatorHub slug={slug} />;
}
