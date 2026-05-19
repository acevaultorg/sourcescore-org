// /concepts/quantization/ — 11th concept pillar.
//
// Targets buyer-intent + research-intent queries: "LLM quantization",
// "GGUF vs GPTQ vs AWQ", "4-bit inference", "run Llama on CPU", "QLoRA
// 4-bit base", "bitsandbytes 4-bit". Aleyda Solis 10-char #2 Useful +
// #4 Extractable + #8 Differentiated.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Quantization — running large models on small hardware (GGUF, GPTQ, AWQ, bitsandbytes)";
const SUBTITLE =
  "Definition, the 5 canonical quantization techniques (post-training quantization, GPTQ, AWQ, GGUF/GGML, bitsandbytes 4/8-bit), the precision-quality-speed tradeoff, when each format wins, and the 2022-2024 timeline that made 7B-on-laptop / 70B-on-workstation realistic.";
const CANONICAL = "https://sourcescore.org/concepts/quantization/";
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
    { "@type": "Thing", name: "Quantization" },
    { "@type": "Thing", name: "GGUF" },
    { "@type": "Thing", name: "GPTQ" },
    { "@type": "Thing", name: "AWQ" },
    { "@type": "Thing", name: "bitsandbytes" },
    { "@type": "Thing", name: "llama.cpp" },
  ],
};

const definedTermsSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Quantization — defined terms",
  description: "Definitions for quantization, GGUF, GPTQ, AWQ, bitsandbytes, and the on-device inference techniques covered in this pillar.",
  url: CANONICAL,
  hasDefinedTerm: [
    {
      "@type": "DefinedTerm",
      name: "Quantization",
      description: "The process of representing a model's weights (and sometimes activations) at lower numerical precision than its native format — typically 16-bit float → 8-bit int / 4-bit int — to reduce memory footprint and increase inference speed.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "GGUF (GPT-Generated Unified Format)",
      description: "Quantized-model file format introduced by the llama.cpp project (2023). Single-file, contains weights + metadata + tokenizer; supports 2-8 bit quantization. Successor to the earlier GGML format. Standard for CPU/laptop inference via llama.cpp + Ollama + LM Studio.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "GPTQ",
      description: "Post-training quantization algorithm (Frantar et al. ICLR 2023) using approximate second-order information to compress weights to 3-4 bits with minimal accuracy loss. GPU-friendly inference via auto-gptq + ExLlama kernels.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "AWQ (Activation-aware Weight Quantization)",
      description: "Post-training quantization that protects salient weights based on activation distribution (Lin et al., MIT 2023). Generally outperforms GPTQ on instruction-tuned models. GPU-only inference.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "bitsandbytes",
      description: "Python library for 4-bit + 8-bit quantization wrapping CUDA kernels (Dettmers et al. 2022). Enables QLoRA fine-tuning + dynamic-quantization inference in PyTorch. Used by Hugging Face Transformers `load_in_4bit=True`.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "llama.cpp",
      description: "C/C++ inference engine for LLaMA-family models (Gerganov, 2023-03). Supports CPU + GPU + Apple Silicon + WebGPU; introduced GGML then GGUF formats. Standard for hobbyist on-device LLM deployments.",
      inDefinedTermSet: CANONICAL,
    },
  ],
};

export default function QuantizationPage() {
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
              { name: "Quantization", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Quantization</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · Reference · 11th pillar
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>What is quantization?</h2>
        <p>
          <strong>Quantization</strong> is the process of representing a
          model&apos;s weights (and sometimes activations) at lower
          numerical precision than its native training format —
          typically 16-bit float → 8-bit int → 4-bit int — to reduce
          memory footprint and increase inference speed.
        </p>
        <p>
          The math: a 70B-parameter model at FP16 needs 140GB of memory
          (2 bytes per parameter). At 4-bit, that drops to ~35GB —
          fits on a single A100 80GB or two RTX 4090s. At 2-bit, ~17GB
          — fits on consumer hardware. <strong>Quantization is the
          single technique that made open-weight LLMs deployable
          outside data centers.</strong>
        </p>

        <h2>The 5 canonical quantization techniques</h2>
        <ol>
          <li>
            <strong>Post-Training Quantization (PTQ).</strong> Apply
            quantization after training, no retraining required. Fast,
            zero training cost. Trade-off: more quality loss than
            quantization-aware training. The foundation for all modern
            LLM quantization formats.
          </li>
          <li>
            <strong>GPTQ.</strong> Approximate second-order optimization
            quantizes weights one column at a time, using the inverse
            Hessian to compensate for errors. 3-4 bit with &lt;1%
            accuracy drop on most benchmarks. GPU-optimized via
            auto-gptq + ExLlama (Frantar et al. ICLR 2023).
          </li>
          <li>
            <strong>AWQ.</strong> Activation-aware Weight Quantization
            identifies salient weights (top ~1%) based on activation
            magnitude and protects them at higher precision. Typically
            beats GPTQ on instruction-tuned models (Lin et al., MIT
            2023).
          </li>
          <li>
            <strong>GGUF (formerly GGML).</strong> Single-file format
            for quantized LLMs targeting CPU + GPU + Apple Silicon
            inference. Supports K-quants (Q2_K, Q3_K_M, Q4_K_M, Q5_K_M,
            Q6_K, Q8_0). Standard for llama.cpp + Ollama + LM Studio
            (Gerganov, 2023).
          </li>
          <li>
            <strong>bitsandbytes 4-bit + 8-bit.</strong> Dynamic
            quantization at load-time via PyTorch CUDA kernels (Dettmers
            et al. 2022). Used by Hugging Face Transformers
            <code> load_in_4bit=True</code>. Foundational to QLoRA
            (4-bit base + LoRA adapters).
          </li>
        </ol>

        <h2>Format comparison — which to pick</h2>
        <ul>
          <li>
            <strong>GGUF (Q4_K_M):</strong> best for CPU + Apple Silicon
            inference; widest tooling support (llama.cpp, Ollama, LM
            Studio); single file. <em>Pick when:</em> on-device, no
            GPU, hobbyist deployment.
          </li>
          <li>
            <strong>GPTQ (4-bit):</strong> best for GPU inference with
            mature kernels (ExLlama, ExLlamaV2). <em>Pick when:</em>
            consumer/prosumer GPU (4090, A6000), production
            throughput.
          </li>
          <li>
            <strong>AWQ (4-bit):</strong> often beats GPTQ on
            instruction-tuned chat models; slightly less tooling.
            <em> Pick when:</em> deploying chat-tuned 13B+ on GPU and
            quality matters more than tooling familiarity.
          </li>
          <li>
            <strong>bitsandbytes 4-bit:</strong> dynamic load-in-4bit
            via Transformers. <em>Pick when:</em> research
            iteration, QLoRA fine-tuning, or one-shot inference where
            you don&apos;t want to pre-quantize.
          </li>
          <li>
            <strong>FP8 (H100+):</strong> hardware-native FP8 on H100
            and newer; minimal quality loss. <em>Pick when:</em>
            running on H100 + you need full quality near FP16.
          </li>
        </ul>

        <h2>The precision-quality-speed tradeoff</h2>
        <p>
          A rough rule of thumb (varies by model family):
        </p>
        <ul>
          <li>
            <strong>FP16 → 8-bit:</strong> ~0.1-0.5% benchmark drop;
            2× memory reduction; ~10-30% speedup
          </li>
          <li>
            <strong>FP16 → 4-bit:</strong> ~1-3% benchmark drop;
            4× memory reduction; ~50-150% speedup
          </li>
          <li>
            <strong>FP16 → 3-bit:</strong> ~3-6% benchmark drop;
            ~5× memory; speedup similar
          </li>
          <li>
            <strong>FP16 → 2-bit:</strong> ~10-20% benchmark drop;
            8× memory; depends heavily on technique (IQ2 + K-quant
            mitigate)
          </li>
        </ul>
        <p>
          Below 3-bit, perplexity climbs sharply for general LLMs
          (2024-12 community measurements). The 4-bit sweet spot is
          where most production deployments land.
        </p>

        <h2>Timeline — 2022 to 2024</h2>
        <ul>
          <li>
            <strong>2022-08</strong> · <em>LLM.int8()</em> (Dettmers et al.) —
            first practical 8-bit LLM inference; basis for bitsandbytes.
          </li>
          <li>
            <strong>2022-10</strong> · <em>GPTQ</em> paper (Frantar et al.) —
            sets the 4-bit PTQ benchmark.
          </li>
          <li>
            <strong>2023-03</strong> · <em>llama.cpp</em> released
            (Gerganov) — Llama runs on a MacBook M1 in ~24 hours of
            development.
          </li>
          <li>
            <strong>2023-04</strong> · <em>QLoRA</em> (Dettmers et al.,
            U Washington) — 4-bit base + LoRA fine-tuning lets 65B
            train on a single 48GB GPU.
          </li>
          <li>
            <strong>2023-06</strong> · <em>AWQ</em> paper (Lin et al.,
            MIT) — activation-aware variant beats GPTQ on chat models.
          </li>
          <li>
            <strong>2023-08</strong> · GGUF replaces GGML in llama.cpp
            — adds metadata, model-format versioning, named-tensor
            support.
          </li>
          <li>
            <strong>2023-10</strong> · ExLlamaV2 GPTQ kernel — 2-3×
            speedup vs auto-gptq on Llama-class models.
          </li>
          <li>
            <strong>2024-02</strong> · NVIDIA TensorRT-LLM ships
            production-grade quantization kernels including FP8 and
            INT4 GPTQ/AWQ paths.
          </li>
          <li>
            <strong>2024-06</strong> · IQ2 + IQ3 quants in llama.cpp —
            mixed-precision K-quants beat naive 2/3-bit by 10-30%.
          </li>
          <li>
            <strong>2024-07</strong> · K-quants become the new GGUF
            default — Q4_K_M now standard for community releases.
          </li>
        </ul>

        <h2>5 common failure modes</h2>
        <ol>
          <li>
            <strong>Outlier-induced collapse.</strong> At &lt;4 bits,
            outlier activations can blow up. Mitigation: AWQ
            outlier-protection, IQ-quants, increase bit-precision.
          </li>
          <li>
            <strong>Chat-template misalignment.</strong> Quantizing
            without preserving the chat template &amp; system prompt
            structure can degrade instruction-following. Always test
            on the actual chat format the model expects.
          </li>
          <li>
            <strong>Tokenizer drift.</strong> If the quantization
            pipeline strips/rebuilds the tokenizer, special tokens
            (BOS, EOS, padding) can mis-render. Compare token IDs
            before+after.
          </li>
          <li>
            <strong>KV-cache precision mismatch.</strong> Quantizing
            weights to 4-bit but leaving KV cache at FP16 wastes
            memory; quantizing KV cache too aggressively kills
            long-context quality. Q5_K_M cache is a common balance.
          </li>
          <li>
            <strong>Benchmark on wrong distribution.</strong> Most
            published quant-quality metrics use perplexity on WikiText
            — irrelevant for chat. Run your domain-specific eval
            before deploying.
          </li>
        </ol>

        <h2>When NOT to quantize</h2>
        <ul>
          <li>
            <strong>You have FP16/BF16 budget on H100.</strong> No need
            to quantize; native precision is the highest quality.
          </li>
          <li>
            <strong>Safety-critical applications</strong> — medical,
            legal, financial — where the 1-3% quality drop matters.
            Run full-precision unless cost or latency forces
            otherwise.
          </li>
          <li>
            <strong>Speculative decoding draft models.</strong>
            {" "}Already small; quantizing further trades quality for
            negligible memory savings.
          </li>
          <li>
            <strong>Training (not inference).</strong> Training
            requires FP32/BF16/FP16 gradients. Quantization is a
            post-training technique (QLoRA quantizes the FROZEN base;
            adapter weights stay fp16/bf16).
          </li>
        </ul>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/concepts/fine-tuning/">Fine-tuning</a> — QLoRA
            uses 4-bit base + LoRA adapters
          </li>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a> — the
            grounding pattern works regardless of quantization level
          </li>
          <li>
            <a href="/concepts/multimodal/">Multimodal</a> — quantizing
            VLMs preserves text quality but vision-tower precision
            matters more
          </li>
          <li>
            <a href="/topics/inference-optimization/">Topic hub: Inference optimization</a>
            {" "}— quantization is one of many techniques (alongside
            FlashAttention, KV cache, batching, speculative decoding)
          </li>
          <li>
            <a href="/topics/open-weight-models/">Topic hub: Open-weight models</a>
            {" "}— what you&apos;d quantize and run locally
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Running a quantized open-weight model locally and need to
          verify its factual outputs? Browse the{" "}
          <a href="/claims/" className="underline">336 verified claims</a>
          {" "}or run the{" "}
          <a href="/quickstart/" className="underline">5-min quickstart</a>{" "}
          — the verify endpoint is free and stateless.
        </p>
      </footer>
    </article>
  );
}
