---
title: "ReAct：在语言模型中协同推理与行动"
date: "2024-09-15"
tags: ["LLM", "ReAct", "推理", "Agent", "提示工程"]
category: "AI 前沿"
cover: "https://react-lm.github.io/files/diagram.png"
excerpt: "ReAct 框架将推理（Reasoning）和行动（Acting）相结合，通过交替生成推理轨迹和任务特定动作，使语言模型能够更好地与外部源交互，克服幻觉问题，提高可解释性和任务成功率。"
---

# ReAct：在语言模型中协同推理与行动

> **作者**: Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthak Narasimhan, Yuan Cao  
> **机构**: Princeton University, Google Research  
> **论文**: [arXiv:2210.03629](https://arxiv.org/abs/2210.03629)  
> **代码**: [GitHub](https://github.com/ysymyth/ReAct)  
> **博客**: [Google AI Blog](https://ai.googleblog.com/2022/11/react-synergizing-reasoning-and-acting.html)

## 核心思想

语言模型在推理（如思维链提示）和行动（如 WebGPT、SayCan、ACT-1）方面的能力越来越强，但这两个方向一直是分开研究的。

**ReAct 提出了一个问题：如果将这两种基本能力结合起来会怎样？**

![ReAct 框架 diagram](https://react-lm.github.io/files/diagram.png)

## 摘要

虽然大型语言模型（LLM）在语言理解和交互式决策任务中展现出了令人印象深刻的性能，但它们的推理能力（如思维链提示）和行动能力（如动作计划生成）主要作为独立的主题进行研究。

在本文中，我们探索了使用 LLM **以交错的方式同时生成推理轨迹和任务特定动作**，使两者之间产生更大的协同效应：

- **推理轨迹**帮助模型推导、跟踪和更新行动计划，以及处理异常情况
- **行动**允许模型与外部源（如知识库或环境）交互，以收集额外信息

我们将这种方法命名为 **ReAct**（Reasoning + Acting），并将其应用于多样化的语言和决策任务集。实验结果表明：

1. **超越了现有最先进基线方法**
2. **在没有推理或行动组件的方法之上，提高了人类可解释性和可信度**

具体而言：

- 在问答（HotpotQA）和事实验证（Fever）任务上，ReAct 通过与简单的 Wikipedia API 交互，克服了思维链推理中普遍存在的**幻觉和错误传播问题**，并生成了比没有推理轨迹的基线更易理解的人类式任务解决轨迹
- 在两个交互式决策基准测试（ALFWorld 和 WebShop）上，ReAct 的**成功率比模仿学习和强化学习方法分别高出 34% 和 10%**，而仅使用 1-2 个上下文示例进行提示

## ReAct 提示设计

### 基本原理

ReAct 提示由**少量样本任务解决轨迹**组成，包括：

- ✍️ **人类编写的文本推理轨迹**（Thought）
- 🎯 **行动**（Action）
- 🌍 **环境对行动的观察响应**（Observation）

ReAct 提示具有**直觉性和灵活性**，在各种任务（从问答到在线购物）中都达到了**最先进的少样本性能**。

![ReAct 性能结果](https://react-lm.github.io/files/results.png)

### 示例 1：HotpotQA 问答任务

**问题**: ReAct 如何解决复杂的多跳问答？

#### 基线方法的问题

- **仅推理基线**（思维链）：遭受**虚假信息**困扰（图中红色部分），因为它没有与外部环境交互来获取和更新知识，只能依赖有限的内部知识
- **仅行动基线**：缺乏推理能力，尽管有与 ReAct 相同的行动和观察结果，但**无法综合出最终答案**

#### ReAct 的解决方案

ReAct 通过**可解释且基于事实的轨迹**解决问题：

```
Thought: 我需要找到 Film Stars Don't Die in Liverpool 的主演，然后查找她的出生地。
Action: Search[Film Stars Don't Die in Liverpool cast]
Observation: 主演包括 Annette Bening, Jamie Bell 等
Thought: Annette Bening 可能是主演之一，我需要确认并查找她的出生地。
Action: Search[Annette Bening birthplace]
Observation: San Diego, California
Thought: 所以答案是 San Diego。
Action: Finish[San Diego]
```

![HotpotQA 示例](https://react-lm.github.io/files/hotpotqa.png)

### 示例 2：ALFWorld 决策任务

对于决策任务，我们设计带有**稀疏推理轨迹**的人类轨迹，让语言模型**自主决定何时思考 vs. 何时行动**。

ReAct 并不完美——下面是一个 ALFWorld 上的失败示例。然而，ReAct 格式允许**轻松的人工检查和行为修正**，只需改变几个模型的想法，这是**人类对齐的一种令人兴奋的新方法**！

![ALFWorld 示例](https://react-lm.github.io/files/alfworld.png)

## ReAct 微调：初步结果

### 为什么需要微调？

提示方法有**上下文窗口限制和学习支持不足**的问题。

### 实验结果

在 HotpotQA 上使用 ReAct 提示轨迹进行微调的初步结果表明：

1. **ReAct 是跨模型规模的最佳微调格式**
2. **ReAct 微调的较小模型优于提示的较大模型！**

![HotpotQA 微调结果](https://react-lm.github.io/files/hotpot_finetune.png)

## ReAct 的核心优势

### 1. 克服幻觉问题

传统的思维链推理（CoT）容易产生**虚假信息**，因为模型完全依赖内部参数化知识。ReAct 通过与外部知识库（如 Wikipedia API）交互，**实时获取和更新信息**，显著减少幻觉。

### 2. 错误传播控制

在纯推理方法中，早期的错误推理会导致后续所有步骤都建立在错误基础上。ReAct 的行动步骤可以**验证中间结果**，及时纠正错误。

### 3. 可解释性

ReAct 生成的轨迹（Thought → Action → Observation）非常**接近人类的思考过程**，使得：
- 开发者可以追踪模型的决策路径
- 用户可以理解模型为什么给出某个答案
- 研究者可以分析模型的推理能力

### 4. 灵活性强

ReAct 框架可以应用于：
- 📝 **问答任务**（HotpotQA、Fever）
- 🛒 **交互式决策**（ALFWorld、WebShop）
- 🔍 **信息检索**（搜索引擎、数据库查询）
- 🤖 **Agent 任务**（网页浏览、代码执行）

## 实际应用建议

### 何时使用 ReAct？

✅ **适合的场景**：
- 需要访问外部知识库的任务
- 多步推理且容易出错的复杂问题
- 需要高可解释性的应用
- 交互式决策环境

❌ **不太适合的场景**：
- 简单的单步问答（CoT 足够）
- 不需要外部信息的纯推理任务
- 对延迟要求极高的实时应用

### 如何设计 ReAct 提示？

1. **选择代表性示例**：挑选 1-2 个高质量的任务解决轨迹
2. **编写清晰的推理轨迹**：展示人类如何解决类似问题的思考过程
3. **定义行动格式**：明确 Action 的语法（如 `Search[query]`、`Finish[answer]`）
4. **包含观察结果**：展示环境如何响应每个行动

### 示例模板

```
问题: [输入问题]
Thought: [分析问题的第一步]
Action: [执行行动]
Observation: [获取结果]
Thought: [基于结果继续推理]
Action: [下一步行动]
Observation: [新的结果]
...
Thought: [总结并得出结论]
Action: Finish[最终答案]
```

## 与相关方法的对比

| 方法 | 推理能力 | 行动能力 | 外部交互 | 可解释性 |
|------|---------|---------|---------|---------|
| Standard Prompting | ❌ | ❌ | ❌ | 低 |
| Chain-of-Thought (CoT) | ✅ | ❌ | ❌ | 中 |
| Act-only | ❌ | ✅ | ✅ | 低 |
| **ReAct** | ✅ | ✅ | ✅ | **高** |

## 总结

ReAct 框架通过**将推理和行动紧密结合**，开创了一种新的语言模型使用范式：

1. **推理帮助行动**：推导、跟踪、更新行动计划，处理异常
2. **行动帮助推理**：获取外部信息，验证假设，纠正错误
3. **协同效应**：两者结合产生超越各自单独能力的效果

这一方法不仅在多项基准测试中达到了**最先进的性能**，更重要的是提供了**更高的可解释性和人类可控性**，为构建更可靠、更透明的 AI 系统指明了方向。

---

**📚 延伸学习**：
- [ReAct 论文原文](https://arxiv.org/abs/2210.03629)
- [ReAct 开源代码](https://github.com/ysymyth/ReAct)
- [Google AI 官方博客](https://ai.googleblog.com/2022/11/react-synergizing-reasoning-and-acting.html)
- [思维链提示（Chain-of-Thought）](https://arxiv.org/abs/2201.11903)

---

> **原文链接**: [ReAct: Synergizing Reasoning and Acting in Language Models](https://react-lm.github.io/)  
> **翻译**: 本文基于 ReAct 论文官方页面内容翻译，专业术语参照 AI 领域通用译法。
