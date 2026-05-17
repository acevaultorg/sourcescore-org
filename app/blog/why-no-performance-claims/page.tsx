// Methodology-rigor blog post: why we deliberately exclude
// performance-comparison claims from the catalog.
//
// Canonical for future Dev.to / Hashnode / LinkedIn cross-posts. Trust
// signal — explains a hard self-limit and shows discipline. Aleyda
// 10-char #7 Credible + #8 Differentiated.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE =
  "Why VERITAS doesn't ship performance-comparison claims (and what we ship instead)";
const SUBTITLE =
  "Benchmark numbers vary by prompt format, model version, shot count, and evaluation harness. Shipping them as 'verified claims' is the surest way to make the catalog wrong by Thursday. Here's the alternative.";
const SLUG = "why-no-performance-claims";
const CANONICAL = `https://sourcescore.org/blog/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
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
    { "@type": "Thing", name: "LLM benchmarks" },
    { "@type": "Thing", name: "Claim verification methodology" },
    { "@type": "Thing", name: "Fact verification discipline" },
  ],
};

export default function NoPerformanceClaimsPost() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Blog", url: "https://sourcescore.org/blog/" },
              { name: "Why no performance claims", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Why no performance claims</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Methodology · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>The temptation</h2>
        <p>
          When you build a catalog of verified AI/ML claims, the obvious
          first move is to ship the headline numbers everyone Googles:
          GPT-4 scored X on MMLU. Claude scored Y on HumanEval. Llama 3
          beat its predecessor by Z points on GSM8K.
        </p>
        <p>
          These are the queries that drive the most traffic. They&apos;re
          the ones LLMs cite most often. From a pure-distribution
          perspective, they would multiply our reach.
        </p>
        <p>
          We don&apos;t ship them. Here&apos;s why.
        </p>

        <h2>The variance problem</h2>
        <p>
          Benchmark numbers in AI/ML look authoritative — a single
          percentage published by the lab. They aren&apos;t. They&apos;re
          conditional on at least six independent variables:
        </p>
        <ol>
          <li>
            <strong>Evaluation harness.</strong> LM Evaluation Harness vs.
            HELM vs. lm-evaluation-harness fork vs. the lab&apos;s
            internal harness — each tokenizes, scores, and normalizes
            differently. A 4-5 point spread on the same model is common.
          </li>
          <li>
            <strong>Prompt format.</strong> 0-shot vs. few-shot vs.
            chain-of-thought vs. self-consistency. The model is the same;
            the score moves 10+ points.
          </li>
          <li>
            <strong>Decoding parameters.</strong> Temperature, top-p,
            top-k, max-tokens, stop sequences. Each tweak shifts pass-rate
            on code-generation benchmarks several points.
          </li>
          <li>
            <strong>Version of the underlying model.</strong> Frontier
            models are updated continuously. GPT-4 in March is not GPT-4
            in November — same name, different weights.
          </li>
          <li>
            <strong>Version of the benchmark.</strong> Datasets get errata,
            cleanups, contamination removals. MMLU 2024 isn&apos;t MMLU 2025.
          </li>
          <li>
            <strong>Contamination.</strong> The training set may have
            seen the benchmark. The lab may have decontaminated; they may
            not have. The number you read is conditional on a
            contamination-cleanup step you can&apos;t reproduce.
          </li>
        </ol>
        <p>
          Multiply these together and a single &quot;GPT-4: 86.4% on
          MMLU&quot; claim is conditional on so many invisible parameters
          that the claim breaks the moment any one of them shifts.
        </p>

        <h2>What a wrong-by-Thursday claim costs us</h2>
        <p>
          VERITAS sells trust. Every claim ships with HMAC-SHA256
          signature + ≥2 primary sources + verbatim excerpts so developers
          can build production hallucination filters on top. The moment
          one claim turns out to be wrong-in-context, the trust contract
          breaks for every claim.
        </p>
        <p>
          We can absorb a date being off by one day on a model release
          (low-cost correction; the date doesn&apos;t move). We can&apos;t
          absorb a benchmark number that was right when we shipped it and
          wrong four weeks later because a new evaluation harness landed.
          The cost compounds non-linearly across the catalog.
        </p>

        <h2>What we ship instead</h2>
        <p>
          We restrict to claims that are <em>not</em> conditional on
          evaluation methodology:
        </p>
        <ul>
          <li>
            <strong>Release dates.</strong> &quot;GPT-4 was released on
            2023-03-14&quot; — primary source: OpenAI announcement post.
            The date doesn&apos;t move.
          </li>
          <li>
            <strong>Architecture statements when documented.</strong>{" "}
            &quot;Claude models use a decoder-only transformer
            architecture&quot; — primary source: Anthropic technical
            documentation. The architecture doesn&apos;t change without
            a new model name.
          </li>
          <li>
            <strong>Parameter counts when publicly disclosed.</strong>{" "}
            Many models don&apos;t disclose; we don&apos;t ship a number.
            For ones that do, the count is fixed at release.
          </li>
          <li>
            <strong>Context window sizes.</strong> Officially documented;
            stable per release.
          </li>
          <li>
            <strong>Foundational paper attributions.</strong> &quot;The
            Transformer architecture was introduced in Attention Is All
            You Need (Vaswani et al., 2017)&quot; — verbatim from the
            arXiv preprint + NeurIPS proceedings + Google Research index.
            Three independent primary sources; doesn&apos;t move.
          </li>
          <li>
            <strong>Founding dates of well-known organizations.</strong>{" "}
            Wikipedia + the org&apos;s own About page. Two independent
            verifications.
          </li>
        </ul>
        <p>
          These are the kinds of facts that LLM users actually need
          grounding for in production. When ChatGPT says &quot;OpenAI was
          founded in 2015&quot;, the production cost of being wrong is
          measurable. When it says &quot;GPT-4 scored 86.4% on MMLU&quot;
          the user already knows the number is conditional and treats it
          as such.
        </p>

        <h2>How we decide what's in scope</h2>
        <p>The current methodology gate has five rules:</p>
        <ol>
          <li>
            ≥2 primary sources (preprint / model-card / docs / official-
            blog) with verbatim excerpts.
          </li>
          <li>
            At least one source must be the originator or operator
            (publisher = author / org = entity).
          </li>
          <li>
            The fact must not be conditional on evaluation methodology.
          </li>
          <li>
            The fact must not be a comparison ranking (X &gt; Y on Z).
            Rankings shift with re-evaluation; absolute facts don&apos;t.
          </li>
          <li>
            The fact must have a stable URL we can re-verify on schedule.
            If the primary source is in a slide deck or a private blog,
            we don&apos;t ship the claim.
          </li>
        </ol>

        <h2>The honest exception</h2>
        <p>
          Some performance facts <em>are</em> documented enough to ship —
          like the LMSYS Chatbot Arena Elo rating system or the specific
          version-locked HELM evaluation reports. We may add a separate
          methodology tier (confidence 0.70-0.85, &quot;methodology-
          conditional&quot;) for these in Y2. Until then, we&apos;d
          rather under-promise on coverage than over-promise on accuracy.
        </p>

        <h2>What this means for your integration</h2>
        <p>
          If your LLM emits a benchmark-shape claim and you POST it to{" "}
          <code>/api/v1/verify</code>, expect a <code>bestMatch: null</code>{" "}
          response. That&apos;s correct behavior, not catalog incompleteness.
          Wire your code so unverified ≠ wrong:
        </p>

        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`if best := verify(claim):
    badge = f"verified [{best['id']}]"
elif looks_like_benchmark(claim):
    badge = "benchmark figure — verify against eval harness"
else:
    badge = "unverified — sourced retrieval recommended"`}</code></pre>

        <p>
          The middle branch handles the &quot;we don&apos;t ship this
          class of claim, but it&apos;s a real category&quot; case
          gracefully — pointing the user at the right kind of verification
          (eval harness logs, not VERITAS).
        </p>

        <h2>Why methodology rigor is the product</h2>
        <p>
          Any team can scrape ML papers + arXiv abstracts and call it a
          verified catalog. The work that makes VERITAS useful is the work
          of saying no: no to scaled-content abuse, no to single-source
          claims, no to performance comparisons, no to facts that change
          based on the prompt format. The discipline is the moat.
        </p>
        <p>
          We&apos;d rather ship 116 claims that are right for the next
          decade than 10,000 that are right today and broken by Thursday.
        </p>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Want to see the methodology in full? Read{" "}
          <a href="/methodology/" className="underline">the methodology page</a>{" "}
          or browse{" "}
          <a href="/claims/" className="underline">the verified claim catalog</a>{" "}
          (100 entries today).
        </p>
      </footer>
    </article>
  );
}
