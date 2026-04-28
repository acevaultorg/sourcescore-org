#!/usr/bin/env tsx
/**
 * Postbuild — generate per-source / per-category / per-comparison SVG
 * OG images. Layer 5 archetype: sharecard_per_result_canvas × +95
 * (when paired with PNG conversion). Day 6 ships SVG-only; the page
 * metadata uses SVG as og:image. Most platforms (LinkedIn, Slack,
 * Discord, Notion, generic OG readers) handle SVG fine. Twitter/X
 * specifically requires PNG; for those cards we fall back to the
 * universal /og.svg.
 *
 * Output:
 *   out/og/source/<slug>.svg     × 50
 *   out/og/category/<slug>.svg   × 12
 *   out/og/compare/<slug>.svg    × 25
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  sources,
  allCategories,
  categorySlug,
  sourcesInCategory,
} from "../data/sources";
import { comparisons, comparisonSlug } from "../data/comparisons";
import type { GradeLetter } from "../lib/types";

const OUT_DIR = "out";
const OG_DIR = join(OUT_DIR, "og");
mkdirSync(join(OG_DIR, "source"), { recursive: true });
mkdirSync(join(OG_DIR, "category"), { recursive: true });
mkdirSync(join(OG_DIR, "compare"), { recursive: true });

// Grade-color tokens mirror tailwind.config.ts; if those change, update here.
const gradeColor: Record<GradeLetter, string> = {
  "A+": "#34d399",
  A: "#34d399",
  B: "#38bdf8",
  C: "#fbbf24",
  D: "#fb923c",
  F: "#fb7185",
};

// SVG-safe escape — encode XML special chars in user-controlled strings.
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Truncate to fit a 1200-wide hero. Rough: ~28 chars at 76px, ~36 at 60px.
function clamp(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

const BG_GRADIENT = `
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
    <text x="24" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="700" fill="#818cf8" text-anchor="middle">★</text>
  </g>
  <text x="144" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" font-weight="600" fill="#e5e7ee">SourceScore</text>
`;

const FONT_FAMILY = `font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"`;

// ───── Source OG card ────────────────────────────────────────────
function sourceOg(slug: string): string {
  const s = sources.find((x) => x.slug === slug)!;
  const idx = s.scores.index;
  const color = gradeColor[idx.grade];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${BG_GRADIENT}${BRAND_MARK}
  <text x="80" y="180" ${FONT_FAMILY} font-size="20" fill="#9499a8" font-weight="500" letter-spacing="2">${esc(s.category.toUpperCase())}</text>
  <text x="80" y="280" ${FONT_FAMILY} font-size="68" font-weight="700" fill="#e5e7ee" letter-spacing="-1">${esc(clamp(s.name, 30))}</text>
  <text x="80" y="320" ${FONT_FAMILY} font-size="22" fill="#7a8198" font-family-fallback="ui-monospace, monospace">${esc(s.domain)}</text>
  <g transform="translate(80, 380)">
    <rect x="0" y="0" width="280" height="120" rx="14" fill="rgba(${idx.grade.startsWith("A") ? "52,211,153" : idx.grade === "B" ? "56,189,248" : idx.grade === "C" ? "251,191,36" : idx.grade === "D" ? "251,146,60" : "251,113,133"},0.10)" stroke="${color}" stroke-width="1" stroke-opacity="0.4"/>
    <text x="20" y="35" ${FONT_FAMILY} font-size="16" fill="#9499a8" letter-spacing="2">SCORESCORE</text>
    <text x="20" y="100" ${FONT_FAMILY} font-size="56" font-weight="700" fill="${color}">${idx.grade} · ${idx.value}</text>
  </g>
  <g transform="translate(380, 380)">
    <rect x="0" y="0" width="370" height="120" rx="14" fill="#141420" stroke="#262638" stroke-width="1"/>
    <text x="20" y="35" ${FONT_FAMILY} font-size="14" fill="#9499a8" letter-spacing="1.5">3 SUB-SCORES</text>
    <g transform="translate(20, 60)">
      <text ${FONT_FAMILY} font-size="13" fill="#7a8198" letter-spacing="0.5">Discipline</text>
      <text x="0" y="22" ${FONT_FAMILY} font-size="22" font-weight="700" fill="${gradeColor[s.scores.discipline.grade]}">${s.scores.discipline.value}</text>
    </g>
    <g transform="translate(135, 60)">
      <text ${FONT_FAMILY} font-size="13" fill="#7a8198" letter-spacing="0.5">Modern Ref</text>
      <text x="0" y="22" ${FONT_FAMILY} font-size="22" font-weight="700" fill="${gradeColor[s.scores.modernReference.grade]}">${s.scores.modernReference.value}</text>
    </g>
    <g transform="translate(265, 60)">
      <text ${FONT_FAMILY} font-size="13" fill="#7a8198" letter-spacing="0.5">Velocity</text>
      <text x="0" y="22" ${FONT_FAMILY} font-size="22" font-weight="700" fill="${gradeColor[s.scores.velocity.grade]}">${s.scores.velocity.value}</text>
    </g>
  </g>
  <text x="80" y="570" ${FONT_FAMILY} font-size="18" fill="#7a8198">${esc(clamp(s.summary, 90))}</text>
  <text x="1120" y="570" ${FONT_FAMILY} font-size="16" font-weight="600" fill="#818cf8" text-anchor="end">sourcescore.org</text>
</svg>`;
}

// ───── Category OG card ──────────────────────────────────────────
function categoryOg(cat: string): string {
  const list = sourcesInCategory(cat);
  const mean = Math.round(list.reduce((a, s) => a + s.scores.index.value, 0) / list.length);
  const top = list[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${BG_GRADIENT}${BRAND_MARK}
  <text x="80" y="180" ${FONT_FAMILY} font-size="20" fill="#9499a8" font-weight="500" letter-spacing="2">CATEGORY · ${list.length} SOURCES</text>
  <text x="80" y="290" ${FONT_FAMILY} font-size="76" font-weight="700" fill="#e5e7ee" letter-spacing="-1">${esc(cat)}</text>
  <text x="80" y="350" ${FONT_FAMILY} font-size="36" fill="url(#brand)">on the SourceScore Index</text>
  <g transform="translate(80, 410)">
    <rect x="0" y="0" width="320" height="100" rx="14" fill="#141420" stroke="#262638" stroke-width="1"/>
    <text x="20" y="32" ${FONT_FAMILY} font-size="14" fill="#9499a8" letter-spacing="1.5">CATEGORY MEAN</text>
    <text x="20" y="78" ${FONT_FAMILY} font-size="42" font-weight="700" fill="#818cf8">${mean}</text>
  </g>
  <g transform="translate(420, 410)">
    <rect x="0" y="0" width="640" height="100" rx="14" fill="#141420" stroke="#262638" stroke-width="1"/>
    <text x="20" y="32" ${FONT_FAMILY} font-size="14" fill="#9499a8" letter-spacing="1.5">TOP SOURCE</text>
    <text x="20" y="65" ${FONT_FAMILY} font-size="22" font-weight="700" fill="#e5e7ee">${esc(clamp(top.name, 36))}</text>
    <text x="20" y="88" ${FONT_FAMILY} font-size="16" fill="${gradeColor[top.scores.index.grade]}">${top.scores.index.grade} · ${top.scores.index.value}</text>
  </g>
  <text x="1120" y="595" ${FONT_FAMILY} font-size="16" font-weight="600" fill="#818cf8" text-anchor="end">sourcescore.org</text>
</svg>`;
}

// ───── Comparison OG card (X vs Y, side-by-side) ─────────────────
function compareOg(aSlug: string, bSlug: string): string {
  const a = sources.find((x) => x.slug === aSlug)!;
  const b = sources.find((x) => x.slug === bSlug)!;
  const aColor = gradeColor[a.scores.index.grade];
  const bColor = gradeColor[b.scores.index.grade];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${BG_GRADIENT}${BRAND_MARK}
  <text x="80" y="180" ${FONT_FAMILY} font-size="20" fill="#9499a8" font-weight="500" letter-spacing="2">COMPARISON</text>
  <text x="80" y="270" ${FONT_FAMILY} font-size="64" font-weight="700" fill="#e5e7ee" letter-spacing="-1">${esc(clamp(a.name, 18))} <tspan fill="#7a8198" font-weight="400">vs</tspan> ${esc(clamp(b.name, 18))}</text>
  <g transform="translate(80, 360)">
    <rect x="0" y="0" width="500" height="180" rx="16" fill="rgba(${a.scores.index.grade.startsWith("A") ? "52,211,153" : a.scores.index.grade === "B" ? "56,189,248" : "251,191,36"},0.08)" stroke="${aColor}" stroke-width="1" stroke-opacity="0.4"/>
    <text x="24" y="40" ${FONT_FAMILY} font-size="14" fill="#9499a8" letter-spacing="1.5">${esc(a.category.toUpperCase())}</text>
    <text x="24" y="80" ${FONT_FAMILY} font-size="28" font-weight="700" fill="#e5e7ee">${esc(clamp(a.name, 24))}</text>
    <text x="24" y="106" ${FONT_FAMILY} font-size="16" fill="#7a8198">${esc(a.domain)}</text>
    <text x="24" y="160" ${FONT_FAMILY} font-size="42" font-weight="700" fill="${aColor}">${a.scores.index.grade} · ${a.scores.index.value}</text>
  </g>
  <g transform="translate(620, 360)">
    <rect x="0" y="0" width="500" height="180" rx="16" fill="rgba(${b.scores.index.grade.startsWith("A") ? "52,211,153" : b.scores.index.grade === "B" ? "56,189,248" : "251,191,36"},0.08)" stroke="${bColor}" stroke-width="1" stroke-opacity="0.4"/>
    <text x="24" y="40" ${FONT_FAMILY} font-size="14" fill="#9499a8" letter-spacing="1.5">${esc(b.category.toUpperCase())}</text>
    <text x="24" y="80" ${FONT_FAMILY} font-size="28" font-weight="700" fill="#e5e7ee">${esc(clamp(b.name, 24))}</text>
    <text x="24" y="106" ${FONT_FAMILY} font-size="16" fill="#7a8198">${esc(b.domain)}</text>
    <text x="24" y="160" ${FONT_FAMILY} font-size="42" font-weight="700" fill="${bColor}">${b.scores.index.grade} · ${b.scores.index.value}</text>
  </g>
  <text x="1120" y="595" ${FONT_FAMILY} font-size="16" font-weight="600" fill="#818cf8" text-anchor="end">sourcescore.org</text>
</svg>`;
}

// ───── Generate ──────────────────────────────────────────────────
let n = 0;
for (const s of sources) {
  writeFileSync(join(OG_DIR, "source", `${s.slug}.svg`), sourceOg(s.slug));
  n++;
}
for (const c of allCategories) {
  writeFileSync(join(OG_DIR, "category", `${categorySlug(c)}.svg`), categoryOg(c));
  n++;
}
for (const cmp of comparisons) {
  const slug = comparisonSlug(cmp.a, cmp.b);
  writeFileSync(join(OG_DIR, "compare", `${slug}.svg`), compareOg(cmp.a, cmp.b));
  n++;
}

console.log(
  `✓ /og/source/<slug>.svg (${sources.length}) + /og/category/<slug>.svg (${allCategories.length}) + /og/compare/<slug>.svg (${comparisons.length}) = ${n} OG images`
);
