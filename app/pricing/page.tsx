// The free API is live. Paid-tier names and prices below are a demand test,
// not purchasable plans: there is no checkout, billing, provisioning, or SLA.

import type { Metadata } from "next";
import { TIERS } from "@/lib/claims-types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Pricing — SourceScore VERITAS API",
  description:
    "The VERITAS public API is free with no signup or account-level meter. Proposed paid tiers are collecting demand only; no checkout or billing is live.",
  alternates: { canonical: "https://sourcescore.org/pricing/" },
  openGraph: {
    title: "Pricing — SourceScore VERITAS API",
    description:
      "Free public API with no signup. Proposed higher-volume tiers are available to request, not purchase.",
    url: "https://sourcescore.org/pricing/",
    type: "website",
  },
};

const proposedFeatures: Record<(typeof TIERS)[number]["name"], string[]> = {
  free: [
    "No account-level meter",
    "No API key required",
    "All API endpoints",
    "Public documentation",
  ],
  indie: [
    "50,000 claims/month",
    "Proposed higher-volume access",
    "Details to be set if launched",
  ],
  startup: [
    "500,000 claims/month",
    "Proposed higher-volume access",
    "Details to be set if launched",
  ],
  scale: [
    "5,000,000 claims/month",
    "Proposed higher-volume access",
    "Details to be set if launched",
  ],
};

const tagline: Record<(typeof TIERS)[number]["name"], string> = {
  free: "Evaluate the API",
  indie: "Indie LLM-app builders",
  startup: "Pre-seed → Seed AI startups",
  scale: "Established AI teams",
};

export default function PricingPage() {
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SourceScore VERITAS",
    description:
      "Public catalog API for LLM developers. Returns curated AI/ML claim records with cited evidence, SourceScore-issued HMAC metadata, and stable JSON envelopes for evidence-review workflows.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: "https://sourcescore.org/",
    softwareVersion: "v0.1",
    publisher: {
      "@type": "Organization",
      name: "SourceScore",
      url: "https://sourcescore.org/",
    },
    offers: {
      "@type": "Offer",
      name: "Free API access",
      price: "0",
      priceCurrency: "EUR",
      url: "https://sourcescore.org/docs/",
    },
    featureList: [
      "Free public API with no signup or account-level meter",
      "SourceScore-issued HMAC-SHA256 integrity metadata",
      "Every claim cites primary evidence; 368 of 384 include two or more sources",
      "OpenAPI 3.1 spec",
      "384 hand-verified AI/ML claims (1997-2025)",
      "Stable JSON-LD claim envelopes",
      "Proposed higher-volume tiers available to request",
    ],
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Pricing", url: "https://sourcescore.org/pricing/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Pricing</span>
      </nav>

      <header className="mb-12 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          Pricing
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg">
          The free API is live with no signup, card, or account-level meter. The
          higher-volume tiers below are proposed prices we are using to learn
          what teams need; they cannot be purchased today.
        </p>
      </header>

      {/* Demand-validation pointer (2026-06-19 decision · TaskPrio mqkx7wduvm7zjl).
          Additive + honest; does not alter the tier cards or the operator's
          pending paid-pitch decision (mpwzjzpsr220u5) — true whether paid tiers
          turn on or stay early-access. */}
      <div className="mb-12 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 text-sm">
        <p className="text-zinc-700 dark:text-zinc-300">
          <strong className="text-zinc-900 dark:text-zinc-100">
            Paid tiers are a demand test, not a sale.
          </strong>{" "}
          The public API is live now — free, no signup or card. For a
          higher-volume plan,{" "}
          <a
            href="/api-access/"
            data-clarity-upgrade="pricing-to-api-access"
            className="underline font-medium hover:text-zinc-900 dark:hover:text-zinc-100" data-event="pricing_request_access"
          >
            request access
          </a>{" "}
          so we can assess demand. There is no checkout, billing, API-key
          provisioning, SLA, or commitment yet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {TIERS.map((tier) => {
          const isFree = tier.name === "free";
          return (
            <div
              key={tier.name}
              className={`border rounded-lg p-6 flex flex-col ${
                tier.name === "indie"
                  ? "border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900 dark:ring-zinc-100"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                  {tagline[tier.name]}
                </p>
                <h2 className="text-xl font-semibold capitalize">
                  {tier.name}
                </h2>
                <p className="mt-3 text-3xl font-semibold">
                  {isFree ? "Free" : `€${tier.monthlyEur}`}
                  {!isFree && (
                    <span className="text-base font-normal text-zinc-500">
                      /mo
                    </span>
                  )}
                </p>
                {!isFree && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Proposed monthly price; final scope and terms are not set.
                  </p>
                )}
              </div>

              <ul className="space-y-2 text-sm flex-grow mb-6">
                {proposedFeatures[tier.name].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-zinc-400 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {isFree ? (
                <a
                  href="/docs/"
                  data-clarity-upgrade={`pricing-cta-${tier.name}`}
                  className="w-full text-center px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900" data-event="pricing_cta" data-event-tier="free"
                >
                  Start in docs
                </a>
              ) : (
                <a
                  href="/api-access/"
                  data-clarity-upgrade={`pricing-cta-${tier.name}`}
                  className={`w-full text-center px-4 py-2 rounded font-medium ${ tier.name === "indie" ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300" : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900" }`} data-event="pricing_cta" data-event-tier={tier.name}
                >
                  Request access
                </a>
              )}
            </div>
          );
        })}
      </div>

      <section className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">What is live now</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            The public catalog API is free without signup, keys, or account-level
            metering. Standard network abuse controls may apply. See the
            documentation for current endpoints and usage guidance.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">How proposed paid access works</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Requesting access sends us your use case and expected volume. It is
            not an order and does not create an account, API key, invoice, or
            contract. If a paid offering is launched, we will contact requesters
            with the actual terms before any purchase is possible.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Why show proposed prices?</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            They make the demand test concrete without pretending the service
            is available. Tell us what volume and reliability requirements you
            need by emailing{" "}
            <a href="mailto:hello@caslonmedia.com" className="underline">
              hello@caslonmedia.com
            </a>{" "}
            or use the request-access page.
          </p>
        </div>
      </section>
    </main>
  );
}
