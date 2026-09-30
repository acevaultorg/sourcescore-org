# Review of `cloud/growth-sourcescore-org-2026-09-30`

Reviewed 2026-09-30. The branch existed on origin and already contained all of `main`. It holds 5 commits from the earlier session; this review adds 3.

## What I checked

| Check | Result |
|---|---|
| `npm run build` on `main` | exit 0, **3,508** `.html` pages |
| `npm run build` on this branch (before and after my fixes) | exit 0, **3,508** `.html` pages. The page list is identical to `main`, with no new or missing paths. |
| TypeScript (`tsc --noEmit`) | clean |
| Diff of every changed file, read line by line | See below |
| Affiliate / partner links, `/go/` routes, disclosure, analytics, `robots.txt`, sitemap scripts, canonicals | Untouched. There's no diff in `public/`, `lib/`, `components/`, `functions/`, `app/layout.tsx` or the sitemap script, and every `alternates.canonical` line is the same as on `main`. |
| Prices | Not applicable. This site has no products or prices, so nothing is hardcoded. |
| New HTML (source page "best-of lists" section) | Well-formed. It uses a `<section>` with an `<h2>` and a `<ul>` of links, it's server-rendered, and it's hidden when a source is on no list (for example `/source/anthropic-research/`). |
| 375px / 390px layout | No horizontal scroll on any changed page (`scrollWidth` equals the viewport). Every link in the new section is 44–57px tall. |
| Page titles | 0 titles with a doubled brand (there were 977 on `main`). |
| `/llms.txt` | Every concrete URL in it resolves to a built page (the only misses are `<slug>` pattern placeholders). The example numbers match the site: AP 84 vs Reuters 89 velocity, DOI 95 in academic, and Wikipedia A 94. Grade counts add up to 130. |
| Visitor-facing wording | Plain and calm: "Where Reuters ranks in our best-of lists" / "It is on 1 of our 17 lists of the best sources to cite." There's no jargon, card id or hype. Internal notes appear only in code comments, which matches the rest of the codebase. |

## What I fixed

1. **Inconsistent title suffix** (`0b062d3`). The earlier session fixed the doubled brand in two ways. 485 pages ended up as `… · SourceScore` and 492 as `… — SourceScore`: the top-10 pages, per-dimension compare pages and grade × dimension pages, which used `title.absolute` with their own em dash. All 977 now use the layout template's `· SourceScore`, like the other ~2,900 pages on the site. OpenGraph titles are unchanged. (7 older index pages such as `/faq/` and `/best/` already ended in "— SourceScore" on `main` and aren't touched by this branch. I left them as they are.)
2. **Duplicate screenshots** (`729d16c`). Each `review/*_lists_*.png` was byte-for-byte identical to its non-`_lists` twin (same md5), so they didn't show the new section as SUMMARY.md said they did. I replaced them all with a fresh set (below).
3. **Review notes** (this commit): REVIEW.md, the new screenshots, and an updated SUMMARY.md.

## Screenshots (`review/`, 375px and 390px)

- `source_reuters_best-of-section_*`: new section with 1 list
- `source_sec-gov_best-of-section_*`: new section with 7 lists
- `source_anthropic-research_no-lists_*`: a source on no list. The section is correctly absent.
- `source_reuters_top_*`: top of a source page, unchanged
- `best_news-sources_*`, `category_academic_top-10_*`, `compare_ap-news-vs-reuters_velocity_*`, `discipline_reuters_*`: pages where only the title changed. The body is unchanged.

## Worth a human look (not blocking)

- The new section brings the existing best-of rankings more into view. Some of those rankings read oddly, for example the U.S. SEC as **#1 in "Best peer-reviewed sources for citation rigor"** and #1 in "fact-checking-grade sources". That comes from the existing list selectors in `data/best-lists`, not from this branch, but visitors will now see it on the SEC page. It's an editorial call whether to adjust those selectors.
- 977 titles change, so expect a brief ranking wobble while Google re-crawls.

## Ready to go live?

**Yes.** The build is green with the same 3,508 pages, and no affiliate, analytics, robots, sitemap or canonical code changed. The new section is correct, accessible and fine at 375px. The title and `/llms.txt` changes fix real defects (a doubled brand, a 404 link, wrong numbers in the examples). The only caveat is the editorial one above about the list selectors. Delete `review/` before merging if you don't want the screenshots in the repo.
