#!/usr/bin/env bash
# commit-lastmod.sh — the page-date manifest goes into git with EVERY deploy (2026-10-17, fleet lastmod fix).
# Run right before the upload. A deploy that leaves data/page-lastmod.json uncommitted makes the next build
# from any clean clone (the daily image job, kit-rollout) date every page changed since the last commit.
#   LASTMOD_AMEND=1 + HEAD unpushed (the daily image job): amend into that commit; the caller pushes.
#   HEAD on origin/main: commit + push; refuse the upload (exit 8) if that fails.
#   HEAD unpushed (your own commits): commit locally on top and warn; push it with your commits.
set -euo pipefail
F=data/page-lastmod.json
git diff --quiet -- "$F" && [ -z "$(git ls-files --others --exclude-standard -- "$F")" ] && { echo "lastmod: manifest unchanged, nothing to commit"; exit 0; }
git fetch -q origin main || true
BASE=$(git rev-parse --short HEAD)
git add -- "$F"
if [ "${LASTMOD_AMEND:-0}" = "1" ] && ! git merge-base --is-ancestor "$BASE" origin/main; then
  git commit -q --amend --no-edit -- "$F" || { echo "lastmod: REFUSED — could not amend $F into $BASE" >&2; exit 8; }
  echo "lastmod: manifest amended into $(git rev-parse --short HEAD) (caller pushes)"
  exit 0
fi
git commit -q -m "build(lastmod): manifest for deploy of $BASE" -- "$F" || { echo "lastmod: REFUSED — could not commit $F" >&2; exit 8; }
if git merge-base --is-ancestor "$BASE" origin/main; then
  git push -q origin HEAD:main || { echo "lastmod: REFUSED — could not push the manifest commit; live dates would not be in git" >&2; exit 8; }
  echo "lastmod: manifest committed + pushed ($(git rev-parse --short HEAD))"
else
  echo "lastmod: WARNING — manifest committed LOCALLY on top of unpushed $BASE; push it with your commits" >&2
fi
