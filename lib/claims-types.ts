// VERITAS-Reborn — claim-verification API type definitions.
//
// Schema v0 (2026-05-16). HMAC-SHA256 signing layer; W3C VC migration deferred
// to v1 (Y2, enterprise customers). Built additive to existing source-scoring
// types in lib/types.ts — these two type sets share no fields; they live on
// the same domain as sister products.
//
// Public on-disk surface (static export):
//   /api/v1/claims/{id}.json       — per-claim signed envelope
//   /api/v1/claims.json            — full claim catalog (light per-claim summary)
//   /api/v1/methodology.json       — verification methodology v0.1
//
// Dynamic surface (CF Pages Functions):
//   GET  /api/v1/claims/{id}       — fetch by id (server-signed at request-time)
//   POST /api/v1/verify            — submit a natural-language claim, match against catalog
//   GET  /api/v1/search?q=...      — keyword search
//
// Auth + billing (Day 8+, Postgres-backed):
//   POST /api/v1/auth/signup       — Stripe Customer + API key issuance
//   POST /api/v1/auth/key/rotate
//   POST /api/v1/stripe/webhook
//   GET  /api/v1/usage/{api_key}/current

/** Verticals served by VERITAS-Reborn (v0 = ai-ml only; expansion per quarter). */
export type ClaimVertical = "ai-ml";

/** Source type — what kind of document/page provides evidence. */
export type SourceType =
  | "preprint"        // arXiv, bioRxiv, etc.
  | "peer-reviewed"   // journal, conference proceedings
  | "official-blog"   // vendor announcement (OpenAI, Anthropic, Google, Meta)
  | "press-release"   // vendor press release
  | "docs"            // official documentation
  | "model-card"      // HuggingFace model card, vendor-published spec sheet
  | "github-release"  // GitHub release notes / tagged commit
  | "benchmark";      // leaderboard entry (lmsys, etc.)

/** A single source-of-truth document supporting a claim. */
export interface ClaimSource {
  /** Canonical URL — the version the publisher considers authoritative. */
  url: string;
  /** Human-readable title. */
  title: string;
  /** Publisher / organization. */
  publisher: string;
  /** Publication date if known (ISO 8601 date or datetime). */
  publishedDate?: string;
  /** When SourceScore last verified the source is accessible + content matches. */
  accessedDate: string;
  /** Kind of document. */
  type: SourceType;
  /** Direct supporting quote from the source, ≤200 chars. Quoted verbatim. */
  excerpt?: string;
}

/**
 * Atomic factual claim — the core data unit of VERITAS-Reborn.
 *
 * Canonical identity = stable hash of `(subject + predicate + object + vertical)`.
 * Two claims with identical (subject, predicate, object, vertical) collapse into
 * one record with merged sources.
 */
export interface Claim {
  /** Stable id — first 16 chars of SHA-256 over canonical(claim). Hex. */
  id: string;
  /** Domain vertical (currently always "ai-ml"). */
  vertical: ClaimVertical;
  /** Subject of the claim — e.g. "Llama 3.1 70B", "Claude 3.5 Sonnet", "RLHF". */
  subject: string;
  /** Predicate / relation — e.g. "released_on", "context_window", "outperforms_on_benchmark". */
  predicate: string;
  /** Object / value — e.g. "2024-07-23", "128000 tokens", "MMLU: 82.0". */
  object: string;
  /**
   * Human-readable claim string. Generated from (subject, predicate, object)
   * for display; CAN be edited for natural readability without affecting
   * the canonical id (which hashes structured fields).
   */
  statement: string;
  /**
   * Confidence 0.0-1.0. Calibration:
   *   1.00 — primary-source confirmation, independently verified
   *   0.95 — primary-source confirmation, single attestation
   *   0.85 — strong secondary-source convergence
   *   0.70 — single secondary source, no contradictions found
   *   <0.70 — DO NOT publish in v0 (raises Schema Honesty risk per I-43)
   */
  confidence: number;
  /** Supporting sources — ≥3 for confidence ≥0.85, ≥1 for 0.70-0.85. */
  sources: ClaimSource[];
  /** ISO datetime — when first published to SourceScore. */
  publishedAt: string;
  /** ISO date — when SourceScore last re-verified the claim. */
  lastVerified: string;
  /** Methodology version (semver-ish; v0.1 = Day 1). */
  methodologyVersion: string;
  /**
   * Tags — non-canonical, free-form, lowercase. Used for /api/v1/search?q=
   * keyword matching in v0 (semantic search via embeddings deferred to Day 30+).
   */
  tags: string[];
}

/** Detached signature over a claim — HMAC-SHA256 in v0; W3C VC in v1. */
export interface ClaimSignature {
  /** Algorithm — fixed at "HMAC-SHA256" in v0. */
  algorithm: "HMAC-SHA256";
  /**
   * Signing identity. v0 = "did:web:sourcescore.org" (placeholder DID).
   * v1 = W3C VC issuer DID with cryptographic key resolution.
   */
  signedBy: string;
  /** ISO datetime when the signature was minted. */
  signedAt: string;
  /** Hex SHA-256 HMAC over canonical(claim). Lower-case hex. */
  signature: string;
}

/** Per-claim API response envelope. */
export interface ClaimEnvelope {
  apiVersion: "v1";
  /** Methodology link — every response cites its derivation. */
  methodology: string;
  /** Canonical URL for the human-readable claim page. */
  canonical: string;
  claim: Claim;
  signature: ClaimSignature;
  /** Ready-to-paste citation string (per Aleyda Solis #4 Extractable). */
  citedAs: string;
}

/**
 * Seed-time claim — same shape as Claim but without computed fields (`id`,
 * `statement`). Build script fills these from structural fields. Use this
 * shape in `data/claims-ai-ml.ts` so seed authors can't accidentally
 * mis-compute ids by hand.
 */
export type SeedClaim = Omit<Claim, "id" | "statement"> & {
  /** Optional override; if omitted, `statement` is generated from subject + predicate + object. */
  statement?: string;
};

/** Light per-claim summary used in catalog + search responses. */
export interface ClaimSummary {
  id: string;
  vertical: ClaimVertical;
  subject: string;
  predicate: string;
  object: string;
  statement: string;
  confidence: number;
  /** First 8 chars of signature for quick consistency check. */
  signatureShort: string;
  /** Pointer to full envelope. */
  detailUrl: string;
}

/** Catalog response — GET /api/v1/claims.json */
export interface ClaimsCatalog {
  apiVersion: "v1";
  methodology: string;
  generated: string;
  count: number;
  claims: ClaimSummary[];
}

/** Verify request — POST /api/v1/verify */
export interface VerifyRequest {
  /** Natural-language claim, max 1000 chars. */
  claim: string;
  /** Optional vertical filter. */
  vertical?: ClaimVertical;
  /** Minimum confidence threshold for "verified" judgment. Default 0.85. */
  minConfidence?: number;
}

/** Verify response — POST /api/v1/verify */
export interface VerifyResponse {
  apiVersion: "v1";
  methodology: string;
  query: string;
  /** Confidence threshold applied for the verdict (default 0.85). */
  minConfidence?: number;
  /**
   * Ranking method that produced `matches`: "semantic" = Workers AI bge-m3
   * embedding + Vectorize cosine (match floor 0.50); "keyword" = term-overlap
   * fallback (match floor 0.30), used only when the semantic bindings are cold.
   */
  method?: "semantic" | "keyword";
  matches: Array<{
    claim: ClaimSummary;
    /** Match score 0.0-1.0 — keyword overlap in v0, semantic in v1+. */
    matchScore: number;
    /** Plain-English explanation of why this matched. */
    rationale: string;
  }>;
  /** Highest-scoring match if matchScore ≥ minConfidence; else undefined. */
  bestMatch?: ClaimSummary;
  /** True if no match cleared the threshold. */
  notVerified?: boolean;
  signature: ClaimSignature;
}

/** Search response — GET /api/v1/search?q=... */
export interface SearchResponse {
  apiVersion: "v1";
  methodology: string;
  query: string;
  count: number;
  results: ClaimSummary[];
}

/** Subscription tier definitions — referenced from pricing page + Stripe metadata. */
export interface Tier {
  name: "free" | "indie" | "startup" | "scale";
  monthlyEur: number;
  includedClaims: number;
  overageEurPerClaim: number;
  maxApiKeys: number | "unlimited";
  /** Email-support SLA in hours. */
  supportSlaHours: number;
  /** Public uptime SLA percent. */
  uptimeSla: number;
}

/** Canonical tier table — single source of truth for pricing-page + Stripe sync. */
export const TIERS: Tier[] = [
  {
    name: "free",
    monthlyEur: 0,
    includedClaims: 1000,
    overageEurPerClaim: 0,
    maxApiKeys: 1,
    supportSlaHours: 72,
    uptimeSla: 99.0,
  },
  {
    name: "indie",
    monthlyEur: 19,
    includedClaims: 50_000,
    overageEurPerClaim: 0.001,
    maxApiKeys: 3,
    supportSlaHours: 48,
    uptimeSla: 99.5,
  },
  {
    name: "startup",
    monthlyEur: 99,
    includedClaims: 500_000,
    overageEurPerClaim: 0.0005,
    maxApiKeys: 10,
    supportSlaHours: 24,
    uptimeSla: 99.5,
  },
  {
    name: "scale",
    monthlyEur: 499,
    includedClaims: 5_000_000,
    overageEurPerClaim: 0.0002,
    maxApiKeys: "unlimited",
    supportSlaHours: 4,
    uptimeSla: 99.9,
  },
];

/**
 * Canonical-form serialization of a claim for hashing/signing.
 *
 * Deterministic — same input always produces same output regardless of
 * object key order. Critical for signature verification: client recomputes
 * the canonical form and compares HMAC.
 *
 * Canonical form: JSON with sorted keys, no whitespace, only the fields
 * that are part of the signed payload (excludes mutable fields like
 * `lastVerified` and `tags`).
 */
export function canonicalClaim(claim: Claim): string {
  const payload = {
    id: claim.id,
    vertical: claim.vertical,
    subject: claim.subject,
    predicate: claim.predicate,
    object: claim.object,
    statement: claim.statement,
    confidence: claim.confidence,
    sources: claim.sources.map((s) => ({
      url: s.url,
      title: s.title,
      publisher: s.publisher,
      publishedDate: s.publishedDate ?? null,
      type: s.type,
    })),
    publishedAt: claim.publishedAt,
    methodologyVersion: claim.methodologyVersion,
  };
  return JSON.stringify(payload, Object.keys(payload).sort());
}

/** Tier lookup by name. Returns undefined for unknown names. */
export function tierByName(name: string): Tier | undefined {
  return TIERS.find((t) => t.name === name);
}

/**
 * Build a stable canonical id for a claim from its structural fields.
 * Implementation lives in `lib/claim-signing.ts` (which has Web Crypto access);
 * this signature is exported here for callers that compose claims at build-time.
 */
export type ClaimIdFn = (
  parts: Pick<Claim, "vertical" | "subject" | "predicate" | "object">
) => Promise<string>;
