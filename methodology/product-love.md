# Product Love — what "great" means operationally (v17.2)

This file answers the question the operator asked when v17.2 was commissioned:
_"most important: making GREAT PRODUCTS. great products, products that people love and make them come back as much as possible to use it. WELL Balanced with everything else."_

It is a **design principle** and a **safety document**. The Retention Oracle (acepilot-retention-oracle.md) and @craftsman specialist (acepilot-craftsman.md) enforce this operationally. This file is the philosophy they inherit from.

## The operator's definition of "great"

Not "technically correct." Not "visually compliant." Not "revenue-positive in week 1."

**Great = people love it enough to come back, repeatedly, without prompting.**

That is the one true north. All five dimensions in the Love Score rubric are proxies for this one signal: does the user want to come back?

## Why "well balanced" matters

v17.1 optimized for revenue via the Revenue Oracle. This was correct, but incomplete — the Oracle weighting could let short-term conversion hacks outrank durable quality. The operator noticed this risk.

v17.2 answers with: **paired Oracles, both capped, multiplied into APS.** Neither dominates. A task that makes more money this week but fewer users want to come back next month is multiplicatively reduced, not boosted. A task that spikes retention with no immediate revenue still ranks well. The cap ensures neither can unilaterally win ranking.

This is balance. It is not "50/50" — it is "both floors must hold." Revenue below a floor = operator unpaid, project dies. Retention below a floor = no compounding, every week starts from zero, project needs growth hacks to stand still.

## What drives retention (the causal chain)

Retention is the measurable outcome. But retention doesn't happen by itself. It compounds from a chain of earlier signals:

```
Useful thing exists   →   Person tries it   →   Person returns   →   Person refers
    (problem-fit)          (first-session          (habit forms)        (distribution)
                             delight)
```

Each step has a quality requirement:

1. **Useful** — the thing has to solve a real problem better than alternatives. Not a want-to-have. A need.
2. **Delight in first session** — the user has to feel "oh, this was thought about." If the first session is bland, they don't return regardless of later quality.
3. **Reliable on return** — the second time they open it, it has to still work. Broken = churned.
4. **Clear enough to re-explain** — for a user to refer someone, they need a one-line pitch. If they can't write that pitch themselves, they can't refer.
5. **Unique enough to matter** — if the user could swap it for any alternative, they'll swap it when a new alternative appears.

@craftsman's 5 dimensions map directly to this chain. They're not arbitrary. Missing any one breaks the chain.

## Love is not a feeling, it's a signal

A user "loves" a product when:

- They open it unprompted (no notification needed)
- They recommend it in conversation without being asked
- They tolerate friction others would churn on, because the payoff is worth it
- They feel momentary care when interacting (the opposite of generic)
- They describe it with a specific noun phrase, not a generic category

Brains can't measure feelings directly. They can measure the return signal — `returning_session_d7`, `returning_session_d30` — and use that as the honest proxy for the felt signal.

This is why Retention Oracle is the mechanism, not "Love Oracle." Returns are countable; love is inferred.

## What AcePilot should NOT do to drive retention

Dark patterns spike returns for 1-3 weeks before they accelerate churn. They are forbidden:

- **Fake scarcity.** "Only 2 left!" when inventory is digital. Don't.
- **Manipulative confirmshaming.** "No thanks, I hate saving money." Don't.
- **Disabling obvious unsubscribe / cancel paths.** Don't.
- **Hijacking notifications for re-engagement instead of real value.** Don't.
- **Trial gotchas** (auto-charge without clear disclosure, hidden billing cadence). Don't.
- **Pay-to-escape spam.** Don't.

Retention Oracle's `dark_pattern_anything × -1.00` archetype hard-rejects these, and I-23 makes that rejection immutable. If a mutation tries to soften dark-pattern penalty, the Evolution Engine halts.

## The craft/revenue balance under different project states

| Project state | Recommended mode | Why |
|---|---|---|
| New product, zero users | `god` / `ship` | Acquisition is the gate; quality matters but retention signal doesn't exist yet |
| 100+ weekly active users | `god` with @craftsman on ships | Revenue focus, but quality enforced |
| Retention drop detected in CSIL | `craft` for 1-2 sessions | Fix the cliff before adding more |
| Established product with stable retention | Alternate `god` + `craft` | Fresh features + polish |
| Pre-launch polish sprint | `craft` | Operator explicitly choosing depth over breadth |
| Fleet sweep across 10+ projects | `god --loop` or `aceo sweep` | Breadth required; @craftsman still fires on public ships |
| Overnight / weekend unattended | `sovereign auto` with task bias toward retention-positive archetypes | Balanced by default |

The operator can tag a session with `[craft-biased]` or `[revenue-biased]` in the focus directive to nudge weighting without fully switching modes.

## The wealth-desire.md connection

`rules/wealth-desire.md` already argues that compounding > linearity, LTV > short-term conversion, leverage > extraction. v17.2's Retention Oracle + @craftsman are the operational tools that enforce those principles at the per-task ranking level. This file is the design rationale; wealth-desire.md is the business philosophy. They're consistent.

The wealthiest operators build products people come back to for decades. The wealthiest AcePilot fleet will be the one that does the same. That's the bet.

## When to violate this rule

Never in a mutation. Never in evolution cycles. Never silently.

The operator can ship slop if they want, by explicitly tagging `[experimental]` or `[thin-content-acceptable]` in the chat directive. That's operator accountability — the brain defers. Every such ship gets logged with `exp_bypass: true` in QUALITY.md so the operator can audit their own pattern over time.

If the operator finds they're tagging `[experimental]` on most ships, CSIL will flag it as drift, and the brain will propose a conversation about whether the Love floor is calibrated right. That conversation goes through Evolution Engine normally.

## The root principle

Great products are the only durable revenue source.

Ads, acquisition hacks, growth loops — these amplify whatever product exists. A great product amplified = compounding wealth. A mediocre product amplified = burned marketing budget + churned users + reputation decay.

AcePilot's job is to make great products. Revenue is how we know we succeeded.
