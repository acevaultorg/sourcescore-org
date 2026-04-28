# SourceScore

The reference index for AI-citation quality. Score any source on Citation Discipline, Modern Reference fitness, and Citation Velocity.

**Stack:** Next.js 15 (static export) + Tailwind 3 + Cloudflare Pages
**Methodology:** v0.1 (10-source Day 1 sample → 10,000+ production index)
**Bundle:** 4 concepts on one domain (Index · Discipline · Modern Reference · Velocity)

## Develop

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build (static export)

```bash
npm run build
# Output → ./out/
```

`postbuild` regenerates `sitemap.xml` + `sitemap-ai.xml` from the export.

## Deploy (Cloudflare Pages)

```bash
npm run deploy
# = clean + build + wrangler pages deploy out --project-name sourcescore --branch main
# + IndexNow ping (set INDEXNOW_KEY env var)
```

## Layout

```
app/
  page.tsx                 — landing + Top-5 leaderboard + full table
  source/[slug]/page.tsx   — per-source detail (programmatic)
  discipline/page.tsx      — Citation Discipline sub-tool
  modern-reference/page.tsx — Modern Reference sub-tool
  velocity/page.tsx        — Citation Velocity sub-tool
  methodology/page.tsx     — v0.1 transparent rubric
  about/, contact/, privacy/, sources/  — supporting pages
data/sources.ts            — Day 1 sample dataset (10 sources)
lib/types.ts               — Source schema + grade helpers
components/ScoreBadge.tsx  — letter-grade + score pill
public/                    — robots.txt, llms.txt, sitemap, ads.txt, og.svg, _headers
scripts/                   — postbuild sitemap generator + IndexNow ping
```

## Methodology

See [/methodology](https://sourcescore.org/methodology/) for the full v0.1 rubric.
The 4 sub-scores compose the SourceScore Index via weighted mean:
Discipline 35% + Modern Reference 30% + Velocity 35%.
