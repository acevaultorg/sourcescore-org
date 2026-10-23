// VENDORED Amili Kit v1.17.2 (consent/one-ui.mjs sha256 5a55d037857b) — do not edit here; re-run sync.sh.
// consent/one-ui.mjs — Kit copy of tooling/fleet-deploy/consent-ui.mjs (kept IDENTICAL by guard drift test one-ui.test.mjs).
// Sites carry it as kit/consent-one-ui.mjs; consent-inject runs it after injecting the bar. Original header follows.
// consent-ui: ONE consent UI on a first visit (2026-10-22, Paulo mvk45xtzoqe3pk: "Ik heb dit al eerder gemeld. Los het deze
// keer goed op!"; stickyidea showed two stacked consent bars on 10-19 and readinglist on 10-22). Run by guard.mjs before every
// upload, and by hand:
//
//   node tooling/fleet-deploy/consent-ui.mjs <built dir> --site example.com [--pages / /some/page/] [--control-only]
//
// How: Chromium at 390x844, en-GB, Europe/Amsterdam, a fresh profile (a first visit). Each sample page is served FROM THE BUILT
// FOLDER under https://<site>/..., so Google's AdSense consent message (Funding Choices, decided by publisher + domain + the
// visitor's EEA location) loads exactly as it will live, next to whatever bar the build carries. Analytics, the fleet beacon and
// Amazon are blocked; nothing is clicked. It counts the consent UIs a visitor sees: known CMPs (kit bar, Google, OneTrust,
// Cookiebot, Quantcast, Didomi, Usercentrics, Sourcepoint) plus any other fixed/sticky box that talks about cookies or consent
// and has an accept/decline-type button. More than one on any sample page = exit 1.
// Positive control first, every run: a fixture with two banners must count 2 and a fixture with one must count 1, or the
// check refuses (exit 3): an instrument that cannot see two banners must never report "one".
// Exit 0 ok · 1 two or more consent UIs · 2 usage · 3 control failed or no browser.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const COUNT_JS = () => {
  const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 40 && r.height > 30 && s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05 && r.bottom > 0 && r.top < innerHeight; };
  const KNOWN = [['kit', '.ak-cc'], ['google-fc', '.fc-consent-root'], ['onetrust', '#onetrust-banner-sdk'], ['cookiebot', '#CybotCookiebotDialog'], ['quantcast', '.qc-cmp2-container'], ['didomi', '#didomi-host .didomi-popup-container, #didomi-notice'], ['usercentrics', '#usercentrics-root'], ['sourcepoint', 'iframe[id^="sp_message_iframe"]']];
  const found = [], els = [];
  for (const [n, sel] of KNOWN) for (const e of document.querySelectorAll(sel)) if (vis(e)) { found.push(n); els.push(e); break; }
  const RX = /cookie|consent|privacy choices|we value your privacy|personal data|gdpr/i, BX = /accept|allow|agree|decline|reject|consent|got it|deny/i;
  for (const e of document.querySelectorAll('body *')) {
    const s = getComputedStyle(e); if (!(s.position === 'fixed' || s.position === 'sticky') || !vis(e)) continue;
    if (els.some((k) => k === e || k.contains(e) || e.contains(k))) continue;
    if (!RX.test((e.innerText || '').slice(0, 600))) continue;
    if (![...e.querySelectorAll('button,a,[role=button]')].some((b) => BX.test(b.innerText || b.getAttribute('aria-label') || ''))) continue;
    found.push('other:' + (e.id || String(e.className).split(' ')[0] || e.tagName).slice(0, 30)); els.push(e);
  }
  return found;
};

const BAR = (cls, txt) => `<div class="${cls}" style="position:fixed;left:0;right:0;bottom:0;height:90px;background:#fff;border-top:1px solid #000"><p>${txt}</p><button>Decline</button><button>Accept</button></div>`;
export const FIXTURES = {
  two: `<!doctype html><html><body><p>page</p>${BAR('ak-cc', 'We use cookies for visit statistics.')}<div style="position:fixed;left:10px;right:10px;bottom:120px;height:120px;background:#eee"><p>This site is free, thanks to ads. We use cookies.</p><button>Decline</button><button>Accept</button></div></body></html>`,
  one: `<!doctype html><html><body><p>page</p>${BAR('ak-cc', 'We use cookies for visit statistics.')}<header style="position:sticky;top:0;height:60px">Menu <a href="/privacy/">Privacy</a></header></body></html>`,
};

function chromiumPaths() {
  const core = process.env.AMILI_PW_CORE || path.join(os.homedir(), 'Local/VAULT04-SculptClub/sculptclub/node_modules/playwright-core');
  const C = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  let exe;
  try { exe = fs.readdirSync(C).filter((d) => d.startsWith('chromium_headless_shell-')).sort((a, b) => +b.split('-').pop() - +a.split('-').pop()).flatMap((d) => ['mac-arm64', 'mac-x64'].map((x) => path.join(C, d, `chrome-headless-shell-${x}/chrome-headless-shell`))).find((f) => fs.existsSync(f)); } catch {}
  return { core: path.join(core, 'index.mjs'), exe };
}

const TYPES = { html: 'text/html', js: 'application/javascript', mjs: 'application/javascript', css: 'text/css', json: 'application/json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif', ico: 'image/x-icon', woff2: 'font/woff2', txt: 'text/plain', xml: 'application/xml' };
export function fileFor(out, pathname) {
  const p = decodeURIComponent(pathname).replace(/\/+$/, '') || '';
  for (const c of [p, `${p}.html`, `${p}/index.html`]) {
    const f = path.join(out, c);
    if (f.startsWith(out) && fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

export async function countPages({ out, site, pages = ['/'], wait = 9000 }) {
  const { core, exe } = chromiumPaths();
  if (!exe || !fs.existsSync(core)) return { ok: false, code: 3, why: 'no Chromium/playwright-core on this Mac (set AMILI_PW_CORE)' };
  const { chromium } = await import(core);
  const b = await chromium.launch({ headless: true, executablePath: exe });
  const ctxOpts = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'en-GB', timezoneId: 'Europe/Amsterdam', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' };
  const control = async (html) => {
    const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
    await p.route('https://consent-control.invalid/**', (r) => r.fulfill({ contentType: 'text/html', body: html }));
    await p.goto('https://consent-control.invalid/'); const n = (await p.evaluate(COUNT_JS)).length; await ctx.close(); return n;
  };
  try {
    const two = await control(FIXTURES.two), one = await control(FIXTURES.one);
    if (two !== 2 || one !== 1) return { ok: false, code: 3, why: `control failed: two-banner fixture counted ${two} (want 2), one-banner fixture counted ${one} (want 1)` };
    if (out === null) return { ok: true, note: 'control ok (2 and 1)' };
    const res = [];
    for (const pg of pages) {
      const ctx = await b.newContext(ctxOpts);
      await ctx.route(/google-analytics|googletagmanager|clarity\.ms|fleet\.promptprio\.com\/c\b|amazon\.|amzn\.|static\.cloudflareinsights/, (r) => r.abort());
      await ctx.route(`https://${site}/**`, (r) => {
        const u = new URL(r.request().url()); const f = fileFor(out, u.pathname);
        if (!f) return r.fulfill({ status: 404, body: '' });
        const ext = path.extname(f).slice(1).toLowerCase();
        return r.fulfill({ status: 200, contentType: TYPES[ext] || 'application/octet-stream', body: fs.readFileSync(f) });
      });
      const p = await ctx.newPage();
      let found;
      try { await p.goto(`https://${site}${pg}`, { waitUntil: 'load', timeout: 45000 }); await p.waitForTimeout(wait); found = await p.evaluate(COUNT_JS); }
      catch (e) { found = null; res.push({ page: pg, err: String(e).slice(0, 120) }); }
      if (found) res.push({ page: pg, n: found.length, ui: found });
      await ctx.close();
    }
    const bad = res.filter((r) => r.n > 1), broken = res.filter((r) => r.err);
    if (broken.length) return { ok: false, code: 3, why: `could not load ${broken.map((r) => r.page).join(', ')} from the build: ${broken[0].err}` };
    if (bad.length) return { ok: false, code: 1, why: `${bad.length} of ${res.length} sample page(s) show ${bad.map((r) => `${r.n} consent UIs (${r.ui.join(' + ')}) on ${r.page}`).join('; ')}; a first visit must see exactly one` };
    return { ok: true, note: `control ok; ${res.map((r) => `${r.page}: ${r.n} (${r.ui.join(', ') || 'none'})`).join('; ')}` };
  } finally { await b.close(); }
}
