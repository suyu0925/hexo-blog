---
title: 重装ars2系统
date: 2024-11-05 14:42:58
tags:
description: ars2是易有云出的一款软路由，记录一下重装的过程。
---
## 进入救援模式

首先进入[救援模式](https://doc.linkease.com/zh/guide/easepi-ars2/common.html#%E6%95%91%E6%8F%B4%E6%A8%A1%E5%BC%8F)。

1. 在断电状态下，先按住开机键，然后再通电，当红灯亮机时松开开机键，即可进入救援模式；
2. 救援模式启动完毕后，红灯会常亮，红灯为心跳模式；
3. 电脑网线连接ARS2的LAN口，在浏览器打开[http://192.168.100.1](http://192.168.100.1)进入后台；

## 刷机

先去官网[下载ars2的固件](https://fw.koolcenter.com/iStoreOS/ars2/)。

截止本文撰写时，最新的固件是`openwrt-21.02.3-r16974-17b7b13984-realtek-rtd129x-ars2-squashfs.install.img`。

然后[去后台刷写固件](https://doc.linkease.com/zh/guide/easepi-ars2/common.html#%E6%89%8B%E5%8A%A8%E6%9B%B4%E6%96%B0)。

## 必备软件

做为软路由，最核心的必备软件就是翻墙了。

ars2是一款基于arm设计的软路由，使用了`aarch64_cortex-a53`架构，而一般翻墙软件官方都只会提供x86的版本，比如[OpenClash](https://github.com/vernesong/OpenClash/releases)。

好在互联网上好人多，有哥们提供了适用于[`aarch64_cortex-a53`的编译版本](https://github.com/AUK9527/Are-u-ok/tree/main/apps)。
