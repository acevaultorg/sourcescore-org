#!/usr/bin/env node
/**
 * IndexNow — ping search engines on every deploy (per acquisition-engine I-33).
 * Uses a static key file at /<KEY>.txt for verification.
 *
 * Set INDEXNOW_KEY env var to your generated key (32-128 hex chars).
 * If unset, this script no-ops cleanly so non-deploy builds don't fail.
 */
import { readFileSync } from "node:fs";

const KEY = process.env.INDEXNOW_KEY;
if (!KEY) {
  console.log("ℹ INDEXNOW_KEY not set — skipping IndexNow ping (non-fatal).");
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
