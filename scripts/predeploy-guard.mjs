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

import { existsSync, statSync } from "node:fs";
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

console.log(`✓ predeploy-guard: out/ has all required artifacts (${required.length} checked, age ${ageHours.toFixed(1)}h)`);
