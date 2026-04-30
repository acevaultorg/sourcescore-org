#!/usr/bin/env node
/**
 * IndexNow — ping search engines on every deploy (per acquisition-engine I-33).
 * Uses a static key file at /<KEY>.txt for verification.
 *
 * Key resolution order:
 *   1. INDEXNOW_KEY env var (override; useful for rotation or testing)
 *   2. Auto-detect from out/<KEY>.txt (the verification file shipped in the
 *      build — its filename IS the key, that's the IndexNow protocol)
 *
 * Auto-detect means deploys ping IndexNow even if the env var was never set
 * on the build host (the failure mode caught 2026-04-30: 27 prior deploys
 * silently skipped IndexNow because INDEXNOW_KEY was unset on Cloudflare
 * Pages env). The verification key file already has to be in /public for
 * IndexNow to validate ownership, so reusing it as the source of truth
 * removes the env-var dependency entirely.
 */
import { readFileSync, readdirSync } from "node:fs";

let KEY = process.env.INDEXNOW_KEY;
if (!KEY) {
  try {
    const candidates = readdirSync("out").filter((f) =>
      /^[0-9a-f]{32,128}\.txt$/.test(f)
    );
    if (candidates.length === 1) {
      const filenameKey = candidates[0].replace(/\.txt$/, "");
      const content = readFileSync(`out/${candidates[0]}`, "utf8").trim();
      if (content === filenameKey) {
        KEY = filenameKey;
        console.log(`ℹ IndexNow key auto-detected from out/${candidates[0]}.`);
      } else {
        console.error(
          `⚠ IndexNow key file content does not match filename — refusing to ping.`
        );
        process.exit(0);
      }
    } else if (candidates.length > 1) {
      console.error(
        `⚠ Multiple IndexNow-shaped key files in out/ (${candidates.length}). Set INDEXNOW_KEY explicitly to disambiguate.`
      );
      process.exit(0);
    }
  } catch {
    /* out/ missing — fall through to skip below */
  }
}
if (!KEY) {
  console.log("ℹ INDEXNOW_KEY unset + no key file in out/ — skipping IndexNow ping (non-fatal).");
  process.exit(0);
}

const SITE = "sourcescore.org";

let urls = [];
try {
  const xml = readFileSync("out/sitemap.xml", "utf8");
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} catch (e) {
  console.error("⚠ Could not read out/sitemap.xml — run npm run build first.");
  process.exit(1);
}

const body = {
  host: SITE,
  key: KEY,
  keyLocation: `https://${SITE}/${KEY}.txt`,
  urlList: urls,
};

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  if (res.ok || res.status === 202) {
    console.log(`✓ IndexNow ping submitted for ${urls.length} URLs (${res.status}).`);
  } else {
    console.error(`⚠ IndexNow returned ${res.status}: ${await res.text()}`);
  }
} catch (e) {
  console.error("⚠ IndexNow ping failed (non-fatal):", e.message);
}
