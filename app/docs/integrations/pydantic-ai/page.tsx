// VERITAS-Reborn — Pydantic AI integration guide (6th framework).
// Pydantic AI typed-tool integration guide.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { pydanticAiHowTo } from "@/lib/howto-schemas";
export const metadata: Metadata = {
  title: "Pydantic AI + SourceScore VERITAS — type-safe candidate retrieval",
  description:
    "Wire SourceScore VERITAS into Pydantic AI as a typed candidate-retrieval tool. Schema validation covers shape; factual support still needs evidence review.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/pydantic-ai/" },
  openGraph: {
    title: "Pydantic AI + SourceScore VERITAS",
    description: "Type-safe candidate retrieval with Pydantic models and explicit evidence review.",
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
            headline: "Pydantic AI + SourceScore VERITAS: type-safe candidate retrieval",
            description:
              "Wire SourceScore VERITAS into Pydantic AI as a typed retrieval tool without confusing schema validity with factual support.",
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
          Type-safe candidate retrieval as a Pydantic AI tool. The model
          calls <code className="text-sm">find_claim_candidate()</code> with a
          structured input, gets back a typed retrieval envelope, and
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
          define a <code className="text-sm">CandidateLookupResult</code>
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
        <h2 className="text-xl font-semibold mb-3">Pattern: candidate lookup with the real response shape</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          Define the Pydantic models for tool input + output, register
          the tool with the agent, and let the LLM call it when it needs
          a possible catalog record. The type layer does not prove a fact.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
import httpx

class ClaimLookupInput(BaseModel):
    """Input for candidate retrieval."""
    claim: str = Field(description="Natural-language assertion to look up")
    min_confidence: float = Field(default=0.85, ge=0.0, le=1.0)

class CandidateRecord(BaseModel):
    id: str
    subject: str
    predicate: str
    object: str
    statement: str
    confidence: float
    detailUrl: str

class CandidateMatch(BaseModel):
    claim: CandidateRecord
    matchScore: float
    rationale: str

class CandidateLookupResult(BaseModel):
    """Typed /verify response. The endpoint name is legacy."""
    query: str
    method: str
    note: str
    matches: list[CandidateMatch]
    bestMatch: CandidateRecord | None = None
    signature: dict | None = None

agent = Agent(
    "openai:gpt-4o",
    system_prompt=(
        "You are a research assistant. When a user makes a factual "
        "assertion about AI/ML, call find_claim_candidate() before responding. "
        "A bestMatch is retrieval similarity, not a truth verdict. Return its "
        "detailUrl for application-side evidence review; do not present it as proof."
    ),
)

@agent.tool
async def find_claim_candidate(ctx: RunContext, input: ClaimLookupInput) -> CandidateLookupResult:
    """Retrieve a candidate record for a natural-language claim."""
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://sourcescore.org/api/v1/verify",
            json={"claim": input.claim, "minConfidence": input.min_confidence},
            timeout=5.0,
        )
        data = r.json()
        return CandidateLookupResult.model_validate(data)

# Use it:
result = await agent.run("When was Llama 3.1 released?")
print(result.output)
# Agent can call find_claim_candidate with a typed input. A returned candidate
# is not enough to answer: fetch candidate.detailUrl and compare its statement
# and cited evidence with the intended assertion before rendering a citation.`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: keep retrieval and reviewed support separate</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          Ask the agent to emit typed candidate metadata via Pydantic AI&apos;s
          <code className="text-sm">output_type</code>{" "}
          parameter. The model can&apos;t return a free-text answer; it
          must populate a structured object. Your application adds a separate
          reviewed-support decision after inspecting evidence.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`class AnsweredQuestion(BaseModel):
    """Retrieval output shape; not an accuracy certificate."""
    question: str
    answer: str
    retrieval_status: str  # "candidate_found" | "no_candidate"
    candidate_urls: list[str]  # fetch and review before asserting truth
    record_confidence: float

agent_with_typed_output = Agent(
    "openai:gpt-4o",
    output_type=AnsweredQuestion,
    system_prompt=(
        "For AI/ML assertions, call find_claim_candidate() for "
        "each factual assertion. Populate the AnsweredQuestion fields "
        "with candidate retrieval data; never invent sources or treat a match as proof."
    ),
)

# Register the same public tool function on this agent; do not copy private internals.
agent_with_typed_output.tool(find_claim_candidate)

result = await agent_with_typed_output.run(
    "When was GPT-4 released and how many parameters does it have?"
)

# result.output is now strictly typed:
print(result.output.question)             # str
print(result.output.answer)               # str
print(result.output.retrieval_status)     # "candidate_found" | "no_candidate"
print(result.output.candidate_urls)       # list[str], not yet evidence-approved
print(result.output.record_confidence)    # legacy record metadata`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: multi-claim candidate retrieval</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          For research-assistant agents that return multiple claims,
          retrieve candidates in parallel, then review each before composing.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`from typing import List
import asyncio

class ClaimWithCandidate(BaseModel):
    claim_text: str
    candidate_found: bool
    record_confidence: float
    candidate_url: str | None

class MultiClaimResponse(BaseModel):
    summary: str
    claims: List[ClaimWithCandidate]
    candidate_rate: float  # % with a similar catalog record; not a truth rate

@agent.tool
async def retrieve_many(ctx: RunContext, claims: list[str]) -> List[ClaimWithCandidate]:
    """Retrieve candidate records in parallel; review their evidence separately."""
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
        out.append(ClaimWithCandidate(
            claim_text=claim,
            candidate_found=match is not None and match["confidence"] >= 0.85,
            record_confidence=match["confidence"] if match else 0.0,
            candidate_url=match["detailUrl"] if match else None,
        ))
    return out

# In the agent's response composition:
result = await agent.run(
    "What can you tell me about Llama 3.1, GPT-4, and Claude 3?"
)
# Agent calls retrieve_many(["Llama 3.1 release", "GPT-4 release", "Claude 3 release"])
# Compares the returned primary sources before composing factual prose; labels
# missing candidates explicitly`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why this pattern beats free-text</h2>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li><strong>Structured source handling.</strong> The example passes returned source URLs through typed fields, which can make application-side validation easier; the model can still produce unsupported text, so validate final output.</li>
          <li><strong>Explicit confidence handling.</strong> Pydantic validates that a returned confidence value fits the expected range; it does not establish that a claim is correct.</li>
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
          lookup tool will return no <code className="text-sm">bestMatch</code>{" "}
          and your agent should fall through to a different retrieval
          path.
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Catalog: 384 reviewed claim records today. Future coverage is
          not promised; check the catalog before relying on a topic.
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
            • <a href="/claims/" className="underline">Browse the catalog</a> — 384 reviewed AI/ML claim records
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
