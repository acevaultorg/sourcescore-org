#!/usr/bin/env tsx
/**
 * Postbuild — generate /api/source/<slug>.json + /api/sources.json from the
 * canonical TS dataset. Mirrors holdlens scripts/generate-api-json.ts.
 *
 * Layer 5 archetype: dataset_json_api × +70 (per bot-harvest.md).
 * Bots cache JSON cheaply; humans get the rich UI at /source/<slug>/.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  sources,
  allCategories,
  categorySlug,
  sourcesInCategory,
  peersForSource,
} from "../data/sources";
import {
  comparisons,
  comparisonSlug,
  comparisonsForSource,
  sourcesWithComparators,
} from "../data/comparisons";
import {
  bestLists,
  bestListSourcesByDim,
  ALL_DIMENSIONS,
  DIMENSION_META,
} from "../data/best-lists";
import { INSIGHTS, rowsForInsight, signalLabel } from "../data/insights";
import {
  allGrades,
  gradeSlug,
  gradeRange,
  gradeLabel,
} from "../lib/types";

const OUT_DIR = "out";
const API_DIR = join(OUT_DIR, "api");
const SOURCES_DIR = join(API_DIR, "source");
const GRADE_DIR = join(API_DIR, "grade");
const CATEGORY_DIR = join(API_DIR, "category");
const BEST_DIR = join(API_DIR, "best");

mkdirSync(SOURCES_DIR, { recursive: true });
mkdirSync(GRADE_DIR, { recursive: true });
mkdirSync(CATEGORY_DIR, { recursive: true });
mkdirSync(BEST_DIR, { recursive: true });

const apiVersion = "v0.1";

// /api/source/<slug>.json — per-source JSON twin
for (const s of sources) {
  const body = {
    apiVersion,
    methodology: "https://sourcescore.org/methodology/",
    canonical: `https://sourcescore.org/source/${s.slug}/`,
    source: {
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      category: s.category,
      summary: s.summary,
      founded: s.founded,
      verified: s.verified,
      methodologyVersion: s.methodologyVersion,
    },
    scores: s.scores,
    license: {
      methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
      data: "Underlying public-source data credited to original publishers",
    },
  };
  writeFileSync(join(SOURCES_DIR, `${s.slug}.json`), JSON.stringify(body, null, 2));
}

// /api/sources.json — full catalog (light per-source summary)
const catalogBody = {
  apiVersion,
  methodology: "https://sourcescore.org/methodology/",
  generated: new Date().toISOString(),
  count: sources.length,
  sources: sources.map((s) => ({
    slug: s.slug,
    name: s.name,
    domain: s.domain,
    category: s.category,
    summary: s.summary,
    founded: s.founded,
    verified: s.verified,
    methodologyVersion: s.methodologyVersion,
    canonical: `https://sourcescore.org/source/${s.slug}/`,
    api: `https://sourcescore.org/api/source/${s.slug}.json`,
    scores: {
      index: s.scores.index.value,
      indexGrade: s.scores.index.grade,
      discipline: s.scores.discipline.value,
      modernReference: s.scores.modernReference.value,
      velocity: s.scores.velocity.value,
    },
  })),
};
writeFileSync(join(API_DIR, "sources.json"), JSON.stringify(catalogBody, null, 2));

// /api/categories.json — category-level summary with mean Index per group
const categoriesBody = {
  apiVersion,
  methodology: "https://sourcescore.org/methodology/",
  generated: new Date().toISOString(),
  count: allCategories.length,
  categories: allCategories.map((cat) => {
    const list = sourcesInCategory(cat);
    const mean = list.length
      ? Math.round(list.reduce((a, s) => a + s.scores.index.value, 0) / list.length)
      : 0;
    const top = list[0];
    return {
      name: cat,
      slug: categorySlug(cat),
      canonical: `https://sourcescore.org/category/${categorySlug(cat)}/`,
      count: list.length,
      meanIndex: mean,
      topSource: top
        ? { slug: top.slug, name: top.name, index: top.scores.index.value, grade: top.scores.index.grade }
        : null,
    };
  }),
};
writeFileSync(join(API_DIR, "categories.json"), JSON.stringify(categoriesBody, null, 2));

// /api/category/<slug>.json × N — per-category JSON twin of /category/<slug>/
let categoryTwinsWritten = 0;
for (const cat of allCategories) {
  const cSlug = categorySlug(cat);
  const list = sourcesInCategory(cat);
  const mean = list.length
    ? Math.round(list.reduce((a, s) => a + s.scores.index.value, 0) / list.length)
    : 0;
  const body = {
    apiVersion,
    methodology: "https://sourcescore.org/methodology/",
    canonical: `https://sourcescore.org/category/${cSlug}/`,
    category: cat,
    slug: cSlug,
    count: list.length,
    meanIndex: mean,
    sources: list.map((s) => ({
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      canonical: `https://sourcescore.org/source/${s.slug}/`,
      api: `https://sourcescore.org/api/source/${s.slug}.json`,
      scores: {
        index: s.scores.index.value,
        indexGrade: s.scores.index.grade,
        discipline: s.scores.discipline.value,
        modernReference: s.scores.modernReference.value,
        velocity: s.scores.velocity.value,
      },
    })),
    license: {
      methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
      data: "Underlying public-source data credited to original publishers",
    },
  };
  mkdirSync(join(CATEGORY_DIR), { recursive: true });
  writeFileSync(join(CATEGORY_DIR, `${cSlug}.json`), JSON.stringify(body, null, 2));
  categoryTwinsWritten++;
}

// /api/comparisons.json — all comparison pairs in canonical order
const comparisonsBody = {
  apiVersion,
  methodology: "https://sourcescore.org/methodology/",
  generated: new Date().toISOString(),
  count: comparisons.length,
  comparisons: comparisons.map((c) => {
    const slug = comparisonSlug(c.a, c.b);
    const a = sources.find((s) => s.slug === c.a)!;
    const b = sources.find((s) => s.slug === c.b)!;
    return {
      slug,
      canonical: `https://sourcescore.org/compare/${slug}/`,
      summary: c.summary,
      a: {
        slug: a.slug,
        name: a.name,
        domain: a.domain,
        index: a.scores.index.value,
        grade: a.scores.index.grade,
      },
      b: {
        slug: b.slug,
        name: b.name,
        domain: b.domain,
        index: b.scores.index.value,
        grade: b.scores.index.grade,
      },
    };
  }),
};
writeFileSync(join(API_DIR, "comparisons.json"), JSON.stringify(comparisonsBody, null, 2));

// /api/compare/<slug>.json × N — per-comparison JSON twin of /compare/<slug>/
const COMPARE_DIR = join(API_DIR, "compare");
mkdirSync(COMPARE_DIR, { recursive: true });
let compareTwinsWritten = 0;
for (const c of comparisons) {
  const slug = comparisonSlug(c.a, c.b);
  const a = sources.find((s) => s.slug === c.a)!;
  const b = sources.find((s) => s.slug === c.b)!;
  const winner = (key: "index" | "discipline" | "modernReference" | "velocity") => {
    const va = a.scores[key].value;
    const vb = b.scores[key].value;
    if (va > vb) return a.slug;
    if (vb > va) return b.slug;
    return null; // tie
  };
  const body = {
    apiVersion,
    methodology: "https://sourcescore.org/methodology/",
    canonical: `https://sourcescore.org/compare/${slug}/`,
    summary: c.summary,
    a: {
      slug: a.slug,
      name: a.name,
      domain: a.domain,
      canonical: `https://sourcescore.org/source/${a.slug}/`,
      api: `https://sourcescore.org/api/source/${a.slug}.json`,
      scores: a.scores,
    },
    b: {
      slug: b.slug,
      name: b.name,
      domain: b.domain,
      canonical: `https://sourcescore.org/source/${b.slug}/`,
      api: `https://sourcescore.org/api/source/${b.slug}.json`,
      scores: b.scores,
    },
    winners: {
      index: winner("index"),
      discipline: winner("discipline"),
      modernReference: winner("modernReference"),
      velocity: winner("velocity"),
    },
    license: {
      methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
      data: "Underlying public-source data credited to original publishers",
    },
  };
  writeFileSync(join(COMPARE_DIR, `${slug}.json`), JSON.stringify(body, null, 2));
  compareTwinsWritten++;
}

// /api/compare/<slug>/<dimension>.json × 225 — per-pair-per-dimension JSON twin,
// mirroring app/compare/[slug]/[dimension]/page.tsx (Day 18).
const COMPARE_DIMENSION_DIRS: Array<{
  pathSegment: "discipline" | "modern-reference" | "velocity";
  key: "discipline" | "modernReference" | "velocity";
  label: string;
  weight: string;
  methodology: string;
}> = [
  {
    pathSegment: "discipline",
    key: "discipline",
    label: "Citation Discipline",
    weight: "35%",
    methodology: "https://sourcescore.org/methodology/citation-discipline/",
  },
  {
    pathSegment: "modern-reference",
    key: "modernReference",
    label: "Modern Citation Reference",
    weight: "30%",
    methodology: "https://sourcescore.org/methodology/modern-reference/",
  },
  {
    pathSegment: "velocity",
    key: "velocity",
    label: "Citation Velocity",
    weight: "35%",
    methodology: "https://sourcescore.org/methodology/citation-velocity/",
  },
];
let compareDimensionTwinsWritten = 0;
for (const c of comparisons) {
  const slug = comparisonSlug(c.a, c.b);
  const a = sources.find((s) => s.slug === c.a)!;
  const b = sources.find((s) => s.slug === c.b)!;
  for (const d of COMPARE_DIMENSION_DIRS) {
    const aScore = a.scores[d.key];
    const bScore = b.scores[d.key];
    const sortedDesc = [...sources].sort(
      (x, y) => y.scores[d.key].value - x.scores[d.key].value
    );
    const aRank = sortedDesc.findIndex((x) => x.slug === a.slug) + 1;
    const bRank = sortedDesc.findIndex((x) => x.slug === b.slug) + 1;
    const totalCount = sources.length;
    const delta = Math.abs(aScore.value - bScore.value);
    const winnerSlug =
      aScore.value > bScore.value
        ? a.slug
        : bScore.value > aScore.value
          ? b.slug
          : null;

    const dir = join(COMPARE_DIR, slug);
    mkdirSync(dir, { recursive: true });

    const body = {
      apiVersion,
      methodology: d.methodology,
      canonical: `https://sourcescore.org/compare/${slug}/${d.pathSegment}/`,
      summary: c.summary,
      dimension: {
        key: d.key,
        pathSegment: d.pathSegment,
        label: d.label,
        weightInComposite: d.weight,
      },
      a: {
        slug: a.slug,
        name: a.name,
        domain: a.domain,
        category: a.category,
        canonical: `https://sourcescore.org/source/${a.slug}/`,
        api: `https://sourcescore.org/api/source/${a.slug}.json`,
        dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${a.slug}/`,
        dimensionDetailApi: `https://sourcescore.org/api/${d.pathSegment}/${a.slug}.json`,
        score: {
          value: aScore.value,
          grade: aScore.grade,
          rationale: aScore.rationale,
          signals: aScore.signals,
        },
        rank: { global: aRank, globalTotal: totalCount },
      },
      b: {
        slug: b.slug,
        name: b.name,
        domain: b.domain,
        category: b.category,
        canonical: `https://sourcescore.org/source/${b.slug}/`,
        api: `https://sourcescore.org/api/source/${b.slug}.json`,
        dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${b.slug}/`,
        dimensionDetailApi: `https://sourcescore.org/api/${d.pathSegment}/${b.slug}.json`,
        score: {
          value: bScore.value,
          grade: bScore.grade,
          rationale: bScore.rationale,
          signals: bScore.signals,
        },
        rank: { global: bRank, globalTotal: totalCount },
      },
      verdict: {
        winner: winnerSlug,
        delta,
        claim: winnerSlug
          ? `${winnerSlug === a.slug ? a.name : b.name} outscores ${winnerSlug === a.slug ? b.name : a.name} on ${d.label} by ${delta} points.`
          : `${a.name} and ${b.name} tie on ${d.label} (${aScore.grade} · ${aScore.value}).`,
      },
      otherDimensions: COMPARE_DIMENSION_DIRS
        .filter((od) => od.pathSegment !== d.pathSegment)
        .map((od) => ({
          pathSegment: od.pathSegment,
          label: od.label,
          canonical: `https://sourcescore.org/compare/${slug}/${od.pathSegment}/`,
          api: `https://sourcescore.org/api/compare/${slug}/${od.pathSegment}.json`,
        }))
        .concat([
          {
            pathSegment: "index" as never,
            label: "SourceScore Index (composite)",
            canonical: `https://sourcescore.org/compare/${slug}/`,
            api: `https://sourcescore.org/api/compare/${slug}.json`,
          },
        ]),
      license: {
        methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
        data: "Underlying public-source data credited to original publishers",
      },
    };
    writeFileSync(
      join(dir, `${d.pathSegment}.json`),
      JSON.stringify(body, null, 2)
    );
    compareDimensionTwinsWritten++;
  }
}

// /api/grades.json — overview catalog of all letter grades + counts + range
const gradesBody = {
  apiVersion,
  methodology: "https://sourcescore.org/methodology/sourcescore-index/",
  generated: new Date().toISOString(),
  count: allGrades.length,
  grades: allGrades.map((g) => {
    const list = sources
      .filter((s) => s.scores.index.grade === g)
      .sort((a, b) => b.scores.index.value - a.scores.index.value);
    const top = list[0];
    return {
      grade: g,
      slug: gradeSlug(g),
      range: gradeRange(g),
      label: gradeLabel(g),
      canonical: `https://sourcescore.org/grade/${gradeSlug(g)}/`,
      api: `https://sourcescore.org/api/grade/${gradeSlug(g)}.json`,
      count: list.length,
      topSource: top
        ? {
            slug: top.slug,
            name: top.name,
            index: top.scores.index.value,
            grade: top.scores.index.grade,
          }
        : null,
    };
  }),
};
writeFileSync(join(API_DIR, "grades.json"), JSON.stringify(gradesBody, null, 2));

// /api/grade/<letter>.json × 6 — per-grade JSON twin of /grade/<letter>/
let gradeTwinsWritten = 0;
for (const g of allGrades) {
  const list = sources
    .filter((s) => s.scores.index.grade === g)
    .sort((a, b) => b.scores.index.value - a.scores.index.value);
  const avgDiscipline = list.length
    ? Math.round(list.reduce((a, s) => a + s.scores.discipline.value, 0) / list.length)
    : 0;
  const avgModernReference = list.length
    ? Math.round(list.reduce((a, s) => a + s.scores.modernReference.value, 0) / list.length)
    : 0;
  const avgVelocity = list.length
    ? Math.round(list.reduce((a, s) => a + s.scores.velocity.value, 0) / list.length)
    : 0;

  const body = {
    apiVersion,
    methodology: "https://sourcescore.org/methodology/sourcescore-index/",
    canonical: `https://sourcescore.org/grade/${gradeSlug(g)}/`,
    grade: g,
    slug: gradeSlug(g),
    range: gradeRange(g),
    label: gradeLabel(g),
    count: list.length,
    means: {
      discipline: avgDiscipline,
      modernReference: avgModernReference,
      velocity: avgVelocity,
    },
    sources: list.map((s) => ({
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      category: s.category,
      canonical: `https://sourcescore.org/source/${s.slug}/`,
      api: `https://sourcescore.org/api/source/${s.slug}.json`,
      scores: {
        index: s.scores.index.value,
        discipline: s.scores.discipline.value,
        modernReference: s.scores.modernReference.value,
        velocity: s.scores.velocity.value,
      },
    })),
    license: {
      methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
      data: "Underlying public-source data credited to original publishers",
    },
  };
  writeFileSync(join(GRADE_DIR, `${gradeSlug(g)}.json`), JSON.stringify(body, null, 2));
  gradeTwinsWritten++;
}

// /api/category/<slug>/grade/<letter>.json × N — per-facet JSON twin (only
// non-empty intersections, mirroring app/category/[slug]/grade/[letter]/).
let facetTwinsWritten = 0;
for (const cat of allCategories) {
  const cSlug = categorySlug(cat);
  for (const g of allGrades) {
    const list = sources
      .filter((s) => s.category === cat && s.scores.index.grade === g)
      .sort((a, b) => b.scores.index.value - a.scores.index.value);
    if (list.length === 0) continue;

    const avg = (key: "discipline" | "modernReference" | "velocity") =>
      Math.round(list.reduce((a, s) => a + s.scores[key].value, 0) / list.length);

    const facetDir = join(CATEGORY_DIR, cSlug, "grade");
    mkdirSync(facetDir, { recursive: true });

    const body = {
      apiVersion,
      methodology: "https://sourcescore.org/methodology/sourcescore-index/",
      canonical: `https://sourcescore.org/category/${cSlug}/grade/${gradeSlug(g)}/`,
      facet: {
        category: cat,
        categorySlug: cSlug,
        grade: g,
        gradeSlug: gradeSlug(g),
        gradeRange: gradeRange(g),
        gradeLabel: gradeLabel(g),
      },
      count: list.length,
      means: {
        discipline: avg("discipline"),
        modernReference: avg("modernReference"),
        velocity: avg("velocity"),
      },
      sources: list.map((s) => ({
        slug: s.slug,
        name: s.name,
        domain: s.domain,
        canonical: `https://sourcescore.org/source/${s.slug}/`,
        api: `https://sourcescore.org/api/source/${s.slug}.json`,
        scores: {
          index: s.scores.index.value,
          discipline: s.scores.discipline.value,
          modernReference: s.scores.modernReference.value,
          velocity: s.scores.velocity.value,
        },
      })),
      license: {
        methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
        data: "Underlying public-source data credited to original publishers",
      },
    };
    writeFileSync(join(facetDir, `${gradeSlug(g)}.json`), JSON.stringify(body, null, 2));
    facetTwinsWritten++;
  }
}

// /api/discipline/<slug>.json + /api/modern-reference/<slug>.json + /api/velocity/<slug>.json
// — 390 per-source-per-dimension JSON twins, mirroring app/<dim>/[slug]/page.tsx.
const DIMENSION_DIRS: Array<{
  key: "discipline" | "modernReference" | "velocity";
  pathSegment: string;
  label: string;
  weight: string;
  methodology: string;
}> = [
  {
    key: "discipline",
    pathSegment: "discipline",
    label: "Citation Discipline",
    weight: "35%",
    methodology: "https://sourcescore.org/methodology/citation-discipline/",
  },
  {
    key: "modernReference",
    pathSegment: "modern-reference",
    label: "Modern Citation Reference",
    weight: "30%",
    methodology: "https://sourcescore.org/methodology/modern-reference/",
  },
  {
    key: "velocity",
    pathSegment: "velocity",
    label: "Citation Velocity",
    weight: "35%",
    methodology: "https://sourcescore.org/methodology/citation-velocity/",
  },
];
let dimensionDetailTwinsWritten = 0;
for (const d of DIMENSION_DIRS) {
  const dir = join(API_DIR, d.pathSegment);
  mkdirSync(dir, { recursive: true });
  const sortedDesc = [...sources].sort(
    (a, b) => b.scores[d.key].value - a.scores[d.key].value
  );
  const totalCount = sources.length;
  for (const s of sources) {
    const score = s.scores[d.key];
    const rank = sortedDesc.findIndex((x) => x.slug === s.slug) + 1;
    // In-category rank
    const peers = sources
      .filter((x) => x.category === s.category)
      .sort((a, b) => b.scores[d.key].value - a.scores[d.key].value);
    const catRank = peers.findIndex((x) => x.slug === s.slug) + 1;
    const catMean = peers.length
      ? Math.round(peers.reduce((a, x) => a + x.scores[d.key].value, 0) / peers.length)
      : 0;
    const globalMean = Math.round(
      sources.reduce((a, x) => a + x.scores[d.key].value, 0) / sources.length
    );

    const body = {
      apiVersion,
      methodology: d.methodology,
      canonical: `https://sourcescore.org/${d.pathSegment}/${s.slug}/`,
      dimension: {
        key: d.key,
        label: d.label,
        weightInComposite: d.weight,
      },
      source: {
        slug: s.slug,
        name: s.name,
        domain: s.domain,
        category: s.category,
        canonical: `https://sourcescore.org/source/${s.slug}/`,
        api: `https://sourcescore.org/api/source/${s.slug}.json`,
      },
      score: {
        value: score.value,
        grade: score.grade,
        rationale: score.rationale,
        signals: score.signals,
      },
      rank: {
        global: rank,
        globalTotal: totalCount,
        category: catRank,
        categoryTotal: peers.length,
      },
      means: {
        category: catMean,
        global: globalMean,
        deltaVsCategory: score.value - catMean,
        deltaVsGlobal: score.value - globalMean,
      },
      otherDimensions: {
        index: { value: s.scores.index.value, grade: s.scores.index.grade },
        ...(d.key !== "discipline" && {
          discipline: {
            value: s.scores.discipline.value,
            grade: s.scores.discipline.grade,
            canonical: `https://sourcescore.org/discipline/${s.slug}/`,
          },
        }),
        ...(d.key !== "modernReference" && {
          modernReference: {
            value: s.scores.modernReference.value,
            grade: s.scores.modernReference.grade,
            canonical: `https://sourcescore.org/modern-reference/${s.slug}/`,
          },
        }),
        ...(d.key !== "velocity" && {
          velocity: {
            value: s.scores.velocity.value,
            grade: s.scores.velocity.grade,
            canonical: `https://sourcescore.org/velocity/${s.slug}/`,
          },
        }),
      },
      license: {
        methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
        data: "Underlying public-source data credited to original publishers",
      },
    };
    writeFileSync(join(dir, `${s.slug}.json`), JSON.stringify(body, null, 2));
    dimensionDetailTwinsWritten++;
  }
}

// /api/<dim>/rank/<band>.json × 9 — per-dim-per-rank-band JSON twin (Day 22).
// 3 dims × 3 bands (top-10, top-25, bottom-10) = 9 fixed-N leaderboards.
const RANK_BANDS_API: Array<{ slug: string; n: number; direction: "top" | "bottom"; label: string }> = [
  { slug: "top-10", n: 10, direction: "top", label: "Top 10" },
  { slug: "top-25", n: 25, direction: "top", label: "Top 25" },
  { slug: "bottom-10", n: 10, direction: "bottom", label: "Bottom 10" },
];
let dimensionRankBandTwinsWritten = 0;
for (const d of DIMENSION_DIRS) {
  for (const b of RANK_BANDS_API) {
    const sortedDesc = [...sources].sort(
      (a, c) => c.scores[d.key].value - a.scores[d.key].value
    );
    const list = b.direction === "top"
      ? sortedDesc.slice(0, b.n)
      : sortedDesc.slice(-b.n);
    const startRank = b.direction === "top" ? 1 : sources.length - b.n + 1;

    const bandMean = list.length > 0
      ? Math.round(list.reduce((a, s) => a + s.scores[d.key].value, 0) / list.length)
      : 0;
    const globalMean = Math.round(
      sources.reduce((a, s) => a + s.scores[d.key].value, 0) / sources.length
    );
    const leader = b.direction === "top" ? list[0] : list[list.length - 1];
    const trailer = b.direction === "top" ? list[list.length - 1] : list[0];

    const dir = join(API_DIR, d.pathSegment, "rank");
    mkdirSync(dir, { recursive: true });

    const body = {
      apiVersion,
      methodology: d.methodology,
      canonical: `https://sourcescore.org/${d.pathSegment}/rank/${b.slug}/`,
      facet: {
        dimension: {
          key: d.key,
          pathSegment: d.pathSegment,
          label: d.label,
          weightInComposite: d.weight,
        },
        band: b.slug,
        bandLabel: b.label,
        n: b.n,
        direction: b.direction,
      },
      count: list.length,
      means: {
        inBand: bandMean,
        global: globalMean,
        deltaVsGlobal: bandMean - globalMean,
      },
      leader: leader
        ? {
            slug: leader.slug,
            name: leader.name,
            domain: leader.domain,
            value: leader.scores[d.key].value,
            grade: leader.scores[d.key].grade,
            canonical: `https://sourcescore.org/source/${leader.slug}/`,
            dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${leader.slug}/`,
          }
        : null,
      sources: list.map((s, i) => ({
        rank: startRank + i,
        slug: s.slug,
        name: s.name,
        domain: s.domain,
        category: s.category,
        canonical: `https://sourcescore.org/source/${s.slug}/`,
        dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${s.slug}/`,
        api: `https://sourcescore.org/api/source/${s.slug}.json`,
        score: {
          value: s.scores[d.key].value,
          grade: s.scores[d.key].grade,
          rationale: s.scores[d.key].rationale,
        },
      })),
      verdict: leader
        ? b.direction === "top"
          ? `${leader.name} leads the ${b.label.toLowerCase()} ${d.label.toLowerCase()} sources at ${leader.scores[d.key].value} (${leader.scores[d.key].grade}).`
          : `${trailer.name} sits at the bottom of ${d.label.toLowerCase()} at ${trailer.scores[d.key].value} (${trailer.scores[d.key].grade}). Cite cautiously.`
        : null,
      otherBandsOnSameDim: RANK_BANDS_API
        .filter((ob) => ob.slug !== b.slug)
        .map((ob) => ({
          slug: ob.slug,
          label: ob.label,
          canonical: `https://sourcescore.org/${d.pathSegment}/rank/${ob.slug}/`,
          api: `https://sourcescore.org/api/${d.pathSegment}/rank/${ob.slug}.json`,
        })),
      otherDimsAtSameBand: DIMENSION_DIRS
        .filter((od) => od.pathSegment !== d.pathSegment)
        .map((od) => ({
          pathSegment: od.pathSegment,
          label: od.label,
          canonical: `https://sourcescore.org/${od.pathSegment}/rank/${b.slug}/`,
          api: `https://sourcescore.org/api/${od.pathSegment}/rank/${b.slug}.json`,
        })),
      license: {
        methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
        data: "Underlying public-source data credited to original publishers",
      },
    };
    writeFileSync(join(dir, `${b.slug}.json`), JSON.stringify(body, null, 2));
    dimensionRankBandTwinsWritten++;
  }
}

// /api/<dim>/grade/<letter>.json × ≤18 — per-dim-per-grade JSON twin (Day 21).
// Only writes non-empty intersections (matches generateStaticParams filter on
// app/<dim>/grade/[letter]/page.tsx).
let dimensionGradeTwinsWritten = 0;
for (const d of DIMENSION_DIRS) {
  for (const g of allGrades) {
    const list = sources
      .filter((s) => s.scores[d.key].grade === g)
      .sort((a, b) => b.scores[d.key].value - a.scores[d.key].value);
    if (list.length === 0) continue;

    const meanInGrade = Math.round(
      list.reduce((a, s) => a + s.scores[d.key].value, 0) / list.length
    );
    const globalMean = Math.round(
      sources.reduce((a, s) => a + s.scores[d.key].value, 0) / sources.length
    );
    const sharePct = Math.round((list.length / sources.length) * 100);
    const top = list[0];

    const dir = join(API_DIR, d.pathSegment, "grade");
    mkdirSync(dir, { recursive: true });

    const body = {
      apiVersion,
      methodology: d.methodology,
      canonical: `https://sourcescore.org/${d.pathSegment}/grade/${gradeSlug(g)}/`,
      facet: {
        dimension: {
          key: d.key,
          pathSegment: d.pathSegment,
          label: d.label,
          weightInComposite: d.weight,
        },
        grade: g,
        gradeSlug: gradeSlug(g),
        gradeRange: gradeRange(g),
        gradeLabel: gradeLabel(g),
      },
      count: list.length,
      means: {
        inGrade: meanInGrade,
        global: globalMean,
        deltaVsGlobal: meanInGrade - globalMean,
      },
      shareOfDataset: { count: list.length, total: sources.length, percent: sharePct },
      leader: top
        ? {
            slug: top.slug,
            name: top.name,
            domain: top.domain,
            value: top.scores[d.key].value,
            grade: top.scores[d.key].grade,
            canonical: `https://sourcescore.org/source/${top.slug}/`,
            dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${top.slug}/`,
          }
        : null,
      sources: list.map((s, i) => ({
        rank: i + 1,
        slug: s.slug,
        name: s.name,
        domain: s.domain,
        category: s.category,
        canonical: `https://sourcescore.org/source/${s.slug}/`,
        dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${s.slug}/`,
        api: `https://sourcescore.org/api/source/${s.slug}.json`,
        score: {
          value: s.scores[d.key].value,
          grade: s.scores[d.key].grade,
          rationale: s.scores[d.key].rationale,
        },
      })),
      otherDimensionsAtSameGrade: DIMENSION_DIRS
        .filter((od) => od.pathSegment !== d.pathSegment)
        .map((od) => {
          const c = sources.filter((s) => s.scores[od.key].grade === g).length;
          return {
            pathSegment: od.pathSegment,
            label: od.label,
            count: c,
            canonical: `https://sourcescore.org/${od.pathSegment}/grade/${gradeSlug(g)}/`,
            api:
              c > 0
                ? `https://sourcescore.org/api/${od.pathSegment}/grade/${gradeSlug(g)}.json`
                : null,
          };
        }),
      compositeIndexAtSameGrade: {
        canonical: `https://sourcescore.org/grade/${gradeSlug(g)}/`,
        api: `https://sourcescore.org/api/grade/${gradeSlug(g)}.json`,
        count: sources.filter((s) => s.scores.index.grade === g).length,
      },
      license: {
        methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
        data: "Underlying public-source data credited to original publishers",
      },
    };
    writeFileSync(join(dir, `${gradeSlug(g)}.json`), JSON.stringify(body, null, 2));
    dimensionGradeTwinsWritten++;
  }
}

// /api/<dim>/index.json × 3 — per-dimension full ranked index (Day 21 sibling).
// Mirrors app/<dim>/page.tsx — full 130-source leaderboard sorted by that
// dimension's value. Referenced by Dataset schema apiUrl on the dim landing pages.
let dimensionIndexTwinsWritten = 0;
for (const d of DIMENSION_DIRS) {
  const ranked = [...sources].sort(
    (a, b) => b.scores[d.key].value - a.scores[d.key].value
  );
  const globalMean = Math.round(
    sources.reduce((a, s) => a + s.scores[d.key].value, 0) / sources.length
  );
  const top = ranked[0];
  const dir = join(API_DIR, d.pathSegment);
  mkdirSync(dir, { recursive: true });

  const body = {
    apiVersion,
    methodology: d.methodology,
    canonical: `https://sourcescore.org/${d.pathSegment}/`,
    dimension: {
      key: d.key,
      pathSegment: d.pathSegment,
      label: d.label,
      weightInComposite: d.weight,
    },
    count: ranked.length,
    means: { global: globalMean },
    leader: top
      ? {
          slug: top.slug,
          name: top.name,
          domain: top.domain,
          value: top.scores[d.key].value,
          grade: top.scores[d.key].grade,
          canonical: `https://sourcescore.org/source/${top.slug}/`,
          dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${top.slug}/`,
        }
      : null,
    sources: ranked.map((s, i) => ({
      rank: i + 1,
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      category: s.category,
      canonical: `https://sourcescore.org/source/${s.slug}/`,
      dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${s.slug}/`,
      api: `https://sourcescore.org/api/source/${s.slug}.json`,
      score: {
        value: s.scores[d.key].value,
        grade: s.scores[d.key].grade,
        rationale: s.scores[d.key].rationale,
      },
    })),
    license: {
      methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
      data: "Underlying public-source data credited to original publishers",
    },
  };
  writeFileSync(join(dir, "index.json"), JSON.stringify(body, null, 2));
  dimensionIndexTwinsWritten++;
}

// /api/category/<slug>/<dim>.json × 36 — per-category-per-dimension JSON twin
// (Day 20). Mirrors app/category/[slug]/[dimension]/page.tsx — ranked
// leaderboard of sources in this category × this dimension.
let categoryDimensionTwinsWritten = 0;
for (const cat of allCategories) {
  const cSlug = categorySlug(cat);
  for (const d of DIMENSION_DIRS) {
    const list = [...sourcesInCategory(cat)].sort(
      (a, b) => b.scores[d.key].value - a.scores[d.key].value
    );
    const top = list[0];
    const catMean = list.length
      ? Math.round(
          list.reduce((a, s) => a + s.scores[d.key].value, 0) / list.length
        )
      : 0;
    const globalMean = Math.round(
      sources.reduce((a, s) => a + s.scores[d.key].value, 0) / sources.length
    );

    const dir = join(CATEGORY_DIR, cSlug);
    mkdirSync(dir, { recursive: true });

    const body = {
      apiVersion,
      methodology: d.methodology,
      canonical: `https://sourcescore.org/category/${cSlug}/${d.pathSegment}/`,
      facet: {
        category: cat,
        categorySlug: cSlug,
        dimension: {
          key: d.key,
          pathSegment: d.pathSegment,
          label: d.label,
          weightInComposite: d.weight,
        },
      },
      count: list.length,
      means: {
        category: catMean,
        global: globalMean,
        deltaVsGlobal: catMean - globalMean,
      },
      leader: top
        ? {
            slug: top.slug,
            name: top.name,
            domain: top.domain,
            value: top.scores[d.key].value,
            grade: top.scores[d.key].grade,
            canonical: `https://sourcescore.org/source/${top.slug}/`,
            dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${top.slug}/`,
          }
        : null,
      sources: list.map((s, i) => ({
        rank: i + 1,
        slug: s.slug,
        name: s.name,
        domain: s.domain,
        canonical: `https://sourcescore.org/source/${s.slug}/`,
        dimensionDetail: `https://sourcescore.org/${d.pathSegment}/${s.slug}/`,
        api: `https://sourcescore.org/api/source/${s.slug}.json`,
        score: {
          value: s.scores[d.key].value,
          grade: s.scores[d.key].grade,
          rationale: s.scores[d.key].rationale,
        },
        deltaVsCategoryMean: s.scores[d.key].value - catMean,
      })),
      otherDimensions: DIMENSION_DIRS
        .filter((od) => od.pathSegment !== d.pathSegment)
        .map((od) => ({
          pathSegment: od.pathSegment,
          label: od.label,
          canonical: `https://sourcescore.org/category/${cSlug}/${od.pathSegment}/`,
          api: `https://sourcescore.org/api/category/${cSlug}/${od.pathSegment}.json`,
        })),
      categoryComposite: {
        canonical: `https://sourcescore.org/category/${cSlug}/`,
        api: `https://sourcescore.org/api/category/${cSlug}.json`,
      },
      license: {
        methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
        data: "Underlying public-source data credited to original publishers",
      },
    };
    writeFileSync(
      join(dir, `${d.pathSegment}.json`),
      JSON.stringify(body, null, 2)
    );
    categoryDimensionTwinsWritten++;
  }
}

// /api/best.json — overview catalog of all curated best-lists
const bestCatalogBody = {
  apiVersion,
  methodology: "https://sourcescore.org/methodology/",
  generated: new Date().toISOString(),
  count: bestLists.length,
  lists: bestLists.map((b) => {
    const items = b.select();
    const top = items[0];
    return {
      slug: b.slug,
      title: b.title,
      intent: b.intent,
      description: b.description,
      signalCriterion: b.signalCriterion,
      count: items.length,
      canonical: `https://sourcescore.org/best/${b.slug}/`,
      api: `https://sourcescore.org/api/best/${b.slug}.json`,
      topSource: top
        ? {
            slug: top.slug,
            name: top.name,
            index: top.scores.index.value,
            grade: top.scores.index.grade,
          }
        : null,
    };
  }),
};
writeFileSync(join(API_DIR, "best.json"), JSON.stringify(bestCatalogBody, null, 2));

// /api/best/<slug>.json × N — per-best-list JSON twin
let bestTwinsWritten = 0;
for (const b of bestLists) {
  const items = b.select();
  const body = {
    apiVersion,
    methodology: "https://sourcescore.org/methodology/",
    canonical: `https://sourcescore.org/best/${b.slug}/`,
    list: {
      slug: b.slug,
      title: b.title,
      intent: b.intent,
      description: b.description,
      rationale: b.rationale,
      signalCriterion: b.signalCriterion,
    },
    count: items.length,
    sources: items.map((s, i) => ({
      rank: i + 1,
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      category: s.category,
      summary: s.summary,
      canonical: `https://sourcescore.org/source/${s.slug}/`,
      api: `https://sourcescore.org/api/source/${s.slug}.json`,
      scores: {
        index: s.scores.index.value,
        indexGrade: s.scores.index.grade,
        discipline: s.scores.discipline.value,
        modernReference: s.scores.modernReference.value,
        velocity: s.scores.velocity.value,
      },
    })),
    license: {
      methodology: "Cite as: SourceScore Methodology v0.1, sourcescore.org",
      data: "Underlying public-source data credited to original publishers",
    },
  };
  writeFileSync(join(BEST_DIR, `${b.slug}.json`), JSON.stringify(body, null, 2));
  bestTwinsWritten++;
}

// ────────────────────────────────────────────────────────
// Day 27 — Composite-grade × per-dim JSON twins.
// 4 viable grades (≥3 sources: A+, A, B, C) × 3 dims = 12 twins.
// URL: /grade/<letter>/<dim>/  →  twin: /api/grade/<letter>/<dim>.json
// Distinct from Day 21 (/<dim>/grade/<letter>/) which redefines grade
// based on dim score; Day 27 keeps composite-grade definition.
// ────────────────────────────────────────────────────────
const GRADE_DIM_MIN = 3;
let gradeDimensionTwinsWritten = 0;
for (const grade of allGrades) {
  const tier = sources.filter((s) => s.scores.index.grade === grade);
  if (tier.length < GRADE_DIM_MIN) continue;
  for (const dim of ALL_DIMENSIONS) {
    const dimMeta = DIMENSION_META[dim];
    const items = [...tier].sort(
      (a, b) => b.scores[dim].value - a.scores[dim].value,
    );
    const baseList = [...tier].sort(
      (a, b) => b.scores.index.value - a.scores.index.value,
    );
    const baseRankBySlug = new Map(baseList.map((s, i) => [s.slug, i + 1]));

    const dimMean = Math.round(
      items.reduce((a, s) => a + s.scores[dim].value, 0) / items.length,
    );
    const compositeMean = Math.round(
      items.reduce((a, s) => a + s.scores.index.value, 0) / items.length,
    );
    const leader = items[0];

    const body = {
      apiVersion: "v1",
      methodology: "v0.1",
      canonical: `https://sourcescore.org/grade/${gradeSlug(grade)}/${dimMeta.routeSegment}/`,
      facet: {
        type: "grade-by-dimension",
        compositeGrade: grade,
        dimension: dim,
      },
      gradeRange: gradeRange(grade),
      dimension: {
        key: dim,
        label: dimMeta.label,
        short: dimMeta.short,
        routeSegment: dimMeta.routeSegment,
      },
      count: items.length,
      means: {
        dimension: dimMean,
        composite: compositeMean,
        deltaVsComposite: dimMean - compositeMean,
      },
      leader: {
        slug: leader.slug,
        name: leader.name,
        score: leader.scores[dim].value,
        grade: leader.scores[dim].grade,
      },
      sources: items.map((s, i) => {
        const baseRank = baseRankBySlug.get(s.slug) ?? i + 1;
        return {
          dimRank: i + 1,
          compositeRank: baseRank,
          rankDelta: baseRank - (i + 1),
          slug: s.slug,
          name: s.name,
          domain: s.domain,
          category: s.category,
          summary: s.summary,
          canonical: `https://sourcescore.org/source/${s.slug}/`,
          score: s.scores[dim].value,
          grade: s.scores[dim].grade,
          compositeScore: s.scores.index.value,
          compositeGrade: s.scores.index.grade,
        };
      }),
      siblingViews: {
        composite: `https://sourcescore.org/grade/${gradeSlug(grade)}/`,
        otherDimensions: ALL_DIMENSIONS.filter((d) => d !== dim).map((d) => ({
          dimension: d,
          url: `https://sourcescore.org/grade/${gradeSlug(grade)}/${DIMENSION_META[d].routeSegment}/`,
        })),
      },
      verdict: `${leader.name} leads composite-${grade} sources on ${dimMeta.label} at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100). Mean ${dimMeta.short}: ${dimMean}; mean composite: ${compositeMean}.`,
      license: "CC-BY-4.0",
    };

    const gradeDimDir = join(GRADE_DIR, gradeSlug(grade));
    mkdirSync(gradeDimDir, { recursive: true });
    writeFileSync(
      join(gradeDimDir, `${dimMeta.routeSegment}.json`),
      JSON.stringify(body, null, 2),
    );
    gradeDimensionTwinsWritten++;
  }
}

// ────────────────────────────────────────────────────────
// Day 25 — Per-best-list × per-dim JSON twins.
// Cartesian product of 12 best-lists × 3 dimensions = 36 twins.
// URL: /best/<slug>/<dim>/  →  twin: /api/best/<slug>/<dim>.json
// ────────────────────────────────────────────────────────
let bestDimensionTwinsWritten = 0;
for (const b of bestLists) {
  for (const dim of ALL_DIMENSIONS) {
    const items = bestListSourcesByDim(b.slug, dim);
    if (!items || items.length === 0) continue;
    const dimMeta = DIMENSION_META[dim];

    // Composite-rank lookup for "rank delta" surfacing
    const baseList = b.select();
    const baseRankBySlug = new Map(baseList.map((s, i) => [s.slug, i + 1]));

    const dimMean = Math.round(
      items.reduce((a, s) => a + s.scores[dim].value, 0) / items.length,
    );
    const indexMean = Math.round(
      items.reduce((a, s) => a + s.scores.index.value, 0) / items.length,
    );
    const leader = items[0];

    const body = {
      apiVersion: "v1",
      methodology: "v0.1",
      canonical: `https://sourcescore.org/best/${b.slug}/${dimMeta.routeSegment}/`,
      facet: {
        type: "best-list-by-dimension",
        bestList: b.slug,
        dimension: dim,
      },
      list: {
        slug: b.slug,
        title: b.title,
        intent: b.intent,
      },
      dimension: {
        key: dim,
        label: dimMeta.label,
        short: dimMeta.short,
        routeSegment: dimMeta.routeSegment,
      },
      count: items.length,
      means: {
        dimension: dimMean,
        composite: indexMean,
        deltaVsComposite: dimMean - indexMean,
      },
      leader: {
        slug: leader.slug,
        name: leader.name,
        score: leader.scores[dim].value,
        grade: leader.scores[dim].grade,
      },
      sources: items.map((s, i) => {
        const baseRank = baseRankBySlug.get(s.slug) ?? i + 1;
        return {
          dimRank: i + 1,
          compositeRank: baseRank,
          rankDelta: baseRank - (i + 1),
          slug: s.slug,
          name: s.name,
          domain: s.domain,
          category: s.category,
          summary: s.summary,
          canonical: `https://sourcescore.org/source/${s.slug}/`,
          score: s.scores[dim].value,
          grade: s.scores[dim].grade,
          compositeScore: s.scores.index.value,
          compositeGrade: s.scores.index.grade,
        };
      }),
      siblingViews: {
        composite: `https://sourcescore.org/best/${b.slug}/`,
        otherDimensions: ALL_DIMENSIONS.filter((d) => d !== dim).map((d) => ({
          dimension: d,
          url: `https://sourcescore.org/best/${b.slug}/${DIMENSION_META[d].routeSegment}/`,
        })),
      },
      verdict: `${leader.name} leads ${b.title.toLowerCase()} on ${dimMeta.label} at ${leader.scores[dim].grade} (${leader.scores[dim].value}/100). Mean ${dimMeta.short}: ${dimMean}; mean composite Index: ${indexMean}.`,
      license: "CC-BY-4.0",
    };

    const bestDimDir = join(BEST_DIR, b.slug);
    mkdirSync(bestDimDir, { recursive: true });
    writeFileSync(
      join(bestDimDir, `${dimMeta.routeSegment}.json`),
      JSON.stringify(body, null, 2),
    );
    bestDimensionTwinsWritten++;
  }
}

// ────────────────────────────────────────────────────────
// Day 24 — Per-source comparator hub JSON twins.
// One twin per source that appears in ≥1 comparator pair (124 of 130 as
// of Day 23). Each lists every "X vs Y" battle the source is in.
// URL: /source/<slug>/comparisons/  → twin: /api/source/<slug>/comparisons.json
// ────────────────────────────────────────────────────────
let sourceComparatorHubTwinsWritten = 0;
for (const slug of sourcesWithComparators) {
  const me = sources.find((s) => s.slug === slug);
  if (!me) continue;
  const pairs = comparisonsForSource(slug);
  if (pairs.length === 0) continue;

  // Sort by absolute index-score delta (biggest contrast first)
  const sortedPairs = [...pairs]
    .map((p) => {
      const partner = sources.find((s) => s.slug === p.partner);
      return partner ? { p, partner } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => {
      const aDelta = Math.abs(me.scores.index.value - a.partner.scores.index.value);
      const bDelta = Math.abs(me.scores.index.value - b.partner.scores.index.value);
      if (aDelta !== bDelta) return bDelta - aDelta;
      return a.partner.name.localeCompare(b.partner.name);
    });

  const partnerMean =
    sortedPairs.length > 0
      ? Math.round(
          sortedPairs.reduce((acc, x) => acc + x.partner.scores.index.value, 0) /
            sortedPairs.length,
        )
      : 0;
  const globalMean = Math.round(
    sources.reduce((acc, s) => acc + s.scores.index.value, 0) / sources.length,
  );

  const biggest = sortedPairs[0];
  const biggestDelta = biggest
    ? me.scores.index.value - biggest.partner.scores.index.value
    : 0;

  const body = {
    apiVersion: "v1",
    methodology: "v0.1",
    canonical: `https://sourcescore.org/source/${slug}/comparisons/`,
    facet: { type: "source-comparator-hub", source: slug },
    source: {
      slug: me.slug,
      name: me.name,
      domain: me.domain,
      index: me.scores.index.value,
      grade: me.scores.index.grade,
    },
    count: sortedPairs.length,
    means: {
      partner: partnerMean,
      global: globalMean,
      deltaVsGlobal: partnerMean - globalMean,
    },
    biggestContrast: biggest
      ? {
          partner: biggest.partner.slug,
          partnerName: biggest.partner.name,
          partnerIndex: biggest.partner.scores.index.value,
          partnerGrade: biggest.partner.scores.index.grade,
          delta: biggestDelta,
          comparison: `https://sourcescore.org/compare/${
            [me.slug, biggest.partner.slug].sort().join("-vs-")
          }/`,
        }
      : null,
    pairs: sortedPairs.map(({ p, partner }) => ({
      slug: p.slug,
      partner: partner.slug,
      partnerName: partner.name,
      partnerIndex: partner.scores.index.value,
      partnerGrade: partner.scores.index.grade,
      delta: me.scores.index.value - partner.scores.index.value,
      summary: p.summary,
      comparisonUrl: `https://sourcescore.org/compare/${p.slug}/`,
      dimensionFacets: {
        discipline: `https://sourcescore.org/compare/${p.slug}/discipline/`,
        modernReference: `https://sourcescore.org/compare/${p.slug}/modern-reference/`,
        velocity: `https://sourcescore.org/compare/${p.slug}/velocity/`,
      },
    })),
    verdict:
      sortedPairs.length === 1
        ? `${me.name} appears in 1 SourceScore comparator pair.`
        : biggest
          ? `${me.name} ranges from a ${Math.abs(biggestDelta)}-point gap with ${biggest.partner.name} to direct head-to-heads with ${sortedPairs.length - 1} other sources.`
          : `${me.name} appears in ${sortedPairs.length} SourceScore comparator pairs.`,
    license: "CC-BY-4.0",
  };

  const sourceHubDir = join(SOURCES_DIR, slug);
  mkdirSync(sourceHubDir, { recursive: true });
  writeFileSync(
    join(sourceHubDir, "comparisons.json"),
    JSON.stringify(body, null, 2),
  );
  sourceComparatorHubTwinsWritten++;
}

// ────────────────────────────────────────────────────────
// Day 28 — Per-category top-10 JSON twins (base + dim facets).
// Eligibility: categories with ≥10 sources. As of Day 28: 5 of 12
// categories qualify (Academic 19, Government 30, Magazine 12, News 27,
// Tech News 11). 5 base + 5×3 dim = 20 twins total.
// URL base:  /category/<cat>/top-10/        →  /api/category/<cat>/top-10.json
// URL dim:   /category/<cat>/top-10/<dim>/  →  /api/category/<cat>/top-10/<dim>.json
// ────────────────────────────────────────────────────────
const TOP_N_API = 10;
const MIN_CAT_SIZE_API = 10;
let categoryTopNTwinsWritten = 0;
let categoryTopNDimTwinsWritten = 0;
for (const cat of allCategories) {
  const fullList = sourcesInCategory(cat);
  if (fullList.length < MIN_CAT_SIZE_API) continue;
  const cSlug = categorySlug(cat);
  const pool = fullList.slice(0, TOP_N_API);

  // ── Base composite-ranked twin
  const indexMean = Math.round(
    pool.reduce((a, s) => a + s.scores.index.value, 0) / pool.length,
  );
  const categoryMean = Math.round(
    fullList.reduce((a, s) => a + s.scores.index.value, 0) / fullList.length,
  );
  const leader = pool[0];
  const tenth = pool[pool.length - 1];

  const baseBody = {
    apiVersion: "v1",
    methodology: "v0.1",
    canonical: `https://sourcescore.org/category/${cSlug}/top-10/`,
    facet: { type: "category-top-n", category: cSlug, n: TOP_N_API },
    category: cat,
    categorySlug: cSlug,
    n: TOP_N_API,
    fullCategoryCount: fullList.length,
    means: {
      topN: indexMean,
      category: categoryMean,
      liftVsCategory: indexMean - categoryMean,
    },
    leader: {
      slug: leader.slug,
      name: leader.name,
      index: leader.scores.index.value,
      grade: leader.scores.index.grade,
    },
    tenthPlace: {
      slug: tenth.slug,
      name: tenth.name,
      index: tenth.scores.index.value,
      grade: tenth.scores.index.grade,
    },
    sources: pool.map((s, i) => ({
      rank: i + 1,
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      summary: s.summary,
      canonical: `https://sourcescore.org/source/${s.slug}/`,
      api: `https://sourcescore.org/api/source/${s.slug}.json`,
      scores: {
        index: s.scores.index.value,
        indexGrade: s.scores.index.grade,
        discipline: s.scores.discipline.value,
        modernReference: s.scores.modernReference.value,
        velocity: s.scores.velocity.value,
      },
    })),
    siblingViews: {
      fullCategory: `https://sourcescore.org/category/${cSlug}/`,
      byDimension: ALL_DIMENSIONS.map((d) => ({
        dimension: d,
        url: `https://sourcescore.org/category/${cSlug}/top-10/${DIMENSION_META[d].routeSegment}/`,
        api: `https://sourcescore.org/api/category/${cSlug}/top-10/${DIMENSION_META[d].routeSegment}.json`,
      })),
    },
    verdict: `${leader.name} leads top-10 ${cat.toLowerCase()} sources at ${leader.scores.index.grade} (${leader.scores.index.value}/100). Top-10 mean Index ${indexMean}, +${indexMean - categoryMean} above the full ${cat.toLowerCase()} cohort.`,
    license: "CC-BY-4.0",
  };

  const topNDir = join(CATEGORY_DIR, cSlug, "top-10");
  mkdirSync(topNDir, { recursive: true });
  writeFileSync(
    join(CATEGORY_DIR, cSlug, "top-10.json"),
    JSON.stringify(baseBody, null, 2),
  );
  categoryTopNTwinsWritten++;

  // ── Dim-faceted twins (3 per eligible category)
  for (const dim of ALL_DIMENSIONS) {
    const dimMeta = DIMENSION_META[dim];
    const items = [...pool].sort(
      (a, b) => b.scores[dim].value - a.scores[dim].value,
    );
    const baseRankBySlug = new Map(pool.map((s, i) => [s.slug, i + 1]));

    const dimMean = Math.round(
      items.reduce((a, s) => a + s.scores[dim].value, 0) / items.length,
    );
    const compositeMean = Math.round(
      items.reduce((a, s) => a + s.scores.index.value, 0) / items.length,
    );
    const dimLeader = items[0];

    const dimBody = {
      apiVersion: "v1",
      methodology: "v0.1",
      canonical: `https://sourcescore.org/category/${cSlug}/top-10/${dimMeta.routeSegment}/`,
      facet: {
        type: "category-top-n-by-dimension",
        category: cSlug,
        dimension: dim,
        n: TOP_N_API,
      },
      category: cat,
      categorySlug: cSlug,
      dimension: {
        key: dim,
        label: dimMeta.label,
        short: dimMeta.short,
        routeSegment: dimMeta.routeSegment,
      },
      n: TOP_N_API,
      means: {
        dimension: dimMean,
        composite: compositeMean,
        deltaVsComposite: dimMean - compositeMean,
      },
      leader: {
        slug: dimLeader.slug,
        name: dimLeader.name,
        score: dimLeader.scores[dim].value,
        grade: dimLeader.scores[dim].grade,
      },
      sources: items.map((s, i) => {
        const baseRank = baseRankBySlug.get(s.slug) ?? i + 1;
        return {
          dimRank: i + 1,
          compositeRank: baseRank,
          rankDelta: baseRank - (i + 1),
          slug: s.slug,
          name: s.name,
          domain: s.domain,
          summary: s.summary,
          canonical: `https://sourcescore.org/source/${s.slug}/`,
          score: s.scores[dim].value,
          grade: s.scores[dim].grade,
          compositeScore: s.scores.index.value,
          compositeGrade: s.scores.index.grade,
        };
      }),
      siblingViews: {
        composite: `https://sourcescore.org/category/${cSlug}/top-10/`,
        otherDimensions: ALL_DIMENSIONS.filter((d) => d !== dim).map((d) => ({
          dimension: d,
          url: `https://sourcescore.org/category/${cSlug}/top-10/${DIMENSION_META[d].routeSegment}/`,
        })),
        fullCategory: `https://sourcescore.org/category/${cSlug}/`,
      },
      verdict: `${dimLeader.name} leads top-10 ${cat.toLowerCase()} on ${dimMeta.label} at ${dimLeader.scores[dim].grade} (${dimLeader.scores[dim].value}/100). Mean ${dimMeta.short}: ${dimMean}; mean composite: ${compositeMean}.`,
      license: "CC-BY-4.0",
    };

    writeFileSync(
      join(topNDir, `${dimMeta.routeSegment}.json`),
      JSON.stringify(dimBody, null, 2),
    );
    categoryTopNDimTwinsWritten++;
  }
}

// ────────────────────────────────────────────────────────
// Day 29 — Per-source peers JSON twins.
// One twin per source (130 total). Auto-computed nearest-neighbor by
// composite-Index distance, with full dim deltas surfaced inline.
// URL: /source/<slug>/peers/  → twin: /api/source/<slug>/peers.json
// Distinct from Day 24 comparator-hub: peers is auto-NN, comparisons
// is curated head-to-head pairs.
// ────────────────────────────────────────────────────────
const PEERS_N_API = 5;
let sourcePeersTwinsWritten = 0;
for (const me of sources) {
  const peers = peersForSource(me.slug, PEERS_N_API);
  if (peers.length === 0) continue;

  const peerMeanIndex = Math.round(
    peers.reduce((a, p) => a + p.scores.index.value, 0) / peers.length,
  );
  const peerMeanByDim = {
    discipline: Math.round(
      peers.reduce((a, p) => a + p.scores.discipline.value, 0) / peers.length,
    ),
    modernReference: Math.round(
      peers.reduce((a, p) => a + p.scores.modernReference.value, 0) /
        peers.length,
    ),
    velocity: Math.round(
      peers.reduce((a, p) => a + p.scores.velocity.value, 0) / peers.length,
    ),
  };

  // Per-dim leader within (me + peers)
  const combined = [me, ...peers];
  const leaderByDim = {
    discipline: [...combined].sort(
      (a, b) => b.scores.discipline.value - a.scores.discipline.value,
    )[0],
    modernReference: [...combined].sort(
      (a, b) => b.scores.modernReference.value - a.scores.modernReference.value,
    )[0],
    velocity: [...combined].sort(
      (a, b) => b.scores.velocity.value - a.scores.velocity.value,
    )[0],
  };

  const closest = peers[0];
  const closestDelta = closest.scores.index.value - me.scores.index.value;

  const body = {
    apiVersion: "v1",
    methodology: "v0.1",
    canonical: `https://sourcescore.org/source/${me.slug}/peers/`,
    facet: { type: "source-peers", source: me.slug, n: PEERS_N_API },
    source: {
      slug: me.slug,
      name: me.name,
      domain: me.domain,
      category: me.category,
      index: me.scores.index.value,
      grade: me.scores.index.grade,
    },
    n: PEERS_N_API,
    means: {
      indexOfPeers: peerMeanIndex,
      indexOfMe: me.scores.index.value,
      deltaVsMe: peerMeanIndex - me.scores.index.value,
      byDimension: {
        discipline: {
          peerMean: peerMeanByDim.discipline,
          mine: me.scores.discipline.value,
          delta: peerMeanByDim.discipline - me.scores.discipline.value,
        },
        modernReference: {
          peerMean: peerMeanByDim.modernReference,
          mine: me.scores.modernReference.value,
          delta:
            peerMeanByDim.modernReference - me.scores.modernReference.value,
        },
        velocity: {
          peerMean: peerMeanByDim.velocity,
          mine: me.scores.velocity.value,
          delta: peerMeanByDim.velocity - me.scores.velocity.value,
        },
      },
    },
    closest: {
      slug: closest.slug,
      name: closest.name,
      index: closest.scores.index.value,
      grade: closest.scores.index.grade,
      indexDelta: closestDelta,
    },
    dimensionLeaders: {
      discipline: {
        slug: leaderByDim.discipline.slug,
        name: leaderByDim.discipline.name,
        score: leaderByDim.discipline.scores.discipline.value,
        grade: leaderByDim.discipline.scores.discipline.grade,
        isMe: leaderByDim.discipline.slug === me.slug,
      },
      modernReference: {
        slug: leaderByDim.modernReference.slug,
        name: leaderByDim.modernReference.name,
        score: leaderByDim.modernReference.scores.modernReference.value,
        grade: leaderByDim.modernReference.scores.modernReference.grade,
        isMe: leaderByDim.modernReference.slug === me.slug,
      },
      velocity: {
        slug: leaderByDim.velocity.slug,
        name: leaderByDim.velocity.name,
        score: leaderByDim.velocity.scores.velocity.value,
        grade: leaderByDim.velocity.scores.velocity.grade,
        isMe: leaderByDim.velocity.slug === me.slug,
      },
    },
    peers: peers.map((p, i) => ({
      rank: i + 1,
      slug: p.slug,
      name: p.name,
      domain: p.domain,
      category: p.category,
      summary: p.summary,
      canonical: `https://sourcescore.org/source/${p.slug}/`,
      api: `https://sourcescore.org/api/source/${p.slug}.json`,
      index: p.scores.index.value,
      grade: p.scores.index.grade,
      indexDelta: p.scores.index.value - me.scores.index.value,
      scores: {
        discipline: p.scores.discipline.value,
        modernReference: p.scores.modernReference.value,
        velocity: p.scores.velocity.value,
      },
      deltas: {
        discipline: p.scores.discipline.value - me.scores.discipline.value,
        modernReference:
          p.scores.modernReference.value - me.scores.modernReference.value,
        velocity: p.scores.velocity.value - me.scores.velocity.value,
      },
    })),
    siblingViews: {
      profile: `https://sourcescore.org/source/${me.slug}/`,
      comparisons: `https://sourcescore.org/source/${me.slug}/comparisons/`,
    },
    verdict: `${me.name} (${me.scores.index.grade} · ${me.scores.index.value}/100) sits closest to ${closest.name} (${closest.scores.index.grade} · ${closest.scores.index.value}, ${closestDelta >= 0 ? "+" : ""}${closestDelta}). Peer-group mean Index ${peerMeanIndex}.`,
    license: "CC-BY-4.0",
  };

  const dir = join(SOURCES_DIR, me.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "peers.json"), JSON.stringify(body, null, 2));
  sourcePeersTwinsWritten++;
}

// ────────────────────────────────────────────────────────
// Day 30 — Insights JSON twins.
// 1 catalog (/api/insights.json) + 8 per-insight twins. Each twin holds
// the top-5 rows + the cite-ready answer to a specific question.
// ────────────────────────────────────────────────────────
const INSIGHTS_DIR = join(API_DIR, "insights");
mkdirSync(INSIGHTS_DIR, { recursive: true });

// Catalog
const insightsCatalogBody = {
  apiVersion: "v1",
  methodology: "v0.1",
  canonical: "https://sourcescore.org/insights/",
  generated: new Date().toISOString(),
  count: INSIGHTS.length,
  insights: INSIGHTS.map((i) => {
    const rows = rowsForInsight(i);
    const leader = rows[0];
    return {
      slug: i.slug,
      title: i.title,
      question: i.question,
      summary: i.summary,
      kind: i.kind,
      dim: i.kind === "dim-vs-composite" ? i.dim : null,
      direction: i.kind === "dim-vs-composite" ? i.direction : null,
      shape: i.kind === "score-shape" ? i.shape : null,
      canonical: `https://sourcescore.org/insights/${i.slug}/`,
      api: `https://sourcescore.org/api/insights/${i.slug}.json`,
      leader: leader
        ? {
            slug: leader.source.slug,
            name: leader.source.name,
            signal: leader.signal,
            spread: leader.spread,
          }
        : null,
    };
  }),
  license: "CC-BY-4.0",
};
writeFileSync(
  join(API_DIR, "insights.json"),
  JSON.stringify(insightsCatalogBody, null, 2),
);

// Per-insight twins
let insightsTwinsWritten = 0;
for (const insight of INSIGHTS) {
  const rows = rowsForInsight(insight);
  if (rows.length === 0) continue;
  const leader = rows[0];

  const body = {
    apiVersion: "v1",
    methodology: "v0.1",
    canonical: `https://sourcescore.org/insights/${insight.slug}/`,
    facet: { type: "insight", slug: insight.slug },
    insight: {
      slug: insight.slug,
      title: insight.title,
      question: insight.question,
      summary: insight.summary,
      kind: insight.kind,
      ...(insight.kind === "dim-vs-composite"
        ? { dim: insight.dim, direction: insight.direction }
        : { shape: insight.shape }),
      signalDefinition: signalLabel(insight),
    },
    count: rows.length,
    answer: {
      sourceSlug: leader.source.slug,
      sourceName: leader.source.name,
      signal: leader.signal,
      spread: leader.spread,
      verdict:
        insight.kind === "dim-vs-composite"
          ? `${leader.source.name} has the largest ${
              insight.direction === "lead" ? "positive" : "negative"
            } gap on ${DIMENSION_META[insight.dim].label}: ${
              leader.signal >= 0 ? "+" : ""
            }${leader.signal} points vs the composite Index.`
          : `${leader.source.name} has the ${
              insight.shape === "balanced" ? "smallest" : "largest"
            } sub-score spread (${leader.spread} points across all three dimensions).`,
    },
    rows: rows.map((r, i) => ({
      rank: i + 1,
      slug: r.source.slug,
      name: r.source.name,
      domain: r.source.domain,
      category: r.source.category,
      summary: r.source.summary,
      canonical: `https://sourcescore.org/source/${r.source.slug}/`,
      api: `https://sourcescore.org/api/source/${r.source.slug}.json`,
      composite: r.source.scores.index.value,
      compositeGrade: r.source.scores.index.grade,
      values: r.values,
      signal: r.signal,
      spread: r.spread,
    })),
    siblingInsights: INSIGHTS.filter((i) => i.slug !== insight.slug).map(
      (i) => ({
        slug: i.slug,
        title: i.title,
        canonical: `https://sourcescore.org/insights/${i.slug}/`,
      }),
    ),
    license: "CC-BY-4.0",
  };

  writeFileSync(
    join(INSIGHTS_DIR, `${insight.slug}.json`),
    JSON.stringify(body, null, 2),
  );
  insightsTwinsWritten++;
}

console.log(
  `✓ /api/source/<slug>.json (${sources.length}) + /api/sources.json + /api/categories.json + /api/category/<slug>.json (${categoryTwinsWritten}) + /api/category/<slug>/<dim>.json (${categoryDimensionTwinsWritten}) + /api/comparisons.json + /api/compare/<slug>.json (${compareTwinsWritten}) + /api/compare/<slug>/<dim>.json (${compareDimensionTwinsWritten}) + /api/grades.json + /api/grade/<letter>.json (${gradeTwinsWritten}) + /api/grade/<letter>/<dim>.json (${gradeDimensionTwinsWritten}) + /api/category/<cat>/grade/<letter>.json (${facetTwinsWritten}) + /api/category/<cat>/top-10.json (${categoryTopNTwinsWritten}) + /api/category/<cat>/top-10/<dim>.json (${categoryTopNDimTwinsWritten}) + /api/best.json + /api/best/<slug>.json (${bestTwinsWritten}) + /api/best/<slug>/<dim>.json (${bestDimensionTwinsWritten}) + /api/{discipline,modern-reference,velocity}/<slug>.json (${dimensionDetailTwinsWritten}) + /api/{dim}/index.json (${dimensionIndexTwinsWritten}) + /api/{dim}/grade/<letter>.json (${dimensionGradeTwinsWritten}) + /api/{dim}/rank/<band>.json (${dimensionRankBandTwinsWritten}) + /api/source/<slug>/comparisons.json (${sourceComparatorHubTwinsWritten}) + /api/source/<slug>/peers.json (${sourcePeersTwinsWritten}) + /api/insights.json + /api/insights/<slug>.json (${insightsTwinsWritten})`
);
