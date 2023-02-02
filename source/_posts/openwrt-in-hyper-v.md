---
title: 在Hyper-V中安装OpenWrt
date: 2023-02-02 10:10:17
tags:
- windows
- openwrt
description: 之前有介绍过在VirtualBox中玩耍OpenWrt，但发现打开Hyper-V后，VirtualBox的性能大幅下降。其实也可以使用Hyper-V来玩耍OpenWrt。
---
之前有介绍过在{% post_link openwrt-in-vbox VirtualBox中玩耍OpenWrt %}，但发现打开Hyper-V后，{% post_link virtualbox-running-slow VirtualBox的性能大幅下降 %}。其实也可以使用Hyper-V来玩耍OpenWrt。

企业机场[GeckoRelay](https://geckorelay.me/)的这篇文档[Hyper-V 部署 OpenWRT 软路由](https://doc.geckorelay.me/guide/hyperv-openwrt.html)中网卡部分写的挺好，可以参考下。

这里只记录几个重点。

## 开启Hyper-V

Windows Home用户无法在`启用或关闭 Windows 功能`中找到Hyper-V的选项。

可以以管理员身份运行
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

## 映像转换

与VirtualBox一样，Hyper-V也不支持[OpenWrt官网下载](https://openwrt.org/releases/start)的RAW格式.img文件，需要转换成[虚拟硬盘](https://learn.microsoft.com/en-us/windows-server/storage/disk-management/manage-virtual-hard-disks)使用。虚拟硬盘的格式包括vhd和第二版的[vhdx](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-vhdx/83e061f8-f6e2-4de1-91bd-5d518a43d477)两种，可以[互相转换](https://learn.microsoft.com/en-us/troubleshoot/system-center/vmm/convert-between-vhd-vhdx-formats)。推荐使用vhdx。

相比vbox是使用`VBoxManage convertfromraw --format VDI openwrt-*x86-64-combined*.img openwrt.vdi`命令来将raw转成vdi，hyper-v在命令行之外还提供了带界面的选择。

### 使用命令行

hyper-v这边使用的命令行工具是diskpart。

首先运行[diskpart](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/diskpart)进入DISKPART命令行。
```
Microsoft DiskPart 版本 10.0.19041.964

Copyright (C) Microsoft Corporation.
On computer: DESKTOP-DEMO

DISKPART>
```

创建虚拟硬盘文件
```bash
DISKPART> create vdisk file=c:\test.vhdx maximum=204800 type=expandable
    100 percent completed
DiskPart successfully created the virtual disk file.
```

然后附加，或者说挂载
```bash
DISKPART> select vdisk file=c:\test.vhdx
DiskPart successfully selected the virtual disk file.

DISKPART> attach vdisk
    100 percent completed
DiskPart successfully attached the virtual disk file.
```

刷入openwrt的img。此步可以使用刷盘工具[rufus](https://rufus.ie/zh/)来进行。

{% asset_img rufus.png rufus %}

刷入完成后分离，或者说卸载虚拟硬盘
```bash
DISKPART> detach vdisk
DiskPart successfully detached the virtual disk file.
```

### 使用界面

使用[磁盘管理](https://learn.microsoft.com/zh-cn/windows-server/storage/disk-management/overview-of-disk-management)工具，可按照[微软官方的文档](https://learn.microsoft.com/zh-cn/windows-server/storage/disk-management/manage-virtual-hard-disks)操作。

## 网络

openwrt的默认网络设置是：
```ini
network.loopback=interface
network.loopback.device='lo'
network.loopback.proto='static'
network.loopback.ipaddr='127.0.0.1'
network.loopback.netmask='255.0.0.0'
network.globals=globals
network.globals.ula_prefix='fd4d:16fb:0036::/48'
network.@device[0]=device
network.@device[0].name='br-lan'
network.@device[0].type='bridge'
network.@device[0].ports='eth0'
network.lan=interface
network.lan.device='br-lan'
network.lan.proto='static'
network.lan.ipaddr='192.168.1.1'
network.lan.netmask='255.255.255.0'
network.lan.ip6assign='60'
```

即最普通的路由模式。
桥接上游`eth0`。
lan设备`br-lan`，端口为`192.168.1.1`。

未完待续。
