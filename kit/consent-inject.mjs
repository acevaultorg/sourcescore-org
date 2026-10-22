#!/usr/bin/env node
// Amili Kit cookie bar — build-output injector. CANONICAL: VAULT-Fleet/tooling/fleet-kit/consent/inject.mjs
// (sites carry kit/consent-inject.mjs + kit/consent.mjs). Run after the site's build, before its guards and deploy:
//   node kit/consent-inject.mjs <outDir> [--privacy /privacy/] [--ads] [--ask all] [--clarity <id>|auto|none] [--lang nl] [--no-host-canon]
// On every built page that runs Google Analytics or Clarity it adds (idempotent, inside markers, nothing else touched):
//  1. HEAD: Consent Mode v2 defaults (denied in the EEA/UK/CH/California, applies a stored choice) — ONLY when the page has none of its own.
//  2. the bar (hidden markup + /kit-consent.<hash>.css + /kit-consent.<hash>.js, deferred) before </body>, in the page's language,
//     linking the site's own privacy page; Clarity's project id is read from the page's own snippet.
//  3. a "Cookie settings" link in the footer (or at the end of the page) when the page has no data-cc="show" element;
//     on React (Next.js) pages always at the end of <body>, never inside the React-rendered footer (1.17.0, hydration).
// Pages that already carry another kit bar (class ak-cc without our markers), a redirect page, or a page without analytics are left alone.
// Exits 1 when a page that runs analytics ends up without the bar.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { renderConsent, consentHead, CONSENT_CSS, CONSENT_JS, settingsLabel, langOf } from './consent.mjs';
import { hostCanon } from './host-canon.mjs';

const M = { body: ['<!--ak-cc-->', '<!--/ak-cc-->'], head: ['<!--ak-cch-->', '<!--/ak-cch-->'], link: ['<!--ak-ccl-->', '<!--/ak-ccl-->'] };
const strip = (h) => Object.values(M).reduce((x, [a, b]) => x.replace(new RegExp(`${a}[\\s\\S]*?${b}`, 'g'), ''), h);
const noScripts = (h) => h.replace(/<script\b[\s\S]*?<\/script>/gi, '');
const RUNS_ANALYTICS = /googletagmanager\.com\/gtag\/js|gtag\(\s*['"]config['"]|clarity\.ms\/tag|"clarity","script"|\bG-[A-Z0-9]{8,12}\b/;
const OWN_DEFAULT = /gtag\(\s*['"]consent['"]\s*,\s*['"]default['"]/;

function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!e.name.startsWith('.') && e.name !== 'node_modules') yield* htmlFiles(p); }
    else if (e.name.endsWith('.html')) yield p;
  }
}
export const clarityId = (h) => (h.match(/"clarity","script","([a-z0-9]{6,16})"/i) || h.match(/clarity\.ms\/tag\/([a-z0-9]{6,16})/i) || [])[1] || '';
export const pageLang = (h) => (h.match(/<html[^>]*\blang=["']?([a-zA-Z-]+)/i) || [])[1] || 'en';
const privacyOf = (h, dflt) => { const m = noScripts(h).match(/<a[^>]+href=["'](\/[^"'#?]*privacy[^"'#?]*)["']/i); return m ? m[1] : dflt; };

// opts: { css, js, privacy, ads, clarity ('auto' | id | 'none'), lang }
export function injectPage(html, opts) {
  let h = strip(html);
  if (/<meta[^>]+http-equiv=["']refresh/i.test(h)) return { html, status: 'redirect' };
  if (!RUNS_ANALYTICS.test(h)) return { html, status: 'no-analytics' };
  if (/class=["'][^"']*\bak-cc\b/.test(h)) return { html, status: 'other-bar' };
  const at = h.lastIndexOf('</body>');
  if (at < 0) return { html, status: 'no-body' };
  const lang = opts.lang || pageLang(h);
  const cid = opts.clarity === 'none' ? '' : opts.clarity && opts.clarity !== 'auto' ? opts.clarity : clarityId(h);
  const bar = renderConsent({ lang, policyHref: privacyOf(h, opts.privacy || '/privacy/'), clarity: cid, ads: !!opts.ads, ask: opts.ask });
  let link = '';
  if (!/data-cc=["']show["']/.test(noScripts(h))) {
    const a = `<a href="#" data-cc="show" style="display:inline-block;padding:12px 8px;color:inherit;text-decoration:underline;text-underline-offset:.2em">${settingsLabel(lang)}</a>`;
    link = M.link[0] + `<p style="margin:0;padding:0 12px;text-align:center;font-size:.875rem">${a}</p>` + M.link[1];
  }
  const tail = M.body[0] + `<link rel="stylesheet" href="${opts.css}">` + bar + `<script src="${opts.js}" defer></script>` + M.body[1];
  // 1.17.0: never inside a React-rendered footer. On a Next.js page (App Router flight data or a __next root) a node added inside
  // <footer> is a hydration mismatch (React #418): React throws the server HTML away and re-renders the page, and every
  // injected kit node (ad bands, this bar) disappears with it. Measured 2026-10-22 on sourcescore, sourdoughhydration and
  // secfilingdex: link in the footer -> #418 and 0 ad bands; the same link at the end of <body> -> no error, both bands.
  const react = /self\.__next_f\.push|<div id="__next"|data-reactroot/.test(h);
  const foot = react ? -1 : h.lastIndexOf('</footer>');
  if (link) h = foot > -1 && foot < at ? h.slice(0, foot) + link + h.slice(foot) : h.slice(0, h.lastIndexOf('</body>')) + link + h.slice(h.lastIndexOf('</body>'));
  const at2 = h.lastIndexOf('</body>');
  h = h.slice(0, at2) + tail + h.slice(at2);
  if (!OWN_DEFAULT.test(h)) {
    const hd = h.match(/<head[^>]*>/i);
    if (hd) h = h.slice(0, hd.index + hd[0].length) + M.head[0] + consentHead() + M.head[1] + h.slice(hd.index + hd[0].length);
  }
  return { html: h, status: 'bar' };
}

// Stable asset URLs (same scheme as product/inject.mjs): hashed names in the pages, stable copies with a short cache.
export function stableHeaders(out, files) {
  const p = path.join(out, '_headers'); const A = '# ak-kit-assets', B = '# /ak-kit-assets';
  let h = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  const re = new RegExp(`\\n?${A}[\\s\\S]*?${B}\\n?`, 'g');
  const prev = (h.match(re) || [''])[0];
  const have = new Set([...prev.matchAll(/^\/kit-[a-z.0-9-]+$/gm)].map((m) => m[0]));
  files.forEach((f) => have.add(f));
  h = h.replace(re, '\n');
  const block = `${A} (Amili Kit: stable URLs, short cache)\n` + [...have].sort().map((f) => `${f}\n  Cache-Control: public, max-age=600, must-revalidate\n`).join('') + `${B}\n`;
  fs.writeFileSync(p, (h.trimEnd() ? h.trimEnd() + '\n\n' : '') + block);
}
// Advanced-mode Pages sites ship out/_worker.js with an exact served-files list; kit assets must be on it (product/inject.mjs, 1.2.6).
export function servedAllowlist(out, files) {
  const w = path.join(out, '_worker.js');
  if (!fs.existsSync(w)) return 0;
  const src = fs.readFileSync(w, 'utf8');
  const re = /const SERVED = new Set\((\[[^\n]*?\])\);/;
  const m = src.match(re);
  if (!m) return 0;
  const have = new Set(JSON.parse(m[1])); const before = have.size;
  files.forEach((f) => have.add(f));
  if (have.size === before) return 0;
  fs.writeFileSync(w, src.replace(re, () => `const SERVED = new Set(${JSON.stringify([...have].sort())});`));
  return have.size - before;
}

export function run(out, o = {}) {
  const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
  const css = CONSENT_CSS, js = CONSENT_JS;
  const hc = `/kit-consent.${hash(css)}.css`, hj = `/kit-consent.${hash(js)}.js`;
  for (const [u, s] of [['/kit-consent.css', css], [hc, css], ['/kit-consent.js', js], [hj, js]]) fs.writeFileSync(path.join(out, u.slice(1)), s);
  const files = ['/kit-consent.css', hc, '/kit-consent.js', hj];
  stableHeaders(out, files); servedAllowlist(out, files);
  // 1.16.6 (card mu5o5b5qoxm2z8): the bare <project>.pages.dev host 301s to the site's canonical domain (host-canon/host-canon.mjs).
  // Rides here because every registered site already runs this step in its own deploy path. A failed self-test restores the
  // worker and throws, so the deploy stops before upload (fail closed). Opt out per site with { hostCanon: false } / --no-host-canon.
  const canon = o.hostCanon === false ? { ok: true, status: 'off' } : hostCanon(out);
  if (!canon.ok) throw new Error(`host-canon: patched _worker.js failed its self-test (${canon.why}); original restored, deploy stopped`);
  const n = { pages: 0, bar: 0, own: 0, none: 0, other: 0, missing: [] };
  for (const f of htmlFiles(out)) {
    n.pages++;
    const h = fs.readFileSync(f, 'utf8');
    const r = injectPage(h, { ...o, css: hc, js: hj });
    if (r.html !== h) fs.writeFileSync(f, r.html);
    if (r.status === 'bar') n.bar++; else if (r.status === 'other-bar') n.own++; else if (r.status === 'no-analytics' || r.status === 'redirect') n.none++; else n.other++;
    if (r.status === 'no-body') n.missing.push(path.relative(out, f));
  }
  return { ...n, hc, hj, canon };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2); const o = (k) => { const i = a.indexOf(k); return i > -1 ? a[i + 1] : null; };
  const out = path.resolve(a[0] || 'out');
  const r = run(out, { privacy: o('--privacy'), ads: a.includes('--ads'), ask: o('--ask') === 'all' ? 'all' : 'eu', clarity: o('--clarity') || 'auto', lang: o('--lang'), hostCanon: !a.includes('--no-host-canon') });
  console.log(`amili consent: bar on ${r.bar}/${r.pages} pages (${r.own} already had a kit bar, ${r.none} run no analytics, ${r.other} other), ${r.hj}`);
  console.log(`amili host-canon: ${r.canon.status}${r.canon.origin ? ' -> ' + r.canon.origin : ''}`);
  if (r.missing.length) { console.error(`amili consent: analytics page without </body>: ${r.missing.slice(0, 5).join(', ')}`); process.exit(1); }
}
