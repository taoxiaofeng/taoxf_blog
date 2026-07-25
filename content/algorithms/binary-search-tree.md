---
title: "二叉搜索树"
date: "2024-11-12"
tags: ["数据结构", "算法", "基础"]
category: "算法"
difficulty: "基础"
excerpt: "二叉搜索树是一种有序二叉树，利用左小右大的性质实现高效的查找、插入和删除操作"
visualgoUrl: "https://visualgo.net/zh/bst"
---

## 概述

二叉搜索树（Binary Search Tree，BST）是一种特殊的二叉树，对于树中的每个节点，其左子树所有节点的值小于该节点的值，右子树所有节点的值大于该节点的值。这一性质使得 BST 能够高效地支持查找、插入和删除操作。

二叉搜索树的主要用途包括：
- 实现有序映射（TreeMap）和有序集合（TreeSet）
- 数据库索引结构的基础
- 支持范围查询和有序遍历
- 动态维护有序数据集
- 作为更高级平衡树（AVL、红黑树）的基础

## 基本原理

### BST 性质

对于 BST 中的任意节点 N：
- **左子树**中所有节点的值 **< N 的值**
- **右子树**中所有节点的值 **> N 的值**
- 左右子树也分别是二叉搜索树
- 通常不允许重复值（或将重复值放入左/右子树）

### 中序遍历有序性

BST 的**中序遍历**（左-根-右）结果是一个**升序序列**。这是 BST 最重要的性质之一，可以用来验证一棵树是否是 BST。

### 节点结构

每个节点包含：
- 数据值（key/value）
- 左子节点指针（left）
- 右子节点指针（right）
- 可选：父节点指针（parent）

## 核心操作

### 查找（Search）

1. 从根节点开始
2. 如果目标值等于当前节点值，找到目标
3. 如果目标值小于当前节点值，递归搜索左子树
4. 如果目标值大于当前节点值，递归搜索右子树
5. 如果到达 null 节点，目标不存在

### 插入（Insert）

1. 从根节点开始，按查找规则定位到适当位置
2. 如果目标值小于当前节点，向左走
3. 如果目标值大于当前节点，向右走
4. 当到达 null 位置时，创建新节点并插入

### 删除（Delete）

删除操作是 BST 中最复杂的操作，分三种情况：

**情况 1：删除叶节点（无子节点）**
- 直接删除该节点，将父节点对应指针设为 null

**情况 2：删除只有一个子节点的节点**
- 用其唯一子节点替代被删除节点

**情况 3：删除有两个子节点的节点**
- 找到该节点的**中序后继**（右子树中最小节点）或**中序前驱**（左子树中最大节点）
- 用后继/前驱的值替换被删除节点的值
- 删除后继/前驱节点（回到情况 1 或 2）

### 遍历

- **前序遍历**（Pre-order）：根 → 左 → 右
- **中序遍历**（In-order）：左 → 根 → 右（得到有序序列）
- **后序遍历**（Post-order）：左 → 右 → 根

## 代码实现

```java
public class BinarySearchTree<T extends Comparable<T>> {
    private Node<T> root;

    private static class Node<T> {
        T data;
        Node<T> left, right;

        Node(T data) {
            this.data = data;
            this.left = null;
            this.right = null;
        }
    }

    public BinarySearchTree() {
        this.root = null;
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
        }
        // cmp == 0 时不插入（不允许重复）
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
            // 情况1和2：无子节点或只有一个子节点
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;

            // 情况3：有两个子节点
            // 找到中序后继（右子树最小值）
            Node<T> successor = findMin(node.right);
            node.data = successor.data;
            node.right = deleteRec(node.right, successor.data);
        }
        return node;
    }

    // 查找最小值节点
    private Node<T> findMin(Node<T> node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    // 查找最大值
    public T findMax() {
        if (root == null) throw new RuntimeException("树为空");
        Node<T> node = root;
        while (node.right != null) {
            node = node.right;
        }
        return node.data;
    }

    // 中序遍历（有序输出）
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

    // 前序遍历
    public void preorderTraversal() {
        preorderRec(root);
        System.out.println();
    }

    private void preorderRec(Node<T> node) {
        if (node != null) {
            System.out.print(node.data + " ");
            preorderRec(node.left);
            preorderRec(node.right);
        }
    }

    // 后序遍历
    public void postorderTraversal() {
        postorderRec(root);
        System.out.println();
    }

    private void postorderRec(Node<T> node) {
        if (node != null) {
            postorderRec(node.left);
            postorderRec(node.right);
            System.out.print(node.data + " ");
        }
    }

    // 获取树的高度
    public int height() {
        return heightRec(root);
    }

    private int heightRec(Node<T> node) {
        if (node == null) return -1;
        return 1 + Math.max(heightRec(node.left), heightRec(node.right));
    }
}
```

```python
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, data):
        """插入节点"""
        self.root = self._insert_rec(self.root, data)

    def _insert_rec(self, node, data):
        if node is None:
            return TreeNode(data)
        if data < node.data:
            node.left = self._insert_rec(node.left, data)
        elif data > node.data:
            node.right = self._insert_rec(node.right, data)
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
            # 情况1和2
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left

            # 情况3：找到中序后继
            successor = self._find_min(node.right)
            node.data = successor.data
            node.right = self._delete_rec(node.right, successor.data)

        return node

    def _find_min(self, node):
        """找到子树中的最小节点"""
        while node.left:
            node = node.left
        return node

    def find_max(self):
        """查找最大值"""
        if not self.root:
            raise ValueError("树为空")
        node = self.root
        while node.right:
            node = node.right
        return node.data

    def inorder_traversal(self):
        """中序遍历（有序输出）"""
        result = []
        self._inorder_rec(self.root, result)
        return result

    def _inorder_rec(self, node, result):
        if node:
            self._inorder_rec(node.left, result)
            result.append(node.data)
            self._inorder_rec(node.right, result)

    def preorder_traversal(self):
        """前序遍历"""
        result = []
        self._preorder_rec(self.root, result)
        return result

    def _preorder_rec(self, node, result):
        if node:
            result.append(node.data)
            self._preorder_rec(node.left, result)
            self._preorder_rec(node.right, result)

    def postorder_traversal(self):
        """后序遍历"""
        result = []
        self._postorder_rec(self.root, result)
        return result

    def _postorder_rec(self, node, result):
        if node:
            self._postorder_rec(node.left, result)
            self._postorder_rec(node.right, result)
            result.append(node.data)

    def height(self):
        """获取树的高度"""
        return self._height_rec(self.root)

    def _height_rec(self, node):
        if node is None:
            return -1
        return 1 + max(self._height_rec(node.left), self._height_rec(node.right))
```

## 复杂度分析

| 操作 | 平均时间复杂度 | 最坏时间复杂度 | 说明 |
|------|--------------|--------------|------|
| 查找 | O(log n) | O(n) | 最坏：退化为链表 |
| 插入 | O(log n) | O(n) | 取决于树的高度 |
| 删除 | O(log n) | O(n) | 包含查找后继 |
| 遍历 | O(n) | O(n) | 需访问所有节点 |
| 最小/最大值 | O(log n) | O(n) | 沿一侧走到底 |

空间复杂度：O(n) 存储 n 个节点。递归操作的栈空间为 O(h)，h 为树高。

**注**：最坏情况发生在数据有序插入时，BST 退化为链表，高度为 n。这就是为什么需要平衡二叉搜索树（如 AVL 树、红黑树）。

## 适用场景

1. **有序映射**：Java 的 TreeMap、C++ 的 std::map
2. **范围查询**：找出所有在 [a, b] 范围内的元素
3. **动态排序**：数据流中维护有序集合
4. **文件系统**：目录结构的组织
5. **数据库 B 树索引**：B 树是 BST 的多路推广
6. **表达式树**：编译器中解析算术表达式

## 优缺点分析

### 优点

- **有序性**：中序遍历得到有序序列，支持范围查询
- **动态维护**：可以高效地动态插入和删除
- **平均性能好**：随机数据下操作为 O(log n)
- **结构灵活**：支持多种遍历方式
- **实现简单**：基本操作的递归实现清晰直观

### 缺点

- **最坏退化**：有序数据插入会退化为链表，操作变为 O(n)
- **不自平衡**：普通 BST 不保证平衡，需要额外机制（AVL、红黑树）
- **指针开销**：每个节点需要存储左右子节点指针
- **缓存不友好**：节点在内存中分散，不利于 CPU 缓存
- **不支持高效的第 K 小元素查询**：需要额外维护子树大小
