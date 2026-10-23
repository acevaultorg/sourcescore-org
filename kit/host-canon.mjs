// VENDORED Amili Kit v1.17.2 (host-canon.mjs sha256 94e8c90c0321) from VAULT-Fleet/tooling/fleet-kit/host-canon/host-canon.mjs — do not edit here; re-run sync.sh.
// Amili Kit host-canon (1.16.6, card mu5o5b5qoxm2z8): the bare <project>.pages.dev host answers 301 to the site's own
// custom domain, path and query kept. Measured 2026-09-17: 55 of 59 fleet Pages projects served the whole site, 200 and
// indexable, on <project>.pages.dev too; that traffic is outside the zone, so zone analytics (the /go/ 302 counts) cannot see it.
//
// Build-output step, run by consent/inject.mjs (which every registered site already runs in its own deploy path). It patches
// <out>/_worker.js ONLY; it never creates one (a _worker.js in a Pages output overrides functions/, so creating it would switch
// a Functions site's gate off). Sites without _worker.js are reported "no-worker" and stay uncovered.
//   - Only the BARE host matches (/^[a-z0-9-]+\.pages\.dev$/): preview hosts <hash>.<project>.pages.dev keep working.
//   - The target host is the site's own declared canonical (<link rel="canonical"> on <out>/index.html), never a guess;
//     no https canonical, or one on pages.dev, means "no-canonical" and nothing is patched.
//   - Idempotent (marker). Exactly one `export default` or nothing is patched ("unknown-shape").
//   - Self-test after patching: the patched worker is imported in a child node; the bare host must 301 to the canonical
//     with the path + query, and the default export must still have fetch. A failure RESTORES the original file and
//     returns ok:false, so the caller can stop the deploy (fail closed).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const MARK = '/* ak-host-canon */';
export const BARE = /^[a-z0-9-]+\.pages\.dev$/i;

export function canonicalOrigin(indexHtml) {
  const tag = (indexHtml.match(/<link\b[^>]*\brel=["']?canonical["']?[^>]*>/i) || [])[0];
  const href = tag && (tag.match(/\bhref=["']([^"']+)["']/i) || [])[1];
  if (!href) return '';
  let u; try { u = new URL(href); } catch { return ''; }
  if (u.protocol !== 'https:' || /\.pages\.dev$/i.test(u.hostname) || /\.workers\.dev$/i.test(u.hostname)) return '';
  return u.origin;
}

// The wrapper is plain JS appended to the worker; __akHcOrigin is the only per-site value.
export function wrapperSource(origin) {
  return `\n${MARK}\nconst __akHcOrigin = ${JSON.stringify(origin)};\n`
    + 'const __akHcWrap = (w) => ({ ...w, async fetch(request, env, ctx) {\n'
    + '  try { const u = new URL(request.url); if (/^[a-z0-9-]+\\.pages\\.dev$/i.test(u.hostname)) return new Response(null, { status: 301, headers: { location: __akHcOrigin + u.pathname + u.search, "cache-control": "public, max-age=3600" } }); } catch (e) {}\n'
    + '  return w.fetch.call(w, request, env, ctx);\n'
    + '} });\n'
    + 'export default __akHcWrap(__akHcInner);\n';
}

export function patchSource(src, origin) {
  if (src.includes(MARK)) return { src, status: 'already' };
  const hits = src.match(/^export default /gm) || [];
  if (hits.length !== 1) return { src, status: 'unknown-shape' };
  // A default-exported function or class has no .fetch to wrap: leave it alone.
  if (/^export default\s+(async\s+)?(function|class)\b/m.test(src)) return { src, status: 'unknown-shape' };
  return { src: src.replace(/^export default /m, 'const __akHcInner = ') + wrapperSource(origin), status: 'patched' };
}

// Child-process check of the PATCHED file: bare host -> 301 Location origin+path+query; default export keeps fetch.
export function selfTest(file, origin) {
  const code = `const m = await import(${JSON.stringify('file://' + file + '?t=' + Date.now())});
const w = m.default; if (!w || typeof w.fetch !== 'function') { console.log('NOFETCH'); process.exit(1); }
const r = await w.fetch(new Request('https://some-project.pages.dev/a/b?x=1&y=2'), {}, { waitUntil() {}, passThroughOnException() {} });
const want = ${JSON.stringify(origin)} + '/a/b?x=1&y=2';
console.log(r.status === 301 && r.headers.get('location') === want ? 'OK' : 'BAD ' + r.status + ' ' + r.headers.get('location'));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8', timeout: 30000 });
  const line = String(r.stdout || '').trim().split('\n').pop() || String(r.stderr || '').trim().split('\n')[0] || 'no output';
  return r.status === 0 && line === 'OK' ? '' : line.slice(0, 200);
}

export function hostCanon(out) {
  const w = path.join(out, '_worker.js');
  if (!fs.existsSync(w) || !fs.statSync(w).isFile()) return { ok: true, status: 'no-worker' };
  const idx = path.join(out, 'index.html');
  const origin = fs.existsSync(idx) ? canonicalOrigin(fs.readFileSync(idx, 'utf8')) : '';
  if (!origin) return { ok: true, status: 'no-canonical' };
  const src = fs.readFileSync(w, 'utf8');
  const p = patchSource(src, origin);
  if (p.status !== 'patched') return { ok: true, status: p.status, origin };
  fs.writeFileSync(w, p.src);
  const why = selfTest(w, origin);
  if (why) { fs.writeFileSync(w, src); return { ok: false, status: 'self-test-failed', origin, why }; }
  return { ok: true, status: 'patched', origin };
}
