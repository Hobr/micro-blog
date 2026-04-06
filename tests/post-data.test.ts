import assert from "node:assert/strict";
import test from "node:test";

import {
    assertUniqueSlugs,
    createAdjacentPostMap,
    groupPostsByTag,
    groupPostsByYear,
    normalizePostRecord,
    parseTypstDate,
    sortPostsByDateDesc,
} from "../src/lib/post-data.ts";

const rawPosts = [
    {
        id: "a",
        data: {
            title: "Older",
            slug: "older",
            date: "datetime(year: 2025, month: 12, day: 30)",
            tags: ["astro", "notes"],
        },
    },
    {
        id: "b",
        data: {
            title: "Newest",
            slug: "newest",
            date: "datetime(year: 2026, month: 4, day: 6)",
            tags: ["typst"],
        },
    },
] as const;

test("parseTypstDate converts typst datetime text into a UTC date", () => {
    const parsed = parseTypstDate("datetime(year: 2026, month: 4, day: 6)");
    assert.equal(parsed.toISOString(), "2026-04-06T00:00:00.000Z");
});

test("normalizePostRecord validates and decorates a post record", () => {
    const normalized = normalizePostRecord(rawPosts[0]);

    assert.equal(normalized.slug, "older");
    assert.equal(normalized.dateLabel, "2025-12-30");
});

test("sortPostsByDateDesc orders newest first", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));

    assert.deepEqual(
        sorted.map((post) => post.slug),
        ["newest", "older"],
    );
});

test("groupPostsByTag and groupPostsByYear derive navigation views", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));

    assert.deepEqual(
        groupPostsByTag(sorted)
            .get("astro")
            ?.map((post) => post.slug),
        ["older"],
    );
    assert.deepEqual(
        groupPostsByYear(sorted).map(([year]) => year),
        ["2026", "2025"],
    );
});

test("createAdjacentPostMap wires previous and next slugs", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));
    const adjacency = createAdjacentPostMap(sorted);

    assert.equal(adjacency.get("newest")?.next?.slug, "older");
    assert.equal(adjacency.get("older")?.previous?.slug, "newest");
});

test("assertUniqueSlugs rejects duplicate slugs", () => {
    assert.throws(
        () =>
            assertUniqueSlugs([
                normalizePostRecord(rawPosts[0]),
                normalizePostRecord({
                    id: "dup",
                    data: {
                        title: "Duplicate",
                        slug: "older",
                        date: "datetime(year: 2026, month: 4, day: 1)",
                        tags: ["astro"],
                    },
                }),
            ]),
        /Duplicate post slug: older/,
    );
});
