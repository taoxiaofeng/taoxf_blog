import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from './data';

describe('calculateReadingTime', () => {
  it('空内容应返回至少 1 分钟', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('应基于字数计算阅读时间', () => {
    const content = 'word '.repeat(200);
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('超过 200 字应返回 2 分钟', () => {
    const content = 'word '.repeat(400);
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('计算时应排除代码块', () => {
    const codeBlock = '```js\nconst a = 1;\nconst b = 2;\n```\n';
    const content = codeBlock + 'word '.repeat(200);
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('计算时应排除 Markdown 标记', () => {
    const markdown = '# 标题\n\n**bold** _italic_ [link](http://example.com)\n\n';
    // markdown 处理后剩余 "标题 bold italic link" 共 4 个词
    const content = markdown + 'word '.repeat(196);
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('计算时应排除图片', () => {
    const image = '![alt text](http://example.com/image.png)\n';
    const content = image + 'word '.repeat(200);
    expect(calculateReadingTime(content)).toBe(1);
  });
});
