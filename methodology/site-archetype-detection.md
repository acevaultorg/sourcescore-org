# Site Archetype Detection — the universal brain (v1.0, 2026-04-24)

**Binding on every AcePilot session that enters a codebase.** Read at ABSORB step 2 (Read build files) + step 13. Auto-detects which of 12 site archetypes the codebase is, then adapts brain defaults (Oracle weighting, specialist routing, playbook replay priority, recommended mode) to match.

**Operator directive 2026-04-24:** *"acepilot should in any situation always know what to do best. from starting in a empty folder to being used for a website like reddit wikipedia, or anything"*.

AcePilot's prior default was solo-founder + silent-SEO + ad-revenue fleet. That's ONE archetype. This rule makes AcePilot universal: any codebase, any scale, any business model, correct defaults from session start.

---

## The 12 archetypes

| # | Archetype | One-liner | Examples |
|---|---|---|---|
| 1 | **empty** | Empty directory; no code yet | `mkdir new && cd new && /acepilot` |
| 2 | **static-reference** | Finite dataset → programmatic pages, no auth, no DB | HoldLens, Fermentcalc, Sourdough, readinglist.school |
| 3 | **programmatic-seo** | Long-tail unique-data pages, often auto-generated | Zapier integrations directory, country-by-country comparison sites |
| 4 | **saas-b2b** | Auth + subscription + team-multi-tenant | Linear, Vercel, Stripe, internal CRM-class |
| 5 | **saas-consumer** | Auth + subscription + consumer single-tenant | Notion, Figma personal, fitness apps |
| 6 | **community-ugc** | Posts + comments + moderation + scale | Reddit, Hacker News, Discourse forums |
| 7 | **editorial-knowledge** | Structured knowledge base, citation-heavy, collaborative editing | Wikipedia, MDN, DocsWiki |
| 8 | **e-commerce** | Products + cart + checkout + inventory | Shopify storefronts, craft stores, DTC brands |
| 9 | **publisher** | Articles + editorial workflow + subscription/newsletter | Substack sites, niche newsletters, magazines |
| 10 | **portfolio-personal** | About + projects + no monetization | Dev portfolios, artist sites, personal blogs |
| 11 | **internal-tools** | Team-only; dashboards, admin panels, ops tools | Retool clones, internal metrics, runbooks |
| 12 | **api-only** | No UI; API endpoints for consumers | SaaS API, ML inference service, webhook receivers |

---

## Detection signals (used at ABSORB step 2)

**Order: most-specific wins. If multiple match, use the strongest signal.**

### Empty (archetype 1)
- Directory contains: `ls -A` returns empty OR only `.git/`
- Action: trigger empty-folder bootstrap flow (see § below).

### Static-reference (archetype 2)
- **Strong signals:**
  - Next.js `next.config.js` with `output: 'export'`
  - Astro / Eleventy / Hugo / Jekyll / 11ty config file at root
  - `sitemap.xml` + `llms.txt` + `schema.org` JSON-LD in layout
  - No auth library in `package.json` (no next-auth, clerk, supabase-auth, etc.)
  - No database client (no pg, mongoose, prisma, drizzle-orm, sequelize)
  - Per-page programmatic URLs: `/[slug]/page.tsx` or `/[category]/[slug]/page.tsx`
- **Weak signals:**
  - Domain name contains "calc" / "db" / "guide" / "reference"
  - `.claude/state/LEARNED.md` exists with fleet seeding

### Programmatic-SEO (archetype 3)
- **Strong:**
  - Generated pages >100 (glob pattern `pages/**/*.{tsx,mdx}` or `content/**/*.md`)
  - Data source file at root (e.g., `data.json`, `dataset.csv`, `seed.ts`)
  - Build script generates routes from data (`generate-pages.ts`, `build-seo.js`)
  - Sitemap contains >100 URL entries
- Differs from static-reference: scale + automation focus (archetype 2 may be hand-authored; 3 is data-driven generation).

### SaaS-B2B (archetype 4)
- **Strong:**
  - Auth library: `next-auth`, `@clerk/nextjs`, `@supabase/auth-helpers`, or similar
  - Subscription/billing lib: `stripe`, `@stripe/stripe-js`, `lemonsqueezy`, `paddle`
  - Multi-tenant routing pattern: `/[team]/[id]/...`, `/workspace/[tid]/...`
  - RBAC / roles mentioned in schema files
  - Dashboard route: `/dashboard`, `/app`, `/admin`
  - Enterprise-y keywords in copy: "teams", "SSO", "audit log", "compliance"
- **Weak:**
  - Invite-flow components (`<Invite>`, `<TeamMember>`)
  - Stripe webhooks handler

### SaaS-consumer (archetype 5)
- **Strong:**
  - Auth library present (same as B2B)
  - Subscription/billing present
  - Single-tenant routing: `/app/...` not `/[team]/...`
  - No RBAC complexity
  - Consumer copy: "you", "your", personal use cases
- Differs from B2B: single-tenant + consumer-y UI + no team-invite flow.

### Community-UGC (archetype 6)
- **Strong:**
  - Post/comment schema in DB (tables: `posts`, `comments`, `votes`, `users`)
  - Moderation routes: `/moderate`, `/admin/reports`, `/trust-safety`
  - Realtime library: `socket.io`, `pusher`, `ably`, `liveblocks`
  - Voting / karma system in codebase
  - Report-abuse components
- **Weak:**
  - Rich-text editor (Tiptap, ProseMirror, Lexical) for user input
  - Comment threading structure

### Editorial-knowledge (archetype 7)
- **Strong:**
  - Wiki-like URL structure: `/wiki/*`, `/article/*`, `/[slug]-[id]`
  - Revision history / edit log schema
  - Citation syntax in content (`<ref>`, footnote markers)
  - Collaborative editor: Tiptap, ProseMirror with `@tiptap/collaboration`
  - TOC / sections / nested structure in article schema
- **Weak:**
  - MediaWiki, DocuWiki, Outline, Notion-clone stack

### E-commerce (archetype 8)
- **Strong:**
  - Product schema (tables: `products`, `variants`, `inventory`, `orders`, `cart_items`)
  - Cart / checkout routes: `/cart`, `/checkout`, `/orders`
  - Payment integration: Stripe, Shopify, WooCommerce, PayPal
  - Product listing page + product detail page (PLP/PDP) pattern
- **Weak:**
  - Shipping calculation lib
  - Inventory-tracking service

### Publisher (archetype 9)
- **Strong:**
  - Article schema with author + pub-date + reading-time
  - Editorial workflow: drafts/review/publish states
  - Newsletter integration (ConvertKit, Mailchimp, Buttondown API)
  - Paid-subscriber gate on some articles
  - Comment section on articles
- Examples: Substack clones, Ghost blogs, WordPress editorial sites.

### Portfolio-personal (archetype 10)
- **Strong:**
  - About page + projects page at root
  - No auth, no DB, no payments
  - Personal bio mentioned in `README.md` / `<meta>`
  - Contact form only (no signup)
  - Simple SSG (Astro, Eleventy, Hugo, Jekyll)
- Differs from static-reference: personal brand focus, not data/content delivery.

### Internal-tools (archetype 11)
- **Strong:**
  - Auth required on every route
  - No public homepage
  - Dashboard-heavy UI (Retool/Metabase-clone patterns)
  - Ops-specific routes: `/ops`, `/metrics`, `/runbook`, `/admin`
  - No marketing site in same repo
- Differs from SaaS: no sales funnel, no pricing page, no public surface.

### API-only (archetype 12)
- **Strong:**
  - Only `/api/*` routes (or entire app is an API)
  - `openapi.yaml` / `swagger.json` at root
  - Framework: Express, Fastify, Hono, FastAPI, Go gin/echo
  - No React/Vue/HTML at all
  - Documentation site separate (if exists)

---

## Per-archetype defaults table

When archetype is detected, AcePilot overrides these defaults for the session:

| Archetype | Primary mode | Oracle weighting (R/Ret/Dist) | Top specialists | Playbook priority | Revenue layer |
|---|---|---|---|---|---|
| **empty** | _bootstrap flow_ | n/a | n/a | n/a | n/a — gather requirements |
| **static-reference** | `grow` or `reach` | 0.6/0.7/1.0 (distribution-first) | @distributor, @craftsman | silent-SEO | AdSense + Ezoic + affiliate |
| **programmatic-seo** | `reach` | 0.5/0.5/1.2 (reach dominates) | @distributor, @reviewer | HCU-safe programmatic | AdSense + Mediavine at 1k/mo |
| **saas-b2b** | `god` (revenue-focused) | 1.2/1.0/0.5 (revenue dominates) | @strategist, @security, @designer | conversion + onboarding | Subscription; NO ads |
| **saas-consumer** | `craft` | 1.0/1.2/0.6 (retention dominates) | @craftsman, @strategist | activation + retention | Subscription; optional ads-free-tier |
| **community-ugc** | `god` + trust-safety | 0.8/1.3/0.9 (retention + scale) | @security, @reviewer, @craftsman | moderation, scale, content-loops | Ads + premium + API |
| **editorial-knowledge** | `craft` | 0.6/1.2/1.0 (retention + reach) | @craftsman, @reviewer, @distributor | collaborative editing, citation discipline | Donation / foundation / light ads |
| **e-commerce** | `god` | 1.3/1.0/0.8 (revenue dominates) | @strategist, @designer, @security | conversion rate, AOV, cart-abandon | Direct sales; affiliate secondary |
| **publisher** | `craft` + `reach` alternate | 0.8/1.1/1.1 (balanced) | @craftsman, @distributor | editorial + distribution | Newsletter subscription + ads |
| **portfolio-personal** | `go` (free tier) | n/a (no revenue optimization) | @craftsman, @designer | polish + clarity | None |
| **internal-tools** | `god` (reliability-focused) | n/a (internal; no revenue) | @security, @reviewer, @architect | reliability, observability | None (cost center) |
| **api-only** | `god` | 0.9/0.8/0.4 (DX + retention) | @architect, @security, @strategist | DX, docs, uptime | Usage-based billing |

**Oracle weight interpretation:**
- 1.0 = equal weight with other Oracles (neutral)
- >1.0 = dominant Oracle (task ranking prioritizes this dimension)
- <1.0 = de-prioritized (still considered, but secondary)
- All three still capped at +1.0 per task per v17.3 triple-capped APS

---

## Empty-folder bootstrap flow (archetype 1)

When `/acepilot` is invoked in an empty directory (or one with only `.git/`), brain runs the **Bootstrap Flow** before normal ABSORB:

### Step 1: classify the intent

Ask operator (single Clarity Card):

```
🟢 OPTIONAL — What are we building?

WHAT: Pick the archetype that best describes what you want. AcePilot adapts its
      defaults (which specialists run, how Oracles weight tasks, which mode to
      recommend) to match the archetype.

WHY:  Faster path from empty folder to shipping. The right defaults save hours
      of decisions ("should I use Next.js static export or SSR?", "do I need
      auth?", "which ads network?"). Cost of skipping: generic defaults that
      may not fit your business model.

TIME: ~30 seconds to pick.

HOW:
  Reply with one of:
    1. static-reference      (calc/database/guide — silent-SEO + ads fleet)
    2. programmatic-seo      (data-driven long-tail URLs — SEO-dominant)
    3. saas-b2b              (team SaaS, subscription, auth, multi-tenant)
    4. saas-consumer         (consumer SaaS, personal subscription)
    5. community-ugc         (Reddit-class — posts, comments, moderation)
    6. editorial-knowledge   (Wikipedia-class — structured knowledge, citations)
    7. e-commerce            (products, cart, checkout, inventory)
    8. publisher             (articles, newsletter, editorial workflow)
    9. portfolio-personal    (about, projects, no monetization)
    10. internal-tools        (team-only, dashboards, admin)
    11. api-only             (no UI, just API endpoints)
    12. other — describe it  (free-text; AcePilot will classify)

VERIFY: After you pick, AcePilot loads the matching archetype defaults + kicks
        off scaffolding directive. If none fit, pick "other" with description.

IF STUCK:
  - Not sure? Describe in 1-2 sentences what users will do. AcePilot will classify.
  - Dogfood (for yourself) with no public users? → internal-tools.
  - Idea still fuzzy? → reply "explore" and AcePilot will Socratic-question to narrow.
```

### Step 2: apply archetype defaults

Upon classification:
1. Write `.claude/state/ARCHETYPE` → `[archetype-name]` (single-file persistent identifier)
2. Load archetype's Oracle weighting into session cache
3. Load archetype's playbook-priority list
4. Run `acepilot-expansion.md` directive expansion with archetype context (e.g., "static-reference site for [topic]" → full BUILD_SPEC.md)
5. Propose first 3 tasks ordered by archetype priority

### Step 3: normal ABSORB continues

With archetype known, subsequent ABSORB steps (13c-g Oracle primes) use the archetype-correct defaults.

---

## Integration with existing brain

**ABSORB step 2 (Read build files) — extended:**

After reading `package.json`, `next.config.js`, etc., run archetype detection:
1. Check `.claude/state/ARCHETYPE` (cached from prior session).
2. If absent or `_unknown`, run detection signals against codebase.
3. Write detected archetype to `.claude/state/ARCHETYPE` (append-only log: `YYYY-MM-DD | archetype | confidence`).
4. If archetype is `empty` → trigger Bootstrap Flow (above).
5. Else: apply archetype defaults to session cache.

**Detection confidence:**
- ≥3 strong signals match → confidence 0.9 (high)
- 1-2 strong signals OR ≥3 weak → confidence 0.6 (medium)
- <1 strong AND <3 weak → confidence 0.3 (low) → log as `_unknown` + prompt operator

**Operator override:**

Operator can force archetype via focus directive:
- `/acepilot auto [archetype:saas-b2b]` → forces SaaS-B2B defaults regardless of detection

Or by editing `.claude/state/ARCHETYPE` manually.

---

## Prime directive gloss per archetype

The prime directive "maximize SUSTAINABLE revenue by building great products people love, return to, AND tell others about" applies to ALL archetypes, but revenue-shape varies:

| Archetype | How revenue compounds |
|---|---|
| **static-reference** | Ads (AdSense/Mediavine) + affiliate per visitor. Volume × RPM. |
| **programmatic-seo** | Same as static-reference; scale is the lever. |
| **saas-b2b** | Subscription MRR × LTV. Churn is the killer. |
| **saas-consumer** | Subscription MRR × retention. Activation gap is the killer. |
| **community-ugc** | Ads + premium + API. Network effects compound; moderation cost scales. |
| **editorial-knowledge** | Donations / foundation / light ads. Reach compounds via citation. |
| **e-commerce** | Direct sales. AOV × CVR × repeat-purchase. |
| **publisher** | Paid subscriptions + ads. Email-list growth is the lever. |
| **portfolio-personal** | Not applicable (no revenue — defer to craft/polish). |
| **internal-tools** | Cost-reduction (team productivity); not revenue. Measure hours saved. |
| **api-only** | Usage-based billing (per-call / per-MB / per-month). DX + uptime are the levers. |

---

## Archetype-specific playbook pointers

Each archetype has a recommended initial playbook (applied in directive expansion):

- **static-reference** → `rules/concept-finder-methodology.md` + `rules/aceusergrowth.md` Profile 7 + `rules/revenue-maximizer.md` canonical 9-layer stack
- **programmatic-seo** → same as static + HCU-safe density rules + unique-data-per-URL discipline
- **saas-b2b** → activation onboarding + pricing page + trial-to-paid conversion + enterprise feature-gating
- **saas-consumer** → activation first-session + retention cliff + freemium-to-paid
- **community-ugc** → trust & safety FROM DAY 1 + moderation tooling + anti-spam + content policy + scaling-friendly architecture (queue-based, async)
- **editorial-knowledge** → citation discipline + collaborative editor + consensus workflow + content-trust signals
- **e-commerce** → conversion optimization + cart recovery + product SEO + shipping/returns UX
- **publisher** → email capture + editorial cadence + paid-sub conversion + newsletter growth
- **portfolio-personal** → craft mode always; no revenue optimization
- **internal-tools** → reliability + observability + access control + audit log + incident response
- **api-only** → DX (docs + examples) + uptime + rate-limit UX + SDK in major languages

---

## Detection failure handling

If detection returns `_unknown` or low-confidence:

1. Log `.claude/state/ARCHETYPE` → `_unknown | YYYY-MM-DD | reason: insufficient signals`
2. Emit Clarity Card asking operator to classify (same as empty-folder bootstrap step 1)
3. Do NOT paralyze session — proceed with generic defaults (balanced Oracle weights, neutral specialist routing) until operator answers
4. On operator answer, reset archetype + apply defaults retroactively for next task

---

## Archetype drift detection

If a site evolves from one archetype to another (e.g., static-reference adds auth + becomes SaaS, or portfolio-personal adds products + becomes e-commerce):

1. CSIL audit check (defined in v19.12; wiring deferred) scans for new signals monthly
2. If signals indicate archetype shift → propose reclassification task in next cycle
3. Operator approves → update `.claude/state/ARCHETYPE` + reload defaults

---

## Invariants

No new invariants in v1.0 of this rule. I-32 (No Permission Theater) still binds: in auto modes, brain applies detected archetype's defaults WITHOUT asking — only prompts in the empty-folder case where operator hasn't said what to build yet.

Future invariant candidate (I-40): "Archetype must be set before Pro-mode ranking." Drafted but not yet signed.

---

## Relationship to existing rules

- `rules/concept-finder-methodology.md` v2.1.1 — archetypes 2 + 3 (static-reference + programmatic-seo) are where Concept Finder applies. Other archetypes have different picking logic.
- `rules/aceusergrowth.md` v3 — Part 3 "Per-site channel-mix recipes" maps to archetypes. Profile 7 = archetype 2, Profile 5 = archetype 4, etc.
- `rules/revenue-maximizer.md` — the 9-layer stack applies PRIMARILY to static-reference + programmatic-SEO + publisher archetypes. SaaS uses subscription instead of ad-stack.
- `acepilot-expansion.md` — directive expansion gets archetype as input; expansion output now archetype-correct.
- `rules/wealth-desire.md` — prime directive gloss per archetype operationalizes wealth-desire principle #2 (long-term LTV) across all 12 archetypes.

---

## The short version

**Empty folder → /acepilot asks what you're building, classifies archetype, loads defaults.**
**Existing codebase → ABSORB step 2 auto-detects archetype from signals, loads defaults.**
**12 archetypes cover empty → Reddit → Wikipedia → SaaS → e-commerce → publisher → api-only.**
**Each archetype has: Oracle weighting · specialist routing · playbook priority · revenue model · primary mode.**
**Operator can override via `[archetype:X]` focus directive.**
**CSIL detects archetype drift monthly and proposes reclassification.**

From v19.12 onward, `/acepilot` in any directory, any scale, any business model knows the right defaults. Not generic advice — archetype-correct defaults.
