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
这个环境是 cmd，所以本文所有的脚本都使用 cmd 而非 powershell。

```sh
copype amd64 C:\WinPE_amd64
```

### 生成映像文件

```sh
MakeWinPEMedia /ISO /F C:\WinPE_amd64 C:\WinPE_amd64\WinPE_amd64.iso
```

## 基本操作

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

## 初试 physdiskwrite

### 拷贝文件

```sh
Dism /Mount-Image /ImageFile:"C:\WinPE_amd64\media\sources\boot.wim" /index:1 /MountDir:"C:\WinPE_amd64\mount"

copy %USERPROFILE%\Downloads\physdiskwrite-0.5.3\physdiskwrite.exe C:\WinPE_amd64\mount\Windows\System32

Dism /Unmount-Image /MountDir:"C:\WinPE_amd64\mount" /commit

MakeWinPEMedia /ISO /F C:\WinPE_amd64 C:\WinPE_amd64\WinPE_amd64.iso
```

### 验证

验证 iso 可以使用 Hyper-V 虚拟机加载启动。

```sh
X:\Windows\System32>physdiskwrite
The application has failed to start because its side-by-side configuration is incorrect. Please see the appl,ication event log or use command-line sxstrace.exe tool for more detail.
```

通常出现这个提示是缺少运行依赖库。

### 依赖库检查

下载[Dependencies](https://github.com/lucasg/Dependencies)工具，查看到`physdiskwrite`依赖为`C:\Windows\SysWOW64\kernel32.dll`。

### WOW64

SysWOW64 是 WOW64 的一部分，WOW64 的全写是 Windows 32-bit on Windows 64-bit，用于在 Windows 64 位操作系统上支持运行 32 位程序。

而 Windows 在 [WinPE 的限制](https://learn.microsoft.com/zh-cn/windows-hardware/manufacture/desktop/winpe-intro#limitations)提到：

> Windows PE 不支持以下任一操作：
>
> - 在不同的体系结构上运行针对某一种体系结构编译的应用程序，例如，在 64 位版本的 Windows PE 上运行 32 位应用程序，或者在 Arm64 版本的 WinPE 上运行 Amd64 应用程序。

## 支持 WOW64

现在我们的问题就变成了：如何在 WinPE 上支持 WOW64。

搜索了下，有不少文章指向 reboot.pro 这个网站，比如[msfn 上的这篇](https://msfn.org/board/topic/167983-how-to-add-wow64-to-simple-win8pe)，和[superuser 上的这篇](https://superuser.com/questions/1532946/how-to-add-syswow64-support-to-the-windows-10-preinstallation-environment-vers)。但 reboot.pro 这个网站不能访问。

后来在国内的[无忧论坛](http://bbs.wuyou.net/)上看到[[分享] (更新支持虚拟化程序)Win10X64 中运行 32 位程序的临时办法](http://bbs.wuyou.net/forum.php?mod=viewthread&tid=371490)，但也没讲原理。

最终通过[这个帖子](http://wuyou.net/forum.php?mod=viewthread&tid=422020)，摸到了[wimbuilder2](https://github.com/slorelee/wimbuilder2)，里面有[解决方案](https://github.com/slorelee/wimbuilder2/blob/master/Projects/WIN10XPE/01-Components/SysWOW64_Basic/main.bat)。

### 拷贝文件

本文使用的 WinPE 的版本是`10.0.26100.1`，对于低于`16299`版本的 WinPE 除了拷贝文件外还需要额外的 hack，新版本则不需要。

在 WinPE 的`X:\Windows\SysWOW64\`下已经有`wowreg32.exe`，但运行后和运行 physdiskwrite 报相同的错。

需要复制的文件有点多，而且还有查找筛选动作，所以我们使用一个脚本函数`filecopy.cmd`来简化操作。

```sh
@echo off
setlocal enabledelayedexpansion

:: 定义源路径变量
set "SourcePath=%~1"
set "SourceFolder=%~dp1"

rem 查找满足条件的目录
for /f "tokens=*" %%i in ('dir /b "%SourcePath%"') do (
  rem 输出满足条件的目录的全路径
  set "Source=%SourceFolder%%%i"
  set "Target=!Source:c:=c:\WinPE_amd64\mount!"
  if exist "!source!\*" (
    robocopy !Source! !Target! /E /W:0 /R:0
  ) else (
    copy !Source! !Target! /y
  )
)
```

复制文件

```sh
rem [WinSXS]
filecopy c:\Windows\WinSxS\x86_microsoft.windows.c..-controls.resources_*_en-US*
filecopy c:\Windows\WinSxS\x86_microsoft.windows.common-controls*
filecopy c:\Windows\WinSxS\wow64_microsoft.windows.gdiplus.systemcopy_*
filecopy c:\Windows\WinSxS\x86_microsoft.windows.gdiplus_*
filecopy c:\Windows\WinSxS\x86_microsoft.windows.isolationautomation_*
filecopy c:\Windows\WinSxS\x86_microsoft.windows.i..utomation.proxystub_*
filecopy c:\Windows\WinSxS\x86_microsoft-windows-servicingstack_*

filecopy c:\Windows\WinSxS\manifests\x86_microsoft.windows.c..-controls.resources_*_en-US*.manifest
filecopy c:\Windows\WinSxS\Manifests\x86_microsoft.windows.common-controls_*.manifest
filecopy c:\Windows\WinSxS\Manifests\wow64_microsoft.windows.gdiplus.systemcopy_*.manifest
filecopy c:\Windows\WinSxS\Manifests\x86_microsoft.windows.gdiplus_*.manifest
filecopy c:\Windows\WinSxS\Manifests\x86_microsoft.windows.isolationautomation_*.manifest
filecopy c:\Windows\WinSxS\Manifests\x86_microsoft.windows.i..utomation.proxystub_*.manifest
filecopy c:\Windows\WinSxS\Manifests\x86_microsoft.windows.systemcompatible_*.manifest
filecopy c:\Windows\WinSxS\Manifests\x86_microsoft-windows-servicingstack_*.manifest

rem [wow64]
filecopy c:\windows\system32\wow64.dll
filecopy c:\windows\system32\wow64cpu.dll
filecopy c:\windows\system32\wow64win.dll

rem added for 21H1 and later
filecopy c:\windows\system32\wow64base.dll
filecopy c:\windows\system32\wow64con.dll

filecopy c:\windows\SysWOW64\C_*.NLS
filecopy c:\windows\SysWOW64\KBD*.dll

filecopy c:\windows\SysWOW64\DXCore.dll
filecopy c:\windows\SysWOW64\umpdc.dll
filecopy c:\windows\SysWOW64\TextShaping.dll

rem 还有文件，没写未完
```

文件有点多，有时间再写完吧。

WinSXS 文件夹被特殊处理过，直接复制会无权限写入。需要先取得写入权限

```sh
takeown /F "C:\WinPE_amd64\mount\windows\winsxs" /A /R
icacls "C:\WinPE_amd64\mount\windows\winsxs" /grant Administrators:F /T
```

### 注册表

**挂载和卸载注册表**

```sh
reg load HKLM\WinPE_SOFTWARE c:\WinPE_amd64\mount\Windows\System32\config\Software

rem 修改注册表

reg unload HKLM\WinPE_SOFTWARE
```

**从 Windows 中复制**

需要复制的注册表有点多，而且还有查找筛选动作，所以我们使用一个脚本函数`regcopy.cmd`来简化操作。

```sh
@echo off
setlocal

:: 检查参数
if "%~1"=="" (
    echo Usage: regcopy ^<SourcePath^>
    echo Example: regcopy HKLM\Software\Classes\Wow6432Node\CLSID
    goto :EOF
)

:: 定义源路径变量
set "SourcePath=%~1"

:: 替换HKLM\SOFTWARE为HKLM\WinPE_SOFTWARE
set "TmpPath=%SourcePath:HKLM\SOFTWARE=HKLM\WinPE_SOFTWARE%"
set "DestPath=%TmpPath:HKEY_LOCAL_MACHINE\SOFTWARE=HKEY_LOCAL_MACHINE\WinPE_SOFTWARE%"

if "%~2"=="" goto :_SimpleCopy
set "FindKey=%~2"
for /f "delims=" %%A IN ('reg query "%SourcePath%" /s /f "%FindKey%"') Do Call :_RegCopy "%%A"

:: 调用reg copy命令
:_SimpleCopy
reg copy "%SourcePath%" "%DestPath%" /f /s
goto :EOF

:_RegCopy
Set "SourcePath=%~1"
set "TmpPath=%SourcePath:HKLM\SOFTWARE=HKLM\WinPE_SOFTWARE%"
set "DestPath=%TmpPath:HKEY_LOCAL_MACHINE\SOFTWARE=HKEY_LOCAL_MACHINE\WinPE_SOFTWARE%"
reg copy "%SourcePath%" "%DestPath%" /f /s
goto :EOF
```

开始复制

```sh
rem [Reg_WoW64]
regcopy HKLM\Software\Classes\Wow6432Node\CLSID

regcopy HKLM\Software\Classes\WOW6432Node\DirectShow
regcopy "HKLM\Software\Classes\WOW6432Node\Media Type"
regcopy HKLM\Software\Classes\WOW6432Node\MediaFoundation

regcopy HKLM\Software\Wow6432Node

regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SMI
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,x86_microsoft.windows.c..-controls.resources_*
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,x86_microsoft.windows.common-controls_*
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,wow64_microsoft.windows.gdiplus.systemcopy_*
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,x86_microsoft.windows.gdiplus_*
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,x86_microsoft.windows.i..utomation.proxystub_*
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,x86_microsoft.windows.isolationautomation_*
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,x86_microsoft.windows.systemcompatible_*
regcopy HKLM\Software\Microsoft\Windows\CurrentVersion\SideBySide\Winners,x86_microsoft-windows-m..tion-isolationlayer_*

rem [Reg_WoW64_Bigger_Classes]
regcopy HKLM\Software\Classes\Wow6432Node

rem [Reg_WoW64_Mini_Software]
regcopy HKLM\Software\Wow6432Node\Microsoft\CTF
regcopy HKLM\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Authentication
regcopy HKLM\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer
regcopy HKLM\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Themes
regcopy "HKLM\Software\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Svchost"
regcopy "HKLM\Software\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Winlogon"
```
