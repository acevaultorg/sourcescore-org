import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DimensionRankBand,
  ALL_RANK_BANDS,
  RANK_BAND_META,
  sourcesAtDimRankBand,
  type RankBand,
} from "@/components/DimensionRankBand";
import { datasetSchema } from "@/lib/methodology-version";

// Day 22 — Per-dim rank-band leaderboards: /velocity/rank/<band>/
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
  const list = sourcesAtDimRankBand("velocity", band as RankBand);
  const ogImage = `https://sourcescore.org/og/grade/a-plus.svg`;
  const leader =
    bm.direction === "top" ? list[0] : list[list.length - 1];
  const description =
    bm.direction === "top"
      ? `${list.length} highest-scoring sources on Citation Velocity. ${leader.name} leads at ${leader.scores.velocity.value}.`
      : `${list.length} lowest-scoring sources on Citation Velocity (caution-list). ${leader.name} sits at ${leader.scores.velocity.value}.`;
  return {
    title: `${bm.label} sources on Citation Velocity`,
    description: description.slice(0, 200),
    alternates: {
      canonical: `https://sourcescore.org/velocity/rank/${band}/`,
    },
    openGraph: {
      title: `${bm.label} · Citation Velocity — SourceScore`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/velocity/rank/${band}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${bm.label} on Citation Velocity` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function VelocityRankBandPage({ params }: PageProps) {
  const { band } = await params;
  if (!ALL_RANK_BANDS.includes(band as RankBand)) notFound();
  const bm = RANK_BAND_META[band as RankBand];
  const list = sourcesAtDimRankBand("velocity", band as RankBand);
  const leader = bm.direction === "top" ? list[0] : list[list.length - 1];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `${bm.label} sources on Citation Velocity`,
              description: `Machine-readable JSON record of ${list.length} sources in the "${bm.label}" rank band on Citation Velocity.${leader ? ` Leader: ${leader.name} (${leader.scores.velocity.value}/100).` : ""}`,
              url: `https://sourcescore.org/velocity/rank/${band}/`,
              apiUrl: `https://sourcescore.org/api/velocity/rank/${band}.json`,
              identifier: `velocity-rank-${band}`,
              keywords: [
                "Citation Velocity",
                "AI citation",
                "SourceScore",
                bm.label,
                "leaderboard",
              ],
              dateModified: leader?.verified ?? "2026-04-29",
              isPartOf: {
                name: "SourceScore Citation Velocity rankings",
                url: "https://sourcescore.org/velocity/",
              },
            })
          ),
        }}
      />
      <DimensionRankBand dim="velocity" band={band as RankBand} />
    </>
  );
}
