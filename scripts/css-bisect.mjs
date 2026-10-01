import fs from 'node:fs';
import { createRequire } from 'node:module';

// Bisects a stylesheet by top-level rule so a parse failure names the rule that
// causes it, instead of "Invalid qualified rule at line 1".
//
//   node scripts/css-bisect.mjs <file.css>

const require = createRequire(import.meta.url);
const { transform } = require('lightningcss');

const file = process.argv[2];
const src = fs.readFileSync(file, 'utf8');

/** Split top-level blocks, keeping at-rule preludes (@media) with their body. */
function topLevelBlocks(css) {
  const blocks = [];
  let buf = '';
  let depth = 0;
  let quote = null;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    const prev = i > 0 ? css[i - 1] : '';
    if (quote) {
      buf += ch;
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
      continue;
    }
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    buf += ch;
    if (depth === 0 && ch === '}') {
      blocks.push(buf.trim());
      buf = '';
    }
  }
  if (buf.trim()) blocks.push(buf.trim());
  return blocks;
}

function compiles(css) {
  try {
    transform({ filename: 'probe.css', code: Buffer.from(css), minify: true });
    return true;
  } catch {
    return false;
  }
}

const blocks = topLevelBlocks(src);
console.log(`${file}: ${blocks.length} top-level blocks`);

if (compiles(src)) {
  console.log('the file compiles as a whole — the failure needs a combination of rules, not one bad rule');
  process.exit(0);
}

const bad = [];
for (const [i, b] of blocks.entries()) {
  if (!compiles(b)) bad.push([i, b]);
}

if (!bad.length) {
  console.log('every block compiles alone; the failure is in how they combine (check a missing semicolon between rules)');
  process.exit(1);
}

console.log(`${bad.length} failing block(s):\n`);
for (const [i, b] of bad) {
  const head = b.split('\n').slice(0, 3).join(' ').slice(0, 150);
  console.log(`  [${i}] ${head}`);
  // Narrow further inside the offending block.
  const inner = topLevelBlocks(b.replace(/^\s*@[^{]+\{/, '').replace(/\}$/, ''));
  if (inner.length > 1) {
    for (const rule of inner) {
      if (!compiles(rule)) console.log(`        ↳ ${rule.split('\n').slice(0, 2).join(' ').slice(0, 130)}`);
    }
  }
}
process.exit(1);