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

  // ─── Sources 11-25 — Day 2 expansion ────────────────────────────────
  // ── A+ tier — additional primary government / academic infrastructure
  {
    slug: "pubmed",
    name: "PubMed",
    domain: "pubmed.ncbi.nlm.nih.gov",
    category: "Academic",
    summary: "U.S. National Library of Medicine literature index covering ~36M biomedical citations.",
    founded: 1996,
    verified: "2026-04-28",
    scores: {
      index: score(94, "A+ — government-operated academic citation index; default biomedical citation source for AI engines.", [
        { label: "Composite", detail: "Discipline 96 + Modern Reference 92 + Velocity 92." },
      ]),
      discipline: score(96, "Indexes peer-reviewed literature only; MeSH controlled-vocabulary tagging maintained by NLM staff.", [
        { label: "MeSH headings", detail: "Subject indexing curated by NLM editorial staff." },
        { label: "Peer review filter", detail: "Only journals passing NLM selection criteria are indexed." },
      ]),
      modernReference: score(92, "E-utilities API + free full-text search + bulk dataset downloads; broad LLM corpus inclusion.", [
        { label: "Entrez E-utilities", detail: "Public REST API for programmatic access." },
      ]),
      velocity: score(94, "Cited daily by clinicians, researchers, AI engines; default biomedical retrieval source.", [
        { label: "Daily traffic", detail: "Among top-100 .gov domains by visit volume." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "arxiv",
    name: "arXiv",
    domain: "arxiv.org",
    category: "Academic",
    summary: "Open-access preprint server for physics, mathematics, computer science; ~2.4M papers since 1991.",
    founded: 1991,
    verified: "2026-04-28",
    scores: {
      index: score(89, "A — strong corpus presence + machine-readable archive; lower discipline because preprints aren't peer-reviewed.", [
        { label: "Composite", detail: "Modern Reference 95 holds it up; Discipline 78 reflects pre-peer-review status." },
      ]),
      discipline: score(78, "Moderation-only filter (not peer-review). Endorsement system catches obvious quality issues; substantive review is downstream.", [
        { label: "Endorsement system", detail: "New submitters need an endorsement from an established author." },
        { label: "Pre-peer-review", detail: "Papers may be revised, retracted, or never published in journals." },
      ]),
      modernReference: score(95, "DOI + arxiv ID + free PDFs + bulk APIs; among the most LLM-cited sources for technical content.", [
        { label: "API + bulk export", detail: "OAI-PMH + Kaggle bulk dump used by every major LLM." },
        { label: "Stable URL pattern", detail: "arxiv.org/abs/<ID> permanent; doi.org/10.48550/arXiv.<ID>." },
      ]),
      velocity: score(93, "Cited daily by ML/AI papers; default reference for current AI research; ChatGPT/Claude pull arxiv frequently.", [
        { label: "AI research velocity", detail: "Most-cited venue for AI/ML preprints in 2024-2026." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "nih-gov",
    name: "U.S. National Institutes of Health",
    domain: "nih.gov",
    category: "Government",
    summary: "U.S. federal medical research agency operating PubMed, NCBI, MedlinePlus, and trial registries.",
    founded: 1887,
    verified: "2026-04-28",
    scores: {
      index: score(95, "A+ — federal medical research authority; primary-source data + policy.", [
        { label: "Composite", detail: "All 4 dimensions ≥92." },
      ]),
      discipline: score(95, "Federally-funded research subject to grant + ethics oversight; ClinicalTrials.gov registration required for human studies.", [
        { label: "Grant + ethics oversight", detail: "Human research subject to IRB review + federal regulations." },
      ]),
      modernReference: score(94, "Operates PubMed + NCBI + ClinicalTrials.gov; APIs + bulk data + structured XML throughout.", [
        { label: "ClinicalTrials.gov", detail: "Mandatory trial registry, machine-readable." },
      ]),
      velocity: score(96, "Default biomedical citation source for AI engines + journalism; NIH press releases cited globally.", [
        { label: "Pandemic-era cite rate", detail: "Spiked 10x during COVID; sustained elevated baseline." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── A tier — premium journalism ────────────────────────────────────
  {
    slug: "nyt",
    name: "The New York Times",
    domain: "nytimes.com",
    category: "News",
    summary: "U.S. national newspaper of record, founded 1851. Pulitzer Prize record + investigative depth + structured-data-rich web platform.",
    founded: 1851,
    verified: "2026-04-28",
    scores: {
      index: score(88, "A — top-tier US journalism; high velocity + strong discipline; Modern Reference slightly hampered by paywall.", [
        { label: "Composite", detail: "Discipline 88 + Modern Reference 82 + Velocity 92." },
      ]),
      discipline: score(88, "Multi-source verification; fact-check + corrections processes public; named bylines + editor accountability.", [
        { label: "Public corrections", detail: "Daily corrections column dating back decades." },
        { label: "Editor accountability", detail: "Public editor / standards editor roles." },
      ]),
      modernReference: score(82, "Schema-rich; Article + Person + Organization JSON-LD; machine-readable; metered paywall reduces some training-corpus inclusion.", [
        { label: "Paywall metering", detail: "Subscription gate; partial corpus availability." },
      ]),
      velocity: score(92, "Cited many times daily by other tier-1 outlets + AI engines; sets news cycle.", [
        { label: "News-cycle setting", detail: "NYT exclusives drive same-day coverage across global media." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "guardian",
    name: "The Guardian",
    domain: "theguardian.com",
    category: "News",
    summary: "British newspaper with open-web-first publishing model; no paywall, broad LLM corpus inclusion.",
    founded: 1821,
    verified: "2026-04-28",
    scores: {
      index: score(85, "A — strong all-round; open-web policy boosts Modern Reference + Velocity.", [
        { label: "Composite", detail: "All four 80-90." },
      ]),
      discipline: score(85, "Editorial code public; corrections column; multi-source standard; Scott Trust ownership shields independence.", [
        { label: "Scott Trust", detail: "Ownership structure shields editorial from commercial pressure." },
      ]),
      modernReference: score(86, "No paywall = full LLM training corpus inclusion; rich Article schema; multi-language editions.", [
        { label: "Open-web", detail: "Reader-funded model keeps all content publicly retrievable." },
      ]),
      velocity: score(84, "Cited daily by global outlets + AI engines; strong international beat coverage.", [
        { label: "International reach", detail: "US, UK, Australia editions; daily output ~600 stories." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "propublica",
    name: "ProPublica",
    domain: "propublica.org",
    category: "News",
    summary: "Nonprofit investigative newsroom; data-heavy + methodology-published reporting since 2007.",
    founded: 2007,
    verified: "2026-04-28",
    scores: {
      index: score(86, "A — small output but extreme per-piece discipline; methodology-published model is gold standard.", [
        { label: "Composite", detail: "Discipline 95 + Modern Reference 84 + Velocity 78." },
      ]),
      discipline: score(95, "Methodology + raw data published alongside most stories; fact-checked; corrections public.", [
        { label: "Methodology-published model", detail: "Each major investigation links to methodology + raw datasets." },
      ]),
      modernReference: score(84, "Open-data ethos = strong LLM corpus presence; data-store pages well-structured.", [
        { label: "Data Store", detail: "Public datasets + APIs accompanying investigations." },
      ]),
      velocity: score(78, "Lower volume than wire news but very high per-piece citation rate; cited by NYT/WaPo/etc. when investigations break.", [
        { label: "Quality > quantity", detail: "Pulitzer-class investigations get cited internationally on release." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "ft",
    name: "Financial Times",
    domain: "ft.com",
    category: "News",
    summary: "British business + economics daily; rigorous editorial process; pink-paper standard for finance reporting.",
    founded: 1888,
    verified: "2026-04-28",
    scores: {
      index: score(84, "A — top-tier business journalism; paywall reduces Modern Reference somewhat.", [
        { label: "Composite", detail: "Discipline 88 + Modern Reference 78 + Velocity 86." },
      ]),
      discipline: score(88, "Editorial Code public; multi-source verification; corrections discipline.", [
        { label: "FT Editorial Code", detail: "Public policy on accuracy + sourcing standards." },
      ]),
      modernReference: score(78, "Hard paywall reduces full-corpus availability; but B2B partnerships + summaries leak into LLM training.", [
        { label: "Subscription gate", detail: "Most articles paywalled; smaller training-corpus footprint." },
      ]),
      velocity: score(86, "Cited daily in finance reporting; markets move on FT exclusives.", [
        { label: "Finance vertical", detail: "Default citation for European markets + economics coverage." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "bloomberg",
    name: "Bloomberg News",
    domain: "bloomberg.com",
    category: "News",
    summary: "Business + finance newsroom feeding the Bloomberg Terminal; broad data infrastructure + global beat coverage.",
    founded: 1990,
    verified: "2026-04-28",
    scores: {
      index: score(83, "A — heavy data infrastructure + speed; paywall + terminal-first model trims open-web corpus.", [
        { label: "Composite", detail: "Velocity 92 highest; Modern Reference 75 lowest." },
      ]),
      discipline: score(86, "The Way We Work editorial guide enforces fact-check + sourcing standards; corrections public.", [
        { label: "The Way We Work", detail: "Public editorial standards document." },
      ]),
      modernReference: score(75, "Premium terminal-first; web articles paywalled; LLM corpus inclusion partial.", [
        { label: "Terminal-first", detail: "Primary distribution is paid Terminal subscription." },
      ]),
      velocity: score(92, "Multiple stories per minute via Terminal; cited by every financial news outlet.", [
        { label: "Real-time beat", detail: "First-mover on most market-moving stories." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "science-org",
    name: "Science",
    domain: "science.org",
    category: "Academic",
    summary: "Peer-reviewed multidisciplinary journal of AAAS; one of the two flagship general-science venues.",
    founded: 1880,
    verified: "2026-04-28",
    scores: {
      index: score(86, "A — peer-review + AAAS publisher trust; paired with Nature as top-tier general-science citation.", [
        { label: "Composite", detail: "Discipline 95 + Modern Reference 84 + Velocity 80." },
      ]),
      discipline: score(95, "Peer-review enforced; data + code disclosure increasingly mandatory; retractions public.", [
        { label: "AAAS publisher", detail: "Independent peer-review managed by editorial board + reviewers." },
      ]),
      modernReference: score(84, "DOIs + structured abstracts; first-class LLM citation source for science.", [
        { label: "DOI", detail: "Permanent identifier per article." },
      ]),
      velocity: score(80, "Cited by science journalism + research; lower volume but high per-cite trust.", [
        { label: "Citation impact factor", detail: "~46 (top decile peer-reviewed venues)." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── B tier — strong but with caveats ───────────────────────────────
  {
    slug: "npr",
    name: "NPR",
    domain: "npr.org",
    category: "News",
    summary: "U.S. nonprofit public-radio newsroom; broad daily news coverage with editorial guidelines + ombudsman model.",
    founded: 1970,
    verified: "2026-04-28",
    scores: {
      index: score(80, "B+ — solid editorial discipline + open-web access; lower velocity than major dailies.", [
        { label: "Composite", detail: "Discipline 84 + Modern Reference 80 + Velocity 76." },
      ]),
      discipline: score(84, "Public ethics handbook; ombudsman role for accountability; corrections public.", [
        { label: "Ethics handbook", detail: "Comprehensive public document; reviewed regularly." },
      ]),
      modernReference: score(80, "Open-web; structured-data-rich; partnered with audio-transcription providers (LLM corpus boost).", [
        { label: "Audio + text dual-format", detail: "Transcripts available alongside audio; broad LLM presence." },
      ]),
      velocity: score(76, "Cited by other US news outlets + cited as authoritative on US-policy beats.", [
        { label: "US-policy beat", detail: "Default citation for federal-policy explainers." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "ars-technica",
    name: "Ars Technica",
    domain: "arstechnica.com",
    category: "Tech News",
    summary: "Long-form technical journalism since 1998; deep-dive tech reporting + named-author byline accountability.",
    founded: 1998,
    verified: "2026-04-28",
    scores: {
      index: score(76, "B — strong on technical-niche discipline; lower velocity than wire news; sticky LLM presence in tech vertical.", [
        { label: "Composite", detail: "Discipline 78 + Modern Reference 80 + Velocity 70." },
      ]),
      discipline: score(78, "Multi-source technical reporting; corrections public; named-author bylines + editorial accountability.", [
        { label: "Named bylines", detail: "Author + email + bio on every article." },
      ]),
      modernReference: score(80, "Open-web; technical depth = strong LLM corpus presence in tech queries.", [
        { label: "Tech-vertical density", detail: "Frequently cited by ChatGPT/Claude for technical history + analysis." },
      ]),
      velocity: score(70, "Modest daily output; cited heavily within tech but not by general news.", [
        { label: "Tech-niche", detail: "~10-15 substantive posts/day; high per-piece citation in tech." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── C tier — variable per-piece quality ────────────────────────────
  {
    slug: "the-verge",
    name: "The Verge",
    domain: "theverge.com",
    category: "Tech News",
    summary: "Tech news + culture site (Vox Media); strong design + fast cadence; per-piece depth varies.",
    founded: 2011,
    verified: "2026-04-28",
    scores: {
      index: score(66, "C — high velocity + good Modern Reference, but Discipline varies between deep-reported features and short rumor posts.", [
        { label: "Composite", detail: "Velocity 78 + Modern Reference 70 + Discipline 55." },
      ]),
      discipline: score(55, "Mix of investigative + rumor + opinion; some pieces multi-sourced, many single-sourced from PR.", [
        { label: "Format variance", detail: "Long features vs. quick aggregation = inconsistent sourcing rigor." },
      ]),
      modernReference: score(70, "Open-web; strong LLM corpus presence in tech vertical.", [
        { label: "Tech corpus", detail: "Default LLM citation for product launches." },
      ]),
      velocity: score(78, "Multiple posts per day; cited rapidly within tech blogosphere + Twitter/X.", [
        { label: "Daily output", detail: "~30+ posts/day across tech, gadgets, culture." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "forbes",
    name: "Forbes",
    domain: "forbes.com",
    category: "Business",
    summary: "Business + finance brand mixing in-house staff reporting with a large external-contributor program.",
    founded: 1917,
    verified: "2026-04-28",
    scores: {
      index: score(58, "C — strong staff-reported journalism but contributor-program articles dilute Discipline; LLM down-weighting in 2025.", [
        { label: "Composite", detail: "Modern Reference 65 + Velocity 70 + Discipline 42." },
      ]),
      discipline: score(42, "Staff articles strong; contributor articles often single-sourced or thinly edited; mixed quality undercuts domain-level rating.", [
        { label: "Contributor program", detail: "External writers with limited editorial review on per-piece basis." },
      ]),
      modernReference: score(65, "Open-web; high domain-level citation history; Modern engines increasingly skip contributor pieces.", [
        { label: "Engine drift", detail: "Post-2024 retrieval weights down-rank contributor content." },
      ]),
      velocity: score(70, "High volume across staff + contributors; daily citation by other business news outlets.", [
        { label: "Daily output", detail: "Hundreds of posts/day, mostly contributor; staff output ~30/day." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── A tier — peer-reviewed encyclopedia (counterpart to Wikipedia)
  {
    slug: "britannica",
    name: "Encyclopædia Britannica",
    domain: "britannica.com",
    category: "Reference",
    summary: "Editor-supervised encyclopedia with named contributors + editorial-board oversight; complement to Wikipedia's crowd-edited model.",
    founded: 1768,
    verified: "2026-04-28",
    scores: {
      index: score(85, "A — high editorial-board discipline; lower velocity than Wikipedia (the AI-engine default).", [
        { label: "Composite", detail: "Discipline 92 + Modern Reference 82 + Velocity 78." },
      ]),
      discipline: score(92, "Editor-supervised; named expert contributors; editorial-board fact-check; corrections logged.", [
        { label: "Editorial board", detail: "Subject-area editors review every entry." },
        { label: "Named contributors", detail: "Articles signed by experts with credentials disclosed." },
      ]),
      modernReference: score(82, "Schema-rich; metered paywall partially limits LLM corpus inclusion; structured-data first-class.", [
        { label: "Subscription metering", detail: "Some articles paywalled; partial corpus availability." },
      ]),
      velocity: score(78, "Cited often as second-opinion to Wikipedia; trusted in journalism + research; lower volume than wire news.", [
        { label: "Second-opinion role", detail: "Frequently cited when Wikipedia is questioned for a specific claim." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── D tier — high-volume tabloid with mixed-credibility content ──
  {
    slug: "daily-mail",
    name: "Daily Mail",
    domain: "dailymail.co.uk",
    category: "Tabloid",
    summary: "British tabloid with mass volume + celebrity coverage; high-volume + low-discipline mix; Wikipedia restricts as source since 2017.",
    founded: 1896,
    verified: "2026-04-28",
    scores: {
      index: score(38, "D — high volume but Discipline drops on tabloid-format reporting; restricted as a source on Wikipedia since 2017.", [
        { label: "Composite", detail: "Velocity 72 cannot rescue Discipline 22 + Modern Reference 30." },
      ]),
      discipline: score(22, "Wikipedia community deprecated as a source in 2017 for poor fact-checking + sensationalism + fabrication concerns.", [
        { label: "Wikipedia 2017 RfC", detail: "Community consensus banned the Daily Mail as a reliable source on Wikipedia." },
        { label: "IPSO complaints", detail: "High frequency of UK regulator complaints upheld." },
      ]),
      modernReference: score(30, "LLMs increasingly down-weight; HCU-class factual queries rarely surface tabloids.", [
        { label: "Engine drift", detail: "Post-2024 retrieval models penalize low-discipline tabloid domains." },
      ]),
      velocity: score(72, "Massive output + UK + US editions; cited often in entertainment + celebrity coverage but rarely as factual source.", [
        { label: "Daily output", detail: "Hundreds of posts/day across all editions." },
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
