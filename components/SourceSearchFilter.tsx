"use client";

import { useEffect } from "react";

// Client-side search filter for /search/.
//
// WHY a client component (not the inline <script> it replaces): in the App
// Router, a raw <script dangerouslySetInnerHTML> rendered inside a server
// component runs at initial HTML parse, then React HYDRATION reconciles the
// server-rendered tree and WIPES the script's DOM mutations (input.value,
// row display) + detaches the `input` listener it attached — so the filter
// was silently dead on the live page (typing did nothing; ?q= didn't prefill).
// A useEffect runs AFTER hydration, so its wiring is not wiped. The static
// rows + input are still rendered by the server component (page.tsx) for SEO;
// this component only enhances behavior post-hydration and renders nothing.
//
// Logic is identical to the prior inline script: keyword filter across
// name/domain/category/grade/summary, URL-aware (a pasted URL is normalized
// to its domain), honest "not scored yet" panel for unknown domains, ?q=
// deep-link prefill.

export function SourceSearchFilter({ total }: { total: number }) {
  useEffect(() => {
    const input = document.getElementById("ss-search") as HTMLInputElement | null;
    const rows = Array.from(document.querySelectorAll<HTMLElement>(".ss-row"));
    const count = document.getElementById("ss-count");
    const empty = document.getElementById("ss-empty");
    const emptyUrl = document.getElementById("ss-empty-url");
    const emptyDomain = document.getElementById("ss-empty-domain");
    const citationDesk = document.getElementById("ss-citationdesk") as HTMLAnchorElement | null;
    const sourceRequest = document.getElementById("ss-source-request") as HTMLAnchorElement | null;
    if (!input || !rows.length) return;

    function normDomain(s: string) {
      const i = s.indexOf("://");
      if (i >= 0) s = s.slice(i + 3);
      if (s.lastIndexOf("www.", 0) === 0) s = s.slice(4);
      s = s.split("/")[0].split("?")[0].split("#")[0].split(":")[0];
      return s.toLowerCase();
    }
    function isUrlish(q: string) {
      if (q.indexOf("://") >= 0) return true;
      if (!q || q.charAt(0) === ".") return false;
      const dot = q.indexOf(".");
      if (dot <= 0) return false;
      const after = q.slice(dot + 1);
      return after.length >= 2 && after.indexOf(" ") < 0;
    }

    // Pre-fill from ?q= URL param so deep-links + the SearchAction schema work.
    const params = new URLSearchParams(window.location.search);
    const q0 = params.get("q");
    if (q0) input.value = q0;

    function filter() {
      const raw = (input!.value || "").trim();
      const q = raw.toLowerCase();
      const urlish = isUrlish(q);
      const dom = urlish ? normDomain(q) : "";
      let visible = 0;
      rows.forEach((row) => {
        if (!q) {
          row.style.display = "";
          visible++;
          return;
        }
        let hit: boolean;
        if (urlish) {
          const rd = row.dataset.domain || "";
          hit = rd === dom || rd.indexOf(dom) >= 0 || (!!dom && dom.indexOf(rd) >= 0);
        } else {
          hit =
            (row.dataset.name || "").indexOf(q) >= 0 ||
            (row.dataset.domain || "").indexOf(q) >= 0 ||
            (row.dataset.cat || "").indexOf(q) >= 0 ||
            (row.dataset.grade || "").indexOf(q) >= 0 ||
            (row.dataset.summary || "").indexOf(q) >= 0;
        }
        row.style.display = hit ? "" : "none";
        if (hit) visible++;
      });
      if (count) {
        count.textContent = q ? `${visible} of ${total} sources` : `${total} sources`;
      }
      const noResults = visible === 0 && !!q;
      if (empty) empty.style.display = noResults && !urlish ? "block" : "none";
      if (emptyUrl) emptyUrl.style.display = noResults && urlish ? "block" : "none";
      if (noResults && urlish && emptyDomain) emptyDomain.textContent = dom || raw;
      if (noResults && urlish && citationDesk && dom) {
        const target = new URL("https://citationdesk.com/tools/citation-readiness/");
        target.searchParams.set("utm_source", "sourcescore");
        target.searchParams.set("utm_medium", "referral");
        target.searchParams.set("utm_campaign", "owned-ai-visibility");
        target.searchParams.set("utm_content", "search-unknown");
        target.searchParams.set("url", `https://${dom}`);
        target.searchParams.set("autorun", "1");
        citationDesk.href = target.toString();
        citationDesk.dataset.eventPrefilled = "yes";
      }
      if (noResults && urlish && sourceRequest && dom) {
        const subject = encodeURIComponent("SourceScore index review request");
        const body = encodeURIComponent(
          `Please review this source for inclusion in SourceScore:\n\n${dom}\n\nEvidence or context:`,
        );
        sourceRequest.href = `mailto:hello@caslonmedia.com?subject=${subject}&body=${body}`;
      }
    }

    input.addEventListener("input", filter);
    filter();
    return () => input.removeEventListener("input", filter);
  }, [total]);

  return null;
}
