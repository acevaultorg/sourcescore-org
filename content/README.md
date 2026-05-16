# Launch content drafts

Brain-authored content for operator publishing. Each file is ready to copy-paste with minimal edits. Drafts respect I-34 (no auto-posting under operator identity); brain writes, operator publishes.

**See [INDEX.md](./INDEX.md) for the full publishing sequence, revenue math, and pre-publish checklist.**

| File | Channel | When to publish | Operator time |
|---|---|---|---|
| `dev-to-launch-post.md` | Dev.to + Hashnode (canonical to /blog/launching-veritas/) | Day 1 of publish push | ~15 min |
| `dev-to-grounding-explainer.md` | Dev.to + Hashnode (canonical to /blog/verify-ai-facts-five-lines-python/) | Day 8 of publish push | ~15 min |
| `hn-show-hn.md` | Hacker News — Show HN (one-shot) | Tue/Wed 9-11am UTC | ~30 min + 3h monitor |
| `reddit-comment-templates.md` | r/MachineLearning · r/LocalLLaMA · r/LangChain · r/LlamaIndex | Ongoing, 1-2 substantive comments/week | ~5 min per comment |
| `linkedin-framework-post.md` | LinkedIn (operator profile) | Weekly cadence | ~5 min per post |
| `x-twitter-thread.md` | X / Twitter | Tue/Wed AM for thread; single tweets daily | ~10 min thread; ~2 min single |

All drafts cite specific SourceScore claim counts that exist in the live catalog. Verify before posting: `curl -s https://sourcescore.org/api/v1/claims.json | python3 -c "import json,sys; print(json.load(sys.stdin)['count'])"` should match the count cited in the post.
