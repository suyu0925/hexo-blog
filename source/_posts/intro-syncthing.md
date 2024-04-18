---
title: syncthing
date: 2023-10-31 11:23:15
tags:
- 善用佳软
description: 之前在聊NAS时，不止一次出现过syncthing，来认识一下。
---
[syncthing](https://syncthing.net/)是一个用于在不同设备间同步文件的软件。

## 安装

和{% post_link rclone rclone %}一样，syncthing也是一个可执行文件。直接运行即可。参数可查看[文档](https://docs.syncthing.net/users/syncthing.html)。

## 运行

官方有提供[自动运行](https://docs.syncthing.net/users/autostart.html)的教程。

但既然有可执行文件，就一定可以wrap成docker映像。官方已经[做好了](https://hub.docker.com/r/syncthing/syncthing)，docker映像的使用说明见[这里](https://github.com/syncthing/syncthing/blob/main/README-Docker.md)。

```yml
---
version: "3"
services:
  syncthing:
    image: syncthing/syncthing
    container_name: syncthing
    environment:
      - PUID=1000
      - PGID=1000
      - STGUIADDRESS=
    volumes:
      - ./st-sync:/var/syncthing
    network_mode: host
    # ports:
    #   - 8384:8384 # Web UI
    #   - 22000:22000/tcp # TCP file transfers
    #   - 22000:22000/udp # QUIC file transfers
    #   - 21027:21027/udp # Receive local discovery broadcasts
    restart: unless-stopped
```

这里解释几个参数：
- network_mode：为了让容器中的syncthing能够发现宿主LAN中的其他设备，需要将容器的网络模式设置为host，同时将ports去掉；
- STGUIADDRESS：默认会将gui的web服务监听在0.0.0.0:8384，一旦network_mode为host，那么从外部网络也能够访问到，而默认gui是没有设置身份验证的，会有安全风险

## 使用

### 添加远程设备

syncthing运行起来后，每个设备都会有一个唯一的设备ID，使用这个设备ID即可添加远程设备。

### 服务发现

如果设备在同一个LAN中，syncthing会自动发现；
如果设备在不同的LAN中，就需要使用[中继relaying](https://docs.syncthing.net/users/relaying.html)来实现服务发现。

[中继服务](https://docs.syncthing.net/users/strelaysrv.html)和[服务发现](https://docs.syncthing.net/users/stdiscosrv.html)比较复杂，一般又较少用到，这里就不做介绍了。

### 同步文件

syncthing启动后，默认会生成一个Default Folder。

我们可以添加不同的文件夹（使用文件夹ID来指定具体的文件夹），设置给不同的设备，使用不同的同步策略。

假设我们有一台nas服务器和一部pixel手机，在同一个LAN下。我们需要将nas上的相册同步到pixel手机上，使用google相册的无限原始质量存储。

- pixel手机端会默认有一个相册文件夹，但我们不用默认的。重新创建一个`upload-to-gp`的文件夹，文件路径设在相册下的`upload-to-gp`，使用`仅接收`的策略。另外可设置顺序为`Oldest First`，并设置最小磁盘空间为5%，留一些给操作系统。
- pixel手机端的配置要使用web ui操作，app的操作很有限。
- 在nas端创建一个`send-to-pixel`的文件夹，文件夹ID填pixel手机端的，保持一致，使用`仅发送`的策略
- 去pixel手机端`Advanced Configuration`里将`upload-to-gp`文件夹的`Ignore Delete`勾上，避免在上传结束之前在nas端就被清理掉。

设置完成后，只要nas上的`upload-to-gp`有新文件，就会自动上传到pixel手机上。

## 扩展

pixel需要再想办法处理一下上传至google相册服务器就在本地自动删除。

至于拍照的手机怎么将照片上传至nas，那就是另一个故事了。
