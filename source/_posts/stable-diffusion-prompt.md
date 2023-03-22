---
title: stable diffusion中的提示语
date: 2023-02-21 22:03:50
tags:
- stable diffusion
description: 总结一些提示语的技巧。
---
NovelAI.Dev有提供一份指南：[提示词工程学](https://guide.novelai.dev/guide/prompt-engineering/)，可以参考。

针对不同的底模，会有不同的标签。比如[Danbooru的标签超市](https://tags.novelai.dev/)。

## 语法

### 强调
用圆括号表示强调，比如`(best quality)`。

### 弱化
用方括号表示弱化，比如`[gray]`。

### 系数
可以用一个冒号后面接数字的形式来指定系数，这个值是一个百分比，总和最好为1。比如`Cute:0.1, Grey Cat:0.6, Unreal Engine rendering:0.3`。

### LoRA
使用LoRA的语法是尖括号，比如`<lora:koreanDollLikeness_v10:0.6>`。

## 词缀
可以在[这里](https://proximacentaurib.notion.site/2b07d3195d5948c6a7e5836f9d535592?v=b5b75a67cc52483c9965cfc141f6f582)查看到一些网友推荐的词缀。

### 清晰度
4k, 8k, 
best quality, high quality,
masterpiece, official art,
extremely detailed, 

负面提示语：
paintings, sketches, 3d render,
worst quality, low quality, normal quality, lowres, 
bad art, extra digit, fewer digits,

### 静物
35mm, sharp, 
low poly 3d render, vibrant pastel colors, tilt shift, film grain,

### 环境
cinematic, dramatic, composition, sunny sky, brutalist, hyper realistic, 
epic scale, sense of awe, hypermaximalist, insane level of details, artstation HQ,

### 镜头
closeup, wide angle, looking the viewer, pov,

负面提示语：
cropped, out of frame, 

### 人物
#### 出镜
full body, half body,

负面提示语：
long body, 

#### 脸
负面提示语：
mutation, mutated, 

#### 肢体
extra limbs, extra legs, extra arms, extra fingers, missing fingers, mutated hands,
bad anatomy, 

#### 表情
open mouth, slightly smile

#### 皮肤
负面提示语：
skin spots, acnes, skin blemishes, age spot,

#### 服装
school shirt, jeans, tight crop top, wrap skirt, 

### 色彩
负面：
monochrome

### 艺术家风格
可以指定使用某个艺术字的风格，比如`a portrait of a character in a scenic environment by [artist]`

艺术家`[artist]`可以在[这里](https://proximacentaurib.notion.site/e28a4f8d97724f14a784a538b8589e7d?v=ab624266c6a44413b42a6c57a41d828c)查看。

### NSFW
{% spoiler NSFW %}
nude, naked, 
spead leg, 
pussy,
huge breasts, medium breasts,
{% endspoiler %}
