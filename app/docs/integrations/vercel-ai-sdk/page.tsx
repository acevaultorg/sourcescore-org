// VERITAS-Reborn — Vercel AI SDK integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { vercelAiSdkHowTo } from "@/lib/howto-schemas";
export const metadata: Metadata = {
  title: "Vercel AI SDK + SourceScore VERITAS — candidate retrieval in Next.js",
  description:
    "Add SourceScore VERITAS to a Vercel AI SDK chain in Next.js for candidate-record lookup and explicit evidence review. TypeScript examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/vercel-ai-sdk/" },
  openGraph: {
    title: "Vercel AI SDK + SourceScore VERITAS",
    description: "Candidate-record retrieval for Vercel AI SDK + Next.js apps.",
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
            headline: "Vercel AI SDK + SourceScore VERITAS: candidate retrieval in Next.js",
            description:
              "Use SourceScore VERITAS tools to retrieve possible catalog evidence, then review exact statements and cited sources before using them.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vercelAiSdkHowTo) }}
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
          Add candidate-record retrieval to a Next.js + AI SDK chat or
          completion. Two patterns: model-initiated lookup and post-stream
          candidate retrieval, each followed by evidence review.
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
      "Use search_claims or verify_claim to retrieve relevant catalog records. " +
      "A bestMatch is similarity, not proof: compare primary sources before asserting a fact and cite [claim_id].",
    messages,
    tools: {
      search_claims: tool({
        description: "Search the SourceScore VERITAS catalog of reviewed AI/ML claim records.",
        parameters: z.object({
          query: z.string(),
          limit: z.number().int().min(1).max(20).default(5),
        }),
        execute: async ({ query, limit }) => {
          const r = await fetch(\`\${VERITAS}/search?q=\${encodeURIComponent(query)}&limit=\${limit}\`);
          return await r.json();
        },
      }),
      find_claim_candidate: tool({
        description: "Retrieve a similar catalog record. Returns confidence + a citation to review, not a truth verdict.",
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
        <h2 className="text-xl font-semibold mb-3">Pattern 2 — Post-stream candidate retrieval</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          When you want free-form generation, retrieve candidate records
          after the stream completes. A match should link to evidence for
          review, not be rendered as verification.
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
      candidateFound: !!bestMatch,
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
            {r.candidateFound
              ? <a href={r.url!}>🔎 candidate [{r.claimId}] ({r.confidence.toFixed(2)}) — review sources</a>
              : <span className="text-amber-600">⚠️ no catalog candidate</span>}
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
          <li>Measure VERITAS latency from your own deployment region and set an explicit timeout.</li>
          <li>No SDK import needed — VERITAS is plain HTTP.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">UI patterns</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Render candidate records with a clickable link to their evidence.
          Render absent matches with an amber chip. Neither state establishes
          factual correctness; compare independent primary evidence first.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`<span className="candidate-badge">
  🔎 [{claimId}] {confidence.toFixed(2)} — review sources
</span>

<span className="no-candidate-chip" title="No similar catalog record returned">
  ⚠ no catalog candidate
</span>`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          The candidate badge should be a link to{" "}
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
