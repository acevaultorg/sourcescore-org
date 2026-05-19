// VERITAS-Reborn pricing page (Day 1).
//
// 3 paid tiers + Free, all self-serve. NO enterprise tier — operator has
// committed to no-sales motion. Stripe Payment Links wired Day 8+ (operator
// needs to set up Stripe live mode + Products/Prices first). Day 1 ships the
// public-facing page with copy + tier comparison + "Coming soon: signup"
// CTA. Pricing values come from the canonical TIERS table in
// lib/claims-types.ts — single source of truth between this page, the
// Stripe Products metadata (Day 8+), and /api/v1/methodology.json output.

import type { Metadata } from "next";
import { TIERS } from "@/lib/claims-types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Pricing — SourceScore VERITAS API",
  description:
    "Free 1,000 claims/mo, no auth. Paid plans start at €19/mo (Indie). Self-serve, no demos, no contracts. Stripe metered billing.",
  alternates: { canonical: "https://sourcescore.org/pricing/" },
  openGraph: {
    title: "Pricing — SourceScore VERITAS API",
    description:
      "Free tier 1,000 claims/mo. Indie €19. Startup €99. Scale €499. Self-serve only.",
    url: "https://sourcescore.org/pricing/",
    type: "website",
  },
};

const features: Record<(typeof TIERS)[number]["name"], string[]> = {
  free: [
    "1,000 claims/month",
    "1 API key",
    "All API endpoints",
    "Community support (GitHub Issues)",
    "99.0% uptime",
  ],
  indie: [
    "50,000 claims/month",
    "3 API keys",
    "All API endpoints",
    "Email support (48h response)",
    "99.5% uptime SLA",
    "Usage alerts via webhook",
  ],
  startup: [
    "500,000 claims/month",
    "10 API keys",
    "All API endpoints",
    "Email support (24h response)",
    "99.5% uptime SLA",
    "Webhook for usage alerts",
    "Per-key usage analytics",
  ],
  scale: [
    "5,000,000 claims/month",
    "Unlimited API keys",
    "All API endpoints",
    "Priority email support (4h response)",
    "99.9% uptime SLA",
    "Dedicated webhooks",
    "Per-key usage analytics",
    "Custom rate-limit windows",
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
      "Signed-claim verification API for LLM developers. Returns hand-verified AI/ML claims with primary sources, HMAC-SHA256 signatures, and stable JSON envelopes for grounding LLM responses.",
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
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "499",
      priceCurrency: "EUR",
      offerCount: TIERS.length,
      offers: TIERS.map((tier) => ({
        "@type": "Offer",
        name:
          tier.name === "free"
            ? "Free"
            : tier.name.charAt(0).toUpperCase() + tier.name.slice(1),
        price: tier.monthlyEur.toString(),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: tier.monthlyEur,
          priceCurrency: "EUR",
          unitText: "MONTH",
          billingIncrement: 1,
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: tier.includedClaims,
            unitText: "verified-claim API calls",
          },
        },
        category: tagline[tier.name],
        availability: "https://schema.org/InStock",
        url: "https://sourcescore.org/pricing/",
        seller: {
          "@type": "Organization",
          name: "SourceScore",
          url: "https://sourcescore.org/",
        },
      })),
    },
    featureList: [
      "1,000 free API claims per month (no signup)",
      "HMAC-SHA256 signed response envelopes",
      "≥2 primary sources per claim",
      "OpenAPI 3.1 spec",
      "346 hand-verified AI/ML claims (1997-2025)",
      "Stable JSON-LD claim envelopes",
      "Self-serve Stripe metered billing",
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
          Self-serve. No demos. No contracts. Free tier has no card requirement.
          Paid tiers via Stripe metered billing — cancel anytime, prorated.
        </p>
      </header>

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
                    + €{tier.overageEurPerClaim.toFixed(4)} per claim over{" "}
                    {tier.includedClaims.toLocaleString()}/mo
                  </p>
                )}
              </div>

              <ul className="space-y-2 text-sm flex-grow mb-6">
                {features[tier.name].map((f) => (
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
                  className="w-full text-center px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 plausible-event-name=pricing_cta plausible-event-tier=free"
                >
                  Start in docs
                </a>
              ) : (
                <a
                  href="/signup/"
                  data-clarity-upgrade={`pricing-cta-${tier.name}`}
                  className={`w-full text-center px-4 py-2 rounded font-medium plausible-event-name=pricing_cta plausible-event-tier=${tier.name} ${
                    tier.name === "indie"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300"
                      : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  Subscribe
                </a>
              )}
            </div>
          );
        })}
      </div>

      <section className="max-w-3xl space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-3">How metered billing works</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Each tier includes a monthly claim quota. API calls past the quota
            are billed at the overage rate. Usage is metered server-side per
            API key; the dashboard shows live month-to-date counts. Quotas
            reset on your billing-cycle anniversary, not the calendar month.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">What counts as a claim</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            One claim = one billable read of a specific verified claim record.
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded mx-1">
              GET /api/v1/claims/&lt;id&gt;.json
            </code>
            counts as one. A
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded mx-1">
              POST /api/v1/verify
            </code>
            call counts as one regardless of how many candidates were scored
            (you pay for the bestMatch you get, not the entire catalog scan).
            Catalog/methodology/search index endpoints are free for all tiers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">No enterprise tier</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            By design. SourceScore is solo-founder operated; we don&rsquo;t do
            demos, custom contracts, or procurement cycles. The Scale tier
            covers 5M claims/month with a 4h-response SLA; if your workload
            exceeds that, email{" "}
            <a href="mailto:contact@sourcescore.org" className="underline">
              contact@sourcescore.org
            </a>{" "}
            and we&rsquo;ll work out overage pricing on the same Stripe
            subscription.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Cancellation + refunds</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Cancel anytime from the dashboard. Subscriptions prorate to the day.
            Refunds within 14 days, no questions, no friction. Stripe handles
            payment + invoicing; we never see card numbers.
          </p>
        </div>
      </section>
    </main>
  );
}
