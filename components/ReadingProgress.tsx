'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollProgress = totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0;
      
      setProgress(scrollProgress);
      setShowButton(scrollPosition > 500);
    };

    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 阅读进度条 */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 返回顶部按钮 */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 glass rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title="返回顶部"
          >
            <ArrowUpIcon className="w-6 h-6 text-primary-500" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
