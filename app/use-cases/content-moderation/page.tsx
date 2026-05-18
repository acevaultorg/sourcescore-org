// /use-cases/content-moderation/ — fact-check LLM outputs before publishing.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Content moderation — fact-check LLM outputs before publishing";
const SUBTITLE =
  "Editorial AI tools, content generation platforms, and publishing assistants ship hallucinated facts to thousands of readers. Add verification between draft and publish.";
const CANONICAL = "https://sourcescore.org/use-cases/content-moderation/";

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
  datePublished: "2026-05-17",
  dateModified: "2026-05-17",
  author: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    url: "https://sourcescore.org/",
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
  mainEntityOfPage: CANONICAL,
};

export default function ContentModerationPage() {
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
              { name: "Content moderation", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/use-cases/" className="hover:underline">Use cases</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Content moderation</span>
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
          AI content tools — newsletter generators, blog assistants,
          report drafters, automated summary tools — generate fluent
          text fast. Their failure mode at scale is shipping
          hallucinated facts to thousands of readers.
        </p>
        <p>
          Examples of damage at scale:
        </p>
        <ul>
          <li>Tech newsletter auto-summarizes a paper, gets the author name wrong.</li>
          <li>Industry-report tool cites a release date that&apos;s 2 years off.</li>
          <li>Blog assistant attributes a quote to the wrong founder.</li>
          <li>Marketing copy generator invents a non-existent integration.</li>
        </ul>
        <p>
          The reader doesn&apos;t know it&apos;s wrong. The error
          compounds — gets reshared, quoted, indexed. Months later
          you&apos;re searching for &quot;Llama 3 released 2025&quot;
          and seeing your own incorrect content cited back at you.
        </p>

        <h2>The pattern</h2>
        <p>
          Pre-publish verification gate. Three steps between LLM draft
          and publish button:
        </p>
        <ol>
          <li><strong>Extract atomic claims.</strong> Parse the draft into discrete assertions (dates, names, numbers, attributions).</li>
          <li><strong>Verify each claim.</strong> Against domain catalogs + cross-reference checks. AI/ML claims via SourceScore VERITAS; other domains via Wikipedia + Wolfram + custom catalogs.</li>
          <li><strong>Flag or strip unverified claims.</strong> Either route the draft to human review with unverified claims highlighted, or auto-strip and let the LLM regenerate without those claims.</li>
        </ol>

        <h2>Implementation</h2>
        <pre><code>{`# Python — content moderation pipeline
import re
import httpx
from typing import Literal

class ClaimCheck:
    text: str
    status: Literal["verified", "unverified", "refuted"]
    source_url: str | None = None
    confidence: float | None = None

def extract_factual_claims(draft: str) -> list[str]:
    # Naive: extract sentences with proper nouns + numbers + dates
    # Production: use a dedicated claim-extraction model
    sentences = re.split(r'(?<=[.!?])\\s+', draft)
    return [
        s for s in sentences
        if re.search(r'\\b\\d{4}\\b|\\b[A-Z][a-z]+\\s+[A-Z][a-z]+\\b', s)
    ]

def verify_aiml(claim: str) -> ClaimCheck:
    r = httpx.post(
        "https://sourcescore.org/api/v1/verify",
        json={"claim": claim, "minConfidence": 0.85},
        timeout=2.0,
    )
    result = r.json()
    match = result.get("bestMatch")
    if match and match["confidence"] >= 0.85:
        return ClaimCheck(
            text=claim,
            status="verified",
            source_url=match["detailUrl"],
            confidence=match["confidence"],
        )
    return ClaimCheck(text=claim, status="unverified")

def moderate(draft: str) -> dict:
    claims = extract_factual_claims(draft)
    checks = [verify_aiml(c) for c in claims]

    return {
        "draft": draft,
        "claims_checked": len(checks),
        "verified_count": sum(1 for c in checks if c.status == "verified"),
        "unverified_count": sum(1 for c in checks if c.status != "verified"),
        "unverified_claims": [c.text for c in checks if c.status != "verified"],
        "can_auto_publish": all(c.status == "verified" for c in checks),
    }

# In your editorial workflow:
result = moderate(llm_draft)
if result["can_auto_publish"]:
    publish(result["draft"])
else:
    route_to_human_review(result["draft"], result["unverified_claims"])`}</code></pre>

        <h2>Use across editorial workflows</h2>
        <ul>
          <li><strong>Newsletter platforms.</strong> Pre-flight every AI-generated section. Show editors a list of unverified claims with one-click strike-through.</li>
          <li><strong>Auto-summary tools.</strong> Strip claims with confidence &lt; 0.85; let the LLM rewrite around the strikes.</li>
          <li><strong>SEO-content platforms.</strong> Block publish on any unverified factual assertion. Force the writer to either find a source or rephrase.</li>
          <li><strong>Internal company comms.</strong> Verify before sending all-hands or external comms drafted by AI.</li>
        </ul>

        <h2>What this catches vs misses</h2>
        <p>
          Catches well:
        </p>
        <ul>
          <li>Wrong dates (Llama 3 released 2025 — wrong)</li>
          <li>Wrong attributions (Transformer paper by Hinton — wrong)</li>
          <li>Hallucinated specs (32k context window when source says 128k)</li>
          <li>Made-up citations</li>
        </ul>
        <p>
          Doesn&apos;t catch:
        </p>
        <ul>
          <li>Plausible-sounding new claims not in any catalog (genuine ambiguity)</li>
          <li>Style + tone issues</li>
          <li>Bias + misleading framing of correct facts</li>
          <li>Plagiarism / verbatim copy from a source</li>
        </ul>

        <h2>Free-tier viability</h2>
        <p>
          SourceScore VERITAS free tier covers up to 1,000 claim
          verifications per month. For a newsletter publishing 4 issues
          per week × 5 verifiable claims per issue = ~80 verifies/month
          — well within free tier. Higher volume scales to paid tiers
          (€19-€499/month).
        </p>

        <h2>Related</h2>
        <ul>
          <li><a href="/use-cases/rag-pipeline-verification/">RAG verification</a> — adjacent pattern</li>
          <li><a href="/use-cases/customer-support-bot/">Support bot grounding</a> — adjacent</li>
          <li><a href="/blog/llm-grounding-strategies-2026/">Grounding strategies blog post</a></li>
          <li><a href="/concepts/hallucination/">Hallucination categories</a></li>
        </ul>
      </section>
    </article>
  );
}
