// @sourcescore/api — public entry point.

export { SourceScoreClient } from "./client.js";
export type { ClientOptions } from "./client.js";

export {
  SourceScoreError,
  NotFoundError,
  RateLimitError,
  AuthError,
  BadRequestError,
} from "./errors.js";

export type {
  Claim,
  ClaimSource,
  SourceType,
  ClaimVertical,
  ClaimSignature,
  ClaimEnvelope,
  ClaimSummary,
  ClaimsCatalog,
  SearchResponse,
  VerifyRequest,
  VerifyResponse,
  Tier,
  Methodology,
} from "./types.js";
