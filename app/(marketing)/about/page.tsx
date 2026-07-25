import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { CodeIcon, BookOpenIcon, VideoIcon, CpuIcon, MailIcon, GithubIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: '关于我',
  description: '关于 Taoxf Blog 的作者，一个热爱技术的 AI Native Developer',
};

const skills = [
  { name: 'React / Next.js', level: '精通' },
  { name: 'TypeScript', level: '精通' },
  { name: 'Node.js', level: '熟练' },
  { name: 'Python', level: '熟练' },
  { name: 'AI / LLM', level: '熟练' },
  { name: 'Tailwind CSS', level: '精通' },
];

const stats = [
  { label: '技术文章', value: '50+', icon: BookOpenIcon },
  { label: '视频教程', value: '20+', icon: VideoIcon },
  { label: '开源项目', value: '10+', icon: CodeIcon },
  { label: '技术领域', value: 'AI', icon: CpuIcon },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 个人介绍 */}
        <div className="glass rounded-2xl p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* 头像占位 */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
              T
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold gradient-text mb-4">Tao Xiaofeng</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                AI Native Developer / 全栈工程师 / 技术博主
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                热爱探索前沿技术，专注于 AI 应用开发、React 生态和现代化前端架构。
                致力于通过技术博客和视频教程分享学习经验，帮助更多开发者成长。
              </p>

              {/* 社交链接 */}
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="https://github.com/taoxiaofeng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="mailto:taoxiaofeng@example.com"
                  className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                >
                  <MailIcon className="w-5 h-5" />
                  <span>邮箱</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-6 text-center card-hover"
            >
              <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 技能栈 */}
        <div className="glass rounded-2xl p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            技术栈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {skill.name}
                </span>
                <span className="text-sm text-primary-500 font-semibold">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 专注领域 */}
        <div className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            专注领域
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <CpuIcon className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                AI 应用开发
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                LLM 集成、Agent 开发、RAG 系统、Prompt Engineering
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <CodeIcon className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                前端架构
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                React 生态、Next.js、TypeScript、现代化工程化
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <BookOpenIcon className="w-10 h-10 text-primary-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                技术内容创作
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                技术博客、视频教程、开源项目、知识分享
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
