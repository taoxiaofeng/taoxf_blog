'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Article {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
}

interface RelatedArticlesProps {
  currentSlug: string;
  currentTags: string[];
  currentCategory: string;
  allArticles: Article[];
}

export default function RelatedArticles({
  currentSlug,
  currentTags,
  currentCategory,
  allArticles,
}: RelatedArticlesProps) {
  // 计算相关文章（基于标签和分类匹配）
  const relatedArticles = allArticles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => {
      // 计算匹配分数
      const tagMatch = article.tags.filter((tag) => currentTags.includes(tag)).length;
      const categoryMatch = article.category === currentCategory ? 2 : 0;
      return { ...article, score: tagMatch + categoryMatch };
    })
    .filter((article) => article.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">相关文章</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article, index) => (
          <motion.article
            key={article.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={`/articles/${article.slug}`}
              className="block glass rounded-xl p-6 hover:shadow-lg transition-shadow h-full"
            >
              {/* 分类标签 */}
              <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
                {article.category}
              </span>

              {/* 标题 */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {article.title}
              </h3>

              {/* 摘要 */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
