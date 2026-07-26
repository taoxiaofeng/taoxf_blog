# Taoxf Blog - 炫酷技术博客

一个基于 React + TypeScript + Tailwind CSS 的现代化技术博客，支持文章发布和视频分享。

## ✨ 特性

- 🎨 **现代化 UI**: 玻璃拟态设计、渐变色彩、暗黑模式
- 🎬 **粒子动画**: Three.js 驱动的炫酷 3D 粒子背景
- 📝 **Markdown 支持**: 完整的 Markdown 渲染，代码高亮
- 🎥 **视频集成**: 支持 Bilibili/YouTube 视频嵌入
- 🔍 **搜索和筛选**: 文章搜索、分类和标签筛选
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🌙 **暗黑模式**: 一键切换明亮/暗黑主题
- ⚡ **平滑动画**: Framer Motion 驱动的页面过渡和交互动画

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Next.js 14
- **样式方案**: Tailwind CSS 4
- **路由**: Next.js App Router
- **动画**: Framer Motion
- **3D 渲染**: Three.js + React Three Fiber
- **Markdown**: React Markdown + Remark/Rehype
- **代码高亮**: React Syntax Highlighter

## 📦 安装和运行

### 前置要求

- Node.js >= 16
- Yarn 或 npm

### 安装依赖

```bash
yarn install
# 或
npm install
```

### 开发模式

```bash
yarn start
# 或
npm start
```

访问 http://localhost:3000/taoxf_blog

### 构建生产版本

```bash
yarn build
# 或
npm run build
```

### 预览构建结果

```bash
yarn preview
# 或
npm run preview
```

### 部署到 GitHub Pages

```bash
yarn deploy
# 或
npm run deploy
```

## 📝 使用指南

### 添加新文章

1. 在 `content/articles/` 目录创建新的 Markdown 文件
2. 文件命名格式: `YYYY-MM-DD-slug.md`
3. 添加 Frontmatter 元数据:

```markdown
---
title: "文章标题"
date: "2024-01-15"
tags: ["React", "TypeScript"]
category: "前端开发"
cover: ""
excerpt: "文章摘要"
---

文章内容...
```

### 添加新视频

1. 在 `content/videos/` 目录创建新的 Markdown 文件
2. 添加 Frontmatter 元数据:

```markdown
---
title: "视频标题"
date: "2024-01-20"
tags: ["教程"]
category: "前端开发"
thumbnail: ""
videoUrl: "https://www.bilibili.com/video/BVxxxxx"
description: "视频描述"
---

视频描述内容...
```

### 自定义主题

Tailwind CSS v4 使用 CSS 原生配置，编辑 `app/globals.css` 修改变量：

```css
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

## 📁 项目结构

```
app/                    # Next.js App Router 页面
├── (blog)/             # 博客内容分组
│   ├── algorithms/     # 算法文章
│   ├── articles/       # 技术文章
│   ├── design-patterns/ # 设计模式
│   └── videos/         # 视频内容
├── (marketing)/        # 营销页面分组
│   ├── about/          # 关于页面
│   └── search/         # 搜索页面
├── (projects)/         # 项目展示
├── (resources)/        # 资源页面
│   ├── agents/         # Agent 资源
│   ├── mcp/            # MCP 资源
│   └── prompts/        # Prompt 资源
├── api/                # API 路由
├── layout.tsx          # 根布局
├── globals.css         # 全局样式
└── ...
components/             # React 组件
├── layout/             # 布局组件
├── ui/                 # UI 组件
├── mdx/                # MDX 渲染组件
└── ...
content/                # Markdown 内容文件
├── articles/           # 文章
├── videos/             # 视频
└── design-patterns/    # 设计模式
lib/                    # 工具函数和数据获取
└── data.ts             # 内容数据管理
```

## 🎨 设计亮点

1. **玻璃拟态效果**: 导航栏、卡片、按钮使用毛玻璃效果
2. **渐变文字**: 标题使用渐变色，视觉冲击力强
3. **粒子背景**: 首页使用 Three.js 3D 粒子动画
4. **平滑过渡**: 页面切换、元素加载都有流畅动画
5. **代码高亮**: 支持多种编程语言语法高亮
6. **响应式布局**: 移动端优先，适配各种屏幕

## 🔧 配置说明

### GitHub Pages 部署

项目已配置为部署到 GitHub Pages：

- 基础路径: `/taoxf_blog/`
- 构建输出: `dist/`
- 部署命令: `npm run deploy`

### 环境变量

暂无环境变量配置需求。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📮 联系方式

- GitHub: [@taoxiaofeng](https://github.com/taoxiaofeng)
- Email: your-email@example.com

---

Made with ❤️ by Taoxf
