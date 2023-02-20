---
title: 玩玩stable diffusion
date: 2023-02-20 11:04:13
tags:
description: 上一篇简单介绍了下stable diffusion，这一篇简单玩玩。
---
上一篇文章介绍了如何使用stable-diffusion-webui自建服务，这一篇我们来简单玩玩。

## 第三方检查点

在{% post_link intro-stable-diffusion 上一篇 %}我们使用了CompVis和Stability AI官方的检查点，但其实还有很多第三方的检查点，比如动漫模型[DreamShaper](https://huggingface.co/Lykon/DreamShaper)和真人模型[Chilloutmix](https://huggingface.co/TASUKU2023/Chilloutmix)，同样可以在HuggingFace上找到。

在文件和版本页面，我们可以看到这些检查点文件的扩展名是`.safetensors`，[safetensors](https://huggingface.co/docs/safetensors/index)是HuggingFace发明的一种文件格式，用以安全且快速的存储张量。检查点除了`.ckpt`也支持`.safetensors`格式。

## 配置字符串

模型提供者同时会提供一些示范提示语以及配置，让你能生成同样的结果。比如在DreamShaper的[官方示例](https://civitai.com/gallery/45544?modelId=4384&modelVersionId=5636&infinite=false&returnUrl=%2Fmodels%2F4384%2Fdreamshaper)：

{% asset_img dreamshaper.png DreamShaper示例 %}

我们点击右下角的`Copy Generation Data`，会得到这么一个字符串：
```
modelshoot style, (extremely detailed CG unity 8k wallpaper), 1girl, slim girl, open mouth, at a university, best quality, (masterpiece:1.1), watched by the others, long brown hair, sitting, tight crop top, school skirt, sunglasses on head, shy, embarrased
Negative prompt: worst quality, (low quality:1.3), bad hands, bad anatomy,  bad_prompt_version2, canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), wierd colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render
Size: 384x512, Seed: 0, Model: dreamshaper_332BakedVaeClipFix, Steps: 30, Sampler: DPM++ SDE Karras, CFG scale: 10, Clip skip: 2, Model hash: 13dfc9921f, Hires upscale: 2, Hires upscaler: Latent, Denoising strength: 0.7
```
这个配置字符串包含了所有产生这张图片需要的信息。有Prompt，Negative prompt，和其它所有配置。

我们只要把这个字符串粘贴到webui的Prompt区域，然后点击右边的小箭头`Read generation parameters from prompt or last generation if prompt is empty into user interface.`，就会应用所有配置。

## LoRA模型

[LoRA](https://arxiv.org/abs/2106.09685)的全写是Low-Rank Adaptation of Large Language Models，是微软为微调(fine-tuning)大型语言模型引入的一项技术，也可以[用来微调Stable Diffusion](https://huggingface.co/blog/lora)。

这里需要引入一个新网站：[civiai](https://civitai.com/)。**注意：NSFW**。相比更贴近开发者的Hugging Face，它更贴近普通用户。LoRA模型可以在这里下载。

比如经常搭配chilloutmix使用的亚州女性LoRA模型：
- [Korean Doll](https://civitai.com/models/7448/korean-doll-likeness)
- [Taiwan Doll](https://civitai.com/models/7716/taiwan-doll-likeness)
- [Japanese Doll](https://civitai.com/models/10135/japanese-doll-likeness)

Lora模型的使用方法与检查点类似，下载后拷至`./models/Lora`目录，然后在提示语中使用即可。

比如
```
best quality, ultra high res, (photorealistic:1.4), 1girl, long sleeve sweater, (full body), (closeup), wide angle, (low angle), (busty), ((huge breasts)), large breasts, (brown long hair:1.3), (looking at viewer),  <lora:japaneseDollLikeness_v10:0.66>
Negative prompt: paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans
Size: 512x768, Seed: 3943162627, Model: chilloutmix_cilloutmixNi, Steps: 28, Sampler: DPM++ SDE Karras, CFG scale: 8, Model hash: 7234b76e42, Hires steps: 20, Hires upscale: 1.75, Hires upscaler: Latent (bicubic antialiased), Denoising strength: 0.5
```
中的`<lora:japaneseDollLikeness_v10:0.66>`即表示使用japanese Doll的Lora，系数0.66。

## img2img

之前我们一直用的都是文字生成图片，但Stable Diffusion还可以使用图片+文字的形式来生成新的图片。

img2img有很多种用法，比如：
1. 当觉得生成的图片方向对了时，可以保持提示语不变，使用img2img将text2img的图片当作新的起点；
2. 对整体满意，但需要微调时，可使用inpaint；
3. 对风格满意，想尝试其它主体时，可使用新的提示语；

`CFG Scale`越大，越贴近描述语。

`Denoising strength`的值越大，越远离原图。
