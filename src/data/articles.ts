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
}

// 使用 Vite 的 import.meta.glob 导入所有 Markdown 文件
const articleFiles = import.meta.glob('../content/articles/*.md', { eager: true, query: '?raw', import: 'default' });
const videoFiles = import.meta.glob('../content/videos/*.md', { eager: true, query: '?raw', import: 'default' });

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
      let value = match[2].trim();
      
      // 移除引号
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // 解析数组
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        }
      }
      
      metadata[key] = value;
    }
  });
  
  return { metadata, content: body };
}

export function getArticles(): Article[] {
  return Object.entries(articleFiles).map(([path, content]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { metadata, content: body } = parseFrontmatter(content as string);
    
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
  return Object.entries(videoFiles).map(([path, content]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { metadata, content: body } = parseFrontmatter(content as string);
    
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
