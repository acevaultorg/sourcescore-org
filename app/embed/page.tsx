import type { Metadata } from "next";
import { sources } from "@/data/sources";

export const metadata: Metadata = {
  title: "Embed SourceScore — paste a score on your site",
  description:
    "Embed any source's SourceScore Index on your own site with a single iframe snippet. Free, no signup, with attribution.",
  alternates: { canonical: "https://sourcescore.org/embed/" },
};

export default function EmbedDocsPage() {
  // Pre-generated 5 popular embed snippets so the page is useful even
  // without JS. The interactive selector below lets visitors generate
  // any of the 50.
  const featured = ["wikipedia-en", "sec-gov", "nyt", "reuters", "the-lancet"]
    .map((slug) => sources.find((s) => s.slug === slug)!)
    .filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-eyebrow text-brand mb-3">Distribution</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Embed any SourceScore on your site
      </h1>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        Drop a small iframe on your blog, dashboard, or research page to display
        any source&apos;s live SourceScore. Free, no signup, attribution included.
        Each embed updates automatically as the methodology refreshes.
      </p>

      <section className="mb-10">
        <h2 className="text-heading-2 font-bold mb-4">Quick snippet (any source)</h2>
        <p className="text-body text-muted mb-3">
          Replace <code className="font-mono text-brand">[slug]</code> with any source slug
          (see <a href="/sources/" className="text-brand hover:underline">all sources</a> for the full list).
        </p>
        <pre className="p-4 rounded-card border border-border bg-panel text-body-sm font-mono text-text overflow-x-auto leading-relaxed">
          {`<iframe
  src="https://sourcescore.org/embed/[slug]/"
  width="100%"
  height="380"
  loading="lazy"
  style="border:0;max-width:480px;"
  title="SourceScore"></iframe>`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-heading-2 font-bold mb-5">Featured embeds (copy + paste)</h2>
        <div className="space-y-4">
          {featured.map((s) => (
            <div key={s.slug} className="rounded-card border border-border bg-panel p-4">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <a
                  href={`/source/${s.slug}/`}
                  className="font-semibold text-text hover:text-brand"
                >
                  {s.name}
                </a>
                <span className="text-caption text-dim font-mono">{s.domain}</span>
              </div>
              <pre className="p-3 rounded-card border border-border bg-bg text-caption font-mono text-text overflow-x-auto leading-relaxed">
                {`<iframe src="https://sourcescore.org/embed/${s.slug}/" width="100%" height="380" loading="lazy" style="border:0;max-width:480px;" title="SourceScore: ${s.name}"></iframe>`}
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-4">
        <h2 className="text-heading-2 font-bold">Why embed</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">Editorial trust</strong> — show readers that
            you&apos;re citing a source with a transparent quality grade.
          </li>
          <li>
            <strong className="text-text">Always fresh</strong> — embeds reflect the
            current methodology version automatically.
          </li>
          <li>
            <strong className="text-text">Lightweight</strong> — ~6 KB rendered, no
            external JS, no third-party tracking from the embed itself.
          </li>
          <li>
            <strong className="text-text">No signup</strong> — paste and ship.
          </li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">Recommended uses</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>Blog posts citing an external source — embed alongside the citation.</li>
          <li>Research dashboards listing data sources with quality grades.</li>
          <li>Comparison articles (&ldquo;X vs Y&rdquo;) — embed both scores side-by-side.</li>
          <li>Newsletter sidebars showing today&apos;s most-cited sources.</li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">License + attribution</h2>
        <p className="text-muted">
          Embeds are free for editorial use. The widget always links back to the
          canonical SourceScore page so readers can see the full methodology and signals
          behind each score. No attribution removal, no white-labeling.
        </p>
      </section>
    </article>
  );
}
