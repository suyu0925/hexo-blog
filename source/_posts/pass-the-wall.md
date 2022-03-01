---
title: 翻墙
date: 2022-03-01 10:43:28
tags: 
description: 作为程序员，不翻墙是几乎不可能的，记录一下翻墙相关。
---
## 协议
目前主流的协议有[shadowsocks](https://shadowsocks.org/en/index.html)和[vmess](https://www.v2ray.com/developer/protocols/vmess.html)。

## 服务器

服务器分两大类，自建vps和机场。

vps是一台虚拟服务器，除了搭配机场还可以用作其它用途，和阿里腾讯的云服务器没大差别。

机场则是一组服务器节点，直接提供代理服务。

### 自建

**搬瓦工**

[搬瓦工](https://bandwagonhost.com/)是比较平价的vps，配置较低，买来基本只为翻墙。最低配的价格在49.99美元一年，1G带宽，每月1T流量。

**谷歌云服务器**

如果[谷歌云服务器](https://cloud.google.com/compute)还没有申请过免费试用可以试一下，如果已经用过了就无视吧。如果仅作为vps使用，有搬瓦工在，基本没有第二个更好的选择。

### 机场

**搬瓦工机场**

[搬瓦工机场](https://justmysocks.net)省去了搭建机场的烦恼，被墙后换IP的工作也交给了官方。如果只需要使用代理服务，首选这个。

如果justmysocks被墙，可以使用[防墙域名](https://justmysocks5.net)。

网上提供的优惠码是`JMS9272283`，可以有5.2%优惠。

最低价格是5.88美元一个月，一年58.8美元，美国结点，每月500G流量。和自建比起来，价格并没有优势，但强在易用性以及网络性能。自建如果想达到相同的网络性能，至少需要169.99美元一年的配置。

**qwqjsq**

[qwqjsq](https://github.com/qwqjsq/qwqjsq)是国人做的机场，稳定性一般，最低价格是7.9元20G流量一个月，与搬瓦工比起来门槛要低一些，如果不需要高强度使用代理可选择。

## 客户端

客户端就百花齐放了，鉴于日常使用对性能要求不高，选择标准应该是易用优先。下面是我自已在用的，[这里](https://www.v2ray.com/awesome/tools.html)可以看到更多推荐。

### windows

桌面上的客户端基本两个选择，clash和v2ray。

其中clash的易用性要好一些，推荐clash，如果clash不支持订阅服务器的格式，则用v2ray。

- [clash](https://github.com/Fndroid/clash_for_windows_pkg)
- [v2rayN](https://github.com/2dust/v2rayN)。

### mac

- [ClashX](https://github.com/yichengchen/clashX)
- [v2rayX](https://github.com/Cenmrev/V2RayX)。

### ios

- [Quantumult](https://apps.apple.com/us/app/quantumult/id1252015438)

### android

- [shadowsocks-android](https://github.com/shadowsocks/shadowsocks-android)

### openwrt(路由器)

代理运行在windows和mac以及手机平台上都是以app的方式，不如linux下的服务直接和高性能。所以最有效率的方式是直接运行在路由器上。

- [OpenClash](https://github.com/vernesong/OpenClash)
- [Hello World](https://github.com/jerrykuku/luci-app-vssr)

更多的openwrt应用可参见[这里](https://github.com/AUK9527/Are-u-ok/tree/main/apps)。
