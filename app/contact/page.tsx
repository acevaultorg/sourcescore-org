import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact SourceScore" },
  description: "Contact SourceScore for methodology questions, corrections, or partnership requests.",
  alternates: { canonical: "https://sourcescore.org/contact/" },
};

export default function ContactPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-display-2 font-bold tracking-tight mb-4">Contact</h1>
      <p className="text-body-lg text-muted leading-relaxed mb-8">
        For methodology questions, score corrections, or partnership requests, please email us
        directly.
      </p>

      <div className="p-6 rounded-card-lg border border-border bg-panel space-y-5">
        <div>
          <div className="text-eyebrow text-dim mb-1">Email</div>
          <a
            href="mailto:contact@sourcescore.org"
            className="text-body-lg text-brand hover:underline font-mono"
          >
            contact@sourcescore.org
          </a>
        </div>
        <div>
          <div className="text-eyebrow text-dim mb-1">Response time</div>
          <p className="text-body text-muted">Typically within 3 business days.</p>
        </div>
        <div>
          <div className="text-eyebrow text-dim mb-1">For score corrections</div>
          <p className="text-body text-muted leading-relaxed">
            Please include the source slug, the specific signal you believe is mis-scored, and a link
            to verifiable evidence. Approved corrections are applied with a timestamped public note.
          </p>
        </div>
      </div>
    </article>
  );
}
