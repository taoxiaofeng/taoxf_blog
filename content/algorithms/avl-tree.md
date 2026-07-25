---
title: "AVL 树"
date: "2024-11-13"
tags: ["数据结构", "算法", "基础"]
category: "算法"
difficulty: "基础"
excerpt: "AVL 树是一种自平衡二叉搜索树，通过旋转操作保持树的高度平衡，确保所有操作为 O(log n)"
visualgoUrl: "https://visualgo.net/zh/bst"
---

## 概述

AVL 树是由 Adelson-Velsky 和 Landis 在 1962 年发明的自平衡二叉搜索树。它在普通 BST 的基础上引入了**平衡因子**的概念，通过旋转操作保证任意节点的左右子树高度差不超过 1，从而确保树的高度始终为 O(log n)。

AVL 树的主要用途包括：
- 需要严格 O(log n) 保证的查找操作
- 数据库索引中需要高效查找的场景
- 内存中的有序字典实现
- 需要频繁查找但插入/删除较少的场景
- 实时系统中对响应时间有严格要求的场景

## 基本原理

### 平衡因子（Balance Factor）

每个节点的平衡因子 = 左子树高度 - 右子树高度

AVL 树要求每个节点的平衡因子只能是 **-1、0 或 1**。当插入或删除导致某节点的平衡因子变为 -2 或 2 时，需要通过旋转来恢复平衡。

### 旋转操作

AVL 树通过四种旋转操作恢复平衡：

**1. LL 旋转（右旋）**
- 失衡原因：在左子树的左子树插入导致不平衡
- 操作：对失衡节点进行右旋
- 步骤：将左子节点提升为根，原根成为右子节点

**2. RR 旋转（左旋）**
- 失衡原因：在右子树的右子树插入导致不平衡
- 操作：对失衡节点进行左旋
- 步骤：将右子节点提升为根，原根成为左子节点

**3. LR 旋转（先左旋后右旋）**
- 失衡原因：在左子树的右子树插入导致不平衡
- 操作：先对左子节点左旋，再对失衡节点右旋

**4. RL 旋转（先右旋后左旋）**
- 失衡原因：在右子树的左子树插入导致不平衡
- 操作：先对右子节点右旋，再对失衡节点左旋

### 高度与节点数关系

AVL 树的高度 h 与节点数 n 的关系：
- 高度为 h 的 AVL 树最少有 F(h+3) - 1 个节点（F 为斐波那契数列）
- n 个节点的 AVL 树高度不超过 1.44 * log₂(n+2)

## 核心操作

### 插入操作

1. 按 BST 规则插入新节点
2. 从插入点向上回溯，更新每个祖先节点的高度
3. 检查每个祖先节点的平衡因子
4. 如果发现失衡（平衡因子为 ±2），判断类型并执行对应旋转：
   - 平衡因子 = 2 且左子节点平衡因子 ≥ 0：LL 旋转
   - 平衡因子 = 2 且左子节点平衡因子 < 0：LR 旋转
   - 平衡因子 = -2 且右子节点平衡因子 ≤ 0：RR 旋转
   - 平衡因子 = -2 且右子节点平衡因子 > 0：RL 旋转

### 删除操作

1. 按 BST 规则删除节点
2. 从删除点向上回溯，更新高度
3. 检查每个祖先节点的平衡因子
4. 对每个失衡节点执行旋转（注意：删除可能需要多次旋转）

### 查找操作

与普通 BST 完全相同，但由于树始终保持平衡，保证 O(log n)。

## 代码实现

```java
public class AVLTree<T extends Comparable<T>> {
    private Node<T> root;

    private static class Node<T> {
        T data;
        Node<T> left, right;
        int height;

        Node(T data) {
            this.data = data;
            this.left = null;
            this.right = null;
            this.height = 0;
        }
    }

    // 获取节点高度
    private int height(Node<T> node) {
        return node == null ? -1 : node.height;
    }

    // 获取平衡因子
    private int getBalanceFactor(Node<T> node) {
        if (node == null) return 0;
        return height(node.left) - height(node.right);
    }

    // 更新节点高度
    private void updateHeight(Node<T> node) {
        node.height = 1 + Math.max(height(node.left), height(node.right));
    }

    // 右旋（LL 旋转）
    private Node<T> rotateRight(Node<T> y) {
        Node<T> x = y.left;
        Node<T> T2 = x.right;

        // 执行旋转
        x.right = y;
        y.left = T2;

        // 更新高度
        updateHeight(y);
        updateHeight(x);

        return x; // 新的根节点
    }

    // 左旋（RR 旋转）
    private Node<T> rotateLeft(Node<T> x) {
        Node<T> y = x.right;
        Node<T> T2 = y.left;

        // 执行旋转
        y.left = x;
        x.right = T2;

        // 更新高度
        updateHeight(x);
        updateHeight(y);

        return y; // 新的根节点
    }

    // 平衡节点
    private Node<T> balance(Node<T> node) {
        updateHeight(node);
        int bf = getBalanceFactor(node);

        // LL 情况：左子树过高，且左子节点的左子树较高
        if (bf > 1 && getBalanceFactor(node.left) >= 0) {
            return rotateRight(node);
        }

        // LR 情况：左子树过高，且左子节点的右子树较高
        if (bf > 1 && getBalanceFactor(node.left) < 0) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }

        // RR 情况：右子树过高，且右子节点的右子树较高
        if (bf < -1 && getBalanceFactor(node.right) <= 0) {
            return rotateLeft(node);
        }

        // RL 情况：右子树过高，且右子节点的左子树较高
        if (bf < -1 && getBalanceFactor(node.right) > 0) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }

        return node; // 已平衡
    }

    // 插入
    public void insert(T data) {
        root = insertRec(root, data);
    }

    private Node<T> insertRec(Node<T> node, T data) {
        if (node == null) {
            return new Node<>(data);
        }

        int cmp = data.compareTo(node.data);
        if (cmp < 0) {
            node.left = insertRec(node.left, data);
        } else if (cmp > 0) {
            node.right = insertRec(node.right, data);
        } else {
            return node; // 不允许重复
        }

        return balance(node);
    }

    // 删除
    public void delete(T data) {
        root = deleteRec(root, data);
    }

    private Node<T> deleteRec(Node<T> node, T data) {
        if (node == null) return null;

        int cmp = data.compareTo(node.data);
        if (cmp < 0) {
            node.left = deleteRec(node.left, data);
        } else if (cmp > 0) {
            node.right = deleteRec(node.right, data);
        } else {
            // 找到要删除的节点
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;

            // 有两个子节点：用中序后继替代
            Node<T> successor = findMin(node.right);
            node.data = successor.data;
            node.right = deleteRec(node.right, successor.data);
        }

        return balance(node);
    }

    private Node<T> findMin(Node<T> node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    // 查找
    public boolean search(T data) {
        return searchRec(root, data);
    }

    private boolean searchRec(Node<T> node, T data) {
        if (node == null) return false;
        int cmp = data.compareTo(node.data);
        if (cmp == 0) return true;
        if (cmp < 0) return searchRec(node.left, data);
        return searchRec(node.right, data);
    }

    // 中序遍历
    public void inorderTraversal() {
        inorderRec(root);
        System.out.println();
    }

    private void inorderRec(Node<T> node) {
        if (node != null) {
            inorderRec(node.left);
            System.out.print(node.data + " ");
            inorderRec(node.right);
        }
    }

    public int getHeight() {
        return height(root);
    }
}
```

```python
class AVLNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
        self.height = 0


class AVLTree:
    def __init__(self):
        self.root = None

    def _height(self, node):
        """获取节点高度"""
        if node is None:
            return -1
        return node.height

    def _get_balance_factor(self, node):
        """获取平衡因子"""
        if node is None:
            return 0
        return self._height(node.left) - self._height(node.right)

    def _update_height(self, node):
        """更新节点高度"""
        node.height = 1 + max(self._height(node.left), self._height(node.right))

    def _rotate_right(self, y):
        """右旋（LL 旋转）"""
        x = y.left
        t2 = x.right

        # 执行旋转
        x.right = y
        y.left = t2

        # 更新高度
        self._update_height(y)
        self._update_height(x)

        return x

    def _rotate_left(self, x):
        """左旋（RR 旋转）"""
        y = x.right
        t2 = y.left

        # 执行旋转
        y.left = x
        x.right = t2

        # 更新高度
        self._update_height(x)
        self._update_height(y)

        return y

    def _balance(self, node):
        """平衡节点"""
        self._update_height(node)
        bf = self._get_balance_factor(node)

        # LL 情况
        if bf > 1 and self._get_balance_factor(node.left) >= 0:
            return self._rotate_right(node)

        # LR 情况
        if bf > 1 and self._get_balance_factor(node.left) < 0:
            node.left = self._rotate_left(node.left)
            return self._rotate_right(node)

        # RR 情况
        if bf < -1 and self._get_balance_factor(node.right) <= 0:
            return self._rotate_left(node)

        # RL 情况
        if bf < -1 and self._get_balance_factor(node.right) > 0:
            node.right = self._rotate_right(node.right)
            return self._rotate_left(node)

        return node

    def insert(self, data):
        """插入节点"""
        self.root = self._insert_rec(self.root, data)

    def _insert_rec(self, node, data):
        if node is None:
            return AVLNode(data)

        if data < node.data:
            node.left = self._insert_rec(node.left, data)
        elif data > node.data:
            node.right = self._insert_rec(node.right, data)
        else:
            return node  # 不允许重复

        return self._balance(node)

    def delete(self, data):
        """删除节点"""
        self.root = self._delete_rec(self.root, data)

    def _delete_rec(self, node, data):
        if node is None:
            return None

        if data < node.data:
            node.left = self._delete_rec(node.left, data)
        elif data > node.data:
            node.right = self._delete_rec(node.right, data)
        else:
            # 找到要删除的节点
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left

            # 有两个子节点
            successor = self._find_min(node.right)
            node.data = successor.data
            node.right = self._delete_rec(node.right, successor.data)

        return self._balance(node)

    def _find_min(self, node):
        """找到子树中最小节点"""
        while node.left:
            node = node.left
        return node

    def search(self, data):
        """查找节点"""
        return self._search_rec(self.root, data)

    def _search_rec(self, node, data):
        if node is None:
            return False
        if data == node.data:
            return True
        elif data < node.data:
            return self._search_rec(node.left, data)
        else:
            return self._search_rec(node.right, data)

    def inorder_traversal(self):
        """中序遍历"""
        result = []
        self._inorder_rec(self.root, result)
        return result

    def _inorder_rec(self, node, result):
        if node:
            self._inorder_rec(node.left, result)
            result.append(node.data)
            self._inorder_rec(node.right, result)

    def get_height(self):
        """获取树的高度"""
        return self._height(self.root)
```

## 复杂度分析

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 查找 | O(log n) | 树高始终为 O(log n) |
| 插入 | O(log n) | 包含最多 O(log n) 次旋转 |
| 删除 | O(log n) | 可能需要多次旋转 |
| 遍历 | O(n) | 访问所有节点 |
| 旋转 | O(1) | 单次旋转为常数操作 |

空间复杂度：O(n) 存储 n 个节点，每个节点额外存储高度信息。

### 与普通 BST 对比

| 指标 | 普通 BST | AVL 树 |
|------|---------|--------|
| 查找最坏 | O(n) | O(log n) |
| 插入最坏 | O(n) | O(log n) |
| 删除最坏 | O(n) | O(log n) |
| 额外空间 | 无 | 每节点存高度 |
| 实现复杂度 | 简单 | 中等 |

## 适用场景

1. **数据库索引**：需要保证最坏情况下的查找效率
2. **内存字典**：查找操作远多于插入/删除时
3. **实时系统**：对操作时间有严格上界要求
4. **编译器符号表**：频繁查找标识符信息
5. **地理信息系统**：空间索引中的平衡树结构
6. **自动补全系统**：有序字典的高效查找

## 优缺点分析

### 优点

- **严格平衡**：所有操作保证 O(log n)，无退化风险
- **查找效率高**：比红黑树更加严格平衡，查找稍快
- **高度可预测**：高度最多为 1.44 * log₂(n+2)
- **有序性**：保持 BST 的所有有序性质

### 缺点

- **旋转开销**：插入和删除可能需要多次旋转
- **实现复杂**：比普通 BST 复杂，需维护平衡因子和旋转逻辑
- **写操作较慢**：相比红黑树，AVL 的插入/删除需要更多旋转
- **额外存储**：每个节点需要存储高度或平衡因子
- **不适合频繁修改**：如果插入/删除远多于查找，红黑树可能更优
