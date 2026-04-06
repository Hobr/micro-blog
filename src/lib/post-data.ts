export type RawPostRecord = {
    id: string;
    data: {
        title: string;
        slug: string;
        date: string;
        tags: string[];
    };
};

export type NormalizedPost = {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    publishedAt: Date;
    dateLabel: string;
};

export function parseTypstDate(input: string): Date {
    const year = Number(input.match(/year:\s*(\d{4})/)?.[1]);
    const month = Number(input.match(/month:\s*(\d{1,2})/)?.[1]);
    const day = Number(input.match(/day:\s*(\d{1,2})/)?.[1]);

    if (!year || !month || !day) {
        throw new Error(`Invalid Typst date: ${input}`);
    }

    return new Date(Date.UTC(year, month - 1, day));
}

export function normalizePostRecord(record: RawPostRecord): NormalizedPost {
    if (!record.data.title.trim()) {
        throw new Error("Post title is required");
    }

    if (!record.data.slug.trim()) {
        throw new Error("Post slug is required");
    }

    if (record.data.tags.length === 0) {
        throw new Error("Post tags are required");
    }

    const publishedAt = parseTypstDate(record.data.date);

    return {
        id: record.id,
        title: record.data.title,
        slug: record.data.slug,
        tags: record.data.tags,
        publishedAt,
        dateLabel: publishedAt.toISOString().slice(0, 10),
    };
}

export function sortPostsByDateDesc<T extends NormalizedPost>(posts: T[]): T[] {
    return [...posts].sort(
        (left, right) =>
            right.publishedAt.getTime() - left.publishedAt.getTime(),
    );
}

export function groupPostsByTag<T extends NormalizedPost>(
    posts: T[],
): Map<string, T[]> {
    const grouped = new Map<string, T[]>();

    for (const post of posts) {
        for (const tag of post.tags) {
            grouped.set(tag, [...(grouped.get(tag) ?? []), post]);
        }
    }

    return grouped;
}

export function groupPostsByYear<T extends NormalizedPost>(
    posts: T[],
): Array<[string, T[]]> {
    const grouped = new Map<string, T[]>();

    for (const post of posts) {
        const year = String(post.publishedAt.getUTCFullYear());
        grouped.set(year, [...(grouped.get(year) ?? []), post]);
    }

    return [...grouped.entries()];
}

export function createAdjacentPostMap<T extends NormalizedPost>(posts: T[]) {
    return new Map(
        posts.map((post, index) => [
            post.slug,
            {
                previous: index > 0 ? posts[index - 1] : undefined,
                next: index < posts.length - 1 ? posts[index + 1] : undefined,
            },
        ]),
    );
}

export function assertUniqueSlugs<T extends { slug: string }>(posts: T[]) {
    const seen = new Set<string>();

    for (const post of posts) {
        if (seen.has(post.slug)) {
            throw new Error(`Duplicate post slug: ${post.slug}`);
        }

        seen.add(post.slug);
    }
}
