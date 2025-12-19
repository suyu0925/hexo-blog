---
title: 安卓远程控制
date: 2025-12-03 15:52:35
tags:
- android
description: 依然是使用pixel手机实现无限Google相册容量系列，这集介绍如何在安卓设备上实现远程控制
---
## 向日葵远程控制

最简单的办法莫过于直接使用[向日葵远程控制](https://sunlogin.oray.com/product/mobile)，它除了支持windows外也支持android。

下载并安装应用，给予相应权限后，还需要额外给一个[PROJECT_MEDIA](https://docs.tsplus.net/remote-support-v3/android-permanently-enable-project-media-permission/)的权限。这是因为录屏可能会暴露敏感信息，默认需要用户确认。而我们需要静默授予权限。

赋予权限的方法是直接使用adb命令：
```
adb shell appops set com.oray.sunlogin.service PROJECT_MEDIA default
```

## scrcpy

如果电脑端和安卓手机在同一个局域网下，可以使用更简单的[scrcpy](https://github.com/Genymobile/scrcpy)。

第一次使用时，先在手机上打开USB调试模式，然后连接到电脑。

在电脑端运行`scrcpy --tcpip`打开手机上的远程adb服务。记住手机的IP地址。假设是192.168.1.100。

之后就可以拔掉USB线，在电脑端使用`scrcpy --tcpip=192.168.1.100`命令连接到手机。
