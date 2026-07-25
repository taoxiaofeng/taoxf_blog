---
title: "抽象工厂模式"
date: "2024-10-02"
tags: ["创建型模式", "设计模式", "抽象工厂"]
category: "设计模式"
patternType: "创建型模式"
excerpt: "抽象工厂是一种创建型设计模式，它能创建一系列相关的对象，而无需指定其具体类。"
---

# 抽象工厂模式（Abstract Factory）

## 意图

**抽象工厂**是一种创建型设计模式，它能创建一系列相关的对象，而无需指定其具体类。

## 问题

假设你正在开发一款家具商店模拟器。你的代码中包括一些类，用于表示：

1. 一系列相关产品，例如：`椅子`（Chair）+ `沙发`（Sofa）+ `咖啡桌`（CoffeeTable）。
2. 该系列产品的多个变体。例如，你可以获取 `现代`（Modern）、`维多利亚`（Victorian）、`装饰艺术`（ArtDeco）风格的 `椅子` + `沙发` + `咖啡桌`。

你需要设法单独生成每件家具对象，使其与同一系列中的其他家具对象风格一致。如果客户收到风格不一致的家具，他们会非常不满。

此外，当向程序中添加新产品或新的产品系列时，你不希望修改已有代码。家具供应商经常更新产品目录，你不希望每次更新都去修改核心代码。

## 解决方案

抽象工厂模式建议的首要做法是，为产品系列中的每件产品明确声明接口（例如，椅子、沙发或咖啡桌）。然后让所有产品变体都遵循这些接口。例如，所有椅子变体都实现 `椅子` 接口；所有咖啡桌变体都实现 `咖啡桌` 接口，以此类推。

接下来声明**抽象工厂**——一个包含产品系列中所有产品构建方法的接口（例如 `createChair`、`createSofa` 和 `createCoffeeTable`）。这些方法必须返回**抽象**产品类型，即我们之前提取的接口：`椅子`、`沙发`、`咖啡桌` 等。

对于产品系列的每个变体，我们都会基于 `抽象工厂` 接口创建一个单独的工厂类。工厂是返回特定类型产品的类。例如，`现代家具工厂`（ModernFurnitureFactory）只能创建 `现代椅子`（ModernChair）、`现代沙发`（ModernSofa）和 `现代咖啡桌`（ModernCoffeeTable）对象。

客户端代码必须通过相应的抽象接口与工厂和产品进行交互。这使得你可以变更传递给客户端代码的工厂类型，也可以变更客户端代码接收到的产品变体，而不会破坏实际的客户端代码。

## 结构

1. **抽象产品（Abstract Products）** 为构成产品系列的一组不同但相关的产品声明接口。
2. **具体产品（Concrete Products）** 是抽象产品的各种实现，按变体分组。每个抽象产品（椅子/沙发）都必须在所有给定的变体（维多利亚/现代）中实现。
3. **抽象工厂（Abstract Factory）** 接口声明了一组用于创建各种抽象产品的方法。
4. **具体工厂（Concrete Factories）** 实现了抽象工厂的构建方法。每个具体工厂对应一个特定的产品变体，且仅创建该变体的产品。
5. 尽管具体工厂实例化的是具体产品，但其创建方法的签名必须返回相应的**抽象**产品。这样，使用工厂的客户端代码就不会与从工厂获得的特定产品变体耦合。**客户端**只要通过抽象接口与工厂/产品对象交互，就可以与任何具体工厂/产品变体配合使用。

## 伪代码

本示例演示了如何使用抽象工厂模式创建跨平台 UI 元素，同时不会将客户端代码与具体 UI 类耦合，且保持所有创建的元素与选定操作系统的风格一致。

```
// 抽象工厂接口声明了一组可返回不同抽象产品的方法。
// 这些产品称为一个系列，并以高级主题或概念相关联。
// 同一系列的产品通常能够彼此协作。
// 一个产品系列可能有多个变体，
// 但一个变体的产品与另一个变体的产品不兼容。
interface GUIFactory is
    method createButton():Button
    method createCheckbox():Checkbox

// 具体工厂生产属于单一变体的产品系列。
// 工厂保证所生成的产品彼此兼容。
// 具体工厂方法的签名返回抽象产品，
// 而方法内部则实例化具体产品。
class WinFactory implements GUIFactory is
    method createButton():Button is
        return new WinButton()
    method createCheckbox():Checkbox is
        return new WinCheckbox()

// 每个具体工厂都有对应的产品变体。
class MacFactory implements GUIFactory is
    method createButton():Button is
        return new MacButton()
    method createCheckbox():Checkbox is
        return new MacCheckbox()

// 产品系列中的每件产品都应有一个基础接口。
// 产品的所有变体都必须实现此接口。
interface Button is
    method paint()

// 具体产品由对应的具体工厂创建。
class WinButton implements Button is
    method paint() is
        // 以 Windows 风格渲染按钮。

class MacButton implements Button is
    method paint() is
        // 以 macOS 风格渲染按钮。

interface Checkbox is
    method paint()

class WinCheckbox implements Checkbox is
    method paint() is
        // 以 Windows 风格渲染复选框。

class MacCheckbox implements Checkbox is
    method paint() is
        // 以 macOS 风格渲染复选框。

// 客户端代码仅通过抽象类型（GUIFactory、Button
// 和 Checkbox）与工厂和产品进行交互。
// 这使得你可以向客户端代码传递任何工厂或产品子类
// 而不破坏客户端。
class Application is
    private field factory: GUIFactory
    private field button: Button
    constructor Application(factory: GUIFactory) is
        this.factory = factory
    method createUI() is
        this.button = factory.createButton()
    method paint() is
        button.paint()

// 应用程序根据当前配置或环境设置选择工厂类型，
// 并在运行时（通常在初始化阶段）创建工厂。
class ApplicationConfigurator is
    method main() is
        config = readApplicationConfigFile()
        if (config.OS == "Windows") then
            factory = new WinFactory()
        else if (config.OS == "Mac") then
            factory = new MacFactory()
        else
            throw new Exception("错误！未知的操作系统。")
        Application app = new Application(factory)
```

## 适用场景

- 当代码需要与多个不同系列的相关产品交互，但你不希望依赖于这些产品的具体类时——它们可能事先未知，或者你只是想为未来的可扩展性做准备——可使用抽象工厂。
- 如果你有一个包含一组工厂方法的类，且这些方法模糊了该类的主要职责，可考虑实现抽象工厂。

## 实现步骤

1. 绘制一个由不同产品类型和产品变体组成的矩阵。
2. 为所有产品类型声明抽象产品接口。然后让所有具体产品类实现这些接口。
3. 声明抽象工厂接口，并在其中为所有抽象产品提供一组创建方法。
4. 为每种产品变体实现一个具体工厂类。
5. 在应用程序中的某处创建工厂初始化代码。它应根据应用程序配置或当前环境实例化一个具体工厂类。将该工厂对象传递给所有构建产品的类。
6. 扫描代码，找到所有对产品构造函数的直接调用。用对工厂对象上对应创建方法的调用来替换它们。

## 优缺点

### 优点

- 你可以确保从工厂获得的产品彼此兼容。
- 你可以避免具体产品和客户端代码之间的紧密耦合。
- **单一职责原则。** 你可以将产品创建代码提取到一处，使代码更易于维护。
- **开闭原则。** 你无需修改已有客户端代码，就能引入新的产品变体。

### 缺点

- 由于该模式引入了大量新的接口和类，代码可能会变得比应有的更加复杂。

## 与其他模式的关系

- 许多设计在初期使用**工厂方法**（较为简单，可通过子类进行定制），随后逐渐演变为**抽象工厂**、**原型**或**建造者**（更灵活但更复杂）。
- **建造者**专注于分步构建复杂对象。**抽象工厂**专门用于创建一系列相关对象。抽象工厂会立即返回产品，而建造者允许你在获取产品前执行一些额外的构造步骤。
- **抽象工厂**类通常基于一组**工厂方法**，但你也可以使用**原型**来组合这些类上的方法。
- 当你只想对客户端代码隐藏子系统对象的创建方式时，**抽象工厂**可以替代**外观**模式。
- 你可以将**抽象工厂**与**桥接**模式一起使用。当桥接所定义的某些抽象只能与特定实现配合时，抽象工厂可以封装这些关系，对客户端代码隐藏复杂性。
- **抽象工厂**、**建造者**和**原型**都可以用**单例**模式实现。
