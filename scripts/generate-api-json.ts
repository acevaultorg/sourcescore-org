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

const OUT_DIR = "out";
const API_DIR = join(OUT_DIR, "api");
const SOURCES_DIR = join(API_DIR, "source");

mkdirSync(SOURCES_DIR, { recursive: true });

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

console.log(
  `✓ /api/source/<slug>.json (${sources.length}) + /api/sources.json + /api/categories.json (${allCategories.length}) + /api/comparisons.json (${comparisons.length})`
);
