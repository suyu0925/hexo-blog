---
title: 搞懂文件链接
date: 2024-05-30 11:23:02
tags:
description: 在开发中经常会碰到文件链接，但从来没搞懂过，这里做个总结。
---

文件链接（file link）是文件系统中的一个重要概念，它是指一个文件指向另一个文件的引用。

## 好处

它的好处在于：

- 节省空间：链接并不复制文件内容，而是指向原始文件的路径。比如 pnpm 使用了[硬链接](https://github.com/orgs/pnpm/discussions/6800)，可以[节省大量的磁盘空间](https://pnpm.io/motivation#saving-disk-space)。
- 方便管理：链接可以简化文件管理，比如`/bin/sh`就是一个指向真正使用的 shell 的软链接。
- 便于共享：多个用户可以通过链接访问同一个文件。
- 灵活性：链接可以链接到文件或目录，允许用户以不同的方式组织和访问数据。

## 种类

### Unix-Like

在 Unix-Like 系统中，文件链接通常有两种：

- 硬链接（hard link）
- 符号链接（symbolic link），也被称做软链接（soft link）

硬链接和符号链接都使用[ln](https://ss64.com/bash/ln.html)命令创建：

```sh
$ ln file1.txt link1  # 创建一个硬链接 link1 指向 file1.txt
$ rm file1.txt        # 删除原始文件 file1.txt 后，使用 link1 仍然可以访问文件内容

$ ln -s /some/name            # 创建一个符号链接 ./name 指向 /some/name
$ ln -s /some/name mylink2    # 给创建的符号链接取名 mylink2

$ ln -s /home/simon/demo /home/jules/mylink3   # 创建一个符号链接 mylink3 指定 demo

$ ln -s item1 item2 ..        # creates links ../item1 and ../item2 pointing to ./item1 and ./item2
```

硬链接和符号链接的根本区别在于，硬链接与原始文件共享相同的[inode](https://zh.wikipedia.org/wiki/Inode)（使用`ls -li`查看，第 1 列代表 inode 序号，第 2 列代表硬链接数）。可以认为硬链接和原始文件除了名称其它信息都一样，我们也可以反过来将原始文件看作是硬链接文件的硬链接。

除此之外，软链接还支持目录，以及指向不存在的源。

### windows NTFS

在 windows NTFS 中，硬链接和符号链接和 Unix-Like 基本一致，额外增加了一种链接形式：

- 硬链接：无法跨磁盘创建
- 软链接：支持远程 SMB 网络路径
- 目录交叉点（directory junction）：不支持相对路径

所有的文件链接都使用[内部命令](https://ss64.com/nt/syntax-internal.html)[mklink](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mklink)创建：

```powershell
cmd /c mklink /d AllUsers "c:\Users\All Users"
cmd /c mklink /j AllUsers "c:\Users\All Users"
cmd /c mklink /h MyFile.file "c:\Users\All Users\"
cmd /c rd \MyFolder
cmd /c del \MyFile.file
```

关于软链接和目录交叉点更细节的区别，可以参考[这篇回答](https://superuser.com/a/1291446/1264950)和[这篇文章](https://www.2brightsparks.com/resources/articles/NTFS-Hard-Links-Junctions-and-Symbolic-Links.pdf)。

### windows 快捷方式（[Shell Links](https://learn.microsoft.com/en-us/windows/win32/shell/links)）

快捷方式仍然是一个文件，有对应的数据和大小，.LNK 的具体格式可以看[这里](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-shllink/16cb4ca1-9339-4d0c-a68d-bf1d6cc0f943)。

当我们运行一个快捷方式时，本质上是将快捷方式的属性传达给资源管理器，由后者负责检索并打开引用对象。引用对象可以是文件、目录或 URI（[URL Scheme 查询指南](https://sspai.com/post/66334)）。

扩展阅读可以看看这篇少数派的文章：[心之所想、一键直达：你可能不知道的 Windows 快捷方式玩法](https://sspai.com/post/68718)。
