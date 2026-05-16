// VERITAS-Reborn signup page (Day 1 placeholder).
//
// Until operator-action #1 ships (Stripe live + Products/Prices + webhook
// secret), this page surfaces:
//   - Free-tier path: "no signup needed, just hit the API — start in docs"
//   - Paid-tier path: "Stripe checkout coming soon — email for early access"
//
// Day 8+ refactor:
//   - Replace email-link buttons with Stripe Payment Links per tier
//   - Add post-checkout success page that issues an API key via Postgres
//   - Wire Stripe webhook to user_id ↔ stripe_customer_id sync

import type { Metadata } from "next";
import { TIERS } from "@/lib/claims-types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Sign up — SourceScore VERITAS API",
  description:
    "Free tier (1,000 claims/mo) needs no signup — just use the API. Paid plans (Indie €19, Startup €99, Scale €499) wire to Stripe metered billing.",
  alternates: { canonical: "https://sourcescore.org/signup/" },
  openGraph: {
    title: "Sign up — SourceScore VERITAS API",
    description: "Free tier 1,000 claims/mo, no signup. Paid plans via Stripe metered billing.",
    url: "https://sourcescore.org/signup/",
    type: "website",
  },
};

const freeTier = TIERS.find((t) => t.name === "free")!;
const paidTiers = TIERS.filter((t) => t.name !== "free");

export default function SignupPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Sign up", url: "https://sourcescore.org/signup/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Sign up</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          Start with the API
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          No demos. No contracts. Free tier needs no signup.
        </p>
      </header>

      <section className="mb-12 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Free tier — {freeTier.includedClaims.toLocaleString()} claims/month
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          No signup needed. Just call the API.
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          The free tier is unauthenticated at v0. Start hitting the endpoints
          right now — get familiar with the data shape, signature format, and
          search behavior before deciding whether to upgrade.
        </p>
        <pre className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded p-3 text-xs overflow-x-auto mb-4">
          <code>{`curl https://sourcescore.org/api/v1/claims.json | jq '.count'`}</code>
        </pre>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href="/docs/"
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300"
          >
            Read the docs
          </a>
          <a
            href="/claims/"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Browse the catalog
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-2">Paid plans</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Stripe metered billing wires the week of 2026-05-26 (operator-side
          setup pending). Until live, email{" "}
          <a href="mailto:contact@sourcescore.org" className="underline">
            contact@sourcescore.org
          </a>{" "}
          with your tier choice for early-access: we&rsquo;ll send an invoice
          + manually issue your API key in &lt;24h.
        </p>

        <div className="space-y-3">
          {paidTiers.map((tier) => (
            <div
              key={tier.name}
              className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold capitalize">
                  {tier.name}{" "}
                  <span className="text-zinc-500 font-normal">
                    — €{tier.monthlyEur}/mo · {tier.includedClaims.toLocaleString()} claims/mo
                  </span>
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  + €{tier.overageEurPerClaim.toFixed(4)}/claim over.{" "}
                  {tier.maxApiKeys === "unlimited"
                    ? "Unlimited API keys."
                    : `${tier.maxApiKeys} API key${tier.maxApiKeys === 1 ? "" : "s"}.`}{" "}
                  {tier.supportSlaHours}h support SLA · {tier.uptimeSla}% uptime.
                </p>
              </div>
              <a
                href={`mailto:contact@sourcescore.org?subject=Early-access%20%E2%80%94%20${tier.name}%20tier&body=Tier:%20${tier.name}%0AEmail:%20%5Byour%20email%5D%0AUse%20case:%20%5Bbrief%20description%5D%0A%0AThanks!`}
                className="px-4 py-2 border border-zinc-900 dark:border-zinc-100 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm whitespace-nowrap"
              >
                Email for early access
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          When Stripe Payment Links are wired (operator-side Stripe setup
          complete), these buttons will go to direct checkout. Existing
          early-access invoices auto-convert to Stripe subscriptions at the
          same price.
        </p>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Already signed up?{" "}
          <a href="/dashboard/" className="underline">
            Dashboard
          </a>{" "}
          (Day 8+, currently shows a placeholder).
        </p>
        <p className="mt-2">
          Questions?{" "}
          <a href="/docs/#support" className="underline">
            Support
          </a>{" "}
          ·{" "}
          <a href="/pricing/" className="underline">
            Full pricing details
          </a>
        </p>
      </section>
    </main>
  );
}
