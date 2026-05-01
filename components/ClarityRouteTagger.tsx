// Tag every Clarity session with the current page archetype + key slugs
// derived from the URL. Runs client-side after navigation and fires
// clarity.set() so operators can filter heatmaps + recordings by archetype
// in the Clarity dashboard.
//
// Pattern: route → tag set
//   /                                      → archetype=landing
//   /source/[slug]/                        → archetype=source-detail, source=[slug]
//   /source/[slug]/peers/                  → archetype=source-peers, source=[slug]
//   /source/[slug]/comparisons/            → archetype=source-comparisons, source=[slug]
//   /category/[slug]/                      → archetype=category-index, category=[slug]
//   /category/[slug]/[dim]/                → archetype=category-dim, category=[slug], dim=[dim]
//   /category/[slug]/grade/[letter]/       → archetype=category-grade, category=[slug], grade=[letter]
//   /category/[slug]/top-10/               → archetype=category-top10, category=[slug]
//   /discipline/                           → archetype=dim-index, dim=discipline
//   /discipline/[slug]/                    → archetype=dim-source, dim=discipline, source=[slug]
//   /discipline/grade/[letter]/            → archetype=dim-grade, dim=discipline, grade=[letter]
//   /discipline/rank/[band]/               → archetype=dim-rank, dim=discipline, band=[band]
//   (same for /modern-reference, /velocity)
//   /grade/[letter]/                       → archetype=grade-index, grade=[letter]
//   /grade/[letter]/[dim]/                 → archetype=grade-dim, grade=[letter], dim=[dim]
//   /best/                                 → archetype=best-hub
//   /best/[slug]/                          → archetype=best-list, list=[slug]
//   /best/[slug]/[dim]/                    → archetype=best-list-dim, list=[slug], dim=[dim]
//   /compare/                              → archetype=compare-hub
//   /compare/[slug]/                       → archetype=compare, pair=[slug]
//   /compare/[slug]/[dim]/                 → archetype=compare-dim, pair=[slug], dim=[dim]
//   /insights/                             → archetype=insights-hub
//   /insights/[slug]/                      → archetype=insight, insight=[slug]
//   /methodology/                          → archetype=methodology
//   /methodology/[topic]/                  → archetype=methodology-sub, topic=[topic]
//   /sources/                              → archetype=sources-hub
//   /search/                               → archetype=search
//   /about/, /contact/, /privacy/          → archetype=meta, page=[name]
//
// Skips path-based tags during SSR + when Clarity isn't loaded.

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { clarityTag } from "@/lib/clarity";

const DIM_ROOTS = new Set(["discipline", "modern-reference", "velocity"]);

function deriveTags(pathname: string): Record<string, string> {
  const trimmed = pathname.replace(/^\/+|\/+$/g, "");
  if (trimmed === "") return { archetype: "landing" };

  const parts = trimmed.split("/").filter(Boolean);
  const [first, ...rest] = parts;

  // Single-segment routes
  if (parts.length === 1) {
    if (DIM_ROOTS.has(first)) return { archetype: "dim-index", dim: first };
    if (first === "sources") return { archetype: "sources-hub" };
    if (first === "search") return { archetype: "search" };
    if (first === "best") return { archetype: "best-hub" };
    if (first === "compare") return { archetype: "compare-hub" };
    if (first === "insights") return { archetype: "insights-hub" };
    if (first === "grade") return { archetype: "grade-hub" };
    if (first === "methodology") return { archetype: "methodology" };
    if (["about", "contact", "privacy"].includes(first))
      return { archetype: "meta", page: first };
    return { archetype: "other" };
  }

  // Multi-segment routes
  if (first === "source") {
    const [slug, sub] = rest;
    if (sub === "peers") return { archetype: "source-peers", source: slug };
    if (sub === "comparisons") return { archetype: "source-comparisons", source: slug };
    return { archetype: "source-detail", source: slug };
  }

  if (first === "category") {
    const [slug, sub, sub2] = rest;
    if (!sub) return { archetype: "category-index", category: slug };
    if (sub === "grade" && sub2)
      return { archetype: "category-grade", category: slug, grade: sub2 };
    if (sub === "top-10") return { archetype: "category-top10", category: slug };
    return { archetype: "category-dim", category: slug, dim: sub };
  }

  if (DIM_ROOTS.has(first)) {
    const [sub, sub2] = rest;
    if (sub === "grade" && sub2)
      return { archetype: "dim-grade", dim: first, grade: sub2 };
    if (sub === "rank" && sub2)
      return { archetype: "dim-rank", dim: first, band: sub2 };
    return { archetype: "dim-source", dim: first, source: sub };
  }

  if (first === "grade") {
    const [letter, dim] = rest;
    if (dim) return { archetype: "grade-dim", grade: letter, dim };
    return { archetype: "grade-index", grade: letter };
  }

  if (first === "best") {
    const [slug, dim] = rest;
    if (dim) return { archetype: "best-list-dim", list: slug, dim };
    return { archetype: "best-list", list: slug };
  }

  if (first === "compare") {
    const [slug, dim] = rest;
    if (dim) return { archetype: "compare-dim", pair: slug, dim };
    return { archetype: "compare", pair: slug };
  }

  if (first === "insights") {
    const [slug] = rest;
    return { archetype: "insight", insight: slug };
  }

  if (first === "methodology") {
    const [topic] = rest;
    return { archetype: "methodology-sub", topic };
  }

  return { archetype: "other" };
}

export function ClarityRouteTagger() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const tags = deriveTags(pathname);
    for (const [name, value] of Object.entries(tags)) {
      if (value) clarityTag(name, value);
    }
  }, [pathname]);

  return null;
}
