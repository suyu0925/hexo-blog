---
title: "[OpenWrt]充当kms激活服务器"
date: 2022-11-25 16:34:42
tags:
- openwrt
description: 虽然绑定windows账号后，windows本体点击就送，但Office还是需要购买正版。如果不高兴每年续费Microsft 365，又不信任网上那些激活工具，那么可以折腾一下kms。
---
## 写在最前

已经不再需要使用kms激活windows啦，参见{% post_link microsoft-activation 微软家产品的激活 %}，只要一行命令，即可实现微软家产品的激活。

## 安装vlmcsd

首先需要安装openwrt上的kms服务端：[openwrt-vlmcsd](https://github.com/cokebar/openwrt-vlmcsd)。

vlmcsd很久没有更新了，但不要看着最近更新时间是2018年就害怕，它不更新是因为没必要更新，大敢的用吧。

可以直接下载预编译的ipk，最新的版本是[svn1113-1](https://raw.githubusercontent.com/cokebar/openwrt-vlmcsd/gh-pages/vlmcsd_svn1113-1_x86_64.ipk)。

## luci-app-vlmcsd

如果不想敲命令行，下一步可以安装[luci-app-vlmcsd](https://github.com/cokebar/luci-app-vlmcsd)。

它预编译的[最新发布版](https://github.com/cokebar/luci-app-vlmcsd/releases)是[1.0.2-1](https://github.com/cokebar/luci-app-vlmcsd/releases/download/v1.0.2-1/luci-app-vlmcsd_1.0.2-1_all.ipk)。

## 启动

去到vlmcsd的luci-app控制页面，启用服务。

一般不需要修改配置文件。

虽然vlmcsd不需要我们提供kms密钥，可以了解一下。微软把Windows的kms密钥直接公布在[网站上](https://learn.microsoft.com/en-us/windows-server/get-started/kms-client-activation-keys)，Office的kms密钥[随便搜搜](http://woshub.com/configure-kms-server-for-ms-office-2016-volume-activation/)就有。

## 客户端

### 安装Office 2016

没有找到官方源，但可以通过`SW_DVD5_Office_Professional_Plus_2016_64Bit_ChnSimp_MLF_X20-42426.ISO`这个文件名在网上很轻易的搜索到第三方下载链接。
一听到第三方下载链接是不是就有点怕，好在有checksum可以验证。

文件: SW_DVD5_Office_Professional_Plus_2016_64Bit_ChnSimp_MLF_X20-42426.ISO
大小: 1123452928 字节
MD5: 60DC8B1892F611E41140DD3631F39793
SHA1: AEB58DE1BC97685F8BC6BFB0A614A8EF6903E318
CRC32: 8D8AC6D1

可以运行PowerShell Cmdlet: [Get-FileHash](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash)来很方便的验证：
```powershell
> Get-FileHash SW_DVD5_Office_Professional_Plus_2016_64Bit_ChnSimp_MLF_X20-42426.ISO -Algorithm SHA1 | Format-List

Algorithm : SHA1
Hash      : AEB58DE1BC97685F8BC6BFB0A614A8EF6903E318
Path      : F:\SW_DVD5_Office_Professional_Plus_2016_64Bit_ChnSimp_MLF_X20-42426.ISO
```

### 激活Office

使用**管理员权限**运行：
```powershell
> cd "C:\Program Files\Microsoft Office\Office16"
> cscript ospp.vbs /sethst:192.168.8.1
Microsoft (R) Windows Script Host Version 5.812
Copyright (C) Microsoft Corporation. All rights reserved.

---Processing--------------------------
---------------------------------------
Successfully applied setting.
---------------------------------------
---Exiting-----------------------------

> cscript ospp.vbs /act
Microsoft (R) Windows Script Host Version 5.812
Copyright (C) Microsoft Corporation. All rights reserved.

---Processing--------------------------
---------------------------------------
Installed product key detected - attempting to activate the following product:
SKU ID: d450596f-894d-49e0-966a-fd39ed4c4c64
LICENSE NAME: Office 16, Office16ProPlusVL_KMS_Client edition
LICENSE DESCRIPTION: Office 16, VOLUME_KMSCLIENT channel
Last 5 characters of installed product key: WFG99
<Product activation successful>
---------------------------------------
---------------------------------------
---Exiting-----------------------------
```
