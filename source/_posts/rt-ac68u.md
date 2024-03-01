---
title: 华硕RT-AC68U路由器刷机
date: 2024-03-01 14:19:14
tags:
description: 工作电脑有公网IP，用windows管理端口很难受，想起家里还有个吃灰的ac68u，拿来废物利用一下。
---

这台[RT-AC68U](https://www.asus.com.cn/networking-iot-servers/wifi-routers/asus-wifi-routers/rtac68u/)路由器是 2016 年买的。那会[mesh 组网](https://en.wikipedia.org/wiki/Wireless_mesh_network)和[Wi-Fi 6](https://zh.wikipedia.org/wiki/Wi-Fi_6)还没流行，大家都还在使用单台路由，我又属于小米智能家居的尝鲜者，家里 Wi-Fi 设备巨多，普通的路由器完全不够用，所以入了这台。但随着 mesh 组网和 Wi-Fi6 的普及，这台路由器也就退休闲置了。

## 刷机的兴起与衰落

那时路由器刷机挺流行，一方面是原厂固件的功能太少，不能满足用户需求；另一方面大家手上也没啥钱，买个性能好的路由器总想着能把性能全用上，不想额外再花钱配软路由或 NAS。

随着时光流逝，原厂固件的功能越来越强，开箱即用，完全不需要再去折腾。另外软路由或 NAS 也很普及，不再需要把路由器当成万能工具。

## 固件

首先得感谢华硕，华硕开源了他家路由的官方固件[Asuswrt](https://routerkb.asuscomm.com/?page_id=9&lang=en)；

然后梅林基于华硕的固件开发了[梅林固件](https://www.asuswrt-merlin.net/)；

再是国内的[koolshare](https://github.com/koolshare)基于华硕和梅林，加入了软件中心功能，开发了[koolshare 官改和梅林改版固件](https://www.koolcenter.com/fw)。

随着刷机的衰落，大量人员离去，原[koolshare 社区](https://koolshare.cn)已经停止关闭，一部分人做了[kool center](https://www.koolcenter.com/posts/1)，做点[团购](https://www.koolcenter.com/category/announce)和卖点[设备与服务](https://www.linkease.com/about)维持运营。

## 刷机

RT-AC68U 还在梅林官方的[支持目录](https://www.asuswrt-merlin.net/about)中，目前最新版本是`386.12_6`。

koolcenter 已停止维护，最后一个版本是[386.3_2](https://www.koolcenter.com/posts/38)。

看了一下我以前刷的版本是`380.63_X7.2`，编译代码是`Fri Nov 11 11:01:59 UTC 2016 sadoneli@96b5432`，应该出自[sadoneli](https://github.com/sadoneli)。

## 软件中心

koolshare 不同的固件对应不同的软件中心，具体区别可以看[这里](https://github.com/koolshare/armsoft?tab=readme-ov-file#koolshare%E5%87%A0%E4%B8%AA%E7%89%88%E6%9C%AC%E7%9A%84%E8%BD%AF%E4%BB%B6%E4%B8%AD%E5%BF%83%E5%8C%BA%E5%88%AB)。

我的 AC68U 使用的是`arm380软件中心`。

因为科学上网有法律风险，所以软件中心里不会列出科学上网插件，需要自行下载离线安装。

## 科学上网

科学上网使用的是[开源](https://github.com/hq450/fancyss)的[fancyss](https://hq450.github.io/fancyss/)插件。

我的 AC68U 使用的是`梅林380改版`，对应[fancyss_arm](https://hq450.github.io/fancyss/#fancyss_arm%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4)。

注意 fancyss_arm 仅支持版本号 ≥X7.2 的固件，订阅功能需要版本号 ≥X7.7（最新版本固件为 X7.9.1）。

**[full or lite](https://github.com/hq450/fancyss?tab=readme-ov-file#%E7%89%88%E6%9C%AC%E9%80%89%E6%8B%A9)**

在干净的条件下，AC68U 的`/tmp`目录有`124M`剩余，[jffs](https://github.com/RMerl/asuswrt-merlin.ng/wiki/JFFS)剩余空间有`52M`，足够安装`36M`的 full 版本。

## 解除限制

离线安装时会提示

```
【2024年03月01日 15:03:12】: =======================================================
【2024年03月01日 15:03:12】: 检测到离线安装包：fancyss_arm_full_3.3.0.tar.gz 含非法关键词！！！
【2024年03月01日 15:03:12】: 根据法律规定，koolshare软件中心将不会安装此插件！！！
【2024年03月01日 15:03:12】: 删除相关文件并退出...
【2024年03月01日 15:03:12】: =======================================================
```

需要开启路由器上的 ssh，登录上去运行

```
sed -i 's/\tdetect_package/\t# detect_package/g' /koolshare/scripts/ks_tar_install.sh
```

来取消限制。

## 安装

在[fancyss_arm 的下载页](https://github.com/hq450/fancyss_history_package/tree/master/fancyss_arm)下载了`fancyss_arm_full_3.3.0.tar.gz`，发现无法离线安装。原因是缺少[/koolshare/bin/httpdb](https://github.com/hq450/fancyss/blob/3.0/fancyss/install.sh#L46)文件。

看来需要更新固件才能安装，但 koolshare 社区已经关闭，很多帖子找不到，包括[384 改版梅林固件发布帖](https://koolshare.cn/thread-164857-1-2.html)，暂且搁置。

## 管理公网访问

使用 asuswrt 管理公网访问很简单，在`外部网络（WAN）`设置中找到`端口转发`，添加一条规则即可。华硕官网有[具体操作教程](https://www.asus.com.cn/support/faq/1037906/)。

注意windows防火墙中也要在入站规则中开放端口，重点看一下连接网络的[网络配置文件类型](https://support.microsoft.com/zh-cn/windows/%E5%9C%A8-windows-%E4%B8%AD%E5%B0%86-wi-fi-%E7%BD%91%E7%BB%9C%E8%AE%BE%E7%BD%AE%E4%B8%BA%E5%85%AC%E5%85%B1%E6%88%96%E4%B8%93%E7%94%A8%E7%BD%91%E7%BB%9C-0460117d-8d3e-a7ac-f003-7a0da607448d)是否和入站规则的`配置文件`一致。`公用`和`专用`的规则是不同的。
