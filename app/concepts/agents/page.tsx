// /concepts/agents/ — 8th concept pillar.
//
// Targets high-volume "AI agents", "LLM agents", "autonomous agents" queries.
// Pairs with function-calling + llm-grounding pillars + agent-frameworks
// topic hub.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-17";
const TITLE = "AI agents — what they are, the loop they run, and where they fail";
const SUBTITLE =
  "An agent is an LLM that decides when to use tools, observes results, and chooses what to do next. The reasoning + action + observation loop became table-stakes in 2023-2024. This is the honest definition + production patterns + the failure modes nobody publishes.";
const SLUG = "agents";
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
    { "@type": "Thing", name: "AI agents" },
    { "@type": "Thing", name: "LLM tool use" },
    { "@type": "Thing", name: "ReAct" },
    { "@type": "Thing", name: "Autonomous agents" },
  ],
};

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "AI agent",
  description:
    "An LLM-driven system that runs a loop: receives a goal, decides whether and which tools to call, executes the tools, observes results, and repeats until the goal is met or it concludes that it can't be. Distinguished from a chat assistant by the autonomy + tool-use + multi-step planning capabilities.",
  inDefinedTermSet: "https://sourcescore.org/concepts/",
  url: CANONICAL,
};

export default function AgentsConcept() {
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
              { name: "Agents", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Agents</span>
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
          An <strong>AI agent</strong> is an LLM-driven system that
          runs a loop: receives a goal, decides whether and which
          tools to call, executes the tools, observes results, and
          repeats until the goal is met (or it concludes it
          can&apos;t be).
        </p>
        <p>
          Distinguished from a chat assistant by three things:
        </p>
        <ul>
          <li><strong>Autonomy</strong> — the model decides when to invoke tools without explicit user instructions per step</li>
          <li><strong>Tool use</strong> — the model has structured access to external systems (APIs, databases, code execution, search)</li>
          <li><strong>Multi-step planning</strong> — the model breaks goals into sub-tasks across many turns</li>
        </ul>

        <h2 id="the-loop">The canonical agent loop</h2>
        <p>
          Every agent framework — LangChain AgentExecutor, LangGraph, DSPy, OpenAI Assistants, Anthropic tool_use, Pydantic AI, AutoGPT, BabyAGI — implements variants of the same loop:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`while not done:
    thought = model.reason(goal, history)        # what's next?
    if thought.is_final_answer:
        return thought.answer
    tool_call = thought.choose_tool()             # which tool + args?
    observation = execute_tool(tool_call)         # external system runs
    history.append((thought, tool_call, observation))
    done = check_done(goal, history)`}</code></pre>

        <h2 id="history">A short history</h2>
        <ul>
          <li>
            <strong>2022-10: ReAct</strong> (<a href="/claims/">Yao et al., Princeton + Google</a>) — formalizes the reasoning-acting-observing interleaved pattern. Foundational paper for the entire agent generation.
          </li>
          <li>
            <strong>2023-02: Toolformer</strong> (<a href="/claims/">Schick et al., Meta AI</a>) — first to demonstrate models can teach themselves to call tools.
          </li>
          <li>
            <strong>2023-03: AutoGPT</strong> + <strong>BabyAGI</strong> — open-source autonomous agents go viral. Mostly demos, not production-ready, but seeded the public imagination.
          </li>
          <li>
            <strong>2023-06: OpenAI function calling</strong> — first first-class tool-use API. Makes agent loops easy to build.
          </li>
          <li>
            <strong>2023-09: LangChain AgentExecutor</strong> + <strong>OpenAI parallel tool calls</strong> — production-grade orchestration.
          </li>
          <li>
            <strong>2023-11: OpenAI Assistants API</strong> — managed agent runtime with persistent threads.
          </li>
          <li>
            <strong>2024-01: LangGraph</strong> (<a href="/claims/">LangChain</a>) — graph-based agent runtime with cyclic execution.
          </li>
          <li>
            <strong>2024-10: Anthropic Computer Use</strong> — agents can drive a desktop (clicking, typing, scrolling).
          </li>
          <li>
            <strong>2024-11: Anthropic Model Context Protocol (MCP)</strong> — cross-vendor tool exposure standard.
          </li>
          <li>
            <strong>2025-01: OpenAI Operator</strong>, <strong>2025-02: Anthropic Claude Code</strong>, <strong>2025-05: OpenAI Codex cloud agent</strong> — production agents for browser, terminal, and code.
          </li>
        </ul>

        <h2 id="patterns">Common production patterns</h2>
        <h3>Tool-using assistant</h3>
        <p>
          Simplest pattern: small tool catalog (search, calendar,
          database), agent decides which to call. OpenAI Assistants
          API + Anthropic SDK tool_use are the canonical shapes.
        </p>
        <h3>Multi-step research</h3>
        <p>
          Agent receives a research goal, decomposes into sub-questions,
          searches multiple sources, synthesizes findings, returns
          structured output. Perplexity-style use case.
        </p>
        <h3>Code-execution agent</h3>
        <p>
          Agent writes code, runs it, observes errors, fixes,
          re-runs. Claude Code, OpenAI Codex agent, Cursor, Devin,
          Replit Agent.
        </p>
        <h3>Browser-control agent</h3>
        <p>
          Agent drives a browser to fill forms, click buttons,
          extract data. OpenAI Operator, Anthropic Computer Use,
          Browserbase, Multi-on.
        </p>
        <h3>Multi-agent orchestration</h3>
        <p>
          Multiple specialized agents collaborate via a coordinator.
          AutoGen, CrewAI, MetaGPT.
        </p>

        <h2 id="failure-modes">Failure modes (the honest part)</h2>
        <p>
          Agents fail in predictable, expensive ways. The literature
          underreports these:
        </p>
        <ul>
          <li>
            <strong>Hallucinated facts in tool outputs.</strong> The agent emits a confident summary citing tools it never called, or cites the right tool but invents the result. Mitigation: signed verification (e.g.,{" "}
            <a href="/concepts/rag-vs-veritas/">VERITAS-style verification layer</a>).
          </li>
          <li>
            <strong>Infinite loops.</strong> Agent calls tools repeatedly without making progress. Mitigation: hard max-steps limit + budget tracking + sanity check on each new tool call vs prior calls.
          </li>
          <li>
            <strong>Wrong tool selection.</strong> Agent picks the wrong tool from a too-large catalog. Mitigation: keep catalog ≤10 tools per agent OR use hierarchical agent routing.
          </li>
          <li>
            <strong>Cost runaway.</strong> Multi-step agents can rack up $X per query when a chat assistant would cost $0.01. Mitigation: per-step token budget + cost ceiling alert.
          </li>
          <li>
            <strong>Tool argument hallucination.</strong> Model fabricates JSON arguments. Mitigation: typed schemas (Pydantic, Instructor) + runtime validation + retry on validation failure.
          </li>
          <li>
            <strong>Stale context.</strong> Agent loses earlier observations because the context window overflows. Mitigation: summarization / scratchpad / external memory.
          </li>
          <li>
            <strong>Prompt-injection from tool outputs.</strong> A tool returns malicious text that hijacks the agent. Mitigation: sandbox + careful prompt boundaries between observations and reasoning.
          </li>
          <li>
            <strong>Misaligned sub-tasks.</strong> Agent decomposes the goal incorrectly, optimizes wrong sub-objective. Mitigation: explicit task verification + human checkpoint for high-stakes decisions.
          </li>
        </ul>

        <h2 id="when-not">When NOT to use an agent</h2>
        <p>
          The 2023-2024 demo cycle oversold agents. A single LLM call
          with no tool use is often better when:
        </p>
        <ul>
          <li>Goal is well-defined + single-turn (summarize this; classify this; extract structured data)</li>
          <li>Tool catalog is empty or one tool deep (just do RAG; no agent needed)</li>
          <li>Latency budget is strict (agent loops add model and tool calls)</li>
          <li>Cost budget is tight (measure the extra model and tool calls)</li>
          <li>Failure is unrecoverable (an agent doing something wrong autonomously is worse than a chatbot saying something wrong)</li>
        </ul>

        <h2 id="frameworks">Picking a framework</h2>
        <p>
          We ship 8 integration guides. Quick pick:
        </p>
        <ul>
          <li><a href="/docs/integrations/openai-tools/">OpenAI tools</a> — single-vendor (GPT), simplest agent loop</li>
          <li><a href="/docs/integrations/anthropic-sdk/">Anthropic SDK</a> — single-vendor (Claude), simplest tool_use</li>
          <li><a href="/docs/integrations/langchain/">LangChain</a> + <a href="/docs/integrations/langchain/">LangGraph</a> — breadth, multi-step, cyclic execution</li>
          <li><a href="/docs/integrations/llamaindex/">LlamaIndex</a> — RAG-first agents</li>
          <li><a href="/docs/integrations/dspy/">DSPy</a> — programs-not-prompts, optimizer-driven</li>
          <li><a href="/docs/integrations/pydantic-ai/">Pydantic AI</a> — type-safe, vendor-portable</li>
          <li><a href="/docs/integrations/instructor/">Instructor</a> — structured outputs as the agent surface</li>
          <li><a href="/docs/integrations/vercel-ai-sdk/">Vercel AI SDK</a> — Next.js streaming + tool calls</li>
        </ul>

        <h2 id="grounding">Agents + grounding</h2>
        <p>
          Agents amplify both correct outputs AND hallucinations. A
          chatbot that hallucinates once shows the user once; an
          agent that hallucinates in step 3 of 12 builds the next 9
          steps on top of the lie. Grounding matters more for
          agents than for chatbots.
        </p>
        <p>
          See <a href="/use-cases/ai-agent-grounding/">AI agent grounding use case</a> for the
          verify_claim tool pattern that pairs every agent loop with
          fact verification.
        </p>

        <h2 id="related">Related</h2>
        <ul>
          <li><a href="/concepts/function-calling/">Function calling</a> — the primitive agents are built on</li>
          <li><a href="/concepts/llm-grounding/">LLM grounding</a> — why agents need verification</li>
          <li><a href="/concepts/rag-vs-veritas/">RAG vs VERITAS</a> — retrieval + verification stack</li>
          <li><a href="/topics/agent-frameworks/">Agent frameworks topic hub</a> — every framework in one place</li>
          <li><a href="/topics/prompt-engineering/">Prompt engineering topic hub</a> — ReAct, ToT, CoT patterns</li>
          <li><a href="/use-cases/ai-agent-grounding/">AI agent grounding</a> — verify_claim tool pattern</li>
        </ul>
      </section>
    </article>
  );
}
