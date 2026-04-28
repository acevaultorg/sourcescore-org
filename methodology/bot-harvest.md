# Bot Harvest — operational playbook for LLM/AI-crawler traffic (v1.0, 2026-04-19)

**Binding on every fleet site from v19.4 forward.** This file is the how-to companion to v19.4's brain-level Bot Harvest spec. It answers three operator questions in order:

1. How do we monetize bot traffic?
2. How do we get more bots to crawl us, fast?
3. How do we design products so bots extract maximum value for us?

Source research grounded in 2025–2026 data on Cloudflare Pay-Per-Crawl GA, TollBit publisher deals, ProRata.ai licensing, ai.robots.txt directory adoption, LLM-citation CTR studies (Semrush + Ahrefs 2025), Google HCU behavior with AI crawler allowlists.

---

## Part 1 — The frame

A 2,500/day bot crawl to holdlens.com is not noise — it is:

- **Inventory** (Cloudflare Pay-Per-Crawl can bill each one)
- **A citation opportunity** (each crawled fact can land in ChatGPT/Claude/Perplexity answers)
- **A downstream acquisition channel** (citations drive humans with intent: 8–18% CTR vs 2–5% organic)
- **Free data-about-demand** (which pages get crawled tells you what LLMs think is valuable)

Pre-v19.4 AcePilot: this was invisible. Post-v19.4: first-class.

## Part 2 — Three monetization paths (setup + what to expect)

### Path 1: Cloudflare Pay-Per-Crawl (direct; highest ROI for fleet)

**What it is:** Cloudflare's 2025-GA feature. Per-zone toggle. Cloudflare acts as the billing intermediary between your site and AI crawler operators (OpenAI, Anthropic, Perplexity, etc.). Marketplace pricing, default ~$0.001–$0.10 per crawl depending on tier.

**Expected fleet impact:**

| Site bot-crawl volume | Monthly PPC revenue (est) |
|---|---|
| <50 crawls/day | $0.15–$5/mo (break-even or below) |
| 100–500 crawls/day | $3–$30/mo |
| 500–2,500 crawls/day | $15–$200/mo |
| 2,500+ crawls/day | $200+/mo |

**Setup (per zone, payment-gated):**
1. Cloudflare dashboard → select zone → AI Audit → "Enable Pay-Per-Crawl"
2. Agree to marketplace terms (legal review first time)
3. Set payout method (bank transfer or Stripe Connect)
4. Configure optional pricing tier overrides per crawler
5. Wait 24h for first bot traffic to be monetized

**Fleet target:** enable on all 14 CF-tracked fleet zones. Combined monthly estimate based on holdlens 3,500/30d + amili 954/30d + others: **$15–$80/month fleet-wide Y1**. Modest absolute; compounds as fleet grows and AI usage grows.

**Calibration:** weekly actual earnings logged to `DISTRIBUTION.md ## Bot Revenue Calibration` via `bot-traffic-harvest` scheduled task. Multipliers self-adjust per I-28 after 10 weeks.

### Path 2: TollBit / ProRata (content-licensing revenue share)

**What it is:** Licensing platforms that pre-negotiate with AI engines. When OpenAI/Anthropic/Google serves an answer sourced from your licensed content, you get revenue share. Reported ~$0.05/serve average by 2026 publisher data.

**When it's worth it:** fleet site has enough volume + unique content that serves per day exceeds 1000. Right now only holdlens + amili approach this. Revisit at Month 6.

**Setup (operator self-serve, ~30 min per platform):**
- TollBit: tollbit.com → apply → legal review ~2 weeks → integration via JSON-LD license headers
- ProRata: prorata.ai → apply → similar flow

**Fleet strategy:** defer until fleet volume justifies. Month 6 audit re-evaluates.

### Path 3: LLM-citation → human visit → AdSense (indirect; highest compounding value)

**What it is:** no platform integration needed. Design for citation-readiness → LLMs cite → humans click through → you get regular AdSense RPM. 2025 data: cited-source CTR is 8–18% vs organic SERP #3 at 2–5%.

**Expected impact (conservative):**

| Citations/week | Est. human visits/week | Est. monthly AdSense $ (at $15 RPM) |
|---|---:|---:|
| 10 | 1–2 | $0.04 |
| 100 | 8–18 | $5–$12 |
| 1,000 | 80–180 | $50–$120 |
| 10,000 | 800–1,800 | $500–$1,200 |

**Setup:** zero platform signup. All work is product-side (Part 4).

**Track:** GSC "referrer" column for LLM domains (chat.openai.com, claude.ai, perplexity.ai); manual weekly "test queries" per `rules/aceusergrowth.md` Part 23.

## Part 3 — Five acquisition-velocity levers (increase bot traffic FAST)

Ranked by speed-to-impact for a new or under-crawled fleet site:

### Lever 1: robots.txt AI-allowlist (Day 1, 5 min)

**What:** explicit `User-agent: [Crawler]` blocks with `Allow: /`. Signals "crawl me" to every major LLM bot. 2026 HCU-era sites with explicit allow see 2–3× crawler frequency vs silent robots.txt.

**Canonical fleet robots.txt block:**
```
# AI crawlers — explicit allowlist (v19.4 bot harvest)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

# Standard search
User-agent: *
Allow: /

Sitemap: https://[domain]/sitemap.xml
Sitemap: https://[domain]/sitemap-ai.xml
```

### Lever 2: llms.txt manifest at root (Day 1, 10 min)

**What:** machine-readable site summary + priority-page map at `/llms.txt`. Emerging standard; Anthropic + OpenAI + Perplexity honor it.

**Canonical structure:**
```
# [Site Name]

> [One-sentence site description — what it is, who it's for]

## Primary data

- [URL]: [one-line description]
- [URL]: [one-line description]

## Citation-preferred sections

- `/api/[slug].json` — machine-readable dataset endpoint
- `/methodology` — how we compute what we compute
- `/about` — identity + expertise signals

## License

- Content: [license, e.g., CC-BY-4.0 or proprietary]
- Dataset: [license]
- Contact: [email for licensing inquiries, if different from about page]
```

### Lever 3: IndexNow on every deploy (already shipped in v19.1)

Bypasses crawl-delay. Google + Bing + Yandex + Seznam all honor. Yes, human-crawler-focused — but it accelerates Googlebot-Extended indexing which feeds Gemini.

### Lever 4: Directory registrations (Day 7, 30 min total)

- **ai.robots.txt directory** (github.com/ai-robots-txt/ai.robots.txt) — one-file PR to add your site
- **Perplexity Pages** — submit via Perplexity directly for discoverability in Perplexity Sources
- **Bing Webmaster Tools** — already for humans; explicitly supports AI crawler signals in 2026
- **DuckAssist** — DuckDuckGo's AI answer system; register in DDG Webmaster
- **Brave Search AI** — Brave has its own AI index; submit via Brave Search Console
- **Common Crawl opt-in** — if site has stable URLs and license permits; contact CC directly

### Lever 5: `/sitemap-ai.xml` secondary sitemap (Week 2, 20 min)

**What:** list pages where you want AI crawlers to focus. High-priority citation-eligible pages. Separate from regular `sitemap.xml`.

**Example entry:**
```xml
<url>
  <loc>https://holdlens.com/investor/buffett</loc>
  <lastmod>2026-04-18</lastmod>
  <changefreq>monthly</changefreq>
  <priority>1.0</priority>
  <xhtml:link rel="alternate" type="application/json" href="https://holdlens.com/api/investor/buffett.json"/>
</url>
```

Register `/sitemap-ai.xml` in robots.txt alongside regular sitemap.

## Part 4 — Five product-optimization patterns (design for bots)

### Pattern 1: Static export (no JS-gated content)

GPTBot + PerplexityBot don't execute JavaScript. ClaudeBot + Googlebot partially. Static HTML guarantees bot-readability.

**Enforce:**
- Next.js: `output: 'export'` in `next.config.js`
- Critical content rendered server-side or at build time — NOT hydrated from client JS
- If dynamic content needed: ISR (revalidate), not CSR

### Pattern 2: Quote-ready section H2s

Section headings written as extractable, citable sentences (not marketing fluff).

**❌ Bad (bot-unfriendly):**
```
## Why Choose Us
```

**✅ Good (bot-readable, citable):**
```
## SculptCoach is a solo AI personal trainer app offering daily 20–35-minute adaptive workouts with fasting and recovery tracking for €9.99/month
```

Paired with DefinedTerm schema per key concept:
```html
<span itemscope itemtype="https://schema.org/DefinedTerm">
  <span itemprop="name">Progressive Overload</span>:
  <span itemprop="description">The gradual increase of stress on the body during exercise...</span>
</span>
```

### Pattern 3: Dataset JSON API per page

Every programmatic page gets a twin API endpoint. Bots cache JSON cheaply; humans get rich UI.

**URL pattern:**
- Human: `/salt-percentage/2.0`
- API: `/api/salt-percentage/2.0.json`

Link both in `<link rel="alternate">` + xhtml:link in sitemap-ai.xml.

### Pattern 4: Freshness signals everywhere

Every page shows AND schemas:
- `datePublished` in JSON-LD
- `dateModified` in JSON-LD
- Visible "Last verified YYYY-MM-DD" text near the content
- HTTP `Last-Modified` header

Bots weight recency heavily in 2026. Stale pages lose crawler priority quickly.

### Pattern 5: Schema.org saturation

Minimum per page:
- `Organization` (root + every page)
- `Person` (author, if byline)
- `Article` or `WebPage` (with datePublished + dateModified)

When applicable:
- `DefinedTerm` (for key concepts)
- `Dataset` (for data pages)
- `DataCatalog` (for API root)
- `HowTo` (for procedural content)
- `FAQPage` (max 1 per page per v18 LEARNED.md penalty — don't spam)

## Part 5 — Day-1 bot-readiness checklist (v19.4 NEW; bakes into every new fleet site)

Extends the existing BUILD_SPEC.md Day-1 checklist with bot-specific items:

```
### Bot-harvest Day-1 (add to every BUILD_SPEC.md):

- [ ] robots.txt includes AI-crawler allowlist block (9 crawlers minimum)
- [ ] llms.txt shipped at root with site summary + priority URLs
- [ ] /sitemap-ai.xml scaffolded (may be stub on Day 1; expands with programmatic pages)
- [ ] Next.js config `output: 'export'` if using Next.js
- [ ] Every page has datePublished + dateModified in JSON-LD
- [ ] Organization schema in <head> of every page
- [ ] Optional (Week 2): JSON API endpoint per programmatic page
- [ ] Optional (Day 7): registered in ai.robots.txt directory
- [ ] Optional (payment-gated): Cloudflare Pay-Per-Crawl enabled on zone
```

## Part 6 — Calibration loop

Weekly (`bot-traffic-harvest` scheduled task Sunday 02:00 UTC):

1. Pull per-zone Cloudflare bot logs (last 7 days)
2. Aggregate by crawler user-agent: GPTBot / ClaudeBot / PerplexityBot / Googlebot-Extended / Applebot-Extended / CCBot / Amazonbot / Bytespider / Meta-ExternalAgent / Other
3. Append row to each site's `.claude/state/BOT_TRAFFIC.md ## Weekly Bot Traffic Rollup`
4. Pull CF Pay-Per-Crawl revenue (if enabled) → append to same row
5. Compare to prior week — flag ≥50% WoW drops per crawler → TASKS.md `[👤]` investigation
6. Aggregate fleet rollup → `~/.claude/fleet/BOT_TRAFFIC_ROLLUP.md`
7. Every 10th run: Oracle multiplier recalibration (per I-28, bounded ±50%)

## Part 7 — Calibrated Bot-Archetype Distribution Oracle multipliers (v19.4 seed)

Seeded with research-based defaults. Self-calibrate after 10 ships with each archetype.

```
pay_per_crawl_enabled                      × +90
llm_citation_quote_ready                   × +75
dataset_json_api                           × +70
ai_robots_directory_listed                 × +50
robots_txt_ai_allowlist                    × +40
freshness_per_page                         × +30
schema_defined_term_per_concept            × +25
sitemap_ai_xml_present                     × +20
static_export_no_js_gated                  × +15

HARD REJECTS (×-1000 filtered):
cloak_to_bots                              × -1000
bot_fake_content_serve                     × -1000
robots_txt_blocks_all_llm_crawlers         × -500  (unless site has specific legal reason)
```

## Part 8 — Anti-patterns & HARD-NO list

### Hard-no (I-36 when signed; I-34/I-26 already)

1. **Cloaking to bots** — serving different HTML to GPTBot vs humans. Google Publisher Policy violation + fraud regardless of intent. Detectable via User-Agent sniffing in logs. Never.
2. **Bot-only fake content** — AI-generated filler pages served exclusively to AI crawlers to spike citation. Same fraud class.
3. **User-Agent spoofing mitigation** — don't trust claimed User-Agent for gating. Treat content as public.
4. **Aggressive bot blocking without legitimate cause** — blocking all LLM crawlers to "save bandwidth" is a distribution error. Only block with specific legal/policy rationale.

### Anti-patterns (soft-rejects; @distributor flags)

- llms.txt claims features the site doesn't have (lying-to-bots)
- JSON API endpoints return 404 or errors on well-known paths
- Schema.org markup fabricated (claims Organization type but no company exists)
- Content with `datePublished` from 2020 on a page updated 2026 (freshness lie)
- robots.txt contradictions (e.g., `Allow: /` + `Disallow: /api/` where /api/ is the JSON endpoint)
- Programmatic-page explosion without dataset quality (HCU penalty multiplied)

## Part 9 — Integration with existing rules

- `rules/aceusergrowth.md` v3 Part 23 (LLM-Visitor Behavior) — this file operationalizes that part
- `rules/adsense-compliance.md` — bot-harvest compatible; robots.txt must still allow `Mediapartners-Google` + `AdsBot-Google`
- `rules/concept-finder-methodology.md` v2.1 Layer 7 — LLM-Citation Design Pattern is the concept-picking complement to this ship-level playbook
- `rules/learn-from-data.md` — BOT_TRAFFIC.md + PPC revenue calibration cycle is the canonical learn-from-data pattern applied to bots
- `rules/evolution-invariants.md` — I-36 drafted; I-34 hard-rejects extend to bot cloaking

## Part 10 — The short version

**Monetize bots:**
1. Enable Cloudflare Pay-Per-Crawl per zone (payment-gated; ~$3–$30/mo/site direct)
2. Design for LLM citation (compounding indirect AdSense revenue via citation→click funnel)
3. Defer TollBit/ProRata until site volume justifies (Month 6+)

**Increase bot traffic fast:**
1. Day 1: robots.txt AI-allowlist + llms.txt
2. Day 1: IndexNow in deploy script (already shipped)
3. Day 7: register ai.robots.txt + Perplexity Pages + Bing AI
4. Week 2: /sitemap-ai.xml with priority pages

**Design products for bots:**
1. Static export (no JS-gated content)
2. Quote-ready H2s + DefinedTerm schema
3. JSON API twin per programmatic page
4. Freshness signals (datePublished, dateModified, visible "last verified")
5. Schema.org saturation

**The root principle:** bots are not noise. They are inventory, a citation channel, an acquisition flywheel, and — increasingly — a direct payer. Treat them accordingly.

---

**Version:** v1.0, 2026-04-19. Shipped with AcePilot v19.4 "The Bot Harvest." Future versions recalibrate multipliers from fleet LEARNED.md data.
