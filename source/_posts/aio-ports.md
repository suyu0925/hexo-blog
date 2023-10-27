---
title: "[AIO]接口"
date: 2023-10-27 09:45:56
tags:
description: 看完CPU我们再来看一下接口。
---
电脑的接口可以分成这么几类：
- 电源输入
- 显示输出
- USB
- 内部存储
- 网络
- COM
- 音频

其中，有一些接口需要使用PCIe通道，包括：
- 网卡
- USB 3.2（包括全功能Type-C）
- M.2 NVMe

我们一个个来看。

## 电源输入

AIO因为是24小时开机，所以功率不高。电源输入有2种形式，DC和Type-C。

相比DC，Type-C要方便得多，可以接显示器的Type-C输出电源，也可以接手机的充电器，甚至是移动电源。

有一些迷你主机厂商会把充电口做成磁吸式，但磁吸式的安全性不如插入式，因为不像笔记本有内置电池，所以反而是减分项。

## 视频输出

视频输出有3种可用接口：
- HDMI
- DP
- USB Type-C

注意，虽然接口一样，但最终效果可能差别很大。
- 一方面使用的协议不同，最大传输带宽就不同；
- 另一方面即使是相同的传输带宽，在整机输出选择高分辨率，还是高刷新率，还是HDR支持上，也可能有差别。

所以在描述一款主机的视频输出时，我们要在说明接口的同时，带上最终的显示效果，比如`HDMI 4K 60Hz`、`DP 4K 120Hz/8K 60Hz`。

至于是HDMI 2.0/2.1，DP 1.4/2.0，其实反倒没那么重要，看最终效果就好了，光接口支持没用（点名小米）。

## USB

首先传统的USB接口和Type-C接口都属于USB，前者叫做USB-A，后者叫做USB-C。

不同的USB接口可以使用相同的USB协议，而有些USB协议只能走USB-C口。

具体可参见[USB的维基](https://en.wikipedia.org/wiki/USB)。

**多功能**
USB-C有着最丰富的spec，共24针脚。做为对比，USB-A有4针，Micro-A有5针，苹果的Lightning有8针。
所以同一个USB-C口，可以做到多个功能：
- 传输数据
- [视频输出](https://www.benq.com/en-me/knowledge-center/knowledge/usb-c-introduction-what-is-dp-alt-mode.html)
- [充电](https://www.usb.org/usb-charger-pd)
同时拥有全部功能的USB-C接口又被叫做全功能Type-C。

**PCIe通道**
USB的超大带宽也需要PCIe通道的支持。比如USB3.2 Gen2、USB4.0、雷电3等。

## 内部存储

内部存储的接口就2种：SATA和M.2。mSATA（Mini-Serial ATA）很少见，而传统的IDE（Integrated Drive Electronics）接口早就被淘汰了。

**M.2**
注意[M.2](https://en.wikipedia.org/wiki/M.2)只是一种接口，并不是传输协议，后面接的[NVMe](https://en.wikipedia.org/wiki/NVM_Express)才是传输协议。实际上也有M.2 SATA SSD。

同时M.2还有多种尺寸，从最短的2230和最长的22110，最常见的是2280和2242。
- 22表示M.2插槽的宽度，可以看出插槽是一致的
- 30、80、110表示长度，不同的长度需要在主板上有不同位置的固定螺丝孔。

**PCIe通道**
其中，SATA可以走主板接口，也可以走PCIe通道。NVMe则必须走PCIe通道。

[PCIe通道](https://en.wikipedia.org/wiki/PCI_Express)有两个参数，版本和通道数量（lane）。
- 常见的PCIe的版本有3.0和4.0。4.0的最大传输带宽是3.0的2倍。
- 通道数量可以配1根，也可以配4根。每根3.0的通道带宽约为945MB/s。
组合起来就像是：`PCIe 3.0x1`、`PCIe 4.0x4`。

通常来说，M.2 NVMe SSD（Solid-State Drive）的性能会分为3档：
- 1500MB/s：PCIe 3.0x2 / PCIe 4.0x1
- 3500MB/s：PCIe 3.0x4 / PCIe 4.0x2
- 7000MB/s：PCIe 4.0x4

AIO对存储速度要求没那么高，不需要`PCIe 4.4x4`的7000MB/s极限速度，对多个硬盘组RAID的需求更大一些。所以一般会将多个PCIe通道分成多个M.2插槽，而不是集中在一个插槽上。
如果要胜任NAS功能，那么最少需要2根PCIe通道做为NVMe存储使用。

## 网络

网络接口分为有线和无线。

有线网口需要高传输速度，所以需要使用1根PCIe通道。做为AIO，如果不要当做旁路由而是主路由使用，2个有线网口是必须的。

而2.5G网口一般不是必须，因为需要全屋配套都升级才有意义。

AIO需要稳定的网络接入，无线网卡比较鸡肋，通常是挂在显示器背后的迷你主机才用得上。所以一般不作为标配，想要的话可以拿1根PCIe通道来转。

## 音频

音频接口有2种，3.5mm和Type-C。

Type-C通常是移动设备上才用，PC没那么缺空间。

但小主机也不像普通PC那样富裕，所以为了节省空间，通常使用的都是结合了麦克风的二合一3.5mm接口。

## COM

COM口一般出现在工控机上，做为家庭AIO使用的主机很少配这个口了。

## 小主机的接口举例

拿几款N100的小主机来举例，看看它们的接口配置。

为节省篇幅，视频输出默认4K 60Hz。如有不同会标出。

|      | [畅网N100先锋](https://item.jd.com/10071528654407.html) | [零刻EQ12](https://item.jd.com/10071133271986.html) | [摩方M6S](https://item.jd.com/10078126275015.html) | [铭凡UN100C](https://item.jd.com/10074234612876.html) | [超迷M1](https://item.jd.com/10082105446515.html) |
| ---: | ---: |--- |--- |--- |--- |
| 有线网口 | 4 * i225-V(2.5G) | 2 * i225-V(2.5G) | 1 * 千兆 | 2 * 千兆 | 4 * i226-V(2.5G) |
| WiFi | M.2 KEY-E(支持WiFi6，蓝牙) | WiFi6，蓝牙5.2 | WiFi，蓝牙 | / | / |
| M.2存储 | M.2 NVMe x4 | M.2 2280 PCIe3.0x1 | M.2 2242 PCIe/SATA | M.2 2280 SATA | M.2 2242 PCIe3.0x1 |
| SATA存储 | *需转接板* | 2.5寸7mm SATA | *与M.2共用* | 2.5寸7mm SATA 3.0 | / |
| 视频输出 | HDMI2.1, DP1.4 | 2 * HDMI2.0, USB-C | 2 * HDMI2.0 | 2 * HDMI, USB-C | HDMI, USB-C |
| USB-A | 4 * USB2.0 | 3 * USB3.2 Gen2 | 3 * USB3.2 | 2 * USB3.2 Gen1, 2 * USB3.2 Gen2 | 2 * USB3.0 |
| USB-C | / | 数据+视频 | 数据+充电 | 数据+视频+充电 | 数据+视频 |
| 电源 | DC 12V | DC 12V/3A | DC 12V/3A，PD | DC 12V | DC 12-19V，PD 55W以上 | 
