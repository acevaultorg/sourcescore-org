import type { ReactNode } from "react";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <aside className="max-w-4xl mx-auto mt-6 px-4 sm:px-6" aria-label="Catalog matching limitation">
        <div className="rounded-md border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <strong>Important:</strong> <code>/api/v1/verify</code> retrieves a
          candidate catalog record by semantic or keyword similarity. A{" "}
          <code>bestMatch</code> is not entailment or a truth verdict. Compare
          the statements and cited evidence before labeling an assertion verified.
        </div>
      </aside>
      {children}
    </>
  );
}
