---
title: 修正jellyfin的中文字幕显示问题
date: 2024-09-11 21:32:54
tags:
description: jellyfin是老外做的，默认镜像不支持中文字幕。
---
要支持其实很简单。

首先准备一个字体文件，建议使用鸿蒙等宽字体，它是免费下载使用的，可在[鸿蒙设计资源](https://developer.huawei.com/consumer/cn/design/resource/)网页下载。

{% asset_img harmoneyos-sans.png 鸿蒙字体 %}

下载后解压，将其中的`HarmoneyOS_Sans_SC_Regular.ttf`文件复制到jellyfin镜像可访问的目录下，比如：`/config/fonts`。

然后进入jellyfin的控制台网页，`启用备用字体`，并设置`备用字体文件路径`，比如：`/config/fonts`。

{% asset_img settings.png 设置 %}

搞定收工。
