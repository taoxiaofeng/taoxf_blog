# Taoxf Blog - AI Native Developer Portal

一个基于 Next.js 14 的现代化 AI Native Developer Portal，集技术博客、AI 实战、Agent、MCP、Prompt、视频、作品集于一体。

## 🚀 快速开始

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm（推荐）
pnpm install
```

### 开发模式

```bash
npm run dev
# 访问 http://localhost:3000
```

### 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
taoxf_blog/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # 营销页面（首页、关于等）
│   ├── (blog)/               # 博客页面（文章、视频）
│   ├── (ai)/                 # AI 实战内容
│   ├── (resources)/          # 资源中心
│   ├── (projects)/           # 项目展示
│   ├── layout.tsx            # 根布局
│   └── globals.css           # 全局样式
│
├── components/               # React 组件
│   ├── layout/               # 布局组件
│   ├── ui/                   # UI 组件
│   └── shared/               # 共享组件
│
├── content/                  # 内容文件
│   ├── articles/             # 技术文章 (MDX)
│   └── videos/               # 视频元数据
│
├── lib/                      # 工具库
│   ├── data.ts               # 数据管理
│   └── utils.ts              # 通用工具
│
└── public/                   # 静态资源
```

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5 (Strict Mode)
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **3D**: Three.js + React Three Fiber
- **Markdown**: MDX + Shiki + Mermaid
- **状态管理**: Zustand + TanStack Query

## ✨ 特性

- 🎨 炫酷的 3D 粒子动画背景
- 🌓 暗黑/明亮模式切换（带动画）
- 📝 Markdown/MDX 文章支持
- 📊 Mermaid 图表渲染
- 💻 代码高亮（Shiki）
- 🎥 Bilibili/YouTube 视频嵌入
- 🔍 文章搜索和筛选
- 📱 完全响应式设计
- ⚡ SSR/SSG 优化性能
- 🎯 SEO 友好

## 📝 添加新文章

在 `content/articles/` 目录下创建 `.md` 或 `.mdx` 文件：

```markdown
---
title: "文章标题"
date: "2024-01-15"
tags: ["React", "TypeScript"]
category: "前端开发"
cover: "/images/cover.jpg"
excerpt: "文章摘要"
---

文章内容...
```

## 🎬 添加新视频

在 `content/videos/` 目录下创建 `.md` 文件：

```markdown
---
title: "视频标题"
date: "2024-01-15"
tags: ["React", "教程"]
category: "视频教程"
thumbnail: "/images/thumbnail.jpg"
videoUrl: "https://www.bilibili.com/video/BV1xx411c7BF"
description: "视频描述"
---

视频补充内容...
```

## 🌐 部署

### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### GitHub Pages

项目已配置为支持 GitHub Pages 部署。

## 📄 许可证

MIT License

## 👤 作者

**Tao Xiaofeng**

- GitHub: [@taoxiaofeng](https://github.com/taoxiaofeng)
- Twitter: [@taoxiaofeng](https://twitter.com/taoxiaofeng)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

⭐ 如果这个项目对你有帮助，请给个 Star！
