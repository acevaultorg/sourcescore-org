# Research Synthesis — Pay-Per-Crawl + TollBit

> **⚠️ 2026-05-16 UPDATE — TollBit was REMOVED from sourcescore.org.**
> Operator decision: TollBit pay-per-crawl revenue measured $0/mo since
> launch despite forwarding all major AI bot UAs; VERITAS Y1 ARR
> trajectory dominates the trade-off. Middleware deleted in commit
> 21e5b90 (see `/changelog/` on the live site). This document remains
> as a historical record of the original research; recommendations that
> hinged on TollBit revenue are no longer in force for sourcescore.
> Fleet-wide TollBit applicability for OTHER sites is still discussed
> in `methodology/bot-harvest.md` Path 2 (now marked deprecated for the
> source-rating product).

**Input:** `/acepilot auto [study this: ...]` — multi-session transcript on TollBit / Ledger concepts / domain brainstorming.
**Date:** 2026-04-23 · v19.7 auto mode.
**Applies to:** this folder's Cost-Adjusted LLM Leaderboard concept (CONCEPT.md).

---

## What the research actually concluded

The prior session's final ranking, post-incumbent-checks:

| # | Concept | Status | Why |
|---|---|---|---|
| 🥇 1 | **HoldLens × TollBit** (extend `/insiders/`) | Recommended + already executed by operator | Existing asset, zero new-incumbent risk, finance vertical premium, 2-6 wk to revenue |
| 🥈 2 | Fleet-wide TollBit retrofit | Recommended | Monetize every existing site, zero content risk |
| 🥉 3 | EU regulatory analysis in English | Y2 option | Language/proximity moat |
| — | TenderLedger / FilingLedger / PatentLedger / SanctionsLedger / EntityLedger | **Killed** | Every one has funded incumbent (OpenOpps, Bloomberg, Google Patents, OpenSanctions, entityledger.io) |

**Operator status:** followed advice — HoldLens extended to `/insiders/`, partial ship, cross-session verification pending on llms.txt + JSON-LD + Cloudflare PPC.

---

## The key lesson for THIS folder

The research's meta-finding: **"my default of nobody's built this is systematically over-optimistic."** Three-for-three wrong on incumbent-check assumption across TenderLedger / EntityLedger / SanctionsLedger.

This folder's `CONCEPT.md` (Cost-Adjusted LLM Leaderboard) **was** incumbent-checked — it explicitly names artificialanalysis.ai, lmarena.ai, livebench.ai, scale.com/leaderboard and chooses a differentiated angle (cost-adjusted, not composite). So it's not in the same trap.

But the research raises a question that's NOT fully answered: **does cost-adjusted performance already have a funded incumbent I haven't looked for?**

Candidates to check before registering a domain:
- artificialanalysis.ai (already checked — composite not cost-adjusted)
- lmarena.ai (community votes — different angle)
- livebench.ai (fresh benchmarks — different angle)
- **Unchecked:** OpenRouter rankings, Vellum.ai "model finder", Helicone playground, PromptLayer benchmarks, LLMPriceCheck, LLMBenchmark
- **Unchecked:** any YC W26 / seed-stage company in the "model router" or "cost optimization" space

---

## Revised action — check before register

Before executing TASKS.md Card 1 (domain registration, 🔴 REQUIRED, payment gate):

**15-minute incumbent check via Chrome MCP:**

1. Google: "cost per token LLM comparison" → top 5 results = incumbent candidates
2. Google: "cheapest model that beats GPT-4" → see if a product already answers this
3. Google: "llm pricing calculator" → check rankings
4. Check Product Hunt last 90 days: "LLM comparison"
5. HN search: "cost-adjusted LLM"
6. YC W25/W26 batch: search "model router" + "LLM cost"

If 0 direct competitors → proceed with domain registration + build.
If 1-2 direct competitors with narrow angle → differentiate or pivot sub-wedge (e.g., "enterprise-only, compliance-weighted" or "local-inference-included").
If 3+ funded competitors → reconsider. Likely same trap as EntityLedger.

---

## Alternative path — fleet-first

The research's #2 recommendation (fleet-wide TollBit retrofit) has **zero new-domain cost + zero incumbent risk** and monetizes every existing fleet site:

- holdlens.com (finance, highest-value)
- fermentcalc.com (food)
- editnative.com (design/tech)
- sourdoughhydration.com (food)
- readinglist.school (education)
- conversionbench.com (business)

TollBit + Cloudflare PPC on all 6 = monetize existing content immediately. No new concept risk. Operator time: 15-30 min per site for TollBit application (all apps can submit same week).

**Tradeoff:** smaller ceiling than LLM Leaderboard (~$50-200/mo combined fleet vs. $10-30k/yr projected for Leaderboard), but 90% less risk and ships this week.

---

## Honest recommendation

**Before registering `llmcost.com` / `llmvalue.com` / etc. (this folder's Card 1):**

1. Run the 15-min incumbent check above. This is the single lesson the research is trying to teach.
2. In parallel, execute the fleet-wide TollBit retrofit (6 existing sites, zero new risk).

If incumbent check passes → both paths run in parallel (Leaderboard new-domain + Fleet retrofit).
If incumbent check fails → scrap Leaderboard concept, focus on Fleet + HoldLens TollBit extension.

Either way, the next operator action isn't "register domain" — it's "Chrome MCP search for funded competitors in cost-adjusted LLM space." That's a 15-min, $0 action that gates a $10-35 payment gate.

---

## What's on disk in this folder (current state)

- `CONCEPT.md` — Cost-Adjusted LLM Leaderboard, APS 55, 2-3 day Easy-tier build
- `BUILD_SPEC.md` — Day 1-7 through Month 6, invariant-coupled
- `DOMAIN_CANDIDATES.md` — 20 candidates in 3 tiers, top 5: llmcost.com, llmvalue.com, modelprice.ai, llmpicker.com, llmbench.com
- `TASKS.md` — 5 Clarity Cards (I-27 format), Card 1 = 🔴 REQUIRED domain registration (payment gate)
- `.claude/state/` — ANALYTICS, CONTEXT, KNOWLEDGE, LEARNED, TASKS

No work is lost. The concept is legitimate. The research just says: **verify incumbents before spending money**, and **fleet retrofit is a zero-risk parallel path**.

---

## What this session did

1. Read research (multi-session transcript, ~30k words of TollBit + Ledger + domain strategy).
2. Cross-referenced against this folder's existing concept (Cost-Adjusted LLM Leaderboard).
3. Identified the unaddressed risk: **"cost-adjusted" incumbent check not done at product/funding level**.
4. Documented synthesis + revised action plan here.
5. No new files created beyond this synthesis. No domain registered. No money spent. Payment gate respected.

---

## Next session — two independent actions

**Action A (15 min, $0, Chrome MCP):** incumbent check on "cost-adjusted LLM performance" space. Outputs: go/no-go on Leaderboard concept.

**Action B (15-30 min per site, $0, operator form-filling):** TollBit publisher applications for existing fleet sites. Outputs: 6 monetization applications submitted, 3-10 day wait each.

Either can fire in either order. A gates the expensive path; B has no gate.
