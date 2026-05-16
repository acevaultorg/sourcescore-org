// VERITAS-Reborn — Vercel AI SDK integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Vercel AI SDK + SourceScore VERITAS — verified-claim grounding in Next.js",
  description:
    "Add SourceScore VERITAS to a Vercel AI SDK chain in Next.js. streamText + tool function-call pattern, plus a post-stream verification step. TypeScript examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/vercel-ai-sdk/" },
  openGraph: {
    title: "Vercel AI SDK + SourceScore VERITAS",
    description: "Verified-claim grounding for Vercel AI SDK + Next.js apps.",
    url: "https://sourcescore.org/docs/integrations/vercel-ai-sdk/",
    type: "article",
  },
};

export default function VercelAISDKIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Vercel AI SDK + SourceScore VERITAS: verified-claim grounding in Next.js",
            description:
              "Drop SourceScore VERITAS into a Vercel AI SDK chain via the tool() helper. The model auto-invokes verify_claim / search_claims when it needs grounded facts. Plus a post-stream verification pattern for free-form completions.",
            datePublished: "2026-05-16",
            dateModified: "2026-05-16",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/vercel-ai-sdk/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "Vercel AI SDK", url: "https://sourcescore.org/docs/integrations/vercel-ai-sdk/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/docs/" className="hover:underline">Docs</a>
        <span className="mx-2">›</span>
        <a href="/docs/integrations/" className="hover:underline">Integrations</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Vercel AI SDK</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Integration guide</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          Vercel AI SDK + VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Add signed-claim verification to a Next.js + AI SDK chat or
          completion. Two patterns: tool function-calling for model-
          initiated lookup, and post-stream verification for free-form
          completions.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Install</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`pnpm add ai @ai-sdk/openai zod`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 1 — tool() function-calling</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Define two tools and let the model invoke them. The AI SDK
          handles the call/result loop transparently.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`// app/api/chat/route.ts
import { streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const VERITAS = "https://sourcescore.org/api/v1";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "Use search_claims or verify_claim to ground every AI/ML factual " +
      "assertion before answering. Cite [claim_id] inline with every grounded fact.",
    messages,
    tools: {
      search_claims: tool({
        description: "Search the SourceScore VERITAS catalog of verified AI/ML claims.",
        parameters: z.object({
          query: z.string(),
          limit: z.number().int().min(1).max(20).default(5),
        }),
        execute: async ({ query, limit }) => {
          const r = await fetch(\`\${VERITAS}/search?q=\${encodeURIComponent(query)}&limit=\${limit}\`);
          return await r.json();
        },
      }),
      verify_claim: tool({
        description: "Verify a specific assertion against the VERITAS catalog. Returns confidence + canonical citation if matched.",
        parameters: z.object({
          statement: z.string(),
          min_confidence: z.number().min(0).max(1).default(0.85),
        }),
        execute: async ({ statement, min_confidence }) => {
          const r = await fetch(\`\${VERITAS}/verify\`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ claim: statement, minConfidence: min_confidence }),
          });
          return await r.json();
        },
      }),
    },
    maxSteps: 4, // allow up to 4 tool-call iterations
  });

  return result.toDataStreamResponse();
}
`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          Front-end uses <code className="font-mono">useChat()</code> as
          normal. Tool calls + results stream alongside the text — the AI
          SDK&apos;s <code className="font-mono">data</code> protocol
          handles surfacing them to UI for citation badges.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 2 — Post-stream verification</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          When you want free-form generation but a confidence layer, run
          verification AFTER the stream completes. Renders unverified
          assertions with a warning chip in your UI.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`// lib/verify.ts
export async function verifyLines(text: string) {
  const lines = text.split("\\n").map(s => s.trim()).filter(Boolean);
  const VERITAS = "https://sourcescore.org/api/v1";

  return Promise.all(lines.map(async line => {
    const r = await fetch(\`\${VERITAS}/verify\`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ claim: line, minConfidence: 0.85 }),
    });
    const { bestMatch } = await r.json();
    return {
      statement: line,
      verified: !!bestMatch,
      confidence: bestMatch?.confidence ?? 0,
      claimId: bestMatch?.id ?? null,
      url: bestMatch ? \`https://sourcescore.org/claims/\${bestMatch.id}/\` : null,
    };
  }));
}

// app/page.tsx (client component)
"use client";
import { useState } from "react";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export default function Page() {
  const [out, setOut] = useState<Array<Awaited<ReturnType<typeof verifyLines>>[number]>>([]);

  async function ask(question: string) {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: \`Answer with one fact per line:\\n\${question}\`,
      temperature: 0,
    });
    setOut(await verifyLines(text));
  }

  return (
    <div>
      <button onClick={() => ask("When was the Transformer introduced?")}>Ask</button>
      <ul>
        {out.map((r, i) => (
          <li key={i}>
            {r.statement}{" "}
            {r.verified
              ? <a href={r.url!}>✅ [{r.claimId}] ({r.confidence.toFixed(2)})</a>
              : <span className="text-amber-600">⚠️ unverified</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Edge runtime considerations</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          The fetch-based VERITAS client works in both Node and Edge
          runtimes — no native dependencies. For Vercel Edge Functions:
        </p>
        <ul className="text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-6 space-y-1">
          <li>Set <code className="font-mono">export const runtime = &quot;edge&quot;</code> in your route.</li>
          <li>VERITAS p95 latency ~80ms — comfortable within Edge function timeouts.</li>
          <li>No SDK import needed — VERITAS is plain HTTP.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">UI patterns</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Render verified claims with a clickable badge that opens the
          canonical SourceScore page in a new tab. Render unverified
          claims with an amber chip and a tooltip explaining the catalog
          scope. Two CSS patterns shipped in your design system:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`<span className="verified-badge">
  ✓ [{claimId}] {confidence.toFixed(2)}
</span>

<span className="unverified-chip" title="Outside VERITAS catalog scope">
  ⚠ unverified
</span>`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          The verified badge should be a link to{" "}
          <code className="font-mono">https://sourcescore.org/claims/&lt;id&gt;/</code>{" "}
          for full provenance.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/" className="underline">Full API reference</a></li>
          <li>• <a href="/docs/integrations/langchain/" className="underline">LangChain guide</a></li>
          <li>• <a href="/docs/integrations/llamaindex/" className="underline">LlamaIndex guide</a></li>
          <li>• <a href="/docs/integrations/openai-tools/" className="underline">OpenAI tool-calls (vanilla SDK)</a></li>
          <li>• <a href="/quickstart/" className="underline">Quickstart</a></li>
        </ul>
      </section>
    </article>
  );
}
