---
title: WPF 使用CompositionTarget.Rendering实现平滑流畅滚动的ScrollViewer，支持滚轮、触控板、触摸屏和笔
published: 2025-11-08
description: ''
image: ''
tags: [WPF,.NET]
category: 'WPF'
draft: false 
lang: ''
---
之前的文章中用WPF自带的动画库实现了一个简陋的平滑滚动ScrollViewer，它在只使用鼠标滚轮的情况下表现良好，但仍然有明显的设计缺陷和不足：
1. 没有实现真正的动画衔接，只是单纯结束掉上一个动画，而不是继承其滚动速率；
2. 使用触控板的体验极差
3. 对触控屏和笔设备无效

为了解决以上问题，本文提出一种新的方案来实现平滑滚动ScrollViewer。该方案在`OnMouseWheel`、`OnManipulationDelta`和`OnManipulationCompleted`中直接处理(禁用)了系统的滚动效果，使用`CompositionTarget.Rendering`事件来驱动滚动动画。并针对滚轮方式和触控“跟手”分别进行优化，使用`缓动滚动模型`和`精确滚动模型`来实现平滑滚动。笔的支持得益于`EleCho.WpfSuite`库提供的`StylusTouchDevice`模拟，将笔输入映射为触摸输入。

为了最直观和最简单地解决问题，我们将应用场景设置为垂直滚动，水平滚动可以通过类似的方式实现。
在github中查看最小可运行代码：  
::github{repo="TwilightLemon/FluentScrollViewer"}

# 一、一些先验事实和设计思路
## 1.1 OnMouseWheel的触发逻辑
`OnMouseWheel(MouseWheelEventArgs e)`事件由WPF触发，`e.Delta`指示鼠标单次滚动的偏移值，通常为120或-120，这个值可以通过`Mouse.MouseWheelDeltaForOneLine`获得。这一逻辑在传统鼠标滚轮上顺理成章，但是在精准滚动设备（如触控板）上，滚动偏移量变得非常小，事件在高频率低偏移地触发，导致基于动画触发的滚动体验不佳。  
测试发现，在以下两种场景中，OnMouseWheel事件具有特定的行为：

| 设备   | 缓慢滚动                  | 快速滚动                     |
| ---- | --------------------- | ------------------------ |
| 鼠标滚轮 | 单个触发、一次一个事件           | 可能多个合并触发，e.Delta 是滚动值的倍数 |
| 触控板  | 持续滚动，间隔触发，e.Delta 值很小 | Delta 快速增长，最后变为很小的值      |

因为触控板、触摸屏等精准滚动的使用场景，设备与人交互，意味着其数据本身就遵循物理规律。但是滚动的速率和距离被离散地传递给WPF，导致了滚动的生硬和不自然。  
那么有没有一种思路，我们只需先接收这些滚动数据，然后在每一帧中根据这些数据来计算滚动位置？相当于把离散的滚动数据重新平滑化。

## 1.2 CompositionTarget.Rendering
`CompositionTarget.Rendering`是WPF渲染管线的一个事件，它在每一帧渲染之前触发。我们可以利用这个事件来实现自定义的滚动逻辑：先收集滚动参数，然后在OnRender事件中计算实际偏移值，并应用到ScrollViewer上。

## 1.3 两种场景、两种模型
我们将滚动分为两种场景：滚轮和触控，分别对应缓动滚动模型和精确滚动模型。

### 1.3.1 缓动滚动模型
类似于鞭挞陀螺使其旋转，每打一次都会给陀螺附加新的加速度，然后在接下来的时间中由于摩擦的存在而缓慢减速。我们基于这个思路来实现简易的缓动滚动模型：  

1. 先定义几个常量：衰减系数`f=0.92`、叠加速率力度系数`n=2.0`、目标帧时间`frameTime=1.0/144`以及行进常量`p=24`
2. 每次`OnMouseWheel`事件触发时，叠加速率：`v += e.Delta * n`
3. 在`CompositionTarget.Rendering`事件中：
    - 计算刷新间隔时间`Δt`，以按照间隔时间计算滚动增量
    - `t= Δt / frameTime`
    - `v *= f^t`，模拟摩擦力的影响（确保在目标帧时间内衰减幅度一致）  
    - `offset += v *(t/p)`，计算滚动增量  
4. 将新的位置应用到ScrollViewer上

调整以上参数会带来相应的变化：
- 衰减系数f越小，滚动越快停下来
- 叠加速率力度系数n越大，每次滚动的速度越快
- 行进常量p越大，滚动越慢
- 通常你无需调整frameTime，它只是用来标准化滚动速度的

### 1.3.2 精确滚动模型
对于一个指定的滚动距离，我们希望能够精确地滚动到目标位置，而不是依赖于速率和衰减。模型只需要对离散距离补帧即可。具体而言，定义一个插值系数l，指示接近目标位置的速率，则`offset=_targetOffset - _currentOffset) *l`.

### 2025/11/08 更新
因为`CompositionTarget.Rendering`事件的触发频率并不固定，可能会因为系统负载等原因而变化较大，因此在计算滚动增量时需要考虑实际的时间增量。

# 二、实现
现在我们已经有思路了：先捕获`OnMouseWheel`等事件->判断使用哪个模型->挂载`OnRender`事件->在每一帧中计算新的滚动位置->应用到ScrollViewer上。以下实现通过继承`ScrollViewer`创建新的控件来实现。

## 2.1 先从鼠标滚轮与触控板开始
从`OnMouseWheel`中收集数据并判断模型:
```csharp
 protected override void OnMouseWheel(MouseWheelEventArgs e)
 {
     e.Handled = true;

     //触摸板使用精确滚动模型
     _isAccuracyControl = IsTouchpadScroll(e);

     if (_isAccuracyControl)
         {
            _targetVelocity = 0; // 防止下一次触发缓动模型时继承没有消除的速度，造成滚动异常
            _targetOffset = Math.Clamp(_currentOffset - e.Delta, 0, ScrollableHeight);
        }
     else
         _targetVelocity += -e.Delta * VelocityFactor;// 鼠标滚动，叠加速度（惯性滚动）

     if (!_isRenderingHooked)
     {
         CompositionTarget.Rendering += OnRendering;
         _isRenderingHooked = true;
     }
 }
```
WPF似乎并没有提供直接判断触发设备的方法，这里使用了一个启发式判断逻辑：判断触发间隔时间和偏移值是否为滚轮偏移值的倍数。这一代码在诺尔大佬的`EleCho.WpfSuite`中亦有记载。
```csharp
private bool IsTouchpadScroll(MouseWheelEventArgs e)
{
    var tickCount = Environment.TickCount;
    var isTouchpadScrolling =
            e.Delta % Mouse.MouseWheelDeltaForOneLine != 0 ||
            (tickCount - _lastScrollingTick < 100 && _lastScrollDelta % Mouse,MouseWheelDeltaForOneLine != 0);
    _lastScrollDelta = e.Delta;
    _lastScrollingTick = e.Timestamp;
    return isTouchpadScrolling;
    }
```

## 2.2 适配触摸屏和笔（更新：不建议使用）
触摸屏的输入可以通过`ManipulationDelta`和`ManipulationCompleted`事件来处理。我们将触摸输入映射为滚动偏移量，并使用精确滚动模型，在结束滚动时，可能还有由于快速滑动造成的惯性速率，我们在`ManipulationCompleted`中交给惯性滚动模型处理。
```csharp
protected override void OnManipulationDelta(ManipulationDeltaEventArgs e)
{
    base.OnManipulationDelta(e);    //如果没有这一行则不会触发ManipulationCompleted事件??
    e.Handled = true;

    //手还在屏幕上，使用精确滚动
    _isAccuracyControl = true;
    double deltaY = -e.DeltaManipulation.Translation.Y;
    _targetOffset = Math.Clamp(_targetOffset + deltaY, 0, ScrollableHeight);
    // 记录最后一次速度
    _lastTouchVelocity = -e.Velocities.LinearVelocity.Y;

    if (!_isRenderingHooked)
    {
        CompositionTarget.Rendering += OnRendering;
        _isRenderingHooked = true;
    }
}

protected override void OnManipulationCompleted(ManipulationCompletedEventArgs e)
{
    base.OnManipulationCompleted(e);
    e.Handled = true;
    Debug.WriteLine("vel: "+ _lastTouchVelocity);
    _targetVelocity = _lastTouchVelocity; // 用系统识别的速度继续滚动
    _isAccuracyControl = false;

    if (!_isRenderingHooked)
    {
        CompositionTarget.Rendering += OnRendering;
        _isRenderingHooked = true;
    }
}
```
适配笔只需要把笔设备映射为触摸设备即可。这里使用了`EleCho.WpfSuite`库中的`StylusTouchDevice`来模拟触摸输入，最小可用代码在仓库中给出。
```csharp
public MyScrollViewer()
{
    //...
    StylusTouchDevice.SetSimulate(this, true);
}
```

## 2.3 OnRender事件
在`CompositionTarget.Rendering`事件中，我们根据当前模型计算新的滚动位置，并应用到ScrollViewer上。
```csharp
private void OnRendering(object? sender, EventArgs e)
{
    // 计算时间增量
    long currentTimestamp = Stopwatch.GetTimestamp();
    double deltaTime = (double)(currentTimestamp - _lastTimestamp) / Stopwatch.Frequency;
    _lastTimestamp = currentTimestamp;

    double timeFactor = deltaTime / TargetFrameTime;

    if (_isAccuracyControl)
    {
        // 精确滚动：Lerp 逼近目标（使用时间因子调整）
        double lerpAmount = 1.0 - Math.Pow(1.0 - LerpFactor, timeFactor);
        _currentOffset += (_targetOffset - _currentOffset) * lerpAmount;

        // 如果已经接近目标，就停止
        if (Math.Abs(_targetOffset - _currentOffset) < 0.5)
        {
            _currentOffset = _targetOffset;
            StopRendering();
        }
    }
    else
    {
        // 缓动滚动：速度衰减模拟（使用时间因子调整）
        if (Math.Abs(_targetVelocity) < 0.1)
        {
            _targetVelocity = 0;
            StopRendering();
            return;
        }

        // 使用时间因子调整摩擦力衰减
        _targetVelocity *= Math.Pow(Friction, timeFactor);

        // 根据实际时间计算偏移量
        _currentOffset = Math.Clamp(_currentOffset + _targetVelocity * (timeFactor / 24), 0, ScrollableHeight);
    }

    InternalScrollToVerticalOffset(_currentOffset);
}
```

## 2.4 处理来自外部的滚动
我们的模型在计算时独立于ScrollViewer的实际滚动位置，当用户通过直接滑动滚动条或者使用`ListBox.ScrollIntoView`等方法时，我们需要同步滚动位置。这里采用的方法是使用`DependencyPropertyDescriptor`监听`ScrollViewer.VerticalOffset`(只读依赖属性)的变化，并在变化时判断是否更新内部滚动位置。
```csharp
//注册监听
DependencyPropertyDescriptor
    .FromProperty(VerticalOffsetProperty, typeof(ScrollViewer))
    .AddValueChanged(this, HandleExternalScrollChanged);
//Unload中取消注册
DependencyPropertyDescriptor
    .FromProperty(VerticalOffsetProperty, typeof(ScrollViewer))
    .RemoveValueChanged(this, HandleExternalScrollChanged);
//...
private bool _isInternalScrollChange = false;
private void HandleExternalScrollChanged(object? sender, EventArgs e)
{
    if (!_isInternalScrollChange)
        _currentOffset = VerticalOffset;
}
```
我们使用一个标志位来判断是否是内部滚动导致的变化，以避免循环调用。则在处理模型时需要设置该标志位为`true`，在滚动结束后再将其重置为`false`，在`OnRender`中调用内部滚动方法：
```csharp
private void InternalScrollToVerticalOffset(double offset)
{
    _isInternalScrollChange = true;
    ScrollToVerticalOffset(offset);
    _isInternalScrollChange = false;
}
```

# 三、已知问题
1. 使用触摸屏时可能会造成闪烁，因为并没有完全禁用系统的滚动实现。但是如果禁用`base.OnManipulationDelta(e)`，则无法触发`ManipulationCompleted`事件，导致无法处理惯性滚动。 
2. ~~尚未测试与ListBox等控件的兼容性。~~

# 四、完整代码
以下是完整的`MyScrollViewer`代码，包含了上述所有实现细节。
```csharp
using EleCho.WpfSuite;
using System.ComponentModel;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

public class MyScrollViewer : System.Windows.Controls.ScrollViewer
{
    #region 模型参数
    /// <summary>
    /// 缓动模型的叠加速度力度，数值越大，滚动起始速率越快，滚得越远
    /// </summary>
    private const  double VelocityFactor = 2.0;
    /// <summary>
    /// 缓动模型的速度衰减系数，数值越小，越快停下来
    /// </summary>
    private const double Friction = 0.92;

    /// <summary>
    /// 精确模型的插值系数，数值越大，滚动越快接近目标
    /// </summary>
    private const double LerpFactor = 0.5;

    /// <summary>
    /// 目标帧时间
    /// </summary>
    private const double TargetFrameTime =1.0d/144;
    #endregion

    public MyScrollViewer()
    {
        _currentOffset = VerticalOffset;

        this.PanningMode = PanningMode.VerticalOnly;
        //使用此触屏滚动会导致闪屏，先不用了..
        // this.IsManipulationEnabled = true;
        // this.PanningDeceleration = 0; // 禁用默认惯性
        //StylusTouchDevice.SetSimulate(this, true);

        DependencyPropertyDescriptor
                .FromProperty(VerticalOffsetProperty, typeof(System.Windows.Controls.ScrollViewer))
                .AddValueChanged(this, HandleExternalScrollChanged);

        Unloaded += ScrollViewer_Unloaded;
    }
    //记录参数
    private int _lastScrollingTick = 0, _lastScrollDelta = 0;
    //private double _lastTouchVelocity = 0;
    private double _currentOffset = 0;
    private double _targetOffset = 0;
    private double _targetVelocity = 0;
    private long _lastTimestamp = 0;
    //标志位
    private bool _isRenderingHooked = false;
    private bool _isAccuracyControl = false;
    private bool _isInternalScrollChange = false;

    private void ScrollViewer_Unloaded(object sender, RoutedEventArgs e)
    {
        DependencyPropertyDescriptor
            .FromProperty(VerticalOffsetProperty, typeof(System.Windows.Controls.ScrollViewer))
            .RemoveValueChanged(this, HandleExternalScrollChanged);

        if (_isRenderingHooked)
        {
            CompositionTarget.Rendering -= OnRendering;
            _isRenderingHooked = false;
        }
    }

    /// <summary>
    /// 处理外部滚动事件，更新当前偏移量
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void HandleExternalScrollChanged(object? sender, EventArgs e)
    {
        if (!_isInternalScrollChange)
            _currentOffset = VerticalOffset;
    }

   /* protected override void OnManipulationDelta(ManipulationDeltaEventArgs e)
    {
        base.OnManipulationDelta(e);    //如果没有这一行则不会触发ManipulationCompleted事件??
        e.Handled = true;
        //手还在屏幕上，使用精确滚动
        _isAccuracyControl = true;
        double deltaY = -e.DeltaManipulation.Translation.Y;
        _targetOffset = Math.Clamp(_currentOffset + deltaY, 0, ScrollableHeight);
        // 记录最后一次速度
        _lastTouchVelocity = -e.Velocities.LinearVelocity.Y;

        if (!_isRenderingHooked)
        {
            _lastTimestamp = Stopwatch.GetTimestamp();
            CompositionTarget.Rendering += OnRendering;
            _isRenderingHooked = true;
        }
    }

    protected override void OnManipulationCompleted(ManipulationCompletedEventArgs e)
    {
        base.OnManipulationCompleted(e);
        e.Handled = true;
        Debug.WriteLine("vel: " + _lastTouchVelocity);
        _targetVelocity = _lastTouchVelocity; // 用系统识别的速度继续滚动
        _isAccuracyControl = false;

        if (!_isRenderingHooked)
        {
            _lastTimestamp = Stopwatch.GetTimestamp();
            CompositionTarget.Rendering += OnRendering;
            _isRenderingHooked = true;
        }
    }*/

    /// <summary>
    /// 判断MouseWheel事件由鼠标触发还是由触控板触发
    /// </summary>
    /// <param name="e"></param>
    /// <returns></returns>
    private bool IsTouchpadScroll(MouseWheelEventArgs e)
    {
        var tickCount = Environment.TickCount;
        var isTouchpadScrolling =
                e.Delta % Mouse.MouseWheelDeltaForOneLine != 0 ||
                (tickCount - _lastScrollingTick < 100 && _lastScrollDelta % Mouse.MouseWheelDeltaForOneLine != 0);
        //Debug.WriteLine(e.Delta + "  " + e.Timestamp + "  ==>" + isTouchpadScrolling);
        _lastScrollDelta = e.Delta;
        _lastScrollingTick = e.Timestamp;
        return isTouchpadScrolling;
    }

    protected override void OnMouseWheel(MouseWheelEventArgs e)
    {
        e.Handled = true;

        //触摸板使用精确滚动模型
        _isAccuracyControl = IsTouchpadScroll(e);

        if (_isAccuracyControl)
        {
            _targetVelocity = 0; // 防止下一次触发缓动模型时继承没有消除的速度，造成滚动异常
            _targetOffset = Math.Clamp(_currentOffset - e.Delta, 0, ScrollableHeight);
        }
        else
            _targetVelocity += -e.Delta * VelocityFactor;// 鼠标滚动，叠加速度（惯性滚动）

        if (!_isRenderingHooked)
        {
            _lastTimestamp = Stopwatch.GetTimestamp();
            CompositionTarget.Rendering += OnRendering;
            _isRenderingHooked = true;
        }
    }

    private void OnRendering(object? sender, EventArgs e)
    {
        // 计算时间增量
        long currentTimestamp = Stopwatch.GetTimestamp();
        double deltaTime = (double)(currentTimestamp - _lastTimestamp) / Stopwatch.Frequency;
        _lastTimestamp = currentTimestamp;

        double timeFactor = deltaTime / TargetFrameTime;

        if (_isAccuracyControl)
        {
            // 精确滚动：Lerp 逼近目标（使用时间因子调整）
            double lerpAmount = 1.0 - Math.Pow(1.0 - LerpFactor, timeFactor);
            _currentOffset += (_targetOffset - _currentOffset) * lerpAmount;

            // 如果已经接近目标，就停止
            if (Math.Abs(_targetOffset - _currentOffset) < 0.5)
            {
                _currentOffset = _targetOffset;
                StopRendering();
            }
        }
        else
        {
            // 缓动滚动：速度衰减模拟（使用时间因子调整）
            if (Math.Abs(_targetVelocity) < 0.1)
            {
                _targetVelocity = 0;
                StopRendering();
                return;
            }

            // 使用时间因子调整摩擦力衰减
            _targetVelocity *= Math.Pow(Friction, timeFactor);

            // 根据实际时间计算偏移量
            _currentOffset = Math.Clamp(_currentOffset + _targetVelocity * (timeFactor / 24), 0, ScrollableHeight);
        }

        InternalScrollToVerticalOffset(_currentOffset);
    }

    private void InternalScrollToVerticalOffset(double offset)
    {
        _isInternalScrollChange = true;
        ScrollToVerticalOffset(offset);
        _isInternalScrollChange = false;
    }


    private void StopRendering()
    {
        CompositionTarget.Rendering -= OnRendering;
        _isRenderingHooked = false;
    }
}
```