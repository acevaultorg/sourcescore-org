#!/usr/bin/env node
// VENDORED from VAULT-Fleet/tooling/fleet-kit/amazon-ad/inject.mjs (sha256 6fe05914469b), Amili Kit v1.2.0 — do not edit here; re-run sync.sh.
// Amili Kit Amazon ad — build-output injector (fleet rollout 2026-09-28, Paulo thought mulitb3a2bhmcs: "at least 20 sites").
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/amazon-ad/inject.mjs. Sites carry a synced copy at kit/amazon-ad-inject.mjs.
//
// Puts ONE fixed variant (no A/B on rollout sites) into every built page of a static site, right AFTER </main>:
//   - after </main>, so the fleet lastmod scripts (which hash <main> only) see no change and no page is re-dated;
//   - after the content, so it never sits beside the page's own buy box (those live inside <main>);
//   - <html data-akv="vN"> is set statically, so no head script is needed and the slot is visible before first paint;
//   - inline CSS (in <head>) + AD_JS (end of <body>), both wrapped in <!--ak-ad:*--> markers, so a re-run is idempotent.
// Links go to /go/amzad?a=<ASIN> and data comes from /amz/items: both are served by the shared fleet Worker
// `amili-amazon-ad` (tooling/fleet-kit/amazon-ad/worker), which holds each site's own registered tag and the
// Creators API secrets. Nothing site-specific ever carries the tag.
//
// Usage: node kit/amazon-ad-inject.mjs <outDir> [configPath=amazon-ad.config.mjs]
// Config (default export): { site, variant, products, disclosure, placementAttrs?, skip? (regex strings on the URL path),
//   lang?, slotStyle? }. Prints "N/M pages" and exits 1 when it injected nothing (a silent no-op must not deploy).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderAd, renderBillboard, pickProducts, AD_CSS, AD_JS, BILLBOARD_CSS, validatePool, BEACON_I_JS, bbHeadJs, BB_JS } from './amazon-ad.mjs';

export const GATE = '/go/amzad';
export const API = '/amz/items';
const RANK_DAY = '2026-09-28'; // server-side order is fixed so the built HTML is byte-stable; the browser re-ranks daily
const DEFAULT_SKIP = ['^/(sitemap|search|privacy|terms|terms-of-service|copyright|dmca|about|contact|disclosure|affiliate-disclosure|cookies|legal|accessibility|editorial-policy|methodology|404)(/|\\.html)?$', '^/404'];
const MARK = (k) => [`<!--ak-ad:${k}-->`, `<!--/ak-ad:${k}-->`];
// Kit 3 gesture-cookie mint, byte-identical to tooling/fleet-kit/gesture-gate/gesture-gate.mjs MINT_JS (a test asserts it).
// The shared Worker's /go/amzad gate requires a fresh cc_g, which only this page JS mints inside a trusted click on a /go/
// link. Injector-rollout pages never carry AD_HEAD_JS, so without this every real ad click bounced home (2026-09-28).
export const MINT_JS = "(function(){function m(e){try{if(!e.isTrusted)return;if(e.type==='auxclick'&&e.button!==1)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||a.host!==location.host||a.pathname.indexOf('/go/')!==0)return;document.cookie='cc_g='+Date.now().toString(36)+'; Path=/go/; Max-Age=600; SameSite=Lax; Secure'}catch(x){}}try{document.addEventListener('click',m,true);document.addEventListener('auxclick',m,true)}catch(x){}})();";
const SLOT_CSS = '.ak-slot{padding:0 16px;margin:20px auto 8px;max-width:44rem;clear:both}.ak-slot .ak-ad-v5,.ak-slot .ak-ad-v6,.ak-slot .ak-ad-v3{margin:0}.ak-topslot.ak-in{margin:14px 0}.ak-topslot.ak-in .ak-ad-v1{border-radius:10px}';

export function stripAd(html) {
  let h = html;
  for (const k of ['css', 'slot', 'js', 'top', 'bbtop', 'bbmid']) {
    const [a, b] = MARK(k);
    h = h.replace(new RegExp(`${a}[\\s\\S]*?${b}`, 'g'), '');
  }
  return h.replace(/(<html\b[^>]*?)\sdata-akv="[^"]*"/i, '$1');
}

// A page template that wraps its content in <main> inside a layout <main> (sourcescore /claims/, 913 pages, 2026-10-02):
// all opens come before the first close, so the LAST </main> closes the outer one and the slot still lands after the
// whole content. Two sibling <main>s (one closed before the next opens) stay refused.
export function nestedMain(html) {
  const o = [...html.matchAll(/<main\b/gi)].map((m) => m.index), c = [...html.matchAll(/<\/main>/gi)].map((m) => m.index);
  return o.length > 1 && o.length === c.length && o[o.length - 1] < c[0];
}

export function pagePath(rel) {
  const p = '/' + rel.split(path.sep).join('/');
  if (p.endsWith('/index.html')) return p.slice(0, -'index.html'.length);
  return p.replace(/\.html$/, '');
}

function decorate(ad, cfg) {
  // hrefSuffix: extra query the site's own guards require on every /go/ href (e.g. approvedmodem's "&sub=" beacon key).
  if (cfg.hrefSuffix) ad = ad.replace(/href="(\/go\/amzad\?a=[A-Z0-9]{10})"/g, (m, h) => `href="${h}${cfg.hrefSuffix.replace(/&/g, '&amp;')}"`);
  for (const attr of cfg.placementAttrs || []) {
    if (attr === 'data-event-from') continue;
    ad = ad.replace(/ data-event-from="(ad-v[1-6]|ad-bb-top|ad-bb-mid)"/g, ` data-event-from="$1" ${attr}="$1"`);
  }
  return ad;
}

// Top card (Paulo mulm8tq260tvd3 / Amili 2026-09-28): on pages whose URL matches a cfg.topCards rule, a V1 card above
// the site header showing the products the page is ABOUT — the first ASINs the page itself links to (in its own order,
// e.g. an airline page's best-fitting carriers, or a comparison page's two items side by side). Only ASINs in
// cfg.catalog (our own name + line for each) are eligible, so it can never show an unrelated product. Placed before
// <header>, i.e. outside <main>: the lastmod hash never sees it.
export function pageAsins(html, catalog, firstOnly = false, skipHrefs = []) {
  // skipHrefs: links that are not a product (a membership trial, a format search) and do not count as the page's first.
  const skip = skipHrefs.map((r) => new RegExp(r));
  // firstOnly: only the page's FIRST buy link counts — if it names no catalog product, the page gets no card (it must
  // never show a different product than the one the page leads with).
  // The page's own buy links, in page order, mapped onto catalog items: by ASIN (…?a=ASIN / /dp/ASIN) or, for sites whose
  // links are Amazon searches, by a catalog item's `keys` (regexes tested against the link's decoded search terms).
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const known = new Set((catalog || []).map((p) => p.asin));
  const keyed = (catalog || []).filter((p) => p.keys).map((p) => ({ asin: p.asin, res: p.keys.map((k) => new RegExp(k, 'i')) }));
  // `hrefs`: regexes tested against the whole href, for sites whose own gate names a product by slug (/go/p?s=<slug>).
  const hrefed = (catalog || []).filter((p) => p.hrefs).map((p) => ({ asin: p.asin, res: p.hrefs.map((k) => new RegExp(k)) }));
  const out = [];
  let seen = 0;
  const add = (a) => { if (a && !out.includes(a)) out.push(a); };
  for (const x of (m ? m[1] : html).matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = x[1].replace(/&amp;/g, '&');
    if (skip.some((re) => re.test(href))) continue;
    const buy = /\/go\/|amazon\.|\/out\//.test(href);
    if (firstOnly && buy && seen++) break;
    const id = (href.match(/(?:[?&]a=|\/dp\/|\/go\/b\/)([A-Z0-9]{10})(?:[/?&#]|$)/) || [])[1];
    if (id && known.has(id)) { add(id); continue; }
    const hh = hrefed.find((k) => k.res.some((re) => re.test(href)));
    if (hh) { add(hh.asin); continue; }
    if (!keyed.length || !/\/go\/|amazon\.|\/out\//.test(href)) continue;
    let q = (href.match(/[?&](?:k|q|keywords)=([^&]*)/) || href.match(/\/(?:out|go)\/s\/([^?#]+)/) || [])[1];
    if (!q) continue;
    try { q = decodeURIComponent(q.replace(/\+/g, ' ')); } catch {}
    for (const k of keyed) if (k.res.some((re) => re.test(q))) add(k.asin); // several catalog items may share a key: the later ones are spares
  }
  return out;
}
function topCard(html, urlPath, cfg) {
  const rule = (cfg.topCards || []).find((r) => new RegExp(r.match).test(urlPath));
  if (!rule) return null;
  const asins = pageAsins(html, cfg.catalog, !!rule.firstOnly, rule.skipHrefs || []);
  const n = rule.n || 1;
  if (asins.length < n) return null;
  const byAsin = new Map(cfg.catalog.map((p) => [p.asin, p]));
  let pick = asins.slice(0, n + (n === 1 ? (rule.spares ?? 2) : 0));
  // orderBy 'h1': a comparison shows its items in the order its headline names them ("A vs B" -> A, B).
  if (rule.orderBy === 'h1') {
    const h1 = ((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '').replace(/<[^>]+>/g, '').replace(/&#39;|&rsquo;/g, "'").replace(/&amp;/g, '&');
    const at = (a) => { const i = h1.indexOf(byAsin.get(a).name); return i < 0 ? 1e9 : i; };
    pick = pick.slice().sort((a, b) => at(a) - at(b));
  }
  return decorate(renderAd({ variant: 'v1', on: true, fixed: true, duo: n === 2, n, labels: cfg.topLabels, products: pick.map((a) => byAsin.get(a)), disclosure: cfg.disclosure, api: API, gate: GATE, page: urlPath, lang: cfg.lang || 'en' }), cfg);
}

// v6 heading: why these products are here. cfg.headings = [{ match: regex on the URL path, text }], first match wins,
// else cfg.heading (site-level). Our own words, never a price, deal or rating claim (renderAd refuses those).
export function headingFor(urlPath, cfg) {
  const r = (cfg.headings || []).find((h) => new RegExp(h.match).test(urlPath));
  return r ? r.text : cfg.heading;
}

// BILLBOARD (kit library, two placements; one line of site config): billboard: { top: true, mid: true }
//   top  -> ak-billboard-top: full-width grey band above the site header
//   mid  -> ak-billboard-mid: before the page's 2nd <h2> inside <main> (or billboard.midBefore: a regex), label above
// Optional: billboard.match (regex on the URL path; default every injected page), billboard.headline / midHeadline
// templates with {name} and {why} (default: the product's own `headline`, else `why`). Product = the first product the
// page itself links to (from products + catalog), else today's rotation of the site's products; mid never repeats top.
// When the top billboard is placed, the page's V1 top card is not (the billboard is the richer version of it).
function billboardFor(html, urlPath, cfg) {
  const b = cfg.billboard;
  if (!b || (b.match && !new RegExp(b.match).test(urlPath))) return null;
  if (b.skipIf && new RegExp(b.skipIf).test(html)) return null; // e.g. a page running its own measured buy-module experiment
  const pool = [...(cfg.products || []), ...(cfg.catalog || [])].filter((p, i, a) => a.findIndex((q) => q.asin === p.asin) === i);
  if (!pool.length) return null;
  const byAsin = new Map(pool.map((p) => [p.asin, p]));
  const own = pageAsins(html, pool, false, (cfg.topCards || [])[0]?.skipHrefs || []).map((a) => byAsin.get(a));
  const rot = pickProducts(pool, { page: urlPath, day: RANK_DAY, n: Infinity });
  const order = [...own, ...rot].filter((p, i, a) => a.indexOf(p) === i);
  const fill = (tpl, p) => String(tpl).replace(/\{name\}/g, p.name).replace(/\{why\}/g, p.why);
  // billboard.variant ('auto'|'a'|'b'|'c'): the box carries up to 6 products, most relevant first, for the A/B/C layouts.
  const V = !!b.variant;
  const mk = (placement, p, tpl, rest) => decorate(renderBillboard({ placement, product: p, headline: tpl ? fill(tpl, p) : undefined, variants: V, products: V ? rest.map((x) => ({ ...x, bbHead: tpl ? fill(tpl, x) : x.why })) : undefined, disclosure: cfg.disclosure, api: API, gate: GATE, page: urlPath, lang: cfg.lang || 'en', labels: b.labels }), cfg);
  return { top: b.top ? mk('top', order[0], b.headline, order.slice(1, 6)) : null, mid: b.mid && order[1] ? mk('mid', order[1], b.midHeadline || b.headline, order.slice(2, 7)) : null };
}

export function injectHtml(html, urlPath, cfg) {
  const base = stripAd(html);
  const skip = [...DEFAULT_SKIP, ...(cfg.skip || [])].map((s) => new RegExp(s));
  if (skip.some((re) => re.test(urlPath))) return { html: base, injected: false, why: 'skip' };
  // anchor 'before-footer' (sites without <main>, e.g. stickyidea): the slot goes right before the page's last <footer>.
  let end = base.lastIndexOf('</main>');
  let endLen = '</main>'.length;
  if (cfg.anchor === 'before-footer' && end < 0) { end = base.lastIndexOf('<footer'); endLen = 0; if (end < 0) return { html: base, injected: false, why: 'no-footer' }; }
  else if (end < 0 || (base.indexOf('</main>') !== end && !nestedMain(base))) return { html: base, injected: false, why: end < 0 ? 'no-main' : 'multi-main' };
  if (!/<\/head>/i.test(base) || !/<\/body>/i.test(base) || !/<html\b/i.test(base)) return { html: base, injected: false, why: 'no-head-body' };
  // variant 'none': top cards only (no end-of-content line), for sites that asked for the targeted card alone.
  const bottom = cfg.variant !== 'none';
  const products = bottom ? pickProducts(cfg.products, { page: urlPath, day: RANK_DAY, n: Infinity }) : [];
  let ad = bottom ? decorate(renderAd({ variant: cfg.variant, heading: headingFor(urlPath, cfg), products, disclosure: cfg.disclosure, api: API, gate: GATE, page: urlPath, lang: cfg.lang || 'en', n: cfg.n }), cfg) : '';
  const [cA, cB] = MARK('css');
  const [sA, sB] = MARK('slot');
  const [jA, jB] = MARK('js');
  const at = end + endLen;
  let h = bottom ? base.slice(0, at) + `${sA}<div class="ak-slot"${cfg.slotStyle ? ` style="${cfg.slotStyle}"` : ''}>${ad}</div>${sB}` + base.slice(at) : base;
  const top = cfg.billboard && cfg.billboard.top && (!cfg.billboard.match || new RegExp(cfg.billboard.match).test(urlPath)) ? null : topCard(base, urlPath, cfg);
  let topAt = -1;
  if (top) {
    const [tA, tB] = MARK('top');
    const rule = cfg.topCards.find((r) => new RegExp(r.match).test(urlPath));
    if (rule.after) {
      // Tool pages: never above the tool — directly under its first result (rule.after = regex for the end of it).
      const mm = new RegExp(rule.after).exec(h);
      if (mm) topAt = mm.index + mm[0].length;
    } else {
      const hi = h.search(/<header\b/i);
      topAt = hi >= 0 && hi < h.indexOf('<main') ? hi : h.search(/<body\b[^>]*>/i) + h.match(/<body\b[^>]*>/i)[0].length;
    }
    if (topAt >= 0) h = h.slice(0, topAt) + `${tA}<div class="ak-topslot${rule.after ? ' ak-in' : ''}">${top}</div>${tB}` + h.slice(topAt);
  }
  const bb = billboardFor(base, urlPath, cfg);
  if (!bottom && topAt < 0 && !bb) return { html: base, injected: false, why: 'no-top' };
  if (bb && bb.top) {
    const [tA, tB] = MARK('bbtop');
    const hi = h.search(/<header\b/i), mi = h.indexOf('<main');
    const at2 = hi >= 0 && (mi < 0 || hi < mi) ? hi : h.search(/<body\b[^>]*>/i) + h.match(/<body\b[^>]*>/i)[0].length;
    // billboard.phoneTop (regex on the URL path): pages where the top band also shows on phones. Elsewhere it is desktop-
    // only (display:none below 48rem, so nothing shifts): on a page whose own design puts a cover or a buy bar above the
    // H1, a phone band would push the H1 under the fold (measured on readstacks book pages, 2026-09-29).
    const topHtml = cfg.billboard.phoneTop && !new RegExp(cfg.billboard.phoneTop).test(urlPath) ? bb.top.replace('class="ak-ad ak-on ak-bill ak-bill-top"', 'class="ak-ad ak-on ak-bill ak-bill-top ak-bill-nophone"') : bb.top;
    h = h.slice(0, at2) + `${tA}${topHtml}${tB}` + h.slice(at2);
  }
  if (bb && bb.mid) {
    // Default: right after </main>, a body-level sibling. Measured 2026-09-29 on readstacks (Next.js): ANY node injected
    // inside <main> is a hydration mismatch, and React then throws the server HTML away and re-renders the whole page on
    // the client (the injected node disappears with it). After </main> hydrates cleanly, and it also stays outside the
    // <main> hash the fleet lastmod scripts use, so no page is re-dated. billboard.midBefore (a regex) opts a static,
    // non-React site into a spot inside the content, e.g. '<section' (it re-dates pages whose lastmod hashes <main>).
    const [mA, mB] = MARK('bbmid');
    let at3 = -1;
    if (cfg.billboard.midBefore) {
      const ms = h.search(/<main\b/i), me = h.lastIndexOf('</main>');
      const re = new RegExp(cfg.billboard.midBefore, 'g'); re.lastIndex = ms; const m = ms >= 0 ? re.exec(h) : null;
      if (m && m.index < me) at3 = m.index;
    } else if (cfg.billboard.midMove) {
      // Strict React builds (measured on secfilingdex, Next 15.0 / React 19 RC): even a body-level node between <main> and
      // the footer fails hydration. midMove puts the slot at the very end of <body> (hydrates cleanly, like the kit script)
      // and AD_JS moves it to just after <main> once the page has loaded, only while <main> still ends below the screen,
      // so the move never shifts anything the visitor is looking at.
      at3 = h.toLowerCase().lastIndexOf('</body>');
    } else {
      const me = h.lastIndexOf('</main>');
      if (me >= 0) at3 = me + '</main>'.length;
    }
    if (at3 >= 0) h = h.slice(0, at3) + `${mA}<div class="ak-bill-midwrap"${cfg.billboard.midMove ? ' data-ak-move="after-main"' : ''}>${bb.mid}</div>${mB}` + h.slice(at3);
  }
  if (bottom) h = h.replace(/<html\b/i, `<html data-akv="${cfg.variant}"`);
  h = h.replace(/<\/head>/i, `${cA}<script>${MINT_JS}</script><script>${BEACON_I_JS}</script>${cfg.billboard && cfg.billboard.variant && bb ? `<script>${bbHeadJs(cfg.billboard.variant)}</script>` : ''}<style>${AD_CSS}\n${SLOT_CSS}${cfg.billboard ? '\n' + BILLBOARD_CSS : ''}</style>${cB}</head>`);
  const bi = h.toLowerCase().lastIndexOf('</body>');
  h = h.slice(0, bi) + `${jA}<script>${AD_JS}</script>${cfg.billboard && cfg.billboard.variant && bb ? `<script>${BB_JS}</script>` : ''}${jB}` + h.slice(bi);
  return { html: h, injected: true, top: topAt >= 0, bb: !!(bb && (bb.top || bb.mid)) };
}

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && !e.name.startsWith('.')) walk(p, acc); } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

export function injectDir(outDir, cfg) {
  const errs = cfg.variant === 'none' ? validatePool(cfg.catalog).filter((e) => e !== 'empty pool') : validatePool(cfg.products);
  if (errs.length) throw new Error(`amazon-ad-inject: ${errs.join('; ')}`);
  if (cfg.variant === 'none' && !(cfg.topCards || []).length && !cfg.billboard) throw new Error('amazon-ad-inject: variant none needs topCards');
  if (!cfg.variant || !cfg.disclosure) throw new Error('amazon-ad-inject: variant and disclosure are required');
  const files = walk(outDir);
  const why = {};
  let n = 0;
  let tops = 0;
  for (const f of files) {
    const rel = path.relative(outDir, f);
    const src = fs.readFileSync(f, 'utf8');
    const r = injectHtml(src, pagePath(rel), cfg);
    if (r.top) tops++;
    if (r.injected) n++; else why[r.why] = (why[r.why] || 0) + 1;
    if (r.html !== src) fs.writeFileSync(f, r.html);
  }
  return { pages: files.length, injected: n, tops, why };
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [outDir, cfgPath = 'amazon-ad.config.mjs'] = process.argv.slice(2);
  if (!outDir || !fs.existsSync(outDir)) { console.error(`amazon-ad-inject: no build output at ${outDir}`); process.exit(1); }
  const cfg = (await import(pathToFileURL(path.resolve(cfgPath)).href)).default;
  const r = injectDir(outDir, cfg);
  console.log(`amazon-ad-inject: ${cfg.site} ${cfg.variant} injected ${r.injected}/${r.pages} pages (top cards: ${r.tops}); not injected: ${JSON.stringify(r.why)}`);
  if (!r.injected) process.exit(1);
}
