// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    esbuild: {
      charset: 'utf8' // Esto fuerza UTF-8
    },
    plugins: [tailwindcss()]
    
  },

  integrations: [react()]
});