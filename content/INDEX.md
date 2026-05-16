# Distribution content — operator publishing index

Brain-authored, ready-to-paste content for operator distribution. Each file is one channel + one or more variants. Operator publishes; brain never auto-posts (I-34 hard-reject).

**Goal:** reach €1k/mo MRR. Math at the bottom.

## Files

| File | Channel | Time | Yield (est) | When |
|---|---|---|---|---|
| `dev-to-launch-post.md` | Dev.to + Hashnode (canonical to /blog/launching-veritas/) | 15 min | 500-3k visitors first week | Day 1 of publish push |
| `dev-to-grounding-explainer.md` | Dev.to + Hashnode (canonical to /blog/verify-ai-facts-five-lines-python/) | 15 min | 300-1.5k visitors first week | Day 8 |
| `hn-show-hn.md` | Hacker News — Show HN | 30 min + 3h monitor | 1k-50k visitors one-shot | Tue/Wed 9-11am UTC, one-shot only |
| `reddit-comment-templates.md` | r/MachineLearning · r/LocalLLaMA · r/LangChain · r/LlamaIndex | 5 min/comment | 100-500/comment over 30d | 1-2 substantive comments/week |
| `linkedin-framework-post.md` | LinkedIn (operator profile) | 5 min/post | 30-300 impressions/post, ~5-15 click | 1 post/week |
| `x-twitter-thread.md` | X / Twitter | 10 min for thread, 2 min for single tweet | 100-5k impressions | Tue/Wed AM for launch thread; single tweets daily |

## Publishing sequence (recommended)

Aggressive 14-day sprint targeting €1k/mo MRR funnel onset:

### Week 1

- **Day 1 (Tue/Wed)**: HN Show HN at 9-11am UTC. Operator stays in-thread for 3h.
- **Day 2**: Cross-post `dev-to-launch-post.md` to Dev.to + Hashnode (canonical to /blog/launching-veritas/).
- **Day 3**: X / Twitter launch thread (`x-twitter-thread.md`).
- **Day 4**: LinkedIn Post 1 (hallucination problem framing from `linkedin-framework-post.md`).
- **Day 5**: First Reddit comment — r/LocalLLaMA hallucination thread.
- **Day 6-7**: Monitor + reply.

### Week 2

- **Day 8 (Tue/Wed)**: Cross-post `dev-to-grounding-explainer.md` to Dev.to (canonical to /blog/verify-ai-facts-five-lines-python/).
- **Day 9**: LinkedIn Post 2 (HMAC vs Ed25519 trade-off).
- **Day 10**: X thread variant or single-tweet (LSTM fun fact / RAG hallucination story).
- **Day 11**: Second Reddit comment — r/LangChain RAG-quality thread.
- **Day 12-14**: Monitor, reply, iterate.

## Revenue math — how this leads to €1k/mo

Funnel:

```
total visitors    =  HN(20k) + Dev.to(3k) + Reddit(800) + LinkedIn(200) + X(2k) + organic compound = ~26k Week 1
unique visitors   =  ~22k (dedup across channels)
visit-to-curl     =  ~5% → 1,100
curl-to-signup    =  ~10% → 110 free-tier users
free-to-paid      =  ~3% in 30d → 3-4 paid users Week 1
                     scale at ~30%/month compound on returning visitor cohort
```

Sustained baseline (months 2-6):
- Catalog SEO: ~500 organic UV/mo per concept pillar × 5 pillars + claims pages
- Returning newsletter / RSS: ~100-300 UV/mo
- LLM citations from bot crawls: ~50-150 UV/mo
- Word-of-mouth / share-card: variable

At baseline ~3k UV/mo × 5% activation × 3% free-to-paid = ~5 new paid/mo. Steady-state revenue projection:
- Month 3: 15 paid (mix Indie + Startup) → ~€400-€600/mo
- Month 6: 35 paid → ~€1,000-€1,500/mo ✓ **first €1k/mo target hit**
- Month 12: 80+ paid → ~€2,500-€4,000/mo

This is brain's projection. Operator's actual mileage depends on:
1. **HN landing** (50× variance possible — front page vs. drowned)
2. **Catalog request flywheel** — every reply on Reddit + Twitter that surfaces a missing claim triggers a brain-doable catalog ship → those askers convert at 30%+
3. **Friend-of-friend compound** — first 10 paid users invariably refer 2-3 others within 90d

## Pre-publish checklist (operator)

Before posting any content from this folder:

- [ ] Verify the URLs cited in the post are live (load each one in browser, check 200)
- [ ] Verify the count number (currently `196`) matches `https://sourcescore.org/api/v1/claims.json | jq '.count'`
- [ ] Verify the Stripe checkout flow on /pricing/ works (operator's payment gate)
- [ ] Operator's social-account profile is updated (bio mentions SourceScore + link)
- [ ] OG image at /og-default.png or per-page OG renders correctly when URL is pasted in a Slack/Discord preview

## Post-publish operator-only actions

Per I-34 + I-32 these are operator-only (never auto-executed by brain):

- 👨🏻‍🔧 Posting HN Show HN
- 👨🏻‍🔧 Cross-posting Dev.to / Hashnode articles  
- 👨🏻‍🔧 Reddit comments under operator's identity
- 👨🏻‍🔧 LinkedIn posts under operator's profile
- 👨🏻‍🔧 X / Twitter posts under operator's handle
- 👨🏻‍🔧 Direct messages to fleet contacts about VERITAS launch
- 👨🏻‍🔧 Wikipedia citation edits referencing SourceScore (operator account, COI disclosed)

Brain's role: keep these drafts current, expand catalog so cited claim counts grow, ship more blog posts + concept pillars + integration guides so operator-distribution always has fresh material.

## Operator note

**Trust commitment** (per `~/.claude/memory/`): brain follows operator's published-content discipline. Brain never posts under operator's identity. Operator publishes; brain refreshes drafts as catalog + product evolve.

Every brain refresh of these files commits with `docs(content): refresh distribution drafts (NN claims, [date])` — operator can `git log content/` to see refresh cadence.
