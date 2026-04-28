# Handoff Clarity — every operator-action item uses the Clarity Card format

**The rule**: every `[👤]` handoff and every session-end "what you should do" item MUST be written as a Clarity Card. Terse command blobs without context are a trust-erosion pattern and are forbidden.

## Why this rule exists

2026-04-17: operator screenshot + directive verbatim: _"super poor explanation what i should do... solve this problem acepilot v17.4"_ — the failing output was a "Recommended" section with two command-line blobs (`git push`, `gh pr create`) and zero context: no explanation of what the action does, why it matters, how long it takes, what to expect, or what to do if it fails.

That is not "recommended" — that's a command dump. Operators reading it have to reverse-engineer the intent, check prerequisites, guess at expected output, and debug blind when something goes wrong.

Trust compounds negatively when every session-end handoff forces the operator to do the specialist's job of translating commands into actions.

## The Clarity Card format (6 slots, every slot mandatory)

```
[emoji] [Plain-language action title — imperative, ≤10 words]

WHAT: [one sentence in plain English — no jargon — what this action accomplishes]
WHY:  [the benefit of doing it + the cost of skipping it, both stated plainly]
TIME: [actual clock time, e.g. "~3 minutes" — not "quick" or "short"]

HOW:
  1. [Plain instruction for step 1]:
     `exact command or click path`
     → expected: [what you'll actually see on success]
  2. [Step 2]:
     ...
  (Every step has: instruction → command/path → expected outcome)

VERIFY: [one-line post-action check — a command to run or a thing to look for]
        `command` → expected: ...

IF STUCK: [2-3 most likely failure modes + their fallback paths]
```

## Enforcement — what is never acceptable

1. **Bare command blobs.** If the operator sees only code fences with zero surrounding explanation, that's a failure. Refactor.
2. **"Follow the standard flow" / "you know what to do" language.** Never assume operator knows internal AcePilot conventions.
3. **Vague time estimates.** "Quick", "short", "a bit" — replace with real minutes.
4. **Missing VERIFY.** Every action needs a check. "Hope it worked" is not a verification.
5. **Missing IF STUCK.** At least the top 2 failure modes, stated explicitly.
6. **Nested technical dependencies not flagged.** If step 2 requires `gh` CLI installed, the card must say so AND give the non-`gh` alternative.
7. **Jargon in WHAT/WHY.** Use the operator's language, not AcePilot internals. No "cwd gate", no "APS", no "MAP-Elites". Translate.

## Priority color code (consistent across all handoffs)

- 🔴 **REQUIRED** — blocks measurable outcome. Do this before anything else.
- 🟡 **RECOMMENDED** — makes something better that can wait. Not blocking.
- 🟢 **OPTIONAL** — nice-to-have, explicitly skippable.

Every Clarity Card opens with one of these three emojis + priority word.

## Example — before (failure mode) vs. after (Clarity Card)

### ❌ WRONG (the "super poor explanation" failure pattern)

```
🟡 Recommended
```bash
git push -u origin claude/wonderful-hamilton-e24aa3
gh pr create --title "..." --body "..."
```
```

### ✅ RIGHT (Clarity Card)

```
🟡 RECOMMENDED — Push your work so other machines can auto-install v17.3

WHAT: Send the 4 commits on this branch to GitHub, open a pull request,
      and merge to `main` so every other machine running `git pull` on
      this repo auto-installs v17.3.
WHY:  Without this, v17.3 only exists on this laptop. Other machines
      (including scheduled fleet heartbeats) still load v17.2 or older
      and don't get Distribution Oracle, @distributor, reach mode, or
      payment-only gating. Cost of skipping: fleet drift.
TIME: ~3 minutes.

HOW:
  1. Push the branch to GitHub:
     `git push -u origin claude/wonderful-hamilton-e24aa3`
     → expected: a few lines ending with "To github.com:…" + a
       "Create pull request for claude/wonderful-hamilton-e24aa3" URL.
       Copy that URL.
  2. Open the PR:
     Paste the URL in your browser (works without any CLI tools).
     → expected: GitHub's "Comparing changes" page, ready to open a PR.
     Click "Create pull request".
  3. Merge:
     Wait for CI (green checks). Click "Squash and merge" → "Confirm squash and merge".
     → expected: branch status shows "Merged". Commits land on main.

VERIFY:
  `git fetch && git log origin/main --oneline -5`
  → your 4 commits (cb17ccb, 81c98ea, 6fe32a5, [latest]) should appear in the last 5.

IF STUCK:
  - Push rejected ("non-fast-forward"): run `git fetch && git rebase origin/main`
    then retry the push. Your branch is behind main.
  - Browser doesn't open GitHub: the push step still printed the URL. Copy+paste it.
  - CI fails: read the red check; if it's unrelated (e.g. flaky build), re-run. If
    it's a real issue, revert or add a fix commit. Don't merge red.
  - You prefer `gh` CLI: `gh pr create --fill` auto-fills title/body from commits.
```

Same information density, but every line is operator-facing clarity.

## Session-end handoff checklist (what the brain must verify before emitting)

Before ending a session and emitting the final summary, run this checklist on every operator-action item:

- [ ] Has emoji + priority word (🔴/🟡/🟢)
- [ ] WHAT stated in ≤2 plain sentences, zero internal jargon
- [ ] WHY states both benefit and cost-of-skipping
- [ ] TIME is a real clock estimate (minutes, not adjectives)
- [ ] HOW steps are numbered; each step has a command/path AND expected outcome
- [ ] VERIFY has a specific post-action check
- [ ] IF STUCK covers at least 2 likely failure modes
- [ ] Any tool dependency (gh, brew, docker, etc.) is flagged with a non-tool alternative

If any box is unchecked, rewrite. Do not ship the handoff.

## Integration with existing rules

- **status-report-honesty.md** — status reports already lead with 🔴/🟡/🟢. This rule specifies how each item inside those sections must be written when it requires operator action.
- **forced-data-compound.md** — every emitted Clarity Card logs a row to `ANALYTICS.md ## Handoff Log` so CSIL can audit clarity drift over time.
- **acepilot-handoff.md** — defines WHEN to create a handoff. This rule defines HOW to write it.
- **acepilot-tasks.md** — `/acepilot tasks` renders each `[👤]` task using the Clarity Card format.
- **acepilot-guide-mode.md** — `/acepilot guide` expands each card into an even more verbose walkthrough for operators who want hand-holding.

## Invariant I-27

See `rules/evolution-invariants.md` for the formal lock-in. In short: session-end emissions that miss any Clarity Card slot are rejected. Mutations proposing to weaken the 6-slot requirement are rejected with log `INVARIANT VIOLATION: I-27 (handoff clarity weakened)`.

## The root principle

Operator time is the single most expensive resource in the system. Every minute the operator spends decoding a terse handoff is a minute not spent on revenue. A Clarity Card is marginally more expensive to write once and saves the operator repeatedly. The math favors clarity.

If you're tempted to skip a slot — "it's obvious", "they know this" — reread this rule. It's never obvious. Write the card.
