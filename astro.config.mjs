// @ts-check
import { defineConfig } from 'astro/config';

// Alex's personal blog. Static build; output goes to dist/.
// `site` is required for RSS + canonical URLs. Update once the real domain is wired.
export default defineConfig({
  site: 'https://blog.hiper2d.workers.dev',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
