# Best of Best — Top 100 v5 (validated, AcePilot-velocity-aware)

**Generated:** 2026-04-28 · **Methodology:** Concept Finder v2.1.1 + AcePilot Velocity Multiplier (v5 addition)
**Source pool:** v2.1 (100), TOP100_V32 (100), TOP100_ADREV (100), PLAN_V4 (fleet), RESEARCH_SYNTHESIS — deduped to ~210, scored, top-100 returned.
**Validation:** WebSearch incumbent-checks on 12 borderline candidates (APS 60-90 band).

---

## What's new in v5

1. **AcePilot Velocity Multiplier (AVM)** — explicit per-concept multiplier reflecting AcePilot's ship speed:
   - **1.6×** — direct playbook replay (HoldLens / readinglist / fermentcalc clone path; matrix-programmatic finite-public-dataset, static export, no DB, no auth)
   - **1.4×** — adjacent archetype, partial replay (similar pattern, modest deviation)
   - **1.0×** — operator-time-bound (Wikipedia, HARO, podcast pitches required to compound; AcePilot can't ship those)
   - **0.6×** — heavy ETL / DB-required / Medium-tier site (slower ship; AcePilot loses its compound edge)
2. **WebSearch validation** — 12 borderline concepts hit Google directly; SERP saturation re-rated against fresh data. Several v2.1 winners drop (sourdough-hydration, BBQ smoking, payment processor fee, dividend tax, pizza dough — all saturated by 5+ incumbents). Several v2.1 cuts get promoted (LLM-cost niches, lease-deadline specialty, regulatory-fresh angles).
3. **Honest 0-revenue calibration acknowledgment** — fleet currently $0 actual. v5 explicitly does NOT trust revenue projections; ranks on **buildability × moat × headroom**, not projected $.
4. **±25% absolute-APS uncertainty preserved from v2.1.1** — trust ORDER, not VALUES.
5. **Fleet-state aware** — 13-site fleet means AVM 1.6× builds dominate (replay = ship in 0.5-2 brain days).

---

## v5 formula

```
APS_v5 = archetype × volume × serp_beat × (1 - ai_ov_risk)
       × (1 + moat × 0.5) × domain × build_eff × stacking
       × llm_fit × fleet_fit × AVM
       × 100
```

All filter gates from v2.1.1 preserved (hard-reject archetypes, vol<0.3, SERP<0.4, ai-ov>0.75 rejected).

---

## Top 100 — ranked by APS v5

Legend: AVM = AcePilot Velocity Multiplier · "Why" = single-line strongest signal · Vol/SERP/AI-Ov/Moat = the 4 inputs that move APS most.

| # | Concept | Archetype | Vertical | Domain hint | Vol | SERP | AI-Ov | Moat | AVM | APS | Why |
|---:|---|---|---|---|---:|---:|---:|---:|---:|---:|---|
| 1 | HoldLens (shipped, extend) | DB+Calc | Finance | holdlens.com | 0.7 | 0.85 | 0.15 | 0.95 | 1.6 | **62** | live, 5.2k UV, 10-archetype stack, Finance RPM tier |
| 2 | SEC Form 4 Insider Trading Tracker | DB+Calc | Finance | (sub of holdlens) | 0.6 | 0.7 | 0.25 | 0.85 | 1.6 | 41 | extends HoldLens path, finite EDGAR dataset, daily refresh |
| 3 | SEC 8-K Material Events Daily | DB | Finance | (sub of holdlens) | 0.55 | 0.7 | 0.3 | 0.8 | 1.6 | 38 | freshness premium, EDGAR autopipe, Finance RPM |
| 4 | School Reading List DB (shipped, extend) | DB | Education | readinglist.school | 0.5 | 0.85 | 0.2 | 0.8 | 1.6 | 36 | live, 50-state programmatic, back-to-school seasonal |
| 5 | 13D/13G Activist Filings Tracker | DB | Finance | (sub of holdlens) | 0.5 | 0.75 | 0.25 | 0.8 | 1.6 | 35 | finite SEC dataset, narrative angle, low incumbent depth |
| 6 | Foreign Lang Graded Reader Matcher | DB | Books+Edu | gradedreaders.io | 0.5 | 0.8 | 0.3 | 0.75 | 1.6 | 33 | CEFR × book matrix, ~500 readers finite, low incumbents |
| 7 | Sous Vide Time/Temp DB | DB+Calc | Food | sousvidedb.com | 0.55 | 0.55 | 0.45 | 0.7 | 1.6 | 29 | INCUMBENTS verified (Anova, ChefSteps); SERP rated 0.55 not 0.85; still beatable on programmatic depth |
| 8 | DEF 14A Proxy Season Tracker | DB | Finance | (sub of holdlens) | 0.45 | 0.75 | 0.3 | 0.75 | 1.6 | 29 | annual-cycle freshness, EDGAR pipeline, Finance RPM |
| 9 | Chapter 11 Bankruptcy Tracker | DB | Finance | (sub of holdlens) | 0.45 | 0.7 | 0.3 | 0.7 | 1.6 | 27 | court PACER dataset, freshness, distressed-debt audience |
| 10 | Foreign Language Level Equivalence | Comparator+DB | Education | langlevels.io | 0.5 | 0.8 | 0.35 | 0.75 | 1.6 | 27 | CEFR×ACTFL×DELF×HSK crosswalk, evergreen, finite |
| 11 | LLC/C-Corp/S-Corp Comparison | Comparator | Legal | corpcompare.io | 0.55 | 0.55 | 0.45 | 0.65 | 1.4 | 24 | Legal RPM tier, operator dogfood, moderate SERP |
| 12 | Visa Requirements by Passport × Destination | Matrix-DB | Travel | visahop.com | 0.5 | 0.4 | 0.5 | 0.65 | 1.6 | 22 | INCUMBENTS verified (passportindex, visahq, IATA); 195² programmatic still defensible at scale; SERP 0.4 not 0.7 |
| 13 | Conversion Rate Benchmark by Vertical | Benchmark | SaaS/CRO | conversionbench.com | 0.45 | 0.45 | 0.4 | 0.7 | 1.6 | 22 | live (low-traffic), incumbent DR85+ but stack 1.4 holds |
| 14 | Pickling Brine Calc | Calc | Food | (sub of fermentcalc) | 0.5 | 0.45 | 0.35 | 0.6 | 1.6 | 21 | INCUMBENTS verified (preserveandpickle, omnicalc); bundle as fermentcalc sub-tool, NOT standalone |
| 15 | Sourdough Hydration (shipped) | Calc+Ref | Food | sourdoughhydration.com | 0.5 | 0.4 | 0.4 | 0.55 | 1.6 | 20 | INCUMBENTS verified (10+ calculators); shipped, accept slow ramp |
| 16 | Fermentation Salt/Time Calc (shipped) | Calc+Ref | Food | fermentcalc.com | 0.45 | 0.55 | 0.4 | 0.7 | 1.6 | 20 | live, 18 veg × 8 style, NCHFP cite floor |
| 17 | Pizza Dough Calc | Calc+Ref | Food | dough.style | 0.5 | 0.4 | 0.45 | 0.55 | 1.6 | 19 | INCUMBENTS verified (10+ calcs); SERP 0.4 not 0.85; ship only if dogfood-real |
| 18 | Foreign Language Vocab Frequency DB | DB | Edu | (sub of langlevels) | 0.45 | 0.65 | 0.3 | 0.65 | 1.6 | 19 | per-language top-N words, CEFR-tagged, evergreen |
| 19 | Salary Negotiation Calc by Role × Location | Matrix-Calc | Career | salaryroom.io | 0.55 | 0.55 | 0.45 | 0.55 | 1.4 | 19 | role×location×exp grid, partial dogfood, BLS+Levels.fyi cite |
| 20 | Tattoo Size + Pain + Price Calc | Calc+Ref | Body | inkcalc.io | 0.45 | 0.65 | 0.4 | 0.55 | 1.6 | 18 | body-part × size grid, niche moat, low SERP density |
| 21 | Wedding Budget by Guest Count | Matrix-Calc | Wedding | (defer Y2) | 0.55 | 0.5 | 0.4 | 0.45 | 1.4 | 17 | seasonal spike, RPM boost, slight commodity moat |
| 22 | Solar Panel ROI by State + Roof | Matrix-Calc | Home/Energy | solarroi.io | 0.55 | 0.55 | 0.5 | 0.55 | 1.4 | 17 | per-state × incentive × roof grid, NREL data, freshness |
| 23 | Heat Pump vs Furnace ROI by State | Matrix-Calc | Home/Energy | heatpumproi.io | 0.5 | 0.55 | 0.5 | 0.5 | 1.4 | 16 | state-by-state IRA-credit-aware, fall-peak seasonal |
| 24 | Free Trial Length Calculator (SaaS) | Calc+Ref | SaaS | trialcalc.io | 0.4 | 0.65 | 0.45 | 0.55 | 1.6 | 16 | SaaS-founder dogfood, methodology synthesis moat |
| 25 | EU SaaS VAT/MoR Calc | Matrix-Calc | Finance | euvat.tools | 0.4 | 0.55 | 0.4 | 0.65 | 1.0 | 16 | per-country VAT × MoR, operator dogfood, MEDIUM-effort = AVM 1.0 |
| 26 | LLC Operating Agreement Red-Flag Scanner | Tool | Legal | (defer) | 0.45 | 0.4 | 0.5 | 0.5 | 1.0 | 14 | Legal RPM, AI-tool category SATURATED (verified) |
| 27 | Lease Deadline Tracker | Calc+Tool | Real Estate | leasedeadline.io | 0.4 | 0.7 | 0.4 | 0.6 | 1.4 | 16 | INCUMBENTS verified mostly enterprise B2B; solo niche gap |
| 28 | Pricing Page Teardown Database | DB | SaaS/CRO | pricingteardown.com | 0.45 | 0.65 | 0.3 | 0.65 | 1.6 | 18 | per-company teardown, daily operator pain, evergreen |
| 29 | Air Fryer Conversion Tool | Matrix-Calc | Food | airfryconvert.io | 0.55 | 0.55 | 0.5 | 0.5 | 1.6 | 17 | recipe×time×temp grid, mass-market, share-card friendly |
| 30 | Pressure Cooker / Instant Pot Time DB | Matrix-DB | Food | instantpotdb.io | 0.5 | 0.6 | 0.45 | 0.6 | 1.6 | 18 | food×method×time grid, 1B+ Instant Pot owners |
| 31 | Canning Time Calc by Altitude | Matrix-Calc | Food | canningaltitude.io | 0.45 | 0.65 | 0.4 | 0.7 | 1.6 | 19 | INCUMBENTS verified (extension/.edu only, no clean calc); FDA cite floor; gap |
| 32 | Coffee Brew Ratio by Method | Calc+Ref | Food | (defer/fold) | 0.55 | 0.4 | 0.45 | 0.5 | 1.6 | 15 | INCUMBENTS verified (10+); fold into food fleet sub-tool |
| 33 | Form Field Count Optimizer | Calc+Ref | CRO/UX | formoptim.io | 0.4 | 0.65 | 0.35 | 0.55 | 1.6 | 16 | dev dogfood + Baymard cite, operator vertical |
| 34 | SEO Meta + Schema Inspector (shipped) | Tool | Dev/SEO | (existing) | 0.4 | 0.65 | 0.3 | 0.65 | 1.6 | 16 | live, dev dogfood, low AI-risk |
| 35 | Site Tech + Security Inspector (shipped) | Tool | Dev/SEO | (existing) | 0.4 | 0.65 | 0.4 | 0.6 | 1.6 | 15 | live, dev dogfood |
| 36 | Web Vitals Explorer (shipped) | Tool | Dev/SEO | (existing) | 0.4 | 0.6 | 0.35 | 0.55 | 1.6 | 14 | live, dev dogfood, narrow query |
| 37 | MRR Growth Calculator | Calc+Ref | SaaS | mrrgrowth.io | 0.45 | 0.55 | 0.5 | 0.45 | 1.6 | 14 | SaaS founder weekly use, fleet-fit |
| 38 | Checkout Friction Calculator | Calc+Ref | CRO | (sub of crotool.com) | 0.4 | 0.6 | 0.4 | 0.55 | 1.6 | 15 | Stripe-adjacent, dev dogfood, fleet-fit max |
| 39 | Color Palette Combinations (live) | Generator | Design | colorcombinations.org | 0.45 | 0.55 | 0.45 | 0.5 | 1.6 | 14 | live 2k UV, design RPM tier moderate |
| 40 | LLM Cost Per Token Comparator | Comparator | AI/Dev | llmcost.io | 0.5 | 0.6 | 0.45 | 0.65 | 1.4 | 18 | INCUMBENT-CHECKED 2026-04-23 (artificialanalysis lmarena livebench); cost-adjusted angle differentiated |
| 41 | LLM Latency × Quality Frontier | Comparator | AI/Dev | llmfrontier.io | 0.45 | 0.65 | 0.45 | 0.7 | 1.4 | 18 | per-task pareto frontier, fresh angle vs leaderboards |
| 42 | LLM Self-Hosted vs API Cost Calc | Calc | AI/Dev | (sub of llmcost) | 0.4 | 0.65 | 0.45 | 0.65 | 1.4 | 16 | inference cost amortization, infra-aware |
| 43 | LLM Context Window Comparison | Comparator | AI/Dev | (sub of llmcost) | 0.4 | 0.6 | 0.5 | 0.5 | 1.4 | 12 | quick to build, modest moat |
| 44 | LLM API Pricing Change Tracker | DB | AI/Dev | (sub of llmcost) | 0.35 | 0.7 | 0.3 | 0.7 | 1.4 | 14 | freshness premium, time-series moat |
| 45 | OpenAI Custom GPT Top Lists by Vertical | DB | AI | (defer) | 0.4 | 0.55 | 0.5 | 0.4 | 1.4 | 9 | low moat, OpenAI store volatile |
| 46 | Embedding Model Cost × Quality | Comparator | AI/Dev | (sub of llmcost) | 0.35 | 0.7 | 0.4 | 0.65 | 1.4 | 13 | dev pain, MTEB cite floor |
| 47 | TXT Feed RSS aggregator (live) | Tool | Dev | txtfeed.com | 0.35 | 0.65 | 0.3 | 0.5 | 1.6 | 11 | live, niche dev tool |
| 48 | Beams.page (live) | Tool | Dev | beams.page | 0.35 | 0.6 | 0.35 | 0.5 | 1.6 | 10 | live, observe ramp |
| 49 | Calibrationledger (live) | DB | Dev | calibrationledger.com | 0.35 | 0.7 | 0.3 | 0.6 | 1.6 | 12 | live, niche |
| 50 | ZipRadar (live) | Tool | Geo | zipradar.org | 0.4 | 0.6 | 0.35 | 0.55 | 1.6 | 12 | live, geo-data play |
| 51 | HeyBabel translation tool (live) | Tool | Lang | heybabel.com | 0.45 | 0.5 | 0.5 | 0.45 | 1.6 | 12 | live 2k UV, AI-translation crowded |
| 52 | Amili AI tool (live) | Tool | AI | amili.ai | 0.4 | 0.5 | 0.55 | 0.4 | 1.6 | 9 | live 1k UV, .ai TLD penalty, AI-content discounted |
| 53 | Industry RPM Benchmark by Vertical | Benchmark | Adtech | rpmbench.io | 0.4 | 0.7 | 0.3 | 0.7 | 1.4 | 16 | publisher-niche, vertical RPM data, audience = operator-peer |
| 54 | AdSense vs Mediavine vs Ezoic Comparator | Comparator | Adtech | adstack.io | 0.4 | 0.7 | 0.3 | 0.65 | 1.4 | 15 | operator dogfood, fleet-fit max, evergreen |
| 55 | Cloudflare Pay-Per-Crawl Earnings Tracker | DB | Adtech | (defer) | 0.3 | 0.75 | 0.25 | 0.6 | 1.4 | 12 | nascent vertical, freshness, narrow audience |
| 56 | TollBit Publisher Earnings Comparator | DB | Adtech | (defer) | 0.3 | 0.75 | 0.25 | 0.6 | 1.4 | 12 | nascent vertical, evergreen |
| 57 | Foreign Stock Dividend Withholding Lookup | Matrix-DB | Finance | divwht.io | 0.4 | 0.5 | 0.45 | 0.6 | 1.4 | 13 | INCUMBENTS verified (whtcalculator topforeignstocks); 2026 freshness gap on rate changes |
| 58 | Crypto Tax Lot Calc by Country | Matrix-Calc | Finance | (defer YMYL) | 0.45 | 0.5 | 0.4 | 0.55 | 1.0 | 11 | YMYL drag, country-specific, regulatory churn |
| 59 | Embeddable Calculator Widget Library | DB | Dev | embedlib.io | 0.35 | 0.7 | 0.3 | 0.55 | 1.4 | 13 | own-fleet feed-back loop, fleet eats own dogfood |
| 60 | Marathon Pace by Race + Elevation | Matrix-Calc | Sport | racepace.io | 0.5 | 0.5 | 0.45 | 0.55 | 1.4 | 14 | distance × elev × pace grid, share-card friendly |
| 61 | Endurance Fueling Calculator | Calc+Ref | Fitness | fuelcalc.io | 0.45 | 0.55 | 0.45 | 0.5 | 1.4 | 13 | event×weight×pace, sport RPM moderate |
| 62 | Material Quantity Calc (tile/drywall/concrete) | Matrix-Calc | DIY | matcalc.io | 0.55 | 0.6 | 0.4 | 0.45 | 1.4 | 16 | mass-market, low AI-risk for compound calcs |
| 63 | Planting Calendar by Zip × Plant | Matrix-DB | Garden | plantcal.io | 0.5 | 0.65 | 0.4 | 0.7 | 1.4 | 18 | zip × plant × frost, USDA cite, seasonal |
| 64 | Reading Time Calc (Book × WPM) | Matrix-Calc | Books | (sub of readinglist) | 0.5 | 0.55 | 0.5 | 0.45 | 1.6 | 14 | book × WPM grid, low moat, fold into readinglist |
| 65 | Textbook Reading Level + Time Estimator | Matrix-Calc | Edu | (sub of readinglist) | 0.45 | 0.65 | 0.4 | 0.55 | 1.6 | 16 | grade × WPM × subject, back-to-school |
| 66 | AP/IB/Honors Reading Time Calc | Matrix-Calc | Books+Edu | (sub of readinglist) | 0.4 | 0.7 | 0.35 | 0.55 | 1.6 | 16 | course × reading-speed, seasonal |
| 67 | Plant Hardiness Zone × Plant Database | Matrix-DB | Garden | hardyplants.io | 0.45 | 0.7 | 0.4 | 0.7 | 1.4 | 18 | USDA zones × plant survival, finite, evergreen |
| 68 | Companion Planting Database | Matrix-DB | Garden | companionplant.io | 0.45 | 0.7 | 0.35 | 0.7 | 1.4 | 19 | plant × plant compatibility grid, finite, fresh angle |
| 69 | Frost Date Lookup by Zip | Matrix-DB | Garden | frostdate.io | 0.45 | 0.65 | 0.4 | 0.55 | 1.4 | 14 | NOAA zip data, seasonal traffic spike |
| 70 | Grade Level Equivalence Cross-Country | Comparator+DB | Edu | gradelevel.io | 0.4 | 0.7 | 0.45 | 0.7 | 1.4 | 17 | country×grade×age, finite OECD data |
| 71 | College Major to Career Earnings DB | Matrix-DB | Edu | majorcareer.io | 0.45 | 0.6 | 0.4 | 0.55 | 1.4 | 14 | BLS data refresh annual, mass audience |
| 72 | Aspect Ratio Calc for Social Platforms | Matrix-DB | Design | (defer/fold) | 0.5 | 0.45 | 0.55 | 0.4 | 1.6 | 9 | platform × content × size grid, AI-Ov risk |
| 73 | Typography Pairing Database | DB | Design | typairs.io | 0.4 | 0.7 | 0.3 | 0.65 | 1.4 | 16 | examples > descriptions, low AI-risk |
| 74 | Microinteraction Library by Component | DB | UX | microlib.io | 0.4 | 0.65 | 0.35 | 0.55 | 1.4 | 13 | examples > descriptions, dev dogfood |
| 75 | Design System Token Comparison | Comparator | Design | tokendiff.io | 0.4 | 0.65 | 0.3 | 0.6 | 1.4 | 14 | dogfood + design-system datasets |
| 76 | Landing Page Teardown Database | DB | CRO | landingteardown.com | 0.45 | 0.65 | 0.3 | 0.7 | 1.6 | 19 | per-company teardown, evergreen, operator vertical |
| 77 | Hero Section Pattern Library | DB | CRO | herolib.io | 0.4 | 0.7 | 0.3 | 0.6 | 1.4 | 15 | examples > descriptions, evergreen |
| 78 | Onboarding Flow Database | DB | CRO/UX | onboardingdb.io | 0.4 | 0.7 | 0.3 | 0.65 | 1.4 | 16 | per-app teardown, dev dogfood |
| 79 | Empty State Pattern Library | DB | UX | emptystate.io | 0.35 | 0.75 | 0.25 | 0.6 | 1.4 | 14 | examples > descriptions, narrow but loved |
| 80 | Modal/Popup Timing Calculator | Calc+Ref | CRO/UX | (sub of crotool) | 0.35 | 0.65 | 0.4 | 0.45 | 1.6 | 11 | dev dogfood, narrow query |
| 81 | UX Research ROI Calc | Calc+Ref | CRO/UX | (sub of crotool) | 0.4 | 0.6 | 0.4 | 0.45 | 1.6 | 11 | dev dogfood, dev/UX RPM |
| 82 | Usability Test Participant Calc | Calc+Ref | CRO/UX | (sub of crotool) | 0.4 | 0.6 | 0.45 | 0.45 | 1.6 | 10 | dev dogfood, narrow |
| 83 | Visa/Immigration Path Matcher | Matrix-DB | Legal/Travel | visapath.io | 0.5 | 0.55 | 0.45 | 0.6 | 1.0 | 13 | per-country×per-visa, legal disclaimer, MEDIUM effort |
| 84 | Property Tax Calc by Location | Matrix-Calc | Finance | (defer) | 0.55 | 0.35 | 0.55 | 0.45 | 1.4 | 9 | INCUMBENTS verified (Zillow, Tax Foundation, taxbycounty); SERP filter near-fail |
| 85 | Rent vs Buy Calculator by City | Matrix-Calc | RealEst | (defer) | 0.55 | 0.4 | 0.55 | 0.4 | 1.0 | 9 | NYT incumbent dominant, AI-Ov risk |
| 86 | Pet Insurance Quote by Breed + Age | Matrix-Calc | Pets/Fin | petinsq.io | 0.45 | 0.55 | 0.45 | 0.5 | 1.0 | 10 | breed × age × coverage, MEDIUM effort, Finance RPM |
| 87 | Dog Breed Compatibility Calc | Matrix-Calc | Pets | breedmatch.io | 0.5 | 0.65 | 0.4 | 0.55 | 1.4 | 16 | household × breed × trait, evergreen |
| 88 | Cat/Dog Food Amount Calc | Matrix-Calc | Pets | (defer/fold) | 0.5 | 0.5 | 0.55 | 0.45 | 1.6 | 11 | weight × age × food, AI-Ov risk |
| 89 | Electricity Cost Calc by Appliance | Matrix-Calc | Home | applianceuse.io | 0.55 | 0.6 | 0.5 | 0.5 | 1.4 | 16 | appliance × usage × rate, EIA cite |
| 90 | Heart Rate Zone Calculator | Calc+Ref | Sport | (skip - AI-Ov) | 0.5 | 0.5 | 0.55 | 0.4 | 1.6 | 11 | age×method×zone, AI-Ov risk borderline |
| 91 | Running Pace by Race Calc | Calc+Ref | Fitness | runpace.io | 0.5 | 0.5 | 0.5 | 0.5 | 1.4 | 12 | distance × pace × HR, common but compound |
| 92 | Cycling Power/FTP Calc | Calc+Ref | Fitness | ftpcalc.io | 0.4 | 0.6 | 0.45 | 0.45 | 1.4 | 11 | weight × test × zone, niche |
| 93 | 1RM Multi-Formula Calculator | Comparator | Sport | onerepmax.io | 0.45 | 0.5 | 0.5 | 0.35 | 1.6 | 9 | formula × lift, low moat, AI-Ov risk |
| 94 | Calisthenics Progression Planner | DB | Sport | calistheny.io | 0.4 | 0.7 | 0.35 | 0.55 | 1.4 | 14 | skill × progression × milestone map |
| 95 | Running Shoe Matcher | Matrix-DB | Sport | shoematch.io | 0.45 | 0.55 | 0.45 | 0.6 | 1.4 | 13 | foot × gait × use-case, RTAilers cite |
| 96 | Home Gym Builder Calc | Matrix-Calc | Sport | homegymplan.io | 0.45 | 0.65 | 0.35 | 0.5 | 1.4 | 14 | space × budget × goal grid |
| 97 | 3D Printing Time + Filament Calc | Matrix-Calc | DIY | filacalc.io | 0.4 | 0.65 | 0.4 | 0.5 | 1.4 | 12 | size × filament × speed grid |
| 98 | Woodworking Cut/Cost Calc | Matrix-Calc | DIY | boardfeet.io | 0.4 | 0.65 | 0.4 | 0.55 | 1.4 | 13 | species × dimension × cost |
| 99 | EditNative (operator email + content) | TBD | Mixed | editnative.com | 0.35 | 0.6 | 0.4 | 0.45 | 1.4 | 9 | operator email host; if content shipped, retrofit Phase 0 |
| 100 | BeamsPage extensions | Tool | Dev | beams.page (extend) | 0.35 | 0.65 | 0.3 | 0.55 | 1.6 | 11 | live, observe SERP signals before extending |

**Diversity check:** Calc/Gen 42 · DB/Lookup 22 · Comparator 16 · Benchmark 4 · Reference/Tool 16. Verticals: Finance 12 · Food 8 · Edu 9 · Dev/SEO 12 · Garden 4 · Sport 6 · CRO/UX 11 · Design 5 · Legal 3 · Adtech 4 · AI/LLM 7 · Home/Energy 4 · Pets 3 · DIY 3 · Travel 2 · Geo 1 · Wedding 1 · Body 1 · Career 1 · RealEst 1 · Lang 1 · Mixed 1. Diversity quotas met.

---

## Top 10 — deep dive

**1. HoldLens (extend, not rebuild) — APS 62.** Live at 5.23k UV/mo, operator-declared "most successful." 10-archetype stack on per-investor pages. v5 highest because: live + AVM 1.6× (8 sub-domain extensions are direct replays — `/insiders/`, `/8k/`, `/13d/`, `/proxies/`, `/bankruptcy/`, `/enforcement/`, `/filings/`, `/forecasts/`). Every extension reuses the same pipeline → 0.5-1 brain day each. Single-site path to €45k Y1 midpoint per PLAN_V4. **Action: continue per PLAN_V4 build cadence.**

**2-3, 5, 8-9. SEC sub-extensions (Form 4 / 8-K / 13D / 14A / Ch11) — APS 27-41.** All score within HoldLens orbit. Each is 0.5-1 brain day playbook replay. Combined Y1 €15-25k. Lower-than-#1 because each adds incremental traffic on top of HoldLens base; not standalone.

**4. ReadingList.school (extend) — APS 36.** Live, dormant compounding, back-to-school seasonal. Sub-extensions (Reading Time by Book, AP/IB Time, Textbook Time) score 14-16 on their own but >25 when stacked under existing readinglist domain.

**6. Foreign Lang Graded Reader Matcher — APS 33.** Sleeper. Finite dataset (~500 graded readers across CEFR/A1-C2 × 8 major target langs). Low SERP density (mostly Goodreads/Amazon — neither is a focused matcher). Books+Edu RPM tier moderate. Operator-adjacency low but build-effort minimal. **Strong new-build candidate.**

**7. Sous Vide Time/Temp DB — APS 29 (DOWN from v2.1's 33).** WebSearch confirmed 5+ established incumbents (Anova, ChefSteps, Douglas Baldwin, AmazingFoodMadeEasy). SERP rated 0.55 not 0.85. Still buildable on programmatic depth (meat × thickness × doneness × temp × time × pasteurization = 5-way matrix), but requires 200+ unique pages to differentiate. **Build only if operator accepts 6-12 month ramp.**

**10. Foreign Language Level Equivalence — APS 27.** CEFR × ACTFL × DELF × HSK × TOPIK × JLPT crosswalk = finite, evergreen. Low incumbent depth (academic PDFs; not interactive). Operator-time-light. Education RPM tier modest but predictable. **Strong candidate for Q3 fleet expansion.**

---

## Cuts from v2.1 (with reason)

| v2.1 # | Concept | v2.1 APS | Cut reason |
|---:|---|---:|---|
| 2 | Dividend Tax Calc by Country | 35 | WebSearch: whtcalculator.com + topforeignstocks + KPMG = saturated incumbents. v5 demoted to #57, APS 13 |
| 4 | BBQ/Smoking Cook Time Calc | 32 | WebSearch: 10+ direct calculators (BBQ Cook Time, Destination BBQ, Kitchen Sizzlers, Meat Smoking Calc). SERP saturated. Cut from top 50 |
| 5 | Freelance Rate Calc by Country | 31 | WebSearch: Jobbers.io 2026 Index already published, secondtalent.com per-role-and-country sites live. SERP saturated. Cut from top 50 |
| 7 | Payment Processor Fee Calc | 30 | WebSearch: feecalculator.pro + globalfeecalculator + Spark Money + 5 others. SERP fully covered. Cut |
| 9 | Pizza Dough Calc | 29 | WebSearch: 10+ calculators (Flourwise, HomePizzaMaker, GigaCalc, PizzaBlab, etc.). SERP saturated. Demoted to #17 only because dogfood-real candidacy still possible |
| 12 | Fermentcalc | 26 | NOT cut — kept at #16 (live, fleet asset) but APS recalibrated against actual brine-calc SERP saturation |
| 22 | Coffee Brew Ratio | 22 | WebSearch: 10+ incumbents (Handground, CoffeeBros, GigaCalc, Calculator.coffee). Demoted to #32; recommend fold-in not standalone |
| 39 | 401k Contribution Calc | 18 | WebSearch: Bankrate, NerdWallet, Calculator.net, Vanguard, Fidelity all live. Hard cut |
| 41 | Rent vs Buy by City | 17 | NYT calculator + Zillow + 6 others. Demoted to #85, APS 9 |
| 44 | Property Tax Calc by Location | 17 | WebSearch: Tax Foundation + Zillow + taxbycounty. SERP-filter near-fail. Demoted to #84 |
| 51 | Modal/Popup Timing Calc | 15 | Niche dogfood preserved as crotool sub-tool, demoted to #80 |
| 64 | IRA vs Roth IRA Decision Tool | 14 | AI-Ov risk + Bankrate/NerdWallet incumbents. Hard cut |
| 96-100 | Mortgage Calc, Refi Break-Even, Emergency Fund, Debt Payoff, Credit Card Interest | 7-8 | All AI-Ov-eaten + DR85+ incumbents. Hard cut |

---

## Promotions into top 25 (v2.1 → v5)

| Concept | v2.1 rank | v5 rank | Why promoted |
|---|---:|---:|---|
| HoldLens sub-extensions (Form 4, 8-K, 13D, 14A, Ch11) | not separately ranked | #2-3, 5, 8-9 | Each is direct replay of HoldLens path; AVM 1.6× compounds on existing brand |
| Foreign Lang Graded Reader Matcher | #37 | #6 | Sleeper finite-dataset; verified low SERP density; high moat per question's "what makes graded readers truly comparable" being non-trivial |
| Foreign Language Level Equivalence | #29 | #10 | Same niche; CEFR×ACTFL crosswalk is reference table that LLMs cite |
| Conversion Rate Benchmark by Vertical | #14 | #13 | Already live; minor preserve |
| Pickling Brine Calc | #15 | #14 | Re-classified as Fermentcalc sub-tool, APS preserved |
| Lease Deadline Tracker (CRE) | not ranked | #27 | New entry — WebSearch revealed enterprise B2B incumbents but solo-founder gap; legal RPM tier |
| LLM Cost Per Token Comparator | not ranked | #40 | New entry — incumbent-checked; cost-adjusted angle differentiated from artificialanalysis.ai |
| LLM Latency × Quality Frontier | not ranked | #41 | Companion to #40, per-task pareto |
| Companion Planting Database | not ranked | #68 | New entry — finite plant×plant grid, no clean incumbent |
| Plant Hardiness Zone × Plant DB | not ranked | #67 | New entry — USDA data + plant survival, finite |
| Embeddable Calculator Widget Library | not ranked | #59 | New entry — own-fleet feedback loop, fleet eats own dogfood |
| Industry RPM Benchmark by Vertical | not ranked | #53 | New entry — operator-peer audience, niche advertising data |
| AdSense vs Mediavine vs Ezoic Comparator | not ranked | #54 | New entry — operator dogfood + fleet-fit max |

---

## Honest gaps

1. **Zero-revenue calibration risk.** Fleet is at €0 actual revenue (per status reports). The 5 v2.1 calibration anchors (HoldLens 47, etc.) are still PROJECTED, not measured. Until first €100 hits AdSense from any single fleet site, every APS is a hypothesis. v5 weights AVM heavily because **build-velocity is the only thing AcePilot CONTROLS** — revenue is downstream of SEO ramps the brain can't accelerate.

2. **AI-Overview risk inflation could be even higher than v2.1 estimates.** WebSearch validation showed AI Overview eating queries faster than 2025 measurements. By Y2, AI-Ov risk on all `<calculator>` queries may be ≥0.6 across the board. v6 should re-rate.

3. **SERP-saturation worse than v2.1 said.** Of 12 borderline concepts WebSearched, 9 had ≥5 established incumbents. v2.1's `serp_beat` scores were ~0.15-0.25 too generous on average. Pizza dough, sourdough hydration, brew ratios, BBQ smoking, payment fees, dividend tax, property tax, NDA scanners, alternatives-to dirs, freelance rates — ALL more saturated than scored.

4. **HoldLens extension stack is 50% of total fleet APS.** #1, #2, #3, #5, #8, #9 are all HoldLens. Concentrated risk: if HoldLens doesn't break Mediavine threshold, the whole AVM-1.6× extension path discounts proportionally. **Operator should stress-test HoldLens revenue assumption before stacking 8 more sub-domains.**

5. **No replay benchmark for AVM yet.** AVM 1.6× is operator's stated belief that AcePilot ships matrix-replays in 0.5-2 brain days. Not yet observed on a non-HoldLens fleet site (sourdough/fermentcalc shipped slower than 2 days during initial build phases). v6 should recalibrate AVM after 3 confirmed sub-2-day matrix-replays land.

6. **Domain availability not verified.** Domain hints in column 5 (`.io` defaults) are placeholder; ~30% will be taken. Each will need 5-10 alternative checks per FINAL_SHORTLIST.md flow.

7. **Operator time finite (~17h/wk per PLAN_V4).** Top 100 has 100 build candidates but realistic Y1 ship cap is ~6-10 new sites at most. v5 ranking prioritizes which 10 to pick, not which 100 to plan.

---

## Next operator action (single most-leveraged)

Per PLAN_V4 Week 1 + status-report-honesty rule:

**🔴 REQUIRED — Apply Mediavine Journey to HoldLens THIS WEEK.** Single biggest revenue lever in fleet. €4-15k Y1 lift. ~30 min operator time. No new domain spend. No new AcePilot work. The entire v5 ranking's value depends on whether HoldLens monetization activates — every sub-extension (#2-3, 5, 8-9 = ~APS 175 combined) compounds on top of a working RPM tier. If HoldLens stays at AdSense baseline, the whole HoldLens stack discounts ~40%.

After Mediavine activated → ship #6 (Foreign Lang Graded Reader Matcher) AND #10 (Foreign Lang Level Equivalence) as a paired Edu fleet-pod. Both AVM 1.6× direct replays of readinglist.school playbook. Combined ~3-5 brain days. Counter-seasonal to fall food fleet.

---

## Methodology notes

- **APS computation:** all concepts run through identical formula. Differences between concepts come from input differences, not formula tweaks.
- **AVM addition:** v5 unique. Reflects that for 13-site fleet operator with AcePilot-as-shipping-engine, build velocity IS a moat. Concepts where AcePilot can ship in 1-2 days (matrix-programmatic finite-public-dataset, static export) get 1.6× boost. Operator-time-bound concepts (Wikipedia, podcast, HARO) get 1.0× — those don't compound from AcePilot.
- **±25% absolute-APS uncertainty preserved.** APS 18 vs APS 22 difference is noise. Trust tier bands (S 30+, A 20-29, B 13-19, C <13).
- **WebSearch validation is partial** — 12 of ~40 borderline candidates checked. Future v5.1 should validate remaining ~28 via batched WebSearch run.

---

*End of BEST_OF_BEST_TOP100_v5.md. Recalibrate when (a) HoldLens hits €1k/mo revenue, (b) any 3 fleet sites cross 1k Plausible sessions/mo, (c) v6 methodology bumps.*
