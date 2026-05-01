import type { Config } from "tailwindcss";

// SourceScore design tokens — Day 1.
//
// Design intent: clean, scholarly-feeling palette for a citation-discipline
// product. Dark-mode-first like holdlens, but the brand color is INDIGO
// (academic + trust + LLM-citation reference signal) rather than amber
// (premium-finance). Score grades use a calibrated scale: emerald (A/A+),
// sky (B), amber (C), rose (D/F) — universal academic conventions.

const config: Config = {
  // lib/ included so JIT picks up grade-color class strings declared in
  // lib/types.ts (gradeColorClass + gradeSurfaceClass). Without this scan
  // path, the academic-convention grade palette (emerald A → rose F)
  // defined below NEVER COMPILED into CSS — every grade badge fell back
  // to the default text color, killing the visual hierarchy that's the
  // entire point of a rating system. Caught 2026-05-01 audit.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surfaces (dark-first, ported from holdlens semantic layer)
        bg: "#0a0a0f",
        panel: "#141420",
        "panel-hi": "#1c1c2c",
        border: "#262638",
        "border-bright": "#323250",
        text: "#e5e7ee",
        muted: "#9499a8",
        dim: "#7a8198",

        // Brand — indigo (scholarship/trust/citation)
        brand: "#818cf8",     // indigo-400
        "brand-soft": "rgba(129, 140, 248, 0.5)",
        "surface-brand": "rgba(129, 140, 248, 0.08)",

        // Score grades (academic convention: A=green, B=blue, C=amber, D/F=rose)
        "grade-a": "#34d399",   // emerald-400 — A / A+
        "grade-b": "#38bdf8",   // sky-400 — B
        "grade-c": "#fbbf24",   // amber-400 — C
        "grade-d": "#fb923c",   // orange-400 — D
        "grade-f": "#fb7185",   // rose-400 — F

        // Surface tints
        "surface-a": "rgba(52, 211, 153, 0.08)",
        "surface-b": "rgba(56, 189, 248, 0.08)",
        "surface-c": "rgba(251, 191, 36, 0.08)",
        "surface-d": "rgba(251, 146, 60, 0.08)",
        "surface-f": "rgba(251, 113, 133, 0.08)",
        "surface-hover": "rgba(255, 255, 255, 0.05)",
      },

      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        serif: ["ui-serif", "Charter", "Georgia", "Cambria", "serif"],
      },

      fontSize: {
        "display-1": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-2": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "700" }],
        "heading-1": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-2": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-3": ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        "body": ["0.9375rem", { lineHeight: "1.55" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
        "eyebrow": ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "700" }],
      },

      borderRadius: {
        "chip": "0.375rem",
        "btn": "0.625rem",
        "card": "0.875rem",
        "card-lg": "1.125rem",
        "pill": "9999px",
      },

      boxShadow: {
        "rim": "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "rim-strong": "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "lift": "0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "hover-lift": "0 12px 32px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "brand-glow": "0 0 32px -4px rgba(129, 140, 248, 0.35), 0 0 12px -2px rgba(129, 140, 248, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
