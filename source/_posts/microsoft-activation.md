---
title: 微软家产品的激活
date: 2023-11-06 10:36:31
tags:
- 善用佳软
description: 几乎没有个人用户会去购买正版Windows和Office，再看一看如何激活吧。
---
## vlmcsd

在{% post_link openwrt-kms-server 之前的文章 %}中，我们介绍过使用OpenWrt中的[openwrt-vlmcsd](https://github.com/cokebar/openwrt-vlmcsd)来搭配自己的kms服务器，实现kms激活。

openwrt-vlmcsd是基于[vlmcsd](https://github.com/Wind4/vlmcsd)开发的，这个项目源自[My Digital Life社区的一篇帖子](forums.mydigitallife.net/threads/50234)，已经接近停止维护。

## 继任者

因为有了更强大的工具：[Microsoft Activation Scripts (MAS)](https://github.com/massgravel/Microsoft-Activation-Scripts)。

只需要运行一行命令，即可实现微软家产品的激活。
```powershell
irm https://massgrave.dev/get | iex
```

{% asset_img mas.png MAS %}
