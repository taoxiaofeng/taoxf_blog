import { motion } from 'framer-motion';
import { EnvelopeIcon, CodeBracketIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-5xl font-bold gradient-text mb-4">关于我</h1>
        <p className="text-gray-600 dark:text-gray-400">了解更多关于我的信息</p>
      </motion.div>

      {/* 个人介绍 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* 头像占位符 */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-6xl font-bold text-white">T</span>
          </div>

          {/* 介绍文字 */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">你好，我是 Taoxf 👋</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              一名热爱技术的开发者，专注于前端开发和全栈技术。喜欢探索新技术，
              分享学习心得，记录成长历程。
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              这个博客是我记录技术学习、分享开发经验的地方。希望我的文章和视频能对你有所帮助！
            </p>
          </div>
        </div>
      </motion.div>

      {/* 技术栈 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-8 mb-8"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <CodeBracketIcon className="w-6 h-6 mr-2 text-primary-500" />
          技术栈
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'React',
            'TypeScript',
            'Node.js',
            'JavaScript',
            'Tailwind CSS',
            'Next.js',
            'Vue.js',
            'Python',
            'Git',
          ].map((tech, index) => (
            <div
              key={tech}
              className="p-4 glass rounded-lg text-center hover:scale-105 transition-transform"
            >
              <span className="font-semibold">{tech}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 博客宗旨 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-8 mb-8"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <BookOpenIcon className="w-6 h-6 mr-2 text-primary-500" />
          博客宗旨
        </h3>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✓</span>
            <span>分享技术学习心得和实践经验</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✓</span>
            <span>记录个人成长历程，建立知识体系</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✓</span>
            <span>帮助他人解决技术问题</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-500 mr-2">✓</span>
            <span>与开发者社区交流互动</span>
          </li>
        </ul>
      </motion.div>

      {/* 联系方式 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-8"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <EnvelopeIcon className="w-6 h-6 mr-2 text-primary-500" />
          联系我
        </h3>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            如果你有任何问题或建议，欢迎通过以下方式联系我：
          </p>
          <div className="flex flex-col space-y-2">
            <a
              href="mailto:your-email@example.com"
              className="text-primary-500 hover:text-primary-600 transition-colors"
            >
              📧 your-email@example.com
            </a>
            <a
              href="https://github.com/taoxiaofeng"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 transition-colors"
            >
              🐙 GitHub: @taoxiaofeng
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
