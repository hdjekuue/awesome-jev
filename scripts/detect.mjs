import { spawnSync } from 'node:child_process';

// Wraps the Impeccable detector and summarises its JSON by antipattern. The
// detector's own output is verbose enough that reading it line by line hides the
// count that matters, and running it by hand is how findings get missed.
//
//   node scripts/detect.mjs [url-or-file ...]

const BASH = 'C:/Program Files/Git/bin/bash.exe';
const LAUNCHER = '.agents/skills/impeccable/scripts/impeccable';

const targets = process.argv.slice(2);
const urls = targets.length
  ? targets
  : ['http://localhost:4321/awesome-jev/', 'http://localhost:4321/awesome-jev/zh/', 'http://localhost:4321/awesome-jev/fr/'];

const r = spawnSync(BASH, ['-lc', `cd '/c/Users/runneradmin/Desktop/awesome-jev' && ${LAUNCHER} detect --json ${urls.map((u) => `'${u}'`).join(' ')}`], {
  encoding: 'utf8',
});

const out = (r.stdout || '').trim();
const start = out.indexOf('[');
if (start === -1) {
  console.error(out || '(no detector output)');
  process.exit(1);
}

let findings;
try {
  findings = JSON.parse(out.slice(start));
} catch (e) {
  console.error('could not parse detector output:', e.message);
  process.exit(1);
}

const byType = {};
const samples = {};
for (const f of findings) {
  byType[f.antipattern] = (byType[f.antipattern] || 0) + 1;
  samples[f.antipattern] ||= f.snippet || '';
}

console.log(`detector: ${findings.length} finding(s) across ${urls.length} target(s)\n`);
if (!findings.length) {
  console.log('clean');
  process.exit(0);
}
for (const [k, n] of Object.entries(byType)) {
  console.log(`  ${n}× ${k}`);
  console.log(`      ${String(samples[k]).slice(0, 120)}`);
}

// Errors block a merge; warnings do not, but they are reported either way so a
// drop in count is visible over time.
const errors = findings.filter((f) => f.severity === 'error');
console.log(`\n${errors.length} error(s), ${findings.length - errors.length} warning(s)`);
process.exit(errors.length ? 1 : 0);