// @sourcescore/api — type definitions.
//
// Mirrors the server-side types in sourcescore-org repo's lib/claims-types.ts
// but is self-contained — no cross-package imports — so the SDK has zero
// runtime deps and can ship as a standalone npm package.

/** Verticals served by VERITAS-Reborn (v0 = ai-ml only). */
export type ClaimVertical = "ai-ml";

/** Source type — what kind of document provides evidence for a claim. */
export type SourceType =
  | "preprint"
  | "peer-reviewed"
  | "official-blog"
  | "press-release"
  | "docs"
  | "model-card"
  | "github-release"
  | "benchmark";

/** A single source-of-truth document supporting a claim. */
export interface ClaimSource {
  url: string;
  title: string;
  publisher: string;
  publishedDate?: string;
  accessedDate: string;
  type: SourceType;
  excerpt?: string;
}

/** Detached signature over a claim — HMAC-SHA256 in v0; W3C VC in v1. */
export interface ClaimSignature {
  algorithm: "HMAC-SHA256";
  signedBy: string;
  signedAt: string;
  signature: string;
}

/** Atomic factual claim. */
export interface Claim {
  id: string;
  vertical: ClaimVertical;
  subject: string;
  predicate: string;
  object: string;
  statement: string;
  confidence: number;
  sources: ClaimSource[];
  publishedAt: string;
  lastVerified: string;
  methodologyVersion: string;
  tags: string[];
}

/** Per-claim API response envelope. */
export interface ClaimEnvelope {
  apiVersion: "v1";
  methodology: string;
  canonical: string;
  claim: Claim;
  signature: ClaimSignature;
  citedAs: string;
}

/** Light per-claim summary used in catalog + search responses. */
export interface ClaimSummary {
  id: string;
  vertical: ClaimVertical;
  subject: string;
  predicate: string;
  object: string;
  statement: string;
  confidence: number;
  signatureShort: string;
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
  claim: string;
  vertical?: ClaimVertical;
  minConfidence?: number;
}

/** Verify response — POST /api/v1/verify */
export interface VerifyResponse {
  apiVersion: "v1";
  methodology: string;
  query: string;
  matches: Array<{
    claim: ClaimSummary;
    matchScore: number;
    rationale: string;
  }>;
  bestMatch?: ClaimSummary;
  notVerified?: boolean;
  signature?: ClaimSignature;
}

/** Search response — GET /api/v1/search?q=... */
export interface SearchResponse {
  apiVersion: "v1";
  methodology: string;
  query: string;
  count: number;
  results: ClaimSummary[];
}

/** Subscription tier definition. */
export interface Tier {
  name: "free" | "indie" | "startup" | "scale";
  monthlyEur: number;
  includedClaims: number;
  overageEurPerClaim: number;
  maxApiKeys: number | "unlimited";
  supportSlaHours: number;
  uptimeSla: number;
}

/** Methodology response — GET /api/v1/methodology.json */
export interface Methodology {
  apiVersion: "v1";
  version: string;
  generated: string;
  title: string;
  summary: string;
  signing: {
    algorithm: string;
    signedBy: string;
    verificationEndpoint: string;
    migrationNote: string;
  };
  citation: {
    license: string;
    citationFormat: string;
  };
  tiers: Tier[];
  count: number;
  endpoints: Record<string, string>;
}
