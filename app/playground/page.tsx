// /playground/ — interactive VERITAS demo (client-side JS, no signup).
//
// Activation-stage UX: dev arrives via search → types a claim → sees it
// verified in <1s → understands the product without writing code.
// Highest-leverage activation lever per AAERA / Aleyda 10-char #10
// Transactable.
//
// Architecture: static Next.js page + client component that calls
// /api/v1/verify + /api/v1/search via fetch from the browser. No
// backend; works on CF Pages static hosting.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { Playground } from "./playground-client";

export const metadata: Metadata = {
  title: "Playground — SourceScore VERITAS",
  description:
    "Interactive demo: type a claim, see VERITAS verify it against the signed catalog in real time. No signup, no key, runs in your browser.",
  alternates: { canonical: "https://sourcescore.org/playground/" },
  openGraph: {
    title: "VERITAS Playground — interactive demo",
    description: "Type a claim, see it verified. No signup, no key.",
    url: "https://sourcescore.org/playground/",
    type: "website",
  },
};

export default function PlaygroundPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Playground", url: "https://sourcescore.org/playground/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Playground</span>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Interactive demo · no signup
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          VERITAS Playground
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Type a claim. See VERITAS verify it against the signed catalog
          in your browser. The API call you&apos;d make from your code —
          live, with the request shape and the response shown side by
          side.
        </p>
      </header>

      <Playground />

      <section className="mt-14 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
        <p>
          This page calls{" "}
          <code className="font-mono">/api/v1/verify</code> directly from
          your browser. No data leaves SourceScore — same endpoint, same
          headers, same response shape your code will see.
        </p>
        <p>
          Ready to wire it into your app? See the{" "}
          <a href="/quickstart/" className="underline">5-minute quickstart</a>
          {" "}for curl + JS + Python, or the{" "}
          <a href="/docs/integrations/" className="underline">
            framework integration guides
          </a>{" "}
          for LangChain · LlamaIndex · OpenAI tool-calls · Vercel AI SDK.
        </p>
      </section>
    </main>
  );
}
