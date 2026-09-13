// /use-cases/news-fact-checking/ — AI-assisted newsroom verification.
//
// Buyer-intent SEO target: newsroom tech leads searching for "AI fact
// checking API news", "ChatGPT newsroom hallucination", "Bloomberg AI
// retraction prevention", etc. Aleyda Solis 10-char #10 Transactable
// — every page has clear next-action (free tier, integration, contact).

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "News fact-checking — AI-assisted evidence review for newsrooms";
const SUBTITLE =
  "Use SourceScore's bounded AI/ML catalog to find candidate evidence for newsroom review. It can support an editor; it cannot verify a draft or replace live-news research.";
const CANONICAL = "https://sourcescore.org/use-cases/news-fact-checking/";
const PUBLISHED = "2026-05-17";

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
  "@type": "TechArticle",
  headline: TITLE,
  description: SUBTITLE,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  mainEntityOfPage: CANONICAL,
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
  about: [
    { "@type": "Thing", name: "News fact-checking" },
    { "@type": "Thing", name: "AI hallucination prevention" },
    { "@type": "Thing", name: "Newsroom tooling" },
    { "@type": "Thing", name: "Journalism AI" },
    { "@type": "Thing", name: "ClaimReview" },
  ],
};

export default function NewsFactCheckingPage() {
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
              { name: "News fact-checking", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/use-cases/" className="hover:underline">Use cases</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">News fact-checking</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Use case · Newsroom AI · Fact-checking
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>The newsroom AI problem</h2>
        <p>
          Newsroom-facing LLM tools — explainer-bot drafts, archive-search
          summaries, breaking-news context briefs, beat-reporter assistants
          — hallucinate at deadline pressure. The retraction cost is high:
          editorial credibility erodes once, never fully recovers. Even
          one wrong attribution in an AI-generated paragraph published
          to 100k readers becomes a permanent reputational artifact.
        </p>
        <p>
          Published examples of newsroom hallucinations include: incorrect
          attributions to scientists, mis-dated paper releases, fabricated
          dataset sizes, made-up regulatory actions, and incorrect
          historical context. Each is a fact a 30-second human verifier
          could have caught — but at 50 articles/day per beat, manual
          verification doesn&apos;t scale.
        </p>

        <h2>What catalog retrieval adds to your workflow</h2>
        <p>
          SourceScore VERITAS provides an API where:
        </p>
        <ul>
          <li>
            Each claim cites <strong>primary evidence</strong>; 368 of 384
            current claims have two or more sources. Sources are shown with publisher
            name, publication date, and verbatim excerpt ≤200 chars.
          </li>
          <li>
            Records include <strong>SourceScore-issued HMAC integrity metadata</strong>.
            It is not publicly independently verifiable; use the canonical URL
            locally; tamper-detection is mechanical.
          </li>
          <li>
            Claim pages include <strong>ClaimReview schema.org markup</strong>
            so consumers can inspect a machine-readable review record. Search
            features and eligibility are controlled by search platforms.
          </li>
          <li>
            <strong>Stable claim IDs</strong> (16-hex SHA-256 of canonical
            fields) — re-fetchable and citeable. Always re-fetch before use
            because catalog records and supporting evidence can be corrected.
          </li>
        </ul>

        <h2>Integration patterns for newsroom workflows</h2>

        <h3>Pattern 1 — Pre-publish evidence-review queue</h3>
        <p>
          After an editorial AI draft is generated, parse out atomic
          factual claims, retrieve possible catalog records, and send both
          matches and misses to an editor or entailment check. Never approve a
          draft solely because every assertion produced a similar record.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`# Python — pre-publish gate
import requests

def find_candidate(claim_text: str) -> dict | None:
    r = requests.post(
        "https://sourcescore.org/api/v1/verify",
        json={"claim": claim_text, "minConfidence": 0.85},
        timeout=8,
    )
    return r.json().get("bestMatch")

def gate_draft(draft: str, atomic_claims: list[str]) -> dict:
    candidates, no_matches = [], []
    for c in atomic_claims:
        match = find_candidate(c)
        (candidates if match else no_matches).append({
            "claim": c,
            "match": match,
        })
    return {
        "draft": draft,
        "candidate_count": len(candidates),
        "no_match_count": len(no_matches),
        "review_queue": candidates + no_matches,
        "publish_ready": False,  # requires editorial/evidence review
    }`}</code></pre>

        <h3>Pattern 2 — In-line citation injection</h3>
        <p>
          When a draft references a verifiable fact (model release date,
          regulatory milestone, paper publication), inject a footnote
          link to the canonical SourceScore claim page. Readers get an
          auditable trail; the publication gets E-E-A-T credibility lift.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`# Inject [^1] footnotes
def cite_reviewed(draft: str, reviewed: list[dict]) -> str:
    cited = draft
    for i, v in enumerate(reviewed, 1):
        match = v["match"]
        footnote = (
            f'[^{i}]: SourceScore Claim '
            f'<{match["id"]}>, sourcescore.org/claims/{match["id"]}/, '
            f'record reviewed {match["lastVerified"]}.'
        )
        cited += "\\n\\n" + footnote
    return cited`}</code></pre>

        <h3>Pattern 3 — Beat-reporter assistant grounding</h3>
        <p>
          For an AI assistant covering an AI/ML beat, wire VERITAS in as
          one bounded retrieval source. Require
          a separate evidence comparison before the assistant emits a factual
          assertion.
        </p>

        <h2>What this use-case catches</h2>
        <ul>
          <li>
            Model release dates (the most common factual hallucination)
          </li>
          <li>
            Foundational paper authorship + publication dates
          </li>
          <li>
            Parameter counts, context windows, training compute claims
          </li>
          <li>
            Organizational facts (founding dates, funding rounds, head
            counts when reported)
          </li>
          <li>
            Benchmark scores when explicitly published
          </li>
        </ul>

        <h2>What this use case does not cover</h2>
        <ul>
          <li>
            Live breaking-news claims (catalog is curated, not real-time)
          </li>
          <li>
            Political claims (out of scope; v0 = AI/ML vertical only)
          </li>
          <li>
            Health or medical claims
          </li>
          <li>
            Hyperlocal / niche-publication claims (catalog is global tech)
          </li>
        </ul>
        <p>
          For these, use existing newsroom fact-check tooling (Snopes
          API, ClaimBuster, manual desk-reference) alongside VERITAS.
          The two complement; they don&apos;t replace each other.
        </p>

        <h2>Compatibility with Google Fact Check Tools</h2>
        <p>
          Every <code>/claims/[id]/</code> page emits ClaimReview JSON-LD
          per <a href="https://schema.org/ClaimReview" target="_blank" rel="noopener noreferrer">schema.org/ClaimReview</a>.
          Search platforms decide whether to index or display that markup.
          For newsroom publications running their own ClaimReview,
          VERITAS envelopes can be embedded as primary-source citations
          in your own ClaimReview <code>itemReviewed</code> blocks.
        </p>

        <h2>Economics for newsrooms</h2>
        <ul>
          <li>
            <strong>Public API:</strong> free with no account or key; suitable
            for evaluation subject to standard network abuse controls.
          </li>
        </ul>
        <p>
          See <a href="/pricing/" className="underline">pricing</a> for the
          proposed higher-volume demand test. No paid access, dedicated
          support, terms, or SLA is live.
        </p>

        <h2>Getting started</h2>
        <ol>
          <li>
            Read the{" "}
            <a href="/quickstart/" className="underline">5-minute quickstart</a>
            {" "}— curl + Python + JS examples in one page.
          </li>
          <li>
            Browse the{" "}
            <a href="/claims/" className="underline">384 verified claims</a>
            {" "}— check whether your beat&apos;s common facts are
            covered before integrating.
          </li>
          <li>
            Sketch the integration pattern that fits your workflow
            (pre-publish gate, in-line citations, beat-assistant
            grounding).
          </li>
          <li>
            Email{" "}
            <a href="/contact/" className="underline">contact</a>
            {" "}to join the higher-volume access demand test; no paid
            newsroom tier is currently for sale.
          </li>
        </ol>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/use-cases/content-moderation/">Content moderation</a>
            {" "}— pre-publish gate for non-news editorial AI
          </li>
          <li>
            <a href="/use-cases/research-citation/">Research citation</a>
            {" "}— citation tooling for research-AI workflows
          </li>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a>
            {" "}— the broader pattern this use-case implements
          </li>
          <li>
            <a href="/topics/rag-and-retrieval/">Topic hub: RAG + retrieval</a>
            {" "}— foundational grounding patterns
          </li>
          <li>
            <a href="/methodology/">Verification methodology</a>
            {" "}— full rubric, signing model, tier definitions
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Newsroom integration questions? Email{" "}
          <a href="/contact/" className="underline">contact</a>
          {" "}— share your needs; no paid enterprise terms or SLA are live.
        </p>
      </footer>
    </article>
  );
}
