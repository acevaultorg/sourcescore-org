# Concept Finder methodology — the full stack (v2.1.1, 2026-04-18)

**Operator directives:** 2026-04-17 *"keep training yourself to become better concept finder"* · 2026-04-18 *"improve the concept finder model, start using versioning"* · 2026-04-18 *"keep improving the concept finder model"* · 2026-04-18 *"make best of best top 100"*.

This rule codifies everything the fleet has learned about finding, scoring, and picking concepts for silent-SEO ad-revenue sites. It's calibrated against real ships and supersedes all ad-hoc concept-scoring done in prior sessions.

This is a living document under **semantic versioning**. Major bumps (vX.0) add scoring layers or change the core flow. Minor bumps (v2.X) add archetypes, refine multipliers, or capture anti-patterns. Every ship that produces measurable outcomes updates this rule via the calibration log + a minor-version bump if the multiplier tables move.

---

## Changelog

### v2.1.1 — 2026-04-18 — The calibration-bias honesty patch

Patch-only bump (title line + changelog only per § Version sync surfaces semver rules). No content changes to layers, formula, or anti-patterns.

- **Documented heuristic calibration bias in bulk APS ranking** — applied v2.1 formula to 100 concepts in `BEST_OF_BEST_TOP100_v2.1.md` and found systematic bias of ~20-30% over-estimation on the absolute APS values. RELATIVE ORDERING largely preserved (HoldLens still #1, Mortgage Calc still bottom 4); absolute scores were optimistic. Bias traced to inconsistent stacking_bonus application (used 1.4 in ranking when methodology worked example used 1.25 for same concept — conversionbench is the documented case: 6 in worked example vs 25 in ranking).
- **Fix shipped at `BEST_OF_BEST_TOP100_v2.1.md ## Heuristic Calibration Caveat`** — honest ±25% uncertainty disclaimer + operator guidance to trust ORDER over absolute VALUES.
- **No methodology content changed** — v2.1 formula + layers + anti-patterns unchanged. This patch is documentation + transparency, not a behavior change.
- **v2.2 will be triggered by real-data calibration.** Once holdlens Cloudflare analytics share or Fermentcalc Week-4 audit arrives, the first real actual vs projected delta will drive a methodology-integrity recalibration.
- **Integrity precedent set:** per AP-11 anti-pattern, self-catching an inconsistency mid-session and documenting it openly beats retconning the file. This is the calibration discipline the `rules/learn-from-data.md` binding rule explicitly enforces.

### v2.1 — 2026-04-18 — The Scoring + Moat layer (minor bump, additive)
- **Headline addition: Composite Scoring Formula (Concept APS)** — the methodology now outputs a **deterministic 0-100 numeric score** per concept, not just qualitative 7-layer assessments. Enables programmatic comparison across the 10,000+ concept dataset in VAULT00. Calibrated against holdlens (≈46), fermentcalc (≈21), conversionbench (≈6) — ranking matches observed fleet reality. See § Composite Scoring Formula.
- **Layer 1 extended** — added **Moat Test** (4 questions validating copy-resistance). HoldLens passes 4/4; sites that fail ≥2 are commodity SERPs that get eaten when a bigger-DR publisher notices.
- **Layer 3 extended** — added **AI-Overview Risk Test** (5-dimension structured assessment: query-type / answer-extractability / synthesis-required / dataset-depth / freshness-window). Previously mentioned SGE risk was prose-level; now it's a scored dimension that feeds into Concept APS.
- **Layer 7 extended** — added **LLM-Citation Design Pattern** — Aleyda Solis's 10-characteristic checklist codified as first-class design guidance (not just retrospective audit). HoldLens scored 8/10 as retrospective; methodology now DESIGNS for 10/10 from Day 1.
- **New anti-pattern AP-11 — Score-without-sources** — don't compute Concept APS against empty Layer 1-7 slots; missing inputs default to 0, which over-penalizes real concepts. If a layer hasn't been evaluated, write `pending` and skip scoring, don't fabricate a number.
- **All v2.0 content preserved** — 7 layers unchanged, Finite-Public-Dataset Test unchanged, Archetype-Stack Detector unchanged, Build-Effort Tier unchanged, Day-1 Analytics Mandate unchanged. v2.1 is pure additive.

### v2.0 — 2026-04-18 — The HoldLens calibration
- **Introduced explicit semantic versioning** — every change is now tagged vX.Y with changelog entry + version-sync surface update (see § Version sync surfaces at end).
- **Layer 1 extended** — added **Finite-Public-Dataset Test** (5 questions that pre-qualify a concept for Easy-tier build effort) + **Archetype-Stack Detector** (concepts that hit 3+ high-multiplier distribution archetypes on one page compound multiplicatively, not additively).
- **Layer 5 extended** — added **Archetype-Stacking Bonus** formula: concepts pre-designed to hit ≥3 archetypes per page get a ×1.5 projection multiplier on top of the per-archetype weights. Holdlens.com stacked ~10 archetypes on one site; Fermentcalc + Conversionbench should design for stacks of ≥5.
- **Layer 6 extended** — added **Build-Effort Tier calibration** (operator-calibrated 2026-04-18): Easy = 2-3 days (finite public dataset + static export + no DB + no auth); Medium = 8-12 days (ETL + DB + auth); Hard = 30-60 days (multi-tenant SaaS / ML / YMYL compliance). Fleet default = Easy.
- **Layer 7 extended** — added **Day-1 Analytics Mandate**: every fleet ship wires GA4 + Plausible + Cloudflare Web Analytics + GSC + AdSense + IndexNow on Day 1-2, not Day 6. Holdlens proved the compound value; projections can't self-calibrate without Day-1 data capture.
- **Calibration log** — seeded with first real reference point: **holdlens.com** (shipped 2026-04-08 through 2026-04-17, 40+ version cycles, ~10 simultaneous archetype stack). First non-theoretical entry in the multiplier table.
- **New anti-patterns**: AP-8 "One-archetype-per-page" (shipping 4 thin pages each with 1 archetype beats the alternative of stacking 4 archetypes on 1 page — *fleet-proven wrong by holdlens*) · AP-9 "Day-6 analytics wiring" (deferring analytics to the end means the ship can't self-calibrate its own projections) · AP-10 "Content generation over dataset curation" (infinite-content concepts fail; finite-public-dataset concepts ship in days).
- **New archetype rows in Layer 5 multiplier reference**: `indexnow_autoping_every_deploy` ×+40 (v19.1 Acquisition Engine) · `sharecard_per_result_canvas` ×+65 (per-result branded PNG + pre-composed tweet, proven by holdlens v0.28 SignalShareCard) · `finite_public_dataset_programmatic` ×+75 (upgraded from +55 when the dataset is genuinely finite + public + unique-per-URL).

### v1.0 — 2026-04-17 — The Codification
- Initial codification of the 7-layer evaluation stack.
- 7 anti-patterns captured (AP-1 through AP-7) from the Fermentcalc / Conversionbench / Sourdough decision sessions.
- 3-minute rapid-screen for mid-conversation concept throws.
- Cold-start baseline projections for 4 fleet concepts (readinglist, sourdoughhydration, fermentcalc, conversionbench).
- Calibration log template ready but empty (waiting for first ship actuals).

---

## What is "a concept finder"

A concept finder answers the question: **given a near-infinite space of possible websites, which one should we build this quarter?**

Inputs the operator brings:
- Constraints (silent SEO only, 100% ad revenue, solo-founder time budget, no dark patterns)
- Domain (broad — "food", "dev tools", "CRO", "education")
- Existing fleet state (which niches are taken, what's peaked, what's counter-seasonal)
- Risk appetite (defensive, balanced, aggressive)

Outputs the finder produces:
- A ranked shortlist of concepts, each with a projected Y1/Y2/Y3 revenue envelope
- A recommended domain per concept (fleet-aware, availability-verified)
- A decision tree: build-now / build-next / park / skip
- A confidence interval — this is as much a honest-uncertainty artifact as a ranking

---

## The 7-layer evaluation stack

Every concept that gets more than 30 seconds of attention goes through this stack in order. Skipping a layer means shipping a wrong pick.

### Layer 1 — Concept archetype classification

Every concept is one of these seven archetypes. Archetype caps the ceiling + floor + RPM tier before scoring begins.

| Archetype | Typical URL pattern | Example | Ceiling | RPM tier |
|---|---|---|---|---|
| **Calculator** | Input → output utility | Sourdough Hydration, Brine Calc | high ceiling, moderate floor | Food $18-28, Business $25-45 |
| **Database** | Queryable reference | School Reading List, Sous Vide DB | high ceiling, low floor (slow ramp) | Education $10-18, Food $18-28 |
| **Comparator** | Side-by-side decision aid | Flour Compare, Industry-vs-Industry | moderate ceiling, moderate floor | Varies by vertical |
| **Benchmark** | Percentile or standard | CR Benchmark by Vertical | moderate ceiling, slow ramp | Business $25-45 (highest) |
| **Guide/Reference** | Long-form how-to | Fermentation Safety | low ceiling, very slow ramp | RPM tier of vertical |
| **Aggregator** | Curated lists | Best X of Y | very low ceiling, affiliate temptation | DANGER — often fails HCU |
| **Generator** | Outputs artifact | Color Palette Generator | moderate ceiling, AI Overview risk | Design $10-18 |

**Hard-reject archetypes** (I-26 parallel — filtered before scoring):
- Aggregator sites without unique data (pure listicles)
- Generator sites trivially reproducible by ChatGPT (AI Overviews will eat them)
- YMYL sites without credential trust (medical advice, legal advice, financial advice)
- Cloaking / doorway / keyword-stuffing patterns
- Anything in `~/.claude/rules/adsense-compliance.md` prohibited list

#### Finite-Public-Dataset Test (v2.0 NEW)

Answer all 5 yes → concept is Easy-tier buildable + Archetype-Stack-eligible:

1. Is the dataset **public** (no licensing, no API approval gate, no PII)?
2. Is it **finite** (enumerable — "82 superinvestors", "18 vegetables", "252 cells" — not "all possible X")?
3. Is it **structured** (has schema — rows/columns, JSON, SEC filing format, CSV)?
4. Does each record have **genuinely unique data** (not template-filled — avoids the `template_programmatic_pages × -100` penalty)?
5. Is the dataset **refreshed on a known cadence** (monthly, quarterly, seasonal — enables freshness archetype)?

**Yes on all 5** = public-finite-dataset concept. These ship in 2-3 days on static export + no DB + no auth.
**HoldLens hit 5/5** (SEC 13F filings: public, 82 investors finite, structured XML, unique per filer × quarter × ticker, quarterly cadence) → shipped in ~2 days.
**Fermentcalc hits 5/5** (18 vegetables × 8 styles, public NCHFP/Katz/Noma data, unique per combination, recipes are evergreen).
**Conversionbench hits 4/5** (fails #4 partially — needs source-verified benchmarks for 252 cells, many flagged `needs_research`). → that's why it's Medium-tier (~8-12 days), not Easy.

**Yes on <3** = concept is not a dataset play — probably requires content generation. Deprioritize or reclassify as Guide/Reference.

#### Archetype-Stack Detector (v2.0 NEW)

Ask: **how many high-multiplier distribution archetypes does ONE page hit simultaneously?** The stacking is multiplicative, not additive — 4 archetypes on 1 page beats 4 pages × 1 archetype each.

**Target stacks per fleet-class:**

- **Easy-tier (finite-public-dataset):** target ≥5 archetypes per programmatic page template. HoldLens per-investor pages hit ~10.
- **Medium-tier:** target ≥3 per page.
- **Hard-tier:** target ≥2 (single-archetype concentration often dominates).

Stack-count becomes a Layer 5 input (see Archetype-Stacking Bonus below).

#### Moat Test (v2.1 NEW — 4 questions)

A concept ships. It ranks. Then a bigger-DR publisher notices and replicates it in a week. Without a moat, Year-2 revenue evaporates. Four questions determine copy-resistance:

1. **Is the dataset original-synthesis, not raw republish?** (Raw "list of 13F filers" = no moat, public data. HoldLens's composite ConvictionScore across 8 quarters × weighting = synthesis → moat.)
2. **Does maintenance require ongoing editorial judgment?** (Auto-scraped data with zero curation = no moat. "Which filing changes are significant" requires judgment → moat.)
3. **Does the concept compound on accumulated history?** (Snapshot sites = copyable. Time-series / versioned / longitudinal = compounds over months → moat grows with age.)
4. **Is there a brand/identity signal the clone can't replicate?** (Operator's personal expertise, voice, Person schema, methodology page, corroboration across Reddit/LinkedIn = moat. Pure programmatic with no author identity = commodity.)

Scoring: `moat_score = count_of_yes_answers / 4` (range 0.0-1.0).

- **0.00-0.25:** commodity — ships fast but gets cloned in a week. Deprioritize.
- **0.50:** baseline — holds for 6-12 months against replication, needs ongoing investment.
- **0.75-1.00:** defensible — replication requires substantial time investment from competitor. HoldLens, readinglist.school both ≥0.75.

Fleet-wide rule: concepts with moat_score < 0.50 DO NOT enter the shortlist unless they're cheap Easy-tier experiments (2-3 days build, operator explicitly tagged `[experimental]`).

### Layer 2 — Volume sanity check

Three tiers of evidence, in order of trust:

1. **Google Keyword Planner** (paid Ads account required) — authoritative monthly volume
2. **Google Trends** — relative popularity over 5 years, seasonality visible
3. **Google Autosuggest** — query completions reveal what real people actually type
4. **SERP size** (manual "about N results" + #1 result depth) — proxy for competition

**Minimum volume floor to consider a concept:** head-query ≥ 1000/mo OR 10+ long-tail combinations at 100-500/mo each. Below this, even 100% SERP capture won't reach the 10k-sessions/mo AdSense-meaningful threshold.

**Watch for:**
- Google Trends "flat low line" concepts — search volume doesn't exist. Don't trust static keyword estimates.
- "Year" qualifier queries ("2026 benchmarks") — trend with time; ensure the concept will still be relevant in 2 years.
- Seasonal concepts — map the peak to today's calendar. Building Sep-Nov-peak Fermentation in April gives 4-5 months to rank before first peak.

### Layer 3 — SERP reality check

Open the top-3 head-query SERPs and diagnose competition **honestly**.

For each of the top 3 results:
- Who's the publisher?
- What's their DA / DR?
- How old is the page?
- Is the page directly answering the query or is it adjacent?
- Is it thin content or comprehensive?

**Beatable-SERP criteria (need ≥ 2 of these):**
- Top 3 includes at least one hyphenated / thin / 10+ year-old page
- Top 3 includes Reddit thread (ranking but not monetizable for them)
- Top 3 includes YouTube video (different content format — we can complement)
- Top 3 serves wrong intent (e.g., broader term stole the SERP — we can own the narrower intent)
- Top 3 has no programmatic depth — incumbents publish 1 summary; we can publish 500 pages

**Unbeatable-SERP criteria (any one = drop or defer):**
- DR 85+ incumbent owns the top 3 with recent content directly matching intent
- Google SGE / AI Overview already answers the query inline — zero click-through
- Featured snippet from incumbent takes position 0
- Incumbent has a live aggregator (WordStream, HubSpot) that's structurally what we'd build

**The honest-position note:** Conversionbench SERP (conversion rate benchmarks) is dominated by WordStream DA 85, Unbounce DA 80, HubSpot DA 91. Fermentcalc SERP (fermentation calculator) has hyphenated #1 + YouTube + Reddit — beatable. This layer alone determines Year-1 ramp speed.

#### AI-Overview Risk Test (v2.1 NEW — 5 structured dimensions)

Google SGE / AI Overviews eat concepts that are extractable-in-one-sentence. Structured test replaces v2.0's prose-level mention:

| Dimension | Low risk (0.0) | High risk (1.0) |
|---|---|---|
| **Query type** | Navigational / specific intent / "show me X for Y" | "What is X" / "how do I X" (extraction-ready) |
| **Answer extractability** | Answer requires a table / chart / composite / multi-step synthesis | Answer fits in 1-2 sentences |
| **Synthesis required** | Concept synthesizes multiple data sources into a POV | Concept republishes a single source (dictionary-class) |
| **Dataset depth** | >100 unique-data pages with own research | <10 pages or template-generated |
| **Freshness window** | Data changes quarterly/weekly; AI Overview stale by day 30 | Data is evergreen; AI Overview stays current indefinitely |

`ai_overview_risk = mean(5 dimensions), range 0.0-1.0`.

- **0.00-0.25:** AI-Overview-resistant (ships; benefits from SGE citation traffic at best)
- **0.25-0.50:** at partial risk (some queries eaten, others safe — target long-tail + synthesis queries)
- **0.50-0.75:** most queries will be eaten (proceed only if vertical RPM compensates for reduced click-through)
- **0.75-1.00:** concept is AI-Overview food (DO NOT SHIP — reclassify as Guide/Reference with heavy E-E-A-T investment, or drop)

**HoldLens observed:** ~0.20 (synthesis + composite scoring + quarterly freshness + 200+ unique pages = AI-Overview can't outcompete the dataset depth).

**Hypothetical simple-calculator concept (e.g., "tip calculator"):** ~0.85 (trivial extraction, AI Overview ships the answer in-SERP → zero clicks).

### Layer 4 — Domain availability + score

Run the domain-score algorithm (v2) on 1000+ candidates, then empirical verification.

**Scoring formula (composite, multi-dimensional):**

```
score = length_score × phonotactic_score × tld_trust_score × phrase_match_bonus × keyword_match_bonus × brandability_score

Where:
  length_score       — max at 8-10 chars, penalty for 4-6 (too short / likely taken / typoable) or 13+ (too long)
  phonotactic_score  — pronounceability (vowel/consonant balance, no awkward clusters)
  tld_trust_score    — .com=1.00, .io=0.85, .app=0.80, .dev=0.75, niche TLDs 0.65-0.75
  phrase_match_bonus — +20pts if matches exact search phrase, +10 if close match
  keyword_match_bonus — +15 if contains primary keyword, +5 close variant
  brandability_score — memorability + spellability (dictionary words > mashups > random)
```

**Audience-aware TLD weights** (learned from this session's research):
- Food/consumer audience: .com > .kitchen/.recipes > .coffee/.pizza > .app > .io
- Developer audience: .com > .io > .dev > .app > .tools
- Business/marketer: .com > .io > .co > .biz (avoid)

**Then verify** (empirical stack):
1. DNS screen — is NS record present? (95% accurate — 2-5% false positive)
2. Verisign WHOIS direct — authoritative availability (100% accurate for .com/.net)
3. Wayback Machine history — was there a prior site? What was it? (reveals reputation debt)
4. Registrar confirm — Cloudflare/Porkbun — final pre-purchase check

**Hard lessons from this session** (captured for future):
- `bakerspercentage.com` showed DNS-available but was registered 2024-02-13 — DNS false positive cost one cycle of reasoning
- `conversionmath.com` had Wayback history back to 2021 — turned out to be parking page (no accrued equity), so "aged domain" claim was false
- `fermentation-calculator.com` holds SERP #1 despite being hyphenated — proves the principle that Google lacks good options in sparse SERPs; exact-match + clean .com wins

### Layer 5 — Triple-Oracle ranking

v17.3 introduces three Oracles. Every concept gets projected on all three, no exceptions.

**Revenue Oracle:** projected $/week peak + 3-year cumulative EV.

Inputs: head-query volume, SERP capturable %, RPM tier, seasonality multiplier, programmatic page count × RPM × long-tail rank velocity.

**Retention Oracle:** projected Δ return-rate + core-loop strength.

For reference sites, retention = "do users come back next time they need this answer?" A calculator users bookmark = high retention. A one-shot SEO answer = low retention. Calculator/database archetypes typically have +0.03 to +0.06 retention archetype multiplier.

**Distribution Oracle:** projected Δ weekly-organic-traffic + channel fit.

For silent-SEO sites: distribution = SEO. Archetype × SERP winnability × content depth × domain authority adjustment.

**Triple-capped ranking** (v17.3 APS formula): `APS = APS_v15 × (1 + min(1.0, revenue_weight)) × (1 + min(1.0, retention_weight)) × (1 + min(1.0, distribution_weight))`.

A concept wins when all three Oracles project positive. A revenue-only win with retention cliff and zero distribution gets multiplicatively reduced.

#### Archetype-Stacking Bonus (v2.0 NEW — from HoldLens calibration)

When a per-page template genuinely hits ≥3 distinct high-multiplier archetypes from the v18.0 calibrated Distribution Oracle table, apply a stacking bonus to the distribution projection:

```
stack_count = count of archetypes with multiplier ≥ +50 that the template simultaneously satisfies
  (e.g., holdlens /learn/13f-vs-13d-vs-13g template satisfies: comparison_vs_competitor_page +60,
   SEO_page_addition +50, ai_visibility_optimized_page +70, schema_markup_article_person_org +20,
   internal_linking_hub_spoke +15 → stack_count=3 for the ≥+50 subset)

stacking_bonus_multiplier =
  stack_count ≤ 2 → ×1.00 (no bonus)
  stack_count = 3 → ×1.25
  stack_count = 4 → ×1.40
  stack_count ≥ 5 → ×1.50 (capped)

distribution_weight_final = distribution_weight × stacking_bonus_multiplier
```

The cap at ×1.50 prevents runaway scoring on aspirational 10-archetype claims. The stacking bonus is itself capped by the triple-cap formula on distribution_weight (min 1.0), so it can raise a concept from 0.3 weight to 0.45 but never to >1.0.

**HoldLens calibration:** per-page templates hit 3-5 archetypes consistently (verified in LEARNED.md). Stacking bonus would have been ×1.25 to ×1.40 on projections — which is why the actual traffic outperformed cold-start projections before calibration.

**New Distribution Oracle archetype rows** (v2.0 additions to the v18.0 research-calibrated table):

```
indexnow_autoping_every_deploy      × +40   (v19.1 Autonomous Acquisition Engine — every deploy pings search engines directly, bypasses crawl-delay)
sharecard_per_result_canvas         × +65   (1200×630 branded PNG + pre-composed tweet + above-fold placement; proven by holdlens v0.28 SignalShareCard)
finite_public_dataset_programmatic  × +75   (upgrade from programmatic_page_with_unique_data × +55 when Finite-Public-Dataset Test scores 5/5)
day1_analytics_stack_wired          × +15   (GA4 + Plausible + Cloudflare Web + GSC + AdSense active from Day 1-2; enables self-calibration of projections)
```

### Layer 6 — Fleet-aware ordering

Given ≥2 concepts that pass Layers 1-5, the ordering question is fleet-aware:

**Ordering criteria (in priority order):**
1. **Seasonal urgency** — a concept with a Sep-Nov peak needs to ship by May to rank by September. Fall-peak concepts have higher urgency in April than flat-seasonality concepts.
2. **Complementary seasonality** — prefer concepts with peaks the existing fleet doesn't have. Sourdough (Oct-Feb) + Fermentcalc (Sep-Nov) + Conversionbench (flat) = smooth fleet curve.
3. **Playbook replay value** — if two concepts have similar EV, prefer the one that matches existing fleet playbooks (stack, content-bundle pattern, deploy flow). Speed-to-ship matters more than marginal EV.
4. **Revenue-now vs revenue-future** — break ties toward the concept that ships faster to first revenue, even if 3-year EV is lower.
5. **Operator domain knowledge** — if the operator genuinely uses the site themselves weekly, ship it over one they don't. Dogfood = maintained → earning.

#### Build-Effort Tier calibration (v2.0 NEW — operator-calibrated 2026-04-18)

Every concept is tiered before ordering. Tier dictates time budget, staffing, and fleet-slot allocation.

| Tier | Build time | Signature characteristics | Fleet examples | Playbook match |
|---|---|---|---|---|
| **🟢 Easy / fast** | 2-3 days | Public finite dataset (5/5 on Finite-Public-Dataset Test) · Static export compatible (`output: 'export'`) · No DB in v0 · No auth in v0 · Standard stack replay · IndexNow in deploy script | **holdlens.com** · beams.page · readinglist.school · sourdoughhydration · fermentcalc | Direct replay of holdlens playbook — minimal deviation |
| **🟡 Medium** | 8-12 days (≈3-4× Easy) | Dataset needs ETL/parsing (e.g. EDGAR → JSON) · Adds DB + migrations · Adds basic auth · Source-verified content policy with tri-state (verified/derived/needs_research) · More specialist review cycles (@distributor + @craftsman at every ship) | conversionbench · txtfeed · crotool · ClauseGuard v1 | Fork from Easy playbook, add Drizzle/Neon + auth layer |
| **🔴 Hard** | 30-60 days (≈10-20× Easy) | Multi-tenant SaaS · Payments + billing complexity · AI/ML inference layer · Heavy compliance (YMYL financial/medical/legal) · Real-time infrastructure | amili (enterprise SaaS) · ClauseGuard v2 (AI contracts) · GenerateChess (real-time multiplayer) | Novel per-project — playbook replay doesn't apply |

**Fleet heuristic:** default to Easy-tier concepts until proven otherwise. Easy-tier ships have the highest Y1 velocity, lowest cost of reversal, cleanest Day-1 analytics. Medium-tier concepts should still inherit the Easy-tier stack (Next.js static + CF Pages + no-DB-in-v0) where possible — escalate to DB/auth only when data actually requires it.

**Tier-mismatch detection:** if a concept looks Medium/Hard but all 5 Finite-Public-Dataset Test answers are yes, suspect the Medium/Hard tagging is aspirational. Strip features back to Easy-tier v0, ship in 3 days, iterate.

### Layer 7 — Honest calibration against reality

Every ship must flow back into this methodology. The "learn from data" rule (`~/.claude/rules/learn-from-data.md`) applies here specifically:

**Every ship, 7 + 30 days later:**
- Log projected weekly sessions vs actual (GSC + Vercel Analytics)
- Log projected RPM vs actual (AdSense dashboard)
- Log projected SERP positions vs actual (GSC queries tab)
- Log archetype — did it perform as projected for its category?

After 5 ships (should be achievable within Year 1), the multiplier table at the top gets recalibrated. The fleet's specific niche + operator's specific execution skill become baked-in signal, not generic SEO advice.

#### Day-1 Analytics Mandate (v2.0 NEW — from HoldLens calibration)

**Every fleet ship wires the full analytics stack on Day 1-2, not Day 6.** Holdlens proved the compound value — its 40+ version cycles all had Day-1 Plausible + (later) GA4 + Clarity + Cloudflare Web + GSC + AdSense + IndexNow active, which means every ship-impact row has measurable data instead of "TBD / waiting for traffic."

**Mandatory Day-1 analytics minimum (any fleet ship):**
1. **Plausible** (primary traffic) — `data-domain="[domain]"` script in layout, outbound-links + tagged-events variant
2. **Google Search Console** (organic queries + indexing) — verified via meta tag in layout
3. **Cloudflare Web Analytics** (if on CF Pages) — `data-cf-beacon` token when CF_ANALYTICS_TOKEN env set
4. **IndexNow** in deploy script — `npm run deploy` = `build && wrangler/vercel deploy && npm run indexnow`

**Recommended Day-1 additions (stronger compound):**
5. **Google Analytics 4** — `gtag` in layout, `NEXT_PUBLIC_GA4_ID` env, Consent Mode v2 defaults DENIED
6. **Microsoft Clarity** — heatmaps + session recordings for UX audit on Day 7
7. **AdSense loader snippet** — placed pre-approval so Day-7 "Request review" finds a ready site

**Not Day-1 (can slip to Day 7):**
- AdSense "Request review" click (requires 10+ substantive pages live + privacy/about/contact/terms)
- Plausible goal conversions (define after traffic shape is known)
- Stripe live-mode keys (operator-gated — per PAYMENT GATE, only fires on real revenue activation)

**Enforcement:** BUILD_SPEC.md Day 1 checklist MUST include Plausible + GSC + IndexNow wiring. Sessions that defer to Day 6 violate this layer and are auto-flagged for CSIL review.

#### LLM-Citation Design Pattern (v2.1 NEW — Aleyda Solis 10-characteristic checklist)

LLMs (ChatGPT, Claude, Gemini, Perplexity) cite sources when the source clears 10 specific characteristics. HoldLens retrospectively scored 8/10 (see holdlens LEARNED.md). v2.1 codifies these as **design-time guidance** — concepts are now DESIGNED for 10/10 from Day 1, not audited-against after ship.

| # | Characteristic | Design pattern that achieves it |
|---|---|---|
| 1 | **Accessible** | Static export or SSR — NO JS-gated content on core pages. LLM crawlers don't execute JS. Use Next.js `output: 'export'` or pure SSR; hydrate client features AFTER content is in HTML. |
| 2 | **Useful** | Unique dataset with depth no competitor ships. Pass the Finite-Public-Dataset Test (5/5) + build ≥100 unique-data pages from it. |
| 3 | **Recognizable** | Consistent brand entity everywhere: same name + logo + `<title>` pattern + Organization schema on every page. Build toward a Wikipedia citation (archetype `wikipedia_sourced_edit × +75` in Layer 5). |
| 4 | **Extractable** | Section headings are quote-ready sentences (not marketing fluff). DefinedTerm schema for key concepts. FAQ schema on explainer pages (used sparingly per v18 penalty `faq_schema_spam × -10` — max 1 FAQ block per page). |
| 5 | **Consistent** | Brand voice consistent across /learn + /about + /methodology. Visual identity consistent in OG images + favicons. Check via manual spot-review across 5 random pages. |
| 6 | **Corroborated** | Facts appear in ≥3 independent sources: your site + Reddit thread + LinkedIn post + ideally Wikipedia. Operator-driven distribution layer (reddit_organic_helpful_comment ×+70, linkedin_zero_click ×+65) closes this. |
| 7 | **Credible** | E-E-A-T signals: /about page with operator identity, /methodology page, Person schema on articles with byline, outbound citations to NCHFP/SEC/official sources. |
| 8 | **Differentiated** | Explicit POV in a /learn article per concept. "Our view:" sentence per page. HoldLens's "signal spectrum" framing + survivorship-bias POV are this characteristic. |
| 9 | **Fresh** | Dated content: `datePublished` + `dateModified` in schema. Quarterly/monthly update cadence visible on pages. Time-series plots showing history. |
| 10 | **Transactable** | User can take action from the citation: /pricing live, email capture, Stripe checkout ready, contact form. LLM citations that end in "visit to subscribe" convert better. |

**Design-time test:** score your concept's page-template design against these 10 BEFORE Day 1 build. Target 10/10 as the design spec, accept 8/10 as ship-ready, require ≥6/10 to clear Layer 7.

`llm_citation_fit = characteristics_passed / 10, range 0.0-1.0` — feeds into Concept APS.

**HoldLens v2.1 retrospective score:** 8/10 (missing: Recognizable at 7.5/10 no Wikipedia yet; Corroborated at 4/10 no Reddit/LinkedIn presence). LEARNED.md already flagged these as cycle 12+ candidates.

---

---

## Composite Scoring Formula — Concept APS (v2.1 NEW)

The 7 layers produce qualitative assessments. The **Concept APS formula** synthesizes them into a deterministic 0-100 score for programmatic comparison across large concept datasets (VAULT00's 25k concepts, TOP100_ADREV, TOP50_OVERALL).

### The formula

```
Concept APS = 100
  × archetype_ceiling       (Layer 1, 0-1; Calculator/Database/Comparator/Benchmark = 1.0, Generator = 0.6, Aggregator = 0.2, hard-rejects = FILTERED, not scored)
  × volume_score            (Layer 2, 0-1; scaled from head-query monthly volume: <1k=0.3, 1-5k=0.5, 5-20k=0.8, >20k=1.0)
  × serp_beatability        (Layer 3, 0-1; beatable≥0.7, mixed 0.4-0.7, unbeatable<0.4 → FILTERED)
  × (1 - ai_overview_risk)  (Layer 3, 0-1; from AI-Overview Risk Test — 0.8 risk becomes 0.2 multiplier)
  × (1 + moat_score * 0.5)  (Layer 1 addition, 0-1; high moat boosts up to ×1.5)
  × domain_score_normalized (Layer 4, 0-1; normalized from 0-300 composite → /300)
  × build_effort_efficiency (Layer 6 Tier: Easy=1.0, Medium=0.6, Hard=0.3)
  × stacking_bonus          (Layer 5, 1.0-1.5 from Archetype-Stack Detector)
  × llm_citation_fit        (Layer 7 addition, 0-1; characteristics passed / 10)
  × fleet_fit_score         (Layer 6, 0-1; seasonality complement + playbook replay + dogfood value)
```

**Filter gates** (applied BEFORE scoring; concepts failing these are excluded from the shortlist):
1. Hard-reject archetype (Layer 1) → FILTERED
2. volume_score < 0.3 (head-query <1k/mo AND no long-tail stack ≥10 keywords) → FILTERED
3. serp_beatability < 0.4 (unbeatable per Layer 3 unbeatable-criteria) → FILTERED (unless `[experimental]` tag)
4. ai_overview_risk > 0.75 → FILTERED (reclassify as Guide/Reference or drop)
5. moat_score < 0.25 AND build_effort_tier != Easy → FILTERED (not worth Medium+ effort for commodity)

### Calibrated worked examples (2026-04-18)

| Concept | Archetype (L1) | Vol (L2) | SERP (L3) | AI-Ov (L3) | Moat (L1+) | Dom (L4) | Effort (L6) | Stack (L5) | LLM (L7) | Fleet (L6) | **Concept APS** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **holdlens.com** (actual) | 1.0 | 0.7 | 0.8 | 0.2 | 0.90 | 0.70 | 1.0 | 1.50 | 0.80 | 0.90 | **≈ 47** |
| **fermentcalc.com** (projected) | 1.0 | 0.5 | 0.9 | 0.4 | 0.80 | 0.75 | 1.0 | 1.25 | 0.70 | 0.85 | **≈ 21** |
| **conversionbench.com** (projected) | 0.9 | 0.6 | 0.4 | 0.5 | 0.50 | 0.80 | 0.6 | 1.25 | 0.80 | 0.90 | **≈ 6** |
| **readinglist.school** (projected) | 1.0 | 0.5 | 0.8 | 0.3 | 0.75 | 0.85 | 1.0 | 1.40 | 0.70 | 0.85 | **≈ 30** |
| _(hypothetical) tip calculator_ | 1.0 | 0.3 | 0.5 | 0.85 | 0.00 | 0.70 | 1.0 | 1.00 | 0.30 | 0.40 | **≈ 0.5** → near-zero, correctly deprioritized |

**Ranking matches observed fleet reality:** HoldLens (47) is operator's current #1 in user growth → formula predicts it. Fermentcalc (21) mid-tier is building. Conversionbench (6) low-score correctly flags it as slow-burn Y2 investment. Readinglist (30) tracks its Week-4-dormant-but-compounding status.

### When to use Concept APS

- **Bulk screening** — apply across the 25k-concept VAULT00 dataset; surface top 50 by APS for manual Layer-by-Layer review.
- **A/B concept decisions** — "should we build A or B?" Compare APS scores + read the 10 input dimensions to see WHY one wins.
- **Kill-decision on existing fleet sites** — re-score every 90 days; if APS drops below the concept's prior score by >30% due to new competition (SERP shift), consider maintenance vs. abandon.
- **Operator-side dogfood** — the concept-finder.html UI should expose APS as a sort option in v3.1 (UI version bump — separate from methodology version).

### Not a revenue forecast

**Concept APS is a heuristic, not a forecast.** A score of 47 does not translate to $47/wk or 47k users. It's a directional ranking to focus attention on high-potential concepts — real outcomes depend on execution quality, market timing, SEO variance, ad-tier calibration. Use APS to PICK; use the Oracles (Revenue/Retention/Distribution) to PROJECT; use Week-4/8/16/24 actuals to CALIBRATE.

### Calibration discipline (v2.1 enforcement)

Every ship's post-30-day audit MUST log the actual-outcome multiplier and back-solve which input dimension was over/under-estimated:

```
Format in calibration log:
  <project> · Week N audit · Concept APS projected: <score>
    Actual top driver: <measured>
    Most inaccurate input dimension: <L#, dim>, projected <X>, observed <Y>
    v2.X multiplier adjustment proposal: <archetype / dimension / none>
```

After 5+ ships with 30d actuals, run cross-project multiplier recalibration. Log as v2.X minor bump with new calibrated multipliers in the Changelog.

---

## Concept-finding anti-patterns (from this session's mistakes)

Captured from the session history so future sessions don't repeat:

### AP-1: Ranking without empirical volume verification

*What happened:* ranked concepts algorithmically using keyword-match scoring without checking Google Trends.

*Why it failed:* `"fermentation math"` has 50/mo volume; `"fermentation calculator"` has 1900/mo. Algorithmic score gave them similar marks. Empirical check inverted the ranking.

*Lesson:* Never ship a top-10 concept ranking without manually checking Google Trends or Autosuggest on the head queries.

### AP-2: Flipping picks when a single new signal arrives

*What happened:* `fermentcalc.com` vs `fermentmath.com` kept flipping as each new research layer arrived.

*Why it failed:* oscillation across multi-variable optimization means we never commit. Operator called it out: "you keep changing things, do more research untill youre 100% certain".

*Lesson:* Use an **ordered tie-break framework** that locks in decisions. This rule's 7 layers are the ordered framework. Once Layer N says "pick X", don't let Layer N+1 overturn it without an explicit override criterion.

### AP-3: Fabricating benchmarks for data-site concepts

*What happened:* Considered filling all 252 benchmark rows with plausible-but-unverified numbers for conversionbench.

*Why it failed:* HCU actively penalizes fabricated data-site content. One wrong number in a benchmark table discredits the whole site for LLM citation.

*Lesson:* Every data point must cite a published source with credibility score ≥7. Missing data = `needs_research` flag + 404 the page until a source is found. Shipping 80 verified benchmarks beats 252 with 170 fabricated.

### AP-4: Ignoring operator's fleet context

*What happened:* Initially evaluated Coffee Brew Ratio as a standalone concept.

*Why it failed:* Fleet already had 2 food-adjacent concepts (Sourdough, Fermentcalc). Third food vertical = seasonality concentration, not diversification.

*Lesson:* Every new concept scores +10% if it adds seasonal/vertical diversification to the fleet, -10% if it concentrates. Layer 6 now enforces this.

### AP-5: Building content-bundle "from imagination" when time-pressed

*What happened:* Sourdoughhydration.com Day 2 session shipped ~15 minutes of fabricated flour content before catching the operator's pre-staged content-bundle.

*Why it failed:* The fabricated content was less rich and less source-backed than the operator's bundle. Would have been flagged by HCU over time.

*Lesson:* Content-bundle is canonical. ALWAYS check for `content-bundle/README.md` before writing seed data. If no bundle exists, WRITE the bundle first, don't generate during seed.

### AP-6: "Defensive hold" as an excuse to defer hard decisions

*What happened:* Initially scored conversionbench.com as "Year 2 defensive hold" because SERP was intimidating.

*Why it failed:* Operator reversed — "let's ship it now." The deferral was an unforced error; the actual downside was modest (slow ramp) and the upside was real (counter-seasonal diversification).

*Lesson:* "Defensive hold" is appropriate only when (a) SERP is genuinely unwinnable AND (b) the domain would otherwise expire. If registered domain + parkable noindex stub exists, the hold is free. Deferring full build indefinitely is rarely the right call once you've already paid $10/yr + 30min prep.

### AP-7: Assuming AdSense compliance is automatic

*What happened:* Early drafts of BUILD_SPEC.md didn't include AdSense readiness gate.

*Why it failed:* A single fleet site that fails AdSense review cascades — account bans propagate across all sites. Review takes 3-14 days; a rejection costs 2-4 weeks before the next submission.

*Lesson:* `~/.claude/rules/adsense-compliance.md` is binding. Every BUILD_SPEC.md Day 6 includes the AdSense readiness gate. Zero exceptions.

---

## The 3-minute concept screen

When the operator throws a new concept at AcePilot mid-conversation, use this rapid-screen to decide whether to expand or defer.

**Step 1 (10 sec): archetype check.** Is the concept one of the seven archetypes? If hard-reject archetype → decline and explain. If not hard-reject → continue.

**Step 2 (30 sec): volume check.** Google Trends 5-year line for the head query. Is it flat-near-zero? → decline. Trending up or steady with 1000+ monthly search volume? → continue.

**Step 3 (60 sec): SERP top-3 check.** Open the SERP, eyeball the top 3. DR 85+ incumbents with perfect intent-match? → defer (queue for Phase 2). Mixed competition with at least one weak incumbent? → continue.

**Step 4 (60 sec): fleet fit.** Does this add seasonal/vertical diversification? Does it replay an existing playbook? Is operator dogfood plausible? Continue if yes to 2/3.

**Step 5 (30 sec): final projection.** Ballpark Y3 EV based on archetype × RPM tier × volume × SERP ceiling. Is it worth operator time at the current fleet's marginal hour rate?

If all 5 pass → full evaluation (Layers 1-7). If any fail → decline with explicit reason + log to `PATTERNS.md` for future reference.

---

## Calibration log

This section updates as fleet ships accumulate measurable outcomes. **Append-only — never edit prior entries.** Corrections go to a dedicated Corrections subsection.

### Baseline projections (cold start, 2026-04-17)

Before any fleet ship has measured actuals, the methodology uses these defaults. Update as data arrives.

| Concept | Archetype | Revenue cold-start | Retention cold-start | Distribution cold-start |
|---|---|---|---|---|
| readinglist.school | Database + Reference | $40-80/wk peak | +0.02 | 3000-8000 vis/wk avg |
| sourdoughhydration.com | Calculator + Reference | $60-100/wk peak | +0.05 | 5000-12000 vis/wk avg |
| fermentcalc.com | Calculator + Database | $30-60/wk peak | +0.04 | 2000-6000 vis/wk avg |
| conversionbench.com | Benchmark + Calculator | $40-80/wk peak | +0.03 | 3000-8000 vis/wk avg |
| **holdlens.com (v2.0 add)** | **Database + Calculator (finance/investing)** | **$100-200/wk peak** (finance RPM $15-30) | **+0.04** | **4000-15000 vis/wk avg** |

All numbers in this table are **cold-start defaults**. Replace with measured actuals at Week 8, 16, 24, 52 per each project's AUDIT_PROMPTS.md.

### Ship outcomes (populated over time)

#### holdlens.com (v2.0 NEW — first real reference point, shipped 2026-04-08 onward)
- **Status as of 2026-04-18:** operator declares "most successful in user growth" across the fleet to date. State-files show 40+ version cycles (v0.1 → v1.36+), 228 static pages, full analytics stack wired (GA4 + Plausible + Clarity + Cloudflare Web + GSC + AdSense + IndexNow) — Day-1-wired per v2.0 mandate.
- **Archetype stack observed:** ~10 simultaneous high-multiplier archetypes on per-investor page templates (original_research_with_dataset +90 + programmatic_page_with_unique_data +55 + comparison_vs_competitor_page +60 + ai_visibility_optimized_page +70 + shareable_tool_calculator +65 + sharecard_per_result_canvas +65 + SEO_page_addition +50 + schema_markup_article_person_org +20 + internal_linking_hub_spoke +15 + indexnow_autoping_every_deploy +40). Stack-count ≥5 → Archetype-Stacking Bonus ×1.50.
- **Build effort:** ~2 days (per operator, 2026-04-18 calibration) = Easy-tier. Validated the Finite-Public-Dataset Test (5/5).
- **First live-data actuals:** _pending — awaiting Cloudflare Web Analytics dashboard share, see LEARNED.md "Top blocker"_.
- **Multiplier calibration impact:** once actuals arrive, compare projected vs observed traffic. If observed > projected × 1.25 → raise `finite_public_dataset_programmatic` archetype multiplier by +25% (I-28 bounds). If actual < projected × 0.75 → lower.
- Week 4 audit: _pending 2026-05-06_
- Week 8 gate: _pending 2026-06-03_

#### readinglist.school (shipped 2026-04-16)
- Week 4 audit: _pending 2026-05-14_
- Week 8 gate: _pending 2026-06-11_
- Week 16 gate: _pending 2026-08-06_
- Week 24 check: _pending 2026-10-01_

Log format when populated:
```
readinglist.school · Week 8 (2026-06-11)
  projected_sessions_day: 50
  actual_sessions_day: [TBD]
  projected_rpm: $0 (pre-AdSense)
  actual_rpm: [TBD]
  projected_top_queries_position: n/a
  actual_top_queries_position: [TBD]
  delta_notes: [TBD]
  multiplier_adjustment: [none | +10% | -10%]
```

#### sourdoughhydration.com (shipped 2026-04-17)
- Week 4 audit: _pending 2026-05-15_
- ...

#### fermentcalc.com (scheduled May 2026)
- _not yet shipped_

#### conversionbench.com (scheduled May 2026)
- _not yet shipped_

### Multiplier adjustments

After 5+ ships with 30d actuals, recalibrate the tables at the top of this file. Recalibration cycle is quarterly (Q2 2027 first checkpoint). Append diffs to a dedicated subsection — never edit the baseline tables retroactively. Reproducibility > retconning.

### Corrections

(None yet.)

---

## How to use this rule

**From AcePilot sessions:**
- Read at ABSORB step 8 (fleet knowledge) when any concept-evaluation directive fires
- Read when operator asks about new concept ideas
- Read before spawning the Concept Finder tool or doing research passes
- Referenced from `~/.claude/rules/wealth-desire.md` principle #7 (distribution is king) + `~/.claude/rules/learn-from-data.md`

**From the operator's Concept Finder folder:**
- `concept-finder.html` v3 uses these archetypes + seasonality in the "Smart filter" chips
- `INDEX.md` references this rule file
- Research CSVs in `Sourdough/research/fleet-domains-v2/` feed into Layer 4 scoring

**When to propose updates:**
- Every ship's post-mortem → calibration log
- After 5 ships → recalibrate multipliers
- When a new archetype emerges in the fleet → add to Layer 1 table
- When a new tool surfaces (e.g., Chrome MCP lets us do SERP research faster) → add to Layer 3 toolbelt
- CSIL-equivalent audit every quarter → scan this file for drift from reality

---

## The short version (v2.1 update)

**Good concepts check out on all 7 layers, score 5/5 on Finite-Public-Dataset Test, hit ≥3 archetypes per page template, clear moat ≥0.5, AI-Overview risk <0.5, LLM-citation fit ≥6/10, and produce a Concept APS ≥20. Easy-tier builds (2-3 days) replay the holdlens playbook. Every ship calibrates the formula multipliers via the calibration log. Now under semantic versioning (v2.1 as of 2026-04-18) — methodology output is a deterministic 0-100 number, not a vibe.**

---

## Anti-patterns added in v2.0

### AP-8 — One-archetype-per-page (fleet-proven wrong)

*What happened (the anti-pattern):* shipping 4 thin pages each hitting 1 distribution archetype, thinking breadth = coverage.

*Why it's wrong:* archetype stacking is multiplicative, not additive. HoldLens's per-investor page template hits ~10 archetypes simultaneously and compounds multiplicatively. 4 single-archetype pages would have produced a fraction of the traffic.

*Fix:* design per-page templates to stack ≥3 high-multiplier archetypes (comparison + programmatic-unique-data + ai-citation-optimized + schema + share-card). Measured at Layer 1's Archetype-Stack Detector; bonus applied at Layer 5.

### AP-9 — Day-6 analytics wiring

*What happened:* deferring GA4/Plausible/IndexNow to Day 6 of a 7-day build because "we'll have traffic to measure by then."

*Why it's wrong:* Day 1-5 ships are also measurable — and they're the foundation ships that would calibrate projections earliest. Without Day-1 wiring, the first week of data is lost, and projections stay cold-start for 2-3 extra weeks.

*Fix:* Day-1 Analytics Mandate in Layer 7 — wire the minimum stack (Plausible + GSC + IndexNow) on Day 1-2. Recommended stack (GA4 + Clarity + CF Web + AdSense snippet) on Day 2.

### AP-10 — Content generation over dataset curation

*What happened:* early fermentation-project drafts wrote seed content from imagination (15 minutes of fabricated flour content) before realizing the operator had a pre-staged content-bundle.

*Why it's wrong:* infinite content generation fails the Finite-Public-Dataset Test. The bundle pattern (pre-staged, source-cited, finite) is the foundation of Easy-tier builds. Content-generation concepts default to Medium/Hard tier.

*Fix:* Finite-Public-Dataset Test in Layer 1 — 5 questions pre-qualify or disqualify a concept before scoring begins. Concepts scoring <3 require content-bundle first OR drop from Easy tier.

### AP-11 — Score-without-sources (v2.1)

*What happens:* operator (or future AcePilot session) computes Concept APS on a concept where Layer 2 volume is unknown, Layer 3 SERP hasn't been checked, Layer 4 domain hasn't been scored — defaulting missing inputs to 0 or 0.5, producing a fake-precise score.

*Why it's wrong:* Concept APS is a product of 10 dimensions. Zero-defaulting an unknown input tanks the score; 0.5-defaulting inflates it. Either way the resulting score is fiction — and worse, the false precision gives decision-maker confidence that the score justifies.

*Fix:* if any Layer 1-7 input is `pending` (not yet researched), the Concept APS line reads `APS: pending (Layer N not yet evaluated)`, NOT a computed number. Numbers only emit after all 10 inputs are honest observations or defensible estimates. The 3-minute screen stays qualitative — it's a go/no-go filter, not an APS producer.

---

## Version sync surfaces (v2.0 NEW — enforces version-identity integrity)

When this methodology rule is bumped, ALL of these surfaces must reflect the new version in the same commit/session:

1. **Title line** — `# Concept Finder methodology — the full stack (vX.Y, YYYY-MM-DD)` (line 1 of this file)
2. **Changelog section** — new entry at the top of `## Changelog` with bullet-list of additions
3. **Short version** — last paragraph cites the current version
4. **Concept Finder UI tool footer** — `concept-finder.html` in VAULT00 shows "Implements concept-finder-methodology vX.Y"
5. **VAULT00/Concept Finder/INDEX.md** — the cross-reference row citing this rule mentions the version
6. **Fleet LEARNED.md** — `~/.claude/fleet/LEARNED.md` notes the version in its "rules referenced" section

**Drift detection:** if any surface cites an older version than the methodology file's header, that's a `version_identity_drift` failure class (parallel to `~/.claude/rules/version-identity-sync.md` for AcePilot brain versions). CSIL audit #12 (future) will scan for this drift automatically.

**Semantic versioning rules for this file:**
- **Major bump (vX.0)** — adds a new scoring layer, changes the flow, or invalidates prior calibration. Requires sync across all 6 surfaces above + a migration note in the changelog.
- **Minor bump (v2.X)** — adds archetypes, refines multipliers, captures new anti-patterns, adds calibration data. Sync surfaces 1, 2, 3 mandatory; 4, 5, 6 within 7 days.
- **Patch bump (v2.0.X)** — typo fixes, clarity edits, no content changes to the decision logic. Title line + changelog only; other surfaces not required to update.
