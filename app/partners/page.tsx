import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "Partner with SourceScore — Media Kit" },
  description:
    "Media kit for SourceScore: audience, editorial standards, publisher details, and how partnerships work. Published by Caslon Media.",
  alternates: { canonical: "https://sourcescore.org/partners/" },
};

export default function PartnersPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Partners", url: "https://sourcescore.org/partners/" },
            ]),
          ),
        }}
      />

      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Partner with SourceScore
      </h1>
      <p className="text-body-lg text-muted leading-relaxed mb-10">
        SourceScore is the AI-Citation Quality Index: a transparent reference
        site that scores 130+ sources on Citation Discipline, Modern Reference
        fitness, and Citation Velocity, plus VERITAS, a signed claim-verification
        API. Our readers are SEO/GEO professionals and content marketers
        checking whether a source — often their own site or a client&rsquo;s —
        holds up as an AI-citation-quality reference.
      </p>

      <div className="space-y-8">
        {/* Audience */}
        <section className="p-6 rounded-card-lg border border-border bg-panel">
          <div className="text-eyebrow text-dim mb-3">Audience</div>
          <ul className="space-y-3 text-body text-muted leading-relaxed">
            <li>
              <strong className="text-text">Monthly human visitors:</strong>{" "}
              6,182 in the last 30 days (GA4, human visitors, August 2026).
            </li>
            <li>
              <strong className="text-text">Geography:</strong> predominantly
              US audience.
            </li>
            <li>
              <strong className="text-text">Reader persona:</strong> SEO/GEO
              professionals, content marketers, and LLM developers evaluating
              source quality and AI-citation readiness — a professional,
              research-intent audience.
            </li>
          </ul>
        </section>

        {/* About the publisher */}
        <section className="p-6 rounded-card-lg border border-border bg-panel">
          <div className="text-eyebrow text-dim mb-3">About the publisher</div>
          <p className="text-body text-muted leading-relaxed">
            SourceScore is published by{" "}
            <strong className="text-text">Caslon Media</strong>, a registered
            Dutch company operating a network of independent data and reference
            sites. Sister properties include{" "}
            <a
              href="https://citationdesk.com/"
              className="text-brand hover:underline"
            >
              citationdesk.com
            </a>
            , our free AI-visibility checker for site owners. More about
            this site on the{" "}
            <a href="/about/" className="text-brand hover:underline">
              About page
            </a>
            .
          </p>
          <p className="text-body text-muted leading-relaxed mt-3">
            Contact:{" "}
            <a
              href="mailto:hello@caslonmedia.com"
              className="text-brand hover:underline font-mono"
            >
              hello@caslonmedia.com
            </a>
          </p>
        </section>

        {/* Editorial standards */}
        <section className="p-6 rounded-card-lg border border-border bg-panel">
          <div className="text-eyebrow text-dim mb-3">Editorial standards</div>
          <ul className="list-disc pl-5 space-y-2 text-body text-muted leading-relaxed">
            <li>
              Our editorial differentiator is a published, re-derivable{" "}
              <a href="/methodology/" className="text-brand hover:underline">
                citation-scoring methodology
              </a>
              : every score is built from explicit signals anyone can verify
              against primary sources.
            </li>
            <li>
              Source pages carry visible &ldquo;last verified&rdquo; dates, and
              VERITAS verified claims ship with their primary-source citations.
            </li>
            <li>Scores cannot be purchased. No paid placements in the index.</li>
            <li>
              Corrections are timestamped and public; methodology changes are
              versioned and announced.
            </li>
          </ul>
        </section>

        {/* How we partner */}
        <section className="p-6 rounded-card-lg border border-border bg-panel">
          <div className="text-eyebrow text-dim mb-3">How we partner</div>
          <ul className="list-disc pl-5 space-y-2 text-body text-muted leading-relaxed">
            <li>
              Contextual recommendations inside our data and reference pages —
              never interruptive placements.
            </li>
            <li>
              Every affiliate or sponsored link is FTC-disclosed on the page
              where it appears (see our{" "}
              <a href="/disclosure/" className="text-brand hover:underline">
                affiliate disclosure
              </a>
              ).
            </li>
            <li>
              All affiliate links carry{" "}
              <code className="font-mono text-text">
                rel=&quot;sponsored nofollow noopener&quot;
              </code>
              .
            </li>
            <li>No incentivized clicks, ever.</li>
            <li>We do not bid on partner brand terms in paid search.</li>
            <li>
              Partnerships never influence scores, rankings, or verified-claim
              data — the editorial index and any commercial relationship are
              fully separated.
            </li>
          </ul>
        </section>

        {/* Status */}
        <section className="p-6 rounded-card-lg border border-brand/30 bg-surface-brand">
          <div className="text-eyebrow text-dim mb-2">Partnership status</div>
          <p className="text-body text-text leading-relaxed">
            Partnerships are launching now.{" "}
            <a href="/contact/" className="text-brand hover:underline">
              Contact us
            </a>{" "}
            or email{" "}
            <a
              href="mailto:hello@caslonmedia.com"
              className="text-brand hover:underline font-mono"
            >
              hello@caslonmedia.com
            </a>{" "}
            to discuss.
          </p>
        </section>
      </div>
    </article>
  );
}
