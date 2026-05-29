// Mobile navigation drawer — visible <md (768px), hidden md+.
// Restores access to 4 of 8 nav items (Modern Reference, Sources, Compare,
// Methodology) that were `hidden sm:|md:|lg:inline-block` and therefore
// invisible to mobile users. Modern Reference is one of the 4 primary
// scoring sub-tools (Index/Discipline/Modern Reference/Velocity), so its
// invisibility on 55-65% of traffic was a product-information loss.
//
// Pattern: hamburger button + fixed full-width drawer with backdrop.
// Touch targets ≥44px (rules/mobile-perfection-default.md). Closes on:
// Escape key, backdrop click, in-drawer link click, route change.

"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Index", desc: "Composite weighted grade" },
  { href: "/discipline/", label: "Citation Discipline", desc: "Source-level citation rigor" },
  { href: "/modern-reference/", label: "Modern Reference", desc: "Fitness as a 2026+ AI-era citation" },
  { href: "/velocity/", label: "Citation Velocity", desc: "Tier-1 cite rate per week" },
  { href: "/sources/", label: "All sources", desc: "Every hand-scored source" },
  { href: "/compare/", label: "Compare", desc: "Side-by-side source comparison" },
  { href: "/search/", label: "Search", desc: "Find any source by URL or domain" },
  { href: "/methodology/", label: "Methodology", desc: "How SourceScore is computed" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center justify-center w-11 h-11 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" aria-hidden="true">
          {open ? (
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-[68px] bg-bg/60 backdrop-blur-sm z-20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="mobile-nav-drawer"
            aria-label="Site navigation"
            className="fixed left-0 right-0 top-[68px] bg-panel border-b border-border z-30 max-h-[calc(100vh-68px)] overflow-y-auto"
          >
            <ul className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
              {NAV_ITEMS.map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col px-3 py-3 rounded-btn hover:bg-surface-hover text-muted hover:text-text transition-colors min-h-[44px] justify-center"
                  >
                    <span className="text-body font-medium text-text">{item.label}</span>
                    <span className="text-caption text-dim">{item.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
