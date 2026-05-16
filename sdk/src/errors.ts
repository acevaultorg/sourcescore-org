// @sourcescore/api — error hierarchy.
//
// All SDK errors extend SourceScoreError. Callers can either match the base
// class (broad) or specific subclasses (narrow) depending on use case.

/** Base SDK error class. All thrown errors extend this. */
export class SourceScoreError extends Error {
  /** HTTP status code, 0 for network errors. */
  public readonly status: number;

  /** Optional detailed message from the API. */
  public readonly detail?: string;

  /** Request id (from response headers) for support diagnostics. */
  public readonly requestId?: string;

  constructor(opts: {
    message: string;
    status: number;
    detail?: string;
    requestId?: string;
  }) {
    super(opts.message);
    this.name = "SourceScoreError";
    this.status = opts.status;
    this.detail = opts.detail;
    this.requestId = opts.requestId;
  }
}

/** 400 — bad request (invalid body / parameter). */
export class BadRequestError extends SourceScoreError {
  constructor(opts: { message: string; detail?: string; requestId?: string }) {
    super({ ...opts, status: 400 });
    this.name = "BadRequestError";
  }
}

/** 401 / 403 — auth required, missing, or rejected. */
export class AuthError extends SourceScoreError {
  constructor(opts: { status: 401 | 403; message: string; detail?: string; requestId?: string }) {
    super(opts);
    this.name = "AuthError";
  }
}

/** 404 — resource not found (e.g., unknown claim id). */
export class NotFoundError extends SourceScoreError {
  constructor(opts: { message: string; detail?: string; requestId?: string }) {
    super({ ...opts, status: 404 });
    this.name = "NotFoundError";
  }
}

/** 429 — rate-limited. `retryAfter` is the ms until you can retry safely. */
export class RateLimitError extends SourceScoreError {
  public readonly retryAfter: number;

  constructor(opts: {
    message: string;
    detail?: string;
    requestId?: string;
    retryAfter: number;
  }) {
    super({
      message: opts.message,
      status: 429,
      detail: opts.detail,
      requestId: opts.requestId,
    });
    this.name = "RateLimitError";
    this.retryAfter = opts.retryAfter;
  }
}
