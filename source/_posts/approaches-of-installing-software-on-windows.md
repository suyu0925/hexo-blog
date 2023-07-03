---
title: windows下的软件安装方法
date: 2023-07-03 11:20:47
tags:
- windows
description: 在windows下安装软件有很多种方法，从前都是使用最传统的安装文件，但随着windows向社区靠拢，软件包管理器逐渐成为主流。
---
在windows下安装软件有很多种方法，从前都是使用最传统的安装文件，但随着windows向社区靠拢，软件包管理器逐渐成为主流。

## 使用安装文件
最常规的就是下载安装文件了。注意要去官方源下载，避免文件被篡改。
通常有三个选择：
- portable
- exe
- msi
protable是便携绿色免安装版本，下载完直接运行exe就能使用。
exe是通用的可执行文件。
msi则是微软安装包，相比exe更安全，配置也更丰富。
个人偏向选择portable > msi > exe。

## 脚本安装
自从有了PowerShell，使用脚本安装越来越方便。比如：
```powershell
irm get.scoop.sh | iex
```
[irm(Invoke-RestMethod)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod)用来下载脚本文件，[iex(Invoke-Expression)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-expression)则用来解释执行表达式。

如果是第一次运行脚本安装，需要先修改一下对网络下载的脚本文件的安全策略：
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 软件包管理器
linux有apt和yum，mac有homebrew，那么windows有没有命令行式的软件包管理器呢？
当然有，还很多呢。

### [chocolatey](https://community.chocolatey.org/)
最老牌的包管理工具，拥有最齐全的生态，常见的软件都有。

### [scoop](https://scoop.sh/)
新秀。[相比chocolatey](https://github.com/ScoopInstaller/Scoop/wiki/Chocolatey-and-Winget-Comparison)有这些优势：
- 安装到当前用户，所以无需管理员权限
- 安装好的软件全部在~/scoop/这一个目录下，方便管理
- 使用一个json文件来保存对软件包的安装描述，简洁明了
与winget的对比可以看[这里](https://github.com/ScoopInstaller/Scoop/discussions/4777)。

### [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
微软官方的[开源项目](https://github.com/microsoft/winget-cli)。
原理上差不多算是调用没有UI界面的原软件安装包，类似`install --silent`。
建议的安装方式是从Microsoft Store安装，果然很官方。
目前支持的软件包不算多。
