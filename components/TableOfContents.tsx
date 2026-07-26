'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // 从已渲染的 DOM 中提取标题（id 由 rehype-slug 生成，保证与锚点一致）
    const elements = Array.from(
      document.querySelectorAll('article h2[id], article h3[id], article h4[id]')
    );
    const headings: TOCItem[] = elements.map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: Number(el.tagName.charAt(1)),
    }));

    setToc(headings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -75% 0%' }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // 同步 URL hash，与正文锚点链接行为一致
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
        目录
      </h3>
      <ul className="space-y-1">
        {toc.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left py-1 px-2 rounded transition-colors text-sm ${
                item.level === 2
                  ? 'pl-2'
                  : item.level === 3
                  ? 'pl-4'
                  : 'pl-6'
              } ${
                activeId === item.id
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
