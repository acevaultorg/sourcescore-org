# Learn from data — every projection must be calibrated against actuals (v1.0, 2026-04-17)

**Operator directive 2026-04-17:** *"important: you should learn from data"*.

Every projection AcePilot makes (Revenue Oracle, Retention Oracle, Distribution Oracle, specialist precision, archetype multipliers, playbook expected-value, ETA estimates, cycle-time estimates) MUST be logged against the actual observed outcome and the heuristic MUST update in the direction of the data. Projections that never calibrate are not projections — they are fabrications with confidence theater attached. This rule makes calibration binding.

## The calibration loop (universal pattern)

For every predictive claim, three things must happen:

1. **Project** at decision time. Log `(projection, timestamp, hypothesis, confidence, source_heuristic_version)` to the relevant state file.
2. **Observe** at measurement time. Log `(actual, measurement_timestamp, notes)` paired with the projection row.
3. **Update** the underlying heuristic using the accumulated projection-vs-actual delta.

Steps 1 and 2 are logging — append-only, no edits. Step 3 is the learning — bounded adjustment of the heuristic's parameters.

**If any one of the three is skipped, the claim degrades to "vibe-based" and is flagged in CSIL.**

## What this binds

Everywhere in AcePilot that produces a number or a category label:

### Oracles (three, all calibrating)

- **Revenue Oracle** (`ORACLE.md`) — per-task `$/week` projection. Calibrate at 7d + 30d post-ship vs `GROWTH_ANALYTICS.md ## Ship Impact`. Adjust archetype multipliers when 10+ same-archetype entries accumulate.
- **Retention Oracle** (`RETENTION.md`) — per-task Δ return-rate projection. Calibrate at 7d + 30d post-ship against `GROWTH_ANALYTICS.md ## Monetization Events` (`returning_session_d7`, `returning_session_d30`). Adjust per archetype.
- **Distribution Oracle** (`DISTRIBUTION.md`) — per-task Δ weekly-organic-traffic projection. Calibrate at 7d + 28d post-ship against GSC + Vercel Analytics / Plausible. Adjust per archetype × channel × domain-authority.

### Specialists (six + three)

All specialist dispatches log precision. `@reviewer`, `@researcher`, `@designer`, `@strategist`, `@security`, `@architect`, `@craftsman`, `@distributor`, `@deploy-validator`.

- Each dispatch outputs findings with severity (🔴/🟡/🟢)
- Operator + reviewer later marks findings as **actionable** (true positive) or **noise** (false positive)
- Precision = actionable / (actionable + noise)
- `<30%` precision over ≥20 calls → CSIL proposal to reduce dispatch weight for that specialist on that archetype

### Tier + cycle-time estimates

Every task gets an estimated tier (Micro / Quick / Standard / Complex) and an estimated cycle time. At task end, actual cycle time is recorded. After 20 entries per tier, the tier bucketing is recalibrated (a task that consistently takes 4× its "Quick" estimate is mis-classified).

### Playbooks

Every playbook replay logs expected EV (from original capture) vs actual EV 7d post-replay. After 5 replays, the playbook either:
- Graduates (actual EV ≥ 80% of expected across 5 replays) → fleet-tier (I-14 promotes)
- Forks (actual EV diverges by archetype) → split into variants
- Archives (actual EV <30% of expected over 5 replays) → removed from replay pool

### Confidence gates

Every AUTO / PLAN / ASK decision logs predicted outcome vs actual outcome. Systematic over-prediction (e.g., the brain repeatedly says "undo in <60s" and the undo takes 10 min) triggers a threshold adjustment.

### Archetype labels

When the brain tags a task with an archetype (e.g., `SEO_page_addition`, `core_loop_improvement`), @distributor verifies at ship time whether the claimed archetype matches what shipped. Mismatch rate over the last 20 ships feeds CSIL check #11.

## The two update paths

### Path A: Automatic per-ship calibration (every ship)

After each ship with a projection:
1. At ship time: verify state file has projection row
2. At `now + 7d`: background calibration task reads actual, appends to `## Calibration` section
3. At `now + 30d`: final actual appended

No prompt to operator. No additional action required. All projections that survived past their measurement window update automatically.

### Path B: Periodic heuristic adjustment (CSIL audits every 10 cycles)

CSIL check #6 (Oracle drift) already exists: if mean projection-error >50% over last 10 → archetype multiplier recalibration proposed. v17.3 extends this to all three Oracles + specialist precision + tier estimates.

Adjustments are bounded per cycle:
- Archetype multipliers: ±50% per adjustment (prevents oscillation)
- Specialist dispatch weight: ±20% per adjustment
- Tier thresholds: ±30% per adjustment

The bounds prevent single-cycle catastrophic swings when a small sample misrepresents the signal. Over many cycles, the heuristic converges.

## What this is NOT

This is not:
- **Machine learning in the training-loop sense** — no gradient descent, no backprop, no embeddings. The heuristics are deterministic lookup tables; the adjustment is arithmetic.
- **LLM-based evaluation** — no sub-agent "judging" quality subjectively. Calibration is against hard signals (revenue ledger, session counts from analytics, return rates from events).
- **A pretext to re-run old ships** — historical logs are append-only. Corrections go through `## Corrections` sections; the original log entry is preserved.

This IS:
- **A discipline** that ensures every confidence number the brain emits is tied to a falsifiable observation.
- **A compounding advantage** — the longer the fleet runs, the more accurate the heuristics become. Year 2 projections should be materially more accurate than Year 1.
- **A dishonesty guard** — the brain cannot project $X/wk forever without being held against actuals. Projections that never check themselves decay into pretense.

## Cross-fleet learning (the compounding layer)

Beyond per-project calibration, there's a fleet-wide learning layer:

### Fleet-level archetype multipliers

`~/.claude/fleet/FLEET_CALIBRATION.md` (to be created by the first session that has enough cross-project data):
- Aggregated archetype multipliers across all active fleet projects
- Credibility-weighted: each project's local multiplier feeds the global mean proportional to the project's sample size
- When a new project boots (Day 1), it inherits the fleet-level multipliers as its cold-start

This means Fermentcalc Day 1 Oracle projections benefit from Sourdough's calibrated multipliers. Conversionbench inherits the average of both. Every new site in the fleet starts warmer than the last.

### Shared failure-mode catalog

`~/.claude/fleet/FLEET_PATTERNS.md` (to be created):
- When a specific failure mode happens twice across the fleet (e.g., "Vercel remote build fails silently on this team"), it's upgraded from a per-project PATTERNS.md entry to a fleet-level entry with a documented workaround
- Per-project sessions check this file first at ABSORB step 13b (Skill Graph already reads fleet-level skills; this is a parallel)

### Archetype mismatch patterns

When @distributor flags an archetype mismatch (claimed `core_loop_improvement`, shipped `cleanup_refactor`), CSIL logs the mismatch. After 3 mismatches of the same flavor → a new `rules/archetype-[pattern].md` file is auto-proposed. This makes archetype labeling itself self-correcting.

## Enforcement

- **ABSORB step 13c/d/e** (Oracle Primes for revenue, retention, distribution) MUST read the last 20 calibration rows, not just the projections. Session that skips the calibration read fails soft.
- **CSIL audit** (every 10 cycles in loop modes) explicitly checks that calibration rows exist for projections that have aged past their 7d/30d windows. If projections are aging without calibration, CSIL flags the project as "drifting" and proposes a calibration-backfill task.
- **Session end handoff** MUST note which projections were added this session and which were calibrated. Session Handoff template extended to include a `## Calibration Activity` line.

## Why this rule exists

Every prediction that never gets checked is noise compounding over time. The operator has an AcePilot running 24/7; if AcePilot says "$45/wk" and that number never meets reality, the operator has no way to know whether AcePilot is accurate or delusional. After 100 such unmeasured projections, the entire ranking system is built on vibes.

This rule forces honesty at the numerical level. Over the course of months, the Oracles become specific to the operator's fleet, the operator's niche, the operator's SEO reality. That specificity IS the compounding advantage — the reason a 3-year-old AcePilot is more valuable than a 3-day-old one.

## The short version

**If you projected it, measure it. If you measured it, adjust for it. If you can't measure it, flag it as vibe-based.**

Every heuristic in the brain must either be backed by observations or honestly marked as a cold-start default. Over time the cold-starts become warm, and the warm starts become calibrated truth specific to this operator.
