---
title: html里的client、offset、scroll属性
date: 2021-07-22 14:10:54
tags:
description: 经常会碰到offset、scroll、client这几个相关属性，每次都要各种实验，在这里总结记录一下。
---

先直接放一张老图。

{% asset_img "tops_in_html.jpg" "tops" %}

我们可以将一个`div`在浏览器中所占显示区域**除自身外\(`content`\)** 划分成如下几个部分：
* `padding`
* `margin`
* `border`
* `position`
* `scrollbar`
* `overflow hidden`

# client

`client`指元素本身的**可视**内容，仅包含`margin`、`padding`，不包括`overflow hidden`、`scrollbar`、`border`等。

即```client = content + margin + padding```。

# offset

`offset`指**偏移**，包括这个元素在文档中占用的所有显示宽度，包含`scrollbar`、`padding`、`border`，不包括`overflow hidden`的部分。

比`client`多出了`border`和`scrollbar`。

```javascript
offset = (content + margin + padding) + border + scrollbar
       = client + border + scrollbar
```

# scroll

最麻烦的`scroll`来了，再上一张图。

{% asset_img "tops_in_html_2.jpg" "scroll" %}

对`scroll`来说，最常用的操作是设置`scrollTop`属性来控制滚动条。

`scrollTopMax`并不是常规属性，可以这样计算：
```javascript
scrollTopMax = scrollHeight - clientHeight
```

具体可以来[这里](https://codesandbox.io/s/client-offset-scroll-enqyh)调试。
