# DESIGN.md — the decision-table world

The visual system for the Awesome Jev directory site. Written after the build, so
it records what is actually implemented rather than what was intended.

## The world

An ISO/IEC 61471 or CRISP **decision table**: a condition grid above, an action grid
below, and one rule per vertical column. Black ink on paper white. It was chosen
because it is the same object as the product — Jev evaluates typed conditions and
returns typed actions with probabilities, which is exactly what a decision table
is. The `noul` primitive and the table's `-` don't-care mark are the same glyph on
purpose.

**The memorable moment:** the first viewport is a live decision table, not a
description of one. A real ticket enters as state, three conditions resolve against
it, and the three typed answers arrive carrying their real probabilities
(`billing: 0.94, technical: 0.05, other: 0.01`). A confidence gauge under the table
puts the answer's `confidence` field against the threshold a caller would set. The
page's claim is demonstrated by being one.

## The six rules

Every one of these is enforced in `src/styles/decision-table.css`, and each has a
detector run or a measured value behind it.

1. **Hierarchy in rules, not fills.** Level comes from rule weight —
   `--rule-hair` 0.5px, `--rule` 1px, `--rule-firm` 2px, `--rule-heavy` 3px. There is
   no grey fill block anywhere on the page. The only fills are `--ink` (inverted
   elements), `--signal` (the one resolved action), and `--paper-deep` (hover).
2. **No enclosures.** No cards, no rounded corners, no shadows, no `border-radius`
   except `50%` on the gauge needle. Every entry sits bare on the grid with
   baselines running the full measure. The incumbent build's card grid is gone.
3. **Magnitude on weight, never hue.** Star magnitude lands on type weight and ink
   darkness (`.entry-stars.w0`–`.w3`). The only colour on the page is the ink, one
   signal red, and the paper — there is no category colour, no language colour.
4. **Thresholds as don't-care marks.** `Y` / `N` / `–` are the condition vocabulary.
   `–` means don't care and is set in `--ink-45`; the other two are drawn glyphs.
   Jev's `noul` and this mark are one idea.
5. **Language as a column, not a dropdown.** The three languages are ruled cells in
   the masthead with `hreflang` on each. Never a `<select>`.
6. **One control propagates.** Search re-rulings the whole table: every matching
   rule keeps its heading and rows, everything else leaves the grid. There is no
   "filtered fragment" state. `?q=` runs the same filter, so the JSON-LD
   `SearchAction` and a shared link resolve identically.

## Tokens

```
--paper        #fbfaf6   page ground
--paper-deep   #f3f1ea   hover only
--ink          #14130f   body ink, 17.80:1 on paper
--ink-70       #4a4841   secondary text, 8.76:1 on paper
--ink-45       #6f6c63   meta and micro-labels, 5.03:1 on paper / 4.64:1 on hover
--signal       #b3261e   the resolved action and the confidence needle, 6.26:1 on paper
--signal-wash  #fbeceb   the resolved rule row only

--rule-hair 0.5px   --rule 1px   --rule-firm 2px   --rule-heavy 3px

--t-min 0.75rem     floor for functional text (12px at the 16px root)
```

The ink ramp is **measured, not chosen**: `node scripts/check-contrast.mjs` prints
every ratio, and the original `--ink-45: #7d7a70` measured 4.1:1 and failed WCAG AA
across 1086 rendered strings before this pass.

## Type

- **Archivo** variable, 300–900, self-hosted (`public/fonts/`, latin + latin-ext).
  Display and body. Chosen because a decision table is an institutional document,
  and its slightly condensed, high-x-height grotesk holds a dense grid without
  shouting.
- **DM Mono** 400 and 500, self-hosted, latin only. Every number, rule number,
  condition mark, language cell and measurement.
- **System CJK fallback** — `PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei`,
  `Noto Sans SC`. A full CJK face is several megabytes and would dwarf the page;
  中文 readers already have the font, so the system face is the correct call.
- Body root `clamp(16px, 0.3vw + 15.2px, 17px)`. Chinese reads denser per line than
  French, so the 16px floor is what keeps 简体中文 from setting tighter than English.
- Tracking stops at −0.032em on the display; no value goes below −0.04em.

## Layout

```
1440   hero is two columns; the six-column decision table fits at full measure
1200   unchanged
1024   directory drops the meta column into the name cell
 832   the decision table folds to one column per condition, action beneath
 680   counts grid wraps to two columns; buttons go full width
 544   entry rows put the description on its own line under the name
```

Below 832px the six-column table becomes stacked conditions, which is the same
reading order as the specification, not a different design.

## States

| State | Treatment |
| --- | --- |
| hover (row) | `--paper-deep`, no movement; buttons lift 1px |
| hover (primary) | `--signal` ground and border |
| hover (language) | ink ground and border |
| focus | 2px ink outline, 3px offset, on every interactive element |
| selected language | ink ground, paper text, `aria-current="page"` |
| resolved rule | `--signal-wash` row, `--signal` `RESOLVED` flag |
| archived entry | name struck through, both name and description dropped to `--ink-45` |
| search empty | explicit empty state naming the recovery, with a link to submit |
| reduced motion | all motion to 0.001ms, `scroll-behavior: auto` |
| print | search and CTAs hidden |

## Browser surfaces

`::selection` is ink on paper. Focus rings are drawn, not inherited. Tabular lining
numerals are on `body`, so the star column and the rule numbers align down the
page. Links carry an underline offset of `0.22em` at hairline thickness.
Scrollbars are left alone deliberately: this is a printed document, and a themed
scrollbar would be decoration.

## The one deviation from the craft floor

The gauge's tick comb is a `repeating-linear-gradient`. The floor permits stripes
where there is a real measuring tool underneath, and that comb is the
graduations of a scale whose needle sits at the answer's actual confidence. It is
the drawing, not a texture applied for interest. The detector still flags it three
times (once per language) and that is the accepted cost of stating the number
honestly.

## What ships

- **1 external stylesheet**, `1.5 KB` of inline module JS (the search), **0 bytes**
  of framework runtime. Astro is a build-time tool here; nothing hydrates except
  the one search script.
- Verified by `node scripts/check-payload.mjs`.
- Fonts preloaded, `font-display: swap`, no runtime CDN request.

## Regenerating

```bash
npm install
npm run build     # astro build && node scripts/build-ai-artifacts.mjs
node scripts/shoot.mjs http://localhost:4321/awesome-jev/ .impeccable/review
node scripts/detect.mjs
node scripts/check-contrast.mjs
node scripts/check-css.mjs
```

`check-css.mjs` exists because a stray `---` fence at the top of the main
stylesheet produced an `Invalid qualified rule` error with no line number, and
`css-bisect.mjs` then narrowed it to the file. Both are kept so the next person
does not lose an hour to an anonymous parser error.