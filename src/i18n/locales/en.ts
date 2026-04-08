export const en = {
    lang: "en",
    brand: {
        name: "Hobr.SITE",
        switcherLabel: "Language switcher",
        switcherShortLabel: "Language",
        themeLabel: "Theme",
    },
    nav: {
        home: "Home",
        blog: "Blog",
        archive: "Archive",
        primaryLabel: "Primary navigation",
    },
    common: {
        noPosts: "No posts published yet.",
        tagsLabel: "Tags",
    },
    home: {
        metaTitle: "Hobr.SITE / Personal Portal",
        metaDescription:
            "Personal portal homepage with profile, site navigation, and latest posts.",
        profileSubtitle: "whoami && cat profile.txt",
        sitesSubtitle: "ls ~/sites && open <target>",
        latestSubtitle: "tail -n 5 log.log",
        viewAll: "View all posts",
    },
    blogIndex: {
        metaTitle: "Hobr.SITE / Blog",
        metaDescription: "Full list of blog posts sorted by date.",
        listSubtitle: "ls -lt ./posts",
        navTitle: "NAV",
        navSubtitle: "jump <目标>",
        openArchive: "open /archive",
        openTag: (tag: string) => `open /tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.SITE / Archive",
        metaDescription: "Year-grouped archive of all posts.",
        panelSubtitle:
            "find ./posts -type f | xargs stat -c %y | cut -d- -f1 | sort -ur",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.SITE / #${tag}`,
        metaDescription: (tag: string) => `Posts tagged ${tag} on Hobr.SITE.`,
        eyebrow: "tag view",
        heading: (tag: string) => `#${tag}`,
        copy: "A filtered stream for one topic. Go back to /blog for the full list.",
        panelTitle: "TAG RESULTS",
        panelSubtitle: (tag: string) => `grep -r ${tag} ./posts`,
        empty: "No posts found for this tag.",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.SITE / ${title}`,
        metaDescription: (title: string) => `Read ${title} on Hobr.SITE.`,
        eyebrow: "post entry",
        intro: (dateLabel: string) =>
            `Published ${dateLabel}. Return to /blog or keep browsing through tags below.`,
        articleTitle: "ARTICLE",
        metaTitleLabel: "POST META",
        metaSubtitle: "tags && navigation",
        previous: "previous",
        next: "next",
        startOfLog: "Start of the log",
        latestEntry: "Latest entry reached",
    },
} as const;
