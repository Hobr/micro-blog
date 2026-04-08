import assert from "node:assert/strict";
import test from "node:test";

import {
    buildAlternateLinks,
    defaultLocale,
    isLocale,
    isSecondaryLocale,
    localeDisplayNames,
    secondaryLocales,
    stripLocaleFromPathname,
    toLocalePath,
} from "../src/i18n/config.ts";
import {
    assertSecondaryLocale,
    getSecondaryLocaleStaticPaths,
} from "../src/i18n/static-paths.ts";
import { shouldIncludeSitemapPage } from "../src/i18n/sitemap.ts";
import { getProfile, profile } from "../src/data/profile.ts";
import { getSites, sites } from "../src/data/sites.ts";
import { getDictionary } from "../src/i18n/dictionary.ts";

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

test("locale guard helpers describe supported locales and nothing else", () => {
    assert.ok(isLocale("zh-CN"));
    assert.ok(isLocale("en"));
    assert.ok(isLocale("ja"));
    assert.equal(isLocale("fr"), false);
    assert.ok(isSecondaryLocale("en"));
    assert.ok(isSecondaryLocale("ja"));
    assert.equal(isSecondaryLocale("zh-CN"), false);
});

test("secondary roots and exact-match stripping behave as expected", () => {
    assert.equal(toLocalePath("en", "/"), "/en/");
    assert.equal(toLocalePath("ja", "/"), "/ja/");
    assert.deepEqual(stripLocaleFromPathname("/en"), {
        locale: "en",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/en/"), {
        locale: "en",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/ja"), {
        locale: "ja",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/ja/"), {
        locale: "ja",
        pathnameWithoutLocale: "/",
    });
});

test("buildAlternateLinks normalizes locale root trailing slashes", () => {
    assert.deepEqual(buildAlternateLinks("/en/"), [
        { locale: "zh-CN", href: "/", label: "中文", lang: "zh-CN" },
        { locale: "en", href: "/en/", label: "English", lang: "en" },
        { locale: "ja", href: "/ja/", label: "日本語", lang: "ja" },
    ]);
});

test("sitemap keeps localized shells but excludes non-canonical localized article pages", () => {
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/en/blog/hello-terminal/"),
        false,
    );
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/ja/blog/hello-terminal/"),
        false,
    );
    assert.equal(shouldIncludeSitemapPage("https://hobr.site/en/blog/"), true);
    assert.equal(shouldIncludeSitemapPage("https://hobr.site/ja/blog/"), true);
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/en/archive/"),
        true,
    );
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/blog/hello-terminal/"),
        true,
    );
});

test("toLocalePath rejects pathnames without a leading slash", () => {
    assert.throws(
        () => toLocalePath("en", "blog/hello-terminal"),
        /pathname must start with/,
    );
    assert.throws(
        () => toLocalePath("ja", "tags/site"),
        /pathname must start with/,
    );
});

test("dictionary, profile, and site data resolve translated shell copy", () => {
    assert.equal(getDictionary("zh-CN").nav.blog, "博客");
    assert.equal(getDictionary("en").nav.blog, "Blog");
    assert.equal(getDictionary("ja").nav.blog, "ブログ");

    assert.equal(getProfile("zh-CN").avatarAlt, "Hobr 头像");
    assert.equal(getDictionary("zh-CN").nav.primaryLabel, "主导航");
    assert.equal(getDictionary("ja").common.tagsLabel, "タグ");
    assert.equal(getDictionary("ja").blogIndex.openArchive, "開く /archive");

    assert.equal(getSites("zh-CN")[0].name, "GitHub");
    assert.equal(getSites("zh-CN")[2].command, "打开 /blog");
    assert.equal(
        getSites("en")[3].description,
        "Chronological index of everything already published.",
    );
    assert.equal(getSites("ja")[4].name, "タグ");
    assert.equal(getSites("ja")[4].command, "開く /tags/site");
    assert.equal(getSites("en")[0].href, "https://github.com");
    assert.equal(getSites("ja")[3].href, "/ja/archive");
});

test("profile and sites keep default-locale compatibility exports", () => {
    assert.equal(sites[0].href, getSites(defaultLocale)[0].href);
});

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
