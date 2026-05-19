// Practical blog post: 5-line Python verification example.
//
// Canonical for future Dev.to + Hashnode + Medium cross-posts. Hands-on
// tutorial format scores best on developer surfaces. Aleyda 10-char #4
// Extractable + #10 Transactable.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE = "Verifying AI-generated facts in 5 lines of Python";
const SUBTITLE =
  "Drop SourceScore VERITAS into your LLM pipeline as a post-generation check. Every claim the model emits gets a confidence score + canonical citation before the user sees it.";
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
          The standard fix is RAG — retrieve relevant context, stuff it
          into the prompt, hope the model uses it. That works ~70% of the
          time. The remaining 30% is exactly the boundary where the model
          still drifts off the retrieved chunks because chunks are noisy
          + unverified.
        </p>

        <h2>The 5-line fix</h2>
        <p>
          A different approach: let the model answer freely, then{" "}
          <em>verify each assertion</em> against a catalog of signed,
          sourced claims. Anything the catalog confirms gets a citation
          badge. Anything it doesn&apos;t gets flagged.
        </p>

        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests

def verify(claim: str, threshold: float = 0.85):
    r = requests.post("https://sourcescore.org/api/v1/verify",
        json={"claim": claim, "minConfidence": threshold}, timeout=8)
    return r.json().get("bestMatch")  # None if no high-confidence match`}</code></pre>

        <p>
          That&apos;s the whole client. Five lines including the import.
          Drop it in front of every fact your LLM emits and you have a
          working hallucination filter for the AI/ML domain.
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

    # Step 2 — verify each line, render with badges
    out = []
    for line in raw.strip().split("\\n"):
        if not line.strip(): continue
        best = verify(line)
        if best:
            badge = f"✅ [{best['id']}] (confidence {best['confidence']:.2f})"
            url   = f"https://sourcescore.org/claims/{best['id']}/"
            out.append(f"{line.strip()} {badge}\\n  → {url}")
        else:
            out.append(f"{line.strip()} ⚠️ unverified")
    return "\\n".join(out)

print(answer_with_citations("When was the Transformer architecture introduced and by whom?"))`}</code></pre>

        <p>Sample output:</p>

        <pre className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`The Transformer architecture was introduced in 2017. ✅ [abc123...] (confidence 1.00)
  → https://sourcescore.org/claims/abc123.../
It was introduced by Vaswani et al. in "Attention Is All You Need". ✅ [abc123...] (confidence 1.00)
  → https://sourcescore.org/claims/abc123.../`}</code></pre>

        <h2>What you get</h2>
        <ul>
          <li>
            <strong>Hallucination filter.</strong> Anything unverified is
            visually flagged before the user sees it. UI can strip
            unverified lines entirely if your domain demands strictness.
          </li>
          <li>
            <strong>Free citation badges.</strong> Every verified fact
            ships with a canonical URL the user can click for full
            provenance — primary sources, signing, last-verified date.
          </li>
          <li>
            <strong>Cost transparency.</strong> One call per assertion,
            ~80ms p95. The free tier covers 1,000 calls/month. You know
            exactly what verification costs you.
          </li>
        </ul>

        <h2>Scope honesty</h2>
        <p>
          VERITAS today is bounded to AI/ML research — 336 hand-verified
          claims across foundational papers, model releases, organizations,
          and datasets. If your chain asks about &quot;the capital of
          France&quot; we return no match and your code falls through to
          whatever retrieval you&apos;d use anyway.
        </p>
        <p>
          Catalog expansion is gated by our methodology: every claim must
          have ≥2 primary sources, verbatim excerpts, and not be a
          performance-comparison (benchmark numbers vary by prompt format
          / version / shot count — too much surface for &quot;actually
          that&apos;s not quite right&quot; pushback). New verticals ship
          Y2.
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
            <a href="/claims/">Browse the catalog</a> — 336 verified AI/ML claims
          </li>
        </ul>

        <h2>One question I get a lot</h2>
        <p>
          <em>&quot;Why not just put all 336 claims in the prompt as
          context?&quot;</em>
        </p>
        <p>
          You can, and for a Day 1 demo you should. The reason to pull
          via API instead is:
        </p>
        <ol>
          <li>
            The catalog grows past what fits in a prompt context window
            within a quarter.
          </li>
          <li>
            Retrieval ranks claims by relevance to the actual question —
            you&apos;re not paying tokens for the 95 irrelevant claims.
          </li>
          <li>
            The signed envelope path lets you re-verify integrity locally,
            which is meaningful for high-stakes deployments where you need
            to prove the claim wasn&apos;t modified.
          </li>
        </ol>

        <p>
          Start with the prompt-stuff pattern. Move to API when you outgrow
          it (typically week 2-3). The migration is &lt;30 minutes; the
          5-line client above is the whole client.
        </p>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Found this useful? Browse the{" "}
          <a href="/claims/" className="underline">verified claim catalog</a>{" "}
          (100 entries today) or run the{" "}
          <a href="/quickstart/" className="underline">quickstart</a> for
          the JavaScript + curl equivalents.
        </p>
      </footer>
    </article>
  );
}
