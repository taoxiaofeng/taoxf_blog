import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVideoBySlug } from '../data/articles';
import VideoPlayer from '../components/VideoPlayer';
import MarkdownRenderer from '../components/MarkdownRenderer';
import dayjs from 'dayjs';

export default function VideoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const video = getVideoBySlug(slug || '');

  if (!video) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">视频未找到</h1>
        <Link to="/videos" className="text-primary-500 hover:underline">
          返回视频列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 视频播放器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <VideoPlayer videoUrl={video.videoUrl} title={video.title} />
      </motion.div>

      {/* 视频信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          {video.title}
        </h1>
        
        <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <span>{dayjs(video.date).format('YYYY-MM-DD')}</span>
          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm">
            {video.category}
          </span>
          <div className="flex space-x-2">
            {video.tags.map((tag, index) => (
              <span key={index} className="text-sm text-gray-500 dark:text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 视频描述 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <MarkdownRenderer content={video.content} />
      </motion.div>
    </div>
  );
}
