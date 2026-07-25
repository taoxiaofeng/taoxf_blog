import { getArticles, getArticleBySlug } from '@/lib/data';
import MDContent from '@/components/MDContent';
import ReadingProgress from '@/components/ReadingProgress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CalendarIcon, TagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

dayjs.locale('zh-cn');

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) {
    return { title: '文章未找到' };
  }
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Person',
      name: 'Tao Xiaofeng',
    },
    publisher: {
      '@type': 'Person',
      name: 'Tao Xiaofeng',
    },
    keywords: article.tags.join(', '),
    articleSection: article.category,
    inLanguage: 'zh-CN',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 返回按钮 */}
        <Link
          href="/articles"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>返回文章列表</span>
        </Link>

        {/* 文章头部 */}
        <article className="glass rounded-2xl p-8 md:p-12">
          {/* 分类 */}
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            {article.category}
          </span>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {article.title}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{dayjs(article.date).format('YYYY年MM月DD日')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TagIcon className="w-5 h-5" />
              <div className="flex space-x-2">
                {article.tags.map((tag) => (
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
          <MDContent content={article.content} />
        </article>

        {/* 文章底部导航 */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            href="/articles"
            className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>查看更多文章</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
