import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Used for canonical URLs and social sharing tags.
  site: 'https://helgafarm.com',

  // Public pages are prerendered; only /admin runs on the server.
  adapter: vercel(),
});
