// VERITAS-Reborn launch post — canonical URL for Dev.to / Hashnode
// cross-posts to rel="canonical" back to.
//
// Rationale: per rules/aceusergrowth.md Part 2 canonical-cross-post
// pattern, originating the launch post on sourcescore.org first lets us
// claim SEO authority while still amplifying via Dev.to + Hashnode (which
// honor rel=canonical, transferring link equity back to the origin).

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-16";
const TITLE =
  "Stop hallucinating: a developer API for grounding LLM responses with signed, sourced claims";
const SUBTITLE =
  "VERITAS is a free-tier-friendly API that returns hand-verified AI/ML claims with their primary sources, an HMAC-SHA256 signature, and a ready-to-paste citation.";
const SLUG = "launching-veritas";
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
    { "@type": "Thing", name: "LLM grounding" },
    { "@type": "Thing", name: "Retrieval-Augmented Generation" },
    { "@type": "Thing", name: "Claim verification API" },
    { "@type": "Thing", name: "HMAC-SHA256 signing" },
  ],
};

export default function LaunchPost() {
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
              { name: "Launching VERITAS", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <a href="/blog/" className="hover:underline">
          Blog
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Launching VERITAS</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Launch post · {PUBLISHED}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{TITLE}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">{SUBTITLE}</p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none leading-relaxed space-y-5">
        <blockquote>
          <strong>TL;DR</strong>: I just shipped{" "}
          <a href="/claims/">SourceScore VERITAS</a> — a free-tier-friendly API
          that returns hand-verified AI/ML claims with their primary sources,
          an HMAC-SHA256 signature, and a ready-to-paste citation. 51 claims
          at launch; expanding to 5,000+ this year.{" "}
          <code>curl https://sourcescore.org/api/v1/claims.json</code> and
          you&rsquo;re in.
        </blockquote>

        <p>
          If you&rsquo;ve built anything on top of an LLM in the last two
          years, you&rsquo;ve watched it confidently invent facts that
          don&rsquo;t exist. You&rsquo;ve seen GPT-4 cite papers that were
          never written. You&rsquo;ve watched Claude give the wrong release
          date for a model that came out last month. You&rsquo;ve fixed RAG
          pipelines where the retriever pulled the <em>right</em> document
          but the model still produced a number nobody can find anywhere on
          the source page.
        </p>

        <p>
          The grounding problem isn&rsquo;t going away. It&rsquo;s the{" "}
          <strong>hardest unsolved problem in production AI today</strong>,
          and the bigger your model gets, the more confidently it lies when
          it lies.
        </p>

        <h2>What it does (in one curl)</h2>

        <pre>{`curl -X POST https://sourcescore.org/api/v1/verify \\
  -H 'Content-Type: application/json' \\
  -d '{"claim": "Llama 3.1 was released in July 2024"}'`}</pre>

        <pre>{`{
  "apiVersion": "v1",
  "query": "Llama 3.1 was released in July 2024",
  "bestMatch": {
    "id": "...",
    "subject": "Llama 3.1",
    "predicate": "released_on",
    "object": "2024-07-23",
    "statement": "Llama 3.1 released on: 2024-07-23.",
    "confidence": 1.0,
    "detailUrl": "https://sourcescore.org/api/v1/claims/....json"
  },
  "signature": {
    "algorithm": "HMAC-SHA256",
    "signedBy": "did:web:sourcescore.org",
    "signedAt": "2026-05-16T...",
    "signature": "..."
  }
}`}</pre>

        <p>Three things make this useful for grounding LLMs:</p>
        <ol>
          <li>
            <strong>Every claim has 2+ primary sources</strong> — the
            official Meta AI blog, the model card on Hugging Face, the arXiv
            preprint, etc. Not &ldquo;according to an article on
            TechCrunch.&rdquo;
          </li>
          <li>
            <strong>Every response is signed</strong> — HMAC-SHA256 with{" "}
            <code>did:web:sourcescore.org</code>. Your client can prove the
            answer came from SourceScore and wasn&rsquo;t tampered in transit.
          </li>
          <li>
            <strong>Every claim has a stable id</strong> — paste it into your
            LLM context, link to it from a paper, embed it in a prompt
            template. It won&rsquo;t move.
          </li>
        </ol>

        <h2>Why I built it this way</h2>

        <p>
          There are great academic fact-checking datasets. There are great
          benchmark leaderboards. There&rsquo;s Wikipedia. None of them are
          an API you can call from your RAG pipeline at request time with a
          30ms response.
        </p>

        <p>
          I picked a narrow vertical to start &mdash;{" "}
          <strong>AI/ML research</strong>. 51 claims at launch covering:
        </p>
        <ul>
          <li>
            <strong>12 foundational papers</strong> — Transformer, RLHF, RAG,
            LoRA, DPO, Chinchilla, PPO, Adam, AlexNet, BERT, Chain-of-Thought,
            FlashAttention, MoE, Switch Transformer, Mamba, T5, CLIP,
            Constitutional AI, InstructGPT, ResNet
          </li>
          <li>
            <strong>22 model releases</strong> with dates, parameter counts,
            context windows — GPT-2/3/4/4-Turbo/4o, Claude 3/3.5, Llama
            1/2/3/3.1, Mistral 7B, Mixtral 8x7B, Gemini Pro/1.5, Whisper,
            DALL-E 3, Stable Diffusion 1, Sora, ChatGPT, ChatGPT Plus
          </li>
          <li>
            <strong>6 organizational facts</strong> — Anthropic, OpenAI,
            Mistral, HuggingFace, Stability AI, DeepMind
          </li>
        </ul>

        <p>
          Every claim is hand-verified against the primary source. If a
          claim is below 0.85 confidence, it&rsquo;s not published.
          Performance-comparison claims are intentionally excluded for v0
          because benchmark numbers depend on version + prompt format — too
          much surface for &ldquo;actually that&rsquo;s not quite right&rdquo;
          pushback.
        </p>

        <p>
          The plan is to grow the catalog to ~500 claims by Day 30 and ~5,000
          by Year 1, all under the same methodology.
        </p>

        <h2>Free tier, no signup</h2>

        <p>
          The free tier is <strong>1,000 claims/month, no auth required</strong>.
          Just curl. Get familiar with the data shape, the signature format,
          the search behavior. If you outgrow it, paid tiers are{" "}
          <a href="/pricing/">€19 / €99 / €499</a> per month — Stripe metered
          billing.
        </p>

        <p>
          OpenAPI 3.1 spec at <a href="/api/v1/openapi.json">/api/v1/openapi.json</a>. Full
          docs at <a href="/docs/">/docs/</a>.
        </p>

        <h2>What&rsquo;s next</h2>

        <p>I&rsquo;ve got two open questions I&rsquo;d love feedback on:</p>
        <ol>
          <li>
            <strong>What claim types are most valuable?</strong> Right now
            I&rsquo;m at release-dates + parameter-counts + paper-introductions
            + organizational-facts. Operator-suggested adds welcomed.
          </li>
          <li>
            <strong>Vertical expansion direction.</strong> AI/ML is the v0
            wedge. Next likely candidates: scientific instrumentation specs,
            software release dates + versions, regulatory deadlines. What
            would you actually use?
          </li>
        </ol>

        <p>
          Try it; break it; tell me what&rsquo;s missing.{" "}
          <a href="mailto:contact@sourcescore.org">contact@sourcescore.org</a>{" "}
          or join the conversation on the Dev.to cross-post.
        </p>

        <hr />

        <p>
          <strong>Built with:</strong> Next.js 15 (static export) ·
          Cloudflare Pages + Pages Functions · TypeScript · Web Crypto API
          for HMAC · Plausible Analytics. 100% serverless, ~100ms cold-start
          globally. Source-rating product (the original SourceScore Index,
          130 hand-scored sources) lives alongside at the same domain — both
          products under one methodology.
        </p>

        <p>
          <strong>Links to bookmark:</strong>
        </p>
        <ul>
          <li>
            Catalog: <a href="/claims/">sourcescore.org/claims/</a>
          </li>
          <li>
            Docs: <a href="/docs/">sourcescore.org/docs/</a>
          </li>
          <li>
            OpenAPI spec:{" "}
            <a href="/api/v1/openapi.json">sourcescore.org/api/v1/openapi.json</a>
          </li>
          <li>
            Pricing: <a href="/pricing/">sourcescore.org/pricing/</a>
          </li>
        </ul>
      </section>
    </article>
  );
}
