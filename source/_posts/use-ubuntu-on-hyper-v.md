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

热心网友[Hinara](https://github.com/Hinara)分叉了这个项目，支持了Ubuntu 20.04和22.04。上面那篇gist里就是使用这个项目的脚本来安装增强模式的。

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

## 磁盘大小

先将虚拟机关机，然后再编辑硬盘驱动器的虚拟硬盘。

默认会放在`C:\ProgramData\Microsoft\Windows\Virtual Hard Disks\`，如果C盘空间不够可以挪到其它盘。在`Hyper-V 设置`中可以修改虚拟硬盘的默认文件夹。

有需求一定记得先扩容，否则创建完检查点就不允许编辑了。
