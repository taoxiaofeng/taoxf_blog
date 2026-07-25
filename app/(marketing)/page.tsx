'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
            >
              Taoxf Blog
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8"
            >
              AI Native Developer Portal
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              技术博客 · AI 实战 · Agent · MCP · Prompt · 视频 · 作品集
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/articles"
                className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors card-hover"
              >
                浏览文章
              </Link>
              <Link
                href="/videos"
                className="px-8 py-3 glass text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors card-hover"
              >
                观看视频
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 glass text-gray-700 dark:text-gray-200 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors card-hover"
              >
                关于我
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
