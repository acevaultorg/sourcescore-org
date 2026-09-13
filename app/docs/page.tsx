// VERITAS-Reborn API docs (Day 1).
//
// Single-page hand-built docs — covers every v0 endpoint with curl + JS +
// Python examples. Stoplight Elements / Redoc / Swagger UI deferred to
// later iteration; for v0 a hand-built page is more credible (Aleyda Solis
// 10-char #7 Credible) and renders without JS-hydration (10-char #1
// Accessible — LLM crawlers + slow connections both win).
//
// Structure:
//   - Quick start (5-min curl → JS → Python paths)
//   - Endpoint reference (every endpoint with example request + response)
//   - Authentication (none at v0)
//   - Current usage controls
//   - Integrity-metadata limits
//   - Error format
//   - Current integrity-metadata limitations

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "API docs — SourceScore VERITAS",
  description:
    "Quick start and endpoint reference for the SourceScore VERITAS claim catalog and candidate-retrieval API. curl + JavaScript + Python examples.",
  alternates: {
    canonical: "https://sourcescore.org/docs/",
    types: {
      "application/json": "https://sourcescore.org/api/v1/openapi.json",
    },
  },
  openGraph: {
    title: "API docs — SourceScore VERITAS",
    description: "Curated AI/ML claim records and candidate evidence retrieval. Free public access with no auth or signup.",
    url: "https://sourcescore.org/docs/",
    type: "website",
  },
};

export default function DocsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Docs", url: "https://sourcescore.org/docs/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Docs</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          VERITAS API docs
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          Curated AI/ML claim records and candidate evidence retrieval for LLM
          developers. A match is not a truth verdict. The public API is free and
          requires no auth or signup.
          OpenAPI 3.1 spec at{" "}
          <a href="/api/v1/openapi.json" className="underline">
            /api/v1/openapi.json
          </a>
          .
        </p>
      </header>

      <Toc />

      <Section id="quick-start" title="Quick start (5 min)">
        <p>
          Every claim has a stable 16-hex-char id and cited primary evidence.
          Of the current 384 claims, 368 have two or more sources and 16 have
          one primary source. Records include SourceScore-issued HMAC integrity
          metadata and a JSON envelope at{" "}
          <code>/api/v1/claims/&lt;id&gt;.json</code>. No auth needed for v0
          read endpoints.
        </p>

        <CodeTabs
          tabs={[
            {
              label: "curl",
              language: "bash",
              code: `# Browse the full catalog
curl https://sourcescore.org/api/v1/claims.json | jq '.count, .claims[0]'

# Fetch a specific claim (e.g. GPT-4 release date)
curl https://sourcescore.org/api/v1/claims/09eea8fb1a8ccebf.json

# Search for claims about a topic
curl "https://sourcescore.org/api/v1/search?q=llama&limit=5"

# Match a natural-language claim against the catalog
curl -X POST https://sourcescore.org/api/v1/verify \\
  -H 'Content-Type: application/json' \\
  -d '{"claim": "Llama 3.1 was released in July 2024"}'`,
            },
            {
              label: "JavaScript (fetch)",
              language: "javascript",
              code: `// Browse catalog
const catalog = await fetch('https://sourcescore.org/api/v1/claims.json')
  .then(r => r.json());
console.log(\`\${catalog.count} verified claims\`);

// Fetch by id
const claim = await fetch(
  'https://sourcescore.org/api/v1/claims/09eea8fb1a8ccebf.json'
).then(r => r.json());
console.log(claim.citedAs);

// Verify a natural-language claim
const verification = await fetch(
  'https://sourcescore.org/api/v1/verify',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      claim: 'Llama 3.1 was released in July 2024',
    }),
  },
).then(r => r.json());

if (verification.bestMatch) {
  console.log('Candidate record:', verification.bestMatch.statement);
} else {
  console.log('No candidate record cleared the retrieval gates.');
}`,
            },
            {
              label: "Python (requests)",
              language: "python",
              code: `import requests

# Browse catalog
catalog = requests.get(
    'https://sourcescore.org/api/v1/claims.json'
).json()
print(f'{catalog["count"]} verified claims')

# Fetch by id
claim = requests.get(
    'https://sourcescore.org/api/v1/claims/09eea8fb1a8ccebf.json'
).json()
print(claim['citedAs'])

# Match a natural-language claim against the catalog
verification = requests.post(
    'https://sourcescore.org/api/v1/verify',
    json={'claim': 'Llama 3.1 was released in July 2024'},
).json()

if verification.get('bestMatch'):
    print('Candidate record:', verification['bestMatch']['statement'])
else:
    print('No candidate record cleared the retrieval gates.')`,
            },
          ]}
        />
      </Section>

      <Section id="catalog" title="GET /api/v1/claims.json — catalog">
        <p>Full list of every verified claim (light per-claim summary).</p>
        <ResponseBlock
          example={`{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "generated": "2026-05-16T11:07:02.574Z",
  "count": 384,
  "claims": [
    {
      "id": "ad17e76a8baad7a1",
      "vertical": "ai-ml",
      "subject": "Transformer architecture",
      "predicate": "introduced_in_paper",
      "object": "Attention Is All You Need (Vaswani et al., 2017)",
      "statement": "Transformer architecture introduced in paper: Attention Is All You Need (Vaswani et al., 2017).",
      "confidence": 1,
      "signatureShort": "a1b2c3d4",
      "detailUrl": "https://sourcescore.org/api/v1/claims/ad17e76a8baad7a1.json"
    }
  ]
}`}
        />
        <p className="text-xs text-zinc-500 mt-2">
          Signature prefixes in documentation examples are illustrative; refetch
          the canonical record for the current value.
        </p>
      </Section>

      <Section id="claim" title="GET /api/v1/claims/{id}.json — per-claim envelope">
        <p>
          Full claim record with sources, excerpts, integrity metadata, and a
          ready-to-paste citation. The HMAC tag is not publicly independently
          verifiable; refetch the canonical HTTPS record and inspect its cited
          evidence.
        </p>
        <ResponseBlock
          example={`{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "canonical": "https://sourcescore.org/claims/09eea8fb1a8ccebf/",
  "claim": {
    "vertical": "ai-ml",
    "subject": "GPT-4",
    "predicate": "released_on",
    "object": "2023-03-14",
    "statement": "GPT-4 released on: 2023-03-14.",
    "confidence": 1,
    "sources": [
      {
        "url": "https://openai.com/index/gpt-4-research/",
        "title": "GPT-4",
        "publisher": "OpenAI",
        "publishedDate": "2023-03-14",
        "accessedDate": "2026-05-16",
        "type": "official-blog",
        "excerpt": "We've created GPT-4, the latest milestone..."
      }
    ],
    "publishedAt": "2026-05-16T00:00:00Z",
    "lastVerified": "2026-05-16",
    "methodologyVersion": "veritas-v0.1",
    "tags": ["gpt-4", "openai", "release", "2023"],
    "id": "09eea8fb1a8ccebf"
  },
  "signature": {
    "algorithm": "HMAC-SHA256",
    "signedBy": "did:web:sourcescore.org",
    "signedAt": "2026-05-16T00:00:00.000Z",
    "signature": "fa4e121cda0e5dfd24b70fbf3ebaab85f65b116141c2a15335a9297f2328b729"
  },
  "citedAs": "GPT-4 released on: 2023-03-14. — SourceScore Claim 09eea8fb1a8ccebf (verified 2026-05-16, signed fa4e121c…). https://sourcescore.org/claims/09eea8fb1a8ccebf/"
}`}
        />
      </Section>

      <Section id="search" title="GET /api/v1/search — keyword search">
        <p>
          Query parameter <code>q</code> (2-500 chars), optional{" "}
          <code>limit</code> (default 20, max 50). v0 uses keyword-overlap
          scoring across subject / object / statement / predicate / tags.
          Semantic similarity via embeddings is planned for a later version of
          this endpoint (semantic matching is already available on{" "}
          <code>POST /api/v1/verify</code>).
        </p>
        <CodeTabs
          tabs={[
            {
              label: "Request",
              language: "bash",
              code: `curl "https://sourcescore.org/api/v1/search?q=llama&limit=3"`,
            },
            {
              label: "Response",
              language: "json",
              code: `{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "query": "llama",
  "count": 3,
  "results": [
    {
      "id": "c1a2b3d4e5f6a7b8",
      "subject": "Llama 3.1",
      "predicate": "released_on",
      "object": "2024-07-23",
      "statement": "Llama 3.1 released on: 2024-07-23.",
      "confidence": 1,
      "signatureShort": "5b27aa11",
      "detailUrl": "https://sourcescore.org/api/v1/claims/c1a2b3d4e5f6a7b8.json"
    }
  ]
}`,
            },
          ]}
        />
      </Section>

      <Section id="verify" title="POST /api/v1/verify — match a natural-language claim">
        <p>
          Submit a claim in plain English; receive the best matching catalog
          record or <code>notVerified: true</code>. The legacy record-confidence
          gate is configurable via <code>minConfidence</code> (default 0.85).
          The response includes candidate records and canonical URLs. Treat it
          as retrieval, not entailment or a truth verdict.
        </p>
        <CodeTabs
          tabs={[
            {
              label: "Request",
              language: "json",
              code: `POST /api/v1/verify
Content-Type: application/json

{
  "claim": "Llama 3.1 was released in July 2024",
  "vertical": "ai-ml",
  "minConfidence": 0.85
}`,
            },
            {
              label: "Illustrative response shape (candidate found)",
              language: "json",
              code: `{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "query": "Llama 3.1 was released in July 2024",
  "minConfidence": 0.85,
  "method": "keyword",
  "note": "matchScore is similarity, not a truth verdict.",
  "matches": [
    {
      "claim": {
        "id": "a55484ab8b4bdf4e",
        "subject": "Llama 3.1",
        "predicate": "released_on",
        "object": "2024-07-23",
        "statement": "Llama 3.1 released on: 2024-07-23.",
        "confidence": 1,
        "signatureShort": "<current prefix>",
        "detailUrl": "https://sourcescore.org/api/v1/claims/a55484ab8b4bdf4e.json"
      },
      "matchScore": 0.42,
      "rationale": "Keyword overlap on: llama, released, 2024."
    }
  ],
  "bestMatch": { "id": "a55484ab8b4bdf4e", ... },
  "signature": {
    "algorithm": "HMAC-SHA256",
    "signedBy": "did:web:sourcescore.org",
    "signedAt": "<response time>",
    "signature": "..."
  }
}`,
            },
            {
              label: "Illustrative response shape (no candidate cleared the gates)",
              language: "json",
              code: `{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "query": "GPT-5 reaches AGI in 2025",
  "minConfidence": 0.85,
  "method": "keyword",
  "note": "matchScore is similarity, not a truth verdict.",
  "matches": [],
  "notVerified": true,
  "signature": { "algorithm": "HMAC-SHA256", ... }
}`,
            },
          ]}
        />
      </Section>

      <Section id="methodology" title="GET /api/v1/methodology.json — methodology metadata">
        <p>
          Returns the published methodology metadata, source-type rules, and
          endpoint index. It documents the current public API; proposed
          higher-volume pricing is separately explained on{" "}
          <a href="/pricing/" className="underline">
            /pricing/
          </a>{" "}
          .
        </p>
      </Section>

      <Section id="auth" title="Authentication">
        <p>
          <strong>v0 — no authentication.</strong> All read endpoints
          (catalog, per-claim, search, verify) are public and rate-limited
          only by Cloudflare network-level DDoS protection. CORS is
          permissive (<code>Access-Control-Allow-Origin: *</code>);
          browser, server, and LLM-agent callers all work.
        </p>
        <p className="mt-3">
          Higher-volume access is only being evaluated. There are no public API
          keys, accounts, dashboard, checkout, billing, or SLA today.
        </p>
      </Section>

      <Section id="rate-limits" title="Rate limits">
        <p>
          <strong>v0:</strong> there is no account-level meter or public API-key
          quota. Standard Cloudflare network abuse protection may throttle
          abusive traffic; no fixed requests-per-minute threshold is promised.
        </p>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Clients should use timeouts, cache stable claim records, and handle
          HTTP 429 or transient 5xx responses with bounded backoff. The API does
          not currently promise per-client rate-limit headers or an SLA.
        </p>
      </Section>

      <Section id="signing" title="Record integrity metadata (HMAC-SHA256)">
        <p>
          Every per-claim envelope contains a SourceScore-issued HMAC tag over a
          canonical projection of the claim. The shared secret is not public, so
          public users cannot recompute or independently verify the tag.
        </p>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Check a record by refetching its canonical HTTPS URL and comparing the
          claim content and cited evidence your application uses. The tag is not
          a public-key signature or a third-party identity proof.
        </p>
      </Section>

      <Section id="errors" title="Error format">
        <p>All errors return a JSON envelope:</p>
        <CodeBlock
          language="json"
          code={`{
  "error": "Body must be JSON.",
  "detail": "Unexpected token } at position 17."  // optional
}`}
        />
        <p className="mt-3 text-sm">
          Common status codes:
          <strong className="ml-2">400</strong> bad input;{" "}
          <strong>404</strong> claim id not found;{" "}
          <strong>405</strong> wrong method;{" "}
          <strong>429</strong> rate-limited;{" "}
          <strong>503</strong> catalog index temporarily unavailable.
        </p>
      </Section>

      <Section id="integrations" title="Framework integrations">
        <p>
          Integration guides for retrieving candidate records and carrying
          their evidence into an explicit review step:
        </p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>
            <a href="/docs/integrations/langchain/" className="underline">
              LangChain
            </a>{" "}
            — retrieve-then-review + generate-then-find-candidates
          </li>
          <li>
            <a href="/docs/integrations/llamaindex/" className="underline">
              LlamaIndex
            </a>{" "}
            — custom Retriever + candidate-annotation post-processor
          </li>
          <li>
            <a href="/docs/integrations/openai-tools/" className="underline">
              OpenAI tool-calls
            </a>{" "}
            — native function-calling for candidate evidence lookup
          </li>
          <li>
            <a href="/docs/integrations/vercel-ai-sdk/" className="underline">
              Vercel AI SDK
            </a>{" "}
            — Next.js streamText + tool() patterns for TypeScript apps
          </li>
          <li>
            <a href="/docs/integrations/dspy/" className="underline">
              DSPy
            </a>{" "}
            — custom retrieval + candidate-review modules
          </li>
          <li>
            <a href="/docs/integrations/" className="underline">
              All integrations →
            </a>
          </li>
        </ul>
      </Section>

      <Section id="support" title="Support">
        <p>
          Questions, bug reports, and SDK feedback:{" "}
          <a href="mailto:hello@caslonmedia.com" className="underline">
            hello@caslonmedia.com
          </a>
          . The source repository is private, so there is no public issue
          tracker — email is the single support channel.
        </p>
        <p className="mt-2">
          Proposed higher-volume access can be requested via the{" "}
          <a href="/api-access/" className="underline">API access page</a>.
        </p>
      </Section>
    </main>
  );
}

function Toc() {
  const items = [
    { id: "quick-start", label: "Quick start" },
    { id: "catalog", label: "Catalog" },
    { id: "claim", label: "Per-claim envelope" },
    { id: "search", label: "Search" },
    { id: "verify", label: "Verify" },
    { id: "methodology", label: "Methodology" },
    { id: "auth", label: "Authentication" },
    { id: "rate-limits", label: "Rate limits" },
    { id: "signing", label: "Signature verification" },
    { id: "errors", label: "Errors" },
    { id: "integrations", label: "Framework integrations" },
    { id: "support", label: "Support" },
  ];
  return (
    <nav className="mb-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">
        On this page
      </p>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm pl-0 list-none">
        {items.map((i, idx) => (
          <li key={i.id} className="flex gap-2">
            <span className="text-zinc-400 font-mono w-5 text-right">
              {idx + 1}.
            </span>
            <a href={`#${i.id}`} className="underline hover:no-underline">
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        <a
          href={`#${id}`}
          className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400"
        >
          {title}
        </a>
      </h2>
      <div className="text-zinc-700 dark:text-zinc-300 space-y-3 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <pre className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded p-4 overflow-x-auto text-xs sm:text-sm">
      <code data-language={language}>{code}</code>
    </pre>
  );
}

function ResponseBlock({ example }: { example: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
        Example response
      </p>
      <CodeBlock language="json" code={example} />
    </div>
  );
}

function CodeTabs({
  tabs,
}: {
  tabs: Array<{ label: string; language: string; code: string }>;
}) {
  // Static no-JS implementation: render each tab as a labelled <pre>. The
  // stacked blocks survive LLM crawlers and JS-off readers identically.
  return (
    <div className="space-y-4">
      {tabs.map((t) => (
        <div key={t.label}>
          <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
            {t.label}
          </p>
          <CodeBlock language={t.language} code={t.code} />
        </div>
      ))}
    </div>
  );
}
