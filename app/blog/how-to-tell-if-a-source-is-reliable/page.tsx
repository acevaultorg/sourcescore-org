// Broad-audience pillar (2026-05-31, fastest-human-growth): targets the
// high-volume evergreen human query cluster "how to tell if a source is
// reliable / is X a credible source / how to evaluate source credibility" —
// the largest human-search opportunity SourceScore is uniquely credible on
// (it scores source reliability). All prior content was developer/API-only.
// AEO-first: direct-answer lead (≤45w), HowTo + FAQPage schema, funnels to the
// 130-source Index + per-source pages.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-31";
const TITLE = "How to tell if a source is reliable: a 3-signal checklist";
const SUBTITLE =
  "A practical way to judge any source — does credible work cite it, does it stay current and correct itself, and are people citing it now — plus how to check 130+ sources instantly.";
const SLUG = "how-to-tell-if-a-source-is-reliable";
const CANONICAL = `https://sourcescore.org/blog/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: "How to tell if a source is reliable (3-signal checklist)" },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: SUBTITLE,
    url: CANONICAL,
    type: "article",
    publishedTime: PUBLISHED,
  },
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
  author: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    url: "https://sourcescore.org",
  },
  editor: {
    "@type": "Person",
    "@id": "https://sourcescore.org/about/#person-editorial-lead",
    name: "SourceScore Editorial Team",
    url: "https://sourcescore.org/about/",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  about: [
    { "@type": "Thing", name: "Source reliability" },
    { "@type": "Thing", name: "Source credibility" },
    { "@type": "Thing", name: "Evaluating sources" },
    { "@type": "Thing", name: "Citation" },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to tell if a source is reliable",
  description:
    "Judge any source on three signals — citation discipline, modern reference, and citation velocity — instead of taking its own word for it.",
  step: [
    {
      "@type": "HowToStep",
      name: "Check citation discipline",
      text: "Does the source cite primary sources, name its authors, disclose its methods, and correct its mistakes? Look for footnotes, a corrections policy, named bylines, and links to primary evidence.",
    },
    {
      "@type": "HowToStep",
      name: "Check modern reference",
      text: "Is it current, maintained, and machine-readable, with stable URLs that don't rot? Abandoned sites and broken links are a reliability red flag even when the original content was sound.",
    },
    {
      "@type": "HowToStep",
      name: "Check citation velocity",
      text: "Are credible others citing it now — in recent scholarship, the press, or AI answers — not just historically? Active, current citation by trusted sources is the strongest live signal of reliability.",
    },
  ],
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "How do you know if a source is credible?",
    a: "Check whether credible work cites it (citation discipline), whether it stays current and corrects errors (modern reference), and whether trusted others are citing it now (citation velocity). A source that passes all three is far more credible than one that simply looks authoritative. Don't rely on a source's own claims about itself — look at how the wider ecosystem treats it.",
  },
  {
    q: "What makes a source reliable?",
    a: "Reliability is earned, not asserted: primary-source citation, named and accountable authorship, a visible corrections process, current maintenance, stable references, and active citation by other credible sources. The most reliable sources make it easy to check their work; the least reliable ask you to trust them.",
  },
  {
    q: "Is Wikipedia a reliable source?",
    a: "Wikipedia is a strong starting point but not a primary source — its real value is the references at the bottom of each article. For anything important, follow Wikipedia's citations to the primary sources and judge those. Use Wikipedia to find reliable sources, not as the final citation.",
  },
  {
    q: "Can you cite ChatGPT or AI tools as a source?",
    a: "No — cite the underlying source, not the AI. Large language models can fabricate confident-sounding facts and citations that don't exist, so an AI answer is a lead to verify, never a source to cite. Take each claim, find the primary source it should rest on, and cite that. SourceScore exists to make that verification step fast.",
  },
  {
    q: "What is the most reliable type of source?",
    a: "Primary, peer-reviewed, and official sources sit at the top — original research, official records, and standards bodies — because they're the evidence everything else cites. Reputable journalism and well-maintained reference works rank next. The reliability of any individual source still depends on the three signals above, not just its category.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const SIGNALS = [
  {
    n: 1,
    name: "Citation discipline",
    lead: "Does credible work cite it — and does it cite its own sources?",
    body: "The single strongest signal of a reliable source is that other trustworthy sources cite it, and that it in turn cites primary evidence rather than asserting. Look for named authors you can hold accountable, footnotes that link to primary sources, a visible corrections policy, and disclosed methods. A source that hides its authors, never corrects anything, and links only to itself is asking you to trust it — which is the opposite of evidence.",
    href: "/discipline/",
    hrefLabel: "Citation Discipline, explained",
  },
  {
    n: 2,
    name: "Modern reference",
    lead: "Is it current, maintained, and stable enough to still be there tomorrow?",
    body: "Reliability decays. A page that was excellent in 2018 but is now abandoned, with dead links and no updates, has quietly become unreliable. Check the last-updated date, whether links still resolve, whether URLs are stable (not session-mangled), and whether the source is machine-readable — structured, parseable, and built to be referenced. Stable, maintained sources are the ones still worth citing years later.",
    href: "/modern-reference/",
    hrefLabel: "Modern Reference, explained",
  },
  {
    n: 3,
    name: "Citation velocity",
    lead: "Are trusted others citing it now — not just historically?",
    body: "A source can have a great reputation and still be coasting. Citation velocity asks who is citing it lately: recent scholarship, current press coverage, and — increasingly — AI answer engines that surface it as a reference. Active, current citation by credible sources is the closest thing to a live reliability reading. When the people who would know keep returning to a source, that's a signal you can't fake.",
    href: "/velocity/",
    hrefLabel: "Citation Velocity, explained",
  },
];

export default function HowToTellSourceReliablePost() {
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
              { name: "How to tell if a source is reliable", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">How to tell if a source is reliable</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Guide · {PUBLISHED}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          How to tell if a source is reliable: a 3-signal checklist
        </h1>
        {/* Direct-answer lead (≤45 words) — featured-snippet / AI-Overview target */}
        <p className="ss-answer text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          A reliable source is one that credible work <strong>cites</strong>, that stays
          <strong> current and corrects itself</strong>, and that trusted others are
          <strong> citing now</strong>. Judge any source on those three signals —
          citation discipline, modern reference, and citation velocity — instead of
          taking its own word for it.
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <p>
          &ldquo;Is this a reliable source?&rdquo; is the wrong question to ask the source
          itself — every site claims to be trustworthy. The useful question is{" "}
          <em>how the rest of the world treats it</em>. The three signals below are the
          ones that hold up across academic, journalistic, and machine (AI) use, and
          they&rsquo;re the exact dimensions SourceScore measures to score 130+ sources.
        </p>

        <h2>The 3 signals of a reliable source</h2>
        {SIGNALS.map((s) => (
          <div key={s.n} className="my-6">
            <h3 className="!mb-1">
              {s.n}. {s.name}
            </h3>
            <p className="!mt-1 font-medium text-zinc-800 dark:text-zinc-200">{s.lead}</p>
            <p className="!mt-2">{s.body}</p>
            <p className="!mt-1 text-sm">
              <a href={s.href} className="underline">{s.hrefLabel} →</a>
            </p>
          </div>
        ))}

        <h2>Check any source instantly</h2>
        <p>
          You don&rsquo;t have to run this checklist by hand. SourceScore scores 130+
          widely-used sources on exactly these three signals and combines them into one
          0&ndash;100 <a href="/sources/">SourceScore Index</a>. A few examples:
        </p>
        <ul>
          <li>
            <a href="/source/arxiv/">Is arXiv reliable to cite?</a> — strong corpus
            presence and a machine-readable archive, with the caveat that preprints
            aren&rsquo;t yet peer-reviewed.
          </li>
          <li>
            <a href="/source/wikipedia-en/">Is Wikipedia reliable?</a> — best used as a
            map to primary sources rather than as the final citation.
          </li>
          <li>
            Browse the full <a href="/sources/">ranked index of sources</a> or{" "}
            <a href="/compare/">compare two sources head-to-head</a>.
          </li>
        </ul>

        <h2>Quick red flags</h2>
        <ul>
          <li>No named authors and no corrections policy.</li>
          <li>Stale or abandoned — old dates, dead links, no maintenance.</li>
          <li>Only self-citations; no independent sources reference it.</li>
          <li>Claims that contradict the primary source they point to.</li>
          <li>Confident specifics with no traceable evidence behind them.</li>
        </ul>

        <h2>Can you cite ChatGPT or AI tools?</h2>
        <p>
          No — <strong>cite the source, not the AI</strong>. Language models can fabricate
          confident facts and even invent citations that don&rsquo;t exist, so an AI answer
          is a <em>lead to verify</em>, never a source to cite. Take each claim, find the
          primary source it should rest on, and cite that. (That verification step is
          exactly what the <a href="/methodology/">SourceScore methodology</a> and the{" "}
          <a href="/">VERITAS verification API</a> are built to make fast.)
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
