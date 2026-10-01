import fs from 'node:fs';
import path from 'node:path';

// Structural sanity check for the workflow files without pulling in a YAML dep:
// every .yml under .github/workflows must be non-empty, name `on:`, and declare a
// `jobs:` block with at least one job. A syntax error shows up as a surprise at
// push time otherwise, and the whole automation stack is the point of this repo.
const dir = path.join(process.cwd(), '.github', 'workflows');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.yml')) : [];
let bad = 0;
for (const f of files) {
  const t = fs.readFileSync(path.join(dir, f), 'utf8');
  const problems = [];
  if (!/^name:\s*\S/m.test(t)) problems.push('no top-level name:');
  if (!/^on:/m.test(t)) problems.push('no top-level on:');
  if (!/^permissions:/m.test(t)) problems.push('no permissions: block');
  if (!/^jobs:/m.test(t)) problems.push('no jobs: block');
  const jobsBlock = t.split(/^jobs:\s*$/m)[1] || '';
  const jobIds = [...jobsBlock.matchAll(/^ {2}([a-z0-9-]+):\s*$/gm)].map((m) => m[1]);
  if (!jobIds.length) problems.push('no job ids found');
  if (/\$\{\{\s*secrets\.[A-Z_]+\s*\}\}/.test(t) && !/secrets\.[A-Z_]+\s*\|\|/.test(t)) {
    // Not fatal, but worth surfacing: an unset optional secret is a silent empty string.
    console.warn(`  note: ${f} references secrets without an || fallback`);
  }
  if (problems.length) { bad++; console.error(`${f}: ${problems.join('; ')}`); }
  else console.log(`${f}: OK (${jobIds.length} job(s): ${jobIds.join(', ')})`);
}
console.log(`\n${files.length} workflow files, ${bad} with problems`);
if (bad) process.exit(1);