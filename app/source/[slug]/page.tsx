import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSource, allSlugs } from "@/data/sources";
import { comparisonsForSource } from "@/data/comparisons";
import { ScoreBadge } from "@/components/ScoreBadge";
import type { DimensionScore } from "@/lib/types";

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
  const title = `${s.name} — SourceScore ${idx.grade} (${idx.value}/100)`;
  const description = `${s.name} (${s.domain}) scores ${idx.value}/100 on the SourceScore Index. ${idx.rationale}`;

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
      </header>

      {/* INDEX HERO — the headline number ─────────────────────────── */}
      <section className="mb-10 p-6 sm:p-8 rounded-card-lg border border-border bg-panel">
        <div className="text-eyebrow text-dim mb-3">SourceScore Index</div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-4">
          <ScoreBadge value={idx.value} grade={idx.grade} label="SourceScore Index" size="lg" />
          <span className="text-muted text-body-sm">
            Composite weighted across Discipline, Modern Reference, and Velocity.
          </span>
        </div>
        <p className="text-body-lg text-text leading-relaxed">{idx.rationale}</p>
      </section>

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
