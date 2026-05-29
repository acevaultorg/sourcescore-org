import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  INSIGHTS,
  insightFromSlug,
  rowsForInsight,
  signalLabel,
} from "@/data/insights";
import { ALL_DIMENSIONS, DIMENSION_META } from "@/data/best-lists";
import { gradeColorClass } from "@/lib/types";
import { ScoreBadge } from "@/components/ScoreBadge";
import { breadcrumbListSchema, datasetSchema } from "@/lib/methodology-version";

// Day 30 — Per-insight stat page.
// Each insight is a single cite-ready stat (top-5 sources extreme on
// some pattern). Distinct from facets (which slice the data) and peers
// (which connect sources). Insights surface EXTREMES.
//
// Layer 5 archetype stack:
//   ai_visibility_optimized_page × +70 (each page = ONE answer to ONE query)
//   original_research_with_dataset × +90 (computed insight, not raw data republish)
//   schema_markup_article_person_org × +20 (Article + ItemList + DefinedTerm)
//   internal_linking_hub_spoke × +15 (every row → /source/)
//   sitemap_addition × +12

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = insightFromSlug(slug);
  if (!insight) return { title: "Insight not found" };

  const rows = rowsForInsight(insight);
  const leader = rows[0];

  const description = leader
    ? `${leader.source.name} leads: ${signalLabel(insight)} = ${leader.signal >= 0 && insight.kind === "dim-vs-composite" ? "+" : ""}${insight.kind === "dim-vs-composite" ? leader.signal : `spread ${leader.spread}`}. ${insight.summary}`
    : insight.summary;

  return {
    title: `${insight.title} — SourceScore Insight`,
    description,
    alternates: {
      canonical: `https://sourcescore.org/insights/${slug}/`,
      types: {
        "application/json": `https://sourcescore.org/api/insights/${slug}.json`,
      },
    },
    openGraph: {
      title: `${insight.title} — SourceScore`,
      description,
      url: `https://sourcescore.org/insights/${slug}/`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: insight.title,
      description,
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const insight = insightFromSlug(slug);
  if (!insight) notFound();

  const rows = rowsForInsight(insight);
  if (rows.length === 0) notFound();

  const leader = rows[0];
  const otherInsights = INSIGHTS.filter((i) => i.slug !== slug);

  // JSON-LD: ItemList + Article + DefinedTerm
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: insight.title,
    description: insight.summary,
    url: `https://sourcescore.org/insights/${slug}/`,
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: r.source.name,
        url: `https://${r.source.domain}`,
        identifier: `https://sourcescore.org/source/${r.source.slug}/`,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.summary,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: leader.source.verified,
    dateModified: leader.source.verified,
    url: `https://sourcescore.org/insights/${slug}/`,
    mainEntity: {
      "@type": "DefinedTerm",
      name: insight.title,
      description: insight.summary,
      inDefinedTermSet:
        insight.kind === "dim-vs-composite"
          ? `https://sourcescore.org/methodology/${DIMENSION_META[insight.dim].methodologySlug}/`
          : "https://sourcescore.org/methodology/sourcescore-index/",
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Insights", url: "https://sourcescore.org/insights/" },
              { name: insight.title, url: `https://sourcescore.org/insights/${slug}/` },
            ])
          ),
        }}
      />
      {/* Dataset schema — insight JSON twin is the canonical record of the
          ranked top-N extreme on this signal. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datasetSchema({
              name: `${insight.title} — SourceScore insight`,
              description: `${insight.summary} Top ${rows.length} sources ranked on this signal. Leader: ${leader.source.name}.`,
              url: `https://sourcescore.org/insights/${slug}/`,
              apiUrl: `https://sourcescore.org/api/insights/${slug}.json`,
              identifier: `insight-${slug}`,
              keywords: [
                "AI citation",
                "SourceScore",
                "insight",
                "ranked extreme",
                insight.title,
              ],
              dateModified: leader.source.verified,
              isPartOf: {
                name: "SourceScore Insights",
                url: "https://sourcescore.org/insights/",
              },
            })
          ),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="text-caption text-dim mb-6 flex gap-2 flex-wrap"
      >
        <a href="/" className="hover:text-text">
          SourceScore
        </a>
        <span aria-hidden="true">/</span>
        <a href="/insights/" className="hover:text-text">
          Insights
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{insight.title}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        INSIGHT · TOP {rows.length} ·{" "}
        {insight.kind === "dim-vs-composite"
          ? `${DIMENSION_META[insight.dim].short.toUpperCase()} ${insight.direction.toUpperCase()}`
          : insight.shape.toUpperCase()}
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        {insight.title}
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {insight.summary}
      </p>

      {/* Question + cite-ready answer callout */}
      <section className="mb-10 p-6 rounded-card-lg border border-brand/40 bg-surface-brand">
        <div className="text-eyebrow text-brand mb-2">The question</div>
        <p className="text-body-lg text-text leading-snug mb-4">
          {insight.question}
        </p>
        <div className="text-eyebrow text-brand mb-2">The answer</div>
        <p className="text-heading-2 font-bold text-text leading-snug">
          <a
            href={`/source/${leader.source.slug}/`}
            className="hover:text-brand transition-colors"
          >
            {leader.source.name}
          </a>{" "}
          —{" "}
          {insight.kind === "dim-vs-composite" ? (
            <>
              {DIMENSION_META[insight.dim].short}{" "}
              <span
                className={
                  insight.direction === "lead" ? "text-pos" : "text-neg"
                }
              >
                {leader.signal >= 0 ? "+" : ""}
                {leader.signal}
              </span>{" "}
              vs Index
            </>
          ) : (
            <>
              spread of{" "}
              <span
                className={
                  insight.shape === "balanced" ? "text-pos" : "text-neg"
                }
              >
                {leader.spread}
              </span>{" "}
              points across dimensions
            </>
          )}
        </p>
      </section>

      {/* Ranked stat list */}
      <ol className="space-y-3 mb-12">
        {rows.map((r, i) => (
          <li
            key={r.source.slug}
            className="flex items-start gap-4 p-4 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-display-3 font-bold tracking-tight text-brand w-12 flex-shrink-0 leading-none pt-1">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap mb-1">
                <a
                  href={`/source/${r.source.slug}/`}
                  className="font-bold text-text hover:text-brand text-heading-3"
                >
                  {r.source.name}
                </a>
                <span className="text-caption text-dim font-mono">
                  {r.source.domain}
                </span>
                <span className="text-caption text-muted">{r.source.category}</span>
              </div>
              <p className="text-body-sm text-muted leading-snug mb-2">
                {r.source.summary}
              </p>
              <div className="flex gap-3 text-caption flex-wrap">
                <span>
                  <span className="text-dim">Disc </span>
                  <strong className={gradeColorClass(r.source.scores.discipline.grade)}>
                    {r.source.scores.discipline.grade} · {r.source.scores.discipline.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Mod-Ref </span>
                  <strong
                    className={gradeColorClass(r.source.scores.modernReference.grade)}
                  >
                    {r.source.scores.modernReference.grade} ·{" "}
                    {r.source.scores.modernReference.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Vel </span>
                  <strong className={gradeColorClass(r.source.scores.velocity.grade)}>
                    {r.source.scores.velocity.grade} · {r.source.scores.velocity.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Index </span>
                  <strong className={gradeColorClass(r.source.scores.index.grade)}>
                    {r.source.scores.index.grade} · {r.source.scores.index.value}
                  </strong>
                </span>
              </div>
              <div className="mt-2 text-body-sm">
                <span className="text-dim">Signal: </span>
                <strong
                  className={`font-mono ${
                    insight.kind === "dim-vs-composite"
                      ? insight.direction === "lead"
                        ? "text-pos"
                        : "text-neg"
                      : insight.shape === "balanced"
                        ? "text-pos"
                        : "text-neg"
                  }`}
                >
                  {insight.kind === "dim-vs-composite"
                    ? `${r.signal >= 0 ? "+" : ""}${r.signal} (${DIMENSION_META[insight.dim].short} − Index)`
                    : `spread ${r.spread} (${r.values.discipline}/${r.values.modernReference}/${r.values.velocity})`}
                </strong>
              </div>
            </div>
            <ScoreBadge
              value={r.source.scores.index.value}
              grade={r.source.scores.index.grade}
              label="Index"
              size="sm"
            />
          </li>
        ))}
      </ol>

      {/* Methodology */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">
          How we computed this
        </h2>
        <p>
          {insight.kind === "dim-vs-composite" ? (
            <>
              For each source, we computed{" "}
              <strong className="text-text">
                {DIMENSION_META[insight.dim].label} score − composite Index
              </strong>{" "}
              and ranked the result. Sources with the{" "}
              {insight.direction === "lead" ? "largest positive" : "largest negative"}{" "}
              difference fill this top {rows.length}. Both scores are on the
              0–100 scale, so a difference of +N means the dimension scores
              N points {insight.direction === "lead" ? "above" : "below"}{" "}
              the average of all three sub-scores for that source.
            </>
          ) : (
            <>
              For each source, we computed{" "}
              <strong className="text-text">
                max(disc, mod-ref, vel) − min(disc, mod-ref, vel)
              </strong>{" "}
              and ranked by{" "}
              {insight.shape === "balanced" ? "smallest" : "largest"}{" "}
              spread. A spread of 0 means all three sub-scores are equal; a
              spread of {leader.spread || "N"} means the highest sub-score
              is that many points above the lowest.
            </>
          )}
        </p>
        <p>
          Composite Index is computed as 0.35 × Citation Discipline + 0.30 ×
          Modern Reference + 0.35 × Citation Velocity. Differences between
          a single dim and the composite reflect the deviation from this
          weighted average.
        </p>
      </section>

      {/* Other insights */}
      <section className="mb-10">
        <div className="text-eyebrow text-brand mb-3">Other insights</div>
        <ul className="grid sm:grid-cols-2 gap-2">
          {otherInsights.map((i) => (
            <li key={i.slug}>
              <a
                href={`/insights/${i.slug}/`}
                className="block px-4 py-2 rounded-btn border border-border bg-panel text-body-sm text-muted hover:text-brand hover:border-brand/40 transition-colors"
              >
                {i.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href="/insights/" className="text-brand hover:underline">
          ← All insights
        </a>
        {insight.kind === "dim-vs-composite" && (
          <>
            <span className="text-dim">·</span>
            <a
              href={`/methodology/${DIMENSION_META[insight.dim].methodologySlug}/`}
              className="text-muted hover:text-brand"
            >
              {DIMENSION_META[insight.dim].label} methodology →
            </a>
          </>
        )}
        <span className="text-dim">·</span>
        <a href="/sources/" className="text-muted hover:text-brand">
          All sources →
        </a>
      </nav>
    </article>
  );
}
