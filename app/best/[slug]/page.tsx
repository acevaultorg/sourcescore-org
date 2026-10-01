import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScoreBadge } from "@/components/ScoreBadge";
import {
  bestLists,
  bestListSlugs,
  getBestList,
  ALL_DIMENSIONS,
  DIMENSION_META,
} from "@/data/best-lists";
import { categorySlug } from "@/data/sources";
import { gradeColorClass } from "@/lib/types";
import { breadcrumbListSchema, datasetSchema } from "@/lib/methodology-version";

// Programmatic-SEO best-of listicles — one per curated vertical.
// Targets high-intent "best X for AI citation" queries (e.g., "best news
// sources to cite", "best peer-reviewed journals", "best free reference
// works"). Each page is evergreen, schema-marked, and JSON-API-twinned.

export function generateStaticParams() {
  return bestListSlugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const list = getBestList(slug);
  if (!list) return { title: "List not found" };

  const ogImage = `https://sourcescore.org/og/best/${slug}.svg`;
  return {
    title: `${list.title}`,
    description: list.description,
    alternates: { canonical: `https://sourcescore.org/best/${slug}/` },
    openGraph: {
      title: list.title,
      description: list.description,
      url: `https://sourcescore.org/best/${slug}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: list.title }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function BestListPage({ params }: PageProps) {
  const { slug } = await params;
  const list = getBestList(slug);
  if (!list) notFound();

  const items = list.select();

  // JSON-LD: ItemList + Article hybrid for richest extraction by LLMs.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: list.title,
    description: list.description,
    author: { "@type": "Organization", name: "SourceScore" },
    publisher: { "@type": "Organization", name: "SourceScore" },
    datePublished: "2026-04-29",
    dateModified: "2026-04-29",
    url: `https://sourcescore.org/best/${slug}/`,
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: items.length,
      itemListElement: items.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://sourcescore.org/source/${s.slug}/`,
        name: s.name,
      })),
    },
    about: items.map((s) => ({
      "@type": "WebSite",
      name: s.name,
      url: `https://${s.domain}`,
    })),
  };

  // Other best-lists for cross-link rail
  const siblings = bestLists.filter((b) => b.slug !== slug);

  // FAQPage (AEO) — best-of listicles are the highest-volume, most
  // click-surviving query class ("best X to cite", "most reliable X").
  // Answer them in extractable form so AI Overviews + featured snippets
  // cite this page. Schema + visible accordion mirror each other.
  const topItems = items.slice(0, 5);
  const leader = items[0];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://sourcescore.org/best/${slug}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `${list.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `By the SourceScore Index, the top ${topItems.length}: ${topItems
            .map((s, i) => `${i + 1}. ${s.name} (${s.scores.index.grade} ${s.scores.index.value}/100)`)
            .join("; ")}. Each is hand-scored on Citation Discipline, Modern Reference, and Citation Velocity — full ranking + breakdowns below.`,
        },
      },
      {
        "@type": "Question",
        name: `Which source tops this list, and why?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${leader.name} ranks #1, scoring ${leader.scores.index.grade} (${leader.scores.index.value}/100) on the SourceScore Index — the highest composite citation-quality score here. ${leader.summary}`,
        },
      },
      {
        "@type": "Question",
        name: `How is this list ranked?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Ranked by ${list.signalCriterion}, scored against the SourceScore methodology v0.1 across Citation Discipline, Modern Reference (AI-era fitness), and Citation Velocity. Regenerated automatically on every dataset update — no paid placement or editorial promotion.`,
        },
      },
    ],
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
            datasetSchema({
              name: `${list.title} — SourceScore curated list`,
              description: `Machine-readable JSON record of ${items.length} hand-curated sources for "${list.intent}". Each entry includes Citation Discipline, Modern Reference, and Citation Velocity scores plus composite Index. ${list.description}`,
              url: `https://sourcescore.org/best/${slug}/`,
              apiUrl: `https://sourcescore.org/api/best/${slug}.json`,
              identifier: `best-${slug}`,
              keywords: [
                "AI citation",
                "SourceScore",
                "curated list",
                list.intent,
                "source quality",
              ],
              dateModified: "2026-04-29",
              isPartOf: {
                name: "SourceScore Best Lists",
                url: "https://sourcescore.org/best/",
              },
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Best lists", url: "https://sourcescore.org/best/" },
              { name: list.intent, url: `https://sourcescore.org/best/${list.slug}/` },
            ])
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/best/" className="hover:text-text">Best lists</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{list.intent}</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">{list.intent}</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">{list.title}</h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-8">
        {list.description}
      </p>

      {/* Ranked list — listicle layout */}
      <ol className="space-y-3 mb-12">
        {items.map((s, i) => (
          <li
            key={s.slug}
            className="relative flex items-start gap-4 p-4 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <div className="text-display-3 font-bold tracking-tight text-brand w-12 flex-shrink-0 leading-none pt-1">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap mb-1">
                <a
                  href={`/source/${s.slug}/`}
                  className="font-bold text-text hover:text-brand text-heading-3 after:absolute after:inset-0 after:content-['']"
                >
                  {s.name}
                </a>
                <span className="text-caption text-dim font-mono">{s.domain}</span>
                <span className="text-caption text-dim">·</span>
                <a
                  href={`/category/${categorySlug(s.category)}/`}
                  className="relative z-10 inline-flex items-center min-h-[44px] -my-3 text-caption text-muted hover:text-brand"
                >
                  {s.category}
                </a>
              </div>
              <p className="text-body-sm text-muted leading-snug mb-2">{s.summary}</p>
              <div className="flex gap-3 text-caption flex-wrap">
                <span>
                  <span className="text-dim">SourceScore </span>
                  <strong className={gradeColorClass(s.scores.index.grade)}>
                    {s.scores.index.grade} · {s.scores.index.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Discipline </span>
                  <strong className={gradeColorClass(s.scores.discipline.grade)}>
                    {s.scores.discipline.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Modern Reference </span>
                  <strong className={gradeColorClass(s.scores.modernReference.grade)}>
                    {s.scores.modernReference.value}
                  </strong>
                </span>
                <span className="text-dim">·</span>
                <span>
                  <span className="text-dim">Velocity </span>
                  <strong className={gradeColorClass(s.scores.velocity.grade)}>
                    {s.scores.velocity.value}
                  </strong>
                </span>
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

      {/* Day 25 — dim-faceted variants */}
      <section className="mb-12 p-5 rounded-card-lg border border-brand/30 bg-surface-brand">
        <div className="text-eyebrow text-brand mb-3">
          Same list, different signal
        </div>
        <p className="text-body-sm text-muted mb-4 leading-relaxed">
          The SourceScore Index combines all three sub-scores. You can also
          see this list sorted by just one of them, which can change the
          order and the source at the top.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_DIMENSIONS.map((d) => (
            <a
              key={d}
              href={`/best/${slug}/${DIMENSION_META[d].routeSegment}/`}
              className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-btn border border-brand/40 bg-panel text-body-sm text-text hover:text-brand hover:border-brand"
            >
              By {DIMENSION_META[d].short} →
            </a>
          ))}
        </div>
      </section>

      {/* Editorial rationale */}
      <section className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4 mb-12">
        <h2 className="text-heading-2 text-text font-bold mb-3">Why these {items.length} sources</h2>
        <p>{list.rationale}</p>

        <h3 className="text-heading-3 text-text font-semibold pt-4 mb-2">How this list is ranked</h3>
        <p>
          Selection criterion:{" "}
          <strong className="text-text">{list.signalCriterion}</strong>. Every source on this page
          is hand-scored against the SourceScore methodology v0.1; tap any source to see its full
          breakdown across the three sub-scores and the overall Index. The list is regenerated automatically on every
          dataset update — no editorial promotion or reorder beyond the ranking signal above.
        </p>
      </section>

      {/* AEO FAQ — mirrors faqLd JSON-LD; visible accordion satisfies Google's
          "FAQ must be visible" rule + gives AI Overviews extractable answers
          for "best X to cite" / "most reliable X" queries. */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-heading-2 font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-3">
          {(faqLd.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map((q, i) => (
            <details key={i} className="rounded-card border border-border bg-panel p-4 open:border-brand/40">
              <summary className="-m-4 p-4 cursor-pointer font-semibold text-text">{q.name}</summary>
              <p className="mt-3 text-body-sm text-muted leading-relaxed">{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Sibling best-lists rail */}
      <section className="border-t border-border pt-8 mb-10">
        <h2 className="text-heading-2 font-bold mb-4">Other best-of lists</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {siblings.map((b) => (
            <a
              key={b.slug}
              href={`/best/${b.slug}/`}
              className="block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
            >
              <div className="text-eyebrow text-brand mb-1">{b.intent}</div>
              <div className="font-semibold text-text mb-1">{b.title}</div>
              <div className="text-body-sm text-muted leading-snug line-clamp-2">
                {b.description}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Related */}
      <nav className="flex flex-wrap items-center gap-x-3 border-t border-border pt-4 text-body-sm">
        <a href="/sources/" className="inline-flex items-center min-h-[44px] text-muted hover:text-brand">
          All 130 sources →
        </a>
        <span className="text-dim">·</span>
        <a href="/grade/" className="inline-flex items-center min-h-[44px] text-muted hover:text-brand">
          Browse by grade →
        </a>
        <span className="text-dim">·</span>
        <a href="/methodology/sourcescore-index/" className="inline-flex items-center min-h-[44px] text-muted hover:text-brand">
          Methodology + worked examples →
        </a>
      </nav>
    </article>
  );
}
