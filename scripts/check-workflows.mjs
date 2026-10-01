import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

// Parses every workflow with a real YAML parser when one is available, so the
// exact class of bug that broke triage.yml (a shell string continuation line that
// lost its indentation and took the whole file with it) is caught before a push.
//
//   node scripts/check-workflows.mjs
//
// Resolves `yaml` from the repo, then from the temp dir used during development,
// and skips the deep check if neither is present — the structural checks below
// still run either way.

const dir = path.join(process.cwd(), '.github', 'workflows');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.yml')).sort() : [];

const require = createRequire(import.meta.url);
let YAML = null;
for (const spec of ['yaml', 'js-yaml', 'C:/Users/RUNNER~1/AppData/Local/Temp/2/kilo/yamlchk/node_modules/yaml']) {
  try { YAML = require(spec); break; } catch { /* try the next one */ }
}

let bad = 0;
const problems = [];

for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const issues = [];

  if (!/^name:\s*\S/m.test(text)) issues.push('no top-level name:');
  if (!/^on:/m.test(text)) issues.push('no top-level on:');
  if (!/^permissions:/m.test(text)) issues.push('no permissions: block');
  if (!/^jobs:/m.test(text)) issues.push('no jobs: block');

  if (YAML) {
    try {
      const doc = YAML.parse(text);
      const jobs = Object.keys(doc.jobs || {});
      if (!jobs.length) issues.push('no job ids');
      for (const [id, job] of Object.entries(doc.jobs || {})) {
        if (!job['runs-on']) issues.push(`job ${id}: no runs-on`);
        if (!job.if && !job.needs && Object.keys(doc.jobs).length > 1) {
          issues.push(`job ${id}: has no if/ and no needs — it will run unconditionally alongside its siblings`);
        }
      }
    } catch (e) {
      issues.push(`YAML parse error: ${String(e.message).split('\n')[0]}`);
    }
  } else {
    const jobsBlock = text.split(/^jobs:\s*$/m)[1] || '';
    const ids = [...jobsBlock.matchAll(/^ {2}([a-z0-9-]+):\s*$/gm)].map((m) => m[1]);
    if (!ids.length) issues.push('no job ids');
  }

  // A non-empty line that starts at column 0 but is not a top-level key or a
  // comment is the fingerprint of a shell continuation line escaping its block
  // scalar — that is what silently broke triage.yml.
  text.split('\n').forEach((line, i) => {
    if (!line.trim()) return;
    if (/^\s/.test(line)) return;
    if (line.startsWith('#') || line.startsWith('-')) return;
    if (/^[A-Za-z_"'[\]{}>|*&!#?]/.test(line)) return;
    issues.push(`line ${i + 1}: content at column 0 breaks the block scalar — ${JSON.stringify(line.slice(0, 40))}`);
  });

  if (issues.length) { bad++; problems.push(`${f}:\n  - ${issues.join('\n  - ')}`); }
}

console.log(`checked ${files.length} workflow file(s) · parser: ${YAML ? 'full YAML' : 'structural only (install `yaml` for the deep check)'}`);
if (bad) {
  console.error(`\n${bad} workflow(s) with problems:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('all workflows OK');