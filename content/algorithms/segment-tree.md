---
title: "线段树"
date: "2024-11-18"
tags: ["数据结构", "算法", "区间查询", "深入"]
category: "算法"
difficulty: "深入"
excerpt: "掌握线段树的构建、区间查询、区间更新及懒标记优化技巧"
visualgoUrl: "https://visualgo.net/zh/segmenttree"
---

## 概述

线段树（Segment Tree）是一种用于高效处理**区间查询**和**区间修改**的树形数据结构。它将一个数组构建为一棵平衡二叉树，每个节点存储对应区间的聚合信息（如区间和、区间最大值等）。

**核心功能：**
- 区间查询：O(log n) 查询任意区间的聚合值
- 单点修改：O(log n) 修改单个元素后更新树
- 区间修改：配合懒标记（Lazy Propagation），O(log n) 批量修改

与暴力方法对比：

| 操作 | 暴力方法 | 线段树 |
|------|---------|--------|
| 区间查询 | O(n) | O(log n) |
| 单点修改 | O(1) | O(log n) |
| 区间修改 | O(n) | O(log n) |

线段树在竞赛编程和工程中（如数据库索引、实时统计）有广泛应用。

## 核心原理

### 树的结构

线段树是一棵**完全二叉树**（用数组实现），对于数组 `arr[0..n-1]`：

- 根节点表示区间 `[0, n-1]`
- 每个内部节点 `[l, r]` 的左子节点表示 `[l, mid]`，右子节点表示 `[mid+1, r]`
- 叶子节点表示单个元素 `[i, i]`

对于节点编号 `i`（从1开始）：
- 左子节点：`2*i`
- 右子节点：`2*i + 1`
- 父节点：`i / 2`

### 建树过程

自底向上构建，叶子节点存储原始值，内部节点存储子节点的聚合值：
```
tree[node] = merge(tree[left_child], tree[right_child])
```

### 懒标记（Lazy Propagation）

区间修改时，不立即更新到叶子节点，而是在中间节点打上"懒标记"，表示"该节点的子树需要进行某个操作"。只有在后续查询或修改涉及到该子树时，才将懒标记**下推（pushdown）**到子节点。

## 执行步骤

### 示例数组

```
arr = [1, 3, 5, 7, 9, 11]  (n=6)
```

### 建树过程

```
                    [0,5]=36
                  /          \
           [0,2]=9          [3,5]=27
          /      \          /      \
      [0,1]=4  [2,2]=5  [3,4]=16  [5,5]=11
      /    \              /    \
  [0,0]=1 [1,1]=3   [3,3]=7 [4,4]=9

树的数组表示（1-indexed）:
tree[1] = 36  (整个区间和)
tree[2] = 9   (左半区间和)
tree[3] = 27  (右半区间和)
tree[4] = 4, tree[5] = 5, tree[6] = 16, tree[7] = 11
tree[8] = 1, tree[9] = 3, tree[12] = 7, tree[13] = 9
```

### 区间查询示例：query(1, 4)

```
查询 arr[1] + arr[2] + arr[3] + arr[4] = 3+5+7+9 = 24

步骤1: 当前节点 [0,5]，查询 [1,4]
        [1,4] 与 [0,5] 有交集但不完全包含
        递归进入左子树 [0,2] 和右子树 [3,5]

步骤2: 左子树 [0,2]，查询 [1,4]
        [1,4] 不完全包含 [0,2]
        递归进入 [0,1] 和 [2,2]

步骤3: [0,1] 中查 [1,4] → 进入 [1,1]，返回 3
        [2,2] 完全在 [1,4] 中，返回 5
        左子树结果 = 3 + 5 = 8

步骤4: 右子树 [3,5]，查询 [1,4]
        [3,4] 完全在 [1,4] 中，返回 16
        [5,5] 不在 [1,4] 中，返回 0
        右子树结果 = 16

最终结果 = 8 + 16 = 24 ✓
```

### 区间更新示例（带懒标记）：update(1, 3, +2)

```
将 arr[1..3] 每个元素加 2

步骤1: 当前节点 [0,5]，更新 [1,3]
        递归进入左子树 [0,2] 和右子树 [3,5]

步骤2: 左子树 [0,2]
        [1,3] 不完全包含 [0,2]
        递归进入 [0,1] 和 [2,2]
        [1,1]: 完全包含，打懒标记 +2，值更新为 3+2=5
        [2,2]: 完全包含，打懒标记 +2，值更新为 5+2=7
        回溯更新 [0,2] = 1+5+7 = 13

步骤3: 右子树 [3,5]
        [3,3]: 完全包含，打懒标记 +2，值更新为 7+2=9
        [4,5]: 不在范围内
        回溯更新

更新后: arr = [1, 5, 7, 9, 9, 11]
```

## 代码实现

```java
public class SegmentTree {
    private int[] tree;  // 线段树数组
    private int[] lazy;  // 懒标记数组
    private int n;

    public SegmentTree(int[] arr) {
        n = arr.length;
        tree = new int[4 * n];
        lazy = new int[4 * n];
        build(arr, 1, 0, n - 1);
    }

    // 建树
    private void build(int[] arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        build(arr, 2 * node, start, mid);
        build(arr, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // 下推懒标记
    private void pushDown(int node, int start, int end) {
        if (lazy[node] != 0) {
            int mid = (start + end) / 2;
            // 更新左子节点
            tree[2 * node] += lazy[node] * (mid - start + 1);
            lazy[2 * node] += lazy[node];
            // 更新右子节点
            tree[2 * node + 1] += lazy[node] * (end - mid);
            lazy[2 * node + 1] += lazy[node];
            // 清除当前懒标记
            lazy[node] = 0;
        }
    }

    // 区间查询 [l, r] 的和
    public int query(int l, int r) {
        return query(1, 0, n - 1, l, r);
    }

    private int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;           // 完全不在范围内
        if (l <= start && end <= r) return tree[node]; // 完全在范围内

        pushDown(node, start, end);
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r)
             + query(2 * node + 1, mid + 1, end, l, r);
    }

    // 区间更新 [l, r] 每个元素加 val
    public void update(int l, int r, int val) {
        update(1, 0, n - 1, l, r, val);
    }

    private void update(int node, int start, int end, int l, int r, int val) {
        if (r < start || end < l) return;           // 完全不在范围内
        if (l <= start && end <= r) {               // 完全在范围内
            tree[node] += val * (end - start + 1);
            lazy[node] += val;
            return;
        }

        pushDown(node, start, end);
        int mid = (start + end) / 2;
        update(2 * node, start, mid, l, r, val);
        update(2 * node + 1, mid + 1, end, l, r, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // 单点修改
    public void pointUpdate(int idx, int val) {
        pointUpdate(1, 0, n - 1, idx, val);
    }

    private void pointUpdate(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        int mid = (start + end) / 2;
        if (idx <= mid) {
            pointUpdate(2 * node, start, mid, idx, val);
        } else {
            pointUpdate(2 * node + 1, mid + 1, end, idx, val);
        }
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11};
        SegmentTree st = new SegmentTree(arr);

        System.out.println("区间和 [1,4]: " + st.query(1, 4)); // 3+5+7+9=24
        st.update(1, 3, 2); // arr[1..3] 各加 2
        System.out.println("更新后 [1,4]: " + st.query(1, 4)); // 5+7+9+9=30
        System.out.println("区间和 [0,5]: " + st.query(0, 5)); // 1+5+7+9+9+11=42
    }
}
```

```python
from typing import List

class SegmentTree:
    """线段树（支持区间查询、区间更新、懒标记）"""

    def __init__(self, arr: List[int]):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self._build(arr, 1, 0, self.n - 1)

    def _build(self, arr: List[int], node: int, start: int, end: int):
        """建树"""
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self._build(arr, 2 * node, start, mid)
        self._build(arr, 2 * node + 1, mid + 1, end)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def _push_down(self, node: int, start: int, end: int):
        """下推懒标记"""
        if self.lazy[node] != 0:
            mid = (start + end) // 2
            # 更新左子节点
            self.tree[2 * node] += self.lazy[node] * (mid - start + 1)
            self.lazy[2 * node] += self.lazy[node]
            # 更新右子节点
            self.tree[2 * node + 1] += self.lazy[node] * (end - mid)
            self.lazy[2 * node + 1] += self.lazy[node]
            # 清除懒标记
            self.lazy[node] = 0

    def query(self, l: int, r: int) -> int:
        """区间查询 [l, r] 的和"""
        return self._query(1, 0, self.n - 1, l, r)

    def _query(self, node: int, start: int, end: int, l: int, r: int) -> int:
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]

        self._push_down(node, start, end)
        mid = (start + end) // 2
        return (self._query(2 * node, start, mid, l, r) +
                self._query(2 * node + 1, mid + 1, end, l, r))

    def update(self, l: int, r: int, val: int):
        """区间更新 [l, r] 每个元素加 val"""
        self._update(1, 0, self.n - 1, l, r, val)

    def _update(self, node: int, start: int, end: int, l: int, r: int, val: int):
        if r < start or end < l:
            return
        if l <= start and end <= r:
            self.tree[node] += val * (end - start + 1)
            self.lazy[node] += val
            return

        self._push_down(node, start, end)
        mid = (start + end) // 2
        self._update(2 * node, start, mid, l, r, val)
        self._update(2 * node + 1, mid + 1, end, l, r, val)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]

    def point_update(self, idx: int, val: int):
        """单点修改"""
        self._point_update(1, 0, self.n - 1, idx, val)

    def _point_update(self, node: int, start: int, end: int, idx: int, val: int):
        if start == end:
            self.tree[node] = val
            return
        mid = (start + end) // 2
        if idx <= mid:
            self._point_update(2 * node, start, mid, idx, val)
        else:
            self._point_update(2 * node + 1, mid + 1, end, idx, val)
        self.tree[node] = self.tree[2 * node] + self.tree[2 * node + 1]


if __name__ == "__main__":
    arr = [1, 3, 5, 7, 9, 11]
    st = SegmentTree(arr)

    print(f"区间和 [1,4]: {st.query(1, 4)}")  # 3+5+7+9=24
    st.update(1, 3, 2)  # arr[1..3] 各加 2
    print(f"更新后 [1,4]: {st.query(1, 4)}")  # 5+7+9+9=30
    print(f"区间和 [0,5]: {st.query(0, 5)}")  # 1+5+7+9+9+11=42
```

## 复杂度分析

| 操作 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 建树 | O(n) | O(n) |
| 单点查询 | O(log n) | - |
| 区间查询 | O(log n) | - |
| 单点修改 | O(log n) | - |
| 区间修改（懒标记） | O(log n) | - |

- 空间：需要 4n 大小的数组（完全二叉树的数组表示）
- 建树自底向上合并，只需遍历每个节点一次，故为 O(n)
- 查询和更新最多访问 O(log n) 层，每层常数个节点

## 实际应用

### 工程应用

1. **数据库索引**：范围查询优化（如 B+树的变种）
2. **实时统计系统**：统计一段时间内的访问量、交易额
3. **地理信息系统**：矩形区域内的点计数查询
4. **文本编辑器**：维护行号与偏移量的映射关系
5. **金融系统**：实时计算滑动窗口内的最大值/最小值

### 竞赛应用

1. **区间求和/最值**：最基本的应用
2. **区间 GCD/乘积**：修改合并函数即可
3. **区间颜色段数**：维护区间左右端点颜色
4. **扫描线算法**：配合线段树计算矩形面积并
5. **离线查询 + 线段树**：按某种顺序处理查询

## 变体与扩展

### 1. 动态开点线段树

当值域很大但实际使用的节点较少时（如值域为 10^9 但只有 10^5 次操作），动态创建节点而非预先分配数组。空间复杂度降为 O(Q log V)。

### 2. 可持久化线段树（主席树）

保存每次修改后的版本，支持查询历史版本。通过共享不变的子树节点实现空间优化。应用：区间第 K 小、时间旅行查询。

### 3. 线段树合并

将两棵线段树合并为一棵。在树上启发式合并、虚树等问题中有应用。时间复杂度与合并节点数成正比。

### 4. 二维线段树（树套树）

外层线段树按一个维度划分区间，内层线段树按另一个维度划分。支持二维区间查询，但实现复杂度较高。常见替代方案是 KD-Tree 或分块。
