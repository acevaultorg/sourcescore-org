// Example: keyword search across the catalog.
// Run with: npx tsx examples/03-search.ts

import { SourceScoreClient } from "../src/index.js";

const ss = new SourceScoreClient();

const queries = ["llama", "openai", "transformer", "rlhf"];

for (const q of queries) {
  console.log(`\n→ search "${q}"`);
  const results = await ss.claims.search(q, { limit: 5 });
  console.log(`  ${results.count} match${results.count === 1 ? "" : "es"}`);
  for (const r of results.results) {
    console.log(`  · ${r.statement}`);
    console.log(`    ${r.detailUrl}`);
  }
}
