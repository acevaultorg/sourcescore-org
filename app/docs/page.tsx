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
//   - Authentication (none at v0; reserved for Day 8+)
//   - Rate limits (CF DDoS at v0; per-tier limits Day 8+)
//   - Signature verification (HMAC-SHA256 walk-through)
//   - Error format
//   - Migration to v1 (W3C VC, Y2)

import type { Metadata } from "next";
import { TIERS } from "@/lib/claims-types";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "API docs — SourceScore VERITAS",
  description:
    "Quick start, endpoint reference, signature verification, and migration notes for the SourceScore VERITAS claim verification API. curl + JavaScript + Python examples.",
  alternates: {
    canonical: "https://sourcescore.org/docs/",
    types: {
      "application/json": "https://sourcescore.org/api/v1/openapi.json",
    },
  },
  openGraph: {
    title: "API docs — SourceScore VERITAS",
    description: "Signed, sourced claim verification API for LLM developers. Free tier 1,000 claims/mo, no auth.",
    url: "https://sourcescore.org/docs/",
    type: "website",
  },
};

const freeTier = TIERS.find((t) => t.name === "free")!;

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
          Signed, sourced claim verification for LLM developers building
          grounded retrieval. Free tier: {freeTier.includedClaims.toLocaleString()} claims/mo, no auth required.
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
          Every claim has a stable 16-hex-char id, 2+ primary sources, an
          HMAC-SHA256 signature, and a JSON envelope at{" "}
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

# Verify a natural-language claim
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
  console.log('Verified:', verification.bestMatch.statement);
} else {
  console.log('Not verified by SourceScore.');
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

# Verify a natural-language claim
verification = requests.post(
    'https://sourcescore.org/api/v1/verify',
    json={'claim': 'Llama 3.1 was released in July 2024'},
).json()

if verification.get('bestMatch'):
    print('Verified:', verification['bestMatch']['statement'])
else:
    print('Not verified by SourceScore.')`,
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
  "count": 26,
  "claims": [
    {
      "id": "ad17e76a8baad7a1",
      "vertical": "ai-ml",
      "subject": "Transformer architecture",
      "predicate": "introduced_in_paper",
      "object": "Attention Is All You Need (Vaswani et al., 2017)",
      "statement": "Transformer architecture introduced in paper: Attention Is All You Need (Vaswani et al., 2017).",
      "confidence": 1,
      "signatureShort": "3e28e071",
      "detailUrl": "https://sourcescore.org/api/v1/claims/ad17e76a8baad7a1.json"
    }
  ]
}`}
        />
      </Section>

      <Section id="claim" title="GET /api/v1/claims/{id}.json — per-claim envelope">
        <p>
          Full claim record with sources, excerpts, HMAC signature, and
          ready-to-paste citation. The signature attests the envelope
          came from SourceScore and wasn&rsquo;t tampered in transit.
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
          Semantic similarity via embeddings ships Day 30+.
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

      <Section id="verify" title="POST /api/v1/verify — verify a natural-language claim">
        <p>
          Submit a claim in plain English; receive the best matching catalog
          record or <code>notVerified: true</code>. Threshold is configurable
          via <code>minConfidence</code> (default 0.85). Response is
          HMAC-signed when the edge has access to the signing secret — your
          client can prove you got the same answer SourceScore signed.
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
              label: "Response (verified)",
              language: "json",
              code: `{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "query": "Llama 3.1 was released in July 2024",
  "matches": [
    {
      "claim": {
        "id": "c1a2b3d4e5f6a7b8",
        "subject": "Llama 3.1",
        "predicate": "released_on",
        "object": "2024-07-23",
        "statement": "Llama 3.1 released on: 2024-07-23.",
        "confidence": 1,
        "signatureShort": "5b27aa11",
        "detailUrl": "https://sourcescore.org/api/v1/claims/c1a2b3d4e5f6a7b8.json"
      },
      "matchScore": 0.42,
      "rationale": "Keyword overlap on: llama, released, 2024."
    }
  ],
  "bestMatch": { "id": "c1a2b3d4e5f6a7b8", ... },
  "signature": {
    "algorithm": "HMAC-SHA256",
    "signedBy": "did:web:sourcescore.org",
    "signedAt": "2026-05-16T13:42:11.000Z",
    "signature": "..."
  }
}`,
            },
            {
              label: "Response (not verified)",
              language: "json",
              code: `{
  "apiVersion": "v1",
  "methodology": "https://sourcescore.org/methodology/",
  "query": "GPT-5 reaches AGI in 2025",
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
          Returns the verification methodology (signing model, source-type
          rules, confidence calibration), pricing tier table, and endpoint
          index. Single canonical source of truth — referenced by{" "}
          <a href="/pricing/" className="underline">
            /pricing/
          </a>{" "}
          + Stripe Products metadata + this docs page.
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
          <strong>Day 8+ — API keys + per-tier rate limits.</strong> When
          authentication is required, send your key as a Bearer token:
        </p>
        <CodeBlock
          language="bash"
          code={`curl https://sourcescore.org/api/v1/claims/ad17e76a8baad7a1.json \\
  -H 'Authorization: Bearer sk_live_...'`}
        />
        <p className="mt-3">
          API keys are issued at signup, scoped to a single Stripe Customer.
          Free-tier users can rotate keys via the dashboard; paid tiers can
          issue multiple keys per tier (see{" "}
          <a href="/pricing/" className="underline">
            pricing
          </a>
          ).
        </p>
      </Section>

      <Section id="rate-limits" title="Rate limits">
        <p>
          <strong>v0:</strong> Cloudflare DDoS protection caps ~1,000 req/min
          per IP. No explicit per-key limits yet.
        </p>
        <p className="mt-3">
          <strong>Day 8+ (per-tier, per-key):</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {TIERS.map((t) => (
            <li key={t.name}>
              <strong className="capitalize">{t.name}:</strong>{" "}
              {t.includedClaims.toLocaleString()} claims/mo included,
              overage €{t.overageEurPerClaim.toFixed(4)}/claim,{" "}
              {t.uptimeSla}% uptime SLA.
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Excess requests respond with HTTP 429. The{" "}
          <code>X-RateLimit-Remaining</code> and{" "}
          <code>X-RateLimit-Reset</code> response headers expose your
          per-key quota state.
        </p>
      </Section>

      <Section id="signing" title="Verifying signatures (HMAC-SHA256)">
        <p>
          Every per-claim envelope contains a <code>signature</code> over a
          canonical projection of the claim. To verify locally, recompute the
          same canonical form, HMAC it with the shared secret, and compare.
        </p>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          <strong>v0 signing model:</strong> HMAC-SHA256 with a shared secret
          held only by SourceScore. Consumers verify by fetching the same
          claim from <code>/api/v1/claims/&lt;id&gt;.json</code> — the
          server signs at request-time, so signatures match for unmodified
          claims. The signature&rsquo;s value is detecting in-transit tampering.
        </p>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          <strong>v1 (Y2):</strong> migrates to W3C Verifiable Credentials
          with Ed25519 keys for offline verification. Consumers verify
          against{" "}
          <code>did:web:sourcescore.org</code> without contacting the API.
          The <code>signedBy</code> field stays{" "}
          <code>did:web:sourcescore.org</code> across the migration.
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
          Drop-in guides for grounding LLM responses in signed VERITAS
          claims, with copy-paste runnable examples:
        </p>
        <ul className="mt-3 space-y-1 list-disc pl-6">
          <li>
            <a href="/docs/integrations/langchain/" className="underline">
              LangChain
            </a>{" "}
            — retrieve-then-cite + generate-then-verify patterns
          </li>
          <li>
            <a href="/docs/integrations/llamaindex/" className="underline">
              LlamaIndex
            </a>{" "}
            — custom Retriever + NodePostprocessor for verification
          </li>
          <li>
            <a href="/docs/integrations/openai-tools/" className="underline">
              OpenAI tool-calls
            </a>{" "}
            — native function-calling that auto-grounds when uncertain
          </li>
          <li>
            <a href="/docs/integrations/vercel-ai-sdk/" className="underline">
              Vercel AI SDK
            </a>{" "}
            — Next.js streamText + tool() patterns for TypeScript apps
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
          Community support: open an issue on{" "}
          <a
            href="https://gitlab.com/acevault-lab/sourcescore-api/-/issues"
            className="underline"
          >
            gitlab.com/acevault-lab/sourcescore-api
          </a>{" "}
          (SDK + docs repo, public).
        </p>
        <p className="mt-2">
          Paid tier email support:{" "}
          <a href="mailto:contact@sourcescore.org" className="underline">
            contact@sourcescore.org
          </a>{" "}
          (SLA per <a href="/pricing/" className="underline">tier</a>).
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
  // Static no-JS implementation: render each tab as a labelled <pre>. Day 8+
  // can hydrate this into a clickable tab interface; for v0 stacked labelled
  // blocks survive LLM crawlers and JS-off readers identically.
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
