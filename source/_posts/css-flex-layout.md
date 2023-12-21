---
title: css中的flex布局
date: 2023-12-21 15:59:15
tags:
description: 对flex布局总是一知半解的，系统的学习一下。
---

首先肯定是去[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)看，但文档很分散，看得相当不直观。

于是找到一篇阮一峰的文章[Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)，配图解释得非常清晰。网友还给做了一个[在线演示](https://static.vgee.cn/static/index.html)，可以直接在浏览器开发工具中调整参数，查看效果。

看完后还有一个练习的网站，可以检查一下有没有正确理解：[Flexbox Froggy](https://flexboxfroggy.com/#zh-cn)。

这里再记录一下个人的理解。

### 两个轴

[flexible box layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)，简称[flex](https://developer.mozilla.org/en-US/docs/Glossary/Flex)，是一个二维的布局模型，有两个轴：[主轴](https://developer.mozilla.org/en-US/docs/Glossary/Main_Axis)（水平轴、横轴）和[交叉轴](https://developer.mozilla.org/en-US/docs/Glossary/Cross_Axis)（垂直轴、竖轴）。

[grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)，简称[grid](https://developer.mozilla.org/en-US/docs/Glossary/Grid)，也是一个二维的布局模型，同样有[两个轴](https://developer.mozilla.org/en-US/docs/Glossary/Grid_Axis)：行内轴（水平轴、横轴、行轴）和块轴（垂直轴、竖轴、列轴）。和flex box的不同之处在于，grid通过[]()和[]()定义行和列，两个轨道。

### justify 和 align 的区别

[justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)和[align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)都用来控制子元素的对齐，但它们的方向不同。

`justify-content`是主轴（水平）方向的，`align-content`是交叉轴（垂直）方向的。

### align-items 和 align-content 的区别

[align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)相当于对所有子项目都设置了[align-self](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-self)，是针对子项目在交叉轴（垂直）方向的对齐。

而[align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)针对的是在子项目之间和周围分配空间，并不会改变子项目的大小。

### 活用 flex-grow 和 flex-shrink

比如页面被水平的分为两部分：左边是导航栏，右边是内容区域。

与平常导航栏为固定宽度情况不同的是，两边都是自适应宽度。

此时可以通过简单的设置导航栏的`flex-shrink`为 0，内容区域的`flex-grow`为 1，来实现导航栏保持最小宽度而内容区域为自动扩展的效果。
