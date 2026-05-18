// VERITAS-Reborn — Pydantic AI integration guide (6th framework).
// Pydantic AI is the fastest-growing type-safe agent framework in 2026;
// every tool call has typed inputs + outputs via Pydantic models.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { pydanticAiHowTo } from "@/lib/howto-schemas";
export const metadata: Metadata = {
  title: "Pydantic AI + SourceScore VERITAS — type-safe claim verification for AI agents",
  description:
    "Wire SourceScore VERITAS into Pydantic AI as a typed tool function. Type-safe input + output models, validator chains, and structured verification metadata in agent responses.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/pydantic-ai/" },
  openGraph: {
    title: "Pydantic AI + SourceScore VERITAS",
    description: "Type-safe claim verification with Pydantic models.",
    url: "https://sourcescore.org/docs/integrations/pydantic-ai/",
    type: "article",
  },
};

export default function PydanticAIIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Pydantic AI + SourceScore VERITAS: type-safe claim verification for AI agents",
            description:
              "Wire SourceScore VERITAS into Pydantic AI as a typed tool function. Type-safe input + output models with structured verification metadata.",
            datePublished: "2026-05-16",
            dateModified: "2026-05-16",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/pydantic-ai/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pydanticAiHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "Pydantic AI", url: "https://sourcescore.org/docs/integrations/pydantic-ai/" },
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
        <span className="text-zinc-700 dark:text-zinc-300">Pydantic AI</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Pydantic AI + SourceScore VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Type-safe claim verification as a Pydantic AI tool. The model
          calls <code className="text-sm">verify_claim()</code> with a
          structured input, gets back a typed verification envelope, and
          the agent loop continues with validated data — not free-text.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why Pydantic AI fits this well</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-3">
          Pydantic AI&apos;s design principle is: tools are typed
          functions with Pydantic models for inputs and outputs. The model
          gets a JSON schema; the runtime validates every tool call
          against the schema before the function runs.
        </p>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          That maps cleanly onto VERITAS&apos;s envelope format. We
          define a <code className="text-sm">VerificationResult</code>
          Pydantic model, the agent emits structured tool calls, and the
          downstream consumer (your application) gets a typed object —
          not a free-text claim with maybe-a-link.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Installation</h2>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`pip install pydantic-ai httpx`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: verify-claim tool with typed envelope</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          Define the Pydantic models for tool input + output, register
          the tool with the agent, and let the LLM call it when it needs
          to verify a factual claim.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
import httpx

class VerifyClaimInput(BaseModel):
    """Input for the verify_claim tool."""
    claim: str = Field(description="Natural-language claim to verify")
    min_confidence: float = Field(default=0.85, ge=0.0, le=1.0)

class VerificationSource(BaseModel):
    url: str
    title: str
    publisher: str
    type: str
    published_date: str | None = None

class VerifiedClaim(BaseModel):
    id: str
    subject: str
    predicate: str
    object: str
    statement: str
    confidence: float
    sources: list[VerificationSource]
    detail_url: str

class VerifySignature(BaseModel):
    algorithm: str
    signed_by: str
    signed_at: str
    signature: str

class VerificationResult(BaseModel):
    """Typed envelope from VERITAS /verify."""
    query: str
    best_match: VerifiedClaim | None
    confidence: float
    matches_count: int
    signature: VerifySignature | None = None

agent = Agent(
    "openai:gpt-4o",
    system_prompt=(
        "You are a research assistant. When a user makes a factual "
        "claim about AI/ML, call verify_claim() before responding. "
        "If unverified, say so explicitly."
    ),
)

@agent.tool
async def verify_claim(ctx: RunContext, input: VerifyClaimInput) -> VerificationResult:
    """Verify a natural-language claim against SourceScore VERITAS."""
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://sourcescore.org/api/v1/verify",
            json={"claim": input.claim, "minConfidence": input.min_confidence},
            timeout=5.0,
        )
        data = r.json()
        return VerificationResult.model_validate(data)

# Use it:
result = await agent.run("When was Llama 3.1 released?")
print(result.output)
# Agent calls verify_claim(input=VerifyClaimInput(claim="Llama 3.1 release date"))
# Gets back VerificationResult with typed VerifiedClaim
# Responds: "Llama 3.1 was released 2024-07-23 per the Meta AI announcement
# and the Hugging Face model card (source: https://sourcescore.org/claims/...)."`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: structured agent output with required verification</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          Force the agent to emit a typed answer with verification
          metadata via Pydantic AI&apos;s <code className="text-sm">result_type</code>{" "}
          parameter. The model can&apos;t return a free-text answer; it
          must populate a structured object including the verification
          source.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`class AnsweredQuestion(BaseModel):
    """Required output shape — every answer must include verification."""
    question: str
    answer: str
    verification_status: str  # "verified" | "unverified" | "refuted"
    primary_sources: list[str]  # URLs from verify_claim
    confidence: float

agent_with_typed_output = Agent(
    "openai:gpt-4o",
    result_type=AnsweredQuestion,
    system_prompt=(
        "Answer questions about AI/ML by calling verify_claim() for "
        "each factual assertion. Populate the AnsweredQuestion fields "
        "with the verification data; never invent sources."
    ),
)

# The agent.tool decorator from the previous section also registers here
agent_with_typed_output._tools.update(agent._tools)

result = await agent_with_typed_output.run(
    "When was GPT-4 released and how many parameters does it have?"
)

# result.output is now strictly typed:
print(result.output.question)             # str
print(result.output.answer)               # str
print(result.output.verification_status)  # "verified" | "unverified" | "refuted"
print(result.output.primary_sources)      # list[str]
print(result.output.confidence)           # 0.0-1.0`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: multi-claim verification with validation</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          For research-assistant agents that return multiple claims,
          verify all of them in parallel before composing the response.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`from typing import List
import asyncio

class ClaimWithVerification(BaseModel):
    claim_text: str
    verified: bool
    confidence: float
    source_url: str | None

class MultiClaimResponse(BaseModel):
    summary: str
    claims: List[ClaimWithVerification]
    verification_rate: float  # % of claims that resolved with ≥0.85 confidence

@agent.tool
async def verify_many(ctx: RunContext, claims: list[str]) -> List[ClaimWithVerification]:
    """Verify multiple claims in parallel."""
    async with httpx.AsyncClient() as client:
        responses = await asyncio.gather(*[
            client.post(
                "https://sourcescore.org/api/v1/verify",
                json={"claim": c, "minConfidence": 0.85},
                timeout=5.0,
            )
            for c in claims
        ])

    out = []
    for claim, response in zip(claims, responses):
        data = response.json()
        match = data.get("bestMatch")
        out.append(ClaimWithVerification(
            claim_text=claim,
            verified=match is not None and match["confidence"] >= 0.85,
            confidence=match["confidence"] if match else 0.0,
            source_url=match["detailUrl"] if match else None,
        ))
    return out

# In the agent's response composition:
result = await research_agent.run(
    "What can you tell me about Llama 3.1, GPT-4, and Claude 3?"
)
# Agent calls verify_many(["Llama 3.1 release", "GPT-4 release", "Claude 3 release"])
# Composes response only from verified claims; flags unverified explicitly`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why this pattern beats free-text</h2>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li><strong>No hallucinated sources.</strong> The model can&apos;t cite a URL it didn&apos;t get from verify_claim — the source field is a typed string from the API response, not a hallucinated string from the model.</li>
          <li><strong>No silent confidence drift.</strong> Pydantic validates that confidence is in [0.0, 1.0]; the model can&apos;t emit "high confidence" as a free-text string.</li>
          <li><strong>Downstream code is type-safe.</strong> Your application that consumes the agent output gets a Pydantic object, not a JSON-shaped string that might be missing fields.</li>
          <li><strong>Validators catch errors early.</strong> Add Pydantic <code className="text-sm">@field_validator</code> decorators to reject results that don&apos;t pass your business rules.</li>
        </ul>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">What VERITAS is not (for Pydantic AI agents)</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          VERITAS today covers AI/ML research — model releases,
          foundational papers, organizations, datasets, benchmarks. If
          your agent asks about &quot;the capital of France&quot; the
          verify_claim tool will return <code className="text-sm">best_match=None</code>{" "}
          and your agent should fall through to a different retrieval
          path.
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Catalog: 276 claims today, growing weekly. New verticals
          (cybersecurity, data engineering, scientific computing) ship
          Year 2.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>
            • <a href="/playground/" className="underline">Browser playground</a> — try /verify before wiring it up
          </li>
          <li>
            • <a href="/api/v1/openapi.json" className="underline">OpenAPI 3.1 spec</a> — generate Pydantic models from the spec via{" "}
            <code className="text-xs">datamodel-code-generator</code>
          </li>
          <li>
            • <a href="/docs/integrations/dspy/" className="underline">DSPy guide</a> — compound-AI-system framework
          </li>
          <li>
            • <a href="/docs/integrations/openai-tools/" className="underline">OpenAI tool-calls</a> — the underlying primitive
          </li>
          <li>
            • <a href="/claims/" className="underline">Browse the catalog</a> — 276 verified AI/ML claims
          </li>
        </ul>
      </section>

      <section className="text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          Bug in this guide?{" "}
          <a href="/contact/" className="underline">Tell us</a>. Pydantic AI&apos;s API surface evolves fast; we update
          this guide on every minor release.
        </p>
      </section>
    </article>
  );
}
