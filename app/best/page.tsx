import type { Metadata } from "next";
import { bestLists } from "@/data/best-lists";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "Best-of lists — SourceScore" },
  description:
    "Curated 'best X for AI citation' lists from the SourceScore Index — best news sources, peer-reviewed journals, government primary data, health authorities, reference works, and more.",
  alternates: { canonical: "https://sourcescore.org/best/" },
};

export default function BestLandingPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Best lists", url: "https://sourcescore.org/best/" },
            ])
          ),
        }}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-caption text-dim mb-6 flex gap-2">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span aria-hidden="true">/</span>
        <span className="text-muted">Best lists</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">{bestLists.length} curated lists · evergreen</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Best-of lists</h1>
      <p className="text-body-lg text-muted leading-relaxed max-w-2xl mb-10">
        Curated &quot;best X for AI citation&quot; lists ranked from the SourceScore Index. Every list is
        evergreen, automatically regenerated on dataset updates, and based on a published ranking
        signal — no editorial promotion beyond the criterion stated on each page.
      </p>

      {/* Card grid */}
      <section className="grid sm:grid-cols-2 gap-4">
        {bestLists.map((b) => {
          const items = b.select();
          const top = items[0];
          return (
            <a
              key={b.slug}
              href={`/best/${b.slug}/`}
              className="block p-5 rounded-card-lg border border-border bg-panel hover:bg-panel-hi transition-colors"
            >
              <div className="text-eyebrow text-brand mb-1">{b.intent}</div>
              <div className="font-semibold text-text text-heading-3 mb-2">{b.title}</div>
              <p className="text-body-sm text-muted leading-snug mb-3 line-clamp-3">
                {b.description}
              </p>
              <div className="flex items-center gap-2 text-caption text-dim font-mono">
                <span>{items.length} sources</span>
                {top && (
                  <>
                    <span>·</span>
                    <span>#1: {top.name}</span>
                  </>
                )}
              </div>
            </a>
          );
        })}
      </section>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-3">Methodology</h2>
        <p className="text-body text-muted leading-relaxed mb-4">
          Every list ranks sources by a specific selection criterion (Index score, sub-score,
          category filter, or composite). The selection criterion is stated explicitly on each
          list page — the rank is the rank, no editorial reordering.
        </p>
        <p className="text-body text-muted leading-relaxed">
          The full scoring methodology is at{" "}
          <a href="/methodology/" className="text-brand hover:underline">/methodology/</a>; the
          composite-Index rubric with worked examples is at{" "}
          <a href="/methodology/sourcescore-index/" className="text-brand hover:underline">
            /methodology/sourcescore-index/
          </a>
          .
        </p>
      </section>
    </article>
  );
}
