// Example: verify a natural-language claim against the catalog.
// Run with: npx tsx examples/02-verify-claim.ts

import { SourceScoreClient } from "../src/index.js";

const ss = new SourceScoreClient();

const queries = [
  "Llama 3.1 was released in July 2024",
  "GPT-4 Turbo has a 128K-token context window",
  "Transformer architecture was introduced by Vaswani et al. in 2017",
  "GPT-5 reaches AGI in 2025", // intentionally not in catalog
];

for (const query of queries) {
  console.log(`\n→ "${query}"`);
  const result = await ss.claims.verify(query);

  if (result.bestMatch) {
    console.log(`  ✓ VERIFIED — ${result.bestMatch.statement}`);
    console.log(
      `    confidence ${Math.round(result.bestMatch.confidence * 100)}% · ${result.bestMatch.detailUrl}`,
    );
  } else {
    console.log(`  ✗ NOT VERIFIED — no match cleared the confidence threshold.`);
    if (result.matches.length > 0) {
      console.log(`  Top suggestion: ${result.matches[0]?.claim.statement}`);
      console.log(`    rationale: ${result.matches[0]?.rationale}`);
    }
  }
}
