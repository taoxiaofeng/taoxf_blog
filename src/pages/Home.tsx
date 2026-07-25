import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import ArticleCard from '../components/ArticleCard';
import { getArticles, getVideos } from '../data/articles';
import { PlayIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function Home() {
  const articles = getArticles().slice(0, 3);
  const videos = getVideos().slice(0, 2);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
              <span className="gradient-text">Taoxf Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              探索技术，分享知识，记录成长
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/articles"
                className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
              >
                浏览文章
              </Link>
              <Link
                to="/videos"
                className="px-8 py-3 glass hover:bg-primary-500 hover:text-white rounded-lg font-semibold transition-all"
              >
                观看视频
              </Link>
            </div>
          </motion.div>

          {/* 滚动提示 */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m0 0a5 5 0 01-7.07-7.07l7.07-7.07 7.07 7.07a5 5 0 017.07 7.07z"
              />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* 最新文章 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold gradient-text">最新文章</h2>
          <Link
            to="/articles"
            className="flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-semibold"
          >
            <span>查看全部</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ArticleCard {...article} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 最新视频 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold gradient-text">最新视频</h2>
          <Link
            to="/videos"
            className="flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-semibold"
          >
            <span>查看全部</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl overflow-hidden card-hover"
            >
              <Link to={`/videos/${video.slug}`} className="block">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                  <PlayIcon className="w-16 h-16 text-gray-400" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                      <PlayIcon className="w-10 h-10 text-primary-500 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {video.description}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dayjs(video.date).format('YYYY-MM-DD')}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
