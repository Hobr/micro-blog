import { defaultLocale, toLocalePath, type Locale } from "../i18n/config.ts";

export type LocalizedSiteCommand = {
    command: string;
    name: string;
    href: string;
};

const siteSets: Record<Locale, LocalizedSiteCommand[]> = {
    "zh-CN": [
        {
            command: "./mail@hobr.site",
            name: "邮箱",
            href: "mailto:mail@hobr.site",
        },
        {
            command: "./Telegram",
            name: "Telegram",
            href: "https://t.me/Hobrd",
        },
        {
            command: "./GitHub",
            name: "GitHub",
            href: "https://github.com/Hobr",
        },
        {
            command: "./blog",
            name: "博客",
            href: toLocalePath("zh-CN", "/blog"),
        },
        {
            command: "./archive",
            name: "归档",
            href: toLocalePath("zh-CN", "/archive"),
        },
        {
            command: "./tags/site",
            name: "标签",
            href: toLocalePath("zh-CN", "/tags/site"),
        },
    ],
    en: [
        {
            command: "./mail@hobr.site",
            name: "Email",
            href: "mailto:mail@hobr.site",
        },
        {
            command: "./Telegram",
            name: "Telegram",
            href: "https://t.me/Hobrd",
        },
        {
            command: "./GitHub",
            name: "GitHub",
            href: "https://github.com/Hobr",
        },
        {
            command: "./blog",
            name: "Blog",
            href: toLocalePath("en", "/blog"),
        },
        {
            command: "./archive",
            name: "Archive",
            href: toLocalePath("en", "/archive"),
        },
        {
            command: "./tags/site",
            name: "Tag View",
            href: toLocalePath("en", "/tags/site"),
        },
    ],
    ja: [
        {
            command: "./mail@hobr.site",
            name: "メール",
            href: "mailto:hello@hobr.site",
        },
        {
            command: "./Telegram",
            name: "Telegram",
            href: "https://t.me/Hobrd",
        },
        {
            command: "./GitHub",
            name: "GitHub",
            href: "https://github.com",
        },
        {
            command: "./blog",
            name: "ブログ",
            href: toLocalePath("ja", "/blog"),
        },
        {
            command: "./archive",
            name: "アーカイブ",
            href: toLocalePath("ja", "/archive"),
        },
        {
            command: "./tags/site",
            name: "タグ",
            href: toLocalePath("ja", "/tags/site"),
        },
    ],
};

export function getSites(locale: Locale): LocalizedSiteCommand[] {
    return siteSets[locale];
}

export const sites = getSites(defaultLocale);
