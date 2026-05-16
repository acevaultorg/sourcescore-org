# Launch content drafts

Brain-authored content for operator publishing. Each file is ready to copy-paste with minimal edits. Drafts respect I-34 (no auto-posting under operator identity); brain writes, operator publishes.

| File | Channel | When to publish | Operator time |
|---|---|---|---|
| `dev-to-launch-post.md` | Dev.to + Hashnode canonical cross-post | Day 30+ (post-launch polish) | ~15 min (paste + edit author bio + tag) |
| `hn-show-hn.md` | Hacker News — Show HN | Day 30+ Tue/Wed 9-11am UTC | ~30 min (post + monitor first 3h) |
| `reddit-comment-templates.md` | r/LocalLLaMA, r/MachineLearning, r/LangChain | Day 7+, ongoing | ~5 min per comment |
| `linkedin-framework-post.md` | LinkedIn (operator profile) | Day 14+, weekly cadence | ~5 min per post |

All drafts cite specific SourceScore claim ids that exist in the live catalog. Verify before posting: `curl -s https://sourcescore.org/api/v1/claims.json | python3 -c "import json,sys; print([c['id'] for c in json.load(sys.stdin)['claims']])"` — referenced ids should match.
