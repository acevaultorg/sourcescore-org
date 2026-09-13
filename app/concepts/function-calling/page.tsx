// /concepts/function-calling/ — 7th concept pillar.
//
// Targets high-volume "LLM function calling", "OpenAI tools",
// "tool use" queries. Pairs with all integration guides.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const PUBLISHED = "2026-05-17";
const TITLE = "Function calling — how LLMs invoke tools";
const SUBTITLE =
  "Function calling is how modern LLMs invoke external tools (APIs, databases, code execution). OpenAI launched it June 2023; the pattern is now table-stakes across every major vendor.";
const SLUG = "function-calling";
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
    { "@type": "Thing", name: "Function calling" },
    { "@type": "Thing", name: "Tool use" },
    { "@type": "Thing", name: "OpenAI tools" },
    { "@type": "Thing", name: "Anthropic tool use" },
  ],
};

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name: "Function calling",
  description:
    "An LLM capability where the model emits a structured tool invocation (function name + JSON-shape arguments) instead of free-text. The runtime executes the function and feeds the result back; the model continues. Foundational to agent loops, RAG retrievers, and tool-augmented chatbots.",
  inDefinedTermSet: "https://sourcescore.org/concepts/",
  url: CANONICAL,
};

export default function FunctionCallingConcept() {
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
              { name: "Function calling", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/concepts/" className="hover:underline">Concepts</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Function calling</span>
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
          <strong>Function calling</strong> (also called &quot;tool
          use&quot; in Anthropic terminology) is an LLM capability where
          the model emits a structured tool invocation — function name
          + JSON-shape arguments — instead of free-text. The runtime
          executes the function and feeds the result back; the model
          continues with the result in context.
        </p>
        <p>
          Concretely: you give the model a JSON schema of available
          tools. The model decides when to call which tool. It emits a
          message with <code>tool_calls</code> field. You execute the
          function. You append the result as a <code>tool</code>{" "}
          message. You ask the model to continue. The model produces
          the final user-facing response (or calls another tool).
        </p>

        <h2 id="why-it-matters">Why it matters</h2>
        <p>
          Function calling closed the loop between LLM and the
          deterministic world. Before it, you had to parse free-text
          responses to extract structured intent (fragile). With it,
          the model emits structured output that&apos;s directly
          machine-readable.
        </p>
        <p>
          Every modern agent loop, RAG retriever, code-running
          assistant, and tool-augmented chatbot is built on function
          calling. It&apos;s the primitive.
        </p>

        <h2 id="history">A short history</h2>
        <ul>
          <li>
            <strong>June 2023</strong> — OpenAI introduces function
            calling in the Chat Completions API. <code>tool_choice</code>{" "}
            + <code>tools</code> parameters. Initial release with
            GPT-3.5 + GPT-4.
          </li>
          <li>
            <strong>2023-09</strong> — OpenAI <strong>parallel</strong>{" "}
            tool calling (model can request multiple tool calls in a
            single turn).
          </li>
          <li>
            <strong>2023-11</strong> — Anthropic adds tool use to
            Claude 2.1 (later refined for Claude 3 family).
          </li>
          <li>
            <strong>2024</strong> — Google Gemini, Meta Llama 3.1+,
            Mistral, Cohere, and most open-weight frontier models add
            function calling.
          </li>
          <li>
            <strong>2024-11</strong> — Anthropic releases <a href="/claims/">
            Model Context Protocol (MCP)</a> — open standard for
            tool exposure across vendors. Adopted by OpenAI and most
            agent frameworks within ~6 months.
          </li>
        </ul>

        <h2 id="schemas">The JSON schema</h2>
        <p>
          Function calling specifies tools via JSON Schema (OpenAI) or
          a similar structure. Example:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`{
  "type": "function",
  "function": {
    "name": "find_claim_candidate",
    "description": "Find a similar AI/ML catalog record for evidence review; not a truth verdict.",
    "parameters": {
      "type": "object",
      "properties": {
        "claim": {
          "type": "string",
          "description": "Natural-language assertion to look up"
        },
        "min_confidence": {
          "type": "number",
          "description": "Minimum legacy record confidence (0.0-1.0)",
          "default": 0.85
        }
      },
      "required": ["claim"]
    }
  }
}`}</code></pre>
        <p>
          The model sees this schema, decides when to call the function,
          fills in the arguments per the schema, and emits a structured
          tool_calls block.
        </p>

        <h2 id="loop">The agent loop</h2>
        <ol>
          <li>Send messages + tool schemas to the model</li>
          <li>If model emits <code>tool_calls</code>: execute each tool, append results as <code>tool</code> messages, loop back to step 1</li>
          <li>If model emits a final text message: done</li>
        </ol>
        <p>
          Parallel tool calls let the runtime execute multiple tools
          concurrently before looping. Streaming tool calls let the
          model emit tool requests mid-stream (without waiting for full
          response).
        </p>

        <h2 id="vendor-flavors">Vendor flavors</h2>
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Field name</th>
              <th>Multi-call</th>
              <th>Streaming</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>OpenAI</td><td><code>tool_calls</code></td><td>Yes (parallel)</td><td>Yes</td></tr>
            <tr><td>Anthropic</td><td><code>tool_use</code> blocks</td><td>Yes</td><td>Yes</td></tr>
            <tr><td>Google Gemini</td><td><code>functionCall</code></td><td>Yes</td><td>Yes</td></tr>
            <tr><td>Mistral</td><td><code>tool_calls</code> (OpenAI-compatible)</td><td>Yes</td><td>Yes</td></tr>
            <tr><td>Llama 3.1+</td><td>via tool-token format (Llama-Stack)</td><td>Yes</td><td>Yes</td></tr>
          </tbody>
        </table>

        <h2 id="cross-vendor">Cross-vendor portability — MCP</h2>
        <p>
          Each vendor&apos;s tool-call format is slightly different,
          which has historically forced per-vendor adapter code.
          Anthropic&apos;s <a href="/claims/">Model Context Protocol
          (November 2024)</a> is the cross-vendor standard:
        </p>
        <ul>
          <li>Tool servers expose tools via MCP</li>
          <li>Clients (any LLM vendor) connect to MCP servers</li>
          <li>One tool definition works across OpenAI, Anthropic, Gemini, Mistral, etc.</li>
        </ul>
        <p>
          As of 2025, MCP adoption is high enough that new agent
          frameworks default to it. The vendor-specific tool formats
          remain but are increasingly thin wrappers over MCP-compatible
          tool definitions.
        </p>

        <h2 id="patterns">Common production patterns</h2>
        <h3>Retrieval-then-cite</h3>
        <p>
          The model has a <code>search_knowledge_base</code> tool. When
          the user asks a question, the model calls the search tool,
          gets back relevant chunks, then composes an answer citing
          them. Compare with <a href="/concepts/rag-vs-veritas/">RAG vs
          VERITAS</a>.
        </p>
        <h3>Retrieve-and-review before asserting</h3>
        <p>
          The model has a <code>find_claim_candidate</code> tool. When it
          is about to assert a factual claim, it retrieves a possible record,
          then the application compares that record and its evidence with the
          assertion. This is the <a href="/use-cases/ai-agent-grounding/">
          AI agent grounding</a> use case.
        </p>
        <h3>Code execution</h3>
        <p>
          The model has a <code>run_python</code> tool. For math /
          calculation / data-manipulation queries, the model writes
          code and runs it instead of computing in-head.
        </p>
        <h3>Multi-tool composition</h3>
        <p>
          The model has 10+ tools (search, calendar, email, database,
          calculator, etc.). It chains tool calls to accomplish complex
          tasks. The OpenAI Assistants API + Anthropic computer use
          target this shape.
        </p>

        <h2 id="anti-patterns">Anti-patterns</h2>
        <ul>
          <li>
            <strong>Tool descriptions too vague.</strong> The model
            decides when to call a tool based on the description. Vague
            description = mis-called or under-called tool. Write
            descriptions like API docs.
          </li>
          <li>
            <strong>Too many tools.</strong> 5-10 tools per agent is
            generally fine. 50+ tools degrades model performance —
            consider sub-agent decomposition or hierarchical tool
            routing.
          </li>
          <li>
            <strong>Trusting model arguments unconditionally.</strong>{" "}
            Models hallucinate JSON. Validate arguments before
            executing — Pydantic, JSON Schema validators,{" "}
            <a href="/docs/integrations/instructor/">Instructor</a>,{" "}
            <a href="/docs/integrations/pydantic-ai/">Pydantic AI</a>.
          </li>
          <li>
            <strong>No tool-call observability.</strong> Log every tool
            call + arguments + result. You&apos;ll need it when
            debugging why the agent did something weird.
          </li>
        </ul>

        <h2 id="related">Related</h2>
        <ul>
          <li><a href="/concepts/llm-grounding/">LLM grounding</a> — function calling enables retrieve-and-review workflows</li>
          <li><a href="/topics/agent-frameworks/">Agent frameworks topic hub</a></li>
          <li><a href="/use-cases/ai-agent-grounding/">AI agent grounding use case</a></li>
          <li><a href="/docs/integrations/openai-tools/">OpenAI tool-calls integration</a></li>
          <li><a href="/docs/integrations/anthropic-sdk/">Anthropic SDK tool-use integration</a></li>
          <li><a href="/docs/integrations/pydantic-ai/">Pydantic AI — type-safe variant</a></li>
        </ul>
      </section>
    </article>
  );
}
