---
title: 简单介绍一下stable diffusion
date: 2023-02-17 11:08:24
tags:
- stable diffusion
description: stable diffusion这么火，不了解一下？
---
[Stable Diffusion](https://en.wikipedia.org/wiki/Stable_Diffusion)是一个在2022年由[LMU](https://ommer-lab.com/)、[IWR, Heidelberg University](https://www.iwr.uni-heidelberg.de/)、[Runway](https://runwayml.com/)[联合提出](https://ommer-lab.com/research/latent-diffusion-models/)的文本生成图片的机器学习模型。具体实现由[CompVis](https://github.com/CompVis)小组[开源](https://github.com/CompVis/stable-diffusion)，[Stability AI](https://stability.ai/)提供商业支持。Version 2由Stability AI[开源](https://github.com/Stability-AI/stablediffusion)。

## 线上体验

Stability AI提供了在线体验：[dreamstudio](https://beta.dreamstudio.ai)。

{% asset_img dreamstudio.png dreamstudio%}

生成图片需要消耗积分，新账号有大概100积分，可以稍微玩一会。

[NovelAI.Dev](https://novelai.dev/)也提供了[魔法小镇](https://www.kamiya.dev/)可以在线体验，需要翻墙获取[注册码](https://www.kamiya.dev/openid.html)。

## 本机自建

如果自己的显卡还行的话，可以尝试在本地运行。NovelAI.Dev提供了一份[安装指南](https://guide.novelai.dev/guide/install/sd-webui)。

### 预训练
不需要完全从头训练，CompVis有将自己训练后的参数以[检查点（checkpoint）](https://github.com/CompVis/stable-diffusion#weights)的形式共享出来，放在了[Hugging Face](https://huggingface.co/CompVis)。Stability AI也同样放出了[v2的参数](https://huggingface.co/stabilityai)。

### ui
虽然sd(stable diffusion)官方有指导文档，但对新手还是不够友好，可以使用带ui的[stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)。

使用stable-diffusion-webui，[按照教程](https://github.com/AUTOMATIC1111/stable-diffusion-webui#installation-and-running)一步步来，把程序当作黑箱，也可以很轻易的运行起来。
全默认设置渲染一张在GTX 1080上需要耗时10秒出头。

{% asset_img self-host.png 本机示例 %}

## 提示语

怎么写提示语还是有点讲究的。

[Openart](https://openart.ai/)上有大量网友上传的文本生成图像作品可以参考。
而且有整理出一本[PromptBook](https://cdn.openart.ai/assets/Stable%20Diffusion%20Prompt%20Book%20From%20OpenArt%2011-13.pdf)，值得一阅。

[stable diffusion art](https://stable-diffusion-art.com/)也有一篇[提示语指南](https://stable-diffusion-art.com/prompt-guide/)。

## 附录

### stable-diffusion-webui教程

1. 安装python 3.10.6

注意，一定要3.10.6。可以用anaconda：
```bash
conda create -n py310 python=3.10.6
conda activate py310
```

2. 使用git下载代码

```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
```

3. 下载ckpt放在`models/Stable-diffusion`

从[Hugging Face](https://huggingface.co/CompVis/stable-diffusion-v-1-4-original)下载ckpt。

这里提供一个sd-v1-4的[磁力链接](magnet:?xt=urn:btih:3a4a612d75ed088ea542acac52f9f45987488d1c&dn=sd-v1-4.ckpt&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a6969%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337)。

4. 运行`webui-user.bat`

这一步要很久，需要下载安装很多依赖。耐心多等一会。

5. [可选]安装[xformers](https://github.com/facebookresearch/xformers)以[加速图片生成](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Xformers)

```bash
pip install -U xformers
```

在启动webui时，需要添加`--xformers`才能会检查xformers，否则还是会提示：
```
Checking Dreambooth requirements...
[+] bitsandbytes version 0.35.0 installed.
[+] diffusers version 0.10.2 installed.
[+] transformers version 4.25.1 installed.
[ ] xformers version N/A installed.
[+] torch version 1.13.1+cu117 installed.
[+] torchvision version 0.14.1+cu117 installed.
```

可以修改`webui-user.bat`：
```bat
set COMMANDLINE_ARGS=--xformers
```

再次启动就正常了：
```
Checking Dreambooth requirements...
[+] bitsandbytes version 0.35.0 installed.
[+] diffusers version 0.10.2 installed.
[+] transformers version 4.25.1 installed.
[+] xformers version 0.0.16rc425 installed.
[+] torch version 1.13.1+cu117 installed.
[+] torchvision version 0.14.1+cu117 installed.
```