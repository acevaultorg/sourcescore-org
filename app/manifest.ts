import type { MetadataRoute } from "next";

// PWA manifest — Next.js 15.1+ MetadataRoute pattern.
// Borrowed from readstacks.com fleet pattern.
// Adds installability signal + theme metadata for Chrome / Safari /
// Edge install-prompt + iOS standalone mode. Modest GEO compound:
// Google Lighthouse PWA score + Chrome desktop install ribbon both
// honor this. AI crawlers also use manifest.json for some entity
// recognition.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SourceScore — AI-Citation Quality Index + VERITAS Evidence Catalog",
    short_name: "SourceScore",
    description:
      "Score sources on Discipline, Modern Reference, and Citation Velocity. VERITAS adds curated AI/ML claim records and candidate evidence retrieval.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
