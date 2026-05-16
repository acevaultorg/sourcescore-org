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
  title: "LangChain + SourceScore VERITAS — ground LLM responses with signed claims",
  description:
    "Wire SourceScore VERITAS into a LangChain chain to verify model-generated claims against signed, sourced facts. Drop-in retriever + verification step. Python + JavaScript examples.",
  alternates: {
    canonical: "https://sourcescore.org/docs/integrations/langchain/",
  },
  openGraph: {
    title: "LangChain + SourceScore VERITAS",
    description:
      "Ground LangChain LLM responses with signed, sourced claims from the VERITAS catalog. Python + JS quickstarts.",
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
            headline: "LangChain + SourceScore VERITAS: ground LLM responses with signed claims",
            description:
              "Step-by-step guide to wiring SourceScore VERITAS verified-claim retrieval and verification into a LangChain chain. Reduces LLM hallucination on AI/ML domain queries by grounding responses in signed, sourced facts.",
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
          Wire signed-claim retrieval into your LangChain pipeline. Verify
          model-generated assertions against a catalog of facts that ship
          with HMAC-SHA256 signatures and ≥2 primary sources each.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">When to use this</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3 leading-relaxed">
          Two patterns. Both are drop-in additions to an existing chain.
        </p>
        <ol className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300 list-decimal pl-6">
          <li>
            <strong>Retrieve-then-cite:</strong> fetch the most relevant
            VERITAS claims for the user's query, render them as context,
            and instruct the model to cite the claim id with every fact it
            asserts.
          </li>
          <li>
            <strong>Generate-then-verify:</strong> let the model answer
            freely, then post-process the response: extract atomic claims,
            send each to <code className="font-mono">/api/v1/verify</code>,
            attach a confidence + citation badge to each, flag unmatched
            assertions.
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
    claims = r.json().get("matches", [])
    if not claims:
        return "(no VERITAS claims match this query)"
    lines = []
    for i, c in enumerate(claims, 1):
        lines.append(
            f"[{i}] {c['statement']} "
            f"(claim_id={c['id']}, confidence={c['confidence']:.2f}, "
            f"sources={c['sourceCount']})"
        )
    return "\\n".join(lines)

prompt = ChatPromptTemplate.from_template("""You are a precise assistant. Answer the user's question
using ONLY the verified claims below. Cite every fact with [claim_id]. If the
claims do not cover the question, say so explicitly — do not improvise.

Verified claims:
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
          The model now MUST attach a claim_id to every assertion. Any
          unattached statement is a hallucination signal — surface it as a
          UI warning or auto-strip it from the output.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 2 — Generate-then-verify (JavaScript)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Useful when you want the model's free-form output but need a
          confidence layer. Each assertion gets a verification badge from
          VERITAS before the user sees the final response.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const VERITAS = "https://sourcescore.org/api/v1";

async function verifyClaim(text) {
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

// Step 2 — verify each line
const lines = answer.content.split("\\n").filter(Boolean);
const verified = [];
for (const line of lines) {
  const v = await verifyClaim(line);
  verified.push({
    statement: line,
    matched: !!v.bestMatch,
    confidence: v.bestMatch?.confidence ?? 0,
    veritasId: v.bestMatch?.id,
    sourceUrl: v.bestMatch ? \`https://sourcescore.org/claims/\${v.bestMatch.id}/\` : null,
  });
}

// Step 3 — render with badges
for (const r of verified) {
  const badge = r.matched ? \`✅ [\${r.veritasId}]\` : "⚠️ unverified";
  console.log(\`\${r.statement.trim()} \${badge}\`);
}
`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          UI suggestion: render verified lines in the normal answer style,
          unverified lines with a yellow underline + tooltip linking to a
          "submit verification request" page. Operationalizes
          hallucination-discovery as user feedback.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 3 — Verify the signature (defensive)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          High-stakes deployments should re-verify the HMAC-SHA256
          signature locally before trusting a claim envelope. The signing
          public-key-equivalent shipped with the response so you can
          re-compute and compare.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import os, hmac, hashlib, json, requests

SECRET = os.environ["SOURCESCORE_SIGNING_SECRET"]  # given on Enterprise tier
VERITAS = "https://sourcescore.org/api/v1"

def verify_envelope(envelope: dict) -> bool:
    """Re-compute HMAC-SHA256 over canonical-JSON of the claim + signature
    metadata, compare constant-time to envelope.signature.value."""
    claim = envelope["claim"]
    sig   = envelope["signature"]
    # canonical: sorted keys, ASCII-safe, no extra whitespace
    payload = json.dumps(
        {**claim, "signedAt": sig["signedAt"], "signedBy": sig["signedBy"]},
        sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode()
    expected = hmac.new(SECRET.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig["value"])

env = requests.get(f"{VERITAS}/claims/<claim_id>.json").json()
assert verify_envelope(env), "VERITAS signature mismatch — do not trust"
print("ok — claim is genuine + unmodified")
`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          Free + Indie tiers can re-verify against the public catalog JSON
          which has the same envelope shape. The shared secret is only
          required when you need an additional signature your own systems
          generate (Enterprise tier feature).
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
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">~150ms search + LLM time</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Search auto-complete</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Retrieve only (skip LLM)</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">&lt;100ms</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Internal research assistant</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">Generate-then-verify</td>
                <td className="p-3 border-b border-zinc-100 dark:border-zinc-900">LLM + N × ~80ms verify</td>
              </tr>
              <tr>
                <td className="p-3">High-stakes citation badge</td>
                <td className="p-3">Generate-then-verify + signature</td>
                <td className="p-3">LLM + N × ~80ms verify + signature compute (~1ms)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Cost model</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Each VERITAS call counts as one claim against your monthly
          quota. Search responses with N matches still count as ONE call,
          regardless of N. Verify counts as ONE call per request.
        </p>
        <ul className="text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-6 space-y-1">
          <li><strong>Free:</strong> 1,000 calls/month — sufficient for prototyping</li>
          <li><strong>Indie €19/mo:</strong> 25,000 calls/month — solo apps + small teams</li>
          <li><strong>Startup €99/mo:</strong> 250,000 calls/month — Series-A class</li>
          <li><strong>Scale €499/mo:</strong> 2,500,000 calls/month — high-throughput</li>
        </ul>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          See <a href="/pricing/" className="underline">pricing</a> for full tier comparison.
        </p>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">What VERITAS is not</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          We are deliberately not a generic fact-checker. The Day 1
          catalog (102 claims today) covers AI/ML research — model releases,
          foundational papers, organizations, datasets. If your chain
          asks about &quot;the capital of France&quot; we will return no
          matches and your code should fall through to whatever
          retrieval you'd use anyway.
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Catalog expansion is gated by our verification methodology
          (≥2 primary sources, verbatim excerpts, no performance-
          comparison claims). New verticals (cybersecurity, data
          engineering, scientific computing) ship Y2.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>
            • <a href="/docs/" className="underline">Full API reference</a> — every endpoint with curl + JS + Python examples
          </li>
          <li>
            • <a href="/claims/" className="underline">Browse the catalog</a> — 102 verified AI/ML claims
          </li>
          <li>
            • <a href="/api/v1/openapi.json" className="underline">OpenAPI spec</a> — generate clients in any language
          </li>
          <li>
            • <a href="/pricing/" className="underline">Pricing + signup</a> — get an API key
          </li>
        </ul>
      </section>
    </article>
  );
}
