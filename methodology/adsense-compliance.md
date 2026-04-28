# AdSense Compliance — fleet-wide, non-negotiable (v1.0, 2026-04-17)

**Every future site in the fleet must pass Google AdSense review on the first submission.** Failing review costs 2–4 weeks of dormancy rescan time and — for sites in their Q1 seasonal window — can kill a full year's peak. This rule is binding on every new project from 2026-04-17 onward.

Source docs this rule is synthesized from:
- AdSense Program Policies — https://support.google.com/adsense/answer/48182
- Google Publisher Policies — https://support.google.com/publisherpolicies/answer/10502938
- Google Publisher Restrictions — https://support.google.com/publisherrestrictions
- Site approval process — https://support.google.com/adsense/answer/7584263

## Who this binds

Every site built under any of:
- AcePilot god / sovereign / craft / auto / ship modes
- Manual Claude Code sessions on this machine
- Any sibling fleet project (readinglist, sourdough, fermentcalc, conversionbench, webvitals, etc.)
- Including the unbuilt Year-2 defensive holds

No exceptions — if a concept genuinely cannot comply (e.g. explicit adult, gambling, unlicensed pharmacy), it is **not a buildable site in this fleet** and should not be scaffolded.

## Pre-launch compliance gate (add to every BUILD_SPEC.md §Day 6)

Before submitting a site to AdSense on Day 7, ALL of these must pass. This is a hard gate — if any item is missing, the site is not ready for review.

### 1. Required site components (all present + linked from footer)

- [ ] **Privacy policy** at `/privacy` — must explicitly mention:
  - Use of cookies, web beacons, IP addresses, or other identifiers
  - Third-party advertising (Google AdSense) and third-party cookies
  - Link to "How Google uses data when you use our partners' sites or apps" (https://policies.google.com/technologies/partner-sites)
  - Data collection, sharing, and usage from Google products
  - User rights (access, deletion, opt-out)
  - Contact email for privacy inquiries
- [ ] **About page** at `/about` — who built the site, what it's for, expertise/methodology, cited sources
- [ ] **Contact page** at `/contact` — real email address, physical or legal entity reference
- [ ] **Cookie consent banner** (EU + UK + CA compliant) — must:
  - Appear on first visit from EU/UK/California IPs
  - Offer clear accept/reject/customize options (not just "OK")
  - NOT fire AdSense cookies until consent
  - Use a Google-certified CMP when using personalized ads in EEA/UK (required under Google's EU user consent policy)
- [ ] **Terms of Service** at `/terms` — recommended though not strictly required

### 2. Technical requirements

- [ ] `ads.txt` at domain root (`/ads.txt`) — placeholder OK before approval; replace with Google-supplied `google.com, pub-XXX, DIRECT, f08c47fec0942fa0` after approval
- [ ] AdSense verification code in `<head>` of every content page (injected via layout.tsx — do not inject on `/privacy`, `/terms`, or dev-only routes)
- [ ] Robots.txt allows `Googlebot`, `Mediapartners-Google`, and `AdsBot-Google`
- [ ] Sitemap.xml at `/sitemap.xml` referenced from `robots.txt`
- [ ] Site is HTTPS with valid cert
- [ ] Domain is registered to the operator (not the Vercel auto-generated `*.vercel.app`)
- [ ] No login wall on public content during AdSense review

### 3. Content volume + quality bar

- [ ] **Minimum 10 substantive pages** of unique, useful content beyond the homepage (fleet target: 100+ programmatic pages on top of hand-authored core)
- [ ] Every data-backed page cites a source (publisher, book, peer-reviewed study — NOT another blog)
- [ ] No pages with fewer than ~200 words of unique content (calculator pages are OK because the calculator IS content, but must have a surrounding explainer paragraph + FAQ)
- [ ] No AI-generated filler or fabricated facts — content-bundle pattern (seed data from authoritative sources) is mandatory
- [ ] No "coming soon" / placeholder / under-construction pages visible to crawlers
- [ ] Homepage clearly states what the site is, for whom, and why

### 4. Ad placement + behavior (applies after approval)

- [ ] Ad units are clearly distinguishable from content — **no "Favorite Sites", "Today's Top Offers"** labels
- [ ] Acceptable labels: "Sponsored Links", "Advertisements"
- [ ] No ads in pop-ups, pop-unders, floating boxes, or on non-content pages
- [ ] No ads on `/privacy`, `/terms`, `/contact`, `/about`, login screens, 404 pages
- [ ] No more ads than publisher content per page
- [ ] Ads do not overlay, obscure, or push navigation off-screen
- [ ] No arrows, graphics, or copy directing users to "click the ads", "support us", "visit these links"
- [ ] No misleading images adjacent to ads
- [ ] Page weight budget (≤100 KB for our fleet) includes ad units — lazy-load below-the-fold ads

### 5. Traffic source hygiene

- [ ] All traffic is organic search or direct — NO paid-to-click, autosurf, click-exchange
- [ ] NO unsolicited mass email campaigns pointing at the site
- [ ] NO bot traffic, click farms, or self-clicking
- [ ] NO incentivized traffic ("visit site X to earn points")
- [ ] Paid search (if any) must comply with Google's Landing Page Quality Guidelines

## Prohibited content — WILL cause disapproval or account termination

Any site that ships content in these categories will be rejected or banned. Never scaffold a site targeting these categories in this fleet. If research surfaces a concept in a prohibited category, drop it before Day 1 — do not register a domain.

### Hard prohibitions (from Google Publisher Policies)

- Illegal content (content that is illegal, promotes illegal activity, infringes legal rights)
- Intellectual property infringement, counterfeit goods
- Dangerous / derogatory content: hate based on race, ethnicity, religion, disability, age, nationality, veteran status, sexual orientation, gender, gender identity
- Harassment, intimidation, bullying
- Threats of physical or mental harm
- Terrorist content, recruitment, celebration of attacks
- Extortion, revenge porn, blackmail
- Animal cruelty, endangered species sale
- **Misrepresentative content** — false claims about elections, harmful health claims that contradict scientific consensus (anti-vaccine, denial of AIDS/COVID-19, gay conversion therapy, climate-change denial)
- Deceptive practices, "get rich quick" schemes, phishing, document fraud (fake passports/diplomas), term-paper selling, drug-test circumvention, hacking/cracking instructions, unauthorized surveillance tools
- Sexually explicit content — sex acts, graphic nudity, non-consensual themes, rape/incest/bestiality/necrophilia/snuff, lolita/teen-themed porn, underage dating, deepfake pornography
- Compensated sexual acts — prostitution, escort services, sugar dating, intimate massage, cuddling sites
- Mail-order-bride services, international marriage brokers, romance tours
- Adult themes styled for family audience (dark kids content)
- **Child sexual abuse/exploitation — absolute zero tolerance; mandatory NCMEC reporting**

### Fleet rule derived from the above

Every concept that scores high on our rubric but touches a prohibited category — drop it, don't try to "thread the needle". No exceptions. These rules are enforced algorithmically + via human review and account-level bans cascade across all sites on the account.

## Restricted content — WILL reduce ad serving (site may still be approved)

These categories are not outright banned but produce reduced ad demand, lower RPM, and frequent demonetization of individual pages. Treat a Restricted-category concept as a signal to pick a different idea unless the operator is explicitly OK with the revenue hit.

- Alcohol (including recipes heavy in alcohol, cocktail sites)
- Gambling / gaming of chance (includes fantasy sports betting, skins betting, lottery discussion)
- Prescription drugs (discussing medications requires YMYL-level trust signals)
- Healthcare — medical claims
- Recreational drugs (cannabis, even where legal; psychedelics)
- Tobacco, vape, nicotine
- Legal services (practical impact: crowded SERPs + restricted demand)
- Debt consolidation, credit repair, bail bonds
- Political advocacy (ad serving reduced around elections)
- Religious content (reduced targeting, not banned)
- Shocking or disturbing content (graphic injury, mild violence)
- Weapons (including legal firearms accessories)
- Cryptocurrencies and initial coin offerings
- Unapproved supplements and nutraceuticals

**Fleet implication**: the Revenue Oracle should down-weight any concept scoring in a Restricted category by ~30% RPM. Concepts in the Prohibited list get a hard `projected_weekly_$: 0` until the category is removed.

## Personalized advertising restrictions

Cannot target personalized ads or collect audience data based on:
- Activity by users known to be under 13
- Activity on sites directed at children under 13 (COPPA applies — must be declared in Google Search Console and AdMob SDK)
- Adult, gambling, or government-agency sites
- Health/medical history
- Negative financial status
- Racial or ethnic origins
- Religious beliefs
- Criminal record
- Political affiliation
- Trade-union membership
- Sexual behavior or orientation

**U.S./Canada Housing, Employment, Credit categories** cannot be targeted by gender, age, parental status, marital status, or ZIP code.

## Sanctions compliance

Services unavailable in: Crimea, Cuba, Donetsk, Luhansk, Iran, North Korea. Cannot serve ads on behalf of OFAC-sanctioned parties or their owned entities. If a site targets these markets, it's not an AdSense-eligible site.

## Site-approval process (what review actually checks)

Source: https://support.google.com/adsense/answer/7584263

Google reviews the ENTIRE site against Program Policies. Review timeline: "usually a few days, but in some cases 2–4 weeks."

During review, the site must:
- Be live and publicly accessible
- Have real, substantive content (their words: "receives regular visitors")
- Not be login-walled
- Allow the AdSense crawler (user-agent `Mediapartners-Google`) — check `robots.txt`
- Have the AdSense verification code placed between `<head>` and `</head>` on every content page
- Have `ads.txt` at the domain root

## Fleet-wide pre-Day-6 AdSense checklist (copy into every BUILD_SPEC.md)

Add this exact block to every project's BUILD_SPEC.md §Day 6, titled "AdSense readiness gate":

```
### AdSense readiness gate (MUST pass before applying)

- [ ] /privacy page shipped, includes: cookies, third-party ads (Google AdSense),
      link to policies.google.com/technologies/partner-sites, contact email
- [ ] /about page shipped with operator identity, expertise, methodology
- [ ] /contact page shipped with real email
- [ ] /terms page shipped (recommended)
- [ ] Cookie consent banner installed + firing (EU/UK/CA detection)
- [ ] AdSense verification code in <head> of every content page
- [ ] /ads.txt file at domain root (placeholder OK until approval)
- [ ] /robots.txt allows Mediapartners-Google, AdsBot-Google, Googlebot
- [ ] /sitemap.xml referenced in robots.txt
- [ ] HTTPS valid cert (Let's Encrypt via Vercel OK)
- [ ] Custom domain attached (not *.vercel.app)
- [ ] ≥10 substantive pages with unique content live
- [ ] No "coming soon" / placeholder pages indexable
- [ ] No prohibited content on the site (see ~/.claude/rules/adsense-compliance.md)
- [ ] Content-bundle pattern followed: every data point cites a source
- [ ] No AI-fabricated facts in production
- [ ] Homepage clearly states what the site is + for whom
- [ ] Day 7 can proceed: apply at adsense.google.com, paste verification snippet
```

## Fleet-wide post-approval checklist

After AdSense approval arrives (email from Google):

- [ ] Replace `ads.txt` placeholder with Google-provided line `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
- [ ] Install Auto Ads or manual ad units (prefer manual for performance control)
- [ ] Verify no ads appear on /privacy, /terms, /contact, /about, 404
- [ ] Verify ad labels are one of: "Advertisements", "Sponsored Links", or none
- [ ] Verify cookie consent banner gates AdSense cookies for EU/UK/CA users (Google-certified CMP required for personalized ads in EEA/UK)
- [ ] Log ship decision to `.claude/state/DECISIONS.md` with AdSense publisher ID
- [ ] Update `.env.example` with `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX`
- [ ] Schedule Week-4 audit: confirm ad units serving + RPM baseline

## Progression ladder (for reference)

1. **AdSense** — approval required, ~$8-15 RPM dev/tech, ~$15-28 food, ~$25-45 business
2. **Mediavine Journey** — requires ~10k sessions/month, ~1.3-1.5× AdSense RPM
3. **Mediavine / Raptive standard** — requires 50k+ sessions/month, ~2-3× AdSense RPM

All three inherit AdSense's content policies. A ban at AdSense-tier cascades.

## Enforcement

Any session that ships a public-facing page for a fleet site must:

1. Read this rule before writing new page content
2. Verify the content is not in the Prohibited list
3. Flag Restricted-category content to the operator before shipping (down-weight RPM in projections)
4. Include the AdSense readiness gate in the Day 6 checklist
5. Block Day 7 application if any gate item is missing

If a concept surfaces in research that touches a prohibited category, it must be dropped before domain registration — registering first and finding out later wastes $10/yr and a slot in the fleet roadmap. The Concept Finder v3's preset filters include "AI-Overview proof" specifically because Calculator/Generator/Lookup/Database types are most likely to pass both HCU and AdSense review simultaneously.

## Known gotchas from fleet experience

- **readinglist.school** (school-reading-list data) — fine; educational content aimed at parents/teachers, no YMYL trust floor broken
- **sourdoughhydration.com** (sourdough calculator) — fine; Food vertical, recipe + reference content
- **fermentcalc.com** (salt/time for lacto-fermentation) — fine but be careful with raw-milk / alcohol adjacency
- **conversionbench.com** (CRO benchmarks) — fine; Business vertical, data-backed
- **Any "medical calculator" site (dosage, BMI, etc.)** — Restricted YMYL; would reduce demand but is approvable with proper disclaimers
- **Any "crypto calculator" site** — Restricted; avoid
- **Any "gambling odds" site** — Prohibited or Restricted per jurisdiction; avoid

## One-line summary

**If the Concept Finder tags a concept as `[prohibited]` or `[gambling]` or `[adult]` — drop it. If it tags `[restricted]` — proceed only with operator acknowledgment that RPM will be 30–70% below baseline.**
