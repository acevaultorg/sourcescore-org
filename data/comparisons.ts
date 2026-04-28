// Curated source-vs-source comparison pairs.
// Layer 5 archetype: comparison_vs_competitor_page × +60 (per bot-harvest.md).
//
// Each pair represents a real search-intent query ("X vs Y") that
// surfaces commercial / decision-stage interest. URL slugs are
// alphabetically canonicalized — sorted([a, b]) — so each pair has one
// canonical URL regardless of which side the user typed first.
//
// Adding a new pair: just push { a, b, summary }. Build re-canonicalizes
// the slug and generates the page automatically.

import { sources } from "./sources";

export interface Comparison {
  /** First source slug (will be alphabetized at runtime) */
  a: string;
  /** Second source slug */
  b: string;
  /** One-line editorial summary of the comparison angle */
  summary: string;
}

/** Alphabetize a pair to produce the canonical slug. */
export function comparisonSlug(a: string, b: string): string {
  const sorted = [a, b].sort();
  return `${sorted[0]}-vs-${sorted[1]}`;
}

/** Look up the canonical pair (sorted) from a slug. */
export function pairFromSlug(slug: string): { a: string; b: string } | undefined {
  // slug shape: <a>-vs-<b> where a < b alphabetically. Some source slugs
  // contain hyphens (e.g. "ap-news"), so split on the LITERAL "-vs-".
  const idx = slug.indexOf("-vs-");
  if (idx < 0) return undefined;
  const a = slug.slice(0, idx);
  const b = slug.slice(idx + 4);
  if (!a || !b) return undefined;
  // Validate both slugs exist
  const knownSlugs = new Set(sources.map((s) => s.slug));
  if (!knownSlugs.has(a) || !knownSlugs.has(b)) return undefined;
  return { a, b };
}

/** Day 5 curated 25 pairs. Each picked for real "X vs Y" search intent. */
export const comparisons: Comparison[] = [
  // Reference
  {
    a: "wikipedia-en",
    b: "britannica",
    summary: "Crowd-edited vs editor-supervised — the two reference traditions, scored.",
  },

  // US News tier-1
  {
    a: "nyt",
    b: "washington-post",
    summary: "Two tier-1 US dailies with comparable Pulitzer record — head-to-head.",
  },
  {
    a: "ap-news",
    b: "reuters",
    summary: "The two global wire services that source most other newsrooms — compared.",
  },
  {
    a: "ft",
    b: "wsj",
    summary: "Business journalism's two flagships — UK vs US, paywalled vs paywalled.",
  },

  // Science + Medical
  {
    a: "nature",
    b: "science-org",
    summary: "The two flagship general-science venues — peer review + impact factor compared.",
  },
  {
    a: "nejm",
    b: "the-lancet",
    summary: "The two highest-impact general medical journals — citation discipline compared.",
  },
  {
    a: "arxiv",
    b: "pubmed",
    summary: "Preprint server vs curated literature index — two paths to academic citation.",
  },

  // Academic infrastructure
  {
    a: "doi-org",
    b: "semantic-scholar",
    summary: "Citation-resolution standard vs AI-powered academic search.",
  },

  // Analysis / opinion
  {
    a: "foreign-affairs",
    b: "the-economist",
    summary: "International-affairs depth vs weekly explanatory rigor.",
  },

  // UK / international
  {
    a: "bbc-news",
    b: "guardian",
    summary: "UK public broadcaster vs reader-funded daily — open-web standards compared.",
  },
  {
    a: "al-jazeera",
    b: "bbc-news",
    summary: "Two international broadcasters with global English-language reach.",
  },
  {
    a: "bbc-news",
    b: "npr",
    summary: "Public-funded broadcasters across the Atlantic — discipline + reach compared.",
  },

  // Politics
  {
    a: "politico",
    b: "the-economist",
    summary: "DC daily-cycle politics vs weekly analytical politics.",
  },

  // Investigative
  {
    a: "nyt",
    b: "propublica",
    summary: "Daily depth vs nonprofit investigation-only model.",
  },

  // Tech analysis vs tech news
  {
    a: "mit-tech-review",
    b: "wired",
    summary: "MIT-affiliated long-form vs Condé Nast tech magazine — depth compared.",
  },
  {
    a: "ars-technica",
    b: "the-verge",
    summary: "Two long-running tech-news brands — discipline + depth compared.",
  },
  {
    a: "techcrunch",
    b: "the-verge",
    summary: "Startup beat vs broader tech beat — citation rate compared.",
  },

  // US Government
  {
    a: "fda-gov",
    b: "sec-gov",
    summary: "Drug + device regulator vs financial regulator — different filings, same trust tier.",
  },
  {
    a: "bls-gov",
    b: "census-gov",
    summary: "Two flagship US statistical agencies — labor vs demographics.",
  },

  // Multilateral
  {
    a: "imf",
    b: "world-bank",
    summary: "Two Bretton Woods institutions — monetary vs development data + research.",
  },
  {
    a: "nih-gov",
    b: "who",
    summary: "Federal medical research authority vs international public-health authority.",
  },

  // Research orgs
  {
    a: "ourworldindata",
    b: "pew-research",
    summary: "Oxford-affiliated data viz vs nonpartisan US polling — both methodology-published.",
  },

  // Cross-tier (reference vs primary)
  {
    a: "sec-gov",
    b: "wikipedia-en",
    summary: "Primary-source government data vs the most-cited encyclopedia — citation-tier compared.",
  },

  // Business mags
  {
    a: "forbes",
    b: "the-economist",
    summary: "Contributor-driven volume vs editor-supervised analysis — discipline compared.",
  },

  // Lower-tier illustrative
  {
    a: "buzzfeed",
    b: "daily-mail",
    summary: "Two high-volume low-discipline outlets — discipline floor illustrated.",
  },
];

/** All slugs derived from the comparisons set */
export const allComparisonSlugs = comparisons.map((c) => comparisonSlug(c.a, c.b));

/** Find a comparison by canonical slug */
export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => comparisonSlug(c.a, c.b) === slug);
}
