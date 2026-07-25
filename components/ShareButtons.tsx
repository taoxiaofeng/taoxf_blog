'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShareButtonsProps {
  title: string;
  slug: string;
  baseUrl?: string;
}

export default function ShareButtons({ title, slug, baseUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const url = baseUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-gray-900 hover:bg-gray-800',
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: 'bg-blue-700 hover:bg-blue-600',
    },
    {
      name: '微信',
      icon: '💬',
      url: '#',
      color: 'bg-green-600 hover:bg-green-500',
      action: 'wechat',
    },
  ];
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };
  
  const handleWechatShare = () => {
    alert('请截图或复制链接分享到朋友圈');
  };
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <ShareIcon className="w-4 h-4" />
        分享：
      </span>
      
      {/* 分享按钮 */}
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <motion.button
            key={link.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (link.action === 'wechat') {
                handleWechatShare();
              } else {
                window.open(link.url, '_blank', 'width=600,height=400');
              }
            }}
            className={`${link.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors`}
            title={`分享到 ${link.name}`}
          >
            {link.icon}
          </motion.button>
        ))}
      </div>
      
      {/* 复制链接 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="复制链接"
      >
        {copied ? (
          <>
            <CheckIcon className="w-4 h-4 text-green-500" />
            <span className="text-green-500">已复制</span>
          </>
        ) : (
          <>
            <ShareIcon className="w-4 h-4" />
            <span>复制链接</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
