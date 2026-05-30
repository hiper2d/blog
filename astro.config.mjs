// @ts-check
import { defineConfig } from 'astro/config';

// Alex's personal blog. Static build; output goes to dist/.
// `site` is required for RSS + canonical URLs. Drives all canonical/OG URLs.
export default defineConfig({
  site: 'https://azelianouski.dev',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
