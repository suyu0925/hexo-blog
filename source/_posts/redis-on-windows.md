---
title: 在windows上安装redis
date: 2021-05-31 13:44:59
tags: [redis, docker]
description: 在*nix系统上安装redis通常很简单，既可以从源码编译，也可以从包管理器安装。但在windows上就不同了……
---
redis是个[开源项目](https://github.com/redis/redis)，它在[主页](https://redis.io/download)上提供了从源码编译的安装方法。

# windows

如果是在windows上使用redis，有以下几种安装方法：

## [微软官方移植版](https://github.com/microsoftarchive/redis)

这个项目很老了，最新支持的redis版本才到3.0.504，并且项目也在2年前就停止维护了，不建议使用这个。

## [社区移植版](https://github.com/tporadowski/redis)

在微软官方放弃后，社区接过了移植的重担，目前支持到了redis 5.0.10。

如果想1分钟内搞定，可以直接使用这个版本。

## [Memurai](https://www.memurai.com/)

Memurai是一个兼容redis的内存数据库，安装很友好简单。

但如果你把它用到发布环境，那你一定会遇上某天它的服务突然中止的问题。

原因出在[这里](https://www.memurai.com/faq#what-are-the-limitations-of-the-developer-edition?)。

它终归是个商业软件，要卖钱的。开发版会每10天自动停止服务。

## [WSL](https://redislabs.com/blog/redis-on-windows-10/)

[安装Windows Subsystem Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10)很简单，照着微软文档撸下来就行了。

注意[在Windows Server下的安装方法](https://docs.microsoft.com/en-us/windows/wsl/install-on-server)与win10不一样。

## [docker](https://hub.docker.com/_/redis)

docker在部署方面是真神器，对docker的[安装](https://docs.docker.com/docker-for-windows/install/)就不在这里介绍下，只介绍如何在docker下安装redis。

首先是拉取镜像。
```bash
docker pull redis
```

然后使用redis的镜像运行起一个容器。
```bash
docker run --name redis -d -p 127.0.0.1:6379:6379/tcp redis 
```

**安装完成**

还差最后一步，把redis加入自启动。

```bash
docker update --restart unless-stopped redis
```

**阿里云ECS Windows Server版请注意**

阿里云ECS的Windows Server是无法开启Hyper-V的，也就无法使用Linux containers，只能使用Windows containers。

但redis镜像只支持Linux containers，所以…… 等阿里云更新解决方案吧。

### redis-cli

如果想使用redis-cli，可以直接用容器里的：
```bash
docker exec -it redis redis-cli
```

写一个批处理`redis-cli.bat`放在`%PATH%`下面，可以避免每次都输入这一大堆。
```bash
@echo off
docker exec -it redis redis-cli %*
```

如果不想从容器里运行想用本地的，那可以使用npm上的[redis-cli](https://github.com/lujiajing1126/redis-cli)。

```bash
$ npm install -g redis-cli
// ...

$ rdcli
// which is default connect to 127.0.0.1:6379
$ rdcli -h 10.4.23.235
// which will connect to 10.4.23.235
$ rdcli -c
// works in cluster mode, which will follow cluster redirection
```
