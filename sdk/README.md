# @sourcescore/api

TypeScript SDK for the [SourceScore VERITAS API](https://sourcescore.org/docs/) — curated AI/ML claim records, candidate retrieval, and citable evidence links.

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

// Find a candidate catalog record for a natural-language claim
const verification = await ss.claims.verify("Llama 3.1 was released in July 2024");
if (verification.bestMatch) {
  console.log("Candidate record:", verification.bestMatch.statement);
} else {
  console.log("No candidate record cleared the retrieval gates.");
}
```

## Authentication

The free public API has no account-level meter and needs no API key:

```typescript
const ss = new SourceScoreClient();
```

There is no public paid tier, checkout, or key provisioning today. The optional
`apiKey` client setting is reserved for future or privately provisioned access:

```typescript
const ss = new SourceScoreClient({ apiKey: process.env.SOURCESCORE_API_KEY });
```

See [pricing](https://sourcescore.org/pricing/) for the live free offer and the
clearly labeled higher-volume demand test.

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

Submit a natural-language claim; receive up to five candidate catalog matches with similarity scores and rationale. `bestMatch` is populated only when the similarity score clears the active method floor and the record's legacy editorial-confidence value clears `minConfidence` (default `0.85`). This is retrieval, not entailment or a truth verdict. The response carries SourceScore-issued HMAC metadata when the server has its signing secret; public users cannot independently recompute that tag.

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

## Checking a canonical record

Every `ClaimEnvelope` carries SourceScore-issued HMAC-SHA256 integrity metadata. The shared secret is not public, so SDK users cannot independently verify it and should not treat it as a public signature or identity proof. Refetch the canonical HTTPS claim URL and compare the claim content and cited evidence your application uses.

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
  apiKey: process.env.SOURCESCORE_API_KEY, // optional; public endpoints need none
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
