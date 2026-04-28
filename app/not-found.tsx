export default function NotFound() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="text-eyebrow text-brand mb-3">404</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Source not in the index</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-8">
        The source you&apos;re looking for isn&apos;t in our Day 1 sample. The production index
        will scale to 10,000+ sources via the same methodology.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="/"
          className="px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand hover:bg-brand/15 transition-colors text-body-sm font-semibold"
        >
          Back to the index
        </a>
        <a
          href="/sources/"
          className="px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-text transition-colors text-body-sm"
        >
          See all scored sources
        </a>
      </div>
    </article>
  );
}
