/**
 * Picks the ink ramp against the paper ground, so the CSS values are measured
 * rather than guessed. A ratio that "looks fine" at 4.1:1 is a WCAG AA failure
 * on body and placeholder text, and the detector reported 1086 instances of it
 * across the three languages — the ramp, not the individual components, was the
 * bug.
 *
 *   node scripts/check-contrast.mjs
 */

export const PAPER = '#fbfaf6';
export const PAPER_DEEP = '#f3f1ea';
export const SIGNAL = '#b3261e';
export const SIGNAL_WASH = '#fbeceb';
export const INK = '#14130f';

const srgb = (hex) => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
};

const lum = (hex) => {
  const [r, g, b] = srgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function ratio(a, b) {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Darkens `hex` toward black until it clears `target` against `bg`. */
export function darkenTo(hex, bg, target) {
  let [r, g, b] = srgb(hex);
  // Work in linear light then convert back, so the search is perceptually even.
  for (let step = 0; step < 200; step++) {
    const cur = ratio(hex, bg);
    if (cur >= target) return hex;
    const k = 0.985 ** (step + 1);
    r *= k; g *= k; b *= k;
    const enc = [r, g, b]
      .map((c) => {
        const v = c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
        return Math.round(Math.min(1, Math.max(0, v)) * 255)
          .toString(16)
          .padStart(2, '0');
      })
      .join('');
    hex = `#${enc}`;
  }
  return hex;
}

if (process.argv[1]?.endsWith('check-contrast.mjs')) {
  const want = Number(process.argv[2] || 4.5);
  const bases = { ink70: '#4a4841', ink45: '#7d7a70' };

  console.log(`paper ${PAPER} · paper-deep ${PAPER_DEEP} · ink ${INK}`);
  console.log(`target ${want}:1\n`);

  for (const [name, hex] of Object.entries(bases)) {
    const fixed = darkenTo(hex, PAPER, want);
    console.log(`${name}  ${hex} → ${fixed}`);
    console.log(`   on paper        ${ratio(fixed, PAPER).toFixed(2)}:1`);
    console.log(`   on paper-deep   ${ratio(fixed, PAPER_DEEP).toFixed(2)}:1`);
    console.log(`   as paper-on-ink ${ratio(fixed, INK).toFixed(2)}:1`);
  }

  const signalOnWash = ratio(SIGNAL, SIGNAL_WASH);
  console.log(`\nsignal ${SIGNAL} on signal-wash ${SIGNAL_WASH}: ${signalOnWash.toFixed(2)}:1`);
  console.log(`signal on paper: ${ratio(SIGNAL, PAPER).toFixed(2)}:1`);
}