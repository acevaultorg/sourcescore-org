import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSlugs, getSource, peersForSource } from "@/data/sources";
import { comparisonsForSource } from "@/data/comparisons";
import { ALL_DIMENSIONS, DIMENSION_META } from "@/data/best-lists";
import { gradeColorClass } from "@/lib/types";
import { ScoreBadge } from "@/components/ScoreBadge";

// Day 29 — Per-source peers hub.
// Auto-computed nearest-neighbor peer group: 5 closest sources by
// absolute composite-Index distance. Distinct from Day 24 (curated
// head-to-head comparisons): peers is a discovery surface — "who's at
// my tier across the whole dataset, regardless of category" — with
// inline dim deltas surfacing which peer leads on each sub-score.
//
// Generated for every source (130 pages). High intra-fleet linking:
// each page deep-links to /source/<peer-slug>/ ×5, /compare/ when a
// curated pair exists, and /source/<slug>/comparisons/ Day-24 hub.
//
// Layer 5 archetype stack:
//   programmatic_unique_data_page × +55 (per-source × N-NN)
//   ai_visibility_optimized_page × +70 (cite-ready peer-leader claims)
//   internal_linking_hub_spoke × +15 (5+ outbound /source/ links)
//   schema_markup_article_person_org × +20 (ItemList + Article)
//   sitemap_addition × +12

const PEERS_N = 5;

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const me = getSource(slug);
  if (!me) return { title: "Source not found" };
  const peers = peersForSource(slug, PEERS_N);
  if (peers.length === 0) return { title: "Source not found" };

  const closest = peers[0];
  const closestDelta = closest.scores.index.value - me.scores.index.value;
  const tier = me.scores.index.grade;

  const title = `${me.name} peers — sources at the same SourceScore tier`;
  const description = `${me.name} (${tier} · ${me.scores.index.value}/100) sits closest to ${closest.name} (${closest.scores.index.grade} · ${closest.scores.index.value}, ${closestDelta >= 0 ? "+" : ""}${closestDelta}). Discover the ${PEERS_N} sources at the same composite tier across all categories.`;

  // Re-use the source's own OG image
  const ogImage = `https://sourcescore.org/og/source/${slug}.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sourcescore.org/source/${slug}/peers/`,
      types: {
        "application/json": `https://sourcescore.org/api/source/${slug}/peers.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/source/${slug}/peers/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SourcePeersPage({ params }: PageProps) {
  const { slug } = await params;
  const me = getSource(slug);
  if (!me) notFound();

  const peers = peersForSource(slug, PEERS_N);
  if (peers.length === 0) notFound();

  // Has curated comparison link to Day 24 hub?
  const hasComparators = comparisonsForSource(slug).length > 0;

  // Compute means across the peer group
  const peerMeanIndex = Math.round(
    peers.reduce((a, p) => a + p.scores.index.value, 0) / peers.length,
  );
  const peerMeanByDim = {
    discipline: Math.round(
      peers.reduce((a, p) => a + p.scores.discipline.value, 0) / peers.length,
    ),
    modernReference: Math.round(
      peers.reduce((a, p) => a + p.scores.modernReference.value, 0) /
        peers.length,
    ),
    velocity: Math.round(
      peers.reduce((a, p) => a + p.scores.velocity.value, 0) / peers.length,
    ),
  };

  // Per-dim leader within the peer group + me (combined comparison set)
  const combined = [me, ...peers];
  const leaderByDim = {
    discipline: [...combined].sort(
      (a, b) => b.scores.discipline.value - a.scores.discipline.value,
    )[0],
    modernReference: [...combined].sort(
      (a, b) => b.scores.modernReference.value - a.scores.modernReference.value,
    )[0],
    velocity: [...combined].sort(
      (a, b) => b.scores.velocity.value - a.scores.velocity.value,
    )[0],
  };

  // JSON-LD: ItemList + Article
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${me.name} — ${PEERS_N} closest SourceScore peers`,
    description: `${PEERS_N} sources at the closest composite-Index tier to ${me.name} (${me.scores.index.grade} · ${me.scores.index.value}/100), regardless of category. Mean peer-group Index: ${peerMeanIndex}.`,
    url: `https://sourcescore.org/source/${slug}/peers/`,
    numberOfItems: peers.length,
    itemListElement: peers.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: p.name,
        url: `https://${p.domain}`,
        identifier: `https://sourcescore.org/source/${p.slug}/`,
      },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${me.name} peers — sources at the same SourceScore tier`,
    description: `${me.name} (${me.scores.index.grade} · ${me.scores.index.value}/100) sits among ${PEERS_N} composite-tier peers. Mean peer Index: ${peerMeanIndex}.`,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: me.verified,
    dateModified: me.verified,
    url: `https://sourcescore.org/source/${slug}/peers/`,
    about: {
      "@type": "Organization",
      name: me.name,
      url: `https://${me.domain}`,
    },
  };

  const dimEntries = [
    { key: "discipline" as const, meta: DIMENSION_META.discipline },
    { key: "modernReference" as const, meta: DIMENSION_META.modernReference },
    { key: "velocity" as const, meta: DIMENSION_META.velocity },
  ];

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

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="text-caption text-dim mb-6 flex gap-2 flex-wrap"
      >
        <a href="/" className="hover:text-text">
          SourceScore
        </a>
        <span aria-hidden="true">/</span>
        <a href="/sources/" className="hover:text-text">
          Sources
        </a>
        <span aria-hidden="true">/</span>
        <a href={`/source/${slug}/`} className="hover:text-text">
          {me.name}
        </a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Peers</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">
        PEERS · {PEERS_N} CLOSEST · {me.name.toUpperCase()}
      </div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Sources at <span className="text-brand">{me.name}</span>'s tier
      </h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        The {PEERS_N} sources closest to{" "}
        <strong className="text-text">{me.name}</strong> (
        <span className={gradeColorClass(me.scores.index.grade)}>
          {me.scores.index.grade} · {me.scores.index.value}
        </span>
        ) by composite SourceScore Index, across all categories. Use this
        view to discover at-tier peers regardless of vertical.
      </p>

      {/* "Me" reference card */}
      <section className="mb-8 p-5 rounded-card-lg border border-brand/40 bg-surface-brand">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-eyebrow text-brand mb-1">Reference</div>
            <a
              href={`/source/${me.slug}/`}
              className="text-heading-2 font-bold text-text hover:text-brand"
            >
              {me.name}
            </a>
            <div className="text-caption text-dim font-mono mt-1">
              {me.domain} · {me.category}
            </div>
            <div className="flex gap-3 text-caption flex-wrap mt-3">
              <span>
                <span className="text-dim">Disc </span>
                <strong className={gradeColorClass(me.scores.discipline.grade)}>
                  {me.scores.discipline.grade} · {me.scores.discipline.value}
                </strong>
              </span>
              <span className="text-dim">·</span>
              <span>
                <span className="text-dim">Mod-Ref </span>
                <strong
                  className={gradeColorClass(me.scores.modernReference.grade)}
                >
                  {me.scores.modernReference.grade} ·{" "}
                  {me.scores.modernReference.value}
                </strong>
              </span>
              <span className="text-dim">·</span>
              <span>
                <span className="text-dim">Vel </span>
                <strong className={gradeColorClass(me.scores.velocity.grade)}>
                  {me.scores.velocity.grade} · {me.scores.velocity.value}
                </strong>
              </span>
            </div>
          </div>
          <ScoreBadge
            value={me.scores.index.value}
            grade={me.scores.index.grade}
            label="Index"
            size="md"
          />
        </div>
      </section>

      {/* Per-dim leader callouts — who beats me on what */}
      <section className="mb-10 grid sm:grid-cols-3 gap-3">
        {dimEntries.map(({ key, meta }) => {
          const leader = leaderByDim[key];
          const isMe = leader.slug === me.slug;
          const myScore = me.scores[key].value;
          const leaderScore = leader.scores[key].value;
          const delta = leaderScore - myScore;
          return (
            <div
              key={key}
              className="p-4 rounded-card border border-border bg-panel"
            >
              <div className="text-eyebrow text-brand mb-1">
                {meta.short} leader
              </div>
              <a
                href={`/source/${leader.slug}/`}
                className="font-bold text-text hover:text-brand text-body-sm leading-snug block"
              >
                {leader.name}
              </a>
              <div className="text-caption mt-1">
                <strong className={gradeColorClass(leader.scores[key].grade)}>
                  {leader.scores[key].grade} · {leader.scores[key].value}
                </strong>
                {!isMe && (
                  <span className="text-pos font-mono ml-2">
                    +{delta} vs you
                  </span>
                )}
                {isMe && (
                  <span className="text-brand ml-2">(that's you)</span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Means strip */}
      <section className="mb-10 p-4 rounded-card border border-border bg-panel">
        <div className="text-eyebrow text-brand mb-2">
          Peer-group means (excluding {me.name})
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-caption">
          <div>
            <div className="text-dim">Index</div>
            <div className="font-bold text-text text-heading-3">
              {peerMeanIndex}
            </div>
            <div className="text-dim font-mono">
              {peerMeanIndex - me.scores.index.value > 0 ? "+" : ""}
              {peerMeanIndex - me.scores.index.value} vs you
            </div>
          </div>
          {dimEntries.map(({ key, meta }) => (
            <div key={key}>
              <div className="text-dim">{meta.short}</div>
              <div className="font-bold text-text text-heading-3">
                {peerMeanByDim[key]}
              </div>
              <div className="text-dim font-mono">
                {peerMeanByDim[key] - me.scores[key].value > 0 ? "+" : ""}
                {peerMeanByDim[key] - me.scores[key].value} vs you
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ranked peer list */}
      <h2 className="text-heading-2 font-bold mb-4">
        The {PEERS_N} closest peers
      </h2>
      <ol className="space-y-3 mb-12">
        {peers.map((p, i) => {
          const indexDelta = p.scores.index.value - me.scores.index.value;
          return (
            <li
              key={p.slug}
              className="flex items-start gap-4 p-4 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
            >
              <div className="text-display-3 font-bold tracking-tight text-brand w-12 flex-shrink-0 leading-none pt-1">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <a
                    href={`/source/${p.slug}/`}
                    className="font-bold text-text hover:text-brand text-heading-3"
                  >
                    {p.name}
                  </a>
                  <span className="text-caption text-dim font-mono">
                    {p.domain}
                  </span>
                  <span className="text-caption text-muted">{p.category}</span>
                  {indexDelta !== 0 && (
                    <span
                      className={`text-caption font-mono ${
                        indexDelta > 0 ? "text-pos" : "text-neg"
                      }`}
                      title={`${indexDelta > 0 ? "Above" : "Below"} ${me.name} by ${Math.abs(indexDelta)} Index points`}
                    >
                      {indexDelta > 0 ? "+" : ""}
                      {indexDelta}
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-muted leading-snug mb-2">
                  {p.summary}
                </p>
                <div className="flex gap-3 text-caption flex-wrap">
                  {dimEntries.map(({ key, meta }) => {
                    const dimDelta =
                      p.scores[key].value - me.scores[key].value;
                    return (
                      <span key={key}>
                        <span className="text-dim">{meta.short} </span>
                        <strong
                          className={gradeColorClass(p.scores[key].grade)}
                        >
                          {p.scores[key].grade} · {p.scores[key].value}
                        </strong>
                        {dimDelta !== 0 && (
                          <span
                            className={`font-mono ml-1 ${
                              dimDelta > 0 ? "text-pos" : "text-neg"
                            }`}
                          >
                            ({dimDelta > 0 ? "+" : ""}
                            {dimDelta})
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
              <ScoreBadge
                value={p.scores.index.value}
                grade={p.scores.index.grade}
                label="Index"
                size="sm"
              />
            </li>
          );
        })}
      </ol>

      {/* Editorial */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">
          How we picked these peers
        </h2>
        <p>
          Peers are the {PEERS_N} sources with the smallest absolute distance
          to{" "}
          <strong className="text-text">{me.name}</strong> on the composite
          SourceScore Index, across all {me.category.toLowerCase()} and
          non-{me.category.toLowerCase()} sources. Distance is computed as
          |peer Index − {me.name} Index|. Ties are broken by higher Index
          first, then alphabetical by name.
        </p>
        <p>
          Distinct from{" "}
          {hasComparators ? (
            <>
              <a
                href={`/source/${slug}/comparisons/`}
                className="text-brand hover:underline"
              >
                {me.name}'s curated comparator hub
              </a>
              , which lists hand-selected head-to-head pairs.
            </>
          ) : (
            "the curated comparator hub elsewhere on the site, which contains hand-selected head-to-head pairs."
          )}{" "}
          Peers is auto-computed from the score data — every source has one,
          and it surfaces neighbors regardless of editorial selection.
        </p>
      </section>

      {/* Cross-links */}
      <nav className="flex flex-wrap gap-3 border-t border-border pt-6 text-body-sm">
        <a href={`/source/${slug}/`} className="text-brand hover:underline">
          ← Back to {me.name}
        </a>
        {hasComparators && (
          <>
            <span className="text-dim">·</span>
            <a
              href={`/source/${slug}/comparisons/`}
              className="text-muted hover:text-brand"
            >
              Curated head-to-heads →
            </a>
          </>
        )}
        <span className="text-dim">·</span>
        <a
          href={`/grade/${me.scores.index.grade.toLowerCase().replace("+", "-plus")}/`}
          className="text-muted hover:text-brand"
        >
          All {me.scores.index.grade}-tier sources →
        </a>
        {ALL_DIMENSIONS.length > 0 && (
          <>
            <span className="text-dim">·</span>
            <a
              href={`/category/${(me.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""))}/`}
              className="text-muted hover:text-brand"
            >
              All {me.category.toLowerCase()} sources →
            </a>
          </>
        )}
      </nav>
    </article>
  );
}
