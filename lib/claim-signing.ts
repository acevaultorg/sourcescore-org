// VERITAS-Reborn — claim signing layer (v0: HMAC-SHA256).
//
// Why HMAC-SHA256 for v0:
//   - Web Crypto API native (works in Node 22, Bun, Workers, browsers, Edge runtimes)
//   - Zero deps
//   - Symmetric — sourcescore holds the only signing key; consumers verify by
//     hitting /api/v1/claims/{id} (server re-signs at request-time) and comparing
//   - Sufficient for v0 trust model: "the claim came from sourcescore.org and
//     wasn't tampered in transit"
//
// Migration path (v1, Y2 enterprise):
//   - W3C Verifiable Credentials with Ed25519 keys
//   - Decentralized verification (consumer verifies offline against did:web)
//   - JSON-LD signed payload
//
// Key material:
//   - Build-time:    SOURCESCORE_SIGNING_SECRET env var (CF Pages → Build env)
//   - Request-time:  SOURCESCORE_SIGNING_SECRET (CF Pages → Functions env, encrypted)
//   - Rotation:      operator regenerates secret; rebuild + redeploy; old signatures
//                    become un-verifiable (but the underlying claim is still
//                    re-fetchable + re-verifiable via /api/v1/claims/{id})
//
// Public-facing signed-by identifier (v0):
//   "did:web:sourcescore.org"
//
// Migration to v1 — the signed-by field already carries a DID, so consumers
// who recognize did:web:sourcescore.org continue working when we move from
// HMAC to Ed25519. The verify-side flow swaps; the identity stays.

import type { Claim, ClaimSignature } from "./claims-types";
import { canonicalClaim } from "./claims-types";

const SIGNED_BY = "did:web:sourcescore.org";
const ALGORITHM = "HMAC-SHA256" as const;

/**
 * Generate a stable claim id from its structural fields.
 *
 * First 16 hex chars of SHA-256(canonical(vertical|subject|predicate|object)).
 * 16 hex chars = 64 bits = ~1.8e19 unique ids — plenty for any realistic
 * catalog growth (Year-5 target = 10k-1M claims).
 *
 * Lower-case + URL-safe; matches `[0-9a-f]{16}`.
 */
export async function claimId(parts: {
  vertical: string;
  subject: string;
  predicate: string;
  object: string;
}): Promise<string> {
  const input = [
    parts.vertical.trim().toLowerCase(),
    parts.subject.trim().toLowerCase(),
    parts.predicate.trim().toLowerCase(),
    parts.object.trim().toLowerCase(),
  ].join("|");
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return toHex(digest).slice(0, 16);
}

/**
 * Sign a claim with HMAC-SHA256.
 *
 * @param claim    The claim to sign.
 * @param secret   The signing secret (UTF-8 string).
 * @param signedAt ISO datetime; defaults to now. Override for deterministic builds.
 * @returns        ClaimSignature with hex-encoded signature.
 */
export async function signClaim(
  claim: Claim,
  secret: string,
  signedAt: string = new Date().toISOString(),
): Promise<ClaimSignature> {
  const key = await importSecret(secret);
  const message = new TextEncoder().encode(canonicalClaim(claim));
  const sig = await crypto.subtle.sign("HMAC", key, message);
  return {
    algorithm: ALGORITHM,
    signedBy: SIGNED_BY,
    signedAt,
    signature: toHex(sig),
  };
}

/**
 * Verify a claim signature.
 *
 * @returns `true` if the signature is valid for the given claim + secret.
 */
export async function verifyClaim(
  claim: Claim,
  signature: ClaimSignature,
  secret: string,
): Promise<boolean> {
  if (signature.algorithm !== ALGORITHM) return false;
  if (signature.signedBy !== SIGNED_BY) return false;
  const expected = await signClaim(claim, secret, signature.signedAt);
  // Constant-time compare to avoid timing side-channels (mostly defensive; the
  // callers should still apply their own bounded request limits).
  return timingSafeEqual(expected.signature, signature.signature);
}

// ── internal helpers ────────────────────────────────────────────────────────

async function importSecret(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Build a citation string for end-users to paste into their LLM prompts /
 * articles / papers. Matches the format SourceScore uses for source-rating
 * pages — operators recognize the pattern.
 */
export function buildCitation(claim: Claim, signature: ClaimSignature): string {
  return (
    `${claim.statement} — SourceScore Claim ${claim.id} ` +
    `(verified ${claim.lastVerified}, signed ${signature.signature.slice(0, 8)}…). ` +
    `https://sourcescore.org/claims/${claim.id}/`
  );
}
