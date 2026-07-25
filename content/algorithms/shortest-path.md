---
title: "最短路径"
date: "2024-11-16"
tags: ["图算法", "算法", "最短路径", "进阶"]
category: "算法"
difficulty: "进阶"
excerpt: "掌握 Dijkstra 和 Bellman-Ford 算法求解加权图的单源最短路径问题"
visualgoUrl: "https://visualgo.net/zh/sssp"
---

## 概述

最短路径问题是图论中的核心问题之一：给定一个加权图，求从源点到其他各顶点的最短路径。

**单源最短路径（SSSP）** 的两种经典算法：
- **Dijkstra 算法**：适用于非负权图，基于贪心策略，时间复杂度 O(E log V)
- **Bellman-Ford 算法**：可处理负权边，能检测负权环，时间复杂度 O(VE)

最短路径广泛应用于导航系统、网络路由、资源调度等场景。

## 核心原理

### Dijkstra 算法

Dijkstra 算法基于**贪心策略**，维护一个已确定最短路径的顶点集合，每次从未确定的顶点中选择距离最小的加入：

1. 初始化：源点距离为 0，其他顶点距离为 ∞
2. 使用优先队列（最小堆）选取当前距离最小的未处理顶点 u
3. 对 u 的所有邻居 v 进行**松弛操作**：若 dist[u] + w(u,v) < dist[v]，则更新 dist[v]
4. 重复步骤 2-3，直到所有顶点都被处理

**限制**：Dijkstra 不能处理负权边，因为贪心策略假设已确定的最短距离不会再被更新。

### Bellman-Ford 算法

Bellman-Ford 算法通过**反复松弛所有边**来逐步逼近最短路径：

1. 初始化：源点距离为 0，其他顶点距离为 ∞
2. 对所有边进行 V-1 轮松弛操作
3. 第 V 轮再检查一次，如果还能松弛，则说明存在**负权环**

**优势**：可以处理负权边，并且能检测负权环。

## 执行步骤

### 示例图（6个节点的加权有向图）

```
节点: 0, 1, 2, 3, 4, 5
有向边 (u → v, weight):
0 → 1: 4
0 → 2: 2
1 → 3: 5
2 → 1: 1
2 → 3: 8
2 → 4: 10
3 → 4: 2
3 → 5: 6
4 → 5: 3
```

### Dijkstra 算法执行过程（源点为 0）

```
初始状态: dist = [0, ∞, ∞, ∞, ∞, ∞]

步骤1: 取出节点 0 (dist=0)
        松弛: dist[1] = min(∞, 0+4) = 4
        松弛: dist[2] = min(∞, 0+2) = 2
        dist = [0, 4, 2, ∞, ∞, ∞]

步骤2: 取出节点 2 (dist=2)
        松弛: dist[1] = min(4, 2+1) = 3  ← 更新！
        松弛: dist[3] = min(∞, 2+8) = 10
        松弛: dist[4] = min(∞, 2+10) = 12
        dist = [0, 3, 2, 10, 12, ∞]

步骤3: 取出节点 1 (dist=3)
        松弛: dist[3] = min(10, 3+5) = 8  ← 更新！
        dist = [0, 3, 2, 8, 12, ∞]

步骤4: 取出节点 3 (dist=8)
        松弛: dist[4] = min(12, 8+2) = 10  ← 更新！
        松弛: dist[5] = min(∞, 8+6) = 14
        dist = [0, 3, 2, 8, 10, 14]

步骤5: 取出节点 4 (dist=10)
        松弛: dist[5] = min(14, 10+3) = 13  ← 更新！
        dist = [0, 3, 2, 8, 10, 13]

步骤6: 取出节点 5 (dist=13)
        无新松弛

最终结果: dist = [0, 3, 2, 8, 10, 13]
最短路径:
  0→1: 0→2→1 (距离3)
  0→2: 0→2 (距离2)
  0→3: 0→2→1→3 (距离8)
  0→4: 0→2→1→3→4 (距离10)
  0→5: 0→2→1→3→4→5 (距离13)
```

### Bellman-Ford 算法执行过程（源点为 0）

```
初始状态: dist = [0, ∞, ∞, ∞, ∞, ∞]

第1轮松弛（遍历所有9条边）:
  边(0→1,4): dist[1] = min(∞, 0+4) = 4
  边(0→2,2): dist[2] = min(∞, 0+2) = 2
  边(2→1,1): dist[1] = min(4, 2+1) = 3
  边(1→3,5): dist[3] = min(∞, 3+5) = 8
  边(2→3,8): dist[3] = min(8, 2+8) = 8 (不更新)
  边(2→4,10): dist[4] = min(∞, 2+10) = 12
  边(3→4,2): dist[4] = min(12, 8+2) = 10
  边(3→5,6): dist[5] = min(∞, 8+6) = 14
  边(4→5,3): dist[5] = min(14, 10+3) = 13
  dist = [0, 3, 2, 8, 10, 13]

第2-5轮松弛: 无更新，提前终止

最终结果: dist = [0, 3, 2, 8, 10, 13]
```

## 代码实现

```java
import java.util.*;

public class ShortestPath {

    // ========== Dijkstra 算法 ==========
    public static int[] dijkstra(int n, List<int[]>[] adj, int src) {
        int[] dist = new int[n];
        int[] prev = new int[n]; // 记录前驱节点
        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(prev, -1);
        dist[src] = 0;

        // 优先队列: [距离, 节点]
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, src});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], u = curr[1];

            if (d > dist[u]) continue; // 跳过过时的条目

            for (int[] edge : adj[u]) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    prev[v] = u;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }

    // ========== Bellman-Ford 算法 ==========
    public static int[] bellmanFord(int n, int[][] edges, int src) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        // V-1 轮松弛
        for (int i = 0; i < n - 1; i++) {
            boolean updated = false;
            for (int[] edge : edges) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    updated = true;
                }
            }
            if (!updated) break; // 提前终止优化
        }

        // 检测负权环
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                System.out.println("检测到负权环！");
                return null;
            }
        }
        return dist;
    }

    // 路径还原
    public static List<Integer> getPath(int[] prev, int target) {
        List<Integer> path = new ArrayList<>();
        for (int v = target; v != -1; v = prev[v]) {
            path.add(v);
        }
        Collections.reverse(path);
        return path;
    }

    public static void main(String[] args) {
        int n = 6;
        // 构建邻接表
        List<int[]>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        int[][] edges = {
            {0, 1, 4}, {0, 2, 2}, {1, 3, 5},
            {2, 1, 1}, {2, 3, 8}, {2, 4, 10},
            {3, 4, 2}, {3, 5, 6}, {4, 5, 3}
        };

        for (int[] e : edges) {
            adj[e[0]].add(new int[]{e[1], e[2]});
        }

        // Dijkstra
        int[] distDij = dijkstra(n, adj, 0);
        System.out.println("Dijkstra: " + Arrays.toString(distDij));

        // Bellman-Ford
        int[] distBF = bellmanFord(n, edges, 0);
        System.out.println("Bellman-Ford: " + Arrays.toString(distBF));
    }
}
```

```python
import heapq
from typing import List, Tuple, Optional

def dijkstra(n: int, adj: List[List[Tuple[int, int]]], src: int) -> Tuple[List[int], List[int]]:
    """
    Dijkstra 算法
    adj[u] = [(v, weight), ...]
    返回: (dist数组, prev数组)
    """
    dist = [float('inf')] * n
    prev = [-1] * n
    dist[src] = 0
    min_heap = [(0, src)]  # (距离, 节点)

    while min_heap:
        d, u = heapq.heappop(min_heap)
        if d > dist[u]:
            continue  # 跳过过时的条目

        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                heapq.heappush(min_heap, (dist[v], v))

    return dist, prev


def bellman_ford(n: int, edges: List[Tuple[int, int, int]], src: int) -> Optional[List[int]]:
    """
    Bellman-Ford 算法
    edges = [(u, v, weight), ...]
    返回: dist数组，若存在负权环返回 None
    """
    dist = [float('inf')] * n
    dist[src] = 0

    # V-1 轮松弛
    for i in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break  # 提前终止

    # 检测负权环
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            print("检测到负权环！")
            return None

    return dist


def get_path(prev: List[int], target: int) -> List[int]:
    """还原从源点到目标点的路径"""
    path = []
    v = target
    while v != -1:
        path.append(v)
        v = prev[v]
    return path[::-1]


if __name__ == "__main__":
    n = 6
    edges = [
        (0, 1, 4), (0, 2, 2), (1, 3, 5),
        (2, 1, 1), (2, 3, 8), (2, 4, 10),
        (3, 4, 2), (3, 5, 6), (4, 5, 3)
    ]

    # 构建邻接表
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))

    # Dijkstra
    dist_dij, prev_dij = dijkstra(n, adj, 0)
    print(f"Dijkstra 最短距离: {dist_dij}")
    print(f"0→5 的路径: {get_path(prev_dij, 5)}")

    # Bellman-Ford
    dist_bf = bellman_ford(n, edges, 0)
    print(f"Bellman-Ford 最短距离: {dist_bf}")
```

## 复杂度分析

| 算法 | 时间复杂度 | 空间复杂度 | 负权边 | 负权环检测 |
|------|-----------|-----------|--------|-----------|
| Dijkstra（二叉堆） | O(E log V) | O(V + E) | 不支持 | 不支持 |
| Dijkstra（斐波那契堆） | O(E + V log V) | O(V + E) | 不支持 | 不支持 |
| Bellman-Ford | O(VE) | O(V) | 支持 | 支持 |

### 选择指南

- **非负权图**：优先使用 Dijkstra（更快）
- **有负权边**：必须使用 Bellman-Ford
- **稠密图**：Dijkstra 配合邻接矩阵 O(V²)
- **稀疏图**：Dijkstra 配合优先队列 O(E log V)

## 实际应用

### 工程应用

1. **GPS 导航**：计算两点之间的最短行驶路线（Dijkstra + A*）
2. **网络路由**：OSPF 协议使用 Dijkstra 计算路由表
3. **社交网络**：计算用户之间的最短关系链
4. **航班规划**：计算最低费用或最短时间的航线组合
5. **游戏 AI**：NPC 寻路算法

### 竞赛应用

1. **分层图最短路**：状态扩展，如"可以免费通过 K 条边"
2. **差分约束系统**：将不等式约束建模为最短路问题
3. **SPFA 算法**：Bellman-Ford 的队列优化版本
4. **最短路计数**：统计从源点到各点的最短路径条数
5. **K 短路**：A* 算法求第 K 短的路径

## 变体与扩展

### 1. Floyd-Warshall 算法（全源最短路径）

动态规划思想，求所有顶点对之间的最短路径。时间复杂度 O(V³)，空间复杂度 O(V²)。适用于顶点数较少的稠密图。

```
dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])  对所有中间节点 k
```

### 2. SPFA 算法（Bellman-Ford 队列优化）

使用队列代替逐边松弛，只将被更新的节点加入队列。平均时间复杂度 O(kE)（k 为常数），但最坏情况仍为 O(VE)。

### 3. Johnson 算法

结合 Bellman-Ford 和 Dijkstra：先用 Bellman-Ford 重新赋权消除负权边，再对每个顶点运行 Dijkstra。适用于稀疏图的全源最短路径，时间复杂度 O(VE log V)。

### 4. A* 算法

在 Dijkstra 的基础上加入启发函数 h(n)，优先扩展 f(n) = g(n) + h(n) 最小的节点。在满足启发函数可容性的条件下，保证找到最优解且效率更高。
