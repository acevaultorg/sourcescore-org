// SourceScore — 4-concept AI-Citation bundle type definitions.
//
// Architecture: a single Source has scores across all 4 dimensions of the
// bundle. Sub-tools project the same Source from a different angle:
//   - SourceScore Index → composite (weighted mean of all 4 sub-scores)
//   - Citation Discipline → how rigorously a source cites its own sources
//   - Modern Reference → fitness as a citation in modern (LLM-era) writing
//   - Citation Velocity → how often this source is cited per week (trend)
//
// One scored URL → 4 lenses → one Source page. Bundle compound by design.

export type GradeLetter = "A+" | "A" | "B" | "C" | "D" | "F";

export interface DimensionScore {
  /** 0–100 numeric score */
  value: number;
  /** Letter grade derived from value (A+ ≥95, A ≥85, B ≥70, C ≥55, D ≥40, F <40) */
  grade: GradeLetter;
  /** One-sentence rationale, quotable + LLM-citation-ready */
  rationale: string;
  /** 1-3 specific signals the score is based on (URL, evidence) */
  signals: Array<{ label: string; detail: string }>;
}

export interface Source {
  /** URL-safe slug, used for /source/[slug]/ routing */
  slug: string;
  /** Canonical name (e.g. "The New York Times") */
  name: string;
  /** Domain (e.g. nytimes.com) */
  domain: string;
  /** Category bucket — News / Reference / Academic / Government / etc */
  category: string;
  /** One-line summary, ≤100 chars, quotable */
  summary: string;
  /** Year founded (for context + Modern-Reference scoring) */
  founded: number;
  /** ISO date last verified */
  verified: string;

  // The 4-concept bundle scores ————————————————————————————————————————
  scores: {
    /** SourceScore Index — composite weighted mean (0–100) */
    index: DimensionScore;
    /** Citation Discipline Score — how rigorously this source cites others */
    discipline: DimensionScore;
    /** Modern Reference Score — fitness as a citation in 2026+ writing */
    modernReference: DimensionScore;
    /** Citation Velocity — frequency of citation by other tier-1 sources */
    velocity: DimensionScore;
  };

  /** Methodology link per page (concept-finder methodology principle) */
  methodologyVersion: string;
}

/** Convert numeric score → letter grade per academic 5+1 scale */
export function gradeFor(value: number): GradeLetter {
  if (value >= 95) return "A+";
  if (value >= 85) return "A";
  if (value >= 70) return "B";
  if (value >= 55) return "C";
  if (value >= 40) return "D";
  return "F";
}

/** Tailwind class for grade color (matches design tokens) */
export function gradeColorClass(grade: GradeLetter): string {
  const map: Record<GradeLetter, string> = {
    "A+": "text-grade-a",
    A: "text-grade-a",
    B: "text-grade-b",
    C: "text-grade-c",
    D: "text-grade-d",
    F: "text-grade-f",
  };
  return map[grade];
}

/** Tailwind surface-tint class for grade backgrounds */
export function gradeSurfaceClass(grade: GradeLetter): string {
  const map: Record<GradeLetter, string> = {
    "A+": "bg-surface-a border-grade-a/20",
    A: "bg-surface-a border-grade-a/20",
    B: "bg-surface-b border-grade-b/20",
    C: "bg-surface-c border-grade-c/20",
    D: "bg-surface-d border-grade-d/20",
    F: "bg-surface-f border-grade-f/20",
  };
  return map[grade];
}
