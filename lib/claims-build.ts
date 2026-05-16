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
