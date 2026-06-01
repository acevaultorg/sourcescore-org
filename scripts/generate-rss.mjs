// Generate /out/feed.xml (RSS 2.0) for /blog/ posts.
//
// Post list is the single source of truth at data/blog-posts.json — the same
// catalog app/blog/page.tsx renders. Previously this script kept its own
// hardcoded array and drifted (feed lagged at 4 of 8 posts); reading the shared
// file keeps /feed.xml in lock-step with the blog index automatically.
//
// Run from postbuild. Pattern: matches scripts/generate-sitemap.mjs.

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "out";
const SITE = "https://sourcescore.org";
const TODAY = new Date().toUTCString();

const POSTS = JSON.parse(fs.readFileSync("data/blog-posts.json", "utf8"));

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
