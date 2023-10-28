---
title: "[AIO]操作系统"
date: 2023-10-28 10:57:45
tags:
description: 装完机，来看一看AIO的操作系统。
---

我们之前有介绍过 AIO 的几个功能：软路由、NAS、下载机、服务器、家庭娱乐。针对不同的功能，有不同的专用操作系统。

## 软路由

软路由的操作系统通常就两个选择，[OpenWrt](https://openwrt.org/)或者[爱快](https://www.ikuai8.com/component/download)。[https://mikrotik.com/download](https://mikrotik.com/download)没什么可玩性，[pfsense](https://www.pfsense.org/)主要是防火墙。

- 爱快

  爱快的宽带多拨是特色，但还是属于商业软件，对 docker 的支持不好。

- OpenWrt

  OpenWrt是开源系统，拥有最大的社区。只要会折腾，强大无比。

适合软路由做的事就是宽带多拨、全局科学上网、DNS 管理、广告拦截、流量控制、解锁网易云音乐这些，它会挂在所有服务的网络最前端，要求稳定。

## NAS

NAS的常见操作系统也有几个：

- [TrueNAS](https://www.truenas.com/)

  TrueNAS的前身就是[FreeNAS](https://www.truenas.com/freenas/)，开源社区的当家老大，和软路由里的OpenWrt差不多一个地位。

- [Unraid](https://unraid.net/)

  Unraid是[付费软件](https://unraid.net/pricing)，6盘位59刀，不限盘位129刀。[在中国有运营](https://forums.unraid.net/forum/88-chinese-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87/)，用优惠码可以55折，比如`青孟德牛逼`，`大鹏YYDS`等。

- [群晖](https://www.synology.cn/zh-cn/dsm)

  群晖操作系统（Synology DiskStation Manager，简写为DSM）只有购买群晖硬件才能使用。

  但连macOS都有黑苹果，群晖怎么能难得到极客们呢。很快，就有了[XPEnology社区](https://xpenology.com/forum/)。它出现的目的就是[为了让DSM可以安装在任何硬件上](https://xpenology.com/forum/topic/9392-general-faq/#comment-82388)。
  
  在2014年，社区推出了DSM 5.x的引导，取名为[XPEnology gnoBoot](https://xpenology.com/forum/topic/1036-xpenology-gnoboot/)。
  之后是社区开发者[jun](https://xpenology.com/forum/profile/23252-jun/)开发的DSM 6.x引导，名字就叫[Jun's loader](https://xpenology.com/forum/topic/6253-dsm-61x-loader/)。
  再之后是DSM 7.x的引导：RedPill，在RedPill的基础上发展出了[Tinycore-redpill(TCRP)](https://github.com/pocopico/tinycore-redpill)和[Automated Redpill Loader(ARPL)](https://github.com/fbelavenuto/arpl)。
  所有的引导可以在[这里](https://xpenology.com/forum/topic/7848-links-to-loaders/)找到。
  
  国内也有黑群晖社区，比如[openos里的dsm版块](https://www.openos.org/forums/synology-dsm/)，。

## 下载机

下载机简直是最容易满足的了，任何一个操作系统都可以做到，甚至是传统路由器（比如[Asuswrt](https://www.asus.com/content/asuswrt/)，[梅林](https://www.asuswrt-merlin.net/)，[KoolShare](https://github.com/koolshare)）都行。

## 服务器

服务器一般用linux，windows也可以，但对性能要求更高一些。

至于[linux发行版的选择](https://distrochooser.de/)，推荐相对纯粹的[debian](https://www.debian.org/)。

## 家庭娱乐

想要比较好的完成多个家庭成员的不同需求，基本上只有windows操作系统这一个选择。

## 小孩子才做选择……

如果想全都要，也不是不行。虚拟机系统了解一下。

常见的虚拟机系统就俩：VMware的[Esxi](https://www.vmware.com/cn/products/esxi-and-esx.html)和[PVE](https://www.proxmox.com/)(Proxmox Virtual Environment)。

但对AIO的性能要求要高一些。
