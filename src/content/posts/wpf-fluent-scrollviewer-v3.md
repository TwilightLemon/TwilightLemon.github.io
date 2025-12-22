---
title: WPF 使用 RenderTransform 实现高性能平滑滚动的 ScrollViewer
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

---
接下来，我们详细介绍 v3 版本的设计与实现原理。
## 一、视觉与逻辑分离

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
4.  累加时间，如果超过 `ScrollBarUpdateInterval` (1/24s)，则调用 `ScrollToVerticalOffset` 同步逻辑位置，触发布局更新，从而允许滚动条同步和虚拟化等功能生效。

## 二、物理模型设计

v3 版本的物理模型沿用了 v2 的设计，但做了一些改进以提升滚动体验。以下介绍完整的物理模型。

### 2.1 缓动模型

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
*   $f$：速率衰减系数，默认为 0.92。数值越小，停得越快。
*   $t_{factor}$：时间标准化因子，$\frac{dt}{TargetFrameTime}$ (基准帧率为 144Hz)。
*   常数 24 是一个经验值，用于调整速度到位移的映射比例。

### 2.2 精确模型

适用于触控板。触控板本身提供了高精度的 `Delta` 值，我们不需要模拟惯性（系统已处理），只需要平滑地过渡到目标位置，避免画面撕裂或抖动。

*   **插值计算**：$x_{new} = x_{old} + (x_{target} - x_{old}) \cdot (1 - (1 - l)^{t_{factor}})$

其中：
*   $l$：插值系数 (`LerpFactor`)，默认为 0.5。数值越大，跟随越紧密。
*   $t_{factor}$：时间标准化因子，$\frac{dt}{TargetFrameTime}$。


## 三、快速开始
在项目中引入FluentWpfCore包，然后使用：
```xml
<Window xmlns:fluent="clr-namespace:FluentWpf.Controls;assembly=FluentWpfCore" 
        ...>

<fluent:SmoothScrollViewer>
    <!--可选 自定义模型及其参数-->
    <fluent:SmoothScrollViewer.Physics>
        <fluent:DefaultScrollPhysics MinVelocityFactor="1.2" />
    </fluent:SmoothScrollViewer.Physics>
    ...
</fluent:SmoothScrollViewer>

</Window>
```
| 属性 | 类型 | 默认值 | 说明 |
|------|------|---------|------|
| `IsEnableSmoothScrolling` | `bool` | `true` | 启用或禁用平滑滚动动画（实际上会控制所有SmoothScrolling相关功能） |
| `PreferredScrollOrientation` | `Orientation` | `Vertical` | 首选滚动方向：`Vertical` 或 `Horizontal` |
| `AllowTogglePreferredScrollOrientationByShiftKey` | `bool` | `true` | 允许通过按住 Shift 键切换滚动方向 |
| `Physics` | `IScrollPhysics` | `DefaultScrollPhysics` | 控制滚动动画行为的物理模型 |

默认模型(`DefaultScrollPhysics`)可选参数：
| 参数 | 类型 | 默认值 | 说明 |
|------|------|---------|------|
| `MinVelocityFactor` | `double` | `1.2` | 鼠标滚轮的最小速度倍率 |
| `Friction`    | `double` | `0.92` | 鼠标滚轮的速度衰减系数 |
| `LerpFactor` | `double` | `0.5` | 触控板滚动的插值系数 |


## 四、了解更多

### 1) 为什么要“视觉满帧、逻辑低频”

在 WPF 里，`ScrollToVerticalOffset/ScrollToHorizontalOffset` 不是一个“只改数值”的轻量操作。它往往会驱动：

- 滚动条位置与 `ScrollChanged` 事件
- 布局与渲染链路（尤其是内容复杂时）
- 虚拟化容器的生成/回收（例如 `VirtualizingStackPanel`）

v2的实现把它放到 `CompositionTarget.Rendering` 的每一帧里调用，意味着UI线程必须在每帧都完成布局计算，这在内容复杂或CPU负载高时会直接卡死UI线程，导致掉帧或其他UI组件无响应。

v3 的分层策略是：

- **视觉层**：用 `TranslateTransform` 做位移补偿，只影响渲染，不触发布局。
- **逻辑层**：用 `ScrollTo*Offset` 推进真实偏移，但频率降低到 24Hz。

相当于把“高频的连续运动”交给 GPU（RenderTransform），把“低频但必要的状态推进”交给布局系统（ScrollTo）。或者理解为：**视觉层做“动画”，逻辑层做“状态更新”**，以低帧率推进布局计算，然后由视觉层平滑过渡，显著提升性能。

### 2) 关键状态：视觉差值（Visual Delta）

在 v3 里，始终存在两个 offset：

- **逻辑 offset**：`ScrollViewer` 真正的 `VerticalOffset/HorizontalOffset`，决定滚动条与虚拟化。
- **视觉 offset**：物理模型在每帧计算出的“应该看到的位置”。

两者的差值就是视觉补偿量：

$$\Delta = offset_{visual} - offset_{logical}$$

视觉层每帧做的事情非常纯粹：把这个差值通过 Transform 反向抵消掉，让用户“看到”的内容位置跟随视觉 offset。

- 垂直滚动：`Transform.Y = -$\Delta$`
- 水平滚动：`Transform.X = -$\Delta$`

这样带来两个好处：

1. 逻辑层什么时候同步（调用 `ScrollTo*Offset`）可以自由选择频率，不会影响视觉连续性。
2. 当逻辑层因为外部原因突变（拖动滚动条、代码调用 `ScrollTo...`、键盘导航）时，只要立刻重算差值，视觉层就仍然能保持连续。

### 3) 为什么要用真实 `dt`（而不是假设固定帧率）

`CompositionTarget.Rendering` 的触发并不严格等间隔：后台负载、窗口被遮挡、显示器刷新率、系统节能策略都会让帧间隔波动。

因此实现中用 `Stopwatch.GetTimestamp()` 计算真实 `dt`，并把 `dt` 传给物理模型。这意味着：

- 低帧率时不会“走慢动作”或突然“加速冲刺”
- 高刷屏（120/144Hz）不会因为更高帧数而滚得更远

配合 `DefaultScrollPhysics` 中的 `timeFactor = dt / TargetFrameTime`，滚动手感可以在不同帧率下保持一致。

### 4) 关于逻辑同步频率

实现把逻辑同步频率设为 24Hz（`ScrollBarUpdateInterval = 1/24s`），这是一个折中：

- 频率更高：滚动条更“实时”，虚拟化更及时，但布局压力上升。
- 频率更低：性能更好，但滚动条会有视觉滞后，虚拟化加载可能会出现空白频闪。

> 一个可能的缓解思路是让虚拟化容器提前加载，会增加一点内存开销，但能减少空白频闪。

一般来说：

- 内容很重（大量图片、复杂控件、阴影/模糊多）：可以把同步频率调低一点。
- 列表虚拟化强依赖“及时生成下一屏”（例如聊天列表/文件列表）：可以适当提高，但要观察 CPU。

### 5) 注意 ScrollChanged 状态变更

只靠渲染循环还不够，因为用户可以通过滚动条拖动来改变 offset。实现里在 `OnScrollChanged` 中做了两件重要的事情：

1. 更新逻辑 offset（垂直/水平各自维护）。
2. 如果当前正在平滑滚动，并且变化来自“当前激活方向”，就立刻更新 Transform，让画面位置保持连续。

### 6) 横向滚动与 Shift 切换

v3 支持横向与纵向两种滚动方向，并且提供了按住 Shift 切换滚动方向的特性。


### 7) 为什么滚动时要临时关闭 HitTest

渲染循环开始时把 `IsHitTestVisible` 设为 `false`，结束时恢复。

高速滚动时，鼠标在大量元素上扫过会触发频繁的命中测试和状态变更（Hover、ToolTip、触发器）。
关闭命中测试能够显著降低这些开销，提升滚动性能。

当然，它也意味着滚动过程中无法点击内容。

### 8) 如何写你自己的物理模型

`IScrollPhysics` 的接口设计刻意简单：

- `OnScroll(...)`：只负责接收一次输入意图（delta + 是否精确 + 边界 + 时间间隔）。
- `Update(...)`：每帧推进到新位置（帧率无关）。
- `IsStable`：告诉外部何时可以退出渲染循环。

## 写在最后
::github{repo="TwilightLemon/FluentWpfCore"}
相关组件均开源在 FluentWpfCore 仓库，欢迎 star 和 PR！仓库保持活跃更新。  

感谢阅读，文章如有不妥之处，请各位大佬不吝指正！