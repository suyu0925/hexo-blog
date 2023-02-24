---
title: 为stable diffusion训练预处理图片
date: 2023-02-24 14:24:01
tags:
- stable diffusion
description: 在开始训练之前，先要准备数据集。
---
## 图片尺寸
目前主流的基模就3个，[sd-v1.4](https://huggingface.co/CompVis/stable-diffusion-v1-4), [sd-v1.5](https://huggingface.co/runwayml/stable-diffusion-v1-5)和[sd-v2.1](https://huggingface.co/stabilityai/stable-diffusion-2-1)。

其中，sd-v2.1的大小为768x768，其它都是512x512。

~~我们训练的数据集大小要和基模保持一致（吗？不确定）。~~

## 人脸

如果需要训练的数据集是人脸照片，那么可以直接使用stable-diffusion-webui中的`自动焦点裁剪（Auto focal point crop）`功能。

{% asset_img 自动焦点裁剪 %}

一键生成，只需检查一下就好。

## 提示语

stable-diffusion-webui可以在裁剪的同时生成提示语，推荐使用deepbooru算法。

## 手动剪裁

如果图片不敏感，可以使用在线的剪裁网站：[brime](https://birme.net/)，它也支持自动焦点检测。
