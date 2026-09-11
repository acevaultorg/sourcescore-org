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

// ── rg-freeze-guard hook v1 (2026-09-11, operator-approved) ─────────────────────────────────────────────────
// Refuse to deploy over an RG-frozen experiment or a local deploy hold. On 2026-09-11 lanes deployed
// over frozen RG experiments twice (espressospecdb 55882be/f5b9c26 changed the frozen
// /compare/ascaso-steel-duo-pid-vs-profitec-go/ page through a site-wide nav edit) because nothing
// read RG_CONTROL_REGISTER.json at deploy time. Runs BEFORE the SKIP_GIT_GUARD exit on purpose —
// that flag is for offline git, not for freezes. Overrides are the guard's own:
// RG_FREEZE_ACK / RG_FREEZE_OVERRIDE / DEPLOY_HOLD_OVERRIDE. SITE resolved from site constant
// (never from the directory name). If this runs before the build, the page compare sees the
// PREVIOUS build; the upload-time call (chunked deployer / deploy.sh) sees the fresh one.
{
  const { spawnSync: rgSpawn } = await import('node:child_process');
  const { existsSync: rgExists } = await import('node:fs');
  const rgPath = await import('node:path');
  const { fileURLToPath: rgUrl } = await import('node:url');
  const rgRoot = rgPath.resolve(rgPath.dirname(rgUrl(import.meta.url)), '..');
  const rgHome = process.env.HOME || '';
  const rgGuard = [`${rgHome}/.claude/bin/rg-freeze-guard.mjs`, `${rgHome}/Local/VAULT-Fleet/scripts/rg-freeze-guard.mjs`].find((p) => rgExists(p));
  if (!rgGuard) {
    console.warn('⚠️  rg-freeze-guard not found (~/.claude/bin or ~/Local/VAULT-Fleet/scripts) — RG freeze check SKIPPED on this Mac');
  } else {
    const r = rgSpawn(process.execPath, [rgGuard, '--site', 'sourcescore.org', '--out', rgPath.join(rgRoot, 'out')], { stdio: 'inherit' });
    if (r.status !== 0) {
      console.error('❌ predeploy-git-guard: DEPLOY BLOCKED by rg-freeze-guard (see above)');
      process.exit(r.status || 1);
    }
  }
}
// ── end rg-freeze-guard hook v1 ───────────────────────────────────────────────────────────────────────────────

if (process.env.SKIP_GIT_GUARD === '1') {
  console.log('⚠️  predeploy-git-guard: SKIPPED via SKIP_GIT_GUARD=1');
  process.exit(0);
}

const sh = (c) => execSync(c, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
const die = (...lines) => { for (const l of lines) console.error(l); process.exit(1); };

try { sh('git rev-parse --is-inside-work-tree'); }
catch { console.log('✓ predeploy-git-guard: not a git repo — skipping'); process.exit(0); }

// WRONG-BRANCH ADDENDUM (2026-09-02, fleet task mtk9rrqrubziml, pattern from readinglist 0946f10):
// the freshness check below only compares HEAD to THIS branch's own upstream, so a deploy run from
// any other branch sails through clean and REPLACES production with that branch's content
// (readinglist shipped from 3 branches in 8h and each deploy silently deleted the others' work).
// The ONE branch sourcescore.org ships from. Resolved 2026-09-02 from evidence: CF Pages project sourcescore production_branch=main; last 4 production deploys (08-28/29) branch=main via the chunked deployer (records no commit hash); package.json deploy → scripts/deploy-cf.mjs declares --branch main.
// Change it only alongside actually re-declaring the deploy branch.
const DEPLOY_BRANCH = 'main';
const currentBranch = (() => { try { return sh('git branch --show-current'); } catch { return ''; } })();
if (!currentBranch) {
  die('❌ predeploy-git-guard: DEPLOY BLOCKED — detached HEAD (no branch name).',
      `   sourcescore.org ships from exactly one branch: ${DEPLOY_BRANCH}.`,
      '   Fix:  git checkout ' + DEPLOY_BRANCH);
}
if (currentBranch !== DEPLOY_BRANCH) {
  die(`❌ predeploy-git-guard: DEPLOY BLOCKED — on branch "${currentBranch}", not "${DEPLOY_BRANCH}".`,
      '',
      `   sourcescore.org ships from exactly ONE branch: ${DEPLOY_BRANCH}. A deploy from any other branch`,
      `   REPLACES the live site with "${currentBranch}"'s content and silently reverts whatever`,
      `   ${DEPLOY_BRANCH} shipped that this branch lacks (this exact failure took out a live feature`,
      '   ship on readinglist.school on 2026-09-02).',
      '',
      `   Fix:  git checkout ${DEPLOY_BRANCH}   (merge/cherry-pick your work there first)`);
}

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
