---
title: 使用MuMu模拟器进行android开发
date: 2024-05-15 10:24:55
tags:
  - android
  - 善用佳软
description: android官方的模拟器不能模拟平板，且各种功能和体验都欠佳，本期善用佳软：MuMu模拟器。
---

[MuMu 模拟器](https://mumu.163.com/)是网易出品的一款安卓模拟器，支持多开、键盘映射、摇杆模拟等功能，且支持模拟平板。在开发中，我们可以使用 MuMu 模拟器来模拟各种设备，方便调试。

## 痛点

MuMu 解决了几大痛点：

1. 支持 Hyper-V，保持与其它 windows 开发（hyper-v 虚拟机、docker 等）的兼容；
2. 支持模拟平板，方便调试（特别是**微信平板端**）；
3. 支持多开，方便多账号登录；

## adb 连接

MuMu 模拟器允许多开，所以并没有使用默认的 adb 连接方式，而是使用了[端口映射](https://mumu.163.com/help/20230214/35047_1073151.html)。

查看端口有两种方式：

1. 模拟器右上角菜单-问题诊断，获取 ADB 调试端口；

{% asset_img adb-port.png adb端口 %}

2. 打开[MuMu 多开器](https://mumu.163.com/help/20230112/35047_1062972.html)，点击右上角的 ADB 图标。

{% asset_img multi-instance.png MuMu多开器 %}

有了端口后，即可使用 adb 连接：

```sh
> adb connect 127.0.0.1:16384
connected to 127.0.0.1:16384

> adb devices
List of devices attached
127.0.0.1:16384 device

> adb shell
2206123SC:/ $
```

`adb.exe`在`c:\Program Files\NetEase\MuMu Player 12\shell\`目录下。

更多的开发相关信息可以查看官方文档[MuMu 模拟器 12 开发者须知](https://mumu.163.com/help/20230504/35047_1086360.html)。

## root

首先在模拟器的`设置中心`-`其他设置`开启手机 Root 权限。

{% asset_img enable-root.png 开启手机Root权限 %}

比如不开启手机 Root 权限，将无法使用 su 命令:

```sh
> adb -s 127.0.0.1:16416 shell
2206122SC:/ $ su
/system/bin/sh: su: inaccessible or not found
```

然后连接 adb，使用`adb root`或者`adb shell`后运行`su`命令。

此时模拟器会弹出请求 root 权限的提示，选择`永久记住选择`，然后`允许`即可。

{% asset_img require-root.png 请求root权限 %}

## 模拟平板

在模拟器的`设置中心`-`显示设置`中，可以设置模拟器的模式，以及分辨率（DPI）。安装后默认设置是平板模式。

{% asset_img tablet-mode.png 平板模式 %}

可以在平板和手机模式间切换。
注意：超宽屏属于非常规分辨率，很多应用会认为是**手机模式**，比如微信就并不认为这是一款平板。

## 下载适用的 apk

直接在官网或者酷安 apk、豌豆夹下载的应用，有可能会不适配模拟器，在模拟器上运行会闪退。

以作业精灵为例，在[酷安](https://www.coolapk.com/apk/com.pcncn.jj)，[豌豆夹](https://www.wandoujia.com/apps/7056231)获取的 apk 在 mumu 模拟器上都会闪退无法运行，版本均为 2024-05-21 上线的`3.8.29.1`。

但从[雷电模拟器](https://www.ldmnq.com/app/5037.html)下载的则可以正常运行，它提供的是 2024-04-02 上线的`3.8.11-beta`版本。

从豌豆夹的[历史版本](https://www.wandoujia.com/apps/7056231/history_v916)页面可以看到，`3.8.11`版本的上线时间为 2023-03-03 ，说明雷电模拟器是有意筛选，并不是更新缓慢。

如果碰到应用兼容性问题，可以上雷电模拟器的应用商店找找看有没有惊喜。
