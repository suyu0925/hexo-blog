---
title: 开放docker容器给局域网上其它电脑访问
date: 2022-02-21 14:10:34
tags: 
- docker
- jellyfin
description: 在docker中运行了jellyfin，发现同一局域网下的设备无法访问，花了好长时间才找到问题。
---
想用手机播放电脑上的多媒体文件，整了个[jellyfin](https://jellyfin.org/)在上跑着。本机使用`localhost`或`192.168.0.123`都可以访问，但同一LAN下的其它设备却无法连接。

各种找原因，调整jellyfin的docker network相关配置啦，把jellyfin从docker换到native msi版本啦，结果都不行。

最后把windows防火墙全关了，发现能访问了。好嘛，答案竟然这么简单粗暴。

在最开始就已经检查过windows防火墙，入站规则很明显有的docker相关，但它的网络类型是公共，而当前使用的网络类型是专用。一直以为对公共开放就默认对专用网络也开放，结果竟然是独立的。

另外，负责docker的入站访问的程序不是`Docker Desktop.exe`而是`com.docker.backend.exe`，在`c:\Program Files\Docker\Docker\resources\`目录下。

{% asset_img "docker-firewall.png" "docker firewall" %}
