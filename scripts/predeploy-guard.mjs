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

console.log(`✓ predeploy-guard: out/ has all required artifacts (${required.length} checked, age ${ageHours.toFixed(1)}h)`);
