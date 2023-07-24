---
title: vsto插件被自动禁用
date: 2023-07-24 10:24:24
tags:
description: 有时excel插件会被自动禁用，查一下原因。
---

首先看一下这个文档[Debug Office projects](https://learn.microsoft.com/en-us/visualstudio/vsto/debugging-office-projects)。

## 自动禁用
在[Debug disabled add-ins](https://learn.microsoft.com/en-us/visualstudio/vsto/debugging-office-projects#debug-disabled-add-ins)一节有提到，如果插件没有按照期望的行为，会被禁用。
禁用分两种，硬禁用和软禁用。

如果是插件的问题导致excel异常退出，那会被视作大麻烦而硬禁用。此时插件会出现在被禁用（Disabled）插件里。
如果插件只是抛出异常但并没有导致excel退出，比如在Startup事件处理抛出异常，则会被软禁用。只是改变`LoadBehavior`，让插件并不会启动时加载，归为非活跃（Inactive）插件。

### 硬禁用
如果在插件正在前台（比如弹出一个对话框，并且阻塞式的在干活），用户此时右键任务栏关闭excel，
{% asset_img not-resposing.png 未响应 %}
{% asset_img collecting-info.png 收集信息 %}
因为插件在前台，会被记录下来。

当再次启动excel时，插件就会被视作大麻烦而提示用户要不要禁用。
{% asset_img hard-disabling.png 硬禁用 %}

被禁用后，需要到`禁用项目`里去打开
{% asset_img re-enable-hard-disabling.png 取消硬禁用 %}

### 软禁用

软禁用则是插件抛出了未影响到excel的异常，比如在`Startup`事件处理中直接抛异常：
{% asset_img throw-in-startup.png 在startup抛异常 %}

当出现这个对话框时，插件就已经被软禁用，无须提示用户操作。

如果只是被设为了非活动，去`COM加载项`里打开就好。或者直接把注册表中的`LoadBehavior`从2改回3。这里可以查看[LoadBehavior values](https://learn.microsoft.com/en-us/visualstudio/vsto/registry-entries-for-vsto-add-ins?view=vs-2022#LoadBehavior)。

## 注册表
关于`LoadBehavior`是在插件的注册表中设定的，可以参见[Registry entries for VSTO Add-ins](https://learn.microsoft.com/en-us/visualstudio/vsto/registry-entries-for-vsto-add-ins?view=vs-2022)。
比如：`计算机\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\Excel\Addins\RzCloudExcelAddin`。

## 调试
在[Troubleshoot startup errors by using a log file and error messages](https://learn.microsoft.com/en-us/visualstudio/vsto/debugging-office-projects?view=vs-2022&redirectedfrom=MSDN#troubleshoot-startup-errors-by-using-a-log-file-and-error-messages) 一节中，有提到如何打开调试。

如果要将错误信息显示在消息框里，可以添加环境变量`VSTO_SUPPRESSDISPLAYALERTS`，设置为0。在使用Visual Studio时，也会起到设置`VSTO_SUPPRESSDISPLAYALERTS`为0的效果。

如果要存文件，则添加环境变量`VSTO_LOGALERTS`设置为1。
log文件的名字是`${addin-name}.vsto.log`，放在manifest同目录下。
如果没有manifest，则放在`$env:temp`目录下。
注意日志文件的编码格式是`UTF-16 LE`。


