#!/usr/bin/env node
/**
 * refresh-stars.mjs — bulk-refresh stars, forks, license, archive state and push
 * dates for every repo in data/entries.json, then re-render README and site.
 *
 * Deterministic by design: no model is involved. If GitHub is unreachable or the
 * token is missing it still refreshes what it can and exits 0, because a partial
 * refresh is more useful than a failed one. Pass --fail-on-error in CI to make a
 * hard failure sticky.
 *
 *   node scripts/refresh-stars.mjs
 *   node scripts/refresh-stars.mjs --limit 20      # sample run, cheap on rate limit
 *   node scripts/refresh-stars.mjs --no-render     # data only
 *   node scripts/refresh-stars.mjs --fail-on-error
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadEntries, DATA_FILE, totals } from './lib/catalog.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };

const LIMIT = val('--limit', '') ? parseInt(val('--limit', '0'), 10) : Infinity;
const RENDER = !flag('--no-render');
const STRICT = flag('--fail-on-error');

const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

/** `gh api` is preferred: it reuses the CLI's auth and handles retries. */
function ghApi(repo) {
  const r = spawnSync('gh', ['api', `repos/${repo}`, '--jq',
    '{stars: .stargazers_count, forks: .forks_count, license: (.license.spdx_id // null), archived: .archived, pushed_at: .pushed_at, language: .language, topics: .topics, description: .description}'],
    { encoding: 'utf8', shell: process.platform === 'win32', env: process.env });
  if (r.status !== 0) return { error: (r.stderr || r.stdout || 'gh api failed').trim().split('\n')[0] };
  try { return JSON.parse(r.stdout); } catch (e) { return { error: `parse: ${e.message}` }; }
}

async function fallbackApi(repo) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'awesome-jev-refresh',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const j = await res.json();
    return {
      stars: j.stargazers_count, forks: j.forks_count, license: j.license?.spdx_id ?? null,
      archived: !!j.archived, pushed_at: j.pushed_at, language: j.language, topics: j.topics || [],
      description: j.description,
    };
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  const db = loadEntries();
  const repos = db.entries.filter((e) => e.kind === 'repo' && /github\.com/.test(e.url)).slice(0, LIMIT);

  console.log(`[refresh] ${repos.length} repos to check · token: ${TOKEN ? 'yes' : 'no (60 req/h anonymous limit)'}`);

  let changed = 0;
  let failed = 0;
  let removed = 0;
  let starsBefore = 0;
  let starsAfter = 0;

  for (const [i, e] of repos.entries()) {
    starsBefore += e.stars || 0;
    const repo = `${e.owner}/${e.repo}`;
    let info = spawnSync('gh', ['--version'], { shell: process.platform === 'win32' }).status === 0 ? ghApi(repo) : { error: 'gh not found' };
    if (info.error) info = await fallbackApi(repo);

    if (info.error) {
      failed++;
      // A 404 means the repo is gone or renamed. Flag it rather than silently
      // keeping a dead row — the curator decides whether to drop or fix it.
      const gone = /404|not found/i.test(info.error);
      e.stale = true;
      e.staleReason = gone ? 'repo-not-found' : info.error.slice(0, 120);
      if (gone) removed++;
      console.warn(`[refresh] ${repo}: ${info.error}`);
      continue;
    }

    delete e.stale;
    delete e.staleReason;

    const before = { stars: e.stars, license: e.license, archived: e.archived, pushedAt: e.pushedAt, language: e.language };
    e.stars = info.stars;
    e.forks = info.forks;
    e.license = info.license ?? null;
    e.archived = !!info.archived;
    e.pushedAt = info.pushed_at ? info.pushed_at.slice(0, 10) : e.pushedAt;
    if (info.language) e.language = info.language;
    if (Array.isArray(info.topics)) e.topics = info.topics.slice(0, 6);

    starsAfter += e.stars || 0;
    const drift = before.stars !== null && info.stars !== before.stars ? info.stars - before.stars : 0;
    if (drift !== 0 || before.license !== e.license || before.archived !== e.archived) changed++;
    if ((i + 1) % 25 === 0) console.log(`[refresh] ${i + 1}/${repos.length} · changed ${changed} · failed ${failed}`);

    await new Promise((r) => setTimeout(r, 120));
  }

  db.updatedAt = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2) + '\n', 'utf8');

  const t = totals(db.entries, db.updatedAt);
  const bigMovers = db.entries
    .filter((e) => e.kind === 'repo' && e.stars)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5);

  console.log(JSON.stringify({
    checked: repos.length,
    changed,
    failed,
    notFound: removed,
    stars: { before: starsBefore, after: starsAfter, delta: starsAfter - starsBefore },
    totals: t,
    top: bigMovers.map((e) => `${e.name} ★${e.stars}`),
  }, null, 2));

  if (STRICT && failed) {
    console.error(`[refresh] ${failed} lookups failed and --fail-on-error is set`);
    process.exit(1);
  }

  if (RENDER) {
    for (const [cmd, args2] of [
      ['node', ['scripts/verify.mjs']],
      ['node', ['scripts/build-readme.mjs']],
      ['node', ['site/build.mjs']],
    ]) {
      const r = spawnSync(cmd, args2, { stdio: 'inherit', shell: process.platform === 'win32' });
      if (r.status !== 0) {
        console.warn(`[refresh] post-step failed: ${cmd} ${args2.join(' ')}`);
        break;
      }
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });