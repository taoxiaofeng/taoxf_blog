import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
}

export function ArticleCardSkeleton() {
  return (
    <motion.div
      className="glass rounded-xl overflow-hidden p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 封面占位 */}
      <Skeleton className="aspect-video mb-4" />
      
      {/* 分类标签 */}
      <Skeleton className="h-5 w-20 mb-3 rounded-full" />
      
      {/* 标题 */}
      <Skeleton className="h-7 w-full mb-2" />
      <Skeleton className="h-7 w-3/4 mb-3" />
      
      {/* 摘要 */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      
      {/* 底部信息 */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </motion.div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto" />
      </div>

      {/* 搜索框 */}
      <Skeleton className="h-12 w-full mb-8 rounded-lg" />

      {/* 文章卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
