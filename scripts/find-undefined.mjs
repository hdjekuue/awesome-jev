import fs from 'node:fs';

/** Greps the built pages for the string `undefined` and shows the context. */
const files = ['docs/index.html', 'docs/zh/index.html', 'docs/fr/index.html'];

for (const f of files) {
  const h = fs.readFileSync(f, 'utf8');
  const hits = [];
  let i = -1;
  while ((i = h.indexOf('undefined', i + 1)) !== -1) {
    hits.push(h.slice(Math.max(0, i - 70), i + 40).replace(/\s+/g, ' '));
  }
  console.log(`\n=== ${f}: ${hits.length} occurrence(s)`);
  for (const uniq of [...new Set(hits)].slice(0, 14)) console.log('  ' + JSON.stringify(uniq));
}