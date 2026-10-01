import { defineConfig } from 'astro/config';

// Static output only. GitHub Pages serves docs/ from main; no adapter, no SSR,
// and no client runtime except the one search script in Directory.astro.
export default defineConfig({
  site: 'https://hdjekuue.github.io/awesome-jev',
  base: '/awesome-jev',
  outDir: './docs',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  compressHTML: true,
});