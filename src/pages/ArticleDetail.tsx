import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getArticleBySlug, getArticles } from '../data/articles';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ReadingProgress from '../components/ReadingProgress';
import TableOfContents from '../components/TableOfContents';
import ShareButton from '../components/ShareButton';
import { CalendarIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || '');
  
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">文章未找到</h1>
        <Link to="/articles" className="text-primary-500 hover:underline">
          返回文章列表
        </Link>
      </div>
    );
  }

  const articles = getArticles();
  const currentIndex = articles.findIndex(a => a.slug === slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 阅读进度条 */}
      <ReadingProgress />
      
      {/* 文章头部 */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        {/* 分类标签 */}
        <span className="inline-block px-4 py-1 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
          {article.category}
        </span>

        {/* 标题 */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text flex-1">
            {article.title}
          </h1>
          {/* 分享按钮 */}
          <div className="flex-shrink-0">
            <ShareButton title={article.title} />
          </div>
        </div>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{dayjs(article.date).format('YYYY-MM-DD')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TagIcon className="w-5 h-5" />
            <div className="flex space-x-2">
              {article.tags.map((tag, index) => (
                <span key={index} className="text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.article>

      {/* 文章内容 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <MarkdownRenderer content={article.content} />
      </motion.div>

      {/* 上一篇/下一篇导航 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
        {prevArticle ? (
          <Link
            to={`/articles/${prevArticle.slug}`}
            className="glass rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3"
          >
            <ChevronLeftIcon className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">上一篇</p>
              <p className="font-semibold line-clamp-1">{prevArticle.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        
        {nextArticle ? (
          <Link
            to={`/articles/${nextArticle.slug}`}
            className="glass rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3 md:flex-row-reverse md:text-right md:space-x-0 md:space-x-reverse"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">下一篇</p>
              <p className="font-semibold line-clamp-1">{nextArticle.title}</p>
            </div>
            <ChevronRightIcon className="w-5 h-5 flex-shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </div>
      
      {/* 目录导航 */}
      <TableOfContents content={article.content} />
    </div>
  );
}
