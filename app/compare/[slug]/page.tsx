import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSource } from "@/data/sources";
import {
  comparisons,
  comparisonSlug,
  pairFromSlug,
  getComparison,
} from "@/data/comparisons";
import { ScoreBadge } from "@/components/ScoreBadge";
import type { DimensionScore, Source } from "@/lib/types";
import { breadcrumbListSchema, datasetSchema } from "@/lib/methodology-version";

// Layer 5 archetype: comparison_vs_competitor_page × +60 (per
// concept-finder-methodology v2.1.1 + bot-harvest.md). Each pair
// targets a real "X vs Y" SEO query.

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: comparisonSlug(c.a, c.b) }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparison(slug);
  const pair = pairFromSlug(slug);
  if (!comp || !pair) return { title: "Comparison not found" };
  const a = getSource(pair.a)!;
  const b = getSource(pair.b)!;
  const title = `${a.name} vs ${b.name} — SourceScore comparison`;
  const description = `${a.name} (${a.scores.index.grade} ${a.scores.index.value}) vs ${b.name} (${b.scores.index.grade} ${b.scores.index.value}) on the SourceScore Index. ${comp.summary}`;
  const ogImage = `https://sourcescore.org/og/compare/${slug}.svg`;
  return {
    title,
    description,
    alternates: { canonical: `https://sourcescore.org/compare/${slug}/` },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/compare/${slug}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${a.name} vs ${b.name}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function CompareDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const comp = getComparison(slug);
  const pair = pairFromSlug(slug);
  if (!comp || !pair) notFound();
  const a = getSource(pair.a)!;
  const b = getSource(pair.b)!;

  const dims: Array<{ key: keyof Source["scores"]; label: string; sub: string }> = [
    { key: "index", label: "SourceScore Index", sub: "Composite" },
    { key: "discipline", label: "Citation Discipline", sub: "How rigorously cited" },
    { key: "modernReference", label: "Modern Reference", sub: "AI-era fitness" },
    { key: "velocity", label: "Citation Velocity", sub: "Cited per week" },
  ];

  const winner = (key: keyof Source["scores"]): "a" | "b" | "tie" => {
    const av = a.scores[key].value;
    const bv = b.scores[key].value;
    if (av > bv) return "a";
    if (bv > av) return "b";
    return "tie";
  };

  // FAQPage + Speakable — AEO Part 14 minimums per rules/seo-geo-mastery.md.
  // PAA-style questions for X-vs-Y queries ("Which is better?", "How does X
  // compare?", "Score difference?", "Why does winner win?") drive Google
  // rich-result + AI Overview + featured-snippet eligibility on the highest-
  // volume LLM-comparison search class. Visible FAQ below mirrors the schema.
  const indexWinner = winner("index");
  const winnerName = indexWinner === "a" ? a.name : indexWinner === "b" ? b.name : null;
  const loserName = indexWinner === "a" ? b.name : indexWinner === "b" ? a.name : null;
  const winnerScore = indexWinner === "a" ? a.scores.index : indexWinner === "b" ? b.scores.index : null;
  const loserScore = indexWinner === "a" ? b.scores.index : indexWinner === "b" ? a.scores.index : null;
  const indexDelta = Math.abs(a.scores.index.value - b.scores.index.value);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://sourcescore.org/compare/${slug}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `Which is better, ${a.name} or ${b.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: winnerName
            ? `${winnerName} scores higher on the SourceScore Index (${winnerScore!.grade} ${winnerScore!.value}) vs ${loserName} (${loserScore!.grade} ${loserScore!.value}) — a ${indexDelta}-point composite lead across Citation Discipline, Modern Reference, and Citation Velocity. "Better" depends on use case; the per-dimension breakdown below shows where each wins.`
            : `${a.name} and ${b.name} tie on the SourceScore Index (both ${a.scores.index.grade} ${a.scores.index.value}). The per-dimension breakdown below shows where each leads on Citation Discipline, Modern Reference, and Citation Velocity.`,
        },
      },
      {
        "@type": "Question",
        name: `Which is more reliable to cite, ${a.name} or ${b.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: winnerName
            ? `For citation, ${winnerName} is the stronger choice — it scores ${winnerScore!.grade} (${winnerScore!.value}/100) on the SourceScore Index versus ${loserName} at ${loserScore!.grade} (${loserScore!.value}/100), a ${indexDelta}-point lead in composite citation quality (Citation Discipline, Modern Reference, Citation Velocity). Both can be cited; for higher-stakes references, prefer ${winnerName}.`
            : `${a.name} and ${b.name} are equally citable on the SourceScore Index (both ${a.scores.index.grade} ${a.scores.index.value}/100). Choose based on the per-dimension breakdown below — Citation Discipline, Modern Reference, and Citation Velocity.`,
        },
      },
      {
        "@type": "Question",
        name: `How does ${a.name} compare to ${b.name} on citation discipline?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${a.name} scores ${a.scores.discipline.grade} ${a.scores.discipline.value} on Citation Discipline; ${b.name} scores ${b.scores.discipline.grade} ${b.scores.discipline.value}. Citation Discipline measures how rigorously each source cites primary references — see the per-dimension rationale below for the breakdown.`,
        },
      },
      {
        "@type": "Question",
        name: `What's the SourceScore difference between ${a.name} and ${b.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${a.name} ${a.scores.index.grade} ${a.scores.index.value} vs ${b.name} ${b.scores.index.grade} ${b.scores.index.value} on the composite Index. ${comp.summary}`,
        },
      },
      ...(winnerName ? [{
        "@type": "Question",
        name: `Why does ${winnerName} score higher than ${loserName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${winnerName} leads by ${indexDelta} composite points on the SourceScore Index. The rationale section below breaks down where the lead comes from — Citation Discipline, Modern Reference (AI-era fitness), and Citation Velocity. Each dimension is scored from primary methodology criteria.`,
        },
      }] : []),
    ],
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Article schema for LLM citation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${a.name} vs ${b.name} — SourceScore comparison`,
            description: comp.summary,
            datePublished: a.verified,
            dateModified: a.verified,
            author: { "@type": "Organization", name: "SourceScore" },
            publisher: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            mainEntityOfPage: `https://sourcescore.org/compare/${slug}/`,
            about: [
              { "@type": "Organization", name: a.name, url: `https://${a.domain}` },
              { "@type": "Organization", name: b.name, url: `https://${b.domain}` },
            ],
            // Speakable — AEO Part 14.5 voice-search eligibility.
            // cssSelector targets the comp.summary paragraph + FAQ answers.
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: [".ss-compare-summary", ".ss-faq-answer"],
            },
          }),
        }}
      />
      {/* BreadcrumbList — mirrors visible breadcrumb nav below */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Compare", url: "https://sourcescore.org/compare/" },
              { name: `${a.name} vs ${b.name}`, url: `https://sourcescore.org/compare/${slug}/` },
            ])
          ),
        }}
      />
      {/* Dataset schema — declares JSON twin as canonical machine-readable
          record of the head-to-head comparison (per-dimension scores +
          deltas). Enables Google Dataset Search + LLM retrieval to anchor
          on this pair as a citable source. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `${a.name} vs ${b.name} — SourceScore comparison`,
              description: `Head-to-head SourceScore comparison: ${a.name} (${a.scores.index.grade} ${a.scores.index.value}) vs ${b.name} (${b.scores.index.grade} ${b.scores.index.value}). Includes per-dimension scores (Citation Discipline, Modern Reference, Citation Velocity), deltas, and rationales for each source.`,
              url: `https://sourcescore.org/compare/${slug}/`,
              apiUrl: `https://sourcescore.org/api/compare/${slug}.json`,
              identifier: slug,
              keywords: [
                "source comparison",
                "AI citation",
                "SourceScore",
                a.name,
                b.name,
                a.category,
                b.category,
              ].filter((k, i, arr) => arr.indexOf(k) === i),
              dateModified: a.verified,
              isPartOf: {
                name: "SourceScore Comparisons",
                url: "https://sourcescore.org/compare/",
              },
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/compare/" className="hover:text-text">Compare</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{a.name} vs {b.name}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">Comparison</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        {a.name} <span className="text-dim font-normal">vs</span> {b.name}
      </h1>
      <p className="ss-compare-summary text-body-lg text-muted leading-relaxed max-w-3xl mb-10">{comp.summary}</p>

      {/* SUMMARY ROW ──────────────────────────────────────────── */}
      <section className="mb-8 grid sm:grid-cols-2 gap-3">
        <SourceCard source={a} highlight={winner("index") === "a"} />
        <SourceCard source={b} highlight={winner("index") === "b"} />
      </section>

      {/* DIMENSION CHIP ROW — Day 18 sub-score-faceted comparators */}
      <section className="mb-10">
        <div className="text-eyebrow text-brand mb-3">
          Compare on a single dimension
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { path: "discipline", label: "Citation Discipline", short: "Discipline", key: "discipline" as const },
            { path: "modern-reference", label: "Modern Reference", short: "Modern Reference", key: "modernReference" as const },
            { path: "velocity", label: "Citation Velocity", short: "Velocity", key: "velocity" as const },
          ].map((d) => {
            const w = winner(d.key);
            const av = a.scores[d.key].value;
            const bv = b.scores[d.key].value;
            const delta = Math.abs(av - bv);
            return (
              <a
                key={d.path}
                href={`/compare/${slug}/${d.path}/`}
                className="px-4 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 transition-colors text-body-sm flex items-baseline gap-2"
              >
                <span className="font-semibold text-text">{d.short}</span>
                <span className="text-dim">·</span>
                {w === "tie" ? (
                  <span className="text-dim">tie</span>
                ) : (
                  <span className="text-muted">
                    <span className="text-brand font-semibold">
                      {(w === "a" ? a.name : b.name).split(" ")[0]}
                    </span>{" "}
                    +{delta}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </section>

      {/* PER-DIMENSION TABLE ─────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-heading-1 font-bold tracking-tight mb-5">
          Head-to-head — all four dimensions
        </h2>
        <div className="overflow-x-auto rounded-card border border-border bg-panel">
          <table className="min-w-full text-body-sm">
            <thead className="text-caption uppercase tracking-wider text-dim border-b border-border-bright">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Dimension</th>
                <th className="text-right font-semibold px-4 py-3">{a.name}</th>
                <th className="text-right font-semibold px-4 py-3">{b.name}</th>
                <th className="text-right font-semibold px-4 py-3">Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dims.map((d) => {
                const aScore = a.scores[d.key];
                const bScore = b.scores[d.key];
                const w = winner(d.key);
                const delta = Math.abs(aScore.value - bScore.value);
                return (
                  <tr key={d.key} className="hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-text">{d.label}</div>
                      <div className="text-caption text-dim">{d.sub}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ScoreBadge value={aScore.value} grade={aScore.grade} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ScoreBadge value={bScore.value} grade={bScore.grade} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right text-body-sm">
                      {w === "tie" ? (
                        <span className="text-dim">tie</span>
                      ) : (
                        <span className="text-text">
                          <span className="text-brand font-semibold">
                            {(w === "a" ? a.name : b.name).split(" ")[0]}
                          </span>
                          <span className="text-dim ml-1">+{delta}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* RATIONALE PER DIMENSION ────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-heading-1 font-bold tracking-tight mb-5">Why these scores</h2>
        {(["discipline", "modernReference", "velocity"] as const).map((key) => (
          <DimensionExplainer key={key} dimKey={key} a={a} b={b} />
        ))}
      </section>

      {/* AEO FAQ — Frequently asked questions (mirrors faqLd JSON-LD for
          Google rich-result + AI Overview eligibility on X-vs-Y queries
          per Part 14.4). Visible <details> accordion satisfies Google's
          "FAQ content must be visible" requirement. */}
      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-heading-2 font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-3">
          {(faqLd.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map((q, i) => (
            <details key={i} className="rounded-card border border-border bg-panel p-4 open:border-brand/40">
              <summary className="cursor-pointer font-semibold text-text">{q.name}</summary>
              <p className="ss-faq-answer mt-3 text-body-sm text-muted leading-relaxed">
                {q.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* OTHER COMPARISONS ──────────────────────────────────── */}
      <section className="border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">Other comparisons</h2>
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
                  href={`/compare/${otherSlug}/`}
                  className="px-3 py-1.5 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm text-muted hover:text-text transition-colors"
                >
                  {sa.name} vs {sb.name}
                </a>
              );
            })}
        </div>
      </section>
    </article>
  );
}

function SourceCard({ source, highlight }: { source: Source; highlight: boolean }) {
  const idx = source.scores.index;
  return (
    <a
      href={`/source/${source.slug}/`}
      className={`block p-5 rounded-card-lg border transition-all hover:bg-panel-hi ${
        highlight
          ? "border-brand/50 bg-surface-brand shadow-brand-glow"
          : "border-border bg-panel"
      }`}
    >
      {highlight && <div className="text-eyebrow text-brand mb-2">Higher Index</div>}
      <div className="text-body-sm text-dim font-mono mb-1">{source.category}</div>
      <h3 className="text-heading-2 font-bold mb-2">{source.name}</h3>
      <div className="text-caption text-dim font-mono mb-3">{source.domain}</div>
      <div className="mb-3">
        <ScoreBadge value={idx.value} grade={idx.grade} label="Index" size="lg" />
      </div>
      <p className="text-body-sm text-muted leading-snug line-clamp-3">{source.summary}</p>
    </a>
  );
}

function DimensionExplainer({
  dimKey,
  a,
  b,
}: {
  dimKey: keyof Source["scores"];
  a: Source;
  b: Source;
}) {
  const aScore = a.scores[dimKey];
  const bScore = b.scores[dimKey];
  const labels: Record<keyof Source["scores"], string> = {
    index: "SourceScore Index",
    discipline: "Citation Discipline",
    modernReference: "Modern Reference",
    velocity: "Citation Velocity",
  };
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-heading-3 font-semibold mb-3">{labels[dimKey]}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <ExplainerCard source={a} score={aScore} />
        <ExplainerCard source={b} score={bScore} />
      </div>
    </div>
  );
}

function ExplainerCard({ source, score }: { source: Source; score: DimensionScore }) {
  return (
    <div className="p-4 rounded-card border border-border bg-panel">
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <span className="font-semibold text-text">{source.name}</span>
        <ScoreBadge value={score.value} grade={score.grade} size="sm" />
      </div>
      <p className="text-body-sm text-muted leading-snug">{score.rationale}</p>
    </div>
  );
}
