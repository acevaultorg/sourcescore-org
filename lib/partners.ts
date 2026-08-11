// Partner-tool registry — the zero-lag affiliate activation layer.
//
// WHY THIS EXISTS: the day a partner program approves, going live must be a
// one-env-var change — no code edit, no PR, no deploy lag beyond the rebuild
// that Cloudflare Pages runs anyway. Every slot below is dormant until its
// URL env var is set, and `activePartners` is empty until then, so
// <PartnerTools> renders literally nothing (see components/PartnerTools.tsx).
//
// WHY THE SLOTS ARE HARD-CODED (and not a dynamic env lookup): Next.js inlines
// `NEXT_PUBLIC_*` at BUILD time via literal text substitution. A dynamic read
// like `process.env["NEXT_PUBLIC_AFF_" + slug]` is NOT substituted and always
// evaluates to undefined in a static export. Each slot therefore reads its own
// literal `process.env.NEXT_PUBLIC_AFF_<NAME>`. Two generic slots
// (SLOT1 / SLOT2) carry name + note env vars too, so a program we have not
// anticipated still activates without touching code.
//
// LIVE AS OF 2026-08-11: Rankscale.ai (approved, Rewardful). Its URL is set in
// .gitlab-ci.yml `variables:` — a public referral link, committed so the CI build
// that actually renders the HTML can see it. Every other slot is still dormant.

export type Partner = {
  /** Stable analytics key — becomes the `partner` prop on the affiliate_click event. */
  slug: string;
  /** Display name of the tool. */
  name: string;
  /** One neutral sentence on what the tool does. Never a superlative, never a claim we cannot back. */
  note: string;
  /** Affiliate/partner destination. Must be https. */
  url: string;
};

type Slot = {
  slug: string;
  name?: string;
  note?: string;
  url?: string;
};

/** Trim and treat empty/whitespace env values as unset. */
function clean(value: string | undefined): string | undefined {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Only https destinations render. A typo'd or http:// value is dropped rather
 * than shipped as a broken/insecure outbound link.
 */
function isHttpsUrl(value: string | undefined): boolean {
  const url = clean(value);
  if (!url) return false;
  return /^https:\/\/[^\s"'<>]+$/i.test(url);
}

// ── Slots ──────────────────────────────────────────────────────────────
// Named slots for tools in this site's own category (AI-citation / AI-search
// visibility monitoring), plus two free-form slots for anything else.
const SLOTS: Slot[] = [
  {
    slug: "otterly",
    name: "Otterly.AI",
    note: "Monitors brand mentions and links inside AI search answers.",
    url: process.env.NEXT_PUBLIC_AFF_OTTERLY,
  },
  {
    slug: "rankscale",
    name: "Rankscale.ai",
    note: "AI-search visibility audits and rank tracking across AI engines.",
    url: process.env.NEXT_PUBLIC_AFF_RANKSCALE,
  },
  {
    slug: "profound",
    name: "Profound",
    note: "Answer-engine visibility analytics for larger teams.",
    url: process.env.NEXT_PUBLIC_AFF_PROFOUND,
  },
  {
    slug: "semrush",
    name: "Semrush",
    note: "SEO suite whose AI toolkit tracks brand visibility in AI answers.",
    url: process.env.NEXT_PUBLIC_AFF_SEMRUSH,
  },
  {
    slug: "ahrefs",
    name: "Ahrefs",
    note: "SEO suite whose Brand Radar tracks mentions in AI answers.",
    url: process.env.NEXT_PUBLIC_AFF_AHREFS,
  },
  {
    slug: "slot-1",
    name: process.env.NEXT_PUBLIC_AFF_SLOT1_NAME,
    note: process.env.NEXT_PUBLIC_AFF_SLOT1_NOTE,
    url: process.env.NEXT_PUBLIC_AFF_SLOT1_URL,
  },
  {
    slug: "slot-2",
    name: process.env.NEXT_PUBLIC_AFF_SLOT2_NAME,
    note: process.env.NEXT_PUBLIC_AFF_SLOT2_NOTE,
    url: process.env.NEXT_PUBLIC_AFF_SLOT2_URL,
  },
];

/**
 * Partners that are actually configured right now. Empty array = the whole
 * activation layer stays invisible.
 */
export const activePartners: Partner[] = SLOTS.flatMap((slot) => {
  const url = clean(slot.url);
  const name = clean(slot.name);
  // A generic slot with a URL but no name is a misconfiguration — skip it
  // rather than render an unlabeled link.
  if (!isHttpsUrl(url) || !url || !name) return [];
  return [
    {
      slug: slot.slug,
      name,
      note: clean(slot.note) ?? "",
      url,
    },
  ];
});

export const hasActivePartners = activePartners.length > 0;
