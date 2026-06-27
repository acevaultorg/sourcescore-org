# HN Show HN — submission template

**One-shot launch.** Post Tuesday or Wednesday 9-11am UTC for HN front-page rhythm. Single submission; do NOT repost from same domain. Operator stays in-thread for first 3 hours minimum.

---

## Title (max 80 chars)

```
Show HN: VERITAS – Signed, sourced claims for grounding LLM responses
```

Alt titles (pick one; A/B by gut feel — first variant is recommended):

- `Show HN: A developer API for grounding LLM responses with signed claims`
- `Show HN: SourceScore VERITAS – Stop your LLM from hallucinating release dates`

## URL field

```
https://sourcescore.org/claims/
```

(Some HN submitters prefer linking to /docs/ — the verified-claim browser is more visual and demos the product faster.)

## Body / first comment (since URL-only Show HN posts perform worse than ones with context)

```
Hey HN,

I'm a solo dev. I built this because I kept shipping LLM features that would
confidently make up release dates and cite papers that don't say what the model
claims. One told a user in prod that a library shipped a feature about a year
before it actually existed. That was the "ok, enough" moment.

[!! OPERATOR: replace the line above with YOUR real "an LLM burned me" moment —
which model, what it claimed. A true specific story is what makes HN believe a
human wrote this. This whole post must be re-typed in your own voice before
posting — see the authenticity notes below the body. !!]

So it's a small API that returns hand-verified claims with their primary sources,
a signature so you can tell the response wasn't tampered with, and a citation you
can paste straight into output.

Two things to try:

  curl https://sourcescore.org/api/v1/claims.json | jq '.count'
  # 384

  curl -X POST https://sourcescore.org/api/v1/verify \
    -H 'Content-Type: application/json' \
    -d '{"claim": "Llama 3.1 was released in July 2024"}'

First version only covers AI/ML facts (release dates, which paper introduced what,
parameter counts, org dates) because that's what I kept getting burned on. 384
claims right now, 1997 to 2025, each with at least 2 primary sources. Free tier is
1,000/mo, no signup, no auth, just curl it.

Stack is Next.js on Cloudflare Pages + Pages Functions. Envelopes signed at build
time, the verify endpoint re-signs each response. HMAC-SHA256 for now (Web Crypto
native, zero deps). I'll move to Ed25519 / verifiable credentials if someone
actually needs offline verification.

Stuff it deliberately doesn't do:
- benchmark/perf comparisons (depend on version + prompt, too easy to be wrong)
- anything below 0.85 confidence (not published)
- black-box scoring. every claim links its sources, go re-check them.

Docs: https://sourcescore.org/docs/
OpenAPI: https://sourcescore.org/api/v1/openapi.json
Free, no signup: https://sourcescore.org/api-access/ (bigger paid tier in private beta)

Genuinely curious what claim types would be useful to you, and what to cover after
AI/ML. I'll be in the thread.
```

---

## Comment prep — likely top-3 critical takes + replies

**Top critical take #1: "Why not just use Wikipedia?"**

> Reply: "Wikipedia is great as a human-readable encyclopedia. As an API for LLM grounding, it has three gaps: (1) no signed envelope — your retrieval-augmented model can't prove the answer wasn't modified in transit; (2) free-text articles, not atomic subject-predicate-object claims, so your LLM still has to extract structure; (3) no per-claim confidence + primary-source linkage in a single JSON envelope. VERITAS gives you the API shape. If your use case is broader factual lookup, Wikipedia is the right tool."

**Top critical take #2: "Why should I trust SourceScore vs trusting upstream sources directly?"**

> Reply: "You shouldn't. The signature attests SourceScore signed this envelope; it doesn't attest the underlying fact. That's why every claim links to 2+ primary sources you can re-verify. The value is the unit-economics: hand-verifying every AI/ML release date you cite is slow + your time isn't free. VERITAS pays $0.0002/claim to do that work once and amortize it. The methodology is published; you can re-derive any score. If you want the raw signal, follow the source URLs in the envelope."

**Top critical take #3: "v0 catalog is small — only 384 claims?"**

> Reply: "Yes, intentionally — every claim is hand-verified against the primary source, not LLM-generated. The plan is ~500 by end of year and ~5,000 by Year 2. I'd rather grow quality-first than ship 50k synthetic claims. The contribution bar is 'subject + predicate + object are factual, ≥2 primary sources exist, confidence ≥0.85, no performance comparisons.' Open to issues/PRs against the seed file at gitlab.com/acevault-lab/sourcescore-org (data/claims-ai-ml.ts)."

**Top critical take #4: "Why HMAC-SHA256 and not Ed25519 / DID-based / actual cryptographic provenance?"**

> Reply: "Because HMAC-SHA256 is Web Crypto API native (works in Cloudflare Workers, Node, Bun, browsers, edge runtimes) with zero deps, and the v0 trust model is 'this envelope came from SourceScore and wasn't tampered in transit.' That's HMAC's territory. W3C Verifiable Credentials with Ed25519 keys for offline verification is on the Y2 roadmap, gated by enterprise customers asking for it. signedBy field stays did:web:sourcescore.org across the migration — switching the algorithm doesn't break consumers who recognize the identity."

---

**Top critical take #5: "I pasted a false claim and /verify still returned a match — so it doesn't actually verify anything?"**

> Reply: "Right, and worth being precise: /verify is semantic RETRIEVAL, not a truth oracle. It returns the nearest verified claim in the catalog + a similarity score so your RAG pipeline (or you) can ground against it — it does NOT assert your input is true. matchScore is semantic similarity, not 'confidence this is true.' Example: 'GPT-5 was released in 2023' returns the nearest claim (GPT-4) because the catalog has NO claim confirming a 2023 GPT-5 release — that absence is the grounding signal; your model shouldn't assert it. The HMAC signature attests the RETRIEVED claim is genuine + sourced; it never attests your query. Mental model: 'here's the closest thing we've actually verified,' not 'true/false.' Low-similarity matches should be read as 'related, not a confirmation.'"

---

## Monitoring checklist (first 3 hours post-submission)

- [ ] Refresh /show every 30 min for first 90 min
- [ ] Reply to every substantive top-level comment (HN values founder presence — silent OPs are downvoted hard)
- [ ] Don't argue back on hostile comments — reply once with substance, move on
- [ ] If post hits front page: watch Plausible real-time. Server costs at /claims/ are ~$0; no worry. Static envelopes serve from CDN.
- [ ] Save post URL for future Dev.to canonical cross-post

## Failure modes

- **Post flagged/dead**: don't repost from same domain. Email hn@ycombinator.com with a polite "I'd like to launch this; please review." Re-attempt 30 days later if cleared.
- **Low votes / drowned**: don't beg or repost. Wait 24h, then post once on /r/MachineLearning with similar copy + a different angle (e.g., "Show: a free API for grounding LLM responses with signed claims").
- **Negative top comment dominates thread**: stay in. Substantive reply > silence. Hostility usually attracts contrarian upvotes for the OP if the reply is thoughtful.
- **Submission gets stuck on /new and never reaches /best**: that's the most likely outcome. ~1k visitors over 24h is still meaningful for v0 launch.
