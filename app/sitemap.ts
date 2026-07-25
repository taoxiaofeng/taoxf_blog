import { getArticles, getVideos } from '@/lib/data';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taoxiaofeng.github.io/taoxf_blog';

  // 静态路由
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/articles/`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/videos/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/prompts/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/agents/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/mcp/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  // 文章路由
  const articles = getArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}/`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 视频路由
  const videos = getVideos();
  const videoRoutes: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/videos/${video.slug}/`,
    lastModified: new Date(video.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...videoRoutes];
}
