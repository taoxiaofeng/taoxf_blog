import { getAlgorithms, getAlgorithmBySlug } from '@/lib/data';
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
  const algorithms = getAlgorithms();
  return algorithms.map((algo) => ({
    slug: algo.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const algo = getAlgorithmBySlug(params.slug);
  if (!algo) {
    return { title: '算法未找到' };
  }
  return {
    title: algo.title,
    description: algo.excerpt,
  };
}

export default function AlgorithmDetailPage({ params }: Props) {
  const algo = getAlgorithmBySlug(params.slug);

  if (!algo) {
    notFound();
  }

  const difficultyColors: Record<string, string> = {
    '入门': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    '基础': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    '进阶': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    '深入': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <ReadingProgress />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        {/* 面包屑导航 */}
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 mt-8">
          {/* 文章主体 */}
          <article className="glass rounded-xl p-4 sm:p-8">
            {/* 标题区 */}
            <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[algo.difficulty] || ''}`}>
                  {algo.difficulty}级
                </span>
                {algo.readingTime && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    {algo.readingTime} 分钟阅读
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {algo.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {algo.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {algo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-400"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* VisuAlgo 交互式动画 */}
            {algo.visualgoUrl && (
              <div className="my-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    交互式演示 — 来自 VisuAlgo
                  </span>
                  <a
                    href={algo.visualgoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    在新窗口打开 →
                  </a>
                </div>
                <iframe
                  src={algo.visualgoUrl}
                  className="w-full h-[500px] bg-white"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  title={`${algo.title} - VisuAlgo 交互演示`}
                  loading="lazy"
                />
              </div>
            )}

            {/* Markdown 内容 */}
            <MDContent content={algo.content} />

            {/* 返回链接 */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/algorithms"
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                返回算法列表
              </Link>
            </div>
          </article>

          {/* 目录 */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={algo.content} />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
