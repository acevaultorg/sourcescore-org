// The free API requires no account. This page collects interest in a possible
// paid offering; it does not create accounts or sell/provision paid access.

import type { Metadata } from "next";
import { TIERS } from "@/lib/claims-types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Sign up — SourceScore VERITAS API",
  description:
    "Free public API access with no signup or account-level meter. Proposed higher-volume tiers can be requested, but checkout and billing are not live.",
  alternates: { canonical: "https://sourcescore.org/signup/" },
  openGraph: {
    title: "Sign up — SourceScore VERITAS API",
    description: "Free public API with no signup. Share requirements for proposed higher-volume access.",
    url: "https://sourcescore.org/signup/",
    type: "website",
  },
};

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
          Public API — free, no signup
        </p>
        <h2 className="text-2xl font-semibold mb-3">
          No signup needed. Just call the API.
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          The free tier is unauthenticated at v0. Start hitting the endpoints
          right now — get familiar with the data shape, signature format, and
          search behavior before deciding whether to share higher-volume needs.
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
        <h2 className="text-xl font-semibold mb-2">Proposed paid plans</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          These are proposed tiers, not active plans. There is no checkout,
          billing, account creation, key provisioning, or service commitment.
          You can share your needs through the{" "}
          <a href="/api-access/" className="underline">
            API access page
          </a>{" "}
          (or email{" "}
          <a href="mailto:hello@caslonmedia.com" className="underline">
            hello@caslonmedia.com
          </a>{" "}
          with your use case and expected volume). We will only contact you if
          a paid offering is actually launched.
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
                    — €{tier.monthlyEur}/mo · {tier.includedClaims?.toLocaleString()} claims/mo
                  </span>
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Proposed monthly price; final limits, support, uptime, and
                  overage terms have not been set.
                </p>
              </div>
              <a
                href={`mailto:hello@caslonmedia.com?subject=Early-access%20%E2%80%94%20${tier.name}%20tier&body=Tier:%20${tier.name}%0AEmail:%20%5Byour%20email%5D%0AUse%20case:%20%5Bbrief%20description%5D%0A%0AThanks!`}
                data-clarity-upgrade={`signup-email-${tier.name}`}
                className={`px-4 py-2 border border-zinc-900 dark:border-zinc-100 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm whitespace-nowrap`} data-event="signup_email" data-event-tier={tier.name}
              >
                Share requirements
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          A request is not an order or reservation. We will publish terms before
          accepting payment if a paid offering is launched.
        </p>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          There is no user account or dashboard for the public API today.
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
