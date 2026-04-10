import { defaultLocale, toLocalePath, type Locale } from "../i18n/config.ts";

export type LocalizedSiteCommand = {
    command: string;
    name: string;
    href: string;
};

const siteSets: Record<Locale, LocalizedSiteCommand[]> = {
    "zh-CN": [
        {
            command: "打开 GitHub.com",
            name: "GitHub",
            href: "https://github.com/Hobr",
        },
        {
            command: "发送邮件 mail@hobr.site",
            name: "邮箱",
            href: "mailto:mail@hobr.site",
        },
        {
            command: "打开 Telegram",
            name: "Telegram",
            href: "https://t.me/Hobrd",
        },
        {
            command: "打开 /blog",
            name: "博客",
            href: toLocalePath("zh-CN", "/blog"),
        },
        {
            command: "打开 /archive",
            name: "归档",
            href: toLocalePath("zh-CN", "/archive"),
        },
        {
            command: "打开 /tags/site",
            name: "标签",
            href: toLocalePath("zh-CN", "/tags/site"),
        },
    ],
    en: [
        {
            command: "open GitHub.com",
            name: "GitHub",
            href: "https://github.com/Hobr",
        },
        {
            command: "mail mail@hobr.site",
            name: "Email",
            href: "mailto:mail@hobr.site",
        },
        {
            command: "open blog",
            name: "Blog",
            href: toLocalePath("en", "/blog"),
        },
        {
            command: "open archive",
            name: "Archive",
            href: toLocalePath("en", "/archive"),
        },
        {
            command: "open tags/site",
            name: "Tag View",
            href: toLocalePath("en", "/tags/site"),
        },
    ],
    ja: [
        {
            command: "開く github.com",
            name: "GitHub",
            href: "https://github.com",
        },
        {
            command: "送信 hello@hobr.site",
            name: "メール",
            href: "mailto:hello@hobr.site",
        },
        {
            command: "開く /blog",
            name: "ブログ",
            href: toLocalePath("ja", "/blog"),
        },
        {
            command: "開く /archive",
            name: "アーカイブ",
            href: toLocalePath("ja", "/archive"),
        },
        {
            command: "開く /tags/site",
            name: "タグ",
            href: toLocalePath("ja", "/tags/site"),
        },
    ],
};

export function getSites(locale: Locale): LocalizedSiteCommand[] {
    return siteSets[locale];
}

export const sites = getSites(defaultLocale);
