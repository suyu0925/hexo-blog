---
title: 【翻译】数据可视化中的颜色选择
date: 2021-01-05 10:36:14
description: 在这篇文章中，我将描述在数据可视化中使用的常见色板，提供配色的几个小窍门和最佳实例，最后会推荐几个用来生成和测试图表配色的工具。
tags:
- design
categories: 
- computer science
- data visualization
---

本文翻译并改写自Michael Yi的[博文](https://medium.com/nightingale/how-to-choose-the-colors-for-your-data-visualizations-50b2557fa335)。

配色是图表的重要元素之一，一个好的配色可以给数据的故事添色不少，而差的配色会隐藏或转移重点。

在这篇文章中，我将描述在数据可视化中使用的常见色板，提供配色的几个小窍门和最佳实例，最后会推荐几个用来生成和测试图表配色的工具。

## 调色板的类型

数据可视化中的色板主要分成以下三类：

* 分类色板(Qualitative palettes)
* 顺序色板(Sequential palettes)
* 发散色板(Diverging palettes)

使用哪种类型取决于数据的特性。

### 分类色板

{% asset_img "qualitative-palettes-line-chart.png" "分类折线图示例" %}

当变量具有天然的分类属性时，可适用分类色板。分类属性有明显区别并且没有固定顺序。比如国家、种族、排名、性别。每一种分类都对应色板中的一个颜色。

{% asset_img "qualitative-palettes.png" "分类色板示例" %}

分类色板的每一种颜色对应一个分类，且区分鲜明。**根据经验，应尝试将分类色板的颜色数量限制到10个或以下。**如果颜色太多，就很难将其区分。如果确实分类太多，超出了色板的颜色数量，可以将分类合计，比如将最少的几个分类合计为“其他”。多次列出所有颜色不是一个好主意，会引起视觉混乱。

{% asset_img "bundle-smallest.png" "压缩分类" %}

我们区分不同色彩主要是依据其色调。当然也可以通过调整亮度和饱和度来获得其它变化，但最好不要调整过多。过大的高亮和饱和度的差异可能会让读者误解某些颜色更重要，除非你确实是想这样表达。请避免使用相同色调仅亮度和饱和度不同的两种颜色，除非数据与颜色有关。比如下面这个折线图，每天的订阅数表示为浅色线条，7日均线就可以使用暗色。

{% asset_img "two-colors-line-chart.png" "性质相近的数据可以使用色调相近亮度不同的颜色" %}

### 顺序色板

当变量是数字或有固定顺序时，可以使用顺序色板来表示。通常以色调、亮度来渐变。

{% asset_img "sequential-pattles.png" "顺序色板" %}

或者色调和亮度一起。

{% asset_img "multiple-sequential.png" "叠加色板" %}

顺序色板的颜色最突出的方面是亮度。一般来说，颜色越浅代表值越小，颜色越深代表值越大。不过在深色背景下，通常会返过来，值越大则越亮。原则就是值越大越醒目，对比度越高。

顺序色板的次要维度是色调。大多数情况下可只使用同一个色调，用亮度来代表值的大小。但使用两种不同的颜色来辅助识别也不失为一种好办法。通常亮度高的一端使用暖色（趋向红色或黄色），较暗的一端使用冷色（超向绿色，蓝色或紫色）。

### 发散色板

{% asset_img "diverging-palette.png" "发散色板" %}

如果我们的变量有一个中间值，类似数字中的0，那我们可以使用发散色板。发散色板本质上是两个顺序色板的首尾相接，接点即中间值。大于中间的值的变量分配中心一侧的颜色，小值分配相对侧的颜色。

{% asset_img "diverging-palette-bar.png" "diverging-palette-bar" %}

通常，每个顺序色板都使用独特的色调，这样更容易区分相对于中心的正值和负值。与顺序色板一样，通常为中心值分配浅色，颜色越深表示距中心的距离越大。

### 离散 vs. 连续

顺序色板和发散色板可以通过两种不同的方式与数据值相关联：作为一组离散的颜色，或者作为数据值和颜色之间的连续函数。

{% asset_img "diverging-palette-2.png" "diverging-palette-2" %}

用于创建色板的工具通常遵循第一类，而用于创建可视化的工具通常具有建立连续关联的能力。 虽然在值和颜色之间具有连续似乎总是更好，但离散色板仍然有其优点。

相比位置或长度，我们辨别颜色差异更费力，所以将颜色与精确值关联已经处于劣势。颜色的离散化可以减轻认知负担，增加数据的梯度。另外，我们还可以通过调整色板的取值范围来更好的展现数据。比如当数据包含异常值时，连续色板会迫使大多数数据挤在一个小的颜色区间。而在使用离散色板时，我们可以创建大小不等的范围，以更好的表示数据中的差异。

{% asset_img "sequential-pattle-map-chart.png" "sequential-pattle-map-chart" %}

而离散色板的主要问题是不能比较被划分在同一个范围中的元素。在使用连续色板的接近值之间存在一些颜色差异的地方（例如上图中的德克萨斯州和加利福尼亚之间），使用离散色板体现不出差异。

## 使用颜色时的额外小技巧

### 避免颜色滥用

尽管颜色是数据可视化的重要组成部分，但还是要有节制，只在适当的地方使用颜色。并不是每个图表都需要多种颜色。如果仅要绘制两个变量，则它们可能会由垂直和水平位置或长度进行编码。一般只有在第三个变量需要编码到图表中或作为[饼图等专业图表](https://chartio.com/learn/charts/pie-chart-complete-guide/)的组成部分时，才会出现颜色。但是，在某些情况下，可以添加颜色以强调特定的发现或作为额外的高亮编码。

{% asset_img "unnecessary-items.png" "unnecessary items" %}

### 不同图表间使用的颜色保持一致性

{% asset_img "consistent-color.png" "consistent color" %}

如果你在做一个含有多个图表的仪表盘或报告，尽量在同一个分组或场景下的不同图表间使用一致的颜色。如果颜色变化了，会减低易读性。

### 最大化利用颜色

有时可以利用颜色的感知方式来增强可视化效果。如果要绘制的组具有固有的颜色约定（例如运动队和政党），分配适当的颜色可以使读者更轻松地进行可视化处理。甚至可能要尝试使用品牌的颜色作为基础来创建自定义调色板。

一般来说要避免使用高饱和度和高亮度的颜色，以减少读者的视觉疲劳。但在有高亮重要元素的需要时，可以视情况使用。

同时也不要忽视灰色，它既是很好的数据背景，又可以有[其它用途](https://www.visualisingdata.com/2015/01/make-grey-best-friend/)。

{% asset_img "leverage-meaningfulness.png" "leverage meaningfulness" %}

最后，值得一提的是，不同的文化可以将[不同的含义赋予每种色调]（https://informationisbeautiful.net/visualizations/colours-in-cultures/）。例如，在某些西方文化中，红色可能与热情或危险相关，但在某些东方文化中，红色代表繁荣与吉祥。除非将调查结果呈现给广泛的受众，否则这可能不是特别重要，但这是值得记住的另一种工具，可帮助你更轻松地掌握可视化效果。

### 不要忘记色盲

大约有4%的人有不同程度的色盲，绝大多数是男性。最常见的色盲是红绿色盲，他们分不清红色和绿色。基于以上原因，我们最好不要单纯只使用色调来区分数值，可以引入更多维度，比如亮度和饱和度。你可以使用像Coblis这样的[色盲模式模拟](https://www.color-blindness.com/coblis-color-blindness-simulator/)来确认最终的可视化效果能否被理解，以及是否存在颜色混淆。

{% asset_img "color-blindness.png" "color blindness" %}

## 选择颜色的工具

懒得翻了…… 直接点开链接体验吧。

There are many tools online to help you select and test colors for your data visualizations. Here, I will highlight some of the simplest tools to help you get up to speed on color choices.

### [ColorBrewer](https://colorbrewer2.org/)

{% asset_img "ColorBrewer.png" "ColorBrewer" %}

ColorBrewer is the classic reference for color palettes, and provides a number of different palettes of each type. Certain palettes may be questionable for colorblind safety, so be sure to check out the eye-icon above the color codes pane to check if a color set has a potential to high chance of perception difficulties (indicated by a ? and X, respectively).

### [Data Color Picker](https://learnui.design/tools/data-color-picker.html)

{% asset_img "data-color-picker.png" "Data Color Picker" %}

The Data Color Picker is a quick and easy to use tool for generating sequential and diverging palettes. The default “Palette” tab is best used for generating multi-hue sequential palettes rather than qualitative palettes, since the interpolation between endpoints will necessarily leave out some segment of hues in the color wheel.

### [Chroma.js Color Palette Helper](https://vis4.net/palettes/)

{% asset_img "chroma.js.png" "Chroma.js Color Palette Helper" %}

The chroma.js Color Palette Helper is a little bit more involved than Data Color Picker with its options for correcting lightness and bezier interpolation and slightly more difficult input of color values. However, it also allows for some additional freedom in setting multiple stop-points for the algorithm to try and fit a palette to. As an additional bonus, the application also includes a color blindness simulator on the same page, highlighting the most common types of deficiency where issues may crop up.

### [Color Thief](https://lokeshdhakar.com/projects/color-thief/)

{% asset_img "color-thief.png" "Color Thief" %}

There aren’t as many quick-and-easy tools for generating qualitative palettes as there are for sequential and diverging palettes. [I want hue](https://medialab.github.io/iwanthue/) and [Colorgorical](http://vrl.cs.brown.edu/color) are both quick for generating random palettes, but a bit more difficult to work with when you want to customize your values.
But one fun way of creating a qualitative palette is to draw inspiration from images and screencaps with appealing natural palettes. There are a few tools out there to help do this, but Color Thief is one of the easiest to work with, automatically extracting a healthy-sized palette from uploaded pictures. This doesn’t necessarily mean that you can use the extracted colors directly and in order as a visualization palette. They can be an inspirational starting point for colors that look good together, but you’ll likely need to make some tweaks and revisions to ensure that the colors you choose are effective in a visualization context.

### [Viz Palette](https://projects.susielu.com/viz-palette)

{% asset_img "viz-palette.png" "Viz Palette" %}

In the previous section, [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/) was linked as a resource for checking how your final visualization might look to those with color perception deficiencies. Viz Palette is a broader color palette tool you can use to check your palettes before you put together your visualizations. In addition to being able to view sets of colors in the context of example plots and under simulated-color perception deficiencies, you can also modify and change your palette’s colors immediately.

### [Viser主题](https://viserjs.github.io/theme.html)

{% asset_img "viser-theme.png" "Viser Theme" %}

蚂蚁的Viser主题工具也提供了色板的默认方案与调试展示，同时提供了蚂蚁可视化的[色板设计语言](https://antv.gitee.io/zh/docs/specification/language/palette)。

## 总结

本文简要概述了颜色可用于有效数据可视化的方式。根据映射到颜色的数据类型，应使用不同类型的色板（分类，顺序和发散）。确保使用颜色时，它是有意义的并且始终如一地使用，并尝试解决色盲问题，以改善绘图的可访问性。

向他人展示发现结果时，请务必仔细考虑您的颜色选择，一组好的颜色可以让向听众传达信息变得更加容易。