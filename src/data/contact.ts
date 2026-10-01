import type { Locale } from "../i18n/config.ts";
import type { LocalizedSiteCommand } from "./sites.ts";

export const sharedSiteTargets = {
    email: {
        command: "./mail@hobr.site",
        href: "mailto:mail@hobr.site",
        i18n: { "zh-CN": "邮箱", en: "Email" },
        group: "im",
    },
    telegram: {
        command: "./Telegram",
        href: "https://t.me/Hobrd",
        i18n: { "zh-CN": "电报", en: "Telegram" },
        group: "im",
    },
    qq: {
        command: "./QQ",
        href: "https://qm.qq.com/q/VJ01PuCduS",
        i18n: { "zh-CN": "QQ", en: "QQ" },
        group: "im",
    },
    matrix: {
        command: "./Matrix",
        href: "https://matrix.to/#/@hobrd:matrix.org",
        i18n: { "zh-CN": "Matrix", en: "Matrix" },
        group: "im",
    },
    discord: {
        command: "./Discord",
        href: "https://discord.gg/rgAZKrmC",
        i18n: { "zh-CN": "Discord", en: "Discord" },
        group: "im",
    },

    bilibili: {
        command: "./Bilibili",
        href: "https://space.bilibili.com/35583361",
        i18n: { "zh-CN": "哔哩哔哩", en: "Bilibili" },
        group: "social",
    },
    rednote: {
        command: "./RedNote",
        href: "https://xhslink.cn/o/5w0Gq6fbyel",
        i18n: { "zh-CN": "小红书", en: "RedNote" },
        group: "social",
    },
    zhihu: {
        command: "./Zhihu",
        href: "https://www.zhihu.com/people/hobr",
        i18n: { "zh-CN": "知乎", en: "Zhihu" },
        group: "social",
    },
    x: {
        command: "./X",
        href: "https://x.com/Hobrimttxx",
        i18n: { "zh-CN": "X", en: "X" },
        group: "social",
    },
    bangumi: {
        command: "./Bangumi",
        href: "https://bangumi.tv/user/hobr",
        i18n: { "zh-CN": "Bangumi", en: "Bangumi" },
        group: "social",
    },
} as const;

type SharedSiteTargetKey = keyof typeof sharedSiteTargets;

export type ContactSiteGroups = {
    im: LocalizedSiteCommand[];
    social: LocalizedSiteCommand[];
};

function localizeContactSites(
    locale: Locale,
    keys: readonly SharedSiteTargetKey[],
): LocalizedSiteCommand[] {
    return keys.map((key) => {
        const { i18n, ...site } = sharedSiteTargets[key];
        return { ...site, name: i18n[locale] };
    });
}

export function getContactSites(locale: Locale): LocalizedSiteCommand[] {
    return localizeContactSites(
        locale,
        Object.keys(sharedSiteTargets) as SharedSiteTargetKey[],
    );
}

export function getContactSiteGroups(locale: Locale): ContactSiteGroups {
    const keys = Object.keys(sharedSiteTargets) as SharedSiteTargetKey[];
    return {
        im: localizeContactSites(
            locale,
            keys.filter((key) => sharedSiteTargets[key].group === "im"),
        ),
        social: localizeContactSites(
            locale,
            keys.filter((key) => sharedSiteTargets[key].group === "social"),
        ),
    };
}
