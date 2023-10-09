---
title: 介绍一下alist
date: 2023-10-09 14:15:28
tags: 
- 善用佳软
description: 推荐一款NAS工具：alist，它可以接入各种云盘作为存储，再以文件列表的形式向外提供服务。
---
[AList](https://alist.nn.ci/zh/)是一款[开源](https://github.com/alist-org/alist)工具，它的官方介绍是：🗂️ 一个支持多存储的文件列表/WebDAV程序，使用 Gin 和 Solidjs。

它的作用是，接入各种存储（如本地存储、阿里云盘、115、OneDrive等），再以文件列表的形式向外提供服务（包括http和WebDAV）。

## 安装

最简单的安装方式仍然是[使用docker](https://alist.nn.ci/zh/guide/install/docker.html)：
```yml
version: '3.3'
services:
    alist:
        restart: always
        volumes:
            - './alist:/opt/alist/data'
        ports:
            - '127.0.0.1:5244:5244'
        environment:
            - PUID=0
            - PGID=0
            - UMASK=022
        container_name: alist
        image: 'xhofe/alist:latest'
```
注意在这个例子中指定了`127.0.0.1:5244`，将使用权限限制在了本地。

## 运行

直接使用docker compose启动：
```bash
docker compose up -d
```

然后打开url：http://localhost:5244/，就可以看到alist的界面了。

默认管理员账号为`admin`，密码需要[在命令行中重置或设置](https://alist.nn.ci/zh/guide/install/docker.html#%E6%9F%A5%E7%9C%8B%E7%AE%A1%E7%90%86%E5%91%98%E4%BF%A1%E6%81%AF)：
```bash
> docker exec -it alist ./alist admin random
INFO[2023-10-09 06:22:43] reading config file: data/config.json
INFO[2023-10-09 06:22:43] load config from env with prefix: ALIST_
INFO[2023-10-09 06:22:43] init logrus...
INFO[2023-10-09 06:22:43] admin user has been updated:
INFO[2023-10-09 06:22:43] username: admin
INFO[2023-10-09 06:22:43] password: RcbIZl5k
```

## 添加存储

添加存储的方式有很多，比如：
- [本地存储](https://alist.nn.ci/zh/guide/drivers/local.html)
- [阿里云盘Open](https://alist.nn.ci/zh/guide/drivers/aliyundrive_open.html)
- [OneDrive](https://alist.nn.ci/zh/guide/drivers/onedrive.html)
- [115网盘](https://alist.nn.ci/zh/guide/drivers/115.html)

按照对应的文档说明添加即可。

## 连接WebDAV

### windows网络位置

windows内置了webdav支持。

访问webdav方法：
- 右键`此电脑`
- 选择`添加一个网络位置`
- 一路下一步，在`你想在哪儿创建这个网络位置？`提问时，`选择自定义网络位置`
- 在`Internet 地址或网络地址(A):`填写alist的webdav网址：`http://localhost:5244/dav`
- 输入账号admin和密码
- 命名该网络位置，如alist
- 完成，可在`此电脑`里的`网络位置`分栏访问alist文件夹

**打开http支持**

**注意**，windows默认只支持https协议下的WebDAV。所以上面的操作会在填写alist的webdav地址后报错，提示`输入的文件夹似乎无效，请选择另一个`。

这时需要打开http的支持。

配置在注册表中，修改`\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\WebClient\Parameters`中的`BasicAuthLevel`，将值从`1`改为`2`。

修改完后，在`services.msc`服务中重新启动`WebClient`来让新配置生效。

### rclone

也可使用[rclone](https://rclone.org/)，这里有介绍：{% post_link rclone "介绍一下rclone" %}。
