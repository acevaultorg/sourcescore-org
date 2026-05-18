# Stop hallucinating: a developer API for grounding LLM responses with signed, sourced claims

> **TL;DR**: I shipped [SourceScore VERITAS](https://sourcescore.org/claims/) — a free-tier-friendly API that returns hand-verified AI/ML claims with their primary sources, an HMAC-SHA256 signature, and a ready-to-paste citation. 306 hand-verified claims spanning 1997-2025. `curl https://sourcescore.org/api/v1/claims.json` and you're in.

---

If you've built anything on top of an LLM in the last two years, you've watched it confidently invent facts that don't exist. You've seen GPT-4 cite papers that were never written. You've watched Claude give the wrong release date for a model that came out last month. You've fixed RAG pipelines where the retriever pulled the *right* document but the model still produced a number nobody can find anywhere on the source page.

The grounding problem isn't going away. It's the **hardest unsolved problem in production AI today**, and the bigger your model gets, the more confidently it lies when it lies.

I shipped [VERITAS](https://sourcescore.org/claims/) — a developer API I wish existed two years ago.

## What it does (in one curl)

```bash
curl -X POST https://sourcescore.org/api/v1/verify \
  -H 'Content-Type: application/json' \
  -d '{"claim": "Llama 3.1 was released in July 2024"}'
```

```json
{
  "apiVersion": "v1",
  "query": "Llama 3.1 was released in July 2024",
  "bestMatch": {
    "id": "...",
    "subject": "Llama 3.1",
    "predicate": "released_on",
    "object": "2024-07-23",
    "statement": "Llama 3.1 released on: 2024-07-23.",
    "confidence": 1.0,
    "detailUrl": "https://sourcescore.org/api/v1/claims/....json"
  },
  "signature": {
    "algorithm": "HMAC-SHA256",
    "signedBy": "did:web:sourcescore.org",
    "signedAt": "2026-05-16T...",
    "signature": "..."
  }
}
```

Three things make this useful for grounding LLMs:

1. **Every claim has ≥2 primary sources** — the official Meta AI blog, the model card on Hugging Face, the arXiv preprint, etc. Not "according to an article on TechCrunch."
2. **Every response is signed** — HMAC-SHA256 with `did:web:sourcescore.org`. Your client can prove the answer came from SourceScore and wasn't tampered in transit.
3. **Every claim has a stable id** — paste it into your LLM context, link to it from a paper, embed it in a prompt template. It won't move.

## Why I built it this way

There are great academic fact-checking datasets. There are great benchmark leaderboards. There's Wikipedia. None of them are an API you can call from your RAG pipeline at request time with a ~80ms response.

I picked a narrow vertical to start — **AI/ML research**. 306 hand-verified claims spanning 1997-2025 covering:

- **Foundational papers + methods**: Transformer (Vaswani 2017), LSTM (Hochreiter 1997), Attention, RLHF, Chain-of-Thought, ReAct, LoRA, QLoRA, DPO, FlashAttention, RoPE, CLIP, RAG, BLEU, ROUGE, AdamW, Dropout, BatchNorm, LayerNorm
- **RL milestones**: AlphaGo (Nature 2016), AlphaZero (Science 2018), AlphaFold 2 + 3, PPO
- **Model releases with dates + parameter counts**: GPT-2/3/4/4-Turbo/4o, Claude 3/3.5 family, Llama 1/2/3/3.1/3.2/3.3, Gemini Pro/1.5 Pro/Ultra/2.0, Mistral 7B, Mixtral 8x7B, Qwen, Gemma, DeepSeek V3, DeepSeek-R1, Phi-3, OLMo, RoBERTa, DistilBERT, ELECTRA, T5, BERT, ELMo, Whisper, DALL·E 3, Imagen, Stable Diffusion 1/3, Sora, GitHub Copilot
- **Datasets + benchmarks**: ImageNet, C4, The Pile, RedPajama, GLUE, SuperGLUE, HumanEval, MMLU
- **Organizations**: OpenAI, Anthropic, DeepMind, Stability AI, EleutherAI, Mistral AI, AI21 Labs, Hugging Face, Together AI, xAI, Cohere, Allen Institute for AI, Replicate, Pinecone, Weaviate, Qdrant

Every claim is hand-verified against the primary source. If a claim is below 0.85 confidence, it's not published. Performance-comparison claims are intentionally excluded for v0 because benchmark numbers depend on version + prompt format + harness — too much surface for "actually that's not quite right" pushback. We wrote a [whole essay](https://sourcescore.org/blog/why-no-performance-claims/) on why.

The plan is to grow the catalog to ~500 claims by end of year, all under the same methodology.

## Drop-in integrations

If you're already on LangChain / LlamaIndex / OpenAI tools / Vercel AI SDK / DSPy, there's a drop-in guide for each:

- [LangChain integration](https://sourcescore.org/docs/integrations/langchain/) — retrieve-then-cite + generate-then-verify patterns
- [LlamaIndex integration](https://sourcescore.org/docs/integrations/llamaindex/) — custom Retriever + NodePostprocessor
- [OpenAI tool-calls](https://sourcescore.org/docs/integrations/openai-tools/) — native function-calling
- [Vercel AI SDK](https://sourcescore.org/docs/integrations/vercel-ai-sdk/) — Next.js + streamText tool pattern
- [DSPy](https://sourcescore.org/docs/integrations/dspy/) — Stanford's compound-AI-system framework

There's also a [browser playground](https://sourcescore.org/playground/) — try the API live with no signup.

## Free tier, no signup

The free tier is **1,000 claims/month, no auth required**. Just curl. Get familiar with the data shape, the signature format, the search behavior. If you outgrow it, paid tiers are €19 (Indie) / €99 (Startup) / €499 (Scale) — Stripe metered billing.

- OpenAPI 3.1 spec: [/api/v1/openapi.json](https://sourcescore.org/api/v1/openapi.json)
- Full docs: [/docs/](https://sourcescore.org/docs/)
- 5-min quickstart: [/quickstart/](https://sourcescore.org/quickstart/)

## What's next

Two open questions I'd love feedback on:

1. **What claim types are most valuable?** Right now I'm at release-dates + parameter-counts + paper-introductions + organizational-facts. What else would your pipeline cite?
2. **Vertical expansion direction.** AI/ML is the v0 wedge. Next likely candidates: scientific instrumentation specs, software release dates + versions, regulatory deadlines. What would you actually use?

Try it; break it; tell me what's missing. [contact@sourcescore.org](mailto:contact@sourcescore.org) or comment below.

---

> Built with: Next.js 15 (static export) · Cloudflare Pages + Pages Functions · TypeScript · Web Crypto API for HMAC · Plausible Analytics. 100% serverless, ~80ms p95 globally. Source-rating product (the original SourceScore Index, 130 hand-scored sources) lives alongside at the same domain — both products under one methodology.

**Links to bookmark:**
- Catalog: https://sourcescore.org/claims/
- Quickstart: https://sourcescore.org/quickstart/
- Playground: https://sourcescore.org/playground/
- Docs: https://sourcescore.org/docs/
- OpenAPI spec: https://sourcescore.org/api/v1/openapi.json
- Pricing: https://sourcescore.org/pricing/

<!-- Tags for Dev.to / Hashnode: ai, ml, llm, api, typescript, opensource, productivity, webdev
     Canonical URL: https://sourcescore.org/blog/launching-veritas/
     Cover image: 1200x630 OG; operator can use existing /logo.svg as basis.
     Author bio (operator-edit): "Founder, SourceScore. Solo-building developer infrastructure for grounded AI." Twitter handle goes here. -->
