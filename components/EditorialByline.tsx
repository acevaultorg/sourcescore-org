import type { Source } from "@/lib/types";

// Byline + sources block for the /compare/* family.
//
// Why this exists: the comparison templates published scores with no visible
// accountability line and no statement of what the scores were derived from.
// Both are real EEAT gaps — a reader had no way to see who stands behind the
// judgement or which artefacts it was read from without leaving the page.
//
// HONESTY RULE: no person is invented here. The byline names the entity the
// site already publishes at /about/#person-editorial-lead ("SourceScore
// Editorial Team", the @id every /blog/, /use-cases/ and /comparisons/ page
// already points its author/editor field at) and the publisher /about/ already
// names in prose ("published by Caslon Media, a registered Dutch company").
// Nothing here asserts a claim the site does not already make elsewhere.

/** The entity id every author/editor field on this site resolves to. */
export const EDITORIAL_PERSON_ID =
  "https://sourcescore.org/about/#person-editorial-lead";
export const EDITORIAL_PERSON_NAME = "SourceScore Editorial Team";

/** JSON-LD editor node, identical in shape to the one on /blog/* and /use-cases/*. */
export const editorialEditorNode = {
  "@type": "Person",
  "@id": EDITORIAL_PERSON_ID,
  name: EDITORIAL_PERSON_NAME,
  url: "https://sourcescore.org/about/",
} as const;

/** ISO date → "28 Apr 2026". Returns the raw string if it is not parseable. */
function fmtDate(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Date(t).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * The freshness FLOOR of a comparison: a pair is only as current as its
 * least-recently-verified side, so we show the older of the two dates.
 */
export function verifiedFloor(a: Source, b: Source): string {
  return a.verified <= b.verified ? a.verified : b.verified;
}

/**
 * Visible accountability line. Carries rel="author" and a class containing
 * "byline" so the responsible entity is machine-readable as well as legible.
 */
export function EditorialByline({
  a,
  b,
  className = "",
}: {
  a: Source;
  b: Source;
  className?: string;
}) {
  const verified = verifiedFloor(a, b);
  return (
    <div
      className={`ss-byline flex flex-wrap items-baseline gap-x-2 gap-y-1 text-caption text-dim ${className}`}
    >
      <span>
        By{" "}
        <a
          rel="author"
          href="/about/"
          className="ss-byline-author text-muted hover:text-brand underline decoration-border underline-offset-2"
        >
          the {EDITORIAL_PERSON_NAME}
        </a>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        Published by{" "}
        <a
          href="https://caslonmedia.com/"
          rel="publisher noopener"
          className="text-muted hover:text-brand underline decoration-border underline-offset-2"
        >
          Caslon Media
        </a>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        Scored against{" "}
        <a
          href="/methodology/"
          className="text-muted hover:text-brand underline decoration-border underline-offset-2"
        >
          methodology {a.methodologyVersion}
        </a>
      </span>
      <span aria-hidden="true">·</span>
      <span>
        Scores last verified{" "}
        <time dateTime={verified}>{fmtDate(verified)}</time>
      </span>
    </div>
  );
}

const RUBRIC_PAGES: Array<{ href: string; label: string }> = [
  { href: "/methodology/sourcescore-index/", label: "SourceScore Index" },
  { href: "/methodology/citation-discipline/", label: "Citation Discipline" },
  { href: "/methodology/modern-reference/", label: "Modern Reference" },
  { href: "/methodology/citation-velocity/", label: "Citation Velocity" },
];

/**
 * What this page's scores were read from: the two live sources under
 * evaluation (the primary artefacts), the published rubric that turns those
 * observations into numbers, and the machine-readable twin of this record.
 * Every href here is a real, reachable page — no placeholder references.
 */
export function ComparisonSources({
  a,
  b,
  apiPath,
}: {
  a: Source;
  b: Source;
  /** e.g. "/api/compare/acm-vs-arxiv.json" */
  apiPath: string;
}) {
  const rows: Array<{ source: Source }> = [{ source: a }, { source: b }];
  return (
    <section
      id="sources"
      aria-labelledby="sources-heading"
      className="ss-sources border-t border-border pt-8 mb-12"
    >
      <h2 id="sources-heading" className="text-heading-2 font-bold mb-3">
        Sources &amp; references
      </h2>
      <p className="text-body-sm text-muted leading-relaxed mb-4 max-w-3xl">
        Every score on this page is read from the two publications below and
        graded against the published rubric. No score is bought, estimated or
        supplied by the source being scored.
      </p>
      <ul className="space-y-3 text-body-sm">
        {rows.map(({ source }) => (
          <li key={source.slug} className="text-muted leading-relaxed">
            <span className="text-dim">Source evaluated — </span>
            <a
              href={`https://${source.domain}`}
              rel="nofollow noopener"
              className="text-text font-semibold hover:text-brand underline decoration-border underline-offset-2"
            >
              {source.name} ({source.domain})
            </a>
            <span className="text-dim">
              {" "}
              · verified <time dateTime={source.verified}>{fmtDate(source.verified)}</time> ·{" "}
            </span>
            <a
              href={`/source/${source.slug}/`}
              className="hover:text-brand underline decoration-border underline-offset-2"
            >
              full scoring record
            </a>
          </li>
        ))}
        <li className="text-muted leading-relaxed">
          <span className="text-dim">Scoring rubric — </span>
          {RUBRIC_PAGES.map((p, i) => (
            <span key={p.href}>
              {i > 0 && <span className="text-dim">, </span>}
              <a
                href={p.href}
                className="hover:text-brand underline decoration-border underline-offset-2"
              >
                {p.label}
              </a>
            </span>
          ))}
          <span className="text-dim"> (methodology {a.methodologyVersion})</span>
        </li>
        <li className="text-muted leading-relaxed">
          <span className="text-dim">Machine-readable record — </span>
          <a
            href={apiPath}
            className="font-mono hover:text-brand underline decoration-border underline-offset-2"
          >
            {apiPath}
          </a>
        </li>
      </ul>
    </section>
  );
}
