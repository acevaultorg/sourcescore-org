// VERITAS-Reborn — 5-minute quickstart.
//
// Single-screen path from "I'm curious" to "I've made my first API call."
// Aleyda Solis 10-char #10 Transactable + activation-stage UX. No signup
// gate; free tier is 1k calls/month with no key required for read-only
// catalog access. Keep this page short — every extra paragraph is a
// drop-off opportunity.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Quickstart — SourceScore VERITAS",
  description:
    "5-minute path from zero to your first verified-claim API call. curl + JavaScript + Python in three blocks. No signup required for the free tier.",
  alternates: { canonical: "https://sourcescore.org/quickstart/" },
  openGraph: {
    title: "VERITAS Quickstart — first API call in 5 min",
    description: "Verify your first claim against signed, sourced AI/ML facts — curl, JS, Python.",
    url: "https://sourcescore.org/quickstart/",
    type: "article",
  },
};

export default function QuickstartPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Quickstart", url: "https://sourcescore.org/quickstart/" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "SourceScore VERITAS quickstart — first verified-claim API call in 5 minutes",
            description:
              "Three-step path from zero to a working VERITAS API call. No signup required for read-only catalog access.",
            totalTime: "PT5M",
            step: [
              {
                "@type": "HowToStep",
                name: "Verify a free-form claim",
                text:
                  "POST your claim to /api/v1/verify and read the bestMatch field. Returns confidence + claim id + canonical citation URL.",
                url: "https://sourcescore.org/quickstart/#step-1",
              },
              {
                "@type": "HowToStep",
                name: "Browse the catalog",
                text:
                  "GET /api/v1/claims.json for the full catalog summary or /api/v1/search?q=<query> for keyword search.",
                url: "https://sourcescore.org/quickstart/#step-2",
              },
              {
                "@type": "HowToStep",
                name: "Fetch a signed envelope",
                text:
                  "GET /api/v1/claims/<id>.json for the full HMAC-signed envelope with verbatim source excerpts.",
                url: "https://sourcescore.org/quickstart/#step-3",
              },
            ],
          }),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Quickstart</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          5 minutes · no signup required
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Verify your first claim
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Three calls. Pick the language you're already in. Free tier is
          1,000 verifications per month — no key required for read-only
          catalog access.
        </p>
      </header>

      <section id="step-1" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          Step 1 — Verify a claim
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Send a free-form statement; get back the best matching signed
          claim with confidence + canonical citation URL.
        </p>

        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2 mt-4">
          curl
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`curl -X POST https://sourcescore.org/api/v1/verify \\
  -H "content-type: application/json" \\
  -d '{"claim":"The Transformer architecture was introduced in 2017."}'`}</code></pre>

        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2 mt-4">
          JavaScript / TypeScript
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`const r = await fetch("https://sourcescore.org/api/v1/verify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    claim: "The Transformer architecture was introduced in 2017.",
  }),
});
const { bestMatch } = await r.json();
console.log(bestMatch?.statement, bestMatch?.confidence);
// → "Transformer architecture introduced_in_paper: Attention Is All You Need (Vaswani et al., 2017)." 1.0`}</code></pre>

        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2 mt-4">
          Python
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests
r = requests.post(
    "https://sourcescore.org/api/v1/verify",
    json={"claim": "The Transformer architecture was introduced in 2017."},
)
best = r.json().get("bestMatch")
if best:
    print(best["statement"], best["confidence"])
    print(f"Citation: https://sourcescore.org/claims/{best['id']}/")`}</code></pre>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          <strong>What you get:</strong> a typed bestMatch object with the
          full statement, confidence (0-1), claim id, and a canonical URL
          you can render as a citation badge in your UI.
        </p>
      </section>

      <section id="step-2" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          Step 2 — Search or browse
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          When the user's intent is browse-mode rather than verify-mode,
          use search to surface the top-K relevant claims.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`# Search
curl "https://sourcescore.org/api/v1/search?q=context+window&limit=5"

# Full catalog (one call, no pagination at v0)
curl https://sourcescore.org/api/v1/claims.json | jq '.claims | length'
# → 100`}</code></pre>
      </section>

      <section id="step-3" className="mb-10">
        <h2 className="text-xl font-semibold mb-3">
          Step 3 — Fetch a signed envelope
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          When you need the full provenance (verbatim source excerpts,
          HMAC-SHA256 signature, methodology version) for a specific
          claim, fetch the envelope.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`curl https://sourcescore.org/api/v1/claims/<claim_id>.json`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          Replace <code className="font-mono">&lt;claim_id&gt;</code> with
          the id returned from step 1 or step 2. The envelope ships with{" "}
          <code className="font-mono">signature</code> = HMAC-SHA256 over
          canonical-JSON of the claim fields + signing metadata. See{" "}
          <a href="/docs/integrations/langchain/#pattern-3" className="underline">
            signature verification
          </a>{" "}
          for the local re-compute pattern.
        </p>
      </section>

      <section className="mb-10 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-2">That's it.</h2>
        <p className="text-sm leading-relaxed">
          You just made a verified-claim API call. Wire this into your
          LangChain, LlamaIndex, or tool-call chain via the{" "}
          <a href="/docs/integrations/" className="underline font-semibold">
            integration guides
          </a>
          . Or pin a specific high-confidence claim into your prompt as
          context. The free tier covers 1,000 calls per month — when you
          outgrow it,{" "}
          <a href="/pricing/" className="underline font-semibold">
            tier up
          </a>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">What now?</h2>
        <ul className="text-sm space-y-2">
          <li>
            • <a href="/docs/" className="underline">Full API reference</a> — every endpoint with errors + headers
          </li>
          <li>
            • <a href="/docs/integrations/" className="underline">Framework integrations</a> — LangChain, LlamaIndex, OpenAI tool-calls
          </li>
          <li>
            • <a href="/claims/" className="underline">Browse the catalog</a> — 156 verified AI/ML claims
          </li>
          <li>
            • <a href="/methodology/" className="underline">How we verify</a> — ≥2 primary sources, verbatim excerpts, no performance comparisons
          </li>
          <li>
            • <a href="/api/v1/openapi.json" className="underline">OpenAPI spec</a> — generate clients in any language
          </li>
          <li>
            • <a href="/pricing/" className="underline">Pricing</a> — Free / Indie €19 / Startup €99 / Scale €499
          </li>
        </ul>
      </section>
    </main>
  );
}
