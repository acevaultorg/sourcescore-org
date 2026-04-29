import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DimensionRankBand,
  ALL_RANK_BANDS,
  RANK_BAND_META,
  sourcesAtDimRankBand,
  type RankBand,
} from "@/components/DimensionRankBand";

// Day 22 — Per-dim rank-band leaderboards: /modern-reference/rank/<band>/
// where band ∈ {top-10, top-25, bottom-10}.

export function generateStaticParams() {
  return ALL_RANK_BANDS.map((b) => ({ band: b }));
}

type PageProps = { params: Promise<{ band: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { band } = await params;
  if (!ALL_RANK_BANDS.includes(band as RankBand)) {
    return { title: "Rank band not found" };
  }
  const bm = RANK_BAND_META[band as RankBand];
  const list = sourcesAtDimRankBand("modernReference", band as RankBand);
  const ogImage = `https://sourcescore.org/og/grade/a-plus.svg`;
  const leader =
    bm.direction === "top" ? list[0] : list[list.length - 1];
  const description =
    bm.direction === "top"
      ? `${list.length} highest-scoring sources on Modern Reference. ${leader.name} leads at ${leader.scores.modernReference.value}.`
      : `${list.length} lowest-scoring sources on Modern Reference (caution-list). ${leader.name} sits at ${leader.scores.modernReference.value}.`;
  return {
    title: `${bm.label} sources on Modern Reference — SourceScore`,
    description: description.slice(0, 200),
    alternates: {
      canonical: `https://sourcescore.org/modern-reference/rank/${band}/`,
    },
    openGraph: {
      title: `${bm.label} · Modern Reference — SourceScore`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/modern-reference/rank/${band}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${bm.label} on Modern Reference` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function ModernReferenceRankBandPage({ params }: PageProps) {
  const { band } = await params;
  if (!ALL_RANK_BANDS.includes(band as RankBand)) notFound();
  return <DimensionRankBand dim="modernReference" band={band as RankBand} />;
}
