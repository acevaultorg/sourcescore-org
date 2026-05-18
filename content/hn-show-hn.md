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

I'm a solo dev who got tired of watching LLMs invent release dates and
hallucinate paper citations in production. So I built a small API that
returns hand-verified claims with primary sources, an HMAC-SHA256
signature, and a ready-to-paste citation.

Try it:

  curl https://sourcescore.org/api/v1/claims.json | jq '.count'
  # → 216

  curl -X POST https://sourcescore.org/api/v1/verify \
    -H 'Content-Type: application/json' \
    -d '{"claim": "Llama 3.1 was released in July 2024"}'
  # → bestMatch with sources + HMAC signature

The v0 wedge is AI/ML research claims (release dates, paper introductions,
architecture facts, parameter counts, organizational dates). 276 claims at
launch spanning 1997-2025 — every one has 2+ primary sources. Free tier is
1,000 claims/mo with no auth, no signup.

Built on Next.js + Cloudflare Pages + Pages Functions. Static envelopes
signed at build time; runtime verify endpoint re-signs each response.
HMAC-SHA256 in v0; migration to W3C Verifiable Credentials with Ed25519
on the roadmap for Year 2 enterprise customers.

What it explicitly doesn't do:
- Performance comparisons (benchmark numbers depend on version + prompt
  format; too much "actually that's not quite right" surface for v0)
- Confidence below 0.85 (claims below threshold aren't published)
- Black-box scoring (every claim links to primary sources you can
  re-verify)

Docs: https://sourcescore.org/docs/
OpenAPI 3.1 spec: https://sourcescore.org/api/v1/openapi.json
Pricing (free + 3 paid tiers): https://sourcescore.org/pricing/

Open to feedback on what claim types are most valuable + what vertical
to expand to after AI/ML. Will be in-thread for the next few hours.
```

---

## Comment prep — likely top-3 critical takes + replies

**Top critical take #1: "Why not just use Wikipedia?"**

> Reply: "Wikipedia is great as a human-readable encyclopedia. As an API for LLM grounding, it has three gaps: (1) no signed envelope — your retrieval-augmented model can't prove the answer wasn't modified in transit; (2) free-text articles, not atomic subject-predicate-object claims, so your LLM still has to extract structure; (3) no per-claim confidence + primary-source linkage in a single JSON envelope. VERITAS gives you the API shape. If your use case is broader factual lookup, Wikipedia is the right tool."

**Top critical take #2: "Why should I trust SourceScore vs trusting upstream sources directly?"**

> Reply: "You shouldn't. The signature attests SourceScore signed this envelope; it doesn't attest the underlying fact. That's why every claim links to 2+ primary sources you can re-verify. The value is the unit-economics: hand-verifying every AI/ML release date you cite is slow + your time isn't free. VERITAS pays $0.0002/claim to do that work once and amortize it. The methodology is published; you can re-derive any score. If you want the raw signal, follow the source URLs in the envelope."

**Top critical take #3: "v0 catalog is small — only 276 claims?"**

> Reply: "Yes, intentionally — every claim is hand-verified against the primary source, not LLM-generated. The plan is ~500 by end of year and ~5,000 by Year 2. I'd rather grow quality-first than ship 50k synthetic claims. The contribution bar is 'subject + predicate + object are factual, ≥2 primary sources exist, confidence ≥0.85, no performance comparisons.' Open to issues/PRs against the seed file at gitlab.com/acevault-lab/sourcescore-org (data/claims-ai-ml.ts)."

**Top critical take #4: "Why HMAC-SHA256 and not Ed25519 / DID-based / actual cryptographic provenance?"**

> Reply: "Because HMAC-SHA256 is Web Crypto API native (works in Cloudflare Workers, Node, Bun, browsers, edge runtimes) with zero deps, and the v0 trust model is 'this envelope came from SourceScore and wasn't tampered in transit.' That's HMAC's territory. W3C Verifiable Credentials with Ed25519 keys for offline verification is on the Y2 roadmap, gated by enterprise customers asking for it. signedBy field stays did:web:sourcescore.org across the migration — switching the algorithm doesn't break consumers who recognize the identity."

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
