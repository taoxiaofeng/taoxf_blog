---
title: "栈与队列"
date: "2024-11-09"
tags: ["数据结构", "算法", "基础"]
category: "算法"
difficulty: "基础"
excerpt: "栈和队列是两种基于线性表的受限数据结构，分别遵循后进先出和先进先出原则"
visualgoUrl: "https://visualgo.net/zh/list"
---

## 概述

栈（Stack）和队列（Queue）是两种最基本的受限线性数据结构。它们都是在线性表的基础上，对插入和删除操作的位置加以限制而形成的。

- **栈**：只允许在一端（栈顶）进行插入和删除操作，遵循**后进先出**（LIFO, Last In First Out）原则
- **队列**：只允许在一端（队尾）插入，在另一端（队头）删除，遵循**先进先出**（FIFO, First In First Out）原则

这两种数据结构在计算机科学中有着极其广泛的应用，从函数调用栈到消息队列，无处不在。

## 基本原理

### 栈（Stack）

栈可以用数组或链表实现：
- **数组实现**：用一个变量 top 记录栈顶位置，push 时 top++，pop 时 top--
- **链表实现**：将链表头部作为栈顶，头插法即 push，删除头节点即 pop

栈的核心操作：
- `push(item)`：将元素压入栈顶
- `pop()`：弹出并返回栈顶元素
- `peek()`/`top()`：查看栈顶元素但不弹出
- `isEmpty()`：判断栈是否为空

### 队列（Queue）

队列可以用数组（循环数组）或链表实现：
- **数组实现（循环队列）**：用 front 和 rear 两个指针，通过取模运算实现循环
- **链表实现**：在链表尾部入队，在链表头部出队

队列的核心操作：
- `enqueue(item)`：将元素加入队尾
- `dequeue()`：移除并返回队头元素
- `front()`/`peek()`：查看队头元素但不移除
- `isEmpty()`：判断队列是否为空

## 核心操作

### 栈操作详解

**Push 操作：**
1. 检查栈是否已满（数组实现时）
2. top 指针加 1
3. 将新元素放在 top 位置

**Pop 操作：**
1. 检查栈是否为空
2. 取出 top 位置的元素
3. top 指针减 1
4. 返回取出的元素

### 队列操作详解

**Enqueue 操作：**
1. 检查队列是否已满
2. 将新元素放在 rear 位置
3. rear = (rear + 1) % capacity

**Dequeue 操作：**
1. 检查队列是否为空
2. 取出 front 位置的元素
3. front = (front + 1) % capacity
4. 返回取出的元素

## 代码实现

### 栈实现

```java
public class Stack<T> {
    private Object[] array;
    private int top;
    private int capacity;

    public Stack(int capacity) {
        this.capacity = capacity;
        this.array = new Object[capacity];
        this.top = -1;
    }

    public void push(T item) {
        if (top == capacity - 1) {
            throw new RuntimeException("栈溢出");
        }
        array[++top] = item;
    }

    @SuppressWarnings("unchecked")
    public T pop() {
        if (isEmpty()) {
            throw new RuntimeException("栈为空");
        }
        T item = (T) array[top];
        array[top--] = null;
        return item;
    }

    @SuppressWarnings("unchecked")
    public T peek() {
        if (isEmpty()) {
            throw new RuntimeException("栈为空");
        }
        return (T) array[top];
    }

    public boolean isEmpty() {
        return top == -1;
    }

    public int size() {
        return top + 1;
    }
}
```

```python
class Stack:
    def __init__(self):
        self._items = []

    def push(self, item):
        """压入栈顶"""
        self._items.append(item)

    def pop(self):
        """弹出栈顶元素"""
        if self.is_empty():
            raise IndexError("栈为空")
        return self._items.pop()

    def peek(self):
        """查看栈顶元素"""
        if self.is_empty():
            raise IndexError("栈为空")
        return self._items[-1]

    def is_empty(self):
        """判断是否为空"""
        return len(self._items) == 0

    def size(self):
        """返回栈的大小"""
        return len(self._items)
```

### 队列实现（循环队列）

```java
public class CircularQueue<T> {
    private Object[] array;
    private int front;
    private int rear;
    private int size;
    private int capacity;

    public CircularQueue(int capacity) {
        this.capacity = capacity;
        this.array = new Object[capacity];
        this.front = 0;
        this.rear = 0;
        this.size = 0;
    }

    public void enqueue(T item) {
        if (size == capacity) {
            throw new RuntimeException("队列已满");
        }
        array[rear] = item;
        rear = (rear + 1) % capacity;
        size++;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (isEmpty()) {
            throw new RuntimeException("队列为空");
        }
        T item = (T) array[front];
        array[front] = null;
        front = (front + 1) % capacity;
        size--;
        return item;
    }

    @SuppressWarnings("unchecked")
    public T front() {
        if (isEmpty()) {
            throw new RuntimeException("队列为空");
        }
        return (T) array[front];
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }
}
```

```python
class CircularQueue:
    def __init__(self, capacity):
        self._items = [None] * capacity
        self._front = 0
        self._rear = 0
        self._size = 0
        self._capacity = capacity

    def enqueue(self, item):
        """入队"""
        if self._size == self._capacity:
            raise OverflowError("队列已满")
        self._items[self._rear] = item
        self._rear = (self._rear + 1) % self._capacity
        self._size += 1

    def dequeue(self):
        """出队"""
        if self.is_empty():
            raise IndexError("队列为空")
        item = self._items[self._front]
        self._items[self._front] = None
        self._front = (self._front + 1) % self._capacity
        self._size -= 1
        return item

    def front(self):
        """查看队头元素"""
        if self.is_empty():
            raise IndexError("队列为空")
        return self._items[self._front]

    def is_empty(self):
        """判断是否为空"""
        return self._size == 0

    def size(self):
        """返回队列大小"""
        return self._size
```

### 应用示例：括号匹配

```java
public class BracketMatcher {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>(s.length());
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }
        return stack.isEmpty();
    }
}
```

```python
def is_valid_brackets(s: str) -> bool:
    """括号匹配验证"""
    stack = []
    mapping = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
    return len(stack) == 0
```

## 复杂度分析

### 栈的复杂度

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| push | O(1) | 直接在栈顶添加 |
| pop | O(1) | 直接移除栈顶 |
| peek | O(1) | 直接访问栈顶 |
| isEmpty | O(1) | 检查 top 指针 |
| search | O(n) | 需要遍历栈 |

### 队列的复杂度

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| enqueue | O(1) | 直接在队尾添加 |
| dequeue | O(1) | 直接移除队头 |
| front | O(1) | 直接访问队头 |
| isEmpty | O(1) | 检查 size |

空间复杂度：两者均为 O(n)，n 为存储的元素数量。

## 适用场景

### 栈的应用

1. **函数调用栈**：操作系统使用栈管理函数调用和返回
2. **表达式求值**：中缀表达式转后缀表达式并求值
3. **括号匹配**：编译器检查括号是否配对
4. **浏览器后退功能**：用栈保存访问历史
5. **撤销操作（Undo）**：编辑器使用栈记录操作历史
6. **DFS（深度优先搜索）**：显式栈替代递归

### 队列的应用

1. **BFS（广度优先搜索）**：层序遍历使用队列
2. **任务调度**：操作系统的进程调度队列
3. **消息队列**：异步通信中的消息缓冲
4. **打印机任务管理**：按照先后顺序打印文件
5. **缓冲区**：生产者-消费者模型中的数据缓冲

## 优缺点分析

### 栈

**优点：**
- 操作简单，所有操作 O(1)
- 天然适合递归问题的非递归实现
- 内存管理高效

**缺点：**
- 只能访问栈顶元素，不支持随机访问
- 固定大小的数组实现可能溢出
- 无法直接遍历中间元素

### 队列

**优点：**
- 保证公平性（先到先服务）
- 所有基本操作 O(1)
- 循环队列有效利用空间

**缺点：**
- 只能访问队头元素
- 简单数组实现存在"假溢出"问题（循环队列可解决）
- 优先级不同的任务需要优先队列替代
