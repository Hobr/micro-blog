export const zhCN = {
    brand: {
        name: "Hobr.Site",
        switcherLabel: "语言切换",
        switcherShortLabel: "语言",
        themeLabel: "主题",
    },
    nav: {
        home: "首页",
        blog: "博客",
        archive: "归档",
        primaryLabel: "主导航",
    },
    common: {
        noPosts: "暂无文章",
        tagsLabel: "标签",
    },
    home: {
        metaTitle: "Hobr.Site / 首页",
        metaDescription: "个人门户首页, 包含简介、站点导航和最新文章",
        profileSubtitle: "whoami && cat profile.txt",
        sitesSubtitle: "ls ~/页面 && open <目标>",
        latestSubtitle: "tail -n 5 日志.log",
        viewAll: "查看全部文章",
    },
    blogIndex: {
        metaTitle: "Hobr.Site / 博客",
        metaDescription: "按时间倒序排列的完整博客文章列表",
        listSubtitle: "ls -lt ./posts",
        navSubtitle: "ls ./tags && open /archive",
        openArchive: "打开 /archive",
        openTag: (tag: string) => `打开 /tags/${tag}`,
    },
    archive: {
        metaTitle: "Hobr.Site / 归档",
        metaDescription: "按年份整理的全部博客归档",
        panelSubtitle:
            "find ./posts -type f | xargs stat -c %y | cut -d- -f1 | sort -ur",
    },
    tagPage: {
        metaTitle: (tag: string) => `Hobr.Site / #${tag}`,
        metaDescription: (tag: string) => `标签 ${tag} 下的文章列表`,
        panelSubtitle: (tag: string) => `grep -r ${tag} ./posts`,
        empty: "这个标签下还没有文章",
    },
    articlePage: {
        metaTitle: (title: string) => `Hobr.Site / ${title}`,
        metaDescription: (title: string) => `阅读《${title}》这篇文章`,
        previous: "上一篇",
        next: "下一篇",
        startOfLog: "这是最早的一篇",
        latestEntry: "已经到达最新一篇",
    },
} as const;
