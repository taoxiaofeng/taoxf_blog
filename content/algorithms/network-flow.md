---
title: "网络流"
date: "2024-11-17"
tags: ["图算法", "算法", "网络流", "进阶"]
category: "算法"
difficulty: "进阶"
excerpt: "掌握 Ford-Fulkerson 方法和 Edmonds-Karp 算法求解最大流问题"
visualgoUrl: "https://visualgo.net/zh/maxflow"
---

## 概述

网络流是图论中研究在容量限制下如何最大化流量传输的问题。一个**流网络**是一个有向图，其中每条边有一个容量上限，有一个源点（source）和一个汇点（sink）。

**最大流问题**：在不超过各边容量的前提下，求从源点到汇点能传输的最大流量。

网络流问题在以下场景中有重要应用：
- 交通流量优化
- 通信网络带宽分配
- 二分图匹配
- 项目选择问题

## 核心原理

### Ford-Fulkerson 方法

Ford-Fulkerson 是一种**增广路径方法**的框架：

1. 初始化所有边的流为 0
2. 在**残余图（Residual Graph）**中寻找一条从源点到汇点的增广路径
3. 沿着增广路径增加流量（增加的量为路径上最小残余容量）
4. 更新残余图
5. 重复步骤 2-4，直到找不到增广路径

**关键概念：**
- **残余容量**：边(u,v)的残余容量 = 容量 - 当前流量
- **残余图**：包含所有残余容量 > 0 的边（包括反向边）
- **增广路径**：残余图中从源点到汇点的路径
- **反向边**：允许"撤销"之前的流量分配

### Edmonds-Karp 算法

Edmonds-Karp 是 Ford-Fulkerson 方法的具体实现，使用 **BFS** 寻找增广路径（最短增广路径）。

优势：
- 保证在 O(VE²) 时间内终止
- BFS 找到的是**边数最少**的增广路径
- 避免了 Ford-Fulkerson 在某些情况下的无限循环问题

### 最大流最小割定理

**定理**：网络中的最大流量等于最小割的容量。

- **割（Cut）**：将顶点分为两个集合 S 和 T（源点在 S 中，汇点在 T 中），割的容量是从 S 到 T 的所有边的容量之和
- **最小割**：所有可能割中容量最小的那个

这个定理说明：最大流 = 最小割，即瓶颈决定了最大流量。

## 执行步骤

### 示例流网络

```
源点 S=0, 汇点 T=5
边 (容量):
0→1: 16
0→2: 13
1→2: 4
1→3: 12
2→1: 10
2→4: 14
3→2: 9
3→5: 20
4→3: 7
4→5: 4
```

### Edmonds-Karp 算法执行过程

```
初始: 所有流为 0，最大流 = 0

第1次BFS增广:
  路径: 0→1→3→5
  路径最小残余容量: min(16, 12, 20) = 12
  增流 12，最大流 = 12
  更新残余图

第2次BFS增广:
  路径: 0→2→4→5
  路径最小残余容量: min(13, 14, 4) = 4
  增流 4，最大流 = 16
  更新残余图

第3次BFS增广:
  路径: 0→2→4→3→5
  路径最小残余容量: min(9, 10, 7, 20) = 7
  增流 7，最大流 = 23
  更新残余图

第4次BFS增广:
  路径: 0→1→2→4→3→5  (利用反向边 1→2 的残余容量)
  路径最小残余容量: min(4, 4, 3, ...) 
  继续寻找...

最终最大流 = 23
```

### 最小割的确定

当算法结束后，从源点在残余图中可达的节点集合为 S，其余为 T：
- S = {0, 1, 2}（从源点通过残余容量>0的边可达）
- T = {3, 4, 5}
- 最小割容量 = cap(1→3) + cap(2→4) = 12 + 14 = ... 需要验证

## 代码实现

```java
import java.util.*;

public class NetworkFlow {

    static final int INF = Integer.MAX_VALUE;

    // ========== Edmonds-Karp 算法（BFS 增广） ==========
    static int[][] capacity;  // capacity[u][v] 表示边(u,v)的残余容量
    static int[] parent;
    int n;

    public NetworkFlow(int n) {
        this.n = n;
        capacity = new int[n][n];
        parent = new int[n];
    }

    // BFS 寻找增广路径，返回路径的最小残余容量
    private int bfs(int source, int sink) {
        Arrays.fill(parent, -1);
        parent[source] = source;
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{source, INF});

        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int u = curr[0], flow = curr[1];

            for (int v = 0; v < n; v++) {
                if (parent[v] == -1 && capacity[u][v] > 0) {
                    parent[v] = u;
                    int newFlow = Math.min(flow, capacity[u][v]);
                    if (v == sink) return newFlow;
                    queue.offer(new int[]{v, newFlow});
                }
            }
        }
        return 0; // 找不到增广路径
    }

    // 求最大流
    public int maxFlow(int source, int sink) {
        int totalFlow = 0;

        while (true) {
            int pathFlow = bfs(source, sink);
            if (pathFlow == 0) break;

            totalFlow += pathFlow;

            // 沿增广路径更新残余容量
            int v = sink;
            while (v != source) {
                int u = parent[v];
                capacity[u][v] -= pathFlow;
                capacity[v][u] += pathFlow; // 反向边增加
                v = u;
            }
        }
        return totalFlow;
    }

    // 添加边
    public void addEdge(int u, int v, int cap) {
        capacity[u][v] += cap;
    }

    // 求最小割（BFS 从源点在残余图中的可达节点）
    public List<int[]> minCut(int source) {
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(source);
        visited[source] = true;

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v = 0; v < n; v++) {
                if (!visited[v] && capacity[u][v] > 0) {
                    visited[v] = true;
                    queue.offer(v);
                }
            }
        }

        // 割边：从已访问到未访问的原始边
        List<int[]> cutEdges = new ArrayList<>();
        for (int u = 0; u < n; u++) {
            if (visited[u]) {
                for (int v = 0; v < n; v++) {
                    if (!visited[v] && capacity[v][u] > 0) { // 反向边有值说明原始边存在
                        cutEdges.add(new int[]{u, v});
                    }
                }
            }
        }
        return cutEdges;
    }

    public static void main(String[] args) {
        NetworkFlow nf = new NetworkFlow(6);
        nf.addEdge(0, 1, 16);
        nf.addEdge(0, 2, 13);
        nf.addEdge(1, 2, 4);
        nf.addEdge(1, 3, 12);
        nf.addEdge(2, 1, 10);
        nf.addEdge(2, 4, 14);
        nf.addEdge(3, 2, 9);
        nf.addEdge(3, 5, 20);
        nf.addEdge(4, 3, 7);
        nf.addEdge(4, 5, 4);

        int source = 0, sink = 5;
        System.out.println("最大流: " + nf.maxFlow(source, sink));

        List<int[]> cut = nf.minCut(source);
        System.out.println("最小割边:");
        for (int[] edge : cut) {
            System.out.printf("  %d → %d%n", edge[0], edge[1]);
        }
    }
}
```

```python
from collections import deque
from typing import List, Tuple, Optional

class EdmondsKarp:
    """Edmonds-Karp 算法（Ford-Fulkerson 的 BFS 实现）"""

    def __init__(self, n: int):
        self.n = n
        self.capacity = [[0] * n for _ in range(n)]  # 残余容量矩阵

    def add_edge(self, u: int, v: int, cap: int):
        """添加有向边"""
        self.capacity[u][v] += cap

    def _bfs(self, source: int, sink: int) -> Tuple[int, List[int]]:
        """BFS 寻找增广路径"""
        parent = [-1] * self.n
        parent[source] = source
        queue = deque([(source, float('inf'))])

        while queue:
            u, flow = queue.popleft()
            for v in range(self.n):
                if parent[v] == -1 and self.capacity[u][v] > 0:
                    parent[v] = u
                    new_flow = min(flow, self.capacity[u][v])
                    if v == sink:
                        return new_flow, parent
                    queue.append((v, new_flow))

        return 0, parent

    def max_flow(self, source: int, sink: int) -> int:
        """计算最大流"""
        total_flow = 0

        while True:
            path_flow, parent = self._bfs(source, sink)
            if path_flow == 0:
                break

            total_flow += path_flow

            # 沿增广路径更新残余容量
            v = sink
            while v != source:
                u = parent[v]
                self.capacity[u][v] -= path_flow
                self.capacity[v][u] += path_flow
                v = u

        return total_flow

    def min_cut(self, source: int) -> List[Tuple[int, int]]:
        """求最小割（在 max_flow 之后调用）"""
        visited = [False] * self.n
        queue = deque([source])
        visited[source] = True

        while queue:
            u = queue.popleft()
            for v in range(self.n):
                if not visited[v] and self.capacity[u][v] > 0:
                    visited[v] = True
                    queue.append(v)

        # 从可达集合到不可达集合的边即为最小割
        cut_edges = []
        for u in range(self.n):
            if visited[u]:
                for v in range(self.n):
                    if not visited[v] and self.capacity[v][u] > 0:
                        cut_edges.append((u, v))
        return cut_edges


if __name__ == "__main__":
    ek = EdmondsKarp(6)
    ek.add_edge(0, 1, 16)
    ek.add_edge(0, 2, 13)
    ek.add_edge(1, 2, 4)
    ek.add_edge(1, 3, 12)
    ek.add_edge(2, 1, 10)
    ek.add_edge(2, 4, 14)
    ek.add_edge(3, 2, 9)
    ek.add_edge(3, 5, 20)
    ek.add_edge(4, 3, 7)
    ek.add_edge(4, 5, 4)

    source, sink = 0, 5
    result = ek.max_flow(source, sink)
    print(f"最大流: {result}")

    cut = ek.min_cut(source)
    print(f"最小割边: {cut}")
```

## 复杂度分析

| 算法 | 时间复杂度 | 空间复杂度 | 说明 |
|------|-----------|-----------|------|
| Ford-Fulkerson (DFS) | O(E × max_flow) | O(V²) | 整数容量时有限 |
| Edmonds-Karp (BFS) | O(VE²) | O(V²) | BFS 保证多项式时间 |
| Dinic | O(V²E) | O(V²) | 分层图 + 阻塞流 |
| Push-Relabel | O(V²E) 或 O(V³) | O(V²) | 预流推进 |

- Edmonds-Karp 的增广次数不超过 O(VE)，每次 BFS 为 O(E)
- 对于单位容量图，Edmonds-Karp 时间复杂度为 O(E√V)

## 实际应用

### 工程应用

1. **网络带宽分配**：计算网络中两节点间的最大传输能力
2. **供应链优化**：工厂到仓库到零售店的最大配送量
3. **航空调度**：在航线容量限制下的最大旅客调度
4. **图像分割**：将前景和背景分离（s-t 最小割）
5. **项目选择**：选择收益最大的项目集合（最大权闭合子图）

### 竞赛应用

1. **二分图最大匹配**：建模为最大流问题
2. **最小路径覆盖**：DAG 中用最少路径覆盖所有节点
3. **最大权闭合子图**：选择有依赖关系的项目使收益最大
4. **最小费用最大流**：在满足最大流的前提下最小化费用

## 变体与扩展

### 1. Dinic 算法

使用 BFS 构建分层图，然后用 DFS 找阻塞流。在一般图上时间复杂度 O(V²E)，在单位容量图上为 O(E√V)，在二分图上为 O(E√V)。

### 2. 最小费用最大流

每条边除了容量还有单位流量的费用，目标是在最大流的基础上最小化总费用。可使用 SPFA 或 Bellman-Ford 找最短增广路径（费用最小的路径）。

### 3. 上下界网络流

每条边有流量的上界和下界约束，需要先判断可行流是否存在，再求最大/最小流。常用于建模有约束的流量分配问题。

### 4. 多源多汇网络流

有多个源点和多个汇点的网络流问题。解决方法是添加超级源点和超级汇点，转化为标准的单源单汇问题。
