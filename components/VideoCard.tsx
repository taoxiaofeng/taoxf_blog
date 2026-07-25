'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, TagIcon, PlayIcon, ClockIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

interface VideoCardProps {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  description: string;
  thumbnail?: string;
  videoUrl: string;
  duration?: string;
}

export default function VideoCard({ slug, title, date, tags, category, description, thumbnail, videoUrl, duration }: VideoCardProps) {
  return (
    <motion.article
      className="glass rounded-xl overflow-hidden card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/videos/${slug}`} className="block">
        {/* 视频缩略图 */}
        <div className="aspect-video overflow-hidden relative bg-gray-200 dark:bg-gray-700">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PlayIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          {/* 播放按钮覆盖层 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors">
            <div className="w-14 h-14 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg">
              <PlayIcon className="w-7 h-7 text-primary-500 ml-1" />
            </div>
          </div>
          {/* 视频时长 */}
          {duration && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
              {duration}
            </div>
          )}
        </div>

        {/* 视频内容 */}
        <div className="p-6">
          {/* 分类标签 */}
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-3">
            {category}
          </span>

          {/* 标题 */}
          <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary-500 transition-colors">
            {title}
          </h3>

          {/* 描述 */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
            {description}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            {/* 日期和时长 */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>{dayjs(date).format('YYYY-MM-DD')}</span>
              </div>
              {duration && (
                <div className="flex items-center space-x-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{duration}</span>
                </div>
              )}
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
