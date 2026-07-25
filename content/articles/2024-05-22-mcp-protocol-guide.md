---
title: "MCP 协议完全指南：构建 AI 原生应用的标准接口"
date: "2024-05-22"
tags: ["MCP", "Protocol", "AI", "API 设计"]
category: "AI 实战"
cover: ""
excerpt: "MCP（Model Context Protocol）是 Anthropic 推出的开放协议，旨在标准化 AI 模型与外部数据源、工具之间的交互方式。"
---

# MCP 协议完全指南：构建 AI 原生应用的标准接口

MCP（Model Context Protocol）是由 Anthropic 于 2024 年底推出的开放协议，它的目标是成为 AI 应用与外部世界交互的"USB-C 接口"。

## 为什么需要 MCP？

在 AI 应用开发中，一个核心挑战是如何让大语言模型安全、高效地访问外部资源：

- **文件系统**：读取项目代码、配置文件
- **数据库**：查询业务数据
- **API 服务**：调用第三方接口
- **开发工具**：执行命令、运行测试

传统的方式是为每个集成编写定制代码，而 MCP 提供了一套标准化的解决方案。

## MCP 核心架构

MCP 采用客户端-服务器架构：

```
┌─────────────────┐         ┌─────────────────┐
│   AI 应用        │◄───────►│   MCP 客户端     │
│  (Claude/IDE)   │         │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                              MCP 协议（Stdio/SSE）
                                     │
                         ┌───────────┼───────────┐
                         ▼           ▼           ▼
                   ┌─────────┐ ┌─────────┐ ┌─────────┐
                   │文件服务器│ │数据库   │ │GitHub   │
                   │         │ │服务器   │ │服务器   │
                   └─────────┘ └─────────┘ └─────────┘
```

## 协议特性

### 1. 资源（Resources）

资源是 MCP 服务器暴露给客户端的数据源，可以是文件、数据库记录或 API 响应：

```typescript
// 资源定义示例
interface Resource {
  uri: string;           // 唯一标识符
  name: string;          // 显示名称
  mimeType?: string;     // MIME 类型
  text?: string;         // 文本内容
  blob?: string;         // 二进制内容（base64）
}
```

### 2. 工具（Tools）

工具是可执行的功能，LLM 可以根据上下文决定何时调用：

```typescript
// 工具定义示例
interface Tool {
  name: string;
  description: string;   // LLM 用此决定何时调用
  inputSchema: {
    type: "object",
    properties: { ... },
    required: ["param1"]
  };
}
```

### 3. 提示（Prompts）

预定义的提示模板，帮助用户快速完成常见任务：

```typescript
interface Prompt {
  name: string;
  description: string;
  arguments?: Argument[];
}
```

## 快速开始

使用 TypeScript SDK 创建一个简单的 MCP 服务器：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "my-server", version: "1.0.0" },
  { capabilities: { resources: {}, tools: {} } }
);

// 注册工具
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "echo") {
    return {
      content: [{ type: "text", text: `Echo: ${request.params.arguments.message}` }]
    };
  }
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

## 生态系统

MCP 生态正在快速增长，目前已有数百个官方和社区服务器：

| 类别 | 代表服务器 | 用途 |
|------|-----------|------|
| 文件系统 | `filesystem` | 安全访问本地文件 |
| 数据库 | `postgres`, `sqlite` | SQL 数据库查询 |
| 开发工具 | `github`, `git` | 代码仓库操作 |
| 云服务 | `aws`, `gcp` | 云资源管理 |
| 生产力 | `slack`, `notion` | 团队协作工具 |

## 最佳实践

1. **安全第一**：始终使用允许列表控制资源访问范围
2. **错误处理**：提供清晰的错误信息，帮助 LLM 自我纠正
3. **渐进式暴露**：先暴露只读资源，再根据需要开放写入权限
4. **描述优化**：工具描述是 LLM 决策的关键，要写得清晰具体

## 结语

MCP 协议正在快速成为 AI 原生应用的事实标准。无论是构建 IDE 插件、聊天机器人还是自动化工具，掌握 MCP 都将大大提升开发效率和用户体验。

> 协议的开放性和生态的丰富性，让 MCP 有望成为 AI 时代的 HTTP。
