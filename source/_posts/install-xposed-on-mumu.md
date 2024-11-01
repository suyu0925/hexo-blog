---
title: 在mumu模拟器上安装Xposed
date: 2024-11-01 11:05:53
tags:
  - android
description: xposed是个好东西，探讨一下怎么在mumu模拟器上安装。
---

## xposed 发展史

rovo89 大佬于 2012 年在[xda](https://xdaforums.com/)发布了[Xposed](https://xdaforums.com/t/xposed-general-info-versions-changelog.2714053/)框架，它会在[Zygote](https://source.android.com/docs/core/runtime/zygote?hl=zh-cn)进程启动时加载，修改 Dalvik/ART 虚拟机的运行时行为，通过 hook 技术，实现对应用的修改。

社区基于 xposed 的 hook 功能，开发出了很多强大的模块，比如[微 X 模块](https://github.com/Xposed-Modules-Repo/com.fkzhang.wechatxposed)、[HookVip](https://github.com/Xposed-Modules-Repo/Hook.JiuWu.Xp)等等。

由于 android 系统越来越严格的安全限制，原版 xposed 也越来越难继续使用，rovo89 于 2023 年[放弃维护](https://github.com/rovo89/Xposed)。

---

继任者有基于[Riru](https://github.com/RikkaApps/Riru)的[EdXposed](https://github.com/ElderDrivers/EdXposed)和兼容 Riru 和 Zygisk 的[LSposed](https://github.com/LSPosed/LSPosed)。Riru 和 Zygisk 都是[magisk](https://github.com/topjohnwu/Magisk)的组件，各自使用了不同的方式来完成 Zygote 注入，从而实现对应用的 hook。目前 Zygisk 已经基本取代了 Riru。

中间还出现过一段时间非主流的免 root 类 xposed 框架，支持 android 5.0 ~ 10.0，比如[vxposed](https://vxposed.com/)、[太极](https://github.com/tbone825/TaiChi)。它的工作原理是在虚拟环境中运行要 hook 的应用。

---

由于网络上出现各种对开发者的恶意攻击，[Riru](https://github.com/RikkaApps/Riru)、[LSposed](https://github.com/LSPosed/LSPosed)、[Zygisk Next](https://github.com/Dr-TSNG/ZygiskNext)、[KernelSU](https://github.com/tiann/KernelSU)、[太极](https://github.com/tbone825/TaiChi)等项目的开发者于 2024 年相继宣布退出社区停止开发和维护。

{% asset_img lsposed_clarification.png lsposed澄清 %}

## 安装

### magisk

mumu 官方给出了[安装 magisk 的教程](https://mumu.163.com/help/20240202/35044_1136675.html)。

1. 将磁盘设置改为`可写系统盘`
2. 开启手机 Root 权限
3. 下载安装[Kitsune Magisk](https://github.com/HuskyDG/magisk-files)
4. 选择`直接安装（直接修改/system）`的方式安装 magisk
5. 重启后打开 magisk，如果碰到 su 冲突，删除原来的`/system/bin/su`和`/system/app/SuperUser`，再次重启

### zygisk

在 magisk 的设置中，打开 Zygisk。

### lsposed

下载 zygisk 版的 [lsposed 安装包](https://github.com/ElderDrivers/EdXposed/releases)，从 magisk 中安装组件。

顺便一提，mumu 的其它功能中有一个`文件传输`，可以打开 MuMu 共享文件夹，方便互拷文件。

### shamiko

为了避免被应用检测到 root 或 xposed 而无法正常使用，可以安装 [shamiko 模块](https://github.com/LSPosed/LSPosed.github.io/releases)，它可以对应用隐藏。

注意[要安装 shamiko 0.7.5](https://github.com/HuskyDG/magisk-files/issues/152)而不是最新的`1.1.1`，`Kitsune Magisk`使用的 magisk 版本是`27001`，而最新的 shamiko `1.1.1`要求`27003`。

shamiko 和 magisk 内置的 magisk hide 有冲突，需要在 magisk 的设置中关闭 magisk hide。但 shamiko 使用的是 magisk 中的排除列表。

### xposed 模块

[Xposed-Modules-Repo](https://github.com/Xposed-Modules-Repo)维护了一些社区开发的 xposed 模块，每个人都可以[提交自己的模块](https://modules.lsposed.org/submission/)。

[LSPosed.github.io](https://github.com/LSPosed/LSPosed.github.io)做了个网页，方便搜索查看。
