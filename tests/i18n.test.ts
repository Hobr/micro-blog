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
    assert.equal(toLocalePath("en", "/"), "/en");
    assert.equal(toLocalePath("ja", "/"), "/ja");
    assert.deepEqual(stripLocaleFromPathname("/en"), {
        locale: "en",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/ja"), {
        locale: "ja",
        pathnameWithoutLocale: "/",
    });
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
