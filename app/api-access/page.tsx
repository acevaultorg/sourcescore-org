// VERITAS API — demand-validation WAITLIST page.
//
// Per the 2026-06-19 strategic decision (TaskPrio mqkx5yh8q913j0): this is the
// ONE sanctioned direct-revenue experiment for SourceScore — a ZERO-COST,
// honest "request paid-API access / get notified on pricing" capture that
// validates real B2B demand BEFORE any Stripe / billing is built. NO Stripe,
// NO paid tier here; the no-Stripe directive stays until validated demand
// exists (then it's the operator's call to reverse it).
//
// Capture mechanism = mailto:contact@acevault.org — the EXISTING fleet
// pattern (functions/api/v1/auth/signup.js's "early-access invoice" path uses
// the same mailto; no DB/KV/email infra is wired, and the task explicitly
// sanctions the mailto fallback). Zero new infra. The signal = requests landing
// in the operator's inbox + a Clarity click event (data-clarity-upgrade).
// Honest framing, no dark patterns (SourceScore is a trust brand).

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Request VERITAS API access — paid-tier interest",
  description:
    "The VERITAS verified-claims API is free today (1,000 claims/mo, no auth). Request access to a higher-volume paid tier and we'll email you when pricing goes live — no card, no commitment.",
  alternates: { canonical: "https://sourcescore.org/api-access/" },
  openGraph: {
    title: "Request VERITAS API access",
    description:
      "Free today (1,000 claims/mo, no auth). Request a higher-volume paid tier — we'll notify you on pricing. No card, no commitment.",
    url: "https://sourcescore.org/api-access/",
    type: "website",
  },
};

// Pre-filled, honest request email — the established fleet capture pattern.
const REQUEST_SUBJECT = "VERITAS API — request access";
const REQUEST_BODY = `Hi SourceScore team,

I'd like access to a higher-volume tier of the VERITAS verified-claims API.

Use case:
Expected volume (claims / month):
What matters most (higher volume / uptime SLA / private or custom claim sets / other):
Stack (LangChain / LlamaIndex / direct REST / other):

Thanks!`;

const MAILTO = `mailto:contact@acevault.org?subject=${encodeURIComponent(
  REQUEST_SUBJECT,
)}&body=${encodeURIComponent(REQUEST_BODY)}`;

export default function ApiAccessPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Request API access", url: "https://sourcescore.org/api-access/" },
            ]),
          ),
        }}
      />

      <nav className="text-body-sm text-dim mb-6">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-muted">Request API access</span>
      </nav>

      <div className="text-eyebrow text-brand mb-3">VERITAS API · early access</div>
      <h1 className="text-display-2 font-bold tracking-tight mb-4">
        Request VERITAS API access
      </h1>
      <p className="text-body-lg text-muted leading-relaxed mb-8 max-w-2xl">
        The VERITAS verified-claims API is{" "}
        <strong className="text-text">free today</strong> &mdash; 1,000 claims/month,
        no auth, no signup. This page is for teams who need{" "}
        <strong className="text-text">more</strong>: higher volume, an uptime SLA,
        or private/custom claim sets. We&rsquo;re gauging real demand before
        building paid billing &mdash; request access and we&rsquo;ll email you the
        moment a paid tier goes live. No card, no commitment.
      </p>

      {/* Primary capture — mailto (the established fleet pattern; zero infra). */}
      <div className="rounded-card-lg border border-brand/30 bg-surface-brand p-6 sm:p-7 mb-12">
        <h2 className="text-heading-2 font-bold tracking-tight text-text mb-2">
          Tell us what you need
        </h2>
        <p className="text-body text-muted leading-relaxed mb-5 max-w-2xl">
          One email &mdash; your use case + expected volume. We read every one,
          and your answers directly shape whether (and how) we ship a paid tier.
          We&rsquo;ll only ever email you about VERITAS API access &mdash; no list,
          no spam.
        </p>
        <a
          href={MAILTO}
          data-clarity-upgrade="api-access-request"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn border border-brand/50 bg-brand/15 text-brand font-semibold hover:bg-brand/25 transition-colors" data-event="api_access_request"
        >
          Request access by email &rarr;
        </a>
        <p className="mt-3 text-caption text-dim">
          Opens your mail app, pre-addressed to{" "}
          <span className="font-mono text-muted">contact@acevault.org</span> with
          a short template. Prefer to write it yourself? Email us directly.
        </p>
      </div>

      {/* What you get — honest substance */}
      <section className="mb-10">
        <h2 className="text-heading-1 font-bold tracking-tight mb-4">
          What the VERITAS API gives you
        </h2>
        <ul className="space-y-3 text-body text-muted leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="text-brand mt-0.5" aria-hidden="true">▹</span>
            <span>
              <strong className="text-text">Signed, sourced claims.</strong>{" "}
              Hand-verified AI/ML facts with ≥2 primary sources and an
              HMAC-SHA256 signature on a stable JSON envelope &mdash; built to
              ground LLM responses and cut hallucinations in production RAG and
              agent pipelines.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand mt-0.5" aria-hidden="true">▹</span>
            <span>
              <strong className="text-text">Semantic /verify.</strong>{" "}
              POST a claim, get the nearest verified claim + similarity score for
              retrieval grounding &mdash; not a black-box truth oracle.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand mt-0.5" aria-hidden="true">▹</span>
            <span>
              <strong className="text-text">Honest by design.</strong>{" "}
              Every claim links to its primary sources and the methodology version
              it was verified under. No fabricated data, ever.
            </span>
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/docs/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-text transition-colors text-body-sm"
          >
            Start free in the docs &rarr;
          </a>
          <a
            href="/playground/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-text transition-colors text-body-sm"
          >
            Try /verify in the playground &rarr;
          </a>
        </div>
      </section>

      {/* Honest FAQ — why a waitlist, what's free, what we won't do */}
      <section className="border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold tracking-tight mb-5">
          Straight answers
        </h2>
        <div className="space-y-5 text-body text-muted leading-relaxed">
          <div>
            <p className="text-text font-semibold mb-1">
              Do I need this to use the API?
            </p>
            <p>
              No. The free tier (1,000 claims/month, no auth) needs no signup &mdash;
              just call the endpoints. This page is only for teams who&rsquo;ll
              outgrow the free tier and want a paid plan.
            </p>
          </div>
          <div>
            <p className="text-text font-semibold mb-1">
              Why a waitlist instead of a buy button?
            </p>
            <p>
              Honesty: we won&rsquo;t build paid billing until real demand exists.
              A genuine request from you is worth more than a half-built checkout.
              You&rsquo;re not charged anything by asking.
            </p>
          </div>
          <div>
            <p className="text-text font-semibold mb-1">
              What happens after I email?
            </p>
            <p>
              We reply, and you&rsquo;re first in line when a paid tier ships. If
              enough teams ask, that&rsquo;s the signal that builds it.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
