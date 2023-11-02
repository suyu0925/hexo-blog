---
title: "一款新的启动盘制作工具：ventoy"
date: 2023-11-02 13:25:44
tags:
- 善用佳软
description: 之前有介绍过使用Rufus来烧录启动盘，但每次烧录都需要清空，这样U盘就不能存放东西了。有没有更好的方案呢？
---
答案当然是有，认识一下新朋友：[ventoy](https://www.ventoy.net/cn/index.html)。

它是[国人](https://gitee.com/longpanda)开发的一个[开源工具](https://github.com/ventoy/Ventoy)，可以将多个ISO文件放在U盘中，然后在启动时选择需要启动的ISO文件即可。

{% asset_img screen_uefi.png uefi %}

## 安装

官方提供了[多种安装方式](https://www.ventoy.net/cn/doc_start.html)，本质上相当于烧录了一个启动程序到U盘。

注意，在第一次安装时同样会**格式化磁盘**。

但后续升级时就不会影响磁盘中的内容了，只会升级启动程序。

## [分区类型](https://www.ventoy.net/cn/doc_mbr_vs_gpt.html)

Ventoy官方建议优先使用MBR分区格式：[MBR分区](https://www.ventoy.net/cn/doc_disk_layout.html)格式对UEFI模式的支持，要好过[GPT分区](https://www.ventoy.net/cn/doc_disk_layout_gpt.html)格式对Legacy BIOS的支持。

但我个人觉得，只要不是特别老的主板，明确需要支持[Legacy BIOS](https://en.wikipedia.org/wiki/BIOS)，否则作为个人用户（不需要拿启动盘帮其他人装系统），GPT分区的使用体验更好。

## 安全启动

如果开启了BIOS里的[安全启动](https://learn.microsoft.com/zh-cn/windows-hardware/design/device-experiences/oem-secure-boot)，那么在首次启动时会出现安全校验失败的提示。

此时可按照[操作说明](https://www.ventoy.net/cn/doc_secure.html)操作一遍。

但这个方案并不是完美的，如果碰巧主板不支持，那就需要在Ventoy2Disk中取消勾选安全启动，重新升级一次U盘。并且在BIOS中关闭安全启动。同时满足这两个条件后才可以正常使用Ventoy。

## 插件

Ventoy自身的配置是通过[插件](https://www.ventoy.net/cn/plugin_entry.html)来实现的，插件的配置文件是在ISO分区下的`/ventoy/ventoy.json`。

可以使用[VentoyPlugson](https://www.ventoy.net/cn/plugin_plugson.html)来图形化编辑配置。

### 全局控制

下面列举了一些可能会用到的配置，更多配置就留给你自己去探索啦。

- [使用中文界面](https://www.ventoy.net/cn/doc_menu_language.html)
- [二级启动菜单](https://www.ventoy.net/cn/doc_secondary_boot_menu.html)
- [搜索路径](https://www.ventoy.net/cn/doc_search_path.html)
