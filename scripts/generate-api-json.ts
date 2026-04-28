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
} from "../data/sources";
import { comparisons, comparisonSlug } from "../data/comparisons";
import { bestLists } from "../data/best-lists";
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

console.log(
  `✓ /api/source/<slug>.json (${sources.length}) + /api/sources.json + /api/categories.json + /api/category/<slug>.json (${categoryTwinsWritten}) + /api/comparisons.json + /api/compare/<slug>.json (${compareTwinsWritten}) + /api/grades.json + /api/grade/<letter>.json (${gradeTwinsWritten}) + /api/category/<cat>/grade/<letter>.json (${facetTwinsWritten}) + /api/best.json + /api/best/<slug>.json (${bestTwinsWritten}) + /api/{discipline,modern-reference,velocity}/<slug>.json (${dimensionDetailTwinsWritten})`
);
