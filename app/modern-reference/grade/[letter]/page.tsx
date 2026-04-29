import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DimensionGradeListing,
  sourcesAtDimGrade,
} from "@/components/DimensionGradeListing";
import { allGrades, gradeFromSlug, gradeSlug, gradeRange } from "@/lib/types";

// Day 21 — Per-dimension grade pages: /modern-reference/grade/<letter>/.
// Only generates non-empty grade × Modern Reference intersections.

export function generateStaticParams() {
  return allGrades
    .filter((g) => sourcesAtDimGrade("modernReference", g).length > 0)
    .map((g) => ({ letter: gradeSlug(g) }));
}

type PageProps = { params: Promise<{ letter: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) return { title: "Grade not found" };
  const list = sourcesAtDimGrade("modernReference", grade);
  const top = list[0];
  const ogImage = `https://sourcescore.org/og/grade/${letter}.svg`;
  const description = top
    ? `${list.length} sources earn ${grade} on Modern Reference (range ${gradeRange(grade)}). Top: ${top.name} (${top.scores.modernReference.value}).`
    : `${list.length} sources earn ${grade} on Modern Reference.`;
  return {
    title: `${grade} on Modern Reference — ${list.length} sources — SourceScore`,
    description: description.slice(0, 200),
    alternates: {
      canonical: `https://sourcescore.org/modern-reference/grade/${letter}/`,
    },
    openGraph: {
      title: `${grade} · Modern Reference — SourceScore`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/modern-reference/grade/${letter}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${grade} on Modern Reference` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function ModernReferenceGradePage({ params }: PageProps) {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) notFound();
  if (sourcesAtDimGrade("modernReference", grade).length === 0) notFound();
  return <DimensionGradeListing dim="modernReference" grade={grade} />;
}
