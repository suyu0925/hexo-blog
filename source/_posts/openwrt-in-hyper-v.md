---
title: "[Openwrt]在Hyper-V中安装OpenWrt"
date: 2023-02-02 10:10:17
tags:
- windows
- openwrt
description: 之前有介绍过在VirtualBox中玩耍OpenWrt，但发现打开Hyper-V后，VirtualBox的性能大幅下降。其实也可以使用Hyper-V来玩耍OpenWrt。
---
之前有介绍过在{% post_link openwrt-in-vbox VirtualBox中玩耍OpenWrt %}，但发现打开Hyper-V后，{% post_link virtualbox-running-slow VirtualBox的性能大幅下降 %}。其实也可以使用Hyper-V来玩耍OpenWrt。

## 开启Hyper-V

开启Hyper-V有3种方式，参见微软文档[在 Windows 10 上安装 Hyper-V](https://learn.microsoft.com/zh-cn/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)。

1. 在`启用或关闭 Windows 功能`中找到Hyper-V的选项，将其打开。

2. 以管理员身份运行PowerShell
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

3. 又或者以管理员身份运行DISM
```powershell
DISM /Online /Enable-Feature /All /FeatureName:Microsoft-Hyper-V
```

但如果是家庭版Windows，会提示：
```
PS> Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All   
Enable-WindowsOptionalFeature : 功能名称 Microsoft-Hyper-V 未知。
所在位置 行:1 字符: 1
+ Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V  ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (:) [Enable-WindowsOptionalFeature], COMException
    + FullyQualifiedErrorId : Microsoft.Dism.Commands.EnableWindowsOptionalFeatureCommand

PS> DISM /Online /Enable-Feature /All /FeatureName:Microsoft-Hyper-V
错误: 0x800f080c

功能名称 Microsoft-Hyper-V 未知。
未识别出 Windows 功能名称。
请使用 /Get-Features 选项在映像中查找功能名称，然后重试该命令。

可以在 C:\WINDOWS\Logs\DISM\dism.log 上找到 DISM 日志文件
```

找不到功能`Microsoft-Hyper-V`，但其实系统里是有的，在`%SystemRoot%\servicing\Packages\`下，只是没有添加。

以管理员身份运行Command Pormpt，输入下面的命令：
```bat
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
for /f %i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%i"
del hyper-v.txt
Dism /online /enable-feature /featurename:Microsoft-Hyper-V -All /LimitAccess /ALL
```
会提示`Microsoft-Hyper-V`已安装，但没有完全打开。先不用管，重启一下就行了。

## 准备

### 映像转换

与VirtualBox一样，Hyper-V也不支持[OpenWrt官网下载](https://openwrt.org/releases/start)的RAW格式.img文件，需要转换成[虚拟硬盘](https://learn.microsoft.com/en-us/windows-server/storage/disk-management/manage-virtual-hard-disks)使用。虚拟硬盘的格式包括vhd和第二版的[vhdx](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-vhdx/83e061f8-f6e2-4de1-91bd-5d518a43d477)两种，可以[互相转换](https://learn.microsoft.com/en-us/troubleshoot/system-center/vmm/convert-between-vhd-vhdx-formats)。推荐使用vhdx。

相比vbox是使用`VBoxManage convertfromraw --format VDI openwrt-22.03.3-x86-64-generic-squashfs-combined-efi.img openwrt.vdi`命令来将raw转成vdi，hyper-v在命令行之外还提供了带界面的选择。

#### 使用命令行

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

最后记得退出diskpart，否则它还是会占用转换好的vhdx文件。

#### 使用界面

使用[磁盘管理](https://learn.microsoft.com/zh-cn/windows-server/storage/disk-management/overview-of-disk-management)工具，可按照[微软官方的文档](https://learn.microsoft.com/zh-cn/windows-server/storage/disk-management/manage-virtual-hard-disks)操作。

### 网络

我们需要给OpenWrt虚拟机准备两个虚拟交换机：
- 一个外部网络，用来对接上级网络，比如光猫；
- 一个内部网络，用来连接宿主机和OpenWrt。

#### 外部网络

注意在创建外部网络时，先**不要取消**`允许管理操作系统共享此网络适配器`。

{% asset_img external-network.png 外部网络 %}

创建完外部网卡后，原来的`以太网`适配器会关闭TCP/IPv4等项目，对应的，会打开`Hyper-V可扩展的虚拟交换机`。相当于我们上网的路径变成了从External -> 以太网 -> 因特网。

而在后续操作全部搞定后，再取消勾选`允许管理操作系统共享此网络适配器`，这时External适配器会从网络连接中消失，我们的上网路径就变成了Internal -> 以太网 -> 因特网。

#### 内部网络

创建一个名为Internal的内部网络，创建完成后，需要去网络连接里设置一下适配器的`Internet 协议版本 4 (TCP/IPv4) 属性`。

比如设为：
- IP地址：192.168.88.2
- 子网掩码：255.255.255.0
- 默认网关：192.168.88.1
- 首选DNS服务器：8.8.8.8
- 备用DNS服务器：114.114.114.114

全部配置完后我们将使用OpenWrt当作网关来上网，所以这里的网关就是OpenWrt的IP。

## 创建虚拟机

{% asset_img create-vm.png 创建虚拟机 %}

有几个注意点：

**代数**

代数**必须**选择第一代，选第二代会提示无法找到UEFI启动设备。

**网络**

默认网络选Internal，这样直接添加第二张网卡External就正好是符合OpenWrt中wan在第二张网卡的习惯。

OpenWrt默认将第一个网卡`eth0`视为lan，第二个网卡`eth1`视作wan，在给虚拟机添加网卡时要注意顺序，与通用习惯保持一致。

{% asset_img adapter-order.png 网卡添加顺序 %}

## 启动OpenWrt并连接

启动后，输入`uci show network`查看openwrt的默认网络设置。
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

注意OpenWrt默认的`network.lan.ipaddr`是`192.168.1.1`，之前在创建Internal网卡时，为了避免与上游网关冲突，我们改成了一个不常用的网段`192.168.88.1`，需要在这里修改配置。
```bash
uci set network.lan.ipaddr='192.168.88.1'
```

如果第二块网卡wan是在第一次启动之后再添加，那么默认配置里不会有wan，需要手动添加。
但如果在第一次启动前就已经添加好了外部网卡，就不用自己加了。
```bash
uci set network.wan=interface
uci set network.wan.ifname='eth1'
uci set network.wan.proto='dhcp'
```

修改完后提交并重启。
```bash
uci commit
reboot
```

重启后就一切正常了，即可以通过http://192.168.88.1 访问luci，OpenWrt本身也能够连接网络：
```bash
PS > ssh root@192.168.88.1
root@OpenWrt:~# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq master br-lan state UP qlen 1000
    link/ether 00:15:5d:f2:44:ef brd ff:ff:ff:ff:ff:ff
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP qlen 1000
    link/ether 00:15:5d:f2:44:f0 brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.133/24 brd 192.168.0.255 scope global eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::215:5dff:fef2:44f0/64 scope link
       valid_lft forever preferred_lft forever
4: br-lan: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP qlen 1000
    link/ether 00:15:5d:f2:44:ef brd ff:ff:ff:ff:ff:ff
    inet 192.168.88.1/24 brd 192.168.88.255 scope global br-lan
       valid_lft forever preferred_lft forever
    inet6 fdaa:e3e7:5474::1/60 scope global noprefixroute
       valid_lft forever preferred_lft forever
    inet6 fe80::215:5dff:fef2:44ef/64 scope link
       valid_lft forever preferred_lft forever
root@OpenWrt:~#
```

## 扩容

OpenWrt官方映像默认只有几十M的空间，我们之前创建虚拟硬盘时可是指定了200G，需要扩容使用。

扩容要放在安装软件之前，避免扩容失败反复做无用功。

参见这篇文章{% post_link openwrt-resize-root OpenWrt扩容 %}

## 关闭外部网络

在OpenWrt一切正常后，可以在Hyper-V管理器的虚拟交换机管理器中，将外部网卡External中的设置`允许管理操作系统共享此网络适配器`取消选中，让宿主通过OpenWrt上网。
