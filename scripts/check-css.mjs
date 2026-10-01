import fs from 'node:fs';
import { createRequire } from 'node:module';

// Pinpoints which stylesheet lightningcss rejects. The Astro build reported
// "Invalid qualified rule" at an undefined location, which is useless; this
// compiles each source separately and names the file that fails.

const require = createRequire(import.meta.url);
const { transform } = require('lightningcss');

const files = [
  'src/styles/decision-table.css',
  'src/components/DecisionTable.astro',
  'src/components/Directory.astro',
  'src/components/PageBody.astro',
  'src/layouts/Base.astro',
  'src/pages/index.astro',
];

/** Pull every <style> block out of an Astro file. */
function stylesFrom(src) {
  const out = [];
  const re = /<style>([\s\S]*?)<\/style>/g;
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}

let failed = 0;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const blocks = file.endsWith('.css') ? [src] : stylesFrom(src);
  if (!blocks.length) {
    console.log(`${file}: no style blocks`);
    continue;
  }
  blocks.forEach((css, i) => {
    const label = blocks.length > 1 ? `${file} <style> #${i + 1}` : file;
    try {
      transform({
        filename: file.endsWith('.css') ? file : `${file}.css`,
        code: Buffer.from(css),
        minify: true,
      });
      console.log(`${label}: OK (${css.length} bytes)`);
    } catch (e) {
      failed++;
      console.error(`${label}: FAIL`);
      console.error(`  ${String(e.message).split('\n').slice(0, 12).join('\n  ')}`);
      if (e.loc) console.error(`  at line ${e.loc.line}`);
    }
  });
}

console.log(`\n${files.length} file(s), ${failed} failing style block(s)`);
if (failed) process.exit(1);