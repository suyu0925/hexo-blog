---
title: linux磁盘命令速查表
date: 2024-05-27 16:01:25
tags:
- linux
description: 在服务上经常要看一些磁盘相关的信息，这里整理了一些常用的磁盘命令，方便查阅。
---
## df

[df](https://linuxcommand.org/lc3_man_pages/df1.html)是查看磁盘使用信息的命令，可以查看磁盘的总容量、已用容量、可用容量和挂载点等信息。

```sh
df -h
```

可以按照Avail字段进行排序，把可用空间最小的磁盘放在前面：

```sh
(df -h | head -n 1) && (df -h | tail -n +2 | sort -k 4 -h)
```

## du

[du](https://man7.org/linux/man-pages/man1/du.1.html)是查看目录大小的命令，可以查看目录的总大小、子目录大小和文件大小等信息。

查看当前目录下占用空间最多的前10个子目录：

```sh
du -hs * | sort -hr | head -n 10
```

也可以用`--max-depth`指定深度：

```sh
du -h --max-depth=2 | sort -hr
```
