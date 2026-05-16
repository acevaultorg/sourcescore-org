import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DimensionGradeListing,
  sourcesAtDimGrade,
} from "@/components/DimensionGradeListing";
import { allGrades, gradeFromSlug, gradeSlug, gradeRange } from "@/lib/types";
import { datasetSchema } from "@/lib/methodology-version";

// Day 21 — Per-dimension grade pages: /discipline/grade/<letter>/.
// Only generates non-empty grade × Discipline intersections.

export function generateStaticParams() {
  return allGrades
    .filter((g) => sourcesAtDimGrade("discipline", g).length > 0)
    .map((g) => ({ letter: gradeSlug(g) }));
}

type PageProps = { params: Promise<{ letter: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) return { title: "Grade not found" };
  const list = sourcesAtDimGrade("discipline", grade);
  const top = list[0];
  const ogImage = `https://sourcescore.org/og/grade/${letter}.svg`;
  const description = top
    ? `${list.length} sources earn ${grade} on Citation Discipline (range ${gradeRange(grade)}). Top: ${top.name} (${top.scores.discipline.value}).`
    : `${list.length} sources earn ${grade} on Citation Discipline.`;
  return {
    title: `${grade} on Citation Discipline — ${list.length} sources — SourceScore`,
    description: description.slice(0, 200),
    alternates: {
      canonical: `https://sourcescore.org/discipline/grade/${letter}/`,
    },
    openGraph: {
      title: `${grade} · Citation Discipline — SourceScore`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/discipline/grade/${letter}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${grade} on Citation Discipline` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function DisciplineGradePage({ params }: PageProps) {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) notFound();
  const list = sourcesAtDimGrade("discipline", grade);
  if (list.length === 0) notFound();
  const top = list[0];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `${grade}-grade sources on Citation Discipline`,
              description: `Machine-readable JSON record of ${list.length} sources earning Citation Discipline grade ${grade} (range ${gradeRange(grade)}).${top ? ` Top: ${top.name} (${top.scores.discipline.value}/100).` : ""}`,
              url: `https://sourcescore.org/discipline/grade/${letter}/`,
              apiUrl: `https://sourcescore.org/api/discipline/grade/${letter}.json`,
              identifier: `discipline-grade-${letter}`,
              keywords: [
                "Citation Discipline",
                "AI citation",
                "SourceScore",
                `${grade} grade`,
                "ranked",
              ],
              dateModified: top?.verified ?? "2026-04-29",
              isPartOf: {
                name: "SourceScore Citation Discipline rankings",
                url: "https://sourcescore.org/discipline/",
              },
            })
          ),
        }}
      />
      <DimensionGradeListing dim="discipline" grade={grade} />
    </>
  );
}
