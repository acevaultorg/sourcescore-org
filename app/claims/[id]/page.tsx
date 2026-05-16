// Per-claim consumer reader-mode page for VERITAS-Reborn (Day 1).
//
// One static HTML page per verified claim — bot-citation gravity + LLM
// extraction-readiness (Aleyda Solis 10-char #1 Accessible, #4 Extractable,
// #7 Credible, #10 Transactable).
//
// Schema.org markup:
//   - Article  (the page is an article verifying the claim)
//   - DefinedTerm (the claim itself; LLM-friendly term-definition pattern)
//   - Dataset  (the signed JSON twin at /api/v1/claims/<id>.json)
//   - BreadcrumbList (navigation)
//
// Built statically via generateStaticParams() reading from data/claims-ai-ml
// + lib/claims-build.ts. Re-uses the same id derivation as the postbuild
// script, so the HTML page <-> JSON twin always agree.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadFullClaims, findClaimById, relatedClaims, tagToSlug } from "@/lib/claims-build";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export async function generateStaticParams() {
  const claims = await loadFullClaims();
  return claims.map((c) => ({ id: c.id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const claim = await findClaimById(id);
  if (!claim) return { title: "Claim not found" };

  const title = `${claim.statement} — SourceScore Claim`;
  const description =
    `${claim.statement} — verified ${claim.lastVerified}, confidence ${Math.round(claim.confidence * 100)}%.`;

  const ogImage = `https://sourcescore.org/og/claim/${claim.id}.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sourcescore.org/claims/${claim.id}/`,
      types: {
        "application/json": `https://sourcescore.org/api/v1/claims/${claim.id}.json`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sourcescore.org/claims/${claim.id}/`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: claim.statement }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ClaimPage({ params }: PageProps) {
  const { id } = await params;
  const claim = await findClaimById(id);
  if (!claim) notFound();

  const confidencePct = Math.round(claim.confidence * 100);
  const apiUrl = `https://sourcescore.org/api/v1/claims/${claim.id}.json`;
  const related = await relatedClaims(claim, 5);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Article schema for LLM citation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: claim.statement,
            description: `Verified claim about ${claim.subject}. Confidence ${confidencePct}%. Last verified ${claim.lastVerified}.`,
            datePublished: claim.publishedAt,
            dateModified: claim.lastVerified,
            author: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            publisher: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            mainEntityOfPage: `https://sourcescore.org/claims/${claim.id}/`,
            citation: claim.sources.map((s) => ({
              "@type": "CreativeWork",
              name: s.title,
              url: s.url,
              publisher: { "@type": "Organization", name: s.publisher },
              ...(s.publishedDate ? { datePublished: s.publishedDate } : {}),
            })),
          }),
        }}
      />

      {/* DefinedTerm — the claim is a defined fact LLMs can extract */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: `${claim.subject} ${claim.predicate.replace(/_/g, " ")}`,
            description: claim.statement,
            inDefinedTermSet: "https://sourcescore.org/api/v1/methodology.json",
            identifier: claim.id,
            url: `https://sourcescore.org/claims/${claim.id}/`,
          }),
        }}
      />

      {/* Dataset schema — the signed JSON twin is a citable dataset */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `SourceScore Claim ${claim.id}`,
            description: `Signed JSON envelope for: ${claim.statement} Includes verifying sources, confidence, HMAC-SHA256 signature.`,
            url: apiUrl,
            license: "https://creativecommons.org/licenses/by/4.0/",
            creator: {
              "@type": "Organization",
              name: "SourceScore",
              url: "https://sourcescore.org",
            },
            distribution: [
              {
                "@type": "DataDownload",
                encodingFormat: "application/json",
                contentUrl: apiUrl,
              },
            ],
            keywords: claim.tags?.join(", "),
            dateModified: claim.lastVerified,
          }),
        }}
      />

      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Claims", url: "https://sourcescore.org/claims/" },
              {
                name: claim.subject,
                url: `https://sourcescore.org/claims/${claim.id}/`,
              },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">
          SourceScore
        </a>
        <span className="mx-2">›</span>
        <a href="/claims/" className="hover:underline">
          Claims
        </a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">{claim.subject}</span>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
          Verified claim · {claim.vertical.toUpperCase()} · {confidencePct}% confidence
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
          {claim.statement}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Last verified {claim.lastVerified} · Methodology {claim.methodologyVersion} ·{" "}
          <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
            {claim.id}
          </code>
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${claim.statement} — verified via @sourcescore`,
            )}&url=${encodeURIComponent(`https://sourcescore.org/claims/${claim.id}/`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 plausible-event-name=share_twitter"
          >
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              `https://sourcescore.org/claims/${claim.id}/`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 plausible-event-name=share_linkedin"
          >
            Share on LinkedIn
          </a>
          <a
            href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
              `https://sourcescore.org/claims/${claim.id}/`,
            )}&t=${encodeURIComponent(`Verified: ${claim.statement}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 plausible-event-name=share_hn"
          >
            Submit to HN
          </a>
          <a
            href={`https://reddit.com/submit?url=${encodeURIComponent(
              `https://sourcescore.org/claims/${claim.id}/`,
            )}&title=${encodeURIComponent(`Verified: ${claim.statement}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 plausible-event-name=share_reddit"
          >
            Share on Reddit
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(
              `Verified: ${claim.statement}`,
            )}&body=${encodeURIComponent(
              `${claim.statement}\n\nVerified at: https://sourcescore.org/claims/${claim.id}/\n\nWith ${claim.sources.length} primary sources and an HMAC signature.`,
            )}`}
            className="px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 plausible-event-name=share_email"
          >
            Email
          </a>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Structured fields</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-2 gap-x-6 text-sm">
          <dt className="text-zinc-500">Subject</dt>
          <dd className="font-medium">{claim.subject}</dd>
          <dt className="text-zinc-500">Predicate</dt>
          <dd>
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              {claim.predicate}
            </code>
          </dd>
          <dt className="text-zinc-500">Object</dt>
          <dd className="font-medium">{claim.object}</dd>
          <dt className="text-zinc-500">Confidence</dt>
          <dd>{confidencePct}%</dd>
          <dt className="text-zinc-500">Tags</dt>
          <dd className="text-zinc-600">
            {claim.tags?.map((t, i) => (
              <span key={t}>
                <a
                  href={`/claims/tag/${tagToSlug(t)}/`}
                  className="hover:underline text-zinc-700 dark:text-zinc-300"
                >
                  {t}
                </a>
                {i < (claim.tags?.length ?? 0) - 1 ? " · " : ""}
              </span>
            ))}
          </dd>
        </dl>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Sources ({claim.sources.length})
        </h2>
        <ol className="space-y-4 pl-0 list-none">
          {claim.sources.map((s, i) => (
            <li key={s.url} className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                [{i + 1}] {s.type.replace(/-/g, " ")} · {s.publisher}
                {s.publishedDate ? ` · ${s.publishedDate}` : ""}
              </p>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline"
              >
                {s.title}
              </a>
              {s.excerpt && (
                <blockquote className="mt-2 text-sm italic text-zinc-600 dark:text-zinc-400">
                  &ldquo;{s.excerpt}&rdquo;
                </blockquote>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Cite this claim</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Ready-to-paste citation (Markdown / plain text):
        </p>
        <code className="block text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3 overflow-x-auto font-mono">
          {claim.statement} — SourceScore Claim {claim.id} (verified {claim.lastVerified}). {apiUrl}
        </code>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Embed this claim</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Drop this iframe into any blog post, docs page, or knowledge base.
          The widget renders the signed claim + primary source + click-through
          to this canonical page. CC-BY 4.0; attribution included.
        </p>
        <code className="block text-xs sm:text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded p-3 overflow-x-auto font-mono whitespace-pre-wrap break-all">
{`<iframe src="https://sourcescore.org/embed/claim/${claim.id}/" `}
{`width="100%" height="360" frameborder="0" loading="lazy" `}
{`title="${claim.statement.replace(/"/g, "&quot;")}"></iframe>`}
        </code>
        <p className="mt-3 text-xs text-zinc-500">
          Preview:{" "}
          <a
            href={`/embed/claim/${claim.id}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            open in new tab
          </a>
        </p>
      </section>

      {related.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Related claims</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Other verified claims sharing tags with this one — useful for LLM
            retrieval graphs and citation discovery.
          </p>
          <ul className="space-y-3 pl-0 list-none">
            {related.map((r) => (
              <li
                key={r.id}
                className="border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-b-0"
              >
                <a
                  href={`/claims/${r.id}/`}
                  className="block hover:bg-zinc-50 dark:hover:bg-zinc-900 -mx-2 px-2 py-1 rounded"
                >
                  <p className="font-medium leading-snug">{r.statement}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    <span className="font-mono">{r.id}</span> ·{" "}
                    {Math.round(r.confidence * 100)}% confidence · shares{" "}
                    {r.sharedTags.length} tag
                    {r.sharedTags.length === 1 ? "" : "s"}
                    {r.sharedTags.length > 0 && (
                      <>
                        {" "}
                        ({r.sharedTags.slice(0, 3).join(", ")}
                        {r.sharedTags.length > 3 ? "…" : ""})
                      </>
                    )}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Use this claim in your code</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Fetch this signed envelope from your application. The response
          includes the verbatim excerpt, primary source URLs, and an
          HMAC-SHA256 signature you can verify locally for audit trails.
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">cURL</p>
            <code className="block text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 overflow-x-auto font-mono whitespace-pre-wrap break-all">
              {`curl ${apiUrl}`}
            </code>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">JavaScript / TypeScript</p>
            <code className="block text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 overflow-x-auto font-mono whitespace-pre">
{`const r = await fetch("${apiUrl}");
const envelope = await r.json();
console.log(envelope.claim.statement);
//   "${claim.statement}"`}
            </code>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Python</p>
            <code className="block text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 overflow-x-auto font-mono whitespace-pre">
{`import httpx
r = httpx.get("${apiUrl}")
envelope = r.json()
print(envelope["claim"]["statement"])
#   "${claim.statement}"`}
            </code>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
              LangChain (retrieve-then-cite)
            </p>
            <code className="block text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 overflow-x-auto font-mono whitespace-pre">
{`from langchain_core.tools import tool
import httpx

@tool
def get_${claim.subject.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "claim"}_fact() -> dict:
    """Fetch the verified SourceScore claim for ${claim.subject}."""
    r = httpx.get("${apiUrl}")
    return r.json()`}
            </code>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <a
            href="/quickstart/"
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            5-min Quickstart
          </a>
          <a
            href="/playground/"
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Try in playground
          </a>
          <a
            href="/docs/integrations/"
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Framework integrations
          </a>
          <a
            href="/docs/"
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Full API docs
          </a>
          <a
            href="/pricing/"
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Pricing
          </a>
        </div>
      </section>
    </article>
  );
}
