import { getArticles, getVideos } from '@/lib/data';
import SearchInput from '@/components/SearchInput';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索文章、视频、Prompt 和 Agent',
};

export default function SearchPage() {
  const articles = getArticles();
  const videos = getVideos();

  // 构建可搜索数据
  const searchItems = [
    ...articles.map((article) => ({
      type: 'article' as const,
      slug: article.slug,
      title: article.title,
      content: article.excerpt + ' ' + article.content,
      tags: article.tags,
      category: article.category,
    })),
    ...videos.map((video) => ({
      type: 'video' as const,
      slug: video.slug,
      title: video.title,
      content: video.description + ' ' + video.content,
      tags: video.tags,
      category: video.category,
    })),
    // 添加 Prompt 条目
    {
      type: 'prompt' as const,
      slug: 'code-review',
      title: '代码审查 Prompt',
      content: '专业的代码审查模板，帮助团队提高代码质量',
      tags: ['code-review', 'quality'],
      category: '开发工具',
    },
    {
      type: 'prompt' as const,
      slug: 'doc-generation',
      title: '文档生成 Prompt',
      content: '自动生成技术文档的 Prompt 模板',
      tags: ['documentation', 'automation'],
      category: '开发工具',
    },
    {
      type: 'prompt' as const,
      slug: 'sql-optimization',
      title: 'SQL 优化 Prompt',
      content: '数据库查询优化建议和最佳实践',
      tags: ['sql', 'database', 'optimization'],
      category: '数据库',
    },
    {
      type: 'prompt' as const,
      slug: 'api-design',
      title: 'API 设计 Prompt',
      content: 'RESTful API 设计原则和规范',
      tags: ['api', 'design', 'rest'],
      category: '架构设计',
    },
    {
      type: 'prompt' as const,
      slug: 'debug-assistant',
      title: '调试助手 Prompt',
      content: '快速定位和解决 Bug 的 AI 辅助调试',
      tags: ['debugging', 'troubleshooting'],
      category: '开发工具',
    },
    {
      type: 'prompt' as const,
      slug: 'code-refactoring',
      title: '代码重构 Prompt',
      content: '安全的代码重构策略和模式',
      tags: ['refactoring', 'clean-code'],
      category: '代码质量',
    },
    // 添加 Agent 条目
    {
      type: 'agent' as const,
      slug: 'code-reviewer',
      title: '代码审查 Agent',
      content: '自动化的代码审查代理，支持多种编程语言',
      tags: ['code-review', 'automation'],
      category: '开发辅助',
    },
    {
      type: 'agent' as const,
      slug: 'data-analyst',
      title: '数据分析 Agent',
      content: '智能数据分析与可视化生成',
      tags: ['data', 'analytics', 'visualization'],
      category: '数据分析',
    },
    {
      type: 'agent' as const,
      slug: 'tech-support',
      title: '技术支持 Agent',
      content: '7x24 小时技术问题解答',
      tags: ['support', 'troubleshooting'],
      category: '技术支持',
    },
    {
      type: 'agent' as const,
      slug: 'project-manager',
      title: '项目管理 Agent',
      content: '智能任务分解和进度跟踪',
      tags: ['project-management', 'planning'],
      category: '项目管理',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-4">搜索</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            搜索文章、视频、Prompt 模板和 Agent 场景
          </p>
        </div>

        <div className="mb-8">
          <SearchInput items={searchItems} />
        </div>

        {/* 搜索提示 */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            搜索提示
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">📝 文章搜索</h3>
              <ul className="space-y-1">
                <li>• 按标题、内容、标签搜索</li>
                <li>• 支持模糊匹配</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">🎥 视频搜索</h3>
              <ul className="space-y-1">
                <li>• 按标题、描述、标签搜索</li>
                <li>• 快速定位教程</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">💡 Prompt 模板</h3>
              <ul className="space-y-1">
                <li>• 代码审查、文档生成</li>
                <li>• SQL 优化、API 设计</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">🤖 Agent 场景</h3>
              <ul className="space-y-1">
                <li>• 代码审查、数据分析</li>
                <li>• 技术支持、项目管理</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
