# Shell-Only I18n Design

Date: 2026-04-07
Status: Ready for user review

## Summary

This change adds three-language support to the site shell while keeping blog post content single-language.

Supported locales:

- `zh-CN`
- `en`
- `ja`

The default locale is `zh-CN`.

The key constraint is unchanged blog content:

- Typst post bodies stay single-language
- post `slug` values stay single-language
- tag `slug` values stay single-language
- only the surrounding site chrome is localized

This preserves the current Typst content model and keeps the i18n work focused on route structure, page copy, navigation, and metadata.

## Goals

- Add Chinese, English, and Japanese site-shell translations
- Keep the current Typst content workflow unchanged
- Preserve static-site deployment to Nginx
- Allow direct linking to language-specific pages
- Keep language switching predictable and route-stable

## Non-goals

- No translation of Typst article bodies
- No translation-specific post slugs
- No translation-specific tag slugs
- No browser-language auto redirect
- No client-only runtime i18n layer as the primary mechanism

## Confirmed Product Decisions

- Default locale is `zh-CN`
- Default locale uses root paths without a prefix
- English uses `/en/...`
- Japanese uses `/ja/...`
- Blog content stays single-language
- Language switching should preserve the current page type when possible
- Route-stable multilingual URLs are preferred over client-only language switching

## Route Design

### Default locale routes

The Chinese locale remains the canonical default route set:

- `/`
- `/blog`
- `/blog/<slug>`
- `/tags/<tag>`
- `/archive`

### English routes

- `/en`
- `/en/blog`
- `/en/blog/<slug>`
- `/en/tags/<tag>`
- `/en/archive`

### Japanese routes

- `/ja`
- `/ja/blog`
- `/ja/blog/<slug>`
- `/ja/tags/<tag>`
- `/ja/archive`

### Route parity

Each locale should expose the same route types:

- homepage
- blog index
- article detail
- tag listing
- archive

Only the shell language changes between locales. The underlying post identity remains the same.

## Language Switching Behavior

The site header should expose a language switcher with three choices:

- `中文`
- `English`
- `日本語`

Switching behavior:

- preserve the current page type when possible
- preserve the current article `slug` when switching article pages
- preserve the current tag `slug` when switching tag pages
- preserve archive and blog routes directly

Examples:

- `/blog` -> `/en/blog` -> `/ja/blog`
- `/blog/hello-terminal` -> `/en/blog/hello-terminal`
- `/tags/site` -> `/ja/tags/site`

The switcher may remember the last selected locale for UI preference, but it must not force automatic redirection on future visits.

## Content Boundaries

### What is localized

- page titles
- page descriptions
- navigation labels
- homepage hero copy
- homepage latest-posts labels
- profile panel copy
- owned-site navigation descriptions
- blog index supporting copy
- tag page supporting copy
- archive page supporting copy
- article-page helper copy
- pagination labels such as previous and next
- empty-state copy

### What is not localized

- Typst article body
- article title inside frontmatter
- post slug
- tag slug
- post ordering and adjacency logic

This keeps the article system as a single source of truth.

## Data Model Changes

### Locale configuration

Add a locale definition layer, for example:

- `src/i18n/config.ts`

This file should define:

- supported locales
- default locale
- locale prefixes
- helpers for route generation and locale detection

### Translation dictionaries

Add one dictionary file per locale, for example:

- `src/i18n/locales/zh-CN.ts`
- `src/i18n/locales/en.ts`
- `src/i18n/locales/ja.ts`

These dictionaries should contain the full site-shell text needed by:

- layout metadata
- header navigation
- homepage
- blog index
- archive page
- tag page
- article helpers

### Profile and site-navigation data

Current files:

- `src/data/profile.ts`
- `src/data/sites.ts`

These should be localized because they contain shell-facing content.

Recommended direction:

- either convert them into locale-aware factories
- or split them into locale-aware records keyed by locale

The important boundary is:

- profile and site-navigation copy should move under i18n control
- post content should remain under the Typst content collection

## Page Architecture

### Layout layer

`Layout.astro` should become locale-aware and accept:

- current locale
- localized page title
- localized page description
- alternate-language URLs

It should emit:

- locale-correct `<html lang>`
- locale-specific `<title>`
- locale-specific description
- canonical URL
- `hreflang` alternates

### Header layer

`SiteHeader.astro` should become locale-aware and render:

- localized nav labels
- current locale indicator
- switch links to sibling locale routes

### Page layer

Each page should resolve:

- current locale
- localized dictionary
- locale-specific SEO copy

Then pass localized strings down into components rather than relying on hardcoded text.

### Component layer

The following components should stop owning hardcoded English copy:

- `SiteHeader.astro`
- `ProfilePanel.astro`
- `PostPagination.astro`
- `PostList.astro`
- `TagList.astro` if it includes helper labels later
- `SitesCommandPanel.svelte`

These components should receive localized strings or locale-aware data via props.

## SEO Strategy

### Canonical handling

Homepage, blog index, tag, and archive pages should use their own locale-specific canonical URLs.

For article detail pages, the article body is identical across locales. To avoid search engines treating those pages as competing duplicates:

- use the default Chinese article route as canonical
- still emit alternate `hreflang` links for English and Japanese shell variants

This makes the content relationship explicit while preserving direct locale links for users.

### Hreflang handling

Every localized shell page should emit alternates for:

- `zh-CN`
- `en`
- `ja`

The default Chinese route should also be included as the default locale target.

## Rendering Strategy

The site should remain fully static:

- Astro generates every locale route at build time
- Typst article rendering remains unchanged
- Nginx continues serving the generated `dist/` directory

No server runtime is introduced by this i18n layer.

## Error Handling

- Unknown locale prefixes should not generate pages
- Missing translation keys should fail fast during development
- Missing locale variants for profile or site-navigation data should fail fast during development
- Language switch links must not generate invalid URLs for supported route types

## Verification Plan

Before implementation is complete, verify:

- `/`, `/blog`, `/archive`, `/tags/<tag>`, `/blog/<slug>` still work in the default locale
- `/en/...` routes generate for all supported page types
- `/ja/...` routes generate for all supported page types
- the language switcher points to the correct sibling routes
- article pages keep the same post content across locales
- `<html lang>` changes per locale
- canonical and `hreflang` metadata are correct
- `pnpm lint`, `pnpm test`, and `pnpm build` all pass

## Risks And Mitigations

- Risk: hardcoded strings remain scattered across components
    - Mitigation: centralize shell copy in locale dictionaries and pass strings downward
- Risk: locale-aware profile and site-navigation data drift from the dictionary model
    - Mitigation: move them under the same locale-resolved data access path
- Risk: duplicated route files increase maintenance cost
    - Mitigation: use shared page-building helpers and locale-aware route wrappers rather than duplicating page logic three times
- Risk: multilingual article routes with identical content compete in search results
    - Mitigation: canonicalize article pages to the default locale and emit `hreflang`

## Implementation Notes For The Next Planning Step

- Introduce locale config and dictionaries first
- Refactor shell components to accept localized copy before expanding routes
- Add locale-prefixed route variants with shared page logic
- Add language switch link generation only after route helpers are stable
- Validate SEO metadata on localized article pages near the end
