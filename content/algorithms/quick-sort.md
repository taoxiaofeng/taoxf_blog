---
title: "快速排序"
date: "2024-11-05"
tags: ["排序算法", "算法", "入门"]
category: "算法"
difficulty: "入门"
excerpt: "基于分治法的高效排序算法，通过选择基准元素进行分区，递归排序两侧子数组"
visualgoUrl: "https://visualgo.net/zh/sorting"
---

## 概述

快速排序（Quick Sort）是由英国计算机科学家 Tony Hoare 在 1960 年提出的一种高效排序算法。它是实践中使用最广泛的排序算法之一，在大多数情况下比其他 O(n log n) 算法更快。

快速排序同样基于**分治法**，但与归并排序不同的是，它的核心工作在"分"的阶段完成（通过分区操作），而归并排序的核心工作在"合"的阶段完成。快速排序的平均时间复杂度为 O(n log n)，空间复杂度为 O(log n)，但最坏情况下会退化为 O(n²)。

## 算法原理

快速排序的核心步骤：

### 1. 选择基准（Pivot）
从数组中选择一个元素作为基准。常见的选择策略有：
- 选择第一个元素
- 选择最后一个元素
- 选择中间元素
- 随机选择（推荐，可避免最坏情况）
- 三数取中法（取首、尾、中间三个元素的中位数）

### 2. 分区（Partition）
将数组重新排列，使得：
- 所有小于基准的元素移到基准左侧
- 所有大于基准的元素移到基准右侧
- 基准元素位于其最终排序位置

### 3. 递归排序
对基准左侧和右侧的子数组分别递归执行快速排序。

## 执行步骤

以数组 `[64, 34, 25, 12, 22, 11, 90]` 为例，选择最后一个元素作为基准：

**第一次分区（pivot=90）：**
- 数组：[64, 34, 25, 12, 22, 11, **90**]
- 所有元素都小于 90，90 留在最后位置
- 分区结果：[64, 34, 25, 12, 22, 11] | 90 | []
- 90 已在正确位置（索引 6）

**对左侧 [64, 34, 25, 12, 22, 11] 递归，pivot=11：**
- 遍历：64>11, 34>11, 25>11, 12>11, 22>11
- 分区结果：[] | 11 | [34, 25, 12, 22, 64]
- 但使用 Lomuto 分区方案，实际过程为：
  - i=-1, j 遍历数组
  - 没有元素小于 11
  - 将 11 与 arr[0]=64 交换
  - 结果：[**11**, 34, 25, 12, 22, 64] | 90

**对 [34, 25, 12, 22, 64] 递归，pivot=64：**
- 所有元素 34,25,12,22 都小于 64
- 结果：[34, 25, 12, 22] | **64** | []

**对 [34, 25, 12, 22] 递归，pivot=22：**
- 12 < 22，移到左侧
- 结果：[12] | **22** | [25, 34]

**对 [25, 34] 递归，pivot=34：**
- 25 < 34
- 结果：[25] | **34** | []

**最终结果：[11, 12, 22, 25, 34, 64, 90]**

## 代码实现

```java
public class QuickSort {

    /**
     * 快速排序主方法
     */
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // 分区，获取基准元素的最终位置
            int pivotIndex = partition(arr, low, high);
            // 递归排序左半部分
            quickSort(arr, low, pivotIndex - 1);
            // 递归排序右半部分
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    /**
     * Lomuto 分区方案
     */
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high]; // 选择最后一个元素作为基准
        int i = low - 1; // i 指向小于 pivot 的区域的最后一个元素

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                // 交换 arr[i] 和 arr[j]
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        // 将 pivot 放到正确位置
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(java.util.Arrays.toString(arr));
        // 输出: [11, 12, 22, 25, 34, 64, 90]
    }
}
```

```python
def quick_sort(arr):
    """快速排序（简洁版）"""
    if len(arr) <= 1:
        return arr

    pivot = arr[-1]  # 选择最后一个元素作为基准
    left = [x for x in arr[:-1] if x <= pivot]
    right = [x for x in arr[:-1] if x > pivot]

    return quick_sort(left) + [pivot] + quick_sort(right)


def quick_sort_in_place(arr, low, high):
    """快速排序（原地排序版）"""
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort_in_place(arr, low, pivot_index - 1)
        quick_sort_in_place(arr, pivot_index + 1, high)


def partition(arr, low, high):
    """Lomuto 分区方案"""
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1


# 示例
arr = [64, 34, 25, 12, 22, 11, 90]
print(quick_sort(arr))
# 输出: [11, 12, 22, 25, 34, 64, 90]

# 原地排序版
arr2 = [64, 34, 25, 12, 22, 11, 90]
quick_sort_in_place(arr2, 0, len(arr2) - 1)
print(arr2)
# 输出: [11, 12, 22, 25, 34, 64, 90]
```

## 复杂度分析

| 复杂度类型 | 复杂度 | 说明 |
|-----------|--------|------|
| 最好时间复杂度 | O(n log n) | 每次分区都将数组均匀分成两半 |
| 最坏时间复杂度 | O(n²) | 每次选择的基准都是最大或最小元素（如已排序数组） |
| 平均时间复杂度 | O(n log n) | 随机排列的数组 |
| 空间复杂度 | O(log n) | 递归调用栈的深度（平均情况） |

**最坏情况的产生**：
- 数组已经有序或逆序，且每次选择第一个/最后一个元素作为基准
- 所有元素相同

**如何避免最坏情况**：
- 随机选择基准元素
- 三数取中法
- 当子数组较小时切换到插入排序

## 稳定性分析

快速排序是**不稳定排序**。

在分区过程中，元素的交换可能改变相同值元素的相对顺序。例如：

数组 `[3a, 2, 3b, 1, 4]`，选择 4 作为基准：
- 分区过程中，3a 和 3b 可能因为交换操作而改变相对顺序
- 最终 3b 可能出现在 3a 之前

如果需要稳定的快速排序，可以使用额外空间来实现，但这会增加空间复杂度。

## 适用场景

快速排序适合在以下场景中使用：

- **通用排序**：大多数编程语言的标准库排序使用快速排序或其变体（如 IntroSort）
- **大规模数据**：平均 O(n log n) 且常数系数小，实际性能通常最优
- **内存受限**：原地排序，空间复杂度仅 O(log n)
- **不要求稳定性**：如果不关心相同元素的相对顺序
- **数组随机分布**：在随机数据上表现最佳

**不适合的场景**：
- 数据基本有序（最坏情况）
- 需要稳定排序
- 对最坏情况性能有严格要求

## 与其他排序算法的比较

| 算法 | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 | 稳定性 |
|------|--------------|--------------|-----------|--------|
| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |

**与归并排序比较**：
- 快速排序平均常数系数更小，实际运行更快
- 快速排序空间复杂度更低 O(log n) vs O(n)
- 归并排序最坏情况更优 O(n log n) vs O(n²)
- 归并排序是稳定的，快速排序不稳定

**与堆排序比较**：
- 快速排序平均更快（缓存友好性更好）
- 堆排序最坏情况 O(n log n)，空间 O(1)，两者都优于快速排序
- 实际中快速排序因局部性原理表现更好

**为什么快速排序最受欢迎**：
1. 平均性能最优，常数系数小
2. 原地排序，空间开销低
3. 缓存友好性好（顺序访问内存）
4. 可以通过随机化避免最坏情况
5. 工程实现中常与插入排序结合（IntroSort），兼顾最坏情况保证
