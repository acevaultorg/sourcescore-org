import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SourceScore privacy policy — what we collect, how we use it, your rights.",
  alternates: { canonical: "https://sourcescore.org/privacy/" },
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Privacy Policy</h1>
      <p className="text-body text-dim mb-8">Last updated: 2026-04-28</p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <p className="text-muted">
          This Privacy Policy describes how SourceScore (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
          uses, and shares information when you visit sourcescore.org (the &ldquo;Site&rdquo;).
        </p>

        <h2 className="text-heading-2 font-bold">Information we collect</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>
            <strong className="text-text">Standard server logs:</strong> IP address, user-agent,
            request timestamp, referrer.
          </li>
          <li>
            <strong className="text-text">Privacy-first analytics:</strong> aggregated page-view
            counts via privacy-respecting analytics (no individual tracking, no cross-site cookies).
          </li>
          <li>
            <strong className="text-text">Email contact:</strong> if you email us, we retain the
            email and reply for as long as needed to handle your inquiry.
          </li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">Cookies + advertising</h2>
        <p className="text-muted">
          The Site may use third-party advertising (Google AdSense or equivalent) that uses cookies,
          web beacons, and other identifiers to serve ads based on prior visits to this and other
          websites. Google&apos;s use of advertising cookies enables it and its partners to serve
          ads based on your visit to our sites and other sites. You may opt out of personalized
          advertising by visiting <a href="https://adssettings.google.com" className="text-brand hover:underline" rel="nofollow">Google&apos;s Ad Settings</a>{" "}
          or learn more at <a href="https://policies.google.com/technologies/partner-sites" className="text-brand hover:underline" rel="nofollow">How Google uses data when you use our partners&apos; sites or apps</a>.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Third-party services</h2>
        <p className="text-muted">
          We use Cloudflare for hosting and edge delivery. Cloudflare may collect and process
          information per their{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" className="text-brand hover:underline" rel="nofollow">
            privacy policy
          </a>.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Your rights (GDPR / CCPA)</h2>
        <p className="text-muted">
          If you are an EU/EEA, UK, or California resident you have rights to access, correction,
          erasure, restriction, and portability of your personal data. To exercise any of these
          rights, email{" "}
          <a href="mailto:contact@acevault.org" className="text-brand hover:underline">
            contact@acevault.org
          </a>.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Children</h2>
        <p className="text-muted">
          The Site is not directed at children under 13 and we do not knowingly collect personal
          information from children under 13.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Changes</h2>
        <p className="text-muted">
          We may update this policy. The &ldquo;Last updated&rdquo; date at the top reflects the
          most recent revision. Material changes will be announced on the homepage.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Contact</h2>
        <p className="text-muted">
          Questions about this policy:{" "}
          <a href="mailto:contact@acevault.org" className="text-brand hover:underline">
            contact@acevault.org
          </a>.
        </p>
      </section>
    </article>
  );
}
