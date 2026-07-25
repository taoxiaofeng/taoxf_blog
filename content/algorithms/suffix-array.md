---
title: "后缀数组"
date: "2024-11-19"
tags: ["字符串", "算法", "后缀数组", "深入"]
category: "算法"
difficulty: "深入"
excerpt: "掌握后缀数组的构建方法、LCP 数组及其在字符串匹配中的应用"
visualgoUrl: "https://visualgo.net/zh/suffixarray"
---

## 概述

后缀数组（Suffix Array）是字符串处理中一种强大的数据结构。对于字符串 S，后缀数组 SA 是 S 的所有后缀**按字典序排序**后的起始位置数组。

**核心概念：**
- **后缀**：字符串从某个位置到末尾的子串，如 "banana" 的后缀有 "banana", "anana", "nana", "ana", "na", "a"
- **后缀数组 SA**：所有后缀按字典序排列后对应的起始下标
- **名次数组 Rank**：SA 的逆数组，Rank[i] 表示后缀 i 的排名
- **LCP 数组**：相邻排名后缀的最长公共前缀长度

后缀数组可以在 O(n log n) 甚至 O(n) 时间内构建，配合 LCP 数组能高效解决字符串匹配、最长重复子串、最长公共子串等问题。

## 核心原理

### 后缀数组的构建（倍增法）

倍增法（Prefix Doubling）是构建后缀数组的经典方法，时间复杂度 O(n log²n) 或 O(n log n)：

1. 初始时按每个后缀的第一个字符排序
2. 每轮将比较长度翻倍：先按前 1 个字符排，再按前 2 个字符排，前 4 个字符排...
3. 每轮利用上一轮的排名作为关键字进行排序
4. 当比较长度 ≥ n 时，排序完成

**关键优化**：第 k 轮比较前 2^k 个字符时，可以将每个后缀的关键字拆分为 (rank[i], rank[i + 2^(k-1)])，利用上一轮结果。

### SA-IS 算法思想

SA-IS（Suffix Array by Induced Sorting）是线性时间 O(n) 构建后缀数组的算法：

1. 将后缀分为 S-type（小于型）和 L-type（大于型）
2. 找出所有 LMS（Left-Most S-type）后缀
3. 对 LMS 后缀排序（递归子问题）
4. 利用 LMS 排序结果**诱导排序**出所有后缀的顺序

### LCP 数组（Kasai 算法）

LCP（Longest Common Prefix）数组定义：`lcp[i]` 表示排名第 i 和第 i-1 的后缀的最长公共前缀长度。

Kasai 算法利用一个关键性质：**lcp[rank[i]] ≥ lcp[rank[i-1]] - 1**，实现 O(n) 时间构建。

## 执行步骤

### 示例字符串：S = "banana"

```
所有后缀:
i=0: "banana"
i=1: "anana"
i=2: "nana"
i=3: "ana"
i=4: "na"
i=5: "a"
```

### 倍增法构建过程

```
初始（按第1个字符排序）:
后缀        首字符  初始排名
"banana"     b       1
"anana"      a       0
"nana"       n       2
"ana"        a       0
"na"         n       2
"a"          a       0

第1轮（按前2个字符排序）:
关键字对: (rank[i], rank[i+1])
i=0: (1, 0) → "ba"
i=1: (0, 2) → "an"
i=2: (2, 0) → "na"
i=3: (0, 2) → "an"
i=4: (2, 0) → "na"
i=5: (0, -) → "a$"  (超出部分视为最小)

排序后:
i=5: (0, -)  rank=0  "a"
i=1: (0, 2)  rank=1  "an"
i=3: (0, 2)  rank=1  "an"
i=0: (1, 0)  rank=2  "ba"
i=2: (2, 0)  rank=3  "na"
i=4: (2, 0)  rank=3  "na"

第2轮（按前4个字符排序）:
关键字对: (新rank[i], 新rank[i+2])
i=5: (0, -)       → 0
i=1: (1, rank[3])=(1,1) → "anan"
i=3: (1, rank[5])=(1,0) → "ana$"
i=0: (2, rank[2])=(2,3) → "bana"
i=2: (3, rank[4])=(3,3) → "nana"
i=4: (3, rank[6])=(3,-) → "na$"

排序后:
SA = [5, 3, 1, 0, 4, 2]

最终后缀数组:
SA[0]=5: "a"
SA[1]=3: "ana"
SA[2]=1: "anana"
SA[3]=0: "banana"
SA[4]=4: "na"
SA[5]=2: "nana"
```

### LCP 数组计算（Kasai 算法）

```
SA = [5, 3, 1, 0, 4, 2]
Rank = [3, 2, 5, 1, 4, 0]  (SA的逆)

按原始顺序计算 LCP:
i=0 (rank=3): 比较 SA[3]="banana" 和 SA[2]="anana" → lcp=0
i=1 (rank=2): 比较 SA[2]="anana" 和 SA[1]="ana" → lcp=3
i=2 (rank=5): 比较 SA[5]="nana" 和 SA[4]="na" → lcp=2
i=3 (rank=1): 比较 SA[1]="ana" 和 SA[0]="a" → lcp=1
i=4 (rank=4): 比较 SA[4]="na" 和 SA[3]="banana" → lcp=0
i=5 (rank=0): 第一名，lcp=0

LCP 数组: [0, 1, 3, 0, 0, 2]
(lcp[i] = LCP(SA[i], SA[i-1]), lcp[0]=0)
```

## 代码实现

```java
import java.util.*;

public class SuffixArray {
    private int[] sa;    // 后缀数组
    private int[] rank;  // 名次数组
    private int[] lcp;   // LCP 数组
    private String s;

    public SuffixArray(String s) {
        this.s = s;
        buildSA();
        buildLCP();
    }

    // 倍增法构建后缀数组 O(n log^2 n)
    private void buildSA() {
        int n = s.length();
        sa = new int[n];
        rank = new int[n];
        int[] tmp = new int[n];

        // 初始化：按首字符排名
        for (int i = 0; i < n; i++) {
            sa[i] = i;
            rank[i] = s.charAt(i);
        }

        for (int k = 1; k < n; k <<= 1) {
            final int kk = k;
            final int[] rk = rank.clone();

            // 按双关键字排序
            Integer[] order = new Integer[n];
            for (int i = 0; i < n; i++) order[i] = i;
            Arrays.sort(order, (a, b) -> {
                if (rk[a] != rk[b]) return rk[a] - rk[b];
                int ra = a + kk < n ? rk[a + kk] : -1;
                int rb = b + kk < n ? rk[b + kk] : -1;
                return ra - rb;
            });

            for (int i = 0; i < n; i++) sa[i] = order[i];

            // 重新计算排名
            tmp[sa[0]] = 0;
            for (int i = 1; i < n; i++) {
                int prev = sa[i - 1], curr = sa[i];
                int rPrev2 = prev + kk < n ? rk[prev + kk] : -1;
                int rCurr2 = curr + kk < n ? rk[curr + kk] : -1;
                tmp[curr] = tmp[prev];
                if (rk[prev] != rk[curr] || rPrev2 != rCurr2) {
                    tmp[curr]++;
                }
            }
            System.arraycopy(tmp, 0, rank, 0, n);

            if (rank[sa[n - 1]] == n - 1) break; // 所有排名唯一
        }
    }

    // Kasai 算法构建 LCP 数组 O(n)
    private void buildLCP() {
        int n = s.length();
        lcp = new int[n];
        int[] invSA = new int[n]; // rank 数组

        for (int i = 0; i < n; i++) invSA[sa[i]] = i;

        int h = 0;
        for (int i = 0; i < n; i++) {
            if (invSA[i] == 0) {
                h = 0;
                continue;
            }
            int j = sa[invSA[i] - 1];
            while (i + h < n && j + h < n && s.charAt(i + h) == s.charAt(j + h)) {
                h++;
            }
            lcp[invSA[i]] = h;
            if (h > 0) h--;
        }
    }

    // 使用后缀数组进行模式匹配 O(m log n)
    public int search(String pattern) {
        int n = s.length(), m = pattern.length();
        int lo = 0, hi = n - 1;

        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            String suffix = s.substring(sa[mid], Math.min(sa[mid] + m, n));
            int cmp = suffix.compareTo(pattern);
            if (cmp == 0) return sa[mid];
            else if (cmp < 0) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1; // 未找到
    }

    // 最长重复子串
    public String longestRepeatedSubstring() {
        int maxLen = 0, idx = 0;
        for (int i = 1; i < lcp.length; i++) {
            if (lcp[i] > maxLen) {
                maxLen = lcp[i];
                idx = sa[i];
            }
        }
        return maxLen > 0 ? s.substring(idx, idx + maxLen) : "";
    }

    public int[] getSA() { return sa; }
    public int[] getLCP() { return lcp; }

    public static void main(String[] args) {
        SuffixArray suffArr = new SuffixArray("banana");
        System.out.println("SA: " + Arrays.toString(suffArr.getSA()));
        System.out.println("LCP: " + Arrays.toString(suffArr.getLCP()));
        System.out.println("搜索 'ana': 位置 " + suffArr.search("ana"));
        System.out.println("最长重复子串: " + suffArr.longestRepeatedSubstring());
    }
}
```

```python
from typing import List, Tuple

class SuffixArray:
    """后缀数组（倍增法构建 + Kasai LCP）"""

    def __init__(self, s: str):
        self.s = s
        self.n = len(s)
        self.sa = self._build_sa()
        self.rank = [0] * self.n
        for i, v in enumerate(self.sa):
            self.rank[v] = i
        self.lcp = self._build_lcp()

    def _build_sa(self) -> List[int]:
        """倍增法构建后缀数组 O(n log^2 n)"""
        n = self.n
        sa = list(range(n))
        rank = [ord(c) for c in self.s]
        tmp = [0] * n

        k = 1
        while k < n:
            def compare(a, b):
                if rank[a] != rank[b]:
                    return rank[a] - rank[b]
                ra = rank[a + k] if a + k < n else -1
                rb = rank[b + k] if b + k < n else -1
                return ra - rb

            from functools import cmp_to_key
            sa.sort(key=cmp_to_key(compare))

            # 重新计算排名
            tmp[sa[0]] = 0
            for i in range(1, n):
                prev, curr = sa[i - 1], sa[i]
                r_prev2 = rank[prev + k] if prev + k < n else -1
                r_curr2 = rank[curr + k] if curr + k < n else -1
                tmp[curr] = tmp[prev]
                if rank[prev] != rank[curr] or r_prev2 != r_curr2:
                    tmp[curr] += 1

            rank = tmp[:]
            if rank[sa[-1]] == n - 1:
                break
            k <<= 1

        return sa

    def _build_lcp(self) -> List[int]:
        """Kasai 算法构建 LCP 数组 O(n)"""
        n = self.n
        lcp = [0] * n
        h = 0

        for i in range(n):
            if self.rank[i] == 0:
                h = 0
                continue
            j = self.sa[self.rank[i] - 1]
            while i + h < n and j + h < n and self.s[i + h] == self.s[j + h]:
                h += 1
            lcp[self.rank[i]] = h
            if h > 0:
                h -= 1

        return lcp

    def search(self, pattern: str) -> int:
        """二分查找模式串 O(m log n)"""
        m = len(pattern)
        lo, hi = 0, self.n - 1

        while lo <= hi:
            mid = (lo + hi) // 2
            suffix = self.s[self.sa[mid]:self.sa[mid] + m]
            if suffix == pattern:
                return self.sa[mid]
            elif suffix < pattern:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1

    def longest_repeated_substring(self) -> str:
        """最长重复子串"""
        max_len = 0
        idx = 0
        for i in range(1, self.n):
            if self.lcp[i] > max_len:
                max_len = self.lcp[i]
                idx = self.sa[i]
        return self.s[idx:idx + max_len] if max_len > 0 else ""

    def longest_common_substring(self, t: str) -> str:
        """两个字符串的最长公共子串"""
        # 拼接两个字符串，用特殊分隔符
        combined = self.s + "#" + t
        sa_combined = SuffixArray(combined)
        n1 = self.n

        max_len = 0
        result = ""
        for i in range(1, len(combined)):
            # 相邻后缀分属两个字符串
            pos1 = sa_combined.sa[i]
            pos2 = sa_combined.sa[i - 1]
            if (pos1 < n1) != (pos2 < n1):  # 分属不同字符串
                if sa_combined.lcp[i] > max_len:
                    max_len = sa_combined.lcp[i]
                    result = combined[pos1:pos1 + max_len]

        return result


if __name__ == "__main__":
    sa = SuffixArray("banana")
    print(f"后缀数组 SA: {sa.sa}")
    print(f"LCP 数组: {sa.lcp}")
    print(f"搜索 'ana': 位置 {sa.search('ana')}")
    print(f"最长重复子串: '{sa.longest_repeated_substring()}'")

    # 最长公共子串示例
    sa2 = SuffixArray("abcde")
    lcs = sa2.longest_common_substring("cdefg")
    print(f"最长公共子串: '{lcs}'")
```

## 复杂度分析

| 操作 | 时间复杂度 | 空间复杂度 |
|------|-----------|-----------|
| 构建 SA（倍增法） | O(n log²n) | O(n) |
| 构建 SA（DC3/SA-IS） | O(n) | O(n) |
| 构建 LCP（Kasai） | O(n) | O(n) |
| 模式匹配 | O(m log n) | O(1) |
| 最长重复子串 | O(n)（LCP 最大值） | O(1) |

- 倍增法排序可以用基数排序优化到 O(n log n)
- SA-IS 是实践中最快的线性构建算法
- 相比后缀树，后缀数组空间更优且缓存友好

## 实际应用

### 工程应用

1. **全文检索**：搜索引擎中的后缀索引加速模式匹配
2. **数据压缩**：BWT（Burrows-Wheeler Transform）基于后缀数组实现
3. **生物信息学**：DNA/蛋白质序列比对、重复片段检测
4. **日志分析**：在大量日志文本中快速搜索模式
5. **版本控制**：文件差异比较（diff 算法）

### 竞赛应用

1. **最长重复子串**：LCP 数组最大值
2. **不同子串个数**：n(n+1)/2 - sum(lcp[i])
3. **最长公共子串**：两串拼接后 LCP 数组中相邻且分属不同串的最大值
4. **最长回文子串**：正串和反串拼接后求 LCS
5. **子串排名**：后缀数组上二分查找

## 变体与扩展

### 1. 增强后缀数组

后缀数组 + LCP 数组 + RMQ（区间最小值查询）可以在 O(1) 时间查询任意两个后缀的 LCP，功能等价于后缀树。

### 2. 后缀自动机（SAM）

后缀自动机是一种更强大的字符串数据结构，支持在线构建，可以在 O(n) 时间内解决后缀数组能解决的大多数问题，且支持更多操作（如子串计数、最短唯一子串等）。

### 3. 广义后缀数组

对多个字符串同时构建后缀数组，用不同的分隔符连接。适用于多模式匹配和多串公共子串问题。

### 4. 后缀树

后缀树是后缀 Trie 的压缩版本，与后缀数组等价但占用更多空间。Ukkonen 算法可以在 O(n) 时间在线构建后缀树。后缀数组是后缀树的空间优化替代方案。
