// /glossary/ — AI/ML term glossary with DefinedTerm schema per entry.
//
// Strategic value:
//   - Aleyda 10-char #4 Extractable — LLMs quote DefinedTerm definitions
//     when answering "what is X" queries. Each entry is a citation-ready
//     atom.
//   - Internal-linking density — every concept/blog/integration page can
//     deep-link to a glossary anchor.
//   - SEO compound — anchor URLs (/glossary/#token) rank for term-
//     definition queries.
//   - Activation — devs scanning the glossary understand the VERITAS
//     domain scope without clicking 12 pages.
//
// DefinedTermSet at the top groups them per Schema.org docs.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Glossary — SourceScore VERITAS",
  description:
    "Definitions for AI/ML terms used across SourceScore and VERITAS — grounding, RAG, hallucination, claim verification, signing, methodology rigor, and the surrounding ecosystem.",
  alternates: { canonical: "https://sourcescore.org/glossary/" },
  openGraph: {
    title: "Glossary — SourceScore VERITAS",
    description: "AI/ML terms used across SourceScore and VERITAS.",
    url: "https://sourcescore.org/glossary/",
    type: "website",
  },
};

type Term = {
  slug: string;
  name: string;
  definition: string;
  seeAlso?: string[]; // internal URLs
};

const TERMS: Term[] = [
  {
    slug: "ai-citation",
    name: "AI citation",
    definition:
      "A reference to a source surfaced by an LLM (ChatGPT, Claude, Perplexity, Gemini) inside its response. AI citations differ from traditional search-engine citations in that the model selects the source rather than a ranking algorithm; visibility depends on whether the model trusts the source as authoritative within its training + retrieval pipeline.",
    seeAlso: ["/methodology/", "/concepts/llm-grounding/"],
  },
  {
    slug: "canonical-claim",
    name: "Canonical claim",
    definition:
      "The canonical SourceScore representation of a verified fact: subject + predicate + object + sources + confidence + signature. Every claim has a stable 16-hex id derived from a SHA-256 hash of its canonical fields. The id is deterministic — same fields always produce the same id.",
    seeAlso: ["/methodology/", "/claims/"],
  },
  {
    slug: "claim-envelope",
    name: "Claim envelope",
    definition:
      "The signed JSON object SourceScore returns from /api/v1/claims/<id>.json: the canonical claim fields, primary sources with verbatim excerpts, signing metadata, and an HMAC-SHA256 signature over the canonical serialization. Verifying the envelope locally proves the claim wasn't modified in transit.",
    seeAlso: ["/docs/", "/security/"],
  },
  {
    slug: "claim-id",
    name: "Claim id",
    definition:
      "A stable 16-hex-character identifier (regex /^[a-f0-9]{16}$/) derived from SHA-256 of a claim's lower-cased canonical fields (vertical|subject|predicate|object). Stable across releases; same canonical input always produces the same id.",
    seeAlso: ["/claims/", "/docs/"],
  },
  {
    slug: "confidence-score",
    name: "Confidence score",
    definition:
      "A value in [0.0, 1.0] indicating how certain SourceScore is about a claim, based on source convergence and assertion precision. Floor for shippable claims is 0.70; release dates + architectural facts with multi-source corroboration score 0.95-1.00. Performance-comparison claims are deliberately excluded regardless of obvious-confidence.",
    seeAlso: ["/methodology/", "/blog/why-no-performance-claims/"],
  },
  {
    slug: "decoder-only",
    name: "Decoder-only transformer",
    definition:
      "A Transformer variant that uses only the decoder block (masked self-attention) and predicts the next token autoregressively. Used by GPT-family, Claude, Llama, Mistral, Gemini, and most production LLMs as of 2026. Contrast with encoder-decoder (T5, BART) and encoder-only (BERT) variants.",
    seeAlso: ["/claims/"],
  },
  {
    slug: "did-web",
    name: "did:web",
    definition:
      "A W3C Decentralized Identifier using a web domain as the identity anchor — e.g., did:web:sourcescore.org. The signing identity for VERITAS claim envelopes is preserved across all future key rotations; the underlying key material changes, the public identity does not.",
    seeAlso: ["/security/"],
  },
  {
    slug: "embedding",
    name: "Embedding",
    definition:
      "A dense numerical vector representation of a chunk of text (or other modality) such that semantically similar inputs produce numerically similar vectors. The retrieval backbone of RAG: documents are pre-embedded, queries are embedded at runtime, similarity-search returns top-K matches.",
    seeAlso: ["/concepts/llm-grounding/", "/concepts/rag-vs-veritas/"],
  },
  {
    slug: "evaluation-harness",
    name: "Evaluation harness",
    definition:
      "A framework that runs an LLM through a benchmark in a reproducible way (e.g., LM Evaluation Harness, HELM, lm-evaluation-harness). Different harnesses produce different scores for the same model — one reason VERITAS does not ship performance-comparison claims.",
    seeAlso: ["/blog/why-no-performance-claims/"],
  },
  {
    slug: "fact-shaped-claim",
    name: "Fact-shaped claim",
    definition:
      "An atomic assertion structured as subject + predicate + object (\"GPT-4 released_on 2023-03-14\"). Distinct from prose-shaped claims (paragraphs of text). VERITAS retrieves fact-shaped claims; RAG retrieves prose-shaped chunks.",
    seeAlso: ["/concepts/rag-vs-veritas/", "/claims/"],
  },
  {
    slug: "fine-tuning",
    name: "Fine-tuning",
    definition:
      "Continued training of a pre-trained model on a smaller, task-specific dataset. Common variants: full fine-tuning (all parameters updated), LoRA (low-rank adapters), QLoRA (quantized + LoRA), and instruction tuning (supervised on instruction-response pairs).",
    seeAlso: ["/claims/"],
  },
  {
    slug: "generate-then-verify",
    name: "Generate-then-verify",
    definition:
      "An LLM-grounding pattern where the model first produces a free-form response, then a verification layer checks each emitted assertion against a signed-claim catalog. Verified assertions get citation badges; unverified ones are flagged or stripped. Pairs well with VERITAS for production hallucination filters.",
    seeAlso: ["/blog/verify-ai-facts-five-lines-python/", "/docs/integrations/langchain/"],
  },
  {
    slug: "grounding",
    name: "Grounding (LLM)",
    definition:
      "Constraining a language model's output to facts that can be verified against an external source. The inverse of free-form generation: instead of trusting the model's parametric memory, provide retrieval evidence the model must cite. Three production patterns: prompt-stuffing, RAG, signed-claim verification.",
    seeAlso: ["/concepts/llm-grounding/"],
  },
  {
    slug: "hallucination",
    name: "Hallucination",
    definition:
      "A factual error generated by a language model, typically presented with the same fluency as a correct statement. Five categories: fabricated facts, misattributed quotes, fabricated citations, stitched-together claims, temporal hallucination. Rate depends on domain (~1-5% well-trodden, ~15-40% long-tail technical).",
    seeAlso: ["/concepts/hallucination/"],
  },
  {
    slug: "hmac-sha256",
    name: "HMAC-SHA256",
    definition:
      "A keyed message-authentication algorithm producing a 256-bit signature over an input. Used by VERITAS to sign claim envelopes — a consumer with the shared secret can re-compute the signature locally and prove the claim wasn't modified. Y2 migration target: W3C Verifiable Credentials with Ed25519 public-key signing.",
    seeAlso: ["/security/", "/docs/integrations/langchain/"],
  },
  {
    slug: "in-context-learning",
    name: "In-context learning",
    definition:
      "An LLM capability to perform a task by being shown examples in the prompt (rather than via gradient updates). Few-shot prompting is the canonical use; the model 'learns' the task from the examples alone, without weight changes. Capability scales with model size; emergent at ~1B+ parameters.",
    seeAlso: ["/claims/"],
  },
  {
    slug: "indexnow",
    name: "IndexNow",
    definition:
      "A search-engine protocol (Microsoft, Yandex, Seznam) that lets a publisher push URL updates to crawlers immediately rather than waiting for the next crawl. SourceScore pings IndexNow on every deploy so newly-shipped claims/concepts/integration pages are indexed faster.",
  },
  {
    slug: "llm",
    name: "LLM (Large Language Model)",
    definition:
      "A neural network trained to predict the next token in a sequence, scaled to billions or trillions of parameters. Distinguished from smaller language models by emergent capabilities: in-context learning, instruction following, chain-of-thought reasoning, tool use. Frontier examples in 2026: GPT-4o, Claude 3.5/3.7, Gemini 1.5, Llama 3.x, Mistral Large.",
  },
  {
    slug: "llms-txt",
    name: "llms.txt",
    definition:
      "An emerging convention (RFC-draft) for publishing a machine-readable manifest of a site's primary content URLs and citation-preferred sections. Lives at /llms.txt at the root. Helps LLM crawlers prioritize indexing. SourceScore's /llms.txt advertises 130 sources + 91 VERITAS claims + all primary product surfaces.",
  },
  {
    slug: "matchScore",
    name: "matchScore",
    definition:
      "A normalized [0.0, 1.0] score from /api/v1/search and /api/v1/verify indicating how strongly a search query overlaps with a candidate claim. Computed via keyword-overlap scoring across subject (×5), tags (×3), object (×3), statement (×2), predicate (×2). Higher matchScore = stronger lexical match; combine with confidence for ranking.",
    seeAlso: ["/docs/", "/playground/"],
  },
  {
    slug: "methodology-version",
    name: "Methodology version",
    definition:
      "The version-tag of the verification methodology used to validate a specific claim — e.g., 'veritas-v0.1'. Recorded inside every claim envelope so consumers can detect methodology drift when claims are re-verified under newer rules.",
    seeAlso: ["/methodology/"],
  },
  {
    slug: "mixture-of-experts",
    name: "Mixture-of-Experts (MoE)",
    definition:
      "A neural architecture pattern where a gating network routes each token through a small subset of available 'expert' subnetworks rather than the full model. Examples: Mixtral 8x7B (8 experts, 2 routed per token), Switch Transformer, Sparsely-Gated MoE. Improves parameter efficiency at fixed compute.",
    seeAlso: ["/claims/"],
  },
  {
    slug: "primary-source",
    name: "Primary source",
    definition:
      "A document authored by the originator of the fact: a preprint by the model's authors, a model card by the lab, official documentation, a release blog post by the company, a peer-reviewed proceedings entry. VERITAS requires at least one primary source per claim (≥2 sources total) for confidence ≥0.85.",
    seeAlso: ["/methodology/"],
  },
  {
    slug: "prompt-stuffing",
    name: "Prompt-stuffing",
    definition:
      "The simplest LLM grounding pattern: paste a curated set of facts into the model's context window and instruct it to answer using only those facts. Works at small scale (<50 facts); collapses when the catalog outgrows the context window. Right starting point — ship Day 1, migrate to RAG/VERITAS at week 2-3.",
    seeAlso: ["/concepts/llm-grounding/"],
  },
  {
    slug: "rag",
    name: "RAG (Retrieval-Augmented Generation)",
    definition:
      "An LLM grounding pattern that indexes a corpus with embeddings, retrieves the top-K relevant chunks at query time, and inserts them into the prompt as context. Introduced in Lewis et al. (2020). Works at any scale; cuts hallucination by roughly half on covered domains. Boundary failure mode: retrieved chunks are semantically similar but factually-wrong.",
    seeAlso: ["/concepts/rag-vs-veritas/", "/concepts/llm-grounding/"],
  },
  {
    slug: "retrieve-then-cite",
    name: "Retrieve-then-cite",
    definition:
      "An LLM-grounding pattern where the application retrieves the most relevant verified claims for the user's query, renders them as context blocks in the prompt, and instructs the model to cite the claim id with every fact it asserts. Complementary to generate-then-verify.",
    seeAlso: ["/docs/integrations/langchain/"],
  },
  {
    slug: "rlhf",
    name: "RLHF (Reinforcement Learning from Human Feedback)",
    definition:
      "A fine-tuning technique that aligns a pre-trained language model to human preferences. Introduced in Christiano et al. (2017) and operationalized for LLMs by Ouyang et al. (InstructGPT, 2022). Uses a learned reward model trained on human preference comparisons; the policy is optimized against this reward via PPO or related algorithms.",
    seeAlso: ["/claims/"],
  },
  {
    slug: "schema-honesty",
    name: "Schema honesty",
    definition:
      "A SourceScore methodology rule (per I-43): structured data on a page must accurately represent the visible content. Article schema headlines must be descriptive (not recommendation-encoded); JSON-LD fields must match rendered HTML; no hidden-element schemas. Aleyda 10-char #8 Differentiated reinforces this.",
    seeAlso: ["/methodology/", "/security/"],
  },
  {
    slug: "signed-claim",
    name: "Signed claim",
    definition:
      "A claim envelope ships with an HMAC-SHA256 signature over a canonical-JSON serialization of its fields. Verifying locally proves the claim wasn't modified in transit. The signing identity (did:web:sourcescore.org) is preserved across all future key rotations.",
    seeAlso: ["/security/", "/concepts/rag-vs-veritas/"],
  },
  {
    slug: "tokenizer",
    name: "Tokenizer",
    definition:
      "The component that converts text into discrete tokens (the units a model processes). Common algorithms: byte-pair encoding (BPE, Sennrich et al. 2015), SentencePiece (Kudo & Richardson 2018), tiktoken (OpenAI). The tokenizer determines context-window sizing — \"context window in tokens\" depends on the specific tokenizer in use.",
    seeAlso: ["/claims/"],
  },
  {
    slug: "tool-use",
    name: "Tool use (function calling)",
    definition:
      "An LLM capability to invoke external functions with structured arguments and incorporate the results into its response. Supported natively by OpenAI Chat Completions, Anthropic Messages API, Google Gemini, and via wrapper SDKs (Vercel AI SDK, LangChain). VERITAS exposes search_claims + verify_claim as tool-call targets.",
    seeAlso: ["/docs/integrations/openai-tools/"],
  },
  {
    slug: "transformer",
    name: "Transformer",
    definition:
      "A neural network architecture based on self-attention, introduced by Vaswani et al. (\"Attention Is All You Need\", 2017). The substrate of every frontier LLM since 2017. Decoder-only variants (GPT, Claude, Llama) dominate production deployments; encoder-decoder variants (T5, BART) are common in translation + summarization.",
    seeAlso: ["/claims/"],
  },
  {
    slug: "verbatim-excerpt",
    name: "Verbatim excerpt",
    definition:
      "A SourceScore methodology requirement: each cited source must include the exact quoted text from the source supporting the claim. Excerpts survive in the envelope even if the source URL goes 404 — the textual evidence is preserved alongside the URL. No paraphrasing.",
    seeAlso: ["/methodology/"],
  },
  {
    slug: "veritas",
    name: "VERITAS",
    definition:
      "SourceScore's signed-claim verification API for LLM developers. v0.1 publishes 326 hand-verified AI/ML claims with ≥2 primary sources each, HMAC-SHA256 signatures, and stable JSON envelopes. Free tier: 1,000 claims/month, no auth, no signup. Pricing tiers: Indie €19 / Startup €99 / Scale €499.",
    seeAlso: ["/quickstart/", "/claims/", "/pricing/"],
  },
  {
    slug: "ymyl",
    name: "YMYL (Your Money or Your Life)",
    definition:
      "Google's classification for content whose accuracy materially affects readers' wellbeing — health, finance, legal, safety. YMYL sites face stricter editorial-quality requirements (E-E-A-T signals, licensed-credential gating, performance-claim restrictions). SourceScore's source-rating methodology weights YMYL signals heavily.",
    seeAlso: ["/methodology/"],
  },
];

// Sort alphabetically by name for the rendered list.
const SORTED = [...TERMS].sort((a, b) => a.name.localeCompare(b.name));

const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://sourcescore.org/glossary/",
  name: "SourceScore VERITAS glossary",
  description:
    "Definitions for AI/ML terms used across SourceScore and VERITAS — grounding, RAG, hallucination, claim verification, signing, methodology rigor, and the surrounding ecosystem.",
  hasDefinedTerm: TERMS.map((t) => ({
    "@type": "DefinedTerm",
    "@id": `https://sourcescore.org/glossary/#${t.slug}`,
    name: t.name,
    description: t.definition,
    inDefinedTermSet: "https://sourcescore.org/glossary/",
    url: `https://sourcescore.org/glossary/#${t.slug}`,
  })),
};

export default function GlossaryPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(definedTermSetSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Glossary", url: "https://sourcescore.org/glossary/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Glossary</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Glossary
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Plain-language definitions for {TERMS.length} terms used across
          SourceScore and VERITAS. Each entry has a stable anchor URL
          you can deep-link to. DefinedTerm schema on every entry so LLMs
          can extract definitions cleanly.
        </p>
      </header>

      <section className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">
          Jump to
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          {SORTED.map((t) => (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              className="px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {t.name}
            </a>
          ))}
        </div>
      </section>

      <dl className="space-y-8">
        {SORTED.map((t) => (
          <div key={t.slug} id={t.slug} className="scroll-mt-24">
            <dt className="text-xl font-semibold mb-2">
              <a href={`#${t.slug}`} className="hover:underline">
                {t.name}
              </a>
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-2">
              {t.definition}
            </dd>
            {t.seeAlso && t.seeAlso.length > 0 && (
              <p className="text-sm text-zinc-500">
                See also:{" "}
                {t.seeAlso.map((url, i) => (
                  <span key={url}>
                    <a href={url} className="underline">
                      {url}
                    </a>
                    {i < (t.seeAlso?.length ?? 0) - 1 ? " · " : ""}
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
      </dl>

      <footer className="mt-14 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Missing a term?{" "}
          <a href="/contact/" className="underline">
            Suggest one
          </a>{" "}
          — most-requested terms ship in the next glossary refresh.
        </p>
      </footer>
    </main>
  );
}
