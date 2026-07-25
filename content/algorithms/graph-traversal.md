---
title: "图的遍历"
date: "2024-11-14"
tags: ["图算法", "算法", "BFS", "DFS", "进阶"]
category: "算法"
difficulty: "进阶"
excerpt: "掌握图的两种核心遍历方式：广度优先搜索(BFS)和深度优先搜索(DFS)"
visualgoUrl: "https://visualgo.net/zh/dfsbfs"
---

## 概述

图的遍历是图论中最基础也是最重要的操作之一。它是指从图中某一顶点出发，按照某种搜索策略，系统地访问图中所有顶点且每个顶点仅被访问一次的过程。

图的遍历主要有两种方式：
- **广度优先搜索（BFS, Breadth-First Search）**：从起始节点开始，先访问所有邻居节点，再逐层向外扩展
- **深度优先搜索（DFS, Depth-First Search）**：从起始节点开始，沿着一条路径尽可能深入，直到无法继续再回溯

这两种遍历方式在路径搜索、连通性检测、拓扑排序、最短路径等问题中有广泛应用。

## 核心原理

### 广度优先搜索（BFS）

BFS 使用**队列（Queue）**作为辅助数据结构，遵循"先进先出"的原则：

1. 将起始节点放入队列并标记为已访问
2. 从队列中取出一个节点，访问它的所有未被访问的邻居
3. 将这些邻居节点放入队列并标记为已访问
4. 重复步骤 2-3，直到队列为空

BFS 的关键特性：
- 按层级遍历，先近后远
- 可以找到**无权图的最短路径**
- 时间复杂度 O(V + E)，空间复杂度 O(V)

### 深度优先搜索（DFS）

DFS 使用**栈（Stack）**或**递归**实现，遵循"后进先出"的原则：

1. 将起始节点压入栈（或调用递归函数）并标记为已访问
2. 查看栈顶节点的未访问邻居，如果有，将其压入栈并标记为已访问
3. 如果栈顶节点没有未访问的邻居，则弹出该节点（回溯）
4. 重复步骤 2-3，直到栈为空

DFS 的关键特性：
- 沿着路径深入探索
- 适合检测环、连通分量、拓扑排序
- 时间复杂度 O(V + E)，空间复杂度 O(V)

## 执行步骤

### 示例图结构（6个节点的无向图）

```
邻接表表示：
0: [1, 2]
1: [0, 3, 4]
2: [0, 4]
3: [1, 5]
4: [1, 2, 5]
5: [3, 4]

图的形状：
    0
   / \
  1   2
 / \ / 
3   4
 \ /
  5
```

### BFS 遍历过程（从节点 0 开始）

```
步骤1: 队列=[0], 已访问={0}
        访问节点 0，将邻居 1, 2 入队

步骤2: 队列=[1, 2], 已访问={0, 1, 2}
        访问节点 1，将邻居 3, 4 入队

步骤3: 队列=[2, 3, 4], 已访问={0, 1, 2, 3, 4}
        访问节点 2，邻居 4 已访问，无新节点入队

步骤4: 队列=[3, 4], 已访问={0, 1, 2, 3, 4}
        访问节点 3，将邻居 5 入队

步骤5: 队列=[4, 5], 已访问={0, 1, 2, 3, 4, 5}
        访问节点 4，邻居均已访问

步骤6: 队列=[5], 已访问={0, 1, 2, 3, 4, 5}
        访问节点 5，邻居均已访问

BFS 遍历顺序: 0 → 1 → 2 → 3 → 4 → 5
```

### DFS 遍历过程（从节点 0 开始，递归方式）

```
步骤1: 访问 0，递归进入邻居 1
步骤2: 访问 1，递归进入邻居 3
步骤3: 访问 3，递归进入邻居 5
步骤4: 访问 5，递归进入邻居 4
步骤5: 访问 4，递归进入邻居 2
步骤6: 访问 2，所有邻居已访问，回溯

DFS 遍历顺序: 0 → 1 → 3 → 5 → 4 → 2
```

## 代码实现

```java
import java.util.*;

public class GraphTraversal {
    private int vertices;
    private List<List<Integer>> adjList;

    public GraphTraversal(int vertices) {
        this.vertices = vertices;
        adjList = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            adjList.add(new ArrayList<>());
        }
    }

    public void addEdge(int u, int v) {
        adjList.get(u).add(v);
        adjList.get(v).add(u);
    }

    // BFS 广度优先搜索
    public List<Integer> bfs(int start) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[vertices];
        Queue<Integer> queue = new LinkedList<>();

        visited[start] = true;
        queue.offer(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);

            for (int neighbor : adjList.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }
        return result;
    }

    // DFS 深度优先搜索（递归）
    public List<Integer> dfs(int start) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[vertices];
        dfsHelper(start, visited, result);
        return result;
    }

    private void dfsHelper(int node, boolean[] visited, List<Integer> result) {
        visited[node] = true;
        result.add(node);
        for (int neighbor : adjList.get(node)) {
            if (!visited[neighbor]) {
                dfsHelper(neighbor, visited, result);
            }
        }
    }

    // DFS 迭代版本（使用栈）
    public List<Integer> dfsIterative(int start) {
        List<Integer> result = new ArrayList<>();
        boolean[] visited = new boolean[vertices];
        Deque<Integer> stack = new ArrayDeque<>();

        stack.push(start);
        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (!visited[node]) {
                visited[node] = true;
                result.add(node);
                List<Integer> neighbors = adjList.get(node);
                for (int i = neighbors.size() - 1; i >= 0; i--) {
                    if (!visited[neighbors.get(i)]) {
                        stack.push(neighbors.get(i));
                    }
                }
            }
        }
        return result;
    }

    // BFS 求最短路径（无权图）
    public int shortestPath(int start, int end) {
        boolean[] visited = new boolean[vertices];
        Queue<int[]> queue = new LinkedList<>(); // [node, distance]

        visited[start] = true;
        queue.offer(new int[]{start, 0});

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            if (current[0] == end) return current[1];

            for (int neighbor : adjList.get(current[0])) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(new int[]{neighbor, current[1] + 1});
                }
            }
        }
        return -1; // 不可达
    }

    public static void main(String[] args) {
        GraphTraversal g = new GraphTraversal(6);
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        g.addEdge(1, 4);
        g.addEdge(2, 4);
        g.addEdge(3, 5);
        g.addEdge(4, 5);

        System.out.println("BFS: " + g.bfs(0));
        System.out.println("DFS: " + g.dfs(0));
        System.out.println("最短路径(0→5): " + g.shortestPath(0, 5));
    }
}
```

```python
from collections import deque
from typing import List, Dict, Set

class GraphTraversal:
    def __init__(self, vertices: int):
        self.vertices = vertices
        self.adj_list: Dict[int, List[int]] = {i: [] for i in range(vertices)}

    def add_edge(self, u: int, v: int):
        self.adj_list[u].append(v)
        self.adj_list[v].append(u)

    def bfs(self, start: int) -> List[int]:
        """广度优先搜索"""
        result = []
        visited: Set[int] = {start}
        queue = deque([start])

        while queue:
            node = queue.popleft()
            result.append(node)

            for neighbor in self.adj_list[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        return result

    def dfs(self, start: int) -> List[int]:
        """深度优先搜索（递归）"""
        result = []
        visited: Set[int] = set()

        def dfs_helper(node: int):
            visited.add(node)
            result.append(node)
            for neighbor in self.adj_list[node]:
                if neighbor not in visited:
                    dfs_helper(neighbor)

        dfs_helper(start)
        return result

    def dfs_iterative(self, start: int) -> List[int]:
        """深度优先搜索（迭代，使用栈）"""
        result = []
        visited: Set[int] = set()
        stack = [start]

        while stack:
            node = stack.pop()
            if node not in visited:
                visited.add(node)
                result.append(node)
                for neighbor in reversed(self.adj_list[node]):
                    if neighbor not in visited:
                        stack.append(neighbor)
        return result

    def shortest_path(self, start: int, end: int) -> int:
        """BFS 求最短路径（无权图）"""
        visited = {start}
        queue = deque([(start, 0)])

        while queue:
            node, dist = queue.popleft()
            if node == end:
                return dist
            for neighbor in self.adj_list[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, dist + 1))
        return -1


if __name__ == "__main__":
    g = GraphTraversal(6)
    g.add_edge(0, 1)
    g.add_edge(0, 2)
    g.add_edge(1, 3)
    g.add_edge(1, 4)
    g.add_edge(2, 4)
    g.add_edge(3, 5)
    g.add_edge(4, 5)

    print(f"BFS: {g.bfs(0)}")
    print(f"DFS: {g.dfs(0)}")
    print(f"最短路径(0→5): {g.shortest_path(0, 5)}")
```

## 复杂度分析

| 算法 | 时间复杂度 | 空间复杂度 | 说明 |
|------|-----------|-----------|------|
| BFS  | O(V + E)  | O(V)      | V为顶点数，E为边数 |
| DFS（递归） | O(V + E) | O(V) | 递归栈深度最坏为V |
| DFS（迭代） | O(V + E) | O(V) | 显式栈替代递归 |

- 邻接表存储时，BFS 和 DFS 的时间复杂度都是 O(V + E)
- 邻接矩阵存储时，时间复杂度为 O(V²)
- 空间复杂度主要由 visited 数组和队列/栈决定

## 实际应用

### 工程应用

1. **社交网络**：BFS 求两个用户之间的最短关系链（六度分隔理论）
2. **网络爬虫**：BFS 逐层爬取网页链接
3. **垃圾回收**：DFS/BFS 标记可达对象（标记-清除算法）
4. **路由算法**：OSPF 协议中使用 BFS 计算最短路径
5. **编译器**：DFS 进行拓扑排序处理依赖关系
6. **文件系统**：DFS 递归遍历目录树

### 竞赛应用

1. **连通分量计算**：DFS 标记同一分量内的节点
2. **二分图检测**：BFS 交替染色
3. **拓扑排序**：DFS 后序的逆序
4. **环检测**：DFS 中检查是否存在回边
5. **最短路径（无权图）**：BFS 的天然特性

## 变体与扩展

### 1. 双向 BFS

从起点和终点同时进行 BFS，在中间相遇时终止。适用于起点和终点都已知的最短路径问题，可以将搜索空间从 O(b^d) 降低到 O(b^(d/2))。

### 2. 迭代加深搜索（IDDFS）

结合 BFS 的最优性和 DFS 的空间优势，从深度限制 1 开始逐步增加深度限制进行 DFS。空间复杂度为 O(bd)，同时保证找到最短路径。

### 3. A* 搜索

在 BFS 的基础上引入启发函数，使用优先队列代替普通队列，优先扩展"最有希望"的节点，常用于路径规划。

### 4. 多源 BFS

从多个起始点同时进行 BFS，用于计算每个点到最近源点的距离，如"地图中每个位置到最近设施的距离"。
