# Ultimate 20 Concepts — v2 (1 concept = 1 main domain)

**Generated:** 2026-04-28 · **Replaces architecture of:** `ULTIMATE_20_DOMAIN_COMBO_2026-04-28.md` (which packed multiple concepts under bundle-parent domains via sub-PATHS).

**New rule (operator directive):** every concept gets ONE main domain. **Sub-domains** are allowed to help the same concept (e.g. `api.holdlens.com`, `share.holdlens.com`, `charts.holdlens.com` all serving the same investor-portfolio-scanner concept). Different concepts get different main domains.

**Trade-off:** lose bundle compounding (×1.10–1.25 stacking factor) but gain brand-clarity + per-concept SEO authority + cleaner pivot path per site.

---

## ⚠ Caveats (preserved)

Fleet at €0 actual revenue. APS ±25%. The v5 markdown's individual APS scores are the basis (no stacking factor applied — that was bundle-only). Highest-leverage move unchanged: **Mediavine for HoldLens this week.**

---

## The 20 (1 concept → 1 main domain, ranked by individual APS)

| # | Concept | Main domain | Sub-domain helpers (same concept) | Vertical | AVM | APS | Status |
|---:|---|---|---|---|---:|---:|---|
| 1 | **HoldLens** — institutional-investor portfolio scanner | holdlens.com | api · charts · share · embed | Finance | 1.6 | **62** | LIVE |
| 2 | **SEC Form 4 Insider Trading Tracker** — daily insider-buy/sell feed | insidertrades.io | rss · alerts · api | Finance | 1.6 | **41** | NEW |
| 3 | **SEC 8-K Daily Material Events** — daily 8-K-filing feed + classifier | materialevents.io | rss · alerts · api | Finance | 1.6 | **38** | NEW |
| 4 | **School Reading List DB** — 50-state programmatic | readinglist.school | api · embed | Education | 1.6 | **36** | LIVE |
| 5 | **13D/13G Activist Filings Tracker** — activist-investor moves | activistfilings.io | rss · api | Finance | 1.6 | **35** | NEW |
| 6 | **Foreign Lang Graded Reader Matcher** — CEFR×book matcher | gradedreaders.io | api · embed · cards | Education | 1.6 | **33** | NEW |
| 7 | **Citation Discipline Score** — score any text for citation quality | citingscore.org | verify · api · widget | AI/Citation | 1.6 | **32** | NEW |
| 8 | **DEF 14A Proxy Season Tracker** — annual proxy filings monitor | proxyseason.com | rss · alerts | Finance | 1.6 | **29** | NEW |
| 9 | **SourceScore Index** — universal source-quality scored index | sourcescore.org | api · embed · permalink-pages | AI/Citation | 1.6 | **28** | NEW |
| 10 | **Foreign Language Level Equivalence** — CEFR×ACTFL crosswalk | langlevels.io | api · widget | Education | 1.6 | **27** | NEW |
| 11 | **Chapter 11 Bankruptcy Tracker** — PACER bankruptcy monitor | ch11tracker.com | rss · alerts · api | Finance | 1.6 | **27** | NEW |
| 12 | **Modern Citation Reference** — AI-era source-type × style matrix | citingsources.org | api · widget | Education | 1.6 | **25** | NEW |
| 13 | **LLC/C-Corp/S-Corp Comparator** — entity-type decision tool | corpcompare.io | calc · api · embed | Legal | 1.4 | **24** | NEW |
| 14 | **Conversion Rate Benchmark by Vertical** — CR baseline data | conversionbench.com | api · widget · embed | SaaS/CRO | 1.6 | **22** | LIVE |
| 15 | **Pickling Brine Calc** — salt-percentage × time-by-vegetable | picklingbrine.io | api · embed | Food | 1.6 | **21** | NEW |
| 16 | **Fermentation Salt/Time Calc** — 18 veg × 8 fermentation styles | fermentcalc.com | api · embed | Food | 1.6 | **20** | LIVE |
| 17 | **Sourdough Hydration Calc** — baker's percentage tool | sourdoughhydration.com | api · embed | Food | 1.6 | **20** | LIVE |
| 18 | **Companion Planting Database** — plant×plant compatibility grid | companionplant.io | api · widget · embed | Garden | 1.4 | **19** | NEW |
| 19 | **Landing Page Teardown DB** — per-company teardowns | landingteardown.com | rss · embed | CRO | 1.6 | **19** | NEW |
| 20 | **Foreign Lang Vocab Frequency DB** — top-N words per language | vocabfreq.io | api · embed | Education | 1.6 | **19** | NEW |

**Σ Individual APS = ~589** (vs. ~1,189 in bundled v20 — 50% lower because no stacking factor, but each domain hosts 1 deep concept instead of multiple shallow ones)

---

## Vertical coverage (7 verticals — concentrated)

| Vertical | Domains | Count |
|---|---|---:|
| **Finance** | holdlens, insidertrades, materialevents, activistfilings, proxyseason, ch11tracker | **6** |
| **Education** | readinglist, gradedreaders, langlevels, citingsources, vocabfreq | **5** |
| **Food** | picklingbrine, fermentcalc, sourdoughhydration | **3** |
| **AI/Citation** | citingscore, sourcescore | **2** |
| **CRO** | conversionbench, landingteardown | **2** |
| **Legal** | corpcompare | **1** |
| **Garden** | companionplant | **1** |

→ **7 verticals (vs. 12 in bundled v20)**. Finance heavily concentrated (6 of 20) because the SEC sub-extensions are the single highest-APS lane in v5 — and now each is a separate main domain instead of stacked under HoldLens.

---

## Architectural trade-offs

### What we GAIN with 1-concept-per-domain

1. **Brand clarity per concept.** Each domain says exactly what it does. `insidertrades.io` ≠ `proxyseason.com` ≠ `ch11tracker.com`. Each has its own SEO authority, social presence, audience.
2. **Pivot independence.** If insider-trades vertical underperforms but proxy-season ramps, you don't drag both with one brand. Per-site kill criteria (per I-35) work cleanly.
3. **Sub-domain helpers for the SAME concept** are clean: `api.holdlens.com` serves the holdlens-core concept; doesn't accidentally bleed into Form 4 territory.
4. **SERP per-keyword targeting** — `insidertrades.io` ranks for "SEC Form 4 insider trading" without competing with HoldLens for "Buffett portfolio."

### What we LOSE

1. **Bundle compound APS** drops from ~1,489 → 589 (audit-perfected v20 → v2). No ×1.10–1.25 stacking factor — every domain ranked by its own merit.
2. **Internal-linking density** — instead of 6 SEC-tracker pages on holdlens.com cross-linking to each other under shared DR, each site builds DR alone.
3. **Operator capacity strain** — 20 separate sites = 20 separate analytics setups, AdSense applications, deploy pipelines, content cadences. Vs. 10-12 if bundled.
4. **Cross-promotion friction** — can't link insidertrades → holdlens as easily without `rel=nofollow` for SEO. Different domains = different authority graphs.

### Net assessment

For a fleet **prioritizing brand depth + per-vertical kill criteria** (your stated direction): **the 1:1 architecture is correct.** For a fleet prioritizing **total-APS-per-operator-hour**: bundling wins.

You signaled the former. v2 ships.

---

## Sub-domain helper conventions

For each main domain, the operator can deploy these sub-domain helpers to deepen the SAME concept (no separate concept):

| Helper | Purpose | Examples |
|---|---|---|
| `api.[main]` | JSON/REST API for the concept's data | api.holdlens.com → 13F holdings JSON; api.insidertrades.io → Form 4 JSON |
| `rss.[main]` | RSS/Atom feed of fresh data | rss.materialevents.io → daily 8-K stream |
| `alerts.[main]` | Email/webhook alerts | alerts.proxyseason.com → company-specific proxy notifications |
| `share.[main]` | Per-result share-card generator (PNG OG images) | share.holdlens.com → "Buffett's Q4 holdings" branded card |
| `embed.[main]` | iframe widget for embedding on other sites | embed.langlevels.io → CEFR crosswalk widget |
| `charts.[main]` | Dedicated visualization sub-app | charts.holdlens.com → portfolio-over-time charts |
| `widget.[main]` | Reusable JS widget for partner sites | widget.conversionbench.com → CR-bench card |
| `cards.[main]` | Static share-card library | cards.gradedreaders.io → per-reader OG-image library |
| `permalink.[main]` | One canonical permalink page per scored item | permalink.sourcescore.org → score history per URL |

**No sub-domain hosts a different concept.** Sub-domains only help the main concept.

---

## What's NOT in the 20 (cuts from prior bundled v20)

The bundled v20 had concepts that were sub-pages of bundle parents. Under 1:1 architecture, each would need its own domain — but their individual APS doesn't justify a slot in the 20. They drop out:

| Concept (was in bundled v20) | Individual APS | Why cut |
|---|---:|---|
| LLM Cost Per Token | 18 | Saturated by artificialanalysis.ai; #22 in v5 list |
| LLM Self-hosted vs API | 16 | Sub of llmcost; not strong as standalone |
| LLM Pricing Tracker | 14 | Sub of llmcost |
| LLM Context Window Comparison | 12 | Low individual APS |
| LLM Embedding Cost | 13 | Low individual APS |
| Modal/Popup Timing Calc | 11 | Sub of crotool; weak standalone |
| UX Research ROI | 11 | Sub of crotool |
| Usability Test Participant Calc | 10 | Sub of crotool |
| Checkout Friction Calc | 15 | Sub of crotool |
| Plant Hardiness Zone × Plant DB | 18 | Cut for vertical balance (companion is higher) |
| Frost Date Lookup | 14 | Cut for vertical balance |
| Plant Calendar | 18 | Cut for vertical balance (companion is higher) |
| Industry RPM Benchmark | 16 | Operator-peer audience; deferred |
| AdSense vs Mediavine vs Ezoic | 15 | Operator-peer audience; deferred |
| Hero Pattern Library | 15 | CRO sub-tool; cut |
| Onboarding Flow DB | 16 | CRO sub-tool; cut |
| Empty State Library | 14 | CRO sub-tool; cut |
| Pricing Page Teardown | 18 | Replaced by Landing Page Teardown (higher APS in same lane) |

→ 18 sub-bundle concepts dropped from active 20 development. They remain ranked in v5 BUNDLED for future consideration; defer until 6-12 months of fleet calibration data validates which standalones deserve their own domain.

---

## Recommended cluster pairings (still possible at 1:1 architecture)

Even without sharing root domains, **3 concept clusters** naturally cross-link and cross-promote. Operator can deploy these as **brand families** without merging domains:

### Cluster A — SEC Filings family (Finance, 6 domains)
- holdlens.com (institutional holdings)
- insidertrades.io (Form 4)
- materialevents.io (8-K)
- activistfilings.io (13D/13G)
- proxyseason.com (DEF 14A)
- ch11tracker.com (Chapter 11)

→ All 6 link to each other in nav-footer. Shared visual brand. Single operator handles all (one cron pulling EDGAR, distributing per-domain). Effectively a brand family.

### Cluster B — Citation/Source family (AI/Education, 4 domains)
- sourcescore.org (universal scorer)
- citingscore.org (citation discipline score)
- citingsources.org (modern citation reference)
- citevelocity.io (citation momentum tracker — formerly citescore.org, now safe-named to dodge Elsevier trademark)

→ All 4 link in shared "About this network" section. Operator deploys uniform OG images.

### Cluster C — Foreign Language family (Education, 3 domains)
- gradedreaders.io
- langlevels.io
- vocabfreq.io

→ Cross-link via "Learn with us" section.

**Cluster cross-promotion ≠ bundle compounding.** No stacking factor applies. But shared branding produces softer compounding effect (audience overlap, returning users hop between sites). Estimate: +5-10% APS lift across cluster vs. zero cross-promotion.

---

## Build sequence (12-month, updated for 1:1)

| Quarter | Action |
|---|---|
| **Q2 2026 (now)** | (1) Apply Mediavine to HoldLens. (2) Register 12 new domains: insidertrades + materialevents + activistfilings + proxyseason + ch11tracker + gradedreaders + citingscore + sourcescore + langlevels + ch11tracker + corpcompare + companionplant + picklingbrine + landingteardown + vocabfreq + citingsources. (3) Don't register citevelocity.io yet — defer until trademark check confirms naming is safe. |
| **Q3 2026** | Ship Cluster A (SEC family) — start with insidertrades (Form 4, highest APS). Each ships in 0.5-2 brain-days (AVM 1.6× direct replay of HoldLens playbook). Sequence: Form 4 → 8-K → 13D/13G → Proxy → Ch11. |
| **Q4 2026** | Ship Cluster B (Citation/Source family) — sourcescore.org first (anchor index), citingscore (score tool), citingsources (reference DB), citevelocity if naming clears. |
| **Q1 2027** | Ship Cluster C (Foreign Language family) + remaining standalones (corpcompare, companionplant, picklingbrine, landingteardown, vocabfreq). |

Year-end target: **20 main domains active or ramping; HoldLens at Mediavine RPM tier; cluster cross-promotion live across 3 brand families.**

---

## Honest gaps

1. **Finance concentration.** 6 of 20 main domains are SEC-filing trackers. If SEC filings become AI-Overview-eaten or volume-saturated, the fleet has 30% of slots in one vertical. Acknowledged risk; the picks are still individually highest-APS.
2. **Cluster ≠ bundle.** Operator may underestimate the difference. Bundle compound (×1.20) was a multiplier; cluster cross-promo is a soft +5-10% halo. Real revenue projection: ~50% of bundled-v20's compound APS, not 75%.
3. **Operator capacity at 20 sites is real strain.** 17h/wk ÷ 20 sites = ~50 min/site/week active development. Some sites will be under-attended; ramp will be slower per-site than the bundled approach. Acknowledged trade-off.
4. **citevelocity.io trademark check pending.** Recommend operator's trademark scan before purchase. If "Citation Velocity" is unclaimed (likely), proceed; otherwise drop to 19 domains.
5. **Live keepers (5 of 20)** are anchored. New domains (15 of 20) need fresh SEO ramp + AdSense + IndexNow + analytics setup each. ~30-50 brain-days of scaffold across Q2-Q3 even at AcePilot velocity.
6. **picklingbrine.io and companionplant.io are seasonal** (food + garden peaks). Their APS is annualized — actual revenue concentrates 4-6 months/yr.

---

## The short version

**20 main domains. 20 distinct concepts. Each gets 1 main domain. Sub-domains help the SAME concept (api/share/embed/rss/charts/widget/cards/permalink/alerts).**

**Σ Individual APS ≈ 589** (vs. bundled v20's ~1,189). 50% APS reduction is the cost of brand-clarity + per-concept SEO authority + per-site kill-criteria independence.

**Top 5 by individual APS:**
1. holdlens.com (62) — LIVE
2. insidertrades.io (41) — NEW SEC Form 4
3. materialevents.io (38) — NEW SEC 8-K
4. readinglist.school (36) — LIVE
5. activistfilings.io (35) — NEW 13D/13G

**3 brand-family clusters** (SEC × 6, Citation × 4, Foreign Lang × 3) cross-promote without merging — softer compound (~+5-10% halo) vs. true bundle compounding (×1.20).

**Highest-leverage week-1 unchanged:** Mediavine for HoldLens. €4-15k Y1 lift. ~30 min operator time. Single 50,000× return on time anywhere in the fleet.

---

*End of ULTIMATE_20_CONCEPTS_v2_2026-04-28.md. Recalibrate when (a) HoldLens Mediavine + 30d data, (b) any new domain hits 1k sessions/mo, (c) cluster cross-promo halo measures (cluster A first; should ramp 3 months after first sub-extension ships).*
