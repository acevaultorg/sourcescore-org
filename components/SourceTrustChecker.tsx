"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ScoreBadge } from "@/components/ScoreBadge";
import type { GradeLetter } from "@/lib/types";

// The free "AI Source-Trust Checker" front door (blueprint 2026-07-10, strategy
// linchpin). Enter a domain/name → an instant single RESULT CARD (grade + 4
// sub-scores + verdict + the embeddable "AI-cited" badge snippet + a request CTA),
// vs. the /search filter LIST. Pure static + client-side over the pre-scored
// index (no backend — the checker backend + email capture are gated behind the
// ~500–1k human-sessions/mo traffic threshold per blueprint §2.3). Unknown
// domains get an honest "not scored yet" + a request path (no fabricated grade).
//
// Client component (not a raw inline <script>): App Router hydration wipes inline
// DOM scripts — see the /search fix. useEffect/useState run post-hydration.

export type CheckerRow = {
  slug: string;
  name: string;
  domain: string;
  category: string;
  summary: string;
  i: number;
  ig: GradeLetter;
  d: number;
  dg: GradeLetter;
  m: number;
  mg: GradeLetter;
  v: number;
  vg: GradeLetter;
};

function normDomain(s: string) {
  const i = s.indexOf("://");
  if (i >= 0) s = s.slice(i + 3);
  if (s.lastIndexOf("www.", 0) === 0) s = s.slice(4);
  s = s.split("/")[0].split("?")[0].split("#")[0].split(":")[0];
  return s.toLowerCase().trim();
}

function findMatch(rows: CheckerRow[], raw: string): CheckerRow | null {
  const q = raw.trim().toLowerCase();
  if (!q) return null;
  const dom = normDomain(raw);
  // 1) exact domain, 2) domain substring either way, 3) name match
  return (
    rows.find((r) => r.domain === dom) ||
    rows.find((r) => dom.length >= 3 && (r.domain.includes(dom) || dom.includes(r.domain))) ||
    rows.find((r) => r.name.toLowerCase() === q) ||
    rows.find((r) => q.length >= 3 && r.name.toLowerCase().includes(q)) ||
    null
  );
}

function verdict(i: number): string {
  if (i >= 90) return "Top-tier — AI engines treat this as a primary, highly citable source.";
  if (i >= 80) return "Strong — a reliable, AI-citable source with solid citation discipline.";
  if (i >= 70) return "Good — citable, with some gaps in discipline or modern-reference fitness.";
  if (i >= 55) return "Mixed — use with corroboration; AI engines cite it selectively.";
  return "Weak — low AI-citation fitness; corroborate before relying on it.";
}

export function SourceTrustChecker({ rows, total }: { rows: CheckerRow[]; total: number }) {
  const [raw, setRaw] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Deep-link + hero handoff: prefill from ?q= (the homepage/nav send here).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      setRaw(q);
      setSubmitted(true);
    }
    inputRef.current?.focus();
  }, []);

  const match = useMemo(() => (submitted || raw.length >= 3 ? findMatch(rows, raw) : null), [rows, raw, submitted]);
  const showResult = submitted || raw.trim().length >= 2;
  const embed = match
    ? `<iframe src="https://sourcescore.org/embed/${match.slug}/" width="100%" height="380" loading="lazy" style="border:0;max-width:480px;" title="SourceScore: ${match.name}"></iframe>`
    : "";

  async function copyEmbed() {
    try {
      await navigator.clipboard.writeText(embed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the code is visible to select manually */
    }
  }

  return (
    <div className="max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={inputRef}
            type="search"
            inputMode="url"
            autoComplete="off"
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setSubmitted(false);
              setCopied(false);
            }}
            placeholder="Paste a URL or source — e.g. reuters.com"
            aria-label="Check a source's AI-citation trust grade"
            className="flex-1 px-4 py-3 rounded-card border border-border bg-panel text-text placeholder-dim focus:border-brand focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-card border border-brand/50 bg-surface-brand text-brand font-semibold hover:bg-panel-hi transition-colors whitespace-nowrap"
          >
            Check trust →
          </button>
        </div>
        <p className="mt-2 text-caption text-dim">
          Checked instantly against {total} hand-scored sources · free · no signup.
        </p>
      </form>

      {showResult && match && (
        <div className="mt-8 p-5 sm:p-6 rounded-card-lg border border-brand/30 bg-panel">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <a href={`/source/${match.slug}/`} className="text-heading-2 font-bold text-text hover:text-brand leading-tight">
                {match.name}
              </a>
              <div className="text-caption text-dim font-mono mt-0.5">
                {match.domain} · {match.category}
              </div>
            </div>
            <ScoreBadge value={match.i} grade={match.ig} label="SourceScore Index" size="lg" />
          </div>

          <p className="text-body text-muted leading-relaxed mb-4">{verdict(match.i)}</p>

          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { l: "Discipline", v: match.d, g: match.dg },
              { l: "Modern Ref.", v: match.m, g: match.mg },
              { l: "Velocity", v: match.v, g: match.vg },
            ].map((s) => (
              <div key={s.l} className="p-3 rounded-card border border-border bg-bg text-center">
                <div className="text-eyebrow text-dim mb-1.5">{s.l}</div>
                <div className="flex justify-center">
                  <ScoreBadge value={s.v} grade={s.g} label={s.l} size="sm" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <a
              href={`/source/${match.slug}/`}
              className="px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand text-body-sm font-semibold hover:bg-brand/15 transition-colors"
            >
              Full breakdown + signals →
            </a>
            <a
              href="/methodology/"
              className="px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-muted hover:text-text text-body-sm transition-colors"
            >
              How it&rsquo;s scored
            </a>
          </div>

          {/* Embeddable "AI-cited" trust badge — the compounding backlink unit. */}
          <div className="pt-5 border-t border-border">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="text-eyebrow text-brand">Put the AI-Trust badge on your site</div>
              <button
                type="button"
                onClick={copyEmbed}
                className="text-caption text-brand hover:underline whitespace-nowrap"
              >
                {copied ? "Copied ✓" : "Copy code"}
              </button>
            </div>
            <pre className="text-caption font-mono text-muted bg-bg border border-border rounded-card p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {embed}
            </pre>
            <p className="mt-2 text-caption text-dim">
              A live, always-current grade badge linking back to your SourceScore page.
            </p>
          </div>
        </div>
      )}

      {showResult && !match && (
        <div className="mt-8 p-6 rounded-card-lg border border-border bg-panel">
          <div className="text-eyebrow text-dim mb-2">Not scored yet</div>
          <p className="text-body-lg text-text mb-1">
            <span className="font-mono text-brand">{normDomain(raw) || raw.trim()}</span> isn&rsquo;t in the index yet.
          </p>
          <p className="text-body-sm text-muted mb-5 max-w-md">
            We score {total} sources so far and never show a grade we haven&rsquo;t verified. Request it, or see how
            scoring works.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/api-access/"
              className="px-4 py-2 rounded-btn border border-brand/40 bg-surface-brand text-brand text-body-sm font-semibold hover:bg-brand/15 transition-colors"
            >
              Request this source →
            </a>
            <a
              href="/methodology/"
              className="px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-muted hover:text-text text-body-sm transition-colors"
            >
              How scoring works
            </a>
            <a
              href="/sources/"
              className="px-4 py-2 rounded-btn border border-border bg-panel hover:bg-panel-hi text-muted hover:text-text text-body-sm transition-colors"
            >
              Browse all sources
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
