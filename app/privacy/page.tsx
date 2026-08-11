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
      <p className="text-body text-dim mb-8">Last updated: 2026-08-11</p>

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
            <strong className="text-text">Analytics:</strong> we use{" "}
            <strong className="text-text">Google Analytics 4</strong> (page views, referrer,
            device and browser type, approximate location, with IP anonymisation enabled) and{" "}
            <strong className="text-text">Microsoft Clarity</strong> (anonymised interaction
            data — clicks, scroll depth, and session replays — so we can see where pages confuse
            people). We do not use either to identify you personally, and we do not sell data.
          </li>
          <li>
            <strong className="text-text">Email contact:</strong> if you email us, we retain the
            email and reply for as long as needed to handle your inquiry.
          </li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">Cookies + advertising</h2>
        <p className="text-muted">
          <strong className="text-text">We run no advertising network on this Site.</strong> There
          is no Google AdSense, no ad tags, and no advertising cookies set by us.
        </p>
        <p className="text-muted">
          The analytics above may set first-party cookies or use equivalent browser storage to tell
          one session from another. Google Analytics 4 is configured with{" "}
          <a href="https://support.google.com/analytics/answer/9976101" className="text-brand hover:underline" rel="nofollow">
            Google Consent Mode
          </a>{" "}
          defaults of <code className="font-mono text-text">denied</code> for analytics and
          advertising storage for visitors in the EU/EEA, the UK, Switzerland, and California — so
          for those visitors GA4 runs without storing analytics cookies. Outside those regions the
          default is <code className="font-mono text-text">granted</code> and GA4 sets its standard
          first-party analytics cookies. You can block either tool with any standard content
          blocker; the Site works normally without them.
        </p>
        <p className="text-muted">
          Some links on the Site may be affiliate links (see our{" "}
          <a href="/disclosure/" className="text-brand hover:underline">affiliate disclosure</a>).
          Those are ordinary outbound links — we set no cookie for them. If you follow one, the
          destination site may set its own cookies under its own privacy policy. On our side we
          record only an anonymous &ldquo;a link was clicked&rdquo; event in the analytics above.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Third-party services</h2>
        <p className="text-muted">
          We use Cloudflare for hosting and edge delivery, Google Analytics 4 for aggregate traffic
          measurement, and Microsoft Clarity for anonymised interaction analytics. Each processes
          data under its own policy:{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" className="text-brand hover:underline" rel="nofollow">
            Cloudflare
          </a>
          ,{" "}
          <a href="https://policies.google.com/privacy" className="text-brand hover:underline" rel="nofollow">
            Google
          </a>{" "}
          (and{" "}
          <a href="https://policies.google.com/technologies/partner-sites" className="text-brand hover:underline" rel="nofollow">
            how Google uses data from partner sites
          </a>
          ),{" "}
          <a href="https://privacy.microsoft.com/privacystatement" className="text-brand hover:underline" rel="nofollow">
            Microsoft
          </a>
          .
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Your rights (GDPR / CCPA)</h2>
        <p className="text-muted">
          If you are an EU/EEA, UK, or California resident you have rights to access, correction,
          erasure, restriction, and portability of your personal data. To exercise any of these
          rights, email{" "}
          <a href="mailto:hello@caslonmedia.com" className="text-brand hover:underline">
            hello@caslonmedia.com
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
          <a href="mailto:hello@caslonmedia.com" className="text-brand hover:underline">
            hello@caslonmedia.com
          </a>.
        </p>
      </section>
    </article>
  );
}
