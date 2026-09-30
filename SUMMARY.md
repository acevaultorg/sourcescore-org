# Summary — book blocks for sourcescore.org (2026-09-30)

Branch: `cloud/sourcescore-kit-2026-09-30` (made from current main, commit `8e6952f`).

## Result: no product blocks added

The task was to add one small, calm book block per relevant page type
(research, fact-checking, source criticism, writing for the web), but **only
using product, image and price data the repo already has, or the site's
existing Amili kit / Creators API integration**. The block could be one book,
or none if fewer than 3 fitting books were available.

**Zero fitting books are available, so I added no block.** What I checked:

- **No Amazon product data at all.** A search across the repo (outside
  `node_modules` and `.git`) for `amazon`, `amzn`, `asin`, `tag=`, `amili`,
  `creators`, `/go/` and `book` finds no ASINs, product titles, cover images,
  prices or Amazon associate tags. The only "Amazon" hits are the `Amazonbot`
  line in `robots.txt`/`llms.txt` and citation data about Amazon Bedrock.
- **No Amili kit or Creators API integration.** No module, script, env var or
  data file for it. `.env.example` has no such key, and the session environment
  has no Amazon or Creators API credentials.
- **No `/go/` redirect route on this site.** The only `/go/` mention is a comment
  in `scripts/cf-pages-chunked-deploy.py` about a different fleet site
  (meeplepick). sourcescore.org's affiliate layer is `lib/partners.ts` +
  `components/PartnerTools.tsx`, which links straight to SaaS referral URLs
  (Rankscale, Morningscore, SE Ranking, Mangools). None of those are books.
- **Git history** has no commit that ever added book or Amazon product data.

Any block I built would have needed things I'm not allowed to do: guess ASINs,
guess cover image URLs, fetch amazon.com, or write product details from memory.
A block built on made-up data could show the wrong book, a broken image or a
link without an affiliate tag, so no block is the correct result.

## What changed

- `SUMMARY.md` (this file). That is the only file changed.
- No page, component, data file, affiliate tag, disclosure, analytics snippet,
  `robots.txt`, sitemap logic or canonical was touched.

## Build and page counts

| | Before | After |
|---|---|---|
| `npm run build` exit code | 0 | 0 (no source changed) |
| `.html` files in `out/` | 3508 | 3508 |

No new pages. The build ran without `SOURCESCORE_SIGNING_SECRET`, so it logged
its usual dev-fallback warning. That is expected for a local build.

## Screenshots

None taken, and `review/` was not created: no page changed, so there was
nothing to screenshot. Chromium is available in this environment, so
screenshots can be taken once a block is actually added.

## What a human needs to do before a book block can go live

1. **Supply real book data** through an approved source: either wire the Amili
   kit / Creators API into this repo, or add a data file with checked ASINs,
   titles, cover image URLs from the API, and the associate tag. Leave out
   hard-coded prices. Books that fit the site include titles on research
   methods, fact-checking/verification, source criticism, and writing for the
   web. Each one should be picked and checked by a person.
2. **Decide the link route.** sourcescore.org has no `/go/` redirect. Either
   link directly with the tag or add a `/go/` route like the other fleet sites
   use.
3. **Update `/disclosure`** to name Amazon Associates before any Amazon link
   ships. The current disclosure covers the SaaS partner programs only.
4. Then re-run this task. The block should go below the main content, with the
   price rule "View on Amazon" (live price) / "See price on Amazon" (no price).
