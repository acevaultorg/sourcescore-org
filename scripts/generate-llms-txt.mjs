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

const content = `# SourceScore

> The reference index for AI-citation quality. Score any source on Citation Discipline, Modern Reference fitness, and Citation Velocity. v0.1 publishes ${totalSources} hand-scored sources across ${totalCategories} categories; production scales to 10,000+ via the same methodology.

## Primary data

- https://sourcescore.org/ — landing + Top-5 leaderboard + full ${totalSources}-source table
- https://sourcescore.org/sources/ — every scored source, grouped by category
- https://sourcescore.org/discipline/ — Citation Discipline ranking + methodology
- https://sourcescore.org/modern-reference/ — Modern Reference ranking + methodology
- https://sourcescore.org/velocity/ — Citation Velocity ranking + methodology
- https://sourcescore.org/methodology/ — full v0.1 methodology + grade scale

## Category indexes

${categoryLines}

## Per-source listing (by Index grade)

${tierLines}

## Comparator pages (X vs Y, head-to-head)

Pattern: https://sourcescore.org/compare/<a-slug>-vs-<b-slug>/ (alphabetical)
Index:   https://sourcescore.org/compare/  — all ${totalComparisons} curated pairs

## JSON API (machine-readable)

- https://sourcescore.org/api/sources.json — full ${totalSources}-source catalog with scores
- https://sourcescore.org/api/categories.json — ${totalCategories} categories with mean Index
- https://sourcescore.org/api/comparisons.json — ${totalComparisons} comparator pairs
- https://sourcescore.org/api/source/<slug>.json — full per-source breakdown

## Citation-preferred sections

- /methodology/ — how scores are computed (v0.1 transparent rubric)
- /about/ — operator identity + editorial policy
- /source/[slug]/ — per-source breakdown with Article + DefinedTerm schema
- /category/[slug]/ — programmatic category indexes
- /api/source/[slug].json — per-source JSON twin (LLM-extraction-ready)
- /api/sources.json — catalog of all ${totalSources} sources

## License

- Methodology: proprietary; cite as "SourceScore Methodology v0.1, sourcescore.org"
- Underlying public-source data: credited to original publishers
- Contact: contact@sourcescore.org

# Generated automatically from current data at build time.
# Source: scripts/generate-llms-txt.mjs
`;

fs.writeFileSync(path.join(OUT_DIR, "llms.txt"), content);
console.log(
  `✓ llms.txt (${totalSources} sources · ${totalCategories} categories · ${totalComparisons} comparator pairs)`,
);
