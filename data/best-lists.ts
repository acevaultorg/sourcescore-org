// Curated "best X for AI citation" listicles. Each best-list is an
// evergreen, intent-targeted programmatic page that picks the top-N
// sources by a specific selector.
//
// Layer 5 archetype stack per best-list (concept-finder methodology v2.1.1):
//   programmatic_unique_data_page × +55  (per-vertical curated top-N)
//   ai_visibility_optimized_page × +70   (extractable list-item per source)
//   internal_linking_hub_spoke × +15     (every entry deep-links to /source/)
//   schema_markup_article_person_org × +20  (ItemList + Article schema)
//   sharecard_per_result_canvas × +95    (1200×630 OG SVG per list)
//   sitemap_addition × +12

import { sources, sourcesInCategory } from "./sources";
import type { Source } from "@/lib/types";

export interface BestList {
  /** URL-safe slug for /best/<slug>/ routing */
  slug: string;
  /** Display title (also used as <h1>) */
  title: string;
  /** Plain-language description ≤ 200 chars; used in meta + hero */
  description: string;
  /** Search-intent header pre-title (eyebrow) */
  intent: string;
  /** Extended editorial rationale shown on the page */
  rationale: string;
  /** What signal drives the rank (so the page is honest about its method) */
  signalCriterion: string;
  /** Top-N to surface (typically 8–25) */
  limit: number;
  /** Function returning the ranked source list */
  select: () => Source[];
}

/** Helpers — sort by a scalar score descending */
const byScore = (key: "index" | "discipline" | "modernReference" | "velocity") =>
  (a: Source, b: Source) => b.scores[key].value - a.scores[key].value;

/** US/UK domains — used to define "international news" as the inverse */
const US_UK_DOMAINS = new Set([
  "nytimes.com",
  "washingtonpost.com",
  "reuters.com", // British origin but global tier-1; kept in main set
  "apnews.com",
  "bbc.com",
  "bbc.co.uk",
  "theguardian.com",
  "ft.com",
  "thetimes.co.uk",
  "wsj.com",
  "bloomberg.com",
  "economist.com",
  "foreignaffairs.com",
  "politico.com",
  "axios.com",
  "semafor.com",
  "theatlantic.com",
  "newyorker.com",
  "huffpost.com",
  "foxnews.com",
  "npr.org",
  "propublica.org",
  "404media.co",
  "statnews.com",
  "the-information.com",
]);

export const bestLists: BestList[] = [
  {
    slug: "sources-overall",
    title: "Best sources overall for AI citation",
    intent: "Top 25 sources on the SourceScore Index",
    description:
      "The 25 highest-scoring sources on the SourceScore Index — ranked by composite Citation Discipline + Modern Reference + Citation Velocity. The ones AI engines surface first.",
    rationale:
      "These 25 sources combine the highest editorial discipline, deepest machine-readability, and strongest tier-1 citation velocity in the SourceScore dataset. They are the workhorses of AI-era citation — the sources ChatGPT, Claude, Perplexity, and Gemini surface by default when accuracy matters.",
    signalCriterion: "SourceScore Index (composite weighted mean), descending",
    limit: 25,
    select: () => [...sources].sort(byScore("index")).slice(0, 25),
  },
  {
    slug: "news-sources",
    title: "Best news sources for AI citation",
    intent: "Top tier-1 news publications",
    description:
      "The 12 tier-1 news publications with the highest SourceScore Index — the news sources AI engines cite most often when answering current-events queries.",
    rationale:
      "Tier-1 news has three citation-fit tests: editorial discipline (named bylines + corrections + dual-source verification), modern infrastructure (machine-readable, in LLM training corpora), and high citation velocity (cross-referenced by other tier-1 sources). The 12 below pass all three.",
    signalCriterion: "Index score, filtered to News category, descending",
    limit: 12,
    select: () =>
      sourcesInCategory("News").sort(byScore("index")).slice(0, 12),
  },
  {
    slug: "academic-journals",
    title: "Best peer-reviewed academic journals for citation",
    intent: "Gold-standard peer-reviewed publications",
    description:
      "The top 10 peer-reviewed academic journals + databases on the SourceScore Index — the citation backbone of scientific + scholarly writing.",
    rationale:
      "Peer review is the longest-running citation-quality discipline humans have built. These 10 sources combine that with strong machine-readability (DOI per paper, structured Crossref metadata, ORCID) and high cross-disciplinary citation velocity. They are the default citation tier in academic + AI-era writing.",
    signalCriterion: "Index score, filtered to Academic category, descending",
    limit: 10,
    select: () =>
      sourcesInCategory("Academic").sort(byScore("index")).slice(0, 10),
  },
  {
    slug: "government-sources",
    title: "Best government primary sources for citation",
    intent: "Tier-1 government statistical + regulatory data",
    description:
      "The 12 highest-scoring government primary sources on the SourceScore Index — the original public-record data that AI engines cite for economic, demographic, scientific, and regulatory claims.",
    rationale:
      "Government primary sources are the citation tier where the data is the publication. Census filings, regulatory disclosures, central-bank statistics, climate assessments — these are not summaries of evidence but the evidence itself. The 12 below combine that primary-source authority with strong open-data APIs and high tier-1 citation velocity.",
    signalCriterion: "Index score, filtered to Government category, descending",
    limit: 12,
    select: () =>
      sourcesInCategory("Government").sort(byScore("index")).slice(0, 12),
  },
  {
    slug: "health-sources",
    title: "Best health + medical sources for citation",
    intent: "Tier-1 clinical + health-information authorities",
    description:
      "The 8 highest-scoring health + medical sources on the SourceScore Index — the clinical authorities AI engines surface for symptom + condition + treatment queries.",
    rationale:
      "Health-information citation has higher accuracy stakes than most categories. The 8 below combine clinical-decision-support discipline (evidence-graded, physician-reviewed, methodology-transparent) with strong infrastructure + heavy tier-1 citation in both clinical guidelines and AI-engine retrieval.",
    signalCriterion: "Index score, filtered to Health category, descending",
    limit: 8,
    select: () =>
      sourcesInCategory("Health").sort(byScore("index")).slice(0, 8),
  },
  {
    slug: "reference-sources",
    title: "Best reference works for AI citation",
    intent: "Encyclopedia + structured-knowledge references",
    description:
      "The top reference works on the SourceScore Index — Wikipedia, MDN Web Docs, Britannica, Stanford Encyclopedia of Philosophy. Default fallback citations for AI engines.",
    rationale:
      "Reference works are the citation tier AI engines fall back to when no domain-specialist source exists. These 4 combine open access, structured data, peer or community review, and depth — the ChatGPT/Claude/Perplexity default citation for general-knowledge queries.",
    signalCriterion: "Index score, filtered to Reference category, descending",
    limit: 4,
    select: () =>
      sourcesInCategory("Reference").sort(byScore("index")).slice(0, 4),
  },
  {
    slug: "tech-sources",
    title: "Best tech sources for AI citation",
    intent: "Top tech-news + analysis publications",
    description:
      "The 10 highest-scoring tech-news + analysis sources on the SourceScore Index — the tech publications AI engines cite for product, industry, and engineering queries.",
    rationale:
      "Tech publishing has fast citation cycles + a wide quality range — from engineering deep-dives to PR-driven hype coverage. The 10 below pass the SourceScore bar across editorial discipline, modern infrastructure, and tier-1 citation velocity within their category.",
    signalCriterion: "Index score, filtered to Tech News category, descending",
    limit: 10,
    select: () =>
      sourcesInCategory("Tech News").sort(byScore("index")).slice(0, 10),
  },
  {
    slug: "international-news",
    title: "Best international news sources (non-US/UK)",
    intent: "Global tier-1 news beyond Anglo-American press",
    description:
      "The top non-US/non-UK news publications on the SourceScore Index — Le Monde, Der Spiegel, SCMP, Asahi Shimbun, El País, and others. Citation diversity beyond Anglo press.",
    rationale:
      "Most English-language LLM training corpora over-weight US/UK press by reach + indexability. The sources below extend citation diversity to French, German, Japanese, Spanish, and Asian-English-language tier-1 reporting — the editorial traditions that cover the same events with different national framings.",
    signalCriterion:
      "Index score, filtered to News category and non-US/UK domains, descending",
    limit: 12,
    select: () =>
      sourcesInCategory("News")
        .filter((s) => !US_UK_DOMAINS.has(s.domain))
        .sort(byScore("index"))
        .slice(0, 12),
  },
  {
    slug: "ai-citation-sources",
    title: "Best sources for AI engines (ChatGPT, Claude, Perplexity)",
    intent: "Highest Citation Velocity — sources AI engines surface most",
    description:
      "The 15 sources with the highest Citation Velocity on the SourceScore Index — the sources ChatGPT, Claude, Perplexity, and Gemini cite most often when answering questions.",
    rationale:
      "Citation Velocity measures how often a source is cited by other tier-1 publications and AI engines per week. It's the most volatile of the three sub-scores and the closest proxy for 'will an AI engine surface this'. The 15 below are the top of that list — the ones AI engines surface first.",
    signalCriterion: "Citation Velocity sub-score, descending",
    limit: 15,
    select: () => [...sources].sort(byScore("velocity")).slice(0, 15),
  },
  {
    slug: "free-sources",
    title: "Best paywall-free sources for citation",
    intent: "Highest Modern Reference — open-access + machine-readable",
    description:
      "The 15 highest-Modern-Reference sources on the SourceScore Index — open-access, machine-readable, schema-rich. The sources you can always link to without a paywall.",
    rationale:
      "Modern Reference measures fitness as a citation in AI-era writing — open access, structured data, freshness signals, machine-readability. The 15 below are the top scorers, the sources you can always cite without a paywall, that are fully indexed by LLMs, and that ship the structured metadata AI engines need.",
    signalCriterion: "Modern Reference sub-score, descending",
    limit: 15,
    select: () => [...sources].sort(byScore("modernReference")).slice(0, 15),
  },
  {
    slug: "peer-reviewed",
    title: "Best peer-reviewed sources for citation rigor",
    intent: "Highest Citation Discipline — strictest evidence-citation",
    description:
      "The 15 highest-Citation-Discipline sources on the SourceScore Index — peer-reviewed, methodology-transparent, citation-rigorous. The sources you cite when accuracy is non-negotiable.",
    rationale:
      "Citation Discipline measures how rigorously a source backs each claim with verifiable evidence. The 15 below score 90+ on Discipline — gold-standard peer-review processes, government primary-source standards, or systematic-review methodology. These are the sources you cite when the next reader will check.",
    signalCriterion: "Citation Discipline sub-score, descending",
    limit: 15,
    select: () => [...sources].sort(byScore("discipline")).slice(0, 15),
  },
  {
    slug: "business-research",
    title: "Best business + strategy research sources",
    intent: "Top business + research-tier publications",
    description:
      "The top business-strategy + economics-research sources on the SourceScore Index — Brookings, NBER, KFF, McKinsey, BCG, Gartner, and more.",
    rationale:
      "Business research has a credibility range from peer-reviewed academic (NBER) through think-tank (Brookings) to consulting-firm (McKinsey). The list below combines all those tiers, filtered by the SourceScore Index — the sources that pass the citation-quality bar regardless of their institutional type.",
    signalCriterion:
      "Index score, filtered to Business + Research categories, descending",
    limit: 12,
    select: () =>
      sources
        .filter((s) => s.category === "Business" || s.category === "Research")
        .sort(byScore("index"))
        .slice(0, 12),
  },
  // Day 31 — five new best-lists. Each auto-generates a base /best/<slug>/
  // page + 3 dim-faceted Day-25 children = 4 pages per list × 5 = 20 pages.
  {
    slug: "fact-checkers",
    title: "Best fact-checking-grade sources for AI citation",
    intent: "High Discipline AND high Velocity",
    description:
      "Sources scoring 80+ on BOTH Citation Discipline AND Citation Velocity — the rare set that combines rigorous evidence-citation discipline with high-frequency citation in current discourse. The fact-checking-grade tier.",
    rationale:
      "Most sources score high on one dimension and middling on others. The fact-checking-grade tier requires BOTH: methodology-transparent rigor (Discipline ≥ 80) AND fast cross-citation in current writing (Velocity ≥ 80). When you're verifying a claim that's currently in dispute, these are the sources whose authority + recency BOTH compound.",
    signalCriterion:
      "Filter: Discipline ≥ 80 AND Velocity ≥ 80; ranked by mean of those two scores",
    limit: 12,
    select: () =>
      sources
        .filter(
          (s) =>
            s.scores.discipline.value >= 80 && s.scores.velocity.value >= 80,
        )
        .sort(
          (a, b) =>
            (b.scores.discipline.value + b.scores.velocity.value) / 2 -
            (a.scores.discipline.value + a.scores.velocity.value) / 2,
        )
        .slice(0, 12),
  },
  {
    slug: "research-tier",
    title: "Best research-tier sources for evidence-based citation",
    intent: "Research category — independent + think-tank publications",
    description:
      "The 9 highest-scoring Research-category sources on the SourceScore Index — independent research bodies, think tanks, and analytical institutions that publish original primary studies.",
    rationale:
      "Research-tier sources sit between academic peer-review and journalistic reporting. They publish original primary studies — RAND, Brookings, Pew, NBER, KFF, ProPublica's Methodology, RAND Europe — with methodology-transparent reporting and high-frequency tier-1 citation. The default citation tier when neither pure academic nor pure news fits the claim.",
    signalCriterion: "Index score, filtered to Research category, descending",
    limit: 9,
    select: () =>
      sourcesInCategory("Research").sort(byScore("index")).slice(0, 9),
  },
  {
    slug: "magazines",
    title: "Best magazine + long-form publications for citation",
    intent: "Magazine category — long-form analysis + reporting",
    description:
      "The 12 highest-scoring Magazine-category sources — long-form analytical publications including The Atlantic, Foreign Affairs, The Economist, Wired, The New Yorker, and others. Citation tier for analysis + commentary.",
    rationale:
      "Magazines occupy a citation tier distinct from breaking news and academic peer-review: long-form analytical writing with editorial layering, fact-checking departments, and credentialed contributors. The 12 below score highest on the SourceScore Index within their category — useful citation candidates for argument, analysis, and reported features rather than raw event reporting.",
    signalCriterion: "Index score, filtered to Magazine category, descending",
    limit: 12,
    select: () =>
      sourcesInCategory("Magazine").sort(byScore("index")).slice(0, 12),
  },
  {
    slug: "triple-crown",
    title: "Best triple-crown sources (A or higher on all three dimensions)",
    intent: "Elite all-around — A/A+ on every sub-score",
    description:
      "Sources that score A or A+ on ALL THREE sub-scores — Citation Discipline, Modern Reference, AND Citation Velocity. The 'no weak link' tier where every dimension is independently strong.",
    rationale:
      "Most A-tier composite sources have one dimension carrying the weight. The triple-crown set requires every dimension to clear the A bar independently — no compensation, no compromise. These are the safest citations across any context: rigorous evidence-citation, modern open-data infrastructure, AND high tier-1 citation velocity. The default first-choice tier.",
    signalCriterion:
      "Filter: all three dim grades ∈ {A, A+}; ranked by composite Index",
    limit: 15,
    select: () =>
      sources
        .filter(
          (s) =>
            (s.scores.discipline.grade === "A" ||
              s.scores.discipline.grade === "A+") &&
            (s.scores.modernReference.grade === "A" ||
              s.scores.modernReference.grade === "A+") &&
            (s.scores.velocity.grade === "A" ||
              s.scores.velocity.grade === "A+"),
        )
        .sort(byScore("index"))
        .slice(0, 15),
  },
  {
    slug: "encyclopedic",
    title: "Best encyclopedic + scholarly knowledge sources",
    intent: "Reference + Academic combined — citation backbone",
    description:
      "The 15 highest-scoring sources from the Reference + Academic categories combined — Wikipedia, MDN, Britannica, Stanford Encyclopedia, PubMed, DOI/CrossRef, JSTOR, Nature, Cell, and others. The composite citation backbone of AI-era writing.",
    rationale:
      "Reference works and peer-reviewed academic publications anchor a different citation tier than news or research bodies — they accumulate authority over time rather than reflecting it from current events. The 15 below combine general-knowledge encyclopedic depth (Reference) with peer-reviewed scholarly rigor (Academic) into one curated tier.",
    signalCriterion:
      "Index score, filtered to Reference + Academic categories, descending",
    limit: 15,
    select: () =>
      sources
        .filter(
          (s) => s.category === "Reference" || s.category === "Academic",
        )
        .sort(byScore("index"))
        .slice(0, 15),
  },
];

/** Convenience: lookup by slug for /best/[slug]/ routing */
export function getBestList(slug: string): BestList | undefined {
  return bestLists.find((b) => b.slug === slug);
}

/** All slugs — feeds generateStaticParams() */
export const bestListSlugs = bestLists.map((b) => b.slug);

/**
 * Day 25 — Best-list × dimension facet.
 * Same source pool as the parent best-list, RE-SORTED by the specified
 * sub-score (discipline / modernReference / velocity) instead of the
 * composite index. Surfaces a different leader per dim because real
 * search-intent is "best academic journals BY CITATION VELOCITY" or
 * "best news sources BY DISCIPLINE" — different question, different
 * answer.
 */
export type DimensionKey = "discipline" | "modernReference" | "velocity";

export const DIMENSION_META: Record<
  DimensionKey,
  { label: string; short: string; routeSegment: string; methodologySlug: string }
> = {
  // routeSegment = /discipline/ /velocity/ list-route prefix (short form).
  // methodologySlug = the actual /methodology/<slug>/ page slug (long form) —
  // these DIFFER for discipline + velocity, so methodology links MUST use
  // methodologySlug, never routeSegment (fixes /methodology/velocity 404).
  discipline: {
    label: "Citation Discipline",
    short: "Discipline",
    routeSegment: "discipline",
    methodologySlug: "citation-discipline",
  },
  modernReference: {
    label: "Modern Citation Reference",
    short: "Modern Reference",
    routeSegment: "modern-reference",
    methodologySlug: "modern-reference",
  },
  velocity: {
    label: "Citation Velocity",
    short: "Velocity",
    routeSegment: "velocity",
    methodologySlug: "citation-velocity",
  },
};

export const ALL_DIMENSIONS: DimensionKey[] = [
  "discipline",
  "modernReference",
  "velocity",
];

/** Map URL path segment back to dimension key. */
export function dimFromSegment(segment: string): DimensionKey | undefined {
  for (const [key, meta] of Object.entries(DIMENSION_META)) {
    if (meta.routeSegment === segment) return key as DimensionKey;
  }
  return undefined;
}

/**
 * Returns the SAME source pool as the parent best-list, re-sorted by
 * the specified sub-score descending. Truncated to the parent list's
 * limit so the leaderboard is comparable in size.
 */
export function bestListSourcesByDim(
  bestSlug: string,
  dim: DimensionKey,
): Source[] | undefined {
  const list = getBestList(bestSlug);
  if (!list) return undefined;
  const baseList = list.select();
  return [...baseList]
    .sort((a, b) => b.scores[dim].value - a.scores[dim].value)
    .slice(0, list.limit);
}
