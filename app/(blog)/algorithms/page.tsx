import { getAlgorithms, getAllDifficultyLevels } from '@/lib/data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '算法',
  description: '从入门到深入的经典算法详解，配合 VisuAlgo 交互式动画演示',
};

export default function AlgorithmsPage() {
  const algorithms = getAlgorithms();
  const levels = getAllDifficultyLevels();

  const groupedAlgorithms = levels.reduce((acc, level) => {
    acc[level] = algorithms.filter(a => a.difficulty === level);
    return acc;
  }, {} as Record<string, typeof algorithms>);

  const levelDescriptions: Record<string, string> = {
    '入门': '经典排序算法，理解算法设计的基本思想和分析方法。',
    '基础': '核心数据结构的原理与实现，构建算法设计的基础能力。',
    '进阶': '图论相关算法，解决网络、路径、连通性等复杂问题。',
    '深入': '高级数据结构与几何算法，应对竞赛和工程中的复杂场景。',
  };

  const levelColors: Record<string, string> = {
    '入门': 'from-green-500 to-emerald-500',
    '基础': 'from-blue-500 to-cyan-500',
    '进阶': 'from-orange-500 to-amber-500',
    '深入': 'from-red-500 to-pink-500',
  };

  const levelBgColors: Record<string, string> = {
    '入门': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    '基础': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    '进阶': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    '深入': 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  const levelIcons: Record<string, string> = {
    '入门': '🌱',
    '基础': '🧱',
    '进阶': '🚀',
    '深入': '💎',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">算法</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            从基础排序到高级图算法，系统学习经典算法与数据结构。每篇文章配有来自 VisuAlgo 的交互式动画演示，
            帮助你直观理解算法的执行过程。按难度从入门到深入分为四个级别，共 {algorithms.length} 个算法专题。
          </p>
        </div>

        {/* 按难度分组展示 */}
        {levels.map((level) => (
          groupedAlgorithms[level]?.length > 0 && (
            <section key={level} className="mb-16">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${levelColors[level]}`} />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {levelIcons[level]} {level}级
                  </h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${levelBgColors[level]}`}>
                    {groupedAlgorithms[level]?.length || 0} 个算法
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ml-5">
                  {levelDescriptions[level]}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedAlgorithms[level]?.map((algo) => (
                  <Link
                    key={algo.slug}
                    href={`/algorithms/${algo.slug}`}
                    className="group glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors mb-3">
                      {algo.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {algo.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {algo.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {algo.readingTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {algo.readingTime} 分钟
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        ))}
      </main>

      <Footer />
    </div>
  );
}
