# Shell-Only I18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Chinese, English, and Japanese site-shell localization with Chinese as the default root locale, while keeping Typst blog content single-language.

**Architecture:** Introduce a small i18n layer for locale config, route-prefix helpers, dictionaries, and localized shell data. Refactor the current pages into shared locale-aware view components so the default Chinese routes and the prefixed English/Japanese routes can render the same post content with different shell copy and SEO metadata.

**Tech Stack:** TypeScript, Astro, Svelte, astro-typst, Node test runner, terminal.css

---

## File Structure

- Create: `src/i18n/config.ts`
- Create: `src/i18n/dictionary.ts`
- Create: `src/i18n/locales/zh-CN.ts`
- Create: `src/i18n/locales/en.ts`
- Create: `src/i18n/locales/ja.ts`
- Create: `src/i18n/static-paths.ts`
- Create: `src/components/LanguageSwitcher.astro`
- Create: `src/views/HomePage.astro`
- Create: `src/views/BlogIndexPage.astro`
- Create: `src/views/BlogPostPage.astro`
- Create: `src/views/TagPage.astro`
- Create: `src/views/ArchivePage.astro`
- Create: `src/pages/[locale]/index.astro`
- Create: `src/pages/[locale]/blog/index.astro`
- Create: `src/pages/[locale]/blog/[slug].astro`
- Create: `src/pages/[locale]/tags/[tag].astro`
- Create: `src/pages/[locale]/archive.astro`
- Create: `tests/i18n.test.ts`
- Modify: `src/data/profile.ts`
- Modify: `src/data/sites.ts`
- Modify: `src/components/PostList.astro`
- Modify: `src/components/PostPagination.astro`
- Modify: `src/components/ProfilePanel.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SitesCommandPanel.svelte`
- Modify: `src/components/TagList.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/tags/[tag].astro`
- Modify: `src/pages/archive.astro`

## Responsibilities

- `src/i18n/config.ts`: locale constants, prefix mapping, locale path helpers, alternate-link generation
- `src/i18n/dictionary.ts` and `src/i18n/locales/*.ts`: localized shell strings and metadata copy
- `src/i18n/static-paths.ts`: secondary-locale route param helpers for `[locale]` pages
- `src/data/profile.ts` and `src/data/sites.ts`: locale-aware homepage data
- `src/components/*.astro` and `src/components/*.svelte`: locale-aware shell UI
- `src/views/*.astro`: shared page composition used by both the default locale and prefixed locales
- `src/pages/*`: thin route wrappers that load locale, fetch post data, and pass localized props into shared views
- `tests/i18n.test.ts`: unit coverage for locale routing and localized data lookup

### Task 1: Locale Routing Helpers

**Files:**

- Create: `src/i18n/config.ts`
- Test: `tests/i18n.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/i18n.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import {
    buildAlternateLinks,
    defaultLocale,
    localeDisplayNames,
    secondaryLocales,
    stripLocaleFromPathname,
    toLocalePath,
} from "../src/i18n/config.ts";

test("default locale stays on the root path", () => {
    assert.equal(defaultLocale, "zh-CN");
    assert.equal(toLocalePath("zh-CN", "/blog"), "/blog");
});

test("secondary locales add the correct prefix", () => {
    assert.equal(
        toLocalePath("en", "/blog/hello-terminal"),
        "/en/blog/hello-terminal",
    );
    assert.equal(toLocalePath("ja", "/tags/site"), "/ja/tags/site");
});

test("stripLocaleFromPathname removes locale prefixes and keeps default locale on root", () => {
    assert.deepEqual(stripLocaleFromPathname("/"), {
        locale: "zh-CN",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/en/blog/hello-terminal"), {
        locale: "en",
        pathnameWithoutLocale: "/blog/hello-terminal",
    });
});

test("buildAlternateLinks returns zh-CN, en, and ja siblings for the same page", () => {
    assert.deepEqual(buildAlternateLinks("/ja/blog/hello-terminal"), [
        {
            locale: "zh-CN",
            href: "/blog/hello-terminal",
            label: "中文",
            lang: "zh-CN",
        },
        {
            locale: "en",
            href: "/en/blog/hello-terminal",
            label: "English",
            lang: "en",
        },
        {
            locale: "ja",
            href: "/ja/blog/hello-terminal",
            label: "日本語",
            lang: "ja",
        },
    ]);
});

test("secondaryLocales and localeDisplayNames expose the supported non-default locales", () => {
    assert.deepEqual(secondaryLocales, ["en", "ja"]);
    assert.equal(localeDisplayNames["zh-CN"], "中文");
    assert.equal(localeDisplayNames.en, "English");
    assert.equal(localeDisplayNames.ja, "日本語");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`

Expected: FAIL with module-not-found for `src/i18n/config.ts`

- [ ] **Step 3: Write minimal implementation**

Create `src/i18n/config.ts`:

```ts
export const locales = ["zh-CN", "en", "ja"] as const;
export type Locale = (typeof locales)[number];
export type SecondaryLocale = Exclude<Locale, "zh-CN">;

export const defaultLocale: Locale = "zh-CN";
export const secondaryLocales: SecondaryLocale[] = ["en", "ja"];

export const localeDisplayNames: Record<Locale, string> = {
    "zh-CN": "中文",
    en: "English",
    ja: "日本語",
};

const localePrefixes: Record<Locale, string> = {
    "zh-CN": "",
    en: "/en",
    ja: "/ja",
};

export type AlternateLink = {
    locale: Locale;
    href: string;
    label: string;
    lang: string;
};

export function isLocale(value: string): value is Locale {
    return locales.includes(value as Locale);
}

export function isSecondaryLocale(value: string): value is SecondaryLocale {
    return secondaryLocales.includes(value as SecondaryLocale);
}

export function stripLocaleFromPathname(pathname: string): {
    locale: Locale;
    pathnameWithoutLocale: string;
} {
    const normalized = pathname === "" ? "/" : pathname;

    for (const locale of secondaryLocales) {
        const prefix = localePrefixes[locale];
        if (normalized === prefix) {
            return { locale, pathnameWithoutLocale: "/" };
        }
        if (normalized.startsWith(`${prefix}/`)) {
            return {
                locale,
                pathnameWithoutLocale: normalized.slice(prefix.length),
            };
        }
    }

    return {
        locale: defaultLocale,
        pathnameWithoutLocale: normalized,
    };
}

export function toLocalePath(locale: Locale, pathname: string): string {
    const normalized = pathname === "" ? "/" : pathname;
    const prefix = localePrefixes[locale];
    if (locale === defaultLocale) return normalized;
    return normalized === "/" ? prefix : `${prefix}${normalized}`;
}

export function buildAlternateLinks(pathname: string): AlternateLink[] {
    const { pathnameWithoutLocale } = stripLocaleFromPathname(pathname);
    return locales.map((locale) => ({
        locale,
        href: toLocalePath(locale, pathnameWithoutLocale),
        label: localeDisplayNames[locale],
        lang: locale,
    }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`

Expected: PASS with `tests/post-data.test.ts` and `tests/i18n.test.ts` both green

- [ ] **Step 5: Commit**

```bash
git add src/i18n/config.ts tests/i18n.test.ts
git commit -m "feat: add i18n routing helpers"
```

### Task 2: Dictionaries And Localized Shell Data

**Files:**

- Create: `src/i18n/dictionary.ts`
- Create: `src/i18n/locales/zh-CN.ts`
- Create: `src/i18n/locales/en.ts`
- Create: `src/i18n/locales/ja.ts`
- Modify: `src/data/profile.ts`
- Modify: `src/data/sites.ts`
- Test: `tests/i18n.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/i18n.test.ts`:

```ts
import { getProfile } from "../src/data/profile.ts";
import { getSites } from "../src/data/sites.ts";
import { getDictionary } from "../src/i18n/dictionary.ts";

test("dictionary, profile, and site data resolve translated shell copy", () => {
    assert.equal(getDictionary("zh-CN").nav.blog, "博客");
    assert.equal(getDictionary("en").nav.blog, "Blog");
    assert.equal(getDictionary("ja").nav.blog, "ブログ");

    assert.equal(
        getProfile("en").links.find((link) => link.href === "/blog")?.label,
        "Blog",
    );
    assert.equal(getProfile("ja").eyebrow, "プロフィール");

    assert.equal(getSites("zh-CN")[1].name, "归档");
    assert.equal(
        getSites("en")[1].description,
        "Chronological index of everything already published.",
    );
    assert.equal(getSites("ja")[2].name, "タグ");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`

Expected: FAIL with missing exports for `getDictionary`, `getProfile`, or `getSites`

- [ ] **Step 3: Implement the dictionaries**

Create `src/i18n/dictionary.ts`:

```ts
import type { Locale } from "./config";
import { en } from "./locales/en";
import { ja } from "./locales/ja";
import { zhCN } from "./locales/zh-CN";

export type SiteDictionary = typeof zhCN;

const dictionaries: Record<Locale, SiteDictionary> = {
    "zh-CN": zhCN,
    en,
    ja,
};

export function getDictionary(locale: Locale): SiteDictionary {
    return dictionaries[locale];
}
```

Create `src/i18n/locales/zh-CN.ts`:

```ts
export const zhCN = {
    lang: "zh-CN",
    brand: {
        name: "Hobr.SITE",
        meta: "静态门户 / 博客 / Typst 日志",
        switcherLabel: "语言切换",
    },
    nav: {
        home: "首页",
        blog: "博客",
        archive: "归档",
    },
    common: {
        noPosts: "暂时还没有文章。",
    },
    home: {
        metaTitle: "Hobr.SITE / 个人首页",
        metaDescription: "个人门户首页，包含简介、站点导航和最新文章。",
        eyebrow: "启动完成",
        heading: "一个用于发布代码与写作日志的终端门户。",
        copy: "这里是入口页。左侧是身份信息，右侧是旗下站点导航，下方只展示最新文章。完整内容在 /blog。",
        profileTitle: "PROFILE",
        profileSubtitle: "whoami && cat profile.txt",
        sitesTitle: "SITE INDEX",
        sitesSubtitle: "ls ~/sites && open <target>",
        latestTitle: "LATEST POSTS",
        latestSubtitle: "tail -n 5 journal.log",
        viewAll: "查看全部文章",
    },
    blogIndex: {
        metaTitle: "Hobr.SITE / 博客",
        metaDescription: "按时间倒序排列的完整博客文章列表。",
        eyebrow: "博客索引",
        heading: "所有已发布文章。",
        copy: "首页只展示最新几篇，这里是完整日志流，并提供标签和归档入口。",
        listTitle: "ALL POSTS",
        listSubtitle: "ls -lt ./posts",
        navTitle: "NAV",
        navSubtitle: "jump targets",
        openArchive: "打开 /archive",
        openTag: (tag: string) => `打开 /tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.SITE / 归档",
        metaDescription: "按年份整理的全部博客归档。",
        eyebrow: "归档",
        heading: "按年份整理的日志。",
        copy: "当标签太窄、时间线太平时，可以从归档页回看全部内容。",
        panelTitle: "ARCHIVE",
        panelSubtitle: "group by year",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.SITE / #${tag}`,
        metaDescription: (tag: string) => `标签 ${tag} 下的文章列表。`,
        eyebrow: "标签视图",
        heading: (tag: string) => `#${tag}`,
        copy: "这是单一主题的聚合视图，返回 /blog 可以看到完整文章流。",
        panelTitle: "TAG RESULTS",
        panelSubtitle: (tag: string) => `grep -r ${tag} ./posts`,
        empty: "这个标签下还没有文章。",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.SITE / ${title}`,
        metaDescription: (title: string) => `阅读《${title}》这篇文章。`,
        eyebrow: "文章",
        intro: (dateLabel: string) =>
            `发布于 ${dateLabel}。你可以返回 /blog 或通过下方标签继续浏览。`,
        articleTitle: "ARTICLE",
        metaTitleLabel: "POST META",
        metaSubtitle: "tags && navigation",
        previous: "上一篇",
        next: "下一篇",
        startOfLog: "这是最早的一篇",
        latestEntry: "已经到达最新一篇",
    },
} as const;
```

Create `src/i18n/locales/en.ts`:

```ts
export const en = {
    lang: "en",
    brand: {
        name: "Hobr.SITE",
        meta: "static portal / blog / typst logs",
        switcherLabel: "Language switcher",
    },
    nav: {
        home: "Home",
        blog: "Blog",
        archive: "Archive",
    },
    common: {
        noPosts: "No posts published yet.",
    },
    home: {
        metaTitle: "Hobr.SITE / Personal Portal",
        metaDescription:
            "Personal portal homepage with profile, site navigation, and latest posts.",
        eyebrow: "boot sequence complete",
        heading: "A terminal portal for shipping code and writing logs.",
        copy: "This is the entry point. Identity on the left, owned-site links on the right, and only the freshest posts below. Full long-form content lives at /blog.",
        profileTitle: "PROFILE",
        profileSubtitle: "whoami && cat profile.txt",
        sitesTitle: "SITE INDEX",
        sitesSubtitle: "ls ~/sites && open <target>",
        latestTitle: "LATEST POSTS",
        latestSubtitle: "tail -n 5 journal.log",
        viewAll: "View all posts",
    },
    blogIndex: {
        metaTitle: "Hobr.SITE / Blog",
        metaDescription: "Full list of blog posts sorted by date.",
        eyebrow: "blog index",
        heading: "Every published entry.",
        copy: "The homepage only shows a short tail. This page is the full chronological log, with tag and archive shortcuts for deeper browsing.",
        listTitle: "ALL POSTS",
        listSubtitle: "ls -lt ./posts",
        navTitle: "NAV",
        navSubtitle: "jump targets",
        openArchive: "open /archive",
        openTag: (tag: string) => `open /tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.SITE / Archive",
        metaDescription: "Year-grouped archive of all posts.",
        eyebrow: "archive",
        heading: "Year-grouped logbook.",
        copy: "A slower browsing mode for revisiting everything in order.",
        panelTitle: "ARCHIVE",
        panelSubtitle: "group by year",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.SITE / #${tag}`,
        metaDescription: (tag: string) => `Posts tagged ${tag} on Hobr.SITE.`,
        eyebrow: "tag view",
        heading: (tag: string) => `#${tag}`,
        copy: "A filtered stream for one topic. Go back to /blog for the full list.",
        panelTitle: "TAG RESULTS",
        panelSubtitle: (tag: string) => `grep -r ${tag} ./posts`,
        empty: "No posts found for this tag.",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.SITE / ${title}`,
        metaDescription: (title: string) => `Read ${title} on Hobr.SITE.`,
        eyebrow: "post entry",
        intro: (dateLabel: string) =>
            `Published ${dateLabel}. Return to /blog or keep browsing through tags below.`,
        articleTitle: "ARTICLE",
        metaTitleLabel: "POST META",
        metaSubtitle: "tags && navigation",
        previous: "previous",
        next: "next",
        startOfLog: "Start of the log",
        latestEntry: "Latest entry reached",
    },
} as const;
```

Create `src/i18n/locales/ja.ts`:

```ts
export const ja = {
    lang: "ja",
    brand: {
        name: "Hobr.SITE",
        meta: "静的ポータル / ブログ / Typst ログ",
        switcherLabel: "言語切替",
    },
    nav: {
        home: "ホーム",
        blog: "ブログ",
        archive: "アーカイブ",
    },
    common: {
        noPosts: "まだ記事はありません。",
    },
    home: {
        metaTitle: "Hobr.SITE / ポータル",
        metaDescription:
            "プロフィール、サイト案内、最新記事をまとめた個人ポータル。",
        eyebrow: "起動完了",
        heading: "コードと文章を公開するためのターミナル風ポータル。",
        copy: "ここが入口です。左にプロフィール、右に自分のサイト案内、下に最新記事だけを置きます。長文コンテンツは /blog に集約します。",
        profileTitle: "PROFILE",
        profileSubtitle: "whoami && cat profile.txt",
        sitesTitle: "SITE INDEX",
        sitesSubtitle: "ls ~/sites && open <target>",
        latestTitle: "LATEST POSTS",
        latestSubtitle: "tail -n 5 journal.log",
        viewAll: "すべての記事を見る",
    },
    blogIndex: {
        metaTitle: "Hobr.SITE / ブログ",
        metaDescription: "公開済み記事の一覧ページ。",
        eyebrow: "ブログ一覧",
        heading: "公開済みの記事一覧。",
        copy: "ホームには最新数件だけを表示し、このページでは全文字列を時系列でまとめて確認できます。",
        listTitle: "ALL POSTS",
        listSubtitle: "ls -lt ./posts",
        navTitle: "NAV",
        navSubtitle: "jump targets",
        openArchive: "open /archive",
        openTag: (tag: string) => `open /tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.SITE / アーカイブ",
        metaDescription: "年ごとに整理した記事アーカイブ。",
        eyebrow: "アーカイブ",
        heading: "年単位のログブック。",
        copy: "タグより広く、一覧より静かな見方が必要なときのためのページです。",
        panelTitle: "ARCHIVE",
        panelSubtitle: "group by year",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.SITE / #${tag}`,
        metaDescription: (tag: string) => `タグ ${tag} の記事一覧。`,
        eyebrow: "タグビュー",
        heading: (tag: string) => `#${tag}`,
        copy: "一つの話題だけを追いたいときのフィルタ表示です。全体を見るなら /blog に戻ります。",
        panelTitle: "TAG RESULTS",
        panelSubtitle: (tag: string) => `grep -r ${tag} ./posts`,
        empty: "このタグの記事はまだありません。",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.SITE / ${title}`,
        metaDescription: (title: string) => `${title} を読む。`,
        eyebrow: "記事",
        intro: (dateLabel: string) =>
            `${dateLabel} に公開。/blog に戻るか、下のタグから続けて読めます。`,
        articleTitle: "ARTICLE",
        metaTitleLabel: "POST META",
        metaSubtitle: "tags && navigation",
        previous: "前の記事",
        next: "次の記事",
        startOfLog: "これが最初の記事です",
        latestEntry: "最新の記事に到達しました",
    },
} as const;
```

- [ ] **Step 4: Localize the homepage shell data**

Modify `src/data/profile.ts`:

```ts
import type { Locale } from "../i18n/config";

export type ProfileData = {
    name: string;
    eyebrow: string;
    role: string;
    bio: string;
    avatar: string;
    stack: string[];
    links: Array<{ label: string; href: string }>;
};

const profiles: Record<Locale, ProfileData> = {
    "zh-CN": {
        name: "Hobr",
        eyebrow: "会话资料",
        role: "软件折腾者 / 静态站构建者 / Typst 写作者",
        bio: "我会做静态工具、终端风界面，以及那些我真正上线过的系统的长篇记录。这个站点是我用来写作、发布和串联其他作品的控制台。",
        avatar: "/avatar.svg",
        stack: ["TypeScript", "Astro", "Svelte", "Typst", "Nix"],
        links: [
            { label: "GitHub", href: "https://github.com" },
            { label: "邮箱", href: "mailto:hello@hobr.site" },
            { label: "博客", href: "/blog" },
        ],
    },
    en: {
        name: "Hobr",
        eyebrow: "session profile",
        role: "Software tinkerer / static site builder / typst writer",
        bio: "I build static tools, terminal-flavored interfaces, and long-form notes about the systems I actually ship. This site is my control panel for writing, publishing, and linking the rest of my work together.",
        avatar: "/avatar.svg",
        stack: ["TypeScript", "Astro", "Svelte", "Typst", "Nix"],
        links: [
            { label: "GitHub", href: "https://github.com" },
            { label: "Email", href: "mailto:hello@hobr.site" },
            { label: "Blog", href: "/blog" },
        ],
    },
    ja: {
        name: "Hobr",
        eyebrow: "プロフィール",
        role: "ソフトウェア実験者 / 静的サイト構築者 / Typst ライター",
        bio: "私は静的ツール、ターミナル風 UI、そして実際に公開したシステムの長文メモを書いています。このサイトは、その作業をまとめるためのコントロールパネルです。",
        avatar: "/avatar.svg",
        stack: ["TypeScript", "Astro", "Svelte", "Typst", "Nix"],
        links: [
            { label: "GitHub", href: "https://github.com" },
            { label: "メール", href: "mailto:hello@hobr.site" },
            { label: "ブログ", href: "/blog" },
        ],
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}
```

Modify `src/data/sites.ts`:

```ts
import type { Locale } from "../i18n/config";

export type LocalizedSiteCommand = {
    command: string;
    name: string;
    description: string;
    href: string;
};

const siteSets: Record<Locale, LocalizedSiteCommand[]> = {
    "zh-CN": [
        {
            command: "open blog",
            name: "博客",
            description: "长文笔记、构建日志和写作实验。",
            href: "/blog",
        },
        {
            command: "open archive",
            name: "归档",
            description: "按时间顺序查看所有已发布内容。",
            href: "/archive",
        },
        {
            command: "open tags/site",
            name: "标签",
            description: "直接跳到与站点构建有关的文章。",
            href: "/tags/site",
        },
    ],
    en: [
        {
            command: "open blog",
            name: "Blog",
            description:
                "Long-form notes, build logs, and writing experiments.",
            href: "/blog",
        },
        {
            command: "open archive",
            name: "Archive",
            description: "Chronological index of everything already published.",
            href: "/archive",
        },
        {
            command: "open tags/site",
            name: "Tag View",
            description: "Jump directly into the site-building posts.",
            href: "/tags/site",
        },
    ],
    ja: [
        {
            command: "open blog",
            name: "ブログ",
            description: "長文メモ、構築ログ、文章実験をまとめた場所。",
            href: "/blog",
        },
        {
            command: "open archive",
            name: "アーカイブ",
            description: "公開済みコンテンツを時系列で一覧できます。",
            href: "/archive",
        },
        {
            command: "open tags/site",
            name: "タグ",
            description: "サイト構築に関する記事へ直接移動します。",
            href: "/tags/site",
        },
    ],
};

export function getSites(locale: Locale): LocalizedSiteCommand[] {
    return siteSets[locale];
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test`

Expected: PASS with all i18n and post-data tests green

- [ ] **Step 6: Commit**

```bash
git add src/i18n src/data/profile.ts src/data/sites.ts tests/i18n.test.ts
git commit -m "feat: add shell i18n dictionaries"
```

### Task 3: Localized Shell Components And Shared View Components

**Files:**

- Create: `src/components/LanguageSwitcher.astro`
- Create: `src/views/HomePage.astro`
- Create: `src/views/BlogIndexPage.astro`
- Create: `src/views/BlogPostPage.astro`
- Create: `src/views/TagPage.astro`
- Create: `src/views/ArchivePage.astro`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/components/PostList.astro`
- Modify: `src/components/PostPagination.astro`
- Modify: `src/components/ProfilePanel.astro`
- Modify: `src/components/SiteHeader.astro`
- Modify: `src/components/SitesCommandPanel.svelte`
- Modify: `src/components/TagList.astro`
- Modify: `src/styles/global.css`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[slug].astro`
- Modify: `src/pages/tags/[tag].astro`
- Modify: `src/pages/archive.astro`

- [ ] **Step 1: Write the failing integration**

Refactor `src/pages/index.astro` to delegate to a not-yet-created `src/views/HomePage.astro`:

```astro
---
import HomePage from "../views/HomePage.astro";
import { getProfile } from "../data/profile";
import { getSites } from "../data/sites";
import { defaultLocale, buildAlternateLinks } from "../i18n/config";
import { getDictionary } from "../i18n/dictionary";
import { getLatestPosts } from "../lib/posts";

const locale = defaultLocale;
const dictionary = getDictionary(locale);
const latestPosts = await getLatestPosts(5);
const profile = getProfile(locale);
const sites = getSites(locale);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<HomePage
    locale={locale}
    dictionary={dictionary}
    latestPosts={latestPosts}
    profile={profile}
    sites={sites}
    alternateLinks={alternateLinks}
/>
```

- [ ] **Step 2: Run build to verify it fails**

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`

Expected: FAIL with module-not-found for `src/views/HomePage.astro`

- [ ] **Step 3: Implement localized shell plumbing**

Create `src/components/LanguageSwitcher.astro`:

```astro
---
import type { AlternateLink, Locale } from "../i18n/config";

interface Props {
    currentLocale: Locale;
    label: string;
    alternateLinks: AlternateLink[];
}

const { currentLocale, label, alternateLinks } = Astro.props;
---

<div class="language-switcher" aria-label={label}>
    {
        alternateLinks.map((link) => (
            <a
                class:list={[
                    "language-switcher__link",
                    { "is-active": link.locale === currentLocale },
                ]}
                href={link.href}
                hreflang={link.lang}
                lang={link.lang}
            >
                {link.label}
            </a>
        ))
    }
</div>
```

Modify `src/layouts/Layout.astro`:

```astro
---
import SiteHeader from "../components/SiteHeader.astro";
import type { AlternateLink, Locale } from "../i18n/config";
import type { SiteDictionary } from "../i18n/dictionary";
import "../styles/global.css";

interface Props {
    title: string;
    description: string;
    locale: Locale;
    dictionary: SiteDictionary;
    alternateLinks: AlternateLink[];
    canonicalPath?: string;
}

const {
    title,
    description,
    locale,
    dictionary,
    alternateLinks,
    canonicalPath = Astro.url.pathname,
} = Astro.props;

const siteBase = Astro.site ?? Astro.url;
const canonical = new URL(canonicalPath, siteBase).href;
---

<!doctype html>
<html lang={locale}>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="sitemap" href="/sitemap-index.xml" />
        <link rel="canonical" href={canonical} />
        {
            alternateLinks.map((link) => (
                <link
                    rel="alternate"
                    hreflang={link.lang}
                    href={new URL(link.href, siteBase).href}
                />
            ))
        }
        <meta name="generator" content={Astro.generator} />
        <meta name="description" content={description} />
        <title>{title}</title>
    </head>
    <body>
        <div class="site-shell">
            <SiteHeader
                locale={locale}
                dictionary={dictionary}
                alternateLinks={alternateLinks}
            />
            <slot />
        </div>
    </body>
</html>
```

Modify `src/components/SiteHeader.astro`:

```astro
---
import LanguageSwitcher from "./LanguageSwitcher.astro";
import type { AlternateLink, Locale } from "../i18n/config";
import type { SiteDictionary } from "../i18n/dictionary";
import { toLocalePath } from "../i18n/config";

interface Props {
    locale: Locale;
    dictionary: SiteDictionary;
    alternateLinks: AlternateLink[];
}

const { locale, dictionary, alternateLinks } = Astro.props;

const links = [
    { href: toLocalePath(locale, "/"), label: dictionary.nav.home },
    { href: toLocalePath(locale, "/blog"), label: dictionary.nav.blog },
    { href: toLocalePath(locale, "/archive"), label: dictionary.nav.archive },
];
---

<header class="site-header">
    <div class="site-header__inner">
        <div class="site-brand">
            <p class="site-brand__name">{dictionary.brand.name}</p>
            <span class="site-brand__meta">{dictionary.brand.meta}</span>
        </div>
        <nav class="site-nav" aria-label="Primary">
            {
                links.map((link) => (
                    <a class="site-nav__link" href={link.href}>
                        <span>&gt;</span>
                        <span>{link.label}</span>
                    </a>
                ))
            }
        </nav>
        <LanguageSwitcher
            currentLocale={locale}
            label={dictionary.brand.switcherLabel}
            alternateLinks={alternateLinks}
        />
    </div>
</header>
```

Modify `src/components/ProfilePanel.astro`:

```astro
---
import type { ProfileData } from "../data/profile";

interface Props {
    profile: ProfileData;
}

const { profile } = Astro.props;
---

<div class="profile-panel">
    <div class="profile-panel__top">
        <div class="profile-panel__avatar">
            <img src={profile.avatar} alt={`${profile.name} avatar`} />
        </div>
        <div>
            <p class="profile-panel__eyebrow">{profile.eyebrow}</p>
            <h1 class="profile-panel__name">{profile.name}</h1>
            <p class="profile-panel__role">{profile.role}</p>
        </div>
    </div>
    <p class="profile-panel__bio">{profile.bio}</p>
    <ul class="chip-list" aria-label="Stack">
        {profile.stack.map((item) => <li class="chip">{item}</li>)}
    </ul>
    <ul class="link-list" aria-label="Links">
        {
            profile.links.map((link) => (
                <li>
                    <a class="profile-link" href={link.href}>
                        {link.label}
                    </a>
                </li>
            ))
        }
    </ul>
</div>
```

Modify `src/components/SitesCommandPanel.svelte`:

```svelte
<script lang="ts">
    import type { LocalizedSiteCommand } from "../data/sites";

    type Props = {
        sites?: LocalizedSiteCommand[];
        label?: string;
    };

    let { sites = [], label = "Owned sites" }: Props = $props();
</script>

<ul class="site-command-list" aria-label={label}>
    {#each sites as site (site.href)}
        <li>
            <a class="site-command" href={site.href}>
                <span class="site-command__line">
                    <span class="site-command__prompt">$</span>
                    <span>{site.command}</span>
                    <span class="site-command__name">[{site.name}]</span>
                </span>
                <span class="site-command__desc">{site.description}</span>
            </a>
        </li>
    {/each}
</ul>
```

Modify `src/components/PostList.astro`:

```astro
---
import type { Locale } from "../i18n/config";
import { toLocalePath } from "../i18n/config";
import type { BlogPost } from "../lib/posts";

interface Props {
    posts: BlogPost[];
    locale: Locale;
    emptyMessage?: string;
}

const { posts, locale, emptyMessage = "No posts found." } = Astro.props;
---

{
    posts.length > 0 ? (
        <ul class="post-list">
            {posts.map((post) => (
                <li class="post-list__item">
                    <a
                        class="post-link"
                        href={toLocalePath(locale, `/blog/${post.slug}`)}
                    >
                        <h2 class="post-link__title">{post.title}</h2>
                        <span class="post-link__date">{post.dateLabel}</span>
                    </a>
                </li>
            ))}
        </ul>
    ) : (
        <p class="empty-state">{emptyMessage}</p>
    )
}
```

Modify `src/components/TagList.astro`:

```astro
---
import type { Locale } from "../i18n/config";
import { toLocalePath } from "../i18n/config";

interface Props {
    tags: string[];
    locale: Locale;
}

const { tags, locale } = Astro.props;
---

<ul class="tag-list" aria-label="Tags">
    {
        tags.map((tag) => (
            <li>
                <a
                    class="tag-list__link"
                    href={toLocalePath(
                        locale,
                        `/tags/${encodeURIComponent(tag)}`,
                    )}
                >
                    #{tag}
                </a>
            </li>
        ))
    }
</ul>
```

Modify `src/components/PostPagination.astro`:

```astro
---
import type { Locale } from "../i18n/config";
import { toLocalePath } from "../i18n/config";
import type { BlogPost } from "../lib/posts";

interface Props {
    locale: Locale;
    previous?: BlogPost;
    next?: BlogPost;
    previousLabel: string;
    nextLabel: string;
    emptyPreviousLabel: string;
    emptyNextLabel: string;
}

const {
    locale,
    previous,
    next,
    previousLabel,
    nextLabel,
    emptyPreviousLabel,
    emptyNextLabel,
} = Astro.props;
---

<div class="post-pagination">
    {
        previous ? (
            <a
                class="post-pagination__link"
                href={toLocalePath(locale, `/blog/${previous.slug}`)}
            >
                <span class="post-pagination__direction">{previousLabel}</span>
                <strong>{previous.title}</strong>
            </a>
        ) : (
            <div class="post-pagination__empty">
                <span class="post-pagination__direction">{previousLabel}</span>
                <strong>{emptyPreviousLabel}</strong>
            </div>
        )
    }
    {
        next ? (
            <a
                class="post-pagination__link"
                href={toLocalePath(locale, `/blog/${next.slug}`)}
            >
                <span class="post-pagination__direction">{nextLabel}</span>
                <strong>{next.title}</strong>
            </a>
        ) : (
            <div class="post-pagination__empty">
                <span class="post-pagination__direction">{nextLabel}</span>
                <strong>{emptyNextLabel}</strong>
            </div>
        )
    }
</div>
```

- [ ] **Step 4: Implement shared page view components and refactor the default Chinese routes**

Create `src/views/HomePage.astro`:

```astro
---
import Layout from "../layouts/Layout.astro";
import PostList from "../components/PostList.astro";
import ProfilePanel from "../components/ProfilePanel.astro";
import SitesCommandPanel from "../components/SitesCommandPanel.svelte";
import TerminalWindow from "../components/TerminalWindow.astro";
import type { ProfileData } from "../data/profile";
import type { LocalizedSiteCommand } from "../data/sites";
import type { AlternateLink, Locale } from "../i18n/config";
import { toLocalePath } from "../i18n/config";
import type { SiteDictionary } from "../i18n/dictionary";
import type { BlogPost } from "../lib/posts";

interface Props {
    locale: Locale;
    dictionary: SiteDictionary;
    latestPosts: BlogPost[];
    profile: ProfileData;
    sites: LocalizedSiteCommand[];
    alternateLinks: AlternateLink[];
}

const { locale, dictionary, latestPosts, profile, sites, alternateLinks } =
    Astro.props;
---

<Layout
    title={dictionary.home.metaTitle}
    description={dictionary.home.metaDescription}
    locale={locale}
    dictionary={dictionary}
    alternateLinks={alternateLinks}
>
    <main class="page-shell">
        <section class="page-intro">
            <p class="page-eyebrow">{dictionary.home.eyebrow}</p>
            <h1 class="page-title">{dictionary.home.heading}</h1>
            <p class="page-copy">{dictionary.home.copy}</p>
        </section>

        <section class="portal-grid">
            <TerminalWindow
                title={dictionary.home.profileTitle}
                subtitle={dictionary.home.profileSubtitle}
            >
                <ProfilePanel profile={profile} />
            </TerminalWindow>

            <TerminalWindow
                title={dictionary.home.sitesTitle}
                subtitle={dictionary.home.sitesSubtitle}
            >
                <SitesCommandPanel
                    sites={sites}
                    label={dictionary.home.sitesTitle}
                />
            </TerminalWindow>
        </section>

        <section style="margin-top: 1rem;">
            <TerminalWindow
                title={dictionary.home.latestTitle}
                subtitle={dictionary.home.latestSubtitle}
            >
                <PostList
                    posts={latestPosts}
                    locale={locale}
                    emptyMessage={dictionary.common.noPosts}
                />
                <div class="panel-actions">
                    <a
                        class="profile-link"
                        href={toLocalePath(locale, "/blog")}
                    >
                        {dictionary.home.viewAll}
                    </a>
                </div>
            </TerminalWindow>
        </section>
    </main>
</Layout>
```

Modify `src/styles/global.css` to add language-switcher styles:

```css
.language-switcher {
    display: inline-flex;
    gap: 0.45rem;
    flex-wrap: wrap;
}

.language-switcher__link {
    border: 1px solid var(--surface-border);
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
    text-decoration: none;
    color: var(--text-main);
    font-size: 0.82rem;
}

.language-switcher__link.is-active {
    border-color: var(--accent-cyan);
    color: var(--accent-cyan);
}
```

Create `src/views/BlogIndexPage.astro`:

```astro
---
import PostList from "../components/PostList.astro";
import TerminalWindow from "../components/TerminalWindow.astro";
import Layout from "../layouts/Layout.astro";
import type { AlternateLink, Locale } from "../i18n/config";
import { toLocalePath } from "../i18n/config";
import type { SiteDictionary } from "../i18n/dictionary";
import type { BlogPost } from "../lib/posts";

interface Props {
    locale: Locale;
    dictionary: SiteDictionary;
    posts: BlogPost[];
    tags: string[];
    alternateLinks: AlternateLink[];
}

const { locale, dictionary, posts, tags, alternateLinks } = Astro.props;
---

<Layout
    title={dictionary.blogIndex.metaTitle}
    description={dictionary.blogIndex.metaDescription}
    locale={locale}
    dictionary={dictionary}
    alternateLinks={alternateLinks}
>
    <main class="page-shell">
        <section class="page-intro">
            <p class="page-eyebrow">{dictionary.blogIndex.eyebrow}</p>
            <h1 class="page-title">{dictionary.blogIndex.heading}</h1>
            <p class="page-copy">{dictionary.blogIndex.copy}</p>
        </section>

        <section class="content-grid">
            <TerminalWindow
                title={dictionary.blogIndex.listTitle}
                subtitle={dictionary.blogIndex.listSubtitle}
            >
                <PostList
                    posts={posts}
                    locale={locale}
                    emptyMessage={dictionary.common.noPosts}
                />
            </TerminalWindow>

            <div class="side-nav">
                <TerminalWindow
                    title={dictionary.blogIndex.navTitle}
                    subtitle={dictionary.blogIndex.navSubtitle}
                >
                    <div class="side-nav">
                        <a
                            class="profile-link"
                            href={toLocalePath(locale, "/archive")}
                        >
                            {dictionary.blogIndex.openArchive}
                        </a>
                        {
                            tags.map((tag) => (
                                <a
                                    class="profile-link"
                                    href={toLocalePath(
                                        locale,
                                        `/tags/${encodeURIComponent(tag)}`,
                                    )}
                                >
                                    {dictionary.blogIndex.openTag(tag)}
                                </a>
                            ))
                        }
                    </div>
                </TerminalWindow>
            </div>
        </section>
    </main>
</Layout>
```

Create `src/views/BlogPostPage.astro`:

```astro
---
import PostPagination from "../components/PostPagination.astro";
import TagList from "../components/TagList.astro";
import TerminalWindow from "../components/TerminalWindow.astro";
import type { AlternateLink, Locale } from "../i18n/config";
import { toLocalePath, defaultLocale } from "../i18n/config";
import type { SiteDictionary } from "../i18n/dictionary";
import Layout from "../layouts/Layout.astro";
import type { BlogPost } from "../lib/posts";

interface Props {
    locale: Locale;
    dictionary: SiteDictionary;
    post: BlogPost;
    previous?: BlogPost;
    next?: BlogPost;
    Content: any;
    alternateLinks: AlternateLink[];
}

const { locale, dictionary, post, previous, next, Content, alternateLinks } =
    Astro.props;
---

<Layout
    title={dictionary.articlePage.metaTitle(post.title)}
    description={dictionary.articlePage.metaDescription(post.title)}
    locale={locale}
    dictionary={dictionary}
    alternateLinks={alternateLinks}
    canonicalPath={toLocalePath(defaultLocale, `/blog/${post.slug}`)}
>
    <main class="page-shell">
        <section class="page-intro">
            <p class="page-eyebrow">{dictionary.articlePage.eyebrow}</p>
            <h1 class="page-title">{post.title}</h1>
            <p class="page-copy">
                {dictionary.articlePage.intro(post.dateLabel)}
            </p>
        </section>

        <article class="article-shell">
            <TerminalWindow
                title={dictionary.articlePage.articleTitle}
                subtitle={toLocalePath(locale, `/blog/${post.slug}`)}
            >
                <div class="article-body">
                    <Content />
                </div>
            </TerminalWindow>

            <TerminalWindow
                title={dictionary.articlePage.metaTitleLabel}
                subtitle={dictionary.articlePage.metaSubtitle}
            >
                <div class="article-footer">
                    <TagList tags={post.tags} locale={locale} />
                    <PostPagination
                        locale={locale}
                        previous={previous}
                        next={next}
                        previousLabel={dictionary.articlePage.previous}
                        nextLabel={dictionary.articlePage.next}
                        emptyPreviousLabel={dictionary.articlePage.startOfLog}
                        emptyNextLabel={dictionary.articlePage.latestEntry}
                    />
                </div>
            </TerminalWindow>
        </article>
    </main>
</Layout>
```

Create `src/views/TagPage.astro`:

```astro
---
import PostList from "../components/PostList.astro";
import TerminalWindow from "../components/TerminalWindow.astro";
import type { AlternateLink, Locale } from "../i18n/config";
import type { SiteDictionary } from "../i18n/dictionary";
import Layout from "../layouts/Layout.astro";
import type { BlogPost } from "../lib/posts";

interface Props {
    locale: Locale;
    dictionary: SiteDictionary;
    tag: string;
    posts: BlogPost[];
    alternateLinks: AlternateLink[];
}

const { locale, dictionary, tag, posts, alternateLinks } = Astro.props;
---

<Layout
    title={dictionary.tagPage.metaTitle(tag)}
    description={dictionary.tagPage.metaDescription(tag)}
    locale={locale}
    dictionary={dictionary}
    alternateLinks={alternateLinks}
>
    <main class="page-shell">
        <section class="page-intro">
            <p class="page-eyebrow">{dictionary.tagPage.eyebrow}</p>
            <h1 class="page-title">{dictionary.tagPage.heading(tag)}</h1>
            <p class="page-copy">{dictionary.tagPage.copy}</p>
        </section>

        <TerminalWindow
            title={dictionary.tagPage.panelTitle}
            subtitle={dictionary.tagPage.panelSubtitle(tag)}
        >
            <PostList
                posts={posts}
                locale={locale}
                emptyMessage={dictionary.tagPage.empty}
            />
        </TerminalWindow>
    </main>
</Layout>
```

Create `src/views/ArchivePage.astro`:

```astro
---
import PostList from "../components/PostList.astro";
import TerminalWindow from "../components/TerminalWindow.astro";
import type { AlternateLink, Locale } from "../i18n/config";
import type { SiteDictionary } from "../i18n/dictionary";
import Layout from "../layouts/Layout.astro";
import type { BlogPost } from "../lib/posts";

interface Props {
    locale: Locale;
    dictionary: SiteDictionary;
    archiveGroups: Array<[string, BlogPost[]]>;
    alternateLinks: AlternateLink[];
}

const { locale, dictionary, archiveGroups, alternateLinks } = Astro.props;
---

<Layout
    title={dictionary.archive.metaTitle}
    description={dictionary.archive.metaDescription}
    locale={locale}
    dictionary={dictionary}
    alternateLinks={alternateLinks}
>
    <main class="page-shell">
        <section class="page-intro">
            <p class="page-eyebrow">{dictionary.archive.eyebrow}</p>
            <h1 class="page-title">{dictionary.archive.heading}</h1>
            <p class="page-copy">{dictionary.archive.copy}</p>
        </section>

        <TerminalWindow
            title={dictionary.archive.panelTitle}
            subtitle={dictionary.archive.panelSubtitle}
        >
            <div class="archive-groups">
                {
                    archiveGroups.map(([year, posts]) => (
                        <section class="archive-group">
                            <h2 class="archive-group__year">{year}</h2>
                            <PostList posts={posts} locale={locale} />
                        </section>
                    ))
                }
            </div>
        </TerminalWindow>
    </main>
</Layout>
```

Modify the default Chinese routes to use the shared views:

`src/pages/index.astro`

```astro
---
import HomePage from "../views/HomePage.astro";
import { getProfile } from "../data/profile";
import { getSites } from "../data/sites";
import { buildAlternateLinks, defaultLocale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionary";
import { getLatestPosts } from "../lib/posts";

const locale = defaultLocale;
const dictionary = getDictionary(locale);
const latestPosts = await getLatestPosts(5);
const profile = getProfile(locale);
const sites = getSites(locale);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<HomePage
    locale={locale}
    dictionary={dictionary}
    latestPosts={latestPosts}
    profile={profile}
    sites={sites}
    alternateLinks={alternateLinks}
/>
```

`src/pages/blog/index.astro`

```astro
---
import BlogIndexPage from "../../views/BlogIndexPage.astro";
import { buildAlternateLinks, defaultLocale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionary";
import { getAllPosts, getAllTags } from "../../lib/posts";

const locale = defaultLocale;
const dictionary = getDictionary(locale);
const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<BlogIndexPage
    locale={locale}
    dictionary={dictionary}
    posts={posts}
    tags={tags}
    alternateLinks={alternateLinks}
/>
```

`src/pages/blog/[slug].astro`

```astro
---
import { render } from "astro:content";
import BlogPostPage from "../../views/BlogPostPage.astro";
import { buildAlternateLinks, defaultLocale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionary";
import { getAdjacentPosts, getAllPosts, type BlogPost } from "../../lib/posts";

export async function getStaticPaths() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        params: { slug: post.slug },
        props: { post },
    }));
}

const locale = defaultLocale;
const dictionary = getDictionary(locale);
const { post } = Astro.props as { post: BlogPost };
const { Content } = await render(post.entry);
const { previous, next } = await getAdjacentPosts(post.slug);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<BlogPostPage
    locale={locale}
    dictionary={dictionary}
    post={post}
    previous={previous}
    next={next}
    Content={Content}
    alternateLinks={alternateLinks}
/>
```

`src/pages/tags/[tag].astro`

```astro
---
import TagPage from "../../views/TagPage.astro";
import { buildAlternateLinks, defaultLocale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionary";
import { getAllTags, getPostsByTag } from "../../lib/posts";

export async function getStaticPaths() {
    return (await getAllTags()).map((tag) => ({
        params: { tag },
        props: { tag },
    }));
}

const locale = defaultLocale;
const dictionary = getDictionary(locale);
const { tag } = Astro.props as { tag: string };
const posts = await getPostsByTag(tag);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<TagPage
    locale={locale}
    dictionary={dictionary}
    tag={tag}
    posts={posts}
    alternateLinks={alternateLinks}
/>
```

`src/pages/archive.astro`

```astro
---
import ArchivePage from "../views/ArchivePage.astro";
import { buildAlternateLinks, defaultLocale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionary";
import { getArchiveGroups } from "../lib/posts";

const locale = defaultLocale;
const dictionary = getDictionary(locale);
const archiveGroups = await getArchiveGroups();
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<ArchivePage
    locale={locale}
    dictionary={dictionary}
    archiveGroups={archiveGroups}
    alternateLinks={alternateLinks}
/>
```

- [ ] **Step 5: Run build to verify the default locale still works**

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`

Expected: PASS with the existing default-locale routes still generated:

- `/`
- `/blog`
- `/blog/<slug>`
- `/tags/<tag>`
- `/archive`

- [ ] **Step 6: Commit**

```bash
git add src/components src/layouts/Layout.astro src/styles/global.css src/views src/pages/index.astro src/pages/blog/index.astro src/pages/blog/[slug].astro src/pages/tags/[tag].astro src/pages/archive.astro
git commit -m "feat: localize default shell routes"
```

### Task 4: Secondary Locale Route Wrappers

**Files:**

- Create: `src/i18n/static-paths.ts`
- Create: `src/pages/[locale]/index.astro`
- Create: `src/pages/[locale]/blog/index.astro`
- Create: `src/pages/[locale]/blog/[slug].astro`
- Create: `src/pages/[locale]/tags/[tag].astro`
- Create: `src/pages/[locale]/archive.astro`
- Test: `tests/i18n.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/i18n.test.ts`:

```ts
import {
    assertSecondaryLocale,
    getSecondaryLocaleStaticPaths,
} from "../src/i18n/static-paths.ts";

test("secondary locale route helpers only expose en and ja", () => {
    assert.deepEqual(getSecondaryLocaleStaticPaths(), [
        { params: { locale: "en" }, props: { locale: "en" } },
        { params: { locale: "ja" }, props: { locale: "ja" } },
    ]);
    assert.equal(assertSecondaryLocale("en"), "en");
    assert.equal(assertSecondaryLocale("ja"), "ja");
    assert.throws(
        () => assertSecondaryLocale("zh-CN"),
        /Unsupported secondary locale/,
    );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`

Expected: FAIL with module-not-found for `src/i18n/static-paths.ts`

- [ ] **Step 3: Implement the route helper**

Create `src/i18n/static-paths.ts`:

```ts
import {
    isSecondaryLocale,
    secondaryLocales,
    type SecondaryLocale,
} from "./config";

export function getSecondaryLocaleStaticPaths() {
    return secondaryLocales.map((locale) => ({
        params: { locale },
        props: { locale },
    }));
}

export function assertSecondaryLocale(value: string): SecondaryLocale {
    if (!isSecondaryLocale(value)) {
        throw new Error(`Unsupported secondary locale: ${value}`);
    }
    return value;
}
```

- [ ] **Step 4: Add the secondary-locale route files**

Create `src/pages/[locale]/index.astro`:

```astro
---
import HomePage from "../../views/HomePage.astro";
import { getProfile } from "../../data/profile";
import { getSites } from "../../data/sites";
import { buildAlternateLinks, type Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionary";
import {
    assertSecondaryLocale,
    getSecondaryLocaleStaticPaths,
} from "../../i18n/static-paths";
import { getLatestPosts } from "../../lib/posts";

export function getStaticPaths() {
    return getSecondaryLocaleStaticPaths();
}

const locale = assertSecondaryLocale(
    (Astro.props as { locale: Locale }).locale,
);
const dictionary = getDictionary(locale);
const latestPosts = await getLatestPosts(5);
const profile = getProfile(locale);
const sites = getSites(locale);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<HomePage
    locale={locale}
    dictionary={dictionary}
    latestPosts={latestPosts}
    profile={profile}
    sites={sites}
    alternateLinks={alternateLinks}
/>
```

Create `src/pages/[locale]/blog/index.astro`:

```astro
---
import BlogIndexPage from "../../../views/BlogIndexPage.astro";
import { buildAlternateLinks, type Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/dictionary";
import {
    assertSecondaryLocale,
    getSecondaryLocaleStaticPaths,
} from "../../../i18n/static-paths";
import { getAllPosts, getAllTags } from "../../../lib/posts";

export function getStaticPaths() {
    return getSecondaryLocaleStaticPaths();
}

const locale = assertSecondaryLocale(
    (Astro.props as { locale: Locale }).locale,
);
const dictionary = getDictionary(locale);
const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<BlogIndexPage
    locale={locale}
    dictionary={dictionary}
    posts={posts}
    tags={tags}
    alternateLinks={alternateLinks}
/>
```

Create `src/pages/[locale]/blog/[slug].astro`:

```astro
---
import { render } from "astro:content";
import BlogPostPage from "../../../views/BlogPostPage.astro";
import {
    buildAlternateLinks,
    secondaryLocales,
    type Locale,
} from "../../../i18n/config";
import { getDictionary } from "../../../i18n/dictionary";
import { assertSecondaryLocale } from "../../../i18n/static-paths";
import {
    getAdjacentPosts,
    getAllPosts,
    type BlogPost,
} from "../../../lib/posts";

export async function getStaticPaths() {
    const posts = await getAllPosts();
    return secondaryLocales.flatMap((locale) =>
        posts.map((post) => ({
            params: { locale, slug: post.slug },
            props: { locale, post },
        })),
    );
}

const { locale: rawLocale, post } = Astro.props as {
    locale: Locale;
    post: BlogPost;
};
const locale = assertSecondaryLocale(rawLocale);
const dictionary = getDictionary(locale);
const { Content } = await render(post.entry);
const { previous, next } = await getAdjacentPosts(post.slug);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<BlogPostPage
    locale={locale}
    dictionary={dictionary}
    post={post}
    previous={previous}
    next={next}
    Content={Content}
    alternateLinks={alternateLinks}
/>
```

Create `src/pages/[locale]/tags/[tag].astro`:

```astro
---
import TagPage from "../../../views/TagPage.astro";
import {
    buildAlternateLinks,
    secondaryLocales,
    type Locale,
} from "../../../i18n/config";
import { getDictionary } from "../../../i18n/dictionary";
import { assertSecondaryLocale } from "../../../i18n/static-paths";
import { getAllTags, getPostsByTag } from "../../../lib/posts";

export async function getStaticPaths() {
    const tags = await getAllTags();
    return secondaryLocales.flatMap((locale) =>
        tags.map((tag) => ({
            params: { locale, tag },
            props: { locale, tag },
        })),
    );
}

const { locale: rawLocale, tag } = Astro.props as {
    locale: Locale;
    tag: string;
};
const locale = assertSecondaryLocale(rawLocale);
const dictionary = getDictionary(locale);
const posts = await getPostsByTag(tag);
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<TagPage
    locale={locale}
    dictionary={dictionary}
    tag={tag}
    posts={posts}
    alternateLinks={alternateLinks}
/>
```

Create `src/pages/[locale]/archive.astro`:

```astro
---
import ArchivePage from "../../views/ArchivePage.astro";
import { buildAlternateLinks, type Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionary";
import {
    assertSecondaryLocale,
    getSecondaryLocaleStaticPaths,
} from "../../i18n/static-paths";
import { getArchiveGroups } from "../../lib/posts";

export function getStaticPaths() {
    return getSecondaryLocaleStaticPaths();
}

const locale = assertSecondaryLocale(
    (Astro.props as { locale: Locale }).locale,
);
const dictionary = getDictionary(locale);
const archiveGroups = await getArchiveGroups();
const alternateLinks = buildAlternateLinks(Astro.url.pathname);
---

<ArchivePage
    locale={locale}
    dictionary={dictionary}
    archiveGroups={archiveGroups}
    alternateLinks={alternateLinks}
/>
```

- [ ] **Step 5: Run verification**

Run: `pnpm test`

Expected: PASS

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`

Expected: PASS with locale-prefixed routes generated under both `/en` and `/ja`

Run: `find dist -maxdepth 4 -type f | sort | rg '(^dist/(en|ja)/|/blog/|/archive|/tags/|sitemap)'`

Expected: includes at least these localized outputs:

- `dist/en/index.html`
- `dist/ja/index.html`
- `dist/en/blog/index.html`
- `dist/ja/blog/index.html`
- `dist/en/blog/hello-terminal/index.html`
- `dist/ja/blog/hello-terminal/index.html`
- `dist/en/archive/index.html`
- `dist/ja/archive/index.html`

- [ ] **Step 6: Commit**

```bash
git add src/i18n/static-paths.ts src/pages/[locale] tests/i18n.test.ts
git commit -m "feat: add locale-prefixed shell routes"
```

### Task 5: Final SEO And Regression Verification

**Files:**

- Modify only if verification exposes an issue

- [ ] **Step 1: Run full verification**

Run: `pnpm lint`

Expected: PASS

Run: `pnpm test`

Expected: PASS

Run: `ASTRO_TELEMETRY_DISABLED=1 COREPACK_HOME=/tmp/corepack pnpm run build`

Expected: PASS with static output in `dist/`

Note: the current `astro-typst` integration may still print existing `Get HastElementContent.` debug noise and a `MaxListenersExceededWarning`; exit code `0` is still the success criterion unless this feature work changes that behavior.

- [ ] **Step 2: Verify locale metadata in built HTML**

Run:

```bash
rg -n '<html lang=|rel="canonical"|hreflang=' \
  dist/index.html \
  dist/en/index.html \
  dist/ja/index.html \
  dist/blog/hello-terminal/index.html \
  dist/en/blog/hello-terminal/index.html \
  dist/ja/blog/hello-terminal/index.html
```

Expected:

- `dist/index.html` contains `<html lang="zh-CN">`
- `dist/en/index.html` contains `<html lang="en">`
- `dist/ja/index.html` contains `<html lang="ja">`
- localized pages emit alternate links for `zh-CN`, `en`, and `ja`
- localized article pages canonicalize to the default Chinese route

- [ ] **Step 3: Inspect route-to-route language switching**

Run:

```bash
rg -n '/en/blog|/ja/blog|/en/archive|/ja/archive|/en/tags/site|/ja/tags/site' \
  dist/index.html \
  dist/blog/index.html \
  dist/archive/index.html \
  dist/tags/site/index.html \
  dist/blog/hello-terminal/index.html
```

Expected:

- homepage language switcher links to `/en` and `/ja`
- blog index language switcher links to `/en/blog` and `/ja/blog`
- archive language switcher links to `/en/archive` and `/ja/archive`
- tag page language switcher links to `/en/tags/site` and `/ja/tags/site`
- article page language switcher links to `/en/blog/hello-terminal` and `/ja/blog/hello-terminal`

- [ ] **Step 4: Finish**

If all verification steps pass, no extra code change is needed in this task. Leave the worktree clean and move to `finishing-a-development-branch`.
