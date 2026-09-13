// VERITAS-Reborn — LangChain integration guide.
//
// Hand-built guide; canonical for any future Dev.to / LangChain-cookbook /
// medium cross-post. Aleyda Solis 10-char #4 Extractable + #7 Credible +
// #10 Transactable.
//
// Structure mirrors the LangChain docs aesthetic so the reader feels at
// home: install → import → wire into a chain → verify the response. No
// hidden cleverness — every example is copy-paste runnable.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "LangChain + SourceScore VERITAS — candidate retrieval and evidence review",
  description:
    "Wire SourceScore VERITAS into a LangChain chain for curated candidate retrieval, citations, and explicit evidence review. Python + JavaScript examples.",
  alternates: {
    canonical: "https://sourcescore.org/docs/integrations/langchain/",
  },
  openGraph: {
    title: "LangChain + SourceScore VERITAS",
    description:
      "Add curated claim-record retrieval and evidence-review links to LangChain. Python + JS quickstarts.",
    url: "https://sourcescore.org/docs/integrations/langchain/",
    type: "article",
  },
};

export default function LangChainIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "LangChain + SourceScore VERITAS: candidate retrieval and evidence review",
            description:
              "Step-by-step guide to retrieving curated SourceScore records in a LangChain chain and reviewing their cited evidence before using them.",
            datePublished: "2026-05-16",
            dateModified: "2026-05-16",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/langchain/",
            articleSection: "Integration guide",
            keywords: "langchain, llm grounding, rag, retrieval-augmented generation, hallucination, claim verification, source citation",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Integrate SourceScore VERITAS into a LangChain chain",
            description:
              "Wire curated claim-record retrieval into a LangChain RAG pipeline. Two patterns: retrieve-then-review and generate-then-find-candidates.",
            totalTime: "PT20M",
            tool: [
              { "@type": "HowToTool", name: "LangChain" },
              { "@type": "HowToTool", name: "Python or TypeScript" },
            ],
            supply: [
              { "@type": "HowToSupply", name: "SourceScore VERITAS public API (free, no signup)" },
            ],
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Install dependencies",
                text: "Install langchain + httpx (Python) or langchain + node-fetch (TypeScript).",
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Define the candidate-lookup tool",
                text: "Wrap the legacy /api/v1/verify route as a LangChain Tool with claim (string) + min_confidence (number) parameters; its result is a similarity candidate, not a verdict.",
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Register tool with the agent",
                text: "Add the candidate-lookup tool to your agent and require exact-statement plus cited-evidence review before factual assertions.",
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Test on AI/ML factual queries",
                text: "Run AI/ML factual queries. Confirm the agent retrieves a candidate, compares its statement and evidence, and cites the detail URL only when support is established.",
              },
            ],
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
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/langchain/" },
              { name: "LangChain", url: "https://sourcescore.org/docs/integrations/langchain/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/docs/" className="hover:underline">Docs</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">LangChain</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Integration guide</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          LangChain + SourceScore VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Wire curated record retrieval into your LangChain pipeline. Each
          record links to cited evidence and a stable canonical page; your
          application still decides whether that evidence supports its answer.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">When to use this</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3 leading-relaxed">
          Two patterns. Both are drop-in additions to an existing chain.
        </p>
        <ol className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 list-decimal pl-6">
          <li>
            <strong>Retrieve-then-review:</strong> fetch candidate VERITAS
            records, compare their exact statements and cited evidence with the
            question, and cite only records that actually support the answer.
          </li>
          <li>
            <strong>Generate-then-find-candidates:</strong> extract atomic
            assertions, send each to the legacy{" "}
            <code className="font-mono">/api/v1/verify</code> route, then send
            returned candidates and their evidence to review.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Install</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`# Python
pip install langchain langchain-openai requests

# JavaScript
npm install @langchain/core @langchain/openai`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 1 — Retrieve-then-cite (Python)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          The VERITAS catalog acts as a curated retriever. Search returns
          the top-N matching claims; we render them as context blocks the
          LLM is instructed to cite from.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import os, requests
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

VERITAS = "https://sourcescore.org/api/v1"

def veritas_retrieve(query: str, k: int = 5) -> str:
    """Fetch top-k VERITAS claims for a query, render as numbered context."""
    r = requests.get(f"{VERITAS}/search", params={"q": query, "limit": k}, timeout=8)
    r.raise_for_status()
    claims = r.json().get("results", [])
    if not claims:
        return "(no VERITAS claims match this query)"
    lines = []
    for i, c in enumerate(claims, 1):
        lines.append(
            f"[{i}] {c['statement']} "
            f"(claim_id={c['id']}, confidence={c['confidence']:.2f})"
        )
    return "\\n".join(lines)

prompt = ChatPromptTemplate.from_template("""You are a precise assistant. The records below are
candidates, not truth verdicts. Use one only when its exact statement supports
the answer; cite it with [claim_id]. If the records do not cover the question,
say so explicitly — do not improvise.

Candidate records:
{context}

Question: {question}

Answer (every fact must end with [claim_id]):""")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = (
    {"context": lambda x: veritas_retrieve(x["question"]),
     "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

print(chain.invoke({"question": "When was the Transformer architecture introduced?"}))
`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          Treat a missing citation as a review signal, not proof of a
          hallucination. Validate the final answer and cited evidence outside
          the model before publishing it.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 2 — Generate-then-find-candidates (JavaScript)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Useful when you want free-form output followed by a bounded-catalog
          check. Each assertion gets either a candidate link for evidence
          review or a clear no-candidate state.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const VERITAS = "https://sourcescore.org/api/v1";

async function findClaimCandidate(text) {
  const r = await fetch(\`\${VERITAS}/verify\`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ claim: text, minConfidence: 0.85 }),
  });
  return r.json();
}

// Step 1 — model generates answer
const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const prompt = ChatPromptTemplate.fromTemplate(\`
Answer the user's question with one fact per line. Be concise.

Question: {question}
\`);
const answer = await prompt.pipe(llm).invoke({
  question: "When did OpenAI release GPT-4?",
});

// Step 2 — retrieve a candidate for each line (then review its sources)
const lines = answer.content.split("\\n").filter(Boolean);
const candidates = [];
for (const line of lines) {
  const v = await findClaimCandidate(line);
  candidates.push({
    statement: line,
    matched: !!v.bestMatch,
    confidence: v.bestMatch?.confidence ?? 0,
    veritasId: v.bestMatch?.id,
    sourceUrl: v.bestMatch ? \`https://sourcescore.org/claims/\${v.bestMatch.id}/\` : null,
  });
}

// Step 3 — render candidate links; a match is not a truth verdict
for (const r of candidates) {
  const badge = r.matched ? \`🔎 candidate [\${r.veritasId}] — review sources\` : "⚠️ no catalog candidate";
  console.log(\`\${r.statement.trim()} \${badge}\`);
}
`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          UI suggestion: render a candidate link only as a prompt to inspect
          its primary sources, never as a factual-verification badge. Mark
          absent matches clearly and send disputed results to human review.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 3 — Refetch the canonical record (defensive)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          High-stakes deployments should refetch the canonical HTTPS record and
          compare the claim content and cited evidence before using it. The HMAC
          tag is not publicly independently verifiable.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests

VERITAS = "https://sourcescore.org/api/v1"
env = requests.get(f"{VERITAS}/claims/<claim_id>.json").json()
canonical = requests.get(f"{VERITAS}/claims/{env['claim']['id']}.json").json()
assert canonical["claim"] == env["claim"], "Canonical record changed — inspect cited evidence"
print("canonical record matches; inspect cited evidence for your use case")
`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          No public or enterprise shared secret is available. Refetching checks
          the current canonical record, not a cryptographic proof of origin.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Choosing a pattern</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">Use case</th>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">Pattern</th>
                <th className="text-left p-3 border-b border-zinc-200 dark:border-zinc-800">Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Educational Q&A bot</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Retrieve-then-cite</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">One catalog request + LLM time; benchmark locally</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Search auto-complete</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Retrieve only (skip LLM)</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">One catalog request; benchmark locally</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Internal research assistant</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Generate-then-find-candidates</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">LLM + N catalog requests</td>
              </tr>
              <tr>
                <td className="p-3">High-stakes citation badge</td>
                <td className="p-3">Candidate retrieval + independent evidence review</td>
                <td className="p-3">LLM + N catalog requests + review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Cost model</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          The public VERITAS API is free, requires no account or key, and has no
          account-level meter. Search and verify are separate network requests;
          cache stable claim records and measure traffic in your own stack.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          Higher-volume prices on <a href="/pricing/" className="underline">the pricing page</a>{" "}
          are proposals used to test demand, not plans available for purchase.
        </p>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">What VERITAS is not</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          We are deliberately not a generic fact-checker. The Day 1
          catalog (384 claims today) covers AI/ML research — model releases,
          foundational papers, organizations, datasets. If your chain
          asks about &quot;the capital of France&quot; we will return no
          matches and your code should fall through to whatever
          retrieval you'd use anyway.
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Catalog expansion is gated by the published methodology (cited
          evidence, source counts, and no unstable performance-comparison
          claims). No date is promised for additional verticals.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>
            • <a href="/docs/" className="underline">Full API reference</a> — every endpoint with curl + JS + Python examples
          </li>
          <li>
            • <a href="/claims/" className="underline">Browse the catalog</a> — 384 reviewed AI/ML claim records
          </li>
          <li>
            • <a href="/api/v1/openapi.json" className="underline">OpenAPI spec</a> — generate clients in any language
          </li>
          <li>
            • <a href="/pricing/" className="underline">Pricing</a> — free API and proposed higher-volume tiers
          </li>
        </ul>
      </section>
    </article>
  );
}
