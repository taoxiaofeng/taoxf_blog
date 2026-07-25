---
title: "散列表"
date: "2024-11-11"
tags: ["数据结构", "算法", "基础"]
category: "算法"
difficulty: "基础"
excerpt: "散列表通过散列函数将键映射到数组位置，实现近乎常数时间的查找、插入和删除操作"
visualgoUrl: "https://visualgo.net/zh/hashtable"
---

## 概述

散列表（Hash Table），也称哈希表，是一种通过散列函数（Hash Function）将键（Key）映射到数组下标的数据结构。它提供了平均 O(1) 时间复杂度的查找、插入和删除操作，是实现字典（Dictionary）和集合（Set）的核心数据结构。

散列表的主要用途包括：
- 数据库索引
- 缓存系统（如 Redis）
- 编译器中的符号表
- 路由表查找
- 去重和计数
- 各编程语言内置的 Map/Dict 实现

## 基本原理

### 散列函数

散列函数将任意大小的键映射为固定范围的整数（数组下标）。一个好的散列函数应满足：
- **确定性**：相同输入始终产生相同输出
- **均匀性**：输出尽可能均匀分布
- **高效性**：计算速度快

常见散列函数设计：
- **除留余数法**：`h(key) = key % tableSize`
- **乘法散列**：`h(key) = floor(tableSize * (key * A % 1))`，A 推荐取 0.6180339887
- **字符串散列**：多项式滚动哈希，如 `hash = hash * 31 + char`

### 冲突解决

当两个不同的键映射到同一位置时，称为**散列冲突**。主要解决方法：

**1. 链地址法（Separate Chaining）：**
- 每个数组位置存储一个链表
- 冲突的元素都追加到对应链表中
- 查找时先定位到链表，再遍历链表

**2. 开放寻址法（Open Addressing）：**
- 所有元素都存在数组中
- 冲突时按照探测序列寻找下一个空位
- 线性探测：`h(key, i) = (h(key) + i) % size`
- 二次探测：`h(key, i) = (h(key) + i²) % size`
- 双重散列：`h(key, i) = (h1(key) + i * h2(key)) % size`

### 负载因子

负载因子 α = 已存储元素数 / 数组容量

- 链地址法：α 可以大于 1，但通常保持在 0.75 左右
- 开放寻址法：α 必须小于 1，通常达到 0.7 时触发扩容
- **扩容**：创建更大的数组（通常 2 倍），重新散列所有元素

## 核心操作

### 插入（Put）

1. 计算键的散列值：`index = hash(key) % capacity`
2. 检查该位置是否已有相同的键（更新值）
3. 如果冲突，根据冲突解决策略处理
4. 插入新的键值对
5. 检查负载因子，必要时扩容

### 查找（Get）

1. 计算键的散列值：`index = hash(key) % capacity`
2. 在对应位置查找键
3. 链地址法：遍历该位置的链表
4. 开放寻址法：沿探测序列查找
5. 找到则返回值，否则返回 null

### 删除（Remove）

1. 计算键的散列值定位到位置
2. 链地址法：从链表中移除节点
3. 开放寻址法：标记为"已删除"（不能直接清空，否则会断开探测链）

## 代码实现

### 链地址法实现

```java
public class HashTable<K, V> {
    private static class Entry<K, V> {
        K key;
        V value;
        Entry<K, V> next;

        Entry(K key, V value) {
            this.key = key;
            this.value = value;
            this.next = null;
        }
    }

    private Entry<K, V>[] table;
    private int size;
    private int capacity;
    private static final double LOAD_FACTOR_THRESHOLD = 0.75;

    @SuppressWarnings("unchecked")
    public HashTable(int capacity) {
        this.capacity = capacity;
        this.table = new Entry[capacity];
        this.size = 0;
    }

    public HashTable() {
        this(16);
    }

    private int hash(K key) {
        return Math.abs(key.hashCode()) % capacity;
    }

    // 插入/更新
    public void put(K key, V value) {
        if ((double) size / capacity >= LOAD_FACTOR_THRESHOLD) {
            resize();
        }
        int index = hash(key);
        Entry<K, V> current = table[index];
        while (current != null) {
            if (current.key.equals(key)) {
                current.value = value; // 更新已有键
                return;
            }
            current = current.next;
        }
        // 头插法插入新节点
        Entry<K, V> newEntry = new Entry<>(key, value);
        newEntry.next = table[index];
        table[index] = newEntry;
        size++;
    }

    // 查找
    public V get(K key) {
        int index = hash(key);
        Entry<K, V> current = table[index];
        while (current != null) {
            if (current.key.equals(key)) {
                return current.value;
            }
            current = current.next;
        }
        return null;
    }

    // 删除
    public boolean remove(K key) {
        int index = hash(key);
        Entry<K, V> current = table[index];
        Entry<K, V> prev = null;
        while (current != null) {
            if (current.key.equals(key)) {
                if (prev == null) {
                    table[index] = current.next;
                } else {
                    prev.next = current.next;
                }
                size--;
                return true;
            }
            prev = current;
            current = current.next;
        }
        return false;
    }

    // 扩容
    @SuppressWarnings("unchecked")
    private void resize() {
        int newCapacity = capacity * 2;
        Entry<K, V>[] newTable = new Entry[newCapacity];
        // 重新散列所有元素
        for (int i = 0; i < capacity; i++) {
            Entry<K, V> current = table[i];
            while (current != null) {
                Entry<K, V> next = current.next;
                int newIndex = Math.abs(current.key.hashCode()) % newCapacity;
                current.next = newTable[newIndex];
                newTable[newIndex] = current;
                current = next;
            }
        }
        table = newTable;
        capacity = newCapacity;
    }

    public boolean containsKey(K key) {
        return get(key) != null;
    }

    public int size() { return size; }
    public boolean isEmpty() { return size == 0; }
}
```

```python
class HashTable:
    def __init__(self, capacity=16):
        self._capacity = capacity
        self._size = 0
        self._table = [[] for _ in range(capacity)]
        self._load_factor_threshold = 0.75

    def _hash(self, key):
        """计算散列值"""
        return hash(key) % self._capacity

    def put(self, key, value):
        """插入或更新键值对"""
        if self._size / self._capacity >= self._load_factor_threshold:
            self._resize()

        index = self._hash(key)
        bucket = self._table[index]

        # 检查是否已存在该键
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)  # 更新
                return

        # 插入新键值对
        bucket.append((key, value))
        self._size += 1

    def get(self, key):
        """查找键对应的值"""
        index = self._hash(key)
        bucket = self._table[index]

        for k, v in bucket:
            if k == key:
                return v
        return None

    def remove(self, key):
        """删除键值对"""
        index = self._hash(key)
        bucket = self._table[index]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                self._size -= 1
                return True
        return False

    def _resize(self):
        """扩容：容量翻倍并重新散列"""
        old_table = self._table
        self._capacity *= 2
        self._table = [[] for _ in range(self._capacity)]
        self._size = 0

        for bucket in old_table:
            for key, value in bucket:
                self.put(key, value)

    def contains_key(self, key):
        """检查是否包含键"""
        return self.get(key) is not None

    def size(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def keys(self):
        """返回所有键"""
        result = []
        for bucket in self._table:
            for key, _ in bucket:
                result.append(key)
        return result
```

### 开放寻址法（线性探测）

```java
public class OpenAddressHashTable<K, V> {
    private K[] keys;
    private V[] values;
    private boolean[] deleted;
    private int size;
    private int capacity;

    @SuppressWarnings("unchecked")
    public OpenAddressHashTable(int capacity) {
        this.capacity = capacity;
        this.keys = (K[]) new Object[capacity];
        this.values = (V[]) new Object[capacity];
        this.deleted = new boolean[capacity];
        this.size = 0;
    }

    private int hash(K key) {
        return Math.abs(key.hashCode()) % capacity;
    }

    public void put(K key, V value) {
        if ((double) size / capacity >= 0.7) {
            throw new RuntimeException("需要扩容");
        }
        int index = hash(key);
        while (keys[index] != null && !deleted[index]) {
            if (keys[index].equals(key)) {
                values[index] = value;
                return;
            }
            index = (index + 1) % capacity;
        }
        keys[index] = key;
        values[index] = value;
        deleted[index] = false;
        size++;
    }

    public V get(K key) {
        int index = hash(key);
        while (keys[index] != null) {
            if (!deleted[index] && keys[index].equals(key)) {
                return values[index];
            }
            index = (index + 1) % capacity;
        }
        return null;
    }

    public boolean remove(K key) {
        int index = hash(key);
        while (keys[index] != null) {
            if (!deleted[index] && keys[index].equals(key)) {
                deleted[index] = true;
                size--;
                return true;
            }
            index = (index + 1) % capacity;
        }
        return false;
    }
}
```

## 复杂度分析

| 操作 | 平均时间复杂度 | 最坏时间复杂度 | 说明 |
|------|--------------|--------------|------|
| 查找（get） | O(1) | O(n) | 最坏情况所有键冲突 |
| 插入（put） | O(1) | O(n) | 包含扩容时为均摊 O(1) |
| 删除（remove） | O(1) | O(n) | 最坏需遍历整条链 |
| 扩容（resize） | O(n) | O(n) | 需重新散列所有元素 |

空间复杂度：O(n)，n 为存储的键值对数量。实际空间约为 n / α（α 为负载因子）。

## 适用场景

1. **字典/映射**：Python 的 dict、Java 的 HashMap
2. **数据库索引**：通过主键快速定位记录
3. **缓存系统**：键值存储如 Redis、Memcached
4. **去重**：快速判断元素是否已存在
5. **计数器**：统计词频、字符频率等
6. **两数之和**：经典算法题中用哈希表记录已遍历元素
7. **编译器符号表**：变量名到内存地址的映射

## 优缺点分析

### 优点

- **平均 O(1) 操作**：在负载因子合理时，增删查改都接近常数时间
- **灵活的键类型**：任何可哈希的对象都可作为键
- **实现简单**：基本实现代码量少，易于理解
- **广泛应用**：几乎所有编程语言都内置了哈希表实现

### 缺点

- **最坏 O(n)**：大量冲突时退化为链表遍历
- **空间浪费**：为降低冲突需要保持较低的负载因子
- **不支持有序操作**：无法高效地进行范围查询或按序遍历
- **扩容开销**：扩容时需要 O(n) 时间重新散列
- **散列函数依赖**：性能高度依赖散列函数的质量
- **不适合小数据集**：额外开销在数据量小时不划算
