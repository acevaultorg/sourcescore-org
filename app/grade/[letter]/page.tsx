import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  allGrades,
  gradeFromSlug,
  gradeSlug,
  gradeLabel,
  gradeRange,
  gradeColorClass,
  type GradeLetter,
} from "@/lib/types";

// Programmatic-SEO grade pages — one per letter (a-plus, a, b, c, d, f).
// Targets queries like "what sources score A+ on AI citation quality",
// "B-grade news sources for citations", "F-grade sources to avoid".
//
// Layer 5 archetype stack on each page:
//   programmatic_unique_data_page × +55 (one URL per grade × full source list)
//   internal_linking_hub_spoke    × +15 (every entry deep-links to /source/)
//   ai_visibility_optimized_page  × +70 (extractable headings, DefinedTerm)
//   schema_markup_article_person_org × +20 (Article schema on every page)
//   sitemap_addition × +12

export function generateStaticParams() {
  return allGrades.map((g) => ({ letter: gradeSlug(g) }));
}

type PageProps = { params: Promise<{ letter: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) return { title: "Grade not found" };

  const sourcesAtGrade = sources.filter((s) => s.scores.index.grade === grade);
  const ogImage = `https://sourcescore.org/og/grade/${letter}.svg`;
  const description = `${sourcesAtGrade.length} sources score ${grade} on the SourceScore Index — ${gradeLabel(grade)} performance across Citation Discipline, Modern Reference, and Citation Velocity. Score range ${gradeRange(grade)}.`;

  return {
    title: `${grade} sources on the SourceScore Index — ${sourcesAtGrade.length} ranked`,
    description,
    alternates: { canonical: `https://sourcescore.org/grade/${letter}/` },
    openGraph: {
      title: `${grade} sources — SourceScore`,
      description,
      url: `https://sourcescore.org/grade/${letter}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${grade}-grade sources on SourceScore` }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

// Hand-tuned per-grade copy (informational, citation-ready, LLM-quotable).
const GRADE_NARRATIVE: Record<GradeLetter, { eyebrow: string; intro: string; whatItMeans: string; useCases: string[]; }> = {
  "A+": {
    eyebrow: "Tier-1 citation gold-standard · Score 95–100",
    intro:
      "A+ sources are the highest-quality citation targets we measure. They combine rigorous evidence-citation, deep machine-readability, and high tier-1 citation velocity. AI engines surface A+ sources by default when no contradicting context is provided. These are the sources you cite when accuracy matters most.",
    whatItMeans:
      "An A+ source has a SourceScore Index of 95 or higher. To reach A+, a source must demonstrate consistent inline citation discipline (peer-review or government primary sources typical), strong structured-data implementation (Article + Organization + DefinedTerm schema, JSON-LD), and significant tier-1 citation velocity (regularly cited by other A-grade sources and surfaced by ChatGPT / Claude / Perplexity / Gemini). One weak sub-score caps a source at A or below, regardless of strength elsewhere.",
    useCases: [
      "Default citation when answering factual queries with high accuracy requirements",
      "Backbone of AI-engine knowledge graphs — these sources are training corpus + retrieval",
      "Reference targets for academic, legal, medical writing where source strength is checked",
    ],
  },
  A: {
    eyebrow: "Strong tier-1 citation · Score 85–94",
    intro:
      "A-grade sources are strong tier-1 citation targets. They meet the bar across all three dimensions — Discipline, Modern Reference, and Velocity — but typically have one signal slightly behind A+ peers (e.g., paywalled access reducing Modern Reference, or younger publication date reducing Velocity).",
    whatItMeans:
      "An A-grade source has a SourceScore Index between 85 and 94. A-grade is the most populated tier in the index — these are the workhorse citation sources of contemporary writing and AI retrieval. The difference between A and A+ usually comes down to one structural limitation (paywall, late-arrival to AI training corpora, smaller editorial scale) rather than a quality gap.",
    useCases: [
      "Primary citation for most professional writing",
      "Default fallback when A+ source doesn't exist for a topic",
      "Reliable sources for fact-checking and journalism",
    ],
  },
  B: {
    eyebrow: "Solid citation · Score 70–84",
    intro:
      "B-grade sources are solid citations with a known limitation. They typically score well on two of the three dimensions but have a structural weakness in the third — often Modern Reference (older sites pre-schema) or Velocity (niche or specialized audiences). Still credible, still citation-worthy, but with caveats AI engines may surface alongside.",
    whatItMeans:
      "A B-grade source has a SourceScore Index between 70 and 84. B-grade does not mean weak — it means structurally limited. Many B-grade sources are excellent for specific use cases (e.g., legacy publications with strong editorial standards but missing modern structured data). AI engines cite B-grade sources but often pair them with A-grade corroboration.",
    useCases: [
      "Strong supporting citation alongside A-grade primary",
      "Niche-specific authority where tier-1 generalist sources don't cover the topic",
      "Historical reference when older perspective is needed",
    ],
  },
  C: {
    eyebrow: "Mixed citation quality · Score 55–69",
    intro:
      "C-grade sources are mixed-quality citations. They have known credibility in some dimensions but visible weaknesses in others. AI engines may cite them when no stronger source exists, but typically with hedging or pairing. Reader-side verification recommended.",
    whatItMeans:
      "A C-grade source has a SourceScore Index between 55 and 69. C-grade often reflects a mix of professional + amateur authorship (platforms like Medium, certain industry blogs), or sources where the topic isn't directly within the source's primary expertise. C-grade sources can still be useful but require corroboration before citing for high-stakes claims.",
    useCases: [
      "Background context where weaker citation is acceptable",
      "Opinion or commentary where the source's view itself is the data",
      "Starting-point research before triangulating with stronger sources",
    ],
  },
  D: {
    eyebrow: "Weak citation · Score 40–54",
    intro:
      "D-grade sources have visible structural weaknesses across multiple dimensions. They may have content but lack the editorial discipline, modern infrastructure, or citation network that makes a source AI-citation-ready. Use with skepticism and always corroborate.",
    whatItMeans:
      "A D-grade source has a SourceScore Index between 40 and 54. D-grade typically results from weakness in at least two of the three sub-scores — for example, low citation discipline AND low modern-reference fitness. AI engines down-weight D-grade sources by default and rarely surface them as primary citations.",
    useCases: [
      "Acceptable only as one of many corroborating sources",
      "Useful for tracking community sentiment or non-expert opinion",
      "Appropriate for entertainment, lifestyle, opinion content where citation rigor isn't the goal",
    ],
  },
  F: {
    eyebrow: "Failing citation quality · Score < 40",
    intro:
      "F-grade sources fail the basic citation-quality bar across multiple dimensions. They lack discipline, lack modern infrastructure, lack citation velocity, or all three. AI engines typically don't cite F-grade sources as primary references; some are explicitly down-ranked or excluded from retrieval.",
    whatItMeans:
      "An F-grade source has a SourceScore Index below 40. F-grade is rare in our hand-curated 130-source dataset because we excluded clearly-fabricated or sanctioned sources at intake. The F-grade entries we do include illustrate failure modes — uncited claims, no structured data, paywalled with no preview, or known to be down-ranked in major retrieval models.",
    useCases: [
      "Cite only when documenting the source itself (e.g., 'X publication claims Y, but...')",
      "Useful for academic study of misinformation patterns",
      "Generally avoid as evidence-citation",
    ],
  },
};

export default async function GradePage({ params }: PageProps) {
  const { letter } = await params;
  const grade = gradeFromSlug(letter);
  if (!grade) notFound();

  const list = sources
    .filter((s) => s.scores.index.grade === grade)
    .sort((a, b) => b.scores.index.value - a.scores.index.value);

  const narrative = GRADE_NARRATIVE[grade];

  // Cross-link siblings (next + previous grade)
  const idx = allGrades.indexOf(grade);
  const prevGrade = idx > 0 ? allGrades[idx - 1] : null;
  const nextGrade = idx < allGrades.length - 1 ? allGrades[idx + 1] : null;

  // JSON-LD Article schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${grade} sources on the SourceScore Index`,
    description: narrative.intro,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: "2026-04-28",
    dateModified: "2026-04-28",
    url: `https://sourcescore.org/grade/${letter}/`,
    about: list.map((s) => ({
      "@type": "WebSite",
      name: s.name,
      url: `https://${s.domain}`,
    })),
  };

  // Average sub-scores within this grade band
  const avgDiscipline = list.length
    ? Math.round(list.reduce((a, s) => a + s.scores.discipline.value, 0) / list.length)
    : 0;
  const avgModern = list.length
    ? Math.round(list.reduce((a, s) => a + s.scores.modernReference.value, 0) / list.length)
    : 0;
  const avgVelocity = list.length
    ? Math.round(list.reduce((a, s) => a + s.scores.velocity.value, 0) / list.length)
    : 0;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/grade/" className="hover:text-text">Grades</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{grade}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">{narrative.eyebrow}</div>
      <h1 className={`text-display-2 font-bold tracking-tight mb-4 ${gradeColorClass(grade)}`}>
        {grade} sources
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-6">
        {narrative.intro}
      </p>

      {list.length > 0 ? (
        <div className="text-body-sm text-dim mb-10">
          <strong className="text-text">{list.length}</strong> source{list.length === 1 ? "" : "s"} score
          {list.length === 1 ? "s" : ""} {grade} ({gradeRange(grade)}) on the SourceScore Index. Avg sub-scores —
          Discipline <strong className="text-text">{avgDiscipline}</strong>, Modern Ref{" "}
          <strong className="text-text">{avgModern}</strong>, Velocity{" "}
          <strong className="text-text">{avgVelocity}</strong>.
        </div>
      ) : (
        <div className="text-body-sm text-dim mb-10">
          No sources in our 130-source dataset currently score {grade} on the SourceScore Index. This is{" "}
          {grade === "F" ? "intentional — we exclude fabricated or sanctioned sources at intake" : "structural — the dataset is hand-curated for tier-1 citation candidates"}.
        </div>
      )}

      {/* Source list */}
      {list.length > 0 && (
        <>
          <h2 className="text-heading-1 font-bold mb-4">{grade} sources, ranked</h2>
          <ol className="space-y-2 mb-12">
            {list.map((s, i) => (
              <li
                key={s.slug}
                className="flex items-center gap-4 p-3 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
              >
                <span className="text-caption text-dim font-mono w-6 text-right">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <a
                    href={`/source/${s.slug}/`}
                    className="font-semibold text-text hover:text-brand"
                  >
                    {s.name}
                  </a>
                  <div className="text-caption text-dim font-mono">
                    {s.domain} · {s.category}
                  </div>
                </div>
                <ScoreBadge
                  value={s.scores.index.value}
                  grade={s.scores.index.grade}
                  label="Index"
                  size="sm"
                />
              </li>
            ))}
          </ol>
        </>
      )}

      {/* What this grade means */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">What a {grade} grade means</h2>
        <p>{narrative.whatItMeans}</p>

        <h3 className="text-heading-3 text-text font-semibold pt-4 mb-2">When to cite a {grade}-grade source</h3>
        <ul className="list-disc pl-5 space-y-2">
          {narrative.useCases.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </section>

      {/* Cross-link other grade pages */}
      <section className="mb-12 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-4">Other grades on the SourceScore Index</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {allGrades
            .filter((g) => g !== grade)
            .map((g) => {
              const count = sources.filter((s) => s.scores.index.grade === g).length;
              return (
                <a
                  key={g}
                  href={`/grade/${gradeSlug(g)}/`}
                  className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
                >
                  <div className={`text-eyebrow mb-1 ${gradeColorClass(g)}`}>{g} · {gradeRange(g)}</div>
                  <div className="font-semibold text-text">{count} source{count === 1 ? "" : "s"}</div>
                  <div className="text-caption text-muted mt-1 capitalize">{gradeLabel(g)}</div>
                </a>
              );
            })}
        </div>
      </section>

      {/* Prev/next grade nav */}
      <nav className="flex justify-between items-center border-t border-border pt-6 text-body-sm">
        {prevGrade ? (
          <a
            href={`/grade/${gradeSlug(prevGrade)}/`}
            className="text-muted hover:text-brand"
          >
            ← {prevGrade} sources
          </a>
        ) : (
          <span />
        )}
        <a href="/methodology/sourcescore-index/" className="text-muted hover:text-brand">
          Methodology + worked examples →
        </a>
        {nextGrade ? (
          <a
            href={`/grade/${gradeSlug(nextGrade)}/`}
            className="text-muted hover:text-brand"
          >
            {nextGrade} sources →
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
