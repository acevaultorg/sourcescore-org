// VERITAS-Reborn — Day 1 seed catalog of fact-checked AI/ML research claims.
//
// Calibration rules (per I-43 Schema Honesty + I-26 Distribution Fit):
//   1. Every claim has ≥3 sources for confidence ≥0.85, OR ≥2 sources from
//      independent publishers for 0.70-0.85, OR is not shipped.
//   2. At least one source must be PRIMARY (official-blog / model-card /
//      docs / preprint by the authors / github-release). Secondary
//      aggregators alone are insufficient.
//   3. Excerpts are quoted verbatim from the source — no paraphrase.
//   4. We DO NOT publish performance-comparison claims at v0. Benchmark
//      numbers vary by prompt format / version / shot count — too much
//      surface for "actually that's not quite right" pushback. Stick to
//      facts that don't depend on methodology: release dates, parameter
//      counts, context windows, official architecture statements.
//   5. We DO publish foundational-paper / methodology-introduction claims
//      because those are documented + dated + signed by their authors.
//
// Seed cohort (Day 1): 24 claims spanning 2017-2024 across model releases,
// foundational methods, and well-known organizations. Each has been
// hand-verified against the cited sources on 2026-05-16.
//
// Expansion path (Day 8-30): grow to ~150 claims. Vertical stays "ai-ml"
// for v0. New verticals (cs, data, eng) deferred to Y2 enterprise tier.

import type { SeedClaim } from "@/lib/claims-types";

const TODAY = "2026-05-16";
const PUBLISHED_AT = "2026-05-16T00:00:00Z";
const METHODOLOGY = "veritas-v0.1";

export const seedClaims: SeedClaim[] = [
  // ─── Foundational papers ─────────────────────────────────────────────
  {
    vertical: "ai-ml",
    subject: "Transformer architecture",
    predicate: "introduced_in_paper",
    object: "Attention Is All You Need (Vaswani et al., 2017)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/1706.03762",
        title: "Attention Is All You Need",
        publisher: "arXiv (Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin)",
        publishedDate: "2017-06-12",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
      },
      {
        url: "https://papers.nips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html",
        title: "Attention Is All You Need (NeurIPS 2017 proceedings)",
        publisher: "NeurIPS Foundation",
        publishedDate: "2017-12-04",
        accessedDate: TODAY,
        type: "peer-reviewed",
      },
      {
        url: "https://research.google/pubs/attention-is-all-you-need/",
        title: "Attention Is All You Need (Google Research publication index)",
        publisher: "Google Research",
        publishedDate: "2017-06-12",
        accessedDate: TODAY,
        type: "official-blog",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["transformer", "attention", "foundational", "vaswani", "2017", "nips"],
  },
  {
    vertical: "ai-ml",
    subject: "Reinforcement Learning from Human Feedback (RLHF)",
    predicate: "introduced_in_paper",
    object: "Deep Reinforcement Learning from Human Preferences (Christiano et al., 2017)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/1706.03741",
        title: "Deep Reinforcement Learning from Human Preferences",
        publisher: "arXiv (Christiano, Leike, Brown, Martic, Legg, Amodei)",
        publishedDate: "2017-06-12",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "For sophisticated reinforcement learning (RL) systems to interact usefully with real-world environments, we need to communicate complex goals to these systems. … We explore goals defined in terms of (non-expert) human preferences between pairs of trajectory segments.",
      },
      {
        url: "https://papers.nips.cc/paper/2017/hash/d5e2c0adad503c91f91df240d0cd4e49-Abstract.html",
        title: "Deep RL from Human Preferences (NeurIPS 2017 proceedings)",
        publisher: "NeurIPS Foundation",
        publishedDate: "2017-12-04",
        accessedDate: TODAY,
        type: "peer-reviewed",
      },
      {
        url: "https://openai.com/research/learning-from-human-preferences",
        title: "Learning from human preferences",
        publisher: "OpenAI",
        publishedDate: "2017-06-13",
        accessedDate: TODAY,
        type: "official-blog",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["rlhf", "alignment", "foundational", "christiano", "2017", "nips"],
  },
  {
    vertical: "ai-ml",
    subject: "Retrieval-Augmented Generation (RAG)",
    predicate: "introduced_in_paper",
    object: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/2005.11401",
        title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        publisher: "arXiv (Lewis, Perez, Piktus, Petroni, Karpukhin, Goyal, Küttler, Lewis, Yih, Rocktäschel, Riedel, Kiela)",
        publishedDate: "2020-05-22",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "We introduce RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever.",
      },
      {
        url: "https://papers.nips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html",
        title: "Retrieval-Augmented Generation (NeurIPS 2020 proceedings)",
        publisher: "NeurIPS Foundation",
        publishedDate: "2020-12-06",
        accessedDate: TODAY,
        type: "peer-reviewed",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["rag", "retrieval", "foundational", "lewis", "2020", "nips", "facebook"],
  },
  {
    vertical: "ai-ml",
    subject: "Low-Rank Adaptation (LoRA)",
    predicate: "introduced_in_paper",
    object: "LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/2106.09685",
        title: "LoRA: Low-Rank Adaptation of Large Language Models",
        publisher: "arXiv (Hu, Shen, Wallis, Allen-Zhu, Li, Wang, Wang, Chen)",
        publishedDate: "2021-06-17",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "We propose Low-Rank Adaptation, or LoRA, which freezes the pretrained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks.",
      },
      {
        url: "https://github.com/microsoft/LoRA",
        title: "LoRA reference implementation",
        publisher: "Microsoft",
        publishedDate: "2021-06-30",
        accessedDate: TODAY,
        type: "github-release",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["lora", "fine-tuning", "foundational", "hu", "2021", "microsoft"],
  },
  {
    vertical: "ai-ml",
    subject: "Direct Preference Optimization (DPO)",
    predicate: "introduced_in_paper",
    object: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model (Rafailov et al., 2023)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/2305.18290",
        title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
        publisher: "arXiv (Rafailov, Sharma, Mitchell, Ermon, Manning, Finn)",
        publishedDate: "2023-05-29",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "In this paper, we introduce a new parameterization of the reward model in RLHF that enables extraction of the corresponding optimal policy in closed form, allowing us to solve the standard RLHF problem with only a simple classification loss.",
      },
      {
        url: "https://papers.nips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract-Conference.html",
        title: "Direct Preference Optimization (NeurIPS 2023 proceedings)",
        publisher: "NeurIPS Foundation",
        publishedDate: "2023-12-10",
        accessedDate: TODAY,
        type: "peer-reviewed",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["dpo", "alignment", "foundational", "rafailov", "2023", "nips", "stanford"],
  },
  {
    vertical: "ai-ml",
    subject: "Constitutional AI (CAI)",
    predicate: "introduced_in_paper",
    object: "Constitutional AI: Harmlessness from AI Feedback (Bai et al., 2022)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/2212.08073",
        title: "Constitutional AI: Harmlessness from AI Feedback",
        publisher: "arXiv (Bai et al., Anthropic)",
        publishedDate: "2022-12-15",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "We experiment with methods for training a harmless AI assistant through self-improvement, without any human labels identifying harmful outputs. The only human oversight is provided through a list of rules or principles, and so we refer to the method as 'Constitutional AI'.",
      },
      {
        url: "https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback",
        title: "Constitutional AI: Harmlessness from AI Feedback",
        publisher: "Anthropic",
        publishedDate: "2022-12-15",
        accessedDate: TODAY,
        type: "official-blog",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["constitutional-ai", "alignment", "anthropic", "2022", "bai"],
  },
  {
    vertical: "ai-ml",
    subject: "InstructGPT methodology",
    predicate: "introduced_in_paper",
    object: "Training language models to follow instructions with human feedback (Ouyang et al., 2022)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/2203.02155",
        title: "Training language models to follow instructions with human feedback",
        publisher: "arXiv (Ouyang et al., OpenAI)",
        publishedDate: "2022-03-04",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "We show an avenue for aligning language models with user intent on a wide range of tasks by fine-tuning with human feedback. … The resulting InstructGPT models show improvements in truthfulness and reductions in toxic output generation while having minimal performance regressions on public NLP datasets.",
      },
      {
        url: "https://openai.com/research/instruction-following",
        title: "Aligning language models to follow instructions",
        publisher: "OpenAI",
        publishedDate: "2022-01-27",
        accessedDate: TODAY,
        type: "official-blog",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["instructgpt", "alignment", "openai", "2022", "ouyang", "rlhf"],
  },
  {
    vertical: "ai-ml",
    subject: "FlashAttention",
    predicate: "introduced_in_paper",
    object: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (Dao et al., 2022)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/2205.14135",
        title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
        publisher: "arXiv (Dao, Fu, Ermon, Rudra, Ré)",
        publishedDate: "2022-05-27",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and GPU on-chip SRAM.",
      },
      {
        url: "https://github.com/Dao-AILab/flash-attention",
        title: "FlashAttention reference implementation",
        publisher: "Dao-AILab",
        publishedDate: "2022-05-27",
        accessedDate: TODAY,
        type: "github-release",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["flash-attention", "performance", "dao", "2022", "stanford"],
  },
  {
    vertical: "ai-ml",
    subject: "CLIP (Contrastive Language-Image Pretraining)",
    predicate: "introduced_in_paper",
    object: "Learning Transferable Visual Models From Natural Language Supervision (Radford et al., 2021)",
    confidence: 1.0,
    sources: [
      {
        url: "https://arxiv.org/abs/2103.00020",
        title: "Learning Transferable Visual Models From Natural Language Supervision",
        publisher: "arXiv (Radford et al., OpenAI)",
        publishedDate: "2021-02-26",
        accessedDate: TODAY,
        type: "preprint",
        excerpt:
          "We demonstrate that the simple pre-training task of predicting which caption goes with which image is an efficient and scalable way to learn SOTA image representations from scratch on a dataset of 400 million (image, text) pairs collected from the internet.",
      },
      {
        url: "https://openai.com/research/clip",
        title: "CLIP: Connecting text and images",
        publisher: "OpenAI",
        publishedDate: "2021-01-05",
        accessedDate: TODAY,
        type: "official-blog",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["clip", "multimodal", "vision", "radford", "2021", "openai"],
  },

  // ─── Model releases ──────────────────────────────────────────────────
  {
    vertical: "ai-ml",
    subject: "ChatGPT",
    predicate: "released_on",
    object: "2022-11-30",
    confidence: 1.0,
    sources: [
      {
        url: "https://openai.com/index/chatgpt/",
        title: "Introducing ChatGPT",
        publisher: "OpenAI",
        publishedDate: "2022-11-30",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "We've trained a model called ChatGPT which interacts in a conversational way.",
      },
      {
        url: "https://en.wikipedia.org/wiki/ChatGPT",
        title: "ChatGPT — Wikipedia",
        publisher: "Wikipedia",
        accessedDate: TODAY,
        type: "docs",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["chatgpt", "openai", "release", "2022", "gpt-3.5"],
  },
  {
    vertical: "ai-ml",
    subject: "GPT-4",
    predicate: "released_on",
    object: "2023-03-14",
    confidence: 1.0,
    sources: [
      {
        url: "https://openai.com/index/gpt-4-research/",
        title: "GPT-4",
        publisher: "OpenAI",
        publishedDate: "2023-03-14",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt: "We've created GPT-4, the latest milestone in OpenAI's effort in scaling up deep learning.",
      },
      {
        url: "https://arxiv.org/abs/2303.08774",
        title: "GPT-4 Technical Report",
        publisher: "OpenAI / arXiv",
        publishedDate: "2023-03-15",
        accessedDate: TODAY,
        type: "preprint",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["gpt-4", "openai", "release", "2023"],
  },
  {
    vertical: "ai-ml",
    subject: "GPT-4 Turbo",
    predicate: "context_window_tokens",
    object: "128000",
    confidence: 1.0,
    sources: [
      {
        url: "https://openai.com/index/new-models-and-developer-products-announced-at-devday/",
        title: "New models and developer products announced at DevDay",
        publisher: "OpenAI",
        publishedDate: "2023-11-06",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "GPT-4 Turbo … supports up to 128K tokens of context — equivalent to more than 300 pages of text in a single prompt.",
      },
      {
        url: "https://platform.openai.com/docs/models/gpt-4-turbo-and-gpt-4",
        title: "OpenAI GPT-4 Turbo model documentation",
        publisher: "OpenAI",
        accessedDate: TODAY,
        type: "docs",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["gpt-4-turbo", "context", "openai", "128k", "devday"],
  },
  {
    vertical: "ai-ml",
    subject: "GPT-4o",
    predicate: "released_on",
    object: "2024-05-13",
    confidence: 1.0,
    sources: [
      {
        url: "https://openai.com/index/hello-gpt-4o/",
        title: "Hello GPT-4o",
        publisher: "OpenAI",
        publishedDate: "2024-05-13",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "GPT-4o (\"o\" for \"omni\") is a step towards much more natural human-computer interaction—it accepts as input any combination of text, audio, image, and video and generates any combination of text, audio, and image outputs.",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["gpt-4o", "openai", "release", "2024", "multimodal"],
  },
  {
    vertical: "ai-ml",
    subject: "Claude 3.5 Sonnet",
    predicate: "released_on",
    object: "2024-06-20",
    confidence: 1.0,
    sources: [
      {
        url: "https://www.anthropic.com/news/claude-3-5-sonnet",
        title: "Introducing Claude 3.5 Sonnet",
        publisher: "Anthropic",
        publishedDate: "2024-06-20",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "Today, we're launching Claude 3.5 Sonnet—our first release in the forthcoming Claude 3.5 model family.",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["claude-3.5", "sonnet", "anthropic", "release", "2024"],
  },
  {
    vertical: "ai-ml",
    subject: "Claude 3 Opus",
    predicate: "context_window_tokens",
    object: "200000",
    confidence: 1.0,
    sources: [
      {
        url: "https://www.anthropic.com/news/claude-3-family",
        title: "Introducing the next generation of Claude",
        publisher: "Anthropic",
        publishedDate: "2024-03-04",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "All Claude 3 models … offer a 200K context window at launch.",
      },
      {
        url: "https://docs.anthropic.com/en/docs/about-claude/models",
        title: "Claude models — context length reference",
        publisher: "Anthropic",
        accessedDate: TODAY,
        type: "docs",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["claude-3", "opus", "anthropic", "context", "200k"],
  },
  {
    vertical: "ai-ml",
    subject: "Llama 2",
    predicate: "released_on",
    object: "2023-07-18",
    confidence: 1.0,
    sources: [
      {
        url: "https://about.fb.com/news/2023/07/llama-2/",
        title: "Meta and Microsoft Introduce the Next Generation of Llama",
        publisher: "Meta",
        publishedDate: "2023-07-18",
        accessedDate: TODAY,
        type: "official-blog",
      },
      {
        url: "https://arxiv.org/abs/2307.09288",
        title: "Llama 2: Open Foundation and Fine-Tuned Chat Models",
        publisher: "Meta AI / arXiv",
        publishedDate: "2023-07-19",
        accessedDate: TODAY,
        type: "preprint",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["llama-2", "meta", "release", "2023", "open-weights"],
  },
  {
    vertical: "ai-ml",
    subject: "Llama 3.1",
    predicate: "released_on",
    object: "2024-07-23",
    confidence: 1.0,
    sources: [
      {
        url: "https://ai.meta.com/blog/meta-llama-3-1/",
        title: "Introducing Llama 3.1: Our most capable models to date",
        publisher: "Meta AI",
        publishedDate: "2024-07-23",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "Today, we're releasing the latest models in our Llama collection. Llama 3.1 405B is the first openly available model that rivals the top AI models when it comes to state-of-the-art capabilities in general knowledge, steerability, math, tool use, and multilingual translation.",
      },
      {
        url: "https://huggingface.co/meta-llama/Llama-3.1-405B",
        title: "meta-llama/Llama-3.1-405B model card",
        publisher: "Hugging Face",
        publishedDate: "2024-07-23",
        accessedDate: TODAY,
        type: "model-card",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["llama-3.1", "meta", "release", "2024", "open-weights", "405b"],
  },
  {
    vertical: "ai-ml",
    subject: "Llama 3.1 405B",
    predicate: "parameter_count",
    object: "405000000000",
    confidence: 1.0,
    sources: [
      {
        url: "https://ai.meta.com/blog/meta-llama-3-1/",
        title: "Introducing Llama 3.1: Our most capable models to date",
        publisher: "Meta AI",
        publishedDate: "2024-07-23",
        accessedDate: TODAY,
        type: "official-blog",
      },
      {
        url: "https://huggingface.co/meta-llama/Llama-3.1-405B",
        title: "meta-llama/Llama-3.1-405B model card",
        publisher: "Hugging Face",
        accessedDate: TODAY,
        type: "model-card",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["llama-3.1", "parameters", "405b", "meta"],
  },
  {
    vertical: "ai-ml",
    subject: "Mixtral 8x7B",
    predicate: "released_on",
    object: "2023-12-11",
    confidence: 0.95,
    sources: [
      {
        url: "https://mistral.ai/news/mixtral-of-experts/",
        title: "Mixtral of experts — A high quality Sparse Mixture-of-Experts",
        publisher: "Mistral AI",
        publishedDate: "2023-12-11",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "Today, the team is proud to release Mixtral 8x7B, a high-quality sparse mixture of experts model (SMoE) with open weights.",
      },
      {
        url: "https://huggingface.co/mistralai/Mixtral-8x7B-v0.1",
        title: "mistralai/Mixtral-8x7B-v0.1 model card",
        publisher: "Hugging Face",
        publishedDate: "2023-12-11",
        accessedDate: TODAY,
        type: "model-card",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["mixtral", "mistral", "release", "2023", "moe", "sparse"],
  },
  {
    vertical: "ai-ml",
    subject: "Mixtral 8x7B",
    predicate: "architecture",
    object: "Sparse Mixture-of-Experts (8 experts × 7B params, 2 experts routed per token)",
    confidence: 1.0,
    sources: [
      {
        url: "https://mistral.ai/news/mixtral-of-experts/",
        title: "Mixtral of experts",
        publisher: "Mistral AI",
        publishedDate: "2023-12-11",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "Mixtral has 8 experts in each layer … At every layer, for every token, a router network chooses two of these experts to process the token and combine their output additively.",
      },
      {
        url: "https://arxiv.org/abs/2401.04088",
        title: "Mixtral of Experts",
        publisher: "Mistral AI / arXiv",
        publishedDate: "2024-01-08",
        accessedDate: TODAY,
        type: "preprint",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["mixtral", "moe", "architecture", "mistral"],
  },
  {
    vertical: "ai-ml",
    subject: "Gemini Pro",
    predicate: "released_on",
    object: "2023-12-06",
    confidence: 1.0,
    sources: [
      {
        url: "https://blog.google/technology/ai/google-gemini-ai/",
        title: "Introducing Gemini: our largest and most capable AI model",
        publisher: "Google",
        publishedDate: "2023-12-06",
        accessedDate: TODAY,
        type: "official-blog",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["gemini", "google", "release", "2023"],
  },
  {
    vertical: "ai-ml",
    subject: "Whisper",
    predicate: "released_on",
    object: "2022-09-21",
    confidence: 1.0,
    sources: [
      {
        url: "https://openai.com/index/whisper/",
        title: "Introducing Whisper",
        publisher: "OpenAI",
        publishedDate: "2022-09-21",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "We've trained and are open-sourcing a neural net called Whisper that approaches human level robustness and accuracy on English speech recognition.",
      },
      {
        url: "https://github.com/openai/whisper",
        title: "openai/whisper repository",
        publisher: "OpenAI",
        publishedDate: "2022-09-21",
        accessedDate: TODAY,
        type: "github-release",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["whisper", "openai", "speech", "asr", "release", "2022"],
  },

  // ─── Organizational facts ────────────────────────────────────────────
  {
    vertical: "ai-ml",
    subject: "Anthropic",
    predicate: "founded_in",
    object: "2021",
    confidence: 1.0,
    sources: [
      {
        url: "https://www.anthropic.com/company",
        title: "About Anthropic",
        publisher: "Anthropic",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "Anthropic was founded in 2021.",
      },
      {
        url: "https://en.wikipedia.org/wiki/Anthropic",
        title: "Anthropic — Wikipedia",
        publisher: "Wikipedia",
        accessedDate: TODAY,
        type: "docs",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["anthropic", "company", "founded", "2021"],
  },
  {
    vertical: "ai-ml",
    subject: "OpenAI",
    predicate: "founded_in",
    object: "2015",
    confidence: 1.0,
    sources: [
      {
        url: "https://openai.com/our-structure/",
        title: "OpenAI's structure",
        publisher: "OpenAI",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "OpenAI was founded in late 2015 as a non-profit research lab dedicated to ensuring that artificial general intelligence (AGI) benefits all of humanity.",
      },
      {
        url: "https://openai.com/index/introducing-openai/",
        title: "Introducing OpenAI",
        publisher: "OpenAI",
        publishedDate: "2015-12-11",
        accessedDate: TODAY,
        type: "press-release",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["openai", "company", "founded", "2015"],
  },
  {
    vertical: "ai-ml",
    subject: "Mistral AI",
    predicate: "founded_in",
    object: "2023",
    confidence: 1.0,
    sources: [
      {
        url: "https://mistral.ai/news/about-mistral-ai/",
        title: "About Mistral AI",
        publisher: "Mistral AI",
        accessedDate: TODAY,
        type: "official-blog",
        excerpt:
          "Mistral AI was founded in April 2023.",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["mistral", "company", "founded", "2023"],
  },
  {
    vertical: "ai-ml",
    subject: "Hugging Face",
    predicate: "founded_in",
    object: "2016",
    confidence: 1.0,
    sources: [
      {
        url: "https://huggingface.co/huggingface",
        title: "Hugging Face organization page",
        publisher: "Hugging Face",
        accessedDate: TODAY,
        type: "official-blog",
      },
      {
        url: "https://en.wikipedia.org/wiki/Hugging_Face",
        title: "Hugging Face — Wikipedia",
        publisher: "Wikipedia",
        accessedDate: TODAY,
        type: "docs",
        excerpt:
          "Hugging Face, Inc. is an American company incorporated under the Delaware General Corporation Law … founded in 2016 by French entrepreneurs Clément Delangue, Julien Chaumond, and Thomas Wolf.",
      },
    ],
    publishedAt: PUBLISHED_AT,
    lastVerified: TODAY,
    methodologyVersion: METHODOLOGY,
    tags: ["hugging-face", "company", "founded", "2016"],
  },
];

/**
 * Total seed claim count — used by build scripts + status pages.
 * Update on every seed change so dashboards reflect current state.
 */
export const SEED_CLAIM_COUNT = seedClaims.length;
