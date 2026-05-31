// VERITAS-Reborn — LangGraph integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { langgraphHowTo } from "@/lib/howto-schemas";

export const metadata: Metadata = {
  title: "LangGraph + SourceScore VERITAS — ground agentic graphs with signed claims",
  description:
    "Wire SourceScore VERITAS into a LangGraph StateGraph: a retrieve node that pulls signed claims, a generate node, and a verify node that confirms the answer is backed by a signed claim. Python examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/langgraph/" },
  openGraph: {
    title: "LangGraph + SourceScore VERITAS",
    description: "Signed-claim retrieve + answer-verify nodes for grounded LangGraph agents.",
    url: "https://sourcescore.org/docs/integrations/langgraph/",
    type: "article",
  },
};

export default function LangGraphIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "LangGraph + SourceScore VERITAS: signed-claim retrieval + answer verification",
            description:
              "A LangGraph StateGraph that retrieves signed VERITAS claims, generates a cited answer, then verifies the answer is backed by a signed claim before returning it.",
            datePublished: "2026-05-30",
            dateModified: "2026-05-30",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/langgraph/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(langgraphHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "LangGraph", url: "https://sourcescore.org/docs/integrations/langgraph/" },
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
        <span className="text-zinc-700 dark:text-zinc-300">LangGraph</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Integration guide</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          LangGraph + SourceScore VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          A LangGraph <code className="font-mono">StateGraph</code> with two
          VERITAS nodes: one retrieves signed claims, the other verifies the
          generated answer is actually backed by one before you return it.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Install</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`pip install langgraph langchain-openai requests`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Graph state + the retrieve node</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          LangGraph nodes are plain functions that take the state and return a
          partial update. The retrieve node turns a question into signed VERITAS
          claims via <code className="font-mono">/search</code>, which returns a{" "}
          <code className="font-mono">results</code> array of claim summaries.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests
from typing import TypedDict, List
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

VERITAS = "https://sourcescore.org/api/v1"

class State(TypedDict):
    question: str
    claims: List[dict]
    answer: str
    grounded: bool

def veritas_retrieve(state: State) -> dict:
    r = requests.get(
        f"{VERITAS}/search",
        params={"q": state["question"], "limit": 5},
        timeout=8,
    )
    r.raise_for_status()
    # /search returns {"results": [...]} — each item is a signed claim summary.
    return {"claims": r.json().get("results", [])}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">The generate node</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Build the prompt from the retrieved claims and force a citation by{" "}
          <code className="font-mono">claim_id</code> on every fact.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`def generate(state: State) -> dict:
    context = "\\n".join(
        f"[{c['id']}] {c['statement']} (confidence {c['confidence']})"
        for c in state["claims"]
    )
    prompt = (
        "Answer using ONLY the verified claims below. Cite every fact with "
        "[claim_id]. If the claims do not cover the question, say so.\\n\\n"
        f"Claims:\\n{context}\\n\\nQuestion: {state['question']}\\nAnswer:"
    )
    answer = ChatOpenAI(model="gpt-4o-mini").invoke(prompt).content
    return {"answer": answer}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">The verify node</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          A retriever returns the closest claims; it does not confirm the
          generated answer is consistent with them. The verify node POSTs the
          answer to <code className="font-mono">/verify</code>, which returns a{" "}
          <code className="font-mono">bestMatch</code> only when a signed claim
          backs it at or above <code className="font-mono">minConfidence</code>.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`def veritas_verify(state: State) -> dict:
    r = requests.post(
        f"{VERITAS}/verify",
        json={"claim": state["answer"], "minConfidence": 0.85},
        timeout=8,
    ).json()
    # /verify returns {"matches": [...], "bestMatch": {...} | absent}.
    return {"grounded": r.get("bestMatch") is not None}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Wire the graph</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Retrieve first. If no claims match, short-circuit to{" "}
          <code className="font-mono">END</code> (don&apos;t let the model
          improvise). Otherwise generate, then verify.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`def has_claims(state: State) -> str:
    return "generate" if state["claims"] else "no_claims"

g = StateGraph(State)
g.add_node("retrieve", veritas_retrieve)
g.add_node("generate", generate)
g.add_node("verify", veritas_verify)

g.set_entry_point("retrieve")
g.add_conditional_edges("retrieve", has_claims, {"generate": "generate", "no_claims": END})
g.add_edge("generate", "verify")
g.add_edge("verify", END)

app = g.compile()

out = app.invoke({"question": "Who introduced the Transformer architecture?"})
print(out["answer"])
print("grounded:", out["grounded"])
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why a verify node</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          The two failure modes a retriever can&apos;t catch — out-of-corpus
          assertions and fabricated citations — both surface here: if the
          answer isn&apos;t backed by a signed claim with ≥2 primary sources,{" "}
          <code className="font-mono">bestMatch</code> is absent and{" "}
          <code className="font-mono">grounded</code> is false. Route on that to
          retry, hand off to a human, or label the answer unverified. Free tier
          is 1,000 calls/month, no signup; same API the other guides use.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/" className="underline">Full API reference</a></li>
          <li>• <a href="/docs/integrations/langchain/" className="underline">LangChain guide</a></li>
          <li>• <a href="/docs/integrations/llamaindex/" className="underline">LlamaIndex guide</a></li>
          <li>• <a href="/docs/integrations/haystack/" className="underline">Haystack guide</a></li>
          <li>• <a href="/claims/" className="underline">Browse the catalog</a></li>
          <li>• <a href="/pricing/" className="underline">Pricing + signup</a></li>
        </ul>
      </section>
    </article>
  );
}
