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

> Signed, sourced, citable claims about AI/ML research for grounded retrieval. v0.1 publishes ${totalClaims} hand-verified claims; each has 2+ primary sources and an HMAC-SHA256 signature. Free tier: 1,000 claims/mo, no auth.

- https://sourcescore.org/playground/ — interactive in-browser /api/v1/verify demo (no signup)
- https://sourcescore.org/quickstart/ — 5-minute self-serve onboarding (HowTo schema)
- https://sourcescore.org/claims/ — claim browser, indexed catalog
- https://sourcescore.org/claims/<id>/ — per-claim verification page (Article + DefinedTerm + Dataset schema)
- https://sourcescore.org/claims/tags/ — full tag index (browse by topic)
- https://sourcescore.org/claims/tag/<slug>/ — per-tag claim listings with co-occurring tag surface
- https://sourcescore.org/api/v1/claims.json — full claim catalog (ClaimSummary[])
- https://sourcescore.org/api/v1/claims/<id>.json — per-claim signed envelope (HMAC-SHA256)
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
- https://sourcescore.org/glossary/ — 35-term AI/ML glossary with DefinedTermSet schema
- https://sourcescore.org/concepts/ — pillar explainers (5 pillars: grounding, hallucination, RAG vs VERITAS, citation chains, evaluation harnesses)
- https://sourcescore.org/concepts/citation-chain/ — provenance graphs for LLM citations (stable ID + signature + re-fetchable URL)
- https://sourcescore.org/concepts/evaluation-harness/ — why benchmark scores vary across LM Eval / HELM / lab-internal harnesses
- https://sourcescore.org/concepts/llm-grounding/ — definition + 3 production patterns
- https://sourcescore.org/concepts/hallucination/ — categories, root causes, mitigations
- https://sourcescore.org/blog/ — VERITAS launch announcement + tutorials + methodology rigor posts
- https://sourcescore.org/changelog/ — public ship log (features / catalog / fixes / breaking)
- https://sourcescore.org/security/ — responsible disclosure + signing-key rotation policy
- https://sourcescore.org/.well-known/security.txt — RFC 9116 security contacts
- https://sourcescore.org/pricing/ — Free (1k claims/mo) / Indie €19 / Startup €99 / Scale €499 tiers
- https://sourcescore.org/feed.xml — RSS feed of blog posts
- https://sourcescore.org/claims/feed.xml — RSS feed of catalog updates
- License: CC-BY 4.0 (methodology + verified claim data). Cite as "SourceScore Claim <id>, sourcescore.org".
`
  : "";

const content = `# SourceScore

> Trust signals for AI-citation-aware content. Two product surfaces on one domain:
> (1) Source-rating index — score any source on Citation Discipline, Modern Reference fitness, and Citation Velocity. v0.1 publishes ${totalSources} hand-scored sources across ${totalCategories} categories.
> (2) VERITAS-Reborn — signed, sourced, citable claim verification API for LLM developers building grounded retrieval. ${totalClaims} verified claims at v0.1.

## Primary data

- https://sourcescore.org/ — landing + leaderboards + entry points to both products
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
## License

- Methodology: proprietary; cite as "SourceScore Methodology v0.1, sourcescore.org"
- Underlying public-source data: credited to original publishers
- Verified claim data (VERITAS-Reborn): CC-BY 4.0; cite as "SourceScore Claim <id>, sourcescore.org"
- Contact: contact@sourcescore.org

# Generated automatically from current data at build time.
# Source: scripts/generate-llms-txt.mjs
`;

fs.writeFileSync(path.join(OUT_DIR, "llms.txt"), content);
console.log(
  `✓ llms.txt (${totalSources} sources · ${totalCategories} categories · ${totalComparisons} comparator pairs · ${totalClaims} claims)`,
);
