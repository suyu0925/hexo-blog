---
title: 介绍一下rclone
date: 2023-10-09 14:41:26
tags: 
- 善用佳软
description: 推荐一款可用来同步云存储的命令行工具：rclone。
---
[rclone](https://rclone.org/)是一款[开源的](https://github.com/rclone/rclone)基于命令行的同步和备份工具，它支持将本地文件系统与远程云存储服务（如Google Drive、OneDrive、Dropbox等）连接起来，实现文件的上传、下载、同步和备份。它不仅支持云存储服务，还可以连接FTP、SFTP、WebDAV等各种类型的存储服务。具有丰富的功能和高度可定制化的选项，例如文件加密、数据压缩、多线程传输等。

## 安装

rclone就是一个可执行文件，参见官方[安装文档](https://rclone.org/install/)。

## 配置

在windows下运行`.\rclone.exe config`，生成的配置文件会在`%APPDATA%/rclone/rclone.conf`，一个配置文件示例：
```ini
[alist]
type = webdav
url = http://localhost:5244/dav/
vendor = other
user = admin
pass = tScRc3AI1CV-5QUCAb2Ed2gos-ZB-7mT
```

在linux的话，生成的配置文件在`~/.config/rclone/rclone.conf`。

## 同步

最主要的命令就是`copy`和`sync`，它们的作用都是将源目录同步到目标目录，区别在于`copy`不会删除目标目录中的文件，而`sync`会删除目标目录中的文件。

```bash
./rclone copy alist:/test ./test
```

不论是copy还是sync，都会在传输文件前根据文件修改日期、大小和checksum来判断是否有变动，避免无谓的传输。

## 实时同步

rclone不支持监控远程文件存储的变化，所以无法实现实时同步。

如果有持续同步的需求，只能自己使用crontab来定时运行，crontab的用法可以参考这篇博文：{% post_link cron-in-docker "在docker里使用cron" %}。
