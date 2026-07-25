---
title: "二叉堆"
date: "2024-11-10"
tags: ["数据结构", "算法", "基础"]
category: "算法"
difficulty: "基础"
excerpt: "二叉堆是一种用数组实现的完全二叉树结构，支持高效的优先级元素提取操作"
visualgoUrl: "https://visualgo.net/zh/heap"
---

## 概述

二叉堆（Binary Heap）是一种特殊的完全二叉树，满足堆性质：每个节点的值都大于等于（最大堆）或小于等于（最小堆）其子节点的值。二叉堆通常用数组来实现，是优先队列的经典实现方式。

二叉堆的主要用途包括：
- 优先队列的实现
- 堆排序算法
- 图算法中的辅助结构（Dijkstra、Prim 算法）
- Top-K 问题的高效求解
- 操作系统中的任务调度

## 基本原理

### 最大堆（Max-Heap）

- 每个节点的值 ≥ 其所有子节点的值
- 根节点是整个堆中的最大值

### 最小堆（Min-Heap）

- 每个节点的值 ≤ 其所有子节点的值
- 根节点是整个堆中的最小值

### 数组存储

二叉堆使用数组存储，对于下标为 i 的节点（从 0 开始）：
- **父节点**：`parent = (i - 1) / 2`
- **左子节点**：`left = 2 * i + 1`
- **右子节点**：`right = 2 * i + 2`

这种存储方式不需要额外的指针，空间利用率高。

### 完全二叉树性质

二叉堆是完全二叉树，即除最后一层外所有层都是满的，最后一层节点从左到右排列。这保证了堆的高度为 O(log n)。

## 核心操作

### 上浮（Sift Up）

当插入新元素或某节点值增大时使用：
1. 将目标节点与其父节点比较
2. 如果违反堆性质，交换两者
3. 重复步骤 1-2 直到堆性质恢复或到达根节点

### 下沉（Sift Down）

当删除堆顶或某节点值减小时使用：
1. 将目标节点与其较大（最大堆）/较小（最小堆）的子节点比较
2. 如果违反堆性质，与该子节点交换
3. 重复步骤 1-2 直到堆性质恢复或到达叶节点

### 插入（Insert）

1. 将新元素添加到数组末尾（完全二叉树的最后位置）
2. 对新元素执行上浮操作

### 提取最值（Extract Max/Min）

1. 记录堆顶元素（最值）
2. 将数组最后一个元素移动到堆顶
3. 数组长度减 1
4. 对新的堆顶执行下沉操作
5. 返回记录的最值

### 建堆（Heapify）

将无序数组转化为堆：
1. 从最后一个非叶节点开始（下标为 `n/2 - 1`）
2. 对每个节点执行下沉操作
3. 逆序处理直到根节点

建堆的时间复杂度为 O(n)，而非直觉上的 O(n log n)。

## 代码实现

### 最大堆

```java
public class MaxHeap {
    private int[] heap;
    private int size;
    private int capacity;

    public MaxHeap(int capacity) {
        this.capacity = capacity;
        this.heap = new int[capacity];
        this.size = 0;
    }

    private int parent(int i) { return (i - 1) / 2; }
    private int leftChild(int i) { return 2 * i + 1; }
    private int rightChild(int i) { return 2 * i + 2; }

    private void swap(int i, int j) {
        int temp = heap[i];
        heap[i] = heap[j];
        heap[j] = temp;
    }

    // 上浮操作
    private void siftUp(int index) {
        while (index > 0 && heap[index] > heap[parent(index)]) {
            swap(index, parent(index));
            index = parent(index);
        }
    }

    // 下沉操作
    private void siftDown(int index) {
        int largest = index;
        int left = leftChild(index);
        int right = rightChild(index);

        if (left < size && heap[left] > heap[largest]) {
            largest = left;
        }
        if (right < size && heap[right] > heap[largest]) {
            largest = right;
        }
        if (largest != index) {
            swap(index, largest);
            siftDown(largest);
        }
    }

    // 插入元素
    public void insert(int value) {
        if (size == capacity) {
            throw new RuntimeException("堆已满");
        }
        heap[size] = value;
        size++;
        siftUp(size - 1);
    }

    // 提取最大值
    public int extractMax() {
        if (size == 0) {
            throw new RuntimeException("堆为空");
        }
        int max = heap[0];
        heap[0] = heap[size - 1];
        size--;
        siftDown(0);
        return max;
    }

    // 查看最大值
    public int peekMax() {
        if (size == 0) {
            throw new RuntimeException("堆为空");
        }
        return heap[0];
    }

    // 建堆
    public static MaxHeap buildHeap(int[] array) {
        MaxHeap maxHeap = new MaxHeap(array.length);
        maxHeap.heap = array.clone();
        maxHeap.size = array.length;
        // 从最后一个非叶节点开始下沉
        for (int i = array.length / 2 - 1; i >= 0; i--) {
            maxHeap.siftDown(i);
        }
        return maxHeap;
    }

    // 堆排序
    public static void heapSort(int[] array) {
        int n = array.length;
        // 建堆
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(array, n, i);
        }
        // 逐个提取最大值
        for (int i = n - 1; i > 0; i--) {
            int temp = array[0];
            array[0] = array[i];
            array[i] = temp;
            heapify(array, i, 0);
        }
    }

    private static void heapify(int[] array, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        if (left < n && array[left] > array[largest]) largest = left;
        if (right < n && array[right] > array[largest]) largest = right;
        if (largest != i) {
            int temp = array[i];
            array[i] = array[largest];
            array[largest] = temp;
            heapify(array, n, largest);
        }
    }

    public int getSize() { return size; }
    public boolean isEmpty() { return size == 0; }
}
```

```python
class MaxHeap:
    def __init__(self):
        self._heap = []

    def _parent(self, i):
        return (i - 1) // 2

    def _left_child(self, i):
        return 2 * i + 1

    def _right_child(self, i):
        return 2 * i + 2

    def _swap(self, i, j):
        self._heap[i], self._heap[j] = self._heap[j], self._heap[i]

    def _sift_up(self, index):
        """上浮操作"""
        while index > 0 and self._heap[index] > self._heap[self._parent(index)]:
            self._swap(index, self._parent(index))
            index = self._parent(index)

    def _sift_down(self, index):
        """下沉操作"""
        size = len(self._heap)
        largest = index
        left = self._left_child(index)
        right = self._right_child(index)

        if left < size and self._heap[left] > self._heap[largest]:
            largest = left
        if right < size and self._heap[right] > self._heap[largest]:
            largest = right
        if largest != index:
            self._swap(index, largest)
            self._sift_down(largest)

    def insert(self, value):
        """插入元素"""
        self._heap.append(value)
        self._sift_up(len(self._heap) - 1)

    def extract_max(self):
        """提取最大值"""
        if not self._heap:
            raise IndexError("堆为空")
        max_val = self._heap[0]
        self._heap[0] = self._heap[-1]
        self._heap.pop()
        if self._heap:
            self._sift_down(0)
        return max_val

    def peek_max(self):
        """查看最大值"""
        if not self._heap:
            raise IndexError("堆为空")
        return self._heap[0]

    @classmethod
    def build_heap(cls, array):
        """从数组建堆，时间复杂度 O(n)"""
        heap = cls()
        heap._heap = array[:]
        n = len(heap._heap)
        for i in range(n // 2 - 1, -1, -1):
            heap._sift_down(i)
        return heap

    def size(self):
        return len(self._heap)

    def is_empty(self):
        return len(self._heap) == 0


def heap_sort(array):
    """堆排序"""
    n = len(array)

    # 建堆
    for i in range(n // 2 - 1, -1, -1):
        _heapify(array, n, i)

    # 逐个提取最大值放到末尾
    for i in range(n - 1, 0, -1):
        array[0], array[i] = array[i], array[0]
        _heapify(array, i, 0)


def _heapify(array, n, i):
    """辅助函数：对第 i 个节点执行下沉"""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and array[left] > array[largest]:
        largest = left
    if right < n and array[right] > array[largest]:
        largest = right
    if largest != i:
        array[i], array[largest] = array[largest], array[i]
        _heapify(array, n, largest)
```

## 复杂度分析

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 插入（insert） | O(log n) | 最多上浮到根节点 |
| 提取最值（extractMax/Min） | O(log n) | 最多下沉到叶节点 |
| 查看最值（peek） | O(1) | 直接访问数组首元素 |
| 建堆（heapify） | O(n) | 自底向上建堆 |
| 堆排序 | O(n log n) | 建堆 O(n) + n 次提取 O(log n) |
| 删除任意元素 | O(log n) | 需要知道元素位置 |

空间复杂度：O(n)，用数组存储 n 个元素。堆排序为原地排序，额外空间 O(1)。

## 适用场景

1. **优先队列**：任务调度中按优先级处理任务
2. **Top-K 问题**：维护大小为 K 的堆，快速获取前 K 大/小元素
3. **堆排序**：原地排序，空间复杂度 O(1)
4. **中位数维护**：用一个最大堆和一个最小堆动态维护数据流的中位数
5. **Dijkstra 最短路径**：用最小堆高效获取当前最短距离节点
6. **合并 K 个有序链表**：用最小堆维护 K 个链表的当前最小节点

## 优缺点分析

### 优点

- **高效的最值操作**：获取最大/最小值 O(1)，提取最值 O(log n)
- **数组实现**：无需额外指针，内存紧凑，缓存友好
- **建堆高效**：O(n) 时间从无序数组建堆
- **原地排序**：堆排序不需要额外空间
- **动态维护**：支持动态插入新元素并保持堆性质

### 缺点

- **不支持高效查找**：查找任意元素需要 O(n)
- **不稳定排序**：堆排序不保证相同元素的相对顺序
- **不支持高效合并**：两个堆合并需要 O(n)（可用斐波那契堆改善）
- **缓存性能不如快排**：虽然数组存储，但访问模式不如顺序访问
