// Broad-audience pillar #3 (2026-06-01, fastest-human-growth): targets the very
// high-volume student/writer query cluster "how to find reliable sources for a
// research paper / where to find credible sources / good sources for an essay".
// Best product fit of the three — the 130-source ranked Index IS the answer, so
// this pillar funnels the query straight into /sources/ + /category/. Distinct
// from pillar #1 (judging a KNOWN source) — this is about FINDING them.
// AEO-first: ≤45-word direct-answer lead + HowTo + FAQPage schema. Sister to
// /blog/how-to-tell-if-a-source-is-reliable/ + /blog/can-you-cite-chatgpt-ai-as-a-source/.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-06-01";
const TITLE = "How to find reliable sources for a research paper (without guessing)";
const SUBTITLE =
  "Start from source types that are reliable by construction — primary, peer-reviewed, official — search inside them, then verify each candidate on three signals before you cite. A faster way to find credible sources than trusting search rankings.";
const SLUG = "how-to-find-reliable-sources";
const CANONICAL = `https://sourcescore.org/blog/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: "How to find reliable sources for a research paper" },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: SUBTITLE, url: CANONICAL, type: "article", publishedTime: PUBLISHED },
  twitter: { card: "summary_large_image", title: TITLE, description: SUBTITLE },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: TITLE,
  description: SUBTITLE,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  mainEntityOfPage: CANONICAL,
  author: { "@type": "Organization", "@id": "https://sourcescore.org/#organization", name: "SourceScore", url: "https://sourcescore.org" },
  editor: { "@type": "Person", "@id": "https://sourcescore.org/about/#person-editorial-lead", name: "SourceScore Editorial Team", url: "https://sourcescore.org/about/" },
  publisher: { "@type": "Organization", "@id": "https://sourcescore.org/#organization", name: "SourceScore", logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" } },
  about: [
    { "@type": "Thing", name: "Reliable sources" },
    { "@type": "Thing", name: "Research paper" },
    { "@type": "Thing", name: "Credible sources" },
    { "@type": "Thing", name: "Finding sources" },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find reliable sources for a research paper",
  description: "Find credible sources by type-first, then verify each on three signals — instead of trusting whatever ranks first.",
  step: [
    { "@type": "HowToStep", name: "Decide what 'reliable' means for your claim", text: "Match the source type to the claim. A statistic needs an official dataset or peer-reviewed study; a definition needs a standards body or reference work; an event needs primary reporting or records. Knowing the right type narrows the search before you start." },
    { "@type": "HowToStep", name: "Start inside high-reliability source types", text: "Search where reliable sources concentrate: peer-reviewed databases (Google Scholar, PubMed, JSTOR), official records (.gov, statistical agencies, standards bodies), and primary documents — not the open web's top result. You skip most of the unreliable material by choosing the pool, not filtering it after." },
    { "@type": "HowToStep", name: "Verify each candidate on three signals", text: "Before citing, check the source's citation discipline (does credible work cite it; does it cite primary evidence?), modern reference (is it current, maintained, stable?), and citation velocity (are trusted others citing it now?). A source that passes all three is safe to build on." },
    { "@type": "HowToStep", name: "Trace every fact to its primary source", text: "Follow each claim to the original — the study, the dataset, the record — and cite that, not a blog or AI summary of it. If you can't reach a primary source, treat the claim as unverified." },
  ],
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What are reliable sources for a research paper?",
    a: "The most reliable are primary, peer-reviewed, and official sources: original research and datasets, peer-reviewed journal articles, official records and statistics, and standards bodies — because they're the evidence everything else cites. Reputable journalism and well-maintained reference works rank next. Within any category, reliability still depends on the source's citation discipline, freshness, and how actively credible others cite it.",
  },
  {
    q: "Where can I find credible sources online?",
    a: "Search inside high-reliability pools rather than the open web: Google Scholar, PubMed, and JSTOR for peer-reviewed work; .gov and statistical-agency sites for official data; standards bodies and primary documents for definitions and records. SourceScore ranks 130+ widely-used sources on reliability so you can pick a strong starting point by category instead of guessing.",
  },
  {
    q: "Are .org, .gov, and .edu sites reliable?",
    a: ".gov and most .edu domains are generally trustworthy because of who runs them, but the domain alone isn't proof — a .gov page can be outdated and a .edu page can be a student blog. .org is unrestricted: anyone can register one, so judge it on the evidence, not the suffix. Verify any candidate on the three signals (citation discipline, modern reference, citation velocity) regardless of its domain.",
  },
  {
    q: "Is Google Scholar a reliable source?",
    a: "Google Scholar is a reliable place to FIND sources, not a source itself. It indexes peer-reviewed and scholarly work, which raises the baseline quality of what you find — but you still cite the underlying paper, and you still check that paper is recent, well-cited, and from a credible venue. Treat Scholar as a high-quality search pool, then verify each result.",
  },
  {
    q: "How many sources do I need for a research paper?",
    a: "Quality and relevance matter more than a count — a paper supported by five strong primary sources beats one padded with twenty weak ones. Follow your assignment's minimum, but prioritize sources that are primary, current, and independently cited over sources added just to hit a number. Every factual claim should trace to a source you've verified.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function HowToFindReliableSourcesPost() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Blog", url: "https://sourcescore.org/blog/" },
              { name: "How to find reliable sources for a research paper", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">How to find reliable sources</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Guide · {PUBLISHED}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          How to find reliable sources for a research paper
        </h1>
        {/* Direct-answer lead (≤45 words) — featured-snippet / AI-Overview target */}
        <p className="ss-answer text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          Don&rsquo;t hunt for reliable sources one by one — <strong>start inside reliable
          source types</strong> (primary, peer-reviewed, official), search there, then{" "}
          <strong>verify each candidate on three signals</strong> before you cite it. Choosing
          the pool does most of the work; verifying finishes it.
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Pick the pool, don&rsquo;t filter the web</h2>
        <p>
          Most &ldquo;find reliable sources&rdquo; advice has you judge results one at a time
          after searching the open web — which is slow and puts the worst material in front of
          you first. Flip it: decide which <em>type</em> of source your claim needs, then search
          only where that type lives. You skip most unreliable material by choosing a better pool
          rather than filtering a bad one.
        </p>

        <h2>Match the source type to the claim</h2>
        <ul>
          <li><strong>A statistic or finding</strong> → an official dataset, statistical agency, or peer-reviewed study.</li>
          <li><strong>A definition or standard</strong> → a standards body or established reference work.</li>
          <li><strong>An event or record</strong> → primary reporting, official records, or original documents.</li>
          <li><strong>Expert interpretation</strong> → peer-reviewed scholarship or a recognized authority, cited.</li>
        </ul>
        <p>
          Knowing the right type narrows the search before you start — and tells you when a
          tempting-looking source is simply the wrong <em>kind</em> of source for the claim.
        </p>

        <h2>Where reliable sources concentrate</h2>
        <ul>
          <li><strong>Peer-reviewed work:</strong> Google Scholar, PubMed, JSTOR, your library&rsquo;s databases.</li>
          <li><strong>Official data &amp; records:</strong> government (.gov) sites, statistical agencies, standards bodies.</li>
          <li><strong>Primary documents:</strong> original studies, datasets, filings, and archives — not summaries of them.</li>
          <li><strong>Well-maintained reference works</strong> as a map to the primary sources above (use their citations, not the article itself).</li>
        </ul>

        <h2>Verify each candidate on three signals</h2>
        <p>
          Being in a good pool raises the odds, but doesn&rsquo;t guarantee any single source. Before
          you cite, run the same three-signal check SourceScore uses to grade reliability:
        </p>
        <ul>
          <li><strong>Citation discipline</strong> — does credible work cite it, and does it cite primary evidence instead of asserting?</li>
          <li><strong>Modern reference</strong> — is it current, maintained, and stable enough to still resolve next year?</li>
          <li><strong>Citation velocity</strong> — are trusted others citing it <em>now</em>, not just historically?</li>
        </ul>
        <p>
          The full version of this check — with red flags and examples — is in{" "}
          <a href="/blog/how-to-tell-if-a-source-is-reliable/">how to tell if a source is reliable</a>.
        </p>

        <h2>Skip the guesswork: check a source&rsquo;s score first</h2>
        <p>
          SourceScore scores 130+ widely-used sources on those exact three signals and ranks them
          into one 0&ndash;100 Index, so you can pick a strong starting point by category instead of
          evaluating from scratch:
        </p>
        <ul>
          <li>Browse the <a href="/sources/">ranked index of 130+ sources</a> or filter <a href="/sources/">by category</a> (news, science, reference, and more).</li>
          <li>Check a specific one — e.g. <a href="/source/arxiv/">Is arXiv reliable to cite?</a> or <a href="/source/wikipedia-en/">Is Wikipedia reliable?</a></li>
          <li><a href="/compare/">Compare two sources head-to-head</a> when you&rsquo;re deciding between them.</li>
        </ul>

        <h2>Then trace every fact to its primary source</h2>
        <p>
          Finding a reliable source is step one; the citation still has to point at the evidence.
          Follow each fact to the original study, dataset, or record and cite <em>that</em> — never a
          blog or an AI summary of it. And if you used an AI tool to get started, remember you{" "}
          <a href="/blog/can-you-cite-chatgpt-ai-as-a-source/">can&rsquo;t cite ChatGPT as a source</a> —
          verify its claims against a primary source and cite the source.
        </p>

        <h2>Frequently asked questions</h2>
        <div className="not-prose space-y-5">
          {FAQ.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{f.q}</h3>
              <p className="mt-2 text-zinc-700 dark:text-zinc-300 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
