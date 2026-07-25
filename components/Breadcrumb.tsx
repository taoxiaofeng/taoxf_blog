'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;
  
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: '首页', href: '/' },
  ];
  
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // 美化标签名称
    let label = segment;
    if (segment === 'articles') label = '文章';
    else if (segment === 'videos') label = '视频';
    else if (segment === 'about') label = '关于';
    else if (segment === 'search') label = '搜索';
    else if (segment === 'prompts') label = 'Prompt 库';
    else if (segment === 'agents') label = 'Agent 库';
    else if (segment === 'mcp') label = 'MCP 资源';
    else if (!isLast) {
      // 其他路径保持原样（slug）
      label = segment;
    } else {
      // 最后一个 slug 可能是文章标题的 URL 形式，简化显示
      label = segment.length > 20 ? segment.substring(0, 20) + '...' : segment;
    }
    
    breadcrumbItems.push({
      label,
      href: currentPath,
    });
  });
  
  return (
    <nav className="py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
              )}
              
              {isLast ? (
                <span className="text-gray-900 dark:text-gray-200 font-medium">
                  {index === 0 && <HomeIcon className="w-4 h-4 inline mr-1" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary-500 transition-colors"
                >
                  {index === 0 && <HomeIcon className="w-4 h-4 inline mr-1" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
