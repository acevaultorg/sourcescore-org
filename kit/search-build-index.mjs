#!/usr/bin/env node
// Amili Kit: Amili Search index builder. Run after your static build, before deploy:
//   node build-index.mjs <out-dir> [--out=search-index.json] [--max=50000] [--skip=/go/,/admin/]
// Writes rows [title, description, url, section] for every page a visitor could land on: every *.html that is not
// noindex, not a 404, not under a skipped prefix. Title = the page's <h1> (else <title> without the " | Site" tail).
// Section = the first path segment of deeper pages, title-cased ("/guides/x/" -> "Guides"); top-level pages have none.
// Refuses 0 pages (wrong directory) and more than --max (a runaway build), so a bad index never ships.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith('--'));
if (!out && import.meta.url === `file://${process.argv[1]}`) { console.error('usage: node build-index.mjs <out-dir> [--out=search-index.json] [--max=50000] [--skip=/go/]'); process.exit(2); }
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) || `=${d}`).split('=').slice(1).join('=');
const MAX = Number(opt('max', 50000));
const SKIP = opt('skip', '/go/').split(',').filter(Boolean);
const FILE = opt('out', 'search-index.json');

const dec = (s) => String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ');
const text = (s) => dec(String(s).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
export function pageRow(html, url) {
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) return null;
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  const tt = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const title = h1 ? text(h1) : tt ? text(tt).replace(/\s+[|\u2014\u2013-]\s+[^|\u2014\u2013-]+$/, '') : '';
  if (!title) return null;
  const desc = text((html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '').slice(0, 160);
  const segs = url.split('/').filter(Boolean), seg = segs.length > 1 ? segs[0] : '';
  const section = seg ? seg.replace(/[-_]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : '';
  // Thumbnail (Paulo mur0pvc529cpn8 "search must get images too"): the page's first real content image inside <main>
  // (never an Amazon-hosted image: those may not be stored, and never an icon/svg/data URI), else its og:image.
  const main = (html.match(/<main[\s\S]*?<\/main>/i) || [''])[0];
  let img = '';
  for (const m of main.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1], tag = m[0], w = +((tag.match(/\bwidth=["']?(\d+)/i) || [])[1] || 0);
    if (/^data:|\.svg(\?|$)|media-amazon|images-amazon|ssl-images-amazon|\/icons?\/|logo|avatar|pixel|spacer/i.test(src) || (w && w < 60)) continue;
    img = src; break;
  }
  if (!img) img = dec((html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1] || '');
  if (/media-amazon|images-amazon/i.test(img)) img = '';
  return img ? [title.slice(0, 140), desc, url, section, '', img.slice(0, 300)] : [title.slice(0, 140), desc, url, section];
}

export async function buildIndex(out, { skip = ['/go/'], max = 50000 } = {}) {
  const rows = [];
  let seen = 0, skipped = 0;
  for await (const f of walk(out)) {
    seen++;
    const rel = '/' + path.relative(out, f).split(path.sep).join('/');
    if (/(^|\/)404\.html$/.test(rel)) continue;
    const url = rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel.replace(/\.html$/, '');
    if (skip.some((p) => url.startsWith(p))) { skipped++; continue; }
    const row = pageRow(await readFile(f, 'utf8'), url || '/');
    if (row) rows.push(row); else skipped++;
  }
  rows.sort((a, b) => a[2].localeCompare(b[2]));
  if (!rows.length) throw new Error('refusing: 0 indexable pages (wrong directory?)');
  if (rows.length > max) throw new Error(`refusing: ${rows.length} rows > max ${max}`);
  return { rows, seen, skipped };
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === '_next') continue; yield* walk(p); }
    else if (e.name.endsWith('.html')) yield p;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const { rows, seen, skipped } = await buildIndex(out, { skip: SKIP, max: MAX });
    const json = JSON.stringify(rows);
    await writeFile(path.join(out, FILE), json);
    console.log(`amili search: ${rows.length} pages indexed of ${seen} html files (${skipped} skipped: noindex, untitled or excluded) \u00b7 ${(json.length / 1024).toFixed(0)} KB -> ${FILE}`);
  } catch (e) { console.error(e.message); process.exit(1); }
}
