import { getVideos } from '@/lib/data';
import VideoCard from '@/components/VideoCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '视频',
  description: '技术视频教程列表',
};

export default function VideosPage() {
  const videos = getVideos();

  // 提取所有标签和分类
  const tags = Array.from(new Set(videos.flatMap(v => v.tags))).sort();
  const categories = Array.from(new Set(videos.map(v => v.category))).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">视频</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            通过视频学习技术，直观高效
          </p>
        </div>

        {/* 筛选器 */}
        <div className="mb-8 p-6 glass rounded-xl">
          {/* 分类筛选 */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">分类</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm">
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 glass text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-primary-500 hover:text-white transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 标签筛选 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 glass text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-primary-500 hover:text-white transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 视频列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.slug}
              slug={video.slug}
              title={video.title}
              date={video.date}
              tags={video.tags}
              category={video.category}
              description={video.description}
              thumbnail={video.thumbnail}
              videoUrl={video.videoUrl}
              duration={video.duration}
            />
          ))}
        </div>

        {/* 空状态 */}
        {videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              暂无视频，敬请期待！
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
