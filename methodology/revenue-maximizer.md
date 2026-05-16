# Revenue Maximizer — the canonical fleet monetization stack (v1.0, 2026-04-21)

> **⚠️ 2026-05-16 — Layer 8 TollBit REMOVED from sourcescore.org.** Operator decision: measured $0/mo TollBit revenue × paywalled LLM-citation surface was net-negative against the VERITAS ARR trajectory. Middleware deleted in commit 21e5b90. Other fleet sites may still defer TollBit per the Month 6+ criteria documented below; this rule's structural framework is unchanged.

**Operator directive 2026-04-21:** *"how to get highest revenue of pay per crawl, ads, affiliate or something else. important to have fastest most easy revenue growth with no / barely non work for operator"*.

This rule is the canonical monetization-layer playbook for every fleet site. It ordered which revenue layer gets wired first, in what sequence, and which to skip entirely. Binding on every fleet site from v19.5 forward.

Calibrated against 2025-2026 publisher reports (Cloudflare PPC private beta, TollBit payout distributions, Mediavine Journey 1k threshold drop on 2026-01-15, Perplexity Publishers Program 80/20 split on $42.5M pool, Ezoic Access Now 0-minimum, Impact.com premium-brand rates, AI-visitor 4.4× organic conversion per Semrush 2025).

---

## Part 1 — The canonical stack (ordered install sequence)

Every fleet site installs revenue layers in this order. Skipping or reordering is a flag for @monetizer review. Operator-tagged `[experimental]` allows deviation.

### Layer 0 — AdSense compliance gate (Day 6, before any ad code)

See `rules/adsense-compliance.md`. Not a revenue layer — a gate. Every subsequent layer assumes the site passed.

### Layer 1 — AdSense (Day 7, 2-14d approval)

**What:** Google AdSense display ads. Baseline monetization.
**RPM:** $3-10 at fleet RPM tiers (reference + calculator content); see `rules/adsense-compliance.md` for per-vertical tier multipliers.
**Setup friction:** Low. Verification snippet in `<head>`, ads.txt placeholder, submit at adsense.google.com.
**Ongoing work:** Zero after approval.
**Payment gate:** No (free to apply). First payout is gated by operator payment setup (AdSense payment profile) — PAYMENT GATE prompt only when operator initiates.
**Why first:** table stakes. Every other layer either stacks or conflicts against AdSense. Shipping ads at Layer 1 is the honest baseline.
**Conflict:** **Mediavine exclusivity at Layer 7** requires atomic swap. See I-37.

### Layer 2 — Cloudflare Pay-Per-Crawl (Day 1, per-zone toggle)

**What:** Cloudflare bills AI crawlers on your behalf at publisher-set pricing. GA'd 2025.
**Revenue model:** Per-crawl marketplace. Min $0.01/crawl, publisher-set. $0.02 realistic.
**Projected (v19.4 calibration):** Flagship site with 2,500+ bot crawls/day = $15-500/mo realistic, $1,500/mo theoretical at $0.02. Sites with <100 crawls/day ~$0-5/mo.
**Setup friction:** Per-zone Cloudflare dashboard toggle. ~2 min/zone × fleet zones.
**Ongoing work:** Zero after enable.
**Payment gate:** Operator must set up payout method (bank transfer / Stripe Connect). PAYMENT GATE prompt required.
**Stacks with:** Everything (runs on raw bot traffic, ad-network-agnostic).
**Conflict:** None.
**Why early:** Already have bot traffic. Free $ waiting to be claimed.

### Layer 3 — llms.txt + schema.org + AI crawler allowlist (Day 1)

**Status:** ALREADY WIRED from v19.4 Bot Harvest. See `rules/bot-harvest.md`.
**Revenue mechanism:** Not direct. Feeds the 4.4× AI-visitor conversion multiplier (Semrush 2025) and 8-18% cited-source CTR → higher per-session AdSense/Mediavine RPM via indirect channel.
**Ongoing work:** Zero (wired into deploy pipeline).

### Layer 4 — Perplexity Publishers Program (Day 7, email pitch)

**What:** 80/20 revenue split on Perplexity's $42.5M publisher pool. Pays on indexed + human + agent traffic.
**Setup friction:** Email `publishers@perplexity.ai` with site brief. No minimum traffic.
**Ongoing work:** Zero after onboarding.
**Bonus:** Free Perplexity Enterprise Pro account for the operator (~$200/mo value).
**Payment gate:** No (free to pitch).
**Stacks with:** All other layers.
**Conflict:** None.
**Skip criteria:** Adult / gambling / prohibited content (same as AdSense).

### Layer 5 — Ezoic Access Now (post-AdSense, parallel)

**What:** AdSense wrapper + Mediation. 0 traffic minimum as of 2026.
**RPM uplift:** +30-60% over AdSense-alone via Ezoic's yield optimization.
**Setup friction:** Low. DNS or Cloudflare integration.
**Ongoing work:** Zero after setup.
**Payment gate:** Payout profile required — PAYMENT GATE prompt.
**Stacks with:** AdSense (intended design).
**Conflict:** **Mediavine Journey exclusivity (Layer 7)** requires atomic swap out of Ezoic AND AdSense when promoting.
**Share:** ~88% to publisher (best-in-class for wrapper networks).

### Layer 6 — Affiliate (Impact.com-first, NOT Amazon) (Week 2+, 1-2 programs per site)

**What:** Display ads often leave money on table for transactional intent. Add 1-2 topic-relevant affiliate programs via Impact.com.
**Why Impact not Amazon:** Amazon Associates commissions gutted to 1-4% (2025). Impact.com premium-brand network pays 20-30% per sale with 30-90 day cookies.
**Fleet avg revenue:** $149/1000 visitors (Impact-class programs).
**Setup friction:** Apply for individual programs (per-merchant). Publisher side is free.
**Ongoing work:** Zero after programs approved (affiliate links stable).
**Payment gate:** Payout setup — PAYMENT GATE prompt.
**Stacks with:** All ad layers. **Conflict:** None.
**Placement rule:** Affiliate links in-context only; never above-fold takeover; never confused with display ads (AdSense policy).

### Layer 7 — Mediavine Journey (when site crosses 1,000 sessions/mo) — **THE 2026 BIG CHANGE**

**What:** Mediavine's entry-tier ad network. **Minimum dropped 10,000 → 1,000 sessions on Jan 15, 2026.**
**RPM:** $12-19 baseline, up to $40 in premium niches (recipes, wellness). 2-5× AdSense+Ezoic equivalent at same traffic.
**Share:** Tiered 75-90% to publisher.
**Setup friction:** Application + site review (~5-10 business days). Atomic swap-out of all other display ads required.
**Ongoing work:** Zero after approval. Mediavine handles all ad ops.
**Payment gate:** Payout profile — PAYMENT GATE prompt.
**EXCLUSIVITY:** Mediavine requires exclusive display-ad relationship — atomic swap out of AdSense + Ezoic on approval. See I-37.
**Detection:** `mediavine-promotion-detector` scheduled task checks weekly across fleet; fires Clarity Card when any site crosses 1k sessions/mo.

### Layer 8 — TollBit (Month 6+, defer until fleet bot-traffic matures)

**What:** AI licensing marketplace. Revenue share when AI engines serve content from your site.
**Reality check:** ~20% of 7,000 publishers earn revenue. Rest earn $0.
**Commission:** TollBit takes 15-25%.
**Setup friction:** Apply at tollbit.com, legal review ~2 weeks, JSON-LD headers integration.
**Ongoing work:** Low after integration.
**Defer criteria:** Don't apply until fleet site has ≥5k AI-crawler crawls/day (not all sites qualify).

### Layer 9 — ProRata.ai Gist Answers (Month 6+, free widget)

**What:** Licensing platform with widget-based revenue.
**RPM:** ~$10 CPM floor.
**Share:** 50/50.
**Setup friction:** Free widget.
**Ongoing work:** Zero.
**Defer criteria:** Same as TollBit — Month 6+ once volume justifies integration overhead.

---

## Part 2 — Explicit skip list (DO NOT default-wire)

| Channel | Why skip |
|---|---|
| **Amazon Associates** | Commissions gutted to 1-4%; Impact.com pays 20-30% same traffic |
| **Taboola / Outbrain** | 10M pageviews/mo minimum; fleet is <1M |
| **Mediavine pre-1k sessions** | $10-30/mo ramp-up not worth exclusivity lock |
| **Setupad / Playwire / Raptive** | 50-100k sessions/mo minimums |
| **Newor Media Plus** | 50k minimum |
| **MSN / Apple News** | News-content-type-gated; fleet is reference/calculator |
| **GPT Store** | Median <$100/quarter; attention not converting |
| **Claude Apps** | No direct payout mechanism (as of 2026) |
| **Finance lead-gen** | Compliance overhead > fleet solo-founder capacity |
| **Data licensing (raw traffic data)** | Fleet too small; revisit Month 12+ |

---

## Part 3 — Per-site revenue stack lifecycle

### New site (Day 1-7)

- Layer 1 AdSense application submitted (awaiting)
- Layer 2 Cloudflare PPC toggled ON (if payment setup done)
- Layer 3 llms.txt + schema ACTIVE (from v19.4)
- Layer 4 Perplexity Publishers email sent

### Site at <1k sessions/mo (Week 2 - indefinite)

- Above 4 layers + Layer 5 Ezoic Access Now + Layer 6 Affiliate (1-2 programs)
- Target: 5 active layers

### Site crosses 1,000 sessions/mo

- `mediavine-promotion-detector` scheduled task fires Clarity Card
- Operator-gated atomic swap: remove Layer 1 AdSense code + Layer 5 Ezoic → add Layer 7 Mediavine Journey
- I-37 enforces atomicity (no double-network display ads)

### Site at 10k+ sessions/mo AND 5k+ bot crawls/day

- Revisit Layer 8 TollBit + Layer 9 ProRata
- Operator-gated signup

### Site at 50k+ sessions/mo

- Evaluate Mediavine standard (above Journey tier)
- Evaluate Raptive / Playwire migration

---

## Part 4 — Revenue sub-Oracle (feeds APS ranking)

Extends v17 Revenue Oracle with layer-coverage modulation:

```
revenue_layer_coverage = active_layers / recommended_layers_for_traffic_tier

revenue_weight_v19.5 = revenue_weight_v19.4 × (0.5 + 0.5 × revenue_layer_coverage)
```

Sites with full stack coverage get full Oracle weight. Sites missing layers get proportionally reduced weight — which means revenue-adjacent tasks on undermonetized sites rank HIGHER (to close the gap faster).

---

## Part 5 — @monetizer specialist (v19.5)

**Model:** Sonnet (balance speed + judgment).

**Trigger:** on every public-facing ship in Pro modes (parallel to @distributor and @craftsman). Does NOT fire on pure internal/infra changes.

**4-dimension scoring (0.0 — 1.0 each):**

```
LAYER COVERAGE        Does this site have ≥recommended layers for its traffic tier?
                      1.0 = full canonical stack (Parts 1 + 3 above)
                      0.5 = 50% coverage
                      0.0 = AdSense-only or missing AdSense

AD PLACEMENT          Density + viewability + I-23 compliance
                      1.0 = all placements optimal; no dark-pattern clicks
                      0.5 = placement works but missing above-fold / below-fold / inline
                      0.0 = density violates AdSense policy OR confusing placement

AFFILIATE FIT         Topic-relevant affiliate programs integrated
                      1.0 = 1-2 high-CPM programs (Impact.com or equivalent); non-Amazon
                      0.5 = Amazon-only (working but sub-optimal)
                      0.0 = no affiliate where transactional intent exists

BOT READINESS         Pay-Per-Crawl + TollBit readiness
                      1.0 = PPC enabled, TollBit applied when volume justifies
                      0.5 = PPC enabled, TollBit deferred appropriately
                      0.0 = PPC not enabled despite bot-crawl volume
```

**Output format:**

```
MONETIZATION FIT: [mean, 0.00-1.00]
  Layer Coverage:  [0.0] — [rationale]
  Ad Placement:    [0.0] — [rationale]
  Affiliate Fit:   [0.0] — [rationale]
  Bot Readiness:   [0.0] — [rationale]

VERDICT: PASS (≥0.5) | UNDER-MONETIZED (<0.5) | EXPERIMENTAL-OK (operator-tagged)
HIGHEST-LEVERAGE FIX: [the one layer that would move mean by >0.1]
MISSING LAYERS: [list from canonical stack]
```

**PASS** → log to MONETIZATION_STACK.md, proceed.
**UNDER-MONETIZED 🔴** → auto-fix in Pro modes (add missing code-level layer, emit Clarity Card for operator-gated activation); re-run once; if still under-monetized → BLOCK as `[👤]` handoff.

---

## Part 6 — State files (new in v19.5)

### `MONETIZATION_STACK.md` (append-on-change)

Per-site ledger of active/pending/blocked layers.

```
# MONETIZATION_STACK.md — [project-name]
# Schema: v1 (2026-04-21)
# Canonical stack: rules/revenue-maximizer.md

## Current Stack

| Layer | Name | Status | Activated | Projected $/mo | Actual $/mo | Notes |
|---|---|---|---|---:|---:|---|
| 1 | AdSense | pending_approval | 2026-04-20 | - | - | Applied; 2-14d wait |
| 2 | CF Pay-Per-Crawl | active | 2026-04-21 | $25 | - | Need 4w data |
| 3 | llms.txt + schema | active | 2026-04-15 | - | - | v19.4 wired |
| 4 | Perplexity Publishers | pending_contact | - | - | - | Email queued |
| 5 | Ezoic Access Now | not_started | - | - | - | After AdSense approval |
| 6 | Affiliate (Impact) | not_started | - | - | - | Pending Impact signup |
| 7 | Mediavine Journey | not_eligible | - | - | - | Sessions <1k/mo |
| 8 | TollBit | deferred_month_6 | - | - | - | - |
| 9 | ProRata | deferred_month_6 | - | - | - | - |

## Layer Activations (append-only)

| timestamp | layer | event | details |

## Swap History (atomic, I-37 enforced)

| timestamp | removed_layers | added_layer | reason |

## Corrections

(timestamp-anchored)
```

### `REVENUE_CALIBRATION.md` (append-only, I-39)

Monthly actuals per layer. Never retroactively edited.

```
# REVENUE_CALIBRATION.md — [project-name]
# Schema: v1 (2026-04-21)
# Append-only per I-39

## Monthly Revenue (append-only)

| month | adsense | ezoic | mediavine | ppc | tollbit | prorata | affiliate | perplexity | total | sessions | rpm_blended |

## Projection vs Actual

| month | layer | projected | actual | ratio | notes |

## Corrections

(timestamp-anchored; per rules/learn-from-data.md)
```

---

## Part 7 — Scheduled tasks (new in v19.5, 4 additions)

Budget impact: +4 fires/wk vs v19.4's 244/wk → **248/wk** (still under 50% Max 20x cap per v19.3).

1. **`revenue-stack-audit`** — weekly Tuesday 08:00 UTC. Per fleet site: read MONETIZATION_STACK.md, compute recommended layers for current traffic tier, flag gaps → `[👤]` Clarity Card for each missing layer.

2. **`mediavine-promotion-detector`** — weekly Wednesday 09:00 UTC. Per fleet site: check sessions/mo from FLEET_METRICS_DATA (Plausible share + GSC). If crossed 1,000 sessions/mo → emit **🔴 REQUIRED** Clarity Card for Mediavine Journey application.

3. **`cloudflare-ppc-revenue-pull`** — weekly Thursday 10:00 UTC. Per PPC-enabled zone: pull CF Pay-Per-Crawl API data for prior 7d. Append to REVENUE_CALIBRATION.md ## Monthly Revenue. Update BOT_TRAFFIC.md PPC-$-earned column.

4. **`affiliate-revenue-pull`** — weekly Friday 11:00 UTC. Per site with Impact.com / Skimlinks / program integrations: pull prior-7d revenue via API (operator-gated: API tokens in FLEET_METRICS_DATA/ at operator discretion). Append to REVENUE_CALIBRATION.md.

All 4 tasks are non-destructive read-pulls + state-file appends. No cross-project edits. No operator interruption unless Clarity Card fires.

---

## Part 8 — Invariants (I-37, I-38, I-39 drafted, unsigned)

### I-37 — Ad Network Exclusivity Lock

Mediavine Journey (and similar exclusive-relationship ad networks) require atomic swap. Brain cannot activate Mediavine while AdSense or Ezoic display ads are still serving; brain cannot leave legacy networks active when Mediavine approves. Swap must be atomic in single PR: remove old display-ad code + ads.txt entries + publisher IDs ← → add new network code + ads.txt + IDs. Violates → `INVARIANT VIOLATION: I-37 (ad network exclusivity broken)`.

Applies equally to any future exclusive ad network (Raptive, Playwire enterprise tier).

### I-38 — Affiliate Default Not Amazon

When adding affiliate links to fleet sites, brain MUST default to Impact.com / ShareASale / merchant-direct programs. Amazon Associates is explicitly deprioritized due to 1-4% commission rates (2025 gutting). Amazon may be added only if: (a) operator explicitly requests, OR (b) Impact + ShareASale have no program for the specific merchant, AND (c) the task is tagged `[amazon-only]`. Violates → `INVARIANT VIOLATION: I-38 (amazon-default re-enabled)`.

### I-39 — Revenue Calibration Append-Only

`REVENUE_CALIBRATION.md` is append-only. Monthly revenue rows cannot be deleted or retroactively edited. Corrections go through dedicated `## Corrections` section with `corrects: <original-timestamp>` field (same pattern as I-18, I-22, I-24, I-30). Applies to all fleet projects' revenue logs. Violates → `INVARIANT VIOLATION: I-39 (revenue calibration append-only broken)`.

Signed-commit required per I-5: `INVARIANT-CHANGE: signed-by [name] — adopt I-37 I-38 I-39 (revenue maximizer, v19.5)` before `.claude/state/INVARIANT_HASH` updates and Evolution Engine recognizes them as hash-locked.

---

## Part 9 — The short version

**For every new fleet site:**

1. Apply AdSense Day 7
2. Toggle Cloudflare Pay-Per-Crawl Day 1 (zone setting; payment setup operator-gated)
3. Ship llms.txt + schema.org Day 1 (v19.4 autowires)
4. Email Perplexity Publishers Day 7
5. Add Ezoic Access Now post-AdSense (parallel)
6. Add 1-2 Impact.com affiliate programs Week 2
7. Watch for 1,000 sessions/mo threshold → atomic Mediavine Journey swap
8. Defer TollBit + ProRata to Month 6+

**For the existing fleet (operator action this week):**

- Any site already at 1,000 sessions/mo → **Mediavine Journey migration is the highest-$ action available** (dropped threshold Jan 15, 2026)
- Any site without Cloudflare PPC enabled → flip the toggle (free money from existing bot traffic)
- Any site without Perplexity Publishers contact → send the email

**The discipline:** every ship passes @monetizer review. Every revenue action logs to REVENUE_CALIBRATION.md. Every gap between canonical stack and actual coverage queues a Clarity Card. Revenue compounds because the stack compounds.
