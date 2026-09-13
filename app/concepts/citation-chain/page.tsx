// /concepts/citation-chain/ — 4th pillar. High-intent search queries:
// "verify llm citations", "citation chain verification", "signed citations
// llm", "llm provenance graph", "agent traceability". Compounds with
// llm-grounding, hallucination, rag-vs-veritas.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const MODIFIED = "2026-09-13";
const TITLE = "Citation chains — inspectable provenance for LLM-generated assertions";
const SUBTITLE =
  "A citation chain is the auditable trail from an LLM's emitted claim to the evidence meant to support it. Stable identifiers, source-issued integrity metadata, and re-fetchable URLs make that trail inspectable—with important limits.";
const SLUG = "citation-chain";
const CANONICAL = `https://sourcescore.org/concepts/${SLUG}/`;

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
  dateModified: MODIFIED,
  mainEntityOfPage: CANONICAL,
  author: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    url: "https://sourcescore.org",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://sourcescore.org/#organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  about: [
    { "@type": "Thing", name: "Citation chain" },
    { "@type": "Thing", name: "LLM provenance" },
    { "@type": "Thing", name: "Claim verification" },
    { "@type": "Thing", name: "Signed citations" },
  ],
};

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Citation chain",
  description:
    "The auditable trail linking an LLM's emitted assertion to the evidence meant to support it. Stable identifiers and re-fetchable canonical records let consumers inspect the trail. SourceScore records also carry source-issued HMAC metadata, but the unpublished secret means that tag is not independently verifiable by public users.",
  inDefinedTermSet: "https://sourcescore.org/concepts/",
  url: CANONICAL,
};

export default function CitationChainConcept() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Concepts", url: "https://sourcescore.org/concepts/" },
              { name: "Citation chain", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Citation chain</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Concept · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2 id="definition">Definition</h2>
        <p>
          A <strong>citation chain</strong> is the auditable trail linking
          an LLM&apos;s emitted assertion to the primary source(s) that
          are meant to support it. Three building blocks make a chain inspectable:
        </p>
        <ol>
          <li>
            <strong>Stable identifier</strong> — every claim has a
            stable ID for the published record. A material change to the
            canonical claim fields creates a different record and ID.
          </li>
          <li>
            <strong>Integrity metadata</strong> — the claim envelope
            includes a SourceScore-issued HMAC-SHA256 tag over its
            canonical serialization. SourceScore can recompute this tag, but
            public users cannot because the shared secret is not published.
          </li>
          <li>
            <strong>Re-fetchable canonical URL</strong> — the chain leads
            to a stable URL where the verbatim source excerpts live.
            Excerpts are preserved alongside the claim ID, but an excerpt is
            not a substitute for independently checking the original source.
          </li>
        </ol>

        <h2 id="why-it-matters">Why chains matter</h2>
        <p>
          LLMs can fabricate citations. Without an external trail, a
          generated reference like &quot;[Smith et al., 2024]&quot;
          looks identical whether the paper exists or doesn&apos;t.
          The model produces both real and fake citations with the same
          fluency.
        </p>
        <p>
          A citation chain makes several failure modes easier to detect:
        </p>
        <ul>
          <li>
            The ID either resolves to a real envelope or it doesn&apos;t
          </li>
          <li>
            A fresh API record either matches the copy you received or it does not
          </li>
          <li>
            The canonical URL either loads with matching content or it
            doesn&apos;t
          </li>
        </ul>
        <p>
          These are inspectable checks, not proof that the underlying claim is
          true. The cited evidence still needs editorial or application-specific
          review.
        </p>

        <h2 id="anatomy">Anatomy of a SourceScore chain</h2>
        <p>
          Every claim in the VERITAS catalog ships with a full chain:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "canonical": "https://sourcescore.org/claims/<id>/",
  "claim": {
    "id": "ad17e76a8baad7a1",         // ← stable identifier
    "vertical": "ai-ml",
    "subject": "Transformer architecture",
    "predicate": "introduced_in_paper",
    "object": "Attention Is All You Need (Vaswani et al., 2017)",
    "statement": "...",
    "confidence": 1.0,
    "sources": [                       // ← primary sources with verbatim excerpts
      { "url": "https://arxiv.org/abs/1706.03762",
        "title": "Attention Is All You Need",
        "publisher": "arXiv (Vaswani, Shazeer, ...)",
        "publishedDate": "2017-06-12",
        "excerpt": "We propose a new simple network architecture, ..." },
      { "url": "https://papers.nips.cc/paper/2017/hash/...",
        "title": "Attention Is All You Need (NeurIPS 2017)",
        "publisher": "NeurIPS Foundation",
        "publishedDate": "2017-12-04" }
    ],
    "tags": ["transformer", "attention", "foundational"]
  },
  "signature": {                       // ← SourceScore-issued HMAC metadata
    "algorithm": "HMAC-SHA256",
    "signedBy": "did:web:sourcescore.org",
    "signedAt": "2026-05-16T00:00:00.000Z",
    "signature": "cfdd0b49ce576bd42e17ba4caa0b64cd..."
  },
  "citedAs": "Transformer architecture introduced in paper: ... — SourceScore Claim ad17e76a8baad7a1 (verified 2026-05-16). https://sourcescore.org/claims/ad17e76a8baad7a1/"
}`}</code></pre>
        <p>
          Public users can resolve the ID, refetch the current record, and
          inspect its cited evidence. They cannot independently recompute the
          HMAC tag without SourceScore&apos;s unpublished secret.
        </p>

        <h2 id="verification">How to inspect a chain locally</h2>
        <p>
          A consumer can compare a received envelope with the current canonical
          API record and collect the cited source URLs for review:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import requests

def inspect_chain(envelope: dict) -> dict:
    claim = envelope["claim"]

    # Check 1 — the public claim page still resolves
    page = requests.get(envelope["canonical"], timeout=8)
    page_ok = page.ok and claim["id"] in page.text

    # Check 2 — compare with SourceScore's current JSON record
    api_url = f"https://sourcescore.org/api/v1/claims/{claim['id']}.json"
    current = requests.get(api_url, timeout=8).json()
    matches_current = current.get("claim") == claim

    # Check 3 — hand the original evidence URLs to your review layer
    source_urls = [source["url"] for source in claim.get("sources", [])]

    return {"page_ok": page_ok, "matches_current": matches_current,
            "source_urls": source_urls, "hmac_publicly_verifiable": False}
`}</code></pre>
        <p>
          A missing page, record mismatch, or unsupported source citation is a
          reason to withhold a verified label. Matching SourceScore&apos;s current
          copy shows consistency with the publisher&apos;s canonical record; it is
          not independent cryptographic authentication or proof of truth.
        </p>

        <h2 id="chains-and-agents">Chains and LLM agents</h2>
        <p>
          When an LLM agent generates a multi-step response, each
          intermediate assertion can be linked into a chain. The final
          output then includes a tree of citation chains — one per
          asserted fact:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`{
  "answer": "The Transformer architecture was introduced in 2017 [ad17e76a8baad7a1]. " +
            "It uses self-attention [ad17e76a8baad7a1] and is the substrate of GPT-4 [ce8a...].",
  "chains": {
    "ad17e76a8baad7a1": { ...full envelope... },
    "ce8a4b2c...":      { ...full envelope... }
  }
}`}</code></pre>
        <p>
          The downstream UI can render each citation as a clickable
          badge. Click → expand the chain → see sources, integrity metadata,
          confidence. Users get human-readable answers plus auditable
          provenance, available on demand.
        </p>

        <h2 id="failure-modes">Failure modes citations chains catch</h2>
        <ol>
          <li>
            <strong>Fabricated IDs</strong> — model invents a claim ID
            that doesn&apos;t resolve. Lookup fails. Surface as
            &quot;⚠ unverified&quot; in UI.
          </li>
          <li>
            <strong>Record mismatches</strong> — a received copy differs from
            the current canonical API record. Surface it as changed or
            unverified; public users cannot use the HMAC alone to identify why.
          </li>
          <li>
            <strong>Stale citations</strong> — claim ID resolves but the
            envelope&apos;s <code>lastVerified</code> date is months
            old. UI may downgrade confidence or trigger re-verification.
          </li>
          <li>
            <strong>Misattribution</strong> — chain leads to a real
            source but the excerpt doesn&apos;t actually support the
            claim. Caught by human review at re-verification cadence,
            not by chain mechanics directly — but the verbatim excerpt
            makes the misattribution visible.
          </li>
        </ol>

        <h2 id="future-roadmap">Where chains are heading</h2>
        <p>
          Public HMAC tags do not provide independent verification without a
          published shared secret. SourceScore does not currently offer one.
        </p>
        <ul>
          <li>
            <strong>Public-key signatures</strong> would let any consumer
            verify record integrity without a shared secret. SourceScore has
            not shipped or committed to that migration.
          </li>
          <li>
            <strong>Independent evidence review</strong> remains necessary
            even with public-key signatures: cryptography can authenticate
            bytes, but it cannot prove that cited evidence supports a claim.
          </li>
        </ul>

        <h2 id="references">Further reading</h2>
        <ul>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a> — the broader concept chains support
          </li>
          <li>
            <a href="/concepts/hallucination/">LLM hallucination</a> — what chains help detect
          </li>
          <li>
            <a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a> — citations from each pattern compared
          </li>
          <li>
            <a href="/docs/integrations/langchain/">LangChain integration</a> — chains in a LangChain pipeline
          </li>
          <li>
            <a href="/security/">Security policy</a> — disclosure and integrity-metadata limits
          </li>
          <li>
            <a href="/claims/">Browse the catalog</a> — every claim ships with a full chain
          </li>
        </ul>
      </section>
    </article>
  );
}
