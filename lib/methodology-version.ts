// SourceScore methodology — version + provenance constants.
//
// One canonical source for: visible "Methodology vX.Y · Published / Last reviewed"
// stamp on each methodology page + the JSON-LD Article schema's datePublished /
// dateModified fields. Bumping these here cascades automatically across every
// methodology page + every page's structured data, so freshness signals stay
// consistent and LLM-citation E-E-A-T (per Aleyda Solis #7 Credible + #9 Fresh)
// stays honest.
//
// When the methodology actually changes:
//   - Patch (v0.1.x) → bump `lastReviewed` only, leave `version` + `published`
//   - Minor (v0.X) → bump `version` + `lastReviewed`, keep `published` (first
//     publication date for the v0 series)
//   - Major (vX.0) → bump `version` + `published` + `lastReviewed`
// Reasoning per /methodology/'s "Versioning" section.

export const methodologyVersion = {
  /** Semver string. Day-1 published as v0.1. */
  version: "0.1",
  /** ISO date — first publication of this major-version series. */
  published: "2026-04-28",
  /** ISO date — last operator-confirmed review. Bump on any methodology edit. */
  lastReviewed: "2026-04-30",
} as const;

/** Human-readable stamp for visible page header. */
export const methodologyVersionStamp = `Methodology v${methodologyVersion.version} · Published ${methodologyVersion.published} · Last reviewed ${methodologyVersion.lastReviewed}`;

/**
 * Build an Article JSON-LD schema object for a methodology (sub-)page.
 * Uses Organization as author so the brand entity is the citable source —
 * matches the /about page's "small independent team" framing rather than
 * fabricating an individual byline.
 */
export function methodologyArticleSchema(opts: {
  /** Page title — e.g. "Citation Discipline" or "Methodology" */
  headline: string;
  /** Page description — e.g. metadata.description */
  description: string;
  /** Canonical URL — e.g. "https://sourcescore.org/methodology/citation-discipline/" */
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    datePublished: methodologyVersion.published,
    dateModified: methodologyVersion.lastReviewed,
    author: {
      "@type": "Organization",
      name: "SourceScore",
      url: "https://sourcescore.org",
    },
    publisher: {
      "@type": "Organization",
      name: "SourceScore",
      url: "https://sourcescore.org",
      logo: {
        "@type": "ImageObject",
        url: "https://sourcescore.org/logo-wordmark.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url,
    },
    isPartOf: {
      "@type": "TechArticle",
      name: `SourceScore Methodology v${methodologyVersion.version}`,
      url: "https://sourcescore.org/methodology/",
    },
  };
}
