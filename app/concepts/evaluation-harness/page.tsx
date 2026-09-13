// /concepts/evaluation-harness/ — 5th pillar. High-intent search queries:
// "lm-eval-harness vs helm", "why benchmark scores differ", "how to
// evaluate llms reliably", "evaluation harness comparison".

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE = "Evaluation harnesses — why the same model scores differently on the same benchmark";
const SUBTITLE =
  "An evaluation harness is the software that runs an LLM through a benchmark in a reproducible way. Different harnesses produce different scores for the same model — sometimes 4–10 points apart. Here's why, and how to read benchmark numbers honestly.";
const SLUG = "evaluation-harness";
const CANONICAL = `https://sourcescore.org/concepts/${SLUG}/`;

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
  "@type": "TechArticle",
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
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  about: [
    { "@type": "Thing", name: "LLM evaluation" },
    { "@type": "Thing", name: "Benchmark methodology" },
    { "@type": "Thing", name: "Evaluation reproducibility" },
  ],
};

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Evaluation harness",
  description:
    "Software that runs a language model through a benchmark dataset in a reproducible way — handling prompt formatting, decoding parameters, output parsing, and scoring. The harness determines whether the same model scores a 71 or a 78 on the same nominal benchmark. Different harnesses make different (defensible) choices on each of those steps.",
  inDefinedTermSet: "https://sourcescore.org/concepts/",
  url: CANONICAL,
};

export default function EvaluationHarnessConcept() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
              { name: "Evaluation harness", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Evaluation harness</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2 id="definition">Definition</h2>
        <p>
          An <strong>evaluation harness</strong> is the software that
          runs a language model through a benchmark dataset in a
          reproducible way — handling prompt formatting, decoding
          parameters, output parsing, and scoring. The harness determines
          whether the same model scores a 71 or a 78 on the same nominal
          benchmark. Different harnesses make different (defensible)
          choices on each of those steps.
        </p>

        <h2 id="the-big-three">The three major harnesses in 2026</h2>
        <ul>
          <li>
            <strong>LM Evaluation Harness (EleutherAI)</strong> — the
            de-facto open-source harness; powers the Hugging Face Open
            LLM Leaderboard. ~70 benchmarks, batch evaluation,
            log-likelihood scoring.
          </li>
          <li>
            <strong>HELM (Stanford CRFM)</strong> — Holistic Evaluation
            of Language Models. Broader-scope: not just accuracy but
            calibration, robustness, fairness, bias, efficiency. Slower
            to run; richer report.
          </li>
          <li>
            <strong>BIG-bench / BIG-bench Hard</strong> — community-
            sourced benchmark suite with 200+ tasks. Often run inside
            other harnesses rather than standalone.
          </li>
        </ul>
        <p>
          Plus lab-internal harnesses (OpenAI evals, Anthropic&apos;s
          internal eval suite, Google&apos;s internal eval). Lab papers
          often report numbers from these — which is why reproducing
          a frontier-lab result with the open harnesses produces a
          different number.
        </p>

        <h2 id="what-varies">What varies between harnesses</h2>
        <p>Six axes where harnesses make different choices:</p>
        <ol>
          <li>
            <strong>Prompt format.</strong> 0-shot vs. few-shot vs.
            chain-of-thought. Within few-shot: 5 examples vs. 25.
            Within CoT: which exemplar prompts, in what order.
          </li>
          <li>
            <strong>Scoring method.</strong> Log-likelihood (does the
            correct answer&apos;s token sequence have higher log-prob
            than incorrect alternatives?) vs. generation-then-parse
            (does the model emit the correct answer string after a
            stop token?). On the same multiple-choice question, these
            two scoring methods produce different numbers because some
            answers&apos; tokens are more frequent in the model&apos;s
            general output distribution.
          </li>
          <li>
            <strong>Decoding parameters.</strong> Temperature, top-p,
            top-k, max-tokens, stop sequences. A model that scores 67%
            on HumanEval at T=0 might score 71% at T=0.2 (or vice versa).
          </li>
          <li>
            <strong>Output parsing.</strong> &quot;The answer is C.&quot;
            vs. &quot;C&quot; vs. &quot;(C) The Battle of Hastings.&quot;
            All three should count as &quot;answer=C&quot; but different
            harnesses parse these differently.
          </li>
          <li>
            <strong>Benchmark version.</strong> MMLU 2020 vs. MMLU 2024
            (errata fixes, contamination cleanup). HumanEval original
            vs. HumanEval+ (extended test cases). Same nominal benchmark,
            different actual tests.
          </li>
          <li>
            <strong>Contamination handling.</strong> Did the harness
            check whether the model trained on the benchmark? Did the
            lab decontaminate beforehand? Two harnesses might run the
            same model but only one filters out leaked items, producing
            different scores.
          </li>
        </ol>

        <h2 id="spread">How wide is the spread?</h2>
        <p>
          A 2024 reproducibility study found that running the same
          frontier model on MMLU through three different open harnesses
          (LM Eval, HELM, lab-default) produced scores spread across
          4–10 percentage points. On HumanEval the spread was wider:
          some models showed 12+ point differences depending on prompt
          format alone.
        </p>
        <p>
          This is not a flaw — every harness is making defensible
          choices. It IS a reason to treat any single benchmark number
          as conditional on the harness that produced it.
        </p>

        <h2 id="how-to-read">How to read a benchmark claim honestly</h2>
        <p>
          When you see &quot;Model X scores 86.4% on MMLU&quot;, the
          questions you should be able to answer:
        </p>
        <ul>
          <li>Which harness produced this number?</li>
          <li>0-shot or few-shot? How many shots?</li>
          <li>Generation-scored or log-likelihood-scored?</li>
          <li>Temperature setting?</li>
          <li>Which MMLU version (date of dataset snapshot)?</li>
          <li>Was decontamination applied? How rigorous?</li>
        </ul>
        <p>
          Without those six pieces of information, &quot;86.4%&quot; is
          not directly comparable to any other model&apos;s 86.4%. They
          might have been measured under different harness conditions.
        </p>

        <h2 id="implications">Implications for production decisions</h2>
        <p>
          Three takeaways for teams choosing models:
        </p>
        <ol>
          <li>
            <strong>Build your own eval.</strong> Public benchmarks are
            cheap to read but expensive to trust. A custom eval on your
            actual production prompts is the only number that&apos;s
            calibrated to your use case. Even 50 hand-graded examples
            give you a tighter signal than the public MMLU number for
            most domains.
          </li>
          <li>
            <strong>Triangulate.</strong> Don&apos;t pick a model from a
            single number. Look at 3+ harnesses + 3+ benchmarks + the
            arena leaderboard (LMSYS Chatbot Arena uses human-pairwise
            preferences, which is harness-agnostic). Disagreement is
            informative.
          </li>
          <li>
            <strong>Re-evaluate after frontier-model updates.</strong>{" "}
            &quot;GPT-4 scored X&quot; is conditional on the GPT-4
            version active at that time. The model gets updated; the
            number may not move with it.
          </li>
        </ol>

        <h2 id="why-veritas-doesnt-ship">Why VERITAS doesn&apos;t ship benchmark claims</h2>
        <p>
          The six axes above are exactly why SourceScore&apos;s VERITAS
          catalog excludes performance-comparison claims (see{" "}
          <a href="/blog/why-no-performance-claims/">
            why we don&apos;t ship them
          </a>
          ). A claim like &quot;Llama 3 70B beats GPT-3.5 on HumanEval&quot;
          requires specifying the harness, prompt format, decoding,
          version, and decontamination just to be meaningful. We&apos;d
          rather maintain a bounded catalog of inspectable records than
          publish large numbers of context-sensitive scores without the
          harness metadata needed to interpret them.
        </p>

        <h2 id="related-tools">Related tools + further reading</h2>
        <ul>
          <li>
            <a
              href="https://github.com/EleutherAI/lm-evaluation-harness"
              target="_blank"
              rel="noopener noreferrer"
            >
              LM Evaluation Harness (EleutherAI)
            </a>{" "}
            — most-used open-source harness
          </li>
          <li>
            <a href="https://crfm.stanford.edu/helm/" target="_blank" rel="noopener noreferrer">
              HELM (Stanford CRFM)
            </a>{" "}
            — holistic evaluation framework
          </li>
          <li>
            <a href="https://lmarena.ai/" target="_blank" rel="noopener noreferrer">
              LMSYS Chatbot Arena
            </a>{" "}
            — pairwise human preference (harness-agnostic alternative)
          </li>
          <li>
            <a href="/blog/why-no-performance-claims/">
              SourceScore: why VERITAS excludes performance claims
            </a>{" "}
            — the methodology rationale
          </li>
          <li>
            <a href="/concepts/citation-chain/">Citation chains</a> — for facts that aren&apos;t harness-conditional
          </li>
          <li>
            <a href="/concepts/hallucination/">LLM hallucination</a> — what eval can&apos;t directly measure
          </li>
          <li>
            <a href="/methodology/">SourceScore methodology</a> — the rules for what makes it into the verified-claim catalog
          </li>
        </ul>
      </section>
    </article>
  );
}
