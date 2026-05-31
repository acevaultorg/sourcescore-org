// Admin re-embed — re-syncs the CF Vectorize index with the live claim catalog
// using THIS Pages project's AI + VECTORIZE bindings. Solves index-consistency
// after claim additions without a standalone Worker (whose control-plane deploy
// can be incident-blocked). Gated by a key. Idempotent (upsert by id).
//
// Usage: GET /api/admin/reembed?key=<ADMIN_KEY>   (optionally &subjects=a|b to limit)
const ADMIN_KEY = "rk_eeff0f5dd04a282b670a631d6611a6205d8e028d";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== ADMIN_KEY) {
    return json({ ok: false, error: "forbidden" }, 403);
  }
  if (!env.AI || !env.VECTORIZE) {
    return json({ ok: false, error: "AI/VECTORIZE bindings missing on this project" }, 500);
  }
  try {
    const res = await fetch("https://sourcescore.org/api/v1/claims.json", { cf: { cacheTtl: 0 } });
    const data = await res.json();
    let claims = data.claims || (Array.isArray(data) ? data : []);
    if (!claims.length) return json({ ok: false, error: "no claims fetched" }, 500);
    // Optional: only re-embed claims whose subject is in &subjects=a|b|c
    const only = url.searchParams.get("subjects");
    if (only) {
      const set = new Set(only.split("|"));
      claims = claims.filter((c) => set.has(c.subject));
    }
    let upserted = 0;
    const BATCH = 25;
    for (let i = 0; i < claims.length; i += BATCH) {
      const batch = claims.slice(i, i + BATCH);
      const emb = await env.AI.run("@cf/baai/bge-m3", { text: batch.map((c) => c.statement) });
      const vecs = emb.data;
      if (!Array.isArray(vecs) || vecs.length !== batch.length) {
        return json({ ok: false, error: "embed shape mismatch", got: vecs && vecs.length, want: batch.length }, 500);
      }
      await env.VECTORIZE.upsert(
        batch.map((c, j) => ({
          id: c.id,
          values: vecs[j],
          metadata: { statement: String(c.statement).slice(0, 400), confidence: c.confidence ?? 1 },
        }))
      );
      upserted += batch.length;
    }
    return json({ ok: true, upserted, total: claims.length });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
