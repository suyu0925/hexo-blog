---
title: "[Openwrt]使用aria2"
date: 2022-07-26 14:13:48
tags:
- openwrt
description: OpenWrt除了路由功能外，因为它24小时开着，所以用来下载也不错。
---
## 安装

aria2包括三部分：
- 内核: aria2
- web控制台: ariang
- luci页面: luci-app-aria2。中文语言包，luci-i18n-aria2-zh-cn。

```bash
opkg install aria2
opkg install ariang
opkg install luci-app-aria2
opkg install luci-i18n-aria2-zh-cn
```

## 启用服务

在去控制台启用aria2服务之前，要先确定下载目录存在并且aria2用户有写入权限。

{% asset_img "openwrt-aria2.png" "启用服务" %}

假设下载目录为`/root/aria2`，我们需要先

```bash
mkdir /root/aria2
chmod -R 777 /root/aria2
```

才可以启用aria2，保存并应用，等待并检查aria2服务是否正确启用。

## 设置

在使用aria2下载磁力链接前，先设置初始BitTorrent Trackers。

使用[trackers_best_ip.txt](https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best_ip.txt)，注意要将2个换行符替换成`,`来适配语法。

{% asset_img "openwrt-aria2-bt-trackers" "BitTorrent Trackers" %}

## 内网穿透

如果想用内网穿透访问AriaNg页面，默认是无法访问的。

原因是默认的Aria2 RPC地址是`http://luci.domain.com:6800/jsonrpc`，注意里面的`:6800`。

内网穿透一般不支持80或443之外的端口，需要修改两个地方：

1. frpc
在frpc添加
```ini
[ariang]
type = http
local_ip = 192.168.8.1
local_port = 6800
custom_domains = aria2.domain.com
```

2. AriaNg
在AriaNg的`AriaNg设置`中，修改RPC的地址为`http://aria2.domain.com:80/jsonrpc`。
