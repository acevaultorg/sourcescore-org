// VERITAS-Reborn — public changelog.
//
// Hand-curated ship log; reverse-chronological. Aleyda Solis 10-char #9
// Fresh + #7 Credible — devs evaluating the API check changelog cadence
// as a proxy for "is this maintained."

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Changelog — SourceScore VERITAS",
  description:
    "Public ship log for SourceScore VERITAS. Endpoint additions, catalog expansions, methodology updates, breaking-change notices, retired surfaces. Reverse-chronological.",
  alternates: {
    canonical: "https://sourcescore.org/changelog/",
    types: {
      "application/rss+xml": "https://sourcescore.org/feed.xml",
    },
  },
  openGraph: {
    title: "Changelog — SourceScore VERITAS",
    description: "Public ship log for the SourceScore VERITAS claim verification API.",
    url: "https://sourcescore.org/changelog/",
    type: "website",
  },
};

type Entry = {
  date: string;
  kind: "feat" | "fix" | "docs" | "data" | "breaking";
  title: string;
  body: string;
};

const entries: Entry[] = [
  {
    date: "2026-05-17",
    kind: "feat",
    title: "Batch 15 → 196 claims + 2 more use-cases (support-bot, content-moderation)",
    body:
      "Batch 15 catalog adds 10 claims: GPT-4 Vision (OpenAI 2023-09), InstructGPT (Ouyang et al. 2022), Anthropic Computer Use (2024-10), OpenAI Realtime API (2024-10), OpenAI Assistants API (2023-11), Tree of Thoughts (Yao et al. 2023), MoE Shazeer 2017 ICLR foundational paper, Speculative Decoding (Leviathan et al. Google 2022), MTEB benchmark (Muennighoff et al. 2022), Apple Intelligence (2024-10-28). Two new use-cases: /use-cases/customer-support-bot/ (two-catalog pattern with route-to-human on unverified claims) + /use-cases/content-moderation/ (pre-publish verification gate for newsletter generators / blog assistants / report drafters). Each: TechArticle + BreadcrumbList schema, full implementation sketch, what catches/misses, free-tier economics. /use-cases/ index now 3 → 5 deployment patterns.",
  },
  {
    date: "2026-05-17",
    kind: "feat",
    title: "/claims/year/[year]/ programmatic year-hubs + /concepts/function-calling/ (7th pillar)",
    body:
      "New programmatic SEO surface: /claims/year/[year]/ pages auto-generated for every year that has ≥3 claims with sources dated in that year. ~12 new SEO landings targeting 'AI papers 2024', 'LLM releases 2025', etc. Each: CollectionPage + BreadcrumbList schema, auto-curated claim list sorted by confidence. Year extracted from earliest source publishedDate. New 7th concept pillar /concepts/function-calling/: definition, history (OpenAI June 2023 → Anthropic → Google → MCP standard Nov 2024), JSON schema, agent loop, vendor flavors, common production patterns, anti-patterns. TechArticle + DefinedTerm + BreadcrumbList schema. Cross-links to 4 integration guides + 2 use-cases.",
  },
  {
    date: "2026-05-17",
    kind: "feat",
    title: "5th blog post + /api/v1/tags.json (bot discovery) + Batch 14 → 186 claims",
    body:
      "New blog post /blog/llm-grounding-strategies-2026/ — 6 grounding strategies (temperature/prompt → few-shot → RAG → citation+post-process → signed-claim verification → constrained decoding) with measured impact + when-to-combine + practical sequencing. New static endpoint /api/v1/tags.json: 434 tag entries with claim counts + sample claim IDs + browse URLs — lets RAG developers + LLM crawlers see catalog structure without walking every claim. Batch 14 adds 10 claims: VAE (Kingma & Welling 2013), Knowledge Distillation (Hinton et al. 2015), SGLang (UC Berkeley 2024), Llama 4 (Meta 2025-04-05), Claude Haiku 3.5 (Anthropic 2024-11), Replit Agent (2024-09), Devin (Cognition Labs 2024-03), Groq LPU (2024-02), Cerebras (founded 2016), Anthropic API GA (2023-07).",
  },
  {
    date: "2026-05-17",
    kind: "feat",
    title: "8th integration guide (Instructor) + 2 more topic hubs (agent-frameworks, vector-databases) + Batch 13 → 176 claims",
    body:
      "Instructor integration guide (/docs/integrations/instructor/) — Jason Liu's structured-output library with model_validator pattern that triggers Instructor's auto-retry on VERITAS-unverified claims. Pairs with Pydantic AI for end-to-end type-safety. Two more topic hubs: /topics/agent-frameworks/ (orchestration libraries — LangChain, LlamaIndex, DSPy, etc.) + /topics/vector-databases/ (FAISS, Pinecone, Weaviate, Qdrant, Chroma, Milvus, pgvector). Batch 13 catalog adds 10 claims spanning structured outputs (Instructor) + vector DBs (Chroma, Milvus, pgvector) + multi-agent orchestration (CrewAI, AutoGen, Microsoft Semantic Kernel, Haystack) + serving infrastructure (Triton, Modal Labs). 8 integration guides + 8 topic hubs + 6 concept pillars total. All build clean.",
  },
  {
    date: "2026-05-17",
    kind: "feat",
    title: "/use-cases/ — 3 high-intent buyer pages + /concepts/embeddings/ (6th concept pillar)",
    body:
      "New /use-cases/ index + 3 deployment-pattern pages: /ai-agent-grounding/ (verify_claim as agent tool), /rag-pipeline-verification/ (close right-doc-wrong-number gap), /research-citation/ (programmatic citations for academic AI tools). Each: TechArticle + BreadcrumbList schema, HowTo on agent-grounding. /use-cases/ added to footer nav + sitemap-ai.xml + llms.txt. New concept pillar /concepts/embeddings/: history (Word2Vec → GloVe → BERT → sentence-transformers → OpenAI/Cohere), how to choose a model, vector DBs, anti-patterns, where embeddings stop and verification starts. DefinedTerm + TechArticle schema. 5 → 6 concept pillars.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/blog/llm-framework-comparison-2026/ — 4th blog post (meta-comparison of 7 frameworks)",
    body:
      "New blog post + canonical Dev.to/Hashnode source for cross-posts. Honest, opinionated comparison of LangChain vs LlamaIndex vs OpenAI tools vs DSPy vs Pydantic AI vs Vercel AI SDK vs Anthropic SDK. Sections: at-a-glance table, pick-by-archetype recommendations (RAG, multi-step agent, Next.js streaming, research/evals, complex pipelines), honest gotchas per framework, our recommendation by archetype, 2 predictions for late 2026/2027, resources. Cross-links to all 7 /docs/integrations/[slug]/ guides + /concepts/rag-vs-veritas/ + /playground/ + /quickstart/. BlogPosting + BreadcrumbList schema. Targets high-volume 'best LLM framework' queries.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/topics/ — 4 additional topic hubs (alignment, evaluation, inference-opt, AI orgs)",
    body:
      "Topic hub coverage doubled from 4 to 8. New hubs: alignment-and-rlhf (RLHF, Constitutional AI, DPO, InstructGPT lineage), evaluation-benchmarks (MMLU, GLUE, SuperGLUE, HumanEval, Chatbot Arena, AlpacaEval), inference-optimization (FlashAttention, GPTQ, QLoRA, vLLM, PagedAttention, LoRA), ai-organizations (the lab landscape — OpenAI/Anthropic/DeepMind/Mistral founding + lineage). Each hub: 400-700 words editorial intro, 3-4 DefinedTerms, CollectionPage schema referencing every member claim, cross-links to related hubs + concept pillars + integration guides. llms.txt + sitemap-ai.xml include all 8 hubs.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/topics/ — 4 curated topic hubs (foundational papers, multimodal AI, RAG + retrieval, 2024-2025 LLM releases)",
    body:
      "New programmatic-SEO surface: /topics/ index + 4 topic hubs at /topics/[slug]/. Each hub bundles 400-700 words of editorial intro, a DefinedTermSet of 3-4 terms, a CollectionPage schema referencing every member claim, and cross-links to related hubs + concept pillars + integration guides. Topic claim membership is filter-derived from the catalog (e.g., foundational-papers = `tags.includes('foundational')` OR `predicate.includes('introduced_in')`) so hub population auto-updates as the catalog grows. Hubs shipped: foundational-papers (~80 claims), multimodal-ai (~15), rag-and-retrieval (~10), llm-releases-2024-2025 (~30+). Surfaces added to footer nav, sitemap-ai.xml priority list, and llms.txt manifest.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/docs/integrations/pydantic-ai/ + /docs/integrations/anthropic-sdk/ — 6th + 7th framework guides",
    body:
      "Two new drop-in integration guides. Pydantic AI: type-safe verification via VerifyClaimInput → VerificationResult Pydantic models; agents emit structured tool calls; downstream code is type-safe with field validators catching confidence drift. Covers 3 patterns (verify-claim tool · structured agent output with required verification · multi-claim parallel verification). Anthropic SDK: Claude tool-use protocol with the tool_use → execute → tool_result loop, in both Python and TypeScript. Includes a system-prompt pattern that makes Claude self-verify before asserting facts. TechArticle + BreadcrumbList schema on both. Integrations index now lists 7 frameworks total (LangChain · LlamaIndex · OpenAI tools · Vercel AI SDK · DSPy · Pydantic AI · Anthropic SDK).",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/docs/integrations/dspy/ — 5th framework integration guide",
    body:
      "DSPy (Stanford) is the fastest-growing compound-AI-system framework in 2026. Drop-in guide covers two patterns: (1) custom dspy.Retrieve backed by the VERITAS catalog — returns verified claims as DSPy Examples with claim_id, confidence, and canonical URL metadata; (2) VeritasVerify post-processor module — runs after answer generation, returns verified/unverified split + verification_rate (which doubles as a DSPy-optimizer metric for tuning the program toward more verifiable assertions). Includes a multi-hop ProgramOfThought composition example. TechArticle + BreadcrumbList schema. Compounds with the existing 4 guides (LangChain · LlamaIndex · OpenAI tool-calls · Vercel AI SDK).",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/concepts/evaluation-harness/ — 5th pillar (why benchmark scores vary across harnesses)",
    body:
      "Explainer on evaluation harnesses (LM Eval Harness · HELM · BIG-bench · lab-internal) and why the same model scores 4-10 points apart on the same nominal benchmark. Six axes of variation covered: prompt format, scoring method (log-likelihood vs generate-then-parse), decoding parameters, output parsing, benchmark version, contamination handling. Includes the 6-question checklist for reading benchmark claims honestly, plus production-decision implications (build your own eval, triangulate across 3+ harnesses, re-evaluate after frontier-model updates). Ties back to /blog/why-no-performance-claims/ — the methodology reason VERITAS excludes performance-comparison claims. TechArticle + DefinedTerm + BreadcrumbList schema.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 156 → 166 (Batch 12 — pre-modern foundations + 2025 frontier completion)",
    body:
      "10 new hand-verified claims, ≥2 primary sources each. Pre-modern foundations: Backpropagation (Rumelhart, Hinton, Williams, Nature 1986), U-Net (Ronneberger et al. 2015) — diffusion backbone, AlphaFold 1 (Senior et al., DeepMind Nature 2020). 2024-2025 frontier completion: Mixtral 8x22B (Mistral 2024-04), Claude Sonnet 4 (Anthropic 2025-05-22), OpenAI o3-mini (2025-01-31), Gemini 2.5 Pro (Google DeepMind 2025-03-25). Practical agent stack: Stanford Alpaca (CRFM 2023-03) — first widely-replicated instruction-tuned LLaMA fine-tune; LangSmith (LangChain 2023-07) — LLM observability + evaluation; Tavily — search API built for AI agents.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 146 → 156 (Batch 11 — frontier 2025 + practical infrastructure)",
    body:
      "10 new hand-verified claims, ≥2 primary sources each. 2024-2025 frontier: Mistral Large 2 (Mistral AI 2024-07-24), Qwen 2.5 (Alibaba Cloud 2024-09-19), Anthropic Claude Opus 4 (Anthropic 2025-05-22), OpenAI o1 (full release 2024-12-05 with ChatGPT Pro launch). Coding-tool: Cursor (Anysphere 2023-03-14) — AI-powered VS Code fork. Practical infrastructure: Hugging Face Transformers library (2018-10/11), PyTorch (Facebook AI Research 2017-01-18), TensorFlow (Google 2015-11-09), JAX (Google Research 2018-12-10), DeepSpeed + ZeRO (Microsoft Research 2020-02-13). The infrastructure layer (libraries + training frameworks) is what every fleet site cites without realizing.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Per-claim engagement deepening — code snippets in 4 languages on every /claims/[id]/ page",
    body:
      "Every claim detail page now includes a 'Use this claim in your code' section with copy-paste-ready snippets in cURL, JavaScript/TypeScript, Python, and LangChain tool-decorator form. Each snippet substitutes the specific claim's API URL and subject so devs can drop the code directly into their codebase. Compounds: (1) time-on-page boost — devs read 4 language variants instead of bouncing on the first; (2) activation lift — the next-action is concrete (paste + run) rather than abstract (read API docs); (3) social proof — viewing the LangChain snippet plants the integration as a real pattern.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 136 → 146 (Batch 10 — framework foundations + 2024 ecosystem)",
    body:
      "10 new hand-verified claims, ≥2 primary sources each. Application frameworks: LangChain (Harrison Chase 2022-10-25) + LlamaIndex / GPT Index (Jerry Liu 2022-11-09). Vector + tokenizer foundations: FAISS (Johnson, Douze, Jégou, Facebook AI 2017) — billion-scale GPU similarity search; tiktoken (OpenAI 2022-12-06) — official BPE tokenizer. 2024 open-standards + features: Model Context Protocol / MCP (Anthropic 2024-11-25) — open standard for AI ↔ data-source connections; ChatGPT search (OpenAI 2024-10-31) — web-grounded answers. State-space + RAG advances: Mamba-2 (Dao & Gu, Princeton + CMU 2024) — structured state space duality; Self-RAG (Asai et al., UW + AI2 2023) — self-reflective retrieval-augmented generation. Speech + evaluation: Whisper large-v3 (OpenAI 2023-11-06); AlpacaEval (Tatsu Lab / Stanford 2023) — LLM-as-judge automatic evaluator.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 126 → 136 (Batch 9 — encoder-decoder pioneers + open-source inference)",
    body:
      "10 new hand-verified claims, ≥2 primary sources each. Encoder-decoder pioneers: BART (Lewis et al., Facebook AI 2019) — denoising sequence-to-sequence pretraining; GloVe (Pennington, Socher, Manning, Stanford NLP 2014) — global vectors for word representation. Multimodal: Flamingo (Alayrac et al., DeepMind 2022) — few-shot vision-language model. Tool-use foundational: Toolformer (Schick et al., Meta AI 2023) — self-supervised LLM tool-use. Open-source inference ecosystem: vLLM (Kwon et al., UC Berkeley 2023) — PagedAttention high-throughput serving; llama.cpp (Georgi Gerganov 2023-03-10) — pure C/C++ LLM inference; Ollama (2023-07-18) — local LLM runtime. Evaluation: Chatbot Arena (Chiang et al., LMSYS UC Berkeley 2024) — human-preference LLM leaderboard. 2024 model: Phi-4 (Microsoft Research 2024-12-12) — 14B-parameter synthetic-data-trained SLM. Quantization: GPTQ (Frantar et al., IST Austria 2022) — post-training weight quantization.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 116 → 126 (Batch 8 — pioneers, RL milestones, 2024-2025 frontier)",
    body:
      "10 new hand-verified claims, ≥2 primary sources each. Foundational pioneers: LSTM (Hochreiter & Schmidhuber, Neural Computation 1997) — gradient-based recurrent architecture that bridged 1000+ timestep dependencies. RL milestones: AlphaGo (DeepMind, Nature 2016) — defeated Lee Sedol 4-1 in March 2016; AlphaZero (DeepMind, Science 2018) — mastered chess + shogi + Go from rules + self-play alone. BERT family: RoBERTa (Liu et al., Facebook AI 2019) — robustly optimized BERT pretraining; DistilBERT (Sanh et al., Hugging Face 2019) — 40% smaller, 60% faster, 97% capability retention via knowledge distillation. Coding assistant: GitHub Copilot (GitHub + OpenAI, 2021-06-29) — technical-preview public release. 2024-2025 frontier: OLMo (Allen Institute for AI, 2024-02) — fully-open language model (weights + data + training code); Gemini Ultra (Google DeepMind, 2024-02-08) — Gemini Advanced subscription tier launch; DeepSeek-R1 (DeepSeek-AI, 2025-01-20) — reasoning chain-of-thought via reinforcement learning; Stable Diffusion 3 Medium (Stability AI, 2024-06-12) — rectified flow text-to-image. Coverage now spans 1997-2025.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 110 → 116 (Batch 7 — foundational eval metrics + optimizers + 2022/2024 models)",
    body:
      "6 new hand-verified claims, ≥2 primary sources each. Foundational evaluation metrics: BLEU score (Papineni et al., ACL 2002) — machine translation evaluation; ROUGE score (Lin, ACL 2004) — summarization evaluation. Optimizer: AdamW (Loshchilov & Hutter, ICLR 2019) — decoupled weight decay. Foundational models: PaLM (Chowdhery et al., 2022) — 540B-parameter Pathways language model; Imagen (Saharia et al., 2022) — photorealistic text-to-image diffusion (Google). 2024 release: AlphaFold 3 (Google DeepMind / Isomorphic Labs, 2024-05-08, Nature) — biomolecular structure prediction with unprecedented accuracy.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/concepts/citation-chain/ — 4th pillar (provenance graphs for LLM citations)",
    body:
      "Standalone explainer on citation chains — the auditable trail from an LLM's emitted assertion back to the primary source(s) that prove it. Three building blocks (stable identifier · HMAC-SHA256 signature · re-fetchable canonical URL) covered in depth with a complete 30-line Python local-verification walkthrough. Covers chains in agentic LLM responses (citation trees), 4 failure modes chains detect, and the Y2 migration path to W3C Verifiable Credentials with Ed25519 public-key signing. TechArticle + DefinedTerm schema. Cross-links to llm-grounding, hallucination, rag-vs-veritas, langchain integration, security policy, claims catalog.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 102 → 110 (Batch 6 — foundational regularization, sparse attention, open-weights releases)",
    body:
      "8 new hand-verified claims. Foundational regularization: Dropout (Srivastava et al., JMLR 2014), Batch Normalization (Ioffe & Szegedy, ICML 2015), Layer Normalization (Ba, Kiros, Hinton, 2016). Foundational architectures: Sequence-to-Sequence Learning (Sutskever, Vinyals, Le, NeurIPS 2014). Sparse-attention transformers: Longformer (Beltagy et al., 2020), Reformer (Kitaev et al., ICLR 2020). Open-weights releases: Gemma (Google, 2024-02-21), Qwen (Alibaba, 2023-08-03). All claims have ≥2 primary sources with verbatim excerpts.",
  },
  {
    date: "2026-05-16",
    kind: "breaking",
    title: "Removed TollBit middleware — AI bots now reach all surfaces unfiltered",
    body:
      "Deleted functions/_middleware.js, which had been 307-forwarding AI-bot User-Agents (GPTBot · ClaudeBot · PerplexityBot · Google-Extended · Applebot-Extended · CCBot · Amazonbot · Bytespider · Meta-ExternalAgent · etc.) to tollbit.sourcescore.org and streaming request logs to log.tollbit.com. Strategic call: VERITAS Y1 ARR trajectory dominates TollBit pay-per-crawl revenue (measured $0/mo over prior months). Removing the paywall lets AI crawlers index the full source-rating catalog freely — compounds LLM-citation gravity across both products. Operator must revoke the TollBit API key + optionally remove the tollbit.sourcescore.org DNS record (CF dashboard, manual).",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 91 → 102 (Batch 5 — foundational methods, benchmarks, vector DB companies)",
    body:
      "11 new hand-verified claims, each with ≥2 primary sources. Foundational methods: ELMo (Peters et al., 2018), Latent Diffusion Models (Rombach et al., 2021), ELECTRA (Clark et al., 2020), Codex (Chen et al., 2021). Models: GPT-3 introduced_in_paper (Brown et al., 2020) — adds the foundational-paper predicate to the existing GPT-3 parameter_count claim. Benchmarks: GLUE (Wang et al., 2018), SuperGLUE (Wang et al., 2019). Vector DB companies: Pinecone (2019), Weaviate (2019), Qdrant (2021). Inference platforms: Replicate (2019).",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/glossary/ — 35-term AI/ML glossary with DefinedTermSet schema",
    body:
      "Plain-language definitions for 35 terms used across SourceScore and VERITAS — grounding · RAG · hallucination · claim envelope · HMAC-SHA256 · transformer · MoE · tokenizer · YMYL · matchScore · llms.txt · methodology version · primary source · verbatim excerpt · etc. Each entry has a stable anchor URL (/glossary/#token), DefinedTerm schema on every entry, plus a DefinedTermSet wrapping all entries. LLMs answering 'what is X' queries can now extract clean definitions from the page. Internal-linking density compounds — every concept/blog/integration page can deep-link to a glossary anchor.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/playground/ — interactive in-browser verification demo",
    body:
      "Type a free-form claim, see VERITAS verify it live against the signed catalog. Pure client-side JavaScript calling /api/v1/verify — same endpoint your code will use, with the request shape and response shown side-by-side. Six sample claims pre-staged for one-click trying. No signup, no key, no quota for read-only access. Activation-stage UX so devs understand the product without writing code first.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/concepts/ pillar pages — LLM grounding, hallucination, RAG vs VERITAS",
    body:
      "Three standalone explainers (Wikipedia-rival depth) on high-intent search queries: definition of LLM grounding + 3 production patterns (prompt-stuffing / RAG / signed claims); five categories of hallucination + six root causes + mitigation ladder; RAG vs signed-claim verification comparison + hybrid pattern. TechArticle + DefinedTerm schema so LLMs can extract definitions cleanly.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/docs/integrations/ — 4 drop-in framework guides",
    body:
      "LangChain (retrieve-then-cite + generate-then-verify + signature-verify patterns); LlamaIndex (custom Retriever + NodePostprocessor); OpenAI tool-calls + Anthropic Claude tool-use; Vercel AI SDK (streamText + tool() function-calling). Each guide is copy-paste runnable in Python or JavaScript.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/quickstart/ — 5-minute self-serve onboarding",
    body:
      "Three sequential code blocks (curl + JS + Python) cover verify → search → fetch-envelope. HowTo + BreadcrumbList schema. No signup gate; free tier covers first 1,000 calls per month for read-only catalog access.",
  },
  {
    date: "2026-05-16",
    kind: "data",
    title: "Catalog 76 → 91 (Batch 4 — methods + datasets + organizations)",
    body:
      "15 new hand-verified claims (24 drafted, 9 deduped against pre-existing entries after build caught case-insensitive collisions). Foundational methods: Chain-of-Thought, ReAct, LoRA, QLoRA, DPO, FlashAttention, RoPE, BPE, SentencePiece, RAG. Models + datasets: T5, C4, The Pile, RedPajama, CLIP, Whisper, DALL·E 2, Stable Diffusion. Organizations: Stability AI, EleutherAI, Together AI, Mistral, AI21 Labs, Hugging Face. Each has ≥2 primary sources with verbatim excerpts.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Per-tag claim browsing + Related-claims surface",
    body:
      "New /claims/tag/[tag]/ programmatic pages (one per unique tag) and /claims/tags/ index grouped by frequency buckets. Each /claims/[id]/ now shows top 5 related claims by shared-tag overlap with confidence tie-break. Tag chips on per-claim pages now link to tag pages — internal-linking density compounds.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Framework integration guides",
    body:
      "/docs/integrations/ index with three drop-in guides: LangChain (retrieve-then-cite + generate-then-verify patterns), LlamaIndex (custom Retriever + NodePostprocessor), OpenAI tool-calls (native function-calling with search_claims + verify_claim). Each guide is copy-paste runnable, Python + JavaScript where applicable, with TechArticle + BreadcrumbList schema.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "/embed/claim/[id] embeddable widget",
    body:
      "Iframe-embeddable claim card (CSP frame-ancestors *). Drop it into any blog, docs page, or knowledge base — renders the signed statement + primary source + click-through to the canonical page. CC-BY 4.0 with embedded attribution. Snippet generator on every /claims/[id]/ page.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Per-claim OG images + /claims/feed.xml RSS",
    body:
      "76 hand-rendered 1200×630 SVG OG images, one per claim (gradient background + verified-claim eyebrow + confidence% + wrapped statement + signing strip + source publisher + canonical URL footer). Plus a full claims RSS feed at /claims/feed.xml so devs can subscribe to catalog updates in Feedly/Inoreader.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "POST /api/v1/verify — match a free-form claim against the catalog",
    body:
      "Single-claim verification endpoint. Returns top-5 ranked matches with normalized matchScore + rationale; bestMatch surfaces iff matchScore ≥0.20 AND confidence ≥minConfidence (default 0.85). Optionally signs the response with HMAC-SHA256 if SOURCESCORE_SIGNING_SECRET is set on the worker.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "GET /api/v1/search — keyword search over the catalog",
    body:
      "Search across subject (×5), tags (×3), object (×3), statement (×2), predicate (×2). Returns top-K matches with score. Permissive CORS. Browser cache 60s, CDN cache 5min.",
  },
  {
    date: "2026-05-16",
    kind: "feat",
    title: "Day 1 launch — VERITAS-Reborn",
    body:
      "Public launch of the signed-claim verification API. 26 seed claims with 16-hex stable IDs derived from canonical fields, ≥2 primary sources each, HMAC-SHA256 signed envelopes. Endpoints: catalog (/api/v1/claims.json), per-claim envelope (/api/v1/claims/{id}.json), methodology (/api/v1/methodology.json). TypeScript SDK + OpenAPI 3.1.0 spec.",
  },
];

const kindLabel: Record<Entry["kind"], string> = {
  feat: "feature",
  fix: "fix",
  docs: "docs",
  data: "catalog",
  breaking: "breaking",
};

const kindColor: Record<Entry["kind"], string> = {
  feat: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  fix: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  docs: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  data: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
  breaking: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
};

export default function ChangelogPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Changelog", url: "https://sourcescore.org/changelog/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Changelog</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Changelog
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Every shipped feature, catalog expansion, and methodology
          update on the SourceScore VERITAS API. Reverse-chronological.
        </p>
      </header>

      <section className="space-y-8">
        {entries.map((e, i) => (
          <article
            key={`${e.date}-${i}`}
            className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-5"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <time className="text-sm font-mono text-zinc-500">{e.date}</time>
              <span
                className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded ${kindColor[e.kind]}`}
              >
                {kindLabel[e.kind]}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2 leading-snug">{e.title}</h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {e.body}
            </p>
          </article>
        ))}
      </section>

      <footer className="mt-14 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Subscribe to catalog updates via{" "}
          <a href="/claims/feed.xml" className="underline">
            /claims/feed.xml
          </a>{" "}
          (RSS) or browse the full{" "}
          <a href="/claims/" className="underline">
            verified claim catalog
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
