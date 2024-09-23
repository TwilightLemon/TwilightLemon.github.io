---
title: WPF 如何流畅地滚动ScrollViewer 简单实现下 
published: 2020-06-13
description: 'WPF 流畅滚动ScrollViewer'
image: ''
tags: [WPF,.Net]
category: 'WPF'
draft: false 
lang: ''
---
看了看原生UWP的ScrollViewer，滑动很流畅(例如 开始菜单)，但是WPF自带的ScrollViewer滚动十分生硬..

突发奇想，今天来实现一个流畅滚动的ScrollViewer.

## 一、目标
查阅网上的实现方法，要么直接重写控件，要么一堆Storyboard..很是无奈,还有些许bug.

主要目标如下:

1.能够流畅地滚动ScrollViewer   要求：有惯性的物理滚动 而不是 生硬的 内容滚动.

2.在使用动画的过程中，避免多个begin导致卡顿

3.好用(? )

## 二、准备工作
实现以上目标需要到的几件东西:

1.对于Listbox之类的控件需要先将滚动方式变为 像素滚动  （若没有的话就可以不设置）
``` xml
<ListBox
    VirtualizingPanel.ScrollUnit = "Pixel" 
    VirtualizingPanel.VirtualizationMode="Recycling"/>
```

2.选一种动画使用的 缓动函数 这里推荐使用 CubicEase的EaseOut函数 (优点:接近于惯性滚动  对于CPU比较友好)

3.要对ScrollViewer启用滚动动画 需要自己写附加属性:
``` csharp
public static class ScrollViewerBehavior
{
      public static readonly DependencyProperty VerticalOffsetProperty = DependencyProperty.RegisterAttached("VerticalOffset", typeof(double), typeof(ScrollViewerBehavior), new UIPropertyMetadata(0.0, OnVerticalOffsetChanged));
      public static void SetVerticalOffset(FrameworkElement target, double value) => target.SetValue(VerticalOffsetProperty, value);
      public static double GetVerticalOffset(FrameworkElement target) => (double)target.GetValue(VerticalOffsetProperty);
      private static void OnVerticalOffsetChanged(DependencyObject target, DependencyPropertyChangedEventArgs e) => (target as ScrollViewer)?.ScrollToVerticalOffset((double)e.NewValue);
}
```

## 三、编码

``` csharp
//继承ScrollViewer 通过截获MouseWheel事件控制滚动
    public class MyScrollViewer : ScrollViewer
    {
        //记录上一次的滚动位置
        private double LastLocation = 0;
        //重写鼠标滚动事件
        protected override void OnMouseWheel(MouseWheelEventArgs e)
        {
            double WheelChange = e.Delta;
            //可以更改一次滚动的距离倍数 (WheelChange可能为正负数!)
            double newOffset = LastLocation - (WheelChange * 2);
            //Animation并不会改变真正的VerticalOffset(只是它的依赖属性) 所以将VOffset设置到上一次的滚动位置 (相当于衔接上一个动画)
            ScrollToVerticalOffset(LastLocation);
            //碰到底部和顶部时的处理
            if (newOffset < 0)
                newOffset = 0;
            if (newOffset > ScrollableHeight)
                newOffset = ScrollableHeight;

            AnimateScroll(newOffset);
            LastLocation = newOffset;
            //告诉ScrollViewer我们已经完成了滚动
            e.Handled = true;
        }
        private void AnimateScroll(double ToValue)
        {
            //为了避免重复，先结束掉上一个动画
            BeginAnimation(ScrollViewerBehavior.VerticalOffsetProperty, null);
            DoubleAnimation Animation = new DoubleAnimation();
            Animation.EasingFunction = new CubicEase() { EasingMode = EasingMode.EaseOut };
            Animation.From = VerticalOffset;
            Animation.To = ToValue;
            //动画速度
            Animation.Duration = TimeSpan.FromMilliseconds(800);
            //考虑到性能，可以降低动画帧数
            //Timeline.SetDesiredFrameRate(Animation, 40);
            BeginAnimation(ScrollViewerBehavior.VerticalOffsetProperty, Animation);
        }
    }
```
使用方法:直接创建 `<MyScrollViewer/>`
如果是在ListBox中，可以通过修改模板的方式，把`<ScrollViewer/>`换成`MyScrollViewer`即可.

## 四、关于性能
按照上述方法实现的功能，CPU占用率基本稳定在10% ，但是要疯狂地上下滑动滚轮的话，25%+   但是动画还是很流畅的

以下有几点可以改进的措施:

滚动的CPU占用不只是对偏移量的一个计算，与你滚动的UI画面内容具有很大的关系

例如大量的图片Image   3D对象    复杂的自定义控件 等等 都需要在滚动时计算并绘制。

你可以尝试以下方法:
1. 启用ListBox的虚拟化技术

2. 对于图像的绘制，可以通过降低其渲染度(可能会损坏图片质量 特别是低清小图 ),对你的图片对象使用:
     ``` csharp
     RenderOptions.SetBitmapScalingMode(控件对象,BitmapScalingMode.LowQuality);
     ```
3. 就像上文中所说，可以通过降低渲染帧数来控制CPU占用率（可能会有失流畅度）

4. 如果能找到更好的缓动函数

5. 参阅: [优化控件性能 -WPF |Microsoft Docs](https://learn.microsoft.com/zh-cn/dotnet/desktop/wpf/advanced/optimizing-performance-controls?view=netframeworkdesktop-4.8)