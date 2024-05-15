---
title: 解码微信语音文件
date: 2024-05-15 14:24:19
tags:
  - weixin
description: 微信语音文件使用了skype同款编码格式SILK，一般的播放器都不支持，本文讨论一下如何解码。
---

## 编码格式

微信的语音文件虽然扩展名为`.amr`，但内部却用的[SILK](https://en.wikipedia.org/wiki/SILK)编码格式：

{% asset_img silk-v3-format.png silk编码 %}

SILK v3 编码是 Skype 向第三方开发人员和硬件制造商提供免版税认证(RF)的 Silk 宽带音频编码器，Skype 后来[将其开源](https://datatracker.ietf.org/doc/html/draft-vos-silk-02)。

采样率为 24000Hz，单声道。

## 开源实现

skype 项目[已经停用](https://learn.microsoft.com/zh-cn/microsoftteams/skype-for-business-online-retirement)，silk v3 编码被腾讯继承并发扬光大，微信、QQ 等产品都在使用。

虽然 skype 已经开源，但使用起来并不方便。

先有基于官方 C 源码的[silk-v3-decoder](https://github.com/kn007/silk-v3-decoder)，然后有了 python bindings [pilk](https://github.com/foyoux/pilk)；
后有用 rust 改写的[silk-rs](https://github.com/lz1998/silk-rs)，然后有了 `silk-rs`的 python binding [rsilk](https://github.com/synodriver/rsilk)。

我也[分叉](https://github.com/suyu0925/silk-v3-decoder)了`silk-v3-decoder`，加上了[docker 支持](https://hub.docker.com/r/lckof/silk-v3-decoder)。

## 解码

```sh
> ./decoder
usage: decoder.exe in.bit out.pcm [settings]

in.bit       : Bitstream input to decoder
out.pcm      : Speech output from decoder
   settings:
-Fs_API <Hz> : Sampling rate of output signal in Hz; default: 24000
-loss <perc> : Simulated packet loss percentage (0-100); default: 0
-quiet       : Print out just some basic values
```

具体示例：

```sh
> ./decoder msg_13141905142479bebcac2e0102.amr 102.pcm
********** Silk Decoder (Fixed Point) v 1.0.9.6 ********************
********** Compiled for 32 bit cpu *******************************
Input:                       msg_13141905142479bebcac2e0102.amr
Output:                      102.pcm
Packets decoded:              90
Decoding Finished

File length:                 1.800 s
Time for decoding:           0.001 s (0.050% of realtime)
```

## 转码

`pcm` 文件是裸音频文件，24000 的采样率也没必要用 wav，一定都转成 mp3 格式使用。

转码可以使用专精 mp3 的[lame](https://ffmpeg.org/)或者全能王[ffmpeg](https://ffmpeg.org/)。

### lame

lame 的命令行参数可以参考[这里](https://svn.code.sf.net/p/lame/svn/trunk/lame/USAGE)。

```sh
./lame -r -s 24000 -m m 106.pcm 106_lame_mono.mp3
```

但不知道为什么，这样输出的 mp3 文件会有少许拉伸，时间会变长。
使用立体声输出就没问题：

```sh
./lame -r -s 12000 106.pcm 106_lame.mp3
```

### ffmpeg

ffmpeg 的音频用法可以参考[官方文档](https://ffmpeg.org/ffmpeg.html#Audio-Options)。

```sh
./ffmpeg -y -f s16le -ar 24000 -ac 1 -i 106.pcm 106_ffmpeg_mono.mp3
```

ffmpeg 就很稳定，转码后的文件时间和原文件几乎一致。转成双声道也没问题。

```sh
./ffmpeg -y -f s16le -ar 12000 -ac 2 -i 106.pcm 106_ffmpeg.mp3
```

## 最佳实践

直接使用 docker，不用担心编译环境问题。

为了简洁易用，默认 entrypoint 只有一个功能，将微信语音文件`.amr`转成`.mp3`。

### 单个文件

转码当前目录下的单个文件为`.mp3`，文件名保持不变：

```sh
docker run -it --rm -v $(pwd):/app lckof/silk-v3-decoder msg_13141905142479bebcac2e0102.amr [102.mp3]
```

### 目录

递归遍历，转码指定目录下的所有`.amr`文件为`.mp3`，输出到指定目录。

如不指定输入目录，则默认为当前目录。

如不指定输出目录，则默认输出到同输入目录。

```sh
docker run -it --rm -v $(pwd):/app lckof/silk-v3-decoder [.] [output]
```
