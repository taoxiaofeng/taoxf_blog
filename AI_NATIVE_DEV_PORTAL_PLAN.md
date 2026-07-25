# AI Native Developer Portal 改造优化计划

## 📋 项目概述

将现有的 React + Vite 博客升级为 **AI Native Developer Portal**，打造世界一流的开发者技术平台。

---

## 🎯 改造目标

### 当前状态
- ✅ React 18 + Vite 4 + Tailwind CSS v4
- ✅ 基础博客功能（文章/视频发布）
- ✅ 炫酷视觉效果（粒子动画/暗黑模式/玻璃拟态）
- ✅ Markdown 渲染 + Mermaid 支持
- ✅ 响应式设计

### 目标状态
- 🚀 Next.js 14 App Router（SSR/SSG/ISR）
- 🎨 shadcn/ui + Radix UI 组件库
- 📝 MDX 支持（交互式组件）
- 🤖 AI 原生能力（问答/搜索/总结/翻译）
- 📚 AI 实战内容（LLM/Prompt/Agent/MCP/RAG）
- 💾 数据库 + CMS（PostgreSQL + Drizzle ORM）
- 🔍 SEO 优化（Open Graph/JSON-LD/Sitemap/RSS）
- ⚡ Lighthouse 性能 ≥ 95
- 🛠️ 完整开发规范（TypeScript Strict/ESLint/Husky）

---

## 📐 技术架构

### 前端技术栈
```
Next.js 14 (App Router)
├── React 18
├── TypeScript 5.x (Strict Mode)
├── Tailwind CSS 4
├── shadcn/ui (基于 Radix UI)
├── Framer Motion (动画)
├── TanStack Query (数据获取)
└── Zustand (状态管理)
```

### 后端技术栈
```
Next.js Route Handler
├── Hono (可选轻量 API)
└── Next.js API Routes
```

### 数据库
```
PostgreSQL
└── Drizzle ORM (类型安全)
```

### Markdown/MDX
```
MDX (Next.js 内置支持)
├── Shiki (代码高亮)
├── Mermaid (图表)
├── PlantUML (架构图)
└── KaTeX (数学公式)
```

### AI 集成
```
OpenAI API / Anthropic Claude
├── AI 总结
├── AI 问答
├── AI Explain Code
├── AI 翻译
└── AI SEO (自动生成标签)
```

---

## 🗂️ 目录结构设计

```
taoxf_blog/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # 营销页面组
│   │   ├── page.tsx              # 首页
│   │   ├── about/                # 关于
│   │   └── resume/               # 在线简历
│   │
│   ├── (blog)/                   # 博客页面组
│   │   ├── articles/
│   │   │   ├── page.tsx          # 文章列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 文章详情
│   │   ├── videos/
│   │   │   ├── page.tsx          # 视频列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 视频详情
│   │   └── categories/
│   │       └── [category]/
│   │           └── page.tsx      # 分类筛选
│   │
│   ├── (ai)/                     # AI 实战页面组
│   │   ├── llm/                  # LLM 基础
│   │   ├── prompt/               # Prompt Engineering
│   │   ├── agent/                # AI Agent
│   │   ├── mcp/                  # MCP
│   │   ├── rag/                  # RAG
│   │   ├── ai-coding/            # AI Coding
│   │   ├── multimodal/           # 多模态
│   │   └── ai-workflow/          # AI Workflow
│   │
│   ├── (resources)/              # 资源中心
│   │   ├── prompts/              # Prompt Library
│   │   ├── agents/               # Agent Library
│   │   ├── mcps/                 # MCP Library
│   │   └── docs/                 # 文档导航
│   │
│   ├── (projects)/               # 项目展示
│   │   └── projects/
│   │       ├── page.tsx          # 项目列表
│   │       └── [slug]/
│   │           └── page.tsx      # 项目详情
│   │
│   ├── api/                      # API Routes
│   │   ├── ai/
│   │   │   ├── chat/route.ts     # AI 问答
│   │   │   ├── summarize/route.ts # AI 总结
│   │   │   └── translate/route.ts # AI 翻译
│   │   ├── comments/route.ts     # 评论系统
│   │   └── search/route.ts       # AI 搜索
│   │
│   ├── layout.tsx                # 根布局
│   ├── not-found.tsx             # 404 页面
│   └── robots.ts                 # SEO
│   └── sitemap.ts                # Sitemap
│
├── components/                   # 可复用组件
│   ├── ui/                       # shadcn/ui 组件
│   ├── layout/                   # 布局组件
│   ├── mdx/                      # MDX 组件
│   ├── ai/                       # AI 功能组件
│   └── shared/                   # 共享组件
│
├── content/                      # 内容文件
│   ├── articles/                 # 技术文章 (MDX)
│   ├── videos/                   # 视频元数据
│   ├── prompts/                  # Prompt 模板
│   ├── agents/                   # Agent 案例
│   ├── mcps/                     # MCP 案例
│   └── projects/                 # 项目案例
│
├── lib/                          # 工具库
│   ├── db/                       # 数据库 (Drizzle)
│   ├── ai/                       # AI 服务
│   ├── mdx/                      # MDX 处理
│   ├── seo/                      # SEO 工具
│   └── utils/                    # 通用工具
│
├── prisma/ 或 drizzle/           # 数据库 Schema
│   └── schema.ts
│
├── public/                       # 静态资源
│
├── styles/                       # 全局样式
│   └── globals.css
│
├── types/                        # TypeScript 类型定义
│
├── .eslintrc.json                # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── tailwind.config.ts            # Tailwind 配置
├── next.config.ts                # Next.js 配置
└── package.json
```

---

## 🚀 实施计划（分阶段）

### Phase 1: 基础设施升级（预计 2-3 天）

#### 1.1 迁移到 Next.js 14
- [ ] 初始化 Next.js 14 项目（App Router）
- [ ] 迁移路由配置（React Router → Next.js App Router）
- [ ] 配置 TypeScript Strict Mode
- [ ] 配置 Tailwind CSS v4
- [ ] 配置 shadcn/ui 组件库
- [ ] 迁移现有组件和页面
- [ ] 测试所有功能正常

#### 1.2 开发规范配置
- [ ] ESLint + Prettier 配置
- [ ] Husky + lint-staged 代码检查
- [ ] pnpm 包管理（替代 npm/yarn）
- [ ] 配置路径别名 (@/components, @/lib 等)

**输出物：**
- 完整的 Next.js 项目结构
- 所有现有功能正常运行
- 代码规范自动化

---

### Phase 2: MDX 升级与内容增强（预计 2 天）

#### 2.1 MDX 支持
- [ ] 安装并配置 MDX（next-mdx-remote 或 @next/mdx）
- [ ] 替换 React Markdown 为 MDX
- [ ] 集成 Shiki 代码高亮（替代 Prism）
- [ ] 添加 Mermaid 支持
- [ ] 添加 PlantUML 支持
- [ ] 添加 KaTeX 数学公式支持
- [ ] 创建自定义 MDX 组件（CodeBlock, MermaidChart 等）

#### 2.2 文章内容增强
- [ ] AI 总结功能（自动生成文章摘要）
- [ ] AI 问答功能（基于文章内容）
- [ ] AI Explain Code（代码解释）
- [ ] 阅读进度条（保留现有）
- [ ] 目录导航（保留现有）
- [ ] 分享按钮（保留现有）
- [ ] 评论系统（集成 Giscus 或自建）
- [ ] 点赞/收藏功能

**输出物：**
- 完整的 MDX 渲染系统
- AI 增强功能集成
- 互动功能（评论/点赞/收藏）

---

### Phase 3: AI 实战内容模块（预计 3-4 天）

#### 3.1 LLM 基础模块
- [ ] 创建 LLM 知识页面结构
- [ ] 编写核心概念内容（Transformer/Attention/Embedding 等）
- [ ] 添加架构图和代码示例
- [ ] 添加面试题库

#### 3.2 Prompt Engineering
- [ ] 创建 Prompt 模板库
- [ ] 实现 Prompt Playground（交互式测试）
- [ ] 添加 System Prompt/Few-shot/CoT/ReAct 案例
- [ ] 支持 JSON/XML Prompt 示例

#### 3.3 AI Agent
- [ ] 创建 Agent 案例页面
  - PR Review Agent
  - SQL Agent
  - Blog Agent
  - Test Agent
  - Translation Agent
- [ ] 实现 Agent 工作流可视化
- [ ] 添加 Memory/Planning/Reflection 示例

#### 3.4 MCP (Model Context Protocol)
- [ ] 创建 MCP 文档
- [ ] 实现 MCP 案例
  - GitHub MCP
  - Browser MCP
  - MySQL MCP
  - Redis MCP
  - Figma MCP
- [ ] MCP Server/Tool/Prompt/Resource 示例

#### 3.5 RAG
- [ ] RAG 架构文档
- [ ] 向量数据库集成示例（Milvus/Qdrant/PGVector）
- [ ] Chunk/Embedding/Retriever/Reranker 实现
- [ ] Hybrid Search 示例

#### 3.6 AI Coding
- [ ] AI 工具对比（Claude Code/Codex/Cursor/Qoder/Cline/Continue）
- [ ] 安装配置指南
- [ ] Rules/Skills/MCP 最佳实践

#### 3.7 多模态
- [ ] OCR/图像理解/图像生成
- [ ] 视频生成/TTS/ASR

#### 3.8 AI Workflow
- [ ] n8n/Dify/Flowise/LangGraph/CrewAI/Mastra 教程

**输出物：**
- 完整的 AI 实战知识库
- 可交互的 Prompt Playground
- 丰富的代码示例和架构图

---

### Phase 4: AI 原生能力集成（预计 2-3 天）

#### 4.1 AI API 集成
- [ ] 配置 OpenAI API / Claude API
- [ ] 创建 AI 服务层（lib/ai/）
- [ ] 实现 API Routes
  - /api/ai/chat (AI 问答)
  - /api/ai/summarize (AI 总结)
  - /api/ai/translate (AI 翻译)
  - /api/ai/explain-code (代码解释)
  - /api/ai/search (AI 搜索)

#### 4.2 前端 AI 功能
- [ ] 文章页 AI 问答组件
- [ ] AI 总结按钮
- [ ] AI 翻译功能（多语言）
- [ ] AI Explain Code（选中代码后解释）
- [ ] AI 搜索（语义搜索）
- [ ] AI 自动生成标签和 SEO 元数据

#### 4.3 性能优化
- [ ] 使用 TanStack Query 缓存 AI 响应
- [ ] 流式响应（Streaming）
- [ ] 错误处理和重试机制
- [ ] 加载状态和骨架屏

**输出物：**
- 完整的 AI 功能集成
- 流畅的用户体验
- 高性能的 API 调用

---

### Phase 5: 数据库与 CMS（预计 2-3 天）

#### 5.1 数据库配置
- [ ] 安装 PostgreSQL
- [ ] 配置 Drizzle ORM
- [ ] 创建数据模型
  - Article（文章）
  - Video（视频）
  - Comment（评论）
  - Like（点赞）
  - Bookmark（收藏）
  - User（用户）
  - Tag（标签）
  - Category（分类）

#### 5.2 CMS 功能
- [ ] 文章管理（CRUD）
- [ ] 视频管理
- [ ] 评论管理
- [ ] Prompt/MCP/Agent 管理
- [ ] SEO 管理（自定义元数据）
- [ ] RSS 生成
- [ ] Sitemap 生成

#### 5.3 内容迁移
- [ ] 迁移现有 Markdown 文章到 MDX
- [ ] 更新视频元数据
- [ ] 保持 URL 结构兼容

**输出物：**
- 完整的数据库系统
- CMS 管理功能
- 内容迁移完成

---

### Phase 6: 资源中心（预计 2 天）

#### 6.1 Prompt Library
- [ ] Prompt 模板展示
- [ ] 分类筛选（System/Few-shot/CoT/ReAct）
- [ ] 复制功能
- [ ] Prompt Playground 集成

#### 6.2 Agent Library
- [ ] Agent 案例展示
- [ ] 工作流可视化
- [ ] 源码下载

#### 6.3 MCP Library
- [ ] MCP Server 展示
- [ ] Tool/Prompt/Resource 分类
- [ ] 快速集成指南

#### 6.4 技术导航
- [ ] 官方文档导航
- [ ] 模型评测
- [ ] 视频教程聚合

**输出物：**
- 完整的资源中心
- 丰富的学习资源
- 便捷的导航系统

---

### Phase 7: SEO 与性能优化（预计 1-2 天）

#### 7.1 SEO 优化
- [ ] Open Graph 标签（社交分享）
- [ ] JSON-LD 结构化数据（Schema.org）
- [ ] RSS Feed 生成
- [ ] Sitemap.xml 生成
- [ ] robots.txt 配置
- [ ] 语义化 HTML
- [ ] 动态 meta 标签（基于内容）

#### 7.2 性能优化
- [ ] SSR/SSG/ISR 策略
  - 首页：SSG（静态生成）
  - 文章列表：ISR（增量静态再生）
  - 文章详情：SSR（动态渲染）+ SSG 缓存
- [ ] 图片优化（next/image）
- [ ] 字体优化（next/font）
- [ ] 代码分割和懒加载
- [ ] CDN 配置
- [ ] Lighthouse 优化（目标 ≥ 95）

**输出物：**
- SEO 完全优化
- 高性能页面加载
- Lighthouse 高分

---

### Phase 8: 项目展示与在线简历（预计 1-2 天）

#### 8.1 项目展示
- [ ] 项目列表页
- [ ] 项目详情页
  - 需求/架构/UI/API/数据库/部署/性能
  - 完整源码链接
- [ ] GitHub API 集成（显示 Star/Fork）

#### 8.2 在线简历
- [ ] 个人信息
- [ ] 工作经历
- [ ] 技能栈展示
- [ ] 项目经验
- [ ] 教育背景
- [ ] PDF 导出

**输出物：**
- 完整的项目展示系统
- 专业的在线简历

---

### Phase 9: 测试与部署（预计 1 天）

#### 9.1 测试
- [ ] Vitest 单元测试
- [ ] Playwright E2E 测试
- [ ] Storybook 组件文档
- [ ] GitHub Actions CI/CD

#### 9.2 部署
- [ ] Vercel 部署（推荐）
- [ ] 环境变量配置
- [ ] 数据库连接（Supabase/Neon）
- [ ] 域名配置
- [ ] HTTPS 证书

#### 9.3 监控
- [ ] Vercel Analytics
- [ ] Sentry 错误追踪
- [ ] Uptime 监控

**输出物：**
- 完整的测试覆盖
- 生产环境部署
- 实时监控

---

## 📊 预期成果

### 功能完整度
- ✅ 技术博客（文章/视频/分类/标签）
- ✅ AI 实战（LLM/Prompt/Agent/MCP/RAG）
- ✅ AI 原生能力（问答/搜索/总结/翻译）
- ✅ 资源中心（Prompt/Agent/MCP Library）
- ✅ 项目展示 + 在线简历
- ✅ CMS + 数据库
- ✅ SEO 优化
- ✅ 高性能（Lighthouse ≥ 95）

### 技术指标
- TypeScript Strict Mode: 100%
- 代码覆盖率: ≥ 80%
- Lighthouse Performance: ≥ 95
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

### 设计指标
- 响应式设计（Mobile/Tablet/Desktop）
- 暗黑模式
- Glassmorphism + Aurora Background
- Bento Grid 布局
- Motion Design 动画

---

## ⚠️ 风险与注意事项

### 技术风险
1. **迁移复杂度**：React Router → Next.js App Router 可能需要重构部分逻辑
2. **AI API 成本**：需要控制 API 调用频率和缓存策略
3. **数据库选择**：PostgreSQL 需要额外运维，可考虑 Supabase/Neon 托管服务

### 性能风险
1. **MDX 编译**：大量 MDX 文件可能影响构建速度
2. **AI 响应延迟**：需要实现流式响应和缓存
3. **图片资源**：使用 next/image 和 CDN 优化

### SEO 风险
1. **客户端渲染**：确保关键内容 SSR/SSG
2. **动态 meta**：每个页面独立配置
3. **结构化数据**：使用 JSON-LD 正确标记

---

## 🎯 优先级排序

### P0（必须）
1. Next.js 迁移
2. MDX 升级
3. AI 核心功能（问答/总结）
4. SEO 优化
5. 性能优化

### P1（重要）
1. 数据库 + CMS
2. AI 实战内容
3. 资源中心
4. 在线简历

### P2（加分）
1. 评论系统
2. 点赞/收藏
3. 多语言支持
4. 高级动画效果

---

## 📅 时间规划

| 阶段 | 预计时间 | 优先级 |
|------|----------|--------|
| Phase 1: 基础设施 | 2-3 天 | P0 |
| Phase 2: MDX 升级 | 2 天 | P0 |
| Phase 3: AI 实战内容 | 3-4 天 | P1 |
| Phase 4: AI 原生能力 | 2-3 天 | P0 |
| Phase 5: 数据库 CMS | 2-3 天 | P1 |
| Phase 6: 资源中心 | 2 天 | P1 |
| Phase 7: SEO 性能 | 1-2 天 | P0 |
| Phase 8: 项目简历 | 1-2 天 | P1 |
| Phase 9: 测试部署 | 1 天 | P2 |

**总计：16-21 天**

---

## 🚀 快速启动（Phase 1 详细步骤）

### 步骤 1：初始化 Next.js 项目
```bash
# 备份当前项目
cp -r taoxf_blog taoxf_blog_backup

# 创建 Next.js 项目
npx create-next-app@latest taoxf_blog_new --typescript --tailwind --app --src-dir --import-alias "@/*"

# 进入项目
cd taoxf_blog_new
```

### 步骤 2：安装依赖
```bash
pnpm add framer-motion three @react-three/fiber @react-three/drei
pnpm add @mdx-js/loader @mdx-js/react next-mdx-remote
pnpm add shiki mermaid katex
pnpm add @tanstack/react-query zustand
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg
```

### 步骤 3：配置 shadcn/ui
```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog input textarea select tabs accordion dropdown-menu toast skeleton avatar badge separator scroll-area
```

### 步骤 4：迁移文件
- 复制 components/ 到新项目
- 复制 content/ 到新项目
- 复制 pages/ 到 app/ 目录（转换为 Next.js 路由）
- 更新导入路径

### 步骤 5：配置 Next.js
```typescript
// next.config.ts
const nextConfig = {
  mdxRs: true,
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-three/fiber'],
  },
};

export default nextConfig;
```

### 步骤 6：测试运行
```bash
pnpm dev
# 访问 http://localhost:3000
```

---

## 📝 后续规划

### V2 功能
- [ ] 用户系统（登录/注册）
- [ ] 订阅功能（Newsletter）
- [ ] 付费内容
- [ ] AI 训练平台
- [ ] 社区功能

### V3 功能
- [ ] 移动端 App（React Native）
- [ ] PWA 支持
- [ ] 离线阅读
- [ ] AI 个性化推荐

---

## 🎉 总结

本改造计划将现有的炫酷技术博客升级为 **世界一流的 AI Native Developer Portal**，整合：

- 技术博客 + AI 实战
- Agent + MCP + RAG
- AI Coding + 多模态
- 视频教程 + 开源项目
- 在线简历 + AI 工具平台

成为个人品牌、知识沉淀和 AI 工程实践的统一平台！
