---
title: "大模型智能体架构实战:从工具调用到多Agent协同"
date: "2024-10-25"
tags: ["QwQ-32B", "智能体", "Agent", "工具调用", "Function Calling", "多智能体"]
category: "大模型实战"
cover: ""
excerpt: "深入解析智能体系统架构设计、工具调用机制、多智能体协同对话系统等核心技术,包含完整的Agent实现代码和实战案例。"
series: "通义千问QwQ-32B技术解读"
series_order: 3
---

# 大模型智能体架构实战:从工具调用到多智能体协同

> **参考来源**: 本文基于《通义千问:大模型架构与智能体开发实战(基于QwQ-32B开源模型)》(芯智智能、温凯楠编著,电子工业出版社,2025)第3章内容进行原创技术解读。

## 本章导读

智能体(Agent)是大模型从"对话工具"进化为"自主决策系统"的关键。一个优秀的Agent不仅能理解自然语言,还能调用工具、规划任务、与环境交互,最终完成复杂目标。

本章将深入探讨:
- 智能体系统架构的核心组件与调度机制
- 工具调用(Function Calling)的完整实现与优化
- 多智能体协同系统的设计模式
- 性能调优与错误处理的最佳实践

## 一、智能体系统架构剖析

### 1.1 多模块协同调度引擎

一个完整的智能体系统通常包含以下核心模块:

```python
from typing import List, Dict, Optional, Callable
from enum import Enum
import json

class AgentState(Enum):
    """智能体状态"""
    IDLE = "idle"
    THINKING = "thinking"
    PLANNING = "planning"
    ACTING = "acting"
    WAITING = "waiting"
    COMPLETED = "completed"
    ERROR = "error"

class AgentModule:
    """智能体模块基类"""
    
    def __init__(self, name: str):
        self.name = name
        
    def execute(self, **kwargs):
        raise NotImplementedError

class PerceptionModule(AgentModule):
    """感知模块:理解用户输入"""
    
    def __init__(self):
        super().__init__("Perception")
        
    def execute(self, user_input: str, context: Dict) -> Dict:
        """
        解析用户输入,提取意图和关键信息
        
        Returns:
            {
                "intent": str,
                "entities": Dict,
                "confidence": float
            }
        """
        # 实际实现中会调用LLM进行意图识别
        return {
            "intent": "query_weather",
            "entities": {"location": "北京", "date": "今天"},
            "confidence": 0.95
        }

class PlanningModule(AgentModule):
    """规划模块:制定执行计划"""
    
    def __init__(self):
        super().__init__("Planning")
        self.tool_registry = {}
        
    def register_tool(self, tool_name: str, tool_func: Callable):
        """注册可用工具"""
        self.tool_registry[tool_name] = tool_func
        
    def execute(self, intent: Dict, context: Dict) -> List[Dict]:
        """
        生成执行计划
        
        Returns:
            [
                {"step": 1, "tool": "search_api", "args": {...}},
                {"step": 2, "tool": "format_response", "args": {...}}
            ]
        """
        # 基于意图选择合适的工具
        if intent["intent"] == "query_weather":
            return [
                {
                    "step": 1,
                    "tool": "weather_api",
                    "args": {
                        "location": intent["entities"]["location"],
                        "date": intent["entities"]["date"]
                    }
                },
                {
                    "step": 2,
                    "tool": "format_response",
                    "args": {"style": "friendly"}
                }
            ]
        return []

class MemoryModule(AgentModule):
    """记忆模块:管理短期和长期记忆"""
    
    def __init__(self, max_short_term: int = 10):
        super().__init__("Memory")
        self.short_term_memory = []
        self.long_term_memory = {}
        self.max_short_term = max_short_term
        
    def add_to_short_term(self, message: Dict):
        """添加到短期记忆"""
        self.short_term_memory.append(message)
        
        # 保持记忆长度
        if len(self.short_term_memory) > self.max_short_term:
            self.short_term_memory = self.short_term_memory[-self.max_short_term:]
            
    def get_context(self) -> List[Dict]:
        """获取上下文"""
        return self.short_term_memory
        
    def save_to_long_term(self, key: str, value: any):
        """保存到长期记忆"""
        self.long_term_memory[key] = value
        
    def retrieve_from_long_term(self, key: str) -> Optional[any]:
        """从长期记忆检索"""
        return self.long_term_memory.get(key)

class ActionModule(AgentModule):
    """执行模块:调用工具执行动作"""
    
    def __init__(self, tool_registry: Dict):
        super().__init__("Action")
        self.tool_registry = tool_registry
        
    def execute(self, plan: List[Dict]) -> List[Dict]:
        """
        执行计划中的每一步
        
        Returns:
            执行结果列表
        """
        results = []
        
        for step in plan:
            tool_name = step["tool"]
            args = step["args"]
            
            if tool_name in self.tool_registry:
                try:
                    result = self.tool_registry[tool_name](**args)
                    results.append({
                        "step": step["step"],
                        "tool": tool_name,
                        "status": "success",
                        "result": result
                    })
                except Exception as e:
                    results.append({
                        "step": step["step"],
                        "tool": tool_name,
                        "status": "error",
                        "error": str(e)
                    })
            else:
                results.append({
                    "step": step["step"],
                    "tool": tool_name,
                    "status": "error",
                    "error": f"Tool {tool_name} not found"
                })
        
        return results

class ResponseModule(AgentModule):
    """响应模块:生成最终回复"""
    
    def __init__(self):
        super().__init__("Response")
        
    def execute(self, action_results: List[Dict], context: Dict) -> str:
        """
        基于执行结果生成自然语言回复
        
        Returns:
            回复文本
        """
        # 实际实现中会调用LLM生成回复
        if action_results and action_results[-1]["status"] == "success":
            return f"根据查询结果:{action_results[-1]['result']}"
        return "抱歉,查询失败。"

class AgentOrchestrator:
    """智能体编排器:协调各模块工作"""
    
    def __init__(self):
        self.perception = PerceptionModule()
        self.planning = PlanningModule()
        self.memory = MemoryModule()
        self.action = None
        self.response = ResponseModule()
        self.state = AgentState.IDLE
        
    def register_tools(self, tools: Dict):
        """注册工具"""
        self.planning.tool_registry.update(tools)
        self.action = ActionModule(tools)
        
    def run(self, user_input: str) -> str:
        """
        运行智能体
        
        Args:
            user_input: 用户输入
            
        Returns:
            智能体回复
        """
        try:
            self.state = AgentState.THINKING
            
            # 1. 感知:理解用户输入
            perception_result = self.perception.execute(
                user_input=user_input,
                context=self.memory.get_context()
            )
            
            # 保存到记忆
            self.memory.add_to_short_term({
                "role": "user",
                "content": user_input
            })
            
            # 2. 规划:制定执行计划
            self.state = AgentState.PLANNING
            plan = self.planning.execute(
                intent=perception_result,
                context=self.memory.get_context()
            )
            
            # 3. 执行:调用工具
            self.state = AgentState.ACTING
            action_results = self.action.execute(plan)
            
            # 4. 响应:生成回复
            self.state = AgentState.THINKING
            response = self.response.execute(
                action_results=action_results,
                context=self.memory.get_context()
            )
            
            # 保存响应到记忆
            self.memory.add_to_short_term({
                "role": "assistant",
                "content": response
            })
            
            self.state = AgentState.COMPLETED
            return response
            
        except Exception as e:
            self.state = AgentState.ERROR
            return f"发生错误: {str(e)}"

# 使用示例
def demo_agent():
    """演示智能体运行"""
    
    # 定义工具
    def weather_api(location: str, date: str) -> str:
        return f"{date}{location}的天气:晴,25°C"
    
    def format_response(style: str) -> str:
        return "格式化的响应"
    
    tools = {
        "weather_api": weather_api,
        "format_response": format_response
    }
    
    # 创建智能体
    agent = AgentOrchestrator()
    agent.register_tools(tools)
    
    # 运行
    response = agent.run("北京今天天气怎么样?")
    print(f"用户: 北京今天天气怎么样?")
    print(f"Agent: {response}")
```

### 1.2 Agent核心接口封装与协议设计

设计标准化的Agent接口,提升系统的可扩展性:

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, List, Dict

@dataclass
class Message:
    """消息数据结构"""
    role: str  # "user", "assistant", "system", "tool"
    content: str
    tool_calls: Optional[List[Dict]] = None
    tool_call_id: Optional[str] = None

@dataclass
class ToolCall:
    """工具调用"""
    id: str
    name: str
    arguments: Dict[str, Any]

@dataclass
class AgentResponse:
    """Agent响应"""
    content: str
    tool_calls: List[ToolCall]
    finish_reason: str  # "stop", "tool_call", "error"
    metadata: Dict = None

class BaseAgent(ABC):
    """Agent基类"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.tools = {}
        self.memory = []
        
    @abstractmethod
    def chat(self, messages: List[Message]) -> AgentResponse:
        """
        对话接口
        
        Args:
            messages: 消息历史
            
        Returns:
            Agent响应
        """
        pass
    
    def register_tool(self, tool):
        """
        注册工具
        
        Args:
            tool: Tool实例
        """
        self.tools[tool.name] = tool
        
    def get_available_tools(self) -> List[Dict]:
        """获取可用工具描述"""
        return [
            tool.to_dict() for tool in self.tools.values()
        ]
    
    def execute_tool(self, tool_call: ToolCall) -> Any:
        """
        执行工具调用
        
        Args:
            tool_call: 工具调用信息
            
        Returns:
            工具执行结果
        """
        if tool_call.name not in self.tools:
            raise ValueError(f"Tool {tool_call.name} not found")
        
        tool = self.tools[tool_call.name]
        return tool.execute(**tool_call.arguments)

class Tool(ABC):
    """工具基类"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        
    @abstractmethod
    def execute(self, **kwargs) -> Any:
        """执行工具"""
        pass
    
    @abstractmethod
    def to_dict(self) -> Dict:
        """转换为字典格式"""
        pass

class SearchTool(Tool):
    """搜索工具示例"""
    
    def __init__(self):
        super().__init__(
            name="web_search",
            description="搜索互联网获取实时信息"
        )
        
    def execute(self, query: str, num_results: int = 5) -> List[Dict]:
        """执行搜索"""
        # 实际实现中调用搜索API
        return [
            {"title": f"结果{i}", "url": f"https://example.com/{i}", "snippet": f"..."}
            for i in range(num_results)
        ]
    
    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "搜索查询"
                    },
                    "num_results": {
                        "type": "integer",
                        "description": "返回结果数量",
                        "default": 5
                    }
                },
                "required": ["query"]
            }
        }

class CalculatorTool(Tool):
    """计算器工具"""
    
    def __init__(self):
        super().__init__(
            name="calculator",
            description="执行数学计算"
        )
        
    def execute(self, expression: str) -> float:
        """执行计算"""
        try:
            # 注意:实际应用中应该使用安全的计算库
            return eval(expression)
        except Exception as e:
            raise ValueError(f"计算错误: {str(e)}")
    
    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "数学表达式,如 '2 + 3 * 4'"
                    }
                },
                "required": ["expression"]
            }
        }

# 使用示例
def demo_agent_interface():
    """演示Agent接口使用"""
    
    # 创建具体Agent实现
    class SimpleAgent(BaseAgent):
        def __init__(self):
            super().__init__("SimpleAgent", "一个简单的助手")
            
        def chat(self, messages: List[Message]) -> AgentResponse:
            # 简化的实现
            last_message = messages[-1]
            
            # 模拟工具调用决策
            if "天气" in last_message.content:
                return AgentResponse(
                    content="",
                    tool_calls=[
                        ToolCall(
                            id="call_1",
                            name="weather_api",
                            arguments={"location": "北京"}
                        )
                    ],
                    finish_reason="tool_call"
                )
            else:
                return AgentResponse(
                    content="你好!我能帮你做什么?",
                    tool_calls=[],
                    finish_reason="stop"
                )
    
    # 创建Agent
    agent = SimpleAgent()
    
    # 注册工具
    agent.register_tool(SearchTool())
    agent.register_tool(CalculatorTool())
    
    # 对话
    messages = [Message(role="user", content="北京天气怎么样?")]
    response = agent.chat(messages)
    
    print(f"Finish Reason: {response.finish_reason}")
    print(f"Tool Calls: {response.tool_calls}")
```

## 二、工具调用与函数推理

### 2.1 OpenFunction格式接口定义

标准化的函数调用格式:

```python
class FunctionSchema:
    """函数模式定义"""
    
    def __init__(self, name: str, description: str, parameters: Dict):
        self.name = name
        self.description = description
        self.parameters = parameters
    
    def to_openai_format(self) -> Dict:
        """转换为OpenAI格式"""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters
        }

class FunctionCaller:
    """函数调用器"""
    
    def __init__(self):
        self.functions = {}
        
    def register_function(self, schema: FunctionSchema, func: Callable):
        """注册函数"""
        self.functions[schema.name] = {
            "schema": schema,
            "function": func
        }
    
    def build_system_prompt(self) -> str:
        """构建系统提示"""
        prompt = "你可以使用以下工具:\n\n"
        
        for name, info in self.functions.items():
            schema = info["schema"]
            prompt += f"工具: {schema.name}\n"
            prompt += f"描述: {schema.description}\n"
            prompt += f"参数: {json.dumps(schema.parameters, ensure_ascii=False)}\n\n"
        
        return prompt
    
    def parse_tool_call(self, llm_response: str) -> Optional[Dict]:
        """
        解析LLM的工具调用请求
        
        Args:
            llm_response: LLM响应文本
            
        Returns:
            工具调用信息
        """
        try:
            # 假设LLM返回JSON格式的工具调用
            tool_call = json.loads(llm_response)
            
            if "tool" in tool_call and "arguments" in tool_call:
                return tool_call
        except:
            pass
        
        return None
    
    def execute_tool_call(self, tool_call: Dict) -> Any:
        """
        执行工具调用
        
        Args:
            tool_call: 工具调用信息
            
        Returns:
            执行结果
        """
        tool_name = tool_call["tool"]
        arguments = tool_call["arguments"]
        
        if tool_name not in self.functions:
            raise ValueError(f"Unknown tool: {tool_name}")
        
        func = self.functions[tool_name]["function"]
        return func(**arguments)

# 使用示例
def demo_function_calling():
    """演示函数调用"""
    
    # 定义函数
    def get_weather(location: str, unit: str = "celsius") -> str:
        return f"{location}的天气: 25°C"
    
    def calculate(expression: str) -> float:
        return eval(expression)
    
    # 创建调用器
    caller = FunctionCaller()
    
    # 注册函数
    caller.register_function(
        FunctionSchema(
            name="get_weather",
            description="获取指定城市的天气信息",
            parameters={
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "城市名称"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["location"]
            }
        ),
        get_weather
    )
    
    # 构建系统提示
    system_prompt = caller.build_system_prompt()
    print("系统提示:")
    print(system_prompt)
    
    # 模拟LLM响应
    llm_response = json.dumps({
        "tool": "get_weather",
        "arguments": {
            "location": "北京",
            "unit": "celsius"
        }
    })
    
    # 解析并执行
    tool_call = caller.parse_tool_call(llm_response)
    if tool_call:
        result = caller.execute_tool_call(tool_call)
        print(f"执行结果: {result}")
```

### 2.2 工具调用错误恢复与重试策略

```python
import time
from typing import Callable

class RetryStrategy:
    """重试策略"""
    
    def __init__(self, max_retries: int = 3, backoff_factor: float = 1.0):
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
    
    def execute_with_retry(self, func: Callable, *args, **kwargs) -> Any:
        """
        带重试的执行
        
        Args:
            func: 要执行的函数
            *args, **kwargs: 函数参数
            
        Returns:
            执行结果
        """
        last_exception = None
        
        for attempt in range(self.max_retries + 1):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                
                if attempt < self.max_retries:
                    # 指数退避
                    wait_time = self.backoff_factor * (2 ** attempt)
                    print(f"尝试 {attempt + 1} 失败,等待 {wait_time} 秒后重试...")
                    time.sleep(wait_time)
                else:
                    print(f"所有重试失败,最后错误: {str(e)}")
        
        raise last_exception

class ToolCallExecutor:
    """工具调用执行器(带错误处理)"""
    
    def __init__(self):
        self.retry_strategy = RetryStrategy(max_retries=3)
        self.error_handlers = {}
        
    def register_error_handler(self, error_type: str, handler: Callable):
        """注册错误处理器"""
        self.error_handlers[error_type] = handler
    
    def execute(self, tool_call: Dict) -> Dict:
        """
        执行工具调用
        
        Returns:
            {
                "success": bool,
                "result": any,
                "error": str,
                "retries": int
            }
        """
        tool_name = tool_call.get("tool")
        arguments = tool_call.get("arguments", {})
        
        def _execute():
            # 实际执行工具调用
            if tool_name == "get_weather":
                return get_weather(**arguments)
            elif tool_name == "calculate":
                return calculate(**arguments)
            else:
                raise ValueError(f"Unknown tool: {tool_name}")
        
        try:
            result = self.retry_strategy.execute_with_retry(_execute)
            return {
                "success": True,
                "result": result,
                "error": None,
                "retries": 0
            }
        except Exception as e:
            error_type = type(e).__name__
            
            # 尝试使用错误处理器
            if error_type in self.error_handlers:
                try:
                    result = self.error_handlers[error_type](e, tool_call)
                    return {
                        "success": True,
                        "result": result,
                        "error": None,
                        "retries": 0
                    }
                except:
                    pass
            
            return {
                "success": False,
                "result": None,
                "error": str(e),
                "retries": self.retry_strategy.max_retries
            }

# 使用示例
def demo_error_handling():
    """演示错误处理"""
    
    executor = ToolCallExecutor()
    
    # 注册错误处理器
    def weather_api_error_handler(error, tool_call):
        """天气API错误处理"""
        print(f"天气API调用失败,使用缓存数据")
        return "北京天气: 晴,25°C (缓存数据)"
    
    executor.register_error_handler("ConnectionError", weather_api_error_handler)
    
    # 执行工具调用
    tool_call = {
        "tool": "get_weather",
        "arguments": {"location": "北京"}
    }
    
    result = executor.execute(tool_call)
    print(f"执行结果: {result}")
```

### 2.3 多函数调用调度队列

```python
import asyncio
from queue import Queue
from concurrent.futures import ThreadPoolExecutor

class ToolCallScheduler:
    """工具调用调度器"""
    
    def __init__(self, max_workers: int = 5):
        self.max_workers = max_workers
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        self.call_queue = Queue()
        self.results = {}
        
    def submit_calls(self, tool_calls: List[Dict]) -> List[str]:
        """
        提交多个工具调用
        
        Returns:
            调用ID列表
        """
        call_ids = []
        
        for tool_call in tool_calls:
            call_id = f"call_{len(self.results) + 1}"
            self.call_queue.put((call_id, tool_call))
            call_ids.append(call_id)
        
        # 执行所有调用
        self._process_queue()
        
        return call_ids
    
    def _process_queue(self):
        """处理调用队列"""
        futures = []
        
        while not self.call_queue.empty():
            call_id, tool_call = self.call_queue.get()
            
            future = self.executor.submit(
                self._execute_single, call_id, tool_call
            )
            futures.append(future)
        
        # 等待所有完成
        for future in futures:
            future.result()
    
    def _execute_single(self, call_id: str, tool_call: Dict):
        """执行单个调用"""
        try:
            executor = ToolCallExecutor()
            result = executor.execute(tool_call)
            self.results[call_id] = result
        except Exception as e:
            self.results[call_id] = {
                "success": False,
                "result": None,
                "error": str(e)
            }
    
    def get_result(self, call_id: str) -> Optional[Dict]:
        """获取调用结果"""
        return self.results.get(call_id)
    
    def get_all_results(self) -> Dict:
        """获取所有结果"""
        return self.results.copy()

# 异步版本
class AsyncToolCallScheduler:
    """异步工具调用调度器"""
    
    def __init__(self):
        self.semaphore = asyncio.Semaphore(5)  # 最多5个并发
        
    async def execute_calls(self, tool_calls: List[Dict]) -> List[Dict]:
        """
        并发执行多个工具调用
        
        Args:
            tool_calls: 工具调用列表
            
        Returns:
            结果列表
        """
        tasks = [
            self._execute_with_semaphore(tc)
            for tc in tool_calls
        ]
        
        return await asyncio.gather(*tasks)
    
    async def _execute_with_semaphore(self, tool_call: Dict) -> Dict:
        """带信号量限制的执行"""
        async with self.semaphore:
            return await self._execute_single(tool_call)
    
    async def _execute_single(self, tool_call: Dict) -> Dict:
        """执行单个调用"""
        # 模拟异步执行
        await asyncio.sleep(0.1)
        
        executor = ToolCallExecutor()
        return executor.execute(tool_call)

# 使用示例
async def demo_async_scheduling():
    """演示异步调度"""
    
    scheduler = AsyncToolCallScheduler()
    
    tool_calls = [
        {"tool": "get_weather", "arguments": {"location": "北京"}},
        {"tool": "get_weather", "arguments": {"location": "上海"}},
        {"tool": "get_weather", "arguments": {"location": "广州"}},
    ]
    
    results = await scheduler.execute_calls(tool_calls)
    
    for i, result in enumerate(results):
        print(f"调用 {i+1}: {result}")
```

## 三、多智能体协同对话系统

### 3.1 基于角色的智能体定义

```python
class Role:
    """角色定义"""
    
    def __init__(self, name: str, description: str, skills: List[str], 
                 personality: str = ""):
        self.name = name
        self.description = description
        self.skills = skills
        self.personality = personality
    
    def to_prompt(self) -> str:
        """生成角色提示"""
        prompt = f"你是{self.name}。\n"
        prompt += f"{self.description}\n\n"
        
        if self.personality:
            prompt += f"性格特点: {self.personality}\n\n"
        
        prompt += f"你的技能: {', '.join(self.skills)}\n"
        
        return prompt

class RoleBasedAgent(BaseAgent):
    """基于角色的Agent"""
    
    def __init__(self, role: Role):
        super().__init__(role.name, role.description)
        self.role = role
        
    def chat(self, messages: List[Message]) -> AgentResponse:
        """基于角色的对话"""
        # 构建系统提示
        system_prompt = self.role.to_prompt()
        
        # 实际实现中调用LLM
        # 这里简化处理
        last_message = messages[-1]
        
        return AgentResponse(
            content=f"[{self.role.name}] 收到你的问题: {last_message.content}",
            tool_calls=[],
            finish_reason="stop"
        )

# 使用示例
def demo_role_based_agents():
    """演示基于角色的Agent"""
    
    # 定义角色
    researcher = Role(
        name="研究员",
        description="你是一位专业的研究助理,擅长信息检索和分析。",
        skills=["信息检索", "数据分析", "文献综述"],
        personality="严谨、细致、逻辑性强"
    )
    
    writer = Role(
        name="作家",
        description="你是一位 creative writer,擅长文字创作。",
        skills["创意写作", "文案策划", "内容编辑"],
        personality="富有想象力、表达生动"
    )
    
    # 创建Agent
    researcher_agent = RoleBasedAgent(researcher)
    writer_agent = RoleBasedAgent(writer)
    
    # 对话
    messages = [Message(role="user", content="帮我研究一下AI发展趋势")]
    response = researcher_agent.chat(messages)
    print(response.content)
```

### 3.2 多Agent协作架构

```python
class MultiAgentSystem:
    """多智能体系统"""
    
    def __init__(self):
        self.agents = {}
        self.coordinator = None
        
    def add_agent(self, agent: BaseAgent):
        """添加Agent"""
        self.agents[agent.name] = agent
        
    def set_coordinator(self, coordinator: BaseAgent):
        """设置协调Agent"""
        self.coordinator = coordinator
    
    def execute_task(self, task: str) -> str:
        """
        执行任务(多Agent协作)
        
        Args:
            task: 任务描述
            
        Returns:
            最终结果
        """
        # 1. 协调Agent分解任务
        if self.coordinator:
            subtasks = self._decompose_task(task)
        else:
            subtasks = [{"agent": list(self.agents.keys())[0], "task": task}]
        
        # 2. 分配给相应Agent执行
        results = {}
        for subtask in subtasks:
            agent_name = subtask["agent"]
            agent_task = subtask["task"]
            
            if agent_name in self.agents:
                agent = self.agents[agent_name]
                messages = [Message(role="user", content=agent_task)]
                response = agent.chat(messages)
                results[agent_name] = response.content
        
        # 3. 整合结果
        final_result = self._integrate_results(results)
        
        return final_result
    
    def _decompose_task(self, task: str) -> List[Dict]:
        """分解任务(简化实现)"""
        # 实际应该调用LLM进行任务分解
        return [
            {"agent": "研究员", "task": f"研究: {task}"},
            {"agent": "作家", "task": f"撰写报告: {task}"}
        ]
    
    def _integrate_results(self, results: Dict) -> str:
        """整合结果"""
        integrated = "任务执行结果:\n\n"
        
        for agent_name, result in results.items():
            integrated += f"【{agent_name}】\n{result}\n\n"
        
        return integrated

# 使用示例
def demo_multi_agent():
    """演示多Agent协作"""
    
    # 创建多Agent系统
    system = MultiAgentSystem()
    
    # 添加Agent
    system.add_agent(RoleBasedAgent(Role(
        name="研究员",
        description="研究助理",
        skills=["信息检索", "数据分析"]
    )))
    
    system.add_agent(RoleBasedAgent(Role(
        name="作家",
        description="内容创作者",
        skills=["写作", "编辑"]
    )))
    
    # 设置协调者
    system.set_coordinator(RoleBasedAgent(Role(
        name="项目经理",
        description="任务协调者",
        skills=["任务分解", "进度管理"]
    )))
    
    # 执行任务
    result = system.execute_task("撰写一份AI发展报告")
    print(result)
```

### 3.3 任务分解与中央调度

```python
class TaskDecomposer:
    """任务分解器"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
    
    def decompose(self, task: str, available_agents: List[str]) -> List[Dict]:
        """
        分解任务
        
        Args:
            task: 原始任务
            available_agents: 可用Agent列表
            
        Returns:
            子任务列表
        """
        prompt = f"""请将以下任务分解为多个子任务,并分配给合适的Agent:

任务: {task}

可用Agent: {', '.join(available_agents)}

请以JSON格式输出:
[
  {{
    "subtask": "子任务描述",
    "agent": "负责的Agent",
    "dependencies": ["依赖的子任务ID"]
  }}
]"""
        
        # 调用LLM
        response = self.llm.generate(prompt)
        subtasks = json.loads(response)
        
        return subtasks

class CentralScheduler:
    """中央调度器"""
    
    def __init__(self):
        self.task_graph = {}
        self.completed_tasks = set()
        self.results = {}
        
    def schedule(self, subtasks: List[Dict]):
        """
        调度任务
        
        Args:
            subtasks: 子任务列表
        """
        # 构建任务图
        for i, subtask in enumerate(subtasks):
            task_id = f"task_{i}"
            self.task_graph[task_id] = {
                "subtask": subtask["subtask"],
                "agent": subtask["agent"],
                "dependencies": subtask.get("dependencies", []),
                "status": "pending"
            }
    
    def execute_all(self, agents: Dict[str, BaseAgent]):
        """执行所有任务"""
        # 拓扑排序执行
        while len(self.completed_tasks) < len(self.task_graph):
            # 找出可以执行的任务(依赖都已满足)
            ready_tasks = []
            
            for task_id, task_info in self.task_graph.items():
                if task_id in self.completed_tasks:
                    continue
                
                # 检查依赖
                dependencies_met = all(
                    dep in self.completed_tasks
                    for dep in task_info["dependencies"]
                )
                
                if dependencies_met:
                    ready_tasks.append(task_id)
            
            # 执行就绪任务
            for task_id in ready_tasks:
                self._execute_task(task_id, agents)
                self.completed_tasks.add(task_id)
    
    def _execute_task(self, task_id: str, agents: Dict[str, BaseAgent]):
        """执行单个任务"""
        task_info = self.task_graph[task_id]
        agent_name = task_info["agent"]
        
        if agent_name not in agents:
            raise ValueError(f"Agent {agent_name} not found")
        
        # 收集依赖结果
        context = ""
        for dep_id in task_info["dependencies"]:
            context += f"【{dep_id}结果】\n{self.results[dep_id]}\n\n"
        
        # 执行任务
        agent = agents[agent_name]
        messages = [Message(role="user", content=task_info["subtask"])]
        response = agent.chat(messages)
        
        self.results[task_id] = response.content
        task_info["status"] = "completed"
```

## 四、实战案例:构建智能客服系统

```python
class CustomerServiceAgent:
    """智能客服Agent"""
    
    def __init__(self):
        # 注册工具
        self.tools = {
            "query_order": self.query_order,
            "process_refund": self.process_refund,
            "escalate_to_human": self.escalate_to_human
        }
        
        # 状态机
        self.state = "greeting"
        self.context = {}
        
    def query_order(self, order_id: str) -> Dict:
        """查询订单"""
        # 模拟查询
        return {
            "order_id": order_id,
            "status": "已发货",
            "tracking": "SF1234567890"
        }
    
    def process_refund(self, order_id: str, reason: str) -> Dict:
        """处理退款"""
        return {
            "success": True,
            "refund_id": f"REF_{order_id}",
            "amount": 100.0
        }
    
    def escalate_to_human(self, reason: str) -> Dict:
        """转人工"""
        return {
            "success": True,
            "ticket_id": "TKT12345",
            "estimated_wait": "5分钟"
        }
    
    def handle_request(self, user_input: str) -> str:
        """处理用户请求"""
        # 简单的意图识别
        if "订单" in user_input or "order" in user_input.lower():
            return self._handle_order_query(user_input)
        elif "退款" in user_input or "refund" in user_input.lower():
            return self._handle_refund(user_input)
        elif "人工" in user_input or "投诉" in user_input:
            return self._escalate(user_input)
        else:
            return "您好!请问有什么可以帮助您的?您可以查询订单、申请退款或转人工服务。"
    
    def _handle_order_query(self, user_input: str) -> str:
        """处理订单查询"""
        # 提取订单号(简化实现)
        order_id = "ORD123456"  # 实际应该用正则表达式提取
        
        result = self.tools["query_order"](order_id)
        
        return f"您的订单 {order_id} 状态为: {result['status']}\n" \
               f"物流单号: {result['tracking']}"
    
    def _handle_refund(self, user_input: str) -> str:
        """处理退款"""
        order_id = "ORD123456"
        reason = "商品质量问题"
        
        result = self.tools["process_refund"](order_id, reason)
        
        if result["success"]:
            return f"退款申请已提交!\n" \
                   f"退款单号: {result['refund_id']}\n" \
                   f"退款金额: ¥{result['amount']}"
        else:
            return "抱歉,退款申请失败,请稍后重试或转人工服务。"
    
    def _escalate(self, user_input: str) -> str:
        """转人工"""
        result = self.tools["escalate_to_human"](user_input)
        
        return f"已为您转接人工客服!\n" \
               f"工单号: {result['ticket_id']}\n" \
               f"预计等待时间: {result['estimated_wait']}"

# 使用示例
def demo_customer_service():
    """演示智能客服"""
    
    agent = CustomerServiceAgent()
    
    # 测试不同场景
    test_cases = [
        "你好",
        "查询订单ORD123456",
        "我要退款",
        "我要投诉,转人工"
    ]
    
    for user_input in test_cases:
        print(f"用户: {user_input}")
        print(f"客服: {agent.handle_request(user_input)}\n")
```

## 五、总结与延伸

### 核心要点回顾

1. **系统架构**: 感知-规划-记忆-执行-响应的模块化设计
2. **工具调用**: 标准化的Function Calling协议与错误处理
3. **多Agent协同**: 角色定义、任务分解、中央调度
4. **性能优化**: 异步执行、并发调度、重试机制
5. **实战应用**: 智能客服、研究助手、代码助手等场景

### 与其他章节的关联

- **第1章**: 模型架构 → MoE架构支持多Agent高效运行
- **第2章**: 数据对齐 → 工具调用数据提升Agent能力
- **第4章**: 推理部署 → 优化Agent响应速度
- **第8章**: 对话系统 → Agent是对话系统的高级形态
- **第10-11章**: 实战案例 → Agent在企业场景中的应用

### 进一步学习资源

1. **框架工具**:
   - LangChain: https://langchain.com
   - AutoGen(Microsoft多Agent框架)
   - CrewAI
   
2. **相关论文**:
   - ReAct: Synergizing Reasoning and Acting
   - Toolformer: Language Models Can Teach Themselves to Use Tools
   
3. **实践项目**:
   - OpenAI Function Calling
   - Anthropic Tool Use

---

**版权声明**: 本文基于《通义千问:大模型架构与智能体开发实战》第3章进行原创技术解读,所有代码示例和解读均为作者独立完成,仅供参考学习使用。

**下一篇预告**: [第4章 模型推理加速与高效部署](#) — 深入探讨模型量化、编译优化、分布式推理等部署加速技术。
