---
title: go语言的一个问题：病毒
date: 2023-08-11 13:45:21
tags:
- go
description: 最近想重新看下go，结果windows安全中心疯狂报毒。
---
不管是golang的二进制文件`go.exe`本身，还是使用`go build`编译出来的可执行文件，统统都报毒。

比如windows安全中心对`go.exe`扫描结果是：`Behavior:Win32/DefenseEvasion.A!ml`。

## 官方回答
golang的faq文档里有[相关回答](https://go.dev/doc/faq#virus)，官方给的理由是：商业杀毒软件没怎么见过像go语言的二进制文件这么特殊的文件结构，所以误报。解决方案：只需要确保安装go发行版的checksum和官方的一致就行了，然后给杀毒软件添加例外规则，或者向杀毒软件的厂商反馈。

但go都出来多少年了，还用这种理由多少有点不尊重人。虽然因为go的跨平台易用性，有大量病毒木马都转向了go，但明明你可以主动跟杀毒软件厂商沟通，协助优化病毒识别算法，现在却把这些活推给用户，还真是有点小傲慢呢。

## 解决方案
作了一些尝试，发现老版本的go不会被杀毒软件误报。可以合理猜测，杀毒软件会逐步更新对go的识别算法，我们只需要使用最近的一个版本就行了。

## 找到最近的不报病毒的版本
为了找到最近的不报病毒的版本，最笨的方法就是从最新版倒过来试，但这样也太麻烦了。

通过`scoop virustotal go`命令找到这个网站：[virustotal](https://www.virustotal.com/)，可以给我们减轻很多工作量。

它可以让用户上传文件，然后给出各个杀毒软件的检测结果。扫描结果以文件的checksum作为id，向公众共享。

Go的[下载页面](https://go.dev/dl/)有列出每个版本的发行包的checksum，我们只需要拿着checksum去virustotal，就可以看到各个杀毒软件的检测结果了。

比如截止本文撰写时，最新的go版本是`1.21.0`，它的windows压缩包发行版`go1.21.0.windows-amd64.zip`的checksum是`732121e64e0ecb07c77fdf6cc1bc5ce7b242c2d40d4ac29021ad4c64a08731f6`，我们将它组装成一个网址`https://www.virustotal.com/gui/file/732121e64e0ecb07c77fdf6cc1bc5ce7b242c2d40d4ac29021ad4c64a08731f6`，打开后就可以看到各家杀毒软件对它的扫描情况。

{% asset_img virustotal-go1.21.0.png virustotal-go1.21.0 %}

可以看到`go@1.21.0`的检测结果相当不妙。

通过寻找，发现`go@1.20.1`的结果要好不少，虽然还是有报毒和匹配到恶意软件规则，但从`1.4`开始有1款杀软报毒（江民），`1.5`全面崩掉，`1.20.1`的检测结果已经算可接受。

{% asset_img virustotal-go1.20.1.png virustotal-go1.20.1 %}

尝试安装`go@1.20.1`，果然不再报毒。

```bash
scoop install go@1.20.1
scoop hold go
```

结合最近更新`Docker Desktop 4.22.0 (117440)`后无法启动，导致原本运行的好好的container和volume全部挂件的事件，看来以后升级软件版本要谨慎一些，得先让子弹飞一会。
