// /use-cases/research-citation/ — research + academic citation tooling.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Research citation — programmatic citations for AI/ML research tools";
const SUBTITLE =
  "Stable claim IDs, cited evidence with short excerpts, and SourceScore-issued HMAC metadata. Candidate retrieval for academic AI assistants and literature-review tools, with evidence review before citation.";
const CANONICAL = "https://sourcescore.org/use-cases/research-citation/";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: SUBTITLE, url: CANONICAL, type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: TITLE,
  description: SUBTITLE,
  datePublished: "2026-05-16",
  dateModified: "2026-05-16",
  author: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    url: "https://sourcescore.org/",
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
  mainEntityOfPage: CANONICAL,
};

export default function ResearchCitationPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
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
              { name: "Use cases", url: "https://sourcescore.org/use-cases/" },
              { name: "Research citation", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/use-cases/" className="hover:underline">Use cases</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Research citation</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>The problem</h2>
        <p>
          You&apos;re building an AI tool for researchers — literature
          review assistant, citation finder, paper-summary chatbot,
          academic search. Your users care about citations more than
          your typical LLM-app user. Wrong dates or fabricated authors
          aren&apos;t a UX bug — they&apos;re a credibility-destroying
          incident.
        </p>
        <p>
          Standard RAG over arXiv produces fluent summaries but
          hallucinates dates, authors, and methodology details.
          Researchers notice. Trust collapses fast.
        </p>

        <h2>The pattern</h2>
        <p>
          Three properties researchers need that VERITAS provides
          out-of-the-box:
        </p>
        <ol>
          <li>
            <strong>Stable claim IDs.</strong> Every claim has a 16-hex
            identifier derived from canonical fields. Use the canonical URL to
            refetch the current record; SourceScore does not promise permanent
            hosting or byte-identical content for a fixed number of years.
          </li>
          <li>
            <strong>Cited evidence.</strong> Every record lists at least one
            source; many, but not all, source entries include an excerpt. Always
            inspect and cite the original source for academic work.
          </li>
          <li>
            <strong>HMAC metadata.</strong> Every envelope carries a
            SourceScore-issued HMAC tag. Public users cannot independently
            recompute it because the shared secret is not published.
          </li>
        </ol>

        <h2>Example: literature-review assistant</h2>
        <pre><code>{`import httpx

# User asks: "What pretraining methods preceded BERT?"
# Your assistant retrieves relevant papers from arXiv.
# Before responding, retrieve a candidate record for each assertion.

assertions_to_check = [
    "BERT was introduced in 2019 by Devlin et al.",
    "T5 was introduced by Raffel et al. in 2020",
    "RoBERTa was introduced by Liu et al. at Facebook AI in 2019",
]

citations_to_review = []
for claim in assertions_to_check:
    r = httpx.post(
        "https://sourcescore.org/api/v1/verify",
        json={"claim": claim, "minConfidence": 0.85},
    )
    result = r.json()
    if result.get("bestMatch"):
        candidate = result["bestMatch"]
        envelope = httpx.get(candidate["detailUrl"]).json()
        citations_to_review.append({
            "claim": claim,
            "candidate_statement": candidate["statement"],
            "id": candidate["id"],
            "source_urls": [s["url"] for s in envelope["claim"]["sources"]],
            "excerpts": [s.get("excerpt") for s in envelope["claim"]["sources"]],
        })

# A reviewer or entailment step must compare each assertion, candidate
# statement, and original source before your assistant cites it.
# After that review, your assistant may cite:
#   "BERT (Devlin et al., 2019) [^1]"
# Where [^1] resolves to a citation block with:
#   - Stable ID: a1b2c3d4...
#   - Primary source: https://arxiv.org/abs/1810.04805
#   - Verbatim excerpt from the abstract
#   - SourceScore-issued HMAC metadata (not publicly independently verifiable)`}</code></pre>

        <h2>Citation export format</h2>
        <p>
          For researchers who need machine-readable citations:
        </p>
        <pre><code>{`# BibTeX-style export for a VERITAS claim
@misc{sourcescore_a1b2c3d4,
  title = {SourceScore VERITAS reviewed claim record a1b2c3d4},
  publisher = {SourceScore},
  year = {2026},
  url = {https://sourcescore.org/claims/a1b2c3d4/},
  note = {SourceScore record with cited evidence: [URL1, URL2]. Public HMAC verification is not available.},
}`}</code></pre>

        <h2>What the catalog covers</h2>
        <p>
          v0.1 catalog (384 claims spanning 1997-2025) covers AI/ML
          research:
        </p>
        <ul>
          <li>Foundational papers — Transformer, LSTM, BERT, RLHF, RAG, LoRA, etc.</li>
          <li>Model releases — GPT family, Claude family, Llama family, Gemini, Mistral, DeepSeek, Phi, etc.</li>
          <li>Benchmarks + datasets — MMLU, GLUE, ImageNet, C4, The Pile, etc.</li>
          <li>Frameworks + libraries — PyTorch, TensorFlow, JAX, LangChain, LlamaIndex, etc.</li>
          <li>Organizations — OpenAI, Anthropic, DeepMind, Mistral, Hugging Face, etc.</li>
        </ul>
        <p>
          Out of scope for v0: papers in scientific computing,
          cybersecurity, and biology. No expansion date is promised.
          Performance comparisons (see{" "}
          <a href="/blog/why-no-performance-claims/">why we don&apos;t
          ship those</a>).
        </p>

        <h2>License</h2>
        <p>
          The published methodology and claim data are CC-BY 4.0. Cite as:{" "}
          <code>SourceScore Claim &lt;id&gt;, sourcescore.org</code>.
          You can redistribute, re-publish, derive — under the
          attribution condition.
        </p>

        <h2>For academic submissions</h2>
        <p>
          For formal papers, cite the original primary source. If you also need
          to document the SourceScore record used during review, use:
        </p>
        <blockquote>
          <p>
            <em>
              SourceScore VERITAS (2026). Reviewed claim record &lt;id&gt;.
              https://sourcescore.org/claims/&lt;id&gt;/
            </em>
          </p>
        </blockquote>
        <p>
          Refetch the record at review time and preserve the primary-source
          citation in your own research materials. SourceScore does not promise
          perpetual hosting, and its HMAC tag is not public proof.
        </p>

        <h2>Integration guides</h2>
        <ul>
          <li><a href="/docs/integrations/dspy/">DSPy</a> — for research workflows with optimizers</li>
          <li><a href="/docs/integrations/langchain/">LangChain</a> — retrieve-then-cite pattern</li>
          <li><a href="/docs/integrations/llamaindex/">LlamaIndex</a> — for paper-corpus RAG</li>
          <li><a href="/docs/integrations/pydantic-ai/">Pydantic AI</a> — type-safe structured citation output</li>
        </ul>

        <h2>Related</h2>
        <ul>
          <li><a href="/concepts/citation-chain/">Citation chains — provenance graphs</a></li>
          <li><a href="/methodology/">Verification methodology v0.1</a></li>
          <li><a href="/security/">Security + integrity-metadata limits</a></li>
          <li><a href="/playground/">Try the API in browser</a></li>
        </ul>
      </section>
    </article>
  );
}
