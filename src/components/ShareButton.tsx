import { motion } from 'framer-motion';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = url || window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'weibo':
        shareLink = `https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'wechat':
        // 微信分享需要扫码，这里只复制链接
        handleCopy();
        return;
      default:
        handleCopy();
        return;
    }

    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 glass rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Share"
      >
        {copied ? (
          <CheckIcon className="w-5 h-5 text-green-500" />
        ) : (
          <ShareIcon className="w-5 h-5" />
        )}
      </motion.button>

      {/* 分享菜单 */}
      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full mb-2 left-0 glass rounded-lg shadow-xl p-3 min-w-[200px]"
        >
          <p className="text-sm font-semibold mb-2">分享到</p>
          <div className="space-y-2">
            <button
              onClick={() => handleShare('twitter')}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              𝕏 Twitter
            </button>
            <button
              onClick={() => handleShare('weibo')}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              微博
            </button>
            <button
              onClick={() => handleShare('wechat')}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              微信（复制链接）
            </button>
            <button
              onClick={handleCopy}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              复制链接
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
