'use client';

import { useState, useMemo } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // 筛选逻辑
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const categoryMatch = !selectedCategory || article.category === selectedCategory;
      const tagMatch = !selectedTag || article.tags.includes(selectedTag);
      return categoryMatch && tagMatch;
    });
  }, [articles, selectedCategory, selectedTag]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => prev === category ? '' : category);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(prev => prev === tag ? '' : tag);
    setCurrentPage(1);
  };

  return (
    <>
      {/* 筛选器 */}
      <div className="mb-8 p-6 glass rounded-xl">
        {/* 分类筛选 */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">分类</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick('')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                !selectedCategory
                  ? 'bg-primary-500 text-white'
                  : 'glass text-gray-700 dark:text-gray-300 hover:bg-primary-500 hover:text-white'
              }`}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'glass text-gray-700 dark:text-gray-300 hover:bg-primary-500 hover:text-white'
                }`}
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
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary-500 text-white'
                    : 'glass text-gray-700 dark:text-gray-300 hover:bg-primary-500 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 筛选结果提示 */}
        {(selectedCategory || selectedTag) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              筛选结果: <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredArticles.length}</span> 篇文章
              {selectedCategory && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                  分类: {selectedCategory}
                </span>
              )}
              {selectedTag && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                  标签: {selectedTag}
                </span>
              )}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedTag('');
                setCurrentPage(1);
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              清除筛选
            </button>
          </div>
        )}
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
      {filteredArticles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            没有找到符合条件的文章
          </p>
          {(selectedCategory || selectedTag) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedTag('');
                setCurrentPage(1);
              }}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              清除筛选条件
            </button>
          )}
        </div>
      )}
    </>
  );
}
