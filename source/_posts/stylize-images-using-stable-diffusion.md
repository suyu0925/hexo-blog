---
title: "[Stable Diffusion]风格化"
date: 2023-12-28 09:45:34
tags:
- stable diffusion
description: 总结一些使用SD风格化图像的方法。
---
## 文生图

如果是文生图，可以通过修改提示语的方法来风格化图像。

比如我们想要一张躺在书桌上的小猫动漫图：
```
a cute cat, lie on a table, in a room, sunlight,
```
{% asset_img original.png 原始 %}

我们可以通过修改提示语来风格化图像，比如：

正面提示语
```
anime artwork {prompt}, anime style, key visual, vibrant, studio anime, highly detailed
```
负面提示语
```
photo, deformed, black and white, realism, disfigured, low contrast
```
{% asset_img animate.png 漫画风格 %}

使用修改提示语来风格化图像受到模型的限制，不同模型可能会需要不同的提示语。

SDXL模型的风格提示语可以参考[这里](https://stable-diffusion-art.com/sdxl-styles/)。

## 图生图

用图生图的方法来风格化是很传统的方法了。

比如我们之前{% post_link realistify-lofi-girl "真人化lofi girl" %}的例子。

启发：可以看看webui的[img2img alternative test](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#img2img-alternative-test)。
