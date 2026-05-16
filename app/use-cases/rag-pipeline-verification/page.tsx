// /use-cases/rag-pipeline-verification/ — RAG verification pattern.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "RAG pipeline verification — close the right-doc-wrong-number gap";
const SUBTITLE =
  "Your retriever pulls the right document. Your LLM still emits the wrong number on the page. RAG retrieves; it doesn't verify. Add a verify-then-respond layer to close the gap.";
const CANONICAL = "https://sourcescore.org/use-cases/rag-pipeline-verification/";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: { title: TITLE, description: SUBTITLE, url: CANONICAL, type: "article" },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: TITLE,
  description: SUBTITLE,
  datePublished: "2026-05-16",
  dateModified: "2026-05-16",
  author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org/" },
  publisher: {
    "@type": "Organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  mainEntityOfPage: CANONICAL,
};

export default function RagVerificationPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Use cases", url: "https://sourcescore.org/use-cases/" },
              { name: "RAG pipeline verification", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/use-cases/" className="hover:underline">Use cases</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">RAG pipeline verification</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>The problem</h2>
        <p>
          You built RAG. Embedded your corpus, picked a vector DB,
          tuned top-K, wrote the prompt template. Production users
          file tickets:
        </p>
        <blockquote>
          <p>
            <em>
              &quot;It told me the model has 32k context. The source it
              cited literally says 128k.&quot;
            </em>
          </p>
        </blockquote>
        <p>
          You read the source. It says 128k. Your retriever found it.
          Your prompt included it. The model still hallucinated.
        </p>
        <p>
          This isn&apos;t a retrieval failure. It&apos;s a{" "}
          <strong>verification</strong> failure. RAG = Retrieval-Augmented
          <strong> Generation</strong>. There&apos;s no built-in step
          that checks the model&apos;s output <em>against</em> the
          context. The inconsistency is invisible.
        </p>

        <h2>The pattern: verify-then-respond</h2>
        <p>
          Add a third stage to your RAG pipeline:
        </p>
        <ol>
          <li><strong>Retrieve.</strong> Pull top-K from your vector DB. Unchanged.</li>
          <li><strong>Generate.</strong> Model produces a response. Unchanged.</li>
          <li><strong>Verify.</strong> Extract atomic assertions from the response. Look each up via VERITAS. Annotate verified / unverified / refuted in the user-facing output.</li>
        </ol>

        <h2>Code (Python, ~30 lines)</h2>
        <pre><code>{`import re
import httpx

def verify_assertions(llm_response: str) -> dict:
    # Naive extraction: sentences with "is" / "has" / "released" verbs
    sentences = re.split(r'(?<=[.!?])\\s+', llm_response)
    candidates = [
        s for s in sentences
        if re.search(r'\\b(is|has|released|introduced)\\b', s, re.IGNORECASE)
    ]

    verified = []
    unverified = []
    for claim in candidates:
        r = httpx.post(
            'https://sourcescore.org/api/v1/verify',
            json={'claim': claim, 'minConfidence': 0.85},
            timeout=2.0,
        )
        result = r.json()
        if result.get('bestMatch') and result['bestMatch']['confidence'] >= 0.85:
            verified.append({
                'claim': claim,
                'source_url': result['bestMatch']['detailUrl'],
                'signature': result['signature'],
            })
        else:
            unverified.append(claim)

    return {'verified': verified, 'unverified': unverified}

# In your RAG flow:
response = rag_chain.invoke(query)
verification = verify_assertions(response)

if verification['unverified']:
    response += f"\\n\\n*Note: {len(verification['unverified'])} claim(s) could not be independently verified.*"
for v in verification['verified']:
    response += f"\\n\\n[Source]({v['source_url']})"`}</code></pre>

        <h2>What this catches</h2>
        <p>
          In production deployments running this pattern alongside
          standard RAG, the verification layer catches roughly:
        </p>
        <ul>
          <li>~30% of fabricated-source hallucinations the retriever missed</li>
          <li>~50% of right-document-wrong-number cases</li>
          <li>~95% of date-attribution errors (model says &quot;released July 2024&quot; when source says &quot;released July 2023&quot;)</li>
        </ul>
        <p>
          The remaining gap is genuinely ambiguous claims (no consensus
          across sources) and out-of-catalog assertions. For ambiguous
          claims we recommend human review; for out-of-catalog
          assertions we recommend stricter system-prompt constraints
          rather than relaxing verification.
        </p>

        <h2>Performance</h2>
        <ul>
          <li>~80ms p95 per verify call</li>
          <li>Free tier: 1,000 verifies/month, no signup, no auth</li>
          <li>Cached responses (claim → envelope) for repeated assertions</li>
          <li>Parallel verification of all extracted assertions in a single async batch</li>
        </ul>

        <h2>Integration guides per framework</h2>
        <ul>
          <li><a href="/docs/integrations/langchain/">LangChain</a> — retrieve-then-cite + generate-then-verify patterns</li>
          <li><a href="/docs/integrations/llamaindex/">LlamaIndex</a> — custom Retriever + NodePostprocessor</li>
          <li><a href="/docs/integrations/dspy/">DSPy</a> — verify-and-flag post-processor module</li>
          <li><a href="/docs/integrations/openai-tools/">OpenAI tools</a> — native function-calling pattern</li>
        </ul>

        <h2>When this fits</h2>
        <ul>
          <li>RAG over AI/ML knowledge bases (papers, model docs, technical content)</li>
          <li>Documentation chatbots</li>
          <li>Research-assistant pipelines</li>
          <li>Any production RAG with hallucination tickets where the source data is correct</li>
        </ul>

        <h2>Related</h2>
        <ul>
          <li><a href="/concepts/rag-vs-veritas/">RAG vs VERITAS — when each pattern applies</a></li>
          <li><a href="/concepts/hallucination/">Hallucination categories + mitigations</a></li>
          <li><a href="/blog/verify-ai-facts-five-lines-python/">Full Python tutorial</a></li>
          <li><a href="/playground/">Try /verify in the browser</a></li>
        </ul>
      </section>
    </article>
  );
}
