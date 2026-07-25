import { getVideos } from '@/lib/data';
import VideosList from '@/components/VideosList';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '视频',
  description: '技术视频教程列表',
};

export default function VideosPage() {
  const videos = getVideos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">视频</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            通过视频学习技术,直观高效
          </p>
        </div>

        <VideosList videos={videos} />
      </main>

      <Footer />
    </div>
  );
}
