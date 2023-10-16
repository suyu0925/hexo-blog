---
title: "[OpenWrt]使用OpenClash科学上网"
date: 2022-07-25 15:46:56
tags:
- openwrt
description: 可以说软路由最重要的作用就是科学上网了，在OpenWrt的科学上网工具中，最喜欢的还是OpenClash。
---
[OpenClash](https://github.com/vernesong/OpenClash)几乎支持了所有协议，并且配置也很全面。

## 下载

首先手动下载`.ipk`包文件。截止这篇文章，最新版本为[v0.45.141-beta](https://github.com/vernesong/OpenClash/releases/tag/v0.45.141-beta)。

```bash
wget -O luci-app-openclash.ipk https://github.com/vernesong/OpenClash/releases/download/v0.45.141-beta/luci-app-openclash_0.45.141-beta_all.ipk
```

如果在OpenWrt中无法下载，那么可在宿主机通过代理下载后再拷贝上去。

```bash
scp ./luci-app-openclash.ipk root@192.168.88.1:/root/
```

再下载一个[v1.11.0-7-g5497ada版本的Dev内核](https://github.com/vernesong/OpenClash/releases/tag/Clash)备用。

```bash
wget -O https://github.com/vernesong/OpenClash/releases/download/Clash/clash-linux-amd64.tar.gz clash-linux-amd64.tar.gz
```

## 安装

注意要先[安装依赖](https://github.com/vernesong/OpenClash/wiki/%E5%AE%89%E8%A3%85)。

`luci-app-openclash.ipk`中并没有包含全部依赖，如果缺少依赖会导致各种问题，比如OpenClash自身无法使用代理上网。

```bash
opkg update
opkg remove dnsmasq
opkg install luci-compat
opkg install ./luci-app-openclash.ipk
```

openclash使用了dnsmasq-full，为了避免冲突，需要先卸载dnsmasq。
同时，openclash也依赖luci的cbi模块，需要先安装luci-compat。

## 配置

### 内核

OpenClash使用的是[Clash项目](https://github.com/Dreamacro/clash)，会自动定期编译。
```bash
GOARCH=amd64 GOOS=linux CGO_ENABLED=0 go build -trimpath -ldflags '-X "github.com/Dreamacro/clash/constant.Version=v1.17.0-5-ge1ec0d2" -X "github.com/Dreamacro/clash/constant.BuildTime=Sat Jul 29 19:08:17 UTC 2023" -w -s -buildid=' -o bin/clash
```

编译好的内核文件没有放在`ipk`包中，初次使用时需要根据Openwrt系统自助下载内核。
如果是arm路由器比如使用aarch64_cortex-a53的[EasyPi ARS2](https://doc.linkease.com/zh/guide/easepi/)，则需要编译对应的版本，比如AUK9527做的[iStore扩展插件包](https://github.com/AUK9527/Are-u-ok/tree/main/apps)。

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
scp clash-linux-amd64.tar.gz root@192.168.88.1:/etc/openclash/core
```

内核下载地址
- 老的Release页面
  - [Dev 内核](https://github.com/vernesong/OpenClash/releases/tag/Clash)
  - [Tun 内核](https://github.com/vernesong/OpenClash/releases/tag/TUN-Premium)
  - [Tun 游戏内核](https://github.com/vernesong/OpenClash/releases/tag/TUN)
- 当前发布的最新内核
  - [Dev 内核](https://github.com/vernesong/OpenClash/tree/core/master/dev)
  - [Tun 内核](https://github.com/vernesong/OpenClash/tree/core/master/premium)
  - [Meta 内核](https://github.com/vernesong/OpenClash/tree/core/master/meta)

注意：
> 新的内核只支持fake-ip，如果使用了**在线订阅模板**，最好使用老的内核。
> 否则会出现`invalid mode： redir-host`的错误，可参见这个[issue](https://github.com/Dreamacro/clash/issues/2559)。

上传到OpenWrt`/etc/openclash/core`下的对应位置。
- Dev 内核: clash
- Tun 内核: clash_tun
- Meta 内核: clash_meta

```bash
cd /etc/openclash/core
tar -zxvf clash-linux-amd64.tar.gz
rm clash-linux-amd64.tar.gz
```

`clash`内核的权限应该为`nobody:nogroup`，可以手动修改权限，也可以让openclash自行修改。
```bash
chown nobody:nogroup /etc/openclash/core/* 2>/dev/null
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

如果使用的是[飞鸟机场](https://aff01.fyb-aff01.com/)，也必须使用订阅转换服务，否则在redir-host模式下无法解析域名，只能使用Fake-IP模式。
可能是因为没有dns段：
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

### Fake IP模式
OpenClash支持Redir-Host和Fake-IP两种模式，默认为Redir-Host模式。

Fake IP出自[RFC3089](https://www.rfc-editor.org/rfc/rfc3089)，这个RFC定义了一种新的将TCP连接封装成SOCKS协议的方法。[这里](https://blog.skk.moe/post/what-happend-to-dns-in-proxy/#Zai-redir-x2F-tun2socks-Zhong-Shi-Yong-Fake-IP)有篇文章介绍的比较详细。

它与Redir-Host模式的最主要区别是：
1. 客户端发出的DNS解析请求会被代理端捕获，然后立即从Fake IP池子里取一个IP建立映射返回。
2. 客户端发起对这个Fake IP的TCP连接，又被代理端截获，再返查出域名。
3. 代理端使用SOCKS协议封装TCP连接和域名。
整个过程都无需解析DNS，因此速度会更快。

但它也有几个问题：
- 无法ping域名，解析得到的会是内网的Fake IP
- [windows会认为没有连接到互联网](https://github.com/vernesong/OpenClash/issues/6)，需要将`\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\NlaSvc\Parameters\Internet`下的[几个域名](https://www.zhihu.com/question/48856675)添加至覆写设置->DNS设置->Fake-IP-Filter。
- windows时间同步的NTP（Network Time Protocol）域名：time.windows.com

如果对性能不是有很强的要求，还是建议使用Redir-Host模式。

### 偶尔有部分网址无法连接

偶尔有百度无法连接的情况，此时可将代理模式切换至Global模式，再切回Rule，通常药到病除。只是重启OpenClash不行。

可参看这个[Issue](https://github.com/vernesong/OpenClash/issues/31)。

### 自定义规则集

规则集英文是[Rule Provider](https://lancellc.gitbook.io/clash/clash-config-file/rule-provider)，它可以在`config.yml`之外补充一些规则。

比如最近大陆把微软OneDrive墙了，那么我们可以在`配置文件管理`中，新增一个类型为classic的本地规则：
```
payload:
  # > OneDrive
  - DOMAIN-SUFFIX,onedrive.live.com
```

然后在`规则集与策略组管理`中的`自定义规则集与策略组管理`中使用它：

{% asset_img "use-rule-provider.png" "使用自定义规则集" %}

这样当访问后缀为`onedrive.live.com`的网站时，就会使用代理了。

### geo数据库订阅
如果在更新geo数据库时出错，可能会导致geo文件缺乏，openclash无法启动。此时需要手动下载并上传geo数据库的文件。

geo数据库的文件有好几个，`Country.mmdb`，`GeoSite.dat`，`GeoIP.dat`都在`/etc/openclash/`下。

我们可以在`/usr/share/openclash/`目录下找到对应的更新脚本：`openclash_ipdb.sh`，`openclash_geosite.sh`，`openclash_geoip.sh`，

再在更新脚本中找到下载地址：`https://raw.githubusercontent.com/alecthw/mmdb_china_ip_list/release/lite/Country.mmdb`，`https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat`，`https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat`。

在本地下载后，再上传至openwrt的`/etc/openclash/`。

### 路由器自身使用代理

如果路由器自身不能翻墙，很多更新都会失败。

如果出现路由器自身不能翻墙的问题，多半是依赖没有安装。可去到`插件设置`->`调试日志`中生成日志。查看是否有依赖未安装。
安装完依赖后，重启OpenClash应该就能正常使用了。

比如下面这个日志，就缺少iptables相关依赖导致openwrt自身无法使用代理。
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

关于Clash作为透明代理，在[clash项目](https://github.com/Dreamacro/clash)中有过[讨论](https://github.com/Dreamacro/clash/issues/158)。
