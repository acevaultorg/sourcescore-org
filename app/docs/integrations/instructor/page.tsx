// VERITAS-Reborn — Instructor integration guide (8th framework).
// Jason Liu's Instructor library is the canonical pattern for getting
// typed structured outputs from LLMs. Pairs cleanly with VERITAS for
// candidate-record structured responses.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { instructorHowTo } from "@/lib/howto-schemas";
export const metadata: Metadata = {
  title: "Instructor + SourceScore VERITAS — structured-output claim verification",
  description:
    "Wire SourceScore VERITAS into Instructor for type-safe structured responses with candidate records. Pydantic validates retrieval data; compare primary evidence before asserting a fact.",
  alternates: { canonical: "https://sourcescore.org/docs/integrations/instructor/" },
  openGraph: {
    title: "Instructor + SourceScore VERITAS",
    description: "Type-safe structured outputs with candidate records.",
    url: "https://sourcescore.org/docs/integrations/instructor/",
    type: "article",
  },
};

export default function InstructorIntegration() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: "Instructor + SourceScore VERITAS: structured-output claim verification",
            description:
              "Wire SourceScore VERITAS into Instructor for type-safe structured responses with candidate records.",
            datePublished: "2026-05-17",
            dateModified: "2026-05-17",
            author: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            publisher: { "@type": "Organization", name: "SourceScore", url: "https://sourcescore.org" },
            mainEntityOfPage: "https://sourcescore.org/docs/integrations/instructor/",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(instructorHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
              { name: "Integrations", url: "https://sourcescore.org/docs/integrations/" },
              { name: "Instructor", url: "https://sourcescore.org/docs/integrations/instructor/" },
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
        <span className="text-zinc-700 dark:text-zinc-300">Instructor</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Instructor + SourceScore VERITAS
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Instructor (Jason Liu&apos;s library) is the canonical pattern
          for getting typed structured outputs from LLMs. Pair it with
          VERITAS for structured responses where cited assertions can
          carry a candidate record. Pydantic validates that the
          retrieval shape is usable; your application must still compare
          its primary evidence before making a factual assertion.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Installation</h2>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`pip install instructor httpx`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: typed claim with candidate-source field</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          Define a Pydantic model where the LLM populates structured
          fields including a <code className="text-sm">source_url</code>{" "}
          field populated from a VERITAS lookup. The validator runs at
          response-parsing time; a match is retrieval similarity, not a
          truth verdict, so compare the linked primary evidence before use.
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`from pydantic import BaseModel, field_validator, model_validator
from openai import OpenAI
import instructor
import httpx

client = instructor.from_openai(OpenAI())

class ClaimAnswer(BaseModel):
    """LLM response with a candidate catalog record."""
    claim: str
    answer: str
    source_url: str | None = None
    confidence: float = 0.0

    @model_validator(mode="after")
    def retrieve_candidate(self) -> "ClaimAnswer":
        """Retrieve a candidate record; compare its evidence before asserting truth."""
        r = httpx.post(
            "https://sourcescore.org/api/v1/verify",
            json={"claim": self.claim, "minConfidence": 0.85},
            timeout=5.0,
        )
        result = r.json()
        match = result.get("bestMatch")
        if match and match["confidence"] >= 0.85:
            self.source_url = match["detailUrl"]
            self.confidence = match["confidence"]
        else:
            # Trigger Instructor retry with a different LLM phrasing
            raise ValueError(
                f"No sufficiently similar catalog candidate for '{self.claim}'. "
                "Please rephrase using a more specific fact."
            )
        return self

# Use it:
result = client.chat.completions.create(
    model="gpt-4o",
    response_model=ClaimAnswer,
    messages=[
        {"role": "user", "content": "When was Llama 3.1 released?"},
    ],
    max_retries=3,  # Instructor retries on validation failure
)

print(result.claim)        # "Llama 3.1 release date"
print(result.answer)       # "2024-07-23"
print(result.source_url)   # "https://sourcescore.org/api/v1/claims/.../"
print(result.confidence)   # 1.0`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Pattern: list of candidate records</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 mb-4">
          For research-assistant agents that produce multiple claims,
          extract a list of candidate-record objects, then independently
          review the linked evidence for each assertion:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-md overflow-x-auto">
{`from typing import List
from pydantic import BaseModel, field_validator

class CandidateRecord(BaseModel):
    statement: str
    source_url: str
    confidence: float

    @field_validator("source_url", mode="before")
    @classmethod
    def retrieve_candidate(cls, v, info):
        statement = info.data.get("statement", "")
        r = httpx.post(
            "https://sourcescore.org/api/v1/verify",
            json={"claim": statement, "minConfidence": 0.85},
            timeout=5.0,
        )
        result = r.json()
        match = result.get("bestMatch")
        if not match or match["confidence"] < 0.85:
            raise ValueError(f"No sufficiently similar catalog candidate: {statement!r}")
        return match["detailUrl"]

class ResearchSummary(BaseModel):
    topic: str
    summary: str
    key_claims: List[CandidateRecord]

result = client.chat.completions.create(
    model="gpt-4o",
    response_model=ResearchSummary,
    messages=[
        {"role": "user", "content": "Summarize the foundational papers behind modern LLMs."},
    ],
    max_retries=3,
)

# result is a typed ResearchSummary; typing does not prove its assertions
# every key_claims entry has a retrieved catalog candidate; compare primary
# sources yourself before presenting the statement as fact
for c in result.key_claims:
    print(f"{c.statement} — {c.source_url} (conf: {c.confidence})")`}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Why this pattern beats free-text + post-hoc retrieval</h2>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li><strong>Validation happens at parse-time.</strong> A missing candidate triggers Instructor&apos;s retry mechanism before the user sees a response.</li>
          <li><strong>Type-safety at the application boundary.</strong> Downstream code receives a typed Pydantic object and can require an evidence-review step before rendering a factual assertion.</li>
          <li><strong>No regex extraction.</strong> Free-text + post-hoc retrieval needs heuristic claim extraction (which fails on multi-clause sentences). Instructor extracts claims at structured-output time.</li>
          <li><strong>Retries are automatic.</strong> max_retries=3 means three attempts at a catalog match before failing. Tunable per-call.</li>
        </ul>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">When this pattern fits</h2>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li>Production AI/ML research assistants with a human or programmatic primary-evidence review step</li>
          <li>Documentation chatbots that summarize technical content</li>
          <li>Internal company knowledge tools that need typed candidate records and citations</li>
          <li>Citation-heavy reports or briefs where each assertion is reviewed against its sources</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Comparison: Instructor vs Pydantic AI</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3">
          Both libraries solve the &quot;typed LLM outputs&quot;
          problem. Differences:
        </p>
        <ul className="text-sm space-y-2 list-disc pl-5">
          <li><strong>Instructor</strong> — older, larger ecosystem, supports more LLM providers, no built-in tool-calling abstractions. Pair-with-anything design.</li>
          <li><strong>Pydantic AI</strong> — newer, agent-loop-aware, native tool registration, type-safety end-to-end. More opinionated; bigger framework.</li>
        </ul>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Pick Instructor for one-shot structured-output use cases. Pick{" "}
          <a href="/docs/integrations/pydantic-ai/" className="underline">Pydantic AI</a>{" "}
          for agent loops with multiple tool calls. Both work with
          VERITAS the same way.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Next steps</h2>
        <ul className="text-sm space-y-2">
          <li>• <a href="/docs/integrations/pydantic-ai/" className="underline">Pydantic AI guide</a> — agent-loop variant</li>
          <li>• <a href="/use-cases/research-citation/" className="underline">Research citation use case</a> — Instructor-shape patterns</li>
          <li>• <a href="/playground/" className="underline">Playground</a> — try /verify before wiring it up</li>
          <li>• <a href="/api/v1/openapi.json" className="underline">OpenAPI 3.1 spec</a></li>
          <li>• <a href="/claims/" className="underline">Catalog</a> — 384 reviewed AI/ML claim records</li>
        </ul>
      </section>
    </article>
  );
}
