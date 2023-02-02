---
title: OpenWrt扩容
date: 2023-02-02 16:58:23
tags:
- openwrt
description: OpenWrt的官方镜像只有100多M空间，不扩容是基本不能用的。实现上有多种方案，这里整合一下。
---

### 安装分区工具
```bash
sed -i 's_downloads.openwrt.org_mirror.sjtu.edu.cn/openwrt_' /etc/opkg/distfeeds.conf

opkg update
opkg install fdisk cfdisk e2fsprogs
```
命令行中`cfdisk`、`fdisk`均为磁盘分区工具，e2fsprogs包含了`mkfs`命令，用于格式化分区。

### 创建新分区

使用cfdisk创建新分区。

先New，再Write，最后Quit。

创建完后`fdisk -l`应该会类似这样：
```
Device      Start       End   Sectors   Size Type
/dev/sda1     512     33279     32768    16M Linux filesystem
/dev/sda2   33280    246271    212992   104M Linux filesystem
/dev/sda3      34       511       478   239K BIOS boot
/dev/sda4  247808 419430366 419182559 199.9G Linux filesystem
```

### 格式化分区

将新分区格式化为ext4格式。
```bash
mkfs.ext4 /dev/sda4
```

### 挂载

先安装block工具
```bash
opkg install block-mount
```
安装完后，可以使用block命令，同时在luci的系统菜单下会出现挂载点页面，可以更方便的查看挂载情况。

将新分区挂载至root
```bash
uci set fstab.@mount[-1].target='/overlay'
uci set fstab.@mount[-1].enabled='1'

uci set fstab.@global[0].check_fs='1'
uci commit fstab
```

完成后reboot，`df -h`检查。
