---
title: 从微软官方下载windows镜像文件
date: 2023-02-14 14:00:40
tags: windows
description: 记录一下从微软官方下载windows镜像文件的方法。
---
微软在[软件下载页面](https://www.microsoft.com/zh-cn/software-download)提供了windows各个版本的下载。

[Win7的支持已经于2020年1月14日终止](https://support.microsoft.com/zh-cn/windows/windows-7-%E6%94%AF%E6%8C%81%E4%BA%8E-2020-%E5%B9%B4-1-%E6%9C%88-14-%E6%97%A5%E7%BB%88%E6%AD%A2-b75d4580-2cc7-895a-2c9c-1466d9a53962)，[不再支持下载](https://learn.microsoft.com/zh-cn/lifecycle/products/windows-7)。

Win8.1提供了直接的[ISO下载链接](https://www.microsoft.com/zh-cn/software-download/windows8ISO)。

Win11提供了[多种下载方式](https://www.microsoft.com/zh-cn/software-download/windows11)，包括媒体创建工具和ISO直接下载。

Win10的ISO则需要使用[下载页面](https://www.microsoft.com/zh-cn/software-download/windows10)提供的媒体创建工具来下载。

运行[媒体创建工具](https://go.microsoft.com/fwlink/?LinkId=691209)后，先选择`为另一台电脑创建安装介质（U盘、DVD或ISO文件）`。

{% asset_img create-installtion-media.png 创建安装介质 %}

然后选择系统版本

{% asset_img select-edition.png 选择系统版本 %}

再选择直接烧录到U盘，还是下载ISO文件

{% asset_img select-media.png 下载ISO文件 %}

最后选择ISO文件的下载位置就开始下载了。

这样下载到的是当前最新发行版的win10 ISO。

预览版可以在[这里](https://www.microsoft.com/en-us/software-download/windowsinsiderpreviewiso)下载。

如果想下载老版本的ISO，微软是不提供的，只能查看到[Windows 10版本信息](https://learn.microsoft.com/zh-cn/windows/release-health/release-information)。

幸好下载老版本的ISO有个利器，还记得烧录工具[Rufus](https://rufus.ie/zh/)么？它就藏着老版本ISO的下载链接。

打开rufus后，选择下载并再次点击下载按钮。

{% asset_img rufus-download.png 下载镜像文件 %}

在下载完系统列表后，会弹出操作系统选择。

{% asset_img rufus-select-system.png 选择系统 %}

选择发行版本

{% asset_img rufus-select-edition.png 选择版本 %}

再选择架构和语言，就可以开启下载

{% asset_img rufus-start-downloading.png 开始下载 %}

最后就能得到微软隐藏的下载链接，比如[Win10_21H2_Chinese](https://software.download.prss.microsoft.com/dbazure/Win10_21H2_Chinese(Simplified)_x64.iso?t=356cd95e-b39a-46e0-b728-541367e165b8&e=1676444450&h=83c1f33ebb4935587cab6ef16fa1b5c1f29fbf213be4c72db592a88b8c64d746)。

尽量使用下载工具或挂代理下载，直连相当不稳定。
