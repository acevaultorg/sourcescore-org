#!/usr/bin/env tsx
/**
 * Postbuild — generate the VERITAS-Reborn API surface from the seed catalog.
 *
 * Emits, under `out/api/v1/`:
 *   - claims.json                — full catalog (light per-claim summaries)
 *   - claims/<id>.json           — per-claim signed envelope (1 per claim)
 *   - methodology.json           — verification methodology v0.1 metadata
 *
 * Also emits, under `out/`:
 *   - claims-index.json          — internal full Claim[] for CF Pages Functions
 *     (NOT linked from any page; used by /api/v1/{verify,search} functions to
 *     answer queries against the catalog without re-fetching N files).
 *
 * Run via postbuild (see package.json). Idempotent — safe to re-run.
 *
 * Layer 5 archetype: dataset_json_api × +70 (per bot-harvest.md) +
 * programmatic_unique_data_page × +55 (per source page; here per claim).
 *
 * Signing:
 *   - Uses SOURCESCORE_SIGNING_SECRET env var.
 *   - If unset AND we're not in production (NODE_ENV=production OR CI=true),
 *     falls back to a deterministic dev secret + logs a warning.
 *   - In production with unset secret, hard-fails. CI catches the gap.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import type { ClaimSummary, ClaimsCatalog, ClaimEnvelope } from "../lib/claims-types";
import { TIERS } from "../lib/claims-types";
import { signClaim, buildCitation } from "../lib/claim-signing";
import { loadFullClaims } from "../lib/claims-build";

const SITE = "https://sourcescore.org";
const OUT_ROOT = join(process.cwd(), "out");
const API_ROOT = join(OUT_ROOT, "api", "v1");

// ── 1. Resolve the signing secret ───────────────────────────────────────────

const isProd =
  process.env.NODE_ENV === "production" || process.env.CI === "true" || process.env.CI === "1";

const SECRET = (() => {
  const fromEnv = process.env.SOURCESCORE_SIGNING_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;

  if (isProd) {
    console.error(
      "[generate-claims-json] FATAL — SOURCESCORE_SIGNING_SECRET missing or <16 chars in production build.",
    );
    process.exit(1);
  }

  console.warn(
    "[generate-claims-json] WARN — SOURCESCORE_SIGNING_SECRET unset; using dev fallback. " +
      "Production builds MUST set this env var to a ≥32-char random value.",
  );
  return "dev-only-do-not-use-in-prod-do-not-use-in-prod";
})();

// ── 2. Ensure out/api/v1/claims/ exists ─────────────────────────────────────

const CLAIMS_DIR = join(API_ROOT, "claims");
if (!existsSync(OUT_ROOT)) {
  console.error(
    "[generate-claims-json] FATAL — out/ does not exist. Run `next build` first.",
  );
  process.exit(1);
}
mkdirSync(API_ROOT, { recursive: true });
mkdirSync(CLAIMS_DIR, { recursive: true });

// ── 3. For each seed claim: compute id, generate statement, sign, write ─────

async function main() {
  const claims = await loadFullClaims();

  // Sign every claim. Build-time signedAt = first second of today (UTC) so
  // rebuilds with no underlying data change produce byte-identical output —
  // good for CDN cache effectiveness + reproducibility audit.
  const SIGNED_AT = (() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
  })();

  const envelopes: ClaimEnvelope[] = [];
  const summaries: ClaimSummary[] = [];

  for (const claim of claims) {
    const sig = await signClaim(claim, SECRET, SIGNED_AT);
    const envelope: ClaimEnvelope = {
      apiVersion: "v1",
      methodology: `${SITE}/methodology/`,
      canonical: `${SITE}/claims/${claim.id}/`,
      claim,
      signature: sig,
      citedAs: buildCitation(claim, sig),
    };
    envelopes.push(envelope);
    summaries.push({
      id: claim.id,
      vertical: claim.vertical,
      subject: claim.subject,
      predicate: claim.predicate,
      object: claim.object,
      statement: claim.statement,
      confidence: claim.confidence,
      signatureShort: sig.signature.slice(0, 8),
      detailUrl: `${SITE}/api/v1/claims/${claim.id}.json`,
    });
  }

  // ── 4. Emit per-claim envelopes ───────────────────────────────────────────

  for (const env of envelopes) {
    writeFileSync(join(CLAIMS_DIR, `${env.claim.id}.json`), JSON.stringify(env, null, 2), "utf8");
  }

  // ── 5. Emit catalog ───────────────────────────────────────────────────────

  const catalog: ClaimsCatalog = {
    apiVersion: "v1",
    methodology: `${SITE}/methodology/`,
    generated: new Date().toISOString(),
    count: summaries.length,
    claims: summaries,
  };

  writeFileSync(join(API_ROOT, "claims.json"), JSON.stringify(catalog, null, 2), "utf8");

  // ── 6. Emit internal full-catalog index for CF Pages Functions ────────────

  // CF Pages Functions need the FULL claim records (incl. sources/tags) to
  // answer /api/v1/verify (keyword search across statement+tags) and
  // /api/v1/search. Single file vs N file-reads = better Function startup time.

  writeFileSync(
    join(OUT_ROOT, "claims-index.json"),
    JSON.stringify(
      {
        apiVersion: "v1",
        generated: new Date().toISOString(),
        signedAt: SIGNED_AT,
        methodology: `${SITE}/methodology/`,
        claims: envelopes.map((e) => ({
          ...e.claim,
          signatureShort: e.signature.signature.slice(0, 8),
          detailUrl: `${SITE}/api/v1/claims/${e.claim.id}.json`,
        })),
      },
      null,
      2,
    ),
    "utf8",
  );

  // ── 7. Emit methodology metadata endpoint ─────────────────────────────────

  const methodologyDoc = {
    apiVersion: "v1",
    version: "veritas-v0.1",
    generated: new Date().toISOString(),
    title: "VERITAS-Reborn Verification Methodology v0.1",
    summary:
      "Each claim is verified against ≥2 primary sources (preprint / peer-reviewed / official-blog / model-card / docs / github-release). Confidence reflects source convergence: 1.00 = primary-source confirmation + independent verification; 0.95 = primary-source single attestation; 0.85 = strong secondary convergence. Claims at confidence <0.70 are not published. Performance-comparison claims are intentionally excluded from v0 because benchmark numbers depend on version + prompt format.",
    signing: {
      algorithm: "HMAC-SHA256",
      signedBy: "did:web:sourcescore.org",
      verificationEndpoint: `${SITE}/api/v1/verify`,
      migrationNote:
        "v1 (Y2) migrates to W3C Verifiable Credentials with Ed25519 keys for offline verification. signedBy identity stays did:web:sourcescore.org.",
    },
    citation: {
      license: "Methodology v0.1 + verified claim data are CC-BY 4.0",
      citationFormat:
        "SourceScore Claim <id> (verified <YYYY-MM-DD>, signed <sig-prefix>). https://sourcescore.org/claims/<id>/",
    },
    tiers: TIERS,
    count: claims.length,
    endpoints: {
      catalog: `${SITE}/api/v1/claims.json`,
      perClaim: `${SITE}/api/v1/claims/{id}.json`,
      verify: `${SITE}/api/v1/verify (POST)`,
      search: `${SITE}/api/v1/search?q={query}`,
      methodology: `${SITE}/api/v1/methodology.json`,
    },
  };

  writeFileSync(
    join(API_ROOT, "methodology.json"),
    JSON.stringify(methodologyDoc, null, 2),
    "utf8",
  );

  // ── 8. Emit /api/v1/tags.json — tag-discovery surface for bots + agents ──
  //
  // Returns the full tag inventory with claim counts + sample claim IDs.
  // Lets RAG developers and LLM crawlers see catalog structure without
  // walking every claim. Layer 5 archetype: dataset_json_api × +70.

  const tagsMap = new Map<string, { label: string; claimIds: string[] }>();
  for (const c of claims) {
    for (const tag of c.tags ?? []) {
      const slug = tag.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (!slug) continue;
      const existing = tagsMap.get(slug);
      if (existing) {
        existing.claimIds.push(c.id);
      } else {
        tagsMap.set(slug, { label: tag, claimIds: [c.id] });
      }
    }
  }

  const tagsDoc = {
    apiVersion: "v1",
    generated: new Date().toISOString(),
    methodology: `${SITE}/methodology/`,
    count: tagsMap.size,
    catalogCount: claims.length,
    tags: [...tagsMap.entries()]
      .map(([slug, { label, claimIds }]) => ({
        slug,
        label,
        claimCount: claimIds.length,
        browseUrl: `${SITE}/claims/tag/${slug}/`,
        sampleClaimIds: claimIds.slice(0, 5),
      }))
      .sort((a, b) => b.claimCount - a.claimCount || a.slug.localeCompare(b.slug)),
  };

  writeFileSync(
    join(API_ROOT, "tags.json"),
    JSON.stringify(tagsDoc, null, 2),
    "utf8",
  );

  // ── 9. Status report ──────────────────────────────────────────────────────

  console.log(
    `[generate-claims-json] OK · ${claims.length} claims signed · ${envelopes.length} envelopes ` +
      `· catalog + methodology + tags (${tagsMap.size}) + index emitted to out/api/v1/ + out/claims-index.json`,
  );
}

main().catch((err) => {
  console.error("[generate-claims-json] FAILED", err);
  process.exit(1);
});
