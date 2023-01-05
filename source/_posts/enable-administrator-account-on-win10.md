---
title: 在win10开启Administrator账户
date: 2023-01-05 10:58:12
tags:
- windows
description: 有些用户从win7升级至win10后会保留Administrator账户登录，会出现不少问题。为了方便复现，记录一下如何在win10上开启Administrator账户登录。
---
Win10默认禁用了Administrator账户，需要手动开启。

## 方法一：命令行

[以管理员身份运行](https://learn.microsoft.com/en-us/troubleshoot/windows-server/shell-experience/use-run-as-start-app-admin)命令行：
```bash
> net user administrator /active:yes
The command completed successfully.
```
即可开启。

注销或锁定后，可以看到增加了Administrator账户。

## 方法二：在计算机管理中操作

使用`Win+X组合键`或右键点击`Win10开始按钮`，呼出[Windows-X-Menu](https://learn.microsoft.com/en-us/shows/inside/windows-x-menu)，打开`计算机管理(Computer Manager)`。

也可在资源管理器右键`此电脑`，再选择`管理(G)`进入。

进入`系统工具（System Tools)`-`本地用户和组(Local Users and Groups)`-`用户(Users)`，双击Administrator，取消禁用。

{% asset_img "enable-administrator.png" "开启Administrator账户" %}
