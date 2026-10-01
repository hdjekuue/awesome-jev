#!/usr/bin/env bash
# Reproduces, locally, the exact row-parity check the Site workflow runs. It
# exists because that check failed on the first push with "Only 1 rows rendered":
# Astro's compressHTML strips attribute quotes, so `grep -c 'class="entry'` counted
# zero real matches and `|| true` turned that into a silent pass of the count and a
# hard failure on the threshold. Running the real command locally is how you find
# that before CI does.
#
#   node scripts/check-parity.mjs

set -uo pipefail
cd "$(dirname "$0")/.."

count_rows() {
  grep -oE 'class="?entry[ "]' "$1" | wc -l | tr -d ' '
}

fail=0
for f in docs/index.html docs/zh/index.html docs/fr/index.html; do
  if [ ! -s "$f" ]; then
    echo "missing $f — run npm run build"
    exit 1
  fi
done

EN=$(count_rows docs/index.html)
ZH=$(count_rows docs/zh/index.html)
FR=$(count_rows docs/fr/index.html)
echo "entry rows: en=$EN zh=$ZH fr=$FR"

if [ "$EN" != "$ZH" ] || [ "$EN" != "$FR" ]; then
  echo "FAIL — row counts differ across languages"
  fail=1
fi
if [ "$EN" -le 300 ]; then
  echo "FAIL — only $EN rows rendered; the data file did not load"
  fail=1
fi

for f in llms.txt llms-full.txt skill.md projects.json sitemap.xml robots.txt assets/og.svg c/context.md; do
  [ -s "docs/$f" ] || { echo "FAIL — missing docs/$f"; fail=1; }
done

node -e "
const fs = require('fs');
for (const f of ['docs/index.html','docs/zh/index.html','docs/fr/index.html']) {
  const h = fs.readFileSync(f, 'utf8');
  const m = h.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (!m) throw new Error(f + ': no JSON-LD');
  const types = JSON.parse(m[1])['@graph'].map(n => n['@type']);
  for (const want of ['WebSite','CollectionPage','ItemList','FAQPage','DefinedTermSet','BreadcrumbList']) {
    if (!types.includes(want)) throw new Error(f + ': lost ' + want);
  }
  for (const hl of ['zh_CN','fr_FR','x-default']) {
    if (!h.includes('hreflang=\"' + hl + '\"')) throw new Error(f + ': missing hreflang ' + hl);
  }
}
console.log('JSON-LD graph and hreflang sets intact on all three pages');
" || fail=1

[ "$fail" -eq 0 ] && echo "PASS"
exit "$fail"