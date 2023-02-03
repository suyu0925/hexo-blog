---
title: OpenWrt扩容
date: 2023-02-02 16:58:23
tags:
- openwrt
description: OpenWrt的官方镜像root分区只有80多M剩余空间，不扩容是基本不能用的。实现上有多种方案，这里整合一下。
---

## OpenWrt固件

OpenWrt官网提供了[多个固件下载](https://openwrt.org/docs/guide-user/installation/openwrt_x86)。国内很贴心的提供了镜像，比如[清华](https://mirrors.tuna.tsinghua.edu.cn/openwrt/releases/22.03.3/targets/x86/64/)。

这些固件的多个版本主要由3个参数组合：
- combined和rootfs
  rootfs即只有一个分区：`/`即root，combined则是增加了`boot`启动引导区。一般人都不会去碰rootfs，启动引导太折腾。
- ext4和squashfs
  相比ext4，squashfs增加了只读区以提供系统恢复功能，但无法做分区扩容（但可以挂载扩容）。
- efi
  efi则是增加了`bios_grub`启动引导区，同时也保留了`legacy_boot`。

如果是实机安装，建议使用squashfs-combined-efi；虚拟机则首选ext4-combined。

## 扩容

OpenWrt官方的固件只留了几十M的用户空间，正式使用完全不够用。所以官方有提供[扩容文档](https://openwrt.org/docs/guide-user/installation/openwrt_x86#resizing_partitions)。

扩容方案有很多种，最彻底的当然是按照硬件大小直接[编译自己的固件](https://openwrt.org/docs/guide-user/installation/openwrt_x86#building_your_own_image_with_larger_partition_size)，但过于硬核。这里提供另外两种，安装后扩容和安装前扩容。

### 安装后扩容

1. 使用[parted](http://man.cx/parted)扩展分区

```sh
opkg update
opkg install parted
BOOT="$(sed -n -e "\|\s/boot\s.*$|{s///p;q}" /etc/mtab)"
PART="${BOOT##*[^0-9]}"
DISK="${BOOT%${PART}}"
echo fix | parted -l ---pretend-input-tty
parted -s ${DISK%p} resizepart $((PART+1)) 100%
```

如果是efi镜像，还需要更新grub
```sh
opkg update
opkg install lsblk
BOOT="$(sed -n -e "\|\s/boot\s.*$|{s///p;q}" /etc/mtab)"
PART="${BOOT##*[^0-9]}"
DISK="${BOOT%${PART}}"
ROOT="${DISK}$((PART+1))"
UUID="$(lsblk -n -o PARTUUID ${ROOT})"
sed -i -r -e "s|(PARTUUID=)\S+|\1${UUID}|g" /boot/grub/grub.cfg
```

2. 使用losetup挂载，然后使用resize2fs扩展

针对`ext4-combined`
```sh
opkg update
opkg install losetup resize2fs
BOOT="$(sed -n -e "\|\s/boot\s.*$|{s///p;q}" /etc/mtab)"
PART="${BOOT##*[^0-9]}"
DISK="${BOOT%${PART}}"
ROOT="${DISK}$((PART+1))"
LOOP="$(losetup -f)"
losetup ${LOOP} ${ROOT}
resize2fs -f ${LOOP}
reboot
```

针对`squashfs-combined`
```sh
opkg update
opkg install losetup resize2fs
BOOT="$(sed -n -e "\|\s/boot\s.*$|{s///p;q}" /etc/mtab)"
PART="${BOOT##*[^0-9]}"
DISK="${BOOT%${PART}}"
ROOT="${DISK}$((PART+1))"
LOOP="$(losetup -n -l | sed -n -e "\|\s.*\s${ROOT#/dev}\s.*$|{s///p;q}")"
resize2fs -f ${LOOP}
reboot
```

打完收工。

### 安装前扩容

安装前扩容的思路是修改官方固件的.img文件，这样在安装完系统后直接就是正确的容量。

但坏处是.img文件会暴增到扩容后的大小，只适用于较小容量的扩容，如果要扩容到上百G那这种方式还是不合适，还是要去用官方提供的[Image Builder](https://openwrt.org/docs/guide-user/additional-software/imagebuilder)。

**注意**
下面的操作仅支持ext4-combined.img，不支持efi，也不支持squashfs。

1. 给img映像文件增加4G空间
```sh
dd if=/dev/zero bs=1G count=4 >> openwrt-22.03.3-x86-64-generic-ext4-combined.img

4+0 records in
4+0 records out
4294967296 bytes (4.3 GB, 4.0 GiB) copied, 4.09236 s, 1.0 GB/s
```

2. 挂载镜像到loop设备
```sh
sudo losetup -f openwrt-22.03.3-x86-64-generic-ext4-combined.img
```

使用[losetup](https://linux.die.net/man/8/losetup)查看挂载设备后的名称，这里示例是`loop13`，在你的机器上可能会是其它数字。
```sh
losetup 

NAME        SIZELIMIT OFFSET AUTOCLEAR RO BACK-FILE                                                                    DIO LOG-SEC
/dev/loop13         0      0         0  0 /home/<username>/sambashare/openwrt-22.03.3-x86-64-generic-ext4-combined.img   0     512
```

使用[lsblk](https://linux.die.net/man/8/lsblk)查看分区，大小是4.1G
```sh
lsblk

NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop13   7:13   0   4.1G  0 loop
```

使用partx读取分区信息，然后再次查看分区
```sh
sudo partx -a /dev/loop13

lsblk 
NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
loop13       7:13   0   4.1G  0 loop
├─loop13p1 259:0    0    16M  0 part
└─loop13p2 259:1    0   104M  0 part
```
可以看到loop13有2个分区（boot和root），第2个分区大小为104M，并没有扩展到4G。

3. 扩展root分区
使用`fdisk`扩展root分区
```sh
sudo fdisk /dev/loop13

Welcome to fdisk (util-linux 2.37.2).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

# 输入p查看分区信息，记住/dev/loop0p2分区的开始扇区
Command (m for help): p
Disk /dev/loop13: 4.12 GiB, 4421320704 bytes, 8635392 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xabeae232

Device        Boot Start    End Sectors  Size Id Type
/dev/loop13p1 *      512  33279   32768   16M 83 Linux
/dev/loop13p2      33792 246783  212992  104M 83 Linux

# 删除/dev/loop13p2分区，输入d之后输入2(默认)
Command (m for help): d
Partition number (1,2, default 2): 2

Partition 2 has been deleted.

# 输入n新建分区
Command (m for help): n
Partition type
   p   primary (1 primary, 0 extended, 3 free)
   e   extended (container for logical partitions)
# 输入p主分区(默认)
Select (default p): p
# 输入2(默认)
Partition number (2-4, default 2): 2
# 输入分区2的开始扇区，一定要和上面的一样，这里是33792
First sector (33280-8635391, default 34816): 33792
# 输入结束扇区，一定要比33792大，如果直接回车就是全部剩余都将作为第二分区，这里直接回车
Last sector, +/-sectors or +/-size{K,M,G,T,P} (33792-8635391, default 8635391):

Created a new partition 2 of type 'Linux' and of size 4.1 GiB.
Partition #2 contains a ext4 signature.

# 提示，是否移除分区的签名，这里一定要输入n，不然镜像会出问题
Do you want to remove the signature? [Y]es/[N]o: n

# 输入w保存我们的更改
Command (m for help): w

# 会有警告，这里不用管
The partition table has been altered.
Calling ioctl() to re-read partition table.
Re-reading the partition table failed.: Invalid argument

# 提示说内核依然会使用旧的分区表，新的分区表需要在下次重启或运行 partprobe(8)或kpartx(8)命令后生效
The kernel still uses the old table. The new table will be used at the next reboot or after you run partprobe(8) or kpartx(8).
```

更新分区信息，使用新的分区表。然后再次查看分区。
```sh
sudo partx -u /dev/loop13

lsblk
NAME       MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop13       7:13   0   4.1G  0 loop
├─loop13p1 259:2    0    16M  0 part
└─loop13p2 259:3    0   4.1G  0 part
```
root分区已经扩容到4.1G

4. 同步分区信息
```sh
# 先使用e2fsck镜像检测，纠错
sudo e2fsck -f /dev/loop13p2
e2fsck 1.46.5 (30-Dec-2021)
Pass 1: Checking inodes, blocks, and sizes
Pass 2: Checking directory structure
Pass 3: Checking directory connectivity
Pass 4: Checking reference counts
Pass 5: Checking group summary information
Padding at end of inode bitmap is not set. Fix<y>? yes

rootfs: ***** FILE SYSTEM WAS MODIFIED *****
rootfs: 1445/6656 files (0.0% non-contiguous), 5178/26624 blocks

# 开始同步
sudo resize2fs /dev/loop13p2
resize2fs 1.46.5 (30-Dec-2021)
Resizing the filesystem on /dev/loop13p2 to 1075200 (4k) blocks.
The filesystem on /dev/loop13p2 is now 1075200 (4k) blocks long.
```

5. 卸载
卸载系统中的分区
```sh
sudo partx -d /dev/loop13
```

卸载loop设备
```sh
sudo losetup -d /dev/loop13
```
