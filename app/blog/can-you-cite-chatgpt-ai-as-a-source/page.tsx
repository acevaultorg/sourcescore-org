// Broad-audience pillar #2 (2026-05-31, fastest-human-growth): targets the very
// high-volume student/writer query cluster "can you cite ChatGPT / can you cite
// AI / how to cite ChatGPT in APA/MLA / is ChatGPT a reliable source". Natural
// payoff for SourceScore's verify-the-claim product. AEO-first: ≤45-word
// direct-answer lead + HowTo (verify-an-AI-claim) + FAQPage schema. Sister to
// /blog/how-to-tell-if-a-source-is-reliable/.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-31";
const TITLE = "Can you cite ChatGPT or AI as a source? (and how to do it right)";
const SUBTITLE =
  "Short answer: cite the source, not the AI. You can disclose ChatGPT as a tool you used, but never as the source of a fact — it fabricates. Here's how to reference and verify AI properly.";
const SLUG = "can-you-cite-chatgpt-ai-as-a-source";
const CANONICAL = `https://sourcescore.org/blog/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: "Can you cite ChatGPT or AI as a source?" },
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
    { "@type": "Thing", name: "Citing AI" },
    { "@type": "Thing", name: "ChatGPT citation" },
    { "@type": "Thing", name: "AI hallucination" },
    { "@type": "Thing", name: "Academic citation" },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to verify an AI claim before you use it",
  description: "Turn a confident AI answer into a fact you can actually cite, in four steps.",
  step: [
    { "@type": "HowToStep", name: "Isolate the claim", text: "Pull out the specific factual assertion — the name, number, date, or quote — separate from the AI's surrounding explanation." },
    { "@type": "HowToStep", name: "Find the primary source", text: "Search for the original source the claim should rest on: the paper, the official record, the dataset, the press release. Don't accept a citation the AI gave you without opening it — AI invents citations that don't exist." },
    { "@type": "HowToStep", name: "Check the source actually says it", text: "Open the primary source and confirm it states exactly what the AI claimed — same number, same context, no distortion. 'Right document, wrong number' is the most common AI error." },
    { "@type": "HowToStep", name: "Cite the primary source, not the AI", text: "In your work, cite the primary source you verified. If your assignment requires disclosing AI use, do that separately as a tool/method note — not as the source of the fact." },
  ],
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Can you cite ChatGPT in an essay or research paper?",
    a: "Not as a source of facts. ChatGPT can produce confident, false statements and even fabricate citations, so it fails the basic test of a reliable source. You may need to DISCLOSE that you used it (many schools and journals require this) as a tool or method — but for any factual claim, find the primary source it should rest on and cite that instead.",
  },
  {
    q: "How do you cite ChatGPT in APA or MLA?",
    a: "Both have formats for disclosing AI tool use. APA 7th treats a ChatGPT response like software output (e.g., OpenAI. (2026). ChatGPT [Large language model]. https://chat.openai.com) and recommends describing your prompt and how you used it. MLA cites it as a source you consulted, noting the prompt and date. But this documents that you USED the tool — it does not make the AI a trustworthy source of the facts inside its answer. Verify those separately.",
  },
  {
    q: "Is using ChatGPT plagiarism?",
    a: "Using it isn't automatically plagiarism, but presenting AI-generated text as your own original work — without disclosure where it's required — can be. Policies vary by institution, so check yours. The safer pattern: use AI to draft or explore, write in your own words, disclose where required, and cite the primary sources behind every factual claim.",
  },
  {
    q: "Can ChatGPT be wrong or make up sources?",
    a: "Yes, frequently. Large language models predict plausible text, not verified truth, so they can state false facts with full confidence and invent realistic-looking citations, page numbers, and quotes that don't exist (often called 'hallucination'). Always treat an AI answer as a lead to verify, never as a finished fact.",
  },
  {
    q: "How do you check if what ChatGPT says is true?",
    a: "Isolate the specific claim, find the primary source it should rest on, and confirm that source actually says it — same number, same context. Don't trust a citation the AI provides without opening it. SourceScore's VERITAS API automates this verification step for AI/ML claims, returning a confidence score and the primary source for each.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function CanYouCiteChatGPTPost() {
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
              { name: "Can you cite ChatGPT or AI as a source?", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Can you cite ChatGPT or AI?</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Guide · {PUBLISHED}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          Can you cite ChatGPT or AI as a source?
        </h1>
        {/* Direct-answer lead (≤45 words) */}
        <p className="ss-answer text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          Short answer: <strong>cite the source, not the AI</strong>. You can disclose
          that you <em>used</em> ChatGPT as a tool, but never cite it as the source of a
          fact — AI can fabricate confident, false claims and invent citations that
          don&rsquo;t exist. For every factual claim, find the primary source and cite that.
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>Why you shouldn&rsquo;t cite AI as a source of facts</h2>
        <p>
          A citation exists so a reader can check your claim against the evidence. A large
          language model isn&rsquo;t evidence — it predicts plausible-sounding text, which
          means it can state something false with total confidence and even produce
          realistic-looking citations, page numbers, and quotes that were never written.
          Citing the AI just moves your claim one step further from the evidence, in the
          wrong direction. (For the general version of this test, see{" "}
          <a href="/blog/how-to-tell-if-a-source-is-reliable/">how to tell if a source is reliable</a>.)
        </p>

        <h2>Disclosing the tool vs. citing the fact (the part people get wrong)</h2>
        <p>
          There are two different things, and conflating them is the mistake:
        </p>
        <ul>
          <li>
            <strong>Disclosing AI use</strong> — telling the reader you used ChatGPT to
            brainstorm, draft, or summarize. APA and MLA both have formats for this, and
            many schools and journals now require it. This is legitimate and honest.
          </li>
          <li>
            <strong>Citing AI as a source of a fact</strong> — using &ldquo;ChatGPT said
            so&rdquo; as your evidence for a claim. This is what you should never do,
            because the AI is not a reliable witness to the facts inside its own answer.
          </li>
        </ul>
        <p>
          Disclose the tool if required; verify and cite the primary source for every fact.
        </p>

        <h2>How to verify an AI claim before you use it</h2>
        <ol>
          <li><strong>Isolate the claim.</strong> Pull out the specific assertion — the name, number, date, or quote — from the AI&rsquo;s explanation around it.</li>
          <li><strong>Find the primary source.</strong> Search for the original the claim should rest on. Don&rsquo;t accept a citation the AI gave you without opening it — invented citations are common.</li>
          <li><strong>Check the source actually says it.</strong> Confirm the same number and the same context. &ldquo;Right document, wrong number&rdquo; is the most frequent AI error.</li>
          <li><strong>Cite the primary source, not the AI.</strong> Reference what you verified. Disclose AI use separately if your assignment requires it.</li>
        </ol>

        <h2>What about AI search engines like Perplexity?</h2>
        <p>
          AI search tools that show citations are a step better — but the citation is a
          starting point, not a guarantee. The model can still summarize a source
          incorrectly, so follow each citation to the primary source and confirm it says
          what the answer claims before you rely on it.
        </p>

        <h2>The fast way to check AI/ML claims</h2>
        <p>
          For claims about AI and machine-learning research specifically, SourceScore&rsquo;s{" "}
          <a href="/">VERITAS verification API</a> does this verification step for you:
          submit a claim and it returns a confidence score plus the primary source behind
          it, drawn from a hand-verified catalog. See the{" "}
          <a href="/methodology/">methodology</a> for how each claim is sourced and signed,
          or browse the <a href="/sources/">reliability scores for 130+ sources</a> you
          might cite.
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
