// /concepts/multimodal/ — 10th concept pillar.
//
// Targets high-volume "multimodal AI", "multimodal LLM", "vision-language
// model", "text-to-image", "text-to-video" queries. Aleyda Solis 10-char
// #2 Useful + #4 Extractable.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Multimodal AI — vision, audio, video, and cross-modal models";
const SUBTITLE =
  "Definition, the 4 modality classes (vision-language, text-to-image, text-to-video, text-to-audio), 2021-2025 timeline (CLIP → DALL·E → GPT-4V → Pixtral → Sora → Veo 2 → SAM 2), 6 production patterns, 7 failure modes, and how multimodal verification differs from text-only fact-checking.";
const CANONICAL = "https://sourcescore.org/concepts/multimodal/";
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
    { "@type": "Thing", name: "Multimodal AI" },
    { "@type": "Thing", name: "Vision-Language Model" },
    { "@type": "Thing", name: "Text-to-image" },
    { "@type": "Thing", name: "Text-to-video" },
    { "@type": "Thing", name: "Text-to-audio" },
    { "@type": "Thing", name: "CLIP" },
  ],
};

const definedTermsSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Multimodal AI — defined terms",
  description: "Definitions for multimodal AI, vision-language models, text-to-image, text-to-video, text-to-audio, and the cross-modal training techniques covered in this pillar.",
  url: CANONICAL,
  hasDefinedTerm: [
    {
      "@type": "DefinedTerm",
      name: "Multimodal AI",
      description: "An AI system that processes or generates more than one modality of data — typically text, images, audio, or video. Includes both input-multimodal (e.g. image + text → text) and output-multimodal (e.g. text → image).",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Vision-Language Model (VLM)",
      description: "A model that accepts images and text as joint input and produces text output. Examples: GPT-4 Vision, Claude 3 with vision, Pixtral 12B, Gemini 1.5, Apple Intelligence.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Text-to-image",
      description: "A model that generates an image from a natural-language prompt. Examples: DALL·E 3, Stable Diffusion 3, Midjourney, Flux, Imagen 3.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Text-to-video",
      description: "A model that generates a video from a natural-language prompt. Examples: Sora (OpenAI), Veo 2 (Google DeepMind), Runway ML, Pika.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "Text-to-audio",
      description: "A model that generates audio from a natural-language prompt. Examples: Suno v4 (music), ElevenLabs (voice), AudioLM, Stable Audio.",
      inDefinedTermSet: CANONICAL,
    },
    {
      "@type": "DefinedTerm",
      name: "CLIP",
      description: "Contrastive Language-Image Pre-training (Radford et al., OpenAI 2021) — the foundational dual-encoder model that maps images and text into a shared embedding space. Foundational to most modern multimodal systems.",
      inDefinedTermSet: CANONICAL,
    },
  ],
};

export default function MultimodalPage() {
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
              { name: "Multimodal", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Multimodal AI</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · Reference · 10th pillar
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>What is multimodal AI?</h2>
        <p>
          <strong>Multimodal AI</strong> is any system that processes or
          generates more than one modality of data — typically text,
          images, audio, or video. The defining capability is
          <em> cross-modal reasoning</em>: understanding the
          relationship between modalities, not just handling them in
          parallel.
        </p>
        <p>
          A model that takes a photo of a receipt and extracts the
          total amount is multimodal (image → text). A model that
          generates a movie scene from a paragraph is multimodal (text
          → video). A pipeline that does OCR on a PDF then summarizes
          it is <strong>not</strong> truly multimodal — it&apos;s
          two pipelines glued together.
        </p>

        <h2>The 4 modality classes</h2>
        <ol>
          <li>
            <strong>Vision-Language Models (VLMs)</strong> — image +
            text → text. Examples: GPT-4 Vision (OpenAI 2023-09),
            Claude 3 (Anthropic 2024-03), Pixtral 12B (Mistral
            2024-09), Apple Intelligence (Apple 2024-10), LLaVA, Llama
            3.2 Vision.
          </li>
          <li>
            <strong>Text-to-Image</strong> — text → image. Examples:
            DALL·E 3 (OpenAI 2023-10), Stable Diffusion 3 (Stability
            AI 2024-02), Midjourney (public beta 2022-07), Flux (Black
            Forest Labs 2024-08), Imagen 3 (Google DeepMind 2024).
          </li>
          <li>
            <strong>Text-to-Video</strong> — text → video. Examples:
            Sora (OpenAI 2024-02), Veo 2 (Google DeepMind 2024-12),
            Runway ML, Pika, Kling AI.
          </li>
          <li>
            <strong>Text-to-Audio</strong> — text → audio. Examples:
            Suno v4 (music, Suno 2024-11), ElevenLabs (voice, 2022-),
            AudioLM (Google 2022), Stable Audio (Stability AI 2023).
          </li>
        </ol>
        <p>
          Some models cross multiple classes. GPT-4o (2024-05) accepts
          image + audio + text and emits text + audio. Gemini 1.5 Pro
          (Google 2024-02) handles all four. These omnimodal models
          are the 2024-2025 frontier direction.
        </p>

        <h2>Timeline — 2021 to 2025</h2>
        <ul>
          <li>
            <strong>2021-01</strong> · CLIP + DALL·E 1 (OpenAI) —
            CLIP&apos;s contrastive dual-encoder pattern becomes the
            architectural ancestor of every modern multimodal system.
          </li>
          <li>
            <strong>2022-04</strong> · DALL·E 2 (OpenAI) — diffusion +
            CLIP-guided generation; first widely-usable photorealistic
            text-to-image.
          </li>
          <li>
            <strong>2022-07</strong> · Midjourney public beta —
            commoditized text-to-image for general users.
          </li>
          <li>
            <strong>2022-08</strong> · Stable Diffusion 1.0 (Stability
            AI) — open-weight; ignites the multimodal open-source
            ecosystem.
          </li>
          <li>
            <strong>2022-09</strong> · Whisper (OpenAI) — robust
            multilingual speech-to-text; foundational audio modality.
          </li>
          <li>
            <strong>2023-03</strong> · GPT-4 (multimodal capability
            announced; vision GA 2023-09-25).
          </li>
          <li>
            <strong>2023-07</strong> · SDXL (Stability AI) — quality
            jump on Stable Diffusion line.
          </li>
          <li>
            <strong>2023-10</strong> · DALL·E 3 (OpenAI) — better
            prompt-following + native ChatGPT integration.
          </li>
          <li>
            <strong>2024-02</strong> · Sora announced (OpenAI) — 60s
            video from text, watermark debate.
          </li>
          <li>
            <strong>2024-02</strong> · Stable Diffusion 3 (Stability
            AI) — Diffusion Transformer (DiT) architecture.
          </li>
          <li>
            <strong>2024-05</strong> · GPT-4o (OpenAI) — first
            production omnimodal at consumer scale.
          </li>
          <li>
            <strong>2024-07</strong> · SAM 2 (Meta AI) — real-time
            video segmentation; vision foundation model.
          </li>
          <li>
            <strong>2024-08</strong> · Flux (Black Forest Labs) — new
            open-weight contender; image-gen lead from former Stability
            researchers.
          </li>
          <li>
            <strong>2024-09</strong> · Pixtral 12B (Mistral) — first
            European open-weight multimodal at Apache 2.0.
          </li>
          <li>
            <strong>2024-11</strong> · Suno v4 (Suno) — best-in-class
            text-to-music quality.
          </li>
          <li>
            <strong>2024-12</strong> · Veo 2 (Google DeepMind) — 4K
            text-to-video; physics + cinematography upgrade.
          </li>
          <li>
            <strong>2025-02</strong> · Claude 3.7 Sonnet (Anthropic) +
            Grok 3 (xAI) — multimodal reasoning models with hybrid
            extended-thinking.
          </li>
        </ul>

        <h2>6 production patterns</h2>
        <ol>
          <li>
            <strong>Document understanding</strong> — VLM extracts
            structured data from PDFs, receipts, screenshots,
            scanned forms. Replaces OCR + LLM stack.
          </li>
          <li>
            <strong>Visual search + retrieval</strong> — CLIP-style
            embeddings index a product catalog or asset library; user
            queries by photo or text.
          </li>
          <li>
            <strong>Generative design</strong> — text-to-image for
            marketing assets, product mockups, concept art. Output
            often refined via inpainting or controlled by depth/pose
            conditioning.
          </li>
          <li>
            <strong>Video summarization + chaptering</strong> — VLM
            samples frames, transcribes audio, produces structured
            chapter markers + summary.
          </li>
          <li>
            <strong>Accessibility</strong> — alt-text generation for
            images, audio descriptions for video, sign-language
            translation. High-leverage, often regulatory.
          </li>
          <li>
            <strong>Robotics + embodied agents</strong> — VLM
            grounds perception (camera) to natural-language
            instructions. Examples: Google RT-2, Tesla Optimus
            embodiment.
          </li>
        </ol>

        <h2>7 failure modes</h2>
        <ol>
          <li>
            <strong>Hallucinated objects.</strong> VLM describes a
            cat in an image that contains no cat. More likely on
            low-resolution or ambiguous images.
          </li>
          <li>
            <strong>OCR errors on stylized text.</strong> VLM reads
            decorative fonts, handwriting, or low-contrast text
            incorrectly without admitting uncertainty.
          </li>
          <li>
            <strong>Counting failures.</strong> &quot;How many
            people are in this photo?&quot; remains surprisingly hard
            for VLMs as of 2024-2025.
          </li>
          <li>
            <strong>Spatial reasoning.</strong> &quot;Which object
            is left of the chair?&quot; — left-of-right confusion is
            common; models often default to image-frame coordinates.
          </li>
          <li>
            <strong>Text-image misalignment in generation.</strong>
            {" "}Text-to-image misses specific details (color of
            object 2, number of fingers, exact text in image). Worse
            on complex prompts.
          </li>
          <li>
            <strong>Watermark + provenance gaps.</strong>
            {" "}Generated media is hard to distinguish from real;
            social platforms struggling with detection. C2PA standard
            emerging; not universal.
          </li>
          <li>
            <strong>Modality leakage in evals.</strong> Models tested
            only on text-only tasks can pass while their vision
            capability has silently degraded. Run multimodal eval
            suites (MMMU, MathVista, BLINK) regularly.
          </li>
        </ol>

        <h2>Multimodal verification vs text-only</h2>
        <p>
          SourceScore VERITAS today covers text-only AI/ML claims (model
          release dates, paper authorship, parameter counts, benchmark
          scores). <strong>Multimodal verification is a different
          problem:</strong>
        </p>
        <ul>
          <li>
            <strong>Image provenance:</strong> &quot;Was this image
            actually generated by this model?&quot; — requires
            watermarking + perceptual hashing + reverse-search. C2PA
            spec emerging.
          </li>
          <li>
            <strong>Visual claim verification:</strong> &quot;Does
            this graph in the AI&apos;s response actually show
            decreasing trend?&quot; — requires re-rendering the data
            + comparison.
          </li>
          <li>
            <strong>Audio + video deepfake detection:</strong>
            {" "}separate research field (microexpression analysis,
            audio artifact detection). Not part of VERITAS scope.
          </li>
        </ul>
        <p>
          For now, multimodal fact-checking pipelines should: (1) use
          VERITAS for the textual facts the multimodal output references
          (e.g., &quot;this model was released on...&quot;), (2) use
          dedicated provenance tools (C2PA, Content Credentials) for the
          media itself. Vertical expansion to multimodal verification
          is Y2+ scope for VERITAS.
        </p>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/concepts/hallucination/">Hallucination</a> — the
            failure mode multimodal models share with text models
          </li>
          <li>
            <a href="/concepts/fine-tuning/">Fine-tuning</a> — applies
            equally to VLMs (LoRA on Pixtral, LLaVA fine-tunes)
          </li>
          <li>
            <a href="/concepts/embeddings/">Embeddings</a> — CLIP-style
            embeddings power multimodal retrieval
          </li>
          <li>
            <a href="/topics/multimodal-ai/">Topic hub: Multimodal AI</a>
            {" "}— catalog of multimodal-related claims
          </li>
          <li>
            <a href="/use-cases/content-moderation/">Use case: Content moderation</a>
            {" "}— pre-publish gate for AI-generated outputs including
            multimodal
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Building a multimodal AI pipeline that needs to verify the textual
          facts it emits? Browse the{" "}
          <a href="/claims/" className="underline">286 verified claims</a>
          {" "}or run the{" "}
          <a href="/quickstart/" className="underline">5-min quickstart</a>.
        </p>
      </footer>
    </article>
  );
}
