export const en = {
    brand: {
        name: "Hobr.Site",
        switcherLabel: "Language",
        themeLabel: "Theme",
    },
    nav: {
        home: "Home",
        blog: "Blog",
        archive: "Archive",
    },
    common: {
        noPosts: "No posts published yet",
        tagsLabel: "Tags",
    },
    home: {
        metaTitle: "Hobr.Site | Homepage",
        profileSubtitle: "whoami && cat ~/profile.txt",
        sitesSubtitle: "ls ~/sites && open ~/sites/<target>",
        latestSubtitle: "tail -n 5 ~/posts.log",
        viewAll: "ls ~/posts",
    },
    blogIndex: {
        metaTitle: "Hobr.Site | Blog",
        listSubtitle: "ls -lt ~/posts",
        navSubtitle: "ls ~/tags && ls ~/archive",
        openArchive: "exec ~/archive",
        openTag: (tag: string) => `exec ~/tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.Site | Archive",
        panelSubtitle:
            "find ~/posts -type f | xargs stat -c %y | cut -d- -f1 | sort -ur",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.Site | #${tag}`,
        panelSubtitle: (tag: string) => `grep -r ${tag} ~/posts`,
        empty: "No posts found for this tag",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.Site | ${title}`,
        previous: "Previous",
        next: "Next",
        startOfLog: "Start of the log",
        latestEntry: "Latest entry reached",
    },
} as const;
