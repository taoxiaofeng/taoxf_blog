'use client';

import { useState } from 'react';
import { Article } from '@/lib/data';
import ArticleCard from '@/components/ArticleCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ArticlesListProps {
  articles: Article[];
  tags: string[];
  categories: string[];
}

const ARTICLES_PER_PAGE = 3;

export default function ArticlesList({ articles, tags, categories }: ArticlesListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  return (
    <>
      {/* 筛选器 */}
      <div className="mb-8 p-6 glass rounded-xl">
        {/* 分类筛选 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">分类</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 glass text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-primary-500 hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 标签筛选 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">标签</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 glass text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-primary-500 hover:text-white transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            slug={article.slug}
            title={article.title}
            date={article.date}
            tags={article.tags}
            category={article.category}
            excerpt={article.excerpt}
            cover={article.cover}
            readingTime={article.readingTime}
          />
        ))}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-4 py-2 glass rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-white transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>上一页</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-primary-500 text-white'
                    : 'glass text-gray-700 dark:text-gray-300 hover:bg-primary-500 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 px-4 py-2 glass rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 hover:text-white transition-colors"
          >
            <span>下一页</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 空状态 */}
      {articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            暂无文章,敬请期待!
          </p>
        </div>
      )}
    </>
  );
}
