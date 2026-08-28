#!/usr/bin/env node
/**
 * predeploy-git-guard — refuse to deploy from a checkout that is BEHIND origin.
 *
 * WHY THIS EXISTS (2026-08-28): `wrangler pages deploy <dir>` REPLACES the whole
 * production directory. Rebuilding an out-of-date checkout therefore does not
 * "skip" the commits you lack — it actively REVERTS them on the live site.
 * Two sites were silently rolled back this way in one session: askedwell (6
 * commits, incl. the affiliate gate) and cabinpets (18 commits, incl. the gate
 * and a correctness fix on 13 airline pages). Both looked like successful deploys.
 *
 * The sibling predeploy-guard checks that out/ has the right FILES and is fresh
 * by mtime. Neither signal can detect this: a stale checkout rebuilds cleanly
 * into a complete, freshly-stamped out/ that happens to be an older site.
 *
 * Override for a genuine offline/detached deploy: SKIP_GIT_GUARD=1
 */
import { execSync } from 'node:child_process';

if (process.env.SKIP_GIT_GUARD === '1') {
  console.log('⚠️  predeploy-git-guard: SKIPPED via SKIP_GIT_GUARD=1');
  process.exit(0);
}

const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
const die = (...lines) => { for (const l of lines) console.error(l); process.exit(1); };

try { sh('git rev-parse --is-inside-work-tree'); }
catch { console.log('✓ predeploy-git-guard: not a git repo — skipping'); process.exit(0); }

// The ref that matters is the one you would DEPLOY from: this branch's own upstream.
// Being behind it means a rebuild silently reverts live commits — that is a hard block.
// origin/main is checked too, but only as a WARNING: a repo can legitimately deploy from
// a non-main branch (readinglist.school ships from cf-pages-migration, verified live via
// its /book-club nav fingerprint, while origin/main holds a stale superseded line).
// Hard-blocking on a branch you do not deploy from trains people to set SKIP_GIT_GUARD=1,
// which is worse than no guard. If there is NO upstream, origin/main becomes the hard ref.
let upstream = null;
try { upstream = sh('git rev-parse --abbrev-ref --symbolic-full-name @{u}'); } catch {}
let fallback = null;
for (const r of ['origin/main', 'origin/master']) {
  try { sh(`git rev-parse --verify ${r}`); fallback = r; break; } catch {}
}
const hardRef = upstream || fallback;
if (!hardRef) {
  console.log('✓ predeploy-git-guard: no remote ref to compare — skipping');
  process.exit(0);
}

// Freshness of the comparison is the whole point; an unfetched ref proves nothing.
try { execSync('git fetch --quiet', { stdio: 'ignore', timeout: 30_000 }); }
catch {
  die('❌ predeploy-git-guard: `git fetch` failed — cannot prove this checkout is current.',
      '   A deploy REPLACES production, so an unverifiable checkout is not safe to ship.',
      '   Fix the network, or re-run with SKIP_GIT_GUARD=1 if you are certain.');
}

const behind = Number(sh(`git rev-list --count HEAD..${hardRef}`));
if (behind > 0) {
  const lost = sh(`git log --oneline --no-decorate HEAD..${hardRef} | head -20`);
  die(`❌ predeploy-git-guard: DEPLOY BLOCKED — ${behind} commit(s) behind ${hardRef}.`,
      '',
      '   A Pages deploy REPLACES the live directory. Shipping this build would',
      `   REVERT these ${behind} commit(s) on the live site:`,
      '',
      lost.split('\n').map((l) => '     ' + l).join('\n'),
      '',
      `   Fix:  git pull --rebase   →   rebuild   →   redeploy`);
}

// Advisory only — never blocks.
if (fallback && fallback !== hardRef) {
  const b2 = Number(sh(`git rev-list --count HEAD..${fallback}`));
  if (b2 > 0) console.warn(`⚠️  predeploy-git-guard: also ${b2} behind ${fallback} (not this branch's deploy ref — not blocking)`);
}

const ahead = Number(sh(`git rev-list --count ${upstream}..HEAD`));
console.log(`✓ predeploy-git-guard: current with ${upstream} (ahead ${ahead}, behind 0)`);
