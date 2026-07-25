---
title: "最小生成树"
date: "2024-11-15"
tags: ["图算法", "算法", "贪心", "进阶"]
category: "算法"
difficulty: "进阶"
excerpt: "使用 Kruskal 和 Prim 算法求解加权无向图的最小生成树"
visualgoUrl: "https://visualgo.net/zh/mst"
---

## 概述

最小生成树（Minimum Spanning Tree, MST）是图论中的经典问题。给定一个加权无向连通图，最小生成树是一棵包含图中所有顶点的树，且边的权值之和最小。

**生成树的性质：**
- 包含图中所有 V 个顶点
- 恰好有 V-1 条边
- 没有环
- 连通

最小生成树在网络设计、聚类分析、近似算法等领域有广泛应用。求解 MST 最经典的两个算法是 Kruskal 算法和 Prim 算法。

## 核心原理

### Kruskal 算法

Kruskal 算法基于**贪心策略**，按边权从小到大排序，依次选择不构成环的边：

1. 将所有边按权值从小到大排序
2. 初始化并查集，每个顶点是独立的集合
3. 依次遍历排序后的边，如果边的两端不在同一集合中，则选择该边并合并两个集合
4. 直到选择了 V-1 条边

**核心数据结构：并查集（Union-Find）**—— 用于高效判断两个节点是否属于同一连通分量。

### Prim 算法

Prim 算法也是**贪心策略**，但以顶点为核心，从一个起始顶点开始逐步扩展：

1. 选择任意一个起始顶点，加入 MST 集合
2. 在所有连接 MST 集合和非 MST 集合的边中，选择权值最小的边
3. 将该边和对应的新顶点加入 MST 集合
4. 重复步骤 2-3，直到所有顶点都加入 MST 集合

**核心数据结构：优先队列（最小堆）**—— 用于高效获取最小权值的边。

## 执行步骤

### 示例图（7个节点的加权无向图）

```
        2
    0 ------ 1
    |       / | \
   6|    3/   |  \5
    |   /     |8  \
    2 /       |    3
    |    7    |   /
    | 0------4| /
    |/    \   |/
    5      1  6
     \       /
      4     2
       \   /
        \ /
         (5-6边权为4, 4-6边权为2)

邻接表（节点: [(邻居, 权重)]）:
0: [(1,2), (2,6), (5,0)]  -- 注意: 这里重新设计
```

让我们使用更清晰的示例：

```
节点: 0, 1, 2, 3, 4, 5, 6
边列表 (u, v, weight):
(0, 1, 2)
(0, 2, 3)
(1, 2, 1)
(1, 3, 5)
(2, 3, 6)
(2, 4, 4)
(3, 4, 7)
(3, 5, 8)
(4, 5, 3)
(4, 6, 9)
(5, 6, 2)
```

### Kruskal 算法执行过程

```
排序后的边: (1,2,1), (0,1,2), (5,6,2), (0,2,3), (4,5,3), (1,3,5), (2,4,4), (2,3,6), (3,4,7), (3,5,8), (4,6,9)

步骤1: 选边(1,2,1) → 1和2不在同一集合，选择 ✓  MST权重=1
步骤2: 选边(0,1,2) → 0和1不在同一集合，选择 ✓  MST权重=3
步骤3: 选边(5,6,2) → 5和6不在同一集合，选择 ✓  MST权重=5
步骤4: 选边(0,2,3) → 0和2在同一集合，跳过 ✗
步骤5: 选边(4,5,3) → 4和5不在同一集合，选择 ✓  MST权重=8
步骤6: 选边(1,3,5) → 1和3不在同一集合，选择 ✓  MST权重=13
步骤7: 选边(2,4,4) → 2和4不在同一集合，选择 ✓  MST权重=17

已选6条边(V-1=6)，算法结束。
MST 总权重 = 17
MST 边集: {(1,2), (0,1), (5,6), (4,5), (1,3), (2,4)}
```

### Prim 算法执行过程（从节点 0 开始）

```
步骤1: MST={0}，候选边: (0,1,2), (0,2,3)
        选择最小边(0,1,2)，MST={0,1}

步骤2: MST={0,1}，新增候选边: (1,2,1), (1,3,5)
        选择最小边(1,2,1)，MST={0,1,2}

步骤3: MST={0,1,2}，新增候选边: (2,3,6), (2,4,4)
        选择最小边(2,4,4)，MST={0,1,2,4}

步骤4: MST={0,1,2,4}，新增候选边: (4,5,3), (4,6,9), (4,3,7)
        选择最小边(4,5,3)，MST={0,1,2,4,5}

步骤5: MST={0,1,2,4,5}，新增候选边: (5,6,2), (5,3,8)
        选择最小边(5,6,2)，MST={0,1,2,4,5,6}

步骤6: MST={0,1,2,4,5,6}，剩余候选边含 (1,3,5)
        选择最小边(1,3,5)，MST={0,1,2,3,4,5,6}

MST 总权重 = 2+1+4+3+2+5 = 17
```

## 代码实现

```java
import java.util.*;

public class MinimumSpanningTree {

    // ========== 并查集 ==========
    static int[] parent, rank;

    static void initUnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }

    static int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // 路径压缩
        }
        return parent[x];
    }

    static boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }

    // ========== Kruskal 算法 ==========
    static int kruskal(int n, int[][] edges) {
        // edges[i] = [u, v, weight]
        Arrays.sort(edges, (a, b) -> a[2] - b[2]);
        initUnionFind(n);

        int mstWeight = 0;
        int edgeCount = 0;
        List<int[]> mstEdges = new ArrayList<>();

        for (int[] edge : edges) {
            if (edgeCount == n - 1) break;
            if (union(edge[0], edge[1])) {
                mstWeight += edge[2];
                mstEdges.add(edge);
                edgeCount++;
            }
        }

        System.out.println("Kruskal MST 边:");
        for (int[] e : mstEdges) {
            System.out.printf("  (%d, %d) 权重=%d%n", e[0], e[1], e[2]);
        }
        return mstWeight;
    }

    // ========== Prim 算法 ==========
    static int prim(int n, List<int[]>[] adj) {
        // adj[u] 存储 [v, weight]
        boolean[] inMST = new boolean[n];
        // 优先队列存储 [weight, node]
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        int mstWeight = 0;
        pq.offer(new int[]{0, 0}); // 从节点0开始

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int weight = curr[0], u = curr[1];

            if (inMST[u]) continue;
            inMST[u] = true;
            mstWeight += weight;

            for (int[] neighbor : adj[u]) {
                int v = neighbor[0], w = neighbor[1];
                if (!inMST[v]) {
                    pq.offer(new int[]{w, v});
                }
            }
        }
        return mstWeight;
    }

    public static void main(String[] args) {
        int n = 7;
        int[][] edges = {
            {0, 1, 2}, {0, 2, 3}, {1, 2, 1}, {1, 3, 5},
            {2, 3, 6}, {2, 4, 4}, {3, 4, 7}, {3, 5, 8},
            {4, 5, 3}, {4, 6, 9}, {5, 6, 2}
        };

        System.out.println("Kruskal MST 权重: " + kruskal(n, edges));

        // 构建邻接表
        List<int[]>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
        for (int[] e : edges) {
            adj[e[0]].add(new int[]{e[1], e[2]});
            adj[e[1]].add(new int[]{e[0], e[2]});
        }
        System.out.println("Prim MST 权重: " + prim(n, adj));
    }
}
```

```python
import heapq
from typing import List, Tuple

class UnionFind:
    """并查集（路径压缩 + 按秩合并）"""
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True


def kruskal(n: int, edges: List[Tuple[int, int, int]]) -> Tuple[int, List]:
    """Kruskal 算法求最小生成树"""
    edges.sort(key=lambda x: x[2])
    uf = UnionFind(n)
    mst_weight = 0
    mst_edges = []

    for u, v, w in edges:
        if len(mst_edges) == n - 1:
            break
        if uf.union(u, v):
            mst_weight += w
            mst_edges.append((u, v, w))

    return mst_weight, mst_edges


def prim(n: int, adj: List[List[Tuple[int, int]]]) -> int:
    """Prim 算法求最小生成树"""
    in_mst = [False] * n
    min_heap = [(0, 0)]  # (weight, node)
    mst_weight = 0

    while min_heap:
        weight, u = heapq.heappop(min_heap)
        if in_mst[u]:
            continue
        in_mst[u] = True
        mst_weight += weight

        for v, w in adj[u]:
            if not in_mst[v]:
                heapq.heappush(min_heap, (w, v))

    return mst_weight


if __name__ == "__main__":
    n = 7
    edges = [
        (0, 1, 2), (0, 2, 3), (1, 2, 1), (1, 3, 5),
        (2, 3, 6), (2, 4, 4), (3, 4, 7), (3, 5, 8),
        (4, 5, 3), (4, 6, 9), (5, 6, 2)
    ]

    # Kruskal
    weight, mst_edges = kruskal(n, edges[:])
    print(f"Kruskal MST 权重: {weight}")
    for u, v, w in mst_edges:
        print(f"  边({u}, {v}) 权重={w}")

    # 构建邻接表
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
        adj[v].append((u, w))

    # Prim
    print(f"Prim MST 权重: {prim(n, adj)}")
```

## 复杂度分析

| 算法 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|-----------|-----------|---------|
| Kruskal | O(E log E) | O(V) | 稀疏图（边少） |
| Prim（优先队列） | O(E log V) | O(V + E) | 稠密图（边多） |
| Prim（邻接矩阵） | O(V²) | O(V) | 稠密图 |

- Kruskal 的瓶颈在排序 O(E log E)，并查集操作近似 O(1)
- Prim 使用二叉堆时为 O(E log V)，使用斐波那契堆可达 O(E + V log V)

## 实际应用

### 工程应用

1. **网络布线**：城市间铺设光缆的最小成本方案
2. **电路设计**：PCB 布线中连接所有元件的最短总线长
3. **聚类分析**：基于 MST 的层次聚类，删除最长边得到 K 个聚类
4. **图像分割**：将像素视为节点，相似度作为边权，用 MST 进行区域分割
5. **交通规划**：连接所有城镇的最低成本公路网

### 竞赛应用

1. **次小生成树**：在 MST 基础上替换一条边
2. **最小瓶颈路**：MST 上两点间路径的最大边权即为最小瓶颈
3. **Borůvka 算法**：并行友好的 MST 算法
4. **最小生成森林**：图不连通时求各连通分量的 MST

## 变体与扩展

### 1. 次小生成树

在最小生成树的基础上，枚举每条非树边加入后形成环，删除环上权值最大的树边，得到候选次小生成树。时间复杂度 O(V²) 或 O(E log V)。

### 2. 最小度限制生成树

限制某些顶点的度数不超过 k 的最小生成树，属于 NP-Hard 问题，通常使用近似算法或拉格朗日松弛。

### 3. Steiner 树

只需连接图中指定的部分顶点（关键点），允许使用其他顶点作为中继。是 NP-Hard 问题，常用动态规划或近似算法求解。

### 4. 动态 MST

支持边的插入和删除后快速更新 MST，可使用 Link-Cut Tree 等数据结构实现 O(log²n) 的更新。
