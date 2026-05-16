import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sources, getSource } from "@/data/sources";
import {
  comparisons,
  comparisonSlug,
  pairFromSlug,
  getComparison,
} from "@/data/comparisons";
import { ScoreBadge } from "@/components/ScoreBadge";
import { gradeColorClass, type Source } from "@/lib/types";
import { breadcrumbListSchema, datasetSchema } from "@/lib/methodology-version";

// Day 18 — Sub-score-faceted comparators.
// Layer 5 archetype stack:
//   - comparison_vs_competitor_page × +60
//   - programmatic_unique_data_page × +55
//   - ai_visibility_optimized_page × +70
//   - internal_linking_hub_spoke × +15
//   - schema_markup_article_person_org × +20
//   - sitemap_addition × +12
// Each page targets a focused, extraction-ready claim:
//   "X has higher Citation Discipline than Y by N points"
//
// 75 comparators × 3 dimensions = 225 new pages, each with a JSON twin.

type DimensionKey = "discipline" | "modern-reference" | "velocity";

type DimensionMeta = {
  key: "discipline" | "modernReference" | "velocity";
  pathSegment: DimensionKey;
  label: string;
  short: string;
  description: string;
  weight: string;
  methodologyHref: string;
  rankingHref: string;
};

const DIMS: Record<DimensionKey, DimensionMeta> = {
  discipline: {
    key: "discipline",
    pathSegment: "discipline",
    label: "Citation Discipline",
    short: "Discipline",
    description:
      "How rigorously each source backs its factual claims with verifiable evidence.",
    weight: "35%",
    methodologyHref: "/methodology/citation-discipline/",
    rankingHref: "/discipline/",
  },
  "modern-reference": {
    key: "modernReference",
    pathSegment: "modern-reference",
    label: "Modern Citation Reference",
    short: "Modern Reference",
    description:
      "How fit each source is for citation in modern (LLM-era) writing — machine-readability, schema, freshness signals, AI-corpus presence.",
    weight: "30%",
    methodologyHref: "/methodology/modern-reference/",
    rankingHref: "/modern-reference/",
  },
  velocity: {
    key: "velocity",
    pathSegment: "velocity",
    label: "Citation Velocity",
    short: "Velocity",
    description:
      "How often tier-1 publications and AI engines cite each source per week — the most volatile sub-score.",
    weight: "35%",
    methodologyHref: "/methodology/citation-velocity/",
    rankingHref: "/velocity/",
  },
};

const DIM_KEYS: DimensionKey[] = ["discipline", "modern-reference", "velocity"];

/** Global rank within a dimension (1 = highest score) */
function dimensionRank(slug: string, key: DimensionMeta["key"]): number {
  const sorted = [...sources].sort(
    (a, b) => b.scores[key].value - a.scores[key].value
  );
  return sorted.findIndex((x) => x.slug === slug) + 1;
}

export function generateStaticParams() {
  const params: Array<{ slug: string; dimension: string }> = [];
  for (const c of comparisons) {
    const slug = comparisonSlug(c.a, c.b);
    for (const d of DIM_KEYS) {
      params.push({ slug, dimension: d });
    }
  }
  return params;
}

type PageProps = {
  params: Promise<{ slug: string; dimension: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, dimension } = await params;
  if (!DIM_KEYS.includes(dimension as DimensionKey)) {
    return { title: "Comparison not found" };
  }
  const comp = getComparison(slug);
  const pair = pairFromSlug(slug);
  if (!comp || !pair) return { title: "Comparison not found" };
  const a = getSource(pair.a)!;
  const b = getSource(pair.b)!;
  const dim = DIMS[dimension as DimensionKey];

  const aScore = a.scores[dim.key];
  const bScore = b.scores[dim.key];
  const winner = aScore.value > bScore.value ? a : bScore.value > aScore.value ? b : null;
  const loser = winner ? (winner.slug === a.slug ? b : a) : null;
  const delta = Math.abs(aScore.value - bScore.value);

  const title = `${a.name} vs ${b.name} — ${dim.label} compared — SourceScore`;
  const description = winner
    ? `${winner.name} (${winner.scores[dim.key].grade} ${winner.scores[dim.key].value}) outscores ${loser!.name} (${loser!.scores[dim.key].grade} ${loser!.scores[dim.key].value}) on ${dim.label} by ${delta} points.`
    : `${a.name} and ${b.name} tie on ${dim.label} (both ${aScore.grade} ${aScore.value}).`;
  const ogImage = `https://sourcescore.org/og/compare/${slug}.svg`;

  return {
    title,
    description: description.slice(0, 200),
    alternates: {
      canonical: `https://sourcescore.org/compare/${slug}/${dimension}/`,
    },
    openGraph: {
      title,
      description: description.slice(0, 200),
      url: `https://sourcescore.org/compare/${slug}/${dimension}/`,
      type: "article",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: `${a.name} vs ${b.name} — ${dim.short}` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 200),
      images: [ogImage],
    },
  };
}

export default async function CompareDimensionPage({ params }: PageProps) {
  const { slug, dimension } = await params;
  if (!DIM_KEYS.includes(dimension as DimensionKey)) notFound();
  const comp = getComparison(slug);
  const pair = pairFromSlug(slug);
  if (!comp || !pair) notFound();
  const a = getSource(pair.a)!;
  const b = getSource(pair.b)!;
  const dim = DIMS[dimension as DimensionKey];

  const aScore = a.scores[dim.key];
  const bScore = b.scores[dim.key];
  const aRank = dimensionRank(a.slug, dim.key);
  const bRank = dimensionRank(b.slug, dim.key);
  const total = sources.length;
  const delta = Math.abs(aScore.value - bScore.value);
  const winner: "a" | "b" | "tie" =
    aScore.value > bScore.value ? "a" : bScore.value > aScore.value ? "b" : "tie";
  const winnerSource = winner === "a" ? a : winner === "b" ? b : null;
  const loserSource = winner === "a" ? b : winner === "b" ? a : null;

  // Composite Index winner for context
  const indexWinner: "a" | "b" | "tie" =
    a.scores.index.value > b.scores.index.value
      ? "a"
      : b.scores.index.value > a.scores.index.value
        ? "b"
        : "tie";

  // Other 2 dimensions for cross-link chips
  const otherDims = DIM_KEYS.filter((d) => d !== dimension);

  // JSON-LD Article schema with extraction-ready claim
  const headline = winnerSource
    ? `${winnerSource.name} outscores ${loserSource!.name} on ${dim.label} by ${delta} points`
    : `${a.name} and ${b.name} tie on ${dim.label}`;
  const claim = winnerSource
    ? `${winnerSource.name} (${winnerSource.scores[dim.key].grade} · ${winnerSource.scores[dim.key].value}) scores higher on ${dim.label} than ${loserSource!.name} (${loserSource!.scores[dim.key].grade} · ${loserSource!.scores[dim.key].value}). The gap is ${delta} points on the 0–100 SourceScore scale.`
    : `${a.name} and ${b.name} both score ${aScore.grade} · ${aScore.value} on ${dim.label}, a tie on the 0–100 SourceScore scale.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: claim,
    datePublished: a.verified,
    dateModified: a.verified,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: {
      "@type": "Organization",
      name: "SourceScore",
      url: "https://sourcescore.org",
    },
    mainEntityOfPage: `https://sourcescore.org/compare/${slug}/${dimension}/`,
    about: [
      { "@type": "Organization", name: a.name, url: `https://${a.domain}` },
      { "@type": "Organization", name: b.name, url: `https://${b.domain}` },
    ],
    mainEntity: {
      "@type": "DefinedTerm",
      name: `${dim.label} (${a.name} vs ${b.name})`,
      description: claim,
      inDefinedTermSet: `https://sourcescore.org${dim.methodologyHref}`,
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Compare", url: "https://sourcescore.org/compare/" },
              { name: `${a.name} vs ${b.name}`, url: `https://sourcescore.org/compare/${slug}/` },
              { name: dim.short, url: `https://sourcescore.org/compare/${slug}/${dimension}/` },
            ])
          ),
        }}
      />
      {/* Dataset schema — per-pair-per-dimension JSON twin is the canonical
          machine-readable record for this specific claim. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `${a.name} vs ${b.name} — ${dim.label} comparison`,
              description: claim,
              url: `https://sourcescore.org/compare/${slug}/${dimension}/`,
              apiUrl: `https://sourcescore.org/api/compare/${slug}/${dimension}.json`,
              identifier: `${slug}--${dimension}`,
              keywords: [
                "source comparison",
                "AI citation",
                "SourceScore",
                dim.label,
                a.name,
                b.name,
              ],
              dateModified: a.verified,
              isPartOf: {
                name: `${a.name} vs ${b.name} comparison`,
                url: `https://sourcescore.org/compare/${slug}/`,
              },
            })
          ),
        }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2 flex-wrap">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/compare/" className="hover:text-text">Compare</a>
        <span aria-hidden="true">/</span>
        <a href={`/compare/${slug}/`} className="hover:text-text">{a.name} vs {b.name}</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{dim.short}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        {dim.short.toUpperCase()} · {dim.weight} of composite
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-3">
        {a.name} <span className="text-dim font-normal">vs</span> {b.name}{" "}
        <span className="text-dim font-normal">—</span> {dim.short}
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-3xl mb-8">
        {dim.description}
      </p>

      {/* WINNER CALLOUT — quote-ready ────────────────────── */}
      <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
        <div className="text-eyebrow text-brand mb-2">Verdict</div>
        {winner === "tie" ? (
          <p className="text-heading-2 font-bold text-text leading-snug">
            {a.name} and {b.name} tie on {dim.label} ({aScore.grade} · {aScore.value}).
          </p>
        ) : (
          <p className="text-heading-2 font-bold text-text leading-snug">
            <span className="text-brand">{winnerSource!.name}</span> outscores{" "}
            {loserSource!.name} on {dim.label} by{" "}
            <span className="text-brand">{delta} points</span>{" "}
            <span className="text-muted font-normal">
              ({winnerSource!.scores[dim.key].grade} · {winnerSource!.scores[dim.key].value} vs{" "}
              {loserSource!.scores[dim.key].grade} · {loserSource!.scores[dim.key].value}).
            </span>
          </p>
        )}
      </section>

      {/* SIDE-BY-SIDE CARDS ────────────────────────────────── */}
      <section className="mb-12 grid sm:grid-cols-2 gap-3">
        <SourceDimensionCard
          source={a}
          dim={dim}
          rank={aRank}
          total={total}
          highlight={winner === "a"}
        />
        <SourceDimensionCard
          source={b}
          dim={dim}
          rank={bRank}
          total={total}
          highlight={winner === "b"}
        />
      </section>

      {/* RANK COMPARISON ─────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-heading-1 font-bold tracking-tight mb-5">
          Global rank · {dim.short}
        </h2>
        <div className="overflow-x-auto rounded-card border border-border bg-panel">
          <table className="min-w-full text-body-sm">
            <thead className="text-caption uppercase tracking-wider text-dim border-b border-border-bright">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Source</th>
                <th className="text-right font-semibold px-4 py-3">Score</th>
                <th className="text-right font-semibold px-4 py-3">Grade</th>
                <th className="text-right font-semibold px-4 py-3">Rank</th>
                <th className="text-right font-semibold px-4 py-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[a, b].map((s) => {
                const ssc = s.scores[dim.key];
                const r = dimensionRank(s.slug, dim.key);
                const isWinner =
                  (winner === "a" && s.slug === a.slug) ||
                  (winner === "b" && s.slug === b.slug);
                return (
                  <tr
                    key={s.slug}
                    className={`transition-colors ${isWinner ? "bg-surface-brand" : "hover:bg-surface-hover"}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-text">{s.name}</div>
                      <div className="text-caption text-dim font-mono">{s.domain}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold ${gradeColorClass(ssc.grade)}`}>
                        {ssc.value}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ScoreBadge value={ssc.value} grade={ssc.grade} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right text-text font-mono">
                      #{r}{" "}
                      <span className="text-dim">/ {total}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`${dim.rankingHref.replace(/\/$/, "")}/${s.slug}/`}
                        className="text-brand hover:underline text-body-sm"
                      >
                        view →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* RATIONALE PER SOURCE ─────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-heading-1 font-bold tracking-tight mb-5">
          Why these {dim.short} scores
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <RationaleCard source={a} score={aScore} dim={dim} highlight={winner === "a"} />
          <RationaleCard source={b} score={bScore} dim={dim} highlight={winner === "b"} />
        </div>
      </section>

      {/* SIGNALS — what drives each score ─────────────────── */}
      {(aScore.signals.length > 0 || bScore.signals.length > 0) && (
        <section className="mb-12">
          <h2 className="text-heading-1 font-bold tracking-tight mb-5">
            Signals behind the {dim.short} score
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <SignalsList source={a} score={aScore} />
            <SignalsList source={b} score={bScore} />
          </div>
        </section>
      )}

      {/* OTHER DIMENSIONS FOR THIS PAIR ────────────────────── */}
      <section className="mb-12 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Other dimensions for {a.name} vs {b.name}
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {/* Composite */}
          <a
            href={`/compare/${slug}/`}
            className="block p-4 rounded-card border border-brand/40 bg-surface-brand hover:bg-brand/15 transition-colors"
          >
            <div className="text-eyebrow text-brand mb-1">SourceScore Index</div>
            <div className="text-body-sm text-muted leading-snug">
              Composite head-to-head{" "}
              {indexWinner === "tie" ? (
                <span className="text-text">— tie</span>
              ) : (
                <>
                  — <span className="text-text font-semibold">
                    {indexWinner === "a" ? a.name : b.name}
                  </span>{" "}
                  leads
                </>
              )}
            </div>
          </a>
          {otherDims.map((d) => {
            const om = DIMS[d];
            const av = a.scores[om.key].value;
            const bv = b.scores[om.key].value;
            const oWinner = av > bv ? a : bv > av ? b : null;
            const oDelta = Math.abs(av - bv);
            return (
              <a
                key={d}
                href={`/compare/${slug}/${d}/`}
                className="block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
              >
                <div className="text-eyebrow text-brand mb-1">{om.short}</div>
                <div className="text-body-sm text-muted leading-snug">
                  {oWinner ? (
                    <>
                      <span className="text-text font-semibold">{oWinner.name}</span>{" "}
                      +{oDelta} pts
                    </>
                  ) : (
                    <span className="text-text">tie ({av})</span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* OTHER COMPARISONS ON THIS DIMENSION ─────────────── */}
      <section className="border-t border-border pt-8 mb-8">
        <h2 className="text-heading-2 font-bold mb-3">
          Other {dim.short} comparisons
        </h2>
        <div className="flex flex-wrap gap-2">
          {comparisons
            .filter((c) => comparisonSlug(c.a, c.b) !== slug)
            .slice(0, 12)
            .map((c) => {
              const otherSlug = comparisonSlug(c.a, c.b);
              const sa = getSource(c.a)!;
              const sb = getSource(c.b)!;
              return (
                <a
                  key={otherSlug}
                  href={`/compare/${otherSlug}/${dimension}/`}
                  className="px-3 py-1.5 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm text-muted hover:text-text transition-colors"
                >
                  {sa.name} vs {sb.name}
                </a>
              );
            })}
        </div>
      </section>

      {/* Bottom nav */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={`/compare/${slug}/`} className="text-muted hover:text-brand">
          ← Full {a.name} vs {b.name} breakdown
        </a>
        <span className="text-dim">·</span>
        <a href={dim.rankingHref} className="text-muted hover:text-brand">
          All sources ranked by {dim.short} →
        </a>
        <span className="text-dim">·</span>
        <a href={dim.methodologyHref} className="text-muted hover:text-brand">
          {dim.short} methodology →
        </a>
      </nav>
    </article>
  );
}

function SourceDimensionCard({
  source,
  dim,
  rank,
  total,
  highlight,
}: {
  source: Source;
  dim: DimensionMeta;
  rank: number;
  total: number;
  highlight: boolean;
}) {
  const score = source.scores[dim.key];
  return (
    <a
      href={`${dim.rankingHref.replace(/\/$/, "")}/${source.slug}/`}
      className={`block p-5 rounded-card-lg border transition-all hover:bg-panel-hi ${
        highlight
          ? "border-brand/50 bg-surface-brand shadow-brand-glow"
          : "border-border bg-panel"
      }`}
    >
      {highlight && (
        <div className="text-eyebrow text-brand mb-2">Higher {dim.short}</div>
      )}
      <div className="text-body-sm text-dim font-mono mb-1">{source.category}</div>
      <h3 className="text-heading-2 font-bold mb-2">{source.name}</h3>
      <div className="text-caption text-dim font-mono mb-3">{source.domain}</div>
      <div className="mb-3">
        <ScoreBadge value={score.value} grade={score.grade} label={dim.short} size="lg" />
      </div>
      <div className="text-caption text-muted mb-3 font-mono">
        Rank #{rank} of {total} on {dim.short}
      </div>
      <p className="text-body-sm text-muted leading-snug line-clamp-3">
        {score.rationale}
      </p>
    </a>
  );
}

function RationaleCard({
  source,
  score,
  dim,
  highlight,
}: {
  source: Source;
  score: Source["scores"]["index"];
  dim: DimensionMeta;
  highlight: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-card border ${
        highlight
          ? "border-brand/40 bg-surface-brand"
          : "border-border bg-panel"
      }`}
    >
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <span className="font-semibold text-text">{source.name}</span>
        <ScoreBadge value={score.value} grade={score.grade} size="sm" />
      </div>
      <div className="text-caption text-dim font-mono mb-2">
        {dim.short} · {score.value}/100
      </div>
      <p className="text-body-sm text-muted leading-snug">{score.rationale}</p>
    </div>
  );
}

function SignalsList({
  source,
  score,
}: {
  source: Source;
  score: Source["scores"]["index"];
}) {
  return (
    <div>
      <div className="text-eyebrow text-brand mb-3">{source.name}</div>
      {score.signals.length === 0 ? (
        <div className="text-body-sm text-dim italic">
          No structured signals recorded.
        </div>
      ) : (
        <ul className="space-y-2">
          {score.signals.map((sig, i) => (
            <li
              key={i}
              className="p-3 rounded-card border border-border bg-panel"
            >
              <div className="font-semibold text-text mb-1 text-body-sm">{sig.label}</div>
              <div className="text-caption text-muted leading-snug">{sig.detail}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
