# Affiliate activation — one env var, no code edit

**Status as of 2026-08-11: zero approved programs. Nothing affiliate-related renders on the site.**

The activation layer is already built and already placed on the pages. It is
dormant: `components/PartnerTools.tsx` returns `null` while no partner URL is
configured, so there is no box, no heading, no whitespace, and no layout shift.
The day a program approves, you set one environment variable and redeploy.

---

## Activate a partner (2 minutes)

1. **Cloudflare Pages → `sourcescore` → Settings → Environment variables →
   Production.** Add the variable for the partner (table below), value = your
   full affiliate URL. It **must** start with `https://` — anything else is
   ignored by design, so a typo fails closed instead of shipping a broken link.
2. **Redeploy.** `NEXT_PUBLIC_*` values are baked in at build time, so an env
   change alone does nothing until a build runs. Push any commit to `main`, or
   hit *Retry deployment* on the latest Pages deployment.
3. **Verify it is live:**
   ```bash
   curl -s https://sourcescore.org/source/wikipedia/ | grep -c 'data-event="affiliate_click"'   # ≥1
   curl -s https://sourcescore.org/source/wikipedia/ | grep -o 'rel="sponsored nofollow noopener"' | head -1
   curl -s https://sourcescore.org/disclosure/ | grep -c 'currently carries affiliate links'    # 1
   ```

Deactivate by clearing the variable and redeploying. Same 2 minutes.

## Variables

| Partner | URL variable | Notes |
|---|---|---|
| Otterly.AI | `NEXT_PUBLIC_AFF_OTTERLY` | name + description built in |
| Rankscale.ai | `NEXT_PUBLIC_AFF_RANKSCALE` | name + description built in |
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
