#!/usr/bin/env node
// Amili Search — build-output injector (fleet rollout, Paulo 2026-09-28 mullt009gty2em: "use it on every site we have").
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/search/inject.mjs. Sites carry a synced copy at kit/search-inject.mjs.
//
// Run after the site's build, before its guards and deploy:  node kit/search-inject.mjs [config=amili-search.config.json] [outDir override, e.g. a staging dir]
//  1. builds <out>/kit-search-index.json (cfg.indexFile) from the built pages (build-index.mjs rules: no noindex, no /go/, no 404);
//  2. writes <out>/kit-search.js = searchScript(config): engine + widget + launcher, this site's settings baked in;
//  3. adds ONE line before </body>: <!--ak-search--><script src="/kit-search.js?v=<hash>" defer></script><!--/ak-search-->
//     It sits after </main>, so lastmod scripts that hash <main> see no change and no page is re-dated; the button and
//     dialog are created by the script (fixed position), so nothing on the page moves. Idempotent (strips then adds).
// Config: { outDir: 'out', label, placeholder, suggest: [], takeover: 'css selector of the site's own search box',
//   logUrl, logAll, ga4, clarity, logJs, position: 'left'|'right', skip: ['/go/'] (index), skipScript: ['/embed/'] (no script), max } . Exits 1 if it indexed or injected nothing.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { searchScript } from './search.mjs';
import { buildIndex } from './search-build-index.mjs';

const MARK = ['<!--ak-search-->', '<!--/ak-search-->'];
export const strip = (html) => html.replace(/<!--ak-search-->[\s\S]*?<!--\/ak-search-->/g, '');
export function injectHtml(html, tag) {
  const base = strip(html);
  const at = base.lastIndexOf('</body>');
  if (at < 0) return { html: base, injected: false };
  return { html: base.slice(0, at) + MARK[0] + tag + MARK[1] + base.slice(at), injected: true };
}
function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!e.name.startsWith('.') && e.name !== 'node_modules') yield* htmlFiles(p); }
    else if (e.name.endsWith('.html')) yield p;
  }
}


// Stable asset URLs (1.2.2, 2026-10-03): pages reference /kit-*.js without a version query, and _headers gives these files
// a short cache, so a later kit update re-uploads ONE file instead of every page of the site (a template-wide re-upload
// took hours per site on a 60 KB/s uplink on 2026-10-02). Idempotent: the block is replaced, never duplicated.
export function stableHeaders(out, files) {
  const p = path.join(out, '_headers'); const A = '# ak-kit-assets', B = '# /ak-kit-assets';
  let h = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const re = new RegExp(`\\n?${A}[\\s\\S]*?${B}\\n?`, 'g');
  const prev = (h.match(re) || [''])[0];
  const have = new Set([...prev.matchAll(/^\/kit-[a-z.-]+$/gm)].map((m) => m[0]));
  files.forEach((f) => have.add(f));
  h = h.replace(re, '\n');
  const block = `${A} (Amili Kit: stable URLs, short cache)\n` + [...have].sort().map((f) => `${f}\n  Cache-Control: public, max-age=600, must-revalidate\n`).join('') + `${B}\n`;
  fs.writeFileSync(p, (h.trimEnd() ? h.trimEnd() + '\n\n' : '') + block);
}

export async function run(cfgPath = 'amili-search.config.json', outOverride = null) {
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const out = outOverride ? path.resolve(outOverride) : path.resolve(path.dirname(cfgPath), cfg.outDir || 'out');
  // Remove our own previous output first, so the index never contains a stale injected page.
  // sourceIndex (2026-10-02, colorcombinations): a site whose own search index is already tuned (synonyms, hex codes,
  // colour names) keeps that recall: its JSON rows are mapped field-by-field into the kit's row shape instead of
  // crawling the pages. { file: 'search-index.json', map: { u: 's', t: 't', g: 'k', k: 'x', d: 'd', i: 'i' } }
  let rows;
  if (cfg.sourceIndex) {
    const src = JSON.parse(fs.readFileSync(path.join(out, cfg.sourceIndex.file), 'utf8'));
    const m = { u: 'u', t: 't', d: 'd', g: 'g', k: 'k', i: 'i', ...(cfg.sourceIndex.map || {}) };
    rows = (Array.isArray(src) ? src : src.items || []).map((r) => {
      const o = {}; for (const [kk, from] of Object.entries(m)) if (r[from] != null && r[from] !== '') o[kk] = String(r[from]);
      return o;
    }).filter((o) => o.t && o.u && /^\//.test(o.u));
    if (!rows.length) throw new Error(`amili search inject: sourceIndex ${cfg.sourceIndex.file} gave 0 rows`);
  } else ({ rows } = await buildIndex(out, { skip: cfg.skip || ['/go/', '/embed/'], max: cfg.max || 50000 }));
  // Own file name: some sites already serve a /search-index.json of their own for the search this one takes over.
  const indexFile = cfg.indexFile || 'kit-search-index.json';
  fs.writeFileSync(path.join(out, indexFile), JSON.stringify(rows));
  const js = searchScript({ index: '/' + indexFile, ...cfg });
  fs.writeFileSync(path.join(out, 'kit-search.js'), js);
  const v = crypto.createHash('sha256').update(js).digest('hex').slice(0, 10);
  const tag = '<script src="/kit-search.js" defer></script>';
  stableHeaders(out, ['/kit-search.js', '/' + indexFile]);
  let n = 0, m = 0;
  // Embeds (pages made to sit in someone else's iframe) never get the search: default skipScript ['/embed/'].
  const skipScript = cfg.skipScript || ['/embed/'];
  for (const f of htmlFiles(out)) {
    m++;
    const h = fs.readFileSync(f, 'utf8');
    const url = '/' + path.relative(out, f).split(path.sep).join('/');
    const r = skipScript.some((p) => url.startsWith(p)) ? { html: strip(h), injected: false } : injectHtml(h, tag);
    if (r.injected) n++;
    if (r.html !== h) fs.writeFileSync(f, r.html);
  }
  if (!n) throw new Error(`amili search inject: 0 of ${m} pages injected`);
  return { indexed: rows.length, injected: n, pages: m, kb: Math.round(JSON.stringify(rows).length / 1024), v };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run(process.argv[2], process.argv[3]).then((r) => console.log(`amili search: ${r.indexed} pages indexed (${r.kb} KB), script on ${r.injected}/${r.pages} pages, kit-search.js v=${r.v}`),
    (e) => { console.error(e.message); process.exit(1); });
}
