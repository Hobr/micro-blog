export const en = {
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
        profileSubtitle: "whoami && cat profile.txt",
        sitesSubtitle: "ls ~/sites && open <target>",
        latestSubtitle: "tail -n 5 log.log",
        viewAll: "View all posts",
    },
    blogIndex: {
        metaTitle: "Hobr.SITE / Blog",
        listSubtitle: "ls -lt ./posts",
        navSubtitle: "ls ./tags && open /archive",
        openArchive: "open /archive",
        openTag: (tag: string) => `open /tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.SITE / Archive",
        panelSubtitle:
            "find ./posts -type f | xargs stat -c %y | cut -d- -f1 | sort -ur",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.SITE / #${tag}`,
        panelSubtitle: (tag: string) => `grep -r ${tag} ./posts`,
        empty: "No posts found for this tag.",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.SITE / ${title}`,
        previous: "previous",
        next: "next",
        startOfLog: "Start of the log",
        latestEntry: "Latest entry reached",
    },
} as const;
