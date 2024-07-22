---
title: 定制 winpe
date: 2024-07-19 13:58:43
tags:
description: 官方 winpe 不能直接运行 physdiskwrite ，还是要定制一下。
---

[WinPE](https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/winpe-intro)是一个小型操作系统，用于安装、部署和修复 Windows。

## 前期准备

### ADK

第一步先安装 ADK 和加载项。

[从 Win10 1809 开始](https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/winpe-intro?view=windows-11#download-winpe)，官方 WinPE 包含在[ADK](https://learn.microsoft.com/zh-cn/windows-hardware/get-started/adk-install)的[加载项](https://learn.microsoft.com/zh-cn/windows-hardware/get-started/adk-install#download-the-adk-for-windows-11-version-22h2)里。

### 导出 WinPE

以管理员身份启动**部署和映像工具环境**（在开始菜单的程序栏 Windows Kits 下）运行以下脚本，之后的脚本也都是使用这个环境。

```sh
copype amd64 C:\WinPE_amd64
```

### 生成映像文件

```sh
MakeWinPEMedia /ISO C:\WinPE_amd64 C:\WinPE_amd64\WinPE_amd64.iso
```

## 定制

### 查看映像信息

```sh
> Dism /Get-ImageInfo /ImageFile:C:\WinPE_amd64\media\sources\boot.wim
部署映像服务和管理工具
版本: 10.0.26100.1

映像详细信息: C:\WinPE_amd64\media\sources\boot.wim

索引: 1
名称: Microsoft Windows PE (amd64)
描述: Microsoft Windows PE (amd64)
大小: 2,009,251,937 字节

操作成功完成。
```

### 挂载

```sh
Dism /Mount-Image /ImageFile:"C:\WinPE_amd64\media\sources\boot.wim" /index:1 /MountDir:"C:\WinPE_amd64\mount"
```

完成挂载后，在`C:\WinPE_amd64\mount`的修改就对应着 WinPE 中的`X:\`。

避免忘记挂载的目标目录在哪，可以使用下面的命令查看已经挂载的映像

```sh
Dism /Get-MountedWimInfo
```

### 查看已安装的包

使用`Dism /Get-Packages /Image:"C:\WinPE_amd64\mount"`可以查看已经安装的包。

### 卸载

卸载时可以选择提交（/commit）或丢弃修改（/discard）。

```sh
Dism /Unmount-Image /MountDir:"C:\WinPE_amd64\mount" /commit
```

## 添加包

WinPE 的可选组件可以在[这里](https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/winpe-add-packages--optional-components-reference)查看。

这些可选包在本地的`c:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Windows Preinstallation Environment\amd64\WinPE_OCs\`目录下。

暂时不知道 physdiskwrite 依赖哪个包，一个个试吧。

```sh
copy %USERPROFILE%\Downloads\physdiskwrite-0.5.3\physdiskwrite.exe C:\WinPE_amd64\mount\Windows\System32\
```

## 开始尝试

0. 首先试了 chatgpt 说的 vc_redist，想多了，无法安装 exe

首先从[Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist)页面下载最新的[vc_redist.x64.exe](https://aka.ms/vs/17/release/vc_redist.x64.exe)。

```sh
copy %USERPROFILE%\Downloads\vc_redist.x64.exe C:\WinPE_amd64\mount\Windows\Temp\
dism /Image:"C:\WinPE_amd64\mount" /Add-Package /PackagePath:"C:\WinPE_amd64\mount\Windows\Temp\vc_redist.x64.exe"
```

1. 第一次尝试，先试`WinPE-Setup`+`WinPE-Setup-Client`。

这俩包不是，进入 WinPE 后就进入驱动安装界面了。

```sh
Dism /Image:"C:\WinPE_amd64\mount" /Add-Package /PackagePath:"C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Windows Preinstallation Environment\amd64\WinPE_OCs\WinPE-Setup.cab"
Dism /Image:"C:\WinPE_amd64\mount" /Add-Package /PackagePath:"C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Windows Preinstallation Environment\amd64\WinPE_OCs\WinPE-Setup-Client.cab"
```

2. 第二次尝试，重置映像，试试`Microsoft .NET/WinPE-NetFx`。

```sh
Dism /Image:"C:\WinPE_amd64\mount" /Add-Package /PackagePath:"C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Windows Preinstallation Environment\amd64\WinPE_OCs\WinPE-NetFx.cab"
```

并不行。

3. 第三次尝试，试试`WinPE-WMI`+`WinPE-Scripting`。

```sh
Dism /Image:"C:\WinPE_amd64\mount" /Add-Package /PackagePath:"C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Windows Preinstallation Environment\amd64\WinPE_OCs\WinPE-WMI.cab"
Dism /Image:"C:\WinPE_amd64\mount" /Add-Package /PackagePath:"C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Windows Preinstallation Environment\amd64\WinPE_OCs\WinPE-Scripting.cab"
```

4. 查询`physdiskwrite`依赖

先下载[Dependencies](https://github.com/lucasg/Dependencies)工具，查看到`physdiskwrite`依赖为`C:\Windows\SysWOW64\kernel32.dll`。

这个文件是在 64 位系统下运行 32 位程序用的。

而 Windows 在 [WinPE 的限制](https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/winpe-intro#limitations)提到：

> Windows PE 不支持以下任一操作：
>
> - 在不同的体系结构上运行针对某一种体系结构编译的应用程序，例如，在 64 位版本的 Windows PE 上运行 32 位应用程序，或者在 Arm64 版本的 WinPE 上运行 Amd64 应用程序。

5. 破解

搜索了下，有不少文章指向 reboot.pro 这个网站，比如[msfn 上的这篇](https://msfn.org/board/topic/167983-how-to-add-wow64-to-simple-win8pe)，和[superuser 上的这篇](https://superuser.com/questions/1532946/how-to-add-syswow64-support-to-the-windows-10-preinstallation-environment-vers)。但 reboot.pro 这个网站不能访问。

后来在国内的[无忧论坛](http://bbs.wuyou.net/)上看到[[分享] (更新支持虚拟化程序)Win10X64 中运行 32 位程序的临时办法](http://bbs.wuyou.net/forum.php?mod=viewthread&tid=371490)，但也没讲原理。

多数论坛都会发展出自己的工具，比如[Ten Forums](https://www.tenforums.com/)上的[Win10XPE](https://www.tenforums.com/software-apps/182581-win10xpe-build-your-own-rescue-media-2-a.html)、[the oven](https://old.theoven.org/index-2.html)上的[Win10PE SE](https://old.theoven.org/index36c8.html?topic=1336.0)、无忧论坛上的[setwow64](http://bbs.wuyou.net/forum.php?mod=viewthread&tid=371490)。

使用第三方工具就不如直接用第三方 WinPE 比如[优启通](https://www.itsk.com/thread/431283)了，反正都是黑盒。

还是想找到最原始的方法，我的叙求也就是运行一个 physdiskwrite 而已。

6. 尝试自行破解

首先，复制`C:\Windows\System32`下的`wow64*`文件到winpe。

```sh
copy C:\Windows\System32\wow64*.dll C:\WinPE_amd64\mount\Windows\System32\
```

然后，复制SysWOW64目录。

```sh
xcopy C:\Windows\SysWOW64 C:\WinPE_amd64\mount\Windows\SysWOW64 /s /e
```

最后，修改注册表。

```sh
reg load HKLM\WinPE_SysWOW64 C:\WinPE_amd64\mount\Windows\SysWOW64\config\SYSTEM
reg add "HKLM\WinPE_SysWOW64\ControlSet001\Control\Session Manager\Environment" /v PROCESSOR_ARCHITECTURE /t REG_SZ /d AMD64 /f
reg unload HKLM\WinPE_SysWOW64
```

失败。

找到一篇文章：[WoW64 - Windows 10.0.*****](http://mistyprojects.co.uk/documents/winpe_tweaks/readme.files/WoW64_WinPE10.htm)，写的更详细了些。
