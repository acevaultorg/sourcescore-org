#!/usr/bin/env node
/**
 * Postbuild — generate sitemap.xml + sitemap-ai.xml from /out/.
 *
 * Walks the static export, picks every index.html, computes the URL,
 * writes both standard + AI-priority sitemaps to /out/.
 */
import { writeFileSync, readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const OUT_DIR = "out";
const SITE = "https://sourcescore.org";
const TODAY = new Date().toISOString().slice(0, 10);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, files);
    else if (entry === "index.html") files.push(full);
  }
  return files;
}

function urlFromPath(absPath) {
  const rel = relative(OUT_DIR, absPath).replace(/index\.html$/, "");
  if (rel === "") return `${SITE}/`;
  return `${SITE}/${rel}`;
}

const files = walk(OUT_DIR);
const allUrls = files.map(urlFromPath).sort();

// Crawl-budget concentration (2026-05-28): thin/duplicate variant pages are
// noindex,follow (set in their route generateMetadata). Keep them OUT of both
// sitemaps so Google + AI crawlers spend crawl budget on the ~960 core pages
// (sources, main comparisons, claims) instead of ~1,100 thin variants. This
// directly targets the 3,698 "discovered/crawled - not indexed" pages in GSC.
// JSON twins (/api/*.json) stay advertised in sitemap-ai.xml separately.
//   - /embed/<slug>/, /embed/claim/<id>/          iframe widgets (canonical→source)
//   - /compare/<slug>/<dimension>/                single-dimension facet of main compare
//   - /(discipline|modern-reference|velocity)/<slug>/  per-source sub-score dupes
// Reversible: remove a pattern here AND the route's robots line to re-index.
const NOINDEX_RE = [
  /\/embed\//,
  /\/compare\/[^/]+\/(discipline|modern-reference|velocity)\/$/,
  /^https?:\/\/[^/]+\/(discipline|modern-reference|velocity)\/[^/]+\/$/,
];
const isNoindex = (u) => NOINDEX_RE.some((re) => re.test(u));

// Content-value audit (2026-05-29): authoritative noindex detection — read the
// built HTML and exclude ANY page carrying a noindex robots meta. This covers
// the regex patterns above AND per-page THRESHOLD noindex set in route
// generateMetadata (thin tag/year/comparison hubs < 6 items). Single source of
// truth = the page itself, so the sitemap can never list a noindexed page.
const noindexFromMeta = new Set(
  files
    .filter((f) => {
      try {
        return /<meta name="robots" content="noindex/i.test(readFileSync(f, "utf8"));
      } catch {
        return false;
      }
    })
    .map(urlFromPath),
);
const urls = allUrls.filter((u) => !isNoindex(u) && !noindexFromMeta.has(u));

// sitemap.xml — indexable set only (noindex variants excluded above)
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => {
    const isHome = u === `${SITE}/`;
    // VERITAS-Reborn pages (v0.1, 2026-05-16): /claims/, /claims/<id>/,
    // /docs/, /pricing/, /signup/ rank 0.9 — they're the new product
    // surface and bot-citation gravity targets, on par with /source/.
    const isVeritas =
      u === `${SITE}/claims/` ||
      u.includes("/claims/") ||
      u === `${SITE}/docs/` ||
      u === `${SITE}/pricing/` ||
      u === `${SITE}/signup/`;
    const priority = isHome
      ? "1.0"
      : u.includes("/source/") || isVeritas
        ? "0.9"
        : "0.8";
    return `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  }),
  "</urlset>",
].join("\n");
writeFileSync(`${OUT_DIR}/sitemap.xml`, xml);

// sitemap-ai.xml — AI-priority subset (per bot-harvest.md Lever 5)
//   - all /source/<slug>/ pages with their JSON twin as alternate
//   - all /grade/<letter>/ pages with their JSON twin as alternate
//   - all /category/<cat>/grade/<letter>/ facet pages with twin
//   - sub-tool ranking pages, methodology, sources index, /grade/ landing
const aiPriorityPaths = [
  "/",
  "/for-ai/",
  "/methodology/",
  "/sources/",
  "/grade/",
  "/best/",
  "/insights/",
  "/discipline/",
  "/modern-reference/",
  "/velocity/",
  // VERITAS-Reborn surfaces (v0.1, 2026-05-16): claim browser + per-claim
  // pages + dev portal (docs / pricing / signup). All bot-citation gravity
  // targets for the dev-API product surface.
  "/claims/",
  "/docs/",
  "/pricing/",
  "/signup/",
  "/topics/",
  "/concepts/",
  "/use-cases/",
  "/comparisons/",
];
const aiHumanUrls = urls.filter(
  (u) =>
    aiPriorityPaths.some((p) => u.endsWith(p)) ||
    u.includes("/source/") ||
    u.includes("/category/") ||
    u.includes("/compare/") ||
    u.includes("/grade/") ||
    u.includes("/best/") ||
    u.includes("/insights/") ||
    u.includes("/claims/") ||
    u.includes("/topics/") ||
    u.includes("/concepts/") ||
    u.includes("/use-cases/") ||
    u.includes("/comparisons/")
);

// Discover EVERY .json under /api/ (source twins, grade twins, facet
// twins, compare twins, category twins, catalogs).
const apiRoot = join(OUT_DIR, "api");
function collectApiJson(dir, base = []) {
  const out = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const s = statSync(full);
      if (s.isDirectory()) {
        out.push(...collectApiJson(full, [...base, entry]));
      } else if (entry.endsWith(".json")) {
        const path = [...base, entry].join("/");
        out.push(`${SITE}/api/${path}`);
      }
    }
  } catch {
    // /api/ may not exist on first build; non-fatal.
  }
  return out;
}
const apiUrls = existsSync(apiRoot) ? collectApiJson(apiRoot) : [];

// Map every HTML route that has a JSON twin → its alt URL
function altApiFor(u) {
  // /  →  /api/sources.json (catalog)
  if (u === `${SITE}/`) return `${SITE}/api/sources.json`;

  // /source/<slug>/comparisons/  →  /api/source/<slug>/comparisons.json (Day 24)
  // Must come BEFORE the catch-all /source/<slug>/ match below.
  const sourceComparatorHubMatch = u.match(
    /\/source\/([^/]+)\/comparisons\/$/,
  );
  if (sourceComparatorHubMatch)
    return `${SITE}/api/source/${sourceComparatorHubMatch[1]}/comparisons.json`;

  // /source/<slug>/peers/  →  /api/source/<slug>/peers.json (Day 29)
  // Must come BEFORE the catch-all /source/<slug>/ match below.
  const sourcePeersMatch = u.match(/\/source\/([^/]+)\/peers\/$/);
  if (sourcePeersMatch)
    return `${SITE}/api/source/${sourcePeersMatch[1]}/peers.json`;

  // /source/<slug>/  →  /api/source/<slug>.json
  const sourceMatch = u.match(/\/source\/([^/]+)\/$/);
  if (sourceMatch) return `${SITE}/api/source/${sourceMatch[1]}.json`;

  // /compare/<slug>/<dim>/  →  /api/compare/<slug>/<dim>.json (Day 18)
  const compareDimMatch = u.match(
    /\/compare\/([^/]+)\/(discipline|modern-reference|velocity)\/$/
  );
  if (compareDimMatch)
    return `${SITE}/api/compare/${compareDimMatch[1]}/${compareDimMatch[2]}.json`;

  // /compare/<slug>/  →  /api/compare/<slug>.json
  const compareMatch = u.match(/\/compare\/([^/]+)\/$/);
  if (compareMatch) return `${SITE}/api/compare/${compareMatch[1]}.json`;

  // /category/<cat>/grade/<letter>/  →  /api/category/<cat>/grade/<letter>.json
  const facetMatch = u.match(/\/category\/([^/]+)\/grade\/([^/]+)\/$/);
  if (facetMatch) return `${SITE}/api/category/${facetMatch[1]}/grade/${facetMatch[2]}.json`;

  // /category/<cat>/top-10/<dim>/  →  /api/category/<cat>/top-10/<dim>.json (Day 28)
  // Must come BEFORE the bare /category/<cat>/top-10/ match below.
  const categoryTopNDimMatch = u.match(
    /\/category\/([^/]+)\/top-10\/(discipline|modern-reference|velocity)\/$/,
  );
  if (categoryTopNDimMatch)
    return `${SITE}/api/category/${categoryTopNDimMatch[1]}/top-10/${categoryTopNDimMatch[2]}.json`;

  // /category/<cat>/top-10/  →  /api/category/<cat>/top-10.json (Day 28)
  const categoryTopNMatch = u.match(/\/category\/([^/]+)\/top-10\/$/);
  if (categoryTopNMatch)
    return `${SITE}/api/category/${categoryTopNMatch[1]}/top-10.json`;

  // /category/<cat>/<dim>/  →  /api/category/<cat>/<dim>.json (Day 20)
  const categoryDimMatch = u.match(
    /\/category\/([^/]+)\/(discipline|modern-reference|velocity)\/$/
  );
  if (categoryDimMatch)
    return `${SITE}/api/category/${categoryDimMatch[1]}/${categoryDimMatch[2]}.json`;

  // /category/<cat>/  →  /api/category/<cat>.json
  const categoryMatch = u.match(/\/category\/([^/]+)\/$/);
  if (categoryMatch) return `${SITE}/api/category/${categoryMatch[1]}.json`;

  // /grade/  →  /api/grades.json (catalog)
  if (u === `${SITE}/grade/`) return `${SITE}/api/grades.json`;

  // /grade/<letter>/<dim>/  →  /api/grade/<letter>/<dim>.json (Day 27)
  // Must come BEFORE the /grade/<letter>/ catch-all below.
  const gradeDimMatch = u.match(
    /^https?:\/\/[^/]+\/grade\/([^/]+)\/(discipline|modern-reference|velocity)\/$/,
  );
  if (gradeDimMatch)
    return `${SITE}/api/grade/${gradeDimMatch[1]}/${gradeDimMatch[2]}.json`;

  // /grade/<letter>/  →  /api/grade/<letter>.json (composite-Index grade only;
  // Day 21 added /<dim>/grade/<letter>/ which must NOT match this regex —
  // anchor to start of URL to keep the match composite-only).
  const gradeMatch = u.match(/^https?:\/\/[^/]+\/grade\/([^/]+)\/$/);
  if (gradeMatch) return `${SITE}/api/grade/${gradeMatch[1]}.json`;

  // /sources/  →  /api/sources.json
  if (u === `${SITE}/sources/`) return `${SITE}/api/sources.json`;

  // /insights/  →  /api/insights.json (Day 30 catalog)
  if (u === `${SITE}/insights/`) return `${SITE}/api/insights.json`;

  // /insights/<slug>/  →  /api/insights/<slug>.json (Day 30)
  const insightMatch = u.match(/\/insights\/([^/]+)\/$/);
  if (insightMatch) return `${SITE}/api/insights/${insightMatch[1]}.json`;

  // /best/  →  /api/best.json (catalog)
  if (u === `${SITE}/best/`) return `${SITE}/api/best.json`;

  // /best/<slug>/<dim>/  →  /api/best/<slug>/<dim>.json (Day 25)
  // Must come BEFORE the /best/<slug>/ catch-all below.
  const bestDimMatch = u.match(
    /\/best\/([^/]+)\/(discipline|modern-reference|velocity)\/$/,
  );
  if (bestDimMatch)
    return `${SITE}/api/best/${bestDimMatch[1]}/${bestDimMatch[2]}.json`;

  // /best/<slug>/  →  /api/best/<slug>.json
  const bestMatch = u.match(/\/best\/([^/]+)\/$/);
  if (bestMatch) return `${SITE}/api/best/${bestMatch[1]}.json`;

  // /<dim>/grade/<letter>/  →  /api/<dim>/grade/<letter>.json (Day 21)
  // Must come before the catch-all dim-slug match below.
  const dimGradeMatch = u.match(
    /\/(discipline|modern-reference|velocity)\/grade\/([^/]+)\/$/
  );
  if (dimGradeMatch)
    return `${SITE}/api/${dimGradeMatch[1]}/grade/${dimGradeMatch[2]}.json`;

  // /<dim>/rank/<band>/  →  /api/<dim>/rank/<band>.json (Day 22)
  // Must come before the catch-all dim-slug match below.
  const dimRankMatch = u.match(
    /\/(discipline|modern-reference|velocity)\/rank\/([^/]+)\/$/
  );
  if (dimRankMatch)
    return `${SITE}/api/${dimRankMatch[1]}/rank/${dimRankMatch[2]}.json`;

  // /discipline/<slug>/  →  /api/discipline/<slug>.json
  // /modern-reference/<slug>/  →  /api/modern-reference/<slug>.json
  // /velocity/<slug>/  →  /api/velocity/<slug>.json
  const dimMatch = u.match(/\/(discipline|modern-reference|velocity)\/([^/]+)\/$/);
  if (dimMatch) return `${SITE}/api/${dimMatch[1]}/${dimMatch[2]}.json`;

  return null;
}

// sitemap-ai.xml — standard sitemap-0.9 namespace ONLY.
// Per Google sitemap spec: `xhtml:link rel="alternate"` is reserved for
// hreflang language alternates. Using it for JSON twin association
// (`type="application/json"`) is non-standard and produces an
// "Incorrect namespace" error in GSC sitemap audit.
// JSON twin URLs are listed as their OWN <url> entries below — that's
// the spec-compliant way to surface them to crawlers, and it's what
// LLM crawlers (GPTBot, ClaudeBot, etc.) actually parse anyway.
const aiXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...aiHumanUrls.map(
    (u) =>
      `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`
  ),
  ...apiUrls.map(
    (u) =>
      `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
  ),
  "</urlset>",
].join("\n");
writeFileSync(`${OUT_DIR}/sitemap-ai.xml`, aiXml);

console.log(
  `✓ sitemap.xml (${urls.length} URLs) + sitemap-ai.xml (${aiHumanUrls.length} HTML + ${apiUrls.length} JSON)`
);
