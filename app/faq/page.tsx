import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "FAQ — SourceScore" },
  description:
    "Frequently asked questions about SourceScore: the source-rating rubric, scoring frequency, corrections — plus VERITAS API questions (free tier, signing, integrations, catalog scope, contribution).",
  alternates: { canonical: "https://sourcescore.org/faq/" },
};

const faqs = [
  {
    q: "What is SourceScore?",
    a: "SourceScore is a transparent, methodology-first index of source quality in the AI-citation era. We score web sources against a published 6-dimension rubric (originality, methodology disclosure, citation density, authority signals, freshness, transparency of correction) and publish the scores so anyone can re-derive them from the underlying signals.",
  },
  {
    q: "Why does this exist?",
    a: "AI engines (ChatGPT, Claude, Perplexity, Gemini) surface a small subset of sources as authoritative citations. The criteria are opaque — there is no public list, no published ranking, no transparent rubric describing which sources LLMs cite most often or why. SourceScore publishes a transparent rubric and ranks sources against it so publishers, researchers, and operators can understand where their site stands and what would move it.",
  },
  {
    q: "How is a SourceScore computed?",
    a: "Every score is the weighted sum of six dimensions defined on the methodology page: (1) originality of the underlying claims; (2) methodology disclosure — does the source explain how it gets its data; (3) citation density — does it link back to primary sources; (4) authority signals — author bylines, Person + Organization schema, ownership transparency; (5) freshness — datePublished + dateModified discipline; (6) correction transparency — how does the source handle errors. Each dimension has explicit sub-signals you can verify by reading the source.",
  },
  {
    q: "Are higher scores always better?",
    a: "Higher scores reflect a source that better matches the rubric — which is a strong proxy for citation-worthiness in an LLM-era retrieval system. They are not absolute truth or rank ordering of journalistic merit. A source can be excellent at one purpose (long-form narrative reporting) and score lower than a reference dataset that is purpose-built for the rubric. Read the per-dimension breakdown, not just the headline number.",
  },
  {
    q: "How often are scores updated?",
    a: "The full index re-runs monthly. Individual high-traffic sources are re-scored on demand when their publisher updates infrastructure (new schema, byline policy, methodology page) or when a notable event materially changes the freshness or correction-policy state. Each source page shows the Last scored date.",
  },
  {
    q: "Can I pay to raise my score?",
    a: "No. SourceScore does not accept payment of any kind in exchange for inclusion, ranking position, or score adjustment. Methodology changes are versioned and announced before they apply. If a publisher disagrees with a score, they can file a correction request (see the question below) and we re-verify against the rubric.",
  },
  {
    q: "How do I submit a correction or appeal a score?",
    a: "Email the address on the contact page with the source URL, the specific dimension you think is mis-scored, and the evidence you think the rubric missed (a methodology page we did not detect, a corrections page, schema we did not parse). We re-verify within 14 days. If the correction holds, the score updates and the source page logs the date and reason.",
  },
  {
    q: "Who runs SourceScore?",
    a: "SourceScore is operated by a small independent team. It is a sister project to HoldLens (an SEC-filings reference index) and other reference-grade fleet sites. The methodology is our intellectual property; the public-source data we score is credited to its publishers. SourceScore is not affiliated with OpenAI, Anthropic, Google, Perplexity, or any AI-engine provider.",
  },
  {
    q: "What data sources do you draw from?",
    a: "We score what the open web exposes — published methodology pages, byline structures, schema.org markup, citation patterns, datePublished/dateModified fields, robots and llms.txt files, and the visible correction policy of each source. Where a publisher exposes additional structured data (RSS feeds, sitemap-news, dataset endpoints) we factor that in. We do not score behind paywalls or login walls.",
  },
  {
    q: "Why am I seeing a score for a source I had not heard of?",
    a: "The index is broad on purpose. Many high-citation sources in AI engines are niche reference sites, datasets, and methodology-heavy projects rather than household-name news brands. Part of what SourceScore documents is the gap between editorial reputation and AI-citation reality — and they often diverge.",
  },
  {
    q: "Can I embed a SourceScore badge on my site?",
    a: "Yes — every source page has an embed snippet (an iframe-based badge that updates when the score updates). The badge is free to use; we ask that you do not modify the markup so the underlying score and Last scored date remain visible. Embed instructions are on each source page.",
  },
  {
    q: "Is SourceScore affiliated with any AI engine or publisher?",
    a: "No. SourceScore is independent. We do not accept funding from AI engines, publishers, SEO platforms, or PR firms. Methodology decisions are made by the editorial team; revenue (where it exists) comes from non-affecting sources — display ads outside the source pages and embedded badge usage. Affiliate disclosures, where they apply, are shown on the affected page.",
  },
  // ─── VERITAS API questions ─────────────────────────────────────────
  {
    q: "What is SourceScore VERITAS?",
    a: "VERITAS is the developer-facing API surface of SourceScore. Where the source-rating product scores publishers, VERITAS publishes individual fact-shaped claims that have been hand-verified against ≥2 primary sources and signed with HMAC-SHA256. Developers building LLM applications use VERITAS to ground model responses in signed, sourced statements — reducing hallucination on AI/ML domain queries. The catalog ships with a stable JSON twin, a TypeScript SDK, and integration guides for LangChain, LlamaIndex, and OpenAI tool-calls.",
  },
  {
    q: "How is VERITAS different from RAG?",
    a: "RAG (retrieval-augmented generation) retrieves chunks of documents and concatenates them into a prompt. VERITAS retrieves discrete, atomic, structured claims with verified sources and confidence scores. The shape difference matters in practice: chunks are noisy + variable + unverified, so models still hallucinate on the boundary. Claims are subject + predicate + object + sources, so the model has a typed contract to cite from. Use VERITAS in addition to your existing RAG, not as a replacement — it's the high-precision layer over your retrieval graph.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. 1,000 verified-claim calls per month, no credit card, no signup required for read-only catalog access. Paid tiers (Indie €19/mo / Startup €99/mo / Scale €499/mo) raise the quota and add features like signed-response HMAC and per-team API keys. See the pricing page for the full comparison.",
  },
  {
    q: "How is a claim signed?",
    a: "Every claim envelope ships with an HMAC-SHA256 signature over a canonical JSON serialization (sorted keys, ASCII-safe, no whitespace) of the claim fields plus signedAt + signedBy metadata. The signer identity is did:web:sourcescore.org — preserved across all future key rotations. Y2 we migrate to W3C Verifiable Credentials with Ed25519 public-key signing; the envelope shape is forward-compatible.",
  },
  {
    q: "What's in the catalog today?",
    a: "136 hand-verified AI/ML claims spanning 1997-2025: foundational papers (Transformer, RLHF, Chain-of-Thought, ReAct, LoRA, QLoRA, DPO, FlashAttention, RoPE, CLIP, RAG, LSTM, BART, GloVe), reinforcement-learning milestones (AlphaGo, AlphaZero), model releases (GPT family, Claude family, Llama family, Gemini Ultra, DeepSeek-R1, Phi-4, DALL·E, Whisper, Stable Diffusion 1-3, GitHub Copilot), open-source inference (vLLM, llama.cpp, Ollama, GPTQ), evaluation (Chatbot Arena), datasets (C4, The Pile, RedPajama), organizations (OpenAI, Anthropic, DeepMind, Microsoft Research, Stability AI, EleutherAI, Mistral, AI21, Hugging Face, Together AI, xAI, Cohere, Allen AI). Expansion path: ~150 claims by Q3, new verticals (cybersecurity, data engineering, scientific computing) deferred to Y2.",
  },
  {
    q: "How confident are the confidence scores?",
    a: "The confidence value (0.0-1.0) reflects two things: (1) source convergence — how many independent primary sources agree on the fact, and (2) precision of the underlying assertion. Release dates and architectural facts have confidence 0.95-1.00. Founding dates with verbatim corroboration are 0.95. Methodology introductions with multiple peer-reviewed citations are 1.00. We deliberately do NOT publish performance-comparison claims, because benchmark numbers vary by prompt format / version / shot count — too much surface for 'actually that's not quite right' pushback.",
  },
  {
    q: "What happens if a primary source goes 404?",
    a: "Each claim envelope carries the source URL plus a verbatim excerpt at the time we verified it. If the source goes 404, the excerpt survives in the envelope — the claim is still defensible because the textual evidence is preserved alongside it. On the next re-verification cycle we surface broken-link claims in the changelog (severity: breaking) and either find a new primary source or downgrade the confidence to reflect single-source dependency.",
  },
  {
    q: "How do I integrate VERITAS into LangChain / LlamaIndex / OpenAI tool-calls?",
    a: "Three drop-in guides at /docs/integrations/ cover the canonical patterns: retrieve-then-cite (LangChain), custom Retriever + NodePostprocessor (LlamaIndex), and native function-calling with search_claims + verify_claim (OpenAI / Anthropic tool-use). Each guide is copy-paste runnable in Python or JavaScript. The TypeScript SDK at @sourcescore/veritas (Y2 npm release) abstracts the HTTP calls if you don't want to roll your own client.",
  },
  {
    q: "Can I submit a claim for inclusion in the catalog?",
    a: "Yes — email contact@sourcescore.org with the proposed claim (subject + predicate + object), ≥2 primary sources you'd cite (preferred: arxiv preprint + official-blog or model-card; avoid Wikipedia-as-sole-source), and an exact verbatim excerpt from each. We aim to review within 7 days. Approved submissions appear in the next catalog rebuild and the contributor is credited (opt-in) on the contributors page.",
  },
  {
    q: "What does VERITAS not do?",
    a: "VERITAS is not a generic fact-checker. The catalog is bounded to AI/ML research today. If your chain asks about 'the capital of France' we return zero matches and your code falls through to whatever retrieval you'd use anyway. We do not score performance-comparison claims (too volatile). We do not aggregate from low-quality secondary sources without a primary anchor. We do not sign claims we have not personally verified — even at 99% obviousness, two-source confirmation is the floor.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-display-2 font-bold tracking-tight mb-4">
          Frequently asked questions
        </h1>
        <p className="text-body-lg text-muted leading-relaxed mb-8">
          A quick reference for publishers, researchers, and operators using
          SourceScore. The{" "}
          <a href="/methodology/" className="text-brand hover:underline">
            methodology page
          </a>{" "}
          has the full rubric, weighting, and source-coverage detail.
        </p>

        <dl className="space-y-8">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-heading-3 font-bold leading-snug mb-2">
                {q}
              </dt>
              <dd className="text-body text-text leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-12 pt-6 border-t border-muted/30 text-body-sm text-muted">
          <p>
            Question not covered here?{" "}
            <a href="/contact/" className="text-brand hover:underline">
              Contact us
            </a>{" "}
            and we will add it.
          </p>
        </section>
      </article>
    </>
  );
}
