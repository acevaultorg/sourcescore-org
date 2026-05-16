# LinkedIn zero-click framework posts — weekly cadence

Operator-published; brain drafts. Zero-click format: full post body + insight in the post itself (no "see article in comments"). LinkedIn algorithm rewards posts that keep readers on-platform.

**Cadence**: 1 post per week minimum. Each post takes ~5 min operator time to copy-paste + edit personal voice. Brain refreshes the queue every 4 weeks.

**Tone**: confident, specific, no clickbait, no emojis-as-bullets. Position operator as thoughtful builder, not marketer.

---

## Post 1 — The hallucination problem framing

> The hardest problem in production AI today isn't getting your LLM to give an answer. It's getting it to give an answer that's grounded.
>
> Three things I see go wrong in 80% of RAG pipelines:
>
> 1) Retriever pulls the right document — but the LLM still invents the number on the page.
>
> 2) The model "cites" a paper that doesn't exist, with authors that aren't on the paper, in a venue that wouldn't have published it.
>
> 3) Release dates and parameter counts drift in the model's training corpus. Yesterday's correct fact becomes today's hallucination, silently.
>
> All three trace to the same root cause: there's no atomic, verified, signed source of factual truth your pipeline can consult at retrieval time. RAG sees documents; the LLM sees text. Neither sees the underlying fact.
>
> I built a small developer API for one slice of this problem — AI/ML research claims — and the architecture decisions matter more than the catalog size. Every claim has 2+ primary sources. Every response is signed. Every fact has a stable id you can paste into a prompt and trust will resolve to the same answer in a year.
>
> Free tier is 1,000 claims/month with no auth. Try it; tell me what's missing.
>
> sourcescore.org/claims/

---

## Post 2 — Why HMAC over Ed25519 for v0

> A trust-architecture tradeoff I'm seeing teams get wrong:
>
> For a v0 API where you control the verification endpoint, HMAC-SHA256 with a single shared secret is good enough — and gives you Web Crypto API native (works in Workers, Edge runtimes, browsers, Node) with zero dependencies.
>
> Where Ed25519 / W3C Verifiable Credentials shine is when consumers want to verify offline against a published public key. That's an enterprise feature, not a v0 feature.
>
> So the migration path I chose: ship HMAC-SHA256 for v0, document the same did:web identifier (did:web:sourcescore.org), keep the signature envelope shape forward-compatible. When enterprise customers ask for offline verification, swap the algorithm; the identity stays.
>
> Premature cryptographic complexity is one of the great hidden bottlenecks for early-stage APIs. Ship the simpler primitive, document the migration, don't paint yourself into a corner.

---

## Post 3 — On benchmark performance claims

> Why my new claim-verification API explicitly excludes benchmark performance comparisons:
>
> "Llama 3 70B scores X on MMLU" depends on:
> - Which MMLU split (the original 14k? the cleaned subset? few-shot? zero-shot?)
> - Which prompt format (the original or one of the 50+ community variants?)
> - Whether chain-of-thought was enabled
> - The exact temperature, max_tokens, decoding strategy
> - Whether instruct or base model was tested
>
> Six dimensions of methodology drift means there's no canonical "Llama 3 70B MMLU = X" claim. Any number you publish will be wrong for 90% of the people trying to reproduce it.
>
> So v0 ships only facts that don't depend on methodology: release dates, parameter counts, paper introductions, context window sizes, official architecture statements. Benchmark numbers come back in v1 with explicit prompt-format + methodology metadata bundled with the claim.
>
> Sometimes the smartest first move is what you intentionally leave out.

---

## Post 4 — Building infrastructure as solo founder

> A note for the indie devs in my network:
>
> Solo-founder infrastructure is hard for the same reason boring problems are hard — there's no romantic moat, no clever algorithm, no eureka moment. There's just: did you make the right ten architectural decisions on day one, or did you make the wrong ten?
>
> Things I got right (in hindsight):
> 1) Static export + edge functions. Zero servers. Scales for free.
> 2) Dual-product on one domain — preserves SEO cache while letting the new product compound.
> 3) Free tier with no auth at v0. Anyone can curl and evaluate. Friction is a v1 problem.
> 4) Methodology published before the product. People trust verifiable trust signals.
> 5) Single signing identity (did:web:sourcescore.org) future-proofed for cryptographic upgrades.
>
> Things I didn't fully get right (yet):
> 1) Catalog size at launch (51 claims). Should have shipped 200.
> 2) SDK in same repo as the main project. Should have been a separate package from day one.
> 3) No Postgres at v0. Acceptable for read-only API; constraining for auth + billing.
>
> Net: ship the v0. Iterate against real users. Don't over-engineer.

---

## Post 5 — On open-source-with-tier-monetization model

> The hardest pricing question for any small developer API: how much should the free tier give away?
>
> Too much → no upgrade path. Too little → no evaluation, no adoption.
>
> The framework I landed on for my new VERITAS API:
>
> - Free tier should be enough for someone to genuinely evaluate the product. Not a teaser; a real working integration. For atomic-claim verification I settled on 1,000 claims/month — covers a small RAG pipeline at hobbyist scale.
>
> - Paid tier 1 should be cheap enough that an indie dev can subscribe without thinking. €19/mo, 50,000 claims. Covers most production indie integrations.
>
> - Paid tier 2 should match the cost shape of a small startup. €99/mo, 500,000 claims. Covers seed-stage AI apps in production.
>
> - Paid tier 3 should price the value of the SLA + support, not the marginal claim cost. €499/mo, 5M claims, 4h support SLA, 99.9% uptime.
>
> - No enterprise tier. By design. Solo-founder, no sales motion, no demos, no contracts. The Scale tier is enterprise.
>
> The discipline test: if a tier needs a sales call to close, the tier doesn't exist.

---

## Posts 6-12 — to draft in next refresh

- The case for static-export + CF Pages over Vercel for greenfield dev APIs
- Why the trust signal is the product, not the data
- 4 hours that compound — what one HN Show HN landing did for compound traffic 12 months later
- AI/ML claim verification vs general fact-checking: why narrow wins for v0
- Why I shipped my pricing page before my product was done
- The signing identity is the brand. Don't change it.
- (Brain refreshes queue when posts 1-5 cycle.)

---

## Engagement pattern (operator-side, 5 min per post)

1. Paste post body. Edit personal voice (read aloud — does it sound like you?). ~2 min.
2. Add specific number or example from your own work. ~1 min.
3. Schedule for Tue/Wed/Thu 9am UTC. LinkedIn algorithm rewards early-week professional content. ~30 sec.
4. Reply to top 3-5 comments within 2 hours of publish. ~2 min.
5. Repeat next Tuesday.

**Compounding mechanism**: each post lands ~30-300 impressions. Out of every 100 impressions, ~5-15 click through to sourcescore.org. Out of every 100 click-throughs, ~3-8 try the free API. Out of every 100 free-tier users, ~3-10 upgrade to paid in 30-90 days.

Math: 1 post/week × 52 weeks × 100 impressions/post × 10% click × 5% try × 5% paid = ~13 paid customers/year from LinkedIn alone, at sub-pricing-tier maintenance cost.
