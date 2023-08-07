---
title: "[Openwrt]显示CPU温度"
date: 2023-08-07 11:10:59
tags:
- openwrt
description: 夏天来了，感觉网络开始不稳，猜测是路由器温度过高。默认OpenWrt没有显示CPU温度，研究一下。
---
## luci_app_statistics
OpenWrt官方提供了[luci_app_statistics](https://openwrt.org/docs/guide-user/luci/luci_app_statistics)来收集和统计系统信息。

它使用了插件机制，默认安装以下插件：
```sh
> opkg install luci-app-statistics
...
...
...
Configuring librrd1.
Configuring rrdtool1.
Configuring collectd-mod-rrdtool.
Configuring collectd-mod-iwinfo.
Configuring collectd-mod-cpu.
Configuring collectd-mod-memory.
Configuring collectd-mod-interface.
Configuring collectd-mod-load.
Configuring collectd-mod-network.
Configuring luci-app-statistics.
```

里面没有CPU温度，可以用这个命令查看更多插件：
```sh
> opkg list | grep collectd-mod
...
...
...
collectd-mod-thermal - 5.12.0-10 - system temperatures input plugin
collectd-mod-threshold - 5.12.0-10 - Notifications and thresholds plugin
collectd-mod-unixsock - 5.12.0-10 - unix socket output plugin
collectd-mod-uptime - 5.12.0-10 - uptime status input plugin
collectd-mod-users - 5.12.0-10 - user logged in status input plugin
collectd-mod-vmem - 5.12.0-10 - virtual memory usage input plugin
collectd-mod-wireless - 5.12.0-10 - wireless status input plugin
collectd-mod-write-graphite - 5.12.0-10 - Carbon/Graphite output plugin
collectd-mod-write-http - 5.12.0-10 - HTTP POST output plugin
```
其中的`collectd-mod-thermal`就是我们需要的温度了。

安装`collectd-mod-thermal`后在设置中打开即可。
{% asset_img statistics.png %}


## luci-app-temp-status
还有一个选择是使用[luci-app-temp-status](https://github.com/gSpotx2f/luci-app-temp-status)。

它功能更纯粹，就是在状态概览页面显示温度，不会收集其他信息。
{% asset_img luci-app-temp-status.png %}
