import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSource, allSlugs } from "@/data/sources";
import {
  SourceDimensionDetail,
  DIMENSION_META,
  dimensionRank,
} from "@/components/SourceDimensionDetail";
import { datasetSchema } from "@/lib/methodology-version";

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = getSource(slug);
  if (!s) return { title: "Source not found" };

  const meta = DIMENSION_META.velocity;
  const score = s.scores.velocity;
  const ogImage = `https://sourcescore.org/og/source/${slug}.svg`;
  const description = `${s.name} scores ${score.grade} (${score.value}) on Citation Velocity — ${score.rationale}`;

  return {
    // Crawl-budget concentration (2026-05-28): per-source single-dimension page
    // that re-displays the rationale already on /source/<slug>/. Thin duplicate,
    // near-zero query volume, ~0 clicks per GSC. noindex,follow so authority +
    // crawl budget flow to the source page. Reversible: delete this line.
    robots: { index: false, follow: true },
    title: `${s.name} — Citation Velocity ${score.grade} (${score.value})`,
    description: description.slice(0, 200),
    alternates: { canonical: `https://sourcescore.org/velocity/${slug}/` },
    openGraph: {
      title: `${s.name} — Citation Velocity ${score.grade}·${score.value}`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/velocity/${slug}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${s.name} on SourceScore` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function VelocitySourcePage({ params }: PageProps) {
  const { slug } = await params;
  const s = getSource(slug);
  if (!s) notFound();

  const score = s.scores.velocity;
  const rank = dimensionRank(s, "velocity");

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${s.name} — Citation Velocity ${score.grade} (${score.value})`,
    description: score.rationale,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: "2026-04-29",
    dateModified: "2026-04-29",
    url: `https://sourcescore.org/velocity/${slug}/`,
    about: { "@type": "WebSite", name: s.name, url: `https://${s.domain}` },
    mainEntity: {
      "@type": "DefinedTerm",
      name: `Citation Velocity (${s.name})`,
      description: `${s.name} scores ${score.grade} (${score.value}) on Citation Velocity — global rank #${rank} of all SourceScore sources.`,
      inDefinedTermSet: "https://sourcescore.org/methodology/citation-velocity/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `${s.name} — Citation Velocity detail`,
              description: `Machine-readable JSON record of ${s.name}'s Citation Velocity score: ${score.grade} (${score.value}/100), global rank #${rank}. ${score.rationale}`,
              url: `https://sourcescore.org/velocity/${slug}/`,
              apiUrl: `https://sourcescore.org/api/velocity/${slug}.json`,
              identifier: `velocity-${slug}`,
              keywords: [
                "Citation Velocity",
                "AI citation",
                "SourceScore",
                s.name,
                s.domain,
                s.category,
              ],
              dateModified: s.verified,
              isPartOf: {
                name: "SourceScore Citation Velocity rankings",
                url: "https://sourcescore.org/velocity/",
              },
              about: {
                name: s.name,
                url: `https://${s.domain}`,
                type: "Organization",
              },
            })
          ),
        }}
      />
      <SourceDimensionDetail source={s} dim="velocity" />
    </>
  );
}
