// Practical blog post: 5-line Python verification example.
//
// Canonical for future Dev.to + Hashnode + Medium cross-posts. Hands-on
// tutorial format scores best on developer surfaces. Aleyda 10-char #4
// Extractable + #10 Transactable.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE = "Match AI-generated facts to a cited catalog in 5 lines of Python";
const SUBTITLE =
  "Use SourceScore VERITAS as a post-generation screening step. It returns nearby catalog records and canonical citations to compare—not a truth verdict.";
const SLUG = "verify-ai-facts-five-lines-python";
const CANONICAL = `https://sourcescore.org/blog/${SLUG}/`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SUBTITLE,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: SUBTITLE,
    url: CANONICAL,
    type: "article",
    publishedTime: PUBLISHED,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: SUBTITLE },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: TITLE,
  description: SUBTITLE,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  mainEntityOfPage: CANONICAL,
  author: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    url: "https://sourcescore.org",
  },
  editor: {
    "@type": "Person",
    "@id": "https://sourcescore.org/about/#person-editorial-lead",
    name: "SourceScore Editorial Team",
    url: "https://sourcescore.org/about/",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  about: [
    { "@type": "Thing", name: "LLM hallucination detection" },
    { "@type": "Thing", name: "Claim verification" },
    { "@type": "Thing", name: "Python integration" },
  ],
};

export default function VerifyFiveLinesPost() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
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
              { name: "Blog", url: "https://sourcescore.org/blog/" },
              { name: TITLE, url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">Blog</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Verify AI facts in 5 lines</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Tutorial · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>The problem</h2>
        <p>
          You wired up GPT-4 or Claude to answer questions about AI/ML
          research. Demo is great. Then a user asks &quot;when was the
          Transformer architecture introduced and by whom?&quot; and the
          model invents a plausible-but-wrong attribution. You catch it
          this time. You won&apos;t catch it the next thousand times.
        </p>
        <p>
          A common mitigation is RAG: retrieve relevant context and provide it
          to the model. That improves grounding, but it does not guarantee that
          every generated assertion is supported by the retrieved text.
        </p>

        <h2>The 5-line catalog check</h2>
        <p>
          A different approach: let the model answer freely, then{" "}
          <em>match each assertion</em> against a catalog of sourced claims.
          A result is a candidate record to compare with the model output—not
          proof that the model&apos;s wording is true.
        </p>

        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests

def find_catalog_match(claim: str, threshold: float = 0.85):
    r = requests.post("https://sourcescore.org/api/v1/verify",
        json={"claim": claim, "minConfidence": threshold}, timeout=8)
    r.raise_for_status()
    return r.json().get("bestMatch")  # candidate record, not a truth verdict`}</code></pre>

        <p>
          That&apos;s the whole client. Five lines including the import.
          Use it to find reviewable AI/ML catalog records before publishing.
          Your application still needs to compare the returned statement and
          cited evidence with the assertion it intends to show.
        </p>

        <h2>Wire it into a chain</h2>
        <p>
          Here&apos;s the same function inside a generate-then-verify
          loop:
        </p>

        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`from openai import OpenAI

client = OpenAI()

def answer_with_citations(question: str) -> str:
    # Step 1 — model generates one fact per line
    raw = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Answer with one fact per line:\\n{question}"}],
        temperature=0,
    ).choices[0].message.content

    # Step 2 — find a candidate record for each line
    out = []
    for line in raw.strip().split("\\n"):
        if not line.strip(): continue
        best = find_catalog_match(line)
        if best:
            url   = f"https://sourcescore.org/claims/{best['id']}/"
            out.append(f"Input: {line.strip()}\\nCandidate: {best['statement']}\\nReview: {url}")
        else:
            out.append(f"Input: {line.strip()}\\nNo catalog candidate found")
    return "\\n".join(out)

print(answer_with_citations("When was the Transformer architecture introduced and by whom?"))`}</code></pre>

        <p>Sample output:</p>

        <pre className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`Input: The Transformer architecture was introduced in 2017.
Candidate: Transformer architecture introduced in paper: Attention Is All You Need (Vaswani et al., 2017).
Review: https://sourcescore.org/claims/ad17e76a8baad7a1/`}</code></pre>

        <h2>What you get</h2>
        <ul>
          <li>
            <strong>Screening aid.</strong> Assertions with no nearby catalog
            record can be routed to another retrieval or human-review path.
          </li>
          <li>
            <strong>Reviewable citations.</strong> Candidate records ship with
            a canonical URL where users can inspect cited sources, integrity
            metadata, and the last-reviewed date.
          </li>
          <li>
            <strong>Visible request cost.</strong> Each assertion you submit is
            one additional network request. The public v0 endpoints need no
            key; measure latency and traffic in your own stack.
          </li>
        </ul>

        <h2>Scope honesty</h2>
        <p>
          VERITAS today is bounded to AI/ML research — 384 hand-verified
          claims across foundational papers, model releases, organizations,
          and datasets. If your chain asks about &quot;the capital of
          France&quot; we return no match and your code falls through to
          whatever retrieval you&apos;d use anyway.
        </p>
        <p>
          Catalog expansion is gated by our methodology: every claim must
          cite primary evidence, show source counts, and not be a
          performance comparison (benchmark numbers vary by prompt format,
          version, shot count, and evaluation setup). No date is promised for
          new verticals.
        </p>

        <h2>Going deeper</h2>
        <ul>
          <li>
            <a href="/quickstart/">Quickstart</a> — 5-min path with curl + JS + Python
          </li>
          <li>
            <a href="/docs/integrations/langchain/">LangChain integration guide</a> — retrieve-then-cite + generate-then-verify patterns
          </li>
          <li>
            <a href="/docs/integrations/llamaindex/">LlamaIndex integration guide</a> — custom Retriever + NodePostprocessor
          </li>
          <li>
            <a href="/docs/integrations/openai-tools/">OpenAI tool-calls</a> — native function-calling pattern
          </li>
          <li>
            <a href="/claims/">Browse the catalog</a> — 384 verified AI/ML claims
          </li>
        </ul>

        <h2>One question I get a lot</h2>
        <p>
          <em>&quot;Why not just put all 384 claims in the prompt as
          context?&quot;</em>
        </p>
        <p>
          You can, and for a Day 1 demo you should. The reason to pull
          via API instead is:
        </p>
        <ol>
          <li>
            An API lets you avoid inserting the entire catalog into every prompt.
          </li>
          <li>
            Retrieval ranks claims by relevance to the actual question —
            you can send only candidate records relevant to the question.
          </li>
          <li>
            Refetching the canonical API record lets you compare your copy with
            SourceScore&apos;s current copy. The HMAC tag is not independently
            verifiable by public users because the shared secret is unpublished.
          </li>
        </ol>

        <p>
          Start with the simplest pattern that fits. Move to API retrieval when
          measured context size, latency, or maintenance cost justifies it; the
          small client above shows the request shape.
        </p>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Found this useful? Browse the{" "}
          <a href="/claims/" className="underline">verified claim catalog</a>{" "}
          (384 entries today) or run the{" "}
          <a href="/quickstart/" className="underline">quickstart</a> for
          the JavaScript + curl equivalents.
        </p>
      </footer>
    </article>
  );
}
