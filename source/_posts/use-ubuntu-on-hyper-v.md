---
title: 在Hyper-V上使用Ubuntu
date: 2023-04-20 14:14:05
tags:
description: VirtualBox在开启Hyper-V后性能很差，需要切换到Hyper-V虚拟机。
---

## 安装

微软在Hyper-V的[快捷创建（quick create）](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/quick-create-virtual-machine)中[内置了一些Ubuntu的发行版](https://learn.microsoft.com/zh-cn/windows-server/virtualization/hyper-v/supported-ubuntu-virtual-machines-on-hyper-v):

{% asset_img quick-create.png 快速创建 %}

微软优化过的Ubuntu镜像与在Ubuntu官网下载的标准镜像有所区别，Ubuntu的[这篇文章](https://ubuntu.com/blog/optimised-ubuntu-desktop-images-available-in-microsoft-hyper-v-gallery)和微软的[这篇文章](https://blogs.windows.com/windowsdeveloper/2018/09/17/run-ubuntu-virtual-machines-made-even-easier-with-hyper-v-quick-create/)简单的介绍了下。

如果使用标准镜像，要打开[增强模式](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/learn-more/use-local-resources-on-hyper-v-virtual-machine-with-vmconnect)的话需要做很多额外操作，可参见[这篇gist](https://gist.github.com/milnak/54e662f88fa47a5d3a317edb712f957e)。

微软之前使用了一个脚本来自动化这些操作，项目在[linux-vm-tool](https://github.com/microsoft/linux-vm-tools)，目前已经归档。只支持了Ubuntu 16.04和18.04。

热心网友[Hinara](https://github.com/Hinara)分叉了这个项目，[支持了](https://github.com/Hinara/linux-vm-tools/tree/ubuntu20-04/ubuntu)Ubuntu 20.04和22.04。上面那篇gist里就是使用这个项目的脚本来安装增强模式的。

如无特别需求，建议使用微软优化过的镜像。除了更方便外，体感上微软优化的镜像运行起来要更快一些。

## 显示分辨率

默认Ubuntu的显示分辨率是1364 x 768，这个分辨率在现在的显示器上看起来很小。

{% asset_img default-display_resolution.png 默认分辨率 %}

### 标准镜像
如果是使用的标准镜像，可以修改grub来设置分辨率。

使用`sudo nano /etc/default/grub`将`grub`中的`GRUB_CMDLINE_LINUX_DEFAULT`改为
```ini
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyperv_fb:1920x1080"
```
然后
```bash
sudo update-grub
sudo reboot
```

### 微软镜像

如果使用的是微软优化过的镜像，在连接时选择全屏就行。

{% asset_img resolution-on-connecting.png 选择分辨率 %}

## 硬盘扩容

虚拟硬盘文件默认会放在`C:\ProgramData\Microsoft\Windows\Virtual Hard Disks\`，如果C盘空间不够可以挪到其它盘。在`Hyper-V 设置`中可以修改虚拟硬盘的默认文件夹。

有需求一定记得先扩容，否则创建完检查点就不允许编辑了。

1. 先将虚拟机关机。

2. 编辑硬盘驱动器的虚拟硬盘，官方内建Ubuntu镜像默认硬盘大小是12G，完全不够用。扩展至你想要的大小，这里是动态大小，大点没关系，比如200G。

3. 只扩展虚拟硬盘文件并不会直接应用到Ubuntu系统，启动并连接虚拟机可以看到：

```bash
user@ubuntu:~$ sudo fdisk -l
GPT PMBR size mismatch (25165823 != 419430399) will be corrected by write.
The backup GPT table is not on the end of the device.

Disk /dev/sda: 200 GiB, 214748364800 bytes, 419430400 sectors
Disk model: Virtual Disk    
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: F86D133B-CDB4-4EAF-A9AA-0F4B0A8ADC00

Device      Start      End  Sectors  Size Type
/dev/sda1  227328 25165790 24938463 11.9G Linux filesystem
/dev/sda14   2048    10239     8192    4M BIOS boot
/dev/sda15  10240   227327   217088  106M EFI System

Partition table entries are not in disk order.
```

还需要扩展分区。

```bash
sudo apt install cloud-guest-utils
sudo growpart /dev/sda 1
sudo resize2fs /dev/sda1
```

注意`/dev/sda 1`中的1前面有个空格，这是分区号，不是分区名。

4. 扩容完成
```bash
user@ubuntu:~$ df -h
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           192M  1.6M  190M   1% /run
/dev/sda1       194G  6.5G  188G   4% /
tmpfs           956M     0  956M   0% /dev/shm
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
/dev/sda15      105M  5.3M  100M   5% /boot/efi
tmpfs           192M   84K  192M   1% /run/user/127
tmpfs           192M  172K  191M   1% /run/user/1000
```

## 远程登录

Ubuntu桌面版默认是不支持远程登录的，为了可以从宿主机使用`ssh`命令登录虚拟机，需要安装`openssh-server`。
```bash
sudo apt install openssh-server
ip addr
```

使用`ip addr`查看虚拟机的IP地址，然后在宿主机使用`ssh`命令登录。
也可直接使用`ssh user@ubuntu`这种形式，`user`为用户名，`ubuntu`为虚拟机中ubuntu的电脑名。

## 嵌套虚拟化

我们可以[在Hyper-V虚拟机上再运行一个Hyper-V虚拟机](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/user-guide/nested-virtualization)。

```powershell
Set-VMProcessor -VMName <VMName> -ExposeVirtualizationExtensions $true
```
