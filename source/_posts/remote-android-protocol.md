---
title: 远程控制安卓手机
date: 2024-03-25 02:21:20
tags:
- 善用佳软
description: 我们可以通过RDP远程控制windows桌面，有没有办法可以远程控制安卓手机呢？
---
windows有[RDP](https://en.wikipedia.org/wiki/Remote_Desktop_Protocol)，安卓有没有类似的远程控制协议呢？

早在锤子还活着的时代，锤子就针对老年人推出过远程助手。咦，[锤子官网](https://www.smartisan.com/)竟然还在？还能看到[远程协助的视频介绍](https://www.smartisan.com/pr/videos/smartisan-os-assistance-love)。

但手机品牌官方的远程协助功能需要同品牌的手机才能使用，想要跨品牌远程控制，只能使用第三方工具。比如[向日葵](https://sunlogin.oray.com/product/mobile)、[ToDesk](https://www.todesk.com/)、[TeamViewer](https://www.teamviewer.cn/cn/)等。

但这些都是商业软件，比如向日葵远控移动设备就最少要128元一年。有没有开源的工具呢？

答案当然是有，就是本期推荐软件：[rustdesk](https://github.com/rustdesk/rustdesk)。

它支持windows、macOS、Linux、Android[多平台被控](https://rustdesk.com/docs/en/client/)，而且服务器也可以[自己搭](https://rustdesk.com/docs/en/self-host/)，不用担心数据被第三方劫持。

搭配另一款开源软件[短信转发器](https://github.com/pppscn/SmsForwarder)，可以实现监听重要通知。当有重要通知时，再远程操作手机的工作流。
