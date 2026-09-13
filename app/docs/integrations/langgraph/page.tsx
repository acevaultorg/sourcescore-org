// VERITAS-Reborn — LangGraph integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { langgraphHowTo } from "@/lib/howto-schemas";

export const metadata: Metadata = {
  title: "LangGraph + SourceScore VERITAS — candidate retrieval and evidence review",
  description:
    "Wire SourceScore VERITAS into a LangGraph StateGraph with catalog retrieval, generation, and explicit evidence-review states. Python examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/langgraph/" },
  openGraph: {
    title: "LangGraph + SourceScore VERITAS",
    description: "Candidate-record retrieval and evidence-review nodes for LangGraph agents.",
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
            headline: "LangGraph + SourceScore VERITAS: candidate retrieval and evidence review",
            description:
              "A LangGraph StateGraph that retrieves curated records, generates a draft, then exposes a candidate for an explicit evidence or entailment decision.",
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
          VERITAS nodes: one retrieves curated records and another finds a
          candidate for review. Similarity alone never marks the answer grounded.
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
          partial update. The retrieve node turns a question into curated VERITAS
          records via <code className="font-mono">/search</code>, which returns a{" "}
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
    candidate_found: bool

def veritas_retrieve(state: State) -> dict:
    r = requests.get(
        f"{VERITAS}/search",
        params={"q": state["question"], "limit": 5},
        timeout=8,
    )
    r.raise_for_status()
    # /search returns {"results": [...]} — each item is a catalog summary.
    return {"claims": r.json().get("results", [])}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">The generate node</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Build the prompt from retrieved records and tell the model to cite one
          only after its exact statement supports the answer.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`def generate(state: State) -> dict:
    context = "\\n".join(
        f"[{c['id']}] {c['statement']} (confidence {c['confidence']})"
        for c in state["claims"]
    )
    prompt = (
        "The records below are candidates, not truth verdicts. Use a record only "
        "when its exact statement supports the answer; otherwise say the supplied "
        "evidence does not cover the question.\\n\\n"
        f"Candidate records:\\n{context}\\n\\nQuestion: {state['question']}\\nAnswer:"
    )
    answer = ChatOpenAI(model="gpt-4o-mini").invoke(prompt).content
    return {"answer": answer}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">The candidate-lookup node</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          A retriever returns the closest claims; it does not confirm the
          generated answer is consistent with them. This node POSTs the
          answer to <code className="font-mono">/verify</code>, which returns a{" "}
          <code className="font-mono">bestMatch</code> when it finds a similar
          catalog record after method-specific retrieval and legacy record-confidence
          gates. That is still not an entailment or truth verdict.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`def find_answer_candidate(state: State) -> dict:
    r = requests.post(
        f"{VERITAS}/verify",
        json={"claim": state["answer"], "minConfidence": 0.85},
        timeout=8,
    ).json()
    # /verify returns {"matches": [...], "bestMatch": {...} | absent}.
    return {"candidate_found": r.get("bestMatch") is not None}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Wire the graph</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Retrieve first. If no claims match, short-circuit to{" "}
          <code className="font-mono">END</code> (don&apos;t let the model
          improvise). Otherwise generate, then expose the nearest catalog
          candidate for an explicit evidence-review step.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`def has_claims(state: State) -> str:
    return "generate" if state["claims"] else "no_claims"

g = StateGraph(State)
g.add_node("retrieve", veritas_retrieve)
g.add_node("generate", generate)
g.add_node("candidate_lookup", find_answer_candidate)

g.set_entry_point("retrieve")
g.add_conditional_edges("retrieve", has_claims, {"generate": "generate", "no_claims": END})
g.add_edge("generate", "candidate_lookup")
g.add_edge("candidate_lookup", END)

app = g.compile()

out = app.invoke({"question": "Who introduced the Transformer architecture?"})
print(out["answer"])
print("candidate found:", out["candidate_found"])
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why expose a candidate state</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          The two failure modes a retriever can&apos;t catch — out-of-corpus
          assertions and fabricated citations — both can be investigated here:
          if no similar catalog candidate is returned,{" "}
          <code className="font-mono">bestMatch</code> is absent and{" "}
          <code className="font-mono">candidate_found</code> is false. When a
          candidate exists, compare its primary sources before asserting truth;
          otherwise retry, hand off to a human, or label the answer as lacking a
          catalog match. The public
          API is free with no account, key, or signup.
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
