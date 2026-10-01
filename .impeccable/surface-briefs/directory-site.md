# Surface brief — the Awesome Jev directory site

## Scope and visitor mode

Scope: the marketing/directory surface served from GitHub Pages (`docs/`), all three
languages (English / 简体中文 / Français). Mode: **Persuade** — the visitor decides and
acts (stars the list, submits their project). The three READMEs are a different surface in
mode **Read** and are explicitly out of scope for this build; they keep their current
generator.

## Audience, job, action, proof

- **Audience** — a developer who just heard of Jev and does not yet know what typed
  decisions buy them; and a builder already using Jev who arrived with one task.
- **Job** — understand the mechanism in one viewport, then find the one category or project
  that matches their task.
- **Action** — star the list; open a project; submit a project via PR; install the agent
  skill.
- **Proof** — the 352 real entries with live star counts, the three primitives with real
  returned probabilities, and the machine-readable endpoints. No invented claims, no
  testimonials, no usage numbers.
- **Constraints** — zero client JS except the search entry point; three languages
  first-class; no fabricated content; Pages serves `docs/` from `main`; built by Astro from
  `data/entries.json`, which stays the only hand-edited source.

## Chosen direction and memorable moment

**Decision table** (ISO/IEC 61471 and CRISP crisp tables): a condition grid above, an action
grid below, each rule reading as one vertical column. Black ink on paper white, hierarchy
carried by rule weight rather than fills, no rounded corners, no shadows, no card containers.

The memorable moment: the first viewport is a **real decision table, live**. A document state
enters from the left, the condition columns resolve, and the three possible outcomes arrive
at the right carrying their actual probabilities (`{billing: 0.94, technical: 0.05,
other: 0.01}`). The page's claim is demonstrated by being one, not described.

Six raises, named for the challenger they came from:

- **hierarchy in rules, not fills** — from the moiré gallery challenger: level comes from
  1px / 2px / 3px rule weight; the page contains no grey fill blocks anywhere.
- **no enclosures** — from the cracktro scroller queue challenger: every entry sits bare on
  the grid, baselines run the full measure, nothing is boxed. Rejects the card grid the
  incumbent build shipped.
- **one control propagates** — from the Miura fold challenger: activating search or a
  category re-rulings the whole table rather than filtering one region.
- **weight carries magnitude** — from the chromatophore skin challenger: star magnitude lands
  on type weight and rule weight, never on hue.
- **thresholds as don't-care marks** — from the Jev mechanism itself: the `noul` primitive
  and the table's `-` don't-care glyph are the same mark, used deliberately.
- **language as a column, not a dropdown** — from the Ospaaal poster challenger: the three
  languages are addressable columns/rows of the table's frame, with their names set into the
  frame itself, not hidden behind a `<select>`.

## Unresolved decisions

- Chinese and French copy density differs enough from English that the table's measure must
  be tuned per language; whether one measure works for all three is to be settled by
  rendering, not assumption.
- The search entry point must be the only hydrated component. If Astro's client directive
  cannot keep it that small, it stays a plain inline script rather than becoming a framework.