import type { Metadata } from "next";
import { sources } from "@/data/sources";
import {
  allGrades,
  gradeSlug,
  gradeLabel,
  gradeRange,
  gradeColorClass,
} from "@/lib/types";
import { breadcrumbListSchema, datasetSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "Source grading scale — A+ to F on the SourceScore Index" },
  description:
    "How sources earn an A+ vs A vs B vs C vs D vs F on the SourceScore Index. Per-grade source lists, score ranges, and what each grade means for AI citation quality.",
  alternates: { canonical: "https://sourcescore.org/grade/" },
};

export default function GradeLandingPage() {
  const counts = Object.fromEntries(
    allGrades.map((g) => [g, sources.filter((s) => s.scores.index.grade === g).length])
  );

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Grades", url: "https://sourcescore.org/grade/" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: "SourceScore grade bands (A+ → F)",
              description: `Machine-readable JSON record of ${allGrades.length} composite-Index grade bands with per-grade source counts across the SourceScore Index of ${sources.length} information sources.`,
              url: "https://sourcescore.org/grade/",
              apiUrl: "https://sourcescore.org/api/grades.json",
              identifier: "grade-index",
              keywords: ["source grading", "AI citation", "SourceScore", "A+ to F", "grade scale"],
              dateModified: "2026-04-29",
            })
          ),
        }}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Grades</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Grading scale · A+ to F</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Source grades</h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-10">
        Every source on SourceScore earns a letter grade from A+ to F based on its composite
        SourceScore Index. Grades are intentionally familiar so the meaning is obvious to a reader
        who has never visited the site before. Below: what each grade band represents, how many of
        our 130 sources score there, and the per-grade ranking pages.
      </p>

      {/* Grade-band cards */}
      <section className="space-y-3 mb-12">
        {allGrades.map((g) => (
          <a
            key={g}
            href={`/grade/${gradeSlug(g)}/`}
            className="flex items-start gap-5 p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className={`text-display-3 font-bold tracking-tight w-24 flex-shrink-0 ${gradeColorClass(g)}`}>
              {g}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-semibold text-text capitalize">{gradeLabel(g)} citation quality</span>
                <span className="text-caption text-dim font-mono">Score {gradeRange(g)}</span>
              </div>
              <div className="text-body-sm text-muted leading-snug">
                {gradeBlurb(g)}
              </div>
              <div className="text-caption text-dim mt-2">
                <strong className="text-text">{counts[g]}</strong> source
                {counts[g] === 1 ? "" : "s"} in our dataset · view ranking →
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* How grades are computed */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">How a grade is computed</h2>
        <p>
          A source's letter grade comes from its SourceScore Index, the composite weighted mean of
          three sub-scores: Citation Discipline (35%), Modern Reference (30%), and Citation Velocity
          (35%). Each sub-score is itself 0–100; the composite is rounded to the nearest integer
          and mapped to a letter on the academic-style scale at the top of this page.
        </p>
        <p>
          The grading scale is intentionally non-linear at the top — A+ requires 95+, A requires
          85+, B starts at 70. This compression at the high end matches academic grading and
          reflects the real-world distribution: most tier-1 citation candidates land in A or B; A+
          is reserved for sources strong on all three dimensions simultaneously.
        </p>

        <h2 className="text-heading-2 text-text font-bold pt-4 mb-3">Why a single composite (not three separate grades)</h2>
        <p>
          Every source has three sub-scores too — Discipline, Modern Reference, Velocity — each
          with its own grade. We surface these on every source page because they tell a different
          story than the composite. A source can be A+ on Discipline (rigorously cites sources)
          but B on Modern Reference (paywalled, not in AI training corpora) and end up A overall.
          The composite tells you the citation-quality bottom line; the sub-scores tell you why.
        </p>
        <p>
          For per-dimension rankings, see the <a href="/discipline/" className="text-brand hover:underline">Citation Discipline</a>,{" "}
          <a href="/modern-reference/" className="text-brand hover:underline">Modern Reference</a>, and{" "}
          <a href="/velocity/" className="text-brand hover:underline">Citation Velocity</a> ranking pages.
        </p>
      </section>

      {/* Cross-links */}
      <section className="border-t border-border pt-6">
        <h2 className="text-heading-2 font-bold mb-3">Related</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/methodology/sourcescore-index/"
            className="block p-5 rounded-card-lg border border-brand/40 bg-surface-brand hover:bg-brand/15 transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Composite formula + worked examples</div>
            <div className="font-semibold text-text mb-1">SourceScore Index methodology</div>
            <div className="text-body-sm text-muted">
              How the composite is calculated, with per-grade anchors + worked examples per band.
            </div>
          </a>
          <a
            href="/sources/"
            className="block p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">All 130 sources</div>
            <div className="font-semibold text-text mb-1">Full ranked source list</div>
            <div className="text-body-sm text-muted">
              Every source in the dataset, ranked by composite Index, filterable by category.
            </div>
          </a>
        </div>
      </section>
    </article>
  );
}

// Per-grade one-line blurb shown on the landing page card.
function gradeBlurb(grade: string): string {
  switch (grade) {
    case "A+":
      return "Tier-1 gold-standard sources. Rigorous evidence-citation, deep machine-readability, high tier-1 citation velocity. AI engines surface these by default.";
    case "A":
      return "Strong tier-1 sources, the workhorse of contemporary citation. Meet the bar across all three dimensions with one structural limitation typically holding them below A+.";
    case "B":
      return "Solid citations with a known weakness — usually one of the three sub-scores trailing the others. AI engines cite B-grade sources, often with corroboration.";
    case "C":
      return "Mixed-quality citations. Useful in some dimensions, weaker in others. Reader-side verification recommended before citing for high-stakes claims.";
    case "D":
      return "Visible weaknesses across multiple dimensions. AI engines down-weight by default. Acceptable only as one of many corroborating sources.";
    case "F":
      return "Failing the basic citation-quality bar. Rare in our hand-curated dataset because we exclude clearly-fabricated sources at intake. The F entries we do include illustrate failure modes.";
    default:
      return "";
  }
}
