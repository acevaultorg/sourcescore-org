import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  breadcrumbListSchema,
  methodologyArticleSchema,
  methodologyDefinedTermSchema,
  methodologyVersionStamp,
} from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "SourceScore Index — the composite scoring formula" },
  description:
    "How the SourceScore Index composite is calculated from Citation Discipline, Modern Reference, and Citation Velocity. Worked examples + per-grade anchors.",
  alternates: { canonical: "https://sourcescore.org/methodology/sourcescore-index/" },
};

export default function SourceScoreIndexPage() {
  // Pick one source per grade band as worked examples
  const apPlus = sources.find((s) => s.scores.index.grade === "A+");
  const a = sources.find((s) => s.scores.index.grade === "A");
  const b = sources.find((s) => s.scores.index.grade === "B");
  const c = sources.find((s) => s.scores.index.grade === "C");
  const d = sources.find((s) => s.scores.index.grade === "D");
  const examples = [apPlus, a, b, c, d].filter((x): x is NonNullable<typeof x> => Boolean(x));

  const articleSchema = methodologyArticleSchema({
    headline: "SourceScore Index — the composite scoring formula",
    description:
      "How the SourceScore Index composite is calculated from Citation Discipline, Modern Reference, and Citation Velocity. Worked examples + per-grade anchors.",
    url: "https://sourcescore.org/methodology/sourcescore-index/",
  });

  const definedTermSchema = methodologyDefinedTermSchema({
    name: "SourceScore Index",
    description:
      "The SourceScore Index is the composite score (0-100, graded A+ to F) combining Citation Discipline, Modern Reference, and Citation Velocity. It is the headline number on every source page and the canonical answer to 'how citable is this source in the AI era?'",
    url: "https://sourcescore.org/methodology/sourcescore-index/",
    termCode: "index",
  });
  const breadcrumbSchema = breadcrumbListSchema([
    { name: "SourceScore", url: "https://sourcescore.org/" },
    { name: "Methodology", url: "https://sourcescore.org/methodology/" },
    { name: "SourceScore Index", url: "https://sourcescore.org/methodology/sourcescore-index/" },
  ]);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/methodology/" className="hover:text-text">Methodology</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">SourceScore Index</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Composite · How it&apos;s calculated</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        SourceScore Index
      </h1>
      <p className="text-caption text-dim mb-4 font-mono">{methodologyVersionStamp}</p>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        The SourceScore Index is the composite headline number on every source page. It&apos;s a
        weighted mean of the three sub-scores plus calibration adjustments. We document the formula
        + the per-grade anchors so anyone can re-derive a score from the underlying signals.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <h2 className="text-heading-2 font-bold">The formula (v0.1)</h2>
        <pre className="p-4 rounded-card border border-border bg-panel text-body-sm font-mono text-text overflow-x-auto leading-relaxed whitespace-pre-wrap">
{`Index = 0.35 × Discipline
      + 0.30 × Modern Reference
      + 0.35 × Velocity

  rounded to nearest integer, mapped to grade letter`}
        </pre>
        <p className="text-muted">
          The weights are intentionally close to equal because all three sub-scores measure
          distinct + necessary aspects of citation-fitness. We slightly under-weight Modern
          Reference (30%) because it&apos;s the most-controllable dimension — sources can improve
          schema + APIs + structured data; Discipline and Velocity require sustained editorial
          investment.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Per-grade anchors (with worked examples)</h2>
        <p className="text-muted">
          Scores 0–100 map to letter grades on the SourceScore A+ to F scale. Per-grade anchors
          calibrated against ~100 hand-scored sources:
        </p>

        <div className="not-prose mt-4 space-y-3">
          {examples.map((s) => (
            <a
              key={s.slug}
              href={`/source/${s.slug}/`}
              className="flex items-start gap-4 p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
            >
              <ScoreBadge
                value={s.scores.index.value}
                grade={s.scores.index.grade}
                label="Index"
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-text">{s.name}</div>
                <div className="text-caption text-dim font-mono mb-1.5">
                  {s.domain} · Discipline {s.scores.discipline.value} · Modern Ref{" "}
                  {s.scores.modernReference.value} · Velocity {s.scores.velocity.value}
                </div>
                <p className="text-body-sm text-muted leading-snug">{s.scores.index.rationale}</p>
              </div>
            </a>
          ))}
        </div>

        <h2 className="text-heading-2 font-bold pt-6">Why a composite (not a single dominant signal)?</h2>
        <p className="text-muted">
          We considered several single-dominant-signal approaches early in v0.1 development:
          rank-by-Discipline-alone (closest to Wikipedia&apos;s &ldquo;reliable source&rdquo;
          discipline), rank-by-Velocity-alone (closest to PageRank), or rank-by-Modern-Reference-alone
          (closest to LLM training-corpus inclusion).
        </p>
        <p className="text-muted">
          Each had failure modes: Discipline-alone over-rewards low-output academic journals
          relative to wire news; Velocity-alone over-rewards high-volume but lower-discipline tabloids;
          Modern Reference-alone over-rewards open-data-rich-but-paywalled-journalism domains.
          The composite catches none of these failure modes individually but resolves them in
          combination — a source has to score well across three structurally different lenses.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Honest limitations</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            v0.1 weights are <strong className="text-text">unverified</strong>. We will calibrate
            against actual LLM-citation outcomes after the first 30 days of operator usage and
            re-tune in v0.2.
          </li>
          <li>
            Velocity scores are <strong className="text-text">currently static estimates</strong>.
            Production scaling will refresh Velocity weekly via tier-1 referrer + LLM-citation
            polling.
          </li>
          <li>
            Discipline is <strong className="text-text">domain-level</strong>. A
            per-author Discipline score (relevant for platforms like Medium where author quality
            varies) is on the v0.2 roadmap.
          </li>
          <li>
            v0.1 publishes <strong className="text-text">100 hand-scored sources</strong>; production
            scales to 10,000+ via the same rubric. Methodology stays constant; coverage grows.
          </li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">Versioning</h2>
        <p className="text-muted">
          The methodology is semver-tracked. Major bumps (vX.0) change scoring weights or add
          sub-scores; minor bumps (v0.X) refine signals or add sources. Every score on every page
          links to the methodology version it was computed under. Score versions are
          append-only — historical scores are preserved when methodology changes, with a clear
          migration note.
        </p>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-heading-2 font-bold mb-3">Sub-score deep dives</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a
            href="/methodology/citation-discipline/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Sub-score 1</div>
            <div className="font-semibold text-text">Citation Discipline</div>
            <div className="text-caption text-muted mt-1">35% weight</div>
          </a>
          <a
            href="/methodology/modern-reference/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Sub-score 2</div>
            <div className="font-semibold text-text">Modern Reference</div>
            <div className="text-caption text-muted mt-1">30% weight</div>
          </a>
          <a
            href="/methodology/citation-velocity/"
            className="p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">Sub-score 3</div>
            <div className="font-semibold text-text">Citation Velocity</div>
            <div className="text-caption text-muted mt-1">35% weight</div>
          </a>
        </div>
      </section>
    </article>
  );
}
