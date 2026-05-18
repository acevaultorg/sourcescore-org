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
  {
    slug: "alignment-and-rlhf",
    title: "Alignment, RLHF, and Constitutional AI — the safety stack",
    metaDescription:
      "Alignment foundations: RLHF, InstructGPT, Constitutional AI, DPO, PPO. Verified papers and primary sources tracing how frontier models became usable.",
    subtitle:
      "Reinforcement learning from human feedback, constitutional rules, direct preference optimization. The alignment techniques that took raw LLMs from research toys to production assistants.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["rlhf", "alignment", "reinforcement-learning", "instruction-tuning", "preference-optimization"].includes(t),
      ),
    sections: [
      {
        heading: "Why alignment matters",
        body: "A pretrained language model maximizes next-token likelihood over its training corpus. That doesn't make it helpful, harmless, or honest. The first three years of frontier-LLM work (GPT-1 through GPT-3) demonstrated capability; the alignment work that followed (2020-2024) made those capabilities usable. Without RLHF + safety training, ChatGPT would still be the curiosity that GPT-3 was — impressive but unfit for production.",
      },
      {
        heading: "RLHF — the InstructGPT pattern",
        body: "Reinforcement learning from human feedback was first popularized at scale by InstructGPT (Ouyang et al., OpenAI 2022). Three stages: supervised fine-tuning on instruction-response pairs, reward model training on human preference comparisons, PPO-based RL using the reward model as feedback. This recipe became the alignment baseline every frontier lab now ships variants of.",
      },
      {
        heading: "Constitutional AI and the alternative",
        body: "Anthropic's Constitutional AI (Bai et al. 2022) replaces some of the human-preference data with AI-generated critiques against a written constitution. DPO (Rafailov et al. 2023) collapses the three-stage RLHF process into a single direct-optimization step. Each method targets the same end (alignment) with different cost + transparency trade-offs.",
      },
    ],
    definedTerms: [
      { name: "RLHF", description: "Reinforcement learning from human feedback. Trains a reward model on human preference comparisons, then fine-tunes the LLM with PPO to maximize the reward model's score." },
      { name: "Constitutional AI", description: "Anthropic's alignment approach using a written constitution + AI-generated critiques rather than purely human-preference data." },
      { name: "DPO", description: "Direct Preference Optimization. Skips the reward-model stage of RLHF by directly optimizing the model on preference pairs." },
      { name: "InstructGPT", description: "OpenAI's instruction-tuned GPT-3 variant that popularized the RLHF pipeline. Direct ancestor of ChatGPT." },
    ],
    relatedHubs: ["foundational-papers", "llm-releases-2024-2025"],
    relatedConcepts: ["llm-grounding", "hallucination"],
    relatedIntegrations: ["langchain", "anthropic-sdk"],
  },
  {
    slug: "evaluation-benchmarks",
    title: "Evaluation, benchmarks, and the harness problem",
    metaDescription:
      "AI/ML benchmarks: MMLU, GLUE, SuperGLUE, HumanEval, Chatbot Arena, AlpacaEval. Verified papers, datasets, and the methodological caveats that make benchmark comparisons hard.",
    subtitle:
      "The benchmarks that define \"capable model\" — and the methodology caveats that make cross-paper comparisons unreliable. Hand-verified primary sources for every benchmark cited in the literature.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["benchmark", "evaluation", "leaderboard", "human-preference", "llm-as-judge"].includes(t),
      ),
    sections: [
      {
        heading: "Why benchmarks matter — and why they mislead",
        body: "Benchmarks are how the field measures progress. MMLU, HumanEval, GLUE, SuperGLUE, Chatbot Arena — each tries to capture a different dimension of capability (knowledge breadth, code generation, language understanding, conversational quality). But the same benchmark name can produce different scores across different evaluation harnesses + prompt formats + decoding strategies, which is exactly why VERITAS does not ship performance-comparison claims (see /blog/why-no-performance-claims/).",
      },
      {
        heading: "The classics",
        body: "GLUE (Wang et al. 2018) and SuperGLUE (Wang et al. 2019) were the first standardized natural-language-understanding benchmarks. ImageNet (Deng et al., CVPR 2009) preceded them in vision. BLEU (Papineni et al., ACL 2002) and ROUGE (Lin, ACL 2004) measured machine translation and summarization. These benchmarks shaped a decade of progress.",
      },
      {
        heading: "The LLM-era benchmarks",
        body: "MMLU (Hendrycks et al. 2021) tests knowledge breadth across 57 subjects. HumanEval (Chen et al., OpenAI 2021) tests code generation. AlpacaEval (Tatsu Lab 2023) uses LLM-as-judge. Chatbot Arena (LMSYS 2023) uses pairwise human preferences. Each adds methodological subtlety: which split? which prompt? few-shot or zero-shot? chain-of-thought? The right reading is: track benchmarks as trend signals, not absolute rankings.",
      },
    ],
    definedTerms: [
      { name: "Benchmark", description: "A standardized dataset and evaluation protocol designed to measure a specific capability across multiple models." },
      { name: "Evaluation harness", description: "Software that runs an LLM through a benchmark in a reproducible way. Different harnesses (LM Evaluation Harness, HELM, lm-eval) produce different scores for the same nominal benchmark." },
      { name: "LLM-as-judge", description: "Evaluation approach where one LLM scores the outputs of another. Used by AlpacaEval and MT-Bench. Cheaper than human evaluation; biased toward judge-model preferences." },
    ],
    relatedHubs: ["foundational-papers", "llm-releases-2024-2025"],
    relatedConcepts: ["evaluation-harness", "hallucination"],
    relatedIntegrations: ["dspy"],
  },
  {
    slug: "inference-optimization",
    title: "Inference optimization — quantization, attention, and serving",
    metaDescription:
      "LLM inference optimization: FlashAttention, GPTQ, QLoRA, vLLM, PagedAttention, LoRA. Verified papers and tools for making frontier models cheaper to run.",
    subtitle:
      "The techniques that take a frontier model from \"impossible to deploy\" to \"$0.001 per call.\" Quantization, attention algorithms, fine-tuning adapters, and serving systems.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["inference", "serving", "quantization", "fine-tuning", "flashattention", "lora"].includes(t),
      ),
    sections: [
      {
        heading: "The inference-cost wall",
        body: "Training a 70B-parameter model is expensive once; running it for millions of users is expensive forever. Inference optimization has driven most of the practical-deployment progress 2022-2025. Three axes: faster attention (FlashAttention, PagedAttention), smaller weights (GPTQ, AWQ, QLoRA, GGUF quantization), better serving (vLLM, llama.cpp, Ollama, TGI).",
      },
      {
        heading: "Attention improvements",
        body: "FlashAttention (Dao et al. 2022) recomputes attention with IO-aware tiling, giving the same output with much less memory pressure. PagedAttention (Kwon et al., vLLM 2023) treats KV cache like OS-managed memory pages. Together these unlock context windows that were previously impossible on commodity hardware.",
      },
      {
        heading: "Quantization + adapters",
        body: "LoRA (Hu et al. 2021) and QLoRA (Dettmers et al. 2023) make fine-tuning a 70B model possible on a single consumer GPU. GPTQ (Frantar et al. 2022) and AWQ quantize trained models to 4-bit with minimal quality loss. The combined effect: a frontier-quality model that runs locally on a $1,500 GPU.",
      },
    ],
    definedTerms: [
      { name: "FlashAttention", description: "IO-aware exact attention algorithm by Dao et al. (2022) that reduces memory pressure during attention computation without changing outputs." },
      { name: "Quantization", description: "Reducing the bit-precision of model weights (typically from 16-bit to 4-bit or 8-bit) to lower memory footprint and inference cost." },
      { name: "LoRA", description: "Low-Rank Adaptation. Fine-tunes a small adapter that gets merged with frozen base-model weights. Drastically cheaper than full fine-tuning." },
      { name: "PagedAttention", description: "KV-cache management technique from vLLM that treats GPU memory like OS-managed pages, allowing flexible request scheduling at high throughput." },
    ],
    relatedHubs: ["foundational-papers", "open-source-llms"],
    relatedConcepts: ["llm-grounding"],
    relatedIntegrations: ["pydantic-ai", "vercel-ai-sdk"],
  },
  {
    slug: "ai-organizations",
    title: "AI organizations — labs, founders, and the talent map",
    metaDescription:
      "Organizational landscape of AI: OpenAI, Anthropic, DeepMind, Mistral, Stability AI, EleutherAI, Hugging Face, Cohere, AI21, Together AI, xAI. Founding dates and lineage.",
    subtitle:
      "The labs and companies that ship frontier AI/ML. Founding dates, parent organizations, and the lineage that shaped each lab's culture. Hand-verified from official corporate pages + press records.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["company", "founded"].includes(t),
      ),
    sections: [
      {
        heading: "Mapping the lab landscape",
        body: "Frontier-AI work in 2026 is concentrated across roughly a dozen labs: OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral, Microsoft Research, xAI, Stability AI, Cohere, AI21 Labs, EleutherAI, Together AI, plus the Chinese frontier (DeepSeek, Alibaba/Qwen, Zhipu/GLM). Each has its own model lineage, alignment philosophy, and funding model.",
      },
      {
        heading: "Founders + lineage matters",
        body: "Anthropic's founders left OpenAI in 2021 over alignment-direction disagreements. DeepMind was acquired by Google in 2014 but maintained a distinct research culture until the 2023 merger with Google Brain. Mistral was founded by ex-DeepMind + ex-Meta researchers in 2023. Knowing where each lab's researchers came from helps predict what kind of models they'll ship.",
      },
      {
        heading: "Open-source vs closed",
        body: "The labs split roughly into open-weight (Meta, Mistral, Stability AI, EleutherAI, Hugging Face, Together AI, Alibaba's Qwen, DeepSeek, Allen Institute's OLMo) and closed-API (OpenAI, Anthropic, Google's Gemini API, Cohere, xAI). Some are hybrid (Google releases Gemma weights but not Gemini's). The boundary moves: 2024 saw multiple closed labs release smaller open-weight variants under pressure from open competitors.",
      },
    ],
    definedTerms: [
      { name: "Frontier lab", description: "An AI lab that produces models at or near the current state-of-the-art for general-purpose capabilities. As of 2026: OpenAI, Anthropic, Google DeepMind, Meta AI, Mistral, plus a small number of Chinese labs." },
      { name: "Open-weight model", description: "A model whose trained weights are publicly downloadable, regardless of whether training data + code are also released." },
      { name: "Lab lineage", description: "The chain of researcher movements that shape a lab's culture and research direction. Often more predictive of model behavior than corporate stated priorities." },
    ],
    relatedHubs: ["llm-releases-2024-2025", "foundational-papers"],
    relatedConcepts: ["llm-grounding"],
    relatedIntegrations: ["openai-tools", "anthropic-sdk"],
  },
  {
    slug: "agent-frameworks",
    title: "Agent frameworks — orchestration libraries for LLM apps",
    metaDescription:
      "LLM agent frameworks: LangChain, LlamaIndex, DSPy, Pydantic AI, OpenAI Agents, AutoGen, CrewAI. Verified releases, founding orgs, and primary documentation.",
    subtitle:
      "Frameworks that orchestrate LLMs in multi-step agent pipelines. Each picks different defaults for tool-use, memory, retrieval, and observability.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["framework", "agent", "tool-use", "orchestration", "langchain", "llamaindex", "dspy"].includes(t),
      ),
    sections: [
      {
        heading: "Why frameworks emerged",
        body: "By mid-2022 the agent loop pattern — model emits tool call, runtime executes, model receives result, repeat — was clearly the production shape. Writing it from scratch for each project produced inconsistent error handling, inconsistent retries, inconsistent observability. Frameworks like LangChain (October 2022) and LlamaIndex (November 2022) emerged within weeks of each other to standardize.",
      },
      {
        heading: "The current landscape",
        body: "As of 2026: LangChain (orchestration breadth) + LlamaIndex (retrieval-first RAG) dominate Python. DSPy (Stanford) offers programs-not-prompts. Pydantic AI brings type-safety. OpenAI Agents SDK + Anthropic SDK are vendor-native. Vercel AI SDK owns Next.js. Each has a different mental model — pick by archetype + audience + commitment level.",
      },
      {
        heading: "The cross-vendor convergence",
        body: "Anthropic's Model Context Protocol (November 2024) is the cross-vendor standard for tool exposure. Adopted by Anthropic, OpenAI, and most major frameworks within ~6 months. The framework count may eventually drop as MCP absorbs per-vendor SDKs — but as of 2026 the seven-framework landscape is what production developers face.",
      },
    ],
    definedTerms: [
      { name: "Agent framework", description: "A library that orchestrates LLM tool-use loops, retrieval, memory, and observability. Examples: LangChain, LlamaIndex, DSPy." },
      { name: "Tool-use loop", description: "The multi-turn pattern: model emits tool call, runtime executes tool, model receives result, model decides next step or final answer." },
      { name: "Programs-not-prompts", description: "DSPy's paradigm: write structured programs (modules + signatures) that get optimized for prompts and few-shot examples rather than hand-writing prompts." },
    ],
    relatedHubs: ["rag-and-retrieval", "foundational-papers"],
    relatedConcepts: ["llm-grounding", "rag-vs-veritas"],
    relatedIntegrations: ["langchain", "llamaindex", "dspy", "pydantic-ai", "openai-tools", "anthropic-sdk", "vercel-ai-sdk"],
  },
  {
    slug: "vector-databases",
    title: "Vector databases — storing and searching embeddings at scale",
    metaDescription:
      "Vector database catalog: FAISS, Pinecone, Weaviate, Qdrant, Chroma, Milvus, pgvector. Founding dates, primary sources, and when to use each.",
    subtitle:
      "Databases optimized for similarity search over dense vector embeddings. The retrieval backbone of every production RAG pipeline.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        ["vector-database", "vector-search", "similarity-search", "faiss", "pinecone", "weaviate", "qdrant"].includes(t),
      ),
    sections: [
      {
        heading: "Why dedicated vector DBs",
        body: "Standard databases (Postgres, MySQL, MongoDB) handle exact-match + range queries. Vector queries are different: given a 1536-dimensional query vector, return the K nearest neighbors by cosine similarity from a corpus of millions of vectors, in &lt;100ms. The data structures (HNSW, IVF, PQ) and tuning trade-offs are non-trivial. Dedicated vector DBs ship those primitives.",
      },
      {
        heading: "The four main options",
        body: "FAISS (Facebook AI 2017) is a library, not a database — fastest, no service to run, embed in your app. Pinecone (founded 2019) is the managed-cloud leader — easiest production deployment, costs scale with index size. Weaviate, Qdrant, and Milvus are open-source + managed-cloud — Qdrant is the easiest local + production option for most teams. Chroma is the simplest dev-loop option (single-file SQLite-backed).",
      },
      {
        heading: "The Postgres option",
        body: "pgvector — a Postgres extension — has matured enough by 2025 that for teams already on Postgres, adding pgvector beats adding a separate vector DB. Trade-off: pgvector's similarity-search performance lags purpose-built vector DBs at &gt;10M vectors, but is competitive below that threshold.",
      },
    ],
    definedTerms: [
      { name: "Vector database", description: "A database optimized for storing and similarity-searching high-dimensional vector embeddings. Foundational to RAG retrieval at scale." },
      { name: "HNSW", description: "Hierarchical Navigable Small World — the dominant approximate-nearest-neighbor algorithm. Used by FAISS, Pinecone, Weaviate, Qdrant, pgvector." },
      { name: "pgvector", description: "Postgres extension that adds vector storage + similarity search. Lets teams already on Postgres avoid a separate vector DB." },
    ],
    relatedHubs: ["rag-and-retrieval", "inference-optimization"],
    relatedConcepts: ["embeddings", "rag-vs-veritas"],
    relatedIntegrations: ["langchain", "llamaindex"],
  },
  {
    slug: "prompt-engineering",
    title: "Prompt engineering — patterns that work",
    metaDescription:
      "Prompt engineering catalog: Chain-of-Thought, ReAct, Tree of Thoughts, few-shot, system-prompt patterns. Verified papers and the patterns that became production-standard.",
    subtitle:
      "The prompting patterns that survived 2022-2025 contact with production systems. Each is a published research finding (not a Medium-post folk recipe) — Chain-of-Thought, ReAct, Tree of Thoughts, instruction-tuning, few-shot, in-context learning.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        [
          "chain-of-thought",
          "react",
          "tree-of-thoughts",
          "tot",
          "prompting",
          "in-context-learning",
          "instruction-tuning",
          "few-shot",
        ].includes(t),
      ),
    sections: [
      {
        heading: "Why prompting still matters",
        body: "Frontier models in 2025-2026 are massively more capable than 2022-23 ancestors, but prompt structure still dramatically affects output quality. The reason: the model's training distribution rewards certain shapes of input (step-by-step reasoning, structured examples, explicit role assignments). Prompt patterns that align with the training distribution out-perform raw queries.",
      },
      {
        heading: "The foundational patterns",
        body: "Chain-of-Thought (Wei et al., 2022) — append 'let's think step by step' and watch reasoning benchmarks jump. ReAct (Yao et al., 2022) — interleave reasoning + action steps for tool-use agents. Tree of Thoughts (Yao et al., 2023) — generalize CoT to branching exploration for deliberate problem-solving. InstructGPT (Ouyang et al., 2022) — RLHF training on instruction-response pairs is why models follow instructions at all.",
      },
      {
        heading: "What still doesn't work reliably",
        body: "Self-evaluation (asking the model 'are you sure?') is poorly calibrated. Few-shot prompting beats zero-shot for narrow extraction but doesn't help open-ended generation. 'Adversarial' prompts that try to bypass safety training increasingly fail on aligned models. Prompt engineering ≠ jailbreaking; the patterns that survive are the ones grounded in published research.",
      },
    ],
    definedTerms: [
      { name: "Chain-of-Thought (CoT)", description: "Prompting technique that elicits step-by-step reasoning before the final answer. Wei et al. (Google Brain, 2022) found dramatic reasoning-benchmark gains from this single technique." },
      { name: "ReAct", description: "Reasoning + Acting interleaved pattern (Yao et al., Princeton+Google 2022). Foundational to agent loops — the model emits Thought → Action → Observation cycles." },
      { name: "In-context learning", description: "The capability of LLMs to learn new patterns from examples in the prompt without weight updates. Emerged at GPT-3 scale; remains the primary mechanism for few-shot prompting." },
      { name: "Instruction tuning", description: "Fine-tuning a pretrained LM on instruction-response pairs (often RLHF-augmented) so the model follows natural-language instructions. The InstructGPT paper (2022) is the canonical reference." },
    ],
    relatedHubs: ["foundational-papers", "alignment-and-rlhf", "agent-frameworks"],
    relatedConcepts: ["llm-grounding", "function-calling"],
    relatedIntegrations: ["dspy", "openai-tools", "anthropic-sdk"],
  },
  {
    slug: "open-weight-models",
    title: "Open-weight LLMs — the 2023-2025 catalog",
    metaDescription:
      "The open-weight LLM landscape: Llama, Mistral, Gemma, DeepSeek, Qwen, Falcon, Yi, Phi, OLMo, Granite, Hunyuan, Jamba, Aya, SmolLM. Verified release dates, licenses, parameter counts.",
    subtitle:
      "The open-weight LLM landscape — every major release verified against the official announcement and the Hugging Face model card. Includes license, parameter count, release date, and family lineage.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        [
          "open-weight",
          "llama-2",
          "llama-3",
          "llama-3-2",
          "mistral",
          "mixtral",
          "gemma",
          "gemma-2",
          "deepseek",
          "deepseek-v2",
          "deepseek-v3",
          "qwen",
          "falcon",
          "yi",
          "phi",
          "olmo",
          "olmo-2",
          "granite",
          "hunyuan-large",
          "jamba",
          "aya-23",
          "smollm",
          "pixtral",
          "mistral-nemo",
          "mistral-saba",
          "nemotron",
          "stable-lm",
          "tulu",
          "starcoder",
        ].includes(t),
      ),
    sections: [
      {
        heading: "The open-weight wave",
        body: "Between Llama 2 (July 2023) and Llama 4 (April 2025), open-weight LLMs went from rare research artifacts to a competitive parallel ecosystem matching frontier closed APIs on most general benchmarks. The fleet of open-weight families — Meta Llama, Mistral, Google Gemma, Alibaba Qwen, DeepSeek, Allen AI OLMo, IBM Granite, TII Falcon, 01.AI Yi, Stability LM, Microsoft Phi, Tencent Hunyuan — gave researchers, fine-tuners, and on-prem deployments real options. The license diversity matters: some are pure Apache 2.0 (Mistral most, Gemma 2 under Gemma Terms, OLMo Apache 2.0), some are conditional (Llama 3 with monthly-active-user threshold), some are NVIDIA Open Model License (Nemotron), some are research-only.",
      },
      {
        heading: "Sizes + architectures span 4 orders of magnitude",
        body: "Open weights range from on-device-tier SmolLM 135M up to Hunyuan-Large 389B (52B active MoE). Architectures span dense Transformer (most Llama, Mistral 7B, Gemma 2), Mixture-of-Experts (Mixtral 8x7B/8x22B, DeepSeek-V2/V3, Hunyuan-Large, Mistral Nemo isn't MoE), and hybrid SSM-Transformer (AI21 Jamba — first production Mamba). The choice of architecture maps to deployment tradeoffs: MoE = high quality at lower active-parameter cost; dense = simpler inference; SSM hybrid = longer context window with lower attention-quadratic cost.",
      },
      {
        heading: "Multilingual + specialist forks",
        body: "Beyond the English-default releases, the open-weight ecosystem has specialist forks. Cohere Aya 23 covers 23 languages; Mistral Saba targets Arabic + South Asian; Allen AI Tülu 3 is the open-replication recipe for Llama-3-Instruct quality; Stability LM specializes in stability of generation; StarCoder 2 focuses on code. The composition matters because LLM cost-per-token is roughly constant in the open ecosystem but quality on a specialist task varies massively. Pick the right specialist before fine-tuning a general model.",
      },
      {
        heading: "Why this catalog matters for verification",
        body: "AI-assistants are most likely to hallucinate when they confidently misstate a release date, license, parameter count, or family lineage. Open-weight models confuse the picture further: Llama 2 vs Llama 3 vs Llama 3.1 vs Llama 3.2 vs Llama 3.3 vs Llama 4 — six distinct releases, six distinct dates, frequent mis-attribution. This hub holds the verified record for each.",
      },
    ],
    definedTerms: [
      { name: "Open-weight", description: "A model whose trained weights are publicly downloadable, with a license permitting at least research use. Distinct from open-source (which would require open training data + code + weights)." },
      { name: "Mixture-of-Experts (MoE)", description: "Architecture where each token routes to a small subset of expert sub-networks. Examples: Mixtral 8x7B (8 experts × 7B params, 2 active per token), DeepSeek-V3 (671B total / 37B active), Hunyuan-Large (389B total / 52B active)." },
      { name: "Apache 2.0 license", description: "Permissive open-source license allowing commercial use, modification, redistribution. Used by Mistral 7B, Mixtral, OLMo 2, IBM Granite, AI21 Jamba, Mistral Pixtral 12B, Mistral Nemo." },
      { name: "Llama 3 Community License", description: "Meta's license for Llama 3 family — permissive for most use but requires a separate agreement if your platform exceeds 700M monthly active users." },
      { name: "Tülu", description: "Allen Institute for AI's open-recipe instruction-tuning project. Tülu 3 (2024-11) replicates Llama-3-Instruct quality with fully-open training data + code + recipes." },
    ],
    relatedHubs: ["foundational-papers", "llm-releases-2024-2025", "alignment-and-rlhf"],
    relatedConcepts: ["fine-tuning", "llm-grounding"],
    relatedIntegrations: ["openai-tools", "anthropic-sdk", "vercel-ai-sdk"],
  },
  {
    slug: "llm-observability",
    title: "LLM observability — tracing, logging, and evals for production AI",
    metaDescription:
      "The LLM observability landscape: LangSmith, Langfuse, Helicone, Vellum AI. Verified founding dates + open-source status + use cases.",
    subtitle:
      "Once an LLM application reaches production, you need traces, evals, and feedback loops. This hub catalogs the production-grade observability platforms and what each is best for.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        [
          "langsmith",
          "langfuse",
          "helicone",
          "vellum-ai",
          "observability",
          "tracing",
          "llm-platform",
          "evaluation",
          "evaluation-harness",
        ].includes(t),
      ),
    sections: [
      {
        heading: "Why LLM observability is its own product category",
        body: "Traditional APM (Datadog, New Relic, Honeycomb) handles HTTP latency, error rates, and infrastructure metrics. None of that captures what matters in LLM applications: which prompts produced bad outputs, how a chain spent its tokens, whether a fine-tune is regressing on the eval set, whether a user accepted a draft, what a multi-step agent's intermediate steps did. LLM observability emerged 2022-2024 as a distinct category because the questions changed.",
      },
      {
        heading: "The four production-grade platforms (as of 2025)",
        body: "LangSmith (LangChain, hosted) is the default for LangChain users; built-in to the LangChain ecosystem with strong eval framework. Langfuse (open-source + hosted) is the open-source champion — self-hostable, OpenTelemetry-compatible, framework-agnostic. Helicone (open-source + hosted) routes via proxy + adds caching, retries, rate limits alongside observability. Vellum AI is the developer-platform-with-evaluation positioning — workflow builder + eval orchestration + production tracing.",
      },
      {
        heading: "Eval coverage matters more than trace volume",
        body: "Production LLM observability isn't about gathering 100% of traces — it's about catching the 0.5% of regressions that matter. Best practice: define a small, curated eval set (50-500 cases) covering edge cases + safety + tone + format; run on every deployment; alert on regression. Volume-based tracing is the cheap part; eval discipline is where the value lives.",
      },
      {
        heading: "Why verification + observability complement each other",
        body: "Observability tells you what your model did. Verification (per SourceScore VERITAS) tells you which assertions in the output are factually grounded. The pair: observability catches behavioral regressions; verification catches factual hallucinations. Both required for production-grade LLM systems.",
      },
    ],
    definedTerms: [
      { name: "LLM tracing", description: "Capturing each step of an LLM application — prompts, retrievals, tool calls, intermediate generations, final outputs — for debugging + replay + analysis." },
      { name: "Eval set", description: "A curated collection of test cases (input + expected behavior) run against an LLM application to detect regressions across deployments. Distinct from training data; never leaked into the training set." },
      { name: "LangSmith", description: "LangChain's hosted observability + eval platform (2023). Tracks all LangChain runs by default; adds eval framework + dataset management. Closed-source backend." },
      { name: "Langfuse", description: "Open-source LLM observability + tracing platform (founded 2022, YC W23). Self-hostable; OpenTelemetry-compatible; framework-agnostic. MIT-licensed." },
      { name: "Helicone", description: "Open-source LLM observability via proxy gateway (founded 2022, YC W23). Adds caching, retries, rate-limiting alongside trace capture. Apache 2.0." },
    ],
    relatedHubs: ["agent-frameworks", "evaluation-benchmarks"],
    relatedConcepts: ["llm-grounding", "evaluation-harness", "agents"],
    relatedIntegrations: ["langchain", "llamaindex", "openai-tools"],
  },
  {
    slug: "voice-and-audio-ai",
    title: "Voice and audio AI — speech, music, and conversational platforms",
    metaDescription:
      "Voice + audio AI: ElevenLabs, Suno, Whisper, Stable Audio, Hume, AudioLM. Verified release dates + capabilities for the speech/music/voice-agent stack.",
    subtitle:
      "Speech recognition (Whisper), text-to-speech (ElevenLabs), music generation (Suno, Stable Audio), voice-emotion (Hume), and end-to-end voice agents (ElevenLabs Conversational AI). Verified release dates + capabilities + license context.",
    claimFilter: (c) =>
      (c.tags ?? []).some((t) =>
        [
          "whisper",
          "audiolm",
          "elevenlabs",
          "elevenlabs-conversational",
          "suno",
          "suno-v3",
          "suno-v4",
          "stable-audio",
          "hume-ai",
          "voice-agent",
          "music-generation",
          "text-to-audio",
          "asr",
          "asr-llm-tts",
          "tts",
          "audio",
        ].includes(t),
      ),
    sections: [
      {
        heading: "Voice + audio is the next-most-important modality after text",
        body: "Vision-language models grabbed 2023-2024 headlines, but voice + audio is quietly becoming the dominant interaction surface. ChatGPT's voice mode (2023-09), OpenAI Realtime API (2024-10), Anthropic's voice features, ElevenLabs Conversational AI (2024-11), and the wider Suno + Udio + Stable Audio music-generation wave have made audio a first-class AI modality. Voice-only smart speakers + earbuds + handsets push interaction toward speech, not text.",
      },
      {
        heading: "The audio AI stack has three layers",
        body: "Layer 1: ASR (speech-to-text) — OpenAI Whisper (open-weight, foundational), Whisper large-v3 (2023-11). Layer 2: TTS (text-to-speech) — ElevenLabs (founded 2022), OpenAI tts-1, Anthropic, etc. Layer 3: Audio generation — Suno v3/v4 (music, 3-minute coherent tracks), Stable Audio 2.0 (Stability AI 2024-04 long-form music), AudioLM (Google 2022, foundational). Hume AI (founded 2021) adds emotion-recognition over speech. ElevenLabs Conversational AI (2024-11) combines all three layers into a single voice-agent API.",
      },
      {
        heading: "Why voice agents are the 2025 frontier",
        body: "Production voice agents need ASR + LLM + TTS in single low-latency loop (<1 second from user voice to first response audio). Achieving sub-second latency requires careful integration — model parallelism, streaming output, voice-activity detection. The platforms that ship this integrated experience (ElevenLabs Conversational AI, OpenAI Realtime API, Anthropic voice features, Vapi, Retell) are the 2025 voice-agent leaders.",
      },
      {
        heading: "Why this catalog matters for verification",
        body: "Voice-AI assistants confidently emit hallucinated facts the same way text LLMs do — but users can't easily fact-check while listening. The verification layer (SourceScore VERITAS) is doubly important in voice context: text-render the LLM response server-side, verify facts before TTS, only synthesize verified content. Plus, the voice + music + audio claims in this hub are themselves the kind of facts a voice-assistant might be asked about — the catalog grounds future voice agents asking about voice-AI history.",
      },
    ],
    definedTerms: [
      { name: "ASR (Automatic Speech Recognition)", description: "Converting audio of human speech to text. State-of-the-art systems: OpenAI Whisper, Google USM, Amazon Transcribe, ElevenLabs Speech-to-Text." },
      { name: "TTS (Text-to-Speech)", description: "Converting text to natural-sounding speech audio. Leaders: ElevenLabs, OpenAI tts-1, Microsoft Azure Speech, Google WaveNet." },
      { name: "Voice agent", description: "An end-to-end conversational AI that handles voice input + voice output in a single low-latency loop. Combines ASR + LLM + TTS." },
      { name: "Whisper", description: "OpenAI's open-weight ASR model (2022-09), trained on 680k hours of multilingual audio. Foundational to most production speech-to-text systems today. Whisper large-v3 (2023-11) is current generation." },
      { name: "Suno", description: "Music generation startup (founded 2023). Suno v3 (2024-03) + v4 (2024-11) generate coherent multi-minute songs with lyrics + instruments + vocals from text prompts." },
      { name: "ElevenLabs", description: "Voice AI company (founded 2022) leading in voice cloning + TTS. ElevenLabs Conversational AI (2024-11) is their end-to-end voice agent platform." },
    ],
    relatedHubs: ["multimodal-ai", "llm-releases-2024-2025"],
    relatedConcepts: ["multimodal", "llm-grounding"],
    relatedIntegrations: ["openai-tools", "anthropic-sdk"],
  },
];

export function findTopic(slug: string): TopicHub | undefined {
  return TOPICS.find((t) => t.slug === slug);
}
