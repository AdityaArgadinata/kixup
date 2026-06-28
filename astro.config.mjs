// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kixup.online',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});
