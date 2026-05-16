# X / Twitter launch thread

**Format**: 7-tweet thread. Each tweet ≤280 chars. Operator-published from their X handle. Post Tue/Wed 9-11am UTC for AI-dev-Twitter rhythm.

**Visual asset needed**: 1 screenshot showing the `curl` → JSON response. Save from `https://sourcescore.org/playground/` for the demo image.

---

## Thread (copy-paste ready)

**Tweet 1 — Hook + curl**

```
shipped a free API for grounding LLM responses with signed, sourced claims.

curl -X POST https://sourcescore.org/api/v1/verify \
  -d '{"claim":"Llama 3.1 released July 2024"}'

→ best match + 2+ primary sources + HMAC signature

free tier: 1k verifies/mo, no signup 🧵
```

**Tweet 2 — Why this matters**

```
RAG retrieves docs but doesn't verify the model's output against them.

retriever pulls right doc → model still emits wrong number → user sees wrong answer with citation that doesn't match.

verification is the missing step.
```

**Tweet 3 — The catalog**

```
136 hand-verified AI/ML claims at launch:

• transformer paper (vaswani 2017)
• LSTM (hochreiter 1997)
• alphago + alphazero
• every major LLM release w/ date + params
• benchmarks (MMLU, GLUE, HumanEval)
• vector DBs (pinecone, weaviate, qdrant)

every claim has ≥2 primary sources
```

**Tweet 4 — Integration time**

```
drop-in integration guides for:

• LangChain → retrieve-then-cite + generate-then-verify
• LlamaIndex → custom Retriever + NodePostprocessor  
• OpenAI tools → native function-calling
• Vercel AI SDK → streamText pattern
• DSPy → Stanford's compound-AI framework

https://sourcescore.org/docs/integrations/
```

**Tweet 5 — The playground**

```
no-signup browser playground:

https://sourcescore.org/playground/

paste a claim, see the verification result + signature + sources in <100ms. 

useful for evaluating whether the catalog covers your use case before you wire it in.
```

**Tweet 6 — Pricing**

```
pricing:

• free: 1k claims/mo, no auth
• indie: €19/mo, 50k claims
• startup: €99/mo, 500k claims  
• scale: €499/mo, 5M claims + 4h support SLA

stripe metered billing. no sales call. no enterprise tier by design.
```

**Tweet 7 — CTA**

```
try it; break it; tell me what's missing.

catalog → https://sourcescore.org/claims/
quickstart → https://sourcescore.org/quickstart/
playground → https://sourcescore.org/playground/

email contact@sourcescore.org for catalog requests or vertical expansion suggestions.
```

---

## Single-tweet variants (use any of these for non-launch days)

### Variant A — pick a specific claim

```
fun fact: the LSTM paper was published in 1997 (hochreiter & schmidhuber, Neural Computation 9(8), pp. 1735-1780).

12 years before the deep-learning revival. 25 years before GPT-3.

cite it from your RAG pipeline:
https://sourcescore.org/api/v1/verify
```

### Variant B — RAG hallucination story

```
the hardest hallucinations to debug:

RAG retrieves the right document.
The doc contains the right number.
The LLM emits the wrong number anyway.

retrieval-augmented generation has no verify step. that's the gap.

→ verify-then-respond pattern: https://sourcescore.org/concepts/rag-vs-veritas/
```

### Variant C — methodology angle

```
why we don't publish benchmark scores in the verified-claim catalog:

"Llama 3 70B MMLU = X" depends on:
- which MMLU split
- prompt format
- chain-of-thought on/off  
- decoding params
- base vs instruct

→ https://sourcescore.org/blog/why-no-performance-claims/
```

### Variant D — citation discipline

```
the actual difference between citing a Wikipedia URL and citing a verified-claim envelope:

URL → can rot, redirect, change content
envelope → stable ID + verbatim excerpt + HMAC signature + timestamp

if you're building an AI app that needs to be auditable in 3 years, you want the envelope.
```

---

## Hashtag list (use 2-3 max per tweet)

`#AI #LLM #MachineLearning #RAG #LangChain #OpenAI #AIInfra #DeveloperTools #API #BuildInPublic`

## Reply guidelines

- Reply to 100% of substantive replies within 4 hours
- Don't argue; acknowledge + clarify + move on
- If asked technical questions, link to docs/concepts/integrations
- If asked "is this open source?" — the catalog is publicly fetchable; the application code lives in a public GitLab repo; clarify license model when asked
