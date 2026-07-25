import fs from 'fs';
import path from 'path';

export interface Article {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  cover?: string;
  excerpt: string;
  content: string;
  readingTime?: number;
}

export interface Video {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  thumbnail?: string;
  videoUrl: string;
  description: string;
  content: string;
  readingTime?: number;
  duration?: string; // 视频时长，例如 "15:30"
}

function parseFrontmatter(content: string): { metadata: Record<string, any>; content: string } {
  const frontmatterMatch = content.match(/^---([\s\S]*?)---([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    return { metadata: {}, content };
  }
  
  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2].trim();
  const metadata: Record<string, any> = {};
  
  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const key = match[1];
      let value: any = match[2].trim();
      
      // 移除引号
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // 解析数组
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = value.slice(1, -1).split(',').map((v: string) => v.trim().replace(/^"|"$/g, ''));
        }
      }
      
      metadata[key] = value;
    }
  });
  
  return { metadata, content: body };
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });
  
  return arrayOfFiles;
}

// 计算阅读时间（平均每分钟阅读 200 字）
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  // 移除 Markdown 标记，只计算纯文本
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/[*_~`]/g, '') // 移除强调标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接转文本
    .replace(/![^\]]*\]\([^)]+\)/g, '') // 移除图片
    .trim();
  
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime); // 至少 1 分钟
}

export function getArticles(): Article[] {
  const articlesDir = path.join(process.cwd(), 'content/articles');
  const files = getAllFiles(articlesDir);
  
  return files.map(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const slug = fileName.replace(/\.(md|mdx)$/, '');
    const { metadata, content: body } = parseFrontmatter(content);
    
    return {
      slug,
      title: metadata.title || '',
      date: metadata.date || '',
      tags: metadata.tags || [],
      category: metadata.category || '',
      cover: metadata.cover || '',
      excerpt: metadata.excerpt || '',
      content: body,
      readingTime: calculateReadingTime(body),
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getArticles();
  return articles.find(article => article.slug === slug);
}

export function getVideos(): Video[] {
  const videosDir = path.join(process.cwd(), 'content/videos');
  const files = getAllFiles(videosDir);
  
  return files.map(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const slug = fileName.replace(/\.(md|mdx)$/, '');
    const { metadata, content: body } = parseFrontmatter(content);
    
    return {
      slug,
      title: metadata.title || '',
      date: metadata.date || '',
      tags: metadata.tags || [],
      category: metadata.category || '',
      thumbnail: metadata.thumbnail || '',
      videoUrl: metadata.videoUrl || '',
      description: metadata.description || '',
      content: body,
      readingTime: calculateReadingTime(body),
      duration: metadata.duration || '',
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getVideoBySlug(slug: string): Video | undefined {
  const videos = getVideos();
  return videos.find(video => video.slug === slug);
}

export interface DesignPattern {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  patternType: string; // 创建型模式 | 结构型模式 | 行为型模式
  cover?: string;
  excerpt: string;
  content: string;
  readingTime?: number;
}

export function getDesignPatterns(): DesignPattern[] {
  const patternsDir = path.join(process.cwd(), 'content/design-patterns');
  
  if (!fs.existsSync(patternsDir)) {
    return [];
  }
  
  const files = getAllFiles(patternsDir);
  
  return files.map(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const slug = fileName.replace(/\.(md|mdx)$/, '');
    const { metadata, content: body } = parseFrontmatter(content);
    
    return {
      slug,
      title: metadata.title || '',
      date: metadata.date || '',
      tags: metadata.tags || [],
      category: metadata.category || '设计模式',
      patternType: metadata.patternType || '',
      cover: metadata.cover || '',
      excerpt: metadata.excerpt || '',
      content: body,
      readingTime: calculateReadingTime(body),
    };
  }).sort((a, b) => {
    // 按模式类型排序：创建型 > 结构型 > 行为型
    const typeOrder: Record<string, number> = { '创建型模式': 1, '结构型模式': 2, '行为型模式': 3 };
    const aOrder = typeOrder[a.patternType] || 99;
    const bOrder = typeOrder[b.patternType] || 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.title.localeCompare(b.title, 'zh-CN');
  });
}

export function getDesignPatternBySlug(slug: string): DesignPattern | undefined {
  const patterns = getDesignPatterns();
  return patterns.find(pattern => pattern.slug === slug);
}

export function getAllPatternTypes(): string[] {
  const patterns = getDesignPatterns();
  const types = new Set<string>();
  patterns.forEach(pattern => {
    types.add(pattern.patternType);
  });
  return Array.from(types).sort();
}

export function getAllTags(): string[] {
  const articles = getArticles();
  const tags = new Set<string>();
  articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getAllCategories(): string[] {
  const articles = getArticles();
  const categories = new Set<string>();
  articles.forEach(article => {
    categories.add(article.category);
  });
  return Array.from(categories).sort();
}

// ==================== 算法模块 ====================

export interface Algorithm {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  difficulty: string; // 入门 | 基础 | 进阶 | 深入
  excerpt: string;
  content: string;
  readingTime?: number;
  visualgoUrl?: string;
}

export function getAlgorithms(): Algorithm[] {
  const algorithmsDir = path.join(process.cwd(), 'content/algorithms');
  
  if (!fs.existsSync(algorithmsDir)) {
    return [];
  }
  
  const files = getAllFiles(algorithmsDir);
  
  return files.map(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const slug = fileName.replace(/\.(md|mdx)$/, '');
    const { metadata, content: body } = parseFrontmatter(content);
    
    return {
      slug,
      title: metadata.title || '',
      date: metadata.date || '',
      tags: metadata.tags || [],
      category: metadata.category || '算法',
      difficulty: metadata.difficulty || '入门',
      excerpt: metadata.excerpt || '',
      content: body,
      readingTime: calculateReadingTime(body),
      visualgoUrl: metadata.visualgoUrl || '',
    };
  }).sort((a, b) => {
    const diffOrder: Record<string, number> = { '入门': 1, '基础': 2, '进阶': 3, '深入': 4 };
    const aOrder = diffOrder[a.difficulty] || 99;
    const bOrder = diffOrder[b.difficulty] || 99;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

export function getAlgorithmBySlug(slug: string): Algorithm | undefined {
  const algorithms = getAlgorithms();
  return algorithms.find(a => a.slug === slug);
}

export function getAllDifficultyLevels(): string[] {
  return ['入门', '基础', '进阶', '深入'];
}
