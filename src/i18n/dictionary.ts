import type { Locale } from "./config.ts";
import { en } from "./locales/en.ts";
import { ja } from "./locales/ja.ts";
import { zhCN } from "./locales/zh-CN.ts";

export type SiteDictionary = typeof zhCN;

const dictionaries: Record<Locale, SiteDictionary> = {
    "zh-CN": zhCN,
    en,
    ja,
};

export function getDictionary(locale: Locale): SiteDictionary {
    return dictionaries[locale];
}
