#metadata((
  title: "Writing Posts With Typst",
  slug: "typst-notes",
  date: datetime(year: 2026, month: 3, day: 28),
  tags: ("typst", "writing"),
))<frontmatter>

#set page(width: auto, height: auto, margin: 0pt)
#set par(justify: true, leading: 0.85em)

= Writing Posts With Typst

我喜欢 Typst 的原因，不只是它能排版，而是它让文本本身重新变成一种可以编程的材料。

== 作为博客正文的好处

- 标题、列表、强调和代码都很自然
- 数学公式和结构化内容可以直接混排
- frontmatter 可以和正文写在同一个文件里

比如一个简单公式：

$ sum_(i = 0)^n i = (n (n + 1)) / 2 $

== 真正有价值的部分

最重要的不是“它看起来像论文工具”，而是我可以只维护一份内容：同一篇 `.typ` 文件同时承担元数据和正文，不再需要旁边挂一个额外的 JSON 文件。

当文章数量开始变多，这种一致性会省掉很多无聊的维护成本。
