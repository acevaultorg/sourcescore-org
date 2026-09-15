// Cloudflare Pages Functions middleware — www -> apex 301, path/query preserved.
// sourcescore.org and www.sourcescore.org are both custom domains on this one
// Pages project (confirmed via GET /pages/projects/sourcescore) and were serving
// byte-identical content — a real duplicate-indexable-host defect (fleet-wide
// pattern, TaskPeace mty50ylo846qrh). Scoped to this one apex host only; does
// not touch API routes under functions/api/**, which still run normally.
const APEX = "sourcescore.org";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === `www.${APEX}`) {
    url.hostname = APEX;
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
