# Review — `cloud/sourcescore-kit-2026-09-30` (2026-09-30)

Reviewed branch: `cloud/sourcescore-kit-2026-09-30` (it existed on origin, so no
fallback branch was needed). Base: `main` at `8e6952f`. The branch is up to date
with `main`.

## What the branch contains

One commit, `616692a`, adding `SUMMARY.md` at the repo root. It changes no page,
component, data file, affiliate link, disclosure, analytics snippet,
`robots.txt`, sitemap logic or canonical. Its conclusion: no book block was
added, because the repo has no Amazon product data and no Amili kit / Creators
API integration to take it from.

## What I checked

| Check | Result |
|---|---|
| `npm run build` | exit 0 |
| `.html` files in `out/` | 3508 (same as `main`; no source changed) |
| Build warnings | only the usual `SOURCESCORE_SIGNING_SECRET unset; using dev fallback` for local builds |
| Broken HTML / layout at 375px | no page changed. Spot-check of `/` and `/disclosure/`: `scrollWidth` equals the viewport at 375 and 390, so no horizontal scroll |
| Hardcoded prices | none added. The repo has no prices at all |
| Affiliate tags / `/go/` / disclosure / analytics / robots / sitemap / canonical | untouched (diff is `SUMMARY.md` only) |
| Visitor-facing text | none added. `SUMMARY.md` is not part of the build output |
| Claims in `SUMMARY.md` | verified: no `ASIN`, `amzn.to` or `amazon.com/dp` in any commit on any branch; no Amili kit / Creators API code or env key; no `/go/` route (`functions/` holds only the API endpoints and middleware); `/disclosure/` lists partners from `lib/partners.ts` (the four SaaS partners, no Amazon) |

## What I fixed

- `55f7b6a`: `SUMMARY.md` said the Amazon hits were in `robots.txt`/`llms.txt`.
  `llms.txt` is generated at build time and is not in the repo, and the note did
  not mention the `amili` hits in `methodology/bot-harvest.md` (these are about
  the amili fleet site's traffic, not a product integration). Corrected.
- `46ef138`: added `review/` screenshots (see below).

Nothing else needed fixing.

## Screenshots

No page changed, so these are baseline spot-checks, not before/after pairs:

- `review/home-375.png`, `review/home-390.png`
- `review/disclosure-375.png`, `review/disclosure-390.png`

Taken with the preinstalled Chromium against a local server over `out/`.

## Ready to go live?

**No, because there is nothing to ship.** The branch is safe (it cannot change
the site), but it does not do what the task asked: no book blocks exist. For the
same reason, merging it would only add `SUMMARY.md`, `REVIEW.md` and about 1.5 MB
of screenshots to `main`. I'd keep it as a record and not merge it.

Before a book block can be built, a person needs to:

1. Provide real book data through an approved source: wire up the Amili kit /
   Creators API, or add a checked data file (ASINs, titles, API cover image
   URLs, associate tag, no prices).
2. Decide the link route. sourcescore.org has no `/go/` redirect today.
3. Add Amazon Associates to `/disclosure/` (via `lib/partners.ts` or the page)
   before any Amazon link ships.
