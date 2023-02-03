---
title: 在sh中操作特殊字符的文件夹
date: 2023-02-03 16:21:51
tags:
description: 使用shell登录服务器后，面对多媒体文件中的各种奇怪字符经常会无从下手，记录一下解法。
---
最简单的解法就是用[awk](https://www.geeksforgeeks.org/awk-command-unixlinux-examples/)。

比如这个例子：
```sh
$ ls
live mp4 电视剧 电影 动漫
$ ls | awk 'NR==3'
电视剧
$ cd "`ls | awk 'NR==3'`"
电视剧 $
```

想操作第几个，就用awk截取ls结果。
```sh
cd "`ls | awk 'NR==3'`"
```
