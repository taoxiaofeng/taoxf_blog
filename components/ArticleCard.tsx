'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

interface ArticleCardProps {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  excerpt: string;
  cover?: string;
}

export default function ArticleCard({ slug, title, date, tags, category, excerpt, cover }: ArticleCardProps) {
  return (
    <motion.article
      className="glass rounded-xl overflow-hidden card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/articles/${slug}`} className="block">
        {/* 封面图片 */}
        {cover && (
          <div className="aspect-video overflow-hidden">
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* 文章内容 */}
        <div className="p-6">
          {/* 分类标签 */}
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
            {category}
          </span>

          {/* 标题 */}
          <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary-500 transition-colors">
            {title}
          </h3>

          {/* 摘要 */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
            {excerpt}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {/* 日期 */}
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4" />
              <span>{dayjs(date).format('YYYY-MM-DD')}</span>
            </div>

            {/* 标签 */}
            <div className="flex items-center space-x-2">
              <TagIcon className="w-4 h-4" />
              <div className="flex space-x-1">
                {tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs">
                    #{tag}
                  </span>
                ))}
                {tags.length > 2 && <span className="text-xs">+{tags.length - 2}</span>}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
