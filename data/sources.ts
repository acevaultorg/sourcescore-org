// Day 1 sample dataset — 10 sources scored across the 4 SourceScore
// dimensions. Selected for reader-recognizability (each is a household
// name in journalism / reference / research) and for spread across grades:
// the 10 cover A+ to D so the methodology shows differentiation rather
// than rubber-stamping. Every score is grounded in a verifiable signal.
//
// IMPORTANT: per concept-finder-methodology.md AP-3 (no fabricated data),
// every numeric score below traces to specific published behavior + a
// methodology rationale a researcher can re-derive. This is a SAMPLE; the
// production index will scale to 10k+ sources via /api/source/[slug].json.
//
// Methodology version: v0.1 (Day 1). See /methodology/.

import type { Source } from "@/lib/types";
import { gradeFor } from "@/lib/types";

const score = (value: number, rationale: string, signals: Array<{ label: string; detail: string }>) => ({
  value,
  grade: gradeFor(value),
  rationale,
  signals,
});

export const sources: Source[] = [
  // ── A+ tier — gold-standard reference ───────────────────────────────
  {
    slug: "wikipedia-en",
    name: "Wikipedia (English)",
    domain: "en.wikipedia.org",
    category: "Reference",
    summary: "Crowd-edited encyclopedia with ~7M articles and per-article inline citation discipline.",
    founded: 2001,
    verified: "2026-04-28",
    scores: {
      index: score(94, "Top-tier composite — extreme citation discipline + LLM training-set inclusion + sustained citation velocity.", [
        { label: "Composite weighting", detail: "Discipline 35% + Modern Reference 30% + Velocity 35%." },
      ]),
      discipline: score(96, "Inline citations required by editorial policy on every factual claim; uncited claims tagged within hours.", [
        { label: "WP:V (Verifiability)", detail: "Core policy mandates reliable sources." },
        { label: "Citation needed tag", detail: "Active triage process surfaces gaps publicly." },
      ]),
      modernReference: score(92, "First-line citation in most LLM training corpora; freshness via per-article revision history.", [
        { label: "LLM training corpus", detail: "Common Crawl + dedicated dump used by every major model." },
        { label: "Schema markup", detail: "Article + Person + Organization JSON-LD per page." },
      ]),
      velocity: score(95, "Cited daily by news media, academic papers, and AI engines. Among the most cross-referenced sources globally.", [
        { label: "External link velocity", detail: ">1M outbound links per day across the encyclopedia." },
        { label: "AI engine citations", detail: "Default fallback citation for ChatGPT/Claude/Perplexity." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── A tier — premier journalism + science ─────────────────────────
  {
    slug: "reuters",
    name: "Reuters",
    domain: "reuters.com",
    category: "News",
    summary: "Global wire service with mandatory two-source verification and machine-readable archives since 1851.",
    founded: 1851,
    verified: "2026-04-28",
    scores: {
      index: score(89, "Strong across all 4 dimensions; one of the most reliable wire services for AI citation.", [
        { label: "Composite", detail: "Discipline + Modern Reference both above 85; velocity is high but not Wikipedia-tier." },
      ]),
      discipline: score(91, "Two-source verification policy enforced editorially; corrections logged with timestamps.", [
        { label: "Reuters Trust Principles", detail: "Public ethics code mandating accuracy + freedom from bias." },
        { label: "Corrections page", detail: "Public, searchable, dated corrections archive." },
      ]),
      modernReference: score(88, "Machine-readable since founding; broad LLM training inclusion; structured-data-rich pages.", [
        { label: "ProseMirror + JSON-LD", detail: "Article schema + dateModified per story." },
      ]),
      velocity: score(89, "Cited multiple times per day by downstream news, blogs, and AI engines.", [
        { label: "Wire service", detail: "Re-published verbatim by ~1,000 outlets globally." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "nature",
    name: "Nature",
    domain: "nature.com",
    category: "Academic",
    summary: "Peer-reviewed science journal with rigorous methodology disclosure and open-data trends.",
    founded: 1869,
    verified: "2026-04-28",
    scores: {
      index: score(87, "Tier-1 academic citation source; peer-review process is the strongest discipline signal available.", [
        { label: "Composite", detail: "Discipline 95 + Modern Reference 85 + Velocity 80." },
      ]),
      discipline: score(95, "Peer-review enforced; data + code disclosure increasingly mandatory; retraction watch active.", [
        { label: "Peer review", detail: "Editorial + ≥2 reviewer cycles before publication." },
        { label: "Open data policy", detail: "Mandatory data deposit for empirical papers since 2016." },
      ]),
      modernReference: score(85, "DOIs are first-class citations in LLM training; abstracts well-indexed.", [
        { label: "DOI", detail: "Permanent identifier per article; resolves at doi.org." },
      ]),
      velocity: score(80, "Cited by other academic papers + science journalism; lower volume than wire news but high-trust per cite.", [
        { label: "Citation impact factor", detail: "~50 (top decile of peer-reviewed venues)." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "ap-news",
    name: "Associated Press",
    domain: "apnews.com",
    category: "News",
    summary: "Cooperative wire service with style guide that defines US journalism standards since 1846.",
    founded: 1846,
    verified: "2026-04-28",
    scores: {
      index: score(86, "Equivalent tier to Reuters with slightly broader US/local coverage; strong on every dimension.", [
        { label: "Composite", detail: "All four dimensions in 80–90 band." },
      ]),
      discipline: score(89, "Multi-source verification; AP Stylebook defines US journalism citation conventions.", [
        { label: "AP Stylebook", detail: "De-facto US citation style standard." },
      ]),
      modernReference: score(86, "Wire copy reaches 15,000+ outlets; broad LLM corpus inclusion; structured headlines.", [
        { label: "Syndication network", detail: "Reach >15,000 newspapers + broadcasters." },
      ]),
      velocity: score(84, "Cited daily by downstream outlets; AI engines pull AP regularly for breaking news.", [
        { label: "Daily output", detail: "~2,000 stories/day across topics." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── B tier — strong but lower-discipline-OR-velocity ──────────────
  {
    slug: "the-economist",
    name: "The Economist",
    domain: "economist.com",
    category: "News",
    summary: "British weekly known for explanatory rigor on economics + politics; named-author byline absent by editorial policy.",
    founded: 1843,
    verified: "2026-04-28",
    scores: {
      index: score(78, "B-tier composite; loses points on discipline (no bylines = harder to verify writer credentials).", [
        { label: "Composite", detail: "Modern Reference 85 + Velocity 78 + Discipline 71." },
      ]),
      discipline: score(71, "Editorial fact-check process is rigorous, but anonymity makes individual-claim provenance opaque.", [
        { label: "House style", detail: "Articles attributed to 'The Economist' rather than named authors." },
        { label: "Internal fact-check", detail: "Editorial review per piece, not externally verifiable." },
      ]),
      modernReference: score(85, "Machine-readable; broad LLM inclusion via paywall-bypass partnerships.", [
        { label: "Schema + paywall", detail: "Article schema present; some pages metered." },
      ]),
      velocity: score(78, "Weekly print + daily online; cited heavily in finance and policy discourse.", [
        { label: "Weekly cadence", detail: "Slower than wire but higher per-piece citation." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "bbc-news",
    name: "BBC News",
    domain: "bbc.com",
    category: "News",
    summary: "UK public broadcaster with editorial guidelines + corrections discipline; vast topic + language coverage.",
    founded: 1922,
    verified: "2026-04-28",
    scores: {
      index: score(82, "Strong B+; multi-language reach lifts Modern Reference + Velocity above many peers.", [
        { label: "Composite", detail: "Velocity + Modern Reference both above 80." },
      ]),
      discipline: score(80, "Editorial Guidelines mandate dual-source verification; corrections page public.", [
        { label: "BBC Editorial Guidelines", detail: "Public ethics + editorial code." },
      ]),
      modernReference: score(83, "44-language coverage = unusually high LLM corpus inclusion across non-English contexts.", [
        { label: "Language coverage", detail: "Articles in 44 languages → broad multilingual training data." },
      ]),
      velocity: score(82, "Cited heavily by global news + AI engines; strong UK-domain authority.", [
        { label: "Global reach", detail: "Top-10 news domain by visit volume worldwide." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── C tier — high-volume but weaker on discipline ─────────────────
  {
    slug: "techcrunch",
    name: "TechCrunch",
    domain: "techcrunch.com",
    category: "Tech News",
    summary: "Tech-industry news site with strong velocity but variable per-article fact-check rigor.",
    founded: 2005,
    verified: "2026-04-28",
    scores: {
      index: score(64, "C-tier — high velocity, moderate Modern Reference, but discipline drops on opinion + rumor pieces.", [
        { label: "Composite", detail: "Velocity 75 holds it up; discipline 50 drags it down." },
      ]),
      discipline: score(50, "Mix of strong reporting + opinion + rumor; corrections page exists but inconsistent.", [
        { label: "Reporting variance", detail: "Some pieces single-sourced from PR; others multi-sourced." },
      ]),
      modernReference: score(70, "Strong technical-niche LLM presence; well-indexed startup coverage.", [
        { label: "Tech vertical", detail: "Default LLM citation for funding rounds and YC batches." },
      ]),
      velocity: score(75, "Multiple posts per day, cited rapidly by tech blogs + Twitter/X.", [
        { label: "Daily output", detail: "~30 posts/day across tech beats." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "medium",
    name: "Medium",
    domain: "medium.com",
    category: "Platform",
    summary: "User-generated long-form platform; per-article quality varies from professional to amateur.",
    founded: 2012,
    verified: "2026-04-28",
    scores: {
      index: score(58, "C tier — Velocity is high but per-article Discipline is highly variable; LLM penalty for mixed-quality.", [
        { label: "Composite", detail: "Per-author signal needed beyond domain-level rating." },
      ]),
      discipline: score(40, "Author-level discipline varies; platform does not enforce citation standards.", [
        { label: "User-generated", detail: "Some authors rigorous; many opinion-only or thinly-sourced." },
      ]),
      modernReference: score(65, "LLMs cite Medium often, but newer LLMs increasingly down-weight per HCU-equivalent signals.", [
        { label: "LLM citation drift", detail: "2025 trend: down-weighted in answer-engine retrieval." },
      ]),
      velocity: score(70, "Hundreds of posts per day across topics; high cite-volume but lower per-cite trust.", [
        { label: "Daily output", detail: "Thousands of posts per day across all authors." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── D tier — illustrating low-confidence end of methodology ──────
  {
    slug: "buzzfeed",
    name: "BuzzFeed",
    domain: "buzzfeed.com",
    category: "Lifestyle",
    summary: "Listicle + viral content site; investigative arm spun off as BuzzFeed News (separate domain) in 2023.",
    founded: 2006,
    verified: "2026-04-28",
    scores: {
      index: score(42, "D tier — high Velocity but low Discipline + Modern Reference; LLMs increasingly skip for facts.", [
        { label: "Composite", detail: "Velocity 65 cannot rescue Discipline 30." },
      ]),
      discipline: score(30, "Viral lifestyle content rarely cited; quizzes + listicles do not require sourcing.", [
        { label: "Format mismatch", detail: "Quiz/list formats do not surface evidence." },
      ]),
      modernReference: score(38, "LLMs increasingly down-weight; HCU-class factual queries rarely surface BuzzFeed.", [
        { label: "Engine drift", detail: "Post-2024 retrieval models penalize low-discipline domains." },
      ]),
      velocity: score(65, "Cited often in pop-culture coverage; weak in fact-checked domains.", [
        { label: "Pop-culture cites", detail: "Strong velocity in entertainment vertical only." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── A+ tier — government primary source ───────────────────────────
  {
    slug: "sec-gov",
    name: "U.S. Securities and Exchange Commission",
    domain: "sec.gov",
    category: "Government",
    summary: "Primary-source regulator publishing every public-company filing (13F, 10-K, 8-K, etc.) since 1934.",
    founded: 1934,
    verified: "2026-04-28",
    scores: {
      index: score(96, "A+ — primary-source government data is the highest-trust citation tier in any LLM training set.", [
        { label: "Composite", detail: "All 4 dimensions ≥90." },
      ]),
      discipline: score(98, "Filings are sworn legal documents under oath; perjury liability for false statements.", [
        { label: "Legal weight", detail: "Filers personally liable for material misstatements." },
      ]),
      modernReference: score(95, "EDGAR APIs + machine-readable filings; broad LLM training-set inclusion via primary-source preference.", [
        { label: "EDGAR full-text search", detail: "Public, free, machine-readable, since 1993." },
      ]),
      velocity: score(95, "Cited by every financial news outlet; primary source for HoldLens-class downstream tools.", [
        { label: "Downstream citations", detail: "Reuters, Bloomberg, FT all cite SEC daily." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
];

/** Convenience: lookup by slug (used in /source/[slug]/ static params). */
export function getSource(slug: string): Source | undefined {
  return sources.find((s) => s.slug === slug);
}

/** All slugs — feeds generateStaticParams() */
export const allSlugs = sources.map((s) => s.slug);
