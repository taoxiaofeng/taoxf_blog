import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListBulletIcon } from '@heroicons/react/24/outline';

interface TableOfContentsProps {
  content: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 解析 Markdown 中的标题
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    const parsedHeadings: Heading[] = matches.map((match, index) => ({
      id: `heading-${index}`,
      text: match[2].trim(),
      level: match[1].length,
    }));

    setHeadings(parsedHeadings);

    // 为实际 DOM 中的标题添加 ID
    setTimeout(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headingElements.forEach((el, index) => {
        if (parsedHeadings[index]) {
          el.id = parsedHeadings[index].id;
        }
      });
    }, 100);
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
      { rootMargin: '-20% 0% -80% 0%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* 移动端切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed right-4 bottom-20 p-3 glass rounded-full shadow-lg z-40"
        aria-label="Toggle table of contents"
      >
        <ListBulletIcon className="w-6 h-6" />
      </button>

      {/* 目录容器 */}
      <motion.aside
        className={`fixed right-0 top-20 bottom-20 w-72 glass rounded-l-xl p-6 z-30 overflow-y-auto transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <h3 className="text-lg font-bold mb-4 gradient-text">目录</h3>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`block w-full text-left py-1 transition-colors ${
                activeId === heading.id
                  ? 'text-primary-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-500'
              }`}
              style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
            >
              <span className="text-sm line-clamp-1">{heading.text}</span>
            </button>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}
