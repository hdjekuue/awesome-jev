#!/usr/bin/env node
/**
 * curate.mjs — the free-AI curator.
 *
 * Runs headless on opencode Zen's public `*-free` models (no API key) and does two
 * jobs:
 *
 *   1. Triage     — preprocess a new PR/issue: is it really built on Jev, does it
 *                   duplicate an existing entry, is the description honest, does the
 *                   zh/fr translation exist. Writes curator-report.md + review-comment.md.
 *   2. Health audit — periodic sweep for drift: dead links, stale stars, duplicates,
 *                   missing translations, entries that drifted out of their category.
 *
 * It never pushes to main, never auto-approves a human PR, and never invents a
 * number. If the model is unreachable it degrades to a deterministic report so the
 * workflow still produces something auditable.
 *
 *   node scripts/curate.mjs                       # health audit
 *   GH_PR=12 node scripts/curate.mjs               # triage PR #12
 *   node scripts/curate.mjs --models              # list the free models in play
 *   node scripts/curate.mjs --dry-run             # deterministic report only
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEntries, DATA_FILE, totals, CATEGORY_IDS, fmtStars } from './lib/catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT = path.join(ROOT, 'curator-report.md');
const COMMENT = path.join(ROOT, 'review-comment.md');
const ZEN_MODELS_URL = 'https://opencode.ai/zen/v1/models';

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const LIST = args.includes('--models');

const STATIC_FREE_FALLBACK = [
  'muse-spark-1.3-contributor-free',
  'muse-spark-1.2-contributor-free',
  'deepseek-v4-flash-free',
  'mimo-v2.6-flash-free',
  'mimo-v2.5-free',
  'nemotron-3-ultra-free',
  'jev-1.13-free',
  'space-bunny-free',
  'longcat-2.5-preview-free',
  'ling-3.0-flash-fin-free',
];

/* ------------------------------------------------------------ opencode bin */

let OC_BIN = 'opencode';
let OC_SHELL = false;

function resolveOpencode() {
  if (process.platform !== 'win32') return;
  const candidates = [
    process.env.APPDATA && path.join(process.env.APPDATA, 'npm', 'opencode.exe'),
    process.env.APPDATA && path.join(process.env.APPDATA, 'npm', 'node_modules', '@opencode', 'cli', 'bin', 'opencode.exe'),
    '/usr/local/bin/opencode',
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) { OC_BIN = c; return; }
  }
  OC_BIN = 'opencode.cmd';
  OC_SHELL = true;
}

async function freeModels() {
  try {
    const res = await fetch(ZEN_MODELS_URL, {
      headers: {
        'x-opencode-client': 'cli',
        'x-opencode-session': `ses_${Math.random().toString(16).slice(2, 26)}`,
        'x-opencode-project': 'global',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const j = await res.json();
    const free = (j.data || [])
      .filter((m) => /free/.test(m.id || '') || (m.pricing && m.pricing.input === 0 && m.pricing.output === 0))
      .map((m) => (m.id || '').replace(/^opencode\//, ''))
      .filter(Boolean);
    if (free.length) return free;
  } catch (e) {
    console.warn(`[curate] live free-model discovery failed (${e.message}); static fallback`);
  }
  return STATIC_FREE_FALLBACK;
}

function runModel(model, prompt, agent, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(OC_BIN, ['run', '--model', `opencode/${model}`, '--agent', agent], {
      cwd: ROOT,
      env: { ...process.env, OPENCODE_API_KEY: process.env.OPENCODE_API_KEY || 'public' },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: OC_SHELL,
    });
    let out = '';
    const timer = setTimeout(() => { child.kill(); resolve(''); }, timeoutMs);
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.on('error', () => { clearTimeout(timer); resolve(''); });
    child.on('close', () => { clearTimeout(timer); resolve(out); });
    child.stdin.on('error', () => {});
    child.stdin.end(prompt, 'utf8');
  });
}

/* ------------------------------------------------------- deterministic facts */

function gh(args2) {
  const r = spawnSync('gh', args2, { encoding: 'utf8', shell: process.platform === 'win32', env: process.env });
  return r.status === 0 ? r.stdout.trim() : null;
}

function facts(db, { pr, issue }) {
  const out = [];
  const t = totals(db.entries, db.updatedAt);
  out.push(`entries=${t.entries} repos=${t.repos} resources=${t.resources} stars=${fmtStars(t.stars)} languages=${t.languages} updated=${t.updated}`);

  const urls = new Map();
  for (const e of db.entries) {
    const k = e.url.toLowerCase().replace(/\/$/, '');
    urls.set(k, (urls.get(k) || 0) + 1);
  }
  const dupes = [...urls.entries()].filter(([, n]) => n > 1);
  out.push(`duplicate urls=${dupes.length}${dupes.length ? ' → ' + dupes.map(([u]) => u).join(', ') : ''}`);

  const badCat = db.entries.filter((e) => !CATEGORY_IDS.has(e.category)).map((e) => e.name);
  out.push(`unknown categories=${badCat.length}${badCat.length ? ' → ' + badCat.join(', ') : ''}`);

  const missingZh = db.entries.filter((e) => !e.descriptionZh);
  const missingFr = db.entries.filter((e) => !e.descriptionFr);
  out.push(`missing zh=${missingZh.length} missing fr=${missingFr.length}`);
  if (missingZh.length) out.push(`  zh sample: ${missingZh.slice(0, 5).map((e) => e.name).join(', ')}`);
  if (missingFr.length) out.push(`  fr sample: ${missingFr.slice(0, 5).map((e) => e.name).join(', ')}`);

  const stale = db.entries.filter((e) => e.stale);
  out.push(`flagged stale=${stale.length}${stale.length ? ' → ' + stale.slice(0, 5).map((e) => `${e.name}(${e.staleReason})`).join(', ') : ''}`);

  const archived = db.entries.filter((e) => e.archived);
  out.push(`archived=${archived.length}`);
  const zeroStars = db.entries.filter((e) => e.kind === 'repo' && e.stars === 0);
  out.push(`zero-star repos=${zeroStars.length}`);

  // Trilingual parity: the same rows must exist in all three READMEs.
  for (const f of ['README.md', 'README.zh.md', 'README.fr.md']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) { out.push(`${f}: MISSING`); continue; }
    const rows = (fs.readFileSync(p, 'utf8').match(/^\| \[/gm) || []).length;
    out.push(`${f} rows=${rows} ${rows === db.entries.length ? '✅' : `❌ expected ${db.entries.length}`}`);
  }

  if (pr) {
    const raw = gh(['pr', 'view', String(pr), '--json', 'title,body,files,author,authorAssociation,additions']);
    if (!raw) {
      out.push(`PR #${pr}: could not read (no gh auth in this context?)`);
    } else {
      const j = JSON.parse(raw);
      out.push(`PR #${pr} title="${j.title}" files=${(j.files || []).map((f) => f.path).join(',')} author=@${j.author?.login} assoc=${j.authorAssociation} additions=${j.additions}`);
      const m = (`${j.title} ${j.body || ''}`).match(/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/);
      if (m) {
        const repo = m[1];
        const known = db.entries.find((e) => `${e.owner}/${e.repo}`.toLowerCase() === repo.toLowerCase());
        out.push(`PR repo=${repo} already_listed=${known ? 'YES (duplicate PR)' : 'no'}`);
        const api = gh(['api', `repos/${repo}`, '--jq', '{stars: .stargazers_count, license: (.license.spdx_id // null), archived: .archived, topics: .topics, desc: .description, pushed: .pushed_at}']);
        if (api) out.push(`PR repo live: ${api}`);
      } else {
        out.push('PR: no github.com/owner/repo link found in title or body');
      }
      const touchesData = (j.files || []).some((f) => f.path === 'data/entries.json');
      out.push(`PR touches data/entries.json=${touchesData ? 'yes' : 'NO'}`);
    }
  }

  if (issue) {
    const raw = gh(['issue', 'view', String(issue), '--json', 'title,body,author,labels']);
    if (raw) {
      const j = JSON.parse(raw);
      out.push(`Issue #${issue} title="${j.title}" author=@${j.author?.login}`);
      const m = (`${j.title} ${j.body || ''}`).match(/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/);
      if (m) {
        const repo = m[1];
        const known = db.entries.find((e) => `${e.owner}/${e.repo}`.toLowerCase() === repo.toLowerCase());
        out.push(`Issue repo=${repo} already_listed=${known ? 'YES' : 'no'}`);
      }
    } else out.push(`Issue #${issue}: could not read`);
  }

  return out.join('\n');
}

/* ----------------------------------------------------------------- prompts */

function healthPrompt(db, factLines, modelCount) {
  const t = totals(db.entries, db.updatedAt);
  return [
    'You are the Awesome Jev curator, auditing a self-updating directory of projects built on',
    'Jev (TypeSafe AI System One decision model). Be terse and concrete. Never invent numbers —',
    'every claim must come from the facts below or from a command you actually ran.',
    '',
    `Snapshot: ${t.entries} entries, ${fmtStars(t.stars)} stars, ${t.languages} languages, refreshed ${t.updated}.`,
    `Free models available this run: ${modelCount}.`,
    '',
    'Deterministic facts already gathered (treat as ground truth):',
    ...factLines.map((l) => `> ${l}`),
    '',
    'Task:',
    '1. Call out anything that is actually broken: duplicate rows, unknown categories, missing zh/fr',
    '   translations, stale/404 repos, zero-star entries that look abandoned, rows whose stars moved a lot.',
    '2. Name at most 5 concrete fixes, each as a one-line instruction another agent can execute.',
    '3. If nothing is broken, say so in one line. Do not invent work.',
    '',
    'You may run `node scripts/verify.mjs`, read data/entries.json, and use `gh api` if available.',
    'Write your answer as markdown. Keep it under 400 words. No preamble.',
  ].join('\n');
}

function triagePrompt(factLines, pr, issue) {
  return [
    'You are the Awesome Jev curator, reviewing a submission to a curated directory of projects',
    'built on Jev (TypeSafe AI System One). Be kind, specific, and evidence-based. Never invent a',
    'star count or claim a project does something its README does not support.',
    '',
    `Target: ${pr ? `PR #${pr}` : `Issue #${issue}`}`,
    '',
    'Deterministic facts already gathered (ground truth):',
    ...factLines.map((l) => `> ${l}`),
    '',
    'Produce TWO files.',
    '',
    'File 1 — curator-report.md. Markdown with exactly these headings, no dashes inside headings:',
    '# curator-report.md — <UTC timestamp>',
    '## Summary',
    '## Preliminary Checks',
    '(a markdown table: one row per check, plus a single line "Author trust: high|medium|low" —',
    ' never raw account dates, follower counts or bio)',
    '## Verification',
    '(what you could confirm about the repo: exists, calls Jev, README claims, license, stars)',
    '## Maintainer Review Opinion',
    'RECOMMEND: <Approve | Request changes | Needs discussion> — confidence <low|medium|high>.',
    'Rationale: <one short paragraph>',
    '## Suggested Data Change',
    '(the exact JSON snippet to add to data/entries.json, or "none")',
    '## Next Steps',
    '## Sources',
    '(every URL or file you actually checked)',
    '',
    'File 2 — review-comment.md. ONLY the postable comment text, nothing else. Friendly, short,',
    'bilingual if the submission is bilingual. No headings, no tables, no Sources. Start with',
    '"Thanks @author". If something is missing, say what in one sentence. Never accuse anyone of',
    'spam or use words like 投毒/小号/spam.',
  ].join('\n');
}

/* -------------------------------------------------------------- fallbacks */

function deterministicReport(factLines, reason) {
  return [
    `# curator-report.md — ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    '',
    '## Summary',
    `No model run (${reason}). This is a deterministic health snapshot; every line below is`,
    'reproducible with `node scripts/verify.mjs` and needs no AI.',
    '',
    '## Deterministic Facts',
    '```',
    ...factLines,
    '```',
    '',
    '## Suggested Data Change',
    'none — resolve the facts above first.',
    '',
    '## Next Steps',
    '- Run `node scripts/verify.mjs` locally for the same output.',
    '- Run `node scripts/curate.mjs` once the free model endpoint is reachable.',
    '',
    '---',
    `<sub>model: none (${reason})</sub>`,
    '',
  ].join('\n');
}

function extractFile(raw, filename) {
  // The model is asked to write two files; accept either a fenced block labelled
  // with the filename or a plain "File 1"/"File 2" marker.
  const fence = raw.match(new RegExp('```(?:\\w*)\\n([\\s\\S]*?)```', 'g')) || [];
  const tagged = raw.split(/File\s*1|File\s*2/).filter(Boolean);
  for (const block of [...fence, ...tagged]) {
    if (block.toLowerCase().includes(filename.toLowerCase()) || block.includes('# curator-report.md')) {
      const body = block.replace(/^```\w*\n?/, '').replace(/```$/, '');
      if (body.includes('# curator-report.md')) return body.trim();
    }
  }
  return null;
}

/* -------------------------------------------------------------------- main */

async function main() {
  await resolveOpencode();
  const models = await freeModels();
  if (LIST) { console.log(JSON.stringify({ models }, null, 2)); return; }

  const db = loadEntries();
  const pr = process.env.GH_PR || process.env.PR_NUMBER || '';
  const issue = process.env.GH_ISSUE || process.env.ISSUE_NUMBER || '';
  const factLines = facts(db, { pr, issue }).split('\n');

  console.log(`[curate] event pr="${pr}" issue="${issue}" · free models: ${models.slice(0, 5).join(', ')}`);

  const hasOc = spawnSync('opencode', ['--version'], { shell: process.platform === 'win32', stdio: 'ignore' }).status === 0;
  if (DRY || !hasOc) {
    fs.writeFileSync(REPORT, deterministicReport(factLines, DRY ? 'dry-run' : 'opencode not found'), 'utf8');
    console.log('[curate] deterministic report written');
    return;
  }

  const isTriage = Boolean(pr || issue);
  const prompt = isTriage ? triagePrompt(factLines, pr, issue) : healthPrompt(db, factLines, models.length);

  let raw = '';
  let used = null;
  for (const model of models.slice(0, 5)) {
    raw = await runModel(model, prompt, 'curator', 240000);
    if (raw.trim().length > 200) { used = model; break; }
    console.warn(`[curate] ${model} returned nothing usable, trying next`);
  }

  if (!used) {
    fs.writeFileSync(REPORT, deterministicReport(factLines, 'all free models failed'), 'utf8');
    console.warn('[curate] all free models failed — deterministic report written');
    return;
  }

  const body = extractFile(raw, 'curator-report.md');
  if (!body) {
    fs.writeFileSync(REPORT, deterministicReport(factLines, `model ${used} returned unparsable output`), 'utf8');
    console.warn('[curate] unparsable model output — deterministic report written');
    return;
  }

  fs.writeFileSync(REPORT, body.replace(/<sub>model:[^<]*<\/sub>/, '').trim() + `\n\n<sub>model: opencode/${used}</sub>\n`, 'utf8');

  const comment = extractFile(raw, 'review-comment.md');
  if (comment) fs.writeFileSync(COMMENT, comment.slice(0, 5000).trim() + '\n', 'utf8');

  console.log(`[curate] wrote curator-report.md (model opencode/${used})${comment ? ' + review-comment.md' : ''}`);
}

main().catch((e) => { console.error(e); process.exit(1); });