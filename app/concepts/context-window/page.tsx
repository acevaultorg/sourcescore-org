// /concepts/context-window/ — 12th concept pillar.
//
// Targets high-volume queries: "context window LLM", "context length",
// "GPT-4 context window", "Claude 200k", "Gemini 2M context", "long
// context LLM benchmark", "lost in the middle". Aleyda Solis 10-char
// #2 Useful + #4 Extractable + #9 Fresh.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Context window — what it is, why size matters, and the 2018-2025 explosion";
const SUBTITLE =
  "Definition, the 2018-2025 timeline (512 GPT-1 → 2M Gemini 1.5 Pro), 5 architectural enablers (RoPE, ALiBi, sliding-window attention, RingAttention, FlashAttention), the 'lost in the middle' problem, when long context helps vs hurts, and the 7 failure modes that limit usable context vs nominal context.";
const CANONICAL = "https://sourcescore.org/concepts/context-window/";
const PUBLISHED = "2026-05-17";

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
  about: [
    { "@type": "Thing", name: "Context window" },
    { "@type": "Thing", name: "Long context" },
    { "@type": "Thing", name: "Attention mechanism" },
    { "@type": "Thing", name: "RoPE" },
    { "@type": "Thing", name: "Lost in the middle" },
  ],
};

const definedTermsSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Context window — defined terms",
  description: "Definitions for context window, attention mechanism, RoPE, ALiBi, FlashAttention, and long-context techniques covered in this pillar.",
  url: CANONICAL,
  hasDefinedTerm: [
    {
      "@type": "DefinedTerm",
      name: "Context window",
      description: "The maximum number of tokens an LLM can process in a single forward pass — input + output combined. Measured in tokens (roughly 0.75 words per token in English). Bounded by training-time architecture choices + inference-time memory.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Token",
      description: "The atomic unit of LLM input/output, produced by a tokenizer (BPE, WordPiece, SentencePiece). One token ≈ 0.75 English words ≈ 4 characters. Different tokenizers produce different counts for the same text.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "RoPE (Rotary Position Embedding)",
      description: "Position-encoding technique introduced by Su et al. (RoFormer 2021). Encodes token positions via rotation in complex-number space; enables context extension via position-interpolation. Foundational to most 2023+ LLMs (Llama, Mistral, Qwen).",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "ALiBi (Attention with Linear Biases)",
      description: "Position-encoding alternative to RoPE that adds linear distance-based bias to attention scores (Press et al. 2022). Used by MPT, BLOOM. Enables context extension via simple extrapolation without retraining.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "FlashAttention",
      description: "I/O-aware attention algorithm (Dao et al. Stanford 2022) that tiles attention computation to keep working set in fast SRAM, reducing memory bandwidth bottleneck. Foundational to most long-context implementations.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Lost in the Middle",
      description: "The empirical finding (Liu et al. Stanford 2023) that LLMs attend best to information at the start + end of long contexts, but performance degrades sharply for information in the middle. Even when nominal context is 200k tokens, effective recall on middle content can drop by 30-50%.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Needle in a Haystack (NIAH)",
      description: "Standard long-context eval: hide a specific fact at varying positions in a long input, ask the model to retrieve it. Greg Kamradt's NIAH benchmark (2023) became the de facto stress test for long-context claims.",
      inDefinedTermSet: CANONICAL,
    },
  ],
};

export default function ContextWindowPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
              { name: "Context window", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Context window</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · Reference · 12th pillar
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>What is a context window?</h2>
        <p>
          The <strong>context window</strong> of an LLM is the maximum
          number of tokens the model can process in a single forward
          pass — input prompt + retrieved documents + system instructions
          + the output generation, all counted together. Measured in
          tokens (roughly 0.75 English words per token). Bounded by two
          things: the position-encoding architecture decided at training
          time, and the inference-time memory budget.
        </p>
        <p>
          Every modern LLM has a context window. The number is one of
          the most marketed-and-misunderstood specs in AI.
        </p>

        <h2>The 2018-2025 explosion</h2>
        <ul>
          <li>
            <strong>2018</strong> · GPT-1: 512 tokens (~380 words).
            Could read a paragraph.
          </li>
          <li>
            <strong>2019</strong> · GPT-2: 1,024 tokens. Could read a
            page.
          </li>
          <li>
            <strong>2020</strong> · GPT-3: 2,048 tokens.
          </li>
          <li>
            <strong>2022</strong> · GPT-3.5 / ChatGPT: 4,096 tokens (~3,000 words).
          </li>
          <li>
            <strong>2023-03</strong> · GPT-4: 8,192 tokens base /
            32,768 with -32k variant.
          </li>
          <li>
            <strong>2023-05</strong> · Anthropic Claude 1.3 100k —
            first jump to 6-figure tokens.
          </li>
          <li>
            <strong>2023-07</strong> · Llama 2: 4,096. The open
            ecosystem lagged early on.
          </li>
          <li>
            <strong>2023-11</strong> · GPT-4 Turbo: 128,000 tokens
            (~96,000 words — a short novel).
          </li>
          <li>
            <strong>2024-02</strong> · Gemini 1.5 Pro: 1 million
            tokens at launch, then 2 million at I/O 2024. Crossed the
            book-length threshold.
          </li>
          <li>
            <strong>2024-04</strong> · Llama 3: 8,192 → Llama 3.1: 128,000.
          </li>
          <li>
            <strong>2024-07</strong> · Mistral Nemo: 128,000 (Mistral
            + NVIDIA collab).
          </li>
          <li>
            <strong>2025-02</strong> · Claude 3.7 Sonnet: 200,000.
          </li>
          <li>
            <strong>2025-03</strong> · Gemma 3: 128,000 — open-weight
            128k joins the field.
          </li>
        </ul>

        <h2>The 5 architectural enablers</h2>
        <ol>
          <li>
            <strong>RoPE (Rotary Position Embedding).</strong> Most
            2023+ LLMs use RoPE. Enables context extension via
            position-interpolation (PI), NTK-aware scaling, YaRN.
            Foundational to Llama 2/3, Mistral, Qwen.
          </li>
          <li>
            <strong>ALiBi (Attention with Linear Biases).</strong>
            {" "}Alternative to RoPE. Used by MPT, BLOOM. Cleaner
            extrapolation but slightly worse base quality.
          </li>
          <li>
            <strong>FlashAttention + variants.</strong> I/O-aware
            attention (Dao et al. Stanford 2022) makes attention
            tractable at long lengths. FlashAttention-2 (2023) and
            FlashAttention-3 (2024) extend further.
          </li>
          <li>
            <strong>Sliding-window attention.</strong> Mistral 7B
            (2023) introduced 4k effective sliding window with 32k
            total context. Trades global access for tractable compute.
          </li>
          <li>
            <strong>Ring Attention + Striped Attention.</strong>{" "}
            Distributed attention computation across multiple GPUs,
            enabling Gemini 1.5 Pro&apos;s 2M tokens (Liu et al. 2023).
          </li>
        </ol>

        <h2>The &quot;Lost in the Middle&quot; problem</h2>
        <p>
          Liu et al. (Stanford 2023) showed empirically that even when
          a model nominally has a 100k+ context, recall on facts
          buried in the middle of long inputs degrades sharply.
          Position-of-fact-in-context vs accuracy plots typically show
          a U-shape: best at start, second-best at end, worst at the
          middle 50%.
        </p>
        <p>
          The 2024 follow-ups (Gemini 1.5 Pro&apos;s &quot;multi-needle
          in a haystack&quot;) show major improvement but the gap
          hasn&apos;t closed: <strong>nominal context window ≠
          effective context.</strong> Treat 200k as &quot;can read
          200k tokens without OOM&quot; not &quot;will use 200k
          tokens equally well.&quot;
        </p>

        <h2>The Needle in a Haystack benchmark</h2>
        <p>
          Greg Kamradt&apos;s NIAH benchmark (2023) became the de
          facto stress test. Setup: place a distinctive fact at
          varying positions in a long input; ask the model to retrieve
          it. Plot accuracy as function of (context-length, needle-position).
          Most pre-2024 long-context claims fall apart on NIAH.
          Gemini 1.5 Pro (2024-02) was the first model to pass NIAH
          to 1M+ at high accuracy; Claude 3 Opus and Claude 3.5 Sonnet
          improved further on the variant &quot;multi-needle&quot; +
          &quot;haystack of related distractors&quot; tests.
        </p>

        <h2>7 failure modes that limit usable context</h2>
        <ol>
          <li>
            <strong>Effective context shrinks with task complexity.</strong>
            {" "}Single-needle retrieval works at 200k+. Multi-hop
            reasoning across long context collapses much earlier.
          </li>
          <li>
            <strong>Tokenizer inflation for non-English.</strong> The
            same 100k tokens stores ~75k English words but only
            ~30-40k Chinese/Japanese characters. Effective context
            differs by language.
          </li>
          <li>
            <strong>Inference-cost quadratic at long lengths.</strong>
            {" "}Naive attention is O(n²); the marketed Gemini 1.5
            Pro 2M might be 100× slower than a 200k query. Pricing
            sometimes hides this.
          </li>
          <li>
            <strong>Recency bias.</strong> Models lean toward
            content at the end of the input — often whichever
            instruction came last wins, regardless of earlier
            constraints.
          </li>
          <li>
            <strong>System prompt leak through long context.</strong>
            {" "}Long retrieved contexts can dilute system-prompt
            instructions — model forgets it was supposed to format
            output a certain way.
          </li>
          <li>
            <strong>KV cache memory explosion.</strong> Inference
            memory grows linearly with context length. A 200k query
            on Llama 3 70B uses ~40GB of KV cache alone.
          </li>
          <li>
            <strong>Position-encoding break beyond training length.</strong>
            {" "}A model trained on 8k and stretched to 32k via
            naive RoPE-scaling often produces incoherent output past
            the training distribution boundary. YaRN + Position
            Interpolation + continued-pretraining fix this but
            don&apos;t eliminate it.
          </li>
        </ol>

        <h2>When long context wins vs when RAG wins</h2>
        <p>
          The pragmatic question: should you stuff your knowledge into
          a long context window, or retrieve-then-generate with RAG?
        </p>
        <ul>
          <li>
            <strong>Long context wins:</strong> single complex
            document (legal contract, codebase, scientific paper)
            where every chunk could matter; multi-document reasoning
            across a small set of related documents; conversation
            history that must be preserved exactly.
          </li>
          <li>
            <strong>RAG wins:</strong> large knowledge corpus
            (10k+ docs); knowledge that updates frequently; need
            citation back to source; cost-sensitive at scale (1k
            tokens per query × 1M queries = vastly cheaper than
            200k tokens per query).
          </li>
          <li>
            <strong>Both:</strong> production AI assistants that need
            both stable knowledge (RAG) and per-session memory (long
            context). Most modern chat applications use this hybrid.
          </li>
        </ul>
        <p>
          For verification specifically: see{" "}
          <a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a>
          {" "}— signed-claim verification works regardless of context
          length choice.
        </p>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a> —
            long context is one grounding strategy
          </li>
          <li>
            <a href="/concepts/embeddings/">Embeddings</a> — what
            powers retrieval when long context isn&apos;t enough
          </li>
          <li>
            <a href="/concepts/quantization/">Quantization</a> —
            reduces KV-cache memory cost at long contexts
          </li>
          <li>
            <a href="/concepts/fine-tuning/">Fine-tuning</a> —
            continued-pretraining on long sequences fixes
            position-encoding break
          </li>
          <li>
            <a href="/topics/inference-optimization/">Topic hub: Inference optimization</a>
            {" "}— FlashAttention + sliding-window attention +
            KV-cache strategies
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Building a long-context application and need to verify the
          factual claims the model emits across that context? Browse the{" "}
          <a href="/claims/" className="underline">306 verified claims</a>
          {" "}or run the{" "}
          <a href="/quickstart/" className="underline">5-min quickstart</a>{" "}
          — verification is stateless and works regardless of context length.
        </p>
      </footer>
    </article>
  );
}
