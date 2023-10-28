---
title: 介绍一下pve虚拟机
date: 2023-10-08 12:33:44
tags:
description: 在NAS上运行的虚拟化操作系统选择上，不再是windows、linux，而是esxi、pve和unraid。本文介绍一下pve。
---
pve全称是Proxmox Virtual Environment，是[protomox](https://www.proxmox.com/)的产品。

## 在hyper-v中使用

### [嵌套虚拟化](https://learn.microsoft.com/zh-cn/virtualization/hyper-v-on-windows/user-guide/nested-virtualization)

注意，pve依赖虚拟化技术，需要[开启hyper-v的嵌套虚拟化](https://learn.microsoft.com/zh-cn/virtualization/hyper-v-on-windows/user-guide/enable-nested-virtualization)。

使用管理员权限运行
```powershell
Set-VMProcessor -VMName <VMName> -ExposeVirtualizationExtensions $true
```
