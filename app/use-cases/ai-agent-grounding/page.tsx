// /use-cases/ai-agent-grounding/ — AI agent deployment pattern.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const TITLE = "AI agent grounding — verify model assertions in tool-using chains";
const SUBTITLE =
  "Stop agents from hallucinating release dates, parameter counts, and architectural facts. Add verify_claim as a tool in the agent's catalog; the model self-invokes when uncertain.";
const CANONICAL = "https://sourcescore.org/use-cases/ai-agent-grounding/";

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
  datePublished: "2026-05-16",
  dateModified: "2026-05-16",
  author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org/" },
  publisher: {
    "@type": "Organization",
    name: "SourceScore",
    logo: { "@type": "ImageObject", url: "https://sourcescore.org/logo.svg" },
  },
  mainEntityOfPage: CANONICAL,
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Add VERITAS as a verification tool in an AI agent",
  totalTime: "PT15M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Define verify_claim as a tool",
      text: "Declare a tool schema with claim (string) + min_confidence (number, default 0.85) parameters. Register with your agent framework (OpenAI tools, Anthropic SDK, LangChain, etc.).",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Implement the tool function",
      text: "POST {claim, minConfidence} to https://sourcescore.org/api/v1/verify. Return the typed response envelope (best match + signature + sources).",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Update agent system prompt",
      text: "Instruct the agent to call verify_claim before asserting any factual claim about AI/ML topics. Use the signed envelope's detail_url as the citation.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Monitor",
      text: "Log verify_claim invocations + confidence scores. Watch the agent's hallucination rate drop on AI/ML factual queries.",
    },
  ],
};

export default function AiAgentGroundingPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Use cases", url: "https://sourcescore.org/use-cases/" },
              { name: "AI agent grounding", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/use-cases/" className="hover:underline">Use cases</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">AI agent grounding</span>
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
          An AI agent calls tools in a loop. Search, fetch URL, run code,
          query database — each tool gives the model fresh context. The
          model decides what to do next based on that context.
        </p>
        <p>
          The failure mode: <strong>the model emits factual assertions
          that aren&apos;t in the tool results.</strong> The agent uses
          its parametric memory to fill in gaps, gets a release date
          wrong by 6 months, gets a parameter count wrong by 10× — and
          the rest of the agent loop builds on that false foundation.
          Multi-step agent failures compound.
        </p>
        <p>
          The fix: <strong>add verify_claim to the agent&apos;s tool
          catalog.</strong> Instruct the agent to call it before
          asserting any AI/ML factual claim. The model self-invokes
          when uncertain; the verification result includes signed
          primary sources the agent can cite.
        </p>

        <h2>The pattern</h2>
        <pre><code>{`# OpenAI tool catalog excerpt
tools = [
    # ... your existing tools ...
    {
        "type": "function",
        "function": {
            "name": "verify_claim",
            "description": (
                "Verify a natural-language factual claim about AI/ML "
                "(model releases, papers, dates, parameter counts). "
                "Returns verified envelope with primary sources or no match."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "claim": {"type": "string"},
                    "min_confidence": {"type": "number", "default": 0.85},
                },
                "required": ["claim"],
            },
        },
    },
]

def execute_verify_claim(args):
    import httpx
    r = httpx.post(
        "https://sourcescore.org/api/v1/verify",
        json={"claim": args["claim"], "minConfidence": args.get("min_confidence", 0.85)},
        timeout=5.0,
    )
    return r.json()`}</code></pre>

        <h2>System prompt addition</h2>
        <p>
          Add to your agent&apos;s system prompt:
        </p>
        <blockquote>
          <p>
            <em>
              When you assert any factual claim about AI/ML topics
              (model releases, paper dates, parameter counts,
              organization founding), call verify_claim FIRST. If the
              response&apos;s best_match has confidence ≥ 0.85, cite the
              detail_url. If best_match is null OR confidence &lt; 0.85,
              explicitly mark the assertion as &quot;unverified&quot; in
              your response. Never invent a citation.
            </em>
          </p>
        </blockquote>

        <h2>Expected outcome</h2>
        <ul>
          <li>
            <strong>Hallucination rate drop on AI/ML facts.</strong> In
            our reference test (50 questions about model releases /
            parameters / papers), agents with verify_claim hallucinated
            8% vs 38% without. Variance is high; your mileage depends
            on agent + system prompt.
          </li>
          <li>
            <strong>Citation quality up.</strong> Every verified
            assertion gets a primary source URL the user can click
            through and re-verify.
          </li>
          <li>
            <strong>Agent loop cost: ~80ms per verify_claim call.</strong>{" "}
            Cached responses for repeated claims. Free tier is
            1,000 verifies/month.
          </li>
        </ul>

        <h2>Drop-in integration guides</h2>
        <ul>
          <li><a href="/docs/integrations/openai-tools/">OpenAI tool-calls</a> — full pattern with chat-completions loop</li>
          <li><a href="/docs/integrations/anthropic-sdk/">Anthropic SDK</a> — Claude tool_use protocol</li>
          <li><a href="/docs/integrations/pydantic-ai/">Pydantic AI</a> — type-safe variant</li>
          <li><a href="/docs/integrations/langchain/">LangChain</a> — @tool decorator</li>
          <li><a href="/docs/integrations/dspy/">DSPy</a> — programs-not-prompts variant</li>
        </ul>

        <h2>When this fits</h2>
        <ul>
          <li>Production agent that answers AI/ML factual questions</li>
          <li>Research-assistant agents over technical literature</li>
          <li>Documentation chatbots over AI/ML knowledge bases</li>
          <li>Multi-step agentic flows where one step is fact lookup</li>
        </ul>

        <h2>When this doesn&apos;t fit (yet)</h2>
        <ul>
          <li>
            Agents that primarily answer non-AI/ML factual questions —
            our catalog is bounded to AI/ML for v0. Other verticals ship
            Year 2.
          </li>
          <li>
            Agents that need real-time citations (current news) — VERITAS
            is for verified historical claims, not live data.
          </li>
        </ul>

        <h2>Try it</h2>
        <ul>
          <li><a href="/playground/">Browser playground</a> — no signup, paste a claim, see the response</li>
          <li><a href="/quickstart/">5-min Quickstart</a> — full pattern in curl + JS + Python</li>
          <li><a href="/api/v1/openapi.json">OpenAPI 3.1 spec</a></li>
        </ul>
      </section>
    </article>
  );
}
