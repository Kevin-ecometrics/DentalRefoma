// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  vite: {
    esbuild: {
      charset: "utf8",
    },
    plugins: [tailwindcss()],
  },
  site: "https://www.dentistareforma.com/",
  trailingSlash: "always",
  integrations: [react(), sitemap(), robotsTxt(), partytown()],
});