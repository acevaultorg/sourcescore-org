// VERITAS-Reborn — HowTo schema per integration guide.
//
// Single source of truth for HowTo schemas across /docs/integrations/[slug]/.
// Adds Google Rich Result eligibility + LLM extraction structure (Aleyda
// 10-char #4 Extractable). Each integration guide imports + emits its
// HowTo via <script type="application/ld+json">.

interface HowToSchema {
  "@context": "https://schema.org";
  "@type": "HowTo";
  name: string;
  description: string;
  totalTime: string;
  tool: { "@type": "HowToTool"; name: string }[];
  supply: { "@type": "HowToSupply"; name: string }[];
  step: { "@type": "HowToStep"; position: number; name: string; text: string }[];
}

const COMMON_SUPPLY = [
  { "@type": "HowToSupply" as const, name: "SourceScore VERITAS API (free tier: 1,000 calls/month)" },
];

export const llamaindexHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS with LlamaIndex",
  description:
    "Wire VERITAS into LlamaIndex as a custom Retriever + NodePostprocessor. Works with QueryEngine and ChatEngine.",
  totalTime: "PT20M",
  tool: [
    { "@type": "HowToTool", name: "LlamaIndex" },
    { "@type": "HowToTool", name: "Python" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install llama-index httpx" },
    { "@type": "HowToStep", position: 2, name: "Define VeritasRetriever", text: "Subclass BaseRetriever; in _retrieve, POST claim to /api/v1/verify and return matching node(s) with claim metadata." },
    { "@type": "HowToStep", position: 3, name: "Wire into QueryEngine", text: "Pass VeritasRetriever as retriever in RetrieverQueryEngine.from_args(); add VeritasNodePostprocessor for confidence-stamped citations." },
    { "@type": "HowToStep", position: 4, name: "Test on AI/ML factual queries", text: "Query 'When was Llama 3.1 released?'. Confirm response includes signed claim envelope + detailUrl citation." },
  ],
};

export const openaiToolsHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Expose SourceScore VERITAS as an OpenAI tool",
  description:
    "Declare verify_claim as a function in OpenAI Chat Completions tools. The model auto-invokes when uncertain about a factual claim.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "OpenAI SDK" },
    { "@type": "HowToTool", name: "Python or TypeScript" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install openai httpx OR npm install openai" },
    { "@type": "HowToStep", position: 2, name: "Define tool schema", text: "Declare verify_claim function with claim (string) + min_confidence (number, default 0.85) parameters in chat.completions.create tools array." },
    { "@type": "HowToStep", position: 3, name: "Implement agent loop", text: "On stop_reason='tool_calls', POST to /api/v1/verify; append tool result message; re-invoke chat.completions until final text." },
    { "@type": "HowToStep", position: 4, name: "Update system prompt", text: "Instruct the model to verify any factual AI/ML assertion before emitting it." },
  ],
};

export const vercelAiSdkHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS into Vercel AI SDK",
  description:
    "Wire VERITAS as a tool in streamText for Next.js + edge streaming chat interfaces.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "Vercel AI SDK" },
    { "@type": "HowToTool", name: "Next.js" },
    { "@type": "HowToTool", name: "TypeScript" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "npm install ai @ai-sdk/openai" },
    { "@type": "HowToStep", position: 2, name: "Define verify_claim tool", text: "Use tool() helper with zod schema for claim + min_confidence; fetch /api/v1/verify in execute." },
    { "@type": "HowToStep", position: 3, name: "Add to streamText", text: "Pass tool in streamText({ tools: { verify_claim: ... } }) in your /api/chat route." },
    { "@type": "HowToStep", position: 4, name: "Render in UI", text: "Use useChat hook; tool invocations stream client-side and render verified-claim citations inline." },
  ],
};

export const dspyHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS into DSPy",
  description:
    "Wire VERITAS into a DSPy program as a custom Retrieve module + verify post-processor. Compatible with DSPy optimizers.",
  totalTime: "PT25M",
  tool: [
    { "@type": "HowToTool", name: "DSPy" },
    { "@type": "HowToTool", name: "Python" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install dspy-ai httpx" },
    { "@type": "HowToStep", position: 2, name: "Define VeritasRetrieve", text: "Subclass dspy.Retrieve; in forward, POST query to /api/v1/search and return dspy.Examples with claim_id, confidence, canonical URL metadata." },
    { "@type": "HowToStep", position: 3, name: "Define VeritasVerify post-processor", text: "Subclass dspy.Module; after answer generation, extract assertions and verify each via /api/v1/verify; return verified/unverified split + verification_rate metric." },
    { "@type": "HowToStep", position: 4, name: "Compose ProgramOfThought", text: "Chain retrieve → reason → verify in a multi-hop DSPy program. Use verification_rate as the optimizer metric for prompt tuning." },
  ],
};

export const pydanticAiHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS as a Pydantic AI tool",
  description:
    "Type-safe verify_claim tool with VerifyClaimInput → VerificationResult Pydantic models. Validators catch confidence drift; downstream code is type-safe.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "Pydantic AI" },
    { "@type": "HowToTool", name: "Python" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install pydantic-ai httpx" },
    { "@type": "HowToStep", position: 2, name: "Define Pydantic models", text: "Create VerifyClaimInput (claim + min_confidence) and VerificationResult (best_match + sources + signature) Pydantic models." },
    { "@type": "HowToStep", position: 3, name: "Register tool with agent", text: "Decorate verify_claim function with @agent.tool; agent emits structured tool calls; runtime validates against schemas before execution." },
    { "@type": "HowToStep", position: 4, name: "Use structured agent output", text: "Set result_type=AnsweredQuestion with verification_status + primary_sources fields; model populates structured object instead of free text." },
  ],
};

export const anthropicSdkHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Expose SourceScore VERITAS as a Claude tool via Anthropic SDK",
  description:
    "Wire verify_claim into Claude's tool-use protocol: tool_use → execute → tool_result loop. Python + TypeScript examples.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "Anthropic SDK" },
    { "@type": "HowToTool", name: "Python or TypeScript" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install Anthropic SDK", text: "pip install anthropic httpx OR npm install @anthropic-ai/sdk" },
    { "@type": "HowToStep", position: 2, name: "Define tool with input_schema", text: "Declare verify_claim tool with claim (string) + min_confidence (number) input schema; description tells Claude when to invoke." },
    { "@type": "HowToStep", position: 3, name: "Implement agent loop", text: "On stop_reason='tool_use', execute tool function (POST /api/v1/verify), append tool_result message, continue loop until final text response." },
    { "@type": "HowToStep", position: 4, name: "Add self-verify system prompt", text: "Instruct Claude to call verify_claim before asserting any AI/ML factual claim. Claude self-grounds without downstream extraction." },
  ],
};

export const instructorHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS with Instructor",
  description:
    "Type-safe structured outputs with parse-time VERITAS verification. Failed verification triggers Instructor's auto-retry.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "Instructor" },
    { "@type": "HowToTool", name: "Python + Pydantic" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install instructor httpx pydantic" },
    { "@type": "HowToStep", position: 2, name: "Define ClaimAnswer model", text: "Pydantic model with claim + answer + source_url + confidence fields; @model_validator hook calls /api/v1/verify at parse-time." },
    { "@type": "HowToStep", position: 3, name: "Set max_retries on completion", text: "client.chat.completions.create(response_model=ClaimAnswer, max_retries=3). Failed verification raises ValueError; Instructor retries with updated prompt." },
    { "@type": "HowToStep", position: 4, name: "Compose multi-claim research summary", text: "Define ResearchSummary with key_claims: List[VerifiedClaim]; every list entry verified individually at parse-time before downstream code receives the typed object." },
  ],
};
