import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { gradeColorClass, gradeSurfaceClass } from "@/lib/types";
import { SourceSearchFilter } from "@/components/SourceSearchFilter";

export const metadata: Metadata = {
  title: { absolute: "Search sources — SourceScore" },
  description: `Search ${sources.length} hand-scored sources by name, domain, category, or grade. Instant filter, no signup.`,
  alternates: { canonical: "https://sourcescore.org/search/" },
};

// Pure-static search page. We render every source row at build time +
// embed all records as JSON in a <script>; a small inline script
// filters the visible rows on input. Zero backend, zero hydration cost.

const indexData = sources.map((s) => ({
  slug: s.slug,
  name: s.name,
  domain: s.domain,
  category: s.category,
  summary: s.summary,
  index: s.scores.index.value,
  grade: s.scores.index.grade,
  discipline: s.scores.discipline.value,
  modernReference: s.scores.modernReference.value,
  velocity: s.scores.velocity.value,
}));

export default function SearchPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-eyebrow text-brand mb-3">Search · {sources.length} sources indexed</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Search sources
      </h1>
      <p className="text-body-lg text-muted leading-relaxed mb-8 max-w-2xl">
        Filter by name, domain, category, or grade. Results update as you type.
      </p>

      {/* Search input — vanilla input, no JS framework needed */}
      <div className="mb-6">
        <input
          id="ss-search"
          type="search"
          placeholder="Paste a URL (e.g. https://reuters.com/…) or search: wikipedia, .gov, A+ …"
          autoComplete="off"
          className="w-full px-4 py-3 rounded-card border border-border bg-panel text-text placeholder-dim focus:border-brand focus:outline-none transition-colors"
          aria-label="Search sources"
        />
        <div className="flex items-center justify-between mt-2 text-caption text-dim">
          <span id="ss-count">{sources.length} sources</span>
          <span className="hidden sm:inline">Tip: filter by grade like &quot;A+&quot; or category like &quot;Health&quot;</span>
        </div>
      </div>

      <ol id="ss-results" className="space-y-2">
        {indexData.map((s, i) => (
          <li
            key={s.slug}
            data-name={s.name.toLowerCase()}
            data-domain={s.domain.toLowerCase()}
            data-cat={s.category.toLowerCase()}
            data-grade={s.grade.toLowerCase()}
            data-summary={s.summary.toLowerCase()}
            className="ss-row flex items-center gap-4 p-3 rounded-card border border-border bg-panel hover:bg-panel-hi transition-colors"
          >
            <span className="text-caption text-dim font-mono w-6 text-right">#{i + 1}</span>
            <div className="flex-1 min-w-0">
              <a
                href={`/source/${s.slug}/`}
                data-event="source_search_result_click"
                data-event-source-slug={s.slug}
                className="font-semibold text-text hover:text-brand"
              >
                {s.name}
              </a>
              <div className="text-caption text-dim font-mono">
                {s.domain} · {s.category}
              </div>
              <div className="text-body-sm text-muted leading-snug mt-1 line-clamp-1">
                {s.summary}
              </div>
            </div>
            <span
              className={`shrink-0 inline-flex items-center gap-2 rounded-pill border font-mono font-semibold px-3 py-1.5 text-body-sm ${gradeSurfaceClass(s.grade)} ${gradeColorClass(s.grade)}`}
            >
              <span>{s.grade}</span>
              <span className="text-text/60 font-normal">·</span>
              <span>{s.index}</span>
            </span>
          </li>
        ))}
      </ol>

      {/* Empty state — keyword miss */}
      <p
        id="ss-empty"
        className="hidden text-center py-12 text-muted text-body"
      >
        No sources match your search. Try a different keyword or browse{" "}
        <a href="/sources/" className="text-brand hover:underline">all sources</a>.
      </p>

      {/* Empty state — URL/domain pasted that isn't in the index yet.
          Honest "not scored" state (no fabricated score) per the SourceScore
          credibility premise: closest action paths instead of a fake grade. */}
      <div
        id="ss-empty-url"
        className="hidden py-10 px-5 rounded-card-lg border border-border bg-panel text-center"
      >
        <div className="text-eyebrow text-dim mb-2">Not in the index yet</div>
        <p className="text-body-lg text-text mb-1">
          <span id="ss-empty-domain" className="font-mono text-brand">this source</span>{" "}
          isn&apos;t scored yet.
        </p>
        <p className="text-body-sm text-muted mb-5 max-w-md mx-auto">
          SourceScore covers {sources.length} hand-scored sources today. We don&apos;t show a grade
          we haven&apos;t verified. If this is your site, run a free page-level readiness audit now;
          requesting an index review is separate.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <a
            id="ss-citationdesk"
            href="https://citationdesk.com/tools/citation-readiness/?utm_source=sourcescore&utm_medium=referral&utm_campaign=owned-ai-visibility&utm_content=search-unknown"
            target="_blank"
            rel="nofollow noopener"
            data-event="citationdesk_cta"
            data-event-source="search-unknown"
            data-event-intent="unscored-own-domain"
            data-event-prefilled="no"
            data-clarity-upgrade="citationdesk-cta-search-unknown"
            className="px-4 py-2 rounded-pill border border-brand/40 bg-surface-brand text-body-sm font-semibold text-brand hover:underline"
          >
            Audit my site free →
          </a>
          <a
            id="ss-source-request"
            href="mailto:hello@caslonmedia.com?subject=SourceScore%20index%20review%20request"
            data-event="source_inclusion_request"
            data-event-source="search-unknown"
            className="px-4 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm text-muted hover:text-text"
          >
            Request index review
          </a>
          <a href="/ai-visibility-tools/" data-event="ai_visibility_guide_click" data-event-source="search-unknown" className="px-4 py-2 rounded-pill border border-border bg-panel hover:bg-panel-hi text-body-sm text-muted hover:text-text">
            Compare monitoring tools
          </a>
        </div>
      </div>

      {/* Client-side filter runs post-hydration (useEffect) — a raw inline
          <script> here was silently wiped by React hydration, killing the
          filter. See components/SourceSearchFilter.tsx. */}
      <SourceSearchFilter total={sources.length} />

    </article>
  );
}
