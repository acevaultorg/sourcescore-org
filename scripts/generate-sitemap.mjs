#!/usr/bin/env node
/**
 * Postbuild — generate sitemap.xml + sitemap-ai.xml from /out/.
 *
 * Walks the static export, picks every index.html, computes the URL,
 * writes both standard + AI-priority sitemaps to /out/.
 */
import { writeFileSync, readdirSync, statSync } from "node:fs";
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
const aiPriorityPaths = ["/", "/methodology/", "/sources/", "/discipline/", "/modern-reference/", "/velocity/"];
const aiUrls = urls.filter((u) => aiPriorityPaths.some((p) => u.endsWith(p)) || u.includes("/source/"));
const aiXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">',
  ...aiUrls.map(
    (u) =>
      `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`
  ),
  "</urlset>",
].join("\n");
writeFileSync(`${OUT_DIR}/sitemap-ai.xml`, aiXml);

console.log(`✓ sitemap.xml (${urls.length} URLs) + sitemap-ai.xml (${aiUrls.length} URLs)`);
