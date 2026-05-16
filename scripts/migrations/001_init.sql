-- VERITAS-Reborn — initial Postgres schema (Day 8+).
--
-- Run once on a fresh Neon/Supabase/Railway Postgres instance:
--   psql "$DATABASE_URL" -f scripts/migrations/001_init.sql
--
-- All tables are append-only (no DELETE) except `api_keys` which uses
-- soft-delete via `revoked_at`. This preserves audit trail for billing
-- disputes + abuse investigations.
--
-- Indices target the access patterns the CF Pages Functions need:
--   - api_keys: lookup by key_hash on every authenticated request
--   - users:    lookup by stripe_customer_id on webhook delivery
--   - usage_events: read MTD aggregation per api_key (and per user)
--   - stripe_events: idempotency check on each webhook event

BEGIN;

-- ── extensions ──────────────────────────────────────────────────────────────

-- gen_random_uuid() — for primary keys without pulling in uuid-ossp.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── users ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email               CITEXT       NOT NULL UNIQUE,
  stripe_customer_id  TEXT         UNIQUE,
  plan_tier           TEXT         NOT NULL DEFAULT 'free'
                                   CHECK (plan_tier IN ('free','indie','startup','scale')),
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- CITEXT for case-insensitive email matching without losing the original case.
CREATE EXTENSION IF NOT EXISTS citext;
ALTER TABLE users ALTER COLUMN email TYPE CITEXT;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users (stripe_customer_id);

-- ── api_keys ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS api_keys (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  key_hash      TEXT         NOT NULL UNIQUE,  -- SHA-256(api_key) hex
  key_prefix    TEXT         NOT NULL,         -- first 8 chars of plaintext, for display
  label         TEXT,                          -- optional human label
  last_used_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  revoked_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user           ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active_lookup  ON api_keys (key_hash) WHERE revoked_at IS NULL;

-- ── usage_events ────────────────────────────────────────────────────────────

-- Append-only event log of every billable API call. Aggregations roll up via
-- materialized views or scheduled summary jobs (Day 14+).
--
-- Partitioned by month for scale: 5M calls/mo on Scale tier × N customers
-- means tens-to-hundreds of M rows/year. Partition pruning keeps queries fast.

CREATE TABLE IF NOT EXISTS usage_events (
  id          BIGSERIAL,
  api_key_id  UUID         NOT NULL,
  user_id     UUID         NOT NULL,           -- denormalized for fast MTD per-user queries
  endpoint    TEXT         NOT NULL,           -- '/api/v1/claims/{id}' | '/api/v1/verify' | etc
  claim_id    TEXT,                            -- 16-hex-char id when applicable
  occurred_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  PRIMARY KEY (id, occurred_at)
) PARTITION BY RANGE (occurred_at);

CREATE INDEX IF NOT EXISTS idx_usage_events_user_time      ON usage_events (user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_apikey_time    ON usage_events (api_key_id, occurred_at DESC);

-- Initial month partitions. Day-30 scheduled task creates next month's
-- partition proactively to avoid INSERT failures at month rollover.
CREATE TABLE IF NOT EXISTS usage_events_2026_05 PARTITION OF usage_events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE IF NOT EXISTS usage_events_2026_06 PARTITION OF usage_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE IF NOT EXISTS usage_events_2026_07 PARTITION OF usage_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- ── stripe_events ───────────────────────────────────────────────────────────

-- Webhook idempotency table. Every Stripe event id is recorded once;
-- redelivery within Stripe's retry window finds the existing row and no-ops.

CREATE TABLE IF NOT EXISTS stripe_events (
  id            TEXT         PRIMARY KEY,        -- Stripe event id (evt_...)
  type          TEXT         NOT NULL,           -- 'customer.subscription.created' | etc
  payload_json  JSONB        NOT NULL,
  received_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  processed_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_stripe_events_type     ON stripe_events (type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_unprocessed
  ON stripe_events (received_at) WHERE processed_at IS NULL;

-- ── updated_at trigger ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ── schema_version ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schema_version (
  version    INTEGER      PRIMARY KEY,
  applied_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  note       TEXT
);

INSERT INTO schema_version (version, note)
  VALUES (1, 'initial — users + api_keys + usage_events + stripe_events')
  ON CONFLICT (version) DO NOTHING;

COMMIT;
