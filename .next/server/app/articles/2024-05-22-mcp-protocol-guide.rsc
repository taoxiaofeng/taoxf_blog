2:I[2075,["919","static/chunks/919-d1557d39a2fccf92.js","793","static/chunks/793-c4cbe5b661a24365.js","376","static/chunks/376-940585c4f5925daf.js","88","static/chunks/app/(blog)/articles/%5Bslug%5D/page-1b81716855044703.js"],"default"]
3:I[2972,["919","static/chunks/919-d1557d39a2fccf92.js","793","static/chunks/793-c4cbe5b661a24365.js","376","static/chunks/376-940585c4f5925daf.js","88","static/chunks/app/(blog)/articles/%5Bslug%5D/page-1b81716855044703.js"],""]
4:I[2588,["919","static/chunks/919-d1557d39a2fccf92.js","793","static/chunks/793-c4cbe5b661a24365.js","376","static/chunks/376-940585c4f5925daf.js","88","static/chunks/app/(blog)/articles/%5Bslug%5D/page-1b81716855044703.js"],"default"]
6:I[2063,["919","static/chunks/919-d1557d39a2fccf92.js","793","static/chunks/793-c4cbe5b661a24365.js","376","static/chunks/376-940585c4f5925daf.js","88","static/chunks/app/(blog)/articles/%5Bslug%5D/page-1b81716855044703.js"],"default"]
7:I[4707,[],""]
9:I[6423,[],""]
a:I[1409,["185","static/chunks/app/layout-4c32450f1b97401a.js"],"ThemeProvider"]
5:T11b6,# MCP 协议完全指南：构建 AI 原生应用的标准接口

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

> 协议的开放性和生态的丰富性，让 MCP 有望成为 AI 时代的 HTTP。8:["slug","2024-05-22-mcp-protocol-guide","d"]
b:{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"}
c:{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"}
d:{"display":"inline-block"}
e:{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0}
0:["kcneOkCkDyjhKUcp3pB_3",[[["",{"children":["(blog)",{"children":["articles",{"children":[["slug","2024-05-22-mcp-protocol-guide","d"],{"children":["__PAGE__?{\"slug\":\"2024-05-22-mcp-protocol-guide\"}",{}]}]}]}]},"$undefined","$undefined",true],["",{"children":["(blog)",{"children":["articles",{"children":[["slug","2024-05-22-mcp-protocol-guide","d"],{"children":["__PAGE__",{},[["$L1",["$","div",null,{"className":"min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800","children":[["$","$L2",null,{}],["$","main",null,{"className":"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32","children":[["$","$L3",null,{"href":"/articles","className":"inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors mb-8","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","fill":"none","viewBox":"0 0 24 24","strokeWidth":1.5,"stroke":"currentColor","aria-hidden":"true","data-slot":"icon","aria-labelledby":"$undefined","className":"w-5 h-5","children":[null,["$","path",null,{"strokeLinecap":"round","strokeLinejoin":"round","d":"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}]]}],["$","span",null,{"children":"返回文章列表"}]]}],["$","article",null,{"className":"glass rounded-2xl p-8 md:p-12","children":[["$","span",null,{"className":"inline-block px-4 py-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4","children":"AI 实战"}],["$","h1",null,{"className":"text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6","children":"MCP 协议完全指南：构建 AI 原生应用的标准接口"}],["$","div",null,{"className":"flex flex-wrap items-center gap-4 mb-8 text-gray-500 dark:text-gray-400","children":[["$","div",null,{"className":"flex items-center space-x-2","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","fill":"none","viewBox":"0 0 24 24","strokeWidth":1.5,"stroke":"currentColor","aria-hidden":"true","data-slot":"icon","aria-labelledby":"$undefined","className":"w-5 h-5","children":[null,["$","path",null,{"strokeLinecap":"round","strokeLinejoin":"round","d":"M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"}]]}],["$","span",null,{"children":"2024年05月22日"}]]}],["$","div",null,{"className":"flex items-center space-x-2","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","fill":"none","viewBox":"0 0 24 24","strokeWidth":1.5,"stroke":"currentColor","aria-hidden":"true","data-slot":"icon","aria-labelledby":"$undefined","className":"w-5 h-5","children":[null,["$","path",null,{"strokeLinecap":"round","strokeLinejoin":"round","d":"M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"}],["$","path",null,{"strokeLinecap":"round","strokeLinejoin":"round","d":"M6 6h.008v.008H6V6Z"}]]}],["$","div",null,{"className":"flex space-x-2","children":[["$","span","MCP",{"className":"text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full","children":"MCP"}],["$","span","Protocol",{"className":"text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full","children":"Protocol"}],["$","span","AI",{"className":"text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full","children":"AI"}],["$","span","API 设计",{"className":"text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full","children":"API 设计"}]]}]]}]]}],["$","hr",null,{"className":"border-gray-200 dark:border-gray-700 mb-8"}],["$","$L4",null,{"content":"$5"}]]}],["$","div",null,{"className":"mt-8 flex justify-between items-center","children":["$","$L3",null,{"href":"/articles","className":"inline-flex items-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-primary-500 hover:text-white transition-colors","children":[["$","svg",null,{"xmlns":"http://www.w3.org/2000/svg","fill":"none","viewBox":"0 0 24 24","strokeWidth":1.5,"stroke":"currentColor","aria-hidden":"true","data-slot":"icon","aria-labelledby":"$undefined","className":"w-5 h-5","children":[null,["$","path",null,{"strokeLinecap":"round","strokeLinejoin":"round","d":"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}]]}],["$","span",null,{"children":"查看更多文章"}]]}]}]]}],["$","$L6",null,{}]]}],[["$","link","0",{"rel":"stylesheet","href":"/taoxf_blog/_next/static/css/5eacd01f773eed7f.css","precedence":"next","crossOrigin":"$undefined"}]]],null],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","(blog)","children","articles","children","$8","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","(blog)","children","articles","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined"}]],null]},[null,["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children","(blog)","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[]}]],null]},[[[["$","link","0",{"rel":"stylesheet","href":"/taoxf_blog/_next/static/css/e08c1cc98e20ab40.css","precedence":"next","crossOrigin":"$undefined"}]],["$","html",null,{"lang":"zh-CN","suppressHydrationWarning":true,"children":["$","body",null,{"className":"__className_479d99","children":["$","$La",null,{"children":["$","$L7",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L9",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":"$b","children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":"$c","children":"404"}],["$","div",null,{"style":"$d","children":["$","h2",null,{"style":"$e","children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[]}]}]}]}]],null],null],["$Lf",null]]]]
f:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"MCP 协议完全指南：构建 AI 原生应用的标准接口 | Taoxf Blog"}],["$","meta","3",{"name":"description","content":"MCP（Model Context Protocol）是 Anthropic 推出的开放协议，旨在标准化 AI 模型与外部数据源、工具之间的交互方式。"}],["$","meta","4",{"name":"author","content":"Tao Xiaofeng"}],["$","meta","5",{"name":"keywords","content":"MCP,Protocol,AI,API 设计"}],["$","meta","6",{"name":"creator","content":"Tao Xiaofeng"}],["$","meta","7",{"name":"publisher","content":"Tao Xiaofeng"}],["$","meta","8",{"name":"robots","content":"index, follow"}],["$","meta","9",{"name":"googlebot","content":"index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"}],["$","link","10",{"rel":"canonical","href":"https://taoxiaofeng.github.io/taoxf_blog/"}],["$","meta","11",{"property":"og:title","content":"MCP 协议完全指南：构建 AI 原生应用的标准接口"}],["$","meta","12",{"property":"og:description","content":"MCP（Model Context Protocol）是 Anthropic 推出的开放协议，旨在标准化 AI 模型与外部数据源、工具之间的交互方式。"}],["$","meta","13",{"property":"og:type","content":"article"}],["$","meta","14",{"property":"article:published_time","content":"2024-05-22"}],["$","meta","15",{"property":"article:tag","content":"MCP"}],["$","meta","16",{"property":"article:tag","content":"Protocol"}],["$","meta","17",{"property":"article:tag","content":"AI"}],["$","meta","18",{"property":"article:tag","content":"API 设计"}],["$","meta","19",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","20",{"name":"twitter:title","content":"Taoxf Blog - AI Native Developer Portal"}],["$","meta","21",{"name":"twitter:description","content":"AI Native Developer Portal - 技术博客、AI 实战、Agent、MCP、Prompt、视频、作品集"}],["$","meta","22",{"name":"next-size-adjust"}]]
1:null
