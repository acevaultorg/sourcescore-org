#!/usr/bin/env node
// lastmod.mjs — real per-page <lastmod> for a static export (2026-10-17, fleet lastmod fix).
//
// Runs in the deploy AFTER every out/ rewrite (kit injects etc.) and BEFORE the upload. Replaces every
// <lastmod> in the sitemaps with the day that page's <main> text last changed, from the manifest
// MANIFEST ({ "/path": { "hash", "date" } }); hash = scripts/lastmod-main.mjs.
//   unchanged hash -> keeps its stored date · new page or changed <main> text -> today
// Writes the changed + new URLs to .lastmod-changed.json (the only URLs an IndexNow ping may send).
// Refuses (exit 1) on an empty sitemap or an unreadable/empty manifest: a deploy must never fall back to
// build-time dates silently. The manifest is then committed by scripts/commit-lastmod.sh.
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { mainHash } from './lastmod-main.mjs';

const SITE = process.env.LASTMOD_SITE || 'https://sourcescore.org';
const OUT = process.env.LASTMOD_OUT || 'out';
const MANIFEST = process.env.LASTMOD_MANIFEST || 'data/page-lastmod.json';
const SITEMAPS = ['sitemap.xml', 'sitemap-ai.xml'];
const today = new Date().toISOString().slice(0, 10);
const die = (m) => { console.error(`lastmod: REFUSED — ${m}`); process.exit(1); };

if (!existsSync(join(OUT, SITEMAPS[0]))) die(`no ${OUT}/${SITEMAPS[0]}`);
let prev = {};
if (existsSync(MANIFEST)) { try { prev = JSON.parse(readFileSync(MANIFEST, 'utf8')); } catch (e) { die(`${MANIFEST} unreadable (${e.message})`); } }
if (!Object.keys(prev).length) die(`${MANIFEST} is empty — seed it from history (scripts/lastmod-from-deploys.mjs), never from today`);

const pathOf = (u) => { const p = u.replace(SITE, ''); return p === '' ? '/' : p; };   // keeps the site's own trailing-slash form
const isFile = (f) => existsSync(f) && statSync(f).isFile();
function fileOf(p) {
  const q = p.replace(/^\/+|\/+$/g, '');
  const c = q === '' ? [join(OUT, 'index.html')] : [join(OUT, q, 'index.html'), join(OUT, q + '.html'), join(OUT, q)];
  return c.find(isFile) || null;
}

const xml = readFileSync(join(OUT, SITEMAPS[0]), 'utf8');
const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
if (!urls.length) die(`${SITEMAPS[0]} has no <loc>`);

const next = {}; const changed = []; const added = []; const missing = [];
for (const u of urls) {
  const p = pathOf(u); const f = fileOf(p);
  if (!f) { missing.push(p); next[p] = prev[p] || { hash: null, date: today }; continue; }
  const h = mainHash(readFileSync(f, 'utf8'));
  if (!prev[p]) { next[p] = { hash: h, date: today }; added.push(p); }
  else if (prev[p].hash !== h) { next[p] = { hash: h, date: today }; changed.push(p); }
  else next[p] = prev[p];
}

function rewrite(file) {
  if (!existsSync(file)) return 0;
  let n = 0;
  const s = readFileSync(file, 'utf8').replace(/<url>([\s\S]*?)<\/url>/g, (blk, inner) => {
    const loc = (inner.match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1];
    const d = loc && next[pathOf(loc)]?.date;
    if (!d) return blk;
    n++;
    return /<lastmod>/.test(inner) ? blk.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${d}</lastmod>`) : blk.replace(/<\/loc>/, `</loc><lastmod>${d}</lastmod>`);
  });
  writeFileSync(file, s);
  return n;
}
const counts = SITEMAPS.map((s) => `${s} ${rewrite(join(OUT, s))}`);

const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
writeFileSync(MANIFEST, JSON.stringify(sorted, null, 0).replace(/\},/g, '},\n') + '\n');
writeFileSync('.lastmod-changed.json', JSON.stringify([...added, ...changed].map((p) => SITE + p)));
console.log(`lastmod: ${changed.length} changed + ${added.length} new of ${urls.length} URLs dated ${today}; dated: ${counts.join(', ')}${missing.length ? `; ${missing.length} sitemap URLs without a built file: ${missing.slice(0, 5).join(' ')}` : ''}`);
