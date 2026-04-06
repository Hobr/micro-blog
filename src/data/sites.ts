import type { Locale } from "../i18n/config.ts";

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
