---
title: vsto开发随笔
date: 2022-12-01 15:12:33
tags: excel-add-in
description: 之前用office.js开发excel插件失败了，回退到了vsto，记录一下开发中踩到的坑。
---
## VSTOInstall.exe

[VSTOInstall.exe](https://learn.microsoft.com/zh-cn/visualstudio/vsto/deploying-an-office-solution-by-using-clickonce?view=vs-2022&tabs=csharp#Custom)是Office解决方案的安装程序工具，可以用它来安装和卸载Office解决方案。

通常直接运行它就可以，它的位置默认在`%commonprogramfiles%\microsoft shared\VSTO\10.0\VSTOInstaller.exe`。

**注意**，是`%commonprogramfiles%`，不是`%commonprogramfiles(x86)%`。

如果错误的使用了`%commonprogramfiles(x86)%`，会提示错误：

{% asset_img "VSTOInstall-error.png" "VSTOInstaller运行错误" %}

其实换回`%commonprogramfiles%`就可以了，但已经花了时间去查找解决方案就还是记录一下。

安装[vstor_redist.exe](https://www.microsoft.com/en-us/download/details.aspx?id=48217)就可正常运行`%commonprogramfiles(x86)%`下的VSTOInstaller。使用命令`.\vstor_redist.exe /q /norestart`可静默安装。
