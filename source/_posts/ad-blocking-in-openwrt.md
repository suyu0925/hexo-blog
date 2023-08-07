---
title: "[Openwrt]拦截广告"
date: 2023-08-07 14:27:08
tags:
- openwrt
description: 做为路由器，拦截广告是必备功能。
---
做为路由器，拦截广告是必备功能。OpenWrt官网就有[Ad blocking](https://openwrt.org/docs/guide-user/services/ad-blocking)功能的说明。

官方推荐了4个软件包：
- [adblock](https://github.com/openwrt/packages/blob/master/net/adblock/files/README.md)
  最主流的广告拦截工具
- [simple-adblock](https://docs.openwrt.melmac.net/simple-adblock/)
  相对来说，比adblock更"simple"。
- [adguardhome](https://openwrt.org/docs/guide-user/services/dns/adguard-home)
  作为一个DNS解析服务运行，也可以用来拦截广告。
- banhostlist
  无视，从2015年开始就停止维护。

这4个软件包都在`opkg list`中，以安装adblock为例。

```sh
# Install packages
opkg update
opkg install adblock

# Provide web interface and i18n-zh-cn
opkg install luci-app-adblock 
opkg install luci-i18n-adblock-zh-cn
 
# Backup the blocklists
uci set adblock.global.adb_backupdir="/etc/adblock"
 
# Save and apply
uci commit adblock
/etc/init.d/adblock restart
```

安装完后adblock就已经在工作了。默认会使用几个比较小的[拦截源](https://github.com/openwrt/packages/blob/master/net/adblock/files/README.md#main-features)，可以根据自己的需求继续勾选，比如[oisd_full](https://oisd.nl/)和[reg_cn](https://easylist.to/)。

[AdguardHome](https://github.com/AdguardTeam/AdguardHome)是很强大的工具，但配置比较麻烦，官方没有做luci-app，而民间做的[luci-app-adguardhome](https://github.com/rufengsuixing/luci-app-adguardhome)又停止维护了，所以不做推荐。
