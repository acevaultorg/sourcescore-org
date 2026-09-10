#!/usr/bin/env node
// predeploy-guard — block deploy if generators haven't run.
//
// Cause this exists: 2026-05-12 CI investigation found that ad_hoc deploys
// were overwriting working CI deployments with stale out/ directories missing
// generator artifacts (sitemap.xml, llms.txt, sitemap-ai.xml). CI itself is
// fine — manual `wrangler pages deploy out` calls without `npm run build`
// first were the culprit. This guard forces fresh build before deploy.
//
// Wire-up: invoked as predeploy + as part of CI deploy step + as a safety
// check in any future deploy automation.

import { existsSync, statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const required = [
  "out/index.html",
  "out/sitemap.xml",
  "out/sitemap-ai.xml",
  "out/llms.txt",
  "out/robots.txt",
];

const missing = required.filter((p) => !existsSync(resolve(root, p)));

if (missing.length > 0) {
  console.error("❌ predeploy-guard: deploy blocked — out/ is missing generator artifacts:");
  for (const p of missing) console.error(`   - ${p}`);
  console.error("");
  console.error("Fix: run `npm run build` first (which runs postbuild generators), then retry deploy.");
  console.error("Or use `npm run deploy` which does clean → build → wrangler → indexnow as one chain.");
  process.exit(1);
}

// Also check freshness — out/ should be no more than 24h old to avoid stale deploys
const indexMtime = statSync(resolve(root, "out/index.html")).mtimeMs;
const ageHours = (Date.now() - indexMtime) / 3600_000;
if (ageHours > 24) {
  console.error(`⚠️  predeploy-guard: out/ is ${ageHours.toFixed(1)}h old — likely stale.`);
  console.error("Fix: run `npm run build` to refresh, then retry deploy.");
  process.exit(1);
}

// ── Signature-integrity check (added 2026-06-19) ─────────────────────────────
// Cause: on 2026-06-03 a local `wrangler pages deploy out` (a dev env WITHOUT
// SOURCESCORE_SIGNING_SECRET) signed the VERITAS catalog with the PUBLIC
// dev-fallback secret and uploaded it — voiding the signed-claims integrity
// guarantee for ~16 days (caught 2026-06-19). Docs ("never local-deploy") did
// not prevent it; this gives the guard TEETH.
//
// A dev-fallback build signs EVERY claim with the public dev secret, so
// claims[0] — the immutable "Transformer architecture" anchor (NEVER edited) —
// is a perfect proxy for the whole catalog's signing state:
//   • production-signed short-sig = cfdd0b49
//   • dev-fallback  short-sig     = 3e28e071  (= HMAC of the public dev secret)
// If the built catalog's claims[0] == the dev-fallback sig, the build was NOT
// production-signed → refuse to deploy. Prod-rotation-robust: if the production
// secret is ever rotated, claims[0] becomes some OTHER value still != the dev
// sig, so the guard keeps passing on legitimate CI builds.
const DEV_FALLBACK_CLAIMS0_SIG = "3e28e071";
const claimsCatalogPath = resolve(root, "out/api/v1/claims.json");
if (existsSync(claimsCatalogPath)) {
  const c0 = (JSON.parse(readFileSync(claimsCatalogPath, "utf8")).claims || [])[0];
  if (!c0) {
    console.error("❌ predeploy-guard: deploy blocked — out/api/v1/claims.json has no claims[0] (signed catalog missing/empty).");
    process.exit(1);
  }
  if (c0.subject !== "Transformer architecture") {
    console.error(`❌ predeploy-guard: deploy blocked — claims[0].subject is "${c0.subject}", expected "Transformer architecture".`);
    console.error("   The catalog order/anchor changed; the signature-integrity check relies on claims[0] being the immutable Transformer anchor. Review before deploy.");
    process.exit(1);
  }
  if (c0.signatureShort === DEV_FALLBACK_CLAIMS0_SIG) {
    console.error("❌ predeploy-guard: deploy blocked — REFUSING to deploy a DEV-FALLBACK-SIGNED catalog.");
    console.error(`   claims[0].signatureShort == ${DEV_FALLBACK_CLAIMS0_SIG} (the PUBLIC dev-fallback secret's signature).`);
    console.error("   SOURCESCORE_SIGNING_SECRET was unset/wrong at build time → the signed-claims integrity guarantee would be VOID.");
    console.error("   Deploy ONLY via `git push origin main` → GitLab CI (which holds the production secret).");
    console.error("   NEVER `npm run deploy` / `wrangler pages deploy out` locally — that is exactly what corrupted the catalog on 2026-06-03.");
    process.exit(1);
  }
  console.log(`✓ predeploy-guard: catalog is production-signed (claims[0] sig ${c0.signatureShort} != dev-fallback ${DEV_FALLBACK_CLAIMS0_SIG}).`);
} else {
  console.error("❌ predeploy-guard: deploy blocked — out/api/v1/claims.json missing (signed catalog not generated).");
  process.exit(1);
}

// ── Affiliate-link integrity ──────────────────────────────────────────────
// Same failure shape as the dev-fallback-signature check above, and it nearly
// shipped on 2026-08-11: the NEXT_PUBLIC_AFF_* values live ONLY in
// .gitlab-ci.yml, so a local `npm run deploy` (clean → build → wrangler) builds
// them as empty strings. lib/partners.ts then filters those slots out silently,
// the build succeeds, and every affiliate link on 131 pages disappears. Nothing
// is broken-looking; the site just stops earning.
//
// It was already half-realised when this guard was written — out/ carried 131
// RankScale links and 0 Mangools, because the tree predated the Mangools slot.
//
// So: out/ must contain EVERY live program, each with its full tracking ID.
//
// Note the first draft of this guard only failed on a PARTIAL set and waved
// through zero-across-the-board as "a legitimately unmonetized build". That is
// precisely backwards: a local build produces ZERO, not a partial set, so the
// lenient branch would have permitted the exact deploy this guard exists to
// stop. This site has live programs — zero is never legitimate here. If a
// program is ever genuinely retired, delete its row below in the same commit
// that removes its .gitlab-ci.yml var.
{
  const PROGRAMS = [
    { name: "RankScale", needle: "https://rankscale.ai?via=paulo" },
    // The referral ID is a URL fragment. dotenv eats an unquoted '#' as a
    // comment, which is exactly how citationdesk shipped this link stripped on
    // 2026-08-11 — so assert on the ID, never on the bare domain.
    { name: "Mangools", needle: "a6a7b136b6aee0841ae53d49e" },
  ];

  // /sources/ is the affiliate hub — the one page guaranteed to carry every
  // active program. Cheaper and more reliable than walking all 131 pages.
  const hub = resolve(root, "out/sources/index.html");
  if (existsSync(hub)) {
    const html = readFileSync(hub, "utf8");
    const absent = PROGRAMS.filter((p) => !html.includes(p.needle));

    if (absent.length > 0) {
      console.error("❌ predeploy-guard: deploy blocked — affiliate links MISSING from out/.");
      console.error(`   missing: ${absent.map((p) => p.name).join(", ")}`);
      console.error(`   present: ${PROGRAMS.filter((p) => html.includes(p.needle)).map((p) => p.name).join(", ") || "(none)"}`);
      console.error("");
      console.error("   This is the silent-$0 build: the NEXT_PUBLIC_AFF_* vars were empty at build time, so");
      console.error("   lib/partners.ts dropped those slots. The pages render perfectly and earn nothing.");
      console.error("   Those vars live in .gitlab-ci.yml and CANNOT reach a local build.");
      console.error("");
      console.error("   Deploy via `git push origin main` → GitLab CI. Do NOT `npm run deploy` locally.");
      console.error("   Shipping this out/ would zero the affiliate links on all 131 live pages.");
      process.exit(1);
    }
    console.log(`✓ predeploy-guard: all ${PROGRAMS.length} affiliate programs intact in out/ (${PROGRAMS.map((p) => p.name).join(", ")}).`);
  }
}

// ── Analytics-tag guard (2026-09-10, fleet port of askedwell ab43f30) ─────────
// deploy-truth.md § "a detached worktree builds tracked code but drops UNTRACKED
// env files": a worktree/CI checkout without the gitignored env file builds a
// perfectly normal out/ whose <head> carries NO GA4 and NO Clarity, deploys with
// exit 0, and the tracker only notices days later. Measured 2026-09-10 on
// askedwell.com (deploy 080855fa shipped untagged). This block resolves each tag
// ID the way the layout does (process.env -> env files -> hardcoded fallback) and
// refuses to deploy unless the BUILT index.html carries every resolved ID.
import { readFileSync as __rfTag, existsSync as __exTag } from "node:fs";
import { resolve as __rsTag } from "node:path";
{
  const root = __rsTag(process.cwd());
  const ENV_FILES = [".env.local", ".env.production"];
  const TAGS = [["GA4", "NEXT_PUBLIC_GA4_ID", "G-WZ82M72J06"], ["Clarity", "NEXT_PUBLIC_CLARITY_PROJECT_ID", null]]; // [name, envKey, fallback]
  const fileEnv = {};
  for (const f of ENV_FILES) {
    const p = __rsTag(root, f);
    if (!__exTag(p)) continue;
    for (const l of __rfTag(p, "utf8").split("\n")) {
      if (!/^[A-Z0-9_]+=/.test(l)) continue;
      const i = l.indexOf("=");
      const k = l.slice(0, i);
      if (!(k in fileEnv)) fileEnv[k] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  const idx = __rsTag(root, "out/index.html");
  if (!__exTag(idx)) {
    console.error("❌ predeploy-guard: analytics check — out/index.html missing; run the build first.");
    process.exit(1);
  }
  const html = __rfTag(idx, "utf8");
  const missingEnv = ENV_FILES.filter((f) => !__exTag(__rsTag(root, f)));
  const lost = [];
  for (const [name, key, fallback] of TAGS) {
    const id = (process.env[key] || fileEnv[key] || fallback || "").trim();
    if (!id) {
      console.error(`❌ predeploy-guard: deploy blocked — ${name} ID unresolvable (${key} not in process.env, not in ${ENV_FILES.join(" / ")}, no fallback).`);
      if (missingEnv.length) console.error(`   Missing env file(s) in this checkout: ${missingEnv.join(", ")} — a detached worktree / fresh clone drops untracked env files.`);
      console.error(`   Fix: copy the env file from the main checkout, rebuild, retry. Never deploy an untagged site.`);
      process.exit(1);
    }
    if (!html.includes(id)) lost.push(`${name} ${key}=${id}`);
  }
  if (lost.length) {
    console.error("❌ predeploy-guard: deploy blocked — built out/index.html does not carry the analytics IDs the layout should emit:");
    for (const l of lost) console.error(`   - ${l}`);
    if (missingEnv.length) console.error(`   Missing env file(s) in this checkout: ${missingEnv.join(", ")} — the build ran without them.`);
    console.error("   Fix: ensure the env file is present, run the build again, retry deploy.");
    process.exit(1);
  }
  console.log(`✓ predeploy-guard: analytics tags present in out/index.html (${TAGS.map(([n, k, fb]) => n + "=" + (process.env[k] || fileEnv[k] || fb)).join(", ")})`);
}

console.log(`✓ predeploy-guard: out/ has all required artifacts (${required.length} checked, age ${ageHours.toFixed(1)}h)`);
