#metadata((
  title: "Hello Terminal",
  slug: "hello-terminal",
  date: datetime(year: 2026, month: 4, day: 6),
  tags: ("site", "intro"),
))<frontmatter>

#set page(width: auto, height: auto, margin: 0pt)
#set par(justify: true, leading: 0.85em)
#show math.equation: it => box(html.frame(it))

= Hello Terminal

这个站点终于从默认的 Astro 欢迎页，变成了一个真正属于我的地方。

我想要的不是一张普通的个人卡片，而是一个 _boot 完成后的终端工作台_：左边放身份，右边放入口，底下放最近写的内容。它应该像命令行一样直接，也应该像博客一样可读。

== 为什么从终端风开始

- 因为终端是一种诚实的界面
- 因为它天然适合表达工具、文本和过程
- 因为我不想做一套像模板站一样的首页

=== 第一批命令

```bash
pnpm dev
pnpm test
pnpm build
```

如果一个静态站点能把这三条命令做好，它就已经是一个可靠的发布系统了。

== 接下来

后面我会继续把 Typst 的写作流、Astro 的构建流，以及我旗下的其他小站一起接进来。首页只负责欢迎你，真正的长内容留给 `/blog`。
