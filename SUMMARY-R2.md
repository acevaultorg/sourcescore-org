# Round 2: 2026-10-01

Branch: `claude/r2-sourcescore-org-2026-10-01-vr7h75`. This branch starts from the round-1 branch (`cloud/growth-sourcescore-org-2026-09-30`, commit `d19fa77`), so it also contains round 1's changes. It is not merged and not deployed.

**Branch name:** the brief asked for `cloud/r2-sourcescore-org-2026-10-01`. This session's git setup only allows pushing to the branch above, so the work is on that branch. Nothing was pushed to main or to the round-1 branch.

## Round 1 status
Round 1 pushed its work and its build was healthy: exit 0, 3,508 pages, no overflow at 375px. There was nothing to repair first. Round 1's SUMMARY.md listed "small tap targets" and "ItemList on the index pages" as skipped. This round does both.

## What changed and why

### 1. Phone tap targets on the most-visited page types
I measured every link in `<main>` at 375px on a source page, a compare page, a best-of list and `/sources/`. Many links were 14 to 34px tall, below the 44px minimum. A typical visitor taps from a phone, so a missed tap usually means they leave.
- **All templates (CSS):** breadcrumb links are now 44px tall. The text size is unchanged, and a negative top margin keeps the breadcrumb in the same visual position.
- **FAQ accordions** on source, compare, best-of, category and claim pages: the whole card is now the tap area. Before, only the 23px question line was.
- **`/sources/`:** each of the 130 rows is now one link to the source page. Before, only the 17px name inside the row was a link, even though the whole row highlighted on hover. Grade chips and category headings are 44px.
- **`/best/<slug>/` (17 pages):** tapping anywhere on a ranked card opens that source. The category link inside each card still works on its own. The links that re-sort the list by one sub-score, and the related links at the bottom, are 44px.
- **`/source/<slug>/` (130 pages):** the "vs X" comparison pills (34px before), the sub-score links (14px), "See all comparisons", the peer-group card, "All embed options" and the rank link are now 44px or taller. The peer-group card highlighted on hover but wasn't a link before. The whole card now opens the peer page.
- **`/compare/<slug>/` (151 pages):** the per-sub-score links (38px) and the "other comparisons" pills (34px) are now 44px.

After the change, the only small links left on those four page types are links inside running text. Those are normally exempt from the 44px rule.

### 2. Plain wording, and three factual corrections a visitor could see
- The source page's comparison and peer blurbs used internal jargon ("canonical SourceScore comparisons… quote-ready verdict and JSON twin", "nearest-neighbor… inline dim deltas"). Both are now plain sentences that say what the visitor will find.
- The sub-score link now says "How Citation Discipline is scored →" instead of "About this sub-score →".
- Best-of lists labelled scores "Disc / Mod-Ref / Vel". They now read Discipline, Modern Reference and Velocity. At 375px the score line now wraps cleanly, with no stray "·" at the end of a line.
- **Corrected:** the best-of pages said each source is scored on "the four dimensions". It is three sub-scores plus the overall Index.
- **Corrected:** `/compare/` said "four sub-scores" (there are three). Its meta description said "25 curated pairs" (there are 151). The count is now generated from the data.
- **Removed:** a developer note on `/compare/` that told visitors that adding a pair "is one row in `data/comparisons.ts`".

### 3. ItemList structured data on the three hub pages
`/sources/` (130 sources, ordered by Index score, the same order as the "Rank #N" shown on source pages), `/compare/` (151 pairs) and `/best/` (17 lists) now each have an `ItemList`. Every one of the 298 listed URLs was checked against the built output, and none is missing.

## Files touched
- `app/globals.css` (breadcrumb tap height)
- `app/source/[slug]/page.tsx`
- `app/sources/page.tsx`
- `app/best/page.tsx`, `app/best/[slug]/page.tsx`
- `app/compare/page.tsx`, `app/compare/[slug]/page.tsx`
- `app/category/[slug]/page.tsx`, `app/claims/[id]/page.tsx` (FAQ tap area only)
- `review/r2/*.png`, `SUMMARY-R2.md`

Not touched: robots.txt, sitemap scripts, canonicals, analytics and Clarity, the disclosure, partner and affiliate links, titles. This site has no Amazon products, prices or `/go/` routes, so the Amazon rules had nothing to apply to (round 1 found the same).

## Build
- `npm run build`: exit **0** before and after.
- `.html` pages in `out/`: **3,508 before, 3,508 after**. No new pages.
- `sitemap.xml`: 1,178 URLs before and after.

## Screenshots
`review/r2/`, full-page captures at 375px and 390px wide, served locally from `out/`, 16 files. Pages: `/source/reuters/`, `/sources/`, `/best/`, `/best/news-sources/`, `/compare/`, `/compare/ap-news-vs-reuters/`, `/category/academic/`, `/claims/00f224e1ccc158ef/`. No page scrolls sideways: `scrollWidth` equals the viewport width on every capture. The screenshots used the Chromium and Playwright already installed in the environment.

## Skipped, and why
- **Links inside running text** (for example "reuters.com ↗" and the byline links on compare pages) are still caption-sized. They sit inside sentences, where the 44px rule normally doesn't apply, and making them taller would break the line spacing.
- **The `→` and `↗` text arrows** were left as they are. They are typographic characters, not emoji, and they are used across hundreds of templates. Swapping them for SVG icons is a separate, site-wide design change.
- **Shortening long titles:** still an editorial call, as round 1 noted.
- **Home page:** its ranked-source rows are 36px tall. The home page has a different layout, and I left it out to keep this round small. It's a good next candidate.

## What a human must check before this goes live
1. On a phone, open `/sources/`, `/best/news-sources/` and `/source/reuters/` and tap around. On best-of cards, a tap on the category name ("News") should open the category, and a tap anywhere else on the card should open the source.
2. Check the breadcrumb sits in the right place on two or three page types. It uses a small negative margin to stay in place, and the most likely place for it to look slightly off is a page with an unusual header.
3. Read the new plain-language sentences on a source page, the comparison and peer-group blurbs, and say whether you're happy with the wording.
4. Round 1's checklist still applies, because this branch includes round 1. Delete `review/` before merging if you don't want screenshots in the repo.
