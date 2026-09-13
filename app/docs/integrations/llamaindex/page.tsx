// VERITAS-Reborn — LlamaIndex integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { llamaindexHowTo } from "@/lib/howto-schemas";

export const metadata: Metadata = {
  title: "LlamaIndex + SourceScore VERITAS — retrieve candidate claim records",
  description:
    "Wire SourceScore VERITAS into LlamaIndex as a custom catalog retriever and candidate-annotation post-processor. Matches require evidence review. Python examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/llamaindex/" },
  openGraph: {
    title: "LlamaIndex + SourceScore VERITAS",
    description: "Custom retriever plus candidate annotation for evidence-review pipelines.",
    url: "https://sourcescore.org/docs/integrations/llamaindex/",
    type: "article",
  },
};

export default function LlamaIndexIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "LlamaIndex + SourceScore VERITAS: candidate-record retrieval and review",
            description:
              "Custom Retriever wrapping the VERITAS /search endpoint, plus a node post-processor that labels possible catalog records for later evidence comparison.",
            datePublished: "2026-05-16",
            dateModified: "2026-05-16",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/llamaindex/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(llamaindexHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "LlamaIndex", url: "https://sourcescore.org/docs/integrations/llamaindex/" },
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
        <span className="text-zinc-700 dark:text-zinc-300">LlamaIndex</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Integration guide</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          LlamaIndex + SourceScore VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Custom retriever for curated claim records plus a node post-processor
          that attaches candidates for review. Similarity does not create a
          verification badge.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Install</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`pip install llama-index requests`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Custom VERITAS retriever</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Subclass <code className="font-mono">BaseRetriever</code> and
          translate VERITAS search hits into LlamaIndex nodes. Each node
          carries the claim id, confidence, and a back-link to the
          canonical page in <code className="font-mono">metadata</code> so
          downstream prompts can render review links.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests
from typing import List
from llama_index.core.retrievers import BaseRetriever
from llama_index.core.schema import NodeWithScore, TextNode

VERITAS = "https://sourcescore.org/api/v1"

class VeritasRetriever(BaseRetriever):
    def __init__(self, top_k: int = 5):
        super().__init__()
        self.top_k = top_k

    def _retrieve(self, query_bundle) -> List[NodeWithScore]:
        r = requests.get(
            f"{VERITAS}/search",
            params={"q": query_bundle.query_str, "limit": self.top_k},
            timeout=8,
        )
        r.raise_for_status()
        out = []
        for c in r.json().get("results", []):
            node = TextNode(
                text=c["statement"],
                metadata={
                    "claim_id": c["id"],
                    "confidence": c["confidence"],
                    "url": f"https://sourcescore.org/claims/{c['id']}/",
                    "vertical": c.get("vertical", "ai-ml"),
                    "tags": c.get("tags", []),
                },
            )
            out.append(NodeWithScore(node=node, score=c.get("matchScore", c["confidence"])))
        return out
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Wire into a QueryEngine</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`from llama_index.core import PromptTemplate
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core.response_synthesizers import get_response_synthesizer
from llama_index.llms.openai import OpenAI

qa_template = PromptTemplate("""You are a precise assistant. The records below are retrieval
candidates, not truth verdicts. Use a record only when its exact statement supports
your assertion; otherwise say the supplied evidence does not cover the question.

Candidate records:
{context_str}

Question: {query_str}
Answer (cite [claim_id] only after exact-statement comparison):""")

retriever = VeritasRetriever(top_k=5)
synthesizer = get_response_synthesizer(
    llm=OpenAI(model="gpt-4o-mini", temperature=0),
    text_qa_template=qa_template,
)
engine = RetrieverQueryEngine(retriever=retriever, response_synthesizer=synthesizer)

resp = engine.query("Who introduced the Transformer architecture?")
print(resp)
for n in resp.source_nodes:
    print(f"  → [{n.metadata['claim_id']}] confidence {n.metadata['confidence']:.2f} {n.metadata['url']}")
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Candidate annotation (NodePostProcessor)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          For chains that already have a different primary retriever, you
          can layer VERITAS in as a post-processor that annotates each node
          with a possible catalog record. It must not approve or drop content
          from similarity alone; a downstream entailment or human review decides.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests
from typing import List, Optional
from llama_index.core.postprocessor.types import BaseNodePostprocessor
from llama_index.core.schema import NodeWithScore, QueryBundle

class VeritasCandidatePostprocessor(BaseNodePostprocessor):
    min_confidence: float = 0.85

    def _postprocess_nodes(
        self,
        nodes: List[NodeWithScore],
        query_bundle: Optional[QueryBundle] = None,
    ) -> List[NodeWithScore]:
        out = []
        for n in nodes:
            r = requests.post(
                "https://sourcescore.org/api/v1/verify",
                json={"claim": n.node.text, "minConfidence": self.min_confidence},
                timeout=8,
            ).json()
            best = r.get("bestMatch")
            if best:
                n.node.metadata["veritas_candidate_id"] = best["id"]
                n.node.metadata["veritas_candidate_url"] = best["detailUrl"]
                n.node.metadata["veritas_requires_review"] = True
            out.append(n)  # similarity alone never approves or rejects the node
        return out
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/" className="underline">Full API reference</a></li>
          <li>• <a href="/docs/integrations/langchain/" className="underline">LangChain guide</a></li>
          <li>• <a href="/docs/integrations/openai-tools/" className="underline">OpenAI tool-calls</a></li>
          <li>• <a href="/claims/" className="underline">Browse the catalog</a></li>
          <li>• <a href="/pricing/" className="underline">Pricing + signup</a></li>
        </ul>
      </section>
    </article>
  );
}
