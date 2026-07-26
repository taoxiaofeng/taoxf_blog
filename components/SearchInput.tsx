'use client';

import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchableItem {
  type: 'article' | 'video' | 'prompt' | 'agent';
  slug: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
}

interface SearchInputProps {
  items: SearchableItem[];
}

export default function SearchInput({ items }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'content', weight: 0.3 },
          { name: 'tags', weight: 0.15 },
          { name: 'category', weight: 0.05 },
        ],
        threshold: 0.3,
        includeScore: true,
      }),
    [items]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 10);
  }, [query, fuse]);

  const typeColors = {
    article: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    video: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    prompt: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    agent: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  };

  const typeLabels = {
    article: '文章',
    video: '视频',
    prompt: 'Prompt',
    agent: 'Agent',
  };

  const getTypePath = (type: string, slug: string) => {
    switch (type) {
      case 'article':
        return `/articles/${slug}`;
      case 'video':
        return `/videos/${slug}`;
      case 'prompt':
        return `/prompts#${slug}`;
      case 'agent':
        return `/agents#${slug}`;
      default:
        return '#';
    }
  };

  return (
    <div className="relative">
      {/* 搜索框 */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="搜索文章、视频、Prompt、Agent..."
          className="w-full pl-10 pr-10 py-2 glass rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50"
          >
            <div className="max-h-96 overflow-y-auto">
              {results.map(({ item, score }) => (
                <Link
                  key={`${item.type}-${item.slug}`}
                  href={getTypePath(item.type, item.slug)}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs rounded ${typeColors[item.type]}`}>
                          {typeLabels[item.type]}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {item.content.substring(0, 120)}...
                      </p>
                    </div>
                    {score !== undefined && score < 0.2 && (
                      <span className="text-xs text-green-600 dark:text-green-400 whitespace-nowrap">
                        高度匹配
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 无结果 */}
      <AnimatePresence>
        {isOpen && query.trim() && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-6 text-center z-50"
          >
            <p className="text-gray-600 dark:text-gray-400">
              未找到与 {'"'}{query}{'"'} 相关的内容
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              尝试其他关键词搜索
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
