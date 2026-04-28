# AceUserGrowth v3 — the complete user-action + growth-engineering framework (2026-04-18)

**Alias in the fleet:** AceUserGrowth · AUG · aceusergrowth. This file is the canonical user-growth playbook for every fleet site.

## Quick Navigation (v19.26 added)

**Acquisition (v1):** [Part 0 — TL;DR](#part-0--tldr) · [Part 1 — Strategic frame](#part-1--the-strategic-frame) · [Part 2 — 40+ channels](#part-2--the-full-channel-taxonomy-40-channels-detailed) · [Part 3 — Per-site channel mix](#part-3--per-site-channel-mix-recipes) · [Part 4 — 90-day sequencing](#part-4--90-day-new-site-sequencing) · [Part 5 — Measurement](#part-5--measurement--calibration) · [Part 6 — Anti-patterns](#part-6--anti-patterns--hard-no-list-i-34-immutable) · [Part 7 — Integration](#part-7--integration-with-fleet-methodology) · [Part 8 — Meta-principles](#part-8--the-meta-principles)

**AAERA Funnel (v2):** [Part 9 — Activation](#part-9--activation-first-session-conversion) · [Part 10 — Engagement](#part-10--engagement-depth-of-session) · [Part 11 — Retention](#part-11--retention-return-visits--cohort-behavior) · [Part 12 — Advocacy](#part-12--advocacy-shares-referrals-viral-loops) · [Part 13 — AUG Score 5-factor](#part-13--the-aug-score-composite-user-growth-health-0-100) · [Part 14 — Instrumentation](#part-14--instrumentation-catalog-every-metric-ready-to-copy) · [Part 15 — Operator cadence](#part-15--aaera-per-stage-operator-cadence) · [Part 16 — Deep principle](#part-16--the-deep-principle-why-aaera-matters-more-than-acquisition-alone)

**Growth-Engineering (v3):** [Part 17 — Monetization](#part-17--monetization-user--the-layer-that-pays-for-everything-else) · [Part 18 — Segmentation](#part-18--segmentation-averages-lie) · [Part 19 — Experimentation](#part-19--experimentation-framework-proving-cause--effect) · [Part 20 — Qualitative](#part-20--qualitative-signals-what-quant-cant-see) · [Part 21 — Performance multiplier](#part-21--performance-as-a-growth-multiplier) · [Part 22 — AAERA flywheel](#part-22--the-aaera-flywheel-compound-loops) · [Part 23 — LLM-visitor](#part-23--llm-visitor-behavior-emerging-2026) · [Part 24 — Anti-fragility](#part-24--anti-fragility-surviving-algorithm--platform-shifts) · [Part 25 — AUG Score v3 (7-factor)](#part-25--aug-score-v3-7-factor-composite) · [Part 26 — Complete growth-engineering loop](#part-26--the-complete-growth-engineering-loop)

**Common entry points by use-case:**
- New site Day 1 wiring → Part 14 (Instrumentation Catalog)
- AUG audit / fix gaps → Part 25 (AUG Score v3) + per-stage Parts 9-12
- Channel selection for site → Part 3 (Per-site channel-mix recipes)
- Why is traffic flat? → Part 24 (Anti-fragility) + Part 5 (Measurement)
- LLM/AI crawler optimization → Part 23 (LLM-Visitor Behavior)
- Performance-cliff → Part 21 (Performance Multiplier)

---


**What changed in v3:** v1 covered channels (acquisition). v2 added AAERA (what users do once they arrive). v3 answers the deepest question yet: **how do we PROVE what causes growth and systematically engineer more of it?**

v3 shifts from "measuring growth" to "engineering growth." Adds:
- Part 17 — **MONETIZATION** ($/user for ads-fleet; RPM science; placement psychology)
- Part 18 — **SEGMENTATION** (why averages lie; segment-level analysis per AAERA stage)
- Part 19 — **EXPERIMENTATION FRAMEWORK** (MDE, sample size, run-time, winner rules; what's real vs. noise)
- Part 20 — **QUALITATIVE SIGNALS** (surveys, interviews, session recordings — what quant can't see)
- Part 21 — **PERFORMANCE AS GROWTH MULTIPLIER** (Core Web Vitals impact on every AAERA stage)
- Part 22 — **THE AAERA FLYWHEEL** (the 5 compound loops that connect stages)
- Part 23 — **LLM-VISITOR BEHAVIOR** (emerging — GPTBot/ClaudeBot/PerplexityBot/GoogleOther read differently than humans)
- Part 24 — **ANTI-FRAGILITY** (surviving Google HCU, AI Overview eats, platform-policy shifts)
- Part 25 — **AUG SCORE v3** (7-factor composite — Acquisition × Activation × Engagement × Retention × Advocacy × Monetization × Performance)

All v1 + v2 content preserved. v3 is purely additive.

**Companion to:** [`concept-finder-methodology.md`](./concept-finder-methodology.md) v2.1.1. Methodology picks WHICH concept to build. AceUserGrowth picks HOW to grow users — across every stage of the user journey + how to prove cause-and-effect.

**Historical:**
- v1 (2026-04-18): acquisition playbook, 90+ channels · originally named "Distribution Playbook v1.0"
- v2 (2026-04-18, same day): full user-action framework, AAERA funnel, AUG Score 5-factor
- v3 (2026-04-18, same day): growth-engineering layer, AUG Score 7-factor, flywheel diagrams

**Operator directives:**
- 2026-04-18: *"besides seo, GEO, AEO, what other ways are the best to get users to your website? longer better deeper, more details. i want to be able to use this for any site"* → v1
- 2026-04-18: *"Call this AceUserGrowth v1"* → rename
- 2026-04-18: *"make v2. think deep about users actions, like users engagement, pageviews, time on page and such"* → v2
- 2026-04-18: *"make v3"* → v3 (growth-engineering layer)

---

## v2 — The AAERA Funnel (deep user-action framework)

v1 covered Acquisition in depth (90+ channels, 16 categories). v2 extends the model to every stage a user moves through. Every fleet site must instrument and optimize across **all five stages** — a leak in any stage collapses the whole funnel.

```
ACQUISITION  →  ACTIVATION  →  ENGAGEMENT  →  RETENTION  →  ADVOCACY
  (v1)          (first-         (depth of       (return         (share +
                  session)         session)      rate)          refer)
  90+ channels    ≤10s TTFV      PV, time,      D7, D30,       k-factor,
  → visitor       + first           scroll,      cohort,        embeds,
                  action           events       core-loop      word-of-mouth
```

### The compound mechanism

Each stage feeds the next. A site with:
- 10,000 visitors/mo acquisition (v1)
- 40% activation rate (users take first meaningful action)
- 3.2 pageviews/session engagement (vs 1.2 baseline)
- 28% D7 return rate (vs 8% baseline)
- 1.15 advocacy k-factor (each user brings 0.15 new users)

...compounds to **~2× acquisition volume over 6 months** with zero additional channel investment. That's the AAERA leverage. v1 alone would give you 10k/mo forever. v2 lets the 10k/mo become 20k/mo through funnel mechanics.

### The 5-stage failure cost

| Stage | If broken | Cost |
|---|---|---|
| Acquisition | 100 users/mo instead of 10k | Never gets signal to optimize anything else |
| Activation | Users leave within 10s | Paid attention wasted; SEO bounce signal kills rankings |
| Engagement | Bounce rate 85%+ | Google HCU penalty; ad RPM tanks (low time-on-page); no data to personalize |
| Retention | 2% D7 return | Every week starts from zero; compounding = 0; need growth hacks to stand still |
| Advocacy | 0 shares | Zero viral loop; zero user-generated backlinks; zero LLM-citation-worthy recommendations |

The AAERA insight: **optimizing only acquisition is like filling a bucket with holes**. v2 lets you see and fix the holes.

---

**Binding scope:** every fleet site. Channels marked `v19.1-autonomous` are wired into the Autonomous Acquisition Engine (6 default modules + 12 FULL-auto channels + 8 scheduled tasks). Channels marked `operator-time` need your hands. Channels marked `HARD-NO` are I-34 immutable rejects.

---

## Part 0 — TL;DR

The 5 channels that produce 80% of organic growth for a new fleet site:

1. **Original research + unique dataset** (×+90 Distribution Oracle) — your data becomes the thing press + LLMs cite. HoldLens's 82-superinvestor composite is the archetype. Ship once, compounds for years.
2. **Embeddable widgets** (×+80) — your calculator lives on other people's blogs via iframe + backlink attribution. Each embed = permanent discovery channel.
3. **Wikipedia-sourced edits** (×+75) — your site cited as reference on topical Wikipedia pages. Stays indexed forever. Operator-time but one-time per page.
4. **Share-by-design per-result cards** (×+95) — every result page ships a branded 1200×630 PNG + pre-composed tweet. Every visitor becomes a potential amplifier.
5. **Community seed via Hacker News + Reddit + LinkedIn** (×+65-70) — one-shot spike (HN Show HN) + continuous drip (Reddit organic comments) + operator thought-leadership (LinkedIn zero-click). Builds both authority AND direct traffic.

Everything else in this playbook stacks on top. These 5 are table stakes.

---

## Part 1 — The strategic frame

### How to think about distribution

Distribution is not marketing. It's the **mechanical process of moving from "your site exists" to "users find it."** Four questions determine what works:

1. **Who is the user?** A developer finds you differently than a home baker or a hedge fund analyst. No universal channel exists.
2. **Where do they already hang out?** Your job is to meet them there, not pull them to a new platform.
3. **What problem do they have that your site solves?** The channel is whatever gets your solution into the problem-holder's line of sight.
4. **What's the compound mechanism?** Does this channel produce one visit, or does it keep producing visits for months/years with no additional effort?

### Leverage tiers — rank every channel by this

- **Autonomous (compound forever, zero operator time after setup):** embeddable widgets · plugin marketplaces · IndexNow · llms.txt · schema · RSS · canonical cross-posting · open-source repos · Wikipedia citations once landed
- **Operator-time-required (high authority, one-shot or recurring-but-scheduled):** Wikipedia edits · HN Show HN · Reddit organic · LinkedIn posts · podcast guesting · HARO pitches · annual reports · conference talks
- **Paid (skip unless explicitly green-lighted):** Google Ads · Meta Ads · LinkedIn Ads · newsletter sponsorships · influencer partnerships — **your fleet is 100%-ads monetized so paid acquisition is usually negative-margin**
- **Hard-no (invariant-locked via I-34):** auto-reply · auto-post-Reddit · auto-post-HN · auto-post-LinkedIn · auto-edit-Wikipedia · auto-submit-BetaList · PBNs · link schemes · cloaking · doorway pages

### The compound principle — one ship feeds many channels

A single thing you ship — say, an "annual report" — should simultaneously feed:
- SEO (its URL ranks for its topic)
- GEO (LLMs cite it)
- Press (journalists quote it)
- Social (you post key findings in threads)
- Newsletter (you excerpt it)
- Partnership (you offer it to cross-promote)
- Wikipedia (you use it as a citation on relevant pages)
- HN (one-shot launch post)
- Reddit (cite it when answering relevant questions)
- Substack guests (you pitch other newsletters to syndicate excerpts)

**One artifact, 10 channels. That's the math of good distribution.**

### The 90% rule

For any given site, 90% of distribution traffic comes from 10% of channels. Your job is to find the 3-5 channels that will produce the 90% AS EARLY AS POSSIBLE and stop wasting effort on the rest. Calibrate by Week-4 / Week-8 / Week-16 audits. Kill channels that don't hit threshold by gate.

### Time vs money vs effort

- **Unlimited time + low money + high expertise (solo founder profile):** double down on autonomous compounding channels + high-authority earned-media (Wikipedia, HN, HARO). Skip paid.
- **Limited time + unlimited money:** different playbook. Paid acquisition + PR firm + SEO agency. Not your situation.
- **Limited time + limited money + high expertise:** autonomous channels first; one earned-media push per quarter (annual report → HN + press pitch). Skip social grind.

---

## Part 2 — The full channel taxonomy (40+ channels, detailed)

Grouped by category, ranked within each. Every channel gets: `what it is · how to use · best for · cost · timeline · success metric · operator time · Oracle multiplier · risk level`.

---

### § A — Search-based (SEO / GEO / AEO) — covered by concept-finder-methodology v2.1.1

**Already documented in depth at `~/.claude/rules/concept-finder-methodology.md` Layers 1-7.** Brief reminder: SEO (traditional organic search) + GEO (Generative Engine Optimization — getting cited by Claude/ChatGPT/Perplexity/Gemini) + AEO (Answer Engine Optimization — winning the featured snippet or AI Overview inline answer). These are the baseline channels for every fleet site. The rest of this playbook is what you add ON TOP of a working SEO/GEO foundation.

**Oracle archetype:** `ai_visibility_optimized_page × +70` (GEO) · `programmatic_unique_data_page × +100` (SEO with unique data) · `faq_schema_spam × -10` (AEO done wrong).

---

### § B — Autonomous content syndication

Write once, publish to multiple platforms with canonical tag. No SEO duplicate-content penalty because the canonical URL points to your site. Maximizes reach while preserving ranking signal.

#### B1. Dev.to canonical cross-post — `v19.1-autonomous`

- **What:** Write article on your site, publish to dev.to with `<canonical href="[your-site/post]">`. Dev.to's 1M+ dev audience sees it; Google credits your site as original.
- **How:** Copy article markdown → dev.to editor → set `canonical_url` in frontmatter → tag 3-4 relevant topics → publish.
- **Best for:** Dev tools, SaaS, developer-adjacent content. NOT food, finance, B2C.
- **Cost:** Free. ~5 min per post.
- **Timeline:** Discoverability within 24h; compounding traffic over 3-12 months.
- **Success metric:** ≥200 reads in first week = working; <50 = platform not your audience.
- **Operator time:** 5 min per article. v19.1 automates via `canonical-cross-post` scheduled task.
- **Oracle multiplier:** `canonical_cross_post × +35`.
- **Risk:** Low. Canonical tag fully supported.

#### B2. Hashnode canonical cross-post — `v19.1-autonomous`

- Same as Dev.to, but Hashnode's audience skews more international (EU + Asia heavy). Publish to both; they don't cannibalize each other because different audiences.
- **Multiplier:** `canonical_cross_post × +30`.

#### B3. Medium Import with canonical

- **What:** Medium's "Import Story" tool lets you copy any URL and preserve canonical. Medium has 100M+ monthly readers — most aren't dev.
- **How:** Medium app → "Write" → "Import a story" → paste your URL → publish. Canonical auto-set.
- **Best for:** Finance, health, productivity, long-form essays. NOT technical tutorials.
- **Cost:** Free. ~2 min per import.
- **Success metric:** ≥1000 views in first month = working.
- **Oracle multiplier:** `canonical_cross_post × +30` (broader audience than Dev.to for non-tech niches).

#### B4. LinkedIn Articles native

- **What:** Publish full article natively on LinkedIn (NOT a post with outbound link — a native article). LinkedIn Articles rank on Google and are trusted by LLMs as authoritative.
- **How:** LinkedIn profile → Create → Write article → publish. Include byline with brand + link in author bio.
- **Best for:** B2B, SaaS, CRO, finance, career, productivity. NOT food, hobby, parenting.
- **Operator time:** 30-60 min writing per article.
- **Oracle multiplier:** `linkedin_zero_click_framework_post × +65` (operator-time, not autonomous).
- **Risk:** Low. Native content loved by algorithm.

#### B5. Substack cross-post / guest essay

- **What:** Either own a Substack and cross-post from main site, OR pitch established Substacks in your niche to publish a guest essay with byline link.
- **How (guest):** Email 10-20 Substack writers in your niche with a specific essay pitch + headline + sample opening. Expect 5-10% accept rate.
- **Best for:** Annual reports, data-heavy analysis, opinion pieces.
- **Operator time:** ~2-4 hours per accepted pitch (the writing + revision).
- **Oracle multiplier:** `substack_guest_essay × +45`.
- **Risk:** Low-medium. Quality bar is high; rejections sting.

#### B6. Ghost cross-posts

- **What:** Ghost CMS supports members-only content + public posts. If you run a Ghost newsletter, cross-post site content there.
- **Best for:** Operator-owned newsletter strategy. Low priority for fleet sites without existing Ghost audience.

---

### § C — Community participation

These are the highest-trust signals in the distribution landscape. Algorithms + editors + LLMs all weight community validation heavily. But **all must be operator-human; automation = hard-no (I-34)**.

#### C1. Reddit organic helpful comments — `operator-time` · HIGHEST authority per hour

- **What:** Answer questions in subreddits adjacent to your site. When your data/tool genuinely helps, cite it naturally. NOT drop-and-run link spam.
- **How:**
  1. Pick 3-5 subreddits (e.g., for HoldLens: r/SecurityAnalysis, r/ValueInvesting, r/investing, r/stocks, r/financialindependence).
  2. Sort by "Rising" or "New" 2-3x per week.
  3. Find questions where your data/tool is the ANSWER.
  4. Write a full, substantive answer (3+ paragraphs). Cite your site ONCE, as one source among several.
  5. Include the direct URL + brief why-it-helps.
  6. Reply to follow-up questions. Build karma. Don't post links without substance.
- **Best for:** Every niche. Reddit is the most democratic + LLM-training-heavy platform.
- **Cost:** Free. 15-30 min per useful comment.
- **Timeline:** Karma takes 2-4 weeks; consistent useful comments compound into "that person knows their stuff" recognition.
- **Success metric:** ≥3 of your comments hit top-5 of their thread per month = working. ≥1 DM/week from user following up = strong.
- **Operator time:** 1-3 hours per week sustainable. More = risk burnout or drift into spam.
- **Oracle multiplier:** `reddit_organic_helpful_comment × +70`.
- **Risk:** Medium. Mod bans for self-promo are harsh; shadowbans hard to detect. Cure: comment:link ratio ≥10:1 (10 helpful non-self-citing comments per 1 self-cite).

#### C2. Hacker News Show HN — `operator-time` · one-shot spike

- **What:** Submit your shipped tool with "Show HN" prefix + brief description. If it hits front page, 5k-50k visitors in 48 hours.
- **How:**
  1. Wait until site is LIVE + polished + can handle traffic spike.
  2. Submit title: "Show HN: [Site name] – [one-line value prop, ≤60 chars total]"
  3. First comment (from submitter) should contain: what you built, why, stack, what's novel, what you learned. This seeds the discussion.
  4. Respond to every comment in first 4 hours. HN algorithm rewards engagement.
  5. Submit Tuesday-Thursday 6-9am PT for best visibility.
- **Best for:** Dev tools, SaaS, data/finance tools, anything "technically interesting." NOT food, parenting, hobbyist.
- **Cost:** Free. 4-6 hours of engagement window.
- **Timeline:** Front-page within hours or never (fails silently).
- **Success metric:** ≥100 upvotes = good launch · ≥500 = front page · ≥2000 = top of front page (rare, massive traffic).
- **Operator time:** ~6 hours day-of (monitoring + responding).
- **Oracle multiplier:** `hacker_news_show_hn × +70`.
- **Risk:** Low. Worst case: nobody notices. Best case: 5-30k visitors + permanent backlink that keeps ranking.

#### C3. Hacker News comments (ongoing)

- **What:** Comment on HN threads in your niche. Cite your data/tool when genuinely relevant. Same rules as Reddit.
- **Operator time:** 1-2 hours/week.
- **Multiplier:** bundled with `hacker_news_show_hn` but standalone ~×+30.

#### C4. Indie Hackers build-in-public — `operator-time`

- **What:** Post on Indie Hackers about your MRR progress, cycle learnings, lessons. Community rewards transparency.
- **How:**
  1. Create IH profile → link to main site.
  2. Post monthly MRR update + key metric.
  3. Comment on other makers' posts substantively.
  4. Post cycle lessons ("What I learned shipping X") — these rank on Google for "how I built X" queries.
- **Best for:** SaaS, info-products, indie makers. Less fit for pure-ads fleet sites.
- **Operator time:** ~2 hours/month.
- **Oracle multiplier:** `indie_hackers_build_in_public × +50`.

#### C5. Niche Discord / Slack communities — `operator-time`

- **What:** Join 3-5 niche Discord/Slack in your vertical. Be a substantive participant. Share your tool organically when relevant.
- **How:** Find via "[niche] discord" Google search or Reddit's /r/discord_servers. Rules vary per community; always read #rules before posting.
- **Operator time:** 30-60 min/day if you lurk + occasionally help.
- **Multiplier:** not in calibrated Oracle table; cold-start estimate ×+20-40 depending on community quality.
- **Risk:** Medium. Some communities ban self-promotion entirely. Respect their rules.

#### C6. Niche forums (old-school, still work)

- **What:** Phpbb-style forums still exist and have loyal audiences (for Sourdough: TheFreshLoaf.com; for Investing: BogleHeads.org; for Dev: specific subreddit-equivalents).
- **How:** Register, lurk 2-4 weeks, contribute substantively, cite tools when relevant.
- **Best for:** Niches with dedicated communities (food, finance, photography, woodworking).
- **Operator time:** 2-3 hours/week if you're serious.
- **Multiplier:** cold-start ×+25-40. Forums are HIGH-intent, low-volume.

#### C7. Circle communities (paid + free)

- **What:** Circle.so hosts creator-led communities. Many bestsellers in your niche run them.
- **How:** Join 1-2 in your niche. Participate. Sometimes becoming a speaker/expert is possible.
- **Risk:** Some require paid membership. Weigh against alternative channels.

---

### § D — Earned media / PR

Getting covered by journalists or newsletter writers. Compounds authority + brand recognition + inbound links.

#### D1. HARO (Help A Reporter Out) — `operator-time` · FREE + highest-ROI earned media

- **What:** 3x daily emails of journalist queries needing expert sources. Respond with a short, quotable answer + your bio + link. ~2-4% response rate from journalists.
- **How:**
  1. Sign up at helpareporter.com (now owned by Cision, Connectively). Free tier = 3 emails/day.
  2. Scan each email (5 min). Reply only to queries in your exact expertise.
  3. Response template: 3-sentence quotable quote + your title + your site + why you're qualified.
  4. Goal: 1-2 placements/month in tier-1 tech/finance/food press.
- **Best for:** Every niche where journalists write. Finance, tech, food, health, parenting — all high-volume.
- **Cost:** Free. 15 min/day to scan + ~5 min per response.
- **Timeline:** First placement usually within 4-8 weeks of regular participation.
- **Success metric:** ≥1 tier-1 placement per month.
- **Operator time:** ~2-3 hours/week.
- **Oracle multiplier:** `haro_qwoted_featured_pitch × +35`.
- **Risk:** Very low. Cost-of-participation minimal.

#### D2. Qwoted — `operator-time`

- **What:** Competitor to HARO. Slightly different journalist pool, higher quality queries.
- **How:** Same pattern. Some overlap with HARO but catches different journalists.
- **Multiplier:** `haro_qwoted_featured_pitch × +35` (counted together).

#### D3. Featured.com (paid)

- **What:** Paid alternative to HARO. Higher cost ($199/mo+) but better journalist curation.
- **When to use:** Only after HARO/Qwoted free tier proves concept works for your niche.

#### D4. Direct journalist cold-pitches

- **What:** Pitch a specific story with exclusive data to a specific journalist at a specific publication.
- **How:**
  1. Find 10 journalists who cover your space (Twitter bio "covers [X] at [pub]").
  2. Craft pitch: ≤150 words, lead with "I have original data on [X] — would you like exclusive first-look?"
  3. Attach ONE data visualization (charts are 3x more replied-to).
  4. Follow up ONCE after 1 week.
- **Best for:** Annual reports, unique dataset releases, newsworthy findings.
- **Operator time:** 2-3 hours per pitch cycle (research + writing + follow-up).
- **Multiplier:** when it works, massive. Tier-1 piece = ×+100-200 equivalent. But ~90% no-reply.
- **Risk:** Low reputation cost; high time cost.

#### D5. Industry press (niche publications)

- **What:** Specialty publications in your vertical (for Finance: Institutional Investor, Alpha magazine; for CRO: ConversionXL, Unbounce blog; for food: Serious Eats guest posts).
- **How:** Pitch as above but targeted to niche editors.
- **Multiplier:** `industry_press_feature × +45-65` depending on DA.

#### D6. Podcast guest appearances — `operator-time`

- **What:** Guest on niche podcasts where your expertise fits. Audio is powerful because LLMs now transcribe + cite.
- **How:**
  1. Find 20-30 niche podcasts via Listen Notes or Podchaser. Filter by ≥100 reviews.
  2. Pitch each with: specific episode topic + your unique angle + 3-bullet value prop.
  3. Expect 10-15% acceptance.
- **Best for:** Every niche. Particularly strong for finance, SaaS, CRO, productivity.
- **Operator time:** 2-3 hours per accepted episode (prep + recording). Pitch research separate.
- **Oracle multiplier:** `podcast_guest × +50`.
- **Risk:** Low. Worst case: small audience. Best case: 2-4x sustained traffic for weeks after.

---

### § E — Open-source + developer ecosystem

If your site has any API, calculator, or utility — you can package + distribute via developer-tool marketplaces. Each listing = permanent discovery channel.

#### E1. GitHub repo with brand-prefixed name — `v19.1-autonomous`

- **What:** Open-source a component, API wrapper, SDK, or example code under your brand's GitHub org. README links back to main site.
- **How:** Pick something genuinely useful (API SDK, schema validator, data-format parser). Publish with good README + examples + MIT license.
- **Best for:** Dev-adjacent fleet sites.
- **Multiplier:** `open_source_release_brand_prefixed × +90`.
- **Compound:** GitHub stars signal authority; forks create backlinks; "npm install" hits become steady traffic.

#### E2. npm package — `v19.1-autonomous`

- **What:** Publish reusable package to npm with `homepage` field pointing to your site.
- **How:** `npm init` → `npm publish`. Ensure `package.json` has `homepage: "https://[site]"` + `repository` field.
- **Best for:** Any site with a JS API, schema, or utility function.
- **Example:** `npm install fermentcalc-brine-math` for Fermentcalc's brine formula as a reusable math function.
- **Multiplier:** `plugin_marketplace_ambient × +90`.

#### E3. VS Code Marketplace extension — `v19.1-autonomous`

- **What:** Publish a VS Code extension that surfaces your data/tool inline in the editor.
- **Best for:** Dev tools, CRO/schema, SEO, technical writing.
- **Example:** Schema-Inspector extension shows JSON-LD schema suggestions as you type; links to your site for deeper validation.
- **Multiplier:** `plugin_marketplace_ambient × +90`.

#### E4. Chrome Web Store extension

- **What:** Browser extension surfaces your data overlaid on relevant sites.
- **Example:** HoldLens extension shows 13F holdings on Yahoo Finance ticker pages; deep-links to HoldLens site.
- **Operator effort:** 1-2 weeks first extension; subsequent ones ~2-3 days each. Re-use manifest patterns.
- **Multiplier:** `plugin_marketplace_ambient × +90`.
- **Risk:** Chrome review can take 1-4 weeks first time. Follow extension guidelines strictly.

#### E5. Firefox Add-ons

- **What:** Mozilla's store. Smaller audience than Chrome but 10% of extension users; worth 30 min to port.

#### E6. JetBrains Plugin Marketplace

- **What:** For IntelliJ/WebStorm/PyCharm users. Dev tool audience. Higher bar but serious developers.

#### E7. WordPress.org plugin directory

- **What:** If your tool integrates with WordPress, publish a plugin.
- **Example:** Plausible Analytics has a WP plugin. Fermentcalc could have "WP Recipe Helper" that pulls fermentation data via API.
- **Audience:** 43% of web runs WP. Massive potential reach.
- **Risk:** WP review is strict; first plugin can take 2-4 weeks.

#### E8. Shopify App Store

- **Best for:** B2B/SaaS fleet sites relevant to e-commerce operators. Not fleet-relevant right now but future.

#### E9. Zapier / Make / n8n integrations

- **What:** Build a Zapier integration so users can automate with your API. Zapier marketplace = significant discovery.
- **Best for:** Any site with an API. Huge compound potential — every Zap built using your API = permanent usage.
- **Multiplier:** cold-start ×+55-75 depending on API quality.

#### E10. Homebrew formula

- **What:** If you ship a CLI tool, publish a Homebrew formula. Dev developers install via `brew install`.
- **Multiplier:** small audience but high-quality.

---

### § F — Embeddable content (highest compound in the playbook)

This is the secret weapon of distribution. Every embed = permanent backlink + permanent discovery channel.

#### F1. iframe widgets — `v19.1-autonomous`

- **What:** A small iframe of your calculator/tool that other sites embed. Visually branded; deep-link to your full site.
- **How:**
  1. Build `/embed/[tool]` endpoint that renders stripped-down version.
  2. Publish `<iframe src="..." width="..." height="..."></iframe>` snippet on an "Embed This" page.
  3. Add attribution + brand to every embed.
  4. Log referrer in analytics to see which sites embed.
- **Best for:** Calculator sites (Fermentcalc, Sourdough, HoldLens), data viz sites.
- **Example:** Fermentcalc's brine calculator embedded on recipe blogs; readers calculate inline; calculator footer links back to Fermentcalc.
- **Compound:** Each embed stays embedded for months/years. 100 embeds × 500 visitors/embed/year = 50k visitors/year from ONE ship.
- **Multiplier:** `embeddable_widget × +80`.

#### F2. Script-tag embeds (like Intercom / Disqus)

- **What:** JavaScript snippet embed rather than iframe. More dynamic, can customize per-site.
- **Example:** HoldLens "Buffett Latest Moves" widget that loads dynamically showing latest filings.
- **Multiplier:** `embeddable_widget × +80`.

#### F3. oEmbed provider

- **What:** Register as oEmbed provider → any URL from your site automatically embeds when pasted in Slack/Discord/Notion/Medium/etc.
- **Example:** Paste a Twitter URL in Notion → rich embed. Same for your site's result pages.
- **How:** Add `/oembed?url=[url]` endpoint + `<link rel="alternate" type="application/json+oembed">` in HTML head.
- **Compound:** every Slack/Notion/Medium paste = brand impression.
- **Multiplier:** cold-start ×+30-50.

#### F4. WordPress shortcode plugin

- **What:** Plugin that lets WP users embed your tool with `[fermentcalc-brine veg="cabbage"]` shortcode syntax.
- **Compound:** each install creates N embeds across that WP site.

#### F5. Ghost cards / Medium oEmbed / Substack embeds

- **What:** Custom card types for major publishing platforms. Your site's URLs become rich cards when pasted.
- **Best for:** Content-heavy sites where other writers cite your data.

---

### § G — Knowledge graph + AI-citation infrastructure

These are the "LLMs find me" channels. Covered briefly in concept-finder-methodology v2.1's LLM-Citation Design Pattern — depth here.

#### G1. Wikipedia-sourced edits — `operator-time` · HIGHEST durability

- **What:** Add your site as a citation source on relevant Wikipedia pages (NOT creating your own page — citing on OTHER relevant pages).
- **How:**
  1. Find 5-10 Wikipedia pages in your niche that could benefit from your data as a reference.
  2. Create Wikipedia account, make 10+ unrelated constructive edits to build credibility.
  3. Add reference to your page as one source among multiple. Your site must be the BEST available source for that specific claim.
  4. Wait — don't edit more than one page per day.
- **Durability:** a Wikipedia citation, once accepted, stays indexed indefinitely. Google + every LLM treat Wikipedia as high-authority. One successful citation = permanent tier-1 backlink.
- **Operator time:** 1-2 hours per page.
- **Oracle multiplier:** `wikipedia_sourced_edit × +75`.
- **CRITICAL:** NEVER automate (I-34 hard-no). NEVER edit your own company page (COI violation). NEVER do this if your source is weak (will be reverted + harm reputation).

#### G2. Wikidata entries

- **What:** Wikipedia's structured-data sibling. Add your project/data as a Wikidata item with properties.
- **Best for:** Projects with structured data (HoldLens's 13F filings map directly to Wikidata's financial-data properties).
- **Multiplier:** cold-start ×+30.

#### G3. Schema.org structured data — `v19.1-autonomous`

- **What:** JSON-LD schema on every page. Article + Person + Organization + Dataset types. LLMs + search engines prefer structured over unstructured.
- **How:** Every page ships with JSON-LD in `<head>`.
- **Multiplier:** `schema_markup_article_person_org × +20`.

#### G4. llms.txt manifest — `v19.1-autonomous`

- **What:** Text file at `/llms.txt` that tells AI agents what your site is + which pages to prefer. Emerging standard; 2026 adoption accelerating.
- **How:** Create `/public/llms.txt` with site summary + page map. Auto-refreshes on deploy.
- **Multiplier:** `llms_txt_discoverability × +30`.

#### G5. robots.txt + sitemap.xml — `v19.1-autonomous`

- **What:** Non-negotiable baseline. robots.txt controls crawler access; sitemap.xml lists every URL + priority.
- **Multiplier:** `sitemap_addition × +12`.

#### G6. RSS / Atom / JSON Feed — `v19.1-autonomous`

- **What:** Every new post or data update emits RSS. Feedly/NewsBlur/Inoreader users subscribe passively.
- **How:** `/feed.xml` (RSS), `/feed.atom` (Atom), `/feed.json` (JSON Feed). Generate all three from same source.
- **Best for:** Sites with ongoing content (blogs, data updates, changelogs).
- **Multiplier:** cold-start ×+15-30.

---

### § H — Social organic (selective — not all channels work)

Most fleet sites should NOT try to "build a social following." The ROI is poor for silent-SEO fleets. But specific narrow plays work well.

#### H1. LinkedIn zero-click framework posts — `operator-time`

- **What:** 400-800 word operator-authored framework/insight essays posted NATIVELY on LinkedIn (no outbound link in post body). Brand recall compounds; occasionally users Google the author and find the site.
- **How:** 1-2 posts per week. Each must deliver genuine framework value. Operator identity = strong backing.
- **Multiplier:** `linkedin_zero_click_framework_post × +65`.
- **Risk:** Low if posts are valuable; posts that are thinly-veiled self-promo get penalized by LinkedIn algorithm.

#### H2. Twitter/X organic — `operator-time`

- **What:** Short-form takes, data-viz threads, opinion posts. Links in replies to work around X's link-demotion.
- **Best for:** Tech, VC, finance, media. Poor for consumer/food/parenting.
- **Operator time:** significant. 30 min/day minimum for meaningful growth.
- **Multiplier:** cold-start ×+15-40 depending on niche. Has been declining as X algorithm favors engagement over link-out.

#### H3. Mastodon / Bluesky — `operator-time`

- **What:** Decentralized Twitter alternatives. Smaller but more engaged audiences.
- **Best for:** Tech/dev niches; poor reach outside those.
- **Multiplier:** cold-start ×+10-20.

#### H4. Threads

- **What:** Meta's Twitter clone. Rapid adoption but algorithm volatile.
- **Multiplier:** cold-start ×+10-25.

#### H5. YouTube Shorts

- **What:** Vertical 60-second videos. Massive discovery potential in specific niches (food, fitness, design, coding).
- **Best for:** Visual niches. Not fleet-first but worth testing if site has strong visual content.
- **Multiplier:** cold-start ×+30-60 if you hit the algorithm right.

#### H6. TikTok

- **What:** Similar to Shorts. Best for B2C visual niches.
- **Multiplier:** varies wildly by niche. Finance TikTok is real; dev TikTok is small.

#### H7. Instagram Reels

- **What:** Meta's TikTok clone. Best for design/visual/food.
- **Multiplier:** cold-start ×+20-40 for visual niches; negligible for others.

#### H8. Pinterest

- **What:** Search-engine-disguised-as-social. Women 25-54 dominate. Food + home + parenting + wedding + design gold.
- **Best for:** Fermentcalc, Sourdough, readinglist.school, wedding-budget concepts.
- **Multiplier:** cold-start ×+40-70 for right niches; near-zero for tech.
- **Operator time:** Can be partially automated via Tailwind scheduled pinning (NOT auto-content; auto-scheduling of human-created pins).

---

### § I — Long-form video + audio

#### I1. YouTube native channel — `operator-time`

- **What:** Your own YouTube channel with tutorials/explainers/data walkthroughs.
- **Best for:** Visual/process-heavy niches (food, design, dev). Poor for pure reference sites.
- **Operator time:** 3-5 hours per video. High commitment.
- **Multiplier:** varies wildly. Well-placed video in high-CPM niche (finance, software) can 10x a site's traffic for months.

#### I2. Podcast guesting (covered in § D6)

#### I3. Own podcast — `operator-time`

- **What:** Operator-hosted podcast in site's niche.
- **ROI:** Generally poor until 50+ episodes. Consider only if operator genuinely enjoys it AND has unique guest access.

---

### § J — Directories + aggregators

These are low-friction listings that compound discovery. Many are free.

#### J1. Product Hunt — `operator-time`

- **What:** Daily product-launch community. Founders upvote peers. Launches get 24-48h of visibility.
- **Risk:** 2026 Product Hunt is crowded. Cold launch = ~×+15 multiplier. With pre-launch warmup (build follower count, engage community 2-4 weeks before launching) = ×+60.
- **Best for:** SaaS, tools, productivity. Poor for content sites.
- **Strategy:** ONE launch per product ever. Make it count. Tuesday-Wednesday best days.
- **Operator time:** 10-15 hours prep + 24h engagement day-of.

#### J2. BetaList — `HARD-NO` (I-34)

- **What:** Pre-launch list. 2025-2026 tightening means AI-agent submissions are banned (auto-submit is I-34 hard-reject). Human-only + requires genuine pre-launch status.
- **Status:** Operator CAN submit manually but the ROI for fleet sites (already launched, not beta) is near-zero.

#### J3. AlternativeTo.net — `v19.1-autonomous via monthly-check scheduled task`

- **What:** "Alternatives to X" directory. Users search "alternatives to [competitor]" and find your site listed.
- **How:** Register your site as alternative to 3-5 major competitors. Claim your listing. Keep pricing + feature info current.
- **Best for:** SaaS, dev tools, productivity. Poor for content.
- **Multiplier:** `alternativeto_listing × +30-50`.

#### J4. G2 / Capterra / Trustpilot

- **What:** B2B software review directories. Highest authority in B2B SaaS discovery.
- **Best for:** B2B fleet SaaS. Not fleet-relevant for content/calc sites.

#### J5. SaaSHub

- **What:** Smaller alternative-to directory. Some SaaS discovery.
- **Multiplier:** ×+15-25.

#### J6. Indie Hackers Products directory

- **What:** Free listing for indie products. Small but engaged audience.
- **Multiplier:** ×+15-25.

#### J7. GitHub Awesome Lists

- **What:** Curated lists like "awesome-dev-tools", "awesome-finance". If your site/tool is genuinely one of the best, PRs adding it to awesome lists get merged.
- **How:** 1. Find relevant awesome lists. 2. Submit PR adding your entry with 1-line description. 3. Wait for maintainer review.
- **Multiplier:** `github_awesome_list × +40`.
- **Durability:** high. Awesome lists are stars-heavy and reference-heavy.

#### J8. Reddit r/SideProject, r/InternetIsBeautiful, r/coolgithubprojects

- **What:** Generic "show your project" subreddits. Massive audience but low-intent.
- **Strategy:** One submission per site. Frame genuinely useful.
- **Multiplier:** one-shot ×+25-50. Rarely compounds.

#### J9. Lobste.rs

- **What:** Tech-heavy HN-alternative. Smaller but engaged. Invite-only; if you know a user, get invited.
- **Best for:** Dev tools. Niche.

#### J10. Niche-specific directories

- **Food:** Tastespotting, Foodgawker, FoodBlogs.com
- **Fitness:** FitnessBlogs, specific forum directories
- **Finance:** FinanceSites directory, specific newsletters
- **Design:** Awwwards, CSS Design Awards (for design-heavy sites)
- **Strategy:** Google "[niche] directory" or "[niche] blog roll" → submit to top 5-10.

---

### § K — Partnerships

Cross-promote with complementary (non-competing) sites. Compound networks.

#### K1. Cross-promotion widgets — `operator-time` · fleet-compatible

- **What:** Embed a "You might also like" widget on your site linking to complementary fleet sites (or partner sites). They reciprocate.
- **Example:** Fermentcalc → "More calculators: Sourdough Hydration, BBQ Cook Time." Sourdough → reciprocates.
- **Compound:** keeps users in the fleet ecosystem; each click = another site growth.
- **Multiplier:** `cross_promo_widget × +25`.

#### K2. Bundle / Marketplace partnerships

- **What:** Partner with a larger platform to be included in their default/recommended set.
- **Example:** Plausible partnership with Ghost / Carrd / Webflow includes Plausible by default for new sites.
- **Multiplier:** game-changing when it works; unusual deal. ×+100-200.

#### K3. Co-authored content

- **What:** Joint essay/report with a partner. Both promote. Double distribution.
- **Example:** HoldLens + a hedge-fund newsletter co-author "State of 13F Filings 2026." Both promote; HoldLens data + newsletter's audience.
- **Operator time:** 5-10 hours per piece.
- **Multiplier:** `co_authored_content × +50`.

#### K4. Joint summits / webinars (virtual)

- **What:** Partner with 3-5 complementary sites to host virtual summit. Each promotes to own audience; attendees discover all.
- **Best for:** B2B SaaS. Less fit for content/calc fleets.

---

### § L — Email-based

#### L1. Own newsletter — `operator-time` · RETENTION-FOCUSED

- **What:** Weekly or monthly digest of site updates/insights. PRIMARILY a retention play, not acquisition.
- **Best for:** Operator-owned audience asset. Every fleet site should have email capture.
- **Multiplier:** acquisition ×+10; retention +0.04 (per Retention Oracle).

#### L2. Guest posts in established newsletters

- **What:** Pitch established newsletters (Morning Brew, Stratechery-class, niche specific) a guest essay with byline link.
- **How:** Same pattern as Substack guest pitch but targeting larger newsletter brands.
- **Multiplier:** ×+45-85 depending on newsletter size.

#### L3. Newsletter sponsorships (PAID)

- **What:** Pay to run ad in established newsletter. One-time fee ($200-$5,000) for 1-sentence ad + link.
- **ROI:** Varies. Measure cost-per-acquisition rigorously. For your 100%-ads fleet, usually negative margin.
- **When to use:** Only if tested + measurable ROI.

#### L4. Cold email (targeted)

- **What:** Email specific journalists/bloggers with specific pitch. NOT mass cold email.
- **See § D4** above.

---

### § M — Events

#### M1. Speaking at conferences

- **What:** Propose talks at niche conferences. "I'll talk about [my original research]."
- **Operator time:** 20-40 hours per talk (prep + travel + talk).
- **Multiplier:** ×+40-80. Slow but high-durability (YouTube rec of talk keeps getting found for years).

#### M2. Virtual summits

- **Best for:** SaaS, B2B. Less fit for content fleet.

#### M3. Hackathons (for dev tools)

- **What:** Sponsor or mentor at hackathons. Hackers build with your API; spread to their networks.
- **Cost:** sponsorship fees $500-5000.
- **Best for:** Dev-tool fleet sites only.

#### M4. Online meetups

- **What:** Host niche-specific meetups monthly. Build community around your site.
- **High commitment; usually not ROI-positive for silent-SEO fleet.**

---

### § N — Emerging / 2026 experimental

#### N1. ChatGPT "GPTs" / Claude "Apps"

- **What:** Create a purpose-built GPT or Claude App that uses your API. Gets listed in OpenAI/Anthropic stores. Users discover you via LLM tool discovery.
- **Status:** 2026 OpenAI GPT Store has 1M+ GPTs; discoverability is hard. Anthropic's Claude Apps ecosystem earlier-stage.
- **Multiplier:** cold-start ×+20-50. Will likely grow as LLM app stores mature.
- **Best for:** Sites with APIs. Cost: 2-8 hours to build; ongoing maintenance.

#### N2. Discord bots

- **What:** Bot integrated into popular niche Discord servers. Surfaces your data on /command.
- **Example:** `/brine cabbage` in a fermentation Discord pulls Fermentcalc data inline.
- **Multiplier:** cold-start ×+20-40 depending on server size.

#### N3. Slack apps

- **What:** Install-as-Slack-app lets teams use your tool in workflows. B2B only.

#### N4. Telegram bots

- **What:** Telegram's 1B+ user base has thriving bot ecosystem in some niches (finance, crypto, memes).
- **Niche fit dependent.**

---

## Part 3 — Per-site channel-mix recipes

Different site types need different channel mixes. Below: 7 profile archetypes with recommended channel stacks.

### Profile 1: Finance data / investing (HoldLens-class)

**Top 5 channels:**
1. Original research + annual reports (×+90)
2. Wikipedia citations (financial-data pages)
3. HN Show HN (one-shot)
4. Reddit organic (r/SecurityAnalysis, r/ValueInvesting, r/investing)
5. LinkedIn zero-click framework posts (operator = finance credibility)

**Secondary:** Podcast guesting (hedge fund/investing podcasts) · Substack guest posts · HARO pitches · Chrome extension (Yahoo/Seeking Alpha overlay)

**Skip:** Pinterest · TikTok · YouTube Shorts (audience doesn't match)

**Pre-launch 2-week prep:** build HN/Reddit karma · write 2-3 LinkedIn framework posts · prepare 5 Wikipedia citation candidates

### Profile 2: Food calculator / reference (Fermentcalc / Sourdough)

**Top 5 channels:**
1. Pinterest (huge for food audience)
2. Embeddable calculator widgets (food blogs embed)
3. Reddit (r/Fermentation, r/Sourdough, r/Cooking, r/AskCulinary)
4. YouTube Shorts (visual recipe content)
5. Guest posts on food blogs (Serious Eats, King Arthur, etc.)

**Secondary:** Wikipedia (fermentation science pages) · Food-specific directories · Pinterest scheduled pinning · WordPress plugin (for WP recipe sites)

**Skip:** HN (wrong audience) · LinkedIn (wrong audience) · dev tool marketplaces

**Pre-launch prep:** build Pinterest profile + pin 20 existing ideas · identify 10 food blogs for guest-post pitches

### Profile 3: Dev tool / SaaS (webvitals-dev-class)

**Top 5 channels:**
1. GitHub repo with brand-prefixed name (×+90)
2. npm package (×+90)
3. Dev.to / Hashnode canonical cross-posts (×+35 each)
4. HN Show HN + HN comments (×+70 + ×+30)
5. VSCode extension (×+90)

**Secondary:** Chrome extension · Indie Hackers build-in-public · Awesome lists · GitHub trending · Product Hunt (with warmup)

**Skip:** Pinterest · TikTok · food directories · B2C newsletters

### Profile 4: Education / books (readinglist-class)

**Top 5 channels:**
1. Pinterest (parents + teachers heavy)
2. Teachers Pay Teachers (if educational materials)
3. Reddit (r/Teachers, r/Parenting, r/Homeschool, niche reading subreddits)
4. Guest posts on education blogs (EdSurge, Edutopia, niche teacher blogs)
5. Wikipedia (educational standards + reading-level research pages)

**Secondary:** School-district newsletters · AP/IB teacher Facebook groups · LinkedIn education-focused posts · podcast guesting (education podcasts)

**Skip:** HN · dev marketplaces · crypto · finance press

### Profile 5: B2B SaaS tool (Free Trial Length Calc-class)

**Top 5 channels:**
1. LinkedIn operator + thought-leadership
2. Podcast guesting (SaaS-specific podcasts — Rob Walling, Indie Hackers)
3. G2 / Capterra / SaaSHub listings
4. Guest posts on niche SaaS newsletters (SaaStr, Failory, Indie Hackers)
5. Product Hunt (with warmup)

**Secondary:** Zapier integration · Slack app · AlternativeTo · niche Discord/Slack communities

**Skip:** Pinterest · TikTok · food/education directories

### Profile 6: CRO / UX / Conversion (conversionbench-class)

**Top 5 channels:**
1. LinkedIn operator-authored framework posts (huge CRO audience on LinkedIn)
2. Guest posts on CRO blogs (ConversionXL, Unbounce blog, WordStream)
3. Podcast guesting (CRO-specific)
4. HARO pitches (CRO-related journalist queries common)
5. Original research "State of Conversion" reports

**Secondary:** Embeddable ROI calculator · SaaS podcasts · Indie Hackers · LinkedIn zero-click

**Skip:** HN (CRO HN is meh) · Pinterest · TikTok · dev directories

### Profile 7: Content / reference / database (any finite-dataset site)

**Top 5 channels:**
1. SEO + GEO (the baseline — covered in concept-finder-methodology)
2. Wikipedia citations (high-durability)
3. Embeddable widgets (if any calc/tool embedded)
4. Reddit niche-specific
5. Annual "State of X" report pitched to tier-1 press

**Secondary:** RSS feeds · canonical cross-posts to niche platforms · podcast guesting · HARO

---

## Part 4 — 90-day new-site sequencing

Launch-week onward, systematic. Every fleet site should follow this cadence.

### Pre-launch (Week −2 to Week 0)

- Ship SEO foundation: sitemap.xml · robots.txt · schema.org on every page · llms.txt
- Ship distribution foundation: embeddable widget (if applicable) · share card per result · OG images
- Build distribution accounts: register on Dev.to / Hashnode / Medium / HN / Reddit / IndexNow / Pinterest (if relevant)
- Operator warmup (if social): make 10+ genuine community contributions on HN/Reddit/LinkedIn in your niche to build baseline karma

### Week 1-2 — foundational autonomous

- ✓ IndexNow auto-ping on every deploy (×+40)
- ✓ First canonical cross-posts to Dev.to + Hashnode (if applicable, ×+35 each)
- ✓ First 1-2 niche directory submissions (AlternativeTo, niche-specific)
- ✓ Embeddable widget pages live
- ✓ First Wikipedia-ready citations drafted (for operator Week 5-6)

### Week 3-4 — community seed

- ✓ First Reddit organic engagement (2-3 substantive comments/week; cite site sparingly)
- ✓ First LinkedIn zero-click framework post (establishes operator authority)
- ✓ First HARO/Qwoted signups + 2-4 pitches
- ✓ First GitHub repo with brand-prefixed name (if dev site)

### Week 5-6 — earned media + durability

- ✓ First tier-1 press pitch (HARO or direct journalist cold-email)
- ✓ First Wikipedia citation attempt (operator-time)
- ✓ First podcast pitching round (30 podcasts, expect 3-5 accepts)
- ✓ Monitor Week-4 audit gates: sessions, keyword impressions, referral traffic

### Week 7-8 — Hacker News launch + reinforce

- ✓ If product is ready + early Google traffic baseline exists: Show HN submission
- ✓ Process any HN-sourced referral traffic (monitoring dashboards)
- ✓ Reinforce winning channels (double down on whichever is producing >20% of traffic)
- ✓ Sunset losing channels (whichever produces <2% of traffic — don't invest more time)

### Week 9-12 — scaling + Week-8 audit gate

- ✓ Week-8 audit: compare projected vs actual (per learn-from-data.md)
- ✓ Promote channels that hit ≥projected (invest more)
- ✓ Demote channels that hit <50% of projected (halt investment)
- ✓ First quarter content push: newsletter guest posts, second LinkedIn cycle, second Reddit push
- ✓ Plugin marketplace listings (npm, VSCode, Chrome) if dev-adjacent

### Week 12+ — dormancy OR doubled-down

Per fleet discipline: 28-day dormancy gates apply unless a channel is genuinely producing. If Week-8 audit shows traction, scale. If not, let site dormant + focus on next-APS concept.

---

## Part 5 — Measurement & calibration

Every channel needs a measurement framework. Don't guess.

### Per-channel attribution

- **Plausible** (primary): set up UTM-tagged links for every channel. Each channel = own UTM source.
- **GA4** (secondary): custom channel groupings for granular attribution.
- **GSC** (search only): query tab shows which keywords + which pages rank.

### Channel-specific metrics

- **SEO/GEO:** GSC impressions + clicks + avg position + top-10-page count
- **Reddit:** refer.reddit.com referrals + commented-link tracking
- **HN:** 24-hour spike detection + sustained long-tail (HN's front-page posts keep getting referrals for months)
- **Embeds:** referrer report — which sites embedded, how much traffic per embed
- **Social:** UTM attribution
- **Wikipedia:** refer.wikipedia.org referrals (slow but durable)
- **Newsletters:** UTM tagging per newsletter sponsored + guest spots

### Week-4 / Week-8 / Week-16 audit gates

Per concept-finder-methodology.md Layer 7 + learn-from-data.md. Kill-criteria:
- Week 4: channel must produce ≥2% of referrer traffic OR kill
- Week 8: channel must produce ≥5% of referrer traffic OR kill
- Week 16: channel must produce ≥10% of traffic OR kill (unless channel is inherently slow-compound, e.g., Wikipedia)

### Calibration against Distribution Oracle

Every ship logs projected × actual to `DISTRIBUTION.md ## Calibration`. After 10+ same-archetype ships, Oracle multipliers auto-adjust per I-28.

---

## Part 6 — Anti-patterns & HARD-NO list (I-34 immutable)

### Automatic posting — permanently banned (I-34)

These are IMMUTABLE (v19.1 invariant I-34). No mutation can re-enable them because they violate platform ToS → account-level bans cascade → fleet-wide damage.

1. **Auto-reply to brand mentions** (X, Reddit, LinkedIn — all explicit ToS ban)
2. **Auto-post to Reddit** (shadowban within hours per 2026 system)
3. **Auto-post to Hacker News** (flagging + shadowban per 2026 HN moderation)
4. **Auto-post to LinkedIn** (§8.2 explicit ban + 23% account-restriction rate)
5. **Auto-edit Wikipedia** (March 2026 English Wikipedia community ban; BAG denies all AI-agent BRFAs)
6. **Auto-submit to BetaList** (human moderation; automated submissions flagged)

### Dark patterns — permanently banned

- Fake scarcity ("only 2 left!" digital products)
- Confirmshaming ("no thanks, I hate saving money")
- Hidden unsubscribe
- Auto-charge on free trials without clear disclosure
- Misleading ad-placement near content
- Headline ≠ content (clickbait)

### SEO / Link-building anti-patterns

- PBNs (Private Blog Networks) — Penguin penalty cascade
- Paid link schemes (paid blogger posts flagged with `rel=sponsored`; paid UNDISCLOSED = Penguin)
- Comment spam
- Directory submission services (low-quality signal)
- Article spinning / content farms
- Cloaking (showing different content to Googlebot vs users)
- Doorway pages
- Keyword stuffing

### Per-platform anti-patterns

**Reddit:**
- Posting to 10+ subreddits with same content (instant karma ban)
- Comment-to-link ratio <10:1 (self-promo filter)
- Creating fake accounts to upvote (vote manipulation detection)
- Pretending to be a regular user when you're the founder (honesty tax)

**Hacker News:**
- Submitting your own content multiple times (moderator ban)
- Asking friends to upvote (vote manipulation — all detected via IP clustering)
- Posting "Show HN" for incomplete product
- Response-spamming in comment section

**LinkedIn:**
- Using automation tools (Taplio, etc.) for posts or DMs
- Sending cold-pitch DMs at scale
- Creating LinkedIn Pulse articles that just link to your site (algorithm demotes)

**Wikipedia:**
- Creating own company/product page (COI = immediate revert + possible ban)
- Adding references to weak content (gets reverted)
- Edit-warring when reverted (blocks account)

---

## Part 7 — Integration with fleet methodology

This playbook is compatible with:

### concept-finder-methodology v2.1.1

- Layer 5 (Triple-Oracle) uses Distribution Oracle archetypes from this playbook
- Layer 7 (LLM-Citation Design Pattern) uses the 10-characteristic framework for § G (Knowledge Graph)
- Every concept evaluation applies archetype-match: does the concept fit the channel mix in Part 3 Profile that matches it?

### v19.1 Autonomous Acquisition Engine

Autonomous channels in this playbook are already wired into:
- `indexnow-sync` (every 15 min)
- `canonical-cross-post` (on publish)
- `schema-freshness` (weekly)
- `alternativeto-listing` (monthly)
- `fleet-sweep-weekly` (Monday)
- `acquisition-log-rollup` (daily)

Every autonomous action logs to `~/.claude/fleet/ACQUISITION_LOG.md` per I-33 (silent actions forbidden).

### @distributor specialist

Before any public-facing ship, @distributor scores Distribution Fit across 5 dimensions using archetypes from this playbook. Score must mean ≥ 0.5 per I-26.

### Fleet LEARNED.md compound

After every ship + 7d/30d post-ship, channel performance logs to per-project `LEARNED.md ## Ship Outcomes`. Fleet-level rollup in `~/.claude/fleet/LEARNED.md`. Calibration drives v2.X multiplier adjustments per learn-from-data.md.

---

## Part 8 — The meta-principles

Underneath all 40+ channels, 5 principles hold:

### 1. One artifact, many channels

Every ship should feed 5+ channels simultaneously. If an artifact only feeds SEO, you're leaving 4x the distribution on the table. Build distribution INTO the artifact, not as a separate step.

### 2. Compound > spike

One-shot channels (HN front page, Product Hunt launch) give big spikes but don't compound. Autonomous channels (embeds, plugin marketplaces, Wikipedia) compound for years. Favor compound when building fleet.

### 3. Operator time is the scarcest resource

Every channel has an operator-time cost. For solo founder running 5+ sites, autonomous channels dominate. Spend operator time only on channels with multipliers ≥+50 (HN, Reddit, Wikipedia, LinkedIn, podcasts).

### 4. Authority compounds faster than reach

A Wikipedia citation, HN front-page post, or podcast appearance builds permanent authority. A viral tweet dies in 48 hours. Invest in authority-building over reach-building.

### 5. Measure brutally; kill losers fast

Every channel must produce traffic at its Week-8 gate or die. Don't sunk-cost-fallacy into channels that don't work. Oracle calibration is honest; respect it.

---

## Summary — the 40+ channels, ranked by fleet utility

**Autonomous S-tier (do all of these):**
- Embeddable widgets · share cards per result · plugin marketplaces (npm/VSCode/Chrome) · IndexNow · llms.txt · Schema.org · canonical cross-posts · sitemap + RSS

**Operator-time S-tier (do 3-4 per quarter):**
- Wikipedia citations · HN Show HN (once per site) · Reddit organic (ongoing) · LinkedIn zero-click posts · podcast guesting · HARO pitches · annual "State of X" report

**Situational A-tier (use if site profile matches Part 3):**
- Pinterest (food/education) · GitHub repo (dev) · Substack guest posts · co-authored content · niche directories · Chrome extension · Dev.to/Hashnode

**Skip unless specific signal:**
- Paid ads · TikTok/Shorts (unless visual niche) · own YouTube channel · own podcast · own newsletter until site has audience · conference speaking

**Never (I-34):**
- Auto-posting anywhere · auto-replying · auto-editing Wikipedia · PBNs · paid link schemes · dark patterns

---

## The short version

Most fleet sites should stack: **SEO + GEO + embeddable widgets + share cards + IndexNow + canonical cross-posts + Wikipedia citations + one HN Show HN + ongoing Reddit + LinkedIn framework posts + HARO pitches + 1 annual report.** That's ~15 channels producing ~95% of non-paid distribution. Everything else in this playbook is marginal add-ons.

---

*End of v1 (Acquisition). v2 additions below — Activation · Engagement · Retention · Advocacy · AUG Score.*

---

## Part 9 — ACTIVATION (first-session conversion)

**Definition:** the moment in a user's first visit where they get enough value that they're likely to remember the site. If they leave before activation, acquisition effort is wasted.

### Activation metric per site profile

| Site profile | Activation event | Target rate |
|---|---|---|
| Calculator (Fermentcalc, Sourdough) | User completes one calculation | ≥55% |
| Database/Reference (HoldLens, readinglist) | User views ≥3 data pages in session | ≥35% |
| Comparator (vs-pages) | User engages with table (sort/filter/hover) | ≥40% |
| Benchmark (Conversionbench) | User sees their industry benchmark | ≥30% |
| Generator (share card sites) | User generates + downloads/copies output | ≥25% |
| Guide/Reference | User scrolls >75% OR clicks TOC anchor | ≥35% |

### Activation-specific channels / tactics (NEW in v2, beyond v1's acquisition)

| # | Tactic | Expected lift on activation | Implementation |
|---|---|---:|---|
| A1 | **Time-to-first-value ≤10s** | +25% | Hero = the tool itself (calculator above fold), not marketing copy |
| A2 | **Pre-filled example state** | +18% | URL parameter seed or autoload demo data; empty state never shown first |
| A3 | **Progressive disclosure** | +12% | Show basic form first, advanced options collapsed |
| A4 | **Anchor-link deep-entry** | +30% | Incoming links land on exact-answer section, not homepage top |
| A5 | **No-signup calculation** | +40% vs gated | Zero friction v0; signup = activation*2 friction = activation/2 conversion |
| A6 | **Skeleton loader instead of blank** | +8% | Perceived speed; reduces bail-on-load |
| A7 | **ONE primary CTA per view** | +15% | Multiple CTAs split attention → analysis paralysis |
| A8 | **Visible proof of usefulness** | +10% | Real data rendered immediately, not "click to load" |
| A9 | **Mobile-perfect first-paint** | +22% on mobile | 50%+ of traffic is mobile; CLS <0.05, LCP <1.5s |
| A10 | **Onboarding tooltip (1 max)** | +6% (calc sites) | One arrow pointing at the input that matters |

### Activation anti-patterns (FORBIDDEN per I-23 Love Score Floor)

- ❌ Signup wall before any value delivered
- ❌ Email-capture modal before user has done anything
- ❌ Newsletter popup within 5 seconds of page load
- ❌ Cookie banner that blocks interaction (dark UX pattern)
- ❌ Auto-playing video/audio
- ❌ Interstitial ads before first interaction
- ❌ "Please rotate device" when responsive is possible
- ❌ Blank state with no example data

### Instrumentation for activation

```javascript
// Plausible event per activation
plausible('activated', { props: {
  time_to_activation_sec: 8.4,
  variant: 'pre-filled-demo',
  device: 'mobile'
}});

// GA4 event
gtag('event', 'activation', {
  method: 'calculation_complete',
  time_to_value_seconds: 8.4
});
```

---

## Part 10 — ENGAGEMENT (depth of session)

**Definition:** every measurable action after activation in the same session. The more engaged the session, the stronger the SEO signal, the higher the ad RPM, the better the retention.

### The 10 engagement metrics (every fleet site instruments these)

| # | Metric | What it measures | Target (silent-SEO fleet) | Why it matters |
|---|---|---|---|---|
| E1 | **Bounce rate** | % sessions with only 1 pageview | <45% | HCU signal; low rankings if >70% |
| E2 | **Pages per session** | Mean pages viewed per session | ≥2.1 | AdSense RPM scales with this |
| E3 | **Average time on page** | Active seconds per page (not idle) | ≥90s on content | SEO quality signal |
| E4 | **Session duration** | Total active seconds per session | ≥180s | Engagement ranking factor |
| E5 | **Scroll depth** | Max % scrolled per page | ≥65% reach 75%+ | Content-quality proxy |
| E6 | **Event rate** | Interactions per session (clicks, inputs, filters) | ≥3 events | Non-bouncing active sessions |
| E7 | **Core-loop completion** | % sessions completing the core action | ≥55% (calcs) / ≥35% (ref) | Activation-to-retention predictor |
| E8 | **Exit-page quality** | Top exit pages = expected endpoints? | 70%+ exits on /result-pages | Natural session conclusion vs frustration |
| E9 | **Inbound click-depth** | % sessions entering on non-homepage | ≥60% | Long-tail SEO health |
| E10 | **Pogo-sticking rate** | % sessions that return to SERP <10s | <15% | Critical SEO signal; kills rankings fast |

### Engagement lift tactics (ranked by lift per hour of implementation)

| # | Tactic | Expected lift | Target metric |
|---|---|---|---|
| E-T1 | **Related results / "see also" section** | +0.8 pages/session | E2 |
| E-T2 | **Internal linking hub-and-spoke** | +0.6 pages/session | E2 |
| E-T3 | **Table-of-contents with anchor links** | +35% scroll depth | E5 |
| E-T4 | **Breadcrumb navigation** | +0.3 pages/session | E2 |
| E-T5 | **Embedded calculator within content pages** | +40% time on page | E3 |
| E-T6 | **Sortable/filterable tables** | +120% event rate on data pages | E6 |
| E-T7 | **Previous/next page links at article end** | +0.4 pages/session | E2 |
| E-T8 | **"You might also calculate" widget** | +0.5 pages/session | E2 |
| E-T9 | **Sticky in-page navigation** | +18% scroll depth | E5 |
| E-T10 | **Related-question FAQ inline** | +25% time on page | E3 |
| E-T11 | **Comparison links (X vs Y vs Z)** | +0.7 pages/session on comparator types | E2 |
| E-T12 | **Chart/graph instead of table** | +15% time on page | E3 |
| E-T13 | **Reading-progress bar at top** | +12% scroll depth | E5 |
| E-T14 | **Lazy-load images/charts below fold** | +10% session duration (less abandonment) | E4 |
| E-T15 | **404 pages with suggested next steps** | +25% recovery from broken links | E1 |

### Engagement anti-patterns

- ❌ Auto-scroll / forced scroll animations (breaks UX)
- ❌ Infinite scroll without pagination fallback (SEO + UX hit)
- ❌ Modal pop-ups mid-scroll (kills E5)
- ❌ Hidden content behind "Click to expand" for key info (SEO risk + E3 hit)
- ❌ Long text blocks without subheadings (E5 drops)
- ❌ Content above the ads (ad-placement policy + user-trust)
- ❌ Fake scarcity / countdown timers (I-34 hard-no)
- ❌ Heavy JavaScript that blocks first interaction (E1, E3, E4)

### Instrumentation for engagement

```javascript
// Scroll depth (fire at 25/50/75/100%)
['25', '50', '75', '100'].forEach(threshold => {
  if (scrollPercent >= threshold && !fired[threshold]) {
    plausible('scroll', { props: { depth: threshold } });
    fired[threshold] = true;
  }
});

// Active time (excludes idle + tab-away)
let activeSeconds = 0;
setInterval(() => {
  if (document.hasFocus() && !isIdle()) activeSeconds++;
}, 1000);

// Core-loop completion
plausible('core_loop_complete', { props: {
  loop_type: 'calculation',
  steps_to_complete: 2,
  abandoned_fields: 0
}});
```

---

## Part 11 — RETENTION (return visits + cohort behavior)

**Definition:** what makes users come back. The single most durable metric in the fleet. Per AcePilot's Retention Oracle (I-22), any ship that drops baseline 7d retention by >10% is auto-flagged as rollback candidate.

### The 8 retention metrics

| # | Metric | What it measures | Target |
|---|---|---|---|
| R1 | **D1 return rate** | % users returning next day | ≥8% (reference) / ≥12% (utility) |
| R2 | **D7 return rate** | % users returning within 7 days | ≥15% (reference) / ≥25% (utility) |
| R3 | **D30 return rate** | % users returning within 30 days | ≥25% (reference) / ≥40% (utility) |
| R4 | **Cohort retention curve** | % cohort retained week-over-week | Week-4 ≥15% |
| R5 | **Return-visit frequency** | Median visits per returning user per month | ≥2.5 |
| R6 | **Bookmark rate** | % sessions adding bookmark (inferred via return-visit-without-referrer) | ≥5% of returning |
| R7 | **Direct-type-in rate** | % sessions arriving via direct (typed URL) | ≥12% (>20% = brand) |
| R8 | **Brand search rate** | % sessions arriving via search for brand name | Growing MoM |

### Retention-driving tactics (ranked by impact on D30)

| # | Tactic | Expected D30 lift | Implementation |
|---|---|---:|---|
| R-T1 | **Core loop = user's recurring problem** | +8% absolute | Build for weekly/monthly-use needs (fermentation, investing), not one-time curiosities |
| R-T2 | **Bookmarkable result URLs** | +4% | Every calc result has stable shareable URL; encourage "save this" |
| R-T3 | **Email digest (opt-in, no spam)** | +6% of opted-in | Weekly newsletter with new data/features; DON'T auto-subscribe |
| R-T4 | **Save/watchlist feature (no-signup, localStorage)** | +5% | Users build state on the site; localStorage means zero friction |
| R-T5 | **Browser notification opt-in (carefully)** | +3% (of opted-in); hurt if aggressive | Only ask AFTER user completes second action |
| R-T6 | **Time-sensitive content** | +4% for freshness-driven niches | Quarterly 13F updates (HoldLens); seasonal recipes (Fermentcalc) |
| R-T7 | **Progressive feature unlock (no paywall)** | +3% | Show advanced features as users return; "You've calculated 3 times — here's Pro Mode" |
| R-T8 | **RSS feed per category** | +2% | Feedly/Inoreader subscribers = recurring visits |
| R-T9 | **"Your history" personalization** | +7% | Session-to-session memory of what user viewed/calculated (localStorage) |
| R-T10 | **Trigger-based return emails** | +5% of opted-in | "Your brine was 3 weeks ago — how did it turn out?" (niche-specific) |

### The core-loop test (v2 addition to methodology)

Before building any concept, answer: **What problem does the user have that recurs?**

| Recurrence | Retention potential | Examples |
|---|---|---|
| Daily | Extreme (but high-churn risk) | Weather, news, Wordle |
| Weekly | High (best for fleet) | Meal planning, market check, fitness log |
| Monthly | Solid | Bill calculators, budget review, tax tracking |
| Quarterly | Good for finance/business | 13F filings, earnings, industry benchmarks |
| Annually | Low; one-shot | Tax prep, tuition calcs |
| Rarely | Very low | Wedding planning, mortgage |
| One-time | Zero retention | Info lookup ("how many grams in a cup") |

**Silent-SEO fleet rule:** Year 1 = build for Weekly or Monthly recurrence. Year 2 = expand into Quarterly. Avoid one-time concepts unless dataset is vast enough for programmatic long-tail volume (e.g., tax treaty lookup has one-time intent per user but 190² pages covers infinite users).

### Retention anti-patterns (I-22 immutable)

- ❌ Growth hacks that spike D1-D7 but collapse D30 (fake notifications, aggressive popups)
- ❌ Hidden-cost trials (credit card required upfront)
- ❌ Confirmshaming unsubscribe ("No thanks, I hate saving money")
- ❌ Auto-email upon visit without explicit opt-in
- ❌ Feature removal behind paywall after user was using for free (rug-pull)
- ❌ Notification spam (>1 per week in most verticals)
- ❌ Re-enabling opt-out'd email sequences
- ❌ Dark-pattern retention (FOMO manufactured scarcity)

---

## Part 12 — ADVOCACY (shares, referrals, viral loops)

**Definition:** when users bring more users. The quietest growth channel if absent; the loudest multiplier if present.

### The 7 advocacy metrics

| # | Metric | What it measures | Target |
|---|---|---|---|
| V1 | **k-factor** | Avg new users brought per user | ≥0.15 (good) / ≥0.40 (viral) |
| V2 | **Share-per-session rate** | % sessions triggering share action | ≥3% |
| V3 | **Referral-link click-through** | Clicks on user-generated share URLs | ≥18% CTR |
| V4 | **Embed growth (widgets)** | New iframe embeds per month | ≥5/mo after Y1 |
| V5 | **Word-of-mouth attribution** | % acquisition via direct/referral (not search/paid) | ≥18% |
| V6 | **Fan content mentions** | Unprompted mentions in Reddit/X/LinkedIn | Track monthly |
| V7 | **User-generated screenshots shared** | Screenshots of your site on social | Track mentions |

### Advocacy-driving features (ranked by k-factor contribution)

| # | Feature | k-factor contribution | Implementation |
|---|---|---:|---|
| V-F1 | **Per-result share card (1200×630 PNG + pre-composed tweet)** | +0.08 | Every calc result has "Share as image" button; uses Canvas API; no backend needed. See HoldLens SignalShareCard v0.28. |
| V-F2 | **Embeddable iframe** | +0.12 (compounds over years) | Other sites embed your calc; each embed = permanent discovery channel |
| V-F3 | **Bookmarkable result URLs with title** | +0.05 | When user shares URL, preview card shows specific result |
| V-F4 | **OpenGraph images per page (not just homepage)** | +0.03 | Rich preview when URL pasted in Slack/Notion/Discord |
| V-F5 | **"Compare with friend" functionality** | +0.04 | User invites friend to do same calc; native viral mechanic |
| V-F6 | **Leaderboard / public rankings (optional)** | +0.03 | Opt-in; users share their rank |
| V-F7 | **Public collection / watchlist URL** | +0.04 | Users share curated lists they've built on your site |
| V-F8 | **Printable / PDF export** | +0.02 | Shared offline (teachers print class materials; chefs print recipes) |
| V-F9 | **Email-a-friend button** | +0.01 | Low-ceiling but zero-cost |
| V-F10 | **Twitter intent URLs with pre-filled text + hashtags** | +0.02 | Lower friction than blank share |

### Advocacy instrumentation

```javascript
// Share action
plausible('share', { props: {
  method: 'twitter_card',
  surface: 'result_page',
  has_custom_text: true
}});

// Embed detection (referrer signals iframe embed)
if (window.self !== window.top) {
  plausible('embed_view', { props: {
    parent_domain: new URL(document.referrer).hostname
  }});
}

// Track URL shares (server-side)
// GET /result/X?ref=sharecard → log as referral
```

### Advocacy anti-patterns

- ❌ Forced sharing to unlock features (dark pattern)
- ❌ Misleading share text ("I just saved $1000 using X!" when user did no such thing)
- ❌ Auto-share without consent
- ❌ Referral bribes paid in revenue (direct $ incentives cheapen organic loops)
- ❌ Public-by-default user data without explicit opt-in (privacy)
- ❌ Tweet-to-unlock / Retweet-to-enter schemes (spam flag)

---

## Part 13 — THE AUG SCORE (composite user-growth health, 0-100)

The Concept APS formula (methodology v2.1.1) scores concepts at pick-time. **AUG Score** scores live sites at any point in their life. Every fleet site gets a weekly AUG Score. Declining scores trigger CSIL audits.

### The formula

```
AUG_Score = 100
  × acquisition_health      (1-10, see rubric)
  × activation_health       (1-10)
  × engagement_health       (1-10)
  × retention_health        (1-10)
  × advocacy_health         (1-10)
  ÷ 100000                  (normalize to 0-100)

  = 10^-5 × (A × Ac × E × R × Ad)
```

Equivalently: geometric mean × 10 across five 1-10 scores → approximately the same scale. Multiplicative (not additive) so a zero in ANY stage = near-zero total. You can't compensate for broken retention with more acquisition.

### Per-stage rubric

**Acquisition health (A, 1-10):**
- 1: <500 unique/mo
- 3: ~3,000 unique/mo
- 5: ~10,000 unique/mo
- 7: ~30,000 unique/mo
- 9: ~100,000 unique/mo
- 10: 300,000+ unique/mo

**Activation health (Ac, 1-10):**
- 1: <10% activation rate
- 3: ~20%
- 5: ~35%
- 7: ~50%
- 9: ~65%
- 10: ≥75%

**Engagement health (E, 1-10):**
Composite of 4 sub-metrics (bounce rate, pages/session, time on page, scroll depth). Each contributes 0-2.5 points.
- Bounce rate <40%: 2.5 · 40-55%: 1.5 · 55-70%: 0.75 · >70%: 0
- Pages/session ≥2.5: 2.5 · 1.8-2.5: 1.5 · 1.2-1.8: 0.75 · <1.2: 0
- Avg time on content ≥120s: 2.5 · 75-120s: 1.5 · 45-75s: 0.75 · <45s: 0
- Scroll depth ≥70% reach 75%+: 2.5 · 50-70%: 1.5 · 30-50%: 0.75 · <30%: 0

**Retention health (R, 1-10):**
- 1: <3% D7 return
- 3: ~8%
- 5: ~15%
- 7: ~25%
- 9: ~40%
- 10: ≥55%

**Advocacy health (Ad, 1-10):**
- 1: k-factor 0, zero shares
- 3: k-factor 0.05
- 5: k-factor 0.15, occasional mentions
- 7: k-factor 0.30, regular mentions + 1-3 embeds
- 9: k-factor 0.50, 10+ embeds, active fan community
- 10: k-factor ≥0.80, viral mechanic (rare)

### Calibrated AUG Score examples (from fleet reality)

| Site | A | Ac | E | R | Ad | AUG Score | Status |
|---|---:|---:|---:|---:|---:|---:|---|
| **holdlens.com** (target Y1) | 5 | 6 | 6 | 5 | 5 | ~22 | Healthy new site |
| **holdlens.com** (Y2 target) | 7 | 7 | 7 | 6 | 6 | ~42 | Compounding phase |
| **holdlens.com** (Y3 target) | 8 | 8 | 8 | 7 | 7 | ~56 | Established |
| **hypothetical mature site** | 9 | 8 | 8 | 8 | 7 | ~64 | Fleet champion |
| **dying site example** | 7 | 2 | 2 | 2 | 1 | ~0.6 | Zombie traffic |
| **viral tool example** | 9 | 8 | 6 | 4 | 9 | ~46 | Acquisition-advocacy heavy, retention weak |

### When AUG Score triggers action

| Score | Status | Action |
|---|---|---|
| >50 | Thriving | Maintain + scale horizontally (more concepts) |
| 30-50 | Healthy | Weekly iteration, per-stage improvements |
| 15-30 | Needs attention | Run CSIL audit, identify weakest stage, queue P1 task |
| 5-15 | Critical | Halt new features; entire session focused on weakest stage |
| <5 | Zombie | Consider abandonment or rebrand; 90-day kill criteria apply |

### Weekly AUG Score logging

Every project auto-computes AUG Score weekly and logs to `.claude/state/AUG.md ## Weekly Score`. CSIL includes weekly AUG drift in check #13 (new in v2). Score dropping ≥5 points week-over-week → rollback-candidate investigation per I-22.

---

## Part 14 — INSTRUMENTATION CATALOG (every metric, ready to copy)

Full tracking-snippet catalog. Every fleet site wires these on Day 1 (per Day-1 Analytics Mandate, concept-finder-methodology v2.1 Layer 7).

### Plausible events (primary)

```javascript
// ACQUISITION — no custom events (Plausible auto-tracks pageviews + referrers)

// ACTIVATION
plausible('activated', { props: {
  activation_type: 'calculation_complete',  // or 'data_view', 'filter_apply', etc
  time_to_activation_sec: Math.round(timeToActivation),
  variant: experimentVariant || 'default'
}});

// ENGAGEMENT
plausible('scroll', { props: { depth: percentReached } });  // 25/50/75/100
plausible('content_interaction', { props: {
  element: 'sort_table',
  action: 'click'
}});
plausible('core_loop_complete', { props: { loop_type, steps } });

// RETENTION (server-side is more accurate — fire from Plausible Custom Properties)
plausible('returning_session_d7', { props: {
  days_since_last_visit: daysSinceLast,
  sessions_total: visitCountToDate
}});

// ADVOCACY
plausible('share', { props: {
  method,  // 'twitter' | 'linkedin' | 'copy_link' | 'email' | 'sharecard_download'
  surface  // 'result_page' | 'home' | 'article'
}});
plausible('embed_view', { props: { parent_domain } });

// PAYMENT / CONVERSION (if applicable — most fleet sites are 100% ads)
plausible('signup', { props: { source_channel } });
plausible('trial_start');
plausible('paid_convert', { props: { tier, mrr } });
```

### GA4 events (secondary, for Google ecosystem)

```javascript
// Standard events (GA4 enhanced measurement handles these automatically):
// - page_view
// - scroll (at 90% automatically; we augment with 25/50/75)
// - click (outbound)
// - file_download
// - video_start / video_complete

// Custom events
gtag('event', 'activation', {
  method: 'calculation_complete',
  time_to_value_seconds: 8.4
});

gtag('event', 'core_loop', {
  loop_type: 'calculation',
  items_count: 3,
  duration_sec: 45
});

gtag('event', 'share', {
  method: 'twitter_card',
  content_type: 'result',
  item_id: resultSlug
});

gtag('event', 'returning_user', {
  days_since_first_visit: daysSinceFirst,
  session_count: sessionCount
});
```

### Microsoft Clarity (session replay + heatmaps)

Instruments automatically:
- Click maps (which elements get attention)
- Scroll maps (where users stop reading)
- Session recordings (literal video of user session)
- Rage clicks, dead clicks, JavaScript errors

**Action items weekly:** watch 3 random session recordings to spot UX friction. Single highest-leverage non-instrumented signal.

### Cloudflare Web Analytics (free, privacy-first)

Zero-JS-except-beacon. Auto-tracks:
- Page views, unique visitors, top pages, top referrers
- Core Web Vitals per page (LCP, CLS, INP)
- Countries, device types

Pairs perfectly with Plausible — use CF for privacy-conscious users who block Plausible, use Plausible for deep custom events.

### Google Search Console (organic-search truth)

Weekly pull:
- Query impressions + clicks + CTR + position
- Top pages + top queries
- Page Experience signals

Wire via API for automated weekly digest to `GROWTH_ANALYTICS.md ## GSC Rollup`.

### AdSense (revenue truth)

Daily pull post-approval:
- RPM (revenue per thousand pageviews)
- Page RPM vs impression RPM
- CTR (click-through rate)
- Active view (ad was visible)
- Top-earning pages

Log to `.claude/state/ADSENSE.md ## Daily Rollup`.

### IndexNow (every deploy)

```javascript
// Part of `npm run deploy` pipeline
const urls = sitemapUrls;  // list of every URL updated this deploy
const body = {
  host: 'example.com',
  key: process.env.INDEXNOW_KEY,
  urlList: urls
};
await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  body: JSON.stringify(body)
});
```

### Server-side event log (authoritative truth)

Every HTTP request that matters logs to Cloudflare Workers Analytics or custom log:
- User-agent (LLM crawler detection)
- Referrer
- Session-anchor (first-party cookie + IP-hash)
- Core-loop completion server-side confirmation
- Share-URL click-through tracking

### Summary: the 7-layer analytics stack (Day-1 mandatory)

1. **Plausible** (primary traffic + custom events)
2. **Google Search Console** (organic search truth)
3. **Cloudflare Web Analytics** (Core Web Vitals + privacy fallback)
4. **IndexNow** (every deploy)
5. **Google Analytics 4** (ecosystem + Looker reports)
6. **Microsoft Clarity** (session replay + heatmaps)
7. **AdSense** (revenue truth, post-approval)

Setup time: ~90 min total on Day 1. Compound value: every ship decision for the next 3+ years is data-grounded instead of vibes-based.

---

## Part 15 — AAERA per-stage operator cadence

Given solo-founder constraints, here's the weekly time budget across AAERA stages for a mature site.

| Stage | Weekly hours | What you do |
|---|---:|---|
| Acquisition (v1) | 2-4h | Reddit organic, LinkedIn post, 1 HARO pitch, canonical cross-post if new content |
| Activation (v2) | 0.5h | Review Clarity session recordings; tweak one activation gap |
| Engagement (v2) | 0.5h | Plausible dashboard scan; identify worst-engaged page; queue fix |
| Retention (v2) | 0.5h | Check cohort curve; identify drop-off; queue core-loop improvement |
| Advocacy (v2) | 0.25h | Count shares + embeds; celebrate winners; audit share-card quality |
| **Total** | **~4-6h/week** | For one mature fleet site |

For a **5-site fleet**, total ≈ 10-15h/week operator time across all sites. If you can't sustain this, AcePilot's autonomous layer (v19.1 Autonomous Acquisition Engine) covers ~70% of it unattended.

---

## Part 16 — The deep principle (why AAERA matters more than acquisition alone)

Acquisition is a **linear cost** — every user costs roughly the same to acquire.

Activation, engagement, retention, and advocacy are **multiplicative benefits** — each one multiplies the value of every acquired user.

A site with 10,000 monthly visitors and:
- 15% activation × 2.1 pages/session × 20% D7 × 0.05 k-factor
- = acquires 10,000, activates 1,500, engages them for 3,150 pageviews/mo, 300 return the next week, 500 bring friends
- = compounded monthly trajectory shows **2.5× growth** over 12 months with zero extra acquisition spend

A site with same 10k visitors and:
- 5% activation × 1.3 pages/session × 5% D7 × 0 k-factor
- = acquires 10k, activates 500, 650 pageviews/mo, 50 return, 0 bring friends
- = **flat** trajectory despite same acquisition

**Same acquisition input. 5× different outcome. That's the AAERA leverage.**

Every hour invested in activation/engagement/retention/advocacy has compounding return — unlike acquisition, which depletes (channels saturate, costs rise, audiences overlap).

AcePilot's job is to ensure the fleet isn't just acquiring users — it's converting them, retaining them, and multiplying them. v1 gave us acquisition. v2 gives us the other four.

---

*End of v2. v3 additions below — Monetization · Segmentation · Experimentation · Qualitative · Performance · Flywheel · LLM-Visitor · Anti-fragility · AUG v3.*

---

## Part 17 — MONETIZATION ($/user — the layer that pays for everything else)

Silent-SEO fleet runs on ads. Every AAERA improvement must translate into revenue, or it's vanity. v3 adds monetization as an explicit funnel stage with its own metrics, tactics, and anti-patterns.

### The 7 monetization metrics

| # | Metric | Definition | Target (fleet) |
|---|---|---|---|
| M1 | **pRPM (page RPM)** | Revenue per 1000 pageviews | $12-30 (varies by vertical) |
| M2 | **iRPM (impression RPM)** | Revenue per 1000 ad impressions | $6-15 |
| M3 | **Viewable impression rate** | % ad loads that reach 50%-viewable ≥1s | ≥70% |
| M4 | **CTR (click-through rate)** | Clicks ÷ viewable impressions | 0.8-2.5% |
| M5 | **Ad density** | Total ad area ÷ viewable page area | 20-35% (HCU-safe) |
| M6 | **Revenue per session** | Total $ ÷ unique sessions | pRPM × pages/session ÷ 1000 |
| M7 | **Revenue per returning user** | Cumulative lifetime ad $ ÷ unique user | Grows with retention |

### RPM tiers by vertical (calibrated, 2026)

| Vertical | Typical pRPM | Peak pRPM | Examples |
|---|---:|---:|---|
| Finance | $15-30 | $45 | HoldLens, mortgage calcs |
| Business / B2B | $18-35 | $50 | CRO benchmarks, SaaS |
| Tech / Dev | $8-18 | $28 | Web dev tools, APIs |
| Food | $12-25 | $35 | Fermentcalc, Sourdough |
| Education | $8-18 | $25 | readinglist |
| Health (non-YMYL) | $10-20 | $28 | fitness calcs |
| Entertainment | $4-10 | $15 | games, memes |
| Gambling-adjacent | Restricted | — | down-weighted or banned |

### Ad placement science (ranked by RPM lift per placement)

| # | Placement | Lift vs baseline | Rule |
|---|---|---:|---|
| P1 | **Above-fold sticky banner** | +30% iRPM | Never overlay content; slide in after first scroll |
| P2 | **Inline within content (300w intervals)** | +25% viewable rate | One per ~300 words; never break a sentence |
| P3 | **Below fold + sticky sidebar (desktop)** | +15% viewable | Sidebar scroll-locked |
| P4 | **After result (calc sites)** | +40% CTR | Highest-intent moment; user has their answer, now browsing |
| P5 | **Interstitial on internal navigation** | -20% retention | AVOID — feels like shakedown |
| P6 | **Auto-play video ads** | -35% engagement | AVOID — violates I-23 |
| P7 | **Anchor ads on mobile bottom** | +22% iRPM | Dismissable; Google policy requires |

### AAERA → Monetization mapping (which AAERA improvements raise $$ most)

| AAERA improvement | Primary metric lifted | $$ impact |
|---|---|---|
| +1.0 pages/session (E2) | pRPM stays, sessions worth +100% | Direct, immediate |
| +30s time on page (E3) | Viewable impression rate +15% | +10% pRPM |
| +15% scroll depth (E5) | Below-fold ads now viewable | +20-40% on below-fold pRPM |
| -10% bounce rate (E1) | Sessions with 2+ pageviews = eligible for 2+ ad loads | +70% sessions seeing 2+ ads |
| +0.10 k-factor (advocacy V1) | Free acquisition; same pRPM on more sessions | Linear in k-factor |
| +5% D30 return rate (R3) | Returning users see ads 3-8× per month | Compounds over 6+ months |
| +40% activation (Ac) | Non-bouncers = ad-seeing users | Directly raises daily revenue |

### Monetization anti-patterns (HARD-NO per AdSense compliance + I-23)

- ❌ Ad density >40% of viewport (Google policy violation, account suspension risk)
- ❌ Ads that reflow content on load (CLS penalty, AdSense policy)
- ❌ Ads resembling navigation/buttons (click-fraud risk, policy violation)
- ❌ Pop-ups, pop-unders, exit-intent ads (AdSense ban)
- ❌ Forcing ad view before content (interstitial abuse)
- ❌ Encouraging ad clicks ("support us — click the ads below" = ban)
- ❌ Ads on privacy / terms / contact / 404 pages
- ❌ Ads on pages under 250 words of unique content (HCU thin-content signal)
- ❌ Multiple affiliate + display ads on same above-fold area (messy UX)

### Instrumentation for monetization

```javascript
// Log ad revenue daily (pulled from AdSense API → state file)
// .claude/state/ADSENSE.md ## Daily Rollup
// YYYY-MM-DD | pageviews | impressions | clicks | ctr | iRPM | pRPM | $

// Log viewable-impression events client-side
adSlot.addEventListener('viewable', () => {
  plausible('ad_viewable', { props: { slot: slotId, time_to_viewable_ms } });
});

// Log revenue per session by joining server logs + AdSense reports
// (server-side, off-site; AdSense doesn't expose per-session data directly)
```

---

## Part 18 — SEGMENTATION (averages lie)

An "average bounce rate of 55%" can hide a real story: desktop 38%, mobile 72%. Same site, completely different problems. v3 requires every metric to be looked at in segments before acting.

### The 6 primary segments (every fleet site tracks)

| # | Segment | Sub-groups | Why it matters |
|---|---|---|---|
| S1 | **Search intent** | Informational / Navigational / Commercial / Transactional | Different intents = different activation rates; don't average |
| S2 | **Device** | Mobile / Desktop / Tablet | Mobile is 55-65% of traffic but often 50% the RPM; treat separately |
| S3 | **Geo** | Tier-1 (US/UK/CA/AU/DE) / Tier-2 (EU/APAC) / Tier-3 (rest) | Tier-1 RPM 3-8× Tier-3; target content accordingly |
| S4 | **Referrer** | Organic search / Direct / Referral / Social / Email | Each has dramatically different activation/engagement baselines |
| S5 | **New vs. Return** | First visit / 2-5 visits / 6+ visits / 30-day inactive | Retention strategy depends on which cohort you're trying to grow |
| S6 | **Human vs. LLM-crawler** | Human / GoogleBot / GPTBot / ClaudeBot / PerplexityBot / Other bots | LLM bots index differently; separate their behavior from human metrics |

### Segmented AAERA targets (expanded from v2 baselines)

| Stage | Metric | Mobile target | Desktop target | Tier-1 geo | Tier-3 geo |
|---|---|---:|---:|---:|---:|
| Activation | Rate | ≥45% | ≥60% | ≥55% | ≥35% |
| Engagement | Bounce | <55% | <40% | <45% | <65% |
| Engagement | Pages/session | ≥1.8 | ≥2.4 | ≥2.1 | ≥1.5 |
| Engagement | Time on page | ≥60s | ≥120s | ≥90s | ≥50s |
| Retention | D7 return | ≥12% | ≥20% | ≥18% | ≥8% |
| Advocacy | Share rate | ≥2% | ≥4% | ≥3.5% | ≥1% |
| Monetization | pRPM | $0.30× baseline | 1.2× baseline | 1.0× baseline | 0.2× baseline |

### Segmented analysis — worked example

A fleet site shows overall AUG Score 22 (needs attention). Segmented:

| Segment | Sessions | Activation | D7 return | pRPM |
|---|---:|---:|---:|---:|
| Mobile / US / organic | 5,200 | 58% ✓ | 19% ✓ | $18 ✓ |
| Mobile / India / organic | 8,400 | 12% ✗ | 3% ✗ | $2 ✗ |
| Desktop / US / direct | 600 | 72% ✓✓ | 45% ✓✓ | $28 ✓✓ |

Conclusion: mobile India traffic is eating the average. **Decision options:**
1. Block India traffic via hreflang `en-US` + rel-canonical — tighten to Tier-1 only
2. Translate + localize to Hindi — compete on Tier-3 RPM volume
3. Accept as low-RPM but high-volume for brand/SEO signal
4. Audit why Tier-3 bounces — often the content doesn't match intent (translated queries)

Without segmentation, you'd spend a week "fixing activation" on the whole site when 85% of the problem is one segment.

### Segmentation anti-patterns

- ❌ Reporting "bounce rate" without device + geo breakdown
- ❌ A/B testing without stratifying by segment (noise dominates signal)
- ❌ Ignoring small but high-value segments (desktop direct converts 3-8× organic mobile)
- ❌ Shipping "one-size-fits-all" UX when mobile vs. desktop need different info architecture

---

## Part 19 — EXPERIMENTATION FRAMEWORK (proving cause & effect)

Every AAERA improvement is a hypothesis. Most untested hypotheses are wrong. v3 enforces experimental rigor so improvements ship based on proof, not vibes.

### The MDE (Minimum Detectable Effect) calculation

Before running any A/B test, calculate: **how big a lift can I plausibly detect with my traffic?**

```
MDE ≈ 4 × σ / √n    (rough heuristic)

Where:
  σ = metric standard deviation
  n = samples per variant

Example: current conversion 10%, weekly sessions 2000
  σ ≈ √(0.10 × 0.90) = 0.30
  n per variant over 2 weeks = 2000
  MDE ≈ 4 × 0.30 / √2000 ≈ 0.027 = 2.7 percentage points

Meaning: you can only reliably detect lifts ≥2.7 points (from 10% → ≥12.7%).
A +0.5 point lift won't be statistically visible.
```

If the hypothesis predicts smaller than your MDE: **don't run the test**. Either (a) ship the change based on qualitative reasoning alone, or (b) wait until you have more traffic.

### Sample size + run-time rules

| Traffic level (weekly sessions) | Minimum run-time | Minimum sample/variant |
|---|---|---|
| <500 | Don't A/B test | — |
| 500-2,000 | 4 weeks | 1,000 |
| 2,000-10,000 | 2 weeks | 2,000 |
| 10,000-50,000 | 1 week | 5,000 |
| 50,000+ | 5 days minimum (1 full week cycle) | 15,000 |

**Always run for at least one complete weekly cycle** to smooth day-of-week variance. A 3-day test ending Sunday-Tuesday vs. one ending Thursday-Saturday gives different answers on the same underlying site.

### Winner-declaration rules

A variant "wins" only when ALL of:

1. **Statistical significance p < 0.05** (frequentist) OR **posterior probability >95%** (Bayesian)
2. **Effect size exceeds MDE** — not just "statistically significant at tiny effect"
3. **Effect consistent across top 3 segments** (desktop + mobile + top geo minimum)
4. **No retention cliff in 7-day post-test window** (I-22 floor enforced on experiments too)
5. **No engagement cliff** (pages/session + time on page don't drop >5%)

Variants that only "win" on one segment = inconclusive, ship only to that segment or keep testing.

### Common experimentation failure modes

| # | Anti-pattern | Fix |
|---|---|---|
| X1 | **Peeking** — checking test every day and stopping when favorable | Lock test duration before start; don't look until done |
| X2 | **Seasonal confound** — running test over holiday week | Use same-week last month as baseline; or wait |
| X3 | **Novelty bias** — new feature spikes then decays | Add 2-week stabilization period before measuring |
| X4 | **Selection bias** — only showing variant to subset | Proper random assignment; log assignment client-side + server-side |
| X5 | **Primary-metric switching** — declaring a winner on a secondary metric when primary didn't move | Pre-commit primary metric; ignore secondary |
| X6 | **Simpson's paradox** — aggregate wins, every segment loses | Always check segment-level before declaring |
| X7 | **HARKing** — hypothesizing after results known | Write hypothesis + predicted direction BEFORE test |
| X8 | **Underpowered declarations** — "p = 0.08, close enough" | No. Inconclusive = inconclusive. Don't ship. |

### Tools for fleet-scale experimentation

- **Plausible Goals + custom events** — free, privacy-first, adequate for MDE >3%
- **GrowthBook** (self-hosted or free tier) — full A/B/n platform with feature flags
- **Vercel Edge Config + middleware** — code-level variant assignment, zero-latency
- **Statsig / LaunchDarkly** — enterprise; overkill for fleet
- **Native custom** — coin-flip in middleware + event log + statsig.net calculator
- **VWO** — UI-layer A/B (no code); useful for rapid copy tests

### Minimum experimentation discipline (binding on fleet)

Every ship that claims to improve an AAERA metric must include, in the commit message or DECISIONS.md:

```
HYPOTHESIS: [change] will [raise/lower] [metric] by ≥[amount]
  because [mechanism]
PREDICTION: [specific directional outcome + MDE confidence]
EXPERIMENT: [A/B? holdout? before/after? noted caveats]
DECISION RULE: [what result makes us keep vs. roll back]
```

Changes shipped without this block are logged as `vibes-based-ship` in ANALYTICS.md and audited monthly.

---

## Part 20 — QUALITATIVE SIGNALS (what quant can't see)

Quant tells you WHAT users did. Qualitative tells you WHY. Both required. v3 formalizes qualitative methods, frequencies, and integration back into decisions.

### The 6 qualitative methods (frequency × yield)

| # | Method | Frequency | Time cost | Signal yield |
|---|---|---|---|---|
| Q1 | **PMF survey** ("How would you feel if this went away?") | Quarterly | 30 min to write, 30 to analyze | Huge — 40%+ "very disappointed" = PMF |
| Q2 | **NPS survey** (0-10, "would recommend") | Quarterly | 20 min | Medium — trend matters more than level |
| Q3 | **User interviews (5 users)** | Every 3 months | 4-6 hours total | Highest — 5 interviews > 500 survey responses |
| Q4 | **Session replay rotation (Clarity)** | Weekly | 15 min to watch 3 random sessions | High — spots friction quant misses |
| Q5 | **Support ticket / email pattern analysis** | Monthly | 30 min | High — real pain points surface |
| Q6 | **Reddit / X / LinkedIn mention scan** | Weekly | 10 min | Medium — unprompted feedback signal |

### PMF survey (canonical)

Ship this once per quarter to returning users (≥3 visits):

```
1. How would you feel if you could no longer use [site name]?
   - Very disappointed
   - Somewhat disappointed
   - Not disappointed (it isn't that useful)
   - N/A — I no longer use it

2. What type of person do you think would most benefit from [site]?
   [open-ended]

3. What is the main benefit you receive from [site]?
   [open-ended]

4. How can we improve [site] for you?
   [open-ended]
```

**PMF threshold:** ≥40% "Very disappointed" = product-market fit (Sean Ellis, 2009; calibrated by hundreds of startups since).

### User interview script (5 users × 30 min)

```
SEGMENT 1 (5 min) — Context
  - Who are you? What do you do?
  - How did you first find [site]?
  - What were you trying to do?

SEGMENT 2 (15 min) — Task flow (screenshare)
  - Walk me through a recent time you used [site]. What were you trying to accomplish?
  - [Observe in silence. Note hesitations, confusions, workarounds.]

SEGMENT 3 (10 min) — Alternatives + counterfactuals
  - What other tools do you use for this?
  - If [site] didn't exist, what would you use instead?
  - What would make [site] 10× more useful to you?

CAPTURE:
  - Single biggest pain point in their actual workflow
  - Exact language they use to describe problem (verbatim for copy)
  - Features they don't know exist (activation gap signal)
```

### Session-replay audit rotation

Every Monday, watch 3 random Clarity sessions. Categorize each:

| Session type | What to look for |
|---|---|
| Rage clicks | User clicked same area 3+ times in <2s → UX affordance broken |
| Dead clicks | User clicked something not interactive → mislabeled element |
| Scroll-and-leave | Full scroll, no click, quick exit → content not actionable |
| Rapid back-forward | Navigating to and away repeatedly → not finding what they want |
| Long idle then action | User actually reading → engagement win; replicate conditions |

Log findings to `.claude/state/QUALITATIVE.md ## Weekly Replay Rotation`.

### Integrating qualitative into AAERA

| Qualitative signal | AAERA stage it informs | Action |
|---|---|---|
| "I didn't know feature X existed" (interview) | Activation | Surface X in onboarding / deep-link / tooltip |
| "I wish I could do Y" (PMF Q4) | Engagement + Retention | Roadmap; feature-gap flag |
| Rage clicks on button Z (replay) | Activation or Engagement | Fix button immediately |
| "I'd pay for..." (interview) | Monetization | Pricing test hypothesis |
| NPS dropping 3 months straight | Retention | Root-cause audit urgent |
| Reddit mentions spike unprompted | Advocacy | Amplify; understand why |
| Support emails about same pain 5× | Every stage | System-level issue; deprioritize other work |

### Qualitative anti-patterns

- ❌ Surveys with 20+ questions (completion rate collapses; bias dominates)
- ❌ Leading questions ("How much do you love our new design?")
- ❌ Interviewing only happy users (survivorship bias)
- ❌ Ignoring negative signals because they're uncomfortable
- ❌ Making decisions on n=1 anecdotes without triangulation
- ❌ Spending more time analyzing than acting

---

## Part 21 — PERFORMANCE AS A GROWTH MULTIPLIER

Core Web Vitals aren't a technical concern — they're a growth lever that multiplies every AAERA stage simultaneously. v3 documents the measured impact.

### The 5 performance metrics that matter

| # | Metric | Definition | Target | Failure threshold |
|---|---|---|---|---|
| P1 | **LCP (Largest Contentful Paint)** | Time until main content visible | <1.5s | >4s |
| P2 | **INP (Interaction to Next Paint)** | Time from user input to paint | <200ms | >500ms |
| P3 | **CLS (Cumulative Layout Shift)** | Visual instability (0-1 score) | <0.05 | >0.25 |
| P4 | **TTFB (Time to First Byte)** | Server response time | <400ms | >800ms |
| P5 | **Page weight** | Total transferred KB | <100KB | >500KB |

### Measured AAERA impact per performance improvement

| Performance improvement | Impact on AAERA stage |
|---|---|
| LCP 4s → 2s | Bounce rate -20%, activation +15%, pages/session +0.4 |
| LCP 2s → 1s | Bounce -10%, activation +8%, pages/session +0.2 |
| INP 500ms → 200ms | Activation +12%, rage-click rate -50% |
| CLS 0.15 → 0.02 | Bounce -5%, ad viewable rate +15%, pRPM +8% |
| TTFB 1s → 300ms | Mobile bounce -18% (mobile disproportionately affected) |
| Page weight 500KB → 100KB | Tier-3 geo activation +35% (data-cost sensitive) |

### Performance-as-moat

A site with LCP 1.2s + INP 150ms + zero CLS + 80KB pages:
- Ranks higher (Google's Page Experience is a ranking signal)
- Converts better (every AAERA stage lifted)
- Serves Tier-3 geos meaningfully (100k+ potential users/mo that slow sites lose)
- Costs less to run (no CDN bandwidth overage)
- Survives mobile degradation (slow 3G test passes)

Most competitors won't invest here because it's invisible to them. That's the moat.

### Quick-win performance tactics

| # | Tactic | Expected improvement | Effort |
|---|---|---|---|
| P-T1 | Static export (Next.js `output: 'export'`) | LCP -60%, TTFB -80% | Medium |
| P-T2 | Cloudflare Pages / Workers deployment | TTFB -70% globally | Low |
| P-T3 | Critical CSS inlined, rest lazy | LCP -30% | Low |
| P-T4 | Font stack without custom fonts (or `font-display: optional`) | LCP -20%, CLS -80% | Low |
| P-T5 | Image dimensions + `decoding="async"` + AVIF | CLS -90%, LCP -25% | Low |
| P-T6 | Defer all non-critical JS | INP -50% | Medium |
| P-T7 | Zero above-fold images (CSS gradients) | LCP <800ms | Low |
| P-T8 | Resource hints (`preconnect`, `dns-prefetch`) | TTFB -100ms | Low |
| P-T9 | Remove jQuery / lodash / moment.js | Page weight -70% | High |
| P-T10 | `content-visibility: auto` for below-fold | Paint time -40% on long pages | Low |

### Performance instrumentation

```javascript
// Web Vitals library (Google official)
import { onLCP, onINP, onCLS, onTTFB } from 'web-vitals';

onLCP(m => plausible('lcp', { props: { value: Math.round(m.value), rating: m.rating } }));
onINP(m => plausible('inp', { props: { value: Math.round(m.value), rating: m.rating } }));
onCLS(m => plausible('cls', { props: { value: Math.round(m.value * 1000), rating: m.rating } }));
onTTFB(m => plausible('ttfb', { props: { value: Math.round(m.value), rating: m.rating } }));

// Cloudflare Web Analytics auto-captures these. Plausible + GA4 can receive.
// GSC Page Experience report shows field data (real users).
```

Weekly review: GSC Page Experience → "Poor URLs" list → fix one per week.

---

## Part 22 — THE AAERA FLYWHEEL (compound loops)

Stages don't sit in a line. They connect in 5 feedback loops that compound or collapse together. v3 makes the loops explicit.

### The 5 compounding loops

```
LOOP 1 — Activation → Engagement:
   More users activating → more signal on what engages them
   → better internal links, suggested content, UI micro-improvements
   → next cohort engages faster

LOOP 2 — Engagement → Retention:
   Deeper session = more memorable = higher bookmark + direct return
   Multiple pages viewed = multiple exit points remembered
   Each remembered page = potential return trigger

LOOP 3 — Retention → Advocacy:
   Returning users are the ones who recommend
   First-time visitors rarely share; 3+ visit users share 5× more often
   Retention is the hidden prerequisite to viral growth

LOOP 4 — Advocacy → Acquisition:
   Shares become backlinks → rankings rise → more organic traffic
   Embeds become permanent channels → compound forever
   Word-of-mouth is the only non-depleting acquisition

LOOP 5 — Acquisition → Activation:
   Better-targeted acquisition (right query, right landing) = higher activation
   Branded search (from retention + advocacy) = pre-qualified visitors
   Direct traffic (from retention) has 2-3× activation of cold organic
```

### Visual flywheel

```
              ┌──────────────┐
              │ ACQUISITION  │
              │  (v1 — 90+   │
              │   channels)  │
              └──────┬───────┘
                     │ users find site
                     ▼
   ┌─────────────────────────────────┐
   │                                 │
   │         ACTIVATION              │
   │     (Part 9 — first 10s)        │◄──────┐
   │                                 │       │
   └──────────────┬──────────────────┘       │
                  │ first value delivered    │
                  ▼                          │
   ┌─────────────────────────────────┐       │
   │                                 │       │
   │         ENGAGEMENT              │       │
   │   (Part 10 — depth of session)  │       │
   │                                 │       │
   └──────────────┬──────────────────┘       │
                  │ meaningful use           │
                  ▼                          │
   ┌─────────────────────────────────┐       │
   │                                 │       │
   │         RETENTION               │       │
   │  (Part 11 — come back)          │       │
   │                                 │       │
   └──────────────┬──────────────────┘       │
                  │ memory + direct return   │
                  ▼                          │
   ┌─────────────────────────────────┐       │
   │                                 │       │
   │         ADVOCACY                │       │
   │  (Part 12 — tell others)        │       │
   │                                 │       │
   └──────────────┬──────────────────┘       │
                  │ shares, embeds, WOM      │
                  ▼                          │
   ┌─────────────────────────────────┐       │
   │                                 │       │
   │  MONETIZATION + COMPOUND        │       │
   │  $$ to reinvest + free          │       │
   │  acquisition from referrals     │       │
   │                                 │       │
   └──────────────┬──────────────────┘       │
                  │ better targeting         │
                  └──────────────────────────┘
                    (feeds back to Activation)
```

### Flywheel breakdown signals

| Broken loop | Symptom | Common cause |
|---|---|---|
| Activation → Engagement | High activation, bounce stays high | Site teaches feature but nothing to do next |
| Engagement → Retention | Long sessions, zero D7 return | No reason to come back (one-time intent) |
| Retention → Advocacy | High D30 return, k-factor ~0 | No share triggers; users keep it to themselves |
| Advocacy → Acquisition | High share count, no backlink rise | Share mechanism doesn't create URLs; private chats only |
| Acquisition → Activation | Traffic up, activation flat | Wrong-intent traffic (keyword mismatch) |

### Flywheel-strengthening priorities (when to invest where)

| If weakest loop | Invest in |
|---|---|
| Acquisition → Activation | Copy on landing page matches search intent; hero is the tool |
| Activation → Engagement | "What next?" signposting after activation; internal links |
| Engagement → Retention | Save/bookmark features; "come back next week" triggers |
| Retention → Advocacy | Share buttons per-result; embed-this-widget prominently |
| Advocacy → Acquisition | Ensure shares create public URLs; OG preview quality |

### The compounding math

A site where every stage is at 10% (ten users in → one makes it through):
- 1000 acquire → 100 activate → 10 engage deeply → 1 return → 0 advocate

Same site at 30% per stage:
- 1000 acquire → 300 activate → 90 engage → 27 return → 8 advocate
- 8 advocates × 5 new users each = 40 free acquisitions = 4% effective +

At 50% per stage:
- 1000 → 500 → 250 → 125 → 62
- 62 advocates × 5 = 310 free = 31% effective +

**Geometric, not linear.** Raising all 5 stages from 10% to 30% doesn't triple output — it multiplies by ~27×. That's the flywheel math.

---

## Part 23 — LLM-VISITOR BEHAVIOR (emerging, 2026)

LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Googlebot-Extended, Applebot-Extended, CCBot) now generate meaningful traffic + citation impressions. They behave differently than human users. v3 treats them as a first-class segment.

### Known LLM crawler user-agents (2026-verified)

| Crawler | User-agent substring | Owner | Purpose |
|---|---|---|---|
| GPTBot | `GPTBot` | OpenAI | ChatGPT training + retrieval |
| ClaudeBot | `ClaudeBot` | Anthropic | Claude retrieval + training |
| PerplexityBot | `PerplexityBot` | Perplexity | Perplexity search |
| Googlebot-Extended | `Googlebot/` + extended signal | Google | Gemini + AI Overviews |
| Applebot-Extended | `Applebot-Extended` | Apple | Apple Intelligence |
| CCBot | `CCBot` | Common Crawl | Training-data source |
| Amazonbot | `Amazonbot` | Amazon | Alexa + retrieval |
| Bytespider | `Bytespider` | ByteDance | Doubao AI |
| Meta-ExternalAgent | `Meta-ExternalAgent` | Meta | Llama training |

### How LLM crawlers differ from human users

| Dimension | Human | LLM Crawler |
|---|---|---|
| Pages per session | 1-5 | 1-1000+ (depending on crawl-depth config) |
| Time on page | 60-180s | <1s (parse and move on) |
| JS execution | Yes | GPTBot + PerplexityBot don't execute JS; ClaudeBot + Google partially |
| Cookie state | Yes | No (stateless per request) |
| Referrer | Varies | None |
| Scroll | Yes | No (downloads HTML once) |
| Event firing | Yes | No (no JS) |
| Interest in: | Above-fold | HTML content start-to-end; metadata; structured data |

### Optimizing for LLM citation

Every LLM crawler indexes content to later cite it in an LLM response. Optimize for citation-fit using the Aleyda Solis 10-characteristic checklist (from concept-finder-methodology v2.1):

1. **Accessible** — static HTML or SSR; no JS-gated content
2. **Useful** — unique dataset with depth
3. **Recognizable** — consistent brand entity (Organization schema everywhere)
4. **Extractable** — section headings are quote-ready sentences; DefinedTerm schema for key concepts
5. **Consistent** — brand voice consistent; visual identity consistent
6. **Corroborated** — facts appear in ≥3 independent sources (site + Reddit + Wikipedia)
7. **Credible** — E-E-A-T signals (About page with author; Person schema; citations)
8. **Differentiated** — explicit POV; "Our view:" sentence per page
9. **Fresh** — `datePublished` + `dateModified` in schema; update cadence visible
10. **Transactable** — user can act from the citation (URL + clear CTA)

### LLM-crawler-specific instrumentation

```javascript
// Server-side middleware
const ua = req.headers.get('user-agent') || '';
const isLLMCrawler = /GPTBot|ClaudeBot|PerplexityBot|Applebot-Extended|CCBot|Amazonbot|Bytespider|Meta-ExternalAgent/.test(ua);
const isGoogleExtended = /Googlebot/.test(ua);

if (isLLMCrawler || isGoogleExtended) {
  // Log separately; NOT as human traffic
  await logCrawlerVisit({
    crawler: matchCrawlerName(ua),
    path: req.url,
    timestamp: Date.now()
  });
  // Serve identical content — no cloaking (I-34)
}
```

Track in `.claude/state/LLM_CRAWLERS.md ## Weekly Crawl Log`:
- Crawler × pages hit × frequency
- Which pages get crawled most (signals LLM interest)
- Cadence shifts (crawlers returning more = signal strength rising)

### LLM citation tracking (the emerging KPI)

Manual weekly check: ask Claude / ChatGPT / Perplexity / Gemini a query in your niche. Does your site get cited?

```
Test queries for HoldLens:
  - "What is Warren Buffett's largest position in 2026?"
  - "How does a 13F filing work?"
  - "Best tool to track hedge fund holdings"

Test queries for Fermentcalc:
  - "What percent salt for sauerkraut?"
  - "How long to ferment pickles?"
  - "Fermentation calculator tool"
```

Log citations in `.claude/state/LLM_CITATIONS.md ## Weekly Citation Check`. Watch for: are we cited, by name, with URL, as primary source? Trend over time.

### Robots.txt strategy for LLM crawlers

Default: allow all LLM crawlers. They drive citation traffic. Block only if:
- Your site monetizes via ads and crawler traffic is pure cost (e.g., they fetch 50k pages/day but you get zero citation benefit)
- Sensitive data concerns (fleet sites shouldn't have these)

Monitor cost vs. benefit monthly via server logs + citation check.

---

## Part 24 — ANTI-FRAGILITY (surviving algorithm & platform shifts)

Silent-SEO fleet sites exist inside platforms that can change policy overnight — Google HCU, AI Overview rollouts, AdSense policy updates, Cloudflare pricing shifts. v3 codifies resilience patterns.

### The 8 disruption risks (2026-relevant)

| # | Risk | Historical impact | Mitigation |
|---|---|---|---|
| D1 | **Google HCU (Helpful Content Update)** | Sites lose 40-80% traffic overnight if flagged | Unique-data-per-page; cite sources; human editorial; audit quarterly |
| D2 | **AI Overview eats query** | High-ai-overview-risk queries lose 50-90% CTR | Avoid extractable-in-one-sentence queries; build depth + synthesis |
| D3 | **AdSense policy change or account ban** | Revenue zero until fixed | Diversify: Ezoic/Mediavine ready as fallback; multiple payment methods on account |
| D4 | **Cloudflare/Vercel/platform pricing** | Surprise bandwidth bill | Stay within free tier boundaries; monitor monthly; static export reduces bill |
| D5 | **Niche-specific SERP shift** | Competitor DR 85+ enters your top 3 | Build moat dimensions (Part 1 Moat Test: synthesis, editorial, time-compound, brand) |
| D6 | **Domain / brand issue** (trademark, typosquat) | Delisting, legal cost | Register typos; trademark brand once profitable; monitor |
| D7 | **Operator burnout / capacity cliff** | Fleet rots if operator drops out 3+ months | v19.1 Autonomous Acquisition Engine; write playbooks; build to run unattended |
| D8 | **Regulatory (GDPR, CCPA, DMA)** | Fines or feature loss | Cookie-consent properly implemented; data-retention policies; no PII storage |

### Anti-fragility patterns

| Pattern | How it helps |
|---|---|
| **Diversify acquisition** (never >40% from one channel) | D1 hit on SEO = 40% loss max, not 100% |
| **Own the email list** (newsletter of returning users) | Direct channel independent of any platform |
| **Operator = identifiable human** (Person schema, About page, social presence) | D2 — LLM citation defaults to credible humans when extraction is tied |
| **Finite public dataset** (v1 archetype) | D1 — HCU doesn't penalize unique source data; penalizes fluff |
| **Static export + Cloudflare Pages** | D4 — free tier holds up to ~100k/day; zero server cost |
| **Multiple analytics providers** (Plausible + GA + CF Web) | D3 — AdSense ban doesn't kill traffic visibility |
| **Per-ship retention + love check** (I-22/23) | D1 — HCU-class quality floor built in |
| **Competitive intelligence weekly** | D5 — spot DR 85+ entry before they displace you |
| **90-day runway** (site can run 3 months unattended) | D7 — temporary operator absence doesn't kill fleet |
| **Regulatory compliance baked in** (cookie banner, no-PII-in-state) | D8 — no surprises |

### Disruption playbook (when risk materializes)

```
Step 1: Acknowledge loss honestly (status-report-honesty rule applies)
Step 2: Identify which risk hit (D1-D8)
Step 3: Look at segmented data — which pages / geos / queries affected?
Step 4: Hypothesize cause (HCU = quality; AI Overview = extractability; policy = specific violation)
Step 5: Run mitigation (ordered by evidence)
Step 6: Measure 7d + 30d post-mitigation
Step 7: If recovered: document in PATTERNS.md for future fleet protection
Step 8: If not recovered after 90 days: consider sunset or rebuild
```

### Diversification targets (per fleet site, mature)

| Acquisition source | Max share | If exceeded |
|---|---:|---|
| Google organic search | 40% | Invest in GEO/AEO + non-search channels |
| One specific query cluster | 15% | Build breadth; don't depend on one query |
| LinkedIn / X / Reddit | 20% each | Don't let any social platform become dominant |
| Email list | 15% | Grow but don't over-index (can't buy ads on it) |
| Direct / brand | Ideally 20%+ | Signal of brand strength; target to grow |

---

## Part 25 — AUG SCORE v3 (7-factor composite)

v2 AUG Score was 5-factor (AAERA). v3 adds Monetization + Performance. Same multiplicative (geometric) logic — zero in any stage near-zeros the whole.

### v3 formula

```
AUG_v3 = 100
  × acquisition_health      (1-10)
  × activation_health       (1-10)
  × engagement_health       (1-10)
  × retention_health        (1-10)
  × advocacy_health         (1-10)
  × monetization_health     (1-10)  [v3 NEW]
  × performance_health      (1-10)  [v3 NEW]
  ÷ 10^7                    (normalize to 0-100)

Equivalent: geometric mean × 10 across 7 scores.
```

### New per-stage rubric (v3 additions)

**Monetization health (M, 1-10):**
- 1: $0/week (pre-approval or policy-blocked)
- 3: <$5/week
- 5: ~$30/week
- 7: ~$150/week
- 9: ~$600/week
- 10: $2,000+/week

**Performance health (Pf, 1-10):**
Composite of 4 CWV sub-scores (each 0-2.5):
- LCP p75 <1.5s: 2.5 · 1.5-2.5s: 1.5 · 2.5-4s: 0.75 · >4s: 0
- INP p75 <200ms: 2.5 · 200-500ms: 1.5 · >500ms: 0
- CLS p75 <0.05: 2.5 · 0.05-0.1: 1.5 · 0.1-0.25: 0.75 · >0.25: 0
- TTFB p75 <400ms: 2.5 · 400-800ms: 1.5 · >800ms: 0

### Calibrated v3 examples (fleet reality)

| Site | Acq | Act | Eng | Ret | Adv | Mon | Perf | AUG v3 | Status |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| holdlens.com (Y1 target) | 5 | 6 | 6 | 5 | 5 | 4 | 8 | ~14 | Healthy new, pre-monetization maturity |
| holdlens.com (Y2 target) | 7 | 7 | 7 | 6 | 6 | 6 | 8 | ~29 | Compounding |
| holdlens.com (Y3 target) | 8 | 8 | 8 | 7 | 7 | 7 | 9 | ~44 | Mature |
| Fleet champion hypothetical | 9 | 8 | 8 | 8 | 7 | 8 | 10 | ~57 | Best-in-class |
| Viral tool (advocacy-heavy, shallow retention) | 9 | 8 | 6 | 4 | 9 | 5 | 7 | ~17 | Leaky bucket |
| Zombie site | 7 | 2 | 2 | 2 | 1 | 1 | 5 | ~0.03 | 90-day kill candidate |

### v3 action thresholds

| AUG v3 Score | Status | Action |
|---|---|---|
| >50 | Fleet champion | Scale horizontally; build next site |
| 30-50 | Thriving | Weekly iteration; invest in weakest stage |
| 15-30 | Healthy | CSIL audit; per-stage improvement queue |
| 5-15 | Needs focus | Halt new features; one-stage focus sprint |
| 1-5 | Critical | Rollback recent ships; @reviewer + @strategist + @craftsman triage |
| <1 | Zombie | 90-day kill criteria review; rebrand or sunset |

### Weekly AUG v3 logging

```
.claude/state/AUG.md ## Weekly Score v3

YYYY-MM-DD | acq | act | eng | ret | adv | mon | perf | AUG_v3 | WoW delta | top weakness
2026-04-18 |  5  |  6  |  6  |  5  |  5  |  4  |  8   |  14    |  +0       | monetization
```

CSIL check #14 (v3 NEW) monitors weekly AUG v3 drift. Score dropping ≥5 WoW → rollback-candidate investigation per I-22.

---

## Part 26 — THE COMPLETE GROWTH-ENGINEERING LOOP

Putting v1 + v2 + v3 together, the fleet now operates an end-to-end growth-engineering loop:

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. CONCEPT PICK (concept-finder-methodology v2.1.1)              │
│    → Finite-dataset test, moat test, AI-Overview risk,           │
│      triple-Oracle ranking                                       │
│    → Concept APS ≥15 to greenlight                               │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 2. BUILD (Day 1-7 ship pattern)                                  │
│    → Day-1 Analytics Mandate (GA4+Plausible+Clarity+CF+GSC+      │
│      AdSense+IndexNow wired)                                     │
│    → LLM-citation 10-characteristic design                       │
│    → Performance baseline (LCP <1.5s, CLS <0.05)                 │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 3. LAUNCH (AceUserGrowth v1 — Acquisition)                       │
│    → 90-day new-site sequencing                                  │
│    → Stack 3-5 autonomous channels (embeds, IndexNow,            │
│      canonical cross-posts, llms.txt, schema)                    │
│    → Operator: 1 HN Show HN, 3-5 podcast pitches, 5 HARO/wk      │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 4. RUN THE AAERA FUNNEL (AceUserGrowth v2)                       │
│    → Instrument all 5 stages from Day 1                          │
│    → Weekly AUG Score computed                                   │
│    → Weakest stage = next week's focus                           │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 5. ENGINEER GROWTH (AceUserGrowth v3)                            │
│    → Segment every metric before acting                          │
│    → A/B test only when MDE is feasible                          │
│    → Qualitative: 3 replays/wk + quarterly PMF survey            │
│    → Performance weekly (one CWV fix per week)                   │
│    → LLM-visitor optimization monthly                            │
│    → Anti-fragility: diversify, monitor risks                    │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│ 6. CALIBRATE (learn-from-data.md)                                │
│    → 7d + 30d post-ship actuals feed LEARNED.md                  │
│    → Oracle multipliers self-adjust (I-28, bounded ±50%)         │
│    → Fleet-level LEARNED rollup compounds knowledge              │
└──────────────────────────────────────────────────────────────────┘
                   │
                   ▼ (every 90 days)
                   
             AUG v3 < 5 → 90-day kill-criteria review
             AUG v3 ≥ 50 → launch next concept (go to 1)
```

---

## Changelog

### v3 — 2026-04-18

**Operator directive:** *"make v3"*.

**Headline:** growth-engineering layer. v2 measured growth; v3 engineers it.

New parts (17-26):
- **Part 17 — MONETIZATION** — 7 metrics (pRPM, iRPM, viewable rate, CTR, density, $/session, $/returning-user), RPM tiers by vertical, 7 ad-placement patterns with lift data, AAERA→$ mapping, anti-patterns (AdSense policy-aligned)
- **Part 18 — SEGMENTATION** — 6 primary segments (intent, device, geo, referrer, new-vs-return, human-vs-LLM), segmented AAERA targets, worked example showing how averages lie
- **Part 19 — EXPERIMENTATION FRAMEWORK** — MDE calculation, sample-size rules, run-time minimums, 5-criterion winner declaration, 8 failure modes (peeking, seasonal confound, novelty bias, etc.), tooling, mandatory hypothesis commit block
- **Part 20 — QUALITATIVE SIGNALS** — PMF survey (Sean-Ellis canonical), NPS, 5-user interview script, session-replay rotation, support-ticket pattern analysis, integration into AAERA decisions
- **Part 21 — PERFORMANCE AS GROWTH MULTIPLIER** — 5 CWV metrics, measured AAERA impact per improvement (LCP 4s→2s = -20% bounce + 15% activation), 10 quick-win tactics, instrumentation
- **Part 22 — THE AAERA FLYWHEEL** — 5 compounding loops between stages, ASCII flywheel diagram, breakdown signals, compounding math (10%→30% per stage = ~27× output, not 3×)
- **Part 23 — LLM-VISITOR BEHAVIOR** — 9 LLM-crawler user-agents identified, human-vs-LLM behavioral differences, Aleyda Solis 10-characteristic optimization, LLM citation tracking, robots.txt strategy
- **Part 24 — ANTI-FRAGILITY** — 8 disruption risks (HCU, AI Overview, AdSense, Cloudflare, SERP, brand, burnout, regulatory), anti-fragility patterns, disruption playbook, diversification targets
- **Part 25 — AUG SCORE v3** — expanded to 7-factor (added Monetization + Performance), updated rubric, calibrated fleet examples, new action thresholds, v3 weekly logging format
- **Part 26 — COMPLETE GROWTH-ENGINEERING LOOP** — end-to-end diagram connecting concept-finder-methodology → build → launch → AAERA → engineer → calibrate

**AUG Score change:** v2 was 5-factor (AAERA); v3 is 7-factor (AAERAM+P). Geometric mean × 10 logic preserved. Zero in any stage still near-zeros the whole.

**Companion rules referenced:**
- `rules/adsense-compliance.md` (ad-placement anti-patterns)
- `rules/learn-from-data.md` (calibration loop)
- `rules/evolution-invariants.md` I-22, I-23, I-26 (retention/love/distribution floors bind experiments too)
- `rules/death-guard.md` check #14 (v3 NEW — AUG drift detector)

**All v1 + v2 content preserved.** v3 is purely additive.

**Next trigger for v4 bump:** AUG v3 calibration data across ≥3 fleet sites (expected 2026-08-18 after Fermentcalc + Conversionbench + Sourdough Week-16 audits). Likely v4 focus: cohort-specific AAERA variation, experiment results compounding into shared fleet learnings, LLM-citation-driven traffic as its own measured channel.

### v2 — 2026-04-18

**Operator directive:** *"make v2. think deep about users actions, like users engagement, pageviews, time on page and such"*.

**Headline addition: full AAERA funnel** (Acquisition · Activation · Engagement · Retention · Advocacy). v1 covered Acquisition in depth (90+ channels, 16 categories). v2 adds 4 new stages + composite scoring + full instrumentation catalog.

New parts:
- **Part 9 — ACTIVATION** (first-session conversion): 10 tactics (A1-A10), activation metric per site-profile, 8 activation anti-patterns, instrumentation
- **Part 10 — ENGAGEMENT** (depth of session): 10 metrics (E1-E10), 15 lift tactics (E-T1 to E-T15), 8 anti-patterns, full instrumentation
- **Part 11 — RETENTION** (return visits + cohorts): 8 metrics (R1-R8), 10 tactics (R-T1 to R-T10), Core-Loop Test matrix, I-22-bound anti-patterns
- **Part 12 — ADVOCACY** (shares + referrals + viral loops): 7 metrics (V1-V7), 10 features (V-F1 to V-F10), k-factor instrumentation, anti-patterns
- **Part 13 — AUG SCORE** (composite 0-100 health): formula, per-stage rubric, calibrated fleet examples, action thresholds, weekly logging
- **Part 14 — INSTRUMENTATION CATALOG**: ready-to-copy snippets for Plausible / GA4 / Clarity / CF Analytics / GSC / AdSense / IndexNow / server-side
- **Part 15 — Operator weekly cadence** across AAERA for solo-founder
- **Part 16 — The deep principle** (AAERA compound math vs. acquisition-linear math)

**All v1 content preserved.** v2 is purely additive.

**Fleet compound:** every future fleet site ABSORBs AUG at step 8. AUG Score logged weekly to `.claude/state/AUG.md`. CSIL check #13 monitors AUG drift. Sites scoring <15 trigger P1 intervention; <5 trigger 90-day kill-criteria review.

**Next trigger for v3 bump:** AUG Score calibration data across ≥3 fleet sites. Expected 2026-08-18 after Fermentcalc + Conversionbench + Sourdough Week-16 audits provide enough data to recalibrate the rubric numerics.

### v1.0 — 2026-04-18

Initial codification. Built in response to operator directive: "besides seo, GEO, AEO, what other ways are the best to get users to your website? longer better deeper, more details. i want to be able to use this for any site".

Incorporates: v18.0 calibrated Distribution Oracle multipliers · v19.1 Autonomous Acquisition Engine 12-channel spec · I-34 immutable hard-rejects · HoldLens live-ship calibration data · Aleyda Solis 10-characteristic LLM-citation checklist · 7-Profile per-site recipe matrix.
