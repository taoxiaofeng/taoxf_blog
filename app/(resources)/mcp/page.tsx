import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';
import { ServerIcon, WrenchIcon, FileIcon, PlugIcon, ExternalLinkIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MCP 资源',
  description: 'Model Context Protocol 资源中心，包含协议规范、SDK 和生态工具',
};

interface MCPResource {
  name: string;
  description: string;
  type: 'server' | 'sdk' | 'tool';
  url: string;
  stars?: string;
  language?: string;
}

const resources: MCPResource[] = [
  {
    name: 'filesystem',
    description: '安全访问本地文件系统的 MCP 服务器',
    type: 'server',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    language: 'TypeScript',
  },
  {
    name: 'github',
    description: 'GitHub API 集成，支持仓库操作、Issue 管理、PR 审查',
    type: 'server',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    language: 'TypeScript',
  },
  {
    name: 'postgres',
    description: 'PostgreSQL 数据库查询和操作',
    type: 'server',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    language: 'TypeScript',
  },
  {
    name: 'slack',
    description: 'Slack 工作区集成，支持消息发送和频道管理',
    type: 'server',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    language: 'TypeScript',
  },
  {
    name: 'mcp-typescript-sdk',
    description: '官方 TypeScript SDK，用于构建 MCP 客户端和服务器',
    type: 'sdk',
    url: 'https://github.com/modelcontextprotocol/typescript-sdk',
    language: 'TypeScript',
  },
  {
    name: 'mcp-python-sdk',
    description: '官方 Python SDK，支持 asyncio 和同步 API',
    type: 'sdk',
    url: 'https://github.com/modelcontextprotocol/python-sdk',
    language: 'Python',
  },
];

const typeIcons = {
  server: ServerIcon,
  sdk: PlugIcon,
  tool: WrenchIcon,
};

const typeLabels = {
  server: '服务器',
  sdk: 'SDK',
  tool: '工具',
};

export default function MCPPage() {
  const servers = resources.filter((r) => r.type === 'server');
  const sdks = resources.filter((r) => r.type === 'sdk');
  const tools = resources.filter((r) => r.type === 'tool');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        {/* 页面标题 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">MCP 资源</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Model Context Protocol 生态资源中心。发现、使用和贡献 MCP 服务器与工具，
            构建标准化的 AI 应用集成。
          </p>
        </div>

        {/* 协议简介 */}
        <div className="glass rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-xl hidden md:block">
              <PlugIcon className="w-10 h-10 text-primary-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                什么是 MCP？
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Model Context Protocol（MCP）是由 Anthropic 推出的开放协议，旨在成为 AI 应用与外部世界交互的{'"'}USB-C 接口{'"'}。
                它标准化了 AI 模型与数据源、工具之间的通信方式，让开发者无需为每个集成编写定制代码。
              </p>
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <span>访问官方文档</span>
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* 资源分类 */}
        <div className="space-y-12">
          {/* 服务器 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <ServerIcon className="w-6 h-6 mr-2 text-primary-500" />
              官方服务器
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servers.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>
          </section>

          {/* SDK */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <PlugIcon className="w-6 h-6 mr-2 text-primary-500" />
              开发 SDK
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sdks.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>
          </section>

          {/* 工具 */}
          {tools.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                <WrenchIcon className="w-6 h-6 mr-2 text-primary-500" />
                生态工具
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tools.map((resource) => (
                  <ResourceCard key={resource.name} resource={resource} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 快速开始 */}
        <div className="glass rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">快速开始</h2>
          <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
            <pre className="text-sm text-gray-300">
              <code>{`# 安装 MCP SDK
npm install @modelcontextprotocol/sdk

# 创建一个简单的 MCP 服务器
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server(
  { name: "my-server", version: "1.0.0" },
  { capabilities: { resources: {}, tools: {} } }
);`}</code>
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ResourceCard({ resource }: { resource: MCPResource }) {
  const Icon = typeIcons[resource.type];

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass rounded-xl p-6 card-hover block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-primary-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{resource.name}</h3>
        </div>
        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
          {typeLabels[resource.type]}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{resource.description}</p>

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {resource.language && (
          <span className="flex items-center gap-1">
            <FileIcon className="w-3 h-3" />
            {resource.language}
          </span>
        )}
        {resource.stars && (
          <span className="flex items-center gap-1">
            <span>⭐</span>
            {resource.stars}
          </span>
        )}
      </div>
    </a>
  );
}
