// VERITAS-Reborn — Haystack 2.x integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { haystackHowTo } from "@/lib/howto-schemas";

export const metadata: Metadata = {
  title: "Haystack + SourceScore VERITAS — retrieve candidate claim records",
  description:
    "Wire SourceScore VERITAS into Haystack 2.x as a catalog retriever plus a candidate-annotation component. Evidence review remains explicit. Python examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/haystack/" },
  openGraph: {
    title: "Haystack + SourceScore VERITAS",
    description: "Custom catalog retriever plus candidate annotation for Haystack evidence-review pipelines.",
    url: "https://sourcescore.org/docs/integrations/haystack/",
    type: "article",
  },
};

export default function HaystackIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Haystack + SourceScore VERITAS: candidate-record retrieval and review",
            description:
              "A custom Haystack 2.x component wrapping VERITAS search, plus a component that annotates possible catalog matches without treating similarity as proof.",
            datePublished: "2026-05-29",
            dateModified: "2026-05-29",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/haystack/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(haystackHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "Haystack", url: "https://sourcescore.org/docs/integrations/haystack/" },
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
        <span className="text-zinc-700 dark:text-zinc-300">Haystack</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Integration guide</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          Haystack + SourceScore VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Two Haystack 2.x components: a retriever for curated VERITAS
          records and an annotator for possible matches. A separate evidence
          or entailment review decides whether an assertion is supported.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Install</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`pip install haystack-ai requests`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">A VERITAS retriever component</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Haystack 2.x components are plain classes decorated with{" "}
          <code className="font-mono">@component</code>. The{" "}
          <code className="font-mono">run()</code> method declares its outputs
          via <code className="font-mono">@component.output_types</code>. This
          one turns VERITAS <code className="font-mono">/search</code> hits into
          Haystack <code className="font-mono">Document</code>s, carrying the
          claim id, confidence, and canonical URL in <code className="font-mono">meta</code>.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests
from typing import List
from haystack import component, Document

VERITAS = "https://sourcescore.org/api/v1"

@component
class VeritasRetriever:
    def __init__(self, top_k: int = 5):
        self.top_k = top_k

    @component.output_types(documents=List[Document])
    def run(self, query: str):
        r = requests.get(
            f"{VERITAS}/search",
            params={"q": query, "limit": self.top_k},
            timeout=8,
        )
        r.raise_for_status()
        docs = []
        for c in r.json().get("results", []):
            docs.append(
                Document(
                    content=c["statement"],
                    score=c.get("matchScore", c["confidence"]),
                    meta={
                        "claim_id": c["id"],
                        "confidence": c["confidence"],
                        "url": f"https://sourcescore.org/claims/{c['id']}/",
                        "tags": c.get("tags", []),
                    },
                )
            )
        return {"documents": docs}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">A candidate annotator (for any existing retriever)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          If your pipeline already has a primary retriever (a vector store, say),
          add this annotator after it. It POSTs each document to{" "}
          <code className="font-mono">/verify</code> and attaches any returned
          candidate. It never keeps or drops a document based on similarity alone.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests
from typing import List
from haystack import component, Document

@component
class VeritasCandidateAnnotator:
    def __init__(self, min_confidence: float = 0.85):
        self.min_confidence = min_confidence

    @component.output_types(documents=List[Document])
    def run(self, documents: List[Document]):
        for d in documents:
            r = requests.post(
                f"{VERITAS}/verify",
                json={"claim": d.content, "minConfidence": self.min_confidence},
                timeout=8,
            ).json()
            best = r.get("bestMatch")
            if best:
                d.meta["veritas_candidate_id"] = best["id"]
                d.meta["veritas_record_confidence"] = best["confidence"]
                d.meta["veritas_candidate_url"] = best.get("detailUrl")
                d.meta["requires_evidence_review"] = True
        return {"documents": documents}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Wire the pipeline</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Connect the retriever to a <code className="font-mono">PromptBuilder</code>{" "}
          and an <code className="font-mono">OpenAIGenerator</code>. The prompt
          instructs the model to use a candidate only when its exact statement
          supports the answer.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`from haystack import Pipeline
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator

template = """The records below are retrieval candidates, not truth verdicts.
Use a record only when its exact statement supports the answer; otherwise say
the supplied evidence does not cover the question.

{% for doc in documents %}
[{{ doc.meta.claim_id }}] {{ doc.content }} (confidence {{ doc.meta.confidence }})
{% endfor %}

Question: {{ query }}
Answer (cite [claim_id] only after exact-statement comparison):"""

pipe = Pipeline()
pipe.add_component("retriever", VeritasRetriever(top_k=5))
pipe.add_component("prompt", PromptBuilder(template=template, required_variables=["query"]))
pipe.add_component("llm", OpenAIGenerator(model="gpt-4o-mini"))

pipe.connect("retriever.documents", "prompt.documents")
pipe.connect("prompt.prompt", "llm.prompt")

question = "Who introduced the Transformer architecture?"
result = pipe.run({
    "retriever": {"query": question},
    "prompt": {"query": question},
})
print(result["llm"]["replies"][0])
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why an evidence-review step</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          A retriever returns the closest documents; it does not confirm a
          generated answer is consistent with them. This component only selects
          similar catalog candidates; it does not close that gap. Compare each
          linked primary source before asserting a fact. The public API is free
          with no account, key, or signup; it
          is the same API the rest of these guides use.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/" className="underline">Full API reference</a></li>
          <li>• <a href="/docs/integrations/llamaindex/" className="underline">LlamaIndex guide</a></li>
          <li>• <a href="/docs/integrations/langchain/" className="underline">LangChain guide</a></li>
          <li>• <a href="/claims/" className="underline">Browse the catalog</a></li>
          <li>• <a href="/pricing/" className="underline">Pricing + signup</a></li>
        </ul>
      </section>
    </article>
  );
}
