---
title: 控制diffusion模型
date: 2023-02-22 12:51:53
tags:
- stable diffusion
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
sd-webui-controlnet内置了几种预处理器。
首次使用时会自动下载对应的[annotator](https://huggingface.co/lllyasviel/ControlNet/resolve/main/annotator/ckpts/)。

- none
无预处理，适用于手绘草图。
无需搭配controlnet模型。
- canny
canny全称是Canny edge detection，是1986年提出的一种边缘检测算法。
搭配`control_canny`模型使用。
- hed
hed全称是[Holistically-nested Edge Detection](https://arxiv.org/abs/1504.06375)，一种整体嵌套式边缘检测的 DL 模型，精度比 Canny Edge 高不少），捕捉其边缘特征用于引导。
搭配`control_hed`模型使用。
- openpose
[openpose](https://arxiv.org/abs/1812.08008)是美国卡耐基梅隆大学基于卷积神经网络和监督学习开发的[开源库](https://github.com/CMU-Perceptual-Computing-Lab/openpose)，可以实现实时人体动作、脸部表情、手脚姿态的估计。
搭配`control_openpose`模型使用。
- depth和depth_leres
基于深度图重建。
depth_leres中的LeReS的全写是[Learning to Recover 3D Scene Shape from a Single Image](https://arxiv.org/abs/2012.09365)，可以获得更好的效果。
搭配`control_depth`模型使用。
- normal_map
normal_map是法线贴图，在保留细节方面更好。
搭配`control_normal`模型使用。
- mlsd
mlsd的全写是Maximum-Likelihood Sequence Detector，即极大似然估计。
搭配`control_mlsd`模型使用。
- segmentation
图像分割。
搭配`control_seg`模型使用。

每种预处理的效果可以在项目主页的[examples](https://github.com/Mikubill/sd-webui-controlnet#examples)查看。

### openpose编辑器

除了从图片中提取姿势，我们也可以使用[Openpose Editor](https://github.com/fkunn1326/openpose-editor)扩展来直接编辑一个openpose。

这个扩展不带骨骼约束，想要带骨骼约束可以使用[openose的vrm](https://github.com/suyu0925/raw/blob/master/stable-diffusion/openpose/openpose.vrm)去[vrmwebpose](https://www.vrmwebpose.app/)网站编辑。

## Guess Mode（实验性）
如果不知道怎么写提示语，可以使用[Guess Mode](https://github.com/Mikubill/sd-webui-controlnet#guess-mode-non-prompt-mode-experimental)。
也可用以对比不同的预处理产生的效果，在没有提示语的指导下，差异会更明显。

在这个模式下建议可以将步数适当增大，比如加到50。
