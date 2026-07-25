import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import CopyButton from '@/components/CopyButton';
import { StarIcon, TagIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Prompt 库',
  description: '精选实用的 AI Prompt 模板，提升你的提示词工程能力',
};

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  featured?: boolean;
}

const prompts: Prompt[] = [
  {
    id: '1',
    title: '代码审查助手',
    description: '帮助开发者进行代码审查，发现潜在问题和改进建议',
    content: `你是一位资深代码审查专家。请审查以下代码，从以下维度给出详细反馈：

1. 代码质量（可读性、可维护性）
2. 潜在 Bug 和安全问题
3. 性能优化建议
4. 设计模式与最佳实践
5. 命名规范和注释质量

对于每个问题，请：
- 指出具体位置
- 说明问题原因
- 给出改进后的代码示例

代码：
\`\`\`
{code}
\`\`\``,
    tags: ['代码审查', '开发效率', '最佳实践'],
    category: '开发工具',
    featured: true,
  },
  {
    id: '2',
    title: '技术文档生成器',
    description: '根据代码自动生成清晰的技术文档',
    content: `你是一位技术文档专家。请为以下代码生成完整的技术文档，包括：

1. 功能概述（一句话描述）
2. 参数说明（类型、必填、默认值、描述）
3. 返回值说明
4. 使用示例（至少 2 个）
5. 注意事项和边界情况
6. 相关链接或参考

请使用中文编写，格式清晰，适合直接嵌入到项目的 README 或文档站点中。

代码：
\`\`\`
{code}
\`\`\``,
    tags: ['文档', '开发效率'],
    category: '开发工具',
  },
  {
    id: '3',
    title: 'SQL 优化专家',
    description: '分析和优化 SQL 查询，提升数据库性能',
    content: `你是一位数据库优化专家。请分析以下 SQL 查询，并给出优化建议：

1. 执行计划分析
2. 索引优化建议
3. 查询重写方案
4. 性能瓶颈识别
5. 分页和大数据量处理建议

原始 SQL：
\`\`\`sql
{sql}
\`\`\`

表结构：
\`\`\`
{schema}
\`\`\``,
    tags: ['SQL', '数据库', '性能优化'],
    category: '数据库',
    featured: true,
  },
  {
    id: '4',
    title: 'Bug 分析侦探',
    description: '根据错误日志快速定位和分析问题根因',
    content: `你是一位 Bug 分析专家。请根据以下错误信息，系统地分析问题：

1. 错误类型和严重程度判断
2. 可能的原因分析（列出 Top 3）
3. 根因推测
4. 解决方案（按优先级排序）
5. 预防措施建议

错误信息：
\`\`\`
{error}
\`\`\`

上下文代码：
\`\`\`
{context}
\`\`\``,
    tags: ['调试', 'Bug 修复', '运维'],
    category: '开发工具',
  },
  {
    id: '5',
    title: 'API 设计评审',
    description: '评审 RESTful API 设计，确保符合最佳实践',
    content: `你是一位 API 设计专家。请评审以下 API 设计，从以下维度给出建议：

1. RESTful 规范符合度
2. URL 命名和版本控制
3. HTTP 方法使用正确性
4. 状态码选择
5. 请求/响应体设计
6. 安全性和认证
7. 文档完整性
8. 版本兼容性

API 定义：
\`\`\`
{api_definition}
\`\`\``,
    tags: ['API', '架构设计', '后端'],
    category: '架构',
    featured: true,
  },
  {
    id: '6',
    title: 'React 组件重构',
    description: '将旧版 React 组件重构为现代化最佳实践',
    content: `你是一位 React 专家。请将以下组件重构为符合现代 React 最佳实践的代码：

重构目标：
1. 使用函数组件 + Hooks
2. TypeScript 类型安全
3. 性能优化（useMemo, useCallback）
4. 可访问性（a11y）
5. 错误边界处理
6. 代码分割（Suspense + lazy）
7. 测试友好设计

原始组件：
\`\`\`tsx
{component}
\`\`\`

请提供重构后的完整代码，并说明每处改动的理由。`,
    tags: ['React', '重构', '前端'],
    category: '前端开发',
  },
];

const categories = Array.from(new Set(prompts.map((p) => p.category)));

export default function PromptsPage() {
  const featuredPrompts = prompts.filter((p) => p.featured);
  const regularPrompts = prompts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Prompt 库</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            精选实用的 AI Prompt 模板，覆盖代码审查、文档生成、SQL 优化等开发场景。
            复制即用，提升你的提示词工程能力。
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">全部</button>
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 glass text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-primary-500 hover:text-white transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* 精选 Prompt */}
        {featuredPrompts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
              精选 Prompt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        )}

        {/* 全部 Prompt */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">全部 Prompt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="glass rounded-xl p-6 card-hover flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full">
          {prompt.category}
        </span>
        {prompt.featured && <StarIcon className="w-5 h-5 text-yellow-500" />}
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{prompt.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1">{prompt.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags.map((tag) => (
          <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <TagIcon className="w-3 h-3 mr-1" />
            {tag}
          </span>
        ))}
      </div>

      <CopyButton content={prompt.content} />
    </div>
  );
}


