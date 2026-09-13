// @sourcescore/api — client.

import {
  AuthError,
  BadRequestError,
  NotFoundError,
  RateLimitError,
  SourceScoreError,
} from "./errors.js";
import type {
  ClaimEnvelope,
  ClaimsCatalog,
  Methodology,
  SearchResponse,
  VerifyRequest,
  VerifyResponse,
} from "./types.js";

const DEFAULT_BASE_URL = "https://sourcescore.org";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_USER_AGENT = "@sourcescore/api/0.1.0";

export interface ClientOptions {
  /** Reserved for future or privately provisioned access. Public endpoints need no key. */
  apiKey?: string;
  /** Override base URL — useful for staging or local development. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default 10_000. */
  timeoutMs?: number;
  /** Retry count on 5xx + network errors. Default 2. */
  retries?: number;
  /** User-Agent header — recommended for support diagnostics. */
  userAgent?: string;
  /** Inject a custom fetch implementation (e.g., for testing). */
  fetch?: typeof fetch;
}

export class SourceScoreClient {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly timeoutMs: number;
  private readonly retries: number;
  private readonly userAgent: string;
  private readonly fetchImpl: typeof fetch;

  /** Access to /api/v1/claims/* endpoints. */
  public readonly claims: ClaimsResource;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.retries = options.retries ?? DEFAULT_RETRIES;
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    this.fetchImpl = options.fetch ?? globalThis.fetch;

    if (typeof this.fetchImpl !== "function") {
      throw new Error(
        "@sourcescore/api requires a fetch implementation. Node 18+ provides globalThis.fetch, " +
          "or pass options.fetch to the constructor.",
      );
    }

    this.claims = new ClaimsResource(this);
  }

  /** Fetch the verification methodology metadata. */
  public async methodology(): Promise<Methodology> {
    return this.request<Methodology>({ method: "GET", path: "/api/v1/methodology.json" });
  }

  /** Internal request helper — exposed to resource classes. */
  /** @internal */
  public async request<T>(opts: {
    method: "GET" | "POST";
    path: string;
    query?: Record<string, string | number>;
    body?: unknown;
  }): Promise<T> {
    const url = new URL(opts.path, this.baseUrl);
    if (opts.query) {
      for (const [k, v] of Object.entries(opts.query)) {
        url.searchParams.set(k, String(v));
      }
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": this.userAgent,
    };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;
    if (opts.body !== undefined) headers["Content-Type"] = "application/json";

    const init: RequestInit = {
      method: opts.method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    };

    let lastErr: unknown;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const res = await this.fetchImpl(url, { ...init, signal: controller.signal });
        clearTimeout(timer);

        if (res.ok) {
          return (await res.json()) as T;
        }

        // Parse error body (best-effort).
        let errMessage = `HTTP ${res.status}`;
        let errDetail: string | undefined;
        try {
          const payload = (await res.json()) as { error?: string; detail?: string };
          if (payload?.error) errMessage = payload.error;
          if (payload?.detail) errDetail = payload.detail;
        } catch {
          // Body wasn't JSON — keep the generic status message.
        }

        const requestId = res.headers.get("cf-ray") ?? res.headers.get("x-request-id") ?? undefined;

        if (res.status === 400) {
          throw new BadRequestError({ message: errMessage, detail: errDetail, requestId });
        }
        if (res.status === 401 || res.status === 403) {
          throw new AuthError({ status: res.status, message: errMessage, detail: errDetail, requestId });
        }
        if (res.status === 404) {
          throw new NotFoundError({ message: errMessage, detail: errDetail, requestId });
        }
        if (res.status === 429) {
          const retryAfterHeader = res.headers.get("retry-after");
          const retryAfter = retryAfterHeader
            ? parseInt(retryAfterHeader, 10) * 1000
            : 30_000;
          throw new RateLimitError({
            message: errMessage,
            detail: errDetail,
            requestId,
            retryAfter,
          });
        }

        // 5xx — retry-eligible.
        if (res.status >= 500 && attempt < this.retries) {
          lastErr = new SourceScoreError({
            message: errMessage,
            status: res.status,
            detail: errDetail,
            requestId,
          });
          await delay(backoffMs(attempt));
          continue;
        }

        throw new SourceScoreError({
          message: errMessage,
          status: res.status,
          detail: errDetail,
          requestId,
        });
      } catch (err) {
        clearTimeout(timer);

        // SourceScoreError instances propagate immediately unless retry-eligible (5xx).
        if (err instanceof SourceScoreError) throw err;

        // Network errors / aborts → retry on remaining attempts.
        if (attempt < this.retries) {
          lastErr = err;
          await delay(backoffMs(attempt));
          continue;
        }
        throw new SourceScoreError({
          message: err instanceof Error ? err.message : "Network error",
          status: 0,
        });
      }
    }

    throw new SourceScoreError({
      message: lastErr instanceof Error ? lastErr.message : "Request failed after retries",
      status: 0,
    });
  }
}

class ClaimsResource {
  /** @internal */
  constructor(private readonly client: SourceScoreClient) {}

  /** Fetch the full catalog (light per-claim summaries). */
  public async list(): Promise<ClaimsCatalog> {
    return this.client.request<ClaimsCatalog>({
      method: "GET",
      path: "/api/v1/claims.json",
    });
  }

  /** Fetch one claim by 16-hex-char id. Throws NotFoundError if unknown. */
  public async get(id: string): Promise<ClaimEnvelope> {
    if (!/^[0-9a-f]{16}$/.test(id)) {
      throw new BadRequestError({
        message: "Invalid claim id — must be 16 lowercase hex chars",
        detail: `Got: ${JSON.stringify(id)}`,
      });
    }
    return this.client.request<ClaimEnvelope>({
      method: "GET",
      path: `/api/v1/claims/${id}.json`,
    });
  }

  /** Keyword search across claims. */
  public async search(
    query: string,
    options: { limit?: number } = {},
  ): Promise<SearchResponse> {
    if (!query || query.length < 2) {
      throw new BadRequestError({
        message: "Query must be at least 2 characters",
      });
    }
    return this.client.request<SearchResponse>({
      method: "GET",
      path: "/api/v1/search",
      query: { q: query, ...(options.limit ? { limit: options.limit } : {}) },
    });
  }

  /** Retrieve the nearest catalog candidates for a natural-language assertion. */
  public async verify(
    claim: string,
    options: { minConfidence?: number; vertical?: VerifyRequest["vertical"] } = {},
  ): Promise<VerifyResponse> {
    const body: VerifyRequest = { claim };
    if (options.minConfidence !== undefined) body.minConfidence = options.minConfidence;
    if (options.vertical !== undefined) body.vertical = options.vertical;
    return this.client.request<VerifyResponse>({
      method: "POST",
      path: "/api/v1/verify",
      body,
    });
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffMs(attempt: number): number {
  // Exponential with jitter: 500ms, 1.5s, 4.5s ± up to 250ms.
  const base = 500 * Math.pow(3, attempt);
  const jitter = Math.floor(Math.random() * 250);
  return base + jitter;
}
