import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // 启用 MDX 支持
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  
  // 图片优化
  images: {
    domains: [
      'github.com',
      'avatars.githubusercontent.com',
      's2.loli.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 输出配置
  output: 'standalone',

  // 实验性功能
  experimental: {
    mdxRs: true,
  },
};

// 配置 MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
});

export default withMDX(nextConfig);
