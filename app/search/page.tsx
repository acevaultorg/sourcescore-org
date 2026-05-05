import type { Metadata } from "next";
import { sources } from "@/data/sources";
import { gradeColorClass, gradeSurfaceClass } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: "Search sources — SourceScore" },
  description:
    "Search 50 hand-scored sources by name, domain, category, or grade. Instant filter, no signup.",
  alternates: { canonical: "https://sourcescore.org/search/" },
};

// Pure-static search page. We render every source row at build time +
// embed all 50 records as JSON in a <script>; a small inline script
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
      <div className="text-eyebrow text-brand mb-3">Search · 50 sources indexed</div>
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
          placeholder="Try: wikipedia, reuters, government, A+, .gov, …"
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
              <a href={`/source/${s.slug}/`} className="font-semibold text-text hover:text-brand">
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

      <p
        id="ss-empty"
        className="hidden text-center py-12 text-muted text-body"
      >
        No sources match your search. Try a different keyword or browse{" "}
        <a href="/sources/" className="text-brand hover:underline">all sources</a>.
      </p>

      {/* Inline filter script — pure DOM, no framework */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var input = document.getElementById('ss-search');
              var rows = document.querySelectorAll('.ss-row');
              var count = document.getElementById('ss-count');
              var empty = document.getElementById('ss-empty');
              if (!input || !rows.length) return;

              // Pre-fill from ?q= URL param so deep-links work
              var params = new URLSearchParams(window.location.search);
              var q0 = params.get('q');
              if (q0) input.value = q0;

              function filter() {
                var q = (input.value || '').trim().toLowerCase();
                var visible = 0;
                rows.forEach(function(row) {
                  if (!q) {
                    row.style.display = '';
                    visible++;
                    return;
                  }
                  var hit =
                    row.dataset.name.indexOf(q) >= 0 ||
                    row.dataset.domain.indexOf(q) >= 0 ||
                    row.dataset.cat.indexOf(q) >= 0 ||
                    row.dataset.grade.indexOf(q) >= 0 ||
                    row.dataset.summary.indexOf(q) >= 0;
                  row.style.display = hit ? '' : 'none';
                  if (hit) visible++;
                });
                if (count) {
                  count.textContent = q
                    ? visible + ' of ${sources.length} sources'
                    : '${sources.length} sources';
                }
                if (empty) empty.style.display = (visible === 0 && q) ? 'block' : 'none';
              }

              input.addEventListener('input', filter);
              filter();
            })();
          `,
        }}
      />
    </article>
  );
}
