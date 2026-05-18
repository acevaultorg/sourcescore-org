// /concepts/citation-chain/ — 4th pillar. High-intent search queries:
// "verify llm citations", "citation chain verification", "signed citations
// llm", "llm provenance graph", "agent traceability". Compounds with
// llm-grounding, hallucination, rag-vs-veritas.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE = "Citation chains — verifiable provenance for LLM-generated assertions";
const SUBTITLE =
  "A citation chain is the auditable trail from an LLM's emitted claim back to the primary source that proves it. Three building blocks make a chain inspectable: stable identifiers, signed envelopes, and re-fetchable canonical URLs. Here's how they fit together.";
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
  dateModified: PUBLISHED,
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
    "The auditable trail linking an LLM's emitted assertion to the primary source(s) that prove it. Three building blocks: a stable identifier for the claim, a cryptographic signature over the canonical claim fields, and a re-fetchable URL where the verbatim source excerpts live. Together these let a downstream consumer verify a claim wasn't fabricated, wasn't modified in transit, and traces back to an actual human-authored document.",
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
          prove it. Three building blocks make a chain inspectable:
        </p>
        <ol>
          <li>
            <strong>Stable identifier</strong> — every claim has a
            content-addressable ID that doesn&apos;t move when wording
            shifts. If the canonical fields (subject, predicate, object)
            change, the ID changes too — a brand-new claim, distinguishable
            from the original.
          </li>
          <li>
            <strong>Cryptographic signature</strong> — the claim envelope
            ships with an HMAC-SHA256 or Ed25519 signature over its
            canonical serialization. A downstream consumer can re-compute
            the signature and prove the envelope wasn&apos;t modified
            in transit.
          </li>
          <li>
            <strong>Re-fetchable canonical URL</strong> — the chain leads
            to a stable URL where the verbatim source excerpts live.
            Even if the original sources go 404, the excerpts preserved
            in the envelope mean the textual evidence is preserved
            alongside the claim ID.
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
          A citation chain makes fabrication detectable:
        </p>
        <ul>
          <li>
            The ID either resolves to a real envelope or it doesn&apos;t
          </li>
          <li>
            The signature either verifies or it doesn&apos;t
          </li>
          <li>
            The canonical URL either loads with matching content or it
            doesn&apos;t
          </li>
        </ul>
        <p>
          Three independent checkpoints. An attacker would have to forge
          all three to bypass the chain. Compare against unauditable
          citations where the only check is &quot;does it sound real?&quot;
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
  "signature": {                       // ← cryptographic proof of integrity
    "algorithm": "HMAC-SHA256",
    "signedBy": "did:web:sourcescore.org",
    "signedAt": "2026-05-16T00:00:00.000Z",
    "signature": "cfdd0b49ce576bd42e17ba4caa0b64cd..."
  },
  "citedAs": "Transformer architecture introduced in paper: ... — SourceScore Claim ad17e76a8baad7a1 (verified 2026-05-16). https://sourcescore.org/claims/ad17e76a8baad7a1/"
}`}</code></pre>
        <p>
          Three orthogonal verifications are possible from a single
          envelope: ID lookup, signature re-compute, URL re-fetch.
        </p>

        <h2 id="verification">How to verify a chain locally</h2>
        <p>
          A consumer of a VERITAS claim envelope can perform all three
          checks in a few lines of code:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import hmac, hashlib, json, requests

def verify_chain(envelope: dict, shared_secret: str) -> dict:
    claim = envelope["claim"]
    sig   = envelope["signature"]

    # Check 1 — re-fetch the canonical URL and compare
    canonical = requests.get(envelope["canonical"]).text
    url_ok = claim["id"] in canonical  # canonical page shows claim id

    # Check 2 — re-compute HMAC-SHA256 over canonical-JSON of claim + signing metadata
    payload = json.dumps(
        {**claim, "signedAt": sig["signedAt"], "signedBy": sig["signedBy"]},
        sort_keys=True, separators=(",", ":"), ensure_ascii=False
    ).encode()
    expected = hmac.new(shared_secret.encode(), payload, hashlib.sha266).hexdigest()
    sig_ok = hmac.compare_digest(expected, sig["signature"])

    # Check 3 — at least one source URL must still be reachable
    sources_ok = any(requests.head(s["url"], timeout=4).ok for s in claim["sources"])

    return {"url_ok": url_ok, "sig_ok": sig_ok, "sources_ok": sources_ok,
            "verified": all([url_ok, sig_ok, sources_ok])}
`}</code></pre>
        <p>
          Three independent signals. Each can be inspected separately.
          A failure in any one tells you something different — URL not
          found means catalog moved, signature mismatch means the
          envelope was modified, source 404 means the original document
          went away (the verbatim excerpt in the envelope is still your
          fallback evidence).
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
          badge. Click → expand the chain → see sources, signature,
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
            <strong>Modified-in-transit envelopes</strong> — someone
            edits the claim text but the signature doesn&apos;t match
            recomputed value. Surface as &quot;⚠ tampered.&quot;
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
          The current state of the art (2026) ships HMAC-SHA256 with
          shared secrets. Two evolutions are visible on the horizon:
        </p>
        <ul>
          <li>
            <strong>W3C Verifiable Credentials</strong> — replaces
            shared-secret HMAC with public-key signing (Ed25519). Any
            consumer can verify without sharing a secret. SourceScore
            plans to migrate VERITAS Y2; envelope shape is
            forward-compatible.
          </li>
          <li>
            <strong>Decentralized verification networks</strong> —
            instead of one signing authority (did:web:sourcescore.org),
            multiple independent verifiers cross-sign claims. Reduces
            single-point-of-trust failure. Early networks like Knowledge
            Graph Verifiers and Verifiable Provenance Networks are
            emerging.
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
            <a href="/security/">Security policy</a> — signing key rotation, disclosure, signing identity
          </li>
          <li>
            <a href="/claims/">Browse the catalog</a> — every claim ships with a full chain
          </li>
        </ul>
      </section>
    </article>
  );
}
