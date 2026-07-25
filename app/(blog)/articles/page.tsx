import { getArticles, getAllTags, getAllCategories } from '@/lib/data';
import ArticlesList from '@/components/ArticlesList';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '文章',
  description: '技术博客文章列表',
};

export default function ArticlesPage() {
  const articles = getArticles();
  const tags = getAllTags();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">文章</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            探索技术,分享知识,记录成长
          </p>
        </div>

        <ArticlesList articles={articles} tags={tags} categories={categories} />
      </main>

      <Footer />
    </div>
  );
}
