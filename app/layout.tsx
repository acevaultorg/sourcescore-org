import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://sourcescore.org"),
  title: {
    default: "SourceScore — the AI-Citation Quality Index",
    template: "%s · SourceScore",
  },
  description:
    "Score any source on Discipline, Modern Reference fitness, and Citation Velocity. The reference index for AI-citation quality.",
  applicationName: "SourceScore",
  keywords: [
    "source quality index",
    "citation discipline score",
    "modern citation reference",
    "citation velocity tracker",
    "AI citation quality",
    "LLM citation",
    "fact-check ranking",
  ],
  authors: [{ name: "SourceScore" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sourcescore.org",
    siteName: "SourceScore",
    title: "SourceScore — the AI-Citation Quality Index",
    description:
      "Score any source on Discipline, Modern Reference fitness, and Citation Velocity.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SourceScore — the AI-Citation Quality Index",
    description:
      "Score any source on Discipline, Modern Reference fitness, and Citation Velocity.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Organization JSON-LD — applies site-wide for LLM-citation fitness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
              description:
                "Score any source on Discipline, Modern Reference fitness, and Citation Velocity. The reference index for AI-citation quality.",
              logo: "https://sourcescore.org/og.png",
            }),
          }}
        />
        {/* WebSite JSON-LD with SearchAction stub (search ships in Day 7) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SourceScore",
              url: "https://sourcescore.org",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://sourcescore.org/search/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Analytics />
      </head>
      <body className="bg-bg text-text min-h-screen flex flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-text hover:text-brand transition-colors"
          aria-label="SourceScore home"
        >
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center w-7 h-7 rounded-btn bg-surface-brand border border-brand/30 text-brand font-mono text-sm font-bold"
          >
            ★
          </span>
          <span className="font-semibold tracking-tight">SourceScore</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2 text-body-sm">
          <a
            href="/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors"
          >
            Index
          </a>
          <a
            href="/discipline/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors"
          >
            Discipline
          </a>
          <a
            href="/modern-reference/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors hidden sm:inline-block"
          >
            Modern&nbsp;Reference
          </a>
          <a
            href="/velocity/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors"
          >
            Velocity
          </a>
          <a
            href="/sources/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors hidden md:inline-block"
          >
            Sources
          </a>
          <a
            href="/compare/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors hidden lg:inline-block"
          >
            Compare
          </a>
          <a
            href="/search/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors"
            aria-label="Search sources"
          >
            <span aria-hidden="true">⌕</span>
            <span className="sr-only sm:not-sr-only sm:ml-1">Search</span>
          </a>
          <a
            href="/methodology/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors hidden lg:inline-block"
          >
            Methodology
          </a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-3 gap-8 text-body-sm">
        <div>
          <div className="text-text font-semibold mb-2">SourceScore</div>
          <p className="text-muted leading-relaxed">
            The reference index for AI-citation quality. Score Discipline, Modern Reference, and Velocity for any source.
          </p>
        </div>
        <div>
          <div className="text-text font-semibold mb-2">Sub-tools</div>
          <ul className="space-y-1 text-muted">
            <li><a href="/" className="hover:text-text">SourceScore Index</a></li>
            <li><a href="/discipline/" className="hover:text-text">Citation Discipline</a></li>
            <li><a href="/modern-reference/" className="hover:text-text">Modern Reference</a></li>
            <li><a href="/velocity/" className="hover:text-text">Citation Velocity</a></li>
          </ul>
        </div>
        <div>
          <div className="text-text font-semibold mb-2">Browse</div>
          <ul className="space-y-1 text-muted">
            <li><a href="/sources/" className="hover:text-text">All sources</a></li>
            <li><a href="/grade/" className="hover:text-text">By grade (A+ → F)</a></li>
            <li><a href="/best/" className="hover:text-text">Best-of lists</a></li>
            <li><a href="/methodology/" className="hover:text-text">Methodology</a></li>
            <li><a href="/about/" className="hover:text-text">About</a></li>
            <li><a href="/contact/" className="hover:text-text">Contact</a></li>
            <li><a href="/privacy/" className="hover:text-text">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-caption text-dim flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} SourceScore. Methodology v0.1.</span>
          <span className="font-mono">sourcescore.org</span>
        </div>
      </div>
    </footer>
  );
}
