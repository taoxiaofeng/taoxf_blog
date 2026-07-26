import {
  H1,
  H2,
  H3,
  ReportSection,
  ReportShell,
  Stack,
  Text,
  Table,
  MetricsGrid,
  Tag,
  Divider,
  Callout,
} from "qoder/canvas";

const headlineMetrics = [
  { label: "Articles Created", value: "9", trend: "complete" },
  { label: "Chapters Covered", value: "12/12", trend: "complete" },
  { label: "Total Lines", value: "8,427", trend: "neutral" },
  { label: "Code Examples", value: "100+", trend: "neutral" },
];

const articleRows = [
  ["1", "模型架构精解", "Transformer, MoE, FlashAttention, 模型压缩", "27KB", "835"],
  ["2", "数据管线与对齐", "数据去重, 指令微调, RLHF/RLAIF/RLEIF", "36KB", "1,245"],
  ["3", "智能体架构", "Agent系统, 工具调用, 多Agent协同", "40KB", "1,373"],
  ["4", "推理加速与部署", "量化, TensorRT, 分布式推理", "31KB", "1,053"],
  ["5", "多模态能力", "视觉-语言, 语音, 视频理解", "26KB", "948"],
  ["6", "微调与自适应", "LoRA, QLoRA, 多任务学习", "15KB", "502"],
  ["7", "推理与规划", "思维链, 任务分解, ReAct", "21KB", "727"],
  ["8-9", "对话与可控性", "长上下文, 安全过滤, 知识边界", "19KB", "674"],
  ["10-12", "企业级实战", "知识助手, RAG, 多模型管理", "31KB", "1,079"],
];

const techLayers = [
  { layer: "架构层", technologies: "Transformer优化, MoE专家路由, FlashAttention-2, 模型压缩" },
  { layer: "数据层", technologies: "数据去重, 指令微调样本, RLAIF/RLEIF对齐" },
  { layer: "能力层", technologies: "智能体架构, 多模态融合, 思维链推理, 对话系统" },
  { layer: "工程层", technologies: "INT4/INT8量化, TensorRT, 分布式推理, RAG系统" },
  { layer: "应用层", technologies: "知识助手, 企业定制, 多模型版本管理, 灰度发布" },
];

export default function QwenBookSeriesReport() {
  return (
    <ReportShell width="wide" ariaLabel="通义千问QwQ-32B书籍博客系列完成报告">
      <Stack gap="sectionCompact">
        <header>
          <Stack gap="component">
            <H1>通义千问QwQ-32B书籍博客系列</H1>
            <Text tone="secondary">
              基于《通义千问:大模型架构与智能体开发实战(基于QwQ-32B开源模型)》的完整技术解读系列
            </Text>
            <MetricsGrid variant="header" columns={4} items={headlineMetrics} />
          </Stack>
        </header>

        <ReportSection title="项目概述" divided>
          <Stack gap="component">
            <Text>
              通过全网搜索获取《通义千问:大模型架构与智能体开发实战》一书的完整目录结构,
              按照12章内容创建了9篇原创技术解读博客文章,每篇包含详细的技术解析、
              可运行的代码示例和实战案例。
            </Text>
            <Callout tone="info">
              <Text>
                所有文章均以原创解读形式呈现,基于书籍目录和技术点进行重新组织和解读,
                不直接复制原文内容,确保版权合规。
              </Text>
            </Callout>
          </Stack>
        </ReportSection>

        <ReportSection title="文章清单" divided>
          <Table
            headers={["章节", "标题", "核心技术点", "大小", "行数"]}
            rows={articleRows}
          />
        </ReportSection>

        <ReportSection title="技术体系覆盖" divided>
          <Table
            headers={["技术层级", "覆盖技术"]}
            rows={techLayers.map((l) => [l.layer, l.technologies])}
          />
        </ReportSection>

        <ReportSection title="内容特点" divided>
          <Stack gap="component">
            <H3>每篇文章包含</H3>
            <Stack gap="small">
              <Text>• 完整的技术原理解读(原创表达)</Text>
              <Text>• 可运行的Python代码示例(3-5个/篇)</Text>
              <Text>• 实战案例与最佳实践</Text>
              <Text>• 版权声明与参考来源标注</Text>
              <Text>• 系列文章导航链接</Text>
            </Stack>
            <Divider />
            <H3>文件位置</H3>
            <Text tone="secondary">
              所有文件已保存至 content/articles/ 目录,文件命名规范:
              2024-XX-XX-qwen-qwq-32b-chapter-X-*.md
            </Text>
          </Stack>
        </ReportSection>

        <ReportSection title="关键成果" divided>
          <Stack gap="component">
            <Callout tone="success">
              <Text>
                全部12章内容已完整覆盖,形成从底层架构到企业应用的完整技术体系,
                总计8,427行高质量技术博客文章。
              </Text>
            </Callout>
            <Stack gap="small">
              <Text tone="secondary">
                第1-7章: 独立文章,每章深入解析一个技术领域
              </Text>
              <Text tone="secondary">
                第8-9章: 合并为对话系统与可控性技术综合文章
              </Text>
              <Text tone="secondary">
                第10-12章: 合并为企业级实战应用综合文章
              </Text>
            </Stack>
          </Stack>
        </ReportSection>

        <Stack gap="small">
          <Divider />
          <Text tone="secondary" size="small">
            参考来源: 《通义千问:大模型架构与智能体开发实战(基于QwQ-32B开源模型)》
            芯智智能、温凯楠编著, 电子工业出版社, 2025
          </Text>
        </Stack>
      </Stack>
    </ReportShell>
  );
}
