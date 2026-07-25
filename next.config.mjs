import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    unoptimized: true,
  },
  output: 'export',
  distDir: 'dist',
  basePath: process.env.NODE_ENV === 'production' ? '/taoxf_blog' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/taoxf_blog' : '',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
  },
});

export default withMDX(nextConfig);
