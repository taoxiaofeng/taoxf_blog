import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { CpuIcon, ZapIcon, ShieldIcon, BrainIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Agent 库',
  description: '探索 AI Agent 开发框架、工具和实践案例',
};

interface Agent {
  name: string;
  description: string;
  features: string[];
  techStack: string[];
  useCase: string;
  icon: React.ElementType;
}

const agents: Agent[] = [
  {
    name: '代码审查 Agent',
    description: '自动化代码审查，检测潜在 Bug、安全漏洞和性能问题',
    features: ['静态代码分析', '安全漏洞检测', '性能瓶颈识别', '代码规范检查'],
    techStack: ['LangChain', 'OpenAI API', 'AST Parser'],
    useCase: 'CI/CD 流水线集成',
    icon: ShieldIcon,
  },
  {
    name: '文档生成 Agent',
    description: '自动从代码中提取注释和类型信息，生成高质量技术文档',
    features: ['自动文档生成', '多语言支持', 'API 文档同步', '变更日志追踪'],
    techStack: ['TypeScript Compiler API', 'GPT-4', 'Markdown'],
    useCase: '开源项目文档维护',
    icon: BrainIcon,
  },
  {
    name: '测试用例 Agent',
    description: '根据代码逻辑自动生成测试用例，提高代码覆盖率',
    features: ['边界条件分析', '异常路径覆盖', 'Mock 数据生成', '回归测试建议'],
    techStack: ['Jest', 'Testing Library', 'LLM'],
    useCase: '自动化测试生成',
    icon: ZapIcon,
  },
  {
    name: '重构建议 Agent',
    description: '分析代码架构，提供重构建议和现代化方案',
    features: ['架构分析', '设计模式建议', '依赖优化', '技术债评估'],
    techStack: ['Tree-sitter', 'Graph Analysis', 'Claude API'],
    useCase: '遗留系统现代化',
    icon: CpuIcon,
  },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">Agent 库</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            探索 AI Agent 开发框架、工具和实践案例。从概念到落地，构建你的智能代理系统。
          </p>
        </div>

        {/* Agent 卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {agents.map((agent) => (
            <div key={agent.name} className="glass rounded-xl p-8 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                  <agent.icon className="w-8 h-8 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {agent.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{agent.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      核心能力
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      技术栈
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium mr-2">适用场景:</span>
                    {agent.useCase}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ReAct 框架介绍 */}
        <div className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            ReAct 框架
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            ReAct（Reasoning + Acting）是目前最流行的 Agent 架构之一。它将推理和行动紧密结合，
            使 Agent 能够在完成任务时进行思考、行动和观察的循环。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-3xl font-bold text-primary-500 mb-2">1</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">思考 (Reasoning)</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Agent 分析当前状态，制定行动计划，分解复杂任务为可执行的子任务。
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-3xl font-bold text-primary-500 mb-2">2</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">行动 (Acting)</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                执行计划中的动作，调用工具、API 或执行代码，与环境进行交互。
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <div className="text-3xl font-bold text-primary-500 mb-2">3</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">观察 (Observing)</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                收集行动结果，评估进度，调整策略，进入下一轮思考-行动循环。
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
