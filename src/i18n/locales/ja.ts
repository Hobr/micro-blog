export const ja = {
    brand: {
        name: "Hobr.SITE",
        switcherLabel: "言語切替",
        switcherShortLabel: "言語",
        themeLabel: "テーマ",
    },
    nav: {
        home: "ホーム",
        blog: "ブログ",
        archive: "アーカイブ",
        primaryLabel: "メインナビゲーション",
    },
    common: {
        noPosts: "まだ記事はありません。",
        tagsLabel: "タグ",
    },
    home: {
        metaTitle: "Hobr.SITE / ポータル",
        profileSubtitle: "whoami && cat 个人资料.txt",
        sitesSubtitle: "ls ~/サイト && open <ページ>",
        latestSubtitle: "tail -n 5 journal.log",
        viewAll: "すべての記事を見る",
    },
    blogIndex: {
        metaTitle: "Hobr.SITE / ブログ",
        listSubtitle: "ls -lt ./posts",
        navSubtitle: "ls ./tags && open /archive",
        openArchive: "開く /archive",
        openTag: (tag: string) => `開く /tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.SITE / アーカイブ",
        panelSubtitle:
            "find ./posts -type f | xargs stat -c %y | cut -d- -f1 | sort -ur",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.SITE / #${tag}`,
        panelSubtitle: (tag: string) => `grep -r ${tag} ./posts`,
        empty: "このタグの記事はまだありません。",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.SITE / ${title}`,
        previous: "前の記事",
        next: "次の記事",
        startOfLog: "これが最初の記事です",
        latestEntry: "最新の記事に到達しました",
    },
} as const;
