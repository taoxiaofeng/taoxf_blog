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
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getVideoBySlug(slug: string): Video | undefined {
  const videos = getVideos();
  return videos.find(video => video.slug === slug);
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
