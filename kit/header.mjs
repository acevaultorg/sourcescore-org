// VENDORED Amili Kit v1.2.4 (header.mjs sha256 fa0ab6e7e8ac) from VAULT-Fleet/tooling/fleet-kit/header/header.mjs — do not edit here; re-run sync.sh.
// Amili Kit: header bar — search in the header on every width, Shop in the phone header, header back on scroll-up.
// Paulo 2026-10-02: "amili kit search missing in menu bar! very bad" (mur0dp4bzunyqy), "if user scrolls back on any of
// our sites, header menu should appear" (mur06p8ukgwx6c), "consider to put shop in the mobile menu bar by default"
// (mur0chhri40io6). CANONICAL: VAULT-Fleet/tooling/fleet-kit/header/header.mjs. Shipped inside kit-search.js (the
// search launcher runs it first, so its search button replaces the floating one); sync.sh vendors it as kit/header.mjs.
//
// Runtime only, after the page is parsed: the built HTML is untouched (no page re-dated), and nothing moves:
//   - the tools (Shop + search) are ONE absolutely positioned group inside the header's logo row, placed left of the
//     row's own right-hand controls (a Menu button), vertically centred on the logo. A box the tools would cover that is
//     not a control (a tagline) is hidden on phones; if the tools would cover the logo, Shop is dropped; if they still do,
//     nothing is placed and the search keeps its floating button (never a broken header).
//   - reveal: the header becomes position:sticky (it keeps its own space, so no shift), slides away while the reader
//     scrolls down past it and comes back on the first scroll up. It never hides while a menu inside it is open or focus
//     is in it, never on a page shorter than two screens, and with prefers-reduced-motion it appears/disappears without
//     animation. It checks itself: if sticky cannot work there (an ancestor that scrolls), it switches itself off.
// cfg (all optional; amili-search.config.json "header": {...}):
//   { header: 'css', logo: 'css', row: 'css', shop: { href: '/shop/', label: 'Shop' } | false, shopDesktop: false,
//     search: true, reveal: true, phone: 760 (px: phone layout at or below), hide: ['css' ...] (extra boxes to hide on phones),
//     z: 1000 }
// Shop default: the first header/nav/footer link whose text or path says shop / store / top picks / best / deals / gear.
// A site with no such page gets no Shop item (never a link to nowhere).

export const HEADER_CSS = `.ak-hb{position:absolute;z-index:3;display:flex;align-items:center;gap:6px;margin:0}
.ak-hb-row{position:relative}
.ak-hb a,.ak-hb button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:44px;height:44px;padding:0 10px;margin:0;border:1px solid color-mix(in srgb,currentColor 22%,transparent);border-radius:999px;background:transparent;color:inherit;font:600 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-decoration:none;cursor:pointer;white-space:nowrap;box-sizing:border-box}
.ak-hb button{padding:0}
.ak-hb a:hover,.ak-hb button:hover{background:color-mix(in srgb,currentColor 8%,transparent)}
.ak-hb a:focus-visible,.ak-hb button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.ak-hb svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:0 0 auto}
.ak-hb-sl{display:none}
.ak-hb.ak-hb-wide button{padding:0 14px 0 12px;width:auto}
.ak-hb.ak-hb-wide .ak-hb-sl{display:inline}
.ak-hb kbd{font:11px/1 ui-monospace,Menlo,monospace;padding:2px 5px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);border-radius:4px;opacity:.7}
.ak-hb-hide{visibility:hidden!important}
.ak-hb-sticky{position:sticky!important;top:0}
.ak-hb-anim{transition:transform .22s ease}
.ak-hb-up{transform:translateY(calc(-100% - 12px))}
@media (prefers-reduced-motion:reduce){.ak-hb-anim{transition:none}}
@media print{.ak-hb{display:none}}`;

// Self-contained browser code (no closures over module scope, no backticks): shipped verbatim in kit-search.js.
function akHeader(cfg) {
  cfg = cfg || {};
  var PH = cfg.phone || 760, d = document, W = window;
  function vis(e) { if (!e) return false; var r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; }
  function q(sel, root) { try { return (root || d).querySelector(sel); } catch (e) { return null; } }
  var hdr = cfg.header ? q(cfg.header) : null;
  if (!hdr) {
    var hs = d.querySelectorAll('header,[role=banner]');
    for (var i = 0; i < hs.length; i++) { var r0 = hs[i].getBoundingClientRect(); if (vis(hs[i]) && r0.top + scrollY < 1100 && r0.width >= innerWidth * 0.6 && !hs[i].closest('main,article,dialog,aside,.ak-ad')) { hdr = hs[i]; break; } }
  }
  if (!hdr) return null;
  var logo = cfg.logo ? q(cfg.logo, hdr) : null;
  if (!logo) {
    var ls = hdr.querySelectorAll('a[href]');
    for (var j = 0; j < ls.length; j++) { var u; try { u = new URL(ls[j].href, location.href); } catch (e) { continue; } if (u.host === location.host && (u.pathname === '/' || u.pathname === '/index.html') && vis(ls[j])) { logo = ls[j]; break; } }
  }
  var out = { header: hdr, placed: false, sticky: false };
  // late (React/Next pages, after hydration): the launcher already ran, so the header binds its own controls.
  function openS(v) { if (W.amiliSearch) W.amiliSearch.open(v || ''); }
  function bindTake(el) {
    if (!cfg.late || el.__akb) return; el.__akb = 1;
    if (/^(input|textarea)$/i.test(el.tagName)) { el.setAttribute('autocomplete', 'off'); el.addEventListener('focus', function () { var v = (el.value || '').trim(); el.blur(); openS(v); }); var f = el.closest('form'); if (f) f.addEventListener('submit', function (e) { e.preventDefault(); openS((el.value || '').trim()); }); }
    else el.addEventListener('click', function (e) { e.preventDefault(); openS(''); });
  }
  // ---- tools ----
  var row = cfg.row ? q(cfg.row, hdr) : null;
  if (!row && logo) { row = logo.parentElement; while (row && row !== hdr && row.getBoundingClientRect().width < hdr.getBoundingClientRect().width * 0.6) row = row.parentElement; }
  var shop = cfg.shop;
  if (shop === undefined) {
    var cands = d.querySelectorAll('header a[href],nav a[href],footer a[href]'), RX = /^(shop|store|the shop|top picks|our picks|best picks|deals|gear|buying guides?|shop picks)$/i, PX = /^\/(shop|store|top-picks|picks|deals|gear)\/?$/i;
    for (var k = 0; k < cands.length; k++) { var a = cands[k], t = (a.textContent || '').trim(), p; try { p = new URL(a.href, location.href); } catch (e) { continue; } if (p.host === location.host && (RX.test(t) || PX.test(p.pathname)) && p.pathname !== location.pathname + '#') { shop = { href: p.pathname + p.search, label: RX.test(t) && t.length <= 10 ? t : 'Shop' }; break; } }
  }
  var wantSearch = cfg.search !== false;
  // The header already shows a search box of its own: the kit search takes it over (opens on focus) instead of adding
  // a second search control (Paulo mur0piu7cz7kzr "make sure this is amili kit search").
  var own = hdr.querySelectorAll('input[type=search],input[name=q],input[name=s],input[name=query],[role=search] input,input[placeholder*=earch]');
  for (var o = 0; o < own.length; o++) if (vis(own[o]) && !own[o].closest('.ak-s-dlg')) { own[o].setAttribute('data-ak-search-take', ''); bindTake(own[o]); wantSearch = false; out.took = true; }
  // ...or a visible "Search" link/button in the header (a /search page): it opens the kit search instead.
  if (wantSearch) { var sl = hdr.querySelectorAll('a[href],button'); for (var o2 = 0; o2 < sl.length; o2++) { var e2 = sl[o2], tx = (e2.textContent || '').replace(/[^a-z]/gi, '').toLowerCase(), hp = ''; try { hp = e2.href ? new URL(e2.href, location.href).pathname : ''; } catch (x) {} if (vis(e2) && (tx === 'search' || /^\/search\/?$/.test(hp))) { e2.setAttribute('data-ak-search-take', ''); bindTake(e2); wantSearch = false; out.took = true; } } }
  if (row && logo && (wantSearch || shop)) {
    var phone = innerWidth <= PH;
    var g = d.createElement('div'); g.className = 'ak-hb'; g.setAttribute('role', 'group'); g.setAttribute('aria-label', 'Site tools');
    var shopEl = null;
    if (shop && shop.href && (phone || cfg.shopDesktop)) {
      shopEl = d.createElement('a'); shopEl.href = shop.href; shopEl.className = 'ak-hb-shop'; shopEl.setAttribute('data-event-from', 'kit-header-shop');
      shopEl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span></span>';
      shopEl.lastChild.textContent = shop.label || 'Shop'; g.appendChild(shopEl);
    }
    if (wantSearch) {
      var sb = d.createElement('button'); sb.type = 'button'; sb.className = 'ak-hb-search'; sb.setAttribute('data-ak-search-open', ''); sb.setAttribute('aria-label', 'Search this site');
      sb.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><span class="ak-hb-sl">Search</span><kbd class="ak-hb-sl" aria-hidden="true">/</kbd>';
      if (cfg.late) sb.addEventListener('click', function () { openS(''); });
      g.appendChild(sb);
    }
    if (!phone) g.classList.add('ak-hb-wide');
    if (getComputedStyle(row).position === 'static') row.classList.add('ak-hb-row');
    row.appendChild(g);
    var hidden = [];
    function place() {
      for (var h = 0; h < hidden.length; h++) hidden[h].classList.remove('ak-hb-hide');
      hidden = [];
      var rr = row.getBoundingClientRect(), lr = logo.getBoundingClientRect(), cy = lr.top + lr.height / 2, pr = parseFloat(getComputedStyle(row).paddingRight) || 0;
      var edge = rr.right - pr, ph = innerWidth <= PH, IA = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|DETAILS|LABEL)$/;
      // never below the row: a second header row (nav links, a search row) starts where the logo row ends
      g.style.top = Math.round(Math.max(0, Math.min(cy - rr.top - 22, rr.height - 44))) + 'px';
      var all = hdr.querySelectorAll('*');
      for (var pass = 0; pass < 24; pass++) {
        g.style.right = Math.round(rr.right - edge) + 'px';
        var gr = g.getBoundingClientRect(), hit = null, soft = [];
        if (gr.left < lr.right + 8 || gr.left < rr.left) break;
        for (var n = 0; n < all.length; n++) {
          var b = all[n]; if (g.contains(b) || b.contains(g) || b === logo || logo.contains(b) || !vis(b)) continue;
          var ia = IA.test(b.tagName) || b.getAttribute('role') === 'button';
          if (!ia && !(b.textContent || '').trim() && !/^(IMG|SVG|PICTURE|VIDEO|CANVAS|IFRAME)$/i.test(b.tagName)) { var bs = getComputedStyle(b); if (/rgba\(0, 0, 0, 0\)|transparent/.test(bs.backgroundColor) && bs.backgroundImage === 'none' && !parseFloat(bs.borderTopWidth) && !parseFloat(bs.borderLeftWidth)) continue; }
          if (!ia && [].some.call(b.children, function (k) { return vis(k); })) continue; // leaves and controls only
          var br = b.getBoundingClientRect();
          if (!(br.right > gr.left && br.left < gr.right && br.bottom > gr.top && br.top < gr.bottom)) continue;
          if (ia || b.closest('a,button,label,summary') || !ph) { if (!hit || br.left < hit.left) hit = br; } else soft.push(b);
        }
        if (!hit) {
          if (ph) soft.forEach(function (e) { e.classList.add('ak-hb-hide'); hidden.push(e); });
          (cfg.hide || []).forEach(function (sl) { var e = ph && q(sl, hdr); if (e) { e.classList.add('ak-hb-hide'); hidden.push(e); } });
          return true;
        }
        edge = hit.left - 8;
      }
      if (g.classList.contains('ak-hb-wide')) { g.classList.remove('ak-hb-wide'); return place(); }
      if (shopEl && shopEl.parentNode) { g.removeChild(shopEl); shopEl = null; return place(); }
      return false;
    }
    if (place()) { out.placed = true; var t0 = 0; W.addEventListener('resize', function () { clearTimeout(t0); t0 = setTimeout(function () { if (!place()) g.style.display = 'none'; else g.style.display = ''; }, 120); }); if (d.fonts && d.fonts.ready) d.fonts.ready.then(place); }
    else { row.removeChild(g); row.classList.remove('ak-hb-row'); }
  }
  // ---- reveal on scroll-up ----
  if (cfg.reveal !== false) {
    var cs = getComputedStyle(hdr), pos = cs.position;
    if (pos === 'static' || pos === 'relative') {
      hdr.classList.add('ak-hb-sticky');
      if (!cs.zIndex || cs.zIndex === 'auto') hdr.style.zIndex = String(cfg.z || 1000);
      var CLEAR = /rgba\(0, 0, 0, 0\)|transparent/;
      if (CLEAR.test(cs.backgroundColor)) { var bg = getComputedStyle(d.body).backgroundColor; if (CLEAR.test(bg)) bg = getComputedStyle(d.documentElement).backgroundColor; hdr.style.backgroundColor = CLEAR.test(bg) ? '#fff' : bg; }
    }
    var stickyOk = getComputedStyle(hdr).position === 'sticky' || getComputedStyle(hdr).position === 'fixed';
    if (stickyOk) {
      out.sticky = true;
      hdr.classList.add('ak-hb-anim');
      var last = scrollY, up = false, checked = false, H = hdr.getBoundingClientRect().height, start = hdr.getBoundingClientRect().top + scrollY, raf = 0;
      function busy() { return hdr.contains(d.activeElement) && d.activeElement !== d.body || [].some.call(hdr.querySelectorAll('[aria-expanded=true],details[open]'), function (x) { return vis(x) && (x.tagName !== 'DETAILS' || [].some.call(x.children, function (k) { return k.tagName !== 'SUMMARY' && vis(k); })); }) || !!d.querySelector('dialog.ak-s-dlg[open]'); }
      function tick() {
        raf = 0; var y = scrollY, dy = y - last;
        if (!checked && y > start + H * 2) { checked = true; var top = hdr.getBoundingClientRect().top; if (top < -2 && !hdr.classList.contains('ak-hb-up')) { hdr.classList.remove('ak-hb-sticky', 'ak-hb-anim', 'ak-hb-up'); W.removeEventListener('scroll', on); out.sticky = false; return; } }
        if (d.documentElement.scrollHeight < innerHeight * 2 || y <= start + H) { if (up) { hdr.classList.remove('ak-hb-up'); up = false; } }
        else if (dy > 6 && !up && !busy()) { hdr.classList.add('ak-hb-up'); up = true; }
        else if (dy < -6 && up) { hdr.classList.remove('ak-hb-up'); up = false; }
        if (Math.abs(dy) > 6) last = y;
      }
      function on() { if (!raf) raf = requestAnimationFrame(tick); }
      W.addEventListener('scroll', on, { passive: true });
      hdr.addEventListener('focusin', function () { if (up) { hdr.classList.remove('ak-hb-up'); up = false; } });
    }
  }
  return out;
}

// For the search launcher: the code (verbatim) + a call. cfg goes in as JSON.
export function headerScript(cfg = {}) {
  if (cfg.shop && cfg.shop.href && !/^\/(?!\/)/.test(cfg.shop.href)) throw new Error('Amili Kit header: shop.href must be a same-site path');
  return akHeader.toString();
}
export const HEADER_JS_FN = akHeader.toString();
export { akHeader };
export default { name: 'header', title: 'Header bar (search, Shop, reveal on scroll-up)', render: () => '', css: HEADER_CSS, js: HEADER_JS_FN };
