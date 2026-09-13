import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";
import { CitationDeskCTA } from "@/components/CitationDeskCTA";

export const metadata: Metadata = {
  title: { absolute: "SourceScore — the AI-Citation Quality Index" },
  description:
    "Score any source on Discipline, Modern Reference fitness, and Citation Velocity. Reference index for AI-citation quality.",
  alternates: { canonical: "https://sourcescore.org/" },
};

export default function HomePage() {
  // Top 5 by Index for the hero leaderboard.
  const top = [...sources].sort((a, b) => b.scores.index.value - a.scores.index.value).slice(0, 5);
  // Below-fold table: top 25 only. The full 133-row table shipped 624 KB HTML +
  // a duplicated ~373 KB RSC hydration blob (3,697 DOM nodes) on every homepage
  // load — a site-wide CWV drag. Full list lives at /sources/ (zero content loss).
  const sorted = [...sources].sort((a, b) => b.scores.index.value - a.scores.index.value);
  const all = sorted.slice(0, 25);

  // Dataset schema — the homepage IS a leaderboard dataset of scored sources.
  // Aleyda Solis 10-char LLM-citation checklist #4 (Extractable) + #2 (Useful).
  // Mirrors the holdlens.com investor-page + secfilingdex.com filer-page +
  // fermentcalc.com vegetable-page Dataset patterns from 2026-05-08.
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": "https://sourcescore.org/#dataset",
    name: "SourceScore Index — AI-Citation Quality Leaderboard",
    description: `Composite citation-quality score (0–100, A+ to D grade) for ${all.length} reference sources, computed as a weighted mean of Citation Discipline (35%), Modern Reference fitness (30%), and Citation Velocity (35%). Methodology v0.1, sources hand-scored.`,
    url: "https://sourcescore.org/",
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
    isAccessibleForFree: true,
    keywords: [
      "AI citation quality",
      "source ranking",
      "RAG retrieval",
      "Citation Discipline",
      "Modern Reference",
      "Citation Velocity",
      "LLM source quality",
      "structured-data fitness",
    ],
    variableMeasured: [
      { "@type": "PropertyValue", name: "SourceScore Index (composite, 0-100)" },
      { "@type": "PropertyValue", name: "Citation Discipline sub-score (0-100)" },
      { "@type": "PropertyValue", name: "Modern Reference sub-score (0-100)" },
      { "@type": "PropertyValue", name: "Citation Velocity sub-score (0-100)" },
      { "@type": "PropertyValue", name: "Letter grade (A+ to D)" },
      { "@type": "PropertyValue", name: "Source category (publisher type)" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/html",
        contentUrl: "https://sourcescore.org/sources/",
      },
    ],
  };

  // SoftwareApplication schema — declares the VERITAS API product alongside
  // the source-rating index. Unlocks rich snippets on "claim verification API"
  // SERPs + signals product surface to LLM crawlers (Aleyda Solis 10-char #4
  // Extractable + #7 Credible).
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SourceScore VERITAS",
    description:
      "Claim catalog API for LLM developers. Returns hand-verified AI/ML claims with cited primary evidence, SourceScore-issued HMAC integrity metadata, and stable JSON envelopes. 384 claims spanning 1997-2025.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: "https://sourcescore.org/claims/",
    softwareVersion: "v0.1",
    datePublished: "2026-05-16",
    publisher: {
      "@type": "Organization",
      name: "SourceScore",
      url: "https://sourcescore.org/",
    },
    offers: {
      "@type": "Offer",
      name: "Free tier",
      price: "0",
      priceCurrency: "EUR",
      url: "https://sourcescore.org/pricing/",
      description: "Free public access with no auth, signup, or account-level meter",
    },
    featureList: [
      "384 hand-verified AI/ML claims",
      "SourceScore-issued HMAC integrity metadata",
      "Every claim cites primary evidence; 368 of 384 include two or more sources",
      "Free public API with no signup",
      "OpenAPI 3.1 specification",
      "Drop-in integrations for LangChain, LlamaIndex, OpenAI tools, Vercel AI SDK, DSPy, Pydantic AI, Anthropic SDK",
      "Public read and semantic-match endpoints",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />

      {/* VERITAS-Reborn launch banner ────────────────────────────────
          Day 1 of the dual-surface pivot (2026-05-16). Slim, dismissable-
          looking strip above the hero — preserves source-rating brand
          gravity for existing LLM-citation cache while signaling the new
          dev-facing API product. */}
      <a
        href="/claims/"
        data-clarity-upgrade="veritas-launch-banner"
        className="block border-b border-brand/30 bg-brand/5 hover:bg-brand/10 transition-colors" data-event="veritas_banner_click"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 text-body-sm">
          <span className="px-2 py-0.5 rounded-pill bg-brand/15 text-brand text-caption font-mono uppercase tracking-wide whitespace-nowrap">
            New · v0.1
          </span>
          <span className="text-text flex-grow">
            <strong>VERITAS claim catalog API</strong> — curated, sourced
            AI/ML records for evidence retrieval. Free public access · no auth.
          </span>
          <span className="text-brand whitespace-nowrap hidden sm:inline">
            Browse claims →
          </span>
        </div>
      </a>

      {/* HERO ────────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10 sm:pt-20 sm:pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill border border-brand/30 bg-surface-brand text-brand text-caption font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
            <span>Methodology v0.1 · {sources.length} sources scored · 384 claim records</span>
          </div>

          <h1 className="text-display-1 sm:text-[3.5rem] sm:leading-[1.05] font-bold tracking-tight max-w-4xl">
            How citable is any source <span className="text-brand">in the AI era?</span>
          </h1>

          <p className="mt-5 text-body-lg text-muted max-w-2xl leading-relaxed">
            SourceScore checks any URL against an index built from three published
            citation-quality signals: how rigorously the source cites others, how
            fit it is as a modern citation, and how often tier-1 publications cite
            it. Indexed sources return a grade; unknown sources are labeled honestly.
          </p>

          {/* Hero lookup — completes the "paste a URL" promise end-to-end.
              Plain GET form → the URL-aware /search (which normalizes a pasted
              URL to its domain). Zero JS, works without hydration; known sources
              resolve to their score, unknown domains get an honest "not scored
              yet" panel. */}
          <form action="/check" method="get" className="mt-8 max-w-2xl" data-event="source_check_start" data-event-source="home">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="search"
                name="q"
                inputMode="url"
                autoComplete="off"
                placeholder="Paste a URL or source name — e.g. reuters.com"
                aria-label="Check a source's SourceScore"
                className="flex-1 px-4 py-3 rounded-card border border-border bg-panel text-text placeholder-dim focus:border-brand focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-card border border-brand/50 bg-surface-brand text-brand font-semibold hover:bg-panel-hi transition-colors whitespace-nowrap"
              >
                Check source →
              </button>
            </div>
            <p className="mt-2 text-caption text-dim">
              Matches against {sources.length} hand-scored sources — unknown domains show how to get scored.
            </p>
          </form>

          {/* Sub-tool cards — the 4-concept bundle */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                href: "/",
                label: "SourceScore Index",
                desc: "Composite weighted grade across all three sub-scores.",
                badge: "Composite",
                event: "Index",
              },
              {
                href: "/discipline/",
                label: "Citation Discipline",
                desc: "How rigorously a source cites its own evidence.",
                badge: "Score",
                event: "Discipline",
              },
              {
                href: "/modern-reference/",
                label: "Modern Reference",
                desc: "Fitness as a citation in 2026+ AI-era writing.",
                badge: "Reference",
                event: "ModernReference",
              },
              {
                href: "/velocity/",
                label: "Citation Velocity",
                desc: "How often tier-1 sources cite this URL per week.",
                badge: "Tracker",
                event: "Velocity",
              },
            ].map((t) => (
              <a
                key={t.href}
                href={t.href}
                data-clarity-upgrade={`hero-subtool-${t.event.toLowerCase()}`}
                className={`group block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 hover:shadow-hover-lift transition-all`} data-event="hero_subtool_click" data-event-tool={t.event}
              >
                <div className="text-eyebrow text-brand mb-1.5">{t.badge}</div>
                <div className="font-semibold text-text mb-1.5 group-hover:text-brand transition-colors">
                  {t.label}
                </div>
                <div className="text-body-sm text-muted leading-snug">{t.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOP-5 LEADERBOARD ─────────────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="text-heading-1 font-bold tracking-tight">Top 5 by SourceScore Index</h2>
            <a
              href="/sources/"
              className="text-body-sm text-brand hover:underline whitespace-nowrap"
            >
              See all {sources.length} sources →
            </a>
          </div>

          <ol className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {top.map((s, i) => (
              <li key={s.slug}>
                <a
                  href={`/source/${s.slug}/`}
                  data-clarity-upgrade={`top5-rank-${i + 1}`}
                  className={`block h-full p-4 rounded-card border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 hover:shadow-hover-lift transition-all`} data-event="top5_click" data-event-rank={i + 1}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-eyebrow text-dim">#{i + 1}</span>
                    <ScoreBadge
                      value={s.scores.index.value}
                      grade={s.scores.index.grade}
                      label="SourceScore Index"
                      size="sm"
                    />
                  </div>
                  <div className="font-semibold text-text leading-tight mb-1">{s.name}</div>
                  <div className="text-caption text-muted font-mono mb-2.5">{s.domain}</div>
                  <div className="text-body-sm text-muted leading-snug line-clamp-2">{s.summary}</div>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FULL TABLE ───────────────────────────────────────────────── */}
      <section className="border-t border-border" id="full-table">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-heading-1 font-bold tracking-tight mb-2">Top 25 sources</h2>
          <p className="text-body text-muted mb-6 max-w-2xl">
            The 25 highest-scoring of {sources.length} hand-scored sources. Each row links to the full
            breakdown with the underlying signals you can re-derive —{" "}
            <a href="/sources/" className="text-brand hover:underline">browse all {sources.length} sources</a>.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-card border border-border bg-panel">
            <table className="min-w-full text-body-sm">
              <thead className="text-caption uppercase tracking-wider text-dim border-b border-border-bright">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Source</th>
                  <th className="text-left font-semibold px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-right font-semibold px-4 py-3">Index</th>
                  <th className="text-right font-semibold px-4 py-3 hidden md:table-cell">Discipline</th>
                  <th className="text-right font-semibold px-4 py-3 hidden md:table-cell">Modern</th>
                  <th className="text-right font-semibold px-4 py-3 hidden lg:table-cell">Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {all.map((s) => (
                  <tr key={s.slug} className="hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <a href={`/source/${s.slug}/`} className="block hover:text-brand">
                        <div className="font-semibold text-text">{s.name}</div>
                        <div className="text-caption text-dim font-mono">{s.domain}</div>
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted hidden sm:table-cell">{s.category}</td>
                    <td className="px-4 py-3 text-right">
                      <ScoreBadge
                        value={s.scores.index.value}
                        grade={s.scores.index.grade}
                        label="Index"
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <ScoreBadge
                        value={s.scores.discipline.value}
                        grade={s.scores.discipline.grade}
                        label="Discipline"
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <ScoreBadge
                        value={s.scores.modernReference.value}
                        grade={s.scores.modernReference.grade}
                        label="Modern Reference"
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <ScoreBadge
                        value={s.scores.velocity.value}
                        grade={s.scores.velocity.grade}
                        label="Velocity"
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* VERITAS-Reborn product surface ───────────────────────────── */}
      <section className="border-t border-border bg-panel">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill border border-brand/30 bg-surface-brand text-brand text-caption font-mono mb-6">
            <span>New · v0.1 · API in beta</span>
          </div>
          <h2 className="text-heading-1 font-bold tracking-tight mb-3 max-w-3xl">
            Verified claims for grounded LLM retrieval
          </h2>
          <p className="text-body-lg text-muted max-w-3xl leading-relaxed mb-8">
            <strong className="text-text">VERITAS</strong> publishes curated,
            sourced claim records about AI/ML research through a developer API. Every
            claim cites primary evidence; 368 of the current 384 claims have
            two or more sources. Records include SourceScore-issued HMAC
            integrity metadata and a stable JSON envelope. Use a returned match
            as a candidate for evidence review—not as an automated truth verdict.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              {
                label: "Browse claims",
                desc: "Indexed catalog of verified facts.",
                href: "/claims/",
                badge: "Catalog",
                event: "catalog",
              },
              {
                label: "API docs",
                desc: "curl + JS + Python examples for every endpoint.",
                href: "/docs/",
                badge: "Docs",
                event: "docs",
              },
              {
                label: "Pricing",
                desc: "Free public API · proposed higher-volume offers are a demand test.",
                href: "/pricing/",
                badge: "Pricing",
                event: "pricing",
              },
            ].map((t) => (
              <a
                key={t.href}
                href={t.href}
                data-clarity-upgrade={`veritas-cta-${t.event}`}
                className={`group block p-4 rounded-card border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 hover:shadow-hover-lift transition-all`} data-event="veritas_cta" data-event-target={t.event}
              >
                <div className="text-eyebrow text-brand mb-1.5">{t.badge}</div>
                <div className="font-semibold text-text mb-1.5 group-hover:text-brand transition-colors">
                  {t.label} →
                </div>
                <div className="text-body-sm text-muted leading-snug">{t.desc}</div>
              </a>
            ))}
          </div>

          <details className="text-body-sm text-muted max-w-3xl">
            <summary className="cursor-pointer text-text font-semibold hover:text-brand">
              How it&rsquo;s different from a search engine
            </summary>
            <div className="mt-3 space-y-3 leading-relaxed">
              <p>
                Search engines optimize for ranking documents. VERITAS
                optimizes for verifying <em>specific atomic claims</em>:
                subject + predicate + object + sources + signed envelope.
                Built for the &ldquo;is X true and what&rsquo;s the
                citation?&rdquo; problem LLM apps hit at every retrieval
                step.
              </p>
              <p>
                Claim records have a stable id (16-hex-char hash over canonical
                fields), SourceScore-issued HMAC integrity metadata, and a CC-BY
                4.0 license. The HMAC tag is not a publicly independently
                verifiable signature; use HTTPS and the canonical record when
                checking a published claim.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* WHAT IS THIS — explainer ─────────────────────────────────── */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-heading-1 font-bold tracking-tight mb-4">
            What does &ldquo;AI-Citation Quality&rdquo; mean?
          </h2>
          <div className="prose prose-invert max-w-none text-body text-muted leading-relaxed space-y-4">
            <p>
              When ChatGPT, Claude, or Perplexity answer a question, they pull from a small subset of sources
              they consider trustworthy. Two factors decide whether a source makes that subset:
              <strong className="text-text"> citation discipline</strong> (does the source rigorously cite its own evidence?) and
              <strong className="text-text"> modern reference fitness</strong> (is the source structured for machine retrieval — schema markup,
              freshness signals, machine-readable archives?).
            </p>
            <p>
              SourceScore measures both, plus
              <strong className="text-text"> citation velocity</strong> (how often the source is cited by other tier-1 sources per week).
              Together these three sub-scores compose the
              <strong className="text-text"> SourceScore Index</strong> &mdash; a single 0&ndash;100 grade per source.
            </p>
            <p>
              We ship {sources.length} hand-scored sources at this stage of v0.1. Methodology is intentionally
              transparent: every score has explicit signals you can re-derive. The production index will
              expand to 10,000+ sources via the same methodology, with weekly velocity refreshes and
              quarterly discipline re-audits.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/methodology/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand hover:bg-brand/15 transition-colors text-body-sm font-semibold"
            >
              Read the full methodology →
            </a>
            <a
              href="/blog/how-to-tell-if-a-source-is-reliable/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-text transition-colors text-body-sm"
            >
              How to tell if a source is reliable →
            </a>
            <a
              href="/about/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-text transition-colors text-body-sm"
            >
              About SourceScore
            </a>
          </div>
        </div>
      </section>

      {/* CitationDesk funnel ──────────────────────────────────────────
          SourceScore = FREE top-of-funnel for CitationDesk (2026-06-19
          strategic decision). Honest audience-fit bridge: you measure how
          citable OTHER sources are → CitationDesk measures how citable YOUR
          site is to AI engines. */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <CitationDeskCTA variant="panel" source="home" />
        </div>
      </section>
    </>
  );
}
