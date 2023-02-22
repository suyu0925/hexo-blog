---
title: 控制diffusion模型
date: 2023-02-22 12:51:53
tags:
description: 每次生成diffusion都是撞大运，有什么办法可以控制生成呢？
---
[Lvmin Zhang](https://github.com/lllyasviel)发布的[ControlNet](https://github.com/lllyasviel/ControlNet)给了我们一个答案。

来自日本的[Kakigōri Maker](https://github.com/Mikubill)提供了[webui的扩展](https://github.com/Mikubill/sd-webui-controlnet)。

## 安装扩展
1. 进入webui中的"Extensions"标签页。
2. 进入"Install from URL"标签页。
3. 把网址`https://github.com/Mikubill/sd-webui-controlnet`贴到"URL for extension's git repository"。
4. 点击"Install"按钮，等待。
5. 重启webui。

## controlnet界面
{% asset_img control-net-extension-glance.png ControlNet界面 %}

## 下载模型
我们需要先下载预训练好的ControlNet模型。

原作者Lvmin Zhang有公布[自己基于sd15训练的模型](https://huggingface.co/lllyasviel/ControlNet/tree/main/models)。但这个模型很大，有5.71GB。

Kakigōri Maker提供了[精简模型](https://huggingface.co/webui/ControlNet-modules-safetensors/tree/main)，[kohya-ss](https://github.com/kohya-ss)提供了[叉分模型](https://huggingface.co/kohya-ss/ControlNet-diff-modules/tree/main)，这两个模型产生的结果有所不同。

## 预处理器
sd-webui-controlnet内置了几种预处理器：
- canny
- depth
- hed

未完待续。
