---
title: 真人化lofi girl练手
date: 2023-03-01 10:36:22
tags: 
- stable diffusion
description: 记录一次真人化卡通图片的工作流。
---
[lofi girl](https://lofigirl.com/)是一个法国的[油管频道](https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow)，我们拿它的[封面图片](https://www.uhdpaper.com/2020/08/lofi-girl-studying-hip-hop-radio.html)练手。参考了[reddit上的一个帖子](https://www.reddit.com/r/StableDiffusion/comments/11ef0zx/realistic_lofi_girl_v3/)。

{% asset_img lofi-girl-ori.jpg 原图 %}

## 1. img2img

第一步先直接img2img
```
Studying girl, best quality, ultra high res, (photorealistic:1.4), stack of books and brown flower pot on table, brown cat on white window ledge

Negative prompt: paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans

Steps: 28, Sampler: DPM++ SDE Karras, CFG scale: 8, Seed: 3242059520, Size: 1024x564, Model hash: fc2511737a, Model: chilloutmix_NiPrunedFp32Fix, Denoising strength: 0.38, Mask blur: 4
```

{% asset_img lofi-girl-step1.png 第一步 %}

## 2. 重绘小猫

Send to inpaint, 涂图小猫
```
best quality, ultra high res, (photorealistic:1.4), back of a sleeping brown cat

Negative prompt: paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans

Steps: 28, Sampler: DPM++ SDE Karras, CFG scale: 8, Seed: 2007546370, Size: 1024x560, Model hash: fc2511737a, Model: chilloutmix_NiPrunedFp32Fix, Denoising strength: 0.38, Mask blur: 4
```

{% asset_img lofi-girl-step2.png 重绘小猫 %}

## 3. 重绘手指
Send to inpaint，使用control net(candy)重绘手指部分，使用原图作为control net输入。

```
Studying girl, best quality, ultra high res, (photorealistic:1.4), stack of books and brown flower pot on table, brown cat on white window ledge

Negative prompt: paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans

Steps: 28, Sampler: DPM++ SDE Karras, CFG scale: 8, Seed: 2851621146, Size: 1024x560, Model hash: fc2511737a, Model: chilloutmix_NiPrunedFp32Fix, Denoising strength: 0.38, Mask blur: 4, ControlNet Enabled: True, ControlNet Module: canny, ControlNet Model: control_sd15_canny [fef5e48e], ControlNet Weight: 1, ControlNet Guidance Strength: 1
```

{% asset_img lofi-girl-step3.png 重绘手指 %}

## 4. 优化细节
Send to img2img，使用原图作为control net的输入，使用depth_leres算法优化细节。

这次需要使用较高的步数40，以及较低的去噪强度0.2。

```
Studying girl, best quality, ultra high res, (photorealistic:1.4), stack of books and brown flower pot on table, brown cat on white window ledge

Negative prompt: paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans

Steps: 40, Sampler: Euler a, CFG scale: 7, Seed: 3439776951, Size: 1024x560, Model hash: fc2511737a, Model: chilloutmix_NiPrunedFp32Fix, Denoising strength: 0.2, Mask blur: 4, ControlNet Enabled: True, ControlNet Module: depth_leres, ControlNet Model: control_depth-fp16 [400750f6], ControlNet Weight: 1, ControlNet Guidance Strength: 1
```

{% asset_img lofi-girl-step4.png 优化细节 %}

## 5. 灯光

我们使用[inpaint sketch](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#color-sketch)在袖子上画一些黄色来模拟灯光，只需要画高亮部分，保留一部分袖子原本的颜色。

{% asset_img inpaint-sketch.png "inpaint sketch" %}

继续使用原图作为control net输入，使用depth_leres算法来控制阴影。把步数设得高一些(60)，去躁强度不要太高（0.6），让颜色慢慢Difussion（扩散）。

```
Studying girl, best quality, ultra high res, (photorealistic:1.4), stack of books and brown flower pot on table, brown cat on white window ledge

Negative prompt: paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans

Steps: 60, Sampler: Euler a, CFG scale: 8, Seed: 3524037322, Size: 1024x560, Model hash: fc2511737a, Model: chilloutmix_NiPrunedFp32Fix, Denoising strength: 0.6, Mask blur: 4, ControlNet Enabled: True, ControlNet Module: depth_leres, ControlNet Model: control_depth-fp16 [400750f6], ControlNet Weight: 1, ControlNet Guidance Strength: 1
```

{% asset_img lofi-girl-step5.png 打光 %}

### 使用灯光蒙板

在上面的打光我们是不希望改动画面，只希望增加灯光。

但如果是在直接生成时，可以[使用灯光蒙板来控制灯光](https://www.youtube.com/watch?v=_xHC3bT5GBU)。

使用img2img，主体为一张灯光蒙板，control net使用lofi girl原图的depth。

{% asset_img light-mask.png 灯光蒙板 %}

效果会是这样：

{% asset_img lofi-girl-with-light.png "带灯光的lofi girl" %}

## 6. 再次优化细节

模拟完灯光后，高亮边缘会有一些毛糙，需要再次优化。我们完全按照优化的参数，再来一次。

{% asset_img lofi-girl-step6.png 再次优化 %}
