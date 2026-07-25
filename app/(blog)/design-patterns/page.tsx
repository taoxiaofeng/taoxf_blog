import { getDesignPatterns, getAllPatternTypes } from '@/lib/data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '设计模式',
  description: '22种经典设计模式详解 - 创建型模式、结构型模式、行为型模式',
};

export default function DesignPatternsPage() {
  const patterns = getDesignPatterns();
  const patternTypes = getAllPatternTypes();

  const groupedPatterns = patternTypes.reduce((acc, type) => {
    acc[type] = patterns.filter(p => p.patternType === type);
    return acc;
  }, {} as Record<string, typeof patterns>);

  const typeDescriptions: Record<string, string> = {
    '创建型模式': '这些模式提供了多种对象创建机制，能够提升已有代码的灵活性和可复用性。',
    '结构型模式': '这些模式介绍如何将对象和类组装成较大的结构，并同时保持结构的灵活和高效。',
    '行为型模式': '这些模式负责对象间的高效沟通和职责分配。',
  };

  const typeColors: Record<string, string> = {
    '创建型模式': 'from-green-500 to-emerald-500',
    '结构型模式': 'from-blue-500 to-cyan-500',
    '行为型模式': 'from-purple-500 to-pink-500',
  };

  const typeBgColors: Record<string, string> = {
    '创建型模式': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    '结构型模式': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    '行为型模式': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">设计模式</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            设计模式是软件设计中常见问题的典型解决方案。每个模式就像一张蓝图，你可以通过对其进行定制来解决代码中的特定设计问题。
            这里收录了 22 种经典设计模式，按照其意图分为创建型、结构型和行为型三大类。
          </p>
        </div>

        {/* 按类型分组展示 */}
        {['创建型模式', '结构型模式', '行为型模式'].map((type) => (
          <section key={type} className="mb-16">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${typeColors[type]}`} />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {type}
                </h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeBgColors[type]}`}>
                  {groupedPatterns[type]?.length || 0} 个模式
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-5">
                {typeDescriptions[type]}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPatterns[type]?.map((pattern) => (
                <Link
                  key={pattern.slug}
                  href={`/design-patterns/${pattern.slug}`}
                  className="group glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors mb-3">
                    {pattern.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {pattern.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {pattern.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {pattern.readingTime && (
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {pattern.readingTime} 分钟
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
