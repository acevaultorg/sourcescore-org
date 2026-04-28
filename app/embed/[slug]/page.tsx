import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSource, allSlugs } from "@/data/sources";
import { ScoreBadge } from "@/components/ScoreBadge";

// Embeddable widget — Layer 5 archetype `embeddable_widget × +80` (highest
// in v18 calibrated Distribution Oracle table). Each embed = permanent
// backlink + permanent discovery channel. Mini-page rendered standalone
// (no header, no footer) so it works inside an iframe of any size.
//
// Iframe consumers paste the snippet from /embed/ on their site; visitors
// click through to the canonical /source/<slug>/ page on sourcescore.org.

export function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = getSource(slug);
  if (!s) return { title: "Embed not found" };
  return {
    title: `${s.name} — SourceScore embed`,
    description: `Embeddable widget showing ${s.name}'s SourceScore Index.`,
    alternates: { canonical: `https://sourcescore.org/source/${s.slug}/` },
    robots: { index: false, follow: true },
    openGraph: { title: `${s.name} — SourceScore`, type: "website" },
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const { slug } = await params;
  const source = getSource(slug);
  if (!source) notFound();
  const idx = source.scores.index;
  const canonical = `https://sourcescore.org/source/${source.slug}/`;

  return (
    <>
      {/* Hide site chrome when rendered inside an iframe — embed mini-page
          should be visually self-contained. The root <html><body> shell
          is reused so we just hide the header/footer + remove min-height. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body { min-height: 0 !important; background: transparent !important; }
            body > header, body > footer { display: none !important; }
            body > main { flex: none !important; }
          `,
        }}
      />
      <div className="bg-bg flex items-center justify-center p-3">
        <a
        href={canonical}
        target="_top"
        rel="noopener"
        className="block w-full max-w-md rounded-card-lg border border-border bg-panel hover:bg-panel-hi hover:border-brand/40 transition-colors p-5 group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-eyebrow text-brand">
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-4 h-4 rounded-chip bg-surface-brand border border-brand/30 text-brand text-[8px] font-bold"
            >
              ★
            </span>
            SourceScore
          </span>
          <span className="text-caption text-dim font-mono">{source.category}</span>
        </div>

        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-heading-2 font-bold text-text leading-tight group-hover:text-brand transition-colors">
            {source.name}
          </h2>
        </div>
        <div className="text-caption text-dim font-mono mb-4">{source.domain}</div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2 rounded-card border border-border bg-bg">
            <div className="text-eyebrow text-dim mb-1">Index</div>
            <ScoreBadge value={idx.value} grade={idx.grade} size="sm" />
          </div>
          <div className="p-2 rounded-card border border-border bg-bg">
            <div className="text-eyebrow text-dim mb-1">Discipline</div>
            <ScoreBadge
              value={source.scores.discipline.value}
              grade={source.scores.discipline.grade}
              size="sm"
            />
          </div>
          <div className="p-2 rounded-card border border-border bg-bg">
            <div className="text-eyebrow text-dim mb-1">Modern Ref</div>
            <ScoreBadge
              value={source.scores.modernReference.value}
              grade={source.scores.modernReference.grade}
              size="sm"
            />
          </div>
          <div className="p-2 rounded-card border border-border bg-bg">
            <div className="text-eyebrow text-dim mb-1">Velocity</div>
            <ScoreBadge
              value={source.scores.velocity.value}
              grade={source.scores.velocity.grade}
              size="sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-caption text-dim">
          <span>Methodology v0.1 · Last verified {source.verified}</span>
          <span className="text-brand group-hover:underline">View full breakdown →</span>
        </div>
      </a>
      </div>
    </>
  );
}
