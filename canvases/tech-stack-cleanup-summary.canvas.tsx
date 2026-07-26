import { Divider, Grid, H1, H2, Stack, Stat, Table, Text } from 'qoder/canvas';

export default function TechStackCleanupSummary() {
  return (
    <Stack gap={20}>
      <H1>taoxf_blog 技术栈修正与 CI 优化总结</H1>

      <Grid columns={3} gap={16}>
        <Stat value="5" label="优化项完成" tone="success" />
        <Stat value="6" label="测试用例通过" />
        <Stat value="67" label="静态页面导出" />
      </Grid>

      <Divider />

      <H2>优先优化项</H2>
      <Table
        headers={['优先级', '优化项', '修改文件', '状态']}
        rows={[
          ['高', '修正 README.md 技术栈描述（Vite→Next.js）', 'README.md', '完成'],
          ['中', '完善 .gitignore 忽略规则', '.gitignore', '完成'],
          ['中', '引入基础测试覆盖（vitest）', 'package.json, vitest.config.ts, lib/data.test.ts', '完成'],
          ['中', '恢复 ESLint 检查并添加 CI 步骤', 'next.config.mjs, .github/workflows/deploy.yml, .eslintrc.cjs', '完成'],
          ['低', '修正 CI 缓存路径', '.github/workflows/deploy.yml', '完成'],
        ]}
        rowTone={['danger', 'warning', 'warning', 'warning', undefined]}
      />

      <Divider />

      <H2>验证结果</H2>
      <Table
        headers={['检查项', '结果']}
        rows={[
          ['npm test（vitest）', '6 / 6 通过'],
          ['npm run lint', '零错误，2 个既有 Warning'],
          ['npm run build', '成功，67 页面静态导出'],
          ['README 技术栈一致性', 'Vite/React Router 残留已清零'],
          ['.gitignore 生效', '.next.bak.* 已忽略'],
          ['CI 缓存路径', '与 distDir: dist 一致'],
        ]}
        rowTone={[undefined, undefined, undefined, 'success', 'success', 'success']}
      />

      <Divider />

      <H2>意外发现</H2>
      <Text>
        测试过程中发现 lib/data.ts 中 calculateReadingTime 的图片正则存在两处 bug：
        1. 正则缺少转义符 \[，无法匹配标准 Markdown 图片语法；
        2. 图片移除正则位于链接转义正则之后执行，导致图片语法被链接正则提前破坏。
        两处 bug 已修复，图片正则现在能正确排除 Markdown 图片对阅读时间计算的干扰。
      </Text>

      <Text tone="secondary" size="small">
        生成时间：2026-07-26 | 所有修改已验证通过
      </Text>
    </Stack>
  );
}
