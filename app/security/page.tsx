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
    "Security policy, responsible-disclosure process, signing-key rotation schedule, and incident-response timelines for SourceScore VERITAS.",
  alternates: { canonical: "https://sourcescore.org/security/" },
  openGraph: {
    title: "Security — SourceScore VERITAS",
    description: "Responsible disclosure, signing-key rotation, incident response.",
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
          How we sign claims, rotate keys, handle disclosed vulnerabilities,
          and respond to incidents. Honest about scope — read the limits
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
          Every claim envelope is signed with HMAC-SHA256 over a canonical
          JSON serialization (sorted keys, ASCII-safe, no whitespace) of:
          claim fields + <code className="font-mono">signedAt</code> +
          <code className="font-mono">signedBy</code>. Re-compute locally
          to verify integrity — see{" "}
          <a href="/docs/integrations/langchain/#pattern-3" className="underline">
            the signature-verification example
          </a>{" "}
          in the integration guide.
        </p>
        <p className="text-sm leading-relaxed mb-3">
          <strong>Signer identity:</strong>{" "}
          <code className="font-mono">did:web:sourcescore.org</code>. This
          identifier is preserved across all key rotations; the underlying
          key material changes, the public identity does not.
        </p>
        <p className="text-sm leading-relaxed">
          <strong>Migration path:</strong> v0 uses HMAC-SHA256 (shared
          secret) for the catalog distribution layer. Y2 migrates to W3C
          Verifiable Credentials with Ed25519 public-key signing. Existing
          envelope shape is forward-compatible — same fields, additional{" "}
          <code className="font-mono">proof</code> block. Old HMAC envelopes
          remain verifiable for ≥24 months post-migration.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Key rotation</h2>
        <p className="text-sm leading-relaxed mb-3">
          The catalog signing secret rotates quarterly on a published
          schedule. Old envelopes remain valid forever (signatures are
          checked against the key in effect at their{" "}
          <code className="font-mono">signedAt</code> timestamp). New
          envelopes after the rotation date are signed with the new key.
        </p>
        <ul className="text-sm space-y-1 list-disc pl-6">
          <li>Quarter 1: signing key #1 active</li>
          <li>Quarter 2: signing key #2 active; key #1 used for legacy verification only</li>
          <li>… etc. Rotation events are logged to this page + /changelog/.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">API-key hygiene</h2>
        <p className="text-sm leading-relaxed mb-3">
          Paid-tier API keys are hashed (SHA-256) at rest; we never store
          plaintext. The key prefix (first 8 chars) is kept for ops
          identification but cannot reconstruct the full key. If you
          believe a key is compromised:
        </p>
        <ol className="text-sm space-y-1 list-decimal pl-6">
          <li>Revoke it immediately in your dashboard.</li>
          <li>Generate a replacement.</li>
          <li>Email{" "}
            <a href="mailto:hello@caslonmedia.com" className="underline">
              hello@caslonmedia.com
            </a>{" "}with the prefix so we can fingerprint the abuse pattern fleet-wide.</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Scope of guarantees</h2>
        <ul className="text-sm space-y-2 list-disc pl-6">
          <li>
            <strong>HTTPS everywhere.</strong> All endpoints
            (<code className="font-mono">/api/v1/*</code>, dashboard,
            docs) serve over TLS 1.2+. Cloudflare edge handles termination.
            HSTS preload submission is still pending.
          </li>
          <li>
            <strong>No PII in logs.</strong> We log request paths, status
            codes, and IP-hashes (not raw IPs) at the edge. We do not log
            request bodies, response bodies, or API-key plaintext.
          </li>
          <li>
            <strong>No user-data sales.</strong> Cloud provider terms (CF,
            Stripe, Resend) apply; we do not have an additional data-share
            relationship.
          </li>
          <li>
            <strong>Static signing surface.</strong> The catalog JSON twin
            served from the edge is content-addressable by claim id +
            timestamp. Mutation requires re-signing — there is no path for
            in-place edits.
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
            <strong>Catalog claim correctness.</strong> Every claim has ≥2
            primary sources hand-verified at publish time. Sources can go
            stale; we mark claims with <code className="font-mono">lastVerified</code> dates
            and re-verify on a documented cadence, but we do not guarantee
            that every claim is true at every future moment.
          </li>
          <li>
            <strong>SOC 2 / ISO 27001.</strong> Not yet certified. On
            roadmap for Y2 once we cross 100 paying customers (per the
            self-serve growth thesis).
          </li>
          <li>
            <strong>Bug bounty program.</strong> Not yet running formally;
            disclosures are credited publicly + we'll send a thank-you
            payment for high-severity reports at our discretion until a
            formal program launches.
          </li>
          <li>
            <strong>Public-key signing (Ed25519).</strong> v0 is shared-
            secret HMAC. Y2 migration is on the roadmap; until then,
            envelope integrity verification requires either trusting the
            catalog JSON twin OR holding the shared secret (Enterprise tier).
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Incident response</h2>
        <p className="text-sm leading-relaxed mb-3">
          Active incidents are surfaced on this page + at{" "}
          <a href="/changelog/" className="underline">/changelog/</a>{" "}
          (severity: breaking) within 4 hours of detection. Post-mortems
          for incidents impacting paying customers are published within
          14 days. Subscribe to /feed.xml for incident notifications.
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
