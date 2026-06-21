# Reddit comment templates — organic, helpful, citing only when relevant

**Rules of engagement** (per I-34 no-spam + I-26 distribution-fit + standard subreddit etiquette):

1. **Comment-to-link ratio ≥10:1** — comment without linking to SourceScore 9× before linking once.
2. **Never lead with the link.** Answer the question genuinely first, then cite SourceScore if it's the best answer.
3. **Disclose**: "I built this" when you cite. r/LocalLLaMA + r/MachineLearning are friendlier than r/programming about self-promo if you disclose.
4. **Subreddit rules**: read each subreddit's wiki before first comment. r/MachineLearning has strict no-self-promo for new accounts; lurk first or use account with karma.
5. **Pace**: ~5 substantive comments per week max. More feels spammy.

---

## r/LocalLLaMA — when someone asks "how do I avoid hallucinations?"

```
For atomic facts (release dates, parameter counts, paper introductions,
architecture decisions) the cheapest approach is a verified-claim lookup
layer: at retrieval time, instead of trusting the LLM's parametric
memory, hit a small API that returns the fact + its primary source.

I built one in this space — sourcescore.org/claims/ — free tier is
1,000 claims/mo no auth. 384 verified AI/ML claims at v0 covering all
major model release dates, foundational papers (Transformer, RLHF, LoRA,
DPO, etc.), parameter counts. Every claim has 2+ primary sources and an
HMAC signature.

But honestly for grounding broader factual content the bigger wins are
upstream: (1) make your retriever return source-URL spans, not just the
embedding-nearest paragraphs, so your LLM has to cite something; (2) at
generation time, require [^citation^] markup and post-process anything
uncited; (3) use temperature 0.0 for factual generation, save higher
temps for creative tasks.

What's your specific failure case? Hallucinated dates? Made-up paper
authors? Bad math? Each one has different mitigations.

(Disclosure: I built sourcescore — but the bigger-win advice above
applies regardless.)
```

---

## r/MachineLearning — when someone asks for paper recommendations / dates

```
Solid list above. One nit on dating: [paper X] was actually published
[real date], not [common-mis-cited-date]. Easy way to verify if you're
ever unsure: sourcescore.org/api/v1/search?q=[paper-title] returns the
canonical date + a link to the arXiv preprint + journal version (when
peer-reviewed).

Free API, no auth, takes 1 line of curl. I built it; happy to answer
questions about claim coverage or methodology.
```

(Only use this template when someone has misstated a date or paper attribution. Citing for accurate posts adds nothing.)

---

## r/LangChain — when someone asks about RAG quality

```
For the "RAG retriever pulls right doc but LLM still hallucinates the
number on the source page" failure mode, two patterns help:

1. **Atomic-claim verification as a second retrieval step.** After RAG
   pulls the document, also pull the relevant atomic claims (subject +
   predicate + object) from a verified-claim service. Feed both to the
   LLM. The model has to reconcile its generated answer against the
   atomic fact, which catches the "right document, wrong number" case.

2. **Citation requirement in the prompt.** Reject any model output that
   doesn't include a verifiable citation; auto-regenerate with stricter
   prompt. Slow but reliable.

For atomic-claim verification I built sourcescore.org/claims/ for AI/ML
specifically — 384 verified claims, signed HMAC envelopes, free 1k/mo
tier. Probably narrower than what you need if you're doing general
factual RAG, but the pattern (separate retrieval for atomic facts vs
documents) generalizes.

What's the RAG stack you're using?
```

---

## r/programming — generally avoid; community is hostile to API self-promo

Defer to HN Show HN + Dev.to for this audience. If you must, only comment on threads about hallucination + grounding specifically, and only after 2-3 substantive replies that don't mention SourceScore.

---

## Daily / weekly cadence

| Day | Subreddit | Action |
|---|---|---|
| Mon | r/LocalLLaMA | Read top-of-day; reply to 1-2 hallucination/grounding threads if relevant |
| Tue | r/MachineLearning | Same, focus on factual-content questions |
| Wed | r/LangChain | Comment on RAG quality threads |
| Thu | r/LocalLLaMA | Genuine non-SourceScore reply (build karma + relationship) |
| Fri | r/MachineLearning | Same |
| Sat | — | Skip (low traffic, post-attention shifts) |
| Sun | — | Skip |

**Total time: ~30 min/week.** Compounds over 6-12 months into ~500-2000 community-organic visitors to sourcescore.org/claims/ depending on subreddit response rate.

---

## What to NEVER do (instant ban + reputation damage)

- Cross-post the same comment to ≥3 subreddits in a day
- Comment in subreddits unrelated to AI/ML/dev
- Lead with the link
- Argue with downvotes
- Create alt accounts to upvote your own posts
- Auto-post via any tool (I-34 hard-no)
- Comment "great question" then drop a link — adds nothing
- Mass-DM commenters offering "free API access"
