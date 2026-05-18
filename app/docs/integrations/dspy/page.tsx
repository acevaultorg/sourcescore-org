// VERITAS-Reborn — DSPy (Stanford) integration guide.
// 5th framework guide. DSPy is the fastest-growing compound-AI-system
// framework in 2026; programs-not-prompts pattern.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { dspyHowTo } from "@/lib/howto-schemas";
export const metadata: Metadata = {
  title: "DSPy + SourceScore VERITAS — programmatic claim verification in compound AI systems",
  description:
    "Wire SourceScore VERITAS into a DSPy program as a Retrieve module and a Verify post-processor. Compound-AI-system grounding without per-prompt brittleness. Python examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/dspy/" },
  openGraph: {
    title: "DSPy + SourceScore VERITAS",
    description: "Signed-claim retrieval + verification as DSPy modules.",
    url: "https://sourcescore.org/docs/integrations/dspy/",
    type: "article",
  },
};

export default function DSPyIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "DSPy + SourceScore VERITAS: programmatic claim verification in compound AI systems",
            description:
              "Wire SourceScore VERITAS into a DSPy program as a Retrieve module and a Verify post-processor. Programs-not-prompts pattern with signed-claim grounding.",
            datePublished: "2026-05-16",
            dateModified: "2026-05-16",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/dspy/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dspyHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "DSPy", url: "https://sourcescore.org/docs/integrations/dspy/" },
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
        <span className="text-zinc-700 dark:text-zinc-300">DSPy</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Integration guide</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          DSPy + VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          DSPy is Stanford&apos;s compound-AI-system framework — programs
          instead of prompts. This guide shows two integration patterns:
          a custom <code className="font-mono">dspy.Retrieve</code>{" "}
          backed by the VERITAS catalog, and a verify-and-flag
          post-processor module.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why DSPy + VERITAS</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          DSPy programs declare <em>what</em> the system should do
          (signatures + modules) and leave the <em>how</em> (exact
          prompts) to the optimizer. That separation makes external
          retrieval modules first-class — a VERITAS retriever fits
          naturally into the existing <code className="font-mono">dspy.Retrieve</code>
          {" "}interface.
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          The compound system gains a typed retrieval path that DSPy&apos;s
          optimizers can reason about — verified-claim retrieval becomes
          a tunable step, not a brittle prompt-stuffing decision.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Install</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`pip install dspy-ai requests`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 1 — Custom dspy.Retrieve</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Subclass <code className="font-mono">dspy.Retrieve</code> and
          translate VERITAS search hits into DSPy passages. Each passage
          carries the claim id, confidence, and source URLs as metadata
          so downstream modules can render citations.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import dspy
import requests
from typing import List

VERITAS = "https://sourcescore.org/api/v1"

class VeritasRetriever(dspy.Retrieve):
    def __init__(self, k: int = 5, min_confidence: float = 0.8):
        super().__init__(k=k)
        self.min_confidence = min_confidence

    def forward(self, query_or_queries, k=None) -> List[dspy.Example]:
        queries = [query_or_queries] if isinstance(query_or_queries, str) else query_or_queries
        results = []
        for q in queries:
            r = requests.get(
                f"{VERITAS}/search",
                params={"q": q, "limit": k or self.k},
                timeout=8,
            )
            for hit in r.json().get("matches", []):
                if hit.get("confidence", 0) < self.min_confidence:
                    continue
                results.append(
                    dspy.Example(
                        long_text=hit["statement"],
                        claim_id=hit["id"],
                        confidence=hit["confidence"],
                        canonical_url=f"https://sourcescore.org/claims/{hit['id']}/",
                        tags=hit.get("tags", []),
                    ).with_inputs("long_text")
                )
        return results
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Wire into a DSPy program</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import dspy

# Set up the LM + retriever
lm = dspy.OpenAI(model="gpt-4o-mini", temperature=0)
rm = VeritasRetriever(k=5, min_confidence=0.85)
dspy.settings.configure(lm=lm, rm=rm)

# Define the signature
class CitedAnswer(dspy.Signature):
    """Answer the question using only the verified claims. Cite [claim_id] inline."""
    question: str = dspy.InputField()
    context: list[str] = dspy.InputField(desc="Verified claims with [claim_id] tags")
    answer: str = dspy.OutputField(desc="Answer with [claim_id] citations after every fact")

# Build the program
class CitedRAG(dspy.Module):
    def __init__(self):
        super().__init__()
        self.retrieve = dspy.Retrieve(k=5)
        self.generate = dspy.ChainOfThought(CitedAnswer)

    def forward(self, question: str):
        passages = self.retrieve(question).passages
        context = [
            f"{p.long_text} [{p.claim_id}] (conf={p.confidence:.2f})"
            for p in passages
        ]
        return self.generate(question=question, context=context)

program = CitedRAG()
result = program(question="When was the Transformer architecture introduced?")
print(result.answer)
`}</code></pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
          The signature forces a <code className="font-mono">[claim_id]</code>{" "}
          citation after every assertion. DSPy&apos;s optimizer can later
          tune the exact prompt around this signature without changing
          the contract — VERITAS continues to feed verified passages
          regardless of which prompt-template the optimizer settles on.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern 2 — Verify post-processor module</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          When you want free-form generation but a verification layer
          afterwards, wrap <code className="font-mono">/api/v1/verify</code>{" "}
          in a DSPy module that runs after the answer generation.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`class VeritasVerify(dspy.Module):
    """Post-process an answer — verify each assertion against the catalog."""

    def __init__(self, min_confidence: float = 0.85):
        super().__init__()
        self.min_confidence = min_confidence

    def forward(self, answer: str) -> dict:
        lines = [l.strip() for l in answer.split("\\n") if l.strip()]
        verified, unverified = [], []
        for line in lines:
            r = requests.post(
                f"{VERITAS}/verify",
                json={"claim": line, "minConfidence": self.min_confidence},
                timeout=8,
            ).json()
            if r.get("bestMatch"):
                verified.append({
                    "text": line,
                    "claim_id": r["bestMatch"]["id"],
                    "confidence": r["bestMatch"]["confidence"],
                    "url": f"https://sourcescore.org/claims/{r['bestMatch']['id']}/",
                })
            else:
                unverified.append(line)
        return dspy.Prediction(
            verified=verified,
            unverified=unverified,
            verification_rate=len(verified) / max(1, len(lines)),
        )

# Composing it into a larger program
class AnswerAndVerify(dspy.Module):
    def __init__(self):
        super().__init__()
        self.generate = dspy.ChainOfThought("question -> answer")
        self.verify = VeritasVerify(min_confidence=0.85)

    def forward(self, question: str):
        a = self.generate(question=question)
        v = self.verify(a.answer)
        return dspy.Prediction(
            answer=a.answer,
            verified_claims=v.verified,
            unverified_claims=v.unverified,
            verification_rate=v.verification_rate,
        )
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">DSPy optimizer compatibility</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          DSPy&apos;s optimizers (BootstrapFewShot, MIPRO, COPRO) can
          tune <em>around</em> the VERITAS retriever — they&apos;ll
          adjust the prompts that consume the passages, but they
          can&apos;t change what the passages contain. That&apos;s by
          design: the catalog is the trusted layer, the optimizer
          improves how the model uses it.
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          A good metric for optimization: <code className="font-mono">
            verification_rate
          </code>{" "}from <code className="font-mono">AnswerAndVerify</code>.
          Maximizing it tunes the program toward producing more verifiable
          assertions — the catalog acts as the ground-truth signal.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Compose with other DSPy modules</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          The VERITAS retriever composes with any DSPy pattern: ReAct,
          MultiHopProgram, ProgramOfThought. A multi-hop pattern with
          verification:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`class MultiHopVerified(dspy.Module):
    def __init__(self):
        super().__init__()
        self.retrieve = VeritasRetriever(k=3)
        self.hop1 = dspy.ChainOfThought("question -> sub_question")
        self.hop2 = dspy.ChainOfThought("question, sub_answer -> final_answer")
        self.verify = VeritasVerify()

    def forward(self, question: str):
        sub_q = self.hop1(question=question).sub_question
        passages = self.retrieve(sub_q).passages
        sub_a = "\\n".join(p.long_text for p in passages)
        final = self.hop2(question=question, sub_answer=sub_a).final_answer
        return self.verify(final)
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/" className="underline">Full API reference</a></li>
          <li>• <a href="/docs/integrations/langchain/" className="underline">LangChain guide</a> — similar patterns in a different framework</li>
          <li>• <a href="/docs/integrations/llamaindex/" className="underline">LlamaIndex guide</a> — Retriever + NodePostprocessor</li>
          <li>• <a href="/docs/integrations/openai-tools/" className="underline">OpenAI tool-calls</a> — native function-calling</li>
          <li>• <a href="/docs/integrations/vercel-ai-sdk/" className="underline">Vercel AI SDK</a> — TypeScript/Next.js</li>
          <li>• <a href="/concepts/citation-chain/" className="underline">Citation chains</a> — local verification of signed envelopes</li>
          <li>• <a href="/claims/" className="underline">Browse the catalog</a> — 276 verified AI/ML claims</li>
        </ul>
      </section>
    </article>
  );
}
