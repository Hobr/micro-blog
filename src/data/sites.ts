import { defaultLocale, toLocalePath, type Locale } from "../i18n/config.ts";

export type LocalizedSiteCommand = {
    command: string;
    name: string;
    description: string;
    href: string;
};

const siteSets: Record<Locale, LocalizedSiteCommand[]> = {
    "zh-CN": [
        {
            command: "打开 github.com",
            name: "GitHub",
            description: "代码仓库与公开项目。",
            href: "https://github.com",
        },
        {
            command: "发送邮件 hello@hobr.site",
            name: "邮箱",
            description: "直接联系我。",
            href: "mailto:hello@hobr.site",
        },
        {
            command: "打开 /blog",
            name: "博客",
            description: "长文笔记、构建日志和写作实验。",
            href: toLocalePath("zh-CN", "/blog"),
        },
        {
            command: "打开 /archive",
            name: "归档",
            description: "按时间顺序查看所有已发布内容。",
            href: toLocalePath("zh-CN", "/archive"),
        },
        {
            command: "打开 /tags/site",
            name: "标签",
            description: "直接跳到与站点构建有关的文章。",
            href: toLocalePath("zh-CN", "/tags/site"),
        },
    ],
    en: [
        {
            command: "open github.com",
            name: "GitHub",
            description: "Code repositories and public projects.",
            href: "https://github.com",
        },
        {
            command: "mail hello@hobr.site",
            name: "Email",
            description: "Reach me directly.",
            href: "mailto:hello@hobr.site",
        },
        {
            command: "open blog",
            name: "Blog",
            description:
                "Long-form notes, build logs, and writing experiments.",
            href: toLocalePath("en", "/blog"),
        },
        {
            command: "open archive",
            name: "Archive",
            description: "Chronological index of everything already published.",
            href: toLocalePath("en", "/archive"),
        },
        {
            command: "open tags/site",
            name: "Tag View",
            description: "Jump directly into the site-building posts.",
            href: toLocalePath("en", "/tags/site"),
        },
    ],
    ja: [
        {
            command: "開く github.com",
            name: "GitHub",
            description: "コード置き場と公開プロジェクト。",
            href: "https://github.com",
        },
        {
            command: "送信 hello@hobr.site",
            name: "メール",
            description: "直接連絡できます。",
            href: "mailto:hello@hobr.site",
        },
        {
            command: "開く /blog",
            name: "ブログ",
            description: "長文メモ、構築ログ、文章実験をまとめた場所。",
            href: toLocalePath("ja", "/blog"),
        },
        {
            command: "開く /archive",
            name: "アーカイブ",
            description: "公開済みコンテンツを時系列で一覧できます。",
            href: toLocalePath("ja", "/archive"),
        },
        {
            command: "開く /tags/site",
            name: "タグ",
            description: "サイト構築に関する記事へ直接移動します。",
            href: toLocalePath("ja", "/tags/site"),
        },
    ],
};

export function getSites(locale: Locale): LocalizedSiteCommand[] {
    return siteSets[locale];
}

export const sites = getSites(defaultLocale);
