---
title: AI变声器
date: 2023-03-21 15:03:41
tags: 生活
description: 之前写过一篇AI歌手，现在有另一种实现方式。
---
## 基础概念

### TTS

首先是TTS，即Text To Speech，从文本直接合成语音。

语音朗读在智能手机时代之前就已经很普及了，早期并没有AI，现在在AI加持下[已经非常自然]()。

{% asset_img tts-performance.png TTS性能对比 %}

应用最广的肯定是[微软家的](https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/)，云希几乎成为一众营销号的御用配音。

开源的有[mozilla的](https://github.com/mozilla/TTS)，[coqui-ai的](https://github.com/coqui-ai/TTS)。

**自己训练音色** 

自己训练音色来做tts，有[GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS)和[MockingBird](https://github.com/babysor/MockingBird)，都支持5秒语音即可学到音色。

### 变声器

一旦基于VITS（Variational Inference Transformer for Speech）的转换速度够快，就能实现实时变声。

[GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS)的作者[花儿不哭](https://space.bilibili.com/5760446)还有另外一个项目：[RVC变声器](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI)。

### SVS

SVS，即Singing Voice Synthesis，是用于基于包括例如歌词、节奏、音高等信息的乐谱来生成虚拟歌声的技术。

比如之前介绍过的{% post_link ai-singer AI歌手 %}中使用的[DiffSinger](https://github.com/openvpi/DiffSinger)就属于SVS。补一句，[官方DiffSinger](https://github.com/MoonInTheRiver/DiffSinger)其实也有TTS版本：[DiffSpeech](https://github.com/MoonInTheRiver/DiffSinger/blob/master/docs/README-TTS.md)。

大名鼎鼎的[vocaloid](https://www.vocaloid.com/en/)也属于这类。

### SVC

SVC，即Singing Voice Conversion，在保证歌唱内容的同时，将音色从输入源转换到目标音色，可理解为变声器。

比如使用so-vits的[so-vits-svc](https://github.com/svc-develop-team/so-vits-svc)，和使用[diffusion]((https://arxiv.org/abs/2105.02446))的[diff-svc](https://github.com/prophesier/diff-svc)。
