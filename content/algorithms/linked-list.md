---
title: "链表"
date: "2024-11-08"
tags: ["数据结构", "算法", "基础"]
category: "算法"
difficulty: "基础"
excerpt: "链表是一种通过指针链接节点的线性数据结构，支持高效的动态插入和删除操作"
visualgoUrl: "https://visualgo.net/zh/list"
---

## 概述

链表（Linked List）是一种基础的线性数据结构，由一系列节点组成，每个节点包含数据域和指向下一个节点的指针。与数组不同，链表的元素在内存中不需要连续存储，通过指针将各个节点串联起来。

链表的主要用途包括：
- 需要频繁插入和删除的场景
- 实现其他数据结构（如栈、队列、哈希表的链地址法）
- 内存动态分配，无需预先确定大小
- 操作系统中的内存管理和进程调度

## 基本原理

### 单链表

单链表中每个节点包含两个部分：
- **数据域（data）**：存储节点的值
- **指针域（next）**：指向下一个节点的引用

链表通过一个头指针（head）来标识链表的起始位置，最后一个节点的 next 指向 null。

### 双链表

双链表在单链表基础上增加了一个前驱指针：
- **数据域（data）**：存储节点的值
- **前驱指针（prev）**：指向前一个节点
- **后继指针（next）**：指向下一个节点

双链表支持双向遍历，删除操作更加高效。

## 核心操作

### 插入操作

**头部插入：**
1. 创建新节点，设置数据值
2. 将新节点的 next 指向当前 head
3. 更新 head 为新节点

**尾部插入：**
1. 创建新节点，设置数据值
2. 遍历链表找到最后一个节点
3. 将最后一个节点的 next 指向新节点

**中间插入（在第 k 个位置）：**
1. 遍历到第 k-1 个节点
2. 新节点的 next 指向第 k 个节点
3. 第 k-1 个节点的 next 指向新节点

### 删除操作

1. 找到待删除节点的前驱节点
2. 将前驱节点的 next 指向待删除节点的 next
3. 释放待删除节点的内存（在有 GC 的语言中可省略）

### 查找操作

从 head 开始，逐个比较节点的数据值，直到找到目标或到达链表末尾。

### 反转操作

1. 初始化 prev = null, curr = head
2. 遍历链表，对每个节点：将 curr.next 保存为 temp，curr.next 指向 prev，prev 移动到 curr，curr 移动到 temp
3. 最终 head = prev

## 代码实现

### 单链表

```java
public class LinkedList<T> {
    private Node<T> head;
    private int size;

    private static class Node<T> {
        T data;
        Node<T> next;

        Node(T data) {
            this.data = data;
            this.next = null;
        }
    }

    public LinkedList() {
        this.head = null;
        this.size = 0;
    }

    // 头部插入
    public void insertAtHead(T data) {
        Node<T> newNode = new Node<>(data);
        newNode.next = head;
        head = newNode;
        size++;
    }

    // 尾部插入
    public void insertAtTail(T data) {
        Node<T> newNode = new Node<>(data);
        if (head == null) {
            head = newNode;
        } else {
            Node<T> curr = head;
            while (curr.next != null) {
                curr = curr.next;
            }
            curr.next = newNode;
        }
        size++;
    }

    // 指定位置插入
    public void insertAt(int index, T data) {
        if (index < 0 || index > size) throw new IndexOutOfBoundsException();
        if (index == 0) { insertAtHead(data); return; }
        Node<T> curr = head;
        for (int i = 0; i < index - 1; i++) {
            curr = curr.next;
        }
        Node<T> newNode = new Node<>(data);
        newNode.next = curr.next;
        curr.next = newNode;
        size++;
    }

    // 删除指定值
    public boolean delete(T data) {
        if (head == null) return false;
        if (head.data.equals(data)) {
            head = head.next;
            size--;
            return true;
        }
        Node<T> curr = head;
        while (curr.next != null && !curr.next.data.equals(data)) {
            curr = curr.next;
        }
        if (curr.next != null) {
            curr.next = curr.next.next;
            size--;
            return true;
        }
        return false;
    }

    // 查找
    public boolean search(T data) {
        Node<T> curr = head;
        while (curr != null) {
            if (curr.data.equals(data)) return true;
            curr = curr.next;
        }
        return false;
    }

    // 反转链表
    public void reverse() {
        Node<T> prev = null;
        Node<T> curr = head;
        while (curr != null) {
            Node<T> next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        head = prev;
    }

    public int getSize() { return size; }
}
```

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def insert_at_head(self, data):
        """头部插入"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self.size += 1

    def insert_at_tail(self, data):
        """尾部插入"""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
        else:
            curr = self.head
            while curr.next:
                curr = curr.next
            curr.next = new_node
        self.size += 1

    def insert_at(self, index, data):
        """指定位置插入"""
        if index < 0 or index > self.size:
            raise IndexError("索引越界")
        if index == 0:
            self.insert_at_head(data)
            return
        curr = self.head
        for _ in range(index - 1):
            curr = curr.next
        new_node = Node(data)
        new_node.next = curr.next
        curr.next = new_node
        self.size += 1

    def delete(self, data):
        """删除指定值的节点"""
        if not self.head:
            return False
        if self.head.data == data:
            self.head = self.head.next
            self.size -= 1
            return True
        curr = self.head
        while curr.next and curr.next.data != data:
            curr = curr.next
        if curr.next:
            curr.next = curr.next.next
            self.size -= 1
            return True
        return False

    def search(self, data):
        """查找元素"""
        curr = self.head
        while curr:
            if curr.data == data:
                return True
            curr = curr.next
        return False

    def reverse(self):
        """反转链表"""
        prev = None
        curr = self.head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        self.head = prev

    def __len__(self):
        return self.size
```

## 复杂度分析

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 头部插入 | O(1) | 直接修改 head 指针 |
| 尾部插入 | O(n) | 需遍历到末尾（无尾指针时） |
| 中间插入（已定位） | O(1) | 修改指针即可 |
| 中间插入（未定位） | O(n) | 需先遍历找到位置 |
| 删除（已定位） | O(1) | 修改前驱指针 |
| 删除（未定位） | O(n) | 需先查找节点 |
| 查找 | O(n) | 最坏需遍历整个链表 |
| 反转 | O(n) | 需遍历所有节点 |

空间复杂度：O(n)，n 为节点数量。

## 适用场景

1. **LRU 缓存**：使用双链表 + 哈希表实现 O(1) 的缓存淘汰
2. **多项式运算**：用链表表示多项式各项
3. **大数运算**：链表存储超长整数的每一位
4. **浏览器历史记录**：双链表实现前进/后退
5. **操作系统内存管理**：空闲内存块链表
6. **音乐播放列表**：循环链表实现循环播放

## 优缺点分析

### 优点

- **动态大小**：不需要预先分配固定空间，可按需增减
- **高效插入/删除**：在已知位置的情况下，插入和删除操作为 O(1)
- **内存利用灵活**：不需要连续的内存空间
- **无需移动元素**：插入或删除时不需要像数组那样移动后续元素

### 缺点

- **不支持随机访问**：访问第 k 个元素需要从头遍历，时间为 O(n)
- **额外内存开销**：每个节点需要额外存储指针
- **缓存不友好**：节点在内存中不连续，CPU 缓存命中率低
- **反向遍历困难**：单链表不支持反向遍历（双链表可以但增加内存开销）
