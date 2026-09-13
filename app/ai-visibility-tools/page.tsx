import type { Metadata } from "next";
import { CitationDeskCTA } from "@/components/CitationDeskCTA";
import { activePartners, type Partner } from "@/lib/partners";
import { breadcrumbListSchema } from "@/lib/methodology-version";

const CANONICAL = "https://sourcescore.org/ai-visibility-tools/";

export const metadata: Metadata = {
  title: { absolute: "AI visibility tools: choose by job, not hype | SourceScore" },
  description:
    "A practical guide to AI-visibility tools: free citation-readiness audit, dedicated AI-answer monitoring, or a broader SEO suite. Clear disclosures and no fake rankings.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "AI visibility tools: choose by job, not hype",
    description:
      "Choose between a free readiness audit, continuous AI-answer monitoring, and a broader SEO suite.",
    url: CANONICAL,
    type: "article",
  },
};

const DEDICATED = new Set(["rankscale", "mangools", "otterly", "profound"]);
const PREFERRED_ORDER = ["rankscale", "mangools", "seranking", "morningscore"];

function orderedPartners(): Partner[] {
  return [...activePartners].sort((a, b) => {
    const ai = PREFERRED_ORDER.indexOf(a.slug);
    const bi = PREFERRED_ORDER.indexOf(b.slug);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
}

function PartnerCard({
  partner,
  label,
  intent,
}: {
  partner: Partner;
  label: string;
  intent: string;
}) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="sponsored nofollow noopener"
      data-event="affiliate_click"
      data-event-partner={partner.slug}
      data-event-source="ai-visibility-guide"
      data-event-intent={intent}
      className="group block rounded-card-lg border border-border bg-panel p-5 hover:border-brand/50 hover:bg-panel-hi transition-colors"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-eyebrow text-brand">{label}</span>
        <span className="text-caption font-mono uppercase tracking-wide text-dim">
          Paid link
        </span>
      </div>
      <h3 className="text-heading-3 font-bold text-text group-hover:text-brand transition-colors">
        {partner.name}
      </h3>
      <p className="mt-2 text-body-sm text-muted leading-relaxed">{partner.note}</p>
      <span className="mt-4 inline-block text-body-sm font-semibold text-brand group-hover:underline">
        Visit {partner.name} &rarr;
      </span>
    </a>
  );
}

export default function AiVisibilityToolsPage() {
  const partners = orderedPartners();
  const dedicated = partners.filter((partner) => DEDICATED.has(partner.slug));
  const broader = partners.filter((partner) => !DEDICATED.has(partner.slug));

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbListSchema([
              { name: "SourceScore", url: "https://sourcescore.org/" },
              { name: "AI visibility tools", url: CANONICAL },
            ]),
          ),
        }}
      />

      <nav className="text-body-sm text-dim mb-6">
        <a href="/" className="hover:text-text">SourceScore</a>
        <span className="mx-2">›</span>
        <span className="text-muted">AI visibility tools</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <div className="text-eyebrow text-brand mb-3">Buyer guide · reviewed 13 September 2026</div>
        <h1 className="text-display-2 font-bold tracking-tight mb-4">
          AI visibility tools: choose by job, not hype
        </h1>
        <p className="text-body-lg text-muted leading-relaxed">
          Start by deciding what you need: a one-off audit of a page, continuous
          monitoring of AI answers, or a broader SEO suite. Those are different
          jobs. This guide separates them and labels every commercial link.
        </p>
      </header>

      <section className="mb-12 rounded-card-lg border border-border bg-panel p-6 sm:p-7">
        <h2 className="text-heading-2 font-bold mb-3">The short answer</h2>
        <ol className="space-y-3 text-body text-muted leading-relaxed list-decimal pl-5">
          <li>
            <strong className="text-text">Diagnosing one page?</strong> Run the
            free CitationDesk readiness audit first. It checks observable page
            signals and gives you a fix; it does not pretend to measure live AI mentions.
          </li>
          <li>
            <strong className="text-text">Tracking mentions over time?</strong>{" "}
            Choose a dedicated AI-answer monitoring tool and test it on your own
            prompts before committing.
          </li>
          <li>
            <strong className="text-text">Need conventional SEO too?</strong>{" "}
            A broader suite can reduce tool sprawl, but only if its AI features cover
            the engines, regions, prompts, and reporting you actually need.
          </li>
        </ol>
      </section>

      <section className="mb-12">
        <div className="text-eyebrow text-dim mb-3">Step 1 · free diagnostic</div>
        <CitationDeskCTA
          variant="panel"
          source="ai-visibility-guide"
          intent="readiness-first"
        />
      </section>

      {dedicated.length > 0 ? (
        <section className="mb-12">
          <div className="text-eyebrow text-dim mb-2">Step 2 · continuous monitoring</div>
          <h2 className="text-heading-1 font-bold tracking-tight mb-3">
            Dedicated AI-answer monitoring
          </h2>
          <p className="text-body text-muted leading-relaxed mb-5 max-w-3xl">
            These tools are positioned around monitoring mentions or visibility in
            AI answers. SourceScore has not run a controlled head-to-head trial, so
            this is a job-fit shortlist—not a performance ranking.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {dedicated.map((partner, index) => (
              <PartnerCard
                key={partner.slug}
                partner={partner}
                label={index === 0 ? "Dedicated starting point" : "Dedicated alternative"}
                intent="continuous-ai-monitoring"
              />
            ))}
          </div>
        </section>
      ) : null}

      {broader.length > 0 ? (
        <section className="mb-12">
          <div className="text-eyebrow text-dim mb-2">Alternative · consolidate tools</div>
          <h2 className="text-heading-1 font-bold tracking-tight mb-3">
            Broader SEO suites
          </h2>
          <p className="text-body text-muted leading-relaxed mb-5 max-w-3xl">
            Consider these when rank tracking, audits, or backlink work matters as
            much as AI visibility. Verify the current AI-monitoring coverage on the
            vendor page before buying; product scope changes.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {broader.map((partner) => (
              <PartnerCard
                key={partner.slug}
                partner={partner}
                label="Broader SEO option"
                intent="seo-suite"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-12 border-t border-border pt-8">
        <h2 className="text-heading-2 font-bold mb-4">What to verify during a trial</h2>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-body text-muted leading-relaxed">
          <li>• The exact AI engines and model surfaces covered</li>
          <li>• Country, language, and device-location controls</li>
          <li>• Your own prompts, not a vendor-selected prompt set</li>
          <li>• Citation URLs as well as brand mentions</li>
          <li>• History, exports, alerts, and team access</li>
          <li>• A cancellation path and total recurring cost</li>
        </ul>
      </section>

      <aside className="rounded-card border border-brand/30 bg-surface-brand p-5 text-body-sm text-muted leading-relaxed">
        <strong className="text-text">Disclosure:</strong> links labeled “Paid
        link” are affiliate links. If you buy, SourceScore may earn a commission
        at no extra cost to you. Commercial relationships never affect a source
        score or claim. See the{" "}
        <a href="/disclosure/" className="text-brand hover:underline">
          affiliate disclosure
        </a>
        . CitationDesk is a sister product from the same publisher, not an affiliate.
      </aside>
    </article>
  );
}
