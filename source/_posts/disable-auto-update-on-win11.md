---
title: 关闭win11上的自动更新
date: 2024-12-11 13:56:03
tags:
  - windows
description: 在使用rdpwrap后，自动更新很容易导致服务失效，记录一下如何关闭win11上的自动更新。
---

如果在网上搜索`怎么关闭win11上的自动更新`，无非有下面三个答案：

1. 手动暂停更新，每 5 周点一次
2. 注册表添加`NoAutoUpdate`值为 1
3. 使用组策略编辑器

## 手动暂停更新

默认最多暂停 5 周，这个 5 周的数值其实也是可以设置的。

```bat
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "FlightSettingsMaxPauseDays" /t REG_DWORD /d 3500 /f
```

设置最多延迟 3500 天后，就可以选择暂停 500 周了。

删除这个值，就会恢复默认的 5 周。注意删除命令需要管理员权限。

```bat
reg delete "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "FlightSettingsMaxPauseDays" /f
```

与暂停更新 5 周不同，还可以在获取到更新后，推迟一段时间再更新。添加这个值会使`在最新更新可用后立即获取`选项不可用。可以参考[这篇文章](https://learn.microsoft.com/zh-cn/windows/deployment/update/waas-configure-wufb)的`暂停功能更新`章节。

```bat
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v "DeferFeatureUpdatesPeriodInDays" /t REG_DWORD /d 365 /f
```

## 关闭自动更新

我们也可以使用注册来关闭自动更新。注意这个注册表在`Policies`下，需要管理员权限。

```bat
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" /v NoAutoUpdate /t REG_DWORD /d 1 /f
```

可以使用另一个值使 Windows 更新下的`检查更新`按钮不可用。

```bat
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" /v SetDisableUXWUAccess /t REG_DWORD /d 1 /f
```

将值改为0即可恢复。

## 使用组策略编辑器

我们运行`gpedit.msc`打开组策略编辑器，进入`计算机配置 - 管理模板 - Windows 更新 - 管理最终用户体验`，关闭`配置自动更新`，启用`删除使用所有 Windows 更新功能的访问权限`。

{% asset_img gpedit-close-update.png 使用组策略编辑器 %}

会起到和注册表一样的效果。

本质上，在组策略编辑器上做的修改，也是应用到注册表上。

## 允许更新，但不重启

很多时候我们并不是不想更新，而是不想重启。可以使用这个注册表值来实现。

```bat
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU" /v NoAutoRebootWithLoggedOnUsers /t REG_DWORD /d 1 /f
```
