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
import svelteConfig from "./svelte.config.js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");
const svelteFiles = ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"];

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
    ...svelte.configs.recommended.map((config) => ({
        ...config,
        files: config.files ?? svelteFiles,
    })),
    {
        files: svelteFiles,
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig,
            },
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
    },
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
]);
