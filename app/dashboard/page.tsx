// VERITAS dashboard placeholder. The public API has no accounts or dashboard;
// no paid plan, billing portal, or provisioning workflow is live.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Dashboard — SourceScore VERITAS API",
  description:
    "The SourceScore VERITAS dashboard is not available. The public API requires no account; proposed higher-volume access can be requested.",
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
          There is no dashboard, account system, paid API-key provisioning, or
          billing service today.
        </p>
      </header>

      <section className="mb-8 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Use the public API</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">The public API is free and needs no signup, account, or key. Current endpoints and usage guidance are in the documentation.</p>
      </section>

      <section className="mb-8 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Until then</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          For higher-volume needs, email{" "}
          <a href="mailto:hello@caslonmedia.com" className="underline">
            hello@caslonmedia.com
          </a>{" "}
          with your use case and expected volume. This is a demand request, not
          an order, account, invoice, or access promise.
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
            href="/api-access/"
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Request access
          </a>
        </div>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Want to share an API use case?{" "}
          <a href="mailto:hello@caslonmedia.com" className="underline">
            Tell us
          </a>{" "}
          — it helps assess whether a higher-volume offering should be built.
        </p>
      </section>
    </main>
  );
}
