// VERITAS-Reborn dashboard (Day 1 placeholder).
//
// Until operator-action #2 (Neon/Supabase Postgres provisioning) + the Day
// 8+ auth flow lands, the dashboard surfaces a placeholder explaining the
// roadmap state. Free-tier users link out to /docs/; paid early-access
// users link out to /signup/ to invoice the operator.
//
// Day 8+ refactor:
//   - Server component: read API key from cookie/Authorization header
//   - Postgres lookup: SELECT user_id, plan_tier, ... FROM api_keys JOIN users
//   - Render: live MTD usage chart (Plausible/CF Analytics → JSON),
//     API key rotation UX, Stripe customer portal embed, billing history
//     (from stripe_events partition).

import type { Metadata } from "next";
import { TIERS } from "@/lib/claims-types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Dashboard — SourceScore VERITAS API",
  description:
    "Manage API keys, view usage, and configure your subscription. Live dashboard ships Day 8+ once auth + Postgres land.",
  alternates: { canonical: "https://sourcescore.org/dashboard/" },
  robots: {
    // Placeholder page until real dashboard ships; no indexing value.
    index: false,
    follow: true,
  },
};

export default function DashboardPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Dashboard", url: "https://sourcescore.org/dashboard/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Dashboard</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Dashboard
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          Live dashboard ships Day 8+ once auth + database land.
        </p>
      </header>

      <section className="mb-8 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">What this page will do</h2>
        <ul className="text-sm space-y-1 list-disc pl-5 text-zinc-600 dark:text-zinc-400">
          <li>Live month-to-date usage chart (claims served per day, per API key)</li>
          <li>API key management (create, rotate, label, revoke)</li>
          <li>Stripe customer portal embed (update payment method, cancel, invoices)</li>
          <li>Plan tier + remaining quota + projected overage</li>
          <li>Webhook configuration (Startup + Scale tiers)</li>
        </ul>
      </section>

      <section className="mb-8 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Until then</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          The free tier ({TIERS[0]!.includedClaims.toLocaleString()} claims/mo)
          is fully usable today — no signup required. For paid tiers, email{" "}
          <a href="mailto:contact@acevault.org" className="underline">
            contact@acevault.org
          </a>{" "}
          and we&rsquo;ll send an invoice + issue a key manually in &lt;24h.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href="/docs/"
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300"
          >
            Read the docs
          </a>
          <a
            href="/pricing/"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Pricing
          </a>
          <a
            href="/signup/"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Sign up
          </a>
        </div>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Want a specific dashboard feature on day 1?{" "}
          <a href="mailto:contact@acevault.org" className="underline">
            Tell us
          </a>{" "}
          — we prioritize the dev portal by what paid customers ask for first.
        </p>
      </section>
    </main>
  );
}
