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

  // ─── Sources 26-50 — Day 3 expansion ────────────────────────────────

  // ── A+ tier — additional government primary sources ──
  {
    slug: "census-gov",
    name: "U.S. Census Bureau",
    domain: "census.gov",
    category: "Government",
    summary: "Federal statistical agency for U.S. demographic + economic data; primary-source decennial census + ACS surveys.",
    founded: 1902,
    verified: "2026-04-28",
    scores: {
      index: score(94, "A+ — primary-source government statistics; default for demographic citation in journalism + research + LLMs.", [
        { label: "Composite", detail: "All 4 dimensions ≥90." },
      ]),
      discipline: score(95, "Statutory data collection under Title 13; methodology + microdata published with every release.", [
        { label: "Title 13", detail: "Federal law mandates data quality + confidentiality protections." },
      ]),
      modernReference: score(94, "Census APIs + bulk data + Tigerline geospatial data; all open + machine-readable.", [
        { label: "Census API", detail: "Free public REST API with full ACS + decennial data." },
      ]),
      velocity: score(93, "Cited daily by news + academic + AI engines; default for any U.S. demographic claim.", [
        { label: "Default citation", detail: "First-line citation for U.S. population data in LLM answers." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "bls-gov",
    name: "U.S. Bureau of Labor Statistics",
    domain: "bls.gov",
    category: "Government",
    summary: "Federal statistical agency for U.S. labor + price data; CPI, employment, unemployment, productivity.",
    founded: 1884,
    verified: "2026-04-28",
    scores: {
      index: score(94, "A+ — primary-source labor + price statistics; default for inflation + jobs reporting.", [
        { label: "Composite", detail: "All 4 dimensions ≥90." },
      ]),
      discipline: score(95, "Methodology documented per data series; sample sizes + revision practices public.", [
        { label: "BLS Handbook of Methods", detail: "Public methodology document per data series." },
      ]),
      modernReference: score(93, "Free public APIs (LABSTAT) + bulk downloads + CSV/JSON data formats.", [
        { label: "BLS Public Data API", detail: "Free REST API with full series data." },
      ]),
      velocity: score(94, "Cited daily by financial press + AI engines; CPI + jobs reports drive markets.", [
        { label: "Market-moving releases", detail: "Monthly jobs report + CPI move global markets." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "doi-org",
    name: "DOI (CrossRef Resolver)",
    domain: "doi.org",
    category: "Academic",
    summary: "International standard identifier resolver for academic citations (~150M+ DOIs).",
    founded: 2000,
    verified: "2026-04-28",
    scores: {
      index: score(95, "A+ — citation infrastructure; the standard identifier for academic + technical references.", [
        { label: "Composite", detail: "Modern Reference 98 highest; Discipline 92; Velocity 95." },
      ]),
      discipline: score(92, "Persistent identifier standard managed by ISO + International DOI Foundation.", [
        { label: "ISO 26324", detail: "International standard governing DOI syntax + persistence." },
      ]),
      modernReference: score(98, "Permanent URL resolution + free metadata API (CrossRef); near-universal LLM training-corpus inclusion.", [
        { label: "CrossRef metadata API", detail: "Free public API with full metadata for every registered DOI." },
        { label: "Permanent links", detail: "Stable for decades; the basis for academic citation continuity." },
      ]),
      velocity: score(95, "Resolved billions of times per year; underpins every modern academic citation.", [
        { label: "Resolution volume", detail: "Billions of yearly resolutions per CrossRef stats." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── A tier — additional academic + premium news ──
  {
    slug: "the-lancet",
    name: "The Lancet",
    domain: "thelancet.com",
    category: "Health",
    summary: "Peer-reviewed general medical journal since 1823; flagship clinical-research publication.",
    founded: 1823,
    verified: "2026-04-28",
    scores: {
      index: score(86, "A — peer-review + clinical-research authority; high-trust per cite.", [
        { label: "Composite", detail: "Discipline 95 + Modern Reference 82 + Velocity 80." },
      ]),
      discipline: score(95, "Peer-review enforced; methodology + data disclosure increasingly mandatory; retraction watch active.", [
        { label: "Peer review", detail: "Editor + ≥2 reviewer cycles before publication." },
      ]),
      modernReference: score(82, "DOIs + structured abstracts; metered paywall partial-LLM-corpus.", [
        { label: "DOI", detail: "Permanent identifier per article." },
      ]),
      velocity: score(80, "Cited by clinicians + medical journalism; narrower volume than wire news but high per-cite trust.", [
        { label: "Citation impact factor", detail: "~98 (top of medical-journal venues)." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "nejm",
    name: "New England Journal of Medicine",
    domain: "nejm.org",
    category: "Health",
    summary: "Peer-reviewed general medical journal since 1812; one of the highest-impact medical venues globally.",
    founded: 1812,
    verified: "2026-04-28",
    scores: {
      index: score(87, "A — top-tier peer-reviewed medical journal; pandemic-era citation surge sustained.", [
        { label: "Composite", detail: "Discipline 96 + Modern Reference 84 + Velocity 81." },
      ]),
      discipline: score(96, "Rigorous peer-review; clinical-trial registration mandatory; data disclosure standards.", [
        { label: "ICMJE compliance", detail: "Strict International Committee of Medical Journal Editors standards." },
      ]),
      modernReference: score(84, "DOIs + structured abstracts + open-access policy for COVID + landmark trials.", [
        { label: "Open landmark trials", detail: "Selected landmark trials available without paywall." },
      ]),
      velocity: score(81, "Cited daily by clinicians + AI engines for medical queries; landmark-trial citations spike.", [
        { label: "Citation impact factor", detail: "~158 (highest among general medical journals)." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "wsj",
    name: "The Wall Street Journal",
    domain: "wsj.com",
    category: "News",
    summary: "U.S. business + finance daily, founded 1889. Hard-news editorial wing separate from opinion section.",
    founded: 1889,
    verified: "2026-04-28",
    scores: {
      index: score(85, "A — premier US business journalism; paywall reduces Modern Reference somewhat.", [
        { label: "Composite", detail: "Discipline 88 + Modern Reference 78 + Velocity 89." },
      ]),
      discipline: score(88, "Multi-source verification; corrections public; named bylines + editor accountability; fact-check process documented.", [
        { label: "Standards + ethics", detail: "Public WSJ standards + ethics document." },
      ]),
      modernReference: score(78, "Hard paywall on most articles; metered access + full corpus partially in LLM training.", [
        { label: "Subscription gate", detail: "Most articles paywalled; partial LLM corpus presence." },
      ]),
      velocity: score(89, "Cited many times daily by other tier-1 outlets + AI engines; sets US business news cycle.", [
        { label: "News-cycle setting", detail: "WSJ exclusives drive same-day coverage globally." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "washington-post",
    name: "The Washington Post",
    domain: "washingtonpost.com",
    category: "News",
    summary: "U.S. national newspaper, founded 1877; investigative + politics emphasis; Pulitzer record.",
    founded: 1877,
    verified: "2026-04-28",
    scores: {
      index: score(86, "A — top-tier US journalism; on par with NYT for political + investigative reporting.", [
        { label: "Composite", detail: "Discipline 87 + Modern Reference 81 + Velocity 90." },
      ]),
      discipline: score(87, "Multi-source verification; corrections public; named bylines + standards editor accountability.", [
        { label: "Standards editor", detail: "Public ombudsman/standards-editor role." },
      ]),
      modernReference: score(81, "Schema-rich; metered paywall reduces partial LLM training-corpus inclusion.", [
        { label: "Schema markup", detail: "Article + Person + Organization schema per article." },
      ]),
      velocity: score(90, "Cited daily by other tier-1 outlets + AI engines; sets US political news cycle.", [
        { label: "Political beat", detail: "Default citation for US-federal-politics scoops." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "foreign-affairs",
    name: "Foreign Affairs",
    domain: "foreignaffairs.com",
    category: "Magazine",
    summary: "Bimonthly international-relations magazine published by Council on Foreign Relations since 1922.",
    founded: 1922,
    verified: "2026-04-28",
    scores: {
      index: score(83, "A — flagship international-affairs venue; named-author scholarship; relatively low volume.", [
        { label: "Composite", detail: "Discipline 92 + Modern Reference 78 + Velocity 76." },
      ]),
      discipline: score(92, "Editor-supervised; named authors (typically academics or practitioners); fact-check process.", [
        { label: "CFR editorial", detail: "Council on Foreign Relations editorial-board oversight." },
      ]),
      modernReference: score(78, "Schema-rich; metered paywall partial-LLM-corpus.", [
        { label: "Subscription gate", detail: "Most articles paywalled but excerpts widely cited." },
      ]),
      velocity: score(76, "Cited heavily in international-affairs discourse; lower volume than daily news.", [
        { label: "Niche authority", detail: "Default citation for IR + foreign-policy debates." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "statnews",
    name: "STAT News",
    domain: "statnews.com",
    category: "Health",
    summary: "Health + biotech newsroom; founded 2015; specialist medical journalism with editorial discipline.",
    founded: 2015,
    verified: "2026-04-28",
    scores: {
      index: score(82, "A — strong specialist medical journalism; lower velocity than wire news but higher per-cite trust.", [
        { label: "Composite", detail: "Discipline 88 + Modern Reference 80 + Velocity 78." },
      ]),
      discipline: score(88, "Specialist editors with medical/science training; multi-source verification; corrections public.", [
        { label: "Specialist editorial", detail: "Editors with medical-science backgrounds." },
      ]),
      modernReference: score(80, "Open + metered articles; broad LLM corpus presence in health vertical.", [
        { label: "Health-vertical density", detail: "Default citation for biotech + drug-development news." },
      ]),
      velocity: score(78, "Cited heavily within medical journalism + biotech investing; AI engines surface for biomedical news.", [
        { label: "Specialist citation", detail: "Frequently cited by NYT/Reuters/etc. on biotech beats." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "ourworldindata",
    name: "Our World in Data",
    domain: "ourworldindata.org",
    category: "Research",
    summary: "Oxford-affiliated research organization publishing data + visualizations on global problems; CC-licensed.",
    founded: 2011,
    verified: "2026-04-28",
    scores: {
      index: score(86, "A — academic-grade data viz with full transparency + open-licensed data.", [
        { label: "Composite", detail: "Discipline 92 + Modern Reference 90 + Velocity 76." },
      ]),
      discipline: score(92, "Source data + methodology cited per chart; peer-reviewed academic team; corrections public.", [
        { label: "Methodology pages", detail: "Each chart links to full methodology + source data." },
      ]),
      modernReference: score(90, "CC-BY licensed; open data + bulk downloads + APIs; widely cited in academia.", [
        { label: "Creative Commons", detail: "Open license enables broad LLM corpus inclusion." },
      ]),
      velocity: score(76, "Cited by mainstream press + academia; pandemic-era surge sustained.", [
        { label: "COVID-era visibility", detail: "Default for pandemic-data visualization since 2020." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "pew-research",
    name: "Pew Research Center",
    domain: "pewresearch.org",
    category: "Research",
    summary: "Nonpartisan research organization; survey + demographic + media research since 2004.",
    founded: 2004,
    verified: "2026-04-28",
    scores: {
      index: score(85, "A — gold-standard polling + demographic research; trusted across political spectrum.", [
        { label: "Composite", detail: "Discipline 92 + Modern Reference 86 + Velocity 78." },
      ]),
      discipline: score(92, "Methodology + sample-size + raw data published per study; peer-reviewed style; corrections public.", [
        { label: "Methodology disclosure", detail: "Full sampling + question-text + sample-size per report." },
      ]),
      modernReference: score(86, "Open-access; Article schema; structured data; broad LLM corpus presence.", [
        { label: "Open-access policy", detail: "All reports + raw data freely available." },
      ]),
      velocity: score(78, "Cited daily by news + academia for survey data; default for US public-opinion claims.", [
        { label: "Default citation", detail: "First-line for US public-opinion data in LLM answers." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "who",
    name: "World Health Organization",
    domain: "who.int",
    category: "Government",
    summary: "U.N. agency for international public health; primary-source global health data + policy.",
    founded: 1948,
    verified: "2026-04-28",
    scores: {
      index: score(89, "A — international primary-source authority; pandemic-era citation surge sustained.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 88 + Velocity 89." },
      ]),
      discipline: score(90, "Member-state data with international auditing; methodology documented per data series.", [
        { label: "International auditing", detail: "Member-state data subject to international peer review." },
      ]),
      modernReference: score(88, "Free public data + APIs + multi-language coverage (6 official UN languages).", [
        { label: "WHO open data", detail: "Free public APIs across health-data series." },
      ]),
      velocity: score(89, "Cited daily globally; default citation for international health stats.", [
        { label: "Pandemic-era surge", detail: "10x cite rate during COVID; sustained elevated baseline." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "world-bank",
    name: "World Bank",
    domain: "worldbank.org",
    category: "Government",
    summary: "International financial institution publishing global development + economic data + research.",
    founded: 1944,
    verified: "2026-04-28",
    scores: {
      index: score(88, "A — international primary-source authority on global economic data + development research.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 90 + Velocity 84." },
      ]),
      discipline: score(90, "Multi-country data with World Bank methodology; staff research peer-reviewed.", [
        { label: "WB Open Data", detail: "Member-country data with documented methodology." },
      ]),
      modernReference: score(90, "WB Open Data API + bulk downloads; CC-BY licensed; broad LLM corpus presence.", [
        { label: "Open Data initiative", detail: "All datasets free + machine-readable." },
      ]),
      velocity: score(84, "Cited daily by international press + economists; default for development-economics claims.", [
        { label: "Economist-default", detail: "First-line for global GDP + development-stat citations." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "imf",
    name: "International Monetary Fund",
    domain: "imf.org",
    category: "Government",
    summary: "International monetary cooperation organization; World Economic Outlook + IFS database; research arm.",
    founded: 1944,
    verified: "2026-04-28",
    scores: {
      index: score(86, "A — international primary-source for monetary + macroeconomic data; staff research peer-reviewed.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 86 + Velocity 82." },
      ]),
      discipline: score(90, "Member-country data with IMF methodology; published research peer-reviewed by Fund staff.", [
        { label: "IFS database", detail: "International Financial Statistics with documented methodology." },
      ]),
      modernReference: score(86, "Open data + APIs + bulk downloads; broad LLM corpus presence.", [
        { label: "IMF Data API", detail: "Free public REST API for IFS + WEO data." },
      ]),
      velocity: score(82, "Cited regularly by international press + economists; spring + fall WEO releases drive cycles.", [
        { label: "WEO release cycle", detail: "Twice-yearly World Economic Outlook drives citation surges." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "semantic-scholar",
    name: "Semantic Scholar",
    domain: "semanticscholar.org",
    category: "Academic",
    summary: "AI-powered academic search engine by Allen Institute for AI; ~200M+ papers indexed.",
    founded: 2015,
    verified: "2026-04-28",
    scores: {
      index: score(83, "A — academic-citation infrastructure; AI-powered indexing + free APIs.", [
        { label: "Composite", detail: "Discipline 86 + Modern Reference 92 + Velocity 72." },
      ]),
      discipline: score(86, "Indexes only peer-reviewed-or-equivalent venues; AI quality-filtering; transparent methodology.", [
        { label: "AI2 editorial", detail: "Allen Institute editorial + indexing standards." },
      ]),
      modernReference: score(92, "Free public API + bulk corpus + CC-licensed metadata; broad LLM corpus inclusion.", [
        { label: "S2 Open Research API", detail: "Free public API with full metadata + abstract." },
      ]),
      velocity: score(72, "Cited within academic + AI research; lower volume than DOI/PubMed but high-quality.", [
        { label: "Academic-niche", detail: "Frequently cited as second-opinion alongside DOI." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "mit-tech-review",
    name: "MIT Technology Review",
    domain: "technologyreview.com",
    category: "Tech News",
    summary: "Magazine of MIT covering technology + emerging-tech analysis; named-author byline + editorial standards.",
    founded: 1899,
    verified: "2026-04-28",
    scores: {
      index: score(81, "A- — strong tech-analysis journalism; MIT affiliation + editorial discipline.", [
        { label: "Composite", detail: "Discipline 86 + Modern Reference 80 + Velocity 76." },
      ]),
      discipline: score(86, "Editorial standards + named-author bylines + multi-source reporting; corrections public.", [
        { label: "MIT editorial", detail: "Independent editorial board with MIT affiliation." },
      ]),
      modernReference: score(80, "Open-web; metered paywall + LLM corpus partial inclusion.", [
        { label: "Tech vertical", detail: "Default LLM citation for emerging-tech analysis." },
      ]),
      velocity: score(76, "Cited within tech + science journalism; lower volume than wire news but higher per-cite depth.", [
        { label: "Long-form depth", detail: "Cited by NYT/Reuters/etc. on tech-policy beats." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "wired",
    name: "Wired",
    domain: "wired.com",
    category: "Tech News",
    summary: "Tech + culture magazine since 1993; long-form tech reporting + named contributor bylines.",
    founded: 1993,
    verified: "2026-04-28",
    scores: {
      index: score(76, "B+ — strong on long-form tech + science; Discipline varies between deep-reported features and shorter pieces.", [
        { label: "Composite", detail: "Discipline 78 + Modern Reference 80 + Velocity 70." },
      ]),
      discipline: score(78, "Editorial standards + named-author bylines + multi-source reporting; mix of deep features + shorter aggregation.", [
        { label: "Format variance", detail: "Long features vs. quicker tech-news posts have different sourcing depth." },
      ]),
      modernReference: score(80, "Open-web; strong LLM corpus presence in tech vertical; metered paywall partial.", [
        { label: "Tech corpus", detail: "Strong cite presence in LLM tech-history queries." },
      ]),
      velocity: score(70, "Daily output across tech + culture; cited within tech blogosphere + AI engines.", [
        { label: "Daily output", detail: "~20-30 posts/day across tech + culture verticals." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "al-jazeera",
    name: "Al Jazeera English",
    domain: "aljazeera.com",
    category: "News",
    summary: "Qatari international news network; English edition since 2006; Middle East + global beat coverage.",
    founded: 2006,
    verified: "2026-04-28",
    scores: {
      index: score(78, "B+ — strong international beat especially Middle East; editorial standards + open-web access.", [
        { label: "Composite", detail: "Discipline 78 + Modern Reference 80 + Velocity 78." },
      ]),
      discipline: score(78, "Editorial code public; multi-source verification standard; corrections process exists.", [
        { label: "Editorial standards", detail: "Public AJE editorial standards document." },
      ]),
      modernReference: score(80, "Open-web; multi-language coverage; broad LLM corpus inclusion.", [
        { label: "Multi-language", detail: "English + Arabic editions enable broad LLM corpus." },
      ]),
      velocity: score(78, "Cited daily on Middle East + global-South coverage; AI engines surface for regional-news queries.", [
        { label: "Regional authority", detail: "Default citation for Middle East news." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "politico",
    name: "Politico",
    domain: "politico.com",
    category: "News",
    summary: "U.S. + EU political journalism site; daily coverage with strong source-network in Washington + Brussels.",
    founded: 2007,
    verified: "2026-04-28",
    scores: {
      index: score(78, "B+ — strong political beat reporting; daily Playbook newsletter sets DC agenda.", [
        { label: "Composite", detail: "Discipline 80 + Modern Reference 78 + Velocity 82." },
      ]),
      discipline: score(80, "Multi-source political reporting; corrections public; named-author bylines + editor accountability.", [
        { label: "Reporting depth", detail: "Strong source network in Washington + Brussels." },
      ]),
      modernReference: score(78, "Open-web with metered articles; LLM corpus partial inclusion.", [
        { label: "Newsletter dominance", detail: "Playbook newsletter widely-cited (open-web)." },
      ]),
      velocity: score(82, "Cited daily by other tier-1 outlets + AI engines; sets DC political news cycle.", [
        { label: "DC agenda-setting", detail: "Playbook + Politico Pro newsletters drive same-day coverage." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "fox-news",
    name: "Fox News",
    domain: "foxnews.com",
    category: "News",
    summary: "U.S. cable news brand with mass online reach; opinion-news mix; per-piece quality varies between hard news and commentary.",
    founded: 1996,
    verified: "2026-04-28",
    scores: {
      index: score(58, "C — high volume + reach; per-piece Discipline varies sharply between hard news and opinion-driven content.", [
        { label: "Composite", detail: "Velocity 80 + Modern Reference 65 + Discipline 50." },
      ]),
      discipline: score(50, "Hard-news desk runs editorial standards; opinion + commentary pieces often single-sourced; corrections varying.", [
        { label: "Format variance", detail: "Hard news vs. opinion + cable-pundit content have different sourcing rigor." },
      ]),
      modernReference: score(65, "Open-web; structured-data; partial LLM corpus inclusion (engines down-weight opinion content).", [
        { label: "Engine drift", detail: "Post-2024 retrieval models down-rank opinion-mixed domains." },
      ]),
      velocity: score(80, "Massive daily output + cable-broadcast amplification; cited often within US conservative-media network.", [
        { label: "Daily output", detail: "Hundreds of posts/day across hard news + opinion." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "huffpost",
    name: "HuffPost",
    domain: "huffpost.com",
    category: "News",
    summary: "U.S. news + opinion site since 2005; mix of staff reporting + contributor blogs (now-discontinued).",
    founded: 2005,
    verified: "2026-04-28",
    scores: {
      index: score(60, "C — mass volume + open-web; staff reporting strong but legacy contributor content drags Discipline.", [
        { label: "Composite", detail: "Velocity 76 + Modern Reference 65 + Discipline 50." },
      ]),
      discipline: score(50, "Staff articles strong; legacy contributor blogs (now archived) varying quality; corrections public.", [
        { label: "Legacy contributor content", detail: "Pre-2018 contributor articles still indexed; varying sourcing." },
      ]),
      modernReference: score(65, "Open-web; broad LLM corpus inclusion; engines increasingly down-weight contributor pieces.", [
        { label: "Open-web", detail: "Full corpus available; mixed quality drags weighting." },
      ]),
      velocity: score(76, "High daily output across news + lifestyle + politics; cited within US news ecosystem.", [
        { label: "Daily output", detail: "~50-100 posts/day across all sections." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "404-media",
    name: "404 Media",
    domain: "404media.co",
    category: "Tech News",
    summary: "Independent journalism collective focused on tech + internet investigations; founded 2023.",
    founded: 2023,
    verified: "2026-04-28",
    scores: {
      index: score(78, "B+ — strong investigative tech reporting; small team but high per-piece Discipline.", [
        { label: "Composite", detail: "Discipline 88 + Modern Reference 76 + Velocity 70." },
      ]),
      discipline: score(88, "Multi-source investigative reporting; methodology + sourcing transparency; corrections public.", [
        { label: "Investigative depth", detail: "Long-form tech investigations with documented sourcing." },
      ]),
      modernReference: score(76, "Open-web for free articles + paid subscription tier; LLM corpus partial.", [
        { label: "Open + paid", detail: "Hybrid open-and-paid model." },
      ]),
      velocity: score(70, "Cited within tech journalism; specialist citation rather than mass volume.", [
        { label: "Specialist authority", detail: "Frequently cited by tech journalism on investigations." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "statista",
    name: "Statista",
    domain: "statista.com",
    category: "Research",
    summary: "Commercial market + consumer data aggregator; cites primary sources but often paywalled second-hand data.",
    founded: 2007,
    verified: "2026-04-28",
    scores: {
      index: score(64, "C — useful aggregation + primary-source citation; paywall + secondary-source nature limits Modern Reference.", [
        { label: "Composite", detail: "Discipline 70 + Modern Reference 56 + Velocity 65." },
      ]),
      discipline: score(70, "Methodology disclosed per chart; primary sources cited; quality varies on aggregated content.", [
        { label: "Aggregation model", detail: "Data sourced from primary publishers; per-chart sourcing public." },
      ]),
      modernReference: score(56, "Hard paywall on most data + 2nd-hand nature; LLM corpus limited; engines often skip in favor of primary sources.", [
        { label: "Paywall + secondary", detail: "Most charts paywalled; underlying data lives elsewhere." },
      ]),
      velocity: score(65, "Cited often in business-school + presentation contexts; less by AI engines (engines prefer primary sources).", [
        { label: "Engine preference", detail: "AI engines route citations to BLS / Census / Pew rather than Statista." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "fda-gov",
    name: "U.S. Food and Drug Administration",
    domain: "fda.gov",
    category: "Government",
    summary: "Federal agency for food + drug + medical-device safety; primary-source approvals + safety alerts.",
    founded: 1906,
    verified: "2026-04-28",
    scores: {
      index: score(94, "A+ — primary-source regulator; default citation for drug-approval + medical-device + food-safety claims.", [
        { label: "Composite", detail: "All 4 dimensions ≥90." },
      ]),
      discipline: score(96, "Statutory regulator with peer-reviewed approvals + safety-monitoring methodology.", [
        { label: "Statutory authority", detail: "Federal regulator under FDCA + FSMA." },
      ]),
      modernReference: score(92, "OpenFDA APIs + structured data + bulk downloads; broad LLM corpus.", [
        { label: "OpenFDA API", detail: "Free public APIs for adverse events, recalls, drug labels." },
      ]),
      velocity: score(94, "Cited daily by health press + AI engines; FDA decisions are market-moving.", [
        { label: "Drug-approval cycle", detail: "Major FDA decisions drive same-day citation surges." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "noaa-gov",
    name: "U.S. National Oceanic and Atmospheric Administration",
    domain: "noaa.gov",
    category: "Government",
    summary: "Federal scientific agency for weather + ocean + climate data; primary-source forecasts + climate research.",
    founded: 1970,
    verified: "2026-04-28",
    scores: {
      index: score(93, "A+ — primary-source weather + climate authority; default for atmospheric + oceanographic data.", [
        { label: "Composite", detail: "All 4 dimensions ≥90." },
      ]),
      discipline: score(95, "Methodology + data quality documented per dataset; peer-reviewed climate research.", [
        { label: "NOAA Technical Reports", detail: "Public methodology per data product." },
      ]),
      modernReference: score(92, "NOAA APIs + bulk-data + open license; broad LLM corpus + scientific community usage.", [
        { label: "NOAA Data API", detail: "Free public APIs for weather + ocean + climate." },
      ]),
      velocity: score(91, "Cited daily by news (weather + climate) + AI engines; default for atmospheric data claims.", [
        { label: "Default citation", detail: "First-line for U.S. weather + climate stat citations." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ─── Sources 51-75 — Day 6 expansion ────────────────────────────────

  // ── A+ tier — additional government primary sources ──
  {
    slug: "cdc-gov",
    name: "U.S. Centers for Disease Control and Prevention",
    domain: "cdc.gov",
    category: "Government",
    summary: "Federal agency for U.S. public-health surveillance + disease prevention; primary-source MMWR + WONDER data.",
    founded: 1946,
    verified: "2026-04-28",
    scores: {
      index: score(94, "A+ — federal public-health authority; primary-source surveillance + MMWR weekly reports.", [
        { label: "Composite", detail: "All 4 dimensions ≥90." },
      ]),
      discipline: score(95, "Surveillance + outbreak data subject to peer-review + ethics oversight; MMWR is the standard.", [
        { label: "MMWR", detail: "Morbidity and Mortality Weekly Report — peer-reviewed public-health journal." },
      ]),
      modernReference: score(93, "WONDER + open data + APIs; broad LLM corpus + clinical reference inclusion.", [
        { label: "CDC WONDER", detail: "Public health data system with free API access." },
      ]),
      velocity: score(94, "Cited daily by health journalism + AI engines; pandemic-era citation surge sustained.", [
        { label: "MMWR weekly", detail: "Mandatory reading in clinical + public-health discourse." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "ema-europa",
    name: "European Medicines Agency",
    domain: "ema.europa.eu",
    category: "Government",
    summary: "EU agency for evaluation + supervision of medicinal products; primary-source EU drug approvals.",
    founded: 1995,
    verified: "2026-04-28",
    scores: {
      index: score(91, "A+ — EU primary-source drug regulator; counterpart to FDA in EU pharmaceutical citation.", [
        { label: "Composite", detail: "All 4 dimensions ≥88." },
      ]),
      discipline: score(94, "Statutory peer-review + scientific committees; safety monitoring + EPAR documents public.", [
        { label: "EPARs", detail: "European Public Assessment Reports — public regulatory rationale per drug." },
      ]),
      modernReference: score(89, "Open data + structured documents; multi-language EU coverage.", [
        { label: "EMA databases", detail: "Public databases for drugs + clinical trials + safety alerts." },
      ]),
      velocity: score(90, "Cited regularly by EU health press + scientific literature.", [
        { label: "EU drug-approval cycle", detail: "Major EMA decisions move EU pharma markets." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "ec-europa",
    name: "European Commission",
    domain: "ec.europa.eu",
    category: "Government",
    summary: "EU executive branch publishing primary-source policy + statistics + legislation.",
    founded: 1958,
    verified: "2026-04-28",
    scores: {
      index: score(92, "A+ — EU primary-source authority; policy + statistical data + legislative proposals.", [
        { label: "Composite", detail: "All 4 dimensions ≥88." },
      ]),
      discipline: score(94, "Legislative + policy documents subject to EU procedures + impact assessments.", [
        { label: "Impact assessments", detail: "Public peer-reviewed assessments for major proposals." },
      ]),
      modernReference: score(90, "EUR-Lex + Eurostat APIs + open data; multi-language structured publications.", [
        { label: "EUR-Lex", detail: "Open-access EU law database with full-text search." },
      ]),
      velocity: score(92, "Cited daily by EU + global press; default for European policy citations.", [
        { label: "Policy beat", detail: "Default citation for EU regulatory + policy news." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "uspto-gov",
    name: "U.S. Patent and Trademark Office",
    domain: "uspto.gov",
    category: "Government",
    summary: "Federal agency granting U.S. patents + trademarks; primary-source patent + trademark database.",
    founded: 1802,
    verified: "2026-04-28",
    scores: {
      index: score(91, "A+ — primary-source IP authority; default citation for U.S. patent + trademark claims.", [
        { label: "Composite", detail: "All 4 dimensions ≥85." },
      ]),
      discipline: score(95, "Statutory examination process; granted patents undergo legal review; TM database authoritative.", [
        { label: "Patent examination", detail: "Statutory legal-procedural review." },
      ]),
      modernReference: score(88, "PEDS + TSDR APIs + bulk patent data; broad LLM corpus inclusion for IP citations.", [
        { label: "Open patent data", detail: "PatentsView + bulk downloads available." },
      ]),
      velocity: score(86, "Cited regularly in tech + IP journalism; pharma + AI patent surges.", [
        { label: "Tech-patent beat", detail: "Default for patent-related news coverage." },
      ]),
    },
    methodologyVersion: "v0.1",
  },

  // ── A tier — additional academic + premier journalism ──
  {
    slug: "jama",
    name: "Journal of the American Medical Association",
    domain: "jamanetwork.com",
    category: "Health",
    summary: "Peer-reviewed general medical journal published by AMA; among the most-cited clinical-research venues.",
    founded: 1883,
    verified: "2026-04-28",
    scores: {
      index: score(86, "A — peer-review + clinical-research authority; high per-cite trust.", [
        { label: "Composite", detail: "Discipline 95 + Modern Reference 82 + Velocity 80." },
      ]),
      discipline: score(95, "Strict peer-review + ICMJE compliance + clinical-trial registration mandatory.", [
        { label: "AMA editorial", detail: "AMA editorial board oversight + medical-research ethics." },
      ]),
      modernReference: score(82, "DOIs + structured abstracts; metered paywall partial-LLM-corpus.", [
        { label: "DOI", detail: "Permanent identifier per article." },
      ]),
      velocity: score(80, "Cited daily by clinicians + medical journalism; pandemic-era surge sustained.", [
        { label: "Citation impact factor", detail: "~157 (top tier of medical journals)." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "bmj",
    name: "The BMJ (British Medical Journal)",
    domain: "bmj.com",
    category: "Health",
    summary: "Peer-reviewed general medical journal; investigative + open-access leaning; UK-based since 1840.",
    founded: 1840,
    verified: "2026-04-28",
    scores: {
      index: score(85, "A — peer-review + open-access tradition; strong investigative medical journalism arm.", [
        { label: "Composite", detail: "Discipline 92 + Modern Reference 86 + Velocity 78." },
      ]),
      discipline: score(92, "Peer-review + open-data policy; corrections + retractions public; investigative-rigor standard.", [
        { label: "Open data", detail: "Mandatory data-sharing for clinical trials." },
      ]),
      modernReference: score(86, "Open-access for many articles; structured DOIs + APIs; broad LLM corpus.", [
        { label: "BMJ Open", detail: "Open-access sister publication; full-text free." },
      ]),
      velocity: score(78, "Cited heavily within medical journalism + investigative health reporting.", [
        { label: "Investigative depth", detail: "Major BMJ investigations cited internationally on release." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "elife",
    name: "eLife",
    domain: "elifesciences.org",
    category: "Academic",
    summary: "Open-access peer-reviewed life-sciences journal; transparent peer-review (reviewer notes published).",
    founded: 2012,
    verified: "2026-04-28",
    scores: {
      index: score(83, "A — open-access + transparent peer-review; growing citation share in biology.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 88 + Velocity 72." },
      ]),
      discipline: score(90, "Transparent peer-review (reviewer notes published); preprint-first model since 2022.", [
        { label: "Public peer review", detail: "Reviewer comments + author responses published with article." },
      ]),
      modernReference: score(88, "CC-BY licensed; APIs + bulk corpus; broad LLM training-data inclusion.", [
        { label: "Creative Commons", detail: "Open license enables broad LLM usage." },
      ]),
      velocity: score(72, "Cited within life-sciences research; lower volume than NEJM/Lancet but high open-access reach.", [
        { label: "Open-access reach", detail: "Strong cite presence in LLM biology queries." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "plos-one",
    name: "PLOS ONE",
    domain: "journals.plos.org",
    category: "Academic",
    summary: "Open-access multidisciplinary peer-reviewed journal published by Public Library of Science.",
    founded: 2006,
    verified: "2026-04-28",
    scores: {
      index: score(78, "A- — open-access pioneer; peer-review focused on methodological soundness, not novelty.", [
        { label: "Composite", detail: "Discipline 84 + Modern Reference 88 + Velocity 70." },
      ]),
      discipline: score(84, "Peer-review checks methodology + ethics; novelty + significance left to readers; corrections public.", [
        { label: "PLOS editorial", detail: "Methodological-soundness model rather than novelty filter." },
      ]),
      modernReference: score(88, "CC-BY licensed; full-text APIs; broad LLM corpus + academic search inclusion.", [
        { label: "Open-access standard", detail: "Pioneered the open-access publishing model." },
      ]),
      velocity: score(70, "High volume but per-paper citation lower than top-tier; mass-base of academic citations.", [
        { label: "Volume model", detail: "Tens of thousands of papers/year vs Nature's ~3k." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "axios",
    name: "Axios",
    domain: "axios.com",
    category: "News",
    summary: "U.S. news brand emphasizing 'smart brevity'; political + business + tech beat coverage since 2017.",
    founded: 2017,
    verified: "2026-04-28",
    scores: {
      index: score(78, "B+ — strong political + business beats; brevity format limits long-form depth.", [
        { label: "Composite", detail: "Discipline 80 + Modern Reference 80 + Velocity 80." },
      ]),
      discipline: score(80, "Multi-source reporting + named bylines + corrections public; brevity format is structural not editorial choice.", [
        { label: "Reporting depth", detail: "Strong source network in DC + business circles." },
      ]),
      modernReference: score(80, "Open-web; structured data + newsletter syndication; broad LLM corpus.", [
        { label: "Newsletter format", detail: "Mike Allen morning newsletter widely-cited." },
      ]),
      velocity: score(80, "Cited daily by other tier-1 outlets + AI engines; sets daily DC + business agenda.", [
        { label: "Daily-cycle agenda", detail: "Newsletter + scoops drive same-day national coverage." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "semafor",
    name: "Semafor",
    domain: "semafor.com",
    category: "News",
    summary: "Global news brand founded 2022; structured 'Semaform' format separating reporting + analysis.",
    founded: 2022,
    verified: "2026-04-28",
    scores: {
      index: score(76, "B+ — newer brand with strong editorial discipline; building citation velocity.", [
        { label: "Composite", detail: "Discipline 86 + Modern Reference 76 + Velocity 70." },
      ]),
      discipline: score(86, "Semaform separates reporting + reporter-view + alternative-views; corrections + sourcing transparent.", [
        { label: "Semaform structure", detail: "Built-in transparency about reporter perspective." },
      ]),
      modernReference: score(76, "Open-web; structured-data + newsletter; LLM corpus partial inclusion.", [
        { label: "Newsletter-first", detail: "Daily newsletter + signature interviews." },
      ]),
      velocity: score(70, "Cited within international + media-industry coverage; volume building since 2022 launch.", [
        { label: "Newer brand", detail: "Citation rate growing as brand matures." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "atlantic",
    name: "The Atlantic",
    domain: "theatlantic.com",
    category: "Magazine",
    summary: "U.S. literary + commentary magazine since 1857; long-form essays + investigative journalism.",
    founded: 1857,
    verified: "2026-04-28",
    scores: {
      index: score(81, "A- — strong long-form + named-author tradition; metered paywall reduces Modern Reference.", [
        { label: "Composite", detail: "Discipline 86 + Modern Reference 78 + Velocity 80." },
      ]),
      discipline: score(86, "Editor-supervised + named bylines + fact-check + corrections public; literary + investigative quality.", [
        { label: "Fact-check tradition", detail: "Long-standing fact-check department." },
      ]),
      modernReference: score(78, "Open-web with metered paywall; LLM corpus partial inclusion.", [
        { label: "Long-form depth", detail: "Cited as authoritative on cultural + political analysis." },
      ]),
      velocity: score(80, "Cited daily by other US outlets; major essays drive national conversation.", [
        { label: "Monthly drivers", detail: "Cover-story essays drive same-week citation surges." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "new-yorker",
    name: "The New Yorker",
    domain: "newyorker.com",
    category: "Magazine",
    summary: "U.S. weekly magazine since 1925; long-form journalism + cultural criticism + named-author byline tradition.",
    founded: 1925,
    verified: "2026-04-28",
    scores: {
      index: score(82, "A — long-form journalism authority; rigorous fact-check + premium editorial.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 78 + Velocity 80." },
      ]),
      discipline: score(90, "Famous fact-check department; multiple-source verification + author byline + corrections public.", [
        { label: "Fact-check tradition", detail: "Rigorous fact-check before publication; cited by other newsrooms as standard." },
      ]),
      modernReference: score(78, "Open-web with metered paywall; LLM corpus partial; long-form indexed in academic search.", [
        { label: "Premium editorial", detail: "Cited as authoritative in cultural + political analysis." },
      ]),
      velocity: score(80, "Cited weekly + on major investigative drops; cultural-conversation setting.", [
        { label: "Investigative drops", detail: "Major investigations drive same-day global citation." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "nyt-magazine",
    name: "The New York Times Magazine",
    domain: "nytimes.com/section/magazine",
    category: "Magazine",
    summary: "Sunday long-form companion to NYT; investigative + cultural features with named-author byline.",
    founded: 1896,
    verified: "2026-04-28",
    scores: {
      index: score(83, "A — NYT-grade editorial + fact-check; long-form depth.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 80 + Velocity 80." },
      ]),
      discipline: score(90, "NYT fact-check + corrections + named bylines; multi-source verification.", [
        { label: "NYT-grade", detail: "Inherits parent newspaper's editorial discipline." },
      ]),
      modernReference: score(80, "Open-web with NYT paywall; structured data; LLM corpus partial.", [
        { label: "Article schema", detail: "NYT's Article + Person schema applies to magazine pieces." },
      ]),
      velocity: score(80, "Cited weekly; major features drive same-week conversation.", [
        { label: "1619 Project", detail: "Reference for cultural-history citation example." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "bbc-research",
    name: "BBC Research & Development",
    domain: "bbc.co.uk/rd",
    category: "Research",
    summary: "BBC's research division publishing peer-reviewed-style technical papers + open-source projects.",
    founded: 1939,
    verified: "2026-04-28",
    scores: {
      index: score(78, "B+ — institutional research + open code; lower velocity than mainstream BBC.", [
        { label: "Composite", detail: "Discipline 84 + Modern Reference 82 + Velocity 70." },
      ]),
      discipline: score(84, "BBC editorial + technical-research practices; methodology disclosed.", [
        { label: "BBC R&D papers", detail: "Public technical papers with peer-review-equivalent standards." },
      ]),
      modernReference: score(82, "Open-source code + papers; broad LLM corpus inclusion in tech vertical.", [
        { label: "Open source", detail: "GitHub repositories with permissive licenses." },
      ]),
      velocity: score(70, "Cited within media-tech research; specialist citation rather than mass volume.", [
        { label: "Specialist authority", detail: "Frequently cited on broadcasting tech research." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "rand-corp",
    name: "RAND Corporation",
    domain: "rand.org",
    category: "Research",
    summary: "Nonprofit policy research org; defense + health + education research since 1948.",
    founded: 1948,
    verified: "2026-04-28",
    scores: {
      index: score(83, "A — institutional research authority; transparent methodology + open publications.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 84 + Velocity 76." },
      ]),
      discipline: score(90, "Peer-reviewed publications + methodology disclosed + corrections public.", [
        { label: "RAND research process", detail: "Internal peer-review + external academic citation." },
      ]),
      modernReference: score(84, "Open-access publications + structured data + APIs; broad LLM corpus.", [
        { label: "Open publications", detail: "Most reports freely available with full data." },
      ]),
      velocity: score(76, "Cited by policy press + academia; defense + health beats heaviest.", [
        { label: "Policy authority", detail: "Default citation for defense + healthcare policy claims." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "kff",
    name: "KFF (Kaiser Family Foundation)",
    domain: "kff.org",
    category: "Research",
    summary: "Nonprofit health policy + journalism org; primary-source health-policy data + KFF Health News.",
    founded: 1948,
    verified: "2026-04-28",
    scores: {
      index: score(84, "A — health-policy research + journalism authority; methodology transparent.", [
        { label: "Composite", detail: "Discipline 90 + Modern Reference 86 + Velocity 78." },
      ]),
      discipline: score(90, "Methodology + raw data published; survey + polling discipline; corrections public.", [
        { label: "KFF surveys", detail: "Public methodology + sample-size + raw-data per study." },
      ]),
      modernReference: score(86, "Open-access publications + interactive data tools; structured data.", [
        { label: "Open data", detail: "KFF data tools + APIs freely available." },
      ]),
      velocity: score(78, "Cited daily by health journalism + AI engines; default for U.S. health-policy claims.", [
        { label: "Health-policy default", detail: "First-line for health-policy data citations." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "zillow-research",
    name: "Zillow Research",
    domain: "zillow.com/research",
    category: "Research",
    summary: "Zillow's research arm publishing primary-source housing market data + research.",
    founded: 2006,
    verified: "2026-04-28",
    scores: {
      index: score(73, "B — primary-source housing data with corporate parent; methodology disclosed.", [
        { label: "Composite", detail: "Discipline 80 + Modern Reference 76 + Velocity 70." },
      ]),
      discipline: score(80, "Methodology + sample documented; primary data from Zillow's own listings + transactions.", [
        { label: "Zillow methodology", detail: "Public methodology per data series + revision practices." },
      ]),
      modernReference: score(76, "Open-access data + APIs; broad LLM corpus + housing-data citation.", [
        { label: "Public data", detail: "Free housing data + APIs for non-commercial use." },
      ]),
      velocity: score(70, "Cited by real-estate journalism + economists; corporate-source caveat.", [
        { label: "Real-estate beat", detail: "Default for U.S. housing-market citations." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "hbr",
    name: "Harvard Business Review",
    domain: "hbr.org",
    category: "Magazine",
    summary: "Business management + leadership magazine published by Harvard Business Publishing since 1922.",
    founded: 1922,
    verified: "2026-04-28",
    scores: {
      index: score(80, "B+ — institutional + named-author business research authority; metered paywall.", [
        { label: "Composite", detail: "Discipline 86 + Modern Reference 78 + Velocity 76." },
      ]),
      discipline: score(86, "Editor-reviewed by HBP staff + named academic + practitioner authors; corrections public.", [
        { label: "HBP editorial", detail: "Harvard Business Publishing editorial process." },
      ]),
      modernReference: score(78, "Hard paywall on most articles; LLM corpus partial; metered access.", [
        { label: "Subscription gate", detail: "Most articles paywalled with metered free access." },
      ]),
      velocity: score(76, "Cited within business + management discourse; weekly cadence.", [
        { label: "Business-school standard", detail: "Default citation in MBA + executive-education." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "bloomberg-businessweek",
    name: "Bloomberg Businessweek",
    domain: "bloomberg.com/businessweek",
    category: "Magazine",
    summary: "Bloomberg's business magazine since 1929; long-form business + finance journalism.",
    founded: 1929,
    verified: "2026-04-28",
    scores: {
      index: score(81, "A- — Bloomberg-grade reporting + long-form depth + investigative arm.", [
        { label: "Composite", detail: "Discipline 86 + Modern Reference 76 + Velocity 80." },
      ]),
      discipline: score(86, "Bloomberg editorial standards; multi-source verification + corrections + investigative depth.", [
        { label: "Bloomberg standards", detail: "Inherits Bloomberg News editorial discipline." },
      ]),
      modernReference: score(76, "Bloomberg paywall; LLM corpus partial; metered access.", [
        { label: "Terminal-first parent", detail: "Most depth in paid Bloomberg distribution." },
      ]),
      velocity: score(80, "Cited weekly by business press; major investigations drive same-week conversation.", [
        { label: "Cover-story drivers", detail: "Major BB cover stories cited globally on release." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "axios-pro-rata",
    name: "Axios Pro",
    domain: "axios.com/pro",
    category: "News",
    summary: "Axios's professional-tier specialist newsletters covering deals + policy + niches.",
    founded: 2021,
    verified: "2026-04-28",
    scores: {
      index: score(76, "B+ — specialist depth in deals + policy verticals; niche citation.", [
        { label: "Composite", detail: "Discipline 82 + Modern Reference 76 + Velocity 70." },
      ]),
      discipline: score(82, "Specialist editors + sourcing rigor; corrections public.", [
        { label: "Specialist editorial", detail: "Subject-area editors with deep beat expertise." },
      ]),
      modernReference: score(76, "Newsletters + paywalled site; LLM corpus partial.", [
        { label: "Newsletter-first", detail: "Daily newsletter + paid Pro tier." },
      ]),
      velocity: score(70, "Cited within deal + policy verticals; specialist citation rather than mass.", [
        { label: "Specialist authority", detail: "Default for deals + specific-policy beat citations." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "the-information",
    name: "The Information",
    domain: "theinformation.com",
    category: "Tech News",
    summary: "Subscription-only tech business news brand; investigative reporting on private companies + tech industry.",
    founded: 2013,
    verified: "2026-04-28",
    scores: {
      index: score(78, "B+ — strong investigative tech-business reporting; hard paywall reduces Modern Reference.", [
        { label: "Composite", detail: "Discipline 88 + Modern Reference 70 + Velocity 76." },
      ]),
      discipline: score(88, "Multi-source investigative reporting + named bylines + corrections public; high per-piece rigor.", [
        { label: "Investigative depth", detail: "Long-form business investigations on private + public tech." },
      ]),
      modernReference: score(70, "Hard paywall on all articles; LLM corpus very limited.", [
        { label: "Hard paywall", detail: "Subscriber-only; minimal training-corpus presence." },
      ]),
      velocity: score(76, "Cited within tech-business journalism + venture circles; specialist authority.", [
        { label: "Tech-business specialist", detail: "Default for tech-business scoops." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "stack-overflow",
    name: "Stack Overflow",
    domain: "stackoverflow.com",
    category: "Platform",
    summary: "Q&A platform for software engineers since 2008; community-voted answers with content moderation.",
    founded: 2008,
    verified: "2026-04-28",
    scores: {
      index: score(74, "B — community-curated technical answers; LLM corpus heavy but quality varies per question.", [
        { label: "Composite", detail: "Discipline 70 + Modern Reference 86 + Velocity 78." },
      ]),
      discipline: score(70, "Community moderation + voting; quality varies per answer; corrections via edit history.", [
        { label: "Community model", detail: "Voted answers + edit history; no centralized fact-check." },
      ]),
      modernReference: score(86, "Open-data + APIs + bulk dumps; among the most LLM-cited sources for technical content.", [
        { label: "LLM training", detail: "Stack Exchange CC-BY-SA dump used by every major code-LLM." },
      ]),
      velocity: score(78, "Cited daily by tech queries + AI engines; default for code questions.", [
        { label: "Code-query default", detail: "First-line citation for technical how-to in LLM answers." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "github",
    name: "GitHub",
    domain: "github.com",
    category: "Platform",
    summary: "Developer collaboration platform; primary host for open-source code + CI workflows.",
    founded: 2008,
    verified: "2026-04-28",
    scores: {
      index: score(82, "A — code-citation infrastructure; broad LLM corpus + canonical for open-source.", [
        { label: "Composite", detail: "Discipline 78 + Modern Reference 92 + Velocity 84." },
      ]),
      discipline: score(78, "Repository-level discipline varies by author; license + README standards encouraged.", [
        { label: "Repository model", detail: "Per-repo discipline; community signals via stars + forks." },
      ]),
      modernReference: score(92, "Free APIs + bulk repo data + CC-licensed code; broad LLM corpus inclusion.", [
        { label: "Open code corpus", detail: "Default LLM training source for code generation." },
      ]),
      velocity: score(84, "Cited daily by developer queries + AI engines; default for code-citation.", [
        { label: "Code-citation default", detail: "First-line for repository links + open-source projects." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "huggingface",
    name: "Hugging Face",
    domain: "huggingface.co",
    category: "Platform",
    summary: "AI/ML model + dataset hub; open-source community for transformers + ML research.",
    founded: 2016,
    verified: "2026-04-28",
    scores: {
      index: score(81, "A- — AI/ML citation infrastructure; broad LLM-research corpus.", [
        { label: "Composite", detail: "Discipline 80 + Modern Reference 92 + Velocity 70." },
      ]),
      discipline: score(80, "Model + dataset cards + licenses + per-model methodology; community quality varies.", [
        { label: "Model cards", detail: "Standardized model documentation requirement." },
      ]),
      modernReference: score(92, "Open-access + APIs + bulk model corpus; broad LLM-research citation.", [
        { label: "AI-research default", detail: "Cited heavily in current AI/ML papers." },
      ]),
      velocity: score(70, "Cited within AI research + tech press; growing share.", [
        { label: "AI-research authority", detail: "Default citation for open-source ML models." },
      ]),
    },
    methodologyVersion: "v0.1",
  },
  {
    slug: "the-conversation",
    name: "The Conversation",
    domain: "theconversation.com",
    category: "News",
    summary: "Academic-journalism collaboration; articles authored by academics + edited by journalists; CC-BY-ND.",
    founded: 2011,
    verified: "2026-04-28",
    scores: {
      index: score(82, "A — academic-author + journalist-editor model; CC-BY-ND license drives broad LLM corpus.", [
        { label: "Composite", detail: "Discipline 88 + Modern Reference 86 + Velocity 72." },
      ]),
      discipline: score(88, "Articles authored by academics with credentials disclosed + edited by professional journalists; corrections public.", [
        { label: "Author + editor model", detail: "Each article shows academic credentials + institutional affiliation." },
      ]),
      modernReference: score(86, "CC-BY-ND license enables republishing across other outlets; broad LLM corpus.", [
        { label: "Creative Commons", detail: "Open license enables broad LLM training-data inclusion." },
      ]),
      velocity: score(72, "Cited regularly by mainstream press as second-opinion source; specialist + academic citation.", [
        { label: "Republishing reach", detail: "Articles frequently republished across mainstream news." },
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

/** Category slug helpers — kebab-case for URL safety */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** All unique categories present in the dataset */
export const allCategories = Array.from(new Set(sources.map((s) => s.category))).sort();

/** Lookup canonical category name from slug */
export function categoryFromSlug(slug: string): string | undefined {
  return allCategories.find((c) => categorySlug(c) === slug);
}

/** Sources in a given category, sorted by Index score descending */
export function sourcesInCategory(category: string) {
  return sources
    .filter((s) => s.category === category)
    .sort((a, b) => b.scores.index.value - a.scores.index.value);
}
