#!/usr/bin/env node
// VENDORED from VAULT-Fleet/tooling/fleet-kit/amazon-ad/inject.mjs (sha256 f4a58e14c498), Amili Kit v1.17.10 — do not edit here; re-run sync.sh.
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
//   lang?, slotStyle?, slotMove? (defer after-main placement until load for strict React hydration) }. Prints "N/M pages" and exits 1 when it injected nothing (a silent no-op must not deploy).
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderAd, renderBillboard, pickProducts, eligibleProducts, AD_CSS, AD_JS, BILLBOARD_CSS, validatePool, validateExcluded, BEACON_I_JS, bbHeadJs, BB_JS, LEARN_JS, LEARN_DEFAULT } from './amazon-ad.mjs';

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
  // Theme tokens must live on the ad itself: its default variables shadow inherited wrapper values.
  if (cfg.adStyle) ad = ad.replace('<aside ', '<aside style="' + String(cfg.adStyle).replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '" ');
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
  const catalog = eligibleProducts(cfg.catalog, cfg.excludeAsins);
  const asins = pageAsins(html, catalog, !!rule.firstOnly, rule.skipHrefs || []);
  const n = rule.n || 1;
  if (asins.length < n) return null;
  const byAsin = new Map(catalog.map((p) => [p.asin, p]));
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
// `requireOwnOn` prevents a page-scoped placement from falling back to unrelated products when its own item is
// not in the site's allow-listed catalog. `catalogOnlyOn` lets a site use its catalog (rather than general products)
// for those same page types; both are opt-in so existing sites keep their established pools.
// `ownOnlyOn` (regex): on those pages the box holds ONLY products the page itself links to, never the rotation, so a
// page about other books never shows an unrelated pick (1.8.7, readstacks books-like/author pages, card mv00dcpvxxyma4).
// `fillFromProductsOn` (regex): on those pages the page's own products still come first (matched against products +
// catalog), but the cards that fill the rest of the box come only from the site's general `products`, never from a
// catalog keyed to other page types (1.17.9, readglobe: algorithm textbooks on bias pages).
// `headlines` ([[pathRegex, headline, midHeadline?, restHeadline?], ...], first match wins): a heading per page type, because one
// template is false somewhere ("the full book behind the summary" on a page that summarises nothing).
// When the top billboard is placed, the page's V1 top card is not (the billboard is the richer version of it).
function billboardFor(html, urlPath, cfg) {
  const b = cfg.billboard;
  if (!b || (b.match && !new RegExp(b.match).test(urlPath))) return null;
  if (b.skipIf && new RegExp(b.skipIf).test(html)) return null; // e.g. a page running its own measured buy-module experiment
  const pageScoped = (pattern) => pattern && new RegExp(pattern).test(urlPath);
  const catalogOnly = pageScoped(b.catalogOnlyOn);
  const requireOwn = pageScoped(b.requireOwnOn);
  const products = eligibleProducts(cfg.products, cfg.excludeAsins);
  const catalog = eligibleProducts(cfg.catalog, cfg.excludeAsins);
  const pool = [...(catalogOnly ? [] : products), ...catalog].filter((p, i, a) => a.findIndex((q) => q.asin === p.asin) === i);
  if (!pool.length) return null;
  const byAsin = new Map(pool.map((p) => [p.asin, p]));
  const own = pageAsins(html, pool, false, (cfg.topCards || [])[0]?.skipHrefs || []).map((a) => byAsin.get(a));
  if (requireOwn && !own.length) return null;
  // fillFromProductsOn (1.17.9): on those pages the cards after the page's own come from the site's general
  // `products` only. The catalog is per-subject (readglobe keys CS textbooks to its /explained/ articles), so a
  // rotation over it put "Introduction to Algorithms" on a cognitive-bias page (eyes 2026-10-23 #3).
  const fillPool = pageScoped(b.fillFromProductsOn) && !catalogOnly ? products : pool;
  const rot = fillPool.length ? pickProducts(fillPool, { page: urlPath, day: RANK_DAY, n: Infinity }) : [];
  const order = (pageScoped(b.ownOnlyOn) ? own : [...own, ...rot]).filter((p, i, a) => a.indexOf(p) === i);
  if (!order.length) return null;
  const hl = (b.headlines || []).find((r) => new RegExp(r[0]).test(urlPath));
  const head = hl ? hl[1] : b.headline, midHead = hl ? (hl[2] || hl[1]) : (b.midHeadline || b.headline);
  // restHeadline: the heading of cards 2+ in a deck/row (default: the box's own heading). A heading that is true of the
  // page's subject only ("the full book behind the summary") must not be stamped on the other cards.
  const restHead = (hl && hl[3]) || b.restHeadline;
  const fill = (tpl, p) => String(tpl).replace(/\{name\}/g, p.name).replace(/\{why\}/g, p.why);
  // billboard.variant ('auto'|'a'|'b'|'c'): the box carries up to 6 products, most relevant first, for the A/B/C layouts.
  const V = !!b.variant;
  const mk = (placement, p, tpl, rest) => decorate(renderBillboard({ placement, product: p, headline: tpl ? fill(tpl, p) : undefined, variants: V, products: V ? rest.map((x) => ({ ...x, bbHead: (restHead || tpl) ? fill(restHead || tpl, x) : x.why })) : undefined, disclosure: cfg.disclosure, api: API, gate: GATE, page: urlPath, lang: cfg.lang || 'en', labels: b.labels }), cfg);
  return { top: b.top ? mk('top', order[0], head, order.slice(1, 6)) : null, mid: b.mid && order[1] ? mk('mid', order[1], midHead, order.slice(2, 7)) : null };
}

// Learning billboard (1.7.0): LEARN_JS runs BEFORE AD_JS (AD_JS waits for its order before filling). On for a site
// with billboard.learn: true, or for every billboard with A/B/C cards once LEARN_DEFAULT flips (after the 10-20 read).
export const learnOn = (cfg) => !!(cfg.billboard && cfg.billboard.variant && (cfg.billboard.learn ?? LEARN_DEFAULT));
// 1.8.0 (Paulo muwzl94eayvh9m "doe de beste implementatie op alle relevante sites"): with LEARN_DEFAULT on, a billboard
// with no variant becomes the 4-up row (layout C, Paulo 10-02 "i like this layout with 4") so the learner has products
// to order. An explicit variant ('random' = the A/B/C test on secfilingdex + readstacks) or learn: false is kept as is.
export function learnDefaults(cfg) {
  const b = cfg && cfg.billboard;
  if (!b || b.variant || !(b.learn ?? LEARN_DEFAULT)) return cfg;
  return { ...cfg, billboard: { ...b, variant: 'auto' } };
}

export function injectHtml(html, urlPath, cfg) {
  cfg = learnDefaults(cfg);
  const base = stripAd(html);
  const skip = [...DEFAULT_SKIP, ...(cfg.skip || [])].map((s) => new RegExp(s));
  if (skip.some((re) => re.test(urlPath))) return { html: base, injected: false, why: 'skip' };
  // React-owned slots render in the layout and load the browser asset after hydration.
  if (cfg.nativeSlot) return { html: base, injected: /data-ak-native/.test(base), why: 'no-native-slot' };
  // anchor 'before-footer' (sites without <main>, e.g. stickyidea): the slot goes right before the page's last <footer>.
  let end = base.lastIndexOf('</main>');
  let endLen = '</main>'.length;
  if (cfg.anchor === 'before-footer' && end < 0) { end = base.lastIndexOf('<footer'); endLen = 0; if (end < 0) return { html: base, injected: false, why: 'no-footer' }; }
  else if (end < 0 || (base.indexOf('</main>') !== end && !nestedMain(base))) return { html: base, injected: false, why: end < 0 ? 'no-main' : 'multi-main' };
  if (!/<\/head>/i.test(base) || !/<\/body>/i.test(base) || !/<html\b/i.test(base)) return { html: base, injected: false, why: 'no-head-body' };
  // variant 'none': top cards only (no end-of-content line), for sites that asked for the targeted card alone.
  const bottom = cfg.variant !== 'none';
  const products = bottom ? pickProducts(eligibleProducts(cfg.products, cfg.excludeAsins), { page: urlPath, day: RANK_DAY, n: Infinity }) : [];
  let ad = bottom ? decorate(renderAd({ variant: cfg.variant, on: !!cfg.slotMove, heading: headingFor(urlPath, cfg), products, disclosure: cfg.disclosure, api: API, gate: GATE, page: urlPath, lang: cfg.lang || 'en', n: cfg.n }), cfg) : '';
  const [cA, cB] = MARK('css');
  const [sA, sB] = MARK('slot');
  const [jA, jB] = MARK('js');
  const at = cfg.slotMove ? base.toLowerCase().lastIndexOf('</body>') : end + endLen;
  let h = bottom ? base.slice(0, at) + `${sA}<div class="ak-slot"${cfg.slotMove ? ' data-ak-move="after-main"' : ''}${cfg.slotStyle ? ` style="${cfg.slotStyle}"` : ''}>${ad}</div>${sB}` + base.slice(at) : base;
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
    // 1.9.0 (Paulo 2026-10-11, espressospecdb "looks shit", card muwvj4pmjz2hr2): the top band NEVER sits above the site header.
    // Inner pages: right after the header's </header>. Homepages of static sites: after the intro paragraph that follows the H1
    // (billboard.topIntro:false opts out; midMove/React builds keep the header slot, since a node inside <main> breaks hydration).
    // No header at all: top of <body>, as before.
    let at2 = -1;
    const hend = hi >= 0 ? h.indexOf('</header>', hi) : -1;
    if (hend >= 0 && (mi < 0 || hend < mi)) at2 = hend + '</header>'.length;
    else at2 = h.search(/<body\b[^>]*>/i) + h.match(/<body\b[^>]*>/i)[0].length;
    if (/^\/(index\.html)?$/.test(urlPath) && cfg.billboard.topIntro !== false && !cfg.billboard.midMove && mi >= 0) {
      const me = h.lastIndexOf('</main>'), h1e = h.indexOf('</h1>', mi);
      const pe = h1e >= 0 ? h.indexOf('</p>', h1e) : -1;
      if (pe >= 0 && pe < me && !/<h2\b/i.test(h.slice(h1e, pe))) at2 = pe + '</p>'.length;
      // 1.17.5 billboard.topAfter (a regex for the end of the homepage's main tool): tool-first homepages put the band under
      // the tool, not between the intro and the tool (whenplant: H1, lede, ZIP form; the 242px phone band pushed the ZIP
      // input under the fold, card mvl5wjrnhftwn1). No match inside <main> falls back to the intro slot above.
      if (cfg.billboard.topAfter) {
        const re = new RegExp(cfg.billboard.topAfter, 'g'); re.lastIndex = mi;
        const m = re.exec(h);
        if (m && m.index + m[0].length <= me) at2 = m.index + m[0].length;
      }
    }
    // billboard.phoneTop (regex on the URL path): pages where the top band also shows on phones. Elsewhere it is desktop-
    // only (display:none below 48rem, so nothing shifts): on a page whose own design puts a cover or a buy bar above the
    // H1, a phone band would push the H1 under the fold (measured on readstacks book pages, 2026-09-29).
    const topHtml = cfg.billboard.phoneTop && !new RegExp(cfg.billboard.phoneTop).test(urlPath) ? bb.top.replace(/class="ak-ad ak-on ak-bill ak-bill-top(?=[ "])/, '$& ak-bill-nophone') : bb.top;
    // 1.8.7: a regex, not the exact class string. The learning billboard's class carries " ak-bb-var" after ak-bill-top,
    // so the exact-string replace missed and phoneTop did nothing on every learning billboard (readstacks 1.7.0..1.8.6:
    // the band sat above the header on phones on every page; measured live 2026-10-08, card mv00dcpvxxyma4).
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
  if (bottom && !cfg.slotMove) h = h.replace(/<html\b/i, `<html data-akv="${cfg.variant}"`);
  h = h.replace(/<\/head>/i, `${cA}<script>${MINT_JS}</script><script>${BEACON_I_JS}</script>${cfg.billboard && cfg.billboard.variant && bb ? `<script>${bbHeadJs(cfg.billboard.variant)}</script>` : ''}${cfg._ext ? `<link rel="stylesheet" href="${cfg._ext.css}">` : `<style>${AD_CSS}\n${SLOT_CSS}${cfg.billboard ? '\n' + BILLBOARD_CSS : ''}</style>`}${cB}</head>`);
  const bi = h.toLowerCase().lastIndexOf('</body>');
  h = h.slice(0, bi) + (cfg._ext ? `${jA}<script src="${cfg._ext.js}" defer></script>${jB}` : `${jA}${learnOn(cfg) && bb ? `<script>${LEARN_JS}</script>` : ''}<script>${AD_JS}</script>${cfg.billboard && cfg.billboard.variant && bb ? `<script>${BB_JS}</script>` : ''}${jB}`) + h.slice(bi);
  return { html: h, injected: true, top: topAt >= 0, bb: !!(bb && (bb.top || bb.mid)) };
}

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && !e.name.startsWith('.')) walk(p, acc); } else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}


// Stable asset URLs (1.2.2, 2026-10-03): pages reference /kit-*.js without a version query, and _headers gives these files
// a short cache, so a later kit update re-uploads ONE file instead of every page of the site (a template-wide re-upload
// took hours per site on a 60 KB/s uplink on 2026-10-02). Idempotent: the block is replaced, never duplicated.
export function stableHeaders(out, files) {
  const p = path.join(out, '_headers'); const A = '# ak-kit-assets', B = '# /ak-kit-assets';
  let h = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const re = new RegExp(`\\n?${A}[\\s\\S]*?${B}\\n?`, 'g');
  const prev = (h.match(re) || [''])[0];
  const have = new Set([...prev.matchAll(/^\/kit-[a-z0-9.-]+$/gm)].map((m) => m[0]).filter((f) => !/^\/kit-ad\.[0-9a-f]{10}\.(css|js)$/.test(f)));
  files.forEach((f) => have.add(f));
  h = h.replace(re, '\n');
  const block = `${A} (Amili Kit: stable URLs, short cache)\n` + [...have].sort().map((f) => `${f}\n  Cache-Control: public, max-age=600, must-revalidate\n`).join('') + `${B}\n`;
  fs.writeFileSync(p, (h.trimEnd() ? h.trimEnd() + '\n\n' : '') + block);
  servedAllowlist(out, files);
}

// Advanced-mode Pages sites (1.2.6, 2026-10-03): a site that ships out/_worker.js with an exact served-files list
// (`const SERVED = new Set([...])`, written by its build.mjs so unknown paths 404 instead of soft-404ing to the
// homepage) 404s every file the kit adds AFTER that list was written. needwatts.com served /kit-ad.css, /kit-ad.js
// and /kit-search.js as 404 from 2026-10-03 01:15Z (kit-rollout live verify caught it). Every kit asset is therefore
// added to that list here. No such worker or no SERVED list = nothing to do. Idempotent.
export function servedAllowlist(out, files) {
  const w = path.join(out, '_worker.js');
  if (!fs.existsSync(w)) return 0;
  const src = fs.readFileSync(w, 'utf8');
  const re = /const SERVED = new Set\((\[[^\n]*?\])\);/;
  const m = src.match(re);
  if (!m) return 0;
  const have = new Set(JSON.parse(m[1]));
  const before = have.size;
  files.forEach((f) => have.add(f));
  if (have.size === before) return 0;
  fs.writeFileSync(w, src.replace(re, () => `const SERVED = new Set(${JSON.stringify([...have].sort())});`));
  return have.size - before;
}

export function injectDir(outDir, cfg) {
  cfg = learnDefaults(cfg);
  const errs = cfg.variant === 'none' ? validatePool(cfg.catalog).filter((e) => e !== 'empty pool') : validatePool(cfg.products);
  errs.push(...validateExcluded([...(cfg.products || []), ...(cfg.catalog || [])], cfg.excludeAsins));
  if (errs.length) throw new Error(`amazon-ad-inject: ${errs.join('; ')}`);
  if (cfg.variant === 'none' && !(cfg.topCards || []).length && !cfg.billboard) throw new Error('amazon-ad-inject: variant none needs topCards');
  if (!cfg.variant || !cfg.disclosure) throw new Error('amazon-ad-inject: variant and disclosure are required');
  const files = walk(outDir);
  // 2026-10-02 (holdlens perf budget: ~32 KB of identical ad CSS/JS inlined into EVERY page pushed 6 pages over the
  // 500 KB source budget): the shared CSS and JS ship once as cached files next to the pages; only the tiny pre-paint
  // scripts (gesture mint, beacon, billboard variant) stay inline. cfg.inline: true keeps the old inline form.
  if (!cfg.inline && !cfg._ext) {
    const css = `${AD_CSS}\n${SLOT_CSS}${cfg.billboard ? '\n' + BILLBOARD_CSS : ''}`;
    const js = `${learnOn(cfg) ? LEARN_JS + '\n' : ''}${AD_JS}\n${cfg.billboard && cfg.billboard.variant ? BB_JS : ''}`;
    const v = (x) => crypto.createHash('sha256').update(x).digest('hex').slice(0, 10);
    // 1.8.3: the pages link a HASHED FILENAME (kit-ad.<hash>.css). 1.8.2's ?v=<hash> query was not enough: during a
    // Pages deploy the edge fetched /kit-ad.css?v=<new> from the still-active OLD deployment (static origins ignore the
    // query), cached the OLD stylesheet under the new key, and audiobookindex rendered unstyled again. An old deployment
    // answers a new filename with a 404, never with stale CSS. The plain names stay for pages still cached with them.
    const cssName = `/kit-ad.${v(css)}.css`, jsName = `/kit-ad.${v(js)}.js`;
    for (const [n, x] of [['/kit-ad.css', css], ['/kit-ad.js', js], [cssName, css], [jsName, js]]) fs.writeFileSync(path.join(outDir, n.slice(1)), x);
    stableHeaders(outDir, ['/kit-ad.css', '/kit-ad.js', cssName, jsName]);
    // 1.8.2 (2026-10-07): zones with a 4 h Browser Cache TTL override serve these with max-age=14400, so a stable URL
    // keeps the OLD stylesheet after a kit change (approvedmodem: full-screen unstyled billboard image, card muxnmnx3ngbg1a).
    // The hash only changes when the CSS/JS content changes, so a kit update that leaves them alone re-uploads no page.
    cfg = { ...cfg, _ext: { css: cssName, js: jsName } };
  }
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
