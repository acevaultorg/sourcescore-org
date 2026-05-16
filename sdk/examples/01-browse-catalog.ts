// Example: browse the full claim catalog.
// Run with: npx tsx examples/01-browse-catalog.ts

import { SourceScoreClient } from "../src/index.js";

const ss = new SourceScoreClient();

const catalog = await ss.claims.list();

console.log(`SourceScore VERITAS — ${catalog.count} verified claims`);
console.log(`Generated: ${catalog.generated}`);
console.log(`Methodology: ${catalog.methodology}`);
console.log();

// Group by predicate type for quick scan.
const byPredicate = new Map<string, number>();
for (const c of catalog.claims) {
  byPredicate.set(c.predicate, (byPredicate.get(c.predicate) ?? 0) + 1);
}

console.log("By predicate:");
for (const [predicate, count] of [...byPredicate].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${predicate.padEnd(28)} ${count}`);
}

console.log("\nFirst 3 claims:");
for (const c of catalog.claims.slice(0, 3)) {
  console.log(`  [${c.id}] ${c.statement}`);
  console.log(`    confidence ${Math.round(c.confidence * 100)}% · ${c.detailUrl}`);
}
