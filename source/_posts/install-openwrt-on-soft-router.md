---
title: "[OpenWrt]给软路由安装openwrt"
date: 2022-10-01 22:43:18
tags:
- openwrt
description: 之前在虚拟机里玩了下，现在弄了一台J4105的软路由，记录一下openwrt的安装。
---
# [Openwrt]给软路由安装openwrt

## 准备

- 一台电脑
- 一个U盘
- 一台软路由

### openwrt镜像文件

去[openwrt官网](https://downloads.openwrt.org/)下载对应架构的稳定版镜像文件。

#### 版本号

我试了下最新的[22.03.0](https://downloads.openwrt.org/releases/22.03.0/targets/x86/64/)，发现docker daemon无法正常工作。建议不要使用小版本号为0的版本，还是回退到上一个稳定版[22.02.3](https://downloads.openwrt.org/releases/21.02.3/targets/x86/64/)比较保险。

#### 选哪个镜像

OpenWrt的镜像有很多个，大概是下面几个选项的排列组合：
- ext4还是squashfs
- 单rootfs还是combined
- efi还是legacy

##### ext4还是squashfs

相比普通的ext4，squashfs引入了只读区域，可以恢复出厂设置，建议选择squashfs。

##### 单rootfs还是combined

为了以后更方便迁移扩容，建议combined，把boot和rootfs分开。

##### efi还是legacy

根据软路由主板来决定，一般情况两种都支持。默认efi吧。

总结一下就是默认下载`generic-squashfs-combined-efi.img.gz`这个镜像。

### WinPE

WinPE的全称是Windows Preinstallation Environment，是微软官方出的一个小型操作系统，用来安装、部署和修复正经操作系统。

一般用户都会使用第三方WinPE，比如[微PE](https://www.wepe.com.cn/)、[优启通](https://www.upe.net/)等。

但防人之心不可无，既然官方有，为什么要用民间的呢。

#### 安装官方WinPE

[从Win10 1809开始](https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/winpe-intro?view=windows-11#download-winpe)，官方WinPE包含在[ADK](https://learn.microsoft.com/zh-cn/windows-hardware/get-started/adk-install)的[加载项](https://learn.microsoft.com/zh-cn/windows-hardware/get-started/adk-install#download-the-adk-for-windows-11-version-22h2)里。

#### 制作WinPE启动U盘

下一步是[创建可启动WinPE介质]（https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/winpe-create-usb-bootable-drive?view=windows-11）。

1. 首先是创建工作文件。

以管理员身份启动**部署和映像工具环境**（在开始菜单的程序栏Windows Kits下）运行以下脚本
```powershell
copype amd64 C:\WinPE_amd64
```

2. 定制WinPE

默认WinPE只有一个命令行没有界面，如果想使用UI，需要在这一步定制。

对于自用来说这一步可以省略，命令行是最优雅的人机交互方式（狗头

3. 烧录至U盘

烧录有两种方式，一种是使用**部署和映像工具环境**命令行直接烧录
```powershell
MakeWinPEMedia /UFD C:\WinPE_amd64 P:
```

另一种是生成iso文件，然后使用通用烧录工具如[rufus](https://rufus.ie/zh/)进行烧录，推荐这种方法，更可控些。
```powershell
MakeWinPEMedia /ISO C:\WinPE_amd64 C:\WinPE_amd64\WinPE_amd64.iso
```

4. 拷贝物料

将OpenWrt镜像文件、写盘工具等文件复制到U盘根目录，以供后续使用。

### 写盘工具

我们需要将openwrt.img写入软路由的磁盘，需要写盘工具来完成这一步。

首推[physdiskwrite](https://m0n0.ch/wall/physdiskwrite.php)，目前最新版本为[0.5.3](https://m0n0.ch/wall/downloads/physdiskwrite-0.5.3.zip)。

使用方法：
```bat
physdiskwrite.exe -u generic-squashfs-combined-efi.img
```

然后选择对应的硬盘，通常是第一个，也就是`0`号。**注意**，如果有挂载其它硬盘，这一步一定要小心别选错了。

参数`-u`是因为软件作者担心用户写错盘，在写入超出2G容量的硬盘时需要显性指定`-u`参数。

### 分区工具

写完盘后，默认会在硬盘上新建3个分区。分别是efi，boot和rootfs。这三个区一共也才100多兆，硬盘上的上百G空间就被剩了下来。

此时就需要分区工具来进行扩容，把剩余的空间都划给rootfs。

#### Diskpart

[dispart](https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/diskpart)是微软官方WinPE自带的分区工具。

进入diskpart提示符后，选择磁盘和卷，扩容（默认使用全部剩余空间），再退出（保存）即可。

```bat
diskpart
DISPART> list volume
DISPART> select disk 0 
DISPART> select volume 3
DISPART> extend
DISPART> exit
```

{% asset_img "diskpart_extend_partition.jpg" "使用diskpart扩容分区" %}

#### DiskGenius

如果实在不习惯命令行，想用DiskGenius，那最简单的方法是使用第三方WinPE，第三方WinPE都会集成常用工具。比如[优启通](https://www.upe.net/)。

DiskGenius的使用方法就不多说了，扩展rootfs分区使用剩余未分区空间再保存就行。

## 安装Openwrt

将软路由接上显示器，键盘，鼠标，U盘，然后插电。

### 通电直接启动

默认软由器会通电直接开机，而不用按下开机键。这样才能在断电又来电后自动恢复。

这项设置在BIOS的`Restore AC Power Loss`中，将它设为`Power On`即可。

`Restore AC Power Loss`通常在电源管理或者高级设置里。

### 进入WinPE

开机后依据屏幕提示，按`F8`或`F12`进入快捷启动，选择U盘启动。

进入WinPE后，进行[写盘](#写盘工具)和[分区](#分区工具)操作。

完成后重启机器。

## 配置Openwrt

重启完成后就会进入Openwrt系统了，等待启动完成按下回车键激活命令行。

### 密码

初始系统默认没有密码，无法通过ssh登录。根据提示使用`passwd`命令设置密码。

### 配置IP

默认的IP是`192.168.1.1`，很容易跟光猫或主路由冲突。我们把它改为`192.168.8.1`。

```bash
uci set network.lan.ipaddr='192.168.8.1'
uci commit
reboot
```

### 配置软件源

国内源的下载速度与官方比起来就像飞机和汽车。

```bash
sed -i 's_downloads.openwrt.org_mirror.sjtu.edu.cn/openwrt_' /etc/opkg/distfeeds.conf
```

### 中文界面

安装luci中文界面。

```bash
opkg update
opkg install luci-i18n-base-zh-cn
```

### 常用软件

常用软件可参考其它文章。

- {% post_link openwrt-openclash OpenClash %}
- {% post_link openwrt-aria2 Aria2 %}
- {% post_link openwrt-samba Samba %}
- {% post_link z-jump-around 解锁网易云 %}
- {% post_link openwrt-unblock-netease-music Docker %}
