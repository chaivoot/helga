import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: set to the real domain once it is decided (used for canonical URLs).
  // site: 'https://example.com',

  // Public pages are prerendered; only /admin runs on the server.
  adapter: vercel(),
});
