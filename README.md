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
- **构建工具**: Vite 4
- **样式方案**: Tailwind CSS 4
- **路由**: React Router DOM 6
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

访问 http://localhost:5173/taoxf_blog/

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

1. 在 `src/content/articles/` 目录创建新的 Markdown 文件
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

1. 在 `src/content/videos/` 目录创建新的 Markdown 文件
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

编辑 `tailwind.config.js` 修改主题色：

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义主题色
      }
    }
  }
}
```

## 📁 项目结构

```
src/
├── components/          # 组件
│   ├── layout/         # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── RootLayout.tsx
│   ├── ArticleCard.tsx
│   ├── MarkdownRenderer.tsx
│   ├── VideoPlayer.tsx
│   ├── ParticleBackground.tsx
│   └── ThemeToggle.tsx
├── pages/              # 页面
│   ├── Home.tsx
│   ├── Articles.tsx
│   ├── ArticleDetail.tsx
│   ├── Videos.tsx
│   ├── VideoDetail.tsx
│   └── About.tsx
├── content/            # 内容文件
│   ├── articles/       # 文章 Markdown
│   └── videos/         # 视频 Markdown
├── data/               # 数据管理
│   └── articles.ts
├── hooks/              # 自定义 Hooks
│   └── useTheme.ts
└── routes/             # 路由配置
    └── index.tsx
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
- 构建输出: `build/`
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
