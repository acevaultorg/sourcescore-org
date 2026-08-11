import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SourceScore Terms of Service — usage rules, scoring methodology disclaimer, and limits of liability.",
  alternates: { canonical: "https://sourcescore.org/terms/" },
};

const TERMS_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: "https://sourcescore.org/terms/",
  name: "Terms of Service",
  description: "SourceScore Terms of Service — usage rules, scoring methodology disclaimer, liability limits.",
  datePublished: "2026-05-06",
  dateModified: "2026-05-06",
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", url: "https://sourcescore.org/", name: "SourceScore" },
  publisher: { "@type": "Organization", "@id": "https://sourcescore.org/#organization", name: "SourceScore" },
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TERMS_LD) }} />
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Terms of Service</h1>
      <p className="text-body text-dim mb-8">Last updated: 2026-05-06</p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <p className="text-muted">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of sourcescore.org (the
          &ldquo;Site&rdquo;). By accessing or using the Site you agree to be bound by these Terms.
          If you do not agree, please do not use the Site.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">1. Editorial reference, not endorsement</h2>
        <p className="text-muted">
          SourceScore publishes citation-discipline scoring of LLM-source quality. Scores reflect a
          published methodology applied to public sources; they are editorial assessments, not
          investment, legal, medical, or factual-truth warranties. Always verify against the cited
          source document for your specific decision.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">2. Methodology and accuracy</h2>
        <p className="text-muted">
          Our scoring methodology is documented at{" "}
          <a href="/methodology" className="text-brand hover:underline">/methodology</a>{" "}
          and at{" "}
          <a href="/methodology/citation-discipline" className="text-brand hover:underline">/methodology/citation-discipline</a>.
          We make reasonable efforts to apply the methodology consistently but make no warranty of
          completeness, currency, or absence of error. Scoring inputs change over time. Use the cited
          source documents and the published methodology as the authoritative references if accuracy
          matters to you.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">3. Permitted use</h2>
        <p className="text-muted">
          You may view, share links to, and reference content for personal, non-commercial purposes.
          You may not:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>Scrape or systematically extract data without written permission</li>
          <li>Reverse-engineer, decompile, or disassemble any part of the Site</li>
          <li>Use the Site to build a competing product</li>
          <li>Introduce malware, viruses, or harmful code</li>
          <li>Misrepresent the source of content or remove citations</li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">4. Intellectual property</h2>
        <p className="text-muted">
          The scoring methodology, ranking aggregations, design, code, and brand are owned by
          SourceScore and protected by copyright. The SourceScore name and logo are trademarks.
          Underlying public-domain factual data remains in the public domain.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">5. Affiliate disclosure</h2>
        <p className="text-muted">
          SourceScore may earn affiliate commissions when you click certain outbound links. These
          commissions help keep the core Site free. Affiliate links are always marked with{" "}
          <code className="text-xs bg-panel/30 px-1 py-0.5 rounded">rel=&ldquo;sponsored nofollow&rdquo;</code>{" "}
          and accompanied by an inline disclosure where present.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">6. Advertising</h2>
        <p className="text-muted">
          SourceScore may display advertisements via Google AdSense. Ads are clearly labeled. Clicking
          an ad takes you to a third-party site whose practices are outside our control. See our{" "}
          <a href="/privacy" className="text-brand hover:underline">Privacy Policy</a> for details
          on advertising cookies and how to opt out.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">7. Third-party content and links</h2>
        <p className="text-muted">
          The Site contains links to third-party websites and services. We do not control these
          third parties and are not responsible for their content, accuracy, or practices. Their use
          is subject to their own terms and privacy policies.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">8. Disclaimer of warranties</h2>
        <p className="text-muted">
          THE SITE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES
          OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SITE WILL BE
          UNINTERRUPTED OR ERROR-FREE OR THAT THE SCORING METHODOLOGY OUTPUTS ARE SUITABLE FOR ANY
          SPECIFIC DECISION. ALWAYS VERIFY WITH CITED SOURCES.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">9. Limitation of liability</h2>
        <p className="text-muted">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOURCESCORE SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR IN CONNECTION WITH
          YOUR USE OF THE SITE. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED ONE EURO (&euro;1).
        </p>

        <h2 className="text-heading-2 font-bold pt-4">10. Changes</h2>
        <p className="text-muted">
          We may modify, suspend, or discontinue any part of the Site at any time without notice.
          We may also update these Terms; when we do we will revise the &ldquo;Last updated&rdquo;
          date. Continued use after changes constitutes acceptance.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">11. Governing law</h2>
        <p className="text-muted">
          These Terms are governed by the laws of the Netherlands. Disputes will be resolved in the
          courts of the Netherlands.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">12. Contact</h2>
        <p className="text-muted">
          Questions about these Terms:{" "}
          <a href="mailto:hello@caslonmedia.com" className="text-brand hover:underline">
            hello@caslonmedia.com
          </a>.
        </p>

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          These Terms are provided for informational purposes and do not constitute legal advice.
        </p>
      </section>
    </article>
  );
}
