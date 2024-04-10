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

rdpwrap使用Delphi开发，给被阉割的远程桌面服务模块（[termsrv.dll](https://www.file.net/process/termsrv.dll.html)）打个补丁，让它恢复专业版拥有的功能。

但rdpwrap年久失修，最近一次更新还是在5年前，只支持到win10。

于是有了很多fork，其中的优胜者是[sebaxakerhtc的版本](https://github.com/sebaxakerhtc/rdpwrap)。最主要的工作其实是维护[rdpwrap.ini](https://github.com/sebaxakerhtc/rdpwrap.ini)，因为不同windows版本下的`termsrv.dll`需要修复的位置和信息有所不同，通常都在`%SystemRoot%\System32\`目录下。

> 更新：
>
> `sebaxakerhtc`的[rdpwrap.ini](https://github.com/sebaxakerhtc/rdpwrap.ini)项目已于2024年3月[停止维护](https://github.com/sebaxakerhtc/rdpwrap.ini/issues/366)，作者已经很久不使用rdpwrap，也就没有了动力继续维护。
> 他推荐了[RDPWrapOffsetFinder](https://github.com/llccd/RDPWrapOffsetFinder)项目，大多数情况下，运行`RDPWrapOffsetFinder.exe path\to\termsrv.dll`就会输出对应版本的ini配置，将输出的内容添加到rdpwrap.ini中，便可继续使用rdpwrap。

## SuperRDP

鉴于rdpwrap使用的是古老的delphi开发，实在不利于维护。有个国内做安全从业的大佬参考rdpwrap，使用C++开发了[SuperRDP](https://github.com/anhkgg/SuperRDP)自用。

但更新频率略低于sebaxakerhtc，对issue的处理也不够及时。

## 报毒

不管是rdpwrap，还是SuperRDP，它们的工作方式都和病毒木马非常像。Microsoft Defender会将它们的可执行文件识别成特洛依木马。

避开误报最简单的做法是：在运行前关闭病毒和威胁防护，在成功开启桌面连接后，将exe删除，再重新打开防护。

麻烦一点的方法是将它们加入排除项，这样可以持续使用。

## 使用

### 账号

在使用远程连接之前，最好专门为远程连接创建一个账号，不要直接使用`MicrosftAccount\your-account@microsoft.com`。

Win10：
1. 进入设置中的帐户，选择家庭和其他用户
2. 将其他人添加到这台电脑
3. 等待Microsoft帐户窗口加载完成，选择`我没有这个人的登录信息`
4. 需要同意一份个人数据导出许可
5. 选择`添加一个没有 Microsoft 帐户的用户`
6. 正常的创建本地用户

### 内网穿透

Windows的RDP使用的是TCP 3389端口，内网穿透的设置与ssh的TCP 22端口完全一致。

在RDP客户端，连接的计算机地址那栏是可以带端口号的。

### 专业版打开多用户远程登录

在win10/11专业版上，远程桌面连接默认只允许一个用户登录，多用户同时登录是Windows Server版的特性。

但其实专业版也是被阉割的，只需要修改termsrv.dll就可以开放多用户登录功能。

补丁很简单，使用PowerShell都可以完成这个修改，叁见[TermsrvPatcher](https://github.com/fabianosrc/TermsrvPatcher)。

### 进入设置页的快捷方式

顺便一提，使用[ms-settings URI](https://learn.microsoft.com/en-us/windows/uwp/launch-resume/launch-settings-app#ms-settings-uri-scheme-reference)可以[直接进入远程连接设置页](ms-settings:remotedesktop?activationSource=SMC-IA-4028379)。
