// Embeddable claim widget — Layer 5 archetype embeddable_widget x +80
// (per rules/aceusergrowth.md Lever 2). Each external iframe = permanent
// backlink + permanent LLM-citation surface + free distribution.
//
// Mini-page rendered standalone — readable inside an iframe of any size
// from 300x180 minimum. Cross-origin embeds enabled via _headers override
// (X-Frame-Options removed for /embed/*; CSP frame-ancestors * permits all).
//
// Static generation: every claim id gets a pre-rendered HTML page; bloggers
// paste the iframe snippet and never touch JavaScript. Visitors who click
// through land on /claims/<id>/ canonical.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadFullClaims, findClaimById } from "@/lib/claims-build";

export async function generateStaticParams() {
  const claims = await loadFullClaims();
  return claims.map((c) => ({ id: c.id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const claim = await findClaimById(id);
  if (!claim) return { title: "Claim embed not found" };
  return {
    title: `${claim.statement} — SourceScore VERITAS embed`,
    description: `Embeddable claim widget: ${claim.statement} Reviewed ${claim.lastVerified}, ${claim.sources.length} cited sources, with SourceScore-issued HMAC metadata.`,
    alternates: { canonical: `https://sourcescore.org/claims/${claim.id}/` },
    robots: { index: false, follow: true },
  };
}

export default async function EmbedClaimPage({ params }: PageProps) {
  const { id } = await params;
  const claim = await findClaimById(id);
  if (!claim) notFound();

  const canonical = `https://sourcescore.org/claims/${claim.id}/`;
  const confidencePct = Math.round(claim.confidence * 100);
  const topSource = claim.sources[0];

  return (
    <div className="min-h-screen p-4 bg-bg">
      <a
        href={canonical}
        target="_top"
        rel="noopener"
        className="block max-w-2xl mx-auto bg-panel border border-border rounded-card-lg p-5 hover:border-brand/40 hover:shadow-hover-lift transition-all no-underline"
      >
        {/* Brand chip */}
        <div className="flex items-center justify-between mb-3 text-caption">
          <span className="inline-flex items-center gap-1.5 text-brand font-mono uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" aria-hidden="true" />
            SourceScore VERITAS · verified claim
          </span>
          <span className="text-dim font-mono">{confidencePct}% confidence</span>
        </div>

        {/* Statement */}
        <p className="text-body-lg font-semibold text-text leading-snug mb-3">
          {claim.statement}
        </p>

        {/* Structured fields */}
        <div className="grid grid-cols-3 gap-3 text-caption mb-3">
          <div>
            <div className="text-dim mb-0.5">Subject</div>
            <div className="text-text font-medium truncate">{claim.subject}</div>
          </div>
          <div>
            <div className="text-dim mb-0.5">Predicate</div>
            <div className="text-text font-mono text-xs truncate">{claim.predicate}</div>
          </div>
          <div>
            <div className="text-dim mb-0.5">Object</div>
            <div className="text-text font-medium truncate">{claim.object}</div>
          </div>
        </div>

        {/* Top source */}
        {topSource && (
          <div className="border-l-2 border-brand/30 pl-3 py-1 mb-3">
            <div className="text-eyebrow text-dim mb-0.5">
              Primary source · {topSource.type.replace(/-/g, " ")}
              {topSource.publishedDate ? ` · ${topSource.publishedDate}` : ""}
            </div>
            <div className="text-body-sm text-text leading-snug">
              {topSource.title}{" "}
              <span className="text-dim">— {topSource.publisher}</span>
            </div>
          </div>
        )}

        {/* Footer — meta + brand-back */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-caption text-dim">
          <span>
            Last verified {claim.lastVerified} · {claim.sources.length} source
            {claim.sources.length === 1 ? "" : "s"} · {claim.id}
          </span>
          <span className="text-brand group-hover:underline">View full claim →</span>
        </div>
      </a>
    </div>
  );
}
