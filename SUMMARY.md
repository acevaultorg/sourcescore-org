# Growth sweep (second pass): 2026-09-30

Branch: `cloud/growth-sourcescore-org-2026-09-30` (not merged, not deployed)

## A note on the brief
The brief says this site earns through Amazon affiliate clicks. sourcescore.org is actually a source-quality index (130 scored sources, 151 comparisons, 17 "best sources" lists and 384 verified AI/ML claims). It has no Amazon products, prices, `/go/` routes or Amazon links, and it earns through partner/affiliate tools (`lib/partners.ts`). None of those were touched. The Amazon rules had nothing to apply to here.

## What was already good (left alone)
- `robots.txt` allows every major AI crawler, and both `sitemap.xml` and `sitemap-ai.xml` are listed. It is correct as it is.
- The sitemap generator covers 1,178 URLs. `/llms.txt` already exists and is built from data.
- Almost every page type already has JSON-LD (Article, Dataset, ItemList, FAQPage, BreadcrumbList, DefinedTerm). Source, compare, category and best-of pages already open with a direct answer and have an FAQ.

That left three changes with the biggest expected effect:

## 1. Titles no longer repeat the brand (977 pages)
**Why:** the root layout's title template (`%s · SourceScore`) was being applied to titles that already ended in "— SourceScore". The result was titles like `Best news sources for AI citation — SourceScore · SourceScore`. This affected 977 indexable pages: every best-of list, every per-dimension source page (discipline / modern-reference / velocity), category sub-rankings, per-dimension compare pages and grade × dimension pages. The repeated brand wastes the part of the search result people actually read, and Google often rewrites titles that look like this.
**Now:** `Best news sources for AI citation · SourceScore` and `Reuters — Citation Discipline A (91) · SourceScore`. Pages that had a single `const title` now use `title: { absolute: title }`, so their visible title is unchanged but the brand appears only once. OpenGraph titles are unchanged. There are 0 doubled titles after the build (977 before).

## 2. Source pages link to the best-of lists they rank in
**Why:** the 17 `/best/<slug>/` pages answer the most common question on this topic ("what are the best news / health / government sources to cite?"). Until now, the only link to them came from the `/best/` index. The 130 source pages are the strongest pages on the site ("Is Reuters reliable to cite?").
**Now:** each source page has a "Where X ranks in our best-of lists" section, placed after the three sub-scores. It shows each list the source actually appears in, with its real position (for example, "Best news sources for AI citation · #1 of 12"). Positions come from the same `select()` that builds the list pages, so they always match. Across the site, 97 source pages now link to between 1 and 8 lists. The 33 sources that aren't on any list show no section. Each row is at least 44px tall and the section has no horizontal scroll at 375px.

## 3. `/llms.txt` covers the question-answering pages, and its examples are correct
**Added sections** (all generated from `out/api/*.json` at build time):
- **Best-of lists**: all 17 lists, each with its size and its real #1 source and score.
- **Data insights**: the 8 `/insights/` pages, each listed with the question it answers.
- **Grade hubs**: `/grade/` plus the six letter-grade pages with their source counts.

**Fixed:** the "preferred citation" examples were hand-written and had drifted from the site:
- It linked to `/compare/reuters-vs-ap-news/`, which is a 404. The real page is `/compare/ap-news-vs-reuters/`.
- It said "pubmed leads the academic category with Index 92.4". The real leader is DOI (CrossRef Resolver) at 95.
- It cited a claim `abc123` that doesn't exist.

These examples are now built from the data, so every URL resolves and every number matches the site.

## Files touched
- `app/source/[slug]/page.tsx`: new best-of placements section
- Title fixes: `app/best/[slug]/page.tsx`, `app/category/[slug]/[dimension]/page.tsx`, `app/category/[slug]/grade/[letter]/page.tsx`, `app/category/[slug]/top-10/page.tsx`, `app/category/[slug]/top-10/[dim]/page.tsx`, `app/compare/[slug]/[dimension]/page.tsx`, `app/grade/[letter]/[dim]/page.tsx`, and `app/{discipline,modern-reference,velocity}/{[slug],rank/[band],grade/[letter]}/page.tsx`
- `scripts/generate-llms-txt.mjs`
- `review/*.png` (screenshots) and this file

Not touched: robots.txt, sitemap scripts, canonicals, analytics/Clarity, disclosure, partner/affiliate links.

## Build
- `npm run build`: exit code 0, both before and after.
- `.html` pages in `out/`: **3,508 before, 3,508 after**. No new pages.
- The sitemap is unchanged at 1,178 URLs.

## Screenshots (`review/`, 375px and 390px wide, served locally from `out/`)
- `source_reuters_*.png`, `source_reuters_lists_*.png`: new section with 1 list
- `source_sec-gov_*.png`, `source_sec-gov_lists_*.png`: new section with 7 lists
- `best_news-sources_*.png`, `discipline_reuters_*.png`: pages whose title changed (the body is unchanged)

No page had horizontal scroll (`scrollWidth` equals the viewport width at both sizes). The screenshots used the Chromium and Playwright that were already installed in the environment, so `playwright install` wasn't needed.

## Skipped, and why
- **ItemList JSON-LD on `/sources/`, `/compare/` and `/best/`:** these indexes have no ItemList. It's worth doing, but it's a smaller win than the three above because the list pages they link to already carry ItemList.
- **Shortening long titles:** many titles are over 65 characters (for example, "Is U.S. Securities and Exchange Commission reliable to cite? A+ · 96/100 · SourceScore"). Rewording them is an editorial call, so they were left as they are.
- **Small tap targets:** the existing "vs X" comparison pills near the top of source pages are about 32px tall. That's older design, outside this pass.

## What a human should check before this goes live
1. Read one or two source pages (for example `/source/reuters/` and `/source/sec-gov/`) and confirm you're happy with where the new "best-of lists" section sits and how it's worded.
2. Spot-check titles in the built `out/` pages, or later in Search Console. Titles will change on 977 URLs, and rankings may move briefly while Google re-crawls them.
3. Read the new `/llms.txt` from start to end.
4. Delete `review/` before merging if you don't want screenshots in the repo.
