---
title: Google相册无限存储空间
date: 2023-10-25 10:21:08
tags:
  - 生活
description: 在试过了自建方案后，还是买了一个Google Pixel 1代手机，尝试Google相册的无限存储空间方案。
---

根据谷歌相册的[说明文档](https://support.google.com/photos/answer/6220791?co=GENIE.Platform%3DAndroid&oco=1#zippy=%2Cpixel-st-generation)，Pixel 手机（1 代）拥有无限原画质照片和视频存储空间。

所以我们可以通过这样的路径来实现无限存储空间：

> 其他设备拍照 - [同步到服务器 -] 同步到 Pixel 手机 - 同步到谷歌相册

## 同步到 Pixel 手机

使用[syncthing](https://syncthing.net/)。

## iPhone 照片同步到服务器

### 通过 iCloud

可以使用[docker-icloudpd](https://github.com/boredazfcuk/docker-icloudpd)将 iCloud 的内容同步至服务器。

教程可以看这篇文章：{% post_link download-icloud-photos 下载iCloud相册 %}。

### 使用 App

使用[Pho](https://github.com/fregie/pho) + [AList](https://alist.nn.ci/zh/) + [Rclone](https://rclone.org/)。

### Live Photo

Live Photo 会被拆成普通的图片和视频。

可以试一下[MotionPhotoMuxer](https://github.com/mihir-io/MotionPhotoMuxer)转换工具，能不能将 Live Photo 正确的转换为 Google Motion Photos。

## 一些 Pixel 手机上的小问题

### 防止应用休眠

虽然可以通过 app [咖啡因](https://lab.zhs.moe/caffeine/zh-hans/)保持屏幕常亮来防止应用休眠，但为了保护屏幕，还是不要这么粗暴。

其实 Android 10 已经有了`始终后台运行`机制，在应用信息下对应应用设置中找到`电池`-`电池优化`，选择`未优化`就可以保证不被主动杀掉。

可以参考这篇 AirDroid 的文档：[如何保持 AirDroid Kids 在 Pixel 手机后台运行？](https://help.airdroid.com/hc/zh-cn/articles/4499223181979-%E5%A6%82%E4%BD%95%E4%BF%9D%E6%8C%81AirDroid-Kids%E5%9C%A8Pixel%E6%89%8B%E6%9C%BA%E5%90%8E%E5%8F%B0%E8%BF%90%E8%A1%8C)。

### Google 相册卡死

这个也好解决，我们定时重启 Google 相册就好了。

可使用 app [MacroDroid](https://www.macrodroid.com/)，设置一个宏，每半小时重新打开一次 Google 相册。

### 电池过耗

我们可以设置电池电量到 80%以上停止充电，电量 20%以下重启充电，这样可以延长电池寿命。

[面具](https://github.com/topjohnwu/Magisk)模块[Advanced Charging Controller](https://magiskzip.com/acc-magisk-module-download/)可以帮助我们实现这点。

不过要注意，随着电池损耗日益增加，手机对电量的判断会越来越不准确，可能会在显示电量 20%以上直接跳到耗尽电量自动关机。

所以最好还是改成直供电。

### 远程控制

**连接电脑**

如果手机是与电脑长连接，可以使用[scrcpy](https://github.com/Genymobile/scrcpy)的 web 客户端[ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy)。

有人打包了[docker](https://github.com/scavin/ws-scrcpy-docker/)，使用起来非常方便。注意有些操作系统需要打开[特权模式](https://docs.docker.com/engine/reference/commandline/run/#privileged)。

**无需连接电脑**

连接电脑实在太麻烦，不是高强度使用的话可以用远程控制软件实现轻度控制。

可以参考{% post_link remote-android-protocol 远程控制安卓手机 %}这篇文章。
