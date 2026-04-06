#metadata((
  title: "Delivering Astro Static Builds",
  slug: "astro-static-delivery",
  date: datetime(year: 2026, month: 4, day: 3),
  tags: ("astro", "deploy"),
))<frontmatter>

#set page(width: auto, height: auto, margin: 0pt)
#set par(justify: true, leading: 0.85em)

= Delivering Astro Static Builds

Astro 最让我满意的一点，是它允许我把页面在构建阶段就算清楚。部署时，Nginx 只需要服务静态文件，不必理解组件、状态或服务端运行时。

== 交付链路

一个最小但可靠的交付链路通常就是：

1. 本地写页面和内容
2. 运行 `pnpm build`
3. 把 `dist/` 同步到目标主机
4. 让 Nginx 直接提供静态访问

== 为什么这个模型舒服

它把故障面压得很低。页面能否打开，更多地取决于构建是否成功，而不是某个线上进程有没有在半夜崩掉。

=== 我会优先检查的东西

- 路由生成是否稳定
- sitemap 是否更新
- 资源路径是否全是静态引用
- 页面在无 JavaScript 下是否依然可读

这些条件满足之后，静态部署的体验通常会比“先上再说”的动态站点更可控。
