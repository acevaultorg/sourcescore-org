import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Clarity } from "@/components/Clarity";
import { ClarityRouteTagger } from "@/components/ClarityRouteTagger";
import { ClarityClickListener } from "@/components/ClarityClickListener";
import { WebVitals } from "@/components/WebVitals";
import { ScrollDepth } from "@/components/ScrollDepth";
import { MobileNav } from "@/components/MobileNav";

// Google AdSense client ID. Env-var override available for per-site
// AdSense accounts; fleet-default is the operator's primary account
// (same ID used on holdlens.com + readinglist.school + readminute.com +
// fermentcalc.com). Hardcoded fallback because the AdSense client ID
// is fully public (exposed in served HTML) and CF Pages env var wiring
// requires dashboard access — fallback ships the snippet without that.
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7449214764048186";

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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  verification: {
    // Set NEXT_PUBLIC_GSC_VERIFICATION in env to a value like
    // "abc123XYZ..." (the content from GSC's HTML-tag verification step).
    // When unset (e.g. local dev), the meta tag is omitted.
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
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
        {/* Resource hints — saves DNS+TLS+TCP roundtrip for first hit to each
            third-party origin used on most pages. Cost: 4 cheap DNS lookups
            on initial page load; benefit: ~100-300ms faster first-contentful
            paint when the script/image actually fires. Borrowed from
            readstacks fleet pattern (rules/cross-project-learning.md L4). */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://plausible.io" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        {/* Organization JSON-LD — applies site-wide for LLM-citation fitness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://sourcescore.org/#organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
              description:
                "Score any source on Discipline, Modern Reference fitness, and Citation Velocity. The reference index for AI-citation quality.",
              logo: "https://sourcescore.org/logo-wordmark.svg",
              // Entity-coherence per Aleyda Solis #3 Recognizable + #7
              // Credible. Public surfaces where SourceScore + maintainers
              // are verifiable.
              sameAs: [
                "https://gitlab.com/acevault-lab",
                "https://dev.to/paulomdevries",
              ],
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
        <Clarity />
        {/* Google AdSense — verification snippet. AdSense application
            requires this loaded on every page in <head> before review.
            ADSENSE_CLIENT env-var-conditional; fleet-default fallback. */}
        {ADSENSE_CLIENT ? (
          <script
            async
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        ) : null}

        {/* llms.txt advertise per `rules/bot-harvest.md` Day-1 manifest spec.
            sourcescore is the heaviest bot-traffic site in the fleet
            (3,840 AI crawls/30d per fleet/LEARNED.md) — explicit head signal
            helps Anthropic, OpenAI, Perplexity prioritize the manifest. */}
        <link rel="llms" type="text/plain" href="/llms.txt" />
        {/* Atom/RSS feed discovery — RSS readers, LLM crawlers, and Google
            Reader-class aggregators auto-detect these. Borrowed from
            readstacks.com layout pattern. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="SourceScore — Blog (RSS)"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="SourceScore — VERITAS verified claims (RSS)"
          href="/claims/feed.xml"
        />
        {/* JSON twin discoverability — LLM crawlers following Aleyda Solis
            10-char #4 Extractable prefer structured JSON over HTML. */}
        <link
          rel="alternate"
          type="application/json"
          title="SourceScore — Source catalog (JSON)"
          href="/api/sources.json"
        />
        <link
          rel="alternate"
          type="application/json"
          title="SourceScore VERITAS — Claim catalog (JSON)"
          href="/api/v1/claims.json"
        />
        {/* OpenAPI 3.1 spec for SDK generators (openapi-typescript,
            openapi-generator, swagger-codegen). Fleet pattern via txtfeed. */}
        <link
          rel="alternate"
          type="application/json"
          title="SourceScore VERITAS — OpenAPI 3.1 spec"
          href="/api/v1/openapi.json"
        />
      </head>
      <body className="bg-bg text-text min-h-screen flex flex-col antialiased">
        <WebVitals />
        <ScrollDepth />
        <ClarityRouteTagger />
        <ClarityClickListener />
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
            className="inline-flex items-center justify-center w-7 h-7 rounded-btn bg-surface-brand border border-brand/30 text-brand"
          >
            {/* Mark v2 — 3 ascending bars (Discipline · Modern Reference · Velocity)
                + score-dot (the measured outcome) */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <rect x="3"  y="15" width="4" height="6"  rx="1" opacity="0.45"/>
              <rect x="10" y="11" width="4" height="10" rx="1" opacity="0.72"/>
              <rect x="17" y="6"  width="4" height="15" rx="1"/>
              <circle cx="19" cy="3" r="1.6"/>
            </svg>
          </span>
          <span className="font-semibold tracking-tight">SourceScore</span>
        </a>
        {/* Desktop nav — md+ (768px). Mobile users get the hamburger
            below to restore visibility of items previously hidden by
            sm:/md:/lg: breakpoints. Modern Reference is one of the 4
            primary scoring sub-tools — must be reachable on every viewport. */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-body-sm">
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
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors"
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
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors"
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
            <span className="ml-1">Search</span>
          </a>
          <a
            href="/methodology/"
            className="px-3 py-1.5 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors hidden lg:inline-block"
          >
            Methodology
          </a>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-body-sm">
        <div>
          <div className="text-text font-semibold mb-2">SourceScore</div>
          <p className="text-muted leading-relaxed">
            Source-rating reference + VERITAS signed-claim API. Two
            surfaces, one trust layer for AI-era citation.
          </p>
          <p className="mt-3 text-muted leading-relaxed">
            <a
              href="https://citationdesk.com/tools/citation-readiness/"
              target="_blank"
              rel="noopener"
              data-clarity-upgrade="citationdesk-cta-footer"
              className="hover:text-text plausible-event-name=citationdesk_cta plausible-event-source=footer"
            >
              Sister product:{" "}
              <span className="text-brand">CitationDesk</span> — is your own site
              cited by AI? ↗
            </a>
          </p>
        </div>
        <div>
          <div className="text-text font-semibold mb-2">VERITAS API</div>
          <ul className="space-y-1 text-muted">
            <li><a href="/quickstart/" className="hover:text-text">Quickstart</a></li>
            <li><a href="/playground/" className="hover:text-text">Playground</a></li>
            <li><a href="/claims/" className="hover:text-text">Claim catalog</a></li>
            <li><a href="/topics/" className="hover:text-text">Topics</a></li>
            <li><a href="/use-cases/" className="hover:text-text">Use cases</a></li>
            <li><a href="/comparisons/" className="hover:text-text">Comparisons</a></li>
            <li><a href="/docs/" className="hover:text-text">API docs</a></li>
            <li><a href="/docs/integrations/" className="hover:text-text">Integrations</a></li>
            <li><a href="/pricing/" className="hover:text-text">Pricing</a></li>
            <li><a href="/api-access/" className="hover:text-text">Request API access</a></li>
            <li><a href="/blog/" className="hover:text-text">Blog</a></li>
            <li><a href="/changelog/" className="hover:text-text">Changelog</a></li>
          </ul>
        </div>
        <div>
          <div className="text-text font-semibold mb-2">Reference</div>
          <ul className="space-y-1 text-muted">
            <li><a href="/" className="hover:text-text">SourceScore Index</a></li>
            <li><a href="/discipline/" className="hover:text-text">Citation Discipline</a></li>
            <li><a href="/modern-reference/" className="hover:text-text">Modern Reference</a></li>
            <li><a href="/velocity/" className="hover:text-text">Citation Velocity</a></li>
            <li><a href="/sources/" className="hover:text-text">All sources</a></li>
            <li><a href="/grade/" className="hover:text-text">By grade (A+ → F)</a></li>
            <li><a href="/best/" className="hover:text-text">Best-of lists</a></li>
          </ul>
        </div>
        <div>
          <div className="text-text font-semibold mb-2">Trust</div>
          <ul className="space-y-1 text-muted">
            <li><a href="/methodology/" className="hover:text-text">Methodology</a></li>
            <li><a href="/glossary/" className="hover:text-text">Glossary</a></li>
            <li><a href="/security/" className="hover:text-text">Security</a></li>
            <li><a href="/about/" className="hover:text-text">About</a></li>
            <li><a href="/contact/" className="hover:text-text">Contact</a></li>
            <li><a href="/privacy/" className="hover:text-text">Privacy</a></li>
            <li><a href="/terms/" className="hover:text-text">Terms</a></li>
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
