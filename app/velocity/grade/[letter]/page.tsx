import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DimensionGradeListing,
  sourcesAtDimGrade,
} from "@/components/DimensionGradeListing";
import { allGrades, gradeFromSlug, gradeSlug, gradeRange } from "@/lib/types";

// Day 21 — Per-dimension grade pages: /velocity/grade/<letter>/.
// Only generates non-empty grade × Velocity intersections.

export function generateStaticParams() {
  return allGrades
    .filter((g) => sourcesAtDimGrade("velocity", g).length > 0)
    .map((g) => ({ letter: gradeSlug(g) }));
}

type PageProps = { params: Promise<{ letter: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) return { title: "Grade not found" };
  const list = sourcesAtDimGrade("velocity", grade);
  const top = list[0];
  const ogImage = `https://sourcescore.org/og/grade/${letter}.svg`;
  const description = top
    ? `${list.length} sources earn ${grade} on Citation Velocity (range ${gradeRange(grade)}). Top: ${top.name} (${top.scores.velocity.value}).`
    : `${list.length} sources earn ${grade} on Citation Velocity.`;
  return {
    title: `${grade} on Citation Velocity — ${list.length} sources — SourceScore`,
    description: description.slice(0, 200),
    alternates: {
      canonical: `https://sourcescore.org/velocity/grade/${letter}/`,
    },
    openGraph: {
      title: `${grade} · Citation Velocity — SourceScore`,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/velocity/grade/${letter}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${grade} on Citation Velocity` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function VelocityGradePage({ params }: PageProps) {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) notFound();
  if (sourcesAtDimGrade("velocity", grade).length === 0) notFound();
  return <DimensionGradeListing dim="velocity" grade={grade} />;
}
