---
title: 介绍一下photoprism
date: 2023-10-10 15:55:30
tags:
- 善用佳软
description: 照片云服务的存储总是容易爆，介绍一下自建的照片管理软件photoprism。
---
[photoprism](https://www.photoprism.app/)在{% post_link personal-photos-management 个人照片管理 %}中有提到过，这里再详细介绍一下。

## 安装

一惯的，[使用docker](https://docs.photoprism.app/getting-started/docker-compose/)安装。

直接使用官方的[docker-compose.yml](https://dl.photoprism.app/docker/docker-compose.yml)就好。注意要修改这几个点：

- 管理员密码
```yml
services:
  photoprism:
    environment:
      PHOTOPRISM_ADMIN_PASSWORD: "insecure"          # initial admin password (8-72 characters)
```
一般photoprism是要向外网公开的，所以这里的密码最好设置得复杂一点，不要用默认密码`insecure`。

- originals
```yml
services:
  photoprism:
    volumes:
      - "~/Pictures:/photoprism/originals"
```
[originals](https://docs.photoprism.app/getting-started/docker-compose/#photoprismoriginals)用来存放照片和视频源文件。photoprism会将导入的文件，按照一定的结构保存到`/photoprism/originals`目录。

- storage
```yml
services:
  photoprism:
    volumes:
      - "./storage:/photoprism/storage"
```
[storage](https://docs.photoprism.app/getting-started/docker-compose/#photoprismstorage)存放的是photoprism的配置、缓存、缩略图和边车文件。一定要mount在[本地SSD硬盘](https://docs.photoprism.app/getting-started/troubleshooting/performance/#storage)，否则频繁性能太差。
只要妥善保存好storage目录，就可以放心的重启和升级photoprism容器。

- import
```yml
services:
  photoprism:
    volumes:
      - "/mnt/media/usb:/photoprism/import"
```
[import](https://docs.photoprism.app/getting-started/docker-compose/#photoprismimport)用来导入照片。

## 运行

直接`docker compose up -d`即可。

注意photoprism在docker下的[最小硬件需求](https://docs.photoprism.app/getting-started/#system-requirements)为2核，4G内存。

## [更新](https://docs.photoprism.app/getting-started/updates/)

```bash
docker compose pull
docker compose stop
docker compose up -d
```

## 源

photoprism[支持WebDAV](https://docs.photoprism.app/user-guide/sync/webdav/)的导入和导出。

但它[只支持定时同步](https://docs.photoprism.app/user-guide/settings/sync/#remote-sync-options)，有时可能不满足要求。

我们可以使用{% post_link rclone rclone %}来将WebDAV源同步到import，这样更灵活。
