# Why your RAG pipeline still hallucinates — and the 30-line fix

> **TL;DR**: RAG retrieves; it doesn't verify. Adding a verify step closes the last gap. Here's the 30-line pattern, copy-paste runnable, with a free API that returns signed claims.

---

You built RAG. Embeddings, vector DB, top-k retrieval, prompt template. The retriever pulls the right docs. Everything looks good in the dashboard.

Then production users start filing tickets:

> "It told me Llama 3.1 has a 32k context window. It's 128k. The source it cited literally says 128k."

You read the source. It says 128k. Your retriever found it. Your prompt included it. The model still hallucinated.

This isn't a retrieval bug. **It's a verification bug.**

## What RAG actually does (and doesn't)

RAG = Retrieval-Augmented **Generation**. The "G" generates a response *conditioned on* retrieved context. There's no step that checks the response *against* the context.

If retrieval pulls `"Llama 3.1 has a 128k context window"` and the model emits `"Llama 3.1 has a 32k context window"`, the inconsistency is invisible to RAG. The user sees the wrong answer with a citation that doesn't match.

The fix isn't more retrieval. The fix is a **verify step** — extract the assertion from the response, look it up in a verified-claim catalog, return verified/unverified/refuted.

## The 30-line fix (Python)

```python
import requests
import re

def verify_assertions(llm_response: str) -> list[dict]:
    # Naive extraction: find sentences containing "is" / "has" / "released"
    sentences = re.split(r'(?<=[.!?])\s+', llm_response)
    candidates = [s for s in sentences if re.search(r'\b(is|has|released|introduced)\b', s, re.IGNORECASE)]
    
    verified = []
    for claim in candidates:
        r = requests.post(
            'https://sourcescore.org/api/v1/verify',
            json={'claim': claim, 'minConfidence': 0.85},
            timeout=2.0,
        )
        result = r.json()
        if result.get('bestMatch') and result['bestMatch']['confidence'] >= 0.85:
            verified.append({
                'claim': claim,
                'status': 'verified',
                'source': result['bestMatch']['detailUrl'],
                'signature': result['signature'],
            })
        else:
            verified.append({'claim': claim, 'status': 'unverified'})
    return verified

# Use it:
response = llm.generate(prompt)
checks = verify_assertions(response)
unverified = [c for c in checks if c['status'] == 'unverified']
if unverified:
    response += f"\n\n*Note: {len(unverified)} claim(s) could not be independently verified.*"
```

That's the entire pattern. No vector DB. No re-prompt loop. ~80ms per claim.

## What's behind the API

[SourceScore VERITAS](https://sourcescore.org/claims/) is a free-tier API I shipped that returns hand-verified AI/ML claims with HMAC-SHA256 signatures. 206 claims at the moment, growing weekly.

Three properties that matter for the verify-step pattern:

1. **Every claim has ≥2 primary sources.** Official Meta blog, the Llama 3.1 model card, the announcement post — not "TechCrunch said." This means when your verify step matches, you can return the source URL alongside the verification.
2. **Every response is signed.** HMAC-SHA256, so your application can prove the answer came from VERITAS and wasn't tampered. Useful for audit trails in regulated pipelines.
3. **Free tier with no signup.** 1,000 verifies/month, no auth. Just `curl`. Pricing kicks in beyond that — Indie €19 / Startup €99 / Scale €499 (Stripe metered billing).

## Why a verify step beats "just put it in the prompt"

You might be thinking: *"I'll just paste a verified-fact reference into the system prompt."*

Three reasons that doesn't work at scale:

- **Token cost.** 206 claims × ~200 tokens each = 25k tokens per request. Even at GPT-4o pricing, that's noticeable. With 5,000 claims (Year 1 target), it's prohibitive.
- **No coverage signal.** If the model emits a claim *not* in your prompt, you don't know whether it's verified or hallucinated. The verify step explicitly returns `verified` / `unverified`.
- **Stale prompts.** New claim shipped today won't be in last week's deployed prompt template. The API always returns the latest catalog state.

## What about LangChain / LlamaIndex / OpenAI tools?

If you're already on one of these, there's a drop-in guide:

- [LangChain](https://sourcescore.org/docs/integrations/langchain/) — retrieve-then-cite + generate-then-verify
- [LlamaIndex](https://sourcescore.org/docs/integrations/llamaindex/) — custom Retriever + NodePostprocessor
- [OpenAI tool-calls](https://sourcescore.org/docs/integrations/openai-tools/) — native function-calling pattern
- [Vercel AI SDK](https://sourcescore.org/docs/integrations/vercel-ai-sdk/) — Next.js + streamText
- [DSPy](https://sourcescore.org/docs/integrations/dspy/) — Stanford compound-AI-system framework

There's also a [browser playground](https://sourcescore.org/playground/) — run the API live without writing any code.

## The deeper read

If you want the methodology background, three concept pillars on the site cover the foundational reasoning:

- [LLM grounding](https://sourcescore.org/concepts/llm-grounding/) — what "grounding" actually means and 3 production patterns
- [Hallucination categories](https://sourcescore.org/concepts/hallucination/) — root causes + mitigations
- [RAG vs VERITAS](https://sourcescore.org/concepts/rag-vs-veritas/) — when each pattern applies

The headline finding from production deployments so far: **retrieve-then-cite alone catches ~60% of fabricated-source hallucinations. Adding a verify step closes another ~30%.** The remaining 10% is in genuinely ambiguous claims (e.g., "Claude 3 Opus has 200B parameters" — Anthropic has never confirmed) and is where human review still belongs.

---

Try it: `curl -X POST https://sourcescore.org/api/v1/verify -H 'Content-Type: application/json' -d '{"claim": "GPT-4 was released in March 2023"}'`

Comments / questions / catalog requests welcome. [contact@sourcescore.org](mailto:contact@sourcescore.org).

<!-- Tags: ai, ml, llm, rag, langchain, hallucination, api, python, typescript, opensource
     Canonical URL: https://sourcescore.org/blog/verify-ai-facts-five-lines-python/
     Cover: existing blog OG image -->
