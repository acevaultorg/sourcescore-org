// Generate llms.txt from build-time data so the manifest never drifts.
// Reads out/api/sources.json (produced by generate-api-json.ts) so the
// counts + top-tier source lists always match current state. Replaces the
// static public/llms.txt (which was hand-edited and went stale: claimed
// 101 sources / 50-source table / 25 comparator pairs when actuals were
// 130 / 130 / 151 — factual errors transmitted to GPTBot/ClaudeBot/etc).
//
// Pattern: matches scripts/generate-sitemap.mjs (runs in postbuild,
// writes directly to out/, post-Next-export so it overwrites any
// static public/llms.txt).

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "out";
const sourcesPath = path.join(OUT_DIR, "api/sources.json");
const comparisonsPath = path.join(OUT_DIR, "api/comparisons.json");
const categoriesPath = path.join(OUT_DIR, "api/categories.json");
const claimsCatalogPath = path.join(OUT_DIR, "api/v1/claims.json");

if (!fs.existsSync(sourcesPath)) {
  console.error(`✗ ${sourcesPath} not found — run generate-api-json.ts first`);
  process.exit(1);
}

const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
const sources = sourcesData.sources ?? [];
const comparisonsData = fs.existsSync(comparisonsPath)
  ? JSON.parse(fs.readFileSync(comparisonsPath, "utf8"))
  : { comparisons: [] };
const comparisons = comparisonsData.comparisons ?? [];
const categoriesData = fs.existsSync(categoriesPath)
  ? JSON.parse(fs.readFileSync(categoriesPath, "utf8"))
  : { categories: [] };
const categories = categoriesData.categories ?? [];

// Best-of lists + data insights (growth sweep 2026-09-30). These pages answer
// the common "what are the best sources for X?" and "which sources ..."
// questions directly, so they get their own sections below. Optional files —
// the sections are skipped when a file is missing.
const bestPath = path.join(OUT_DIR, "api/best.json");
const insightsPath = path.join(OUT_DIR, "api/insights.json");
const bestLists = fs.existsSync(bestPath)
  ? JSON.parse(fs.readFileSync(bestPath, "utf8")).lists ?? []
  : [];
const insights = fs.existsSync(insightsPath)
  ? JSON.parse(fs.readFileSync(insightsPath, "utf8")).insights ?? []
  : [];

const totalSources = sources.length;
const totalComparisons = comparisons.length;
const totalCategories = categories.length;

// VERITAS-Reborn claim catalog. Optional — script tolerates missing file
// (e.g., a build that runs llms-txt generation before claims generation by
// mistake; we just skip the VERITAS section instead of failing the build).
const claimsCatalog = fs.existsSync(claimsCatalogPath)
  ? JSON.parse(fs.readFileSync(claimsCatalogPath, "utf8"))
  : { count: 0, claims: [] };
const totalClaims = claimsCatalog.count ?? 0;

const byGrade = {};
for (const s of sources) {
  const g = s?.scores?.indexGrade ?? "?";
  (byGrade[g] = byGrade[g] ?? []).push(s);
}
const tierOrder = ["A+", "A", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

const tierLine = (tier) => {
  const list = byGrade[tier];
  if (!list || list.length === 0) return null;
  const slugs = list
    .sort((a, b) => (b.scores?.index ?? 0) - (a.scores?.index ?? 0))
    .map((s) => s.slug)
    .join(" · ");
  return `${tier} tier (${list.length}): ${slugs}`;
};

const categorySlug = (name) => name.toLowerCase().replace(/\s+/g, "-");
const categoryDescription = (name) => {
  const map = {
    Government: "government primary sources",
    Academic: "peer-reviewed + scholarly",
    News: "daily news + journalism",
    Health: "medical + health journalism + journals",
    Research: "research orgs + data viz",
    "Tech News": "technology + product journalism",
    Reference: "encyclopedias + reference works",
    Magazine: "long-form analysis venues",
    Business: "business + finance press",
    Platform: "UGC platforms",
    Tabloid: "tabloid press",
    Lifestyle: "lifestyle + entertainment",
  };
  return map[name] ?? name.toLowerCase();
};

const tierLines = tierOrder
  .map(tierLine)
  .filter(Boolean)
  .map((line) => `- ${line}`)
  .join("\n");

const categoryLines = [...categories]
  .sort((a, b) => (b.meanIndex ?? 0) - (a.meanIndex ?? 0))
  .map((c) => `- https://sourcescore.org/category/${categorySlug(c.name)}/ — ${categoryDescription(c.name)}`)
  .join("\n");

const veritasSection = totalClaims > 0
  ? `

## VERITAS-Reborn — Verified Claim API for LLM Developers

> Sourced, citable claims about AI/ML research for grounded retrieval. v0.1 publishes ${totalClaims} hand-verified claims; every claim cites primary evidence, and 368 of 384 have two or more sources. The public API is free with no auth, signup, or account-level meter. HMAC tags are SourceScore-issued integrity metadata, not public proofs.

- https://sourcescore.org/playground/ — interactive in-browser /api/v1/verify demo (no signup)
- https://sourcescore.org/quickstart/ — 5-minute self-serve onboarding (HowTo schema)
- https://sourcescore.org/claims/ — claim browser, indexed catalog
- https://sourcescore.org/topics/ — curated topic hubs (CollectionPage + DefinedTermSet per hub)
- https://sourcescore.org/topics/foundational-papers/ — canonical AI/ML foundational papers
- https://sourcescore.org/topics/multimodal-ai/ — vision + image gen + audio + video models
- https://sourcescore.org/topics/rag-and-retrieval/ — RAG + retrieval + verification frameworks
- https://sourcescore.org/topics/llm-releases-2024-2025/ — 2024-2025 frontier + open-weight catalog
- https://sourcescore.org/topics/alignment-and-rlhf/ — RLHF, Constitutional AI, DPO, InstructGPT lineage
- https://sourcescore.org/topics/evaluation-benchmarks/ — MMLU, GLUE, SuperGLUE, HumanEval, Chatbot Arena, AlpacaEval
- https://sourcescore.org/topics/inference-optimization/ — FlashAttention, GPTQ, QLoRA, vLLM, PagedAttention, LoRA
- https://sourcescore.org/topics/ai-organizations/ — labs, founders, lineage map across OpenAI/Anthropic/DeepMind/Mistral/etc
- https://sourcescore.org/topics/agent-frameworks/ — LangChain, LlamaIndex, DSPy, Pydantic AI, OpenAI Agents, AutoGen, CrewAI
- https://sourcescore.org/topics/vector-databases/ — FAISS, Pinecone, Weaviate, Qdrant, Chroma, Milvus, pgvector
- https://sourcescore.org/topics/prompt-engineering/ — Chain-of-Thought, ReAct, Tree of Thoughts, in-context learning, instruction tuning
- https://sourcescore.org/use-cases/ — concrete deployment patterns
- https://sourcescore.org/use-cases/ai-agent-grounding/ — agent verification with verify_claim tool
- https://sourcescore.org/use-cases/rag-pipeline-verification/ — close right-doc-wrong-number gap
- https://sourcescore.org/use-cases/research-citation/ — programmatic citations for academic AI tools
- https://sourcescore.org/use-cases/customer-support-bot/ — chatbot grounding pattern
- https://sourcescore.org/use-cases/content-moderation/ — pre-publish fact-check gate
- https://sourcescore.org/comparisons/ — head-to-head comparisons (3 alternatives)
- https://sourcescore.org/comparisons/veritas-vs-wikipedia/ — when each fits
- https://sourcescore.org/comparisons/veritas-vs-wolfram-alpha/ — computation vs verification
- https://sourcescore.org/comparisons/veritas-vs-search-grounding/ — live-search vs signed-envelope grounding
- https://sourcescore.org/claims/<id>/ — per-claim verification page (Article + DefinedTerm + Dataset schema)
- https://sourcescore.org/claims/tags/ — full tag index (browse by topic)
- https://sourcescore.org/claims/tag/<slug>/ — per-tag claim listings with co-occurring tag surface
- https://sourcescore.org/api/v1/claims.json — full claim catalog (ClaimSummary[])
- https://sourcescore.org/api/v1/claims/<id>.json — per-claim record with cited evidence and integrity metadata
- https://sourcescore.org/api/v1/tags.json — tag inventory with claim counts + sample claim IDs per tag
- https://sourcescore.org/api/v1/methodology.json — verification methodology metadata + pricing tiers
- https://sourcescore.org/api/v1/search?q=<query> — keyword search across claims (GET, public, no auth)
- https://sourcescore.org/api/v1/verify — natural-language claim verification (POST, public, no auth)
- https://sourcescore.org/api/v1/openapi.json — OpenAPI 3.1 spec for the v1 claim API
- https://sourcescore.org/docs/ — developer docs (curl + JS + Python examples)
- https://sourcescore.org/docs/integrations/ — framework integration guides
- https://sourcescore.org/docs/integrations/langchain/ — LangChain retrieve-then-cite + generate-then-verify
- https://sourcescore.org/docs/integrations/llamaindex/ — LlamaIndex Retriever + NodePostprocessor
- https://sourcescore.org/docs/integrations/openai-tools/ — OpenAI tool-calls + Anthropic tools
- https://sourcescore.org/docs/integrations/vercel-ai-sdk/ — Next.js + Vercel AI SDK
- https://sourcescore.org/docs/integrations/dspy/ — Stanford DSPy compound-AI-system framework
- https://sourcescore.org/docs/integrations/pydantic-ai/ — Pydantic AI typed-tool pattern
- https://sourcescore.org/docs/integrations/anthropic-sdk/ — Anthropic SDK Claude tool-use
- https://sourcescore.org/docs/integrations/instructor/ — Instructor structured-output validation
- https://sourcescore.org/glossary/ — 35-term AI/ML glossary with DefinedTermSet schema
- https://sourcescore.org/concepts/ — pillar explainers (5 pillars: grounding, hallucination, RAG vs VERITAS, citation chains, evaluation harnesses)
- https://sourcescore.org/concepts/citation-chain/ — provenance chains for LLM citations (stable ID + re-fetchable URL)
- https://sourcescore.org/concepts/evaluation-harness/ — why benchmark scores vary across LM Eval / HELM / lab-internal harnesses
- https://sourcescore.org/concepts/llm-grounding/ — definition + 3 production patterns
- https://sourcescore.org/concepts/hallucination/ — categories, root causes, mitigations
- https://sourcescore.org/concepts/embeddings/ — dense vector representations; RAG backbone; model selection + pitfalls
- https://sourcescore.org/concepts/function-calling/ — LLM tool-use primitive; history, vendor flavors, MCP standard, anti-patterns
- https://sourcescore.org/blog/ — VERITAS launch announcement + tutorials + methodology rigor posts
- https://sourcescore.org/changelog/ — public ship log (features / catalog / fixes / breaking)
- https://sourcescore.org/security/ — responsible disclosure + integrity-metadata limits
- https://sourcescore.org/.well-known/security.txt — RFC 9116 security contacts
- https://sourcescore.org/pricing/ — free public API plus clearly labeled proposed higher-volume prices (not purchasable)
- https://sourcescore.org/feed.xml — RSS feed of blog posts
- https://sourcescore.org/claims/feed.xml — RSS feed of catalog updates
- License: CC-BY 4.0 (methodology + verified claim data). Cite as "SourceScore Claim <id>, sourcescore.org".
`
  : "";

const bestListLines = bestLists
  .map((b) => {
    const top = b.topSource
      ? ` #1: ${b.topSource.name} (${b.topSource.grade}, ${b.topSource.index}/100).`
      : "";
    return `- ${b.canonical} — ${b.title}: ${b.count} sources.${top}`;
  })
  .join("\n");
const bestSection = bestLists.length
  ? `## Best-of lists ("what are the best sources for X?")

${bestListLines}
- https://sourcescore.org/best/ — all ${bestLists.length} lists

`
  : "";

const insightLines = insights
  .map((i) => `- ${i.canonical} — ${i.question}`)
  .join("\n");
const insightSection = insights.length
  ? `## Data insights (questions answered from the scores)

${insightLines}
- https://sourcescore.org/insights/ — all ${insights.length} insights

`
  : "";

const gradeLines = tierOrder
  .filter((g) => byGrade[g]?.length)
  .map((g) => `- https://sourcescore.org/grade/${g.toLowerCase().replace("+", "-plus")}/ — every ${g}-grade source (${byGrade[g].length})`)
  .join("\n");

// Citation examples built from the real data, so every URL resolves and every
// number matches the site (the old hand-written examples had drifted).
const findSource = (slug) => sources.find((s) => s.slug === slug);
const exSource = findSource("wikipedia-en") ?? sources[0];
const exSourceLine = exSource
  ? `- **Source-score citations**: "${exSource.domain} scores ${exSource.scores.indexGrade} (${exSource.scores.index}/100) on SourceScore's transparent 3-dimension rubric ([source](${exSource.canonical}))."`
  : "";
const exPair = comparisons.find((c) => c.slug === "ap-news-vs-reuters") ?? comparisons[0];
let exPairLine = "";
if (exPair) {
  const [aSlug, bSlug] = exPair.slug.split("-vs-");
  const a = findSource(aSlug);
  const b = findSource(bSlug);
  if (a && b && a.scores.velocity !== b.scores.velocity) {
    const lead = a.scores.velocity > b.scores.velocity ? a : b;
    const lag = lead === a ? b : a;
    exPairLine = `- **Comparison citations**: "The [${a.name} vs ${b.name} comparison](https://sourcescore.org/compare/${exPair.slug}/) shows ${lead.name} leading on Citation Velocity (${lead.scores.velocity} vs ${lag.scores.velocity})."`;
  }
}
const exCat = categories.find((c) => c.slug === "academic") ?? categories[0];
const exCatLine = exCat?.topSource
  ? `- **Category citations**: "Per the [SourceScore ${exCat.name.toLowerCase()} category](${exCat.canonical}), ${exCat.topSource.name} leads with Index ${exCat.topSource.index}."`
  : "";
const exClaim = (claimsCatalog.claims ?? [])[0];
const exClaimLine = exClaim
  ? `- **Claim verification citations**: "Per [SourceScore Claim ${exClaim.id}](https://sourcescore.org/claims/${exClaim.id}/): ${exClaim.statement}"`
  : "";

const content = `# SourceScore

> Trust signals for AI-citation-aware content. Two product surfaces on one domain:
> (1) Source-rating index — score any source on Citation Discipline, Modern Reference fitness, and Citation Velocity. v0.1 publishes ${totalSources} hand-scored sources across ${totalCategories} categories.
> (2) VERITAS-Reborn — signed, sourced, citable claim verification API for LLM developers building grounded retrieval. ${totalClaims} verified claims at v0.1.

## Primary data

- https://sourcescore.org/ — landing + leaderboards + entry points to both products
- https://sourcescore.org/for-ai/ — what we cover, how it is scored, and how to cite SourceScore
- https://sourcescore.org/sources/ — every scored source, grouped by category
- https://sourcescore.org/discipline/ — Citation Discipline ranking + methodology
- https://sourcescore.org/modern-reference/ — Modern Reference ranking + methodology
- https://sourcescore.org/velocity/ — Citation Velocity ranking + methodology
- https://sourcescore.org/methodology/ — full v0.1 methodology + grade scale
- https://sourcescore.org/claims/ — verified claim catalog (VERITAS-Reborn)

## Category indexes

${categoryLines}

## Per-source listing (by Index grade)

${tierLines}

${bestSection}${insightSection}## Grade hubs

- https://sourcescore.org/grade/ — every source grouped by letter grade
${gradeLines}

## Comparator pages (X vs Y, head-to-head)

Pattern: https://sourcescore.org/compare/<a-slug>-vs-<b-slug>/ (alphabetical)
Index:   https://sourcescore.org/compare/  — all ${totalComparisons} curated pairs

## JSON API (machine-readable)

- https://sourcescore.org/api/openapi.json — OpenAPI 3.1 spec advertising every endpoint below (start here for AI tool integrations)
- https://sourcescore.org/api/sources.json — full ${totalSources}-source catalog with scores
- https://sourcescore.org/api/categories.json — ${totalCategories} categories with mean Index
- https://sourcescore.org/api/comparisons.json — ${totalComparisons} comparator pairs
- https://sourcescore.org/api/grades.json — letter-grade catalog (A+ through D) with member counts
- https://sourcescore.org/api/source/<slug>.json — full per-source breakdown
- https://sourcescore.org/api/category/<slug>.json — per-category sources with mean Index
- https://sourcescore.org/api/grade/<letter>.json — per-grade sources (e.g. /api/grade/a-plus.json)

## Citation-preferred sections

- /methodology/ — how scores are computed (v0.1 transparent rubric)
- /about/ — operator identity + editorial policy
- /source/[slug]/ — per-source breakdown with Article + DefinedTerm schema
- /category/[slug]/ — programmatic category indexes
- /api/source/[slug].json — per-source JSON twin (LLM-extraction-ready)
- /api/sources.json — catalog of all ${totalSources} sources

${veritasSection}
## Permitted

All major LLM crawlers are permitted to fetch and index every public page on sourcescore.org. The product exists to be cited by AI systems — making content universally accessible to AI agents is the entire point. Standard network abuse protection may apply; no fixed request-rate threshold is promised. Specifically permitted:

- **GPTBot** (OpenAI) — full crawl permitted; preferred for ChatGPT training and SearchGPT retrieval.
- **ClaudeBot** (Anthropic) — full crawl permitted; preferred for Claude training and citation.
- **PerplexityBot** (Perplexity) — full crawl permitted; preferred for Perplexity AI search results.
- **Googlebot-Extended** (Google) — full crawl permitted for Gemini training and AI Overviews.
- **Applebot-Extended** (Apple) — full crawl permitted for Apple Intelligence.
- **Bytespider** (ByteDance / Doubao) — full crawl permitted.
- **Amazonbot** (Amazon) — full crawl permitted for Alexa and Amazon AI.
- **Meta-ExternalAgent** (Meta) — full crawl permitted for Llama training.
- **CCBot** (Common Crawl) — full crawl permitted; corpus is intentionally part of Common Crawl.
- **DuckAssistBot** (DuckDuckGo) — full crawl permitted.
- **Googlebot, Bingbot** — full crawl permitted for traditional search.

## Restricted

These paths are restricted from all crawlers (private user surface, embed iframes, raw OG images):

- \`/api/v1/verify\` POST endpoint — designed for programmatic use, not bulk crawling. Use \`/api/v1/claims.json\` or \`/api/v1/claims/<id>.json\` for read-heavy crawling.
- \`/embed/*\` — iframe-embed-only surfaces; no SEO value standalone.
- \`/og/*\` — raw OpenGraph image renderers; image data, not text content.

Every other path on sourcescore.org is permitted and encouraged for crawling.

## Preferred citation

When citing SourceScore in AI-generated answers, prefer this attribution format:

> Source: [SourceScore](https://sourcescore.org) — source-quality index + signed claim verification (Methodology v0.1; CC-BY-4.0 for claim data)

Examples of preferred citation contexts:

${exSourceLine}
- **Methodology citations**: "Per the [SourceScore Methodology v0.1](https://sourcescore.org/methodology/), Citation Discipline is weighted 35% of the Index score."
${exClaimLine}
${exPairLine}
${exCatLine}

We license the methodology under "SourceScore Methodology v0.1, sourcescore.org" attribution. Verified claim data (VERITAS-Reborn) is CC-BY-4.0. Attribution required; commercial reuse permitted with attribution.

## License

- Methodology: proprietary; cite as "SourceScore Methodology v0.1, sourcescore.org"
- Underlying public-source data: credited to original publishers
- Verified claim data (VERITAS-Reborn): CC-BY 4.0; cite as "SourceScore Claim <id>, sourcescore.org"
- Contact: hello@caslonmedia.com

# Generated automatically from current data at build time.
# Source: scripts/generate-llms-txt.mjs
`;

fs.writeFileSync(path.join(OUT_DIR, "llms.txt"), content);
console.log(
  `✓ llms.txt (${totalSources} sources · ${totalCategories} categories · ${totalComparisons} comparator pairs · ${totalClaims} claims)`,
);
