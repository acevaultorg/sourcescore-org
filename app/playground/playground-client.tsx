// Client component for the VERITAS Playground.
//
// Pure browser-side: fetch → POST /api/v1/verify → render. No server
// route, no SDK install, no auth. Mirrors what dev code will do.

"use client";

import { useState } from "react";

type Match = {
  id: string;
  statement: string;
  confidence: number;
  matchScore?: number;
  rationale?: string;
  sources?: Array<{ url: string; title: string; publisher: string; type?: string }>;
  tags?: string[];
};

type VerifyResponse = {
  query: string;
  bestMatch: Match | null;
  matches: Match[];
  minConfidence: number;
};

const SAMPLES = [
  "The Transformer architecture was introduced in 2017 by Vaswani et al.",
  "GPT-4 was released by OpenAI on 2023-03-14.",
  "Anthropic was founded in 2021.",
  "Llama 2 was released by Meta in July 2023.",
  "Stable Diffusion was released in August 2022 by Stability AI.",
  "FlashAttention is an IO-aware exact attention algorithm.",
];

export function Playground() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function verify(text: string) {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await fetch("/api/v1/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ claim: text, minConfidence: 0.8 }),
      });
      if (!r.ok) {
        setError(`HTTP ${r.status}`);
        return;
      }
      setResult(await r.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    verify(claim);
  }

  function pickSample(s: string) {
    setClaim(s);
    verify(s);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="claim" className="block text-sm font-medium mb-2">
          Claim to verify
        </label>
        <textarea
          id="claim"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Type a factual assertion about AI/ML…"
          rows={3}
          className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading || !claim.trim()}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded font-medium text-sm hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Verify claim"}
          </button>
          <span className="text-xs text-zinc-500">
            POST /api/v1/verify · ~80 ms p95 · no auth, no quota for read-only
          </span>
        </div>
      </form>

      <div className="mb-6 text-xs text-zinc-500">
        Or try one:
        <div className="mt-2 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => pickSample(s)}
              className="text-left px-2 py-1 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs leading-tight max-w-xs"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-md text-sm">
          <strong>Request error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Best match</h2>
            {result.bestMatch ? (
              <div className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-md p-4">
                <p className="font-medium mb-2">
                  ✅ {result.bestMatch.statement}
                </p>
                <p className="text-xs text-zinc-500 mb-3">
                  <span className="font-mono">{result.bestMatch.id}</span>
                  {" · "}
                  {Math.round(result.bestMatch.confidence * 100)}% confidence
                  {result.bestMatch.matchScore != null && (
                    <> · match score {result.bestMatch.matchScore.toFixed(2)}</>
                  )}
                </p>
                <a
                  href={`/claims/${result.bestMatch.id}/`}
                  className="text-sm underline"
                >
                  Open canonical claim page →
                </a>
                {result.bestMatch.sources && result.bestMatch.sources.length > 0 && (
                  <ol className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pl-4 list-decimal">
                    {result.bestMatch.sources.slice(0, 3).map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {s.title}
                        </a>
                        {" — "}
                        {s.publisher}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ) : (
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-md p-4 text-sm">
                <p className="font-medium mb-1">
                  ⚠️ No high-confidence match above {Math.round(result.minConfidence * 100)}%
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Either this assertion is outside the AI/ML catalog
                  scope, or it&apos;s phrased in a way that doesn&apos;t
                  match any verified claim. Try rephrasing, or check
                  the top-N matches below.
                </p>
              </div>
            )}
          </div>

          {result.matches && result.matches.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Top matches ({result.matches.length})
              </h2>
              <ol className="space-y-2 pl-0 list-none">
                {result.matches.map((m, i) => (
                  <li
                    key={m.id}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-md p-3 text-sm"
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-zinc-400 font-mono text-xs">{i + 1}.</span>
                      <a
                        href={`/claims/${m.id}/`}
                        className="font-medium hover:underline"
                      >
                        {m.statement}
                      </a>
                    </div>
                    <p className="text-xs text-zinc-500 pl-5">
                      <span className="font-mono">{m.id}</span> ·{" "}
                      {Math.round(m.confidence * 100)}% confidence
                      {m.matchScore != null && (
                        <> · match {m.matchScore.toFixed(2)}</>
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <details className="text-sm">
            <summary className="cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
              View raw JSON response
            </summary>
            <pre className="mt-3 bg-zinc-900 text-zinc-100 rounded-md p-4 text-xs overflow-x-auto">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          </details>

          <div className="text-sm">
            <h2 className="text-lg font-semibold mb-3">
              The equivalent code
            </h2>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">curl</p>
            <pre className="bg-zinc-900 text-zinc-100 rounded-md p-3 text-xs overflow-x-auto mb-3"><code>{`curl -X POST https://sourcescore.org/api/v1/verify \\
  -H "content-type: application/json" \\
  -d '${JSON.stringify({ claim: result.query, minConfidence: result.minConfidence })}'`}</code></pre>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">JavaScript</p>
            <pre className="bg-zinc-900 text-zinc-100 rounded-md p-3 text-xs overflow-x-auto mb-3"><code>{`const r = await fetch("https://sourcescore.org/api/v1/verify", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(${JSON.stringify({ claim: result.query, minConfidence: result.minConfidence }, null, 2)}),
});
const { bestMatch } = await r.json();`}</code></pre>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Python</p>
            <pre className="bg-zinc-900 text-zinc-100 rounded-md p-3 text-xs overflow-x-auto"><code>{`import requests
r = requests.post(
    "https://sourcescore.org/api/v1/verify",
    json=${JSON.stringify({ claim: result.query, minConfidence: result.minConfidence }, null, 4).replace(/"/g, "'")},
)
best = r.json().get("bestMatch")`}</code></pre>
          </div>
        </div>
      )}
    </div>
  );
}
