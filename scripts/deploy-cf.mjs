#!/usr/bin/env node
/**
 * Deploy out/ to Cloudflare Pages (project: sourcescore) — robust wrapper.
 *
 * Fixes two recurring deploy blockers (see rules/cloudflare-pages-epipe.md +
 * project DECISIONS.md 2026-05-28):
 *
 *  1. AUTH — the shell often has a stale/insufficient CLOUDFLARE_API_TOKEN that
 *     overrides wrangler's valid OAuth login → "Authentication error [10000]".
 *     We unset it (+ CLOUDFLARE_PAGES_API_TOKEN) so wrangler uses OAuth.
 *
 *  2. INTERMITTENT UPLOAD FAILURES — during a CF Pages "upload failures"
 *     incident the upload aborts mid-stream. wrangler uploads are INCREMENTAL
 *     (already-uploaded files are hashed + skipped), so each retry resumes and
 *     makes progress. We retry up to MAX_ATTEMPTS with a short backoff.
 *
 * Deploys the EXISTING out/ — caller is responsible for building it first
 * (npm run deploy does clean+build before invoking this).
 */
import { spawnSync } from "node:child_process";

const PROJECT = "sourcescore";
const MAX_ATTEMPTS = 5;
const BACKOFF_S = 8;

// Synchronous sleep (keeps the script linear + readable).
const sleep = (s) =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, s * 1000);

// Force OAuth: strip env tokens that would otherwise shadow the login.
const env = { ...process.env };
delete env.CLOUDFLARE_API_TOKEN;
delete env.CLOUDFLARE_PAGES_API_TOKEN;

const args = [
  "wrangler", "pages", "deploy", "out",
  "--project-name", PROJECT,
  "--branch", "main",
  "--commit-message", process.env.DEPLOY_MSG || "deploy: brain wrangler push",
];

let ok = false;
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  console.log(`\n→ Cloudflare Pages deploy — attempt ${attempt}/${MAX_ATTEMPTS}`);
  const r = spawnSync("npx", args, { stdio: "inherit", env });
  if (r.status === 0) { ok = true; break; }
  if (attempt < MAX_ATTEMPTS) {
    console.warn(
      `✗ attempt ${attempt} failed (exit ${r.status}). CF Pages upload ` +
      `incidents are intermittent + uploads are incremental — retrying in ${BACKOFF_S}s…`
    );
    sleep(BACKOFF_S);
  }
}

if (!ok) {
  console.error(
    `\n✘ Deploy failed after ${MAX_ATTEMPTS} attempts. Likely an active ` +
    `Cloudflare Pages upload incident — check https://www.cloudflarestatus.com\n` +
    `   out/ is built + valid; re-run \`npm run deploy\` once Pages is operational.`
  );
  process.exit(1);
}

console.log("\n✓ Cloudflare Pages deploy complete.");
