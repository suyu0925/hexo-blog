---
title: 兼容docker的安卓模拟器
date: 2021-04-20 16:48:32
tags:
description: docker需要开启hyper-v，然而大多数安卓模拟器并不支持。
---
docker需要开启hyper-v，然而大多数安卓模拟器并不支持。

## [virtualization](https://en.wikipedia.org/wiki/X86_virtualization)

为了更好的支持虚拟机，从CPU级别就支持了虚拟化技术。目前Intel的叫Intel VT-x，AMD的叫AMD-v或SVM(Secure Virtual Machine)。可在主板BIOS中设置是否开启，通常默认出厂都是开启。

## [hyper-v](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/)

[hyper-v](https://docs.microsoft.com/en-us/windows-server/virtualization/hyper-v/hyper-v-technology-overview)是windows上的硬件虚拟化产品，用以更好的运行虚拟机。

## hypervisor

hypervisor又可以称做VMM。目前主流的有两个，Intel的HAXM，和Windows的WHPX。

安卓针对windows下的虚拟机加速有[指南](https://developer.android.com/studio/run/emulator-acceleration#choose-windows-hypervisor)：

{% asset_img windows-hypervisor.png "配置硬件加速" %}

## docker

docker在windows上使用了Hyper-V，所以如果要兼容的话，安卓模拟器只能使用WHPX。

## 安卓模拟器

WHPX比HAXM速度慢，所以绝大多数安卓模拟器都只支持了HAXM，比如网易的MuMu，腾讯的手游助手。

但还是有一些支持WHPX的，比如谷歌官方的Android Emulator，但使用体验并不友好。

商用的有一个叫[BlueStacks](https://www.bluestacks.com/)，它也[支持了Hyper-V](https://support.bluestacks.com/hc/zh-tw/articles/360049701852-BlueStacks-Hyper-V-%E6%B8%AC%E8%A9%A6%E7%89%88%E6%9C%AC-%E7%89%88%E6%9C%AC%E6%97%A5%E8%AA%8C)。推荐使用。

{% asset_img bluestacks_with_hyper_v.png "BlueStacks with Hyper-V" %}
