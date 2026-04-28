import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSource, allSlugs } from "@/data/sources";
import {
  SourceDimensionDetail,
  DIMENSION_META,
  dimensionRank,
} from "@/components/SourceDimensionDetail";

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = getSource(slug);
  if (!s) return { title: "Source not found" };

  const meta = DIMENSION_META.discipline;
  const score = s.scores.discipline;
  const ogImage = `https://sourcescore.org/og/source/${slug}.svg`;
  const description = `${s.name} scores ${score.grade} (${score.value}) on Citation Discipline — ${score.rationale}`;

  return {
    title: `${s.name} — Citation Discipline ${score.grade} (${score.value}) — SourceScore`,
    description: description.slice(0, 200),
    alternates: { canonical: `https://sourcescore.org/discipline/${slug}/` },
    openGraph: {
      title: `${s.name} — Citation Discipline ${score.grade}·${score.value}`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/discipline/${slug}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${s.name} on SourceScore` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function DisciplineSourcePage({ params }: PageProps) {
  const { slug } = await params;
  const s = getSource(slug);
  if (!s) notFound();

  const score = s.scores.discipline;
  const rank = dimensionRank(s, "discipline");

  // JSON-LD Article schema with quote-ready DefinedTerm
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${s.name} — Citation Discipline ${score.grade} (${score.value})`,
    description: score.rationale,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: "2026-04-29",
    dateModified: "2026-04-29",
    url: `https://sourcescore.org/discipline/${slug}/`,
    about: { "@type": "WebSite", name: s.name, url: `https://${s.domain}` },
    mainEntity: {
      "@type": "DefinedTerm",
      name: `Citation Discipline (${s.name})`,
      description: `${s.name} scores ${score.grade} (${score.value}) on Citation Discipline — global rank #${rank} of all SourceScore sources.`,
      inDefinedTermSet: "https://sourcescore.org/methodology/citation-discipline/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SourceDimensionDetail source={s} dim="discipline" />
    </>
  );
}
