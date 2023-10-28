---
title: Ggoogle Pixel手机刷机
date: 2023-10-29 02:33:11
tags:
description: 买了个二手皮鞋，拿到手机先刷一个干净的系统。
---
## 开发者模式
先将手机开机，进入开发者模式。方法是进入**About phone**，点击**Build number**7次。

进入开发者选项，打开**USB Debugging**，以及**OEM unblocking**。

如果OEM unblocking无法打开，那说明买到的是有锁机，赶紧联系卖家吧。

## 刷机工具
安卓的刷机工具就是两个二进制文件：[fastboot](https://android.googlesource.com/platform/system/core/+/master/fastboot/README.md)和[adb](https://source.android.com/docs/setup/build/adb)。可以[自己编译](https://source.android.com/docs/setup/build/running)，也可以直接去安卓官网下载[platform-tools](https://developer.android.com/studio/releases/platform-tools)。

## windows下的USB驱动
linux和mac*不需要*额外安装驱动，windows则需要先[下载安装Google USB驱动](https://developer.android.com/studio/run/win-usb?hl=zh-cn)。

安装完驱动后确认驱动是否正确安装：
1. 连接电脑与手机，如果手机上会弹出是否允许调试，点同意。
2. 在电脑上运行`adb devices`，出现手机说明驱动正常。
3. 如果没有成功，换一个USB口或数据线试试。

## 准确镜像文件
谷歌将亲儿子们的镜像文件准备得很妥当，[出厂镜像](https://developers.google.com/android/images)和[全OTA镜像](https://developers.google.com/android/ota?hl=zh-cn#sailfish)都很齐全。

出厂镜像是我们需要的，所谓线刷包。而OTA镜像是用来更新系统的，所谓卡刷包。

Pixel性能很弱，虽然官方[最高支持到android 10](https://developers.google.com/android/images?hl=zh-cn#sailfish)，但我们只选择android 8的最后一个版本就好。

## 进入fastboot模式
每一部手机的[进入方式](https://source.android.com/docs/setup/build/running#booting-into-fastboot-mode)都有可能不同，Pixel是先按住音量下键不放，再按住电源键不放。

也可通过命令`adb reboot bootloader`进入。

## 解锁bootloader
必须解锁bootloader才能够刷机，bootloader默认是锁住的。

注意，解锁bootloader会导致手机数据全部丢失，先备份好资料再开始尝试解锁。

将手机连接电脑，重新进入fastboot模式，输入命令：
```bash
fastboot flashing unlock
```

在手机上确认解锁。

## 双清

使用命令`adb reboot recovery`或者在手机的bootloader模式下使用音量上下键选择recovery进入recovery模式。

在recovery模式下，同时按音量上+电源键显示菜单。选择Wipe cache partition，再选择wipe data。

## 刷入镜像

在手机进入bootloader模式下，解压镜像文件后，在镜像文件目录下运行`flash-all.bat`即可，本质上就是运行`fastboot flashall -w`。

注意platform-tools目录在不在环境变量的PATH里，嫌麻烦直接把platform-tools下的可执行文件拷到镜像文件目录也行。

如果想更新OTA，需要将手机进入recovery模式，选择`Apply update from ADB`指令，然后在电脑上运行`adb sideload OTA.zip`。

## Root和增强模块

可以使用一站式工具[Magisk](https://github.com/topjohnwu/Magisk)，这里有[教程](https://topjohnwu.github.io/Magisk/install.html)。
