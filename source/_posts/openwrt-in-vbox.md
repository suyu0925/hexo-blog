---
title: "[Openwrt]在VirtualBox虚拟机中玩耍OpenWrt"
date: 2022-07-22 09:21:30
tags:
- openwrt
description: 有全屋科学上网和简单的多媒体中心需求的话，一台软路由是最舒适的解决方案了。谈到软路由那就基本绕不过OpenWrt，先在虚拟机里玩耍一下吧。
---
[OpenWrt官方](https://openwrt.org)对OpenWrt的定义，是适合于嵌入式设备的一个Linux发行版。但其实对用户来说，它就是一个开源的路由器操作系统。可以方便的使用[opkg](https://openwrt.org/docs/guide-user/additional-software/opkg)包管理来安装和卸载软件，同时有[luci](https://openwrt.org/docs/guide-user/luci/start)做为web ui。

使用OpenWrt制作一个软路由需要一个物理设备，比如经典的低功耗Arm软路由[R4S](https://openwrt.org/toh/friendlyarm/nanopi_r4s_v1)，又或者是一个x86的[工控机](https://item.jd.com/10040065077494.html)。在这篇贴子里，我们先用虚拟机熟悉一下OpenWrt操作系统，这样以后购买设备后才不会一头雾水。关于设备的挑选，篇幅较长足够另起一篇贴子了，这里就先跳过。

## 安装VirtualBox

谈到虚拟机软件，一般都会推荐[VMware](https://customerconnect.vmware.com/cn/home)，但它是商业付费的。而[VirtualBox](https://www.virtualbox.org/)是[免费开源](https://www.virtualbox.org/svn/vbox/trunk/)的虚拟机软件，成为唯一真神。

在[下载页面](https://www.virtualbox.org/wiki/Downloads)下载对应平台的安装包，全程默认配置运行安装即可。

## 在vbox中安装OpenWrt

OpenWrt官方已经给出了指南：[在Virtualbox虚拟机中运行OpenWrt](https://openwrt.org/docs/guide-user/virtualization/virtualbox-vm)，直接对着着做就行，只记录几个需要留意的点。

### OpenWrt镜像选择
镜像建议使用`generic-squashfs-combined-efi.img.gz`。ext4没有overlay分区，后续需要额外设置，麻烦。

### 内存
OpenWrt推荐的值是128MiB，这有点太少了，后续我们会运行docker，128M绝对不够，建议最少给个1GB。

### CPU
默认的单核差不多能将科学上网的网速跑到2MB/s。
但如果开启了Hyper-V，不要轻易增加核心数，可能会有反效果。关于Hyper-V与VirutalBox的冲突可查看{% post_link virtualbox-running-slow "VirtualBox在win上特别卡" %}。

### 网络
如果想通过VBox里的OpenWrt上网，桥接网卡是必选项，注意要桥接到用来上网的实体网卡上。

## OpenWrt国内镜像站

国内有[阿里](https://developer.aliyun.com/mirror/openwrt/)和[上交大](https://mirror.sjtu.edu.cn/openwrt/)两个[官方镜像站](https://openwrt.org/downloads#mirrors)任君选择。

还有[腾讯](https://mirrors.cloud.tencent.com/openwrt/)、[清华](https://mirrors.tuna.tsinghua.edu.cn/help/openwrt/)等非官方的镜像站。

配置源特别简单，修改`/etc/opkg/distfeeds.conf`中的网址就好。

```bash
sed -i 's_downloads.openwrt.org_mirror.sjtu.edu.cn/openwrt_' /etc/opkg/distfeeds.conf
```

## 语言

如果想将luci显示语言换成中文，安装中文语言包再刷新下页面就好了。后面可以进到“系统”->“系统”->“语言和界面”里切换。

```bash
opkg update
opkg install luci-i18n-base-zh-cn
```

## 扩容

官方的镜像文件只有100多M的空间，肯定不够用，我们需要将root扩容。

[实机扩容](#实机扩容)root大致可以分两步，先是[挂载新硬盘](https://openwrt.org/docs/guide-user/storage/usb-drives)获得新的存储空间，再是[扩容root](https://openwrt.org/docs/guide-user/additional-software/extroot_configuration)。可以参见：{% post_link openwrt-resize-root OpenWrt扩容 %}。

同为虚拟机，VBox里的扩容比Hyper-V要简单得多。

首先将虚拟机关机；
然后在VBox的工具->介质中，选择我们使用的虚拟磁盘`openwrt.vdi`，直接将虚拟分配空间的大小改到200G;
最后启动虚拟机，完事。

## 安装软件

- {% post_link openwrt-aria2 [OpenWrt]使用aria2 %}
- {% post_link openwrt-openclash [OpenWrt]使用OpenClash科学上网 %}
- {% post_link openwrt-docker [OpenWrt]使用docker %}
- {% post_link openwrt-unblock-netease-music [OpenWrt]解除网易云音乐播放限制 %}

## 宿主机使用虚拟机中的OpenWrt上网

实现宿主机使用虚拟机上网有蛮多路径，我们实现最简单的一种：虚拟机桥接模式。

虚拟机需要设置两块网卡，一块Host Only，一块桥接网卡。其中，
- Host Only网卡，视为lan。用以连接宿主机。
- 桥接网卡，视为wlan。用以连接宿主机的上游，通常是路由器。注意宿主机还可能有Hyper-V等虚拟网卡，桥接网卡是实体网卡，通常以Intel开头，不要选错了。

在上面[创建虚拟机](https://openwrt.org/zh/docs/guide-user/virtualization/virtualbox-vm#vm%E8%99%9A%E6%8B%9F%E6%9C%BA%E8%AE%BE%E7%BD%AE)时，多半已经设置了这两个网卡，而且还多出一个`网络地址转换NAT`网卡，需要把NAT网卡先删除掉。

我们的思路是，宿主机使用Host Only网卡连接虚拟机，虚拟机使用桥接网卡连接上游路由器，同时禁掉宿主机到上游路由器的ipv4，迫使网络走仅剩的虚拟机通道。

要实现这点，需要修改宿主机和虚拟机中的Host Only网卡的配置，将网关反过来。

1. 修改虚拟机的lan ip为`192.168.8.1`
```bash
uci set network.lan.ipaddr='192.168.8.1'
uci commit
reboot
```
2. 修改宿主机的`VirtualBox Host-Only Network`的ipv4为`192.168.8.2`，同时网关和dns为`192.168.8.1`

{% asset_img "Host-Only Network.png" "Host-Only Network" %}

3. 禁掉宿主机的以太网ipv4

{% asset_img "ethnet.png" "禁掉宿主机的以太网ipv4" %}

> 注意：禁掉宿主机的以太网ipv4后，有些应用会直接无法连接网络，比如Office。它不会去使用VirtualBox Host-Only网卡，而是判断到以太网网卡无ipv4就认为断网。
> 如果需要联网则需要暂时恢复本地以太网ipv4。

## 开机自启

在`"$ENV:USERPROFILE\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\"`创建一个`vbox.bat`，内容为：

```bat
VBoxManage startvm OpenWrt --type headless
```

即可实现开机自启。
