# Personal Portal And Blog Design

Date: 2026-04-06
Status: Ready for user review

## Summary

This site is a static personal website built with Astro, TypeScript, Svelte, Typst.ts, astro-typst, and terminal.css.

The information architecture is:

- `/` is a personal portal homepage, not the full blog index
- `/blog` is the full blog listing page
- `/blog/<slug>` is the article detail page
- `/tags/<tag>` is the tag listing page
- `/archive` is the archive page

The visual direction is a geek terminal aesthetic. The homepage should use a split-console layout with the atmosphere of a booted terminal session. The blog should share the same theme, but optimize article readability instead of treating long-form writing as raw terminal output.

## Goals

- Build a static site that can be deployed directly to Nginx after `pnpm build`
- Keep Typst article metadata and body in the same `.typ` file
- Separate the personal portal from the full blog index
- Keep homepage content focused: profile, site navigation, and a short latest-posts list
- Keep blog maintenance low by generating tags, archive, and previous-next links from article metadata
- Use terminal.css as the visual base, with custom theme overrides

## Non-goals

- No server-side runtime or CMS
- No search system in this phase
- No article summaries or reading-time metadata in this phase
- No client-side app shell that takes over core navigation

## Confirmed Product Decisions

- The homepage shows avatar, personal profile, site navigation, and latest posts
- Site navigation uses a command-menu presentation similar to `ls ~/sites`
- The homepage latest-posts block shows title and date only
- The blog has a dedicated `/blog` page that lists all posts
- Article detail URLs use `/blog/<slug>`
- Article detail pages include tags and previous-next navigation
- Tags and archive pages are in scope
- Typst article frontmatter is embedded inside each `.typ` file

## Route Architecture

### Homepage

Route: `/`

Purpose:

- Present the owner identity first
- Provide entry points to other owned sites
- Surface a small set of the newest blog posts
- Link into the dedicated blog section

Homepage sections:

- Hero console
- Profile panel
- Sites command panel
- Latest posts panel

### Blog index

Route: `/blog`

Purpose:

- Show the complete list of blog posts in reverse chronological order
- Provide the main entry point into long-form content

### Article page

Route: `/blog/<slug>`

Purpose:

- Render the full Typst article
- Link back to `/blog`
- Show tags
- Show previous and next article navigation

### Tag page

Route: `/tags/<tag>`

Purpose:

- Show all posts for one tag

### Archive page

Route: `/archive`

Purpose:

- Show all posts grouped by year

## Content Model

### Posts

Directory:

- `src/content/posts/`

File format:

- One article per `.typ` file

Each article must define Typst metadata labeled as `<frontmatter>`.

Required frontmatter fields:

- `title: string`
- `slug: string`
- `date`
- `tags: string[]`

Notes:

- `date` will be normalized in Astro code into a comparable JavaScript date value for sorting
- `slug` is explicit instead of inferred from filename to avoid accidental URL changes during refactors
- `tags` are required because tag pages are in scope

Example shape:

```typ
#metadata((
  title: "Typst Setup Notes",
  slug: "typst-setup-notes",
  date: datetime(year: 2026, month: 4, day: 6),
  tags: ("typst", "astro"),
))<frontmatter>
```

### Profile data

Directory:

- `src/data/profile.ts`

Purpose:

- Hold display name
- Hold avatar path
- Hold short bio
- Hold stack list
- Hold external links

This keeps homepage profile content editable without touching page markup.

### Owned-site navigation data

Directory:

- `src/data/sites.ts`

Purpose:

- Hold site name
- Hold URL
- Hold one-line description
- Hold command alias or display token used by the terminal-style navigation panel

This data should not live in the blog collection because it is portal navigation, not article content.

## Data Flow

### Build-time source of truth

- Posts come from the Astro content collection backed by `.typ` files
- Profile data comes from `profile.ts`
- Owned-site navigation comes from `sites.ts`

### Derived data

At build time, the site derives:

- All posts sorted descending by date
- Latest posts for homepage
- Previous and next links for each article
- Tag groups for `/tags/<tag>`
- Year groups for `/archive`

### Rendering strategy

- `astro-typst` renders Typst article bodies into HTML output
- Astro renders page shells, routes, metadata, and list pages
- Svelte is optional for small interactive enhancements only

The default site must remain fully usable without client JavaScript.

## Page Design

### Homepage design

The homepage is a portal, not a blog feed.

Layout:

- Desktop uses a split-console presentation
- Mobile collapses to a single column

Panels:

- `PROFILE`
    - avatar
    - display name
    - one-paragraph introduction
    - stack
    - key links
- `SITES`
    - terminal-style command menu
    - reads visually like a directory listing or command palette
    - each site entry links out directly
- `LATEST POSTS`
    - latest 5 posts
    - title and date only
    - explicit link to `/blog`

Tone:

- Use the structure of a control console
- Use the atmosphere of a booted terminal welcome screen
- Keep strong personality without sacrificing readability

### Blog index design

The blog index is simpler and more content-first than the homepage.

Layout:

- Main post list inside a terminal window wrapper
- Supporting navigation to home, archive, and tags

List item format:

- title
- date

This keeps the list aligned with the approved minimal article preview density.

### Article page design

The article page should preserve the terminal theme while making Typst writing comfortable to read.

Layout:

- top navigation with links back to `/` and `/blog`
- article body in a dedicated reading container
- footer metadata area with tags
- previous and next post navigation below the article

The article reading container must override aggressive terminal styles where needed. Long-form text should feel intentional, not like log output.

### Tag and archive page design

- Tag pages reuse the same list item style as `/blog`
- Archive groups posts by year
- Archive grouping should be readable without JavaScript
- If lightweight expand-collapse behavior is later added with Svelte, the non-JS layout remains the source layout

## Component Boundaries

Expected shared components:

- `Layout.astro`
- `SiteHeader.astro`
- `TerminalWindow.astro`
- `ProfilePanel.astro`
- `SitesCommandPanel.astro`
- `LatestPosts.astro`
- `PostList.astro`
- `PostListItem.astro`
- `TypstArticle.astro`
- `TagList.astro`
- `PostPagination.astro`

Component responsibilities:

- `Layout.astro` owns global head tags, theme import, and top-level shell
- `TerminalWindow.astro` provides the reusable terminal panel frame
- `ProfilePanel.astro` renders homepage identity content from `profile.ts`
- `SitesCommandPanel.astro` renders owned sites from `sites.ts`
- `LatestPosts.astro` renders the small homepage subset
- `PostList.astro` and `PostListItem.astro` render reusable post listings
- `TypstArticle.astro` wraps rendered Typst output and applies article-focused styles
- `TagList.astro` renders tag links consistently
- `PostPagination.astro` renders previous-next navigation

## Styling Strategy

### Base

- Import `terminal.css` globally
- Define site theme variables on top of terminal.css instead of using defaults unchanged

### Visual direction

- Prefer a cold terminal palette with restrained glow
- Use monospace display accents, but do not force all body text into pure terminal presentation
- Add subtle atmosphere with grid, scanline, or glow layers only where they improve mood without reducing legibility

### Typography

- Navigation chrome and panel labels can lean more terminal-like
- Long-form article content must prioritize readability
- Typst output styles may need their own scoped overrides so article prose does not inherit overly dense terminal defaults

### Responsive behavior

- Desktop homepage uses the split-console layout
- Mobile homepage stacks profile, site navigation, and latest posts vertically
- Blog pages remain readable on narrow screens without horizontal scrolling

## Error Handling

- Missing required Typst frontmatter fields must fail the build
- Duplicate `slug` values must fail the build
- Invalid `date` values must fail the build
- Empty tag values must be rejected during collection validation or post-processing
- Missing avatar or broken owned-site links should be caught during local verification before completion

Failing early at build time is preferred over producing a broken static site.

## SEO And Static Output

- Use Astro static output only
- Set correct page titles and descriptions per route
- Generate a sitemap through the existing Astro sitemap integration
- Ensure blog pages and article pages emit stable canonical URLs under `https://hobr.site`

## Verification Plan

Before implementation is considered complete, verify:

- homepage renders with profile, site navigation, and latest posts
- `/blog` lists all posts in reverse chronological order
- `/blog/<slug>` renders Typst content correctly
- previous-next links resolve correctly
- `/tags/<tag>` pages generate and list matching posts
- `/archive` groups posts correctly by year
- the final build succeeds with `pnpm build`
- the static output works without relying on client-side routing

## Risks And Mitigations

- Risk: terminal.css default styles reduce article readability
    - Mitigation: isolate Typst article output in a dedicated wrapper with scoped overrides
- Risk: Typst metadata dates may need conversion before sorting
    - Mitigation: centralize post normalization in one utility layer
- Risk: homepage portal styling could overshadow content discoverability
    - Mitigation: keep latest posts and `/blog` entry explicit and visually strong
- Risk: multiple data sources drift apart
    - Mitigation: keep strict boundaries: posts in Typst, identity in `profile.ts`, owned sites in `sites.ts`

## Implementation Notes For The Next Planning Step

- Create the Astro content collection for Typst posts first
- Establish one canonical utility for post normalization and sorting
- Build shared terminal shell components before page-specific composition
- Validate the Typst article wrapper early so the theme is proven before building every route
