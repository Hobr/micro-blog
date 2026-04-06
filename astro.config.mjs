// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import { typst } from "astro-typst";
import { shouldIncludeSitemapPage } from "./src/i18n/sitemap.ts";

// https://astro.build/config
export default defineConfig({
    site: "https://hobr.site",
    integrations: [
        svelte(),
        sitemap({
            filter: shouldIncludeSitemapPage,
        }),
        typst({
            target: (id) =>
                id.includes("/src/content/posts/") ? "html" : "svg",
        }),
    ],
});
