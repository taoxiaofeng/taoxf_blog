---
title: "原型模式"
date: "2024-10-04"
tags: ["创建型模式", "设计模式", "原型", "克隆"]
category: "设计模式"
patternType: "创建型模式"
excerpt: "原型是一种创建型设计模式，使你能够复制已有对象，而又无需使代码依赖它们所属的类。"
---

# 原型模式（Prototype）

**别名：** 克隆（Clone）

## 意图

**原型**是一种创建型设计模式，使你能够复制已有对象，而又无需使代码依赖它们所属的类。

## 问题

假如你有一个对象，你希望创建一个它的精确副本。你会怎么做？首先，你需要创建一个属于相同类的新对象。然后你需要遍历原始对象的所有字段，将其值复制到新对象中。

不错！但有个问题。并非所有对象都能通过这种方式复制，因为有些对象的字段可能是私有的，对外部不可见。

直接方法还有另一个问题。由于必须知道对象所属的类才能创建副本，你的代码将依赖于该类。如果额外的依赖性不让你担心，那还有另一个问题：有时你只知道对象所遵循的接口，而不知道其具体类——例如，当方法中的某个参数可以接受遵循某个接口的任何对象时。

## 解决方案

原型模式将克隆过程委派给被克隆的实际对象。模式为所有支持克隆的对象声明了一个通用接口，该接口让你能够克隆对象，同时不会将代码与该对象所属的类耦合。通常，这样的接口只包含一个 `clone`（克隆）方法。

`clone` 方法在所有类中的实现都非常相似。该方法创建当前类的一个对象，并将原始对象所有字段的值复制到新对象中。你甚至可以复制私有字段，因为大多数编程语言允许对象访问同一类的其他对象的私有字段。

支持克隆的对象被称为**原型**。当你的对象拥有数十个字段和数百种可能的配置时，克隆它们可能是创建子类之外的替代方案。

其工作方式如下：你创建一组以各种方式配置的对象。当需要一个与你所配置的对象类似的对象时，只需克隆一个原型，而不必从头构建新对象。

## 现实世界类比

在现实生活中，原型用于在开始大规模生产产品之前进行各种测试。然而在这种情况下，原型并不参与任何实际生产，扮演的是被动角色。

由于工业原型实际上并不会自我复制，与该模式更接近的类比是有丝分裂的细胞分裂过程（还记得生物学吗？）。有丝分裂完成后，会形成一对完全相同的细胞。原始细胞充当原型，并在创建副本的过程中发挥积极作用。

## 结构

### 基本实现

1. **原型（Prototype）** 接口声明克隆方法。大多数情况下，它只有一个 `clone` 方法。
2. **具体原型（Concrete Prototype）** 类实现克隆方法。除了将原始对象的数据复制到克隆对象中，该方法还可能处理克隆过程中的一些边缘情况，如克隆关联对象、解开递归依赖等。
3. **客户端（Client）** 可以复制任何遵循原型接口的对象。

### 原型注册表实现

**原型注册表（Prototype Registry）** 提供了一种轻松访问常用原型的方式。它存储一组已预先构建的可供复制的对象。最简单的原型注册表是一个 `名称 → 原型` 的哈希映射。

## 伪代码

在本示例中，原型模式用于生成几何对象的精确副本，且无需将代码与其所属类耦合。

```
// 基础原型。
abstract class Shape is
    field X: int
    field Y: int
    field color: string

    // 普通构造函数。
    constructor Shape() is
        // ...

    // 原型构造函数。新对象使用已有对象的值初始化。
    constructor Shape(source: Shape) is
        this()
        this.X = source.X
        this.Y = source.Y
        this.color = source.color

    // 克隆操作返回 Shape 的某个子类。
    abstract method clone():Shape

// 具体原型。克隆方法通过调用当前类的构造函数
// 并将当前对象作为构造函数参数传入来一次性创建新对象。
class Rectangle extends Shape is
    field width: int
    field height: int

    constructor Rectangle(source: Rectangle) is
        super(source)
        this.width = source.width
        this.height = source.height

    method clone():Shape is
        return new Rectangle(this)

class Circle extends Shape is
    field radius: int

    constructor Circle(source: Circle) is
        super(source)
        this.radius = source.radius

    method clone():Shape is
        return new Circle(this)

// 客户端代码的某处。
class Application is
    field shapes: array of Shape

    constructor Application() is
        Circle circle = new Circle()
        circle.X = 10
        circle.Y = 10
        circle.radius = 20
        shapes.add(circle)

        Circle anotherCircle = circle.clone()
        shapes.add(anotherCircle)

        Rectangle rectangle = new Rectangle()
        rectangle.width = 10
        rectangle.height = 20
        shapes.add(rectangle)

    method businessLogic() is
        Array shapesCopy = new Array of Shapes

        foreach (s in shapes) do
            shapesCopy.add(s.clone())
        // shapesCopy 数组包含 shapes 数组子元素的精确副本。
```

## 适用场景

- 当你的代码不应依赖于需要复制的对象的具体类时，可使用原型模式。
- 当你希望减少仅在初始化各自对象方式上有所不同的子类数量时，可使用该模式。

## 实现步骤

1. 创建原型接口并在其中声明 `clone` 方法。或者直接将该方法添加到现有类层次结构的所有类中。
2. 原型类必须定义一个替代构造函数，该构造函数接受该类的对象作为参数。构造函数必须将传入对象中定义的所有字段的值复制到新创建的实例中。
3. 克隆方法通常只有一行：使用原型版本的构造函数运行 `new` 运算符。注意，每个类必须显式重写克隆方法，并在 `new` 运算符后使用自身类名。
4. 你还可以选择性地创建一个集中式原型注册表来存储常用原型的目录。

## 优缺点

### 优点

- 你可以克隆对象，而无需与其具体类耦合。
- 你可以通过克隆预构建的原型来消除重复的初始化代码。
- 你可以更方便地生成复杂对象。
- 在处理复杂对象的配置预设时，你可以获得继承之外的替代方案。

### 缺点

- 克隆包含循环引用的复杂对象可能非常棘手。

## 与其他模式的关系

- 许多设计在初期使用**工厂方法**，随后演变为**抽象工厂**、**原型**或**建造者**。
- **抽象工厂**类通常基于一组**工厂方法**，但你也可以使用**原型**来组合这些类上的方法。
- 当需要在历史记录中保存**命令**的副本时，**原型**可以提供帮助。
- 大量使用**组合**和**装饰器**的设计通常可以从使用**原型**中受益。
- **原型**不基于继承，因此没有继承的缺点。另一方面，原型需要对克隆对象进行复杂初始化。**工厂方法**基于继承但不需要初始化步骤。
- 有时**原型**可以作为**备忘录**的更简单替代。
- **抽象工厂**、**建造者**和**原型**都可以用**单例**模式实现。
