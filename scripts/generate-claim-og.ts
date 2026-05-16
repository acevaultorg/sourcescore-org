#!/usr/bin/env tsx
/**
 * Postbuild — generate per-claim OG SVG images at /out/og/claim/<id>.svg.
 *
 * Layer 5 archetype `share_card_per_result × +95` (per
 * rules/aceusergrowth.md Lever 1). When a claim URL is pasted to Twitter,
 * LinkedIn, Slack, Discord, Notion, etc., the platform's link preview
 * renders the OG image → visual share = higher click-through.
 *
 * Style mirrors scripts/generate-og-images.ts (same BG_GRADIENT + BRAND_MARK)
 * for visual brand consistency across products. Output: 1200x630 SVG,
 * one per claim, no PNG (most platforms accept SVG for OG; Twitter/X
 * specifically prefers PNG but falls back to /og.svg if SVG rejected).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { loadFullClaims } from "../lib/claims-build";

const OUT_DIR = "out";
const OG_CLAIM_DIR = join(OUT_DIR, "og", "claim");
mkdirSync(OG_CLAIM_DIR, { recursive: true });

const FONT = `font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"`;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Wrap a long string into N lines of at-most maxLineChars each.
 *  Returns SVG <tspan>s offset by `lineHeight` from the first line baseline.
 *  Designed for the statement field which can be up to ~140 chars at v0. */
function wrap(text: string, maxLineChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if (lines.length === maxLines - 1 && (current + " " + w).length > maxLineChars) {
      // Last line — let it overflow visually if needed (truncate with ellipsis)
      const remaining = words.slice(words.indexOf(w)).join(" ");
      const truncated =
        remaining.length > maxLineChars
          ? remaining.slice(0, maxLineChars - 1).trimEnd() + "…"
          : remaining;
      if (current) lines.push(current);
      lines.push(truncated);
      return lines;
    }
    const candidate = current ? current + " " + w : w;
    if (candidate.length > maxLineChars) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const BG = `
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="100%" stop-color="#141420"/>
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g stroke="#262638" stroke-width="0.5" opacity="0.4">
    <line x1="0" y1="157" x2="1200" y2="157"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="472" x2="1200" y2="472"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
  </g>
`;

const BRAND_MARK = `
  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="48" height="48" rx="10" fill="rgba(129,140,248,0.12)" stroke="#818cf8" stroke-width="1.5" stroke-opacity="0.4"/>
    <text x="24" y="35" ${FONT} font-size="28" font-weight="700" fill="#818cf8" text-anchor="middle">★</text>
  </g>
  <text x="144" y="105" ${FONT} font-size="22" font-weight="600" fill="#e5e7ee">SourceScore</text>
  <text x="144" y="128" ${FONT} font-size="14" fill="#a78bfa" letter-spacing="2">VERITAS · v0.1</text>
`;

function claimOg(c: Awaited<ReturnType<typeof loadFullClaims>>[number]): string {
  const confidencePct = Math.round(c.confidence * 100);
  const topSource = c.sources[0];
  const statementLines = wrap(c.statement, 42, 3);

  // Render statement tspans on a fixed baseline.
  const lineY = 280;
  const lineH = 68;
  const tspans = statementLines
    .map(
      (line, i) =>
        `    <text x="80" y="${lineY + i * lineH}" ${FONT} font-size="56" font-weight="700" fill="#e5e7ee" letter-spacing="-1">${esc(line)}</text>`,
    )
    .join("\n");

  const sourceLine = topSource
    ? `<text x="80" y="540" ${FONT} font-size="16" fill="#7a8198">Primary source: ${esc(topSource.publisher)}${topSource.publishedDate ? ` · ${esc(topSource.publishedDate)}` : ""}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${BG}${BRAND_MARK}
  <text x="80" y="200" ${FONT} font-size="18" fill="#9499a8" font-weight="500" letter-spacing="2.5">VERIFIED CLAIM · ${confidencePct}% CONFIDENCE</text>
${tspans}
  <g transform="translate(80, 480)">
    <rect x="0" y="0" width="1040" height="50" rx="10" fill="rgba(129,140,248,0.06)" stroke="#262638" stroke-width="1"/>
    <text x="20" y="32" ${FONT} font-size="14" fill="#9499a8" letter-spacing="1.5">SIGNED · HMAC-SHA256 · did:web:sourcescore.org · ${c.sources.length} SOURCE${c.sources.length === 1 ? "" : "S"}</text>
  </g>
  ${sourceLine}
  <text x="80" y="595" ${FONT} font-size="14" fill="#7a8198" letter-spacing="0.5">sourcescore.org/claims/${c.id}</text>
  <text x="1120" y="595" ${FONT} font-size="16" font-weight="600" fill="#818cf8" text-anchor="end">sourcescore.org</text>
</svg>`;
}

async function main() {
  const claims = await loadFullClaims();
  for (const c of claims) {
    writeFileSync(join(OG_CLAIM_DIR, `${c.id}.svg`), claimOg(c), "utf8");
  }
  console.log(`✓ /og/claim/<id>.svg (${claims.length} claim OG images)`);
}

main().catch((err) => {
  console.error("[generate-claim-og] FAILED", err);
  process.exit(1);
});
