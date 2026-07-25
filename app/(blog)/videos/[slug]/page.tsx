import { getVideos, getVideoBySlug } from '@/lib/data';
import MDContent from '@/components/MDContent';
import ReadingProgress from '@/components/ReadingProgress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CalendarIcon, TagIcon, ArrowLeftIcon, PlayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

dayjs.locale('zh-cn');

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const videos = getVideos();
  return videos.map((video) => ({
    slug: video.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const video = getVideoBySlug(params.slug);
  if (!video) {
    return { title: '视频未找到' };
  }
  return {
    title: video.title,
    description: video.description,
    keywords: video.tags,
    openGraph: {
      title: video.title,
      description: video.description,
      type: 'video.other',
    },
  };
}

export default function VideoPage({ params }: Props) {
  const video = getVideoBySlug(params.slug);

  if (!video) {
    notFound();
  }

  const isBilibili = video.videoUrl.includes('bilibili');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    uploadDate: video.date,
    datePublished: video.date,
    author: {
      '@type': 'Person',
      name: 'Tao Xiaofeng',
    },
    publisher: {
      '@type': 'Person',
      name: 'Tao Xiaofeng',
    },
    keywords: video.tags.join(', '),
    inLanguage: 'zh-CN',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ReadingProgress />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 返回按钮 */}
        <Link
          href="/videos"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>返回视频列表</span>
        </Link>

        {/* 视频头部 */}
        <div className="glass rounded-2xl p-8 md:p-12 mb-8">
          {/* 分类 */}
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            {video.category}
          </span>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {video.title}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>{dayjs(video.date).format('YYYY年MM月DD日')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TagIcon className="w-5 h-5" />
              <div className="flex space-x-2">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 视频播放区域 */}
          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-8 flex items-center justify-center">
            {isBilibili ? (
              <iframe
                src={video.videoUrl.replace('video/BV', 'player.html?bvid=BV')}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                scrolling="no"
                frameBorder="0"
              />
            ) : (
              <div className="text-center">
                <PlayIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  <span>前往观看视频</span>
                </a>
              </div>
            )}
          </div>

          {/* 视频描述 */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {video.description}
          </p>

          {/* 分割线 */}
          <hr className="border-gray-200 dark:border-gray-700 mb-8" />

          {/* 视频详细内容 */}
          <MDContent content={video.content} />
        </div>

        {/* 视频底部导航 */}
        <div className="flex justify-between items-center">
          <Link
            href="/videos"
            className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>查看更多视频</span>
          </Link>
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlayIcon className="w-5 h-5" />
            <span>观看视频</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
