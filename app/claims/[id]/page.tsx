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
import { loadFullClaims, findClaimById } from "@/lib/claims-build";
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
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ClaimPage({ params }: PageProps) {
  const { id } = await params;
  const claim = await findClaimById(id);
  if (!claim) notFound();

  const confidencePct = Math.round(claim.confidence * 100);
  const apiUrl = `https://sourcescore.org/api/v1/claims/${claim.id}.json`;

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
        <p className="text-zinc-600 dark:text-zinc-400">
          Last verified {claim.lastVerified} · Methodology {claim.methodologyVersion} ·{" "}
          <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
            {claim.id}
          </code>
        </p>
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
          <dd className="text-zinc-600">{claim.tags?.join(" · ")}</dd>
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

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Programmatic access</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Fetch this claim with a signed envelope for verification:
        </p>
        <code className="block text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-3 overflow-x-auto font-mono">
          curl {apiUrl}
        </code>
        <p className="mt-4 text-sm">
          <a href="/docs/" className="text-zinc-900 dark:text-zinc-100 underline">
            API docs
          </a>{" "}
          ·{" "}
          <a href="/pricing/" className="text-zinc-900 dark:text-zinc-100 underline">
            Pricing
          </a>{" "}
          ·{" "}
          <a href="/api/v1/methodology.json" className="text-zinc-900 dark:text-zinc-100 underline">
            Methodology JSON
          </a>
        </p>
      </section>
    </article>
  );
}
