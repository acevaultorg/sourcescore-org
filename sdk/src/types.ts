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

/** SourceScore-issued HMAC metadata. Public users cannot recompute it without the secret. */
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
  /** Minimum legacy editorial record-confidence required for bestMatch. */
  minConfidence?: number;
}

/** Verify response — POST /api/v1/verify */
export interface VerifyResponse {
  apiVersion: "v1";
  methodology: string;
  query: string;
  minConfidence?: number;
  method?: "semantic" | "keyword";
  matches: Array<{
    claim: ClaimSummary;
    matchScore: number;
    rationale: string;
  }>;
  /** Similarity-ranked catalog candidate, not a truth verdict. */
  bestMatch?: ClaimSummary;
  /** Legacy name: means no candidate cleared the retrieval and record-confidence gates. */
  notVerified?: boolean;
  note: string;
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
  includedClaims: number | null;
  availability: "live_free" | "proposal_only";
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
  commercialAvailability: {
    freeApi: "live_no_signup";
    paidAccess: "proposal_only_not_purchasable";
    details: string;
  };
  tiers: Tier[];
  count: number;
  endpoints: Record<string, string>;
}
