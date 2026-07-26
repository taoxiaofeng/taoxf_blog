---
title: "大模型复杂任务推理与规划:思维链到自反思机制"
date: "2024-11-15"
tags: ["QwQ-32B", "思维链", "推理增强", "任务规划", "自反思", "ReAct"]
category: "大模型实战"
cover: ""
excerpt: "深入解析思维链推理增强、多步任务分解与执行、自反思与自我修正等高级推理技术,包含完整的代码示例和推理优化方案。"
series: "通义千问QwQ-32B技术解读"
series_order: 7
---

# 大模型复杂任务推理与规划:思维链到自反思机制

> **参考来源**: 本文基于《通义千问:大模型架构与智能体开发实战(基于QwQ-32B开源模型)》(芯智智能、温凯楠编著,电子工业出版社,2025)第7章内容进行原创技术解读。

## 本章导读

大模型真正的价值不在于简单问答,而在于处理复杂任务的能力——多步推理、逻辑分析、问题分解、自我修正。QwQ-32B在数学、编程等推理任务上表现出色,核心就在于其推理能力的优化。

本章将深入探讨:
- 思维链(Chain of Thought)推理增强技术
- 多步任务分解与执行规划
- 自反思(Self-Reflection)与自我修正机制
- ReAct框架与复杂推理实战

## 一、思维链推理增强

### 1.1 Zero-Shot CoT实现

```python
class ZeroShotCoT:
    """Zero-Shot思维链"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        
    def generate_with_cot(self, question: str) -> str:
        """
        使用Zero-Shot CoT生成回答
        
        Args:
            question: 问题
            
        Returns:
            包含推理过程的回答
        """
        # Zero-Shot CoT提示
        prompt = f"""{question}

让我们逐步思考。"""
        
        # 生成推理过程
        reasoning = self.llm.generate(prompt, max_tokens=500)
        
        # 提取答案
        answer_prompt = f"""{reasoning}

因此,答案是:"""
        answer = self.llm.generate(answer_prompt, max_tokens=100)
        
        return f"{reasoning}{answer}"

# 使用示例
def demo_zeroshot_cot():
    """演示Zero-Shot CoT"""
    
    # cot = ZeroShotCoT(llm_client)
    
    question = "一个农场有鸡和兔共35个头,94只脚,问鸡和兔各有多少只?"
    
    # response = cot.generate_with_cot(question)
    
    print("Zero-Shot CoT提示词: '让我们逐步思考'")
    print("效果: 自动触发模型的推理能力")
```

### 1.2 Few-Shot CoT with Examples

```python
class FewShotCoT:
    """Few-Shot思维链"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        self.examples = []
        
    def add_example(self, question: str, reasoning: str, answer: str):
        """
        添加推理示例
        
        Args:
            question: 问题
            reasoning: 推理过程
            answer: 答案
        """
        self.examples.append({
            "question": question,
            "reasoning": reasoning,
            "answer": answer
        })
        
    def generate(self, question: str, num_examples: int = 3) -> str:
        """
        使用Few-Shot CoT生成
        
        Args:
            question: 问题
            num_examples: 使用的示例数
        """
        # 构建提示
        prompt = ""
        
        for example in self.examples[:num_examples]:
            prompt += f"问题: {example['question']}\n"
            prompt += f"推理: {example['reasoning']}\n"
            prompt += f"答案: {example['answer']}\n\n"
        
        prompt += f"问题: {question}\n"
        prompt += "推理: "
        
        # 生成推理
        reasoning = self.llm.generate(prompt, max_tokens=500)
        
        # 提取答案
        answer = self.llm.generate(reasoning + "\n答案: ", max_tokens=100)
        
        return f"{reasoning}\n答案: {answer}"

# 使用示例
def demo_fewshot_cot():
    """演示Few-Shot CoT"""
    
    cot = FewShotCoT(llm_client=None)
    
    # 添加数学推理示例
    cot.add_example(
        question="小明有10个苹果,给了小红3个,又买了5个,还剩几个?",
        reasoning="初始有10个苹果。给小红3个后,剩下10-3=7个。又买了5个,现在有7+5=12个。",
        answer="12个"
    )
    
    cot.add_example(
        question="一个班级有30个学生,其中60%是女生,男生有多少人?",
        reasoning="女生占60%,所以男生占40%。男生人数 = 30 × 40% = 30 × 0.4 = 12人。",
        answer="12人"
    )
    
    # 新问题
    # response = cot.generate("一个矩形长8cm,宽5cm,面积是多少?")
    
    print("Few-Shot CoT通过示例引导模型学习推理模式")
```

### 1.3 Self-Consistency CoT

```python
class SelfConsistencyCoT:
    """自洽性思维链"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        
    def generate_with_consistency(self, question: str, 
                                 num_paths: int = 5) -> str:
        """
        生成多个推理路径,选择最一致的答案
        
        Args:
            question: 问题
            num_paths: 推理路径数
        """
        answers = []
        reasoning_paths = []
        
        # 生成多个推理路径
        for i in range(num_paths):
            prompt = f"{question}\n\n让我们逐步思考。"
            reasoning = self.llm.generate(prompt, max_tokens=500, 
                                         temperature=0.7)
            
            # 提取答案
            answer = self.extract_answer(reasoning)
            answers.append(answer)
            reasoning_paths.append(reasoning)
        
        # 投票选择最一致的答案
        from collections import Counter
        most_common_answer = Counter(answers).most_common(1)[0][0]
        
        # 找到对应的推理路径
        best_idx = answers.index(most_common_answer)
        best_reasoning = reasoning_paths[best_idx]
        
        return {
            "answer": most_common_answer,
            "reasoning": best_reasoning,
            "confidence": answers.count(most_common_answer) / num_paths,
            "all_answers": answers
        }
    
    def extract_answer(self, reasoning: str) -> str:
        """从推理中提取答案(简化实现)"""
        # 实际应该使用更复杂的答案提取逻辑
        if "因此" in reasoning:
            return reasoning.split("因此")[-1].strip()
        return reasoning[-100:]  # 返回最后100字符

# 使用示例
def demo_self_consistency():
    """演示自洽性CoT"""
    
    # sc_cot = SelfConsistencyCoT(llm_client)
    # result = sc_cot.generate_with_consistency(
    #     "如果3个工人3天能完成3个工作,那么100个工人100天能完成多少工作?",
    #     num_paths=5
    # )
    
    print("自洽性CoT:")
    print("  - 生成多个推理路径")
    print("  - 投票选择最一致答案")
    print("  - 提高答案可靠性")
```

## 二、多步任务分解与执行

### 2.1 任务分解器

```python
class TaskDecomposer:
    """任务分解器"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        
    def decompose(self, task: str, max_depth: int = 3) -> Dict:
        """
        分解复杂任务
        
        Args:
            task: 原始任务
            max_depth: 最大分解深度
            
        Returns:
            任务树
        """
        # 使用LLM分解任务
        prompt = f"""请将以下任务分解为多个子任务:

任务: {task}

请以JSON格式输出:
{{
  "task": "任务描述",
  "subtasks": [
    {{
      "id": 1,
      "description": "子任务描述",
      "dependencies": [],
      "estimated_complexity": "low/medium/high"
    }}
  ]
}}"""
        
        # 调用LLM
        decomposition = self.llm.generate(prompt, max_tokens=1000)
        
        # 解析JSON
        import json
        task_tree = json.loads(decomposition)
        
        return task_tree
    
    def execute_task_tree(self, task_tree: Dict) -> Dict:
        """
        执行任务树
        
        Args:
            task_tree: 任务树
            
        Returns:
            执行结果
        """
        results = {}
        
        # 拓扑排序执行
        subtasks = task_tree["subtasks"]
        completed = set()
        
        while len(completed) < len(subtasks):
            # 找出可执行的子任务
            ready_tasks = []
            for task in subtasks:
                if task["id"] not in completed:
                    # 检查依赖
                    if all(dep in completed for dep in task["dependencies"]):
                        ready_tasks.append(task)
            
            # 执行就绪任务
            for task in ready_tasks:
                print(f"执行子任务 {task['id']}: {task['description']}")
                
                # 执行任务(实际应该调用相应的工具或Agent)
                result = f"子任务 {task['id']} 完成"
                results[task["id"]] = result
                
                completed.add(task["id"])
        
        return results

# 使用示例
def demo_task_decomposition():
    """演示任务分解"""
    
    # decomposer = TaskDecomposer(llm_client)
    
    # task = "撰写一份关于AI发展趋势的研究报告"
    # task_tree = decomposer.decompose(task)
    
    # results = decomposer.execute_task_tree(task_tree)
    
    print("任务分解示例:")
    print("原始任务: 撰写AI发展报告")
    print("  子任务1: 收集AI领域最新文献")
    print("  子任务2: 分析技术发展趋势")
    print("  子任务3: 撰写报告大纲")
    print("  子任务4: 完成报告初稿")
    print("  子任务5: 审阅和修改")
```

### 2.2 执行规划器

```python
class ExecutionPlanner:
    """执行规划器"""
    
    def __init__(self):
        self.plan = []
        
    def create_plan(self, subtasks: List[Dict]) -> List[Dict]:
        """
        创建执行计划
        
        Args:
            subtasks: 子任务列表
            
        Returns:
            执行计划
        """
        plan = []
        
        for i, subtask in enumerate(subtasks, 1):
            plan.append({
                "step": i,
                "task": subtask["description"],
                "action": self.determine_action(subtask),
                "tools_needed": self.identify_tools(subtask),
                "expected_output": subtask.get("expected_output", "")
            })
        
        self.plan = plan
        return plan
    
    def determine_action(self, subtask: Dict) -> str:
        """确定执行动作"""
        complexity = subtask.get("estimated_complexity", "medium")
        
        if complexity == "low":
            return "direct_execution"
        elif complexity == "medium":
            return "reasoning_and_execution"
        else:
            return "decompose_and_execute"
    
    def identify_tools(self, subtask: Dict) -> List[str]:
        """识别需要的工具"""
        tools = []
        
        description = subtask["description"].lower()
        
        if "搜索" in description or "收集" in description:
            tools.append("search_engine")
        
        if "计算" in description or "分析" in description:
            tools.append("calculator")
        
        if "写" in description or "撰写" in description:
            tools.append("text_generator")
        
        return tools
    
    def execute_plan(self) -> Dict:
        """执行计划"""
        results = []
        
        for step in self.plan:
            print(f"\n步骤 {step['step']}: {step['task']}")
            print(f"  动作: {step['action']}")
            print(f"  工具: {', '.join(step['tools_needed'])}")
            
            # 执行步骤
            result = self.execute_step(step)
            results.append({
                "step": step["step"],
                "result": result,
                "status": "completed"
            })
        
        return {"plan_results": results}
    
    def execute_step(self, step: Dict) -> str:
        """执行单个步骤"""
        # 实际实现会根据action和tools执行相应操作
        return f"步骤 {step['step']} 执行完成"

# 使用示例
def demo_execution_planning():
    """演示执行规划"""
    
    planner = ExecutionPlanner()
    
    subtasks = [
        {"description": "搜索AI最新文献", "estimated_complexity": "medium"},
        {"description": "分析技术趋势", "estimated_complexity": "high"},
        {"description": "撰写报告", "estimated_complexity": "medium"}
    ]
    
    plan = planner.create_plan(subtasks)
    
    for step in plan:
        print(f"步骤 {step['step']}: {step['task']}")
        print(f"  工具: {step['tools_needed']}")
    
    # results = planner.execute_plan()
```

## 三、自反思与自我修正机制

### 3.1 Self-Reflection实现

```python
class SelfReflectiveAgent:
    """自反思Agent"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        self.reflection_history = []
        
    def generate_with_reflection(self, task: str, 
                                max_iterations: int = 3) -> Dict:
        """
        带自反思的生成
        
        Args:
            task: 任务
            max_iterations: 最大反思迭代次数
            
        Returns:
            最终结果和反思历史
        """
        current_solution = None
        
        for iteration in range(max_iterations):
            print(f"\n=== 迭代 {iteration + 1} ===")
            
            # 1. 生成解决方案
            if current_solution is None:
                solution = self.generate_initial_solution(task)
            else:
                solution = self.improve_solution(task, current_solution)
            
            # 2. 自我评估
            evaluation = self.evaluate_solution(task, solution)
            
            # 3. 记录反思
            reflection = {
                "iteration": iteration + 1,
                "solution": solution,
                "evaluation": evaluation,
                "needs_improvement": evaluation["score"] < 0.8
            }
            self.reflection_history.append(reflection)
            
            print(f"评分: {evaluation['score']:.2f}")
            print(f"反馈: {evaluation['feedback']}")
            
            # 4. 检查是否满意
            if evaluation["score"] >= 0.8:
                print("✓ 解决方案已满足要求")
                break
            
            current_solution = solution
        
        return {
            "final_solution": solution,
            "final_score": evaluation["score"],
            "iterations": iteration + 1,
            "reflection_history": self.reflection_history
        }
    
    def generate_initial_solution(self, task: str) -> str:
        """生成初始解决方案"""
        prompt = f"任务: {task}\n\n请提供解决方案:"
        return self.llm.generate(prompt, max_tokens=500)
    
    def improve_solution(self, task: str, current: str) -> str:
        """改进解决方案"""
        prompt = f"""任务: {task}

当前方案:
{current}

请改进这个方案,解决以下问题:"""
        return self.llm.generate(prompt, max_tokens=500)
    
    def evaluate_solution(self, task: str, solution: str) -> Dict:
        """
        评估解决方案
        
        Returns:
            {
                "score": 0-1的评分,
                "feedback": 改进建议,
                "issues": 发现的问题列表
            }
        """
        prompt = f"""请评估以下解决方案的质量:

任务: {task}

解决方案:
{solution}

请从以下方面评估(0-1分):
1. 正确性
2. 完整性
3. 可行性

输出JSON格式:
{{
  "score": 0.0-1.0,
  "feedback": "改进建议",
  "issues": ["问题1", "问题2"]
}}"""
        
        # 调用LLM评估
        evaluation_str = self.llm.generate(prompt, max_tokens=300)
        
        # 解析(简化实现)
        import json
        try:
            evaluation = json.loads(evaluation_str)
        except:
            evaluation = {
                "score": 0.7,
                "feedback": "需要改进",
                "issues": []
            }
        
        return evaluation

# 使用示例
def demo_self_reflection():
    """演示自反思"""
    
    # agent = SelfReflectiveAgent(llm_client)
    
    # task = "编写一个快速排序算法,要求包含详细注释"
    # result = agent.generate_with_reflection(task, max_iterations=3)
    
    # print(f"最终评分: {result['final_score']:.2f}")
    # print(f"迭代次数: {result['iterations']}")
    
    print("自反思机制:")
    print("  1. 生成初始方案")
    print("  2. 自我评估")
    print("  3. 识别问题")
    print("  4. 改进方案")
    print("  5. 重复直到满意")
```

### 3.2 ReAct框架实现

```python
class ReActAgent:
    """ReAct (Reasoning + Acting) Agent"""
    
    def __init__(self, llm_client, tools: Dict):
        """
        Args:
            llm_client: LLM客户端
            tools: 可用工具字典
        """
        self.llm = llm_client
        self.tools = tools
        self.max_steps = 10
        
    def run(self, task: str) -> str:
        """
        运行ReAct循环
        
        Args:
            task: 任务
            
        Returns:
            最终答案
        """
        thought = ""
        
        for step in range(self.max_steps):
            print(f"\n=== 步骤 {step + 1} ===")
            
            # 1. Thought: 思考下一步
            thought_prompt = self.build_thought_prompt(task, thought)
            thought = self.llm.generate(thought_prompt, max_tokens=200)
            
            print(f"Thought: {thought}")
            
            # 2. 判断是否需要行动
            if self.needs_action(thought):
                # Action: 选择工具
                action = self.parse_action(thought)
                print(f"Action: {action}")
                
                # 执行工具
                if action["tool"] in self.tools:
                    observation = self.tools[action["tool"]](**action["args"])
                    print(f"Observation: {observation}")
                    
                    thought += f"\nAction: {action}\nObservation: {observation}"
                else:
                    thought += f"\nError: Tool {action['tool']} not found"
            else:
                # 直接输出答案
                answer = self.extract_answer(thought)
                print(f"Answer: {answer}")
                return answer
        
        return "达到最大步骤数,未能完成任务"
    
    def build_thought_prompt(self, task: str, history: str) -> str:
        """构建思考提示"""
        return f"""解决以下任务:

任务: {task}

{history}

请思考下一步应该做什么。如果需要查询信息或执行操作,请说明使用什么工具。"""
    
    def needs_action(self, thought: str) -> bool:
        """判断是否需要行动"""
        action_keywords = ["搜索", "查询", "计算", "调用"]
        return any(keyword in thought for keyword in action_keywords)
    
    def parse_action(self, thought: str) -> Dict:
        """解析行动"""
        # 简化实现
        return {
            "tool": "search_engine",
            "args": {"query": "示例查询"}
        }
    
    def extract_answer(self, thought: str) -> str:
        """提取答案"""
        if "因此" in thought:
            return thought.split("因此")[-1].strip()
        return thought

# 使用示例
def demo_react_agent():
    """演示ReAct Agent"""
    
    # 定义工具
    def search_engine(query: str) -> str:
        return f"搜索结果: {query}"
    
    def calculator(expression: str) -> str:
        return f"计算结果: {eval(expression)}"
    
    tools = {
        "search": search_engine,
        "calculate": calculator
    }
    
    # agent = ReActAgent(llm_client, tools)
    # result = agent.run("2024年诺贝尔物理学奖得主是谁?他们的贡献是什么?")
    
    print("ReAct框架:")
    print("  Thought → Action → Observation → Thought...")
    print("  循环直到得出答案")
```

## 四、总结与延伸

### 核心要点回顾

1. **思维链推理**: Zero-Shot/Few-Shot CoT显著提升复杂问题求解能力
2. **自洽性CoT**: 多路径投票提高答案可靠性
3. **任务分解**: 将复杂任务拆解为可执行的子任务树
4. **自反思机制**: 通过评估-改进循环持续提升方案质量
5. **ReAct框架**: 推理与行动交替进行,适合需要工具调用的场景

### 与其他章节的关联

- **第3章**: Agent架构 → ReAct是Agent的核心推理模式
- **第6章**: 微调 → 可以通过微调增强推理能力
- **第8章**: 对话系统 → 复杂推理提升对话质量
- **第10-11章**: 实战 → 推理能力是企业应用的核心

### 进一步学习资源

1. **相关论文**:
   - Chain-of-Thought Prompting Elicits Reasoning
   - Self-Consistency Improves Chain of Thought
   - ReAct: Synergizing Reasoning and Acting
   
2. **推理基准**:
   - GSM8K(数学推理)
   - MMLU(多学科理解)
   - HumanEval(代码生成)

---

**版权声明**: 本文基于《通义千问:大模型架构与智能体开发实战》第7章进行原创技术解读,所有代码示例和解读均为作者独立完成,仅供参考学习使用。

**下一篇预告**: [第8章 系统对话能力增强与上下文处理](#) — 深入探讨长上下文优化、对话状态跟踪、个性化对话生成等技术。
