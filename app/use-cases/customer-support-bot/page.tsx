// /use-cases/customer-support-bot/ — chatbot grounding pattern.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Customer-support chatbot grounding — stop bots from hallucinating product facts";
const SUBTITLE =
  "Production support bots hallucinate pricing, release dates, integration details. Add a verify layer on top of RAG over your docs; users see accurate citations or 'I'm not sure'.";
const CANONICAL = "https://sourcescore.org/use-cases/customer-support-bot/";

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

export default function CustomerSupportBotPage() {
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
              { name: "Customer-support bot grounding", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/use-cases/" className="hover:underline">Use cases</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Customer-support bot</span>
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
          Customer support chatbots hallucinate things customers
          actually care about: pricing tiers, integration partners,
          rate limits, supported regions, refund policies, model
          context windows. A bot telling a paying customer "Sure, your
          Pro tier supports unlimited API calls" when the real answer
          is 50k/month creates a billing dispute + trust collapse +
          maybe a chargeback.
        </p>
        <p>
          Standard RAG over your help docs catches most factual
          questions, but the tail of failure modes — wrong number on
          the right doc, fabricated integration, made-up rate limit —
          is what dings trust.
        </p>

        <h2>The pattern</h2>
        <p>
          Three-layer architecture:
        </p>
        <ol>
          <li>
            <strong>RAG over your docs.</strong> Index your help center,
            API docs, pricing pages. Standard retrieval.
          </li>
          <li>
            <strong>Check atomic claims in the response.</strong>{" "}
            Extract assertions (prices, limits, dates, features) and
            compare each with an authoritative product-facts catalog. For your
            product&apos;s claims, you maintain the catalog. For
            AI/ML claims, SourceScore VERITAS can retrieve candidate records,
            but a separate comparison or human review must decide support.
          </li>
          <li>
            <strong>Decline unsupported claims.</strong> If the bot
            would emit a claim and the support check fails, the bot says
            &quot;I&apos;m not sure — let me get a human.&quot; The cost
            of declining is much lower than the cost of being wrong.
          </li>
        </ol>

        <h2>Implementation sketch</h2>
        <pre><code>{`# Two-catalog setup: your-own + SourceScore VERITAS

# 1. Build your own reviewed catalog of product facts.
#    (Pricing, rate limits, feature support, etc.)
#    Update it whenever pricing/features change.
#    JSON file or simple key-value DB.
PRODUCT_FACTS = {
    # Hypothetical placeholders: replace from your current source of truth.
    "pro_tier_monthly_calls": "<current documented limit>",
    "scale_tier_monthly_calls": "<current documented limit>",
    "billing_supported": "<current documented value>",
    "free_tier_signup_required": "<current documented value>",
    # ...
}

# 2. For AI/ML factual claims (if user asks about Llama 3.1, Claude,
#    etc.), use SourceScore VERITAS.
import httpx

def find_aiml_candidate(claim_text: str) -> dict | None:
    r = httpx.post(
        "https://sourcescore.org/api/v1/verify",
        json={"claim": claim_text, "minConfidence": 0.85},
        timeout=2.0,
    )
    result = r.json()
    return result.get("bestMatch")

# 3. In the bot's response pipeline:
async def respond(user_question: str):
    # Standard RAG
    retrieved = await rag.retrieve(user_question, k=5)
    draft = await llm.generate(user_question, context=retrieved)

    # Extract atomic claims from draft
    claims = extract_atomic_claims(draft)

    supported = []
    needs_review = []
    for c in claims:
        if c.matches_product_pattern():
            ok = verify_against_product_facts(c, PRODUCT_FACTS)
        else:
            candidate = find_aiml_candidate(c.text)
            # Implement entailment or human review here. Similarity alone is
            # not proof that candidate.statement supports c.text.
            ok = candidate is not None and supports_assertion(c.text, candidate)
        (supported if ok else needs_review).append(c)

    if needs_review:
        # Don't ship the response with claims that still need review
        return (
            "I'm not 100% certain about one or more facts in my "
            "answer. Let me transfer you to a human teammate."
        )

    return draft  # Every claim passed the application's support check`}</code></pre>

        <h2>What this catches</h2>
        <ul>
          <li><strong>Wrong pricing.</strong> Bot says &quot;€199/month&quot; when the actual price is &quot;€499/month&quot; — product-facts catalog catches it.</li>
          <li><strong>Hallucinated integrations.</strong> Bot says &quot;Yes, we integrate with Zapier&quot; when you don&apos;t — catalog catches it.</li>
          <li><strong>Potentially wrong AI/ML facts.</strong> VERITAS can surface a nearby cited record for comparison; your support check must decide whether it contradicts or supports the bot.</li>
          <li><strong>Stale info.</strong> Bot uses 2-year-old training data for current pricing — catalog (which you update on pricing changes) catches it.</li>
        </ul>

        <h2>The escape valve: route to human</h2>
        <p>
          The bot doesn&apos;t need to answer everything. Routing to
          a human for unverifiable claims is a feature, not a bug.
          Optimize for supported answers and safe handoffs, not the highest
          automation percentage. Measure incorrect-answer cost, handoff rate,
          and time to resolution on your own labeled support conversations.
        </p>

        <h2>Free-tier economics</h2>
        <ul>
          <li>SourceScore VERITAS public API: free with no account, key, or signup.</li>
          <li>One network request per VERITAS call. Set a timeout and measure in your own stack.</li>
          <li>Your product-facts catalog: cost = engineering time to maintain (small).</li>
          <li>Higher-volume paid access is a demand test only; no paid plan or SLA is live.</li>
        </ul>

        <h2>Related</h2>
        <ul>
          <li><a href="/use-cases/ai-agent-grounding/">AI agent grounding</a> — broader agent pattern</li>
          <li><a href="/use-cases/rag-pipeline-verification/">RAG pipeline verification</a> — closing the right-doc-wrong-number gap</li>
          <li><a href="/concepts/llm-grounding/">LLM grounding concept pillar</a></li>
          <li><a href="/blog/llm-grounding-strategies-2026/">Six grounding strategies blog post</a></li>
        </ul>
      </section>
    </article>
  );
}
