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

可使用listremotes来查看添加的远程目录：
```bash
> rclone listremotes
alist:
```

也可以使用命令行参数[--config](https://rclone.org/docs/#config-config-file)来指定配置文件：`rclone listremotes --config ./config/rclone.conf`。

## 使用docker

在当前目录创建一个`config`目录，将`rclone.conf`放到这个目录下。

再创建一个`test`目录用来测试。

最后运行：
```bash
docker run --network host --rm -v "$(pwd)/config:/config/rclone" -v "$(pwd)/test:/test" rclone/rclone copy alist:/test /test -v
```

## 同步

最主要的命令就是`copy`和`sync`，它们的作用都是将源目录同步到目标目录，区别在于`copy`不会删除目标目录中的文件，而`sync`会删除目标目录中的文件。

```bash
./rclone copy alist:/test ./test
```

不论是copy还是sync，都会在传输文件前根据文件修改日期、大小和checksum来判断是否有变动，避免无谓的传输。

## 实时同步

rclone mount虽然可以用来双向同步，但[相比sync/copy](https://rclone.org/commands/rclone_mount/#read-only-mounts)它远远更不可靠。原因是sync/copy会有失败后重试机制，而mount是没有的。

所以如果对可靠性有要求，最好还是自己使用crontab来定时运行sync/copy，crontab的用法可以参考这篇博文：{% post_link cron-in-docker "在docker里使用cron" %}。

## 挂载

在使用Jellyfin时，需要将远程源挂载为本地文件夹，Jellyfin才能使用。需要用到[rclone mount](https://rclone.org/commands/rclone_mount)命令。

挂载后，对文件的修改是会双向同步的，但会有很大的延迟（可能与缓存有关）。可使用[--read-only](https://rclone.org/commands/rclone_mount/#read-only-mounts)进行只读挂载，在只读挂载模式下，对文件的修改会**静默失败**。

### [VFS 虚拟文件系统](https://rclone.org/commands/rclone_mount/#vfs-virtual-file-system)

在使用[rclone mount](https://rclone.org/commands/rclone_mount)命令时，会使用VFS层。

**缓存**

默认是[关闭缓存](https://rclone.org/commands/rclone_mount/#vfs-file-caching)的，这样访问远程会极慢，所以在使用mount时要开启缓存。

比较关键的参数就两个：
```
--vfs-cache-mode CacheMode             Cache mode off|minimal|writes|full (default off)
--vfs-cache-max-size SizeSuffix        Max total size of objects in the cache (default off)
```

通常会设置为`--vfs-cache-mode full --vfs-cache-max-size 1G`。

### [windows](https://rclone.org/commands/rclone_mount/#mounting-modes-on-windows)

**安装**

在windows下要使用挂载功能，需要安装[WinFsp](http://www.secfs.net/winfsp/)。它创建了一个模拟FUSE层，rclone通过[cgofuse](https://github.com/winfsp/cgofuse)使用这个层。

在windows下，可以使用`--network-mode`参数来挂载成网络位置。
```bash
rclone mount alist:/test X: --network-mode --vfs-cache-mode full --vfs-cache-max-size 1G
```

**出错**

使用docker进行mount，需要加上`--device /dev/fuse --cap-add SYS_ADMIN --security-opt apparmor:unconfined`参数。
但不知道为何，容器对`/test`的修改没有同步给宿主。
留个坑吧。
```bash
docker run --network host --rm -v "$(pwd)/config:/config/rclone" -v "$(pwd)/test:/test:shared" --privileged --device /dev/fuse --cap-add SYS_ADMIN --security-opt apparmor:unconfined rclone/rclone mount alist:/test /test/mount --vfs-cache-mode full --vfs-cache-max-size 1G -vv
```

## 常用高级选项

长求总：
```bash
rclone copy alist:/test ./test --timeout 60m --transfers 2 --buffer-size 256M --use-mmap -v
```

### [timeout 超时](https://rclone.org/docs/#timeout-time)

rclone默认是5分钟超时，在传输大文件时很容易超时，所以一般会指定一个更长的超时时间：
```bash
rclone copy alist:/test ./test --timeout 60m
```

### [transfers 并行传输文件数](https://rclone.org/docs/#transfers-n)

rclone默认是4个文件并行传输。并行数越多，速度会越快，但对带宽和远程存储服务的响应速度也要求越高。通常错误率也会随之提高。

如果使用的远程存储服务响应较快，可以把这个值设置得大一些，比如自建的WebDAV、阿里云盘Open。
如果使用的远程存储服务是国内的抠门网盘，像115、百度等，可以设得小一点，比如2。如果使用高并行数，文件传输错误率会非常高。

```bash
rclone copy alist:/test ./test --transfers 2
```

### [buffer-size 缓存大小](https://rclone.org/docs/#buffer-size-size)

为了加速文件传输，可以使用缓存。注意这个缓存是每一个transfer都会使用一份。

rclone默认是不使用缓存来减少内存使用量，如果内存不紧张，建议给个256M，rclone默认的[文件分段大小](https://rclone.org/docs/#multi-thread-cutoff)就是256M。

搭配[use-mmap](https://rclone.org/docs/#use-mmap)来增加缓存释放的积极性，否则在上传超大文件夹时容易爆内存。

```bash
rclone copy alist:/test ./test --buffer-size 256M --use-mmap
```

### [输出详细日志](https://rclone.org/docs/#v-vv-verbose)

使用`-v`来输出详细日志，`-vv`变身唠叨狂魔。

### [HTTP头](https://rclone.org/docs/#header)

有些远程源需要设置HTTP头。

比如阿里云盘，它会根据Referer头来判断是否跨域，如果从阿里云盘上拉取文件，需要加上`--header "Referer:"`参数：
```bash
rclone mount alist:/aliyun/resource ./resource --cache-dir ./cache --vfs-cache-mode full --vfs-cache-max-size 1G --header "Referer:"
```
