---
title: "[AIO]选择合适的CPU"
date: 2023-10-18 16:36:42
tags:
description: 先来看一下适合做AIO的CPU。
---

## 挑选标准

什么样的CPU才符合AIO的要求呢？大概有下面这些。

- 支持虚拟化

虚拟化是必须的，不然别说ESXi，PVE，unRaid这些虚拟机，连docker都用不了。

- 性能过关
首先必须得满足基本性能要求，毕竟是AIO，不是简单的存个文件，还会承担虚拟机、解码转码、图像处理，甚至编译等工作。

- 低功耗
AIO是24小时开机的，功耗就等于白花花的银子。

- 内存支持
最大支持内存尽量上16G，8G跑虚拟机不太够。支持双通道为佳，没有关系也不大。

- 硬解码
虽然现在网络速度越来越快，完全可以直接传输源视频，但不能要求客户端全部都支持解码。所以最好的播放方式还是在AIO上解码，传输已经解码的视频流。

## 低功耗CPU

先看一下目前市面上流行的低功耗且支持虚拟化技术的CPU对比，基本全是Intel赛扬，以及今年新出的N系列。

|        | J1900 | J4125 | N5105 | J6412 | N100 | N305 | 
| ---: | ---: |--- |--- |--- |--- |--- |
| 核心数 | 4C4T | 4C4T | 4C4T | 4C4T | 4C4T | 8C8T | 
| 主频/睿频 | 2.0/2.42GHz | 2.0/2.7GHz | 2.0/2.9GHz | 2.0/2.7GHz | 0.8/3.4GHz | 1.8/3.8GHz |
| 制程 | 22nm | 14nm | 10nm | 10nm | 7nm | 7nm |
| TDP | 10W | 10W | 10W | 10W | 6W | 15W |
| 核显 | Z3700 | UHD 600 | 24EU | 16EU | 24EU | 32EU |
| 黑群晖硬解 | ❎ | ✔️ | ✔️ | ✔️ | ❎ | ❎ |
| 最大支持内存 | 8GB/双 | 8GB/双 | 32GB/双 | 32GB/双 | 16GB/单 | 16GB/单 |
| CPU-Z单核跑分 | 92 | 213 | 255 | 240 | 380 | 418 |
| CPU-Z多核跑分 | 367 | 807 | 994 | 950 | 1298 | 2734 |
| PCI-E通道数/代数 | 4/2 | 6/2 | 8/3 | 8/3 | 9/3 | 9/3 |
| 发布时间 | 2013Q4 | 2019Q4 | 2021Q1 | 2021Q1 | 2023Q1 | 2023Q1 |

CPU的spec可以上[intel官网](https://www.intel.com/content/www/us/en/products/overview.html)搜索查看，cpu-z分数可谷歌`cpu-z benchmark {cpu型号}`在[cpu-z validator](https://valid.x86.fr/)查看。

目前主流已经从N5015和J6412逐步过渡到N100和N305，不论是工控机厂商，还是迷你主机厂商都在推出13代产品。

工控机厂商：[畅网微控](https://mall.jd.com/index-10253706.html)、[康耐信/幻网](https://mall.jd.com/index-656484.html)、[倍控](https://mall.jd.com/index-939666.html).

迷你主机厂商：[零刻](https://www.bee-link.com.cn/computer-73493777)、[天钡](https://mall.jd.com/index-124764.html)、[铭凡](https://mall.jd.com/index-10871263.html)、[极摩客](https://mall.jd.com/index-12593391.html)，[超迷](https://mall.jd.com/index-12811467.html)。

传统电脑厂商也早就开启战火，但主要集中在中功耗主机上，以[Intel NUC](https://www.intel.com/content/www/us/en/products/details/nuc.html)和[Mac mini](https://www.apple.com.cn/mac-mini/)为代表。后面有了[小米迷你主机](https://www.mi.com/computer-mini)、[微星Cubi](https://tw-store.msi.com/collections/dt-cubi%E7%B3%BB%E5%88%97)、华硕的[mini系列](https://www.asus.com.cn/displays-desktops/mini-pcs/all-series/)和[NUC](https://www.asus.com.cn/displays-desktops/nucs/nuc-mini-pcs/)。

## 中功耗CPU

如果对AIO的性能要求比较高，还是有一些中功耗的CPU可以考虑。

Intel
Intel的CPU主要分为酷睿（旗舰）、赛扬（低功耗）、至强（服务器）、奔腾（办公）、1字母+3数字（新产品线，如N100），命名规则可跳转官网[英特尔® 处理器名称和编号](https://www.intel.cn/content/www/cn/zh/processors/processor-numbers.html)查看。
- 第9代Intel CPU比较特别，它是最后一代可以装Win7的CPU，所以存在溢价。
- 第11代Intel CPU制程落后，卡在10和12之间，定位尴尬。
- Intel家主要选择8、10、12和13代。
- 垃圾佬最爱的至强E3（我就曾经有过一块1230，陪了我11年）性价比不高，新的E5系列也不考虑。
- ES版（Engineering Sample工程样品，又称ES不显版）和QS版（Quality Sample品质样品，又称ES正显版）不考虑。

AMD
AMD的CPU和Intel的I3, I5, I7, I9一样，也分为R3、R5、R7和R9。代数名称是[4000](https://www.amd.com/en/support/kb/release-notes/rn-rad-win-ryzen-mobile-4000)、5000、6000、7000。
[笔记本CPU](https://www.amd.com/en/processors/ryzen-processors-laptop)的后缀从低功耗到高功耗排序是U - HS - H - HX。

在中功耗CPU中（低功耗没得选，AMD就没有）AMD与Intel的区别在于，花相同的钱，
- AMD买到的核显游戏性能更好（Radeon M系列核显），CPU频率更高，能耗比也更好。
- Intel的强项在于更丰富的视频硬解码（比如[Quick Sync Vedio](https://www.intel.cn/content/www/cn/zh/architecture-and-technology/quick-sync-video/quick-sync-video-general.html), [AV1](https://www.intel.com/content/www/us/en/docs/onevpl/developer-reference-media-intel-hardware/1-1/overview.html)），虚拟化兼容性更强（比如Hyper-V，硬件直通）。

几个热门的选择有：
- [R5 4800H](https://www.amd.com/en/products/apu/amd-ryzen-7-4800h)
- [R7 5800H](https://www.amd.com/en/products/apu/amd-ryzen-7-5800h)
- [R9 6900HX](https://www.amd.com/en/products/apu/amd-ryzen-9-6900hx)
- [R9 7840HS](https://www.amd.com/en/products/apu/amd-ryzen-7-7840hs)

## 总结

玩AIO，CPU应该要N5105起步，J4125有点不够。

如果没什么重型任务，那么N100就够。但如果16G内存不够用需要32G，就只能选N5105。

如果需要接显示器做为娱乐机使用，那么可以选4800H。再往上就没必要选AIO了。

## 参考资料

- 什么值得买上[冥冰薇](https://zhiyou.smzdm.com/member/7188731034/)的[玩转NAS](https://post.smzdm.com/xilie/98415/)系列和[AIO从入门到如土](https://post.smzdm.com/xilie/102537/)系列
