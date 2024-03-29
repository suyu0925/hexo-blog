---
title: "[OpenWrt]解除网易云音乐播放限制"
date: 2022-07-25 11:07:46
tags:
- openwrt
description: 网易云音乐的智能推荐很好用，但因为版权问题而音源不全。实在是不想下载一堆音乐app，那么可以考虑使用解除网易云音乐播放限制这个工具。
---
[解除网易云音乐播放限制](https://github.com/UnblockNeteaseMusic/server)的工作原理是拦劫网易云音乐的网络请求，使用其它音源来代替变灰的歌曲来实现解除播放限制。

它的使用需要一定的门槛，而且每个客户端还需要单独设置代理。所以不如直接使用OpenWrt路由器插件。

[[OpenWrt]解除网易云音乐播放限制](https://github.com/UnblockNeteaseMusic/luci-app-unblockneteasemusic)是一个OpenWrt的开源软件，它提供了两种安装方式：
- [下载预编译的`.ipk`](https://github.com/UnblockNeteaseMusic/luci-app-unblockneteasemusic/releases)
- 自行编译

在这里我们选择使用预编译的`ipk`文件。

## 下载安装包

首先下载[最新的`ipk`文件](https://github.com/UnblockNeteaseMusic/luci-app-unblockneteasemusic/releases/download/v3.2-3/luci-app-unblockneteasemusic_3.2-3_javascript_all.ipk)，截止到本文编写时间，最新版本为`v3.2-3`，使用node.js。

可直接在OpenWrt中使用命令行下载：
```bash
wget https://github.com/UnblockNeteaseMusic/luci-app-unblockneteasemusic/releases/download/v3.2-3/luci-app-unblockneteasemusic_3.2-3_javascript_all.ipk
```

但如果github被墙，那么就需要在本地先通过代理下载好，再拷贝至OpenWrt。
```bash
scp ./luci-app-unblockneteasemusic_3.2-3_javascript_all.ipk root@192.168.88.1:/root/
```

## 安装

直接使用opkg安装：
```bash
opkg update
opkg install ./luci-app-unblockneteasemusic_3.2-3_javascript_all.ipk
```

**dnsmasq**

如果是初始环境，很可能遇到下面这个错误：

```bash
Configuring kmod-nfnetlink.
Configuring libnfnetlink0.
Configuring kmod-nf-conntrack-netlink.
Configuring libmnl0.
Configuring libnetfilter-conntrack3.
Configuring libgmp10.
Configuring libnettle8.
Configuring kmod-ipt-ipset.
Collected errors:
 * check_data_file_clashes: Package dnsmasq-full wants to install file /etc/hotplug.d/ntp/25-dnsmasqsec
        But that file is already provided by package  * dnsmasq
 * check_data_file_clashes: Package dnsmasq-full wants to install file /etc/init.d/dnsmasq
        But that file is already provided by package  * dnsmasq
 * check_data_file_clashes: Package dnsmasq-full wants to install file /usr/lib/dnsmasq/dhcp-script.sh
        But that file is already provided by package  * dnsmasq
 * check_data_file_clashes: Package dnsmasq-full wants to install file /usr/sbin/dnsmasq
        But that file is already provided by package  * dnsmasq
 * check_data_file_clashes: Package dnsmasq-full wants to install file /usr/share/acl.d/dnsmasq_acl.json
        But that file is already provided by package  * dnsmasq
 * check_data_file_clashes: Package dnsmasq-full wants to install file /usr/share/dnsmasq/dhcpbogushostname.conf
        But that file is already provided by package  * dnsmasq
 * check_data_file_clashes: Package dnsmasq-full wants to install file /usr/share/dnsmasq/rfc6761.conf
        But that file is already provided by package  * dnsmasq
 * opkg_install_cmd: Cannot install package luci-app-unblockneteasemusic.
```

这是因为在`luci-app-unblockneteasemusic`中依赖了`dnsmasq-full`，与预装的`dnsmasq`发生冲突。

`dnsmasq-full`可以替代`dnsmasq`，我们卸载`dnsmasq`后重装安装：

```bash
opkg remove dnsmasq
opkg install ./luci-app-unblockneteasemusic_3.2-3_javascript_all.ipk
```

即可安装成功。

安装结束后会提示一个错误，可以忽略。

```bash
Collected errors:
 * resolve_conffiles: Existing conffile /etc/config/dhcp is different from the conffile in the new package. The new conffile will be placed at /etc/config/dhcp-opkg.
```

### 网页

安装完成后，如果没有出现配置菜单，登出再登入即可，不需要重启。

如果是初始环境，在打开配置网页时可能会出现下面的错误。

```bash
/usr/lib/lua/luci/dispatcher.lua:1347: module 'luci.cbi' not found:
	no field package.preload['luci.cbi']
	no file './luci/cbi.lua'
	no file '/usr/share/lua/luci/cbi.lua'
	no file '/usr/share/lua/luci/cbi/init.lua'
	no file '/usr/lib/lua/luci/cbi.lua'
	no file '/usr/lib/lua/luci/cbi/init.lua'
	no file './luci/cbi.so'
	no file '/usr/lib/lua/luci/cbi.so'
	no file '/usr/lib/lua/loadall.so'
	no file './luci.so'
	no file '/usr/lib/lua/luci.so'
	no file '/usr/lib/lua/loadall.so'
stack traceback:
	[C]: in function 'require'
	/usr/lib/lua/luci/dispatcher.lua:1347: in function '_cbi'
	/usr/lib/lua/luci/dispatcher.lua:1024: in function 'dispatch'
	/usr/lib/lua/luci/dispatcher.lua:985: in function 'dispatch'
	/usr/lib/lua/luci/dispatcher.lua:479: in function </usr/lib/lua/luci/dispatcher.lua:478>
```

这是因为缺少库`luci-compat`，补上后再刷新网页即可工作正常。

```bash
opkg install luci-compat
```

### 配置

默认配置不需要修改即可使用，所以可以直接勾选`启用本插件`开启服务，然后`保存并提交`。

在安装完成后，是没有核心的。所以在首次使用时，会在后台下载核心，需要等待一会。

可以去`日志`标签页查看是否更新完成。

```plain text
Local version: NOT FOUND, latest version: 7cbc0acff167f78748f69709894dd6a0747ccdbc.
Updating core...
```

如果更新失败，需要手动在`更新组件`标签页去再次更新核心。

```plain text
Succeeded in updating core.
Current core version: 7cbc0acff167f78748f69709894dd6a0747ccdbc.

{"level":30,"time":1658718197068,"pid":6249,"hostname":"OpenWrt","scope":"app","msg":"HTTP Server running @ http://0.0.0.0:5200"}
{"level":30,"time":1658718197070,"pid":6249,"hostname":"OpenWrt","scope":"app","msg":"HTTPS Server running @ http://0.0.0.0:5201"}
```

直至下载成功后，本插件才可以正常工作。

### 客户端版本

注意截止至本文编写时，win10客户端的最新版本2.10.2无法使用代理，请参见[github issue](https://github.com/UnblockNeteaseMusic/server/issues/695)。

解决方法：降级使用[2.9.9版本客户端](https://d1.music.126.net/dmusic/cloudmusicsetup2.9.9.199909.exe)。

安装低版本客户端后，请关闭自动更新，避免又自动恢复到高版本。

{% asset_img "turn-off-auto-update.png" "关闭自动更新" %}

## 问题

不确定是OpenClash的版本问题，还是UnblockNeteaseMusic的版本问题，当前最新版无法与OpenClash一起使用。

两个单独使用都正常，但一起开DNS就会出问题，无法解析所有域名。

先开OpenClash，一切正常。再开网易云，此时UnblockNeteaseMusic不会出现日志
```
INFO: (app) HTTP Server running @ http://0.0.0.0:5200
INFO: (app) HTTPS Server running @ http://0.0.0.0:5201
```
同时DNS坏掉。关掉网易云后正常。

先开网易云，一切正常。再开OpenClash，此时DNS坏掉。关掉OpenClash后仍不正常，需要再关掉网易云才正常。

工作正常的环境：
OpenWrt 21.02.3
unblockneteasemusic v2.13-1
OpenClash v0.45.78-beta, [Dev] v1.12.0-8, [TUN] 2022.11.25-8, [Meta] alpha-g7a6432, Fake-IP 混合, 使用api.dler.io转换订阅模板
一切正常。包括`curl https://google.com`。

工作正常的环境：
OpenWrt 21.02.5
unblockneteasemusic v3.1-4
OpenClash v0.45.87-beta, [Dev] v1.13.0-3, [TUN] 2023.01.29-3, [Meta] alpha-g4c25f5e7, Redir-Host 兼容/混合, 使用api.dler.io转换订阅模板
使用Fake-IP工作正常。
而且不管是Redir-Host还是Fake-IP，在openwrt上`curl https://google.com`都无法连接。

工作**不正常**的环境：
OpenWrt 22.03.2/22.03.3/22.03.5
unblockneteasemusic v2.13-1/v3.1-4/v3.2-3
OpenClash v0.45.87-beta, [Dev] v1.13.0-3, [TUN] 2023.01.29-3, [Meta] alpha-g4c25f5e7, Redir-Host/Fake-IP 兼容/混合, 使用api.dler.io转换订阅模板

通过测试基本可以判定，原因出在系统OpenWrt 22.03，还是使用OpenWrt 21.02版本吧。
