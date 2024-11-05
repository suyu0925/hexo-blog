---
title: 微信逆向工程
date: 2024-11-05 14:25:24
tags:
- weixin
description: 为了能实现微信聊天记录的无感漫游，先尝试对微信进行逆向工程。
---

## 解包

[apktool](https://github.com/iBotPeaches/Apktool)+[jd-gui](https://github.com/java-decompiler/jd-gui)的组合已经过时，现在流行的是[jadx](https://github.com/skylot/jadx)，一站式解包。

## 查看布局

早期andriod studio推荐的布局查看工具是`android sdk\tools\uiautomator.bat`。有网友做了个[不依赖android sdk的独立版](https://github.com/cmlanche/uiautomatorviewer-standalone)。

在之后的某个版本集成进了Android Studio，变成[Layout Inspector](https://developer.android.com/studio/debug/layout-inspector?hl=zh-cn)。

## 附录

- 参考了[Android”挂逼”修炼之行—微信摇骰子和猜拳作弊器原理解析](http://www.520monkey.com/archives/902)。
