# @sourcescore/api

TypeScript SDK for the [SourceScore VERITAS API](https://sourcescore.org/docs/) — signed, sourced, citable claim verification for LLM developers building grounded retrieval systems.

```bash
npm install @sourcescore/api
```

```typescript
import { SourceScoreClient } from "@sourcescore/api";

const ss = new SourceScoreClient();

// Browse the catalog
const catalog = await ss.claims.list();
console.log(`${catalog.count} verified claims`);

// Fetch a specific claim
const envelope = await ss.claims.get("09eea8fb1a8ccebf");
console.log(envelope.citedAs);

// Search by keyword
const results = await ss.claims.search("llama");
for (const c of results.results) {
  console.log(c.statement);
}

// Verify a natural-language claim
const verification = await ss.claims.verify("Llama 3.1 was released in July 2024");
if (verification.bestMatch) {
  console.log("Verified:", verification.bestMatch.statement);
} else {
  console.log("Not verified by SourceScore.");
}
```

## Authentication

Free tier (1,000 claims/mo) needs no API key:

```typescript
const ss = new SourceScoreClient();
```

Paid tier — pass your key:

```typescript
const ss = new SourceScoreClient({ apiKey: process.env.SOURCESCORE_API_KEY });
```

See [pricing](https://sourcescore.org/pricing/) for tiers.

## API surface

All methods return parsed JSON; errors throw `SourceScoreError` (see below).

### `ss.claims.list()`

Fetch the full catalog (light per-claim summaries). Returns a `ClaimsCatalog`.

### `ss.claims.get(id: string)`

Fetch one claim by 16-hex-char id. Returns a `ClaimEnvelope` with the signed claim, sources, signature, and a ready-to-paste citation string.

Throws `NotFoundError` if the id isn't in the catalog.

### `ss.claims.search(query: string, options?: { limit?: number })`

Keyword search across subject / object / statement / predicate / tags. Default `limit: 20`, max `50`. Returns a `SearchResponse` with ranked summaries.

### `ss.claims.verify(claim: string, options?: { minConfidence?: number; vertical?: string })`

Submit a natural-language claim; receive the top 5 ranked catalog matches with normalized match scores + rationale. `bestMatch` is populated only when the top match clears `minConfidence` (default `0.85`). Response is HMAC-signed when the server has access to its signing secret.

### `ss.methodology()`

Fetch the verification methodology metadata (signing model, source-type rules, confidence calibration, pricing tiers, endpoint index).

## Error handling

```typescript
import { SourceScoreError, NotFoundError, RateLimitError } from "@sourcescore/api";

try {
  const envelope = await ss.claims.get("invalid-id");
} catch (err) {
  if (err instanceof NotFoundError) {
    console.warn("Claim not in catalog");
  } else if (err instanceof RateLimitError) {
    console.warn("Rate-limited; retry after", err.retryAfter, "ms");
  } else if (err instanceof SourceScoreError) {
    console.error(err.status, err.message);
  } else {
    throw err;
  }
}
```

## Verifying signatures locally

Every `ClaimEnvelope` carries an HMAC-SHA256 signature signed by `did:web:sourcescore.org`. v0 verification model: fetch the same claim from the API; the server re-signs at request-time, so signatures match for unmodified claims. Tampered envelopes are detected by signature mismatch.

v1 (Y2 roadmap): W3C Verifiable Credentials with Ed25519 keys for offline verification. Migration preserves the `signedBy` identity (`did:web:sourcescore.org`); only the algorithm changes.

## Migration from raw fetch

```diff
- const claim = await fetch(
-   "https://sourcescore.org/api/v1/claims/09eea8fb1a8ccebf.json"
- ).then(r => r.json());
+ const claim = await ss.claims.get("09eea8fb1a8ccebf");
```

The SDK handles base URL, headers, retry on 5xx, parse error → typed error, and response shape verification. Raw fetch always works as a fallback.

## Configuration

```typescript
const ss = new SourceScoreClient({
  apiKey: "sk_live_...",            // optional — only required above free tier
  baseUrl: "https://sourcescore.org", // override for staging/local
  timeoutMs: 10_000,                // default 10s
  retries: 2,                       // default 2 retries on 5xx + network errors
  userAgent: "my-app/1.0.0",        // recommended for support diagnostics
});
```

## License

MIT. Verified claim data licensed CC-BY 4.0. Cite as `SourceScore Claim <id>, sourcescore.org`.

## Links

- Docs: https://sourcescore.org/docs/
- OpenAPI 3.1 spec: https://sourcescore.org/api/v1/openapi.json
- Pricing: https://sourcescore.org/pricing/
- Methodology: https://sourcescore.org/api/v1/methodology.json
- Issues: https://gitlab.com/acevault-lab/sourcescore-api/-/issues
