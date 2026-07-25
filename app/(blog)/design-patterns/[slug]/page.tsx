import { getDesignPatterns, getDesignPatternBySlug } from '@/lib/data';
import MDContent from '@/components/MDContent';
import TableOfContents from '@/components/TableOfContents';
import ReadingProgress from '@/components/ReadingProgress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { TagIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const patterns = getDesignPatterns();
  return patterns.map((pattern) => ({
    slug: pattern.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = getDesignPatternBySlug(params.slug);
  if (!pattern) {
    return { title: '设计模式未找到' };
  }
  return {
    title: `${pattern.title} - 设计模式`,
    description: pattern.excerpt,
    keywords: pattern.tags,
    openGraph: {
      title: pattern.title,
      description: pattern.excerpt,
      type: 'article',
    },
  };
}

export default function DesignPatternPage({ params }: Props) {
  const pattern = getDesignPatternBySlug(params.slug);

  if (!pattern) {
    notFound();
  }

  const typeColors: Record<string, string> = {
    '创建型模式': 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    '结构型模式': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    '行为型模式': 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <ReadingProgress />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <Breadcrumb />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* 文章内容区域 */}
          <div className="lg:col-span-8">
            {/* 返回按钮 */}
            <Link
              href="/design-patterns"
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors mb-8"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>返回设计模式列表</span>
            </Link>

            {/* 文章头部 */}
            <article className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12">
              {/* 分类标签 */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-full ${typeColors[pattern.patternType] || 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30'}`}>
                  {pattern.patternType}
                </span>
              </div>

              {/* 标题 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                {pattern.title}
              </h1>

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-500 dark:text-gray-400">
                {pattern.readingTime && (
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-5 h-5" />
                    <span>预计阅读 {pattern.readingTime} 分钟</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <TagIcon className="w-5 h-5" />
                  <div className="flex space-x-2">
                    {pattern.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 分割线 */}
              <hr className="border-gray-200 dark:border-gray-700 mb-8" />

              {/* 文章内容 */}
              <MDContent content={pattern.content} />
            </article>

            {/* 文章底部导航 */}
            <div className="mt-8 flex justify-between items-center">
              <Link
                href="/design-patterns"
                className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>查看更多设计模式</span>
              </Link>
            </div>
          </div>

          {/* 目录侧边栏 */}
          <aside className="lg:col-span-4">
            <TableOfContents content={pattern.content} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
