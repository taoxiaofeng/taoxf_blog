import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: '404 - 页面未找到',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            页面未找到
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            抱歉，您访问的页面不存在或已被移除。
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
            <Link
              href="/articles"
              className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>浏览文章</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
