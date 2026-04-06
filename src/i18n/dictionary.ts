import type { Locale } from "./config.ts";
import { en } from "./locales/en.ts";
import { ja } from "./locales/ja.ts";
import { zhCN } from "./locales/zh-CN.ts";

type StringFormatter = typeof zhCN.blogIndex.openTag;

export type SiteDictionary = {
    lang: Locale;
    brand: {
        name: string;
        meta: string;
        switcherLabel: string;
    };
    nav: {
        home: string;
        blog: string;
        archive: string;
    };
    common: {
        noPosts: string;
    };
    home: {
        metaTitle: string;
        metaDescription: string;
        eyebrow: string;
        heading: string;
        copy: string;
        profileTitle: string;
        profileSubtitle: string;
        sitesTitle: string;
        sitesSubtitle: string;
        latestTitle: string;
        latestSubtitle: string;
        viewAll: string;
    };
    blogIndex: {
        metaTitle: string;
        metaDescription: string;
        eyebrow: string;
        heading: string;
        copy: string;
        listTitle: string;
        listSubtitle: string;
        navTitle: string;
        navSubtitle: string;
        openArchive: string;
        openTag: StringFormatter;
    };
    archive: {
        metaTitle: string;
        metaDescription: string;
        eyebrow: string;
        heading: string;
        copy: string;
        panelTitle: string;
        panelSubtitle: string;
    };
    tagPage: {
        metaTitle: StringFormatter;
        metaDescription: StringFormatter;
        eyebrow: string;
        heading: StringFormatter;
        copy: string;
        panelTitle: string;
        panelSubtitle: StringFormatter;
        empty: string;
    };
    articlePage: {
        metaTitle: StringFormatter;
        metaDescription: StringFormatter;
        eyebrow: string;
        intro: StringFormatter;
        articleTitle: string;
        metaTitleLabel: string;
        metaSubtitle: string;
        previous: string;
        next: string;
        startOfLog: string;
        latestEntry: string;
    };
};

const dictionaries = {
    "zh-CN": zhCN,
    en,
    ja,
} satisfies Record<Locale, SiteDictionary>;

export function getDictionary(locale: Locale): SiteDictionary {
    return dictionaries[locale];
}
