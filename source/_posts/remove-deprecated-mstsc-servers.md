---
title: 删除远程桌面连接记录
date: 2022-10-08 01:36:37
tags:
- windows
description: 最近在验证阿里云的Windows Server，创建了好多临时服务器，导致远程桌面连接产生了一大堆无用的记录，记录一下删除的方法。
---
## 默认的远程连接

{% asset_img "Default.rdp.png" "默认的远程连接" %}

`%USERPROFILE%\Documents\Default.rdp`这里保存着最近一次登录的远程连接，可以不用管。

## 服务器列表

服务器列表保存在注册表的`计算机\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Terminal Server Client\Default`下。

{% asset_img "server-list.png" "服务器列表" %}

不需要哪个直接删除哪个就好。

后面的`MRU0`，`MRU1`的0和1这些序号可以不用管，在成功登录一次后会被重新排序。

## 最近使用

{% asset_img "recent.png" "最近使用" %}

远程桌面连接应用的最近使用记录则需要手动删除。
