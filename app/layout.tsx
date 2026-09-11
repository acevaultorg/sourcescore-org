import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Clarity } from "@/components/Clarity";
import { ClarityRouteTagger } from "@/components/ClarityRouteTagger";
import { ClarityClickListener } from "@/components/ClarityClickListener";
import { MobileNav } from "@/components/MobileNav";

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
        {/* Impact.com channel ownership verification (publisher account
            7598036, Caslon Media). Emitted as a literal tag rather than via
            Next's `metadata.verification`/`other` because Impact's crawler
            reads the non-standard `value` attribute, and the Metadata API
            would rewrite it to `content`. Do not "fix" that to content=. */}
        {/* Spread-cast because React's MetaHTMLAttributes type has no `value`
            prop (TS2322) — the attribute is still emitted verbatim at runtime,
            confirmed via renderToStaticMarkup. */}
        <meta {...({ name: "impact-site-verification", value: "5597c6c3-c5cf-4b9a-b559-785e206b5533" } as React.MetaHTMLAttributes<HTMLMetaElement>)} />
        {/* Resource hints — saves DNS+TLS+TCP roundtrip for first hit to each
            third-party origin used on most pages. Cost: 2 cheap DNS lookups
            on initial page load; benefit: ~100-300ms faster first-contentful
            paint when the script/image actually fires. Borrowed from
            readstacks fleet pattern (rules/cross-project-learning.md L4). */}
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
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
              // Credible. Only PUBLICLY RESOLVABLE surfaces belong here — a
              // sameAs that 403s is an unverifiable identity claim and hurts
              // the signal it exists to provide. gitlab.com/acevault-lab was
              // removed 2026-08-11: the group is private (403 anonymously,
              // verified against a public control group).
              sameAs: [
                "https://caslonmedia.com/",
                "https://dev.to/paulomdevries",
              ],
              // Publisher attribution — lets partners and networks verify
              // common ownership across the Caslon Media network.
              parentOrganization: {
                "@type": "Organization",
                "@id": "https://caslonmedia.com/#organization",
                name: "Caslon Media",
                url: "https://caslonmedia.com/",
              },
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
        {/* FLEET-AGENT GATE — keeps our own verification traffic out of Clarity + GA4, so
            session/engagement numbers describe humans. Ported from readstacks /
            colorcombinations 2026-08-06.

            Visit any page once with ?__fa=1 from an agent-driven browser; persists in
            localStorage. Undo: localStorage.removeItem('__fleet_agent').
            Covers Chrome MCP too (real Chrome UA, webdriver false — invisible to any UA
            test, and it is the fleet's default verification browser), and the in-app
            Browser pane, where navigator.webdriver was MEASURED false. Also excludes the
            operator's own self-visits.

            SELF-DECLARATION, NOT UA-SNIFFING — deliberately. A UA-matching version was
            written and reverted on readstacks: matching a vendor client string drops real
            humans who browse in that client, silently and uncountably. This site's whole
            thesis is AI-assistant citation traffic, so an invisible UNDER-count there is
            the worst available error. Do not reintroduce.

            ⚠️ The GA4 id is HARDCODED here on purpose, matching the loader below. The
            readstacks original emits its kill-switch only when an env var is set, which is
            safe there because GA4 also only loads under that var. Here GA4 loads from a
            literal id, so an env-conditioned copy would emit NO ga-disable while GA4 still
            loaded — a gate that reports success and suppresses nothing.

            Ordering: the async gtag.js below dispatches no hit by itself; the first hit is
            the inline gtag('config'), which runs after this. ga-disable is read per-hit. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var a=false;try{if(location.search.indexOf("__fa=1")>-1){localStorage.setItem("__fleet_agent","1");}a=localStorage.getItem("__fleet_agent")==="1";}catch(e){}if(navigator.webdriver===true||(navigator.userAgent||"").indexOf("HeadlessChrome")>-1){a=true;}if(a){window.__FLEET_AGENT__=1;document.documentElement.setAttribute("data-google-analytics-opt-out","");window["ga-disable-G-WZ82M72J06"]=true;}})();`,
          }}
        />
        <Clarity />
        {/* Google Analytics 4 (added 2026-07-07 per operator directive; anonymize_ip).
            Raw <script> for HTML-visible signal, matching the Clarity snippet. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WZ82M72J06" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500,region:['BE','BG','CZ','DK','DE','EE','IE','EL','GR','ES','FR','HR','IT','CY','LV','LT','LU','HU','MT','NL','AT','PL','PT','RO','SI','SK','FI','SE','IS','LI','NO','GB','CH','US-CA']});gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted'});gtag('js',new Date());gtag('config','G-WZ82M72J06',{anonymize_ip:true});`,
          }}
        />
        {/* No Google AdSense on SourceScore — removed 2026-06-26 (autopilot).
            Binding strategy (board anchors mqkx5yh8q913j0 + mpv4arecshtbzw):
            SourceScore is a FREE citation/authority asset → NO ads. The
            shared fleet AdSense pub ID on a 480:1-bot, 1,172-programmatic-page
            site is a Gate-0 / invalid-traffic cascade risk to the EARNING
            fleet sites (holdlens / readinglist / readminute / fermentcalc)
            that share the account. Stale verification snippet from the
            since-abandoned AdSense application (Gate 0 = DO-NOT-SUBMIT). */}

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
            href="/check/"
            className="px-3 py-1.5 rounded-btn bg-surface-brand border border-brand/30 text-brand font-semibold hover:bg-brand/15 transition-colors"
          >
            Check a source
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
              rel="nofollow noopener"
              data-clarity-upgrade="citationdesk-cta-footer"
              className="hover:text-text" data-event="citationdesk_cta" data-event-source="footer"
            >
              Sister product:{" "}
              <span className="text-brand">CitationDesk</span> — is your own site
              cited by AI? ↗
            </a>
          </p>
          <p className="mt-2 text-muted leading-relaxed">
            <a
              href="https://secfilingdex.com/"
              target="_blank"
              rel="nofollow noopener"
              className="hover:text-text"
            >
              Also from Caslon Media:{" "}
              <span className="text-brand">SecFilingDex</span> — SEC filing search ↗
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
            <li><a href="/for-ai/" className="hover:text-text">For AI assistants</a></li>
            <li><a href="/glossary/" className="hover:text-text">Glossary</a></li>
            <li><a href="/security/" className="hover:text-text">Security</a></li>
            <li><a href="/about/" className="hover:text-text">About</a></li>
            <li><a href="/contact/" className="hover:text-text">Contact</a></li>
            <li><a href="/partners/" className="hover:text-text">Partner with us</a></li>
            <li><a href="/disclosure/" className="hover:text-text">Affiliate disclosure</a></li>
            <li><a href="/privacy/" className="hover:text-text">Privacy</a></li>
            <li><a href="/terms/" className="hover:text-text">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-caption text-dim flex flex-col sm:flex-row justify-between gap-2">
          <span>
            © {new Date().getFullYear()} SourceScore. Methodology v0.1. Published by{" "}
            <a href="https://caslonmedia.com/" className="hover:text-text underline underline-offset-2">
              Caslon Media
            </a>
            , Amsterdam.
          </span>
          <span className="font-mono">sourcescore.org</span>
        </div>
      </div>
    </footer>
  );
}
