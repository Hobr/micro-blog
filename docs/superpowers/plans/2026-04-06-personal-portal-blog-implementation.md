# Personal Portal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static personal portal homepage plus a full Typst-backed blog section with terminal-style UI, tag/archive navigation, and deploy-ready static output.

**Architecture:** Use Astro static routes for page composition and `astro-typst` content collections for Typst posts. Keep post normalization and grouping logic in small TypeScript utilities with Node test coverage, and layer terminal.css plus custom theme CSS over reusable Astro/Svelte components.

**Tech Stack:** TypeScript, Astro, Svelte, astro-typst, Typst.ts, terminal.css, Node test runner

---

## File Structure

- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/pages/index.astro`
- Delete: `src/components/Welcome.astro`
- Create: `src/content.config.ts`
- Create: `src/content/posts/hello-terminal.typ`
- Create: `src/content/posts/astro-static-delivery.typ`
- Create: `src/content/posts/typst-notes.typ`
- Create: `src/data/profile.ts`
- Create: `src/data/sites.ts`
- Create: `src/lib/post-data.ts`
- Create: `src/lib/posts.ts`
- Create: `src/styles/global.css`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/TerminalWindow.astro`
- Create: `src/components/ProfilePanel.astro`
- Create: `src/components/PostList.astro`
- Create: `src/components/PostPagination.astro`
- Create: `src/components/TagList.astro`
- Create: `src/components/SitesCommandPanel.svelte`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/archive.astro`
- Create: `tests/post-data.test.ts`

### Task 1: Post Data Utilities And Test Harness

**Files:**

- Modify: `package.json`
- Create: `src/lib/post-data.ts`
- Create: `tests/post-data.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import {
    createAdjacentPostMap,
    groupPostsByTag,
    groupPostsByYear,
    normalizePostRecord,
    parseTypstDate,
    sortPostsByDateDesc,
} from "../src/lib/post-data.ts";

const rawPosts = [
    {
        id: "a",
        data: {
            title: "Older",
            slug: "older",
            date: "datetime(year: 2025, month: 12, day: 30)",
            tags: ["astro", "notes"],
        },
    },
    {
        id: "b",
        data: {
            title: "Newest",
            slug: "newest",
            date: "datetime(year: 2026, month: 4, day: 6)",
            tags: ["typst"],
        },
    },
];

test("parseTypstDate converts typst datetime text into a UTC date", () => {
    const parsed = parseTypstDate("datetime(year: 2026, month: 4, day: 6)");
    assert.equal(parsed.toISOString(), "2026-04-06T00:00:00.000Z");
});

test("normalizePostRecord validates and decorates a post record", () => {
    const normalized = normalizePostRecord(rawPosts[0]);
    assert.equal(normalized.slug, "older");
    assert.equal(normalized.dateLabel, "2025-12-30");
});

test("sortPostsByDateDesc orders newest first", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));
    assert.deepEqual(
        sorted.map((post) => post.slug),
        ["newest", "older"],
    );
});

test("groupPostsByTag and groupPostsByYear derive navigation views", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));
    assert.deepEqual(
        groupPostsByTag(sorted)
            .get("astro")
            ?.map((post) => post.slug),
        ["older"],
    );
    assert.deepEqual(
        groupPostsByYear(sorted).map(([year]) => year),
        ["2026", "2025"],
    );
});

test("createAdjacentPostMap wires previous and next slugs", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));
    const adjacency = createAdjacentPostMap(sorted);
    assert.equal(adjacency.get("newest")?.next?.slug, "older");
    assert.equal(adjacency.get("older")?.previous?.slug, "newest");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test --experimental-strip-types tests/post-data.test.ts`
Expected: FAIL with module-not-found or missing export errors from `src/lib/post-data.ts`

- [ ] **Step 3: Write minimal implementation**

```ts
export type RawPostRecord = {
    id: string;
    data: {
        title: string;
        slug: string;
        date: string;
        tags: string[];
    };
};

export type NormalizedPost = {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    publishedAt: Date;
    dateLabel: string;
};

export function parseTypstDate(input: string): Date {
    const year = Number(input.match(/year:\s*(\d{4})/)?.[1]);
    const month = Number(input.match(/month:\s*(\d{1,2})/)?.[1]);
    const day = Number(input.match(/day:\s*(\d{1,2})/)?.[1]);

    if (!year || !month || !day) {
        throw new Error(`Invalid Typst date: ${input}`);
    }

    return new Date(Date.UTC(year, month - 1, day));
}

export function normalizePostRecord(record: RawPostRecord): NormalizedPost {
    if (!record.data.slug.trim()) throw new Error("Post slug is required");
    if (record.data.tags.length === 0)
        throw new Error("Post tags are required");

    const publishedAt = parseTypstDate(record.data.date);

    return {
        id: record.id,
        title: record.data.title,
        slug: record.data.slug,
        tags: record.data.tags,
        publishedAt,
        dateLabel: publishedAt.toISOString().slice(0, 10),
    };
}

export function sortPostsByDateDesc(posts: NormalizedPost[]): NormalizedPost[] {
    return [...posts].sort(
        (left, right) =>
            right.publishedAt.getTime() - left.publishedAt.getTime(),
    );
}

export function groupPostsByTag(
    posts: NormalizedPost[],
): Map<string, NormalizedPost[]> {
    const grouped = new Map<string, NormalizedPost[]>();
    for (const post of posts) {
        for (const tag of post.tags) {
            grouped.set(tag, [...(grouped.get(tag) ?? []), post]);
        }
    }
    return grouped;
}

export function groupPostsByYear(
    posts: NormalizedPost[],
): Array<[string, NormalizedPost[]]> {
    const grouped = new Map<string, NormalizedPost[]>();
    for (const post of posts) {
        const year = String(post.publishedAt.getUTCFullYear());
        grouped.set(year, [...(grouped.get(year) ?? []), post]);
    }
    return [...grouped.entries()];
}

export function createAdjacentPostMap(posts: NormalizedPost[]) {
    return new Map(
        posts.map((post, index) => [
            post.slug,
            {
                previous: index > 0 ? posts[index - 1] : undefined,
                next: index < posts.length - 1 ? posts[index + 1] : undefined,
            },
        ]),
    );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test --experimental-strip-types tests/post-data.test.ts`
Expected: PASS with all five tests green

- [ ] **Step 5: Add a reusable test script**

```json
{
    "scripts": {
        "test": "node --test --experimental-strip-types tests/*.test.ts"
    }
}
```

- [ ] **Step 6: Commit**

```bash
git add package.json src/lib/post-data.ts tests/post-data.test.ts
git commit -m "test: add post data utilities"
```

### Task 2: Typst Post Collection And Query Layer

**Files:**

- Modify: `astro.config.mjs`
- Create: `src/content.config.ts`
- Create: `src/lib/posts.ts`
- Create: `src/content/posts/hello-terminal.typ`
- Create: `src/content/posts/astro-static-delivery.typ`
- Create: `src/content/posts/typst-notes.typ`

- [ ] **Step 1: Write the failing test**

Add one more assertion to `tests/post-data.test.ts` that duplicate slugs are rejected:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { assertUniqueSlugs } from "../src/lib/post-data.ts";

test("assertUniqueSlugs rejects duplicate slugs", () => {
    assert.throws(
        () =>
            assertUniqueSlugs([
                normalizePostRecord(rawPosts[0]),
                normalizePostRecord({
                    id: "dup",
                    data: {
                        title: "Duplicate",
                        slug: "older",
                        date: "datetime(year: 2026, month: 4, day: 1)",
                        tags: ["astro"],
                    },
                }),
            ]),
        /Duplicate post slug: older/,
    );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL because `assertUniqueSlugs` is not implemented

- [ ] **Step 3: Extend the utility and wire Astro content**

```ts
export function assertUniqueSlugs(posts: NormalizedPost[]) {
    const seen = new Set<string>();
    for (const post of posts) {
        if (seen.has(post.slug))
            throw new Error(`Duplicate post slug: ${post.slug}`);
        seen.add(post.slug);
    }
}
```

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        date: z.string(),
        tags: z.array(z.string().min(1)).min(1),
    }),
});

export const collections = { posts };
```

```ts
// src/lib/posts.ts
import { getCollection, type CollectionEntry } from "astro:content";
import {
    assertUniqueSlugs,
    createAdjacentPostMap,
    groupPostsByTag,
    groupPostsByYear,
    normalizePostRecord,
    sortPostsByDateDesc,
} from "./post-data";

export type PostEntry = CollectionEntry<"posts">;

export async function getAllPosts() {
    const entries = await getCollection("posts");
    const posts = sortPostsByDateDesc(entries.map(normalizePostRecord));
    assertUniqueSlugs(posts);
    return posts;
}

export async function getLatestPosts(limit = 5) {
    return (await getAllPosts()).slice(0, limit);
}

export async function getPostsByTag(tag: string) {
    return groupPostsByTag(await getAllPosts()).get(tag) ?? [];
}

export async function getArchiveGroups() {
    return groupPostsByYear(await getAllPosts());
}

export async function getAdjacentPosts() {
    return createAdjacentPostMap(await getAllPosts());
}
```

```js
// astro.config.mjs
import { typst } from "astro-typst";

integrations: [
    svelte(),
    sitemap(),
    typst({
        target: (id) => (id.includes("/src/content/posts/") ? "html" : "svg"),
    }),
];
```

- [ ] **Step 4: Create three real Typst article fixtures**

Each file should start with frontmatter like:

```typ
#metadata((
  title: "Hello Terminal",
  slug: "hello-terminal",
  date: "datetime(year: 2026, month: 4, day: 6)",
  tags: ("site", "intro"),
))<frontmatter>
```

and then include enough body content to visibly exercise headings, paragraphs, lists, code, and emphasis.

- [ ] **Step 5: Run verification**

Run: `pnpm test`
Expected: PASS

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`
Expected: PASS with generated `/blog`-related static routes still absent because route pages are not built yet

- [ ] **Step 6: Commit**

```bash
git add astro.config.mjs src/content.config.ts src/lib/post-data.ts src/lib/posts.ts src/content/posts tests/post-data.test.ts
git commit -m "feat: add typst post collection"
```

### Task 3: Shared Theme, Data Files, And Shell Components

**Files:**

- Modify: `src/layouts/Layout.astro`
- Create: `src/styles/global.css`
- Create: `src/data/profile.ts`
- Create: `src/data/sites.ts`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/TerminalWindow.astro`
- Create: `src/components/ProfilePanel.astro`
- Create: `src/components/PostList.astro`
- Create: `src/components/PostPagination.astro`
- Create: `src/components/TagList.astro`
- Create: `src/components/SitesCommandPanel.svelte`
- Create: `public/avatar.svg`

- [ ] **Step 1: Write the failing integration expectation**

Create the homepage and blog page imports first so the build fails because the shell components do not exist yet.

```astro
---
import Layout from "../layouts/Layout.astro";
import ProfilePanel from "../components/ProfilePanel.astro";
import SitesCommandPanel from "../components/SitesCommandPanel.svelte";
---
```

- [ ] **Step 2: Run build to verify it fails**

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`
Expected: FAIL with missing-component import errors

- [ ] **Step 3: Build the shared shell**

Implement:

- `Layout.astro` with title, description, canonical URL, and global stylesheet import
- `global.css` with `terminal.css` import plus site theme overrides
- `profile.ts` with name, bio, stack, links, and avatar path
- `sites.ts` with command alias, site name, description, and URL
- `TerminalWindow.astro` as the reusable panel frame
- `SiteHeader.astro` with routes to `/`, `/blog`, and `/archive`
- `ProfilePanel.astro` consuming `profile.ts`
- `SitesCommandPanel.svelte` rendering command-style site navigation
- `PostList.astro`, `TagList.astro`, and `PostPagination.astro` as reusable content UI

- [ ] **Step 4: Run build to verify the shell exists**

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`
Expected: PASS or fail only on the remaining route files, not on missing shell components

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/styles/global.css src/data/profile.ts src/data/sites.ts src/components public/avatar.svg
git commit -m "feat: add terminal site shell"
```

### Task 4: Portal, Blog, Tag, Archive, And Article Routes

**Files:**

- Modify: `src/pages/index.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/archive.astro`

- [ ] **Step 1: Write the failing route expectation**

Create page files with the data imports first but leave the route bodies empty enough to make the build fail on unresolved exports:

```astro
---
import Layout from "../../layouts/Layout.astro";
import PostList from "../../components/PostList.astro";
import { getAllPosts } from "../../lib/posts";

const posts = await getAllPosts();
---
```

- [ ] **Step 2: Run build to verify it fails**

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`
Expected: FAIL because route rendering is incomplete or static paths are missing

- [ ] **Step 3: Implement routes**

Implement:

- `/` with profile, sites command panel, latest 5 posts, and a visible `/blog` entry
- `/blog` with all posts sorted newest-first
- `/blog/[slug]` with `getStaticPaths()`, rendered Typst content, tags, and previous-next navigation
- `/tags/[tag]` with `getStaticPaths()` and filtered posts
- `/archive` with year-grouped posts

Use `await entry.render()` on the selected post entry and wrap the article body in a readable terminal-themed article container.

- [ ] **Step 4: Run verification**

Run: `pnpm test`
Expected: PASS

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`
Expected: PASS with `/`, `/blog`, `/blog/[slug]`, `/tags/[tag]`, and `/archive` all generated

- [ ] **Step 5: Commit**

```bash
git add src/pages src/components src/lib
git commit -m "feat: build personal portal and blog routes"
```

### Task 5: Final Verification And Cleanup

**Files:**

- Modify: `README.md` only if setup or route documentation now needs updating

- [ ] **Step 1: Run full verification**

Run: `pnpm test`
Expected: PASS

Run: `pnpm lint`
Expected: PASS

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`
Expected: PASS

- [ ] **Step 2: Inspect generated static output**

Check these files exist:

```bash
find dist -maxdepth 3 -type f | sort | rg "index.html|blog|archive|tags"
```

Expected: includes homepage, blog index, article pages, archive page, tag pages, and sitemap files

- [ ] **Step 3: Commit final polish**

```bash
git add README.md
git commit -m "docs: update portal blog usage" || true
```
