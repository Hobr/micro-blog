// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap from "@astrojs/sitemap";
import { typst } from "astro-typst";

// https://astro.build/config
export default defineConfig({
    site: "https://hobr.site",
    integrations: [
        svelte(),
        sitemap(),
        typst({
            target: (id) =>
                id.includes("/src/content/posts/") ? "html" : "svg",
        }),
    ],
});
