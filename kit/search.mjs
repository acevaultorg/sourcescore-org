// VENDORED Amili Kit v1.2.3 (search.mjs sha256 0ec874859dab) from VAULT-Fleet/tooling/fleet-kit/search/search.mjs — do not edit here; re-run sync.sh.
// Amili Kit: Amili Search — @fleet/kit component (Paulo 2026-09-28 mulka4m44yukr1: "amili search must be great").
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/search/search.mjs. Grown from tooling/amili-search (v1, the fleet's per-site
// search) and fitmylens/search.js (the typing-session logging contract). Sites vendor a copy with sync.sh.
//
// Instant, typo-tolerant search over a static JSON index built at build time. No server, no framework, no layout shift.
//
//   import { renderSearch, SEARCH_CSS, SEARCH_JS } from './kit/search.mjs';
//   html = `<style>${SEARCH_CSS}</style>` + renderSearch({ index: '/search-index.json' }) + `<script>${SEARCH_JS}</script>`
//   index: node kit/search-build-index.mjs <out-dir>   (writes <out-dir>/search-index.json)
//
// opts = {
//   index: '/search-index.json',   // required: the JSON rows [title, description, url, label?, keywords?]
//   placeholder: 'Search',         // input placeholder
//   label: 'Search this site',     // accessible name (visually hidden label)
//   action: '/search/',            // optional no-JS fallback: GET <action>?q=… (omit = JS only)
//   max: 8,                        // results shown
//   suggest: ['guides', 'tools'],  // shown when nothing matches (buttons that fill the box)
//   logUrl: 'https://your-endpoint.example/search-log', // optional: POST {q, results, path} via sendBeacon
//   logAll: false,                 // false = log zero-result queries only; true = every settled query
//   ga4: false,                    // true = also fire GA4 `search` + `search_no_results` if gtag exists
//   clarity: false,                // true = also fire Clarity Search / SearchNoResults events + tags if clarity exists
//   prefillFromPath: false,        // 404 pages: start with the words of the missing URL as the query
//   hotkey: true,                  // "/" and Ctrl/Cmd+K focus the box
//   brand: BRAND_DEFAULT,          // tiny "amili" mark in the results corner, links to amili.ai/kit
//   id: 'site-search',             // unique per page if you place two
// }
// The page also gets a bubbling `ak-search` CustomEvent {q, results} on the form for your own analytics.

import { HEADER_CSS, HEADER_JS_FN } from './header.mjs';

const BRAND_DEFAULT = false; // fleet sites: off (the footer already credits). The public edition ships true.

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------------------------------------------------------------------------------------------------------------
// The engine. Plain ES5 functions: they run in Node for the tests AND are serialised verbatim into SEARCH_JS, so the
// code the tests prove is byte-for-byte the code the browser runs.
// ---------------------------------------------------------------------------------------------------------------
function norm(s) {
  s = String(s == null ? '' : s).toLowerCase();
  if (/[^\x00-\x7f]/.test(s)) s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return s.replace(/[^a-z0-9]+/g, ' ').trim();
}
// Bounded Damerau-Levenshtein (adjacent swaps count as one typo). Returns k+1 as soon as the distance must exceed k.
function within(a, b, k) {
  var la = a.length, lb = b.length, i, j;
  if (Math.abs(la - lb) > k) return k + 1;
  var pp = null, p = [], c;
  for (j = 0; j <= lb; j++) p[j] = j;
  for (i = 1; i <= la; i++) {
    c = [i];
    var lo = i;
    for (j = 1; j <= lb; j++) {
      var v = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1));
      if (i > 1 && j > 1 && a.charCodeAt(i - 1) === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === b.charCodeAt(j - 1)) v = Math.min(v, pp[j - 2] + 1);
      c[j] = v;
      if (v < lo) lo = v;
    }
    if (lo > k) return k + 1;
    pp = p; p = c;
  }
  return p[lb];
}
function typos(len) { return len >= 8 ? 2 : len >= 4 ? 1 : 0; }
// rows: [title, description, url, label?, keywords?] or {t, d, u, g, k, b}. Builds a vocabulary with postings once.
function makeIndex(rows) {
  var docs = [], vocab = Object.create(null), words = [];
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i], o = Array.isArray(r) ? { t: r[0], d: r[1], u: r[2], g: r[3], k: r[4], i: r[5] } : r;
    var tn = norm(o.t), doc = { t: String(o.t || ''), d: String(o.d || ''), u: String(o.u || '/'), g: o.g ? String(o.g) : '', i: o.i && /^(https:\/\/|\/)/.test(String(o.i)) ? String(o.i) : '', b: +o.b || 0, tn: tn };
    docs.push(doc);
    var seen = Object.create(null), tw = tn ? tn.split(' ') : [], ow = norm((o.d || '') + ' ' + (o.k || '') + ' ' + (o.g || '')).split(' ');
    for (var a = 0; a < tw.length + ow.length; a++) {
      var w = a < tw.length ? tw[a] : ow[a - tw.length], f = a < tw.length ? 3 : 1;
      if (!w || (seen[w] || 0) >= f) continue;
      if (!vocab[w]) { vocab[w] = []; words.push(w); }
      if (seen[w]) { var pl = vocab[w]; pl[pl.length - 1] = i * 4 + f; } else vocab[w].push(i * 4 + f);
      seen[w] = f;
    }
  }
  return { docs: docs, vocab: vocab, words: words };
}
// Which vocabulary words a query token hits, and how well. The last token also matches as a prefix (typing).
function termHits(ix, tok, isLast) {
  var out = [], k = typos(tok.length), ws = ix.words;
  for (var i = 0; i < ws.length; i++) {
    var w = ws[i], s = 0;
    if (w === tok) s = 1;
    else if (isLast && w.length > tok.length && w.lastIndexOf(tok, 0) === 0) s = 0.85;
    else if (k) {
      var d = within(tok, w, k);
      if (d <= k) s = d === 1 ? 0.6 : 0.4;
      else if (isLast && w.length > tok.length && tok.length >= 4) {
        d = within(tok, w.slice(0, tok.length), k);
        if (d <= k) s = d === 1 ? 0.5 : 0.3;
      }
    }
    if (s) out.push([w, s]);
  }
  return out;
}
// Returns { hits: [{t,d,u,g}], terms: {word: 1}, partial: bool }. All tokens must match; if none do, the rows that
// match the most tokens come back with partial=true (never an empty screen when something is close).
function query(ix, q, max) {
  var toks = norm(q).split(' ').filter(Boolean).slice(0, 16), terms = {}, per = [], n = ix.docs.length, i, j;
  if (!toks.length) return { hits: [], terms: terms, partial: false };
  for (i = 0; i < toks.length; i++) {
    var th = termHits(ix, toks[i], i === toks.length - 1), best = Object.create(null);
    for (j = 0; j < th.length; j++) {
      terms[th[j][0]] = 1;
      var pl = ix.vocab[th[j][0]];
      for (var p = 0; p < pl.length; p++) {
        var id = pl[p] >> 2, sc = th[j][1] * (pl[p] & 3);
        if (!(best[id] >= sc)) best[id] = sc;
      }
    }
    per.push(best);
  }
  var score = Object.create(null), cnt = Object.create(null), top = 0;
  for (i = 0; i < per.length; i++) for (var key in per[i]) { score[key] = (score[key] || 0) + per[i][key]; cnt[key] = (cnt[key] || 0) + 1; if (cnt[key] > top) top = cnt[key]; }
  var phrase = toks.join(' '), res = [];
  for (var id2 in score) {
    if (cnt[id2] < top) continue;
    var d = ix.docs[id2], s = score[id2] + d.b;
    if (d.tn.lastIndexOf(phrase, 0) === 0) s += 3; else if (d.tn.indexOf(phrase) !== -1) s += 1.5;
    s -= Math.min(d.t.length, 160) / 200;
    res.push([s, +id2]);
  }
  res.sort(function (a, b) { return b[0] - a[0] || a[1] - b[1]; });
  var hits = [];
  for (i = 0; i < res.length && i < (max || 8); i++) hits.push(ix.docs[res[i][1]]);
  return { hits: hits, terms: terms, partial: top < toks.length && hits.length > 0, total: res.length };
}
// "Did you mean": the closest vocabulary word (most postings wins a tie) for every token that found nothing.
function didYouMean(ix, q) {
  var toks = norm(q).split(' ').filter(Boolean), out = [], changed = false;
  for (var i = 0; i < toks.length; i++) {
    var t = toks[i], best = null, bd = 99, bn = 0;
    if (ix.vocab[t]) { out.push(t); continue; }
    var k = Math.max(2, Math.floor(t.length / 3));
    for (var j = 0; j < ix.words.length; j++) {
      var w = ix.words[j], d = within(t, w, k);
      if (d <= k && (d < bd || (d === bd && ix.vocab[w].length > bn))) { best = w; bd = d; bn = ix.vocab[w].length; }
    }
    if (best) { out.push(best); changed = true; } else out.push(t);
  }
  return changed ? out.join(' ') : '';
}
// Escaped HTML with <mark> around the words the query matched.
function highlight(text, terms) {
  var parts = String(text).split(/([A-Za-z0-9\u00c0-\u024f]+)/), h = '';
  for (var i = 0; i < parts.length; i++) {
    var e = parts[i].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    h += (i % 2 && terms[norm(parts[i])]) ? '<mark>' + e + '</mark>' : e;
  }
  return h;
}
// Logging privacy: lowercase, no e-mail addresses, no phone-shaped digits, 60 chars. One typing session logs once.
function cleanQuery(s) {
  return String(s || '').toLowerCase().replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, ' ').replace(/\+?\d[\d\s().-]{7,}\d/g, ' ')
    .replace(/\s+/g, ' ').trim().slice(0, 60);
}
function sameTypingSession(a, b) {
  var s = a.length < b.length ? a : b, i = 0;
  while (i < s.length && a.charAt(i) === b.charAt(i)) i++;
  return i >= s.length * 0.6;
}

export const engine = { norm, within, typos, makeIndex, termHits, query, didYouMean, highlight, cleanQuery, sameTypingSession };

// ---------------------------------------------------------------------------------------------------------------
// Markup (server side). The results box is absolutely positioned, so opening it never moves the page.
// ---------------------------------------------------------------------------------------------------------------
export function brandMark(on) {
  return on ? '<a class="ak-brand" href="https://amili.ai/kit" rel="noopener" aria-label="Made with Amili Kit"><span class="ak-brand-dot" aria-hidden="true"></span>amili</a>' : '';
}

export function renderSearch(opts = {}) {
  if (!opts.index) throw new Error('Amili Search: opts.index (URL of the JSON index) is required');
  if (opts.logUrl && !/^(https:\/\/|\/)/.test(opts.logUrl)) throw new Error('Amili Search: logUrl must be https:// or a same-site path');
  const id = esc(opts.id || 'site-search');
  const brand = opts.brand === undefined ? BRAND_DEFAULT : !!opts.brand;
  const data = [
    `data-ak-search`, `data-index="${esc(opts.index)}"`,
    opts.max ? `data-max="${+opts.max}"` : '',
    opts.suggest?.length ? `data-suggest="${esc(opts.suggest.join('|'))}"` : '',
    opts.logUrl ? `data-log="${esc(opts.logUrl)}"` : '', opts.logAll ? 'data-log-all' : '',
    opts.ga4 ? 'data-ga4' : '', opts.clarity ? 'data-clarity' : '', opts.prefillFromPath ? 'data-prefill-path' : '', opts.hotkey === false ? 'data-no-hotkey' : '',
  ].filter(Boolean).join(' ');
  const action = opts.action ? ` action="${esc(opts.action)}" method="get"` : '';
  return `<form class="ak-search" role="search"${action} ${data}>`
    + `<label class="ak-s-label" for="${id}">${esc(opts.label || 'Search this site')}</label>`
    + `<div class="ak-s-box"><svg class="ak-s-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>`
    + `<input id="${id}" name="q" type="search" placeholder="${esc(opts.placeholder || 'Search')}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" role="combobox" aria-expanded="false" aria-controls="${id}-list" aria-autocomplete="list" aria-describedby="${id}-status">`
    + (opts.hotkey === false ? '' : `<kbd class="ak-s-kbd" aria-hidden="true">/</kbd>`)
    + `</div>`
    + `<div class="ak-s-pop" hidden><ul class="ak-s-list" id="${id}-list" role="listbox" aria-label="Results"></ul><div class="ak-s-empty" hidden></div>`
    + `<div class="ak-s-foot"><span class="ak-s-keys" aria-hidden="true"><kbd>&uarr;</kbd><kbd>&darr;</kbd> move <kbd>Enter</kbd> open <kbd>Esc</kbd> close</span>${brandMark(brand)}</div></div>`
    + `<p class="ak-s-status" id="${id}-status" role="status" aria-live="polite"></p>`
    + `</form>`;
}

export const BRAND_CSS = `.ak-brand{display:inline-flex;align-items:center;gap:.3em;min-height:44px;padding:0 .25rem;font:400 11px/1 Georgia,"Times New Roman",serif;letter-spacing:.01em;color:inherit;opacity:.5;text-decoration:none}
.ak-brand:hover,.ak-brand:focus-visible{opacity:.85}
.ak-brand-dot{width:.5em;height:.5em;border-radius:50%;background:#2F5D50;order:2;margin-top:-.45em}
@media (prefers-color-scheme:dark){.ak-brand-dot{background:#7FB3A1}}`;

export const SEARCH_CSS = `.ak-search{position:relative;max-width:var(--ak-max,40rem);margin:0;font:inherit;color:inherit}
.ak-s-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.ak-s-box{position:relative;display:flex;align-items:center;height:48px;border:1px solid var(--ak-line,color-mix(in srgb,currentColor 22%,transparent));border-radius:var(--ak-radius,12px);background:var(--ak-bg,Canvas);color:var(--ak-fg,CanvasText)}
.ak-s-box:focus-within{border-color:var(--ak-accent,currentColor);box-shadow:0 0 0 3px color-mix(in srgb,var(--ak-accent,currentColor) 18%,transparent)}
.ak-s-icon{flex:0 0 auto;width:20px;height:20px;margin:0 0 0 14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;opacity:.6}
.ak-search input{flex:1;min-width:0;height:100%;border:0;background:transparent;color:inherit;font:inherit;font-size:16px;padding:0 12px;outline:0;-webkit-appearance:none;appearance:none}
.ak-search input::-webkit-search-cancel-button{-webkit-appearance:none}
.ak-s-kbd{margin-right:12px;padding:1px 7px;border:1px solid var(--ak-line,color-mix(in srgb,currentColor 25%,transparent));border-radius:6px;font:12px/1.4 ui-monospace,Menlo,monospace;opacity:.6}
.ak-search:focus-within .ak-s-kbd{display:none}
.ak-s-pop{position:absolute;z-index:50;left:0;right:0;top:calc(100% + 6px);border:1px solid var(--ak-line,color-mix(in srgb,currentColor 18%,transparent));border-radius:var(--ak-radius,12px);background:var(--ak-bg,Canvas);color:var(--ak-fg,CanvasText);box-shadow:0 18px 40px -18px rgba(0,0,0,.35);overflow:hidden}
.ak-s-pop[hidden]{display:none}
.ak-s-list{list-style:none;margin:0;padding:6px;max-height:min(60vh,28rem);overflow-y:auto;overscroll-behavior:contain}
.ak-s-list li{display:block;min-height:44px;padding:9px 12px;border-radius:8px;cursor:pointer;line-height:1.35}
.ak-s-list li[aria-selected=true],.ak-s-list li:hover{background:color-mix(in srgb,currentColor 8%,transparent)}
.ak-s-t{display:block;font-weight:600}
.ak-s-list li.ak-s-hasth{display:grid;grid-template-columns:44px minmax(0,1fr);column-gap:12px;align-items:center}
.ak-s-hasth .ak-s-th{grid-row:1/span 2;width:44px;height:44px;object-fit:cover;border-radius:6px;background:color-mix(in srgb,currentColor 8%,transparent)}
.ak-s-hasth .ak-s-t,.ak-s-hasth .ak-s-d{grid-column:2}
.ak-s-g{float:right;margin-left:8px;font-size:12px;opacity:.6;font-weight:400}
.ak-s-d{display:block;font-size:.875rem;opacity:.72;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ak-search mark{background:color-mix(in srgb,var(--ak-mark,#e9c46a) 45%,transparent);color:inherit;border-radius:2px}
.ak-s-empty{padding:14px 16px;font-size:.9375rem}
.ak-s-empty p{margin:0 0 8px}
.ak-s-sug{display:flex;flex-wrap:wrap;gap:6px}
.ak-s-sug button{min-height:44px;padding:0 14px;border:1px solid var(--ak-line,color-mix(in srgb,currentColor 22%,transparent));border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.875rem;cursor:pointer}
.ak-s-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:36px;padding:0 10px 0 14px;border-top:1px solid var(--ak-line,color-mix(in srgb,currentColor 12%,transparent));font-size:12px;opacity:.85}
.ak-s-foot kbd{font:11px/1 ui-monospace,Menlo,monospace;padding:2px 4px;border:1px solid var(--ak-line,color-mix(in srgb,currentColor 25%,transparent));border-radius:4px}
.ak-s-status{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (pointer:coarse){.ak-s-keys,.ak-s-kbd{display:none}.ak-s-foot:not(:has(.ak-brand)){display:none}}
:root[data-theme=dark] .ak-search{color-scheme:dark}
${BRAND_CSS}`;

// ---------------------------------------------------------------------------------------------------------------
// The browser script: the engine above (verbatim) + the widget. Self-initialises every [data-ak-search] form.
// ---------------------------------------------------------------------------------------------------------------
function widget() {
  var E = { norm: norm, makeIndex: makeIndex, query: query, didYouMean: didYouMean, highlight: highlight, cleanQuery: cleanQuery, sameTypingSession: sameTypingSession };
  var cache = {};
  function loadIndex(url, cb) {
    var c = cache[url] || (cache[url] = { ix: null, q: [], busy: false });
    if (c.ix) return cb(c.ix);
    c.q.push(cb);
    if (c.busy) return;
    c.busy = true;
    fetch(url, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (rows) { c.ix = E.makeIndex(rows || []); }, function () { c.ix = E.makeIndex([]); c.failed = true; })
      .then(function () { var w = c.q, ix = c.ix; c.q = []; c.busy = false; if (c.failed) { c.ix = null; c.failed = false; } for (var i = 0; i < w.length; i++) w[i](ix); }); // a failed fetch is retried on the next keystroke, never cached as an empty index
  }
  function init(form, n) {
    if (form.__ak) return; form.__ak = 1;
    var inp = form.querySelector('input'), pop = form.querySelector('.ak-s-pop'), list = form.querySelector('.ak-s-list'),
      empty = form.querySelector('.ak-s-empty'), status = form.querySelector('.ak-s-status');
    var url = form.getAttribute('data-index'), max = +form.getAttribute('data-max') || 8, logUrl = form.getAttribute('data-log'),
      logAll = form.hasAttribute('data-log-all'), ga4 = form.hasAttribute('data-ga4'), cla = form.hasAttribute('data-clarity'),
      sug = (form.getAttribute('data-suggest') || '').split('|').filter(Boolean);
    var hits = [], sel = -1, last = '', timer = 0, frame = 0, logged = '', pid = inp.id || ('ak-s' + n);
    function log(q, count) {
      q = E.cleanQuery(q);
      if (!q) return;
      if (logged && E.sameTypingSession(q, logged)) { if (q.length > logged.length) logged = q; return; }
      logged = q;
      try { form.dispatchEvent(new CustomEvent('ak-search', { bubbles: true, detail: { q: q, results: count } })); } catch (e) {}
      try {
        if (ga4 && window.gtag) { gtag('event', 'search', { search_term: q, results: count }); if (!count) gtag('event', 'search_no_results', { search_term: q }); }
        if (cla && window.clarity) { clarity('event', count ? 'Search' : 'SearchNoResults'); clarity('set', count ? 'search_query' : 'search_noresult', q); }
        if (logUrl && (logAll || !count) && navigator.sendBeacon) navigator.sendBeacon(logUrl, JSON.stringify({ q: q, results: count, path: location.pathname }));
      } catch (e) { /* analytics never breaks search */ }
    }
    function flush() { if (timer) { clearTimeout(timer); timer = 0; if (last.trim()) log(last, hits.length); } }
    function show(on) { pop.hidden = !on; inp.setAttribute('aria-expanded', on && hits.length ? 'true' : 'false'); }
    function paint(res, q, ix) {
      hits = res.hits; sel = hits.length ? 0 : -1;
      var h = '';
      for (var i = 0; i < hits.length; i++) {
        var r = hits[i];
        h += '<li role="option" id="' + pid + '-o' + i + '" aria-selected="' + (i === sel) + '" data-i="' + i + '"' + (r.i ? ' class="ak-s-hasth"' : '') + '>'
          + (r.i ? '<img class="ak-s-th" src="' + E.highlight(r.i, {}) + '" alt="" width="44" height="44" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '')
          + '<span class="ak-s-t">' + (r.g ? '<span class="ak-s-g">' + E.highlight(r.g, {}) + '</span>' : '') + E.highlight(r.t, res.terms) + '</span>'
          + (r.d ? '<span class="ak-s-d">' + E.highlight(r.d, res.terms) + '</span>' : '') + '</li>';
      }
      list.innerHTML = h;
      list.hidden = !hits.length;
      if (!hits.length) {
        var dym = ix ? E.didYouMean(ix, q) : '', b = '';
        if (dym) b += '<button type="button" data-q="' + E.highlight(dym, {}) + '">' + E.highlight(dym, {}) + '</button>';
        for (var j = 0; j < sug.length && j < 5; j++) if (sug[j] !== dym) b += '<button type="button" data-q="' + E.highlight(sug[j], {}) + '">' + E.highlight(sug[j], {}) + '</button>';
        empty.innerHTML = '<p>No results for <strong>' + E.highlight(q.trim().slice(0, 60), {}) + '</strong>.' + (dym ? ' Did you mean:' : b ? ' Try:' : ' Try a shorter word.') + '</p>' + (b ? '<div class="ak-s-sug">' + b + '</div>' : '');
        empty.hidden = false;
      } else empty.hidden = true;
      status.textContent = hits.length ? hits.length + (res.total > hits.length ? ' of ' + res.total : '') + ((res.total || hits.length) === 1 ? ' result' : ' results') + (res.partial ? ', closest matches' : '') : 'No results';
      aria();
      show(true);
    }
    function aria() {
      if (sel >= 0) inp.setAttribute('aria-activedescendant', pid + '-o' + sel); else inp.removeAttribute('aria-activedescendant');
      var li = list.children;
      for (var i = 0; i < li.length; i++) li[i].setAttribute('aria-selected', i === sel ? 'true' : 'false');
      if (sel >= 0 && li[sel] && li[sel].scrollIntoView) li[sel].scrollIntoView({ block: 'nearest' });
    }
    function run() {
      frame = 0;
      var q = inp.value;
      if (q === last && !pop.hidden) return;
      last = q;
      clearTimeout(timer); timer = 0;
      if (!q.trim()) { hits = []; list.innerHTML = ''; empty.hidden = true; status.textContent = ''; show(false); return; }
      loadIndex(url, function (ix) {
        if (inp.value !== q) return;
        paint(E.query(ix, q, max), q, ix);
        timer = setTimeout(function () { timer = 0; log(q, hits.length); }, 1800);
      });
    }
    function go(i, newTab) {
      var r = hits[i]; if (!r) return;
      flush();
      if (newTab) window.open(r.u, '_blank', 'noopener'); else location.href = r.u;
    }
    inp.addEventListener('focus', function () { loadIndex(url, function () {}); if (inp.value.trim()) { last = ''; run(); } });
    inp.addEventListener('input', function () { if (!frame) frame = requestAnimationFrame(run); });
    inp.addEventListener('keydown', function (e) {
      var n2 = hits.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (pop.hidden) { last = ''; run(); return; }
        if (n2) { sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + n2) % n2; aria(); }
      } else if (e.key === 'Enter') {
        if (n2 && !pop.hidden) { e.preventDefault(); go(sel < 0 ? 0 : sel, e.metaKey || e.ctrlKey); }
        else if (!form.getAttribute('action')) e.preventDefault();
        else flush();
      } else if (e.key === 'Escape') {
        if (!pop.hidden) { e.preventDefault(); flush(); show(false); } else if (inp.value) { e.preventDefault(); inp.value = ''; run(); }
      }
    });
    list.addEventListener('mousedown', function (e) { e.preventDefault(); });
    list.addEventListener('click', function (e) {
      var li = e.target.closest && e.target.closest('li[data-i]');
      if (li) go(+li.getAttribute('data-i'), e.metaKey || e.ctrlKey || e.button === 1);
    });
    empty.addEventListener('mousedown', function (e) { e.preventDefault(); });
    empty.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button[data-q]');
      if (b) { inp.value = b.getAttribute('data-q'); inp.focus(); last = ''; run(); }
    });
    form.addEventListener('submit', function (e) { if (!form.getAttribute('action')) e.preventDefault(); });
    form.addEventListener('focusout', function (e) { if (!form.contains(e.relatedTarget)) { flush(); show(false); } });
    if (form.hasAttribute('data-prefill-path')) {
      var words = decodeURIComponent(location.pathname).split(/[\/_.\-+]+/).filter(function (w) { return w && !/^(index|html?|php)$/i.test(w); }).slice(-4).join(' ');
      if (words) { inp.value = words; loadIndex(url, function () { last = ''; run(); }); }
    }
  }
  var forms = document.querySelectorAll('form[data-ak-search]');
  for (var i = 0; i < forms.length; i++) init(forms[i], i);
  document.addEventListener('keydown', function (e) {
    var t = e.target, typing = t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName));
    if ((e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) || (e.key && e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
      var f = document.querySelector('form[data-ak-search]:not([data-no-hotkey]) input');
      if (f) { e.preventDefault(); var dlg = f.closest && f.closest('dialog'); if (dlg && !dlg.open && dlg.showModal) dlg.showModal(); f.focus(); if (f.select) f.select(); }
    }
  });
}

// ---------------------------------------------------------------------------------------------------------------
// Site-wide launcher (the rollout shape): one script file adds Amili Search to every page of a site without touching
// the page templates. It puts the search form in a native <dialog> (focus trap, Esc, backdrop for free), opens it
// from "/", Ctrl/Cmd+K, a small 44px button, and any existing search box the site already has (takeover), so a
// hand-made search is replaced in place. The button is fixed (no layout shift) and lifts itself above any bar that
// is pinned to the bottom of the screen (a sticky buy bar, a consent bar).
// ---------------------------------------------------------------------------------------------------------------
function launcher(cfg) {
  var dlg = document.createElement('dialog');
  dlg.className = 'ak-s-dlg';
  dlg.setAttribute('aria-label', cfg.label || 'Search this site');
  dlg.innerHTML = cfg.form + '<button type="button" class="ak-s-x" aria-label="Close search"><span aria-hidden="true">&times;</span></button>';
  document.body.appendChild(dlg);
  var st = document.createElement('style'); st.textContent = cfg.css; document.head.appendChild(st);
  var inp = dlg.querySelector('input');
  function open(q) {
    if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } }
    if (typeof q === 'string' && q) { inp.value = q; inp.dispatchEvent(new Event('input', { bubbles: true })); }
    inp.focus(); if (!q && inp.select) inp.select();
  }
  function close() { if (dlg.open && dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  dlg.querySelector('.ak-s-x').addEventListener('click', close);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && dlg.querySelector('.ak-s-pop').hidden) { e.preventDefault(); close(); }
  });
  var take = document.querySelectorAll((cfg.takeover ? cfg.takeover + ',' : '') + '[data-ak-search-take]');
  for (var i = 0; i < take.length; i++) (function (el) {
    if (dlg.contains(el)) return;
    var form = el.closest && el.closest('form');
    function go(e) { if (e) { e.preventDefault(); } var v = (el.value || '').trim(); if (el.blur) el.blur(); open(v); }
    if (/^(input|textarea)$/i.test(el.tagName)) {
      el.addEventListener('focus', function () { go(); });
      el.setAttribute('autocomplete', 'off');
      if (form) form.addEventListener('submit', go);
    } else el.addEventListener('click', go);
  })(take[i]);
  var opens = document.querySelectorAll('[data-ak-search-open]');
  for (var j = 0; j < opens.length; j++) opens[j].addEventListener('click', function (e) { e.preventDefault(); open(); });
  if (!take.length && !opens.length && cfg.button !== false) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ak-s-fab ak-s-fab-' + (cfg.position === 'right' ? 'r' : 'l');
    b.setAttribute('aria-label', (cfg.label || 'Search this site') + ' (press /)');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
    b.addEventListener('click', function () { open(); });
    document.body.appendChild(b);
    // Room at the page end on phones (CSS sizes it; 0 on wide screens): without it the fixed button sits on the
    // last lines of the page, the footer included, and no amount of scrolling uncovers them (1.0.3).
    var sp = document.createElement('div'); sp.className = 'ak-s-sp'; sp.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sp);
    var lifting = 0, still = 0;
    function lift() {
      lifting = 0;
      // Probe under the button's real centre: on phones CSS puts a left button on the right (1.0.4).
      var rb = b.getBoundingClientRect(), x = rb.width ? rb.left + rb.width / 2 : (cfg.position === 'right' ? innerWidth - 38 : 38);
      var y = innerHeight - 38, top = innerHeight, els = [];
      b.style.visibility = 'hidden';
      try { els = document.elementsFromPoint(x, y); } catch (e) {}
      b.style.visibility = '';
      for (var k = 0; k < els.length; k++) {
        for (var n = els[k]; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
          var p = getComputedStyle(n).position;
          if (p === 'fixed' || p === 'sticky') { var r = n.getBoundingClientRect(); if (r.bottom >= innerHeight - 2 && r.top < top) top = r.top; break; }
        }
      }
      b.style.transform = top < innerHeight ? 'translateY(' + -(innerHeight - top) + 'px)' : '';
    }
    function soon() { if (!lifting) lifting = requestAnimationFrame(lift); }
    // While the page scrolls the button fades, so text sliding under it stays readable (1.0.4).
    function moving() { soon(); b.classList.add('ak-s-fab-mv'); clearTimeout(still); still = setTimeout(function () { b.classList.remove('ak-s-fab-mv'); }, 450); }
    addEventListener('scroll', moving, { passive: true }); addEventListener('resize', soon); setTimeout(lift, 400); lift();
  }
  window.amiliSearch = { open: open, close: close };
}

export const LAUNCHER_CSS = `.ak-s-dlg{width:min(40rem,calc(100% - 24px));max-width:none;margin:10vh auto auto;padding:12px;border:0;border-radius:16px;background:var(--ak-bg,Canvas);color:var(--ak-fg,CanvasText);box-shadow:0 24px 60px -12px rgba(0,0,0,.45);overflow:visible;font:16px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.ak-s-dlg::backdrop{background:rgba(10,12,18,.45)}
.ak-s-dlg .ak-search{max-width:none;margin-right:48px}
.ak-s-dlg .ak-s-pop{position:static;margin-top:8px;margin-right:-48px;box-shadow:none;border:0;border-top:1px solid var(--ak-line,color-mix(in srgb,currentColor 12%,transparent));border-radius:0}
.ak-s-dlg .ak-s-list{padding:6px 0}
.ak-s-x{position:absolute;top:14px;right:12px;width:44px;height:44px;border:0;border-radius:10px;background:transparent;color:inherit;font-size:26px;line-height:1;cursor:pointer;opacity:.7}
.ak-s-x:hover{opacity:1}.ak-s-x:focus-visible{outline:2px solid currentColor}
.ak-s-fab{position:fixed;bottom:16px;z-index:2147482990;width:44px;height:44px;padding:0;border:1px solid var(--ak-line,rgba(0,0,0,.14));border-radius:22px;background:var(--ak-bg,Canvas);color:var(--ak-fg,CanvasText);box-shadow:0 4px 14px rgba(0,0,0,.18);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .15s,opacity .2s}
.ak-s-fab-l{left:16px}.ak-s-fab-r{right:16px}
.ak-s-fab-mv{opacity:.4}
.ak-s-sp{height:0}@media (max-width:640px){.ak-s-sp{height:72px}.ak-s-fab-l{left:auto;right:16px}}
.ak-s-fab svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.ak-s-fab:focus-visible{outline:2px solid currentColor;outline-offset:2px}
@media (prefers-reduced-motion:reduce){.ak-s-fab{transition:none}}
@media print{.ak-s-fab{display:none}}`;

// One self-contained script for a whole site: the engine, the widget and the launcher, with this site's settings.
// opts: { index, label, placeholder, suggest, logUrl, logAll, ga4, clarity, logJs: 'function(q,n){...}', position: 'left'|'right',
//         takeover: 'css selector', button, max, brand }
export function searchScript(opts = {}) {
  const form = renderSearch({ ...opts, id: 'ak-site-search', hotkey: true });
  // header (1.2.0): the kit header bar (search button in the header, Shop on phones, header back on scroll-up) runs
  // first, so its button replaces the floating one. opts.header === false switches it off; an object configures it.
  const hdr = opts.header === false ? null : (opts.header || {});
  if (hdr && hdr.shop && hdr.shop.href && !/^\/(?!\/)/.test(hdr.shop.href)) throw new Error('Amili Search: header.shop.href must be a same-site path');
  const cfg = { form, css: SEARCH_CSS + '\n' + LAUNCHER_CSS + (hdr ? '\n' + HEADER_CSS : ''), label: opts.label, position: opts.position, takeover: opts.takeover || '', button: opts.button };
  return '/*! Amili Search (Amili Kit). https://amili.ai/kit */\n(function(){"use strict";if(window.__akSearch)return;window.__akSearch=1;'
    + [norm, within, typos, makeIndex, termHits, query, didYouMean, highlight, cleanQuery, sameTypingSession, widget, launcher].map((f) => f.toString()).join('\n')
    // logJs: the site's OWN existing search logging, kept as it was (e.g. its Plausible/GA4 event names), as the source of
    // a function (q, results) that runs for every settled search, after the kit's privacy scrub and typing-session dedupe.
    + (opts.logJs ? `\ndocument.addEventListener("ak-search",function(e){try{(${String(opts.logJs).replace(/<\//g, '<\\/')})(e.detail.q,e.detail.results)}catch(x){}});` : '')
    + (hdr ? '\n' + HEADER_JS_FN : '')
    // React/Next pages: touching the header before hydration makes React throw #418 and re-render it from scratch
    // (measured on citationdesk/growthfriction/fermentcalc), so there the header bar runs after load, binds its own
    // controls and removes the floating button the launcher had to create meanwhile.
    + `\nfunction start(){${hdr ? `var H0=${JSON.stringify(hdr).replace(/</g, '\\u003c')},st0=document.createElement("style");st0.textContent=${JSON.stringify(HEADER_CSS).replace(/</g, '\\u003c')};document.head.appendChild(st0);var RX=!!(window.__next_f||document.getElementById("__next")||document.querySelector('script[src*="/_next/"],[data-reactroot]'));if(!RX){try{akHeader(H0)}catch(e){}}else{var late=function(){setTimeout(function(){try{H0.late=1;var r=akHeader(H0);if(r&&(r.placed||r.took)){var f=document.querySelector(".ak-s-fab"),sp=document.querySelector(".ak-s-sp");if(f)f.parentNode.removeChild(f);if(sp)sp.parentNode.removeChild(sp)}}catch(e){}},350)};if(document.readyState==="complete")late();else addEventListener("load",late)}` : ''}launcher(${JSON.stringify({ ...cfg, css: SEARCH_CSS + '\n' + LAUNCHER_CSS }).replace(/</g, '\\u003c')});widget();}`
    + '\nif(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();})();';
}

export const SEARCH_JS = '(function(){"use strict";if(window.__akSearch)return;window.__akSearch=1;'
  + [norm, within, typos, makeIndex, termHits, query, didYouMean, highlight, cleanQuery, sameTypingSession, widget].map((f) => f.toString()).join('\n')
  + '\nif(document.readyState==="loading")document.addEventListener("DOMContentLoaded",widget);else widget();})();';

// The kit's common shape: every component exports { name, render(opts) -> html, css, js }.
export default { name: 'search', title: 'Amili Search', render: renderSearch, css: SEARCH_CSS, js: SEARCH_JS };
