---
title: WPF 平滑滚动 ScrollViewer
published: 2025-12-21
description: 'WPF Fluent ScrollViewer 的第三版实现，通过分离视觉层和逻辑层，利用 RenderTransform 实现高性能的平滑滚动。'
image: ''
tags: [WPF, .NET, UI]
category: 'WPF'
draft: false
lang: ''
---

在之前的两篇文章中，我们探讨了 WPF 中实现平滑滚动的不同方案：
1. [WPF 如何流畅地滚动ScrollViewer 简单实现下](/posts/wpf-smooth-scrollviewer)：基于 `DoubleAnimation` 的动画方案。
2. [WPF 使用CompositionTarget.Rendering实现平滑流畅滚动的ScrollViewer](/posts/wpf-fluent-scrollviewer-with-all-device-supported)：基于 `CompositionTarget.Rendering` 的每帧布局更新方案。

虽然第二版方案解决了触控板和物理惯性的问题，但它引入了一个新的性能瓶颈：**每帧调用 `ScrollToVerticalOffset`**。这会导致 WPF 在每一帧都进行布局计算，在高负载场景下会直接卡死整个UI线程，造成掉帧或其他UI组件无响应。

为了解决这个问题，我进行了第三版（v3）设计，核心思路是：**视觉层与逻辑层分离**。

## 三种方案对比

| 方案 | 实现方式 | 优点 | 缺点 |
| :--- | :--- | :--- | :--- |
| **v1 (动画版)** | `DoubleAnimation` 驱动 `VerticalOffset` | 实现简单，代码量少 | 无法保留惯性速度（动画打断）；触控板体验差；不支持触摸/笔。 |
| **v2 (布局驱动)** | `Rendering` 事件每帧调用 `ScrollToVerticalOffset` | 物理模型更真实；支持多种输入设备 | **性能差**：每帧触发 Layout Pass，高负载下掉帧严重。 |
| **v3 (视觉分离)** | `RenderTransform` 驱动视觉，低频同步逻辑位置 | **高性能**：视觉满帧运行，逻辑低频更新；物理模型完善。 | 实现相对复杂，需要处理坐标系转换和帧同步。 |

## 视觉与逻辑分离

v3 的核心在于将“用户看到的滚动”（视觉层）和“控件实际的滚动”（逻辑层）分离。

1.  **视觉层**：
    *   使用 `TranslateTransform` 对 `Content` 进行位移。
    *   在 `CompositionTarget.Rendering` 中以屏幕刷新率（如 60Hz 或 144Hz）更新 `Transform.Y`。
    *   因为 `RenderTransform` 只影响渲染而不触发布局（Measure/Arrange），所以性能极高，完全由 GPU 加速。

2.  **逻辑层**：
    *   维护实际的 `ScrollViewer.VerticalOffset`。
    *   **降频更新**：不再每帧调用 `ScrollToVerticalOffset`，而是以较低的频率（如 24Hz）同步逻辑位置。
    *   这保证了滚动条的位置更新和虚拟化加载新内容，同时避免了频繁的布局计算。

### 渲染循环逻辑

只需遵守一条坐标系变换规则：**逻辑位置 = 视觉位置 + 视觉偏差**。  
当用户滚动时，视觉层将以“插帧”方式在逻辑层低帧率更新之间平滑过渡。

在每一帧的渲染回调中：
1.  计算物理模型的当前位置 `_currentVisualOffset`。
2.  计算视觉偏差 `_visualDelta = _currentVisualOffset - _logicalOffset`。
3.  应用 `_transform.Y = -_visualDelta`，实现视觉上的平滑移动，不会触发布局重置。
4.  累加时间，如果超过 `ScrollBarUpdateInterval` (1/24s)，则调用 `ScrollToVerticalOffset` 同步逻辑位置，触发虚拟化加载。

## 物理模型设计

v3 版本的物理模型沿用了 v2 的设计，但做了一些改进以提升滚动体验。以下介绍完整的物理模型。

### 1.1 缓动模型

适用于鼠标滚轮。该模型包含两个核心部分：**动态速度因子**（决定滚多快）和**物理衰减**（决定滚多久）。

#### 动态速度因子 (Dynamic Velocity Factor)

在 v2 版本中，我们发现简单的线性速度叠加无法平衡缓慢滚动和快速滚动的体验。因此，v3 引入了一个基于时间间隔的动态速度因子。当用户快速连续滚动时，速度因子会呈指数级增长，从而产生更大的加速度。

$$ v_{factor} = (V_{max} - V_{min}) \cdot e^{-\frac{\Delta t}{20}} + V_{min} $$

*   $V_{max}$：最大速度倍率，固定为 2.5。
*   $V_{min}$：最小速度倍率 (`MinVelocityFactor`)，默认为 1.2。
*   $\Delta t$：两次滚动事件的时间间隔 (ms)。

这意味着：如果你慢慢滚动，每次滚动的距离约为原始值的 1.2 倍；如果你疯狂拨动滚轮，这个倍率会迅速逼近 2.5 倍，与真实的物理滚动手感更接近。

#### 物理衰减

模拟物理摩擦力，使滚动速度随时间自然衰减。

*   **速度衰减**：$v_{new} = v_{old} \cdot f^{t_{factor}}$
*   **位置更新**：$x_{new} = x_{old} + v_{new} \cdot \frac{t_{factor}}{24}$

其中：
*   $f$：摩擦系数 (`Friction`)，默认为 0.92。数值越小，停得越快。
*   $t_{factor}$：时间标准化因子，$\frac{dt}{TargetFrameTime}$ (基准帧率为 144Hz)。
*   常数 24 是一个经验值，用于调整速度到位移的映射比例。

### 1.2 精确模型

适用于触控板。触控板本身提供了高精度的 `Delta` 值，我们不需要模拟惯性（系统已处理），只需要平滑地过渡到目标位置，避免画面撕裂或抖动。

*   **插值计算**：$x_{new} = x_{old} + (x_{target} - x_{old}) \cdot (1 - (1 - l)^{t_{factor}})$

其中：
*   $l$：插值系数 (`LerpFactor`)，默认为 0.5。数值越大，跟随越紧密。
*   $t_{factor}$：时间标准化因子，$\frac{dt}{TargetFrameTime}$。


## 快速开始
在项目中引入FluentWpfCore包，然后使用：
```xml
<Window xmlns:fluent="clr-namespace:FluentWpf.Controls;assembly=FluentWpfCore" 
        ...>

<fluent:SmoothScrollViewer Padding="{TemplateBinding Padding}" Focusable="false">
    <fluent:SmoothScrollViewer.Physics>
        <fluent:DefaultScrollPhysics MinVelocityFactor="1.2" />
    </fluent:SmoothScrollViewer.Physics>
    ...
</fluent:SmoothScrollViewer>

</Window>
```

未完待续...

---
好困啊，现在是凌晨12点，写不动了，先发个草稿，改天继续完善...