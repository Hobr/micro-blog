# Hobr's Blog

> Hobr的终端风个人门户

## 目录结构

```text
.
├── public/
│   ├── avatar.svg
│   └── posts/              # Typst 文章图片等静态资源
├── src/
│   ├── components/         # 终端窗口、文章列表、标签、分页等组件
│   ├── content/
│   │   └── posts/          # Typst 博文
│   ├── data/
│   │   ├── profile.ts      # 首页个人信息
│   │   └── sites.ts        # 首页站点命令列表
│   ├── layouts/
│   │   └── Layout.astro    # 全站布局
│   ├── lib/
│   │   ├── post-data.ts    # 文章日期/标签/前后篇等纯逻辑
│   │   └── posts.ts        # Astro content collection 查询层
│   ├── pages/
│   │   ├── index.astro     # 首页
│   │   ├── archive.astro   # 归档页
│   │   ├── blog/           # 博客列表和文章页
│   │   └── tags/           # 标签页
│   ├── styles/
│   │   └── global.css      # terminal.css 主题覆盖
│   └── content.config.ts   # 内容集合配置
└── tests/
    └── post-data.test.ts   # 文章数据处理测试
```

## 本地开发

```bash
# 安装依赖:
pnpm install

# 启动开发服务器:
pnpm dev

# 运行测试
pnpm test

# 检查格式和 lint
pnpm lint

# 自动格式化
pnpm format

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 内容维护

### 1. 修改首页信息

编辑:

- `src/data/profile.ts`
- `src/data/sites.ts`

其中:

- `profile.ts` 控制首页简介
- `sites.ts` 控制首页站点命令列表
- `public/avatar.svg` 是页头头像资源

### 2. 新增 Typst 博文

在 `src/content/posts/` 下新建一个 `.typ` 文件, 例如:

```typ
#metadata((
  title: "My New Post",
  slug: "my-new-post",
  date: datetime(year: 2026, month: 4, day: 7),
  tags: ("typst", "astro"),
))<frontmatter>

#set page(width: auto, height: auto, margin: 0pt)
#set par(justify: true, leading: 0.85em)

= My New Post

这里开始写正文
```

当前文章的必填 frontmatter 字段:

- `title`
- `slug`
- `date`
- `tags`

构建时会基于这些字段自动生成:

- `/blog`
- `/blog/<slug>`
- `/tags/<tag>`
- `/archive`
- 上一篇 / 下一篇导航

### 3. Typst 图片资源约定

Typst 博文里的图片统一放在 `public/posts/<slug>/` 下, 例如:

```text
public/posts/hello-terminal/cover.png
public/posts/hello-terminal/diagram.png
```

在 `.typ` 里用项目根目录下的 `public/` 绝对路径引用:

```typ
#image("/public/posts/hello-terminal/cover.png")
```

约定:

- 一个 slug 对应一个资源目录, 方便迁移和清理
- 图片文件名保持英文小写加连字符
- 优先把文章图片放进 `public/posts/<slug>/`, 不要散落在根级 `public/`

## 路由说明

- `/`: 个人门户首页
- `/blog`: 博客列表页
- `/blog/<slug>`: 文章详情页
- `/tags/<tag>`: 标签聚合页
- `/archive`: 按年份归档

## 构建与部署

构建静态文件:

```bash
pnpm build
```

构建完成后, 产物位于:

```text
dist/
```

这个目录可以直接作为静态站点根目录交给 Nginx

一个最基本的部署思路是:

1. 在本地运行 `pnpm build`
2. 将 `dist/` 上传到服务器
3. 在 Nginx 中将站点根目录指向这份静态文件
4. 通过 Nginx 提供访问

### GitHub Push 自动部署

仓库已经提供了一份 GitHub Actions 工作流:

```text
.github/workflows/deploy.yml
```

行为:

- push 到 `main` 时自动执行
- 在 GitHub Actions 里运行 `pnpm install`、`pnpm test`、`pnpm build`
- 构建完成后用 `rsync` 通过 SSH 把 `dist/` 同步到服务器

你需要在 GitHub 仓库的 `Settings -> Secrets and variables -> Actions` 里添加这些 secrets:

- `DEPLOY_HOST`: 服务器地址, 例如 `example.com`
- `DEPLOY_PORT`: SSH 端口, 默认通常是 `22`
- `DEPLOY_USER`: 部署用户
- `DEPLOY_PATH`: 服务器上的静态站点目录, 例如 `/var/www/hobr.site`
- `DEPLOY_SSH_KEY`: 用于部署的私钥内容
- `DEPLOY_KNOWN_HOSTS`: 服务器 host key, 可在本地执行 `ssh-keyscan -H <host>` 获取

建议:

- 给部署用户单独创建一把 SSH key, 不要复用你自己的日常登录 key
- 让 `DEPLOY_USER` 对 `DEPLOY_PATH` 有写权限, 这样工作流不需要 sudo
- Nginx 直接把站点根目录指向 `DEPLOY_PATH`

部署链路就会变成:

1. 本地提交并 push 到 `main`
2. GitHub Actions 自动构建
3. Actions 自动把新的 `dist/` 同步到服务器
4. Nginx 继续直接提供静态文件

## 说明

- 文章内容来源于 Typst 文件, 不依赖数据库或服务端运行时
- 整站是静态站点, 适合简单、稳定、可缓存的部署方式
- 当前仓库已经包含示例文章, 可直接本地启动查看效果
