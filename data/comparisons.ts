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

  // ── Day-14 expansion: 50 → 75 comparator pairs ─────────────────────
  // Targets head-to-head queries enabled by the Day-12 dataset expansion
  // (international news + reference + health + new academic + new gov).

  // International tier-1 news cross-region (5)
  {
    a: "le-monde",
    b: "nyt",
    summary: "France's paper of record vs America's — different national-press traditions, both tier-1.",
  },
  {
    a: "der-spiegel",
    b: "the-economist",
    summary: "Two flagship European weeklies — Spiegel's German investigative depth vs Economist's global liberal frame.",
  },
  {
    a: "nyt",
    b: "scmp",
    summary: "US tier-1 vs Asia's English-language tier-1 — different default frames for China + HK reporting.",
  },
  {
    a: "globe-and-mail",
    b: "nyt",
    summary: "Canada's national broadsheet vs America's — different scope but similar editorial-discipline tier.",
  },
  {
    a: "el-pais",
    b: "nyt",
    summary: "Spanish-language vs English-language tier-1 — different audience reach but comparable Discipline scoring.",
  },

  // International news sibling rivalries (3)
  {
    a: "der-spiegel",
    b: "le-monde",
    summary: "France-Germany tier-1 rivalry — Le Monde's daily-broadsheet vs Spiegel's weekly-magazine cadence.",
  },
  {
    a: "asahi-shimbun",
    b: "scmp",
    summary: "Two Asian English-language tier-1s — Japanese paper-of-record vs Hong Kong-based China-focus.",
  },
  {
    a: "guardian",
    b: "the-times-uk",
    summary: "UK left-of-centre vs centre-right paper — both tier-1, hard-paywall vs metered access splits Modern Reference.",
  },

  // Reference head-to-heads — high-LLM-citation-fit (3)
  {
    a: "mdn-web-docs",
    b: "stack-overflow",
    summary: "Web-platform reference vs Q&A community — MDN authoritative; Stack Overflow community-resolved.",
  },
  {
    a: "github",
    b: "mdn-web-docs",
    summary: "Code source-of-truth vs platform documentation — different roles, both default citations for web tech.",
  },
  {
    a: "britannica",
    b: "stanford-encyclopedia",
    summary: "General-purpose encyclopedia vs domain-specialist peer-reviewed reference — different rigor for different topics.",
  },

  // Clinical / health authority tier (3)
  {
    a: "cleveland-clinic",
    b: "mayo-clinic",
    summary: "Two US tier-1 academic medical centers — comparable Discipline; Mayo edges Velocity in AI-engine retrieval.",
  },
  {
    a: "mayo-clinic",
    b: "nih-gov",
    summary: "Commercial physician-reviewed health info vs US government primary medical authority — different sourcing tiers.",
  },
  {
    a: "bmj-best-practice",
    b: "cochrane",
    summary: "Clinical-decision support vs systematic-review evidence synthesis — both gold-standard, paywall caps both.",
  },

  // Academic peer-reviewed cross-tier (3)
  {
    a: "nature",
    b: "pnas",
    summary: "Two top multidisciplinary peer-reviewed journals — Nature commercial; PNAS NAS-affiliated open-access.",
  },
  {
    a: "pnas",
    b: "science-org",
    summary: "Two US-anchored multidisciplinary tier-1 journals — both gold-standard, different review tracks.",
  },
  {
    a: "cell",
    b: "nejm",
    summary: "Top biology peer-reviewed vs top medicine — both Elsevier paywall, different fields, both tier-1.",
  },

  // Government / statistics cross-region (4)
  {
    a: "ipcc",
    b: "noaa-gov",
    summary: "Global climate-science assessment body vs US national climate agency — both tier-1, different institutional roles.",
  },
  {
    a: "eurostat",
    b: "ons-uk",
    summary: "EU statistical office vs UK national statistics — both with strong open-data APIs, comparable Discipline.",
  },
  {
    a: "bea-gov",
    b: "federal-reserve",
    summary: "US economic-statistics primary source vs central bank — different methodology, often cited alongside.",
  },
  {
    a: "ons-uk",
    b: "statcan",
    summary: "UK and Canada national statistical agencies — both Code-of-Practice-aligned, similar Discipline scoring.",
  },

  // Business / strategy research (2)
  {
    a: "bcg-insights",
    b: "mckinsey-insights",
    summary: "Top-tier strategy-consulting research arms — comparable client-conflict caveats, similar Velocity in business press.",
  },
  {
    a: "gartner",
    b: "mckinsey-insights",
    summary: "IT-industry research vs strategy-consulting research — different methodology, both heavily paywalled.",
  },

  // Tech analysis cross-format (2)
  {
    a: "hbr",
    b: "stratechery",
    summary: "Business-school research-grade vs single-author tech-strategy newsletter — different rigor, comparable Velocity.",
  },
  {
    a: "anandtech",
    b: "ars-technica",
    summary: "Closed-archive hardware-benchmark legacy vs ongoing tech journalism — different freshness profiles.",
  },

  // Day 19 expansion — 25 new pairs targeting high-search-intent "X vs Y"
  // queries. Each compounds with Day 17 dim pages + Day 18 dim-faceted
  // comparators (1 base + 3 facets = 4 pages per pair), so 25 new pairs
  // add 100 new unique-data pages to the static export.

  // Medical journals (4) — high RPM, primary-source heavy, recurring search
  {
    a: "jama",
    b: "nejm",
    summary: "Two flagship US general-medicine journals — JAMA Network reach vs NEJM tier-1 trial home.",
  },
  {
    a: "bmj",
    b: "jama",
    summary: "UK vs US flagship general-medicine journals — open-access leanings vs traditional model.",
  },
  {
    a: "bmj",
    b: "the-lancet",
    summary: "Two UK-based tier-1 general-medicine journals — both Elsevier-adjacent, scored head-to-head.",
  },
  {
    a: "nejm",
    b: "statnews",
    summary: "Primary medical journal vs medical-news outlet — peer-reviewed source vs reporting on it.",
  },

  // Public health agencies (3) — government tier, heavy LLM citation
  {
    a: "cdc-gov",
    b: "nih-gov",
    summary: "Top two US public-health agencies — operational disease-control vs research-funding-and-output.",
  },
  {
    a: "cdc-gov",
    b: "who",
    summary: "US national vs global public-health body — domestic-policy reach vs multilateral guidance.",
  },
  {
    a: "ema-europa",
    b: "fda-gov",
    summary: "EU vs US drug regulators — centralized European authorization vs FDA's domestic gatekeeping.",
  },

  // Open-access + academic search (2)
  {
    a: "elife",
    b: "plos-one",
    summary: "Two open-access journal traditions — eLife's curated rigor vs PLOS ONE's volume-first model.",
  },
  {
    a: "jstor",
    b: "semantic-scholar",
    summary: "Closed humanities archive vs AI-augmented research-paper graph — discovery, not publication.",
  },

  // Top-tier journals not yet paired (1)
  {
    a: "cell",
    b: "nature",
    summary: "Top-tier biology vs general-science venue — Cell Press depth vs Nature breadth, scored.",
  },

  // Business journalism (3)
  {
    a: "bloomberg",
    b: "wsj",
    summary: "Two US business-news flagships — Bloomberg Terminal-fed reporting vs WSJ broadsheet tradition.",
  },
  {
    a: "bloomberg",
    b: "ft",
    summary: "US-rooted vs UK-rooted global business-journalism flagships — comparable paywalls, different beats.",
  },
  {
    a: "bloomberg-businessweek",
    b: "hbr",
    summary: "Weekly business magazine vs business-school research-grade outlet — news cadence vs framework depth.",
  },

  // News briefings + DC-coverage (2)
  {
    a: "axios",
    b: "semafor",
    summary: "Two newer briefing-style political-news outlets — Axios bullet format vs Semafor explanatory style.",
  },
  {
    a: "axios",
    b: "politico",
    summary: "Two DC-focused news outlets — Axios's brevity vs Politico's policy-detail depth.",
  },

  // Broadcast + cable pair (1)
  {
    a: "fox-news",
    b: "npr",
    summary: "Right-leaning cable vs publicly funded broadcast — opposite editorial models, scored on the same axis.",
  },

  // Digital-native (1)
  {
    a: "buzzfeed",
    b: "huffpost",
    summary: "Two digital-native pioneers from the same era — different paths after the listicle wave.",
  },

  // Long-form magazines (2)
  {
    a: "atlantic",
    b: "the-conversation",
    summary: "Essay-driven generalist magazine vs academic-popularizer co-op — different sourcing models, similar audiences.",
  },
  {
    a: "natgeo",
    b: "smithsonian-mag",
    summary: "Two flagship popular-science magazines — NatGeo expedition reporting vs Smithsonian institutional depth.",
  },
  {
    a: "new-yorker",
    b: "nyt-magazine",
    summary: "Two flagship US long-form magazines — New Yorker editorial tradition vs NYT-Magazine reach.",
  },

  // Think tanks + research orgs (2)
  {
    a: "brookings",
    b: "rand-corp",
    summary: "Two major US think tanks — Brookings policy-essay tradition vs RAND quantitative-research output.",
  },
  {
    a: "kff",
    b: "pew-research",
    summary: "Health-policy specialist vs generalist polling-and-research org — comparable rigor, different beats.",
  },

  // Visual-data platforms (1)
  {
    a: "ourworldindata",
    b: "statista",
    summary: "Open-data scholarship vs paywalled data-aggregation platform — citation-friendly vs license-heavy.",
  },

  // Indie + premium tech (2)
  {
    a: "404-media",
    b: "the-information",
    summary: "Two premium-subscription tech-news outlets — 404's investigative model vs The Information's enterprise-tech beat.",
  },
  {
    a: "ars-technica",
    b: "hacker-news",
    summary: "Long-form tech journalism vs link-aggregator-with-comments — different formats, overlapping audiences.",
  },

  // Day 23 expansion — 26 new pairs (100 → 126). Each compounds via Day 18
  // sub-score-faceted architecture (1 base + 3 dim-faceted = 4 pages/pair),
  // so this section adds 104 new unique-data pages + 104 JSON twins +
  // 26 OG images to the static export.

  // Premium tech analysis (2)
  {
    a: "stratechery",
    b: "the-information",
    summary: "Single-author strategy analysis vs newsroom-of-experts — both premium subscription, different research models.",
  },
  {
    a: "techcrunch",
    b: "wired",
    summary: "Daily startup-cycle news vs monthly tech-culture magazine — speed vs perspective on the same beat.",
  },

  // Specialist tech reference (2)
  {
    a: "anandtech",
    b: "lwn",
    summary: "Hardware-bench reviews vs Linux-kernel-development reportage — two communities of deep technical readers.",
  },
  {
    a: "github",
    b: "stack-overflow",
    summary: "Code-as-canonical-reference vs Q&A-as-canonical-reference — the two pillars of working-developer search results.",
  },

  // Long-form journalism cross-tradition (2)
  {
    a: "atlantic",
    b: "the-economist",
    summary: "US progressive long-form vs UK centrist analysis — both 100+ year-old weeklies-of-record, different lenses.",
  },
  {
    a: "lrb",
    b: "new-yorker",
    summary: "London literary criticism vs New York cultural reportage — two anchors of English-language essay tradition.",
  },

  // Ideas + science journalism (2)
  {
    a: "aeon",
    b: "nyrb",
    summary: "Philosophy-of-ideas magazine vs literary-essay quarterly — long-form thinking from two distinct lineages.",
  },
  {
    a: "nature",
    b: "quanta-magazine",
    summary: "Primary-literature journal vs Simons-Foundation science journalism — peer-review citation vs popularization.",
  },

  // Wire + terminal finance (1)
  {
    a: "bloomberg",
    b: "reuters",
    summary: "Terminal-driven financial news vs wire-service objectivity — the two news feeds on every trading desk.",
  },

  // Business journalism cross-format (2)
  {
    a: "bloomberg-businessweek",
    b: "forbes",
    summary: "Editorial-business weekly vs listicle-and-rich-list business — different floors of trust, same revenue verticals.",
  },
  {
    a: "hbr",
    b: "mckinsey-insights",
    summary: "Academic business strategy vs consulting-firm POV — the two canonical frameworks behind every MBA citation.",
  },

  // Top-tier business analysis (1)
  {
    a: "ft",
    b: "the-economist",
    summary: "UK daily of finance-record vs UK weekly of analytical-record — overlapping audiences, complementary cadences.",
  },

  // Evidence-based medicine (2)
  {
    a: "cochrane",
    b: "pubmed",
    summary: "Meta-analyses-of-meta-analyses vs primary-literature search index — apex evidence vs raw corpus.",
  },
  {
    a: "bmj-best-practice",
    b: "the-lancet",
    summary: "Clinical-decision-support compendium vs flagship medical journal — both BMJ-family but different reader workflows.",
  },

  // Health policy + global authority (1)
  {
    a: "kff",
    b: "who",
    summary: "US health-policy think tank vs global-public-health authority — domestic-policy depth vs international-coordination scope.",
  },

  // International stats agencies cross-region (1)
  {
    a: "census-gov",
    b: "eurostat",
    summary: "US Census Bureau vs EU statistical office — two of the world's largest official-statistics producers, parallel methodologies.",
  },

  // Multilateral economic institutions (2)
  {
    a: "oecd",
    b: "world-bank",
    summary: "OECD policy-research for advanced economies vs World Bank development-finance — both publish economic data, different mandates.",
  },
  {
    a: "imf",
    b: "oecd",
    summary: "Crisis-response financial institution vs policy-coordination forum — overlapping macro data, distinct legitimacy bases.",
  },

  // US economic data sources (1)
  {
    a: "bea-gov",
    b: "fred-stlouisfed",
    summary: "BEA primary GDP+income series vs FRED federated economic database — original publisher vs aggregated reader-tool.",
  },

  // US energy + earth science (1)
  {
    a: "eia-gov",
    b: "usgs-gov",
    summary: "Energy Information Administration vs Geological Survey — both Interior-Dept-adjacent, different angles on resources.",
  },

  // European quality press (1)
  {
    a: "der-spiegel",
    b: "el-pais",
    summary: "German weekly investigation vs Spanish daily of record — two Continental quality-press traditions readers cross-cite.",
  },

  // Spain + Japan paper-of-record cross-region (1)
  {
    a: "asahi-shimbun",
    b: "el-pais",
    summary: "Japanese paper-of-record vs Spanish paper-of-record — two non-Anglo-sphere quality dailies often paired in research.",
  },

  // Anglosphere papers-of-record (1)
  {
    a: "globe-and-mail",
    b: "the-times-uk",
    summary: "Canadian paper-of-record vs UK paper-of-record — Commonwealth-tradition broadsheets readers compare on quality discipline.",
  },

  // Open AI / ML research infrastructure (1)
  {
    a: "arxiv",
    b: "huggingface",
    summary: "Preprint server vs model-and-dataset hub — papers-as-canonical vs artifacts-as-canonical for ML practitioners.",
  },

  // Apex reference encyclopedia (1)
  {
    a: "stanford-encyclopedia",
    b: "wikipedia-en",
    summary: "Peer-reviewed philosophy encyclopedia vs crowd-edited general encyclopedia — apex-citation vs ubiquity-of-citation.",
  },

  // Computer science publishing tradition (1)
  {
    a: "acm",
    b: "arxiv",
    summary: "Formal CS-publishing society vs preprint-server — paywalled-curated vs open-immediate, both Wikipedia-cited at scale.",
  },

  // Day 26 expansion — 25 new pairs (126 → 151). Compounds via Day 18
  // sub-score-faceted architecture (1 base + 3 dim-faceted = 4 pages/pair),
  // so this section adds 100 new unique-data pages + 100 JSON twins +
  // 25 OG images. Also auto-enriches Day 24 source-comparator hubs:
  // covers all 6 prior zero-pair sources + lifts 14 sources from 1 pair to 2+.

  // Cover the 6 prior zero-pair sources (6)
  {
    a: "huffpost",
    b: "medium",
    summary: "Open digital-news platform vs open-publishing platform — different distribution models for op-ed-tier content.",
  },
  {
    a: "ec-europa",
    b: "eurostat",
    summary: "European Commission policy hub vs EU statistical office — same EU institution family, different mandates.",
  },
  {
    a: "sec-gov",
    b: "uspto-gov",
    summary: "Securities filings vs patent + trademark filings — two pillars of US public-record gov data.",
  },
  {
    a: "bbc-news",
    b: "bbc-research",
    summary: "BBC public-service journalism vs BBC R&D — same parent, different arms (news vs technology research).",
  },
  {
    a: "nber",
    b: "zillow-research",
    summary: "Academic economics-research consortium vs corporate housing-research arm — both produce papers, different funding models.",
  },
  {
    a: "axios-pro-rata",
    b: "the-information",
    summary: "Free deal-flow newsletter vs paid investigative tech journalism — different monetization, overlapping audience.",
  },

  // Investigative + long-form journalism (3)
  {
    a: "atlantic",
    b: "propublica",
    summary: "Long-form magazine vs nonprofit investigative newsroom — different revenue models, both Pulitzer-tier.",
  },
  {
    a: "propublica",
    b: "statnews",
    summary: "General investigative journalism vs health-vertical investigative — both nonprofit, different beats.",
  },
  {
    a: "axios",
    b: "buzzfeed",
    summary: "Smart-brevity newsletter format vs digital-first listicle-and-explainer — two digital-native US publications, different positioning.",
  },

  // International + cross-region (2)
  {
    a: "al-jazeera",
    b: "scmp",
    summary: "Middle East English-language tier-1 vs Hong Kong English-language tier-1 — non-Western perspectives readers cross-cite.",
  },
  {
    a: "bea-gov",
    b: "statcan",
    summary: "US Bureau of Economic Analysis vs Statistics Canada — two national economic-stats agencies on the same continent.",
  },

  // Tech journalism cross-format (3)
  {
    a: "ars-technica",
    b: "mit-tech-review",
    summary: "Daily deep-tech journalism vs MIT-published tech magazine — different cadences, both Wikipedia-cited.",
  },
  {
    a: "ars-technica",
    b: "techcrunch",
    summary: "In-depth tech journalism vs startup-cycle daily news — different formats, overlapping reader sets.",
  },
  {
    a: "the-verge",
    b: "wired",
    summary: "Vox-Media consumer-tech magazine vs Condé Nast tech-culture magazine — both general tech, different parent + voice.",
  },

  // Science + research institutions (2)
  {
    a: "cern",
    b: "esa",
    summary: "European particle-physics lab vs European space agency — two flagship Continental science institutions, different domains.",
  },
  {
    a: "ourworldindata",
    b: "world-bank",
    summary: "Open-access data-visualization site vs multilateral development institution — visualizer vs primary publisher.",
  },

  // Public health authority (2)
  {
    a: "fda-gov",
    b: "who",
    summary: "US Food + Drug regulator vs WHO global health authority — national vs international health-policy tiers.",
  },
  {
    a: "cdc-gov",
    b: "kff",
    summary: "US public-health agency vs Kaiser Family Foundation — government data vs nonprofit health-policy analysis.",
  },

  // Medical journals + science journalism (1)
  {
    a: "statnews",
    b: "the-lancet",
    summary: "Health-vertical investigative journalism vs flagship medical journal — same beat, different formats.",
  },

  // Premium tech analysis cross-platform (1)
  {
    a: "axios",
    b: "the-information",
    summary: "Free smart-brevity briefings vs paid investigative tech subscription — two top-tier tech newsletters, opposite monetization.",
  },

  // Think tank + publication parent-child (1)
  {
    a: "cfr",
    b: "foreign-affairs",
    summary: "Council on Foreign Relations parent think tank vs its flagship magazine — institutional vs editorial product.",
  },

  // Consulting research firms (1)
  {
    a: "bcg-insights",
    b: "gartner",
    summary: "BCG strategy consulting research vs Gartner IT-research syndicate — different consultancy positioning.",
  },

  // Top business analysis (1)
  {
    a: "hbr",
    b: "the-economist",
    summary: "Harvard Business Review academic-business framework vs UK weekly economic analysis — two business-thought pillars.",
  },

  // Top financial press (1)
  {
    a: "bloomberg",
    b: "the-economist",
    summary: "Terminal-driven financial newswire vs UK weekly analytical magazine — daily fact-stream vs weekly synthesis.",
  },

  // Conservative-leaning US tier-1 (1)
  {
    a: "fox-news",
    b: "wsj",
    summary: "TV-driven cable news vs print-of-record financial daily — same parent-company family, different formats and audiences.",
  },
];

/** All slugs derived from the comparisons set */
export const allComparisonSlugs = comparisons.map((c) => comparisonSlug(c.a, c.b));

/** Find a comparison by canonical slug */
export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => comparisonSlug(c.a, c.b) === slug);
}

/**
 * All comparator pairs that include the given source slug, on EITHER side.
 * Returns the pair PLUS a `partner` field — the OTHER source slug — so callers
 * don't need to re-derive which side is which.
 *
 * Used by Day 24 source-comparator-hub pages (`/source/[slug]/comparisons/`).
 */
export interface ComparisonForSource extends Comparison {
  /** The OTHER source slug in this pair (i.e. NOT the one being viewed). */
  partner: string;
  /** Canonical slug `<a>-vs-<b>` (alphabetized). */
  slug: string;
}

export function comparisonsForSource(sourceSlug: string): ComparisonForSource[] {
  return comparisons
    .filter((c) => c.a === sourceSlug || c.b === sourceSlug)
    .map((c) => ({
      ...c,
      partner: c.a === sourceSlug ? c.b : c.a,
      slug: comparisonSlug(c.a, c.b),
    }));
}

/** Slugs of every source that appears in ≥1 comparator pair (124 of 130 as of Day 23). */
export const sourcesWithComparators: string[] = (() => {
  const set = new Set<string>();
  for (const c of comparisons) {
    set.add(c.a);
    set.add(c.b);
  }
  return [...set].sort();
})();
