---
title: ubuntu适合的分区方式
date: 2023-11-06 10:53:09
hidden: true
tags:
description: 在安装ubuntu时，总是会被分区搞得头疼，这里总结一下适合ubuntu的分区方式。
---
## ubuntu默认分区方式
我们先看一看，如果在安装ubuntu时，选择擦除磁盘并默认安装，系统会给出什么样的分区方式。

{% asset_img installation-type.png 擦除磁盘并安装 %}

在系统安装完成后，我们可以通过`sudo fdisk -l`查看分区情况：
```sh
Disk /dev/sda: 127 GiB, 136365211648 bytes, 266338304 sectors
Disk model: Virtual Disk    
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: gpt
Disk identifier: EDDE80EF-DD8B-4A91-A2CE-E7CC8B4490CD

Device       Start       End   Sectors   Size Type
/dev/sda1     2048      4095      2048     1M BIOS boot
/dev/sda2     4096   1054719   1050624   513M EFI System
/dev/sda3  1054720 266336255 265281536 126.5G Linux filesystem
```

用gparted看得更直观一些：
  
{% asset_img default-partitions-gparted.png "default gparted" %}

可以看到，系统默认分了三个分区，分别是：
- `/dev/sda1`：BIOS boot，1M
- `/dev/sda2`：EFI System，513M
- `/dev/sda3`：Linux filesystem，126.5G

再用`df -h`看看挂载点情况
```sh
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           391M  1.7M  390M   1% /run
/dev/sda3       124G   12G  107G  10% /
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
/dev/sda2       512M  6.1M  506M   2% /boot/efi
tmpfs           391M   76K  391M   1% /run/user/128
tmpfs           391M   92K  391M   1% /run/user/1000
```

## 分区用途

{% asset_img partition-use-as.png 分区用途 %}

### swap交换区

ubuntu官方有一篇介绍swap分区的[faq](https://help.ubuntu.com/community/SwapFaq)。

## 系统挂载点
我们先看一看在安装ubuntu时，系统给出的挂载点选择，对ubuntu有个大体的认识。

{% asset_img mount-points.png 系统挂载点 %}
