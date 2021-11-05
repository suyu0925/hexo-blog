---
title: 修复Visual Studio Installer下载慢的问题
date: 2021-02-22 10:55:56
tags:
description: 在使用国外公司开发的软件，经常会出现网络问题，连微软都不例外。
---
微软在更新Visual Studio时，使用的是`download.visualstudio.microsoft.com`这个域名。

微软作为全球第一大操作系统的开发商，理应在网络方面毫无神奇的是，国内经常会对这个域名解析错误。

## 分析
我们可以先ping一下，看看使用运营商的默认DNS服务器会解析成什么ip。

```bash
> ping download.visualstudio.microsoft.com

正在 Ping download.visualstudio.microsoft.com [192.229.232.200] 具有 32 字节的数据:
来自 192.229.232.200 的回复: 字节=32 时间=198ms TTL=51
来自 192.229.232.200 的回复: 字节=32 时间=204ms TTL=51
来自 192.229.232.200 的回复: 字节=32 时间=202ms TTL=51
请求超时。
```

在[ip138](https://ip138.com/)或[ipip](https://www.ipip.net/ip.html)查询可知`192.229.232.200`这个ip属于亚太地区，并不在国内，所以连接速度才会那么慢。

## 查询dns
我们需要查询到`download.visualstudio.microsoft.com`在大陆的ip，祭出神器：[站长工具dns查询](https://tool.chinaz.com/dns/)。

{% asset_img "chinaz_dns.png" "站长工具dns查询" %}

可以看到微软在大陆是有节点的：
`湖南[联通]  112.91.133.72   [广东省汕头市 联通]`

## 操作
修改c:\Windows\System32\drivers\etc\hosts，完工。

## 后话
这套操作可以适用于任何在大陆有节点但DNS解析到海外的所有问题。
