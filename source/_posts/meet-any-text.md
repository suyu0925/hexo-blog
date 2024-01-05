---
title: "AnyText：AI绘图在可控制性上的又一突破"
date: 2024-01-05 10:34:54
tags:
- AI
- stable diffusion
description: 阻碍AI绘画商用的最大障碍就是可控制性，AnyText又将AI绘画的商用推进了一步。
---

## 介绍

> AnyText是一种基于扩散的多语言视觉文本生成和编辑模型，专注于在图像中渲染准确且连贯的文本。该项目由阿里巴巴开发，支持在图像中生成和编辑多种语言的文本，使其与背景无缝融合。
> 
> 该模型解决了合成文本中模糊、不可读或错误字符的问题。AnyText 可以与现有的扩散模型集成，用于准确渲染或编辑文本。

效果演示图比较大，点[这里](https://raw.githubusercontent.com/tyxsspa/AnyText/main/docs/gallery.png)看大图。

这个项目挺新的，贴一段官方的时间线：
- [2024.01.04] - 上线[HuggingFace（抱脸）在线演示](https://huggingface.co/spaces/modelscope/AnyText)。
- [2023.12.28] - 上线[ModalScope（创空间）在线演示](https://modelscope.cn/studios/damo/studio_anytext/summary)。
- [2023.12-27] - 发布[模型和推理代码](https://modelscope.cn/models/damo/cv_anytext_text_generation_editing/summary)。
- [2023.12.05] - 上线[论文](https://arxiv.org/abs/2311.03054)。

路线图：
- [x] 发布模型和推理代码
- [x] 提供可公开访问的演示
- [ ] 提供一个免费字体文件(🤔)
- [ ] 提供从公开模型和LoRAs中合并权重的工具
- [ ] 提供stable-diffusion-webui插件(🤔)
- [ ] 发布AnyText-benchmark数据集和评估代码
- [ ] 发布AnyWord-3M数据集和训练代码

可以看到还处在较为前期的阶段。

### 原理

AnyText包含一个具有两个主要元素的扩散管线：辅助潜在模块和词嵌入模块。
前者使用文本字形、位置和蒙版图像等输入来生成用于文本生成或编辑的潜在特征。
后者采用OCR模型将笔划数据编辑为嵌入，与标记生成器中的图像标题嵌入混合，生成与背景无缝集成的文本。
采用文本控制扩散损失和文本感知损失进行训练，以进一步提高书写准确性。

{% asset_img framework.jpg 框架 %}

## 意义

有了准确的文字，就能更精准的传达信息，省去最后的添加文字环节。不管是商用（广告）还是娱乐（表情包），都能得到极大的提升。

对AI商用感兴趣的同学可以抓紧上手研究，趁它的热度还没起来。
