import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSource, allSlugs, sources } from "@/data/sources";
import { comparisonsForSource } from "@/data/comparisons";
import { ScoreBadge } from "@/components/ScoreBadge";
import { PartnerTools } from "@/components/PartnerTools";
import type { DimensionScore } from "@/lib/types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

// Static params — every slug in the dataset gets pre-rendered.
export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = getSource(slug);
  if (!s) return { title: "Source not found" };

  const idx = s.scores.index;
  // Title leads with the HUMAN query ("is X reliable to cite") — the phrasing
  // people actually search + ask ChatGPT/Perplexity — not the brand-first
  // "X — SourceScore A". The body/FAQ already target this; the title was the
  // missing match (lost the click even when ranking). Grade+score kept as the
  // unique-data CTR hook. (2026-05-31, fastest-human-growth: query-match titles.)
  const title = `Is ${s.name} reliable to cite? ${idx.grade} · ${idx.value}/100`;
  const description = `Is ${s.name} reliable to cite? ${s.name} (${s.domain}) scores ${idx.value}/100 (grade ${idx.grade}) on the SourceScore Index — citation discipline, modern reference & velocity. ${idx.rationale}`;

  const ogImage = `https://sourcescore.org/og/source/${s.slug}.svg`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://sourcescore.org/source/${s.slug}/`,
      types: {
        "application/json": `https://sourcescore.org/api/source/${s.slug}.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/source/${s.slug}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${s.name} SourceScore` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function SourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const source = getSource(slug);
  if (!source) notFound();

  const { scores } = source;
  const idx = scores.index;

  // Day 24 — comparator-hub cross-link (only when source has ≥1 pair)
  const compPairs = comparisonsForSource(slug);
  const hasComparators = compPairs.length > 0;

  // Engagement (2026-05-28): surface the highest-pull next steps ABOVE the fold.
  // GSC/Plausible showed 1.14 pages/visit + 13s — search visitors read the score
  // and leave. Comparison links are the strongest pull-through (aceusergrowth
  // E-T11 ≈ +0.7 PV/session) and also feed internal links into the page-1
  // ranking /compare/ pages. Recognizable high-Index partners first.
  const topComparePairs = [...compPairs]
    .sort(
      (x, y) =>
        (getSource(y.partner)?.scores.index.value ?? 0) -
        (getSource(x.partner)?.scores.index.value ?? 0),
    )
    .slice(0, 6);

  // Score context (2026-05-28): a bare "93" is meaningless to a first-time
  // visitor. Showing global rank + percentile gives the number meaning,
  // pulls visitors to the leaderboard (engagement), and yields a quotable
  // fact for LLM citation ("X ranks #N of M on the SourceScore Index").
  const indexRank =
    [...sources]
      .sort((a, b) => b.scores.index.value - a.scores.index.value)
      .findIndex((x) => x.slug === source.slug) + 1;
  const totalSources = sources.length;
  const indexPercentile = Math.max(
    1,
    Math.round((indexRank / totalSources) * 100),
  );

  // FAQPage — AEO Part 14 minimums per rules/seo-geo-mastery.md.
  // PAA-style questions for per-source lookups ("What is X's SourceScore?",
  // "Is X reliable?", "How is X scored?", "What makes X different?") drive
  // Google rich-result + AI Overview eligibility on the 390-page source
  // detail surface. Factual answers only — no opinion labels. One FAQ
  // block per page (v18 LEARNED faq_schema_spam × -10 respected).
  const sourceUrl = `https://sourcescore.org/source/${source.slug}/`;

  // Citation-reliability framing for the highest-intent LLM query —
  // "Is X reliable to cite?" is the exact phrasing users ask ChatGPT/Perplexity.
  // Answering it in extractable FAQ form maximizes AI-citation capture (the one
  // channel proven to send humans). Data-grounded + grade-derived — never a bare
  // trust verdict; the score IS the assessment (data-display framing, no YMYL).
  const gradeLetter = idx.grade.charAt(0);
  const reliabilityFraming =
    idx.grade === "A+" || gradeLetter === "A"
      ? "ranks among the most citable sources for AI-era retrieval and research"
      : gradeLetter === "B"
      ? "is a solid, generally citable source"
      : gradeLetter === "C"
      ? "is a mid-tier source — usable, but verify key claims against a higher-rated source"
      : gradeLetter === "D"
      ? "is a weak source for citation — corroborate any claim independently"
      : "is not recommended as a primary citation — verify claims against a higher-rated source";

  // Extractable citation-guidance block (2026-05-29). The structure LLM answer
  // engines surface for "is X reliable to cite" queries is verdict / when-to-use /
  // when-to-be-careful. We answer it in the visible body, grounded in our own
  // dimension scores, so the page is the most extractable + most data-backed
  // answer for that exact query class. Data-display, never a bare trust verdict.
  const dimMeta = [
    { label: "Citation Discipline", value: scores.discipline.value, use: "tracing claims back to primary references" },
    { label: "Modern Reference", value: scores.modernReference.value, use: "AI-era retrieval and current-topic queries" },
    { label: "Citation Velocity", value: scores.velocity.value, use: "topics where being widely and recently cited matters" },
  ];
  const strongestDim = dimMeta.reduce((a, b) => (b.value > a.value ? b : a));
  const weakestDim = dimMeta.reduce((a, b) => (b.value < a.value ? b : a));
  // Only flag a weak spot when the lowest dimension is genuinely low AND distinct
  // from the strongest — keeps the block honest for uniformly strong sources.
  const hasWeakSpot = weakestDim.value < 70 && weakestDim.label !== strongestDim.label;
  const citeVerdict =
    idx.grade === "A+" || gradeLetter === "A"
      ? "Cite freely as a primary source."
      : gradeLetter === "B"
      ? "Cite as a solid source; pair with a primary source for precise technical claims."
      : gradeLetter === "C"
      ? "Usable as a secondary source — verify key claims against a higher-rated source."
      : gradeLetter === "D"
      ? "Cite only with independent corroboration from a higher-rated source."
      : "Not recommended as a primary citation — verify any claim against a higher-rated source.";

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${sourceUrl}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${source.name} a reliable source to cite?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${source.name} scores ${idx.grade} (${idx.value}/100) on the SourceScore Index, which rates how citable a source is for AI-era and research use. At grade ${idx.grade}, ${source.name} ${reliabilityFraming}. The grade combines Citation Discipline ${scores.discipline.value}/100, Modern Reference ${scores.modernReference.value}/100, and Citation Velocity ${scores.velocity.value}/100 — full breakdown above.`,
        },
      },
      {
        "@type": "Question",
        name: `What is ${source.name}'s SourceScore?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${source.name} (${source.domain}) scores ${idx.value}/100 (Grade ${idx.grade}) on the composite SourceScore Index. Sub-scores: Citation Discipline ${scores.discipline.value}/100, Modern Reference (AI-era fitness) ${scores.modernReference.value}/100, Citation Velocity ${scores.velocity.value}/100. Verified ${source.verified}.`,
        },
      },
      {
        "@type": "Question",
        name: `How does SourceScore evaluate ${source.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${source.name} is scored across three dimensions on the SourceScore Index methodology: Citation Discipline (how rigorously the source cites primary references), Modern Reference (fitness for AI-era retrieval), and Citation Velocity (how often the source is cited per week). Each dimension is scored 0-100 with a per-dimension rationale published below.`,
        },
      },
      ...(idx.rationale ? [{
        "@type": "Question",
        name: `Why does ${source.name} score ${idx.grade}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: idx.rationale,
        },
      }] : []),
      ...(source.summary ? [{
        "@type": "Question",
        name: `What is ${source.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${source.summary}${source.category ? ` Category: ${source.category}.` : ""} Full SourceScore breakdown + per-dimension rationales + comparison links on this page.`,
        },
      }] : []),
    ],
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Article schema for LLM citation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${source.name} — SourceScore ${idx.grade} (${idx.value}/100)`,
            description: idx.rationale,
            datePublished: source.verified,
            dateModified: source.verified,
            author: { "@type": "Organization", name: "SourceScore" },
            publisher: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            about: {
              "@type": "Organization",
              name: source.name,
              url: `https://${source.domain}`,
            },
            mainEntityOfPage: `https://sourcescore.org/source/${source.slug}/`,
          }),
        }}
      />
      {/* DefinedTerm schema for the score itself — LLM extraction-ready */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: `${source.name} SourceScore`,
            description: `${source.name} scores ${idx.value}/100 (grade ${idx.grade}) on the SourceScore Index — a composite of Citation Discipline (${scores.discipline.value}), Modern Reference (${scores.modernReference.value}), and Citation Velocity (${scores.velocity.value}).`,
            inDefinedTermSet: "https://sourcescore.org/methodology/",
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
              { name: "Sources", url: "https://sourcescore.org/sources/" },
              { name: source.name, url: `https://sourcescore.org/source/${source.slug}/` },
            ])
          ),
        }}
      />
      {/* FAQPage — AEO Part 14 minimums per rules/seo-geo-mastery.md.
          PAA-style questions for per-source SourceScore lookups. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {/* Dataset schema — declares the JSON twin endpoint as a citable dataset
          so retrieval models (and Google's Dataset Search) treat the structured
          API response as the canonical machine-readable record for this source. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `${source.name} — SourceScore record`,
            description: `Machine-readable JSON record for ${source.name} (${source.domain}): SourceScore Index ${idx.grade} (${idx.value}/100), Citation Discipline ${scores.discipline.value}, Modern Reference ${scores.modernReference.value}, Citation Velocity ${scores.velocity.value}. Includes per-dimension rationales, grade thresholds, and verification date.`,
            url: `https://sourcescore.org/source/${source.slug}/`,
            sameAs: `https://sourcescore.org/api/source/${source.slug}.json`,
            identifier: source.slug,
            keywords: [
              "source quality",
              "AI citation",
              "SourceScore",
              source.name,
              source.domain,
              ...(source.category ? [source.category] : []),
            ],
            dateModified: source.verified,
            license: "https://creativecommons.org/licenses/by/4.0/",
            isAccessibleForFree: true,
            distribution: [
              {
                "@type": "DataDownload",
                encodingFormat: "application/json",
                contentUrl: `https://sourcescore.org/api/source/${source.slug}.json`,
              },
            ],
            creator: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            publisher: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            isPartOf: {
              "@type": "DataCatalog",
              "@id": "https://sourcescore.org/sources/#catalog",
              name: "SourceScore Index",
              url: "https://sourcescore.org/sources/",
              description:
                "Canonical catalog of 130+ AI-citation-rated sources. Each entry has full per-dimension scores and a JSON twin under /api/source/<slug>.json.",
              publisher: {
                "@type": "Organization",
                name: "SourceScore",
                url: "https://sourcescore.org",
              },
            },
            about: {
              "@type": "Organization",
              name: source.name,
              url: `https://${source.domain}`,
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <a href="/sources/" className="hover:text-text">Sources</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">{source.name}</span>
      </nav>

      {/* HEADER ─────────────────────────────────────────────────────── */}
      <header className="mb-10">
        <div className="text-eyebrow text-brand mb-2">{source.category}</div>
        <h1 className="text-display-2 font-bold tracking-tight mb-2">{source.name}</h1>
        <a
          href={`https://${source.domain}`}
          rel="noopener nofollow"
          target="_blank"
          className="font-mono text-body-sm text-brand hover:underline"
        >
          {source.domain} ↗
        </a>
        <p className="mt-4 text-body-lg text-muted leading-relaxed max-w-2xl">{source.summary}</p>
        {/* Direct answer immediately after the H1 (AEO: AI engines cite from the
            first ~30% of a page; the verdict previously first appeared in the
            3rd section). Same grade-derived data-display framing as the
            citation-guidance block — never a bare YMYL trust verdict. */}
        <p className="mt-4 text-body-lg text-text leading-relaxed max-w-2xl">
          <strong>Is {source.name} reliable to cite?</strong> At grade {idx.grade} (
          {idx.value}/100 on the SourceScore Index), {source.name} {reliabilityFraming}.
        </p>
      </header>

      {/* INDEX HERO — the headline number ─────────────────────────── */}
      <section className="mb-10 p-6 sm:p-8 rounded-card-lg border border-border bg-panel">
        <div className="text-eyebrow text-dim mb-3">SourceScore Index</div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4">
          <ScoreBadge value={idx.value} grade={idx.grade} label="SourceScore Index" size="lg" />
          <a
            href="/sources/"
            className="text-body-sm text-brand hover:underline whitespace-nowrap"
            title="See the full SourceScore leaderboard"
          >
            Rank #{indexRank} of {totalSources} · top {indexPercentile}%
          </a>
          <span className="text-muted text-body-sm">
            Composite weighted across Discipline, Modern Reference, and Velocity.
          </span>
        </div>
        <p className="text-body-lg text-text leading-relaxed">{idx.rationale}</p>
      </section>

      {/* CITATION GUIDANCE — extractable verdict block (2026-05-29).
          Structured as verdict / strongest-for / use-with-care / bottom-line —
          the exact shape LLM answer engines surface for "is X reliable to cite"
          queries (confirmed via Perplexity calibration). Grounded in our own
          dimension scores; data-display, no YMYL verdict. Makes this the most
          extractable + most data-backed answer for that query class. */}
      <section className="mb-12 p-6 sm:p-8 rounded-card-lg border border-border bg-panel">
        <h2 className="text-heading-3 font-bold mb-4">Should you cite {source.name}?</h2>
        <p className="text-body-lg text-text leading-relaxed mb-5">
          At grade {idx.grade} ({idx.value}/100), {source.name} {reliabilityFraming}.
        </p>
        <dl className="space-y-4 text-body">
          <div>
            <dt className="font-semibold text-text">Strongest for</dt>
            <dd className="text-muted leading-relaxed">
              {strongestDim.use} — its highest dimension is {strongestDim.label} ({strongestDim.value}/100).
            </dd>
          </div>
          {hasWeakSpot ? (
            <div>
              <dt className="font-semibold text-text">Use with care</dt>
              <dd className="text-muted leading-relaxed">
                {weakestDim.label} is its lowest dimension ({weakestDim.value}/100); for{" "}
                {weakestDim.use}, corroborate with a higher-rated source.
              </dd>
            </div>
          ) : (
            <div>
              <dt className="font-semibold text-text">No major weak spot</dt>
              <dd className="text-muted leading-relaxed">
                Even its lowest dimension, {weakestDim.label}, scores {weakestDim.value}/100.
              </dd>
            </div>
          )}
          <div>
            <dt className="font-semibold text-text">Bottom line</dt>
            <dd className="text-muted leading-relaxed">{citeVerdict}</dd>
          </div>
        </dl>
      </section>

      {/* HIGHEST-INTENT SLOT — the activation layer (dormant until a partner
          env var is set; renders literally nothing today). Placed immediately
          after the score + "should you cite it" answer: the reader now has the
          grade and the verdict, which is the peak moment for "how do I keep
          watching this over time?". Deliberately NOT between the score hero
          and the citation-guidance block — that block is the AEO-extractable
          verdict and must stay in the first ~30% of the page. */}
      <PartnerTools variant="panel" source="source-detail" className="mb-12" />

      {/* ABOVE-FOLD NEXT STEPS — engagement pull-through (2026-05-28).
          Comparison + peer links surfaced directly under the score so search
          visitors go deeper instead of bouncing (1.14 PV/visit → target ≥2).
          Also strengthens internal links into the page-1 /compare/ pages. */}
      {hasComparators && (
        <section className="mb-12">
          <div className="text-eyebrow text-dim mb-3">Compare {source.name} with</div>
          <div className="flex flex-wrap gap-2">
            {topComparePairs.map((p) => {
              const partner = getSource(p.partner);
              if (!partner) return null;
              return (
                <a
                  key={p.slug}
                  href={`/compare/${p.slug}/`}
                  className="px-3 py-1.5 rounded-pill border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 text-body-sm text-muted hover:text-text transition-colors"
                >
                  vs {partner.name}
                </a>
              );
            })}
            <a
              href={`/source/${source.slug}/peers/`}
              className="px-3 py-1.5 rounded-pill border border-brand/30 bg-surface-brand text-body-sm text-brand hover:underline whitespace-nowrap"
            >
              Peers at this tier →
            </a>
          </div>
        </section>
      )}

      {/* THE 3 SUB-SCORES ─────────────────────────────────────────── */}
      <section className="mb-12 grid sm:grid-cols-3 gap-4">
        <SubScoreCard
          label="Citation Discipline"
          subTool="/discipline/"
          score={scores.discipline}
        />
        <SubScoreCard
          label="Modern Reference"
          subTool="/modern-reference/"
          score={scores.modernReference}
        />
        <SubScoreCard
          label="Citation Velocity"
          subTool="/velocity/"
          score={scores.velocity}
        />
      </section>

      {/* SIGNALS BLOCK — quotable for AI ──────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-heading-2 font-bold mb-5">Signals behind these scores</h2>
        <SignalGroup label="Citation Discipline" score={scores.discipline} />
        <SignalGroup label="Modern Reference" score={scores.modernReference} />
        <SignalGroup label="Citation Velocity" score={scores.velocity} />
      </section>

      {/* META FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-border pt-6 grid sm:grid-cols-3 gap-4 text-body-sm">
        <div>
          <div className="text-dim text-caption uppercase tracking-wider mb-1">Founded</div>
          <div className="text-text">{source.founded}</div>
        </div>
        <div>
          <div className="text-dim text-caption uppercase tracking-wider mb-1">Last verified</div>
          <div className="text-text">
            <time dateTime={source.verified}>{source.verified}</time>
            {" · methodology "}
            <a href="/methodology/" className="text-brand hover:underline">
              {source.methodologyVersion}
            </a>
          </div>
        </div>
        <div>
          <div className="text-dim text-caption uppercase tracking-wider mb-1">JSON API</div>
          <a
            href={`/api/source/${source.slug}.json`}
            className="text-brand hover:underline font-mono text-body-sm break-all"
            data-citation="json-twin"
          >
            /api/source/{source.slug}.json
          </a>
        </div>
      </footer>

      {/* Cite this score — supports the LLM-citation 10-characteristic
          checklist's "Transactable" + "Recognizable" dimensions */}
      <section className="mt-10 p-5 rounded-card-lg border border-border bg-panel">
        <h2 className="text-heading-3 font-bold mb-3">Cite this score</h2>
        <p className="text-body-sm text-muted mb-3">
          Copy a citation snippet for an article, post, or research note.
        </p>
        <CiteSnippets
          name={source.name}
          slug={source.slug}
          score={idx.value}
          grade={idx.grade}
          methodologyVersion={source.methodologyVersion}
        />
      </section>

      {/* Day 24 — Comparator hub cross-link (when source has pairs) */}
      {hasComparators && (
        <section className="mt-10 p-5 rounded-card-lg border border-brand/30 bg-surface-brand">
          <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
            <h2 className="text-heading-3 font-bold">
              {compPairs.length === 1
                ? `1 head-to-head comparison`
                : `${compPairs.length} head-to-head comparisons`}
            </h2>
            <a
              href={`/source/${source.slug}/comparisons/`}
              className="text-caption text-brand hover:underline whitespace-nowrap"
            >
              See all {source.name} comparisons →
            </a>
          </div>
          <p className="text-body-sm text-muted">
            {source.name} appears in{" "}
            {compPairs.length === 1
              ? "one canonical SourceScore comparison"
              : `${compPairs.length} canonical SourceScore comparisons`}{" "}
            — each scored on Discipline, Modern Reference, and Velocity with a
            quote-ready verdict and JSON twin.
          </p>
        </section>
      )}

      {/* Day 29 — Peers hub cross-link (every source has one) */}
      <section className="mt-6 p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors">
        <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
          <h2 className="text-heading-3 font-bold">
            5 sources at {source.name}'s tier
          </h2>
          <a
            href={`/source/${source.slug}/peers/`}
            className="text-caption text-brand hover:underline whitespace-nowrap"
          >
            See peer group →
          </a>
        </div>
        <p className="text-body-sm text-muted">
          Auto-computed nearest-neighbor sources by composite SourceScore
          distance — discover at-tier peers across all categories, with
          inline dim deltas surfacing who beats {source.name} on Discipline,
          Modern Reference, and Velocity.
        </p>
      </section>

      {/* Embed snippet — Layer 5 archetype embeddable_widget × +80 */}
      <section className="mt-10 p-5 rounded-card-lg border border-border bg-panel">
        <div className="flex items-baseline justify-between mb-3 gap-3">
          <h2 className="text-heading-3 font-bold">Embed this score</h2>
          <a href="/embed/" className="text-caption text-brand hover:underline whitespace-nowrap">
            All embed options →
          </a>
        </div>
        <p className="text-body-sm text-muted mb-3">
          Drop on your blog or dashboard. Free, no signup.
        </p>
        <pre className="p-3 rounded-card border border-border bg-bg text-caption font-mono text-text overflow-x-auto leading-relaxed">
          {`<iframe src="https://sourcescore.org/embed/${source.slug}/" width="100%" height="380" loading="lazy" style="border:0;max-width:480px;" title="SourceScore: ${source.name}"></iframe>`}
        </pre>
      </section>

      {/* AEO FAQ — Frequently asked questions (mirrors faqLd JSON-LD for
          Google rich-result + AI Overview eligibility on per-source lookups
          per Part 14.4). Visible <details> accordion. */}
      <section className="mt-12">
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
    </article>
  );
}

function SubScoreCard({
  label,
  subTool,
  score,
}: {
  label: string;
  subTool: string;
  score: DimensionScore;
}) {
  return (
    <div className="p-4 rounded-card border border-border bg-panel">
      <div className="text-eyebrow text-dim mb-2">{label}</div>
      <div className="mb-3">
        <ScoreBadge value={score.value} grade={score.grade} label={label} size="md" />
      </div>
      <p className="text-body-sm text-muted leading-snug mb-3 line-clamp-3">{score.rationale}</p>
      <a href={subTool} className="text-caption text-brand hover:underline">
        About this sub-score →
      </a>
    </div>
  );
}

function CiteSnippets({
  name,
  slug,
  score,
  grade,
  methodologyVersion,
}: {
  name: string;
  slug: string;
  score: number;
  grade: string;
  methodologyVersion: string;
}) {
  const url = `https://sourcescore.org/source/${slug}/`;
  const apa = `SourceScore (${methodologyVersion}). (${new Date().getFullYear()}). ${name}: SourceScore Index ${score} (${grade}). Retrieved from ${url}`;
  const md = `[${name} — SourceScore Index ${score} (${grade})](${url})`;
  const html = `<a href="${url}">${name} — SourceScore Index ${score} (${grade})</a>`;

  return (
    <div className="space-y-3">
      <CiteRow label="Markdown" snippet={md} />
      <CiteRow label="HTML" snippet={html} />
      <CiteRow label="APA" snippet={apa} />
    </div>
  );
}

function CiteRow({ label, snippet }: { label: string; snippet: string }) {
  return (
    <div>
      <div className="text-eyebrow text-dim mb-1">{label}</div>
      <pre className="p-3 rounded-card border border-border bg-bg text-caption font-mono text-text overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
        {snippet}
      </pre>
    </div>
  );
}

function SignalGroup({ label, score }: { label: string; score: DimensionScore }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className="text-heading-3 font-semibold">{label}</h3>
        <ScoreBadge value={score.value} grade={score.grade} size="sm" />
      </div>
      <ul className="space-y-2">
        {score.signals.map((sig, i) => (
          <li key={i} className="pl-4 border-l-2 border-border-bright">
            <div className="text-body-sm font-semibold text-text">{sig.label}</div>
            <div className="text-body-sm text-muted leading-snug">{sig.detail}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
