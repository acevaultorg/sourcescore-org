import type { ReactNode } from "react";

export default function UseCasesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <aside className="max-w-4xl mx-auto mt-6 px-4 sm:px-6" aria-label="Catalog matching limitation">
        <div className="rounded-md border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <strong>Implementation guardrail:</strong> <code>bestMatch</code> means
          “candidate catalog record,” not “the submitted sentence is true.”
          Production workflows must compare the statements and cited evidence;
          never auto-publish or approve a high-stakes claim from similarity alone.
        </div>
      </aside>
      {children}
    </>
  );
}
