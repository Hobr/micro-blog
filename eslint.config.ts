import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import path from "node:path";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { includeIgnoreFile } from "@eslint/compat";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

export default defineConfig([
    includeIgnoreFile(gitignorePath),
    prettier,
    tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "no-undef": "off",
        },
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
    },
    {
        files: ["**/*.json"],
        plugins: { json },
        language: "json/json",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.jsonc"],
        plugins: { json },
        language: "json/jsonc",
        extends: ["json/recommended"],
    },
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
        extends: ["css/recommended"],
        rules: {
            // Theme variables come from terminal.css imports and runtime-injected styles.
            "css/no-invalid-properties": "off",
        },
    },
    {
        files: ["src/styles/global.css"],
        rules: {
            // Astro view transitions rely on these pseudo-elements.
            "css/use-baseline": [
                "error",
                {
                    allowSelectors: [
                        "view-transition-old",
                        "view-transition-new",
                    ],
                },
            ],
        },
    },
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
]);
