// VERITAS-Reborn — Anthropic Claude SDK integration guide (7th framework).
// Anthropic SDK tool-use pattern; mirror of /docs/integrations/openai-tools/
// for Claude's tool_use response format. Audience: Anthropic SDK users.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { anthropicSdkHowTo } from "@/lib/howto-schemas";
export const metadata: Metadata = {
  title: "Anthropic SDK + SourceScore VERITAS — tool-use claim verification for Claude",
  description:
    "Expose SourceScore VERITAS as a Claude tool via the Anthropic SDK. The model auto-invokes verify_claim when it needs to ground a factual assertion. Python + TypeScript examples.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/anthropic-sdk/" },
  openGraph: {
    title: "Anthropic SDK + SourceScore VERITAS",
    description: "Claude tool-use pattern for signed claim verification.",
    url: "https://sourcescore.org/docs/integrations/anthropic-sdk/",
    type: "article",
  },
};

export default function AnthropicSDKIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Anthropic SDK + SourceScore VERITAS: tool-use claim verification for Claude",
            description:
              "Expose SourceScore VERITAS as a Claude tool via the Anthropic SDK. Python + TypeScript examples.",
            datePublished: "2026-05-16",
            dateModified: "2026-05-16",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/anthropic-sdk/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(anthropicSdkHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "Anthropic SDK", url: "https://sourcescore.org/docs/integrations/anthropic-sdk/" },
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
        <span className="text-zinc-700 dark:text-zinc-300">Anthropic SDK</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Anthropic SDK + SourceScore VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Expose VERITAS as a Claude tool via the Anthropic SDK. When
          Claude needs to ground a factual claim, it emits a{" "}
          <code className="text-sm">tool_use</code> block calling{" "}
          <code className="text-sm">verify_claim</code>; you execute the
          API call and feed the result back as a{" "}
          <code className="text-sm">tool_result</code>; Claude composes
          the final answer with the verified data.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Installation</h2>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`# Python
pip install anthropic httpx

# TypeScript / Node
npm install @anthropic-ai/sdk`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: tool definition + agent loop (Python)</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          Claude&apos;s tool-use protocol is a multi-turn loop: model
          emits <code className="text-sm">tool_use</code>, you execute,
          you reply with <code className="text-sm">tool_result</code>,
          model composes final response. SourceScore&apos;s response
          envelope drops in as a{" "}
          <code className="text-sm">tool_result</code> content block
          verbatim.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`import anthropic
import httpx
import json

client = anthropic.Anthropic()  # picks up ANTHROPIC_API_KEY

tools = [
    {
        "name": "verify_claim",
        "description": (
            "Verify a natural-language factual claim about AI/ML "
            "research (model releases, papers, dates, parameter counts). "
            "Returns a verified-claim envelope with primary sources and "
            "HMAC signature, or no match if the claim isn't in the catalog."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "claim": {
                    "type": "string",
                    "description": "Natural-language claim to verify",
                },
                "min_confidence": {
                    "type": "number",
                    "description": "Minimum confidence threshold (0.0-1.0)",
                    "default": 0.85,
                },
            },
            "required": ["claim"],
        },
    },
]

async def execute_verify_claim(claim: str, min_confidence: float = 0.85) -> dict:
    """Call SourceScore VERITAS /verify endpoint."""
    async with httpx.AsyncClient() as http:
        r = await http.post(
            "https://sourcescore.org/api/v1/verify",
            json={"claim": claim, "minConfidence": min_confidence},
            timeout=5.0,
        )
        return r.json()

async def chat(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-opus-4-7",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        # If Claude wants to use a tool, execute it
        if response.stop_reason == "tool_use":
            tool_use_block = next(
                b for b in response.content if b.type == "tool_use"
            )

            if tool_use_block.name == "verify_claim":
                result = await execute_verify_claim(
                    claim=tool_use_block.input["claim"],
                    min_confidence=tool_use_block.input.get("min_confidence", 0.85),
                )

                # Continue the loop with the tool result
                messages.append({"role": "assistant", "content": response.content})
                messages.append({
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_use_block.id,
                            "content": json.dumps(result),
                        }
                    ],
                })
                continue

        # No more tool use; return Claude's final response
        return "".join(b.text for b in response.content if b.type == "text")

# Use it:
import asyncio
answer = asyncio.run(chat("When was Llama 3.1 released?"))
print(answer)
# → "Llama 3.1 was released on 2024-07-23, per the Meta AI announcement
#    and the model card on Hugging Face."`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: TypeScript with the @anthropic-ai/sdk</h2>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const tools: Anthropic.Tool[] = [
  {
    name: "verify_claim",
    description: (
      "Verify a natural-language factual claim about AI/ML research. " +
      "Returns a verified-claim envelope with primary sources and HMAC signature."
    ),
    input_schema: {
      type: "object",
      properties: {
        claim: { type: "string" },
        min_confidence: { type: "number", default: 0.85 },
      },
      required: ["claim"],
    },
  },
];

async function executeVerifyClaim(claim: string, minConfidence = 0.85) {
  const r = await fetch("https://sourcescore.org/api/v1/verify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ claim, minConfidence }),
  });
  return r.json();
}

async function chat(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  while (true) {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      tools,
      messages,
    });

    if (response.stop_reason === "tool_use") {
      const toolUseBlock = response.content.find(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
      );
      if (!toolUseBlock) break;

      if (toolUseBlock.name === "verify_claim") {
        const result = await executeVerifyClaim(
          (toolUseBlock.input as { claim: string }).claim,
          (toolUseBlock.input as { min_confidence?: number }).min_confidence ?? 0.85,
        );

        messages.push({ role: "assistant", content: response.content });
        messages.push({
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: toolUseBlock.id,
              content: JSON.stringify(result),
            },
          ],
        });
        continue;
      }
    }

    return response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
  }
  return "";
}

const answer = await chat("When was Llama 3.1 released?");
console.log(answer);`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">When Claude self-corrects with verify_claim</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-3">
          One useful pattern: a system prompt that instructs Claude to
          verify any claim it&apos;s about to emit about AI/ML before
          including it in the response. Claude will autonomously decide
          to call verify_claim mid-reasoning, then either confirm or
          correct its initial assertion.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`system_prompt = """You are a research assistant for AI/ML topics.

CRITICAL: When you make ANY factual claim about an AI model, paper,
release date, parameter count, or architecture decision — you MUST
verify it via the verify_claim tool BEFORE including it in your response.

If verify_claim returns best_match with confidence >= 0.85, cite the
detail_url in your response. If best_match is null OR confidence < 0.85,
explicitly mark the assertion as "unverified" in your response.

NEVER assert a release date or parameter count without first calling
verify_claim. The cost of being wrong is higher than the latency of
the API call."""`}
        </pre>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mt-3">
          With this system prompt, Claude self-grounds. The downstream
          application doesn&apos;t need to extract claims + verify
          them — Claude does it inline.
        </p>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">When this pattern fits</h2>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li><strong>Conversational AI/ML research assistants</strong> — where users ask factual questions and you want the model to ground itself</li>
          <li><strong>Documentation chatbots over AI/ML knowledge</strong> — internal team support tools, public-facing FAQs</li>
          <li><strong>Citation-required production systems</strong> — papers, technical reports, audit trails</li>
          <li><strong>Multi-step agentic flows where one step is "look up a fact"</strong></li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/integrations/openai-tools/" className="underline">OpenAI tool-calls guide</a> — the parallel pattern for GPT-4</li>
          <li>• <a href="/docs/integrations/pydantic-ai/" className="underline">Pydantic AI guide</a> — typed-tool pattern with validators</li>
          <li>• <a href="/playground/" className="underline">Playground</a> — try /verify before wiring it up</li>
          <li>• <a href="/api/v1/openapi.json" className="underline">OpenAPI 3.1 spec</a> — full endpoint reference</li>
          <li>• <a href="/claims/" className="underline">Catalog</a> — 326 verified AI/ML claims</li>
        </ul>
      </section>
    </article>
  );
}
