---
title: edgetunnel
date: 2024-03-25 15:45:50
tags:
description: 最近推特上有一个项目很火，叫做 edgetunnel，只需简单几步，就可以免费得到一个独属于自己的高速大流量代理订阅链接，这还不赶紧研究一下。
---

[edgetunnel](https://github.com/cmliu/edgetunnel)开源在 github 上，作者是[cmliu](https://github.com/cmliu)，从他固定的几个代码仓库可以看出他主要在玩[CF-Workers](https://www.cloudflare.com/zh-cn/developer-platform/workers/)和[VLESS 订阅]()。

## 项目介绍

edgetunnel 充分利用[CloudFlare](https://www.cloudflare.com/zh-cn/)提供的免费[Workers](https://www.cloudflare.com/zh-cn/developer-platform/workers/)功能，实现了一个简单的代理订阅服务。

一个代理订阅服务需要实现这么几个功能：

- 用户鉴权
- 收集代理地址
- ACL 规则转换
- 输出不同的订阅格式，clash、singbox 等

edgetunnel 通过 CF-Workers 实现了上面全部的功能。

## 用户鉴权

用户鉴权比较简单，因为 CF-Workers 使用的代码是用户自己上传的，所以在代码中写死一个 guid 当作密码即可。

## 收集代理地址

edgetunnel 使用的代理地址有三个源：

- 主要源：[WorkerVless2sub](https://github.com/cmliu/WorkerVless2sub)项目中的[addressesapi.txt](https://github.com/cmliu/WorkerVless2sub/blob/main/addressesapi.txt)，虽然每次提交的注释都是[示例，并没有在维护](https://github.com/cmliu/WorkerVless2sub/commits/main/)，但[更新频率](https://github.com/cmliu/WorkerVless2sub/blame/main/addressesapi.txt)已经出卖了它。
- 备用源：[CFcdnVmess2sub](https://github.com/cmliu/CFcdnVmess2sub/tree/main)项目中的[addressesapi.txt](https://github.com/cmliu/CFcdnVmess2sub/blob/main/addressesapi.txt)，虽然每次提交的注释都是[示例，并没有在维护](https://github.com/cmliu/CFcdnVmess2sub/commits/main/)，但[更新频率](https://github.com/cmliu/CFcdnVmess2sub/blame/main/addressesapi.txt)已经出卖了它。
- SOS 急救源：`https://hy2sub.pages.dev`，来自于[HY2sub](https://github.com/cmliu/HY2sub)项目，[节点不干净](https://github.com/cmliu/WorkerVless2sub/issues/14#issuecomment-2009303091)。

## ACL 规则转换

edgetunnel 使用了自己修改的[ACL4SSR](https://github.com/cmliu/ACL4SSR)，相当于原版[ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)再加上[adobe 免激活](https://github.com/ignaciocastro/adobe-is-dumb/)。

## 输出不同的订阅格式

edgetunnel 使用了[肥羊的在线订阅转换](https://sub.v1.mk/)：`api.v1.mk`。

在之前的文章{% post_link convert-proxy-subscription 代理的订阅格式转换 %}中有介绍过[subconverter](https://github.com/tindy2013/subconverter/)，现在有了 CF-Workers 版本：[psub](https://github.com/bulianglin/psub)。
