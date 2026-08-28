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

// Check EVERY ref this checkout could be behind. `@{u}` alone is not enough:
// a repo parked on a stale feature branch reads as "current" against its own
// upstream while origin/main — the branch Pages actually serves — has moved on.
const refs = [];
try { refs.push(sh('git rev-parse --abbrev-ref --symbolic-full-name @{u}')); } catch {}
for (const r of ['origin/main', 'origin/master']) {
  try { sh(`git rev-parse --verify ${r}`); if (!refs.includes(r)) refs.push(r); } catch {}
}
if (refs.length === 0) {
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

for (const ref of refs) {
  const behind = Number(sh(`git rev-list --count HEAD..${ref}`));
  if (behind > 0) {
    const lost = sh(`git log --oneline --no-decorate HEAD..${ref} | head -20`);
    die(`❌ predeploy-git-guard: DEPLOY BLOCKED — ${behind} commit(s) behind ${ref}.`,
        '',
        '   A Pages deploy REPLACES the live directory. Shipping this build would',
        `   REVERT these ${behind} commit(s) on the live site:`,
        '',
        lost.split('\n').map((l) => '     ' + l).join('\n'),
        '',
        `   Fix:  git pull --rebase ${ref.replace('/', ' ')}   →   rebuild   →   redeploy`);
  }
}
const upstream = refs[0];
const ahead = Number(sh(`git rev-list --count ${upstream}..HEAD`));
console.log(`✓ predeploy-git-guard: current with ${upstream} (ahead ${ahead}, behind 0)`);
