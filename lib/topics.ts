// VERITAS-Reborn — topic hub definitions.
//
// A topic hub is a curated /topics/[slug]/ page that:
//  - Groups claims around a theme (matched by tag filters)
//  - Provides 500-1000 words of editorial intro explaining the theme
//  - Renders a CollectionPage + DefinedTermSet schema for LLM citation
//  - Cross-links to concept pillars + integration guides
//
// Each hub is a programmatic SEO landing for theme-shaped queries
// ("foundational LLM papers list", "open-source LLMs 2024", etc.) and a
// engagement booster (more pages/session via curated browsing).
//
// Adding a new hub: append to TOPICS below. Brain ABSORB step 13a re-verifies
// that every hub's claimFilter matches ≥3 claims at build time.

import type { Claim } from "./claims-types";

export interface TopicHub {
  slug: string;
  title: string;
  /** SEO meta description (≤155 chars). */
  metaDescription: string;
  /** Hero subtitle (1-2 sentences). */
  subtitle: string;
  /** Filter predicate for catalog → hub members. */
  claimFilter: (c: Claim) => boolean;
  /** Sections within the page intro (one paragraph each). */
  sections: { heading: string; body: string }[];
  /** DefinedTerms surfaced as a DefinedTermSet for LLM extraction. */
  definedTerms: { name: string; description: string }[];
  /** Other topic hubs + concept pillars to surface as Related. */
  relatedHubs?: string[];
  relatedConcepts?: string[];
  relatedIntegrations?: string[];
}

export const TOPICS: TopicHub[] = [
  {
    slug: "foundational-papers",
    title: "Foundational AI/ML papers — the canonical reading list",
    metaDescription:
      "The foundational papers that built modern AI/ML: Transformer, LSTM, BERT, RLHF, RAG, LoRA, Chain-of-Thought, FlashAttention. Verified, dated, primary-sourced.",
    subtitle:
      "The papers that everything builds on. Each is hand-verified against the primary source — author, date, venue, and a verbatim excerpt from the abstract.",
    claimFilter: (c) =>
      (c.tags ?? []).includes("foundational") ||
      c.predicate === "introduced_in_paper" ||
      c.predicate === "published_in" ||
      c.predicate === "introduced_in",
    sections: [
      {
        heading: "Why a canonical reading list matters",
        body: "Production AI engineers don't have time to triangulate dates from sometimes-wrong blog posts. \"When was the transformer paper published?\" should be a 100ms lookup, not a 10-minute SERP triangulation. This hub catalogs the foundational papers with verified dates, authors, venues, and verbatim excerpts — every claim has ≥2 primary sources.",
      },
      {
        heading: "Pre-Transformer era",
        body: "The deep-learning revival ran on architectures and ideas that pre-date the Transformer. LSTM (Hochreiter & Schmidhuber 1997), Dropout (Hinton et al. 2014), GloVe (Pennington, Socher, Manning 2014), Word2Vec (Mikolov et al. 2013) — the recurrent + embedding foundation that 2015-2017 transformer work would surpass but not erase.",
      },
      {
        heading: "Transformer + pretraining era (2017-2020)",
        body: "Attention Is All You Need (Vaswani et al. 2017) opened the door. BERT (Devlin et al. 2019) closed the encoder-only branch. GPT-2 (Radford et al. 2019) shipped the decoder-only architecture that would eventually power frontier models. T5 (Raffel et al. 2020), RoBERTa, DistilBERT, ELECTRA each refined the pretraining recipe.",
      },
      {
        heading: "Frontier methods (2021-2025)",
        body: "Once architectures stabilized, the innovation moved to alignment (RLHF, Constitutional AI, DPO), efficient inference (FlashAttention, LoRA, QLoRA, GPTQ, vLLM), retrieval grounding (RAG, Self-RAG, ReAct), and tool-use (Toolformer, MCP). Each claim here is a paper that downstream work compounds against.",
      },
    ],
    definedTerms: [
      { name: "Foundational paper", description: "A research paper that other AI/ML papers cite as the canonical reference for an architecture, method, or technique." },
      { name: "Pretraining", description: "Training a model on a large general dataset before fine-tuning for a downstream task." },
      { name: "RLHF", description: "Reinforcement learning from human feedback — the alignment technique that produced InstructGPT and ChatGPT." },
    ],
    relatedHubs: ["multimodal-ai", "open-source-llms", "evaluation-benchmarks"],
    relatedConcepts: ["llm-grounding", "rag-vs-veritas", "citation-chain"],
    relatedIntegrations: ["langchain", "dspy"],
  },
  {
    slug: "multimodal-ai",
    title: "Multimodal AI — vision, image generation, and cross-modal models",
    metaDescription:
      "Multimodal AI catalog: CLIP, DALL·E, Stable Diffusion, Imagen, Flamingo, Sora, Gemini, Whisper. Verified release dates, papers, primary sources.",
    subtitle:
      "Models that combine vision, text, audio, or video. Hand-verified release dates, foundational papers, and the organizations behind them.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["multimodal", "image-generation", "vision", "speech-recognition", "vision-language"].includes(t),
      ),
    sections: [
      {
        heading: "The vision-language unification",
        body: "Until 2021, vision and language were largely separate research stacks. CLIP (Radford et al., OpenAI 2021) unified them with contrastive image-text pretraining. Flamingo (DeepMind 2022) demonstrated few-shot multimodal learning. By 2024 every frontier model (GPT-4o, Claude 3 family, Gemini 1.5/2.0) was natively multimodal — vision, audio, and text in a single forward pass.",
      },
      {
        heading: "Image generation — diffusion takes over",
        body: "GANs (Goodfellow et al. 2014) ruled image synthesis for ~7 years. Then diffusion arrived: DDPM (Ho et al. 2020), Stable Diffusion (CompVis 2022), DALL·E 3 (OpenAI 2023), Imagen (Google 2022), Stable Diffusion 3 (Stability AI 2024). Each generation refined photorealism and prompt-following. The community split between closed (DALL·E, Imagen) and open (Stable Diffusion, Flux).",
      },
      {
        heading: "Speech + video — the remaining modalities",
        body: "Whisper (OpenAI 2022, large-v3 2023) made high-quality speech-to-text public. Sora (OpenAI 2024) and Veo (Google 2024) opened text-to-video. The trend: every modality becomes accessible to a single API call within ~12 months of the breakthrough paper.",
      },
    ],
    definedTerms: [
      { name: "Multimodal model", description: "A model that accepts and/or generates more than one modality (text, image, audio, video) in a unified architecture." },
      { name: "Diffusion model", description: "A generative model that learns to reverse a noising process. Produces high-quality images, audio, and video samples." },
      { name: "Contrastive pretraining", description: "Training paradigm that learns by pulling matched pairs together and pushing unmatched pairs apart in embedding space. Used by CLIP." },
    ],
    relatedHubs: ["foundational-papers", "open-source-llms"],
    relatedConcepts: ["llm-grounding", "hallucination"],
    relatedIntegrations: ["openai-tools", "anthropic-sdk"],
  },
  {
    slug: "rag-and-retrieval",
    title: "RAG, retrieval, and verification — grounding LLM responses",
    metaDescription:
      "RAG papers + vector DBs + retrieval frameworks: original RAG paper, Self-RAG, FAISS, Pinecone, Weaviate, Qdrant, LangChain, LlamaIndex. Verified sources.",
    subtitle:
      "Retrieval-augmented generation, signed-claim verification, vector databases, and the frameworks that wire them together. The grounding stack as of 2025.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["rag", "vector-database", "vector-search", "retrieval", "tool-use", "framework"].includes(t),
      ),
    sections: [
      {
        heading: "Why retrieval — the parametric-memory ceiling",
        body: "An LLM trained on Wikipedia knows what was in Wikipedia at training time. It doesn't know about events after the cut-off. It can't cite specific sources. It hallucinates dates and parameter counts confidently when its parametric memory is fuzzy. Retrieval-Augmented Generation (Lewis et al. 2020) was the first widely-cited answer: combine a frozen pretrained model with a non-parametric memory you control + update.",
      },
      {
        heading: "The grounding stack",
        body: "Modern grounding pipelines have three layers. Retrieval — embed your corpus (often with FAISS, Pinecone, Weaviate, Qdrant), retrieve top-K at query time. Augmentation — splice retrieved chunks into the prompt. Verification — check the model's output against a source-of-truth (this is where SourceScore VERITAS sits). Self-RAG (Asai et al. 2023) is the in-model variant; signed claim verification is the out-of-model variant.",
      },
      {
        heading: "The framework ecosystem",
        body: "LangChain (Harrison Chase 2022-10) and LlamaIndex (Jerry Liu 2022-11) emerged within two weeks of each other as the dominant Python orchestration layers. DSPy (Stanford 2023) takes the programs-not-prompts approach. Pydantic AI (2024) adds type-safety. Anthropic's Model Context Protocol (2024-11) is the cross-vendor standard. Each framework has its own primitives but ultimately wires the same retrieval + augmentation + verification loop.",
      },
    ],
    definedTerms: [
      { name: "RAG", description: "Retrieval-Augmented Generation — pulling relevant documents from a corpus at query time, augmenting the LLM prompt with them, then generating an answer." },
      { name: "Vector database", description: "A database optimized for storing and similarity-searching dense vector embeddings. Foundational to RAG retrieval at scale." },
      { name: "Embedding", description: "A dense numerical vector that represents a chunk of text (or image, etc.) such that semantically similar chunks produce numerically similar vectors." },
      { name: "Self-RAG", description: "A variant of RAG where the model is fine-tuned to emit special reflection tokens deciding when to retrieve and when to self-critique." },
    ],
    relatedHubs: ["foundational-papers", "open-source-llms"],
    relatedConcepts: ["rag-vs-veritas", "llm-grounding", "hallucination"],
    relatedIntegrations: ["langchain", "llamaindex", "dspy", "openai-tools"],
  },
  {
    slug: "llm-releases-2024-2025",
    title: "LLM releases 2024–2025 — frontier and open-weight catalog",
    metaDescription:
      "Every major LLM released in 2024–2025: GPT-4o, Claude 3.5/Opus 4, Gemini 1.5/2.0, Llama 3-3.3, Mistral, DeepSeek-R1, Phi-4, Qwen, Gemma. Verified release dates.",
    subtitle:
      "The frontier-model releases that defined 2024 and the first half of 2025. Hand-verified release dates with model cards and official announcements.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) => t === "2024" || t === "2025") &&
      (c.predicate.includes("released") || c.predicate.includes("public") || c.predicate.includes("introduced")),
    sections: [
      {
        heading: "The frontier-model release cadence",
        body: "From 2023 to 2025 the frontier-model release cadence accelerated from quarterly to monthly. Every major lab shipped multiple iterations: OpenAI's GPT-4 → 4-Turbo → 4o → o-series; Anthropic's Claude 3 family → 3.5 family → Opus 4; Google's Gemini Pro → 1.5 Pro → Ultra → 2.0; Meta's Llama 2 → 3 → 3.1 → 3.2 → 3.3. The pace produced two problems: (1) developers couldn't track which model was current; (2) blog posts went stale in weeks. This hub is the canonical reference.",
      },
      {
        heading: "The open-weight wave",
        body: "2024 was the year open-weight models reached frontier parity for many tasks. Llama 3.1 405B (Meta 2024-07), Mistral Large (Mistral 2024), Qwen 2.5 (Alibaba 2024), DeepSeek V3 (DeepSeek 2024-12), DeepSeek-R1 (DeepSeek 2025-01), Phi-4 (Microsoft 2024-12), Gemma (Google 2024). Each release came with model card, official blog post, and Hugging Face deployment — citable primary sources, not just speculation.",
      },
      {
        heading: "Reasoning models — the new axis",
        body: "DeepSeek-R1 (January 2025) demonstrated that reinforcement-learning-trained reasoning models could match much larger conventional models on math + code benchmarks. OpenAI's o1 + o3 series brought test-time compute scaling. The trend redefined what \"capable model\" means: not just parameter count, but inference-time reasoning budget.",
      },
    ],
    definedTerms: [
      { name: "Frontier model", description: "A language model representing the current state of the art for general-purpose capabilities at its release date." },
      { name: "Open-weight model", description: "A model whose trained weights are publicly downloadable. May or may not include training data + training code." },
      { name: "Reasoning model", description: "A model trained to produce extended chain-of-thought before its final answer, often with RL-tuned reasoning rewards. DeepSeek-R1, OpenAI o1/o3 are examples." },
    ],
    relatedHubs: ["foundational-papers", "open-source-llms", "multimodal-ai"],
    relatedConcepts: ["llm-grounding", "evaluation-harness"],
    relatedIntegrations: ["openai-tools", "anthropic-sdk", "pydantic-ai"],
  },
];

export function findTopic(slug: string): TopicHub | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
