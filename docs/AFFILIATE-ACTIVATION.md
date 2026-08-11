# Affiliate activation — one env var, no code edit

**Status as of 2026-08-11: Rankscale.ai is LIVE** (approved via Rewardful,
`https://rankscale.ai?via=paulo`). Every other slot is still dormant:
`components/PartnerTools.tsx` only renders the partners that are configured, so
an unapproved program contributes no box, no heading, and no layout shift.

---

## ⚠️ Where the variable actually goes: `.gitlab-ci.yml`, NOT the CF dashboard

This repo is built by **GitLab CI** (`.gitlab-ci.yml` → `npm run build` →
`wrangler pages deploy out`). Cloudflare Pages only receives the finished
`out/` directory — it never runs the build. So a `NEXT_PUBLIC_*` variable set
in the **Cloudflare Pages dashboard is never seen by the build** and silently
produces an empty slot. (Earlier revisions of this runbook said to use the
dashboard. That was wrong; corrected 2026-08-11.)

Affiliate URLs are **public** — they ship verbatim in the rendered HTML — so
committing them to `.gitlab-ci.yml` is safe and is the reliable path. Real
secrets (`CLOUDFLARE_API_TOKEN`, `SOURCESCORE_SIGNING_SECRET`) stay in GitLab
**Settings → CI/CD → Variables** and must never be committed.

## Activate a partner (2 minutes)

1. **Edit `.gitlab-ci.yml` → `variables:`.** Add the variable for the partner
   (table below), value = the full affiliate URL. It **must** start with
   `https://` — anything else is ignored by design, so a typo fails closed
   instead of shipping a broken link.
2. **Bump the `cache:` key** (`sourcescore-cache-vN` → `vN+1`). `NEXT_PUBLIC_*`
   values are baked into the HTML at build time, so a stale `.next/cache` can
   re-emit pre-change markup.
3. **Push to `main`.** That is the deploy — CI builds and ships it. Local
   `npm run deploy` is blocked by the predeploy guard.
4. **Verify it is live:**
   ```bash
   # NOTE: the slug is `wikipedia-en`, not `wikipedia` — an earlier version of
   # this runbook used a 404 slug, which returns 0 for every grep and looks
   # exactly like a failed activation. Corrected 2026-08-11.
   curl -s https://sourcescore.org/source/wikipedia-en/ | grep -c 'data-event="affiliate_click"'   # ≥1
   curl -s https://sourcescore.org/source/wikipedia-en/ | grep -o 'rel="sponsored nofollow noopener"' | head -1
   curl -s https://sourcescore.org/source/wikipedia-en/ | grep -o 'href="https://rankscale.ai?via=paulo"' | head -1
   curl -s https://sourcescore.org/disclosure/ | grep -c 'currently carries affiliate links'    # 1
   ```

Deactivate by deleting the line from `.gitlab-ci.yml` and pushing. Same 2 minutes.

## Variables

| Partner | URL variable | Notes |
|---|---|---|
| Otterly.AI | `NEXT_PUBLIC_AFF_OTTERLY` | name + description built in |
| **Rankscale.ai** | **`NEXT_PUBLIC_AFF_RANKSCALE`** | ✅ **LIVE since 2026-08-11** — `https://rankscale.ai?via=paulo`, set in `.gitlab-ci.yml`. The `?via=` param is appendable to any rankscale.ai URL. |
| Profound | `NEXT_PUBLIC_AFF_PROFOUND` | name + description built in |
| Semrush | `NEXT_PUBLIC_AFF_SEMRUSH` | name + description built in |
| Ahrefs | `NEXT_PUBLIC_AFF_AHREFS` | name + description built in |
| *(anything else)* | `NEXT_PUBLIC_AFF_SLOT1_URL` | also set `NEXT_PUBLIC_AFF_SLOT1_NAME` (required) and `NEXT_PUBLIC_AFF_SLOT1_NOTE` (optional) |
| *(anything else)* | `NEXT_PUBLIC_AFF_SLOT2_URL` | also set `NEXT_PUBLIC_AFF_SLOT2_NAME` (required) and `NEXT_PUBLIC_AFF_SLOT2_NOTE` (optional) |

A generic slot with a URL but no name is skipped — it will never render an
unlabeled link.

Example:

```
NEXT_PUBLIC_AFF_SLOT1_URL=https://example.com/ref/sourcescore
NEXT_PUBLIC_AFF_SLOT1_NAME=Example Tool
NEXT_PUBLIC_AFF_SLOT1_NOTE=Tracks AI answer citations for a domain.
```

## Where it renders

| Placement | Page | Analytics `source` |
|---|---|---|
| Primary (highest intent) | `/source/<slug>/`, directly after the grade + "should you cite it" verdict | `source-detail` |
| Secondary | `/sources/` leaderboard hub | `sources-hub` |

The primary slot sits *after* the citation-guidance block on purpose: that
block is the AEO-extractable verdict and has to stay inside the first ~30% of
the page.

## Measurement (already wired)

Every partner link fires **one** event through the existing delegated listener
in `components/Analytics.tsx` — no new analytics vendor, no client component:

- **Microsoft Clarity** — `clarity('event', 'affiliate_click')` plus
  `clarity('set', 'partner', <slug>)` and `clarity('set', 'source', <placement>)`
- **GA4** — `gtag('event', 'affiliate_click', { partner, source })`

In GA4, mark `affiliate_click` as a **key event** (Admin → Events) the first
time it fires so it shows up as a conversion. That closes the fleet-wide
"trafficked but conversions not measured" gap from day one.

## Compliance guarantees baked into the component

- `rel="sponsored nofollow noopener"` and `target="_blank"` on every link
- a "Paid link" label on each link
- an FTC disclosure sentence immediately adjacent to the links, linking `/disclosure/`
- `/disclosure/` derives its "current status" from the same config, so it can
  never claim "no active affiliate links" while a link is live
- no prices, no scarcity, no "click to support us"
- explicit on-page statement that paid links never influence any score

## Files

- `lib/partners.ts` — slot registry + validation
- `components/PartnerTools.tsx` — the render + tracking
- `app/source/[slug]/page.tsx`, `app/sources/page.tsx` — placements
- `app/disclosure/page.tsx` — status derived from config
