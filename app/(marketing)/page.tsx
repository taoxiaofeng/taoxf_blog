'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { DocumentDuplicateIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { BookOpen, Cpu, Plug } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-16 sm:py-20 lg:py-24 lg:py-32">
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

      {/* 资源中心 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">探索资源</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            从 Prompt 模板到 Agent 框架，从 MCP 协议到实战案例，一站式 AI 开发资源中心
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: DocumentDuplicateIcon,
              title: 'Prompt 库',
              description: '精选实用的 AI Prompt 模板',
              href: '/prompts',
              color: 'from-blue-400 to-blue-600',
            },
            {
              icon: Cpu,
              title: 'Agent 库',
              description: 'AI Agent 开发框架与案例',
              href: '/agents',
              color: 'from-purple-400 to-purple-600',
            },
            {
              icon: Plug,
              title: 'MCP 资源',
              description: 'Model Context Protocol 生态',
              href: '/mcp',
              color: 'from-green-400 to-green-600',
            },
            {
              icon: BookOpen,
              title: '技术文章',
              description: '深度技术博客与实战分享',
              href: '/articles',
              color: 'from-orange-400 to-orange-600',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="block glass rounded-xl p-6 card-hover h-full"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {item.description}
                </p>
                <span className="inline-flex items-center text-primary-500 text-sm font-medium">
                  探索更多
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
