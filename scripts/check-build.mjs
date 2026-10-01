import fs from 'node:fs';

const ldRe = new RegExp('<script type="application/ld\\+json">([\\s\\S]*?)</script>');
for (const f of ['docs/index.html', 'docs/zh/index.html', 'docs/fr/index.html']) {
  const h = fs.readFileSync(f, 'utf8');
  const m = h.match(ldRe);
  if (!m) { console.log(f, 'NO JSON-LD'); continue; }
  try {
    const j = JSON.parse(m[1]);
    console.log(f, 'OK  graph:', j['@graph'].map((n) => n['@type']).join(', '));
  } catch (e) {
    console.log(f, 'JSON-LD PARSE FAIL:', e.message);
  }
}

for (const f of ['projects.json', 'docs/projects.json']) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  console.log(f, 'OK entries:', j.entries.length, 'categories:', Object.keys(j.meta.categories).length);
}

const llms = fs.readFileSync('llms.txt', 'utf8');
console.log('llms.txt sections:', (llms.match(/^- \[/gm) || []).length);
const full = fs.readFileSync('llms-full.txt', 'utf8');
console.log('llms-full.txt entries:', (full.match(/^### /gm) || []).length);

for (const f of ['README.md', 'README.zh.md', 'README.fr.md']) {
  const t = fs.readFileSync(f, 'utf8');
  console.log(f, 'rows:', (t.match(/^\| \[/gm) || []).length, 'nav links:', (t.match(/^- \[/gm) || []).length);
}