/**
 * html.mjs — a small, honest HTML reader for the check scripts.
 *
 * Deliberately not a parser: it extracts attributes, ids, links and heading
 * order with regexes that respect quoting, because a full parser is a dependency
 * this repo does not want. The one thing it does that a naive regex does not is
 * match attribute *names* exactly — an earlier version matched `href=` inside
 * `hreflang=` and reported nonsense, so `attrs()` tokenises names before values.
 */

const ATTR = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>`]+)))?/g;

/** Parses a single tag's attribute string into a plain object. */
export function attrs(source) {
  const out = {};
  ATTR.lastIndex = 0;
  let m;
  while ((m = ATTR.exec(source))) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    // First occurrence wins, which is what browsers do for duplicates.
    if (!(name in out)) out[name] = value;
  }
  return out;
}

/** All elements with the given tag name, as { attrs, inner, start }. */
export function elements(html, tag) {
  const re = new RegExp(`<${tag}\\b([^>]*)>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push({ attrs: attrs(m[1]), raw: m[0], index: m.index, source: m[1] });
  return out;
}

/** All anchors with their hrefs, text and attribute bag. */
export function anchors(html) {
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    const a = attrs(m[1]);
    out.push({
      ...a,
      href: a.href ?? null,
      text: stripTags(m[2]).replace(/\s+/g, ' ').trim(),
    });
  }
  return out;
}

/** All media/asset references: src, href on link elements. */
export function assetRefs(html) {
  const out = [];
  for (const l of elements(html, 'link')) {
    const rel = (l.attrs.rel || '').toLowerCase();
    if (!l.attrs.href) continue;
    out.push({ kind: 'link', rel, href: l.attrs.href, ...l.attrs });
  }
  for (const s of elements(html, 'script')) {
    if (s.attrs.src) out.push({ kind: 'script', rel: 'script', href: s.attrs.src, ...s.attrs });
  }
  for (const i of elements(html, 'img')) {
    if (i.attrs.src) out.push({ kind: 'img', rel: 'img', href: i.attrs.src, ...i.attrs });
  }
  return out;
}

export function stripTags(s) {
  return String(s)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '');
}

/** Headings in document order, with their level and text. */
export function headings(html) {
  const out = [];
  const re = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    out.push({ level: Number(m[1]), text: stripTags(m[3]).replace(/\s+/g, ' ').trim(), attrs: attrs(m[2]) });
  }
  return out;
}

/** Every id present in the document. */
export function ids(html) {
  const set = new Map();
  for (const e of [...elements(html, 'div'), ...elements(html, 'section'), ...elements(html, 'a'),
    ...elements(html, 'p'), ...elements(html, 'span'), ...elements(html, 'summary'), ...elements(html, 'input')]) {
    if (e.attrs.id) set.set(e.attrs.id, (set.get(e.attrs.id) || 0) + 1);
  }
  for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'nav', 'header', 'footer', 'details', 'label', 'button', 'form', 'ul', 'li', 'pre', 'code']) {
    for (const e of elements(html, tag)) {
      if (e.attrs.id) set.set(e.attrs.id, (set.get(e.attrs.id) || 0) + 1);
    }
  }
  return set;
}

/** Splits a class attribute into a set. */
export function classes(attrValue) {
  return new Set((attrValue || '').split(/\s+/).filter(Boolean));
}

/**
 * Resolves a document-relative href the way a browser would, against the base
 * path the page is served from. Returns the pathname, so a check can compare it
 * against the files that actually exist on disk.
 */
export function resolvePath(href, basePath) {
  if (!href) return null;
  if (/^(https?:)?\/\//i.test(href) || /^(mailto|tel|data|javascript):/i.test(href)) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '') return basePath;
  const baseDir = basePath.endsWith('/') ? basePath : `${basePath.slice(0, basePath.lastIndexOf('/') + 1)}`;
  const combined = clean.startsWith('/') ? clean : `${baseDir}${clean}`;
  const parts = [];
  for (const seg of combined.split('/')) {
    if (seg === '.' || seg === '') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return `/${parts.join('/')}${combined.endsWith('/') ? '/' : ''}`;
}

/** Fragment from a same-document href, or null. */
export function fragment(href) {
  const i = String(href || '').indexOf('#');
  return i === -1 ? null : String(href).slice(i + 1) || null;
}