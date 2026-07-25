import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Taoxf Blog - AI Native Developer Portal',
    template: '%s | Taoxf Blog',
  },
  description: 'AI Native Developer Portal - 技术博客、AI 实战、Agent、MCP、Prompt、视频、作品集',
  keywords: ['技术博客', 'AI', 'React', 'Next.js', 'TypeScript', 'Agent', 'MCP', 'Prompt Engineering'],
  authors: [{ name: 'Tao Xiaofeng' }],
  creator: 'Tao Xiaofeng',
  publisher: 'Tao Xiaofeng',
  metadataBase: new URL('https://taoxiaofeng.github.io'),
  alternates: {
    canonical: '/taoxf_blog',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://taoxiaofeng.github.io/taoxf_blog',
    title: 'Taoxf Blog - AI Native Developer Portal',
    description: 'AI Native Developer Portal - 技术博客、AI 实战、Agent、MCP、Prompt、视频、作品集',
    siteName: 'Taoxf Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taoxf Blog - AI Native Developer Portal',
    description: 'AI Native Developer Portal - 技术博客、AI 实战、Agent、MCP、Prompt、视频、作品集',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
