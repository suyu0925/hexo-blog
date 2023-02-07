---
title: "[Openwrt]扩容"
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

#### 同盘扩展

**注意**：同盘扩展需要在开机后第一时间做，做完立即重启，不要安装完软件再来做，会有机率搞坏系统无限重启。

1. 使用[parted](http://man.cx/parted)扩展分区

```sh
sed -i 's_downloads.openwrt.org_mirror.sjtu.edu.cn/openwrt_' /etc/opkg/distfeeds.conf

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

#### 新盘扩展

##### 分区和格式化

1. 首先我们找到新硬盘

```bash
$> ls -ltr /dev/sd*
brw-------    1 root     root        8,   0 Jul 22 06:00 /dev/sda
brw-------    1 root     root        8,   1 Jul 22 06:00 /dev/sda1
brw-------    1 root     root      259,   0 Jul 22 06:00 /dev/sda128
brw-------    1 root     root        8,   2 Jul 22 06:00 /dev/sda2
brw-------    1 root     root        8,  16 Jul 22 06:00 /dev/sdb
```

这里的/dev/sdb就是新添加的硬盘了。

2. 使用gdisk工具来进行磁盘分区

注意opkg package list并不会持久化，所以每次重启后都需要再运行一次`opkg update`。

```bash
opkg update
opkg install gdisk
gdisk /dev/sdb
```

```
GPT fdisk (gdisk) version 1.0.6

Warning: Partition table header claims that the size of partition table
entries is 0 bytes, but this program  supports only 128-byte entries.
Adjusting accordingly, but partition table may be garbage.
Warning: Partition table header claims that the size of partition table
entries is 0 bytes, but this program  supports only 128-byte entries.
Adjusting accordingly, but partition table may be garbage.
Partition table scan:
  MBR: not present
  BSD: not present
  APM: not present
  GPT: not present

Creating new GPT entries in memory.

Command (? for help): n
Partition number (1-128, default 1):
First sector (34-419430366, default = 2048) or {+-}size{KMGTP}:
Last sector (2048-419430366, default = 419430366) or {+-}size{KMGTP}:
Current type is 8300 (Linux filesystem)
Hex code or GUID (L to show codes, Enter = 8300):
Changed type of partition to 'Linux filesystem'

Command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): y
OK; writing new GUID partition table (GPT) to /dev/sdb.
The operation has completed successfully.
```

分好区后，我们应该可以看到`/dev/sdb1`。

```bash
$> ls -ltr /dev/sd*
brw-------    1 root     root        8,  17 Jul 22 06:17 /dev/sdb1
brw-------    1 root     root        8,  16 Jul 22 06:17 /dev/sdb
brw-------    1 root     root        8,   2 Jul 22 06:17 /dev/sda2
brw-------    1 root     root      259,   0 Jul 22 06:17 /dev/sda128
brw-------    1 root     root        8,   1 Jul 22 06:17 /dev/sda1
brw-------    1 root     root        8,   0 Jul 22 06:17 /dev/sda
```

3. 格式化

之前我们创建磁盘时已经选择了设置为**固态驱动器**，所以这里我们使用f2fs来代替ext4。

```bash
opkg install f2fs-tools
opkg install kmod-fs-f2fs
mkfs.f2fs /dev/sdb1
```

##### 自动挂载

下一步来设置重启后自动挂载sdb1。

**先安装block工具**

```bash
opkg install block-mount
```

安装完后，可以使用`block`命令，同时在luci的系统菜单下会出现`挂载点`页面，可以更方便的查看挂载情况。

{% asset_img "mount-point.png" "挂载点" %}

```bash
$> block detect
config 'global'
        option  anon_swap       '0'
        option  anon_mount      '0'
        option  auto_swap       '1'
        option  auto_mount      '1'
        option  delay_root      '5'
        option  check_fs        '0'

config 'mount'
        option  target  '/boot'
        option  uuid    'FB5E-DCEF'
        option  enabled '0'

config 'mount'
        option  target  '/'
        option  uuid    'ff313567-e9f1-5a5d-9895-3ba130b4a864'
        option  enabled '0'

config 'mount'
        option  target  '/mnt/sdb1'
        option  uuid    'fb80a835-f956-4264-8875-09a8e093f13c'
        option  enabled '0'
```

**修改fstab**

接下来的操作可以在luci网页上操作，也可以纯用命令行，在这里当然是推荐使用网页。

在挂载点中选中/mnt/sdb1，然后点下面的`保存&应用`。顺便把`在挂载前检查文件系统`也选中，同样，再次点击`保存&应用`。

事实上在网页上的操作就相当于下面的命令：

```bash
uci set fstab.@mount[-1].enabled='1'
uci commit fstab

uci set fstab.@global[0].check_fs='1'
uci commit fstab
```

你可以在操作前后使用命令`uci show fstab`来对比。

**重启检查**

做完这一步可以试着reboot重启，检查自动挂载有没有生效。

重启后，我们查看磁盘使用情况，sdb1应该会正确的挂载：

```bash
$> df -h
Filesystem                Size      Used Available Use% Mounted on
/dev/root               102.4M     17.3M     83.0M  17% /
tmpfs                   494.5M     64.0K    494.4M   0% /tmp
/dev/sda1                16.0M      5.3M     10.7M  33% /boot
/dev/sda1                16.0M      5.3M     10.7M  33% /boot
tmpfs                   512.0K         0    512.0K   0% /dev
/dev/sdb1               200.0G      2.4G    197.6G   1% /mnt/sdb1
```

##### 扩容root

扩容root有两种方式，一种是使用新磁盘直接替换根目录，另一种是使用overlay。

为了简便，我们在这里使用前一种，直接替换根目录。

1. 首先卸载掉/dev/sdb1

2. 再次挂载/dev/sdb1，选择作为根目录使用

{% asset_img "mount-root.png" "作为根目录" %}

保存并应用。

这一步就相当于下面的命令：

```bash
uci set fstab.@mount[-2].enabled='0'

uci set fstab.@mount[-1].target='/'
uci set fstab.@mount[-1].enabled='1'

uci commit fstab
```

3. 运行命令迁移根目录

```bash
mkdir -p /tmp/introot
mkdir -p /tmp/extroot
mount --bind / /tmp/introot
mount /dev/sdb1 /tmp/extroot  # 注意这里要改为/dev/sdb1
tar -C /tmp/introot -cvf - . | tar -C /tmp/extroot -xf -
umount /tmp/introot
umount /tmp/extroot
```

4. 重启

```bash
$> df -h
Filesystem                Size      Used Available Use% Mounted on
/dev/root               102.4M     17.3M     83.0M  17% /rom
tmpfs                   494.5M    228.0K    494.3M   0% /tmp
/dev/sdb1               200.0G      2.4G    197.6G   1% /
/dev/sda1                16.0M      5.3M     10.7M  33% /boot
/dev/sda1                16.0M      5.3M     10.7M  33% /boot
tmpfs                   512.0K         0    512.0K   0% /dev
```

重启后可以看到根目录已经在/dev/sdb1而不是/dev/root了。

### 安装前扩容（修改img）

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
