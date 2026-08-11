import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";
import { activePartners, hasActivePartners } from "@/lib/partners";

export const metadata: Metadata = {
  title: { absolute: "Affiliate Disclosure — SourceScore" },
  description:
    "FTC affiliate disclosure for sourcescore.org: how affiliate links may work here, and why they never change what we publish.",
  alternates: { canonical: "https://sourcescore.org/disclosure/" },
};

export default function DisclosurePage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Affiliate Disclosure", url: "https://sourcescore.org/disclosure/" },
            ]),
          ),
        }}
      />

      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Affiliate Disclosure
      </h1>
      <p className="text-body text-dim mb-8">Last updated: 2026-08-11</p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <p className="text-muted">
          In plain English: some links on sourcescore.org may become affiliate
          links. If you click one and then buy something or sign up, we may
          earn a commission. It costs you nothing extra.
        </p>

        <h2 className="text-heading-2 font-bold">What this means in practice</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">
              It never changes what we publish.
            </strong>{" "}
            Scores, rankings, and verified claims come from our published{" "}
            <a href="/methodology/" className="text-brand hover:underline">
              methodology
            </a>{" "}
            — not from commercial relationships.
          </li>
          <li>
            <strong className="text-text">
              We never accept payment to alter data or scores.
            </strong>{" "}
            A source cannot buy a better grade, and a partner cannot buy a
            worse one for a competitor.
          </li>
          <li>
            <strong className="text-text">Affiliate links are labeled.</strong>{" "}
            Any page carrying affiliate links discloses it on that page, and
            those links carry{" "}
            <code className="font-mono text-text">
              rel=&quot;sponsored nofollow noopener&quot;
            </code>
            .
          </li>
          <li>
            <strong className="text-text">No incentivized clicks.</strong> We
            will never ask you to click a link to &ldquo;support us&rdquo;.
          </li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">Current status</h2>
        {/* Derived from the live partner config (lib/partners.ts), not hand-written,
            so this statement cannot go stale the moment a partner is switched on. */}
        {hasActivePartners ? (
          <>
            <p className="text-muted">
              sourcescore.org currently carries affiliate links to the following{" "}
              {activePartners.length === 1 ? "partner" : "partners"}:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted">
              {activePartners.map((partner) => (
                <li key={partner.slug}>
                  <strong className="text-text">{partner.name}</strong>
                </li>
              ))}
            </ul>
            <p className="text-muted">
              Every one of those links is labeled on the page where it appears
              and carries{" "}
              <code className="font-mono text-text">
                rel=&quot;sponsored nofollow noopener&quot;
              </code>
              . None of them influenced a score.
            </p>
          </>
        ) : (
          <p className="text-muted">
            As of the date above, sourcescore.org carries no active affiliate
            links — partnerships are launching now (see{" "}
            <a href="/partners/" className="text-brand hover:underline">
              Partner with SourceScore
            </a>
            ). This page exists so the policy is public before the first
            affiliate link ever appears.
          </p>
        )}

        <h2 className="text-heading-2 font-bold pt-4">Questions</h2>
        <p className="text-muted">
          SourceScore is published by Caslon Media. Questions about this
          policy:{" "}
          <a
            href="mailto:hello@caslonmedia.com"
            className="text-brand hover:underline"
          >
            hello@caslonmedia.com
          </a>
          .
        </p>
      </section>
    </article>
  );
}
