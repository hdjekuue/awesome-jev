# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro — static output, zero client JavaScript by default, deployed to GitHub Pages from the
`docs/` directory on `main`. Chosen over staying framework-free because the redesign needs
real component structure and one interactive search surface, and over SvelteKit because a
350-entry content directory does not justify hydration or a heavier runtime.

## Users

Three audiences, in the order the site must serve them:

1. **A developer who has just heard of Jev.** They arrived from a TypeSafe AI link, a Hacker
   News thread, X, or an LLM's answer. They do not yet know what "typed decisions" means in
   practice, and they need to understand it and want to star the list within seconds.
2. **A builder already using Jev.** They know the API and want one specific thing: a router,
   a compaction pass, a tool gate, a moderation judge, an SDK in their language. They arrive
   with a task, browse by category, and leave through the project's own repo.
3. **An AI agent or its author.** They fetch `llms.txt` / `projects.json` / `skill.md` and
   never see the visual layer at all.

## Product Purpose

A curated, self-updating directory of everything built on Jev — TypeSafe AI's System One
model, which answers with typed judgments and calibrated probabilities instead of prose.

Success means: a visitor who star is one who understood what the list is for; a builder who
came with a task finds the right project without reading every category; every project
listed gets discovered by someone who was looking for exactly that.

## Positioning

The only directory that is **trilingual by construction** (English / 简体中文 / Français,
generated from one data file so the languages cannot drift), **machine-readable first**
(`llms.txt`, `skill.md`, `projects.json`, per-category markdown), and **maintained without
paid AI** — the curator runs on free opencode Zen models, so the list stays current at zero
cost and its maintenance model is itself part of the story.

Second claim a competitor could not truthfully copy: it is generated. Every star count,
license and archive flag is re-read from the GitHub API on a schedule; the same data file
renders the three READMEs, the website and the machine-readable exports. A hand-typed list
cannot say that.

## Operating Context

- Someone reads about Jev on X, a Discord thread, or in an LLM answer, and lands here.
- They skim the hero to understand the mechanism, jump to the "what do I need" rail, browse
  a category or two, and click out to a repo.
- Some fraction submits their own project via PR, or tags `jev` and opens an issue.
- A steady trickle of existing projects change category, get archived, or get abandoned; the
  scheduled refresh notices and the curator reports.

## Capabilities and Constraints

- **Content** — 352 entries (335 repositories, 17 official resources) across 20 categories,
  as of 2026-10-01, totalling ~93k stars tracked. Seeded from a community CC0 `projects.json`
  dump.
- **Every entry ships a description in all three languages.** A PR that adds an entry without
  all three is rejected by CI.
- **The site is generated.** `data/entries.json` is the only hand-edited source; READMEs and
  the site are built from it. Nothing may be hand-tuned in the rendered output.
- **Deploy** — GitHub Pages, branch `main`, path `/docs`. No server runtime.
- **Automation is free** — opencode Zen `*-free` models only, no API key. Those endpoints are
  withdrawn and rate-limited without warning, so every AI step must degrade to a
  deterministic script or a static report.
- **Two-model gate** — a second, independent free model reviews every bot-authored PR before
  merge, and a PR touching only the report is never auto-merged.
- **Substrate** — CC0-1.0 public domain, so downstream tools may copy the data freely.
- The website's job is Persuade. The README is Read. They are different surfaces and are not
  allowed to collapse into the same layout.

## Brand Commitments

- **Not affiliated with TypeSafe AI.** Community-maintained. TypeSafe AI is linked because Jev
  is their model, and that distinction is stated on the site.
- **No pay-to-play placement.** The star-milestone mechanism pins notable entries at community
  signal only, never for payment or quota.
- **No fabricated content.** Real star counts with an explicit snapshot date; no invented
  testimonials, customers, or benchmarks.
- **Recommending someone else's project is never penalised.** Self-submission velocity is
  capped; recommendations are exempt. This distinction is stated in CONTRIBUTING.
- Voice: direct, specific, technically literate. Plain sentences, no marketing adjectives,
  no exclamation marks. Identifiers, product names and API paths stay in Latin script in all
  three languages.

## Evidence on Hand

- `data/entries.json` — 352 real entries with live star counts, licenses, languages, push
  dates, archive flags, topics and use-case tags.
- The three maintained READMEs and their marketing copy, FAQ answers, and "find what you need"
  intent rail — written this session, accurate, and reusable.
- Live verified endpoints: `/`, `/zh/`, `/fr/`, `/c/<slug>.md` ×20, `/llms.txt`,
  `/llms-full.txt`, `/skill.md`, `/projects.json`, `/sitemap.xml`, `/robots.txt`.
- Verified JSON-LD graph: WebSite, CollectionPage, ItemList (352 positions), FAQPage (6 Q&A),
  DefinedTermSet (the three primitives), BreadcrumbList.

**Absent, and must never be fabricated:** no traffic or conversion numbers, no testimonials,
no user logos, no "as seen in", no screenshots of a product, no performance benchmarks.

## Product Principles

1. **One source of truth, three languages.** Every visible word exists in a data file that
   renders three languages at once. Language parity is structural, not maintained by hand.
2. **The mechanism is the pitch.** Show typed decisions with real probabilities — the actual
   reason a directory exists — rather than describing them in adjectives.
3. **Honesty is a feature.** Snapshot dates, real numbers, explicit "not affiliated",
   explicit CC0. Credibility is earned by never overstating.
4. **Free and maintained is the story.** The zero-cost maintenance model is part of why this
   list can exist and stay current, and it is worth telling.
5. **Every project below the hero gets discovered.** The star and share calls are for the
   builders listed, not for the list's author.

## Accessibility & Inclusion

Three languages are first-class, not translations — 中文 and Français readers are not a
secondary audience, so type, spacing and line length must hold up for all three. Chinese
reads denser per line than French does; the layout must not be tuned only for English.

No product-specific standard was established. Baseline WCAG AA contrast, visible focus
states, and full keyboard operability are the working standard.