---
title: 从B站（哔哩毕哩）下载视频
date: 2023-11-13 14:40:55
tags:
- 生活
description: 从B站下载视频有很多种方法，但随着时间推移，很多方法都失效了，介绍一些比较稳定的。
---
录屏就不说了，离本质太远。

## 网站服务

有很多公开嗅探的网站，比如：[人人都是自媒体的视频解析下载](https://bili.iiilab.com/)，但它不支持登录，只能下载360P和480P，基本无用。

也有使用自己账号登录，提供高清链接的，比如：[贝贝的B站视频下载](https://xbeibeix.com/api/bilibili/)，可以直接下载分段的高清m4s文件（后面解释）。

## 客户端

客户端只推荐一个，开源的[哔哩下载姬downkyi](https://github.com/leiurayer/downkyi)。工程文件写的很好，可以很方便的在本地编译运行。

但不知道是不是因为B站修改了登录api，[目前无法登录](https://github.com/leiurayer/downkyi/issues/895)，也就无法使用。

[作者在找工作，暂时没时间维护](https://github.com/leiurayer/downkyi/issues/893)，过段时间再来看吧。

## 浏览器插件

浏览器插件中，最好用的是[bilibili哔哩哔哩B站下载助手](https://csser.top/)。它可以直接下载合并后的mp4文件，无须手动合并。

但作者收到了[B站律师函](https://csser.top/bilibili/img/bilibili_lshh.jpg)，目前已经从Chrome扩展商店下架，后续可能也会缺乏维护。

## 油猴脚本

功能最强的B站油猴脚本应该属[Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)。它将具体功能以组件和插件的形式分离出去，来保持简洁。

安装后，需要在在线仓库安装`下载器`组件才能使用下载功能。

## 下载的文件格式

B站提供两种格式的视频文件：flv和m4s。

flv是完整的音视频文件，但支持的分辨率比较少，一般只有`高清`和`流畅`两种。

m4s是使用[DASH](https://zh.wikipedia.org/wiki/%E5%9F%BA%E4%BA%8EHTTP%E7%9A%84%E5%8A%A8%E6%80%81%E8%87%AA%E9%80%82%E5%BA%94%E6%B5%81)（Dynamic Adaptive Streaming over HTTP）技术的分段文件。
一般会分为视频流和音频流两个。
下载完成后，需要使用[ffmpeg](https://ffmpeg.org/)合并成一个文件。
```sh
ffmpeg -i video.m4s -i audio.m4s -codec copy output.mp4
```
[-codec copy参数](https://ffmpeg.org/ffmpeg.html#Stream-specifiers-1)表示直接复制流，不进行编码。
