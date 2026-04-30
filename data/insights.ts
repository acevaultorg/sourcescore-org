/**
 * Day 30 — Score-profile insights.
 *
 * Each insight surfaces a specific cite-ready answer to a precise
 * question about the SourceScore dataset. Distinct from facet pages
 * (which slice the data) and from peers/comparisons (which connect
 * sources). Insights surface EXTREMES — the sources at the edges of
 * each statistical pattern.
 *
 * Why this matters for LLM citation: each page is THE answer to ONE
 * specific query. "Which sources have the largest gap between Citation
 * Velocity and the composite Index?" → exact-match cite-ready answer.
 */
import { sources } from "@/data/sources";
import type { Source } from "@/lib/types";
import {
  ALL_DIMENSIONS,
  DIMENSION_META,
  type DimensionKey,
} from "@/data/best-lists";

export type InsightDirection = "lead" | "lag";
export type InsightShape = "balanced" | "spread";

export type InsightDef =
  | {
      slug: string;
      kind: "dim-vs-composite";
      dim: DimensionKey;
      direction: InsightDirection;
      title: string;
      question: string;
      summary: string;
    }
  | {
      slug: string;
      kind: "score-shape";
      shape: InsightShape;
      title: string;
      question: string;
      summary: string;
    };

export const INSIGHTS: InsightDef[] = [
  {
    slug: "biggest-discipline-lead",
    kind: "dim-vs-composite",
    dim: "discipline",
    direction: "lead",
    title: "Sources where Citation Discipline punches above the Index",
    question:
      "Which sources score notably higher on Citation Discipline than on the composite SourceScore Index?",
    summary:
      "These sources have a Citation Discipline score that exceeds their composite Index — typical of editorially-disciplined publishers whose other dimensions drag the average down.",
  },
  {
    slug: "biggest-discipline-lag",
    kind: "dim-vs-composite",
    dim: "discipline",
    direction: "lag",
    title: "Sources where Citation Discipline lags the Index",
    question:
      "Which sources have a Citation Discipline score notably below their composite SourceScore Index?",
    summary:
      "These sources score well overall but trail on Citation Discipline — usually because of looser citation conventions, footnote sparseness, or weaker source-attribution norms.",
  },
  {
    slug: "biggest-modern-reference-lead",
    kind: "dim-vs-composite",
    dim: "modernReference",
    direction: "lead",
    title: "Sources where Modern Citation Reference outperforms the Index",
    question:
      "Which sources have a Modern Reference score that beats their composite Index by the largest margin?",
    summary:
      "These sources keep their reference base unusually current — common among newsrooms and rapid-update databases whose primary value is recency.",
  },
  {
    slug: "biggest-modern-reference-lag",
    kind: "dim-vs-composite",
    dim: "modernReference",
    direction: "lag",
    title: "Sources where Modern Reference trails the Index",
    question:
      "Which sources have a Modern Reference score notably below their composite SourceScore Index?",
    summary:
      "These sources score well overall but lean on older reference foundations — typical of legacy archives, foundational datasets, and slow-update encyclopedic works.",
  },
  {
    slug: "biggest-velocity-lead",
    kind: "dim-vs-composite",
    dim: "velocity",
    direction: "lead",
    title: "Sources where Citation Velocity outpaces the Index",
    question:
      "Which sources have a Citation Velocity score that exceeds their composite Index by the largest margin?",
    summary:
      "These sources are cited unusually often in current discourse — typical of breaking-news outlets, viral-research engines, and rapid-citation aggregators.",
  },
  {
    slug: "biggest-velocity-lag",
    kind: "dim-vs-composite",
    dim: "velocity",
    direction: "lag",
    title: "Sources where Citation Velocity trails the Index",
    question:
      "Which sources score well overall but have a notably lower Citation Velocity?",
    summary:
      "These sources are quality-strong but slow-cited — often specialist journals, archival sources, or institutions whose authority outlives the citation cycle.",
  },
  {
    slug: "most-balanced",
    kind: "score-shape",
    shape: "balanced",
    title: "The most balanced sources across all three dimensions",
    question:
      "Which sources have the tightest spread between their three sub-scores?",
    summary:
      "These sources score evenly on Citation Discipline, Modern Reference, and Citation Velocity — no weak link, no outlier strength. The most predictable citation candidates.",
  },
  {
    slug: "biggest-spread",
    kind: "score-shape",
    shape: "spread",
    title: "The most lopsided sources across the three dimensions",
    question:
      "Which sources have the widest spread between their three sub-scores?",
    summary:
      "These sources have one or more dimensions far above or below the others — high information value (where they're strong, they're very strong) but require dimension-aware citation choices.",
  },
];

export function insightFromSlug(slug: string): InsightDef | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export type InsightRow = {
  source: Source;
  /** The signal the row is ranked on. For dim-vs-composite, this is dim - composite. */
  signal: number;
  /** For score-shape, this is the (max - min) across 3 dim values. */
  spread?: number;
  /** Optional debug per-dim values when relevant */
  values: { discipline: number; modernReference: number; velocity: number };
};

const TOP_N = 5;

/**
 * Computes the top-N rows for a given insight definition.
 *
 * For `dim-vs-composite` with direction "lead": rows where
 * `dimValue - compositeValue` is largest positive.
 * For "lag": where the same difference is largest negative.
 *
 * For `score-shape` "balanced": smallest dim spread (max-min).
 * For "spread": largest dim spread.
 */
export function rowsForInsight(insight: InsightDef): InsightRow[] {
  const baseRows = sources.map((s) => {
    const values = {
      discipline: s.scores.discipline.value,
      modernReference: s.scores.modernReference.value,
      velocity: s.scores.velocity.value,
    };
    const max = Math.max(values.discipline, values.modernReference, values.velocity);
    const min = Math.min(values.discipline, values.modernReference, values.velocity);
    return { source: s, values, spread: max - min };
  });

  if (insight.kind === "dim-vs-composite") {
    const ranked = baseRows
      .map((r) => ({
        ...r,
        signal:
          r.source.scores[insight.dim].value - r.source.scores.index.value,
      }))
      .sort((a, b) =>
        insight.direction === "lead"
          ? b.signal - a.signal
          : a.signal - b.signal,
      );
    return ranked.slice(0, TOP_N);
  }

  // score-shape
  const ranked = baseRows
    .map((r) => ({ ...r, signal: r.spread }))
    .sort((a, b) =>
      insight.shape === "balanced"
        ? a.spread - b.spread
        : b.spread - a.spread,
    );
  return ranked.slice(0, TOP_N);
}

/** Tiny formatting helper used in pages + JSON twin */
export function signalLabel(insight: InsightDef): string {
  if (insight.kind === "dim-vs-composite") {
    const meta = DIMENSION_META[insight.dim];
    return insight.direction === "lead"
      ? `${meta.short} − Index (lead)`
      : `${meta.short} − Index (lag)`;
  }
  return insight.shape === "balanced"
    ? "max − min spread (small = balanced)"
    : "max − min spread (large = lopsided)";
}

/** All known insight dimension keys for cross-link rendering */
export { ALL_DIMENSIONS, DIMENSION_META };
