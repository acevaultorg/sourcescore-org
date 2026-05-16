// VERITAS-Reborn — OpenAI tool-call integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "OpenAI tool calls + SourceScore VERITAS — auto-grounding via function calling",
  description:
    "Expose SourceScore VERITAS as native function-calls in the OpenAI Chat Completions API. The model auto-invokes verify_claim() / search_claims() when it needs grounded facts. Python + JS examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/openai-tools/" },
  openGraph: {
    title: "OpenAI tool calls + SourceScore VERITAS",
    description: "Native function-calling for signed-claim grounding.",
    url: "https://sourcescore.org/docs/integrations/openai-tools/",
    type: "article",
  },
};

export default function OpenAIToolsIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "OpenAI tool-calls + SourceScore VERITAS: auto-grounding via function calling",
            description:
              "Define VERITAS as two tool-call functions (search_claims, verify_claim) and let the model decide when to invoke them. Native function-calling means zero retrieval prompt-engineering.",
            datePublished: "2026-05-16",
            dateModified: "2026-05-16",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/openai-tools/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "OpenAI tool calls", url: "https://sourcescore.org/docs/integrations/openai-tools/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <a href="/docs/" className="hover:underline">Docs</a>
        <span className="mx-2">›</span>
        <a href="/docs/integrations/" className="hover:underline">Integrations</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">OpenAI tool calls</span>
      </nav>

      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Integration guide</p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          OpenAI tool calls + VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Define VERITAS as two function-call tools and let the model
          decide when to ground itself. Zero retrieval prompt-engineering;
          the model invokes <code className="font-mono">search_claims</code>
          or <code className="font-mono">verify_claim</code> automatically
          when uncertain.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Tool definitions</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`tools = [
    {
        "type": "function",
        "function": {
            "name": "search_claims",
            "description": (
                "Search the SourceScore VERITAS catalog of verified AI/ML claims. "
                "Returns top-K matching claims with statement, confidence, "
                "and source URLs. Use this when you need a grounded fact about "
                "model releases, architectures, foundational research, or AI/ML organizations."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Natural-language query"},
                    "limit": {"type": "integer", "default": 5, "minimum": 1, "maximum": 20},
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "verify_claim",
            "description": (
                "Verify a specific assertion against the VERITAS catalog. "
                "Returns a confidence score and the matching claim id if found. "
                "Use this when you have a specific statement to check before asserting it."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "statement": {"type": "string"},
                    "min_confidence": {"type": "number", "default": 0.85},
                },
                "required": ["statement"],
            },
        },
    },
]
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Tool-call loop (Python)</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import json, requests
from openai import OpenAI

client = OpenAI()
VERITAS = "https://sourcescore.org/api/v1"

def call_tool(name: str, args: dict) -> dict:
    if name == "search_claims":
        r = requests.get(f"{VERITAS}/search", params={"q": args["query"], "limit": args.get("limit", 5)})
        return r.json()
    if name == "verify_claim":
        r = requests.post(
            f"{VERITAS}/verify",
            json={"claim": args["statement"], "minConfidence": args.get("min_confidence", 0.85)},
        )
        return r.json()
    return {"error": f"unknown tool {name}"}

messages = [
    {"role": "system", "content": (
        "Use search_claims or verify_claim to ground any AI/ML factual claim "
        "before asserting it. Cite the returned claim_id with every grounded "
        "fact in the final answer."
    )},
    {"role": "user", "content": "When was the Transformer architecture introduced and by whom?"},
]

while True:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=tools,
        temperature=0,
    )
    msg = resp.choices[0].message
    messages.append(msg.model_dump(exclude_none=True))

    if not msg.tool_calls:
        print(msg.content)
        break

    for tc in msg.tool_calls:
        args = json.loads(tc.function.arguments)
        result = call_tool(tc.function.name, args)
        messages.append({
            "role": "tool",
            "tool_call_id": tc.id,
            "content": json.dumps(result),
        })
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Same loop in JavaScript</h2>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import OpenAI from "openai";
const client = new OpenAI();
const VERITAS = "https://sourcescore.org/api/v1";

async function callTool(name, args) {
  if (name === "search_claims") {
    const q = new URLSearchParams({ q: args.query, limit: args.limit ?? 5 });
    return (await fetch(\`\${VERITAS}/search?\${q}\`)).json();
  }
  if (name === "verify_claim") {
    return (await fetch(\`\${VERITAS}/verify\`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ claim: args.statement, minConfidence: args.min_confidence ?? 0.85 }),
    })).json();
  }
  return { error: \`unknown tool \${name}\` };
}

const messages = [
  { role: "system", content: "Use search_claims or verify_claim to ground any AI/ML factual claim. Cite claim_id." },
  { role: "user", content: "When was the Transformer architecture introduced?" },
];

while (true) {
  const resp = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools, // same shape as Python example above
    temperature: 0,
  });
  const msg = resp.choices[0].message;
  messages.push(msg);
  if (!msg.tool_calls?.length) { console.log(msg.content); break; }

  for (const tc of msg.tool_calls) {
    const result = await callTool(tc.function.name, JSON.parse(tc.function.arguments));
    messages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
  }
}
`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why this pattern</h2>
        <ul className="text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-6 space-y-2">
          <li>
            <strong>Zero prompt engineering</strong> — the model invokes
            tools by signature alone. No "you must always search before
            answering" boilerplate.
          </li>
          <li>
            <strong>Conditional retrieval</strong> — the model skips the
            tool for trivial questions. Cost stays low; latency stays
            human-feeling on questions VERITAS can't help with.
          </li>
          <li>
            <strong>Composable</strong> — VERITAS lives alongside your
            other tools (calendar lookup, internal search, web search,
            calculator). The model decides which to chain.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Anthropic Claude tool use</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Same pattern, slightly different shape. Translate the OpenAI
          tools above to the Anthropic <code className="font-mono">tools</code>
          parameter — the field names + payloads transfer cleanly:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`tools_anthropic = [
    {
        "name": "search_claims",
        "description": "Search the SourceScore VERITAS catalog of verified AI/ML claims.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "limit": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
    },
    # ... same for verify_claim
]`}</code></pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/" className="underline">Full API reference</a></li>
          <li>• <a href="/docs/integrations/langchain/" className="underline">LangChain guide</a></li>
          <li>• <a href="/docs/integrations/llamaindex/" className="underline">LlamaIndex guide</a></li>
          <li>• <a href="/claims/" className="underline">Browse the catalog</a></li>
          <li>• <a href="/pricing/" className="underline">Pricing + signup</a></li>
        </ul>
      </section>
    </article>
  );
}
