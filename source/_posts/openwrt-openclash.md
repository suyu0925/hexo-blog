---
title: "[OpenWrt]使用OpenClash科学上网"
date: 2022-07-25 15:46:56
tags:
- openwrt
description: 可以说软路由最重要的作用就是科学上网了，在OpenWrt的科学上网工具中，最喜欢的还是OpenClash。
---
[OpenClash](https://github.com/vernesong/OpenClash)几乎支持了所有协议，并且配置也很全面。

## 下载

首先手动下载`.ipk`包文件。截止这篇文章，最新版本为[v0.45.35-beta](https://github.com/vernesong/OpenClash/releases/tag/v0.45.35-beta)。

```bash
wget -O luci-app-openclash.ipk https://github.com/vernesong/OpenClash/releases/download/v0.45.35-beta/luci-app-openclash_0.45.35-beta_all.ipk
```

如果在OpenWrt中无法下载，那么可在宿主机通过代理下载后再拷贝上去。

```bash
scp ./luci-app-openclash.ipk root@192.168.56.2:/root/
```

## 安装

```bash
opkg update
opkg install ./luci-app-openclash.ipk
```

## 配置

### 内核

内核是没有放在`ipk`包中的，所以初次使用时需要下载内核。

{% asset_img "openclash-core-config.png" "内核" %}

内核的下载地址是github仓库，github会间歇性的抽风，当抽风时无法在控制台下载。

```log
2022-07-25 07:26:34 【Dev】版本内核更新失败，请确认设备闪存空间足够后再试！
2022-07-25 07:26:34 【Dev】版本内核下载成功，开始更新...
2022-07-25 07:26:04 【Dev】版本内核正在下载，如下载失败请尝试手动下载并上传...
2022-07-25 07:23:56 警告：OpenClash 目前处于未启用状态，请从插件页面启动本插件，脚本退出...
```

不要被日志中的`请确认设备闪存空间足够后再试`骗了，其实是网络错误而不是闪存空间不足。

这时需要像下载`ipk`那样，手动下载再上传到OpenWrt上。

```bash
wget -O clash-linux-amd64.tar.gz https://github.com/vernesong/OpenClash/releases/download/Clash/clash-linux-amd64.tar.gz
scp clash-linux-amd64.tar.gz root@192.168.56.2:/etc/openclash/core
```

内核下载地址
- [Dev 内核](https://github.com/vernesong/OpenClash/releases/tag/Clash)
- [Tun 内核](https://github.com/vernesong/OpenClash/releases/tag/TUN-Premium)
- [Tun 游戏内核](https://github.com/vernesong/OpenClash/releases/tag/TUN)

上传完后，在OpenWrt中解压。

```bash
cd /etc/openclash/core
tar -zxvf clash-linux-amd64.tar.gz
rm clash-linux-amd64.tar.gz
```

下载Dev内核并应用后，就可以配置好代理，之后使用控制台来更新内核了。

**UDP**

如果要玩游戏，需要UDP连接，必须切换至TUN或混合模式。

比如原神就需要UDP连接，如果使用增强模式会进入游戏后会白屏然后连接超时，需要切换到TUN或混合模式以支持UDP连接。

### 订阅

如果使用的是[justmysocks](https://justmysocks5.net)机场的订阅链接，必须使用订阅转换服务，否则将不能识别订阅配置。使用默认的`api.dler.io(默认)`即可。

{% asset_img "openclash-subscribe.png" "订阅转换" %}

有时候订阅服务器会出问题，可以试着使用其它备用订阅转换网站的转换网址。

- ACL4SSR 订阅转换

  比较知名的规则转换网站。

  https://acl4ssr-sub.github.io/

- つつの订阅转换 · 鲸歌

  TAG 机场合作的订阅转换网站。

  https://sub.tsutsu.one/

### 仪表盘

如果订阅链接没有问题，此时应该一切正常。

{% asset_img "openclash-overview.png" "仪表盘" %}

可以打开`Dashboard控制面板`去仪表盘进行策略配置了。
