---
title: 下载iCloud相册
date: 2023-10-25 16:15:13
tags:
- 生活
description: 之前有介绍过怎么导出Google相册，而iCloud相册的导出官方没有额外支持，只能使用iTunes同步。这里介绍一种使用程序自动同步iCloud相册的方法。
---
使用[docker-icloudpd](https://github.com/boredazfcuk/docker-icloudpd)同步。文档在[这里](https://github.com/boredazfcuk/docker-icloudpd/blob/master/README.md)。

## 准备工作

首先需要创建一个docker网络：
```powershell
docker network create `
   --driver=bridge `
   --subnet=192.168.115.0/24 `
   --gateway=192.168.115.254 `
   --opt com.docker.network.bridge.name=icloudpd_br0 `
   icloudpd_bridge
```

然后创建两个文件夹，config和icloud，分别用于存放配置文件和同步下来的相册。

如果有多个账号需要同步，可以启动多个容器，每个容器使用不同的config和icloud文件夹。
假如用户名为alice，文件夹可以设为config_alice和icloud_alice，之后都以alice为例。

## 运行容器

```powershell
docker run `
   --name icloudpd_alice `
   --hostname icloudpd_alice `
   --network icloudpd_bridge `
   --restart=always `
   --env TZ=Asia/Shanghai `
   --volume "$(pwd)/config_alice:/config" `
   --volume "$(pwd)/icloud_alice:/home/alice/iCloud" `
   boredazfcuk/icloudpd
```

这里直接指定了环境变量`TZ`，`TZ`的取值可以在[https://nodatime.org/TimeZones](https://nodatime.org/TimeZones)查看。

容器中的`/config`目录为配置目录，`/home/$(user)/iCloud`目录为下载目录，`$(user)`取值为`/config/config.cnf`配置中的`user`项。

**注意**，`user`要有访问`$(pwd)/icloud_alice`和`$(pwd)/icloud_alice`的权限。

比如在linux下，不要挂载到`/root/`目录下，容易出现权限问题。

## 配置

在运行容器后，会因为没有设置`apple_id`而挂起。此时在`$(pwd)/config_alice/`目录下会产生`config.cnf`配置文件，我们需要先修改配置。

**user**: 将`user`改为alice。注意默认的`user_id`和`group_id`都为1000：第一个普通用户。

**apple_id**: 将`apple_id`改为你的Apple ID。

**icloud_china**: 如果使用国内网络，需要设为true，使用`icloud.com.cn`，不然苹果会将`icloud.com`重定义到`icloud.com.cn`引起混乱。
**auth_china**: 如果使用国内网络，需要设为true，使用`icloud.com.cn`，不然苹果会将`icloud.com`重定义到`icloud.com.cn`引起混乱。

其余配置参见[文档](https://github.com/boredazfcuk/docker-icloudpd/blob/master/CONFIGURATION.md)。

## 初始化/登录

运行初始化命令：
```sh
docker exec -it icloudpd_alice sync-icloud.sh --Initialise
```

根据命令行显示的提示，输入登录密码和**2次**两步认证码。输完第1次验证码后，点确认将框取消，准备

## 完成

此时容器会自动开始同步，可以通过`docker logs icloudpd_alice -n 10 -f`查看同步进度。

默认同步周期为每24小时同步一次，这个时间间隔不要配置成小于12小时，会触发苹果限流。

## 登录过期

保持的登录信息有效期是90天，可以在`$(pwd)/config_alice/DAYS_REMAINING`文件查看剩余天数。

默认提前7天会每天发通知，需要在配置文件里设置通知`notification_type`类型。
