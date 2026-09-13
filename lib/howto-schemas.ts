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
  { "@type": "HowToSupply" as const, name: "SourceScore VERITAS public API (free, no signup)" },
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
    { "@type": "HowToStep", position: 4, name: "Test on AI/ML factual queries", text: "Query 'When was Llama 3.1 released?'. Inspect the candidate record and detailUrl, then compare its statement and cited evidence with the input." },
  ],
};

export const haystackHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS with Haystack",
  description:
    "Wire VERITAS into a Haystack 2.x pipeline as a custom candidate-record retriever plus an explicit evidence-review stage.",
  totalTime: "PT20M",
  tool: [
    { "@type": "HowToTool", name: "Haystack" },
    { "@type": "HowToTool", name: "Python" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install haystack-ai requests" },
    { "@type": "HowToStep", position: 2, name: "Build a VeritasRetriever component", text: "Decorate a class with @component; in run(query), GET /api/v1/search and return Haystack Documents carrying claim_id, confidence, and detailUrl in meta." },
    { "@type": "HowToStep", position: 3, name: "Add a review component", text: "POST each Document to /api/v1/verify, then compare the candidate statement and cited evidence. Do not treat bestMatch as a truth verdict." },
    { "@type": "HowToStep", position: 4, name: "Wire the pipeline", text: "Pipeline.add_component for retriever, PromptBuilder, and OpenAIGenerator; connect retriever.documents to prompt.documents to llm.prompt, then run." },
  ],
};

export const langgraphHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS into LangGraph",
  description:
    "Wire VERITAS into a LangGraph StateGraph: a retrieve node that pulls candidate claim records, plus a review node that compares generated assertions with cited evidence.",
  totalTime: "PT20M",
  tool: [
    { "@type": "HowToTool", name: "LangGraph" },
    { "@type": "HowToTool", name: "Python" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install langgraph langchain-openai requests" },
    { "@type": "HowToStep", position: 2, name: "Add a veritas_retrieve node", text: "GET /api/v1/search and put the returned candidate records into graph state." },
    { "@type": "HowToStep", position: 3, name: "Add an evidence-review node", text: "POST the generated answer to /api/v1/verify, then compare any bestMatch statement and sources before assigning a grounded status." },
    { "@type": "HowToStep", position: 4, name: "Wire the StateGraph", text: "set_entry_point(retrieve); conditional edge to generate when claims exist; generate to verify to END; compile + invoke." },
  ],
};

export const openaiToolsHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Expose SourceScore VERITAS as an OpenAI tool",
  description:
    "Declare find_claim_candidate as an OpenAI tool, then compare any returned record and cited evidence before use.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "OpenAI SDK" },
    { "@type": "HowToTool", name: "Python or TypeScript" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install openai httpx OR npm install openai" },
    { "@type": "HowToStep", position: 2, name: "Define tool schema", text: "Declare find_claim_candidate with claim and min_confidence parameters; describe it as retrieval rather than factual verification." },
    { "@type": "HowToStep", position: 3, name: "Implement agent loop", text: "On stop_reason='tool_calls', POST to /api/v1/verify; append tool result message; re-invoke chat.completions until final text." },
    { "@type": "HowToStep", position: 4, name: "Update system prompt", text: "Instruct the model to retrieve candidate records and cite only evidence the application has compared with the intended assertion." },
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
    { "@type": "HowToStep", position: 2, name: "Define candidate lookup tool", text: "Use tool() with a Zod schema for claim and min_confidence; fetch /api/v1/verify in execute and label the result as a candidate." },
    { "@type": "HowToStep", position: 3, name: "Add to streamText", text: "Pass the candidate lookup tool to streamText in your /api/chat route." },
    { "@type": "HowToStep", position: 4, name: "Render in UI", text: "Use useChat; show candidate-record citations separately from assertions that passed your own evidence-review policy." },
  ],
};

export const dspyHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS into DSPy",
  description:
    "Wire VERITAS into a DSPy program as a custom Retrieve module plus a candidate-review post-processor.",
  totalTime: "PT25M",
  tool: [
    { "@type": "HowToTool", name: "DSPy" },
    { "@type": "HowToTool", name: "Python" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install dspy-ai httpx" },
    { "@type": "HowToStep", position: 2, name: "Define VeritasRetrieve", text: "Subclass dspy.Retrieve; in forward, POST query to /api/v1/search and return dspy.Examples with claim_id, confidence, canonical URL metadata." },
    { "@type": "HowToStep", position: 3, name: "Define a candidate-match post-processor", text: "After generation, extract assertions and retrieve candidates via /api/v1/verify. A bestMatch is similarity, not entailment." },
    { "@type": "HowToStep", position: 4, name: "Compose ProgramOfThought", text: "Chain retrieve → reason → evidence review in a multi-hop DSPy program. Optimize against a human-labeled support metric, not bestMatch rate." },
  ],
};

export const pydanticAiHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS as a Pydantic AI tool",
  description:
    "Type-safe find_claim_candidate tool with Pydantic request and response models. Schema validation catches shape errors; evidence support still needs a separate check.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "Pydantic AI" },
    { "@type": "HowToTool", name: "Python" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install pydantic-ai httpx" },
    { "@type": "HowToStep", position: 2, name: "Define Pydantic models", text: "Model the actual /verify shape: query, method, note, matches, optional bestMatch, and optional signature." },
    { "@type": "HowToStep", position: 3, name: "Register tool with agent", text: "Decorate find_claim_candidate with @agent.tool; runtime validates tool input and response shape before the application reviews evidence." },
    { "@type": "HowToStep", position: 4, name: "Use structured agent output", text: "Return candidate and reviewed-support fields separately so type safety is not mistaken for factual validation." },
  ],
};

export const anthropicSdkHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Expose SourceScore VERITAS as a Claude tool via Anthropic SDK",
  description:
    "Wire find_claim_candidate into Claude's tool-use protocol, then require statement and evidence comparison. Python + TypeScript examples.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "Anthropic SDK" },
    { "@type": "HowToTool", name: "Python or TypeScript" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install Anthropic SDK", text: "pip install anthropic httpx OR npm install @anthropic-ai/sdk" },
    { "@type": "HowToStep", position: 2, name: "Define tool with input_schema", text: "Declare find_claim_candidate with claim and min_confidence input; its description must say a result is not a truth verdict." },
    { "@type": "HowToStep", position: 3, name: "Implement agent loop", text: "On stop_reason='tool_use', execute tool function (POST /api/v1/verify), append tool_result message, continue loop until final text response." },
    { "@type": "HowToStep", position: 4, name: "Add a retrieval system prompt", text: "Instruct Claude to retrieve candidates and require downstream statement/evidence comparison before asserting support." },
  ],
};

export const instructorHowTo: HowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Integrate SourceScore VERITAS with Instructor",
  description:
    "Type-safe structured outputs with parse-time candidate retrieval. Schema failures can trigger Instructor retries; factual support still needs evidence review.",
  totalTime: "PT15M",
  tool: [
    { "@type": "HowToTool", name: "Instructor" },
    { "@type": "HowToTool", name: "Python + Pydantic" },
  ],
  supply: COMMON_SUPPLY,
  step: [
    { "@type": "HowToStep", position: 1, name: "Install dependencies", text: "pip install instructor httpx pydantic" },
    { "@type": "HowToStep", position: 2, name: "Define ClaimAnswer model", text: "Pydantic model with claim + answer + source_url + confidence fields; @model_validator hook calls /api/v1/verify at parse-time." },
    { "@type": "HowToStep", position: 3, name: "Set max_retries on completion", text: "Use Instructor retries for schema or missing-candidate failures, not as proof that a rephrased assertion became true." },
    { "@type": "HowToStep", position: 4, name: "Compose multi-claim research summary", text: "Keep candidate records separate from claims that passed a human or dedicated entailment review." },
  ],
};
