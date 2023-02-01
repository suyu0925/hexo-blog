---
title: VirtualBox在win上特别卡
date: 2023-02-01 09:09:17
tags:
- windows
description: 最近要用Ubuntu，wsl 2里的不适用，就在VBox里跑了一个，结果发现贼卡，研究一下。
---
想在Windows用Ubuntu有很多种方式：
- wsl 2
- docker
- VirtualBox
- Hyper-V

最简单的当然是wsl 2，但wsl 2不够隔离，很容易影响原系统，不适用玩耍。

docker虽然方便，但不够完整，更适合用来运行应用。

剩下的选择就是分别以[Hyper-V](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/about/)和VirtualBox为代表的第1类和第2类的[hypervisor](https://zh.wikipedia.org/wiki/Hypervisor)。

为了通用性，当然优先选择第2类的vbox。

但使用中发现vbox中运行的ubuntu贼卡，怎么给CPU和内存都没用。

## 无解的性能大幅下降

在网上以`windows virtualbox slow`为关键词搜了下，[第一个链接](https://www.wintips.org/fix-virtualbox-running-very-slow-in-windows-10-11/)就说明了答案：[开启Hyper-V会导致VirtualBox性能大幅降低](https://docs.oracle.com/en/virtualization/virtualbox/6.1/admin/AdvancedTopics.html#hyperv-support)。

因为要运行以wsl 2为后端的docker，所以打开了hyper-v。虽然VirtualBox能兼容Hyper-V，当半虚拟化接口使用的是Hyper-V时，右下角会出现绿色海龟：

{% asset_img green-turtle.png 绿色海龟 %}

但此时性能会受到极大影响，并且[无法使用嵌套VT-x/AMD-V](https://forums.virtualbox.org/viewtopic.php?f=1&t=106620#p521271)。

所以当开启Hyper-V时，还是推荐使用[hyper-v的虚拟机](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/quick-create-virtual-machine)。

## 使用Hyper-V

### Ubuntu镜像

推荐使用自行下载Ubuntu镜像作为`本地安装源`而不是使用`快速创建`里面的Ubuntu镜像，毕竟可自行灵活下载的网速相比抽风的微软下载站可控得多。

### hyper-v下的ubuntu分辨率为全屏

使用`sudo nano /etc/default/grub`将`grub`中的`GRUB_CMDLINE_LINUX_DEFAULT`改为
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyperv_fb:1920x1080"
```
然后
```bash
sudo update-grub
sudo reboot
```

### hyper-v下修改磁盘大小

先将虚拟机关机，然后再编辑硬盘驱动器的虚拟硬盘。

默认虚拟硬盘会放在`C:\ProgramData\Microsoft\Windows\Virtual Hard Disks\`，如果C盘空间不够可以挪到其它盘。

如果有需求一定记得先扩容，否则创建完检查点就不允许编辑了。
