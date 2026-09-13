// VERITAS-Reborn — security policy + responsible disclosure.
//
// Required for any service that signs data + handles paid keys. Operates
// as a credibility signal (Aleyda Solis 10-char #7 Credible) and a
// concrete contact path for security researchers.

import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: "Security — SourceScore VERITAS",
  description:
    "Security policy and responsible-disclosure process for SourceScore VERITAS, including the limits of its current integrity metadata.",
  alternates: { canonical: "https://sourcescore.org/security/" },
  openGraph: {
    title: "Security — SourceScore VERITAS",
    description: "Responsible disclosure and current integrity-metadata limits.",
    url: "https://sourcescore.org/security/",
    type: "website",
  },
};

export default function SecurityPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "Security", url: "https://sourcescore.org/security/" },
            ]),
          ),
        }}
      />

      <nav className="text-sm text-zinc-500 mb-6">
        <a href="/" className="hover:underline">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-zinc-700 dark:text-zinc-300">Security</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
          Security
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
          How we publish claim-integrity metadata, handle disclosed vulnerabilities,
          and describe the limits of the current service. Read the limits
          section so you know exactly what we do and don't guarantee at this
          stage.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Responsible disclosure</h2>
        <p className="text-sm leading-relaxed mb-3">
          If you find a security issue — credential leak, API auth bypass,
          signature-forgery vector, injection vulnerability, denial-of-
          service path, or anything else that could compromise the integrity
          of claim envelopes or user accounts — please report it privately:
        </p>
        <ul className="text-sm space-y-2 list-disc pl-6 mb-3">
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:hello@caslonmedia.com" className="underline">
              hello@caslonmedia.com
            </a>
            {" "}— preferred for first contact.
          </li>
          <li>
            <strong>PGP:</strong> on request via the email above. A published
            key fingerprint is not available yet; we will add one here once the
            rotation cadence is stable.
          </li>
          <li>
            <strong>Low-severity reports</strong> without an exploit primitive
            (e.g. dependency-CVE notices) can go to the same address — put
            &ldquo;low severity&rdquo; in the subject. Our source repository is
            private, so there is no public issue tracker to file against.
          </li>
        </ul>
        <p className="text-sm leading-relaxed">
          We aim to acknowledge within 24 hours and patch high-severity
          issues within 7 days. Coordinated disclosure preferred; we will
          credit reporters publicly on this page (opt-in).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Signing &amp; verification</h2>
        <p className="text-sm leading-relaxed mb-3">
          Claim records include an HMAC-SHA256 tag over a canonical JSON
          serialization. This is SourceScore-issued integrity metadata, not a
          public cryptographic proof: the shared secret is not published, so a
          visitor cannot independently recompute the tag.
        </p>
        <p className="text-sm leading-relaxed mb-3">
          To check a public record, use HTTPS and refetch it from its canonical
          SourceScore URL, then inspect its cited evidence. Do not treat the
          HMAC tag as independently verifiable authentication or as proof of a
          third party&rsquo;s endorsement.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Scope of guarantees</h2>
        <ul className="text-sm space-y-2 list-disc pl-6">
          <li>
            <strong>HTTPS everywhere.</strong> All endpoints
            (<code className="font-mono">/api/v1/*</code> and docs) serve
            over TLS. Cloudflare edge handles termination.
            HSTS preload submission is still pending.
          </li>
          <li>
            <strong>No PII in logs.</strong> We log request paths, status
            codes, and IP-hashes (not raw IPs) at the edge. We do not log
            request bodies, response bodies, or API-key plaintext.
          </li>
          <li>
            <strong>No user-data sales.</strong> We do not operate a paid-account
            or billing system for this API today.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">What we don't (yet) guarantee</h2>
        <p className="text-sm leading-relaxed mb-3">
          Honest scope, per <a href="/methodology/" className="underline">methodology</a>:
        </p>
        <ul className="text-sm space-y-2 list-disc pl-6">
          <li>
            <strong>Catalog claim correctness.</strong> Every claim cites primary
            evidence; 368 of the 384 current claims include two or more sources.
            Sources can go stale, and the catalog does not guarantee that every
            claim remains true at every future moment.
          </li>
          <li>
            <strong>SOC 2 / ISO 27001.</strong> Not certified.
          </li>
          <li>
            <strong>Bug bounty program.</strong> Not running formally.
          </li>
          <li>
            <strong>Public-key verification.</strong> Not available today. The
            current HMAC tag has no public shared secret or public-key proof.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Incident response</h2>
        <p className="text-sm leading-relaxed mb-3">
          If we identify a material issue affecting public claim records, we
          will update the relevant record or changelog. We do not publish a
          guaranteed incident-response timeline.
        </p>
      </section>

      <section className="mb-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
        <h2 className="text-lg font-semibold mb-2">security.txt</h2>
        <p className="text-sm leading-relaxed">
          Machine-readable contact at{" "}
          <a href="/.well-known/security.txt" className="underline font-mono">
            /.well-known/security.txt
          </a>
          {" "}per RFC 9116.
        </p>
      </section>
    </main>
  );
}
