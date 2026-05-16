// VERITAS-Reborn — shared build-time claim loader.
//
// Both `scripts/generate-claims-json.ts` (postbuild) and
// `app/claims/[id]/page.tsx` (Next.js generateStaticParams) compute the same
// final Claim[] from `seedClaims`. Putting it here keeps id computation +
// statement generation in one place — guarantees the postbuild JSON twins,
// the consumer HTML pages, and the static OpenAPI spec all agree on every
// claim's id.
//
// async because `claimId()` uses WebCrypto. Cached after first call —
// inside a single Node process (Next.js build OR postbuild script run)
// the result is computed once.

import type { Claim } from "./claims-types";
import { claimId } from "./claim-signing";
import { seedClaims } from "../data/claims-ai-ml";

function generateStatement(parts: {
  subject: string;
  predicate: string;
  object: string;
}): string {
  const verb = parts.predicate.replace(/_/g, " ").trim();
  return `${parts.subject} ${verb}: ${parts.object}.`;
}

let cache: Claim[] | null = null;

export async function loadFullClaims(): Promise<Claim[]> {
  if (cache) return cache;
  const out: Claim[] = [];
  for (const seed of seedClaims) {
    const id = await claimId({
      vertical: seed.vertical,
      subject: seed.subject,
      predicate: seed.predicate,
      object: seed.object,
    });
    const statement = seed.statement ?? generateStatement(seed);
    out.push({ ...seed, id, statement });
  }

  // Collision guard — never expected at 16-hex-char hashes against catalog
  // sizes below ~1B records, but cheap insurance.
  const seen = new Set<string>();
  for (const c of out) {
    if (seen.has(c.id)) {
      throw new Error(
        `[loadFullClaims] Duplicate claim id ${c.id} — collision. ` +
          `Subjects: ${out
            .filter((x) => x.id === c.id)
            .map((x) => x.subject)
            .join(" / ")}`,
      );
    }
    seen.add(c.id);
  }

  cache = out;
  return out;
}

/** Look up a single claim by id. Returns undefined for unknown ids. */
export async function findClaimById(id: string): Promise<Claim | undefined> {
  const claims = await loadFullClaims();
  return claims.find((c) => c.id === id);
}

/** Convert a tag string to a URL-safe slug. Used for /claims/tag/[tag]/ routing. */
export function tagToSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Compute the full tag inventory: unique tag slugs with their member claims
 * + display label. Used for /claims/tag/[tag]/ generateStaticParams + the
 * /claims/tags/ index.
 */
export async function loadTagIndex(): Promise<
  Array<{ slug: string; label: string; claims: Claim[] }>
> {
  const claims = await loadFullClaims();
  const buckets = new Map<string, { slug: string; label: string; claims: Claim[] }>();
  for (const c of claims) {
    for (const tag of c.tags ?? []) {
      const slug = tagToSlug(tag);
      if (!slug) continue;
      const bucket = buckets.get(slug);
      if (bucket) {
        bucket.claims.push(c);
      } else {
        buckets.set(slug, { slug, label: tag, claims: [c] });
      }
    }
  }
  // Sort: largest buckets first (high-signal tags), then alphabetical.
  return [...buckets.values()].sort(
    (a, b) => b.claims.length - a.claims.length || a.slug.localeCompare(b.slug),
  );
}

/**
 * Find claims related to a given claim via tag overlap. Excludes the input
 * claim itself. Returned in descending order of shared-tag count, then
 * descending confidence as the tie-breaker.
 *
 * @param claim    The reference claim.
 * @param limit    Max number of related claims to return (default 5).
 */
export async function relatedClaims(
  claim: Claim,
  limit = 5,
): Promise<Array<Claim & { sharedTags: string[] }>> {
  const all = await loadFullClaims();
  const refTags = new Set(claim.tags ?? []);
  const scored = all
    .filter((c) => c.id !== claim.id)
    .map((c) => {
      const shared = (c.tags ?? []).filter((t) => refTags.has(t));
      return { ...c, sharedTags: shared, _score: shared.length };
    })
    .filter((c) => c._score > 0)
    .sort((a, b) => b._score - a._score || b.confidence - a.confidence);

  return scored.slice(0, limit).map(({ _score, ...rest }) => rest);
}
