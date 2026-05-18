// /use-cases/developer-copilot/ — 7th use-case.
//
// Buyer-intent SEO target: AI coding-tool developers + integrators
// (Cursor, Windsurf, Continue, Bolt, Lovable, v0, Copilot) searching for
// "AI code-suggestion grounding", "stop AI from inventing API calls",
// "verify imports in copilot output". Aleyda Solis 10-char #10
// Transactable.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "Developer copilot grounding — stop AI coding tools from hallucinating libraries";
const SUBTITLE =
  "AI coding assistants (Cursor, Windsurf, Copilot, Continue, Bolt, Lovable, v0) frequently invent package names, hallucinate API signatures, and fabricate documentation citations. SourceScore VERITAS adds signed, sourced claim verification — verify framework/library facts the model emits before the code reaches the user.";
const CANONICAL = "https://sourcescore.org/use-cases/developer-copilot/";
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
    { "@type": "Thing", name: "Developer copilot" },
    { "@type": "Thing", name: "AI coding assistant" },
    { "@type": "Thing", name: "Code hallucination" },
    { "@type": "Thing", name: "Slopsquatting" },
  ],
};

export default function DeveloperCopilotPage() {
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
              { name: "Developer copilot grounding", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/use-cases/" className="hover:underline">Use cases</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Developer copilot</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Use case · AI coding assistants · Grounding
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {TITLE}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
          {SUBTITLE}
        </p>
      </header>

      <section className="prose prose-zinc dark:prose-invert max-w-none">
        <h2>The coding-copilot hallucination problem</h2>
        <p>
          The 2024 wave of AI coding tools (Cursor, Windsurf, Continue,
          Bolt.new, Lovable, Vercel v0, Replit Agent, GitHub Copilot,
          Microsoft Copilot Studio, Claude Code, Codeium) ship rapidly
          generated code at unprecedented scale. They also hallucinate.
        </p>
        <p>
          Common failures:
        </p>
        <ul>
          <li>
            <strong>Invented package names.</strong> &quot;Try using
            the <code>react-typed-form-builder</code> package&quot;
            — package doesn&apos;t exist; install fails or, worse,
            an attacker pre-registered the typo-squat with a malicious
            payload (the &quot;<a href="https://en.wikipedia.org/wiki/Typosquatting" target="_blank" rel="noopener noreferrer">slopsquatting</a>&quot; pattern).
          </li>
          <li>
            <strong>Hallucinated API signatures.</strong> The model
            confidently writes <code>openai.audio.transcribe(file, model=&apos;whisper-v3&apos;)</code>
            — but the real signature uses{" "}
            <code>client.audio.transcriptions.create()</code> with
            different argument shape.
          </li>
          <li>
            <strong>Fabricated configuration flags.</strong>{" "}
            &quot;Pass <code>--enable-flash-attn-3</code> to vLLM&quot;
            — flag doesn&apos;t exist in that version.
          </li>
          <li>
            <strong>Wrong release dates / version numbers.</strong>
            &quot;Llama 3 supports 128k context&quot; — true for 3.1+,
            false for original 3.
          </li>
          <li>
            <strong>Mis-attributed paper citations.</strong>{" "}
            &quot;Per Attention Is All You Need (Vaswani 2018)&quot;
            — the paper is 2017.
          </li>
        </ul>

        <h2>Why hallucinations happen in coding context</h2>
        <p>
          Two compounding factors:
        </p>
        <ol>
          <li>
            <strong>Training-data decay.</strong> The model&apos;s
            knowledge cutoff is months-to-years old. Frameworks
            ship breaking changes. The model still emits
            now-outdated API shapes confidently.
          </li>
          <li>
            <strong>Plausible-name-generation.</strong> LLMs are
            extremely good at producing names that <em>look</em>
            like real packages. &quot;<code>fastapi-async-cache</code>&quot;
            might or might not be a real PyPI package — the user
            often can&apos;t tell without running <code>pip search</code>.
          </li>
        </ol>

        <h2>Where SourceScore VERITAS helps</h2>
        <p>
          VERITAS specifically covers the AI/ML library + tool +
          model + paper space. For coding assistants whose users
          frequently ask about AI/ML tooling, VERITAS provides:
        </p>
        <ul>
          <li>
            Model release dates + parameter counts + context windows
            (so the copilot doesn&apos;t emit &quot;Llama 3 128k&quot;
            when 3.0 was 8k)
          </li>
          <li>
            Foundational paper authorship + publication dates (no
            more &quot;Vaswani 2018&quot;)
          </li>
          <li>
            Architectural facts (Mixtral 8x7B = MoE 8 experts ×
            7B params, 2 active per token)
          </li>
          <li>
            Organizational facts (Anthropic founded 2021 by the Amodei
            siblings; Mistral founded 2023; Cohere founded 2019)
          </li>
          <li>
            Framework + tooling release dates (LangChain 2022-10,
            LlamaIndex 2022-11, Hugging Face Transformers 2018-10,
            vLLM 2023-06, Continue 2023-07)
          </li>
        </ul>

        <h2>3 integration patterns</h2>

        <h3>Pattern 1 — Post-generation verification (in the IDE)</h3>
        <p>
          After the assistant emits code or explanation, extract
          factual assertions (model names + library versions + paper
          citations + release dates), verify each, annotate the
          unverified ones in the editor margin.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`// TypeScript — Continue.dev / Cursor extension integration
async function verifyAssistantOutput(text: string) {
  const assertions = extractAssertions(text);
  const results = await Promise.all(
    assertions.map((a) =>
      fetch("https://sourcescore.org/api/v1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: a, minConfidence: 0.8 }),
      }).then((r) => r.json())
    )
  );
  return results.map((r, i) => ({
    claim: assertions[i],
    verified: !!r.bestMatch,
    badge: r.bestMatch ? \`✓ Source: \${r.bestMatch.id}\` : "⚠ unverified",
  }));
}`}</code></pre>

        <h3>Pattern 2 — Pre-suggestion sanity check (server-side gate)</h3>
        <p>
          For cloud-hosted coding tools (Bolt.new, Lovable, v0,
          Replit), run verification server-side after the model
          generates its plan; reject or rewrite plans that depend
          on hallucinated APIs before the code reaches the user.
        </p>

        <h3>Pattern 3 — Reference panel (sidebar widget)</h3>
        <p>
          When the user types &quot;What context window does Mistral
          Pixtral have?&quot;, the assistant calls{" "}
          <code>GET /api/v1/search?q=mistral+pixtral</code>, shows
          the verified claim card in the reference sidebar with
          link to the canonical{" "}
          <code>/claims/[id]/</code> page. User gets the answer
          with citation + verification badge.
        </p>

        <h2>What this use-case catches</h2>
        <ul>
          <li>
            Outdated model spec claims (context window, parameter
            count, release date)
          </li>
          <li>
            Foundational paper mis-attributions
          </li>
          <li>
            Wrong organizational facts (founding dates, founders,
            funding rounds)
          </li>
          <li>
            Framework + library release dates (when a feature
            shipped)
          </li>
          <li>
            License facts (Apache 2.0 vs proprietary vs Gemma terms)
          </li>
        </ul>

        <h2>What this use-case does NOT catch (handle separately)</h2>
        <ul>
          <li>
            Function-signature hallucinations — different problem,
            solved via type-checker integration or symbol search
            (Cursor + Sourcegraph + symbol-aware retrieval)
          </li>
          <li>
            Slopsquatting / typosquat package detection — needs
            registry-side check (<code>pip search</code> +
            registry-published-date + reputation signals)
          </li>
          <li>
            Bug or vulnerability in the generated code — needs
            SAST + DAST + runtime testing
          </li>
          <li>
            Code-style violations — needs linting + style checker
          </li>
        </ul>
        <p>
          VERITAS complements those tools; doesn&apos;t replace
          them.
        </p>

        <h2>Economics for coding tools</h2>
        <ul>
          <li>
            <strong>Free tier:</strong> 1,000 verifications/month —
            fits a single dev evaluating + a few hundred users.
          </li>
          <li>
            <strong>Startup (€99/mo):</strong> 100,000 — fits a
            growing coding-tool startup with ~1k DAU.
          </li>
          <li>
            <strong>Scale (€499/mo):</strong> 1M — fits 10k+ DAU
            production coding tools.
          </li>
        </ul>
        <p>
          See <a href="/pricing/" className="underline">pricing</a>.
          {" "}For coding-tool integrations at &gt;1M verifications/mo,
          email <a href="/contact/" className="underline">contact</a>
          {" "}for custom enterprise terms.
        </p>

        <h2>Getting started</h2>
        <ol>
          <li>
            <a href="/quickstart/" className="underline">5-min quickstart</a>
            {" "}— curl + Python + JS in one page
          </li>
          <li>
            Browse the{" "}
            <a href="/claims/" className="underline">296 verified claims</a>
            {" "}— if your coding-tool users frequently ask about
            AI/ML topics, the catalog already covers most common
            queries
          </li>
          <li>
            Pick the integration pattern that fits your tool (IDE
            extension / server-side gate / sidebar reference)
          </li>
          <li>
            Wire <code>verify</code> calls into your post-generation
            pipeline
          </li>
        </ol>

        <h2>Related</h2>
        <ul>
          <li>
            <a href="/use-cases/ai-agent-grounding/">AI agent grounding</a>
            {" "}— same pattern, broader scope
          </li>
          <li>
            <a href="/use-cases/rag-pipeline-verification/">RAG pipeline verification</a>
            {" "}— add verification on top of retrieval-augmented
            generation
          </li>
          <li>
            <a href="/concepts/hallucination/">Hallucination</a> —
            the broader failure-mode this use-case fights
          </li>
          <li>
            <a href="/concepts/llm-grounding/">LLM grounding</a> —
            the broader pattern
          </li>
          <li>
            <a href="/topics/agent-frameworks/">Topic hub: Agent frameworks</a>
            {" "}— coding tools are evolving toward coding agents
          </li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Building an AI coding assistant and need to verify the AI/ML
          framework + library facts your model emits? Run the{" "}
          <a href="/quickstart/" className="underline">5-min quickstart</a>
          {" "}— verify endpoint is free, stateless, and CORS-enabled
          for browser/IDE callers.
        </p>
      </footer>
    </article>
  );
}
