#!/usr/bin/env node
/**
 * Postbuild — generate sitemap.xml + sitemap-ai.xml from /out/.
 *
 * Walks the static export, picks every index.html, computes the URL,
 * writes both standard + AI-priority sitemaps to /out/.
 */
import { writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
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
const urls = files.map(urlFromPath).sort();

// sitemap.xml — full set
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">',
  ...urls.map((u) => {
    const isHome = u === `${SITE}/`;
    const priority = isHome ? "1.0" : u.includes("/source/") ? "0.9" : "0.8";
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
  "/methodology/",
  "/sources/",
  "/grade/",
  "/best/",
  "/discipline/",
  "/modern-reference/",
  "/velocity/",
];
const aiHumanUrls = urls.filter(
  (u) =>
    aiPriorityPaths.some((p) => u.endsWith(p)) ||
    u.includes("/source/") ||
    u.includes("/category/") ||
    u.includes("/compare/") ||
    u.includes("/grade/") ||
    u.includes("/best/")
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
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">',
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
