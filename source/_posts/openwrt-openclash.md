---
title: "[OpenWrt]使用OpenClash科学上网"
date: 2022-07-25 15:46:56
tags:
  - openwrt
description: 可以说软路由最重要的作用就是科学上网了，在OpenWrt的科学上网工具中，最喜欢的还是OpenClash。
---

[OpenClash](https://github.com/vernesong/OpenClash)几乎支持了所有协议，并且配置也很全面。

## 下载

首先手动下载`.ipk`包文件。截止这篇文章，最新版本为[v0.46.075](https://github.com/vernesong/OpenClash/releases/tag/v0.46.075)。

```bash
wget -O luci-app-openclash.ipk https://github.com/vernesong/OpenClash/releases/download/v0.46.075/luci-app-openclash_0.46.075_all.ipk
```

如果在 OpenWrt 中无法下载，那么可在宿主机通过代理下载后再拷贝上去。

```bash
scp ./luci-app-openclash.ipk root@192.168.88.1:/root/
```

再下载一个[meta 内核](https://github.com/vernesong/OpenClash/tree/core/master/meta)备用。

```bash
wget -O https://raw.githubusercontent.com/vernesong/OpenClash/core/master/meta/clash-linux-amd64.tar.gz clash-linux-amd64.tar.gz
```

## 安装

注意要先[安装依赖](https://github.com/vernesong/OpenClash/wiki/%E5%AE%89%E8%A3%85)。

`luci-app-openclash.ipk`中并没有包含全部依赖，如果缺少依赖会导致各种问题，比如 OpenClash 自身无法使用代理上网。

```bash
opkg update
opkg remove dnsmasq
opkg install luci-compat
opkg install ./luci-app-openclash.ipk
```

openclash 使用了 dnsmasq-full，为了避免冲突，需要先卸载 dnsmasq。
同时，openclash 也依赖 luci 的 cbi 模块，需要先安装 luci-compat。

## 配置

### 内核

[dev 内核](https://github.com/Dreamacro/clash)已经跑路，目前openclash只使用一个meta内核。

如果无法下载，可以将之前下载的meta内核手动上传到`/etc/openclash/core`。

```bash
scp clash-linux-amd64.tar.gz root@192.168.88.1:/etc/openclash/core
tar -zxvf clash-linux-amd64.tar.gz
mv clash clash_meta
rm clash-linux-amd64.tar.gz
```

**UDP**

如果要玩游戏，需要 UDP 连接，必须切换至 TUN 或混合模式。

比如原神就需要 UDP 连接，如果使用增强模式会进入游戏后会白屏然后连接超时，需要切换到 TUN 或混合模式以支持 UDP 连接。

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

如果使用的是[飞鸟机场](https://aff01.fyb-aff01.com/)，也必须使用订阅转换服务，否则在 redir-host 模式下无法解析域名，只能使用 Fake-IP 模式。
可能是因为没有 dns 段：

```yaml
dns:
  enable: true
  ipv6: false
  listen: 0.0.0.0:7874
  enhanced-mode: fake-ip
  default-nameserver:
    - 119.29.29.29
    - 119.28.28.28
    - 1.0.0.1
    - 208.67.222.222
    - 1.2.4.8
  nameserver:
    - https://dns.alidns.com/dns-query
    - https://1.1.1.1/dns-query
    - tls://dns.adguard.com:853
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - "+.*"
```

### 仪表盘

如果订阅链接没有问题，此时应该一切正常。

{% asset_img "openclash-overview.png" "仪表盘" %}

可以打开`Dashboard控制面板`去仪表盘进行策略配置了。

### Fake IP 模式

OpenClash 支持 Redir-Host 和 Fake-IP 两种模式，默认为 Redir-Host 模式。

Fake IP 出自[RFC3089](https://www.rfc-editor.org/rfc/rfc3089)，这个 RFC 定义了一种新的将 TCP 连接封装成 SOCKS 协议的方法。[这里](https://blog.skk.moe/post/what-happend-to-dns-in-proxy/#Zai-redir-x2F-tun2socks-Zhong-Shi-Yong-Fake-IP)有篇文章介绍的比较详细。

它与 Redir-Host 模式的最主要区别是：

1. 客户端发出的 DNS 解析请求会被代理端捕获，然后立即从 Fake IP 池子里取一个 IP 建立映射返回。
2. 客户端发起对这个 Fake IP 的 TCP 连接，又被代理端截获，再返查出域名。
3. 代理端使用 SOCKS 协议封装 TCP 连接和域名。
   整个过程都无需解析 DNS，因此速度会更快。

但它也有几个问题：

- 无法 ping 域名，解析得到的会是内网的 Fake IP
- [windows 会认为没有连接到互联网](https://github.com/vernesong/OpenClash/issues/6)，需要将`\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\NlaSvc\Parameters\Internet`下的[几个域名](https://www.zhihu.com/question/48856675)添加至覆写设置->DNS 设置->Fake-IP-Filter。
- windows 时间同步的 NTP（Network Time Protocol）域名：time.windows.com

如果对性能不是有很强的要求，还是建议使用 Redir-Host 模式。

### 偶尔有部分网址无法连接

偶尔有百度无法连接的情况，此时可将代理模式切换至 Global 模式，再切回 Rule，通常药到病除。只是重启 OpenClash 不行。

可参看这个[Issue](https://github.com/vernesong/OpenClash/issues/31)。

### 自定义规则集

规则集英文是[Rule Provider](https://lancellc.gitbook.io/clash/clash-config-file/rule-provider)，它可以在`config.yml`之外补充一些规则。

比如最近大陆把微软 OneDrive 墙了，那么我们可以在`配置文件管理`中，新增一个类型为 classic 的本地规则：

```
payload:
  # > OneDrive
  - DOMAIN-SUFFIX,onedrive.live.com
```

然后在`规则集与策略组管理`中的`自定义规则集与策略组管理`中使用它：

{% asset_img "use-rule-provider.png" "使用自定义规则集" %}

这样当访问后缀为`onedrive.live.com`的网站时，就会使用代理了。

### geo 数据库订阅

如果在更新 geo 数据库时出错，可能会导致 geo 文件缺乏，openclash 无法启动。此时需要手动下载并上传 geo 数据库的文件。

geo 数据库的文件有好几个，`Country.mmdb`，`GeoSite.dat`，`GeoIP.dat`都在`/etc/openclash/`下。

我们可以在`/usr/share/openclash/`目录下找到对应的更新脚本：`openclash_ipdb.sh`，`openclash_geosite.sh`，`openclash_geoip.sh`，

再在更新脚本中找到下载地址：`https://raw.githubusercontent.com/alecthw/mmdb_china_ip_list/release/lite/Country.mmdb`，`https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat`，`https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat`。

在本地下载后，再上传至 openwrt 的`/etc/openclash/`。

### 路由器自身使用代理

如果路由器自身不能翻墙，很多更新都会失败。

如果出现路由器自身不能翻墙的问题，多半是依赖没有安装。可去到`插件设置`->`调试日志`中生成日志。查看是否有依赖未安装。
安装完依赖后，重启 OpenClash 应该就能正常使用了。

比如下面这个日志，就缺少`iptables`相关依赖导致 openwrt 自身无法使用代理。

```ini
#===================== 依赖检查 =====================#

dnsmasq-full: 已安装
coreutils: 已安装
coreutils-nohup: 已安装
bash: 已安装
curl: 已安装
ca-certificates: 已安装
ipset: 已安装
ip-full: 已安装
libcap: 已安装
libcap-bin: 已安装
ruby: 已安装
ruby-yaml: 已安装
ruby-psych: 已安装
ruby-pstore: 已安装
kmod-tun(TUN模式): 已安装
luci-compat(Luci >= 19.07): 已安装
kmod-inet-diag(PROCESS-NAME): 未安装
unzip: 已安装
iptables-mod-tproxy: 未安装
kmod-ipt-tproxy: 未安装
iptables-mod-extra: 未安装
kmod-ipt-extra: 未安装
kmod-ipt-nat: 已安装
```

关于 Clash 作为透明代理，在[clash 项目](https://github.com/Dreamacro/clash)中有过[讨论](https://github.com/Dreamacro/clash/issues/158)。

### BT/PT

为了防止BT、P2P下载流量经过代理，可选中`覆写设置` -> `规则设备` -> `仅代理命中规则流量`。

选中后将会在配置文件未尾添加：
```
- PROCESS-NAME,aria2c,DIRECT
- PROCESS-NAME,BitComet,DIRECT
- PROCESS-NAME,fdm,DIRECT
- PROCESS-NAME,NetTransport,DIRECT
- PROCESS-NAME,qbittorrent,DIRECT
- PROCESS-NAME,Thunder,DIRECT
- PROCESS-NAME,transmission-daemon,DIRECT
- PROCESS-NAME,transmission-qt,DIRECT
- PROCESS-NAME,uTorrent,DIRECT
- PROCESS-NAME,WebTorrent,DIRECT
- PROCESS-NAME,Folx,DIRECT
- PROCESS-NAME,Transmission,DIRECT
- PROCESS-NAME,WebTorrent Helper,DIRECT
- PROCESS-NAME,v2ray,DIRECT
- PROCESS-NAME,ss-local,DIRECT
- PROCESS-NAME,ssr-local,DIRECT
- PROCESS-NAME,ss-redir,DIRECT
- PROCESS-NAME,ssr-redir,DIRECT
- PROCESS-NAME,ss-server,DIRECT
- PROCESS-NAME,trojan-go,DIRECT
- PROCESS-NAME,xray,DIRECT
- PROCESS-NAME,hysteria,DIRECT
- PROCESS-NAME,singbox,DIRECT
- PROCESS-NAME,UUBooster,DIRECT
- PROCESS-NAME,uugamebooster,DIRECT
- "DST-PORT,80,\U0001F41F 漏网之鱼"
- "DST-PORT,443,\U0001F41F 漏网之鱼"
- "DST-PORT,22,\U0001F41F 漏网之鱼"
- MATCH,DIRECT
```

对于漏网之鱼只代理22、80、443端口的流量，其它则直连。
