import type { Metadata } from "next";
import { breadcrumbListSchema } from "@/lib/methodology-version";

export const metadata: Metadata = {
  title: { absolute: "About SourceScore" },
  description:
    "SourceScore is the reference index for AI-citation quality plus VERITAS, the signed-claim verification API for LLM developers. About the project, methodology, and editorial policy.",
  alternates: { canonical: "https://sourcescore.org/about/" },
};

// Organization + AboutPage schema for E-E-A-T per rules/aceusergrowth.md
// v3 Part 23 (LLM-Visitor Behavior, 10-char #7 Credible). Dual-surface
// positioning explicit in `subjectOf` so retrieval models see both products
// as one brand entity.
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://sourcescore.org/#organization",
  name: "SourceScore",
  url: "https://sourcescore.org",
  logo: "https://sourcescore.org/logo.svg",
  description:
    "Transparent reference index for AI-citation quality (source-rating product) and signed claim verification for LLM developers (VERITAS API product).",
  email: "contact@sourcescore.org",
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@sourcescore.org",
    contactType: "Customer Support",
    availableLanguage: ["English"],
  },
  knowsAbout: [
    "AI source citation",
    "LLM grounding",
    "Retrieval-Augmented Generation",
    "Source quality methodology",
    "Claim verification",
    "Citation Discipline",
    "Modern Reference fitness",
    "Citation Velocity",
  ],
  subjectOf: [
    {
      "@type": "WebSite",
      "@id": "https://sourcescore.org/#sourceRatingProduct",
      name: "SourceScore Index",
      url: "https://sourcescore.org/",
      description:
        "Transparent leaderboard scoring 130+ sources on Citation Discipline, Modern Reference, and Citation Velocity.",
    },
    {
      "@type": "WebSite",
      "@id": "https://sourcescore.org/#veritasApiProduct",
      name: "SourceScore VERITAS",
      url: "https://sourcescore.org/claims/",
      description:
        "Signed claim verification API for LLM developers — 246 hand-verified AI/ML claims spanning 1997-2025 at v0.1, expanding to 5,000+ in Year 1.",
    },
  ],
  foundingDate: "2026-04",
  founder: { "@id": "https://sourcescore.org/about/#person-editorial-lead" },
  publisher: { "@id": "https://sourcescore.org/about/#person-editorial-lead" },
};

// Editorial Lead Person entity — referenced by every TechArticle / BlogPosting
// author field across the site via @id. Single source of truth for entity
// coherence (Aleyda 10-char #3 Recognizable + #7 Credible). Sameas links
// added by operator when public profiles are finalized.
const editorialPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://sourcescore.org/about/#person-editorial-lead",
  name: "SourceScore Editorial Team",
  description:
    "Maintainers of SourceScore methodology and the VERITAS verified-claim catalog. Editorial decisions follow the published methodology at /methodology/; corrections are timestamped and public.",
  url: "https://sourcescore.org/about/",
  email: "contact@sourcescore.org",
  worksFor: { "@id": "https://sourcescore.org/#organization" },
  knowsAbout: [
    "AI/ML research methodology",
    "LLM grounding",
    "Retrieval-augmented generation",
    "Claim verification",
    "HMAC signature schemes",
    "Source quality evaluation",
  ],
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: "https://sourcescore.org/about/",
  name: "About SourceScore",
  mainEntity: { "@id": "https://sourcescore.org/#organization" },
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(editorialPersonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "About", url: "https://sourcescore.org/about/" },
            ]),
          ),
        }}
      />

      <h1 className="text-display-2 font-bold tracking-tight mb-4">About SourceScore</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-8">
        SourceScore is two products on one domain: a transparent AI-citation
        quality index that scores 130+ reference sources, and{" "}
        <strong>VERITAS</strong> &mdash; a signed, sourced claim verification
        API for LLM developers building grounded retrieval. Both ship under
        one editorial methodology you can re-derive any time.
      </p>

      <section className="prose prose-invert max-w-none text-body text-text leading-relaxed space-y-5">
        <h2 className="text-heading-2 font-bold">Why this exists</h2>
        <p className="text-muted">
          AI engines surface a small subset of sources as authoritative
          citations. The criteria are opaque: there&rsquo;s no public list,
          no published ranking, no transparent rubric. SourceScore publishes
          a transparent rubric and ranks sources against it. Anyone can
          re-derive any score from the underlying signals. And on the API
          side, every verified claim ships with its primary sources, an
          HMAC-SHA256 signature, and a ready-to-paste citation &mdash; built
          for grounding LLM responses without re-doing source-quality work
          yourself.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Who we are</h2>
        <p className="text-muted">
          SourceScore is operated by a small independent team. The site is a
          sister project to HoldLens (sec-filings reference index) and other
          reference-grade fleet sites. The methodology is our intellectual
          property; the underlying public-source data we score and the
          verified claims we publish are credited to their original
          publishers under CC-BY 4.0.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Editorial policy</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted">
          <li>No paid placements. Scores cannot be purchased.</li>
          <li>Methodology changes are versioned and announced.</li>
          <li>Every score and every claim has explicit signals you can verify against primary sources.</li>
          <li>Corrections are timestamped and public.</li>
          <li>We do not auto-generate or fabricate data.</li>
          <li>
            Verified claims at confidence &lt;0.70 are not published. Performance comparisons are
            intentionally excluded from v0 because benchmark numbers depend on version + prompt format.
          </li>
        </ul>

        <h2 className="text-heading-2 font-bold pt-4">Two products, one methodology</h2>
        <p className="text-muted">
          <strong>SourceScore Index</strong> ranks <em>sources</em> by their
          AI-citation fitness. <strong>VERITAS</strong> ranks individual{" "}
          <em>claims</em> by their sourcing depth. Same trust-signal thinking,
          two different units of analysis. Both products are{" "}
          <a href="/methodology/" className="text-brand hover:underline">
            published methodology
          </a>
          ; both are independently re-derivable.
        </p>

        <h2 className="text-heading-2 font-bold pt-4">Get in touch</h2>
        <p className="text-muted">
          Questions about methodology, corrections, partnership requests,
          paid-tier API early-access, or anything else:{" "}
          <a href="/contact/" className="text-brand hover:underline">
            contact us
          </a>{" "}
          or email{" "}
          <a
            href="mailto:contact@sourcescore.org"
            className="text-brand hover:underline"
          >
            contact@sourcescore.org
          </a>
          .
        </p>
      </section>
    </article>
  );
}
