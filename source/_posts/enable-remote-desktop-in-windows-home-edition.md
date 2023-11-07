---
title: 在win10/11家庭版上打开远程桌面连接
date: 2023-11-07 09:31:57
tags:
- windows
description: win11只有家庭版没有专业版，但强需求远程桌面连接，只能hack一下了。
---
在微软的[Enable Remote Desktop on your PC](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/clients/remote-desktop-allow-access)文档中以及[How to use Remote Desktop](https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c#ID0EDD=Windows_11)文档中都有说明，家庭版不支持开启远程桌面连接服务。而从家庭版升级到专业版要掏1000多块钱，犯不着再买，换条路走吧。

## rdpwrap

好在有这个需求的人大有人在，于是有了[rdpwrap](https://github.com/stascorp/rdpwrap)项目。

rdpwrap使用Delphi开发，给被阉割的远程桌面服务模块（termsrv.dll）打个补丁，让它恢复专业版拥有的功能。

但rdpwrap年久失修，最近一次更新还是在5年前，只支持到win10。

于是有了很多fork，其中的优胜者是[sebaxakerhtc的版本](https://github.com/sebaxakerhtc/rdpwrap)。最主要的工作其实是维护[rdpwrap.ini](https://github.com/sebaxakerhtc/rdpwrap.ini)，因为不同windows版本下的termsrv.dll需要修复的位置和信息有所不同。

## SuperRDP

鉴于rdpwrap使用的是古老的delphi开发，实在不利于维护。有个国内做安全从业的大佬参考rdpwrap，使用C++开发了[SuperRDP](https://github.com/anhkgg/SuperRDP)自用。

但更新频率略低于sebaxakerhtc，对issue的处理也不够及时。

## 报毒

不管是rdpwrap，还是SuperRDP，它们的工作方式都和病毒木马非常像。Microsoft Defender会将它们的可执行文件识别成特洛依木马。

避开误报最简单的做法是：在运行前关闭病毒和威胁防护，在成功开启桌面连接后，将exe删除，再重新打开防护。

麻烦一点的方法是将它们加入排除项，这样可以持续使用。

## 进入设置页的快捷方式

顺便一提，使用[ms-settings URI](https://learn.microsoft.com/en-us/windows/uwp/launch-resume/launch-settings-app#ms-settings-uri-scheme-reference)可以[直接进入远程连接设置页](ms-settings:remotedesktop?activationSource=SMC-IA-4028379)。
