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

如无特别需求，建议使用微软优化过的镜像。除了更方便外，体感上微软优化的镜像运行起来要更快一些。

## 增强模式

如果使用标准镜像，要打开[增强模式](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/learn-more/use-local-resources-on-hyper-v-virtual-machine-with-vmconnect)的话需要做很多额外操作，可参见[这篇gist](https://gist.github.com/milnak/54e662f88fa47a5d3a317edb712f957e)。

微软之前使用了一个脚本来自动化这些操作，项目在[linux-vm-tool](https://github.com/microsoft/linux-vm-tools)，目前已经归档。只支持了Ubuntu 16.04和18.04。

热心网友[Hinara](https://github.com/Hinara)分叉了这个项目，[支持了](https://github.com/Hinara/linux-vm-tools/tree/ubuntu20-04/ubuntu)Ubuntu 20.04和22.04。上面那篇gist里就是使用这个项目的脚本来安装增强模式的。

总结一下，使用ubuntu的标准镜像打开增强模式的步骤如下：

0. 关闭自动登录
必须**关闭**自动登录，增强模式需要使用xrdp(x Remote Desktop Protocol)登录，而xrdp登录时需要输入密码。

1. 下载并运行脚本
```bash
cd ~/Downloads
wget https://raw.githubusercontent.com/Hinara/linux-vm-tools/ubuntu20-04/ubuntu/22.04/install.sh
sudo chmod +x install.sh
sudo ./install.sh
```

也可以直接clone整个项目，然后运行脚本
```bash
cd ~/Downloads
git clone https://github.com/Hinara/linux-vm-tools.git
cd linux-vm-tools/ubuntu/22.04
sudo chmod +x install.sh
sudo ./install.sh
```

2. 重启后，再次运行此脚本
很多攻略都漏掉了这一步，但这一步很重要，已经在脚本中有输出提示：
> A reboot is required in order to proceed with the install.
> Please reboot and re-run this script to finish the install.

```bash
sudo shutdown -r now
```

重启后连接虚拟机，再次运行脚本
```bash
cd ~/Downloads
sudo ./install.sh
```

3. 将虚拟机关机，在宿主机中设置Hyper-V传输类型

```bash
sudo shutdown -h now
```

使用Get-VM命令查看虚拟机名称
```powershlel
> Get-VM
Name                                  State   CPUUsage(%) MemoryAssigned(M) Uptime           Status   Version
----                                  -----   ----------- ----------------- ------           ------   -------
Ubuntu 22.04 LTS                      Off     0           0                 00:00:00         正常运行 9.0

> Set-VM -VMName 'Ubuntu 22.04 LTS' -EnhancedSessionTransportType HvSocket
```

再次连接到虚拟机，使用xrdp登录后即可使用增强模式。在控制条上可以切换`基本会话`和`增强会话`。

但似乎声音还是没有呢。

## 显示分辨率

默认Ubuntu的显示分辨率是1364 x 768，这个分辨率在现在的显示器上看起来很小。

{% asset_img default-display_resolution.png 默认分辨率 %}

### 基本会话
如果是使用的基本会话，可以修改grub来设置分辨率。

使用`sudo nano /etc/default/grub`将`grub`中的`GRUB_CMDLINE_LINUX_DEFAULT`改为
```ini
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyperv_fb:1920x1080"
```
然后
```bash
sudo update-grub
sudo reboot
```

### 增强会话

如果使用的xrdp，在连接时选择全屏就行。

{% asset_img resolution-on-connecting.png 选择分辨率 %}

## 声音

默认安装完后，无法将声音输出到宿主机。需要安装`pulseaudio`。可以参与ubuntu社区中的[这篇帖子](https://ubuntuforums.org/showthread.php?t=2481545)。

```bash
sudo apt install build-essential dpkg-dev libpulse-dev git autoconf libtool

cd ~/Downloads
git clone https://github.com/neutrinolabs/pulseaudio-module-xrdp.git
cd pulseaudio-module-xrdp

./scripts/install_pulseaudio_sources_apt_wrapper.sh
./bootstrap && ./configure PULSE_DIR=~/pulseaudio.src

make
sudo make install

ls $(pkg-config --variable=modlibexecdir libpulse) | grep 'xrdp'

sudo reboot
```

在`./scripts/install_pulseaudio_sources_apt_wrapper.sh`这一步会花较长时间下载包，可以在日志文件中查看进度：
```bash
tail -f /var/tmp/pa-build-suyu-debootstrap.log
```

{% asset_img xrdp-sound.png "xrdp sound" %}

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
