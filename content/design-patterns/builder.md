---
title: "建造者模式"
date: "2024-10-03"
tags: ["创建型模式", "设计模式", "建造者"]
category: "设计模式"
patternType: "创建型模式"
excerpt: "建造者是一种创建型设计模式，使你能够分步骤创建复杂对象。该模式允许你使用相同的构建代码生成不同类型和形式的对象。"
---

# 建造者模式（Builder）

## 意图

**建造者**是一种创建型设计模式，使你能够分步骤创建复杂对象。该模式允许你使用相同的构建代码生成不同类型和形式的对象。

## 问题

假设有一个复杂对象，需要对其众多字段和嵌套对象进行费力的逐步初始化。这类初始化代码通常深藏于一个包含大量参数的可怕构造函数中，甚至更糟糕——散布在客户端代码的各个角落。

例如，让我们考虑如何创建一个 `房屋` 对象。要建造一座简单的房屋，你需要建造四面墙和一层地板、安装一扇门、装上一对窗户以及建造一个屋顶。但如果你想要一座更大更明亮的房屋，拥有后院和其他设施（如供暖系统、管道和电气线路），该怎么办？

最简单的方案是扩展基础 `房屋` 类，创建一组子类来涵盖所有参数组合。但最终你会得到数量可观的子类。任何新参数（如门廊样式）都需要进一步扩展这个层次结构。

还有一种方法不需要派生子类。你可以在基础 `房屋` 类中创建一个包含所有可能参数的巨型构造函数来控制房屋对象。虽然这种方式消除了对子类的需求，但会产生另一个问题：在大多数情况下，绝大部分参数都是用不到的，这使得构造函数调用非常不优雅。

## 解决方案

建造者模式建议将对象构造代码从产品类中提取出来，放到名为**建造者**的独立对象中。

该模式将对象构造过程组织为一组步骤（`buildWalls`、`buildDoor` 等）。要创建一个对象，你需要在建造者对象上执行一系列步骤。重要的是，你不必调用所有步骤，而只需调用创建特定对象配置所需的那些步骤。

当你需要创建产品的不同表现形式时，某些构造步骤可能需要不同的实现。例如，木屋的墙壁可能用木材建造，而城堡的墙壁必须用石头建造。

在这种情况下，你可以创建多个不同的建造者类，它们实现同一组构建步骤但方式各异。然后你可以在构造过程中使用这些建造者（即对构建步骤的一组有序调用）来生成不同类型的对象。

### 主管（Director）

你可以进一步将用于构造产品的一系列建造者步骤调用提取到一个名为**主管**（Director）的单独类中。主管类定义了构建步骤的执行顺序，而建造者则提供这些步骤的实现。

在程序中拥有一个主管类并非严格必要。你始终可以在客户端代码中以特定顺序直接调用构建步骤。然而，主管类可能是放置各种构造套路的好地方，以便在程序中复用。

此外，主管类完全对客户端代码隐藏了产品构造的细节。客户端只需将建造者与主管关联，使用主管启动构造过程，然后从建造者中获取结果即可。

## 结构

1. **建造者（Builder）** 接口声明了在所有类型建造者中通用的产品构造步骤。
2. **具体建造者（Concrete Builders）** 提供构造步骤的不同实现。具体建造者可以生产不遵循通用接口的产品。
3. **产品（Products）** 是最终生成的对象。由不同建造者构造的产品不必属于同一类层次结构或接口。
4. **主管（Director）** 类定义调用构造步骤的顺序，这样你就可以创建和复用产品的特定配置。
5. **客户端（Client）** 必须将某个建造者对象与主管关联。通常只需通过主管的构造函数参数执行一次即可，然后主管就可以在所有后续构造中使用该建造者对象。

## 伪代码

本示例展示了建造者模式如何复用同一对象构造代码来构建不同类型的产品——汽车及其相应的使用手册。

```
// 只有在产品相当复杂且需要大量配置时，
// 使用建造者模式才有意义。
class Car is
    // 汽车可以配备 GPS、行车电脑和若干座位。
    // 不同型号的汽车（跑车、SUV、敞篷车）
    // 可能安装或启用了不同的功能。

class Manual is
    // 每辆车都应有一本用户手册，
    // 该手册与车辆的配置相对应并描述其所有功能。

// 建造者接口规定了创建产品对象不同部分的方法。
interface Builder is
    method reset()
    method setSeats(...)
    method setEngine(...)
    method setTripComputer(...)
    method setGPS(...)

// 具体建造者类遵循建造者接口并提供
// 构建步骤的具体实现。
class CarBuilder implements Builder is
    private field car:Car
    constructor CarBuilder() is
        this.reset()
    method reset() is
        this.car = new Car()
    method setSeats(...) is
        // 设置汽车座位数量。
    method setEngine(...) is
        // 安装给定的引擎。
    method setTripComputer(...) is
        // 安装行车电脑。
    method setGPS(...) is
        // 安装全球定位系统。
    method getProduct():Car is
        product = this.car
        this.reset()
        return product

class CarManualBuilder implements Builder is
    private field manual:Manual
    constructor CarManualBuilder() is
        this.reset()
    method reset() is
        this.manual = new Manual()
    method setSeats(...) is
        // 记录汽车座位功能。
    method setEngine(...) is
        // 添加引擎说明。
    method setTripComputer(...) is
        // 添加行车电脑说明。
    method setGPS(...) is
        // 添加 GPS 说明。
    method getProduct():Manual is
        // 返回手册并重置建造者。

// 主管仅负责按特定顺序执行构建步骤。
class Director is
    method constructSportsCar(builder: Builder) is
        builder.reset()
        builder.setSeats(2)
        builder.setEngine(new SportEngine())
        builder.setTripComputer(true)
        builder.setGPS(true)

    method constructSUV(builder: Builder) is
        // ...

class Application is
    method makeCar() is
        director = new Director()
        CarBuilder builder = new CarBuilder()
        director.constructSportsCar(builder)
        Car car = builder.getProduct()

        CarManualBuilder builder = new CarManualBuilder()
        director.constructSportsCar(builder)
        Manual manual = builder.getProduct()
```

## 适用场景

- 使用建造者模式可以避免"重叠构造函数（telescoping constructor）"的出现。
- 当你希望代码能够创建某个产品的不同表现形式（如石头房屋和木头房屋）时，可使用建造者模式。
- 使用建造者模式构造组合树或其他复杂对象。

## 实现步骤

1. 确保你能够清晰定义所有可用产品表现形式的通用构造步骤。否则你将无法继续实现该模式。
2. 在基础建造者接口中声明这些步骤。
3. 为每种产品表现形式创建一个具体建造者类，并实现其构造步骤。
4. 考虑创建一个主管类。它可以用同一个建造者对象封装多种产品构造方式。
5. 客户端代码创建建造者和主管对象。构造开始前，客户端必须向主管传递一个建造者对象。
6. 仅当所有产品遵循同一接口时，才能直接从主管获取构造结果。否则，客户端应从建造者中获取结果。

## 优缺点

### 优点

- 你可以分步构造对象、延迟构造步骤或递归运行步骤。
- 生成不同形式的产品时可以复用相同的构造代码。
- **单一职责原则。** 你可以将复杂构造代码从产品的业务逻辑中分离出来。

### 缺点

- 由于该模式需要创建多个新类，代码整体复杂度会增加。

## 与其他模式的关系

- 许多设计在初期使用**工厂方法**（较为简单），随后逐渐演变为**抽象工厂**、**原型**或**建造者**（更灵活但更复杂）。
- **建造者**专注于分步构建复杂对象。**抽象工厂**专门用于创建一系列相关对象。
- 创建复杂的**组合**树时可以使用**建造者**，因为你可以编程使其构造步骤以递归方式工作。
- 你可以将**建造者**与**桥接**模式结合使用：主管类扮演抽象的角色，而不同的建造者充当实现。
- **抽象工厂**、**建造者**和**原型**都可以用**单例**模式实现。
