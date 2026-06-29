// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.kixball.site',
  adapter: vercel(),
  integrations: [mdx()],

  vite: {
    plugins: [tailwindcss()]
  }
});
