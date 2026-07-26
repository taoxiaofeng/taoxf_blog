'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 按需注册常用语言（避免全量导入 ~970KB）
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c', cpp);
SyntaxHighlighter.registerLanguage('html', markup);
SyntaxHighlighter.registerLanguage('xml', markup);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('csharp', csharp);

const CodeHighlighter = SyntaxHighlighter as any;

// 模块级正则常量（避免每次渲染重复创建）
const RE_PYTHON = /\b(def\s+\w+|self\.|elif|__init__|__name__)\b/;
const RE_PYTHON_IMPORT = /\bfrom\s+\w+\s+import\b/;
const RE_GO = /\b(func|package)\b/;
const RE_GO_IMPORT = /\bimport\s*["(]/.test.bind(/\bimport\s*["(]/);
const RE_TS = /\b(interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|any|void))\b/;
const RE_JS = /\b(const|let|var|export\s+default|require\s*\(|module\.exports)\b/;
const RE_ARROW = /=>\s*[{(]/;
const RE_JAVA = /\b(public|private|protected|abstract|implements|extends|void|static)\b/;
const RE_JAVA_OOP = /\b(new|return|this)\b/;
const RE_CPP = /\b(#include|printf|malloc|void\s+main|int\s+main|std::)\b/;
const RE_SHELL = /^(\$\s|#!\/)|\b(echo|npm|yarn|cd|mkdir|apt-get|sudo|chmod)\b/m;
const RE_HTML = /<\/?[a-z][\w-]*[\s>]/;
const RE_HTML_CLOSE = /<\/[a-z]/;
const RE_CSS = /[.#]\w+\s*\{|@media|@import|@keyframes/;
const RE_SQL = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i;
const RE_SQL2 = /\b(FROM|WHERE|TABLE|INTO|VALUES|JOIN)\b/i;
const RE_JSON = /^\s*[{\[]/;
const RE_JSON2 = /"\w+"\s*:/;
const RE_YAML = /^\w[\w-]*\s*:/m;
const RE_OOP_PSEUDO = /\b(class|method|if|else|return|new|null)\b/;

// 根据代码内容自动检测编程语言
function detectLanguage(code: string): string {
  // Python 特征（强信号优先，避免 import 与 JS 冲突）
  if (RE_PYTHON.test(code) || RE_PYTHON_IMPORT.test(code)) {
    return 'python';
  }
  // Go 特征
  if (RE_GO.test(code) && /\bimport\s*["(]/.test(code)) {
    return 'go';
  }
  // TypeScript/JavaScript 特征
  if (RE_JS.test(code) || RE_ARROW.test(code)) {
    if (RE_TS.test(code)) {
      return 'typescript';
    }
    return 'javascript';
  }
  // C/C++ 特征
  if (RE_CPP.test(code)) {
    return 'cpp';
  }
  // Java 特征（需 OOP 关键字组合）
  if (RE_JAVA.test(code) && RE_JAVA_OOP.test(code)) {
    return 'java';
  }
  // Shell
  if (RE_SHELL.test(code)) {
    return 'bash';
  }
  // HTML/XML
  if (RE_HTML.test(code) && RE_HTML_CLOSE.test(code)) {
    return 'html';
  }
  // CSS
  if (RE_CSS.test(code)) {
    return 'css';
  }
  // SQL
  if (RE_SQL.test(code) && RE_SQL2.test(code)) {
    return 'sql';
  }
  // JSON
  if (RE_JSON.test(code) && RE_JSON2.test(code)) {
    return 'json';
  }
  // YAML
  if (RE_YAML.test(code) && !RE_JSON.test(code)) {
    return 'yaml';
  }
  // OOP 伪代码（常见于设计模式文章）- 使用 Java 高亮
  if (RE_OOP_PSEUDO.test(code)) {
    return 'java';
  }
  return 'text';
}

interface MDContentProps {
  content: string;
}

// 代码块组件（带复制按钮 + Prism 语法高亮）
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  
  // 如果未指定语言，尝试自动检测
  const effectiveLanguage = language || detectLanguage(code);
  const displayLanguage = effectiveLanguage === 'text' ? 'code' : effectiveLanguage;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };
  
  return (
    <div className="relative group my-6">
      {/* 代码头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#282c34] rounded-t-lg border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{displayLanguage}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          title={copied ? '已复制' : '复制代码'}
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 text-green-400" />
              <span className="text-green-400">已复制</span>
            </>
          ) : (
            <>
              <ClipboardIcon className="w-4 h-4" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      
      {/* 代码内容 - 使用 Prism 语法高亮 */}
      <CodeHighlighter
        language={effectiveLanguage}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: '0.5rem',
          borderBottomRightRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
        }}
        showLineNumbers={code.split('\n').length > 3}
        wrapLongLines={true}
      >
        {code}
      </CodeHighlighter>
    </div>
  );
}

export default function MDContent({ content }: MDContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={{
          pre: ({ children }) => {
            // 从 pre > code 结构中提取代码文本和语言
            const codeEl = children as React.ReactElement;
            const codeProps = codeEl?.props || {};
            const className = codeProps.className || '';
            const language = className.replace(/language-/, '') || '';
            const codeChildren = codeProps.children;
            
            // 只处理纯字符串内容，非标准结构降级为普通 pre
            if (typeof codeChildren === 'string') {
              const code = codeChildren.replace(/\n$/, '');
              return <CodeBlock language={language} code={code} />;
            }
            return (
              <pre className="my-6 p-4 bg-gray-900 rounded-lg overflow-x-auto">
                <code>{children}</code>
              </pre>
            );
          },
          code: ({ className, children }) => {
            // 仅处理内联代码，块级代码由 pre 组件处理
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return <code className={className}>{children}</code>;
            }
            return (
              <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded text-sm font-mono">
                {children}
              </code>
            );
          },
          h1: ({ node, children, ...props }) => (
            <h1 {...props} className="text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-gray-100">
              {children}
            </h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 {...props} className="text-3xl font-bold mb-4 mt-8 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 {...props} className="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 dark:text-gray-300">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 italic my-6 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-2 pr-4 rounded-r">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary-500 hover:text-primary-600 underline transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-8 border-gray-200 dark:border-gray-700" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
