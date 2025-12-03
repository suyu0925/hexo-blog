---
title: 安卓远程控制
date: 2025-12-03 15:52:35
tags:
- android
description: 依然是使用pixel手机实现无限Google相册容量系列，这集介绍如何在安卓设备上实现远程控制
---
最简单的办法莫过于直接使用[向日葵远程控制](https://sunlogin.oray.com/product/mobile)，它除了支持windows外也支持android。

下载并安装应用，给予相应权限后，还需要额外给一个[PROJECT_MEDIA](https://docs.tsplus.net/remote-support-v3/android-permanently-enable-project-media-permission/)的权限。这是因为录屏可能会暴露敏感信息，默认需要用户确认。而我们需要静默授予权限。

赋予权限的方法是直接使用adb命令：
```
adb shell appops set com.oray.sunlogin.service PROJECT_MEDIA default
```
