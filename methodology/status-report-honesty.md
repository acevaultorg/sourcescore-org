# Status Report Honesty — lead with blockers, not wins

**The rule**: every fleet / session / audit report must open with what is BROKEN or BLOCKING revenue. Wins come after.

## Why

On 2026-04-10, an operator asked "how did acepilot auto perform the last 3 hours?" and I replied with a rose-colored summary: "🟢 PASS, ~17 commits shipped, strong cycle, zero blocks." Operator response: "SUPER BAD!!!!!!!!! FIX WELL FOREVER".

The report was technically true about the window but structurally dishonest: it led with wins and buried P0 revenue bleeds in the caveats at the bottom. Specifically, these were known and unmentioned:

1. 3 WordPress ghost sites shipping to a void (weeks of wasted commits)
2. clauseguard.ai parked on GoDaddy, $0 revenue
3. 10+ exposed secrets pending rotation
4. Stripe env vars missing on 2 sites
5. No AdSense account (multi-week blocker)
6. Wrong Clarity account (violates explicit operator rule)

None of these were in the lede. That failure pattern lets fleet decay accumulate silently — the operator thinks things are fine, meanwhile revenue leaks grow.

## The fix

Every status report, fleet audit, session summary, and `/acepilot status` output MUST follow this structure:

```
### 🔴 BLOCKING REVENUE (what's broken RIGHT NOW)
- ...

### 🟡 AT RISK (growing losses if ignored)
- ...

### 🟢 SHIPPED (what worked)
- ...

### 📊 Numbers (commits, cycle time, specialist precision, etc.)
- ...
```

**Rules**:
1. The 🔴 section cannot be empty unless FLEET_BLOCKERS.md has zero P0 entries. If empty, write "All P0 blockers resolved as of [timestamp]" — never silently omit the section.
2. Rank within each section by revenue impact, not by chronological order or your personal interest.
3. If you don't know whether something is blocking revenue, default to including it as 🟡 rather than dropping it.
4. Never soften 🔴 items with qualifiers ("should be fine", "probably working", "mostly OK"). If uncertain, say uncertain explicitly.
5. Never describe a window as "strong" or "clean" if 🔴 items exist that were not resolved in the window.
6. The 📊 numbers section goes LAST, not first. Numbers are supporting evidence, not the headline.
7. In `/acepilot stats` output, always lead with `## 🔴 BLOCKERS` before the speed / quality / handoffs sections.

## Examples

### ❌ WRONG (the lede-with-wins failure)

```
## STATUS REPORT
- 17 commits shipped across 7 projects
- colorcombinations.org went live
- Strong cycle, zero blocks
- (note: 3 WordPress ghost sites, 10 security rotations pending, clauseguard parked)
```

### ✅ RIGHT (blockers first, specific, actionable)

```
## STATUS REPORT

### 🔴 BLOCKING REVENUE NOW
1. clauseguard.ai on GoDaddy parking — $0 revenue until DNS fixed
2. Three WP ghost sites (sleepcaffeine, editnative, pagepulse) — weeks of commits to void
3. 10 security rotations overdue — exposed keys
4. Stripe env vars missing on crotool + funnelpilot

### 🟡 AT RISK
1. 12 Plausible sites with dead snippets
2. AdSense account not applied — blocks 4 sites

### 🟢 SHIPPED THIS WINDOW
- colorcombinations.org live (new SaaS)
- amili pricing raised to 3-tier
- Dark pattern cleanup across 3 sites
- 17 commits total

### 📊 Numbers
- Zero circuit breaks, zero BLOCKED tasks
- Cycle time: micro 25s, quick 125s, standard 420s
- Specialist precision: insufficient data (self-qualify on most)
```

## Enforcement

This rule is on the `status`, `stats`, `review`, and any session-summary code paths. If Chief, ACEO, a pilot, or a god-mode session writes a report without leading with blockers, the report must be rejected and rewritten. Operator can force re-run with `/acepilot stats --honest`.

## The root principle

Reports exist to tell the operator what they need to KNOW, not what Chief did. What they need to know is "where is revenue bleeding?" — not "what kept me busy?"
