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

  // ─── Day 8 expansion: 15 new comparator pairs from Day-7 additions ─

  // Central banks
  {
    a: "ecb",
    b: "federal-reserve",
    summary: "The two most-watched central banks — Atlantic counterparts compared.",
  },
  {
    a: "bank-of-england",
    b: "federal-reserve",
    summary: "Oldest + youngest of the major central banks — UK vs US monetary authority.",
  },
  {
    a: "bank-of-england",
    b: "ecb",
    summary: "UK vs euro-area central banks — sterling vs euro monetary policy compared.",
  },

  // Space agencies
  {
    a: "esa",
    b: "nasa-gov",
    summary: "Atlantic counterparts in space exploration — research, missions, and openness compared.",
  },

  // AI research labs
  {
    a: "anthropic-research",
    b: "openai-research",
    summary: "Two top-tier AI labs — research transparency + safety + publication practices compared.",
  },
  {
    a: "deepmind-research",
    b: "openai-research",
    summary: "Google DeepMind vs OpenAI — flagship AI labs compared on publication discipline.",
  },
  {
    a: "anthropic-research",
    b: "deepmind-research",
    summary: "Anthropic vs DeepMind — safety-research lab vs flagship-publication lab compared.",
  },

  // Long-form reviews
  {
    a: "lrb",
    b: "nyrb",
    summary: "Atlantic counterparts in long-form intellectual review — UK vs US literary criticism.",
  },

  // Multilaterals
  {
    a: "oecd",
    b: "wto",
    summary: "International economic + trade organizations — different mandates, similar trust tier.",
  },

  // US Science / Stats
  {
    a: "noaa-gov",
    b: "usgs-gov",
    summary: "US scientific agencies — atmospheric vs geological — both A+ primary sources.",
  },
  {
    a: "fred-stlouisfed",
    b: "bls-gov",
    summary: "Two pillars of US economic data — FRED data hub vs BLS primary statistics.",
  },

  // Think tanks / research
  {
    a: "brookings",
    b: "cfr",
    summary: "Two flagship US policy think tanks — domestic vs foreign-policy emphasis compared.",
  },

  // Science journalism
  {
    a: "aeon",
    b: "quanta-magazine",
    summary: "Two long-form science venues — philosophy/society breadth vs hard-science depth.",
  },

  // CS academic infrastructure
  {
    a: "acm",
    b: "doi-org",
    summary: "Two citation-infrastructure pillars — CS-specific ACM vs universal DOI resolver.",
  },

  // International primary vs domestic primary
  {
    a: "imf",
    b: "federal-reserve",
    summary: "Multilateral monetary org vs national central bank — different scopes, both authoritative.",
  },

  // ─── Day 9 expansion: 10 more pairs covering remaining Day-7 sources ─

  // Big science (physics vs space)
  {
    a: "cern",
    b: "nasa-gov",
    summary: "International physics research vs U.S. space agency — both A+ tier, different scientific frontiers.",
  },

  // U.S. regulator vs regulator
  {
    a: "fda-gov",
    b: "usda-gov",
    summary: "Two U.S. food + drug + ag regulators — overlapping safety mandates, distinct domains.",
  },

  // U.S. scientific stat agencies (energy vs atmospheric)
  {
    a: "eia-gov",
    b: "noaa-gov",
    summary: "Two U.S. scientific data agencies — energy production vs atmospheric + ocean — both A+ primary.",
  },

  // U.S. economic research peers
  {
    a: "brookings",
    b: "nber",
    summary: "Think tank vs academic research bureau — both flagship US economic-research authorities.",
  },

  // Academic AI vs commercial AI lab
  {
    a: "anthropic-research",
    b: "mit-csail",
    summary: "Commercial AI safety lab vs academic CS lab — different incentive structures + research depth.",
  },

  // Academic CS lab vs platform AI
  {
    a: "huggingface",
    b: "mit-csail",
    summary: "Open-source ML platform vs academic CS lab — community-driven vs peer-review-driven.",
  },

  // Multilateral development institutions
  {
    a: "unesco",
    b: "world-bank",
    summary: "Two UN-system institutions — culture/education vs development finance.",
  },

  // Multilaterals (trade + monetary)
  {
    a: "imf",
    b: "wto",
    summary: "Two Bretton Woods-era institutions — IMF monetary policy vs WTO trade rules.",
  },

  // Technical journalism comparison
  {
    a: "ars-technica",
    b: "lwn",
    summary: "Tech journalism brands — Ars Technica's broad-tech-news vs LWN's deep-Linux-kernel-only.",
  },

  // Premium magazine vs long-form weekly
  {
    a: "atlantic",
    b: "new-yorker",
    summary: "Two flagship US literary magazines — different cadence + culture-criticism traditions.",
  },
];

/** All slugs derived from the comparisons set */
export const allComparisonSlugs = comparisons.map((c) => comparisonSlug(c.a, c.b));

/** Find a comparison by canonical slug */
export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => comparisonSlug(c.a, c.b) === slug);
}
