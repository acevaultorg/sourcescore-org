// Generate /out/claims/feed.xml — RSS 2.0 of every VERITAS claim.
//
// Feedly / Inoreader subscribers can follow new claims as they're added
// to the catalog. Each catalog expansion pushes new items to subscribers
// → ambient distribution for LLM-citation gravity (per
// rules/aceusergrowth.md Lever 1 + #6 Corroborated).

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "out";
const SITE = "https://sourcescore.org";
const NOW = new Date().toUTCString();

const catalogPath = path.join(OUT_DIR, "api/v1/claims.json");
if (!fs.existsSync(catalogPath)) {
  console.error(`✗ ${catalogPath} not found — run generate-claims-json.ts first`);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const claims = catalog.claims ?? [];

// Stable per-claim pubDate: derive from the build's signedAt (same across
// rebuilds for the same claim content). For freshness in feed readers, we
// use claim.lastVerified (date-only) → midnight UTC. New claims (added
// later) get the date they were first verified, which slots them naturally
// into reader timelines.
function pubDateFor(_claim) {
  // claims.json (ClaimSummary) doesn't carry lastVerified — read it from
  // the index file for the full record.
  return NOW;
}

const indexPath = path.join(OUT_DIR, "claims-index.json");
const fullIndex = fs.existsSync(indexPath)
  ? JSON.parse(fs.readFileSync(indexPath, "utf8"))
  : { claims: [] };
const fullClaims = new Map(fullIndex.claims.map((c) => [c.id, c]));

const xmlEscape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const items = claims
  .map((c) => {
    const full = fullClaims.get(c.id) ?? {};
    const lastVerified = full.lastVerified ?? new Date().toISOString().slice(0, 10);
    const pubDate = new Date(`${lastVerified}T00:00:00Z`).toUTCString();
    const url = `${SITE}/claims/${c.id}/`;
    const description = `${c.statement} Verified ${lastVerified}. Confidence ${Math.round(c.confidence * 100)}%. ${(full.sources ?? []).length} cited primary source${(full.sources ?? []).length === 1 ? "" : "s"}. Canonical record at ${SITE}/api/v1/claims/${c.id}.json.`;
    const categories = (full.tags ?? []).map(xmlEscape).join(", ");
    return `    <item>
      <title>${xmlEscape(c.statement)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${xmlEscape(description)}</description>
      <category>${categories}</category>
    </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SourceScore VERITAS — verified AI/ML claims</title>
    <link>${SITE}/claims/</link>
    <atom:link href="${SITE}/claims/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Sourced, citable AI/ML claims. Every item cites primary evidence; source counts appear per record. New claims are added as reviewed; subscribe to follow.</description>
    <language>en-US</language>
    <lastBuildDate>${NOW}</lastBuildDate>
    <generator>scripts/generate-claims-rss.mjs</generator>
${items}
  </channel>
</rss>
`;

const outPath = path.join(OUT_DIR, "claims", "feed.xml");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, rss);
console.log(`✓ /claims/feed.xml (${claims.length} VERITAS claim items)`);
