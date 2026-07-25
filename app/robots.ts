import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://taoxiaofeng.github.io';

  return {
    rules: {
      userAgent: '*',
      allow: '/taoxf_blog/',
      disallow: ['/taoxf_blog/api/', '/taoxf_blog/admin/'],
    },
    sitemap: `${baseUrl}/taoxf_blog/sitemap.xml`,
  };
}
