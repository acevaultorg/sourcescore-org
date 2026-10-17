#!/usr/bin/env node
// lastmod-from-deploys.mjs — date every page by the day its <main> text last changed ON THE LIVE SITE.
// (2026-10-17, fleet lastmod fix.) One-time correction tool, read-only.
//
// Cloudflare Pages keeps every production deployment at https://<id>.<project>.pages.dev. For each URL
// in the live sitemap this walks the deployments newest -> oldest (last deployment per UTC day) and
// hashes the page's <main> text with the SITE'S OWN normaliser (scripts/lastmod-main.mjs, the same
// function the build uses). The page's date is the day of the oldest deployment in the unbroken run
// that matches today's content. If the content never differs back to the oldest deployment, that oldest
// day is used ("unchanged since at least then"), never today.
//
//   node scripts/lastmod-from-deploys.mjs --project <cf-pages-project> --site https://example.com \
//        [--normaliser scripts/lastmod-main.mjs] [--out /tmp/x.json] [--since 2026-05-01]
//
// Needs CF_PAGES_TOKEN (Pages read). Writes only --out.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const PROJECT = arg('project'), SITE = (arg('site') || '').replace(/\/$/, '');
const OUT = arg('out', `/tmp/lastmod-from-deploys-${PROJECT}.json`);
const SINCE = arg('since', '2000-01-01');
const CONC = Number(arg('concurrency', '12'));
const ACCOUNT = '72bfd26c5f3c935393a25e5c0dea6039';
const TOKEN = process.env.CF_PAGES_TOKEN;
if (!PROJECT || !SITE || !TOKEN) { console.error('need --project, --site and CF_PAGES_TOKEN'); process.exit(2); }
const { mainHash } = await import(pathToFileURL(resolve(arg('normaliser', 'scripts/lastmod-main.mjs'))).href);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36 lastmod-history';
async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
      if (r.status === 404) return { status: 404, body: '' };
      if (r.ok) return { status: r.status, body: await r.text() };
      if (r.status < 500 && r.status !== 429) return { status: r.status, body: '' };
    } catch {}
    await new Promise(z => setTimeout(z, 800 * (i + 1)));
  }
  return { status: 0, body: '' };
}

// 1. production deployments, newest first, last one per UTC day
const deps = [];
for (let page = 1; ; page++) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/pages/projects/${PROJECT}/deployments?env=production&per_page=25&page=${page}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json();
  if (!j.success) { console.error('CF API error', JSON.stringify(j.errors)); process.exit(1); }
  for (const d of j.result) if (d.latest_stage?.status === 'success' || d.latest_stage?.name === 'deploy') deps.push({ id: d.id, url: d.url, day: d.created_on.slice(0, 10), at: d.created_on, commit: d.deployment_trigger?.metadata?.commit_hash?.slice(0, 7) });
  if (page >= j.result_info.total_pages) break;
}
deps.sort((a, b) => b.at.localeCompare(a.at));
const perDay = []; const seenDay = new Set();
for (const d of deps) if (!seenDay.has(d.day) && d.day >= SINCE) { seenDay.add(d.day); perDay.push(d); }
console.error(`deployments: ${deps.length} production, ${perDay.length} days (${perDay.at(-1)?.day} .. ${perDay[0]?.day})`);

// 2. URL set = the live sitemap (index-aware)
async function sitemapUrls(u) {
  const { body } = await get(u + (u.includes('?') ? '&' : '?') + 'cb=' + Date.now());
  const locs = [...body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]);
  if (/<sitemapindex/.test(body)) { const all = []; for (const s of locs) all.push(...await sitemapUrls(s)); return all; }
  return locs;
}
const urls = [...new Set(await sitemapUrls(arg('sitemap', SITE + '/sitemap.xml')))];
if (!urls.length) { console.error('sitemap returned 0 URLs — refusing'); process.exit(1); }
console.error(`sitemap: ${urls.length} URLs`);

// 3. per URL: live hash, then walk back
const result = {}; let fetches = 0, unreadable = 0;
const pathOf = u => u.replace(SITE, '') || '/';
async function work(u) {
  const p = pathOf(u);
  const live = await get(perDay[0].url + p); fetches++;
  if (!live.body) { unreadable++; result[p] = { hash: null, date: null, note: `newest deployment ${live.status}` }; return; }
  const h = mainHash(live.body);
  let date = perDay[0].day, via = perDay[0].id.slice(0, 8);
  for (let i = 1; i < perDay.length; i++) {
    const r = await get(perDay[i].url + p); fetches++;
    if (!r.body || mainHash(r.body) !== h) break;
    date = perDay[i].day; via = perDay[i].id.slice(0, 8);
  }
  result[p] = { hash: h, date, via };
}
const q = [...urls]; let done = 0;
await Promise.all(Array.from({ length: CONC }, async () => { while (q.length) { await work(q.shift()); if (++done % 100 === 0) console.error(`  ${done}/${urls.length}`); } }));

const dist = {};
for (const v of Object.values(result)) dist[v.date || 'unreadable'] = (dist[v.date || 'unreadable'] || 0) + 1;
writeFileSync(OUT, JSON.stringify({ project: PROJECT, site: SITE, measured: new Date().toISOString(), oldestDay: perDay.at(-1)?.day, days: perDay.length, pages: result }, null, 1));
console.log(`pages ${urls.length} · fetches ${fetches} · unreadable ${unreadable} · oldest deployment day ${perDay.at(-1)?.day}`);
console.log(Object.entries(dist).sort().map(([d, n]) => `${d} ${n}`).join('\n'));
console.log(`wrote ${OUT}`);
