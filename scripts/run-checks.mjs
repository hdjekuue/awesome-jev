#!/usr/bin/env node
/**
 * run-checks.mjs — one command that runs every deterministic check and reports a
 * single verdict. CI runs the static half; this runs all of it, including the
 * browser half, and is what you should run before pushing a change that touches
 * anything a person clicks.
 *
 *   node scripts/run-checks.mjs            # static only, no browser needed
 *   node scripts/run-checks.mjs --browser  # + the puppeteer checks
 *   node scripts/run-checks.mjs --serve    # + starts astro dev first
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const flags = new Set(process.argv.slice(2));
const wantBrowser = flags.has('--browser') || flags.has('--serve');

// Git Bash has a space in its path, so it can only be invoked through a shell.
const BASH = '"C:\\Program Files\\Git\\bin\\bash.exe"';

const STATIC = [
  { name: 'data audit', cmd: 'node', args: ['scripts/verify.mjs'] },
  { name: 'readme render', cmd: 'node', args: ['scripts/build-readme.mjs', '--check'] },
  { name: 'css parses', cmd: 'node', args: ['scripts/check-css.mjs'] },
  { name: 'contrast', cmd: 'node', args: ['scripts/check-contrast.mjs', '4.5'] },
  { name: 'workflow yaml', cmd: 'node', args: ['scripts/check-workflows.mjs'] },
  { name: 'build parity + json-ld', cmd: BASH, args: [`-lc`, `bash scripts/check-parity.sh`], shell: true },
  { name: 'links, anchors, assets', cmd: 'node', args: ['scripts/check-links.mjs'] },
  { name: 'translations gate', cmd: 'node', args: ['scripts/check-translations.mjs'] },
  { name: 'shipped payload', cmd: 'node', args: ['scripts/check-payload.mjs'] },
];

const BROWSER = [
  { name: 'page behaviour + a11y + responsive', cmd: 'node', args: ['scripts/check-page.mjs'] },
];

const run = (step) => {
  const r = spawnSync(step.cmd, step.args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
    shell: step.shell === true,
  });
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  const ok = r.status === 0;
  const skipped = /^SKIPPED/.test(out);
  const mark = ok ? (skipped ? 'SKIP' : '  PASS') : '  FAIL';
  console.log(`${mark}  ${step.name}`);
  if (!ok && out) {
    for (const line of out.split('\n').slice(-14)) console.log(`        ${line}`);
  }
  if (skipped && ok) for (const line of out.split('\n').slice(1, 3)) console.log(`        ${line}`);
  return ok;
};

let dev = null;
if (flags.has('--serve')) {
  console.log('starting astro dev on :4321…');
  dev = spawn('npx', ['astro', 'dev', '--port', '4321'], { cwd: ROOT, stdio: 'ignore', shell: true, detached: false });
  await new Promise((r) => setTimeout(r, 9000));
}

console.log('\n— static —');
const results = STATIC.map((s) => ({ ...s, ok: run(s) }));

if (wantBrowser) {
  console.log('\n— browser —');
  for (const s of BROWSER) results.push({ ...s, ok: run(s) });
} else {
  console.log('\n— browser — skipped (pass --browser to include it) —');
}

if (dev) {
  try { process.kill(-dev.pid); } catch { dev.kill(); }
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.error(`failed: ${failed.map((f) => f.name).join(', ')}`);
  process.exit(1);
}
console.log('all checks passed');