---
title: "[Openwrt]使用clouddrive"
date: 2022-07-29 14:29:03
tags:
- openwrt
description: 将网盘mount到本地使用。
---
[CloudDrive](https://t.me/s/cloud_nas)是一个**闭源**的软件，可以将115、阿里云等网盘mount到本地使用。

因为需要登录，而它又是闭源的，所以使用是有**风险**的，请不要登录自己的重要账号，建一个小号来使用它。

它有两个版本，windows版和[docker版](https://hub.docker.com/r/cloudnas/clouddrive)，我们使用docker版本。

## 准备工作

### fuse

首先它依赖fuse，先安装fuse-utils：
```bash
opkg update && opkg install fuse-utils
```

### shared mount

因为clouddrive使用fuse来挂载云盘，为了能将容器中挂载的fuse共享到宿主机，我们挂载到docker容器的卷必须是shared类型，~~且为docker 数据分区~~，所以我们需要准备一个shared类型的挂载点。

~~docker数据分区为`/opt/docker`，而我们使用的磁盘`/dev/sdb1`被挂载在了根目录，所以满足要求，可以用来当挂载点：`mount /dev/sdb1 /mnt/system`。~~

```bash
mount --make-shared /mnt/system
```

同时，记得将`mount --make-shared /mnt/system`这行代码加到开机启动脚本`/etc/rc.local`的`exit 0`前面，使得重启后也有效。

## 启动

```bash
docker run -d \
    --name clouddrive \
    --restart unless-stopped \
    -v /mnt/system/CloudNAS:/CloudNAS:shared \
    -v /mnt/system/CloudConfig:/Config \
    -p 9798:9798 \
    --privileged \
    --device /dev/fuse:/dev/fuse \
    cloudnas/clouddrive
```

## 设置

打开控制台`http://192.168.8.1:9798`，绑定阿里云盘。

## 拓展

于是我们可以使用[Jellyfin](https://jellyfin.org/)观看云盘上的内容了。
