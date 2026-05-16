// Generate /out/feed.xml (RSS 2.0) for /blog/ posts.
//
// Run from postbuild. Hardcoded post list for v0 (1 post); when operator
// adds post #2, extend POSTS array OR refactor to read from a JSON
// catalog emitted by the blog page generator.
//
// Pattern: matches scripts/generate-sitemap.mjs (postbuild, writes to /out/).

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "out";
const SITE = "https://sourcescore.org";
const TODAY = new Date().toUTCString();

const POSTS = [
  {
    slug: "launching-veritas",
    title:
      "Stop hallucinating: a developer API for grounding LLM responses with signed, sourced claims",
    summary:
      "VERITAS is a free-tier-friendly API that returns hand-verified AI/ML claims with their primary sources, an HMAC-SHA256 signature, and a ready-to-paste citation. 51 claims at launch, expanding to 5,000+ this year.",
    publishedDate: "2026-05-16T00:00:00Z",
    tags: ["launch", "veritas", "api", "llm-grounding"],
  },
];

const xmlEscape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const items = POSTS.map((p) => {
  const url = `${SITE}/blog/${p.slug}/`;
  const pubDate = new Date(p.publishedDate).toUTCString();
  return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${xmlEscape(p.summary)}</description>
      <category>${p.tags.map(xmlEscape).join(", ")}</category>
    </item>`;
}).join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SourceScore Blog</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Posts on AI-citation quality, LLM grounding, and the SourceScore methodology.</description>
    <language>en-US</language>
    <lastBuildDate>${TODAY}</lastBuildDate>
    <generator>scripts/generate-rss.mjs</generator>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(OUT_DIR, "feed.xml"), rss);
console.log(`✓ feed.xml (${POSTS.length} blog post${POSTS.length === 1 ? "" : "s"})`);
