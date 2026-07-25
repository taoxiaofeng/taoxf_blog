import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getVideos } from '../data/articles';
import { PlayIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function Videos() {
  const videos = getVideos();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">视频</h1>
        <p className="text-gray-600 dark:text-gray-400">观看技术教程和分享</p>
      </motion.div>

      {/* 视频列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <motion.div
            key={video.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl overflow-hidden card-hover"
          >
            <Link to={`/videos/${video.slug}`} className="block">
              {/* 视频缩略图 */}
              <div className="aspect-video bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <PlayIcon className="w-8 h-8 text-primary-500 ml-1" />
                  </div>
                </div>
              </div>

              {/* 视频信息 */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary-500 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{dayjs(video.date).format('YYYY-MM-DD')}</span>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-xs">
                    {video.category}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 无视频提示 */}
      {videos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            暂无视频内容
          </p>
        </motion.div>
      )}
    </div>
  );
}
