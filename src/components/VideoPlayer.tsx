interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  // 从 Bilibili URL 提取嵌入 URL
  const getEmbedUrl = (url: string): string => {
    const bilibiliMatch = url.match(/bilibili\.com\/video\/([a-zA-Z0-9]+)/);
    if (bilibiliMatch) {
      const bvid = bilibiliMatch[1];
      return `//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1`;
    }
    
    // YouTube URL
    const youtubeMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) || 
                         url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return `//www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
      <iframe
        src={embedUrl}
        title={title}
        className="absolute top-0 left-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}
