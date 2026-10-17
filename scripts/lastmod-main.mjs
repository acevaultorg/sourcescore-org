// Main-content hash for sitemap <lastmod> (2026-10-17, fleet lastmod fix; same rule as whenplant + sourdoughhydration).
//
// A page's lastmod may change ONLY when what a reader came for changes: the text inside <main>.
// Never: header, nav, footer (outside <main>), <head> / JSON-LD, scripts and styles (incl. any RSC flight
// payload), HTML comments, tag attributes / class names (only text is hashed), affiliate links and their
// labels (/go/ anchors and direct Amazon/Audible links), Amili Kit blocks (<aside class="ak-...">,
// injected at deploy) and Amazon disclosure sentences. (ISO dates are kept here: see below.)
//
// Shared by scripts/lastmod.mjs (every deploy) and scripts/lastmod-from-deploys.mjs (one-time correction
// from the Cloudflare Pages deployment history), so both hash exactly the same way.
import { createHash } from 'node:crypto';

export function mainContentText(html) {
  const m = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return (m ? m[1] : html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<template\b[\s\S]*?<\/template>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<aside class="ak-[\s\S]*?<\/aside>/g, ' ')                                          // Amili Kit ad blocks
    .replace(/<a\b[^>]*href="(?:\/go\/|https?:\/\/(?:www\.)?(?:amazon\.|amzn\.to|audible\.))[^"]*"[^>]*>[\s\S]*?<\/a>/g, ' ') // affiliate links
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(?:Affiliate links?\.\s*)?As an Amazon Associate,?[^.]{0,160}\./g, ' ')            // disclosure sentence
    // ISO dates are KEPT on sourcescore: claim dates ("released on 2025-01-06", "Last verified 2026-05-16") are
    // content here, and <main> carries no build date (checked 2026-10-17 on /claims/<id>/ and /source/<slug>/).
    .replace(/\s+/g, ' ')
    .trim();
}

export function mainHash(html) {
  return createHash('sha256').update(mainContentText(html)).digest('hex').slice(0, 16);
}
