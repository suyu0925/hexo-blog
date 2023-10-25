---
title: Google相册无限存储空间
date: 2023-10-25 10:21:08
tags:
- 生活
description: 在试过了自建方案后，还是买了一个Google Pixel 1代手机，尝试Google相册的无限存储空间方案。
---
根据谷歌相册的[说明文档](https://support.google.com/photos/answer/6220791?co=GENIE.Platform%3DAndroid&oco=1#zippy=%2Cpixel-st-generation)，Pixel手机（1代）拥有无限原画质照片和视频存储空间。

所以我们可以通过这样的路径来实现无限存储空间：
> 其他设备拍照 - [同步到服务器 -] 同步到Pixel手机 - 同步到谷歌相册

## 同步到Pixel手机

使用[syncthing](https://syncthing.net/)。

## iPhone照片同步到服务器

### 通过iCloud

可以使用[docker-icloudpd](https://github.com/boredazfcuk/docker-icloudpd)将iCloud的内容同步至服务器。

教程可以看这篇文章：{% post_link download-icloud-photos 下载iCloud相册 %}。

### 使用App

使用[Pho](https://github.com/fregie/pho) + [AList](https://alist.nn.ci/zh/) + [Rclone](https://rclone.org/)。

### Live Photo

Live Photo会被拆成普通的图片和视频。

可以试一下[MotionPhotoMuxer](https://github.com/mihir-io/MotionPhotoMuxer)转换工具，能不能将Live Photo正确的转换为Google Motion Photos。

## 一些Pixel手机上的小问题

### 防止手机休眠

可以通过app [咖啡因](https://www.coolapk.com/apk/moe.zhs.caffeine)实现。

### Google相册卡死

这个也好解决，我们定时重启Google相册就好了。

可使用app [MacroDroid](https://www.macrodroid.com/)，设置一个宏，每3小时重新打开一次Google相册。

### 电池过耗

我们可以设置电池电量到80%以上停止充电，电量20%以下重启充电，这样可以延长电池寿命。

[面具](https://github.com/topjohnwu/Magisk)模块[Advanced Charging Controller](https://magiskzip.com/acc-magisk-module-download/)可以帮助我们实现这点。

当然最好还是改成直供电。

### 远程控制

使用[scrcpy](https://github.com/Genymobile/scrcpy)的web客户端[ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy)。

有人打包了[docker](https://github.com/scavin/ws-scrcpy-docker/)，使用起来非常方便。注意有些操作系统需要打开[特权模式](https://docs.docker.com/engine/reference/commandline/run/#privileged)。
