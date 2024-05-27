---
title: 在windows上不登录用户启动docker
date: 2024-05-27 10:58:56
tags:
- docker
description: docker desktop只提供了登录后自动启动的功能，而重启系统后如果没有自动登录，docker就启动不了了。
---
Docker Desktop在windows上只提供[登录后自动启动](https://docs.docker.com/desktop/settings/windows/#general)的功能，并且以[Docker Desktop是为开发而生](https://forums.docker.com/t/how-to-automatically-start-docker-in-windows-10-without-user-login/140086/2)的理由拒绝了社区里无须登录就启动的请求。

那我们只能自己想办法了。

## 关闭自动更新

最粗暴的办法就是尽可能不重启系统，直接关闭自动更新。但这不是一个好主意。

进入编辑组策略（可使用`gpedit.msc`打开），打开`配置自动更新`。

win11的路径是：`计算机配置` -> `管理模板` -> `Windows 组件` -> `Windows 更新` -> `管理最终用户体验` -> `配置自动更新`。
win10的路径是：`计算机配置` -> `管理模板` -> `Windows 组件` -> `Windows 更新` -> `配置自动更新`。

将`配置自动更新`设置为`已启用` -> `3 - 自动下载并通知安装`，或者狠一点`已禁用`。

{% asset_img group-policy.png 组策略 %}

## 自动登录

如果能够接受无密码登录，那么重启后可以自动登录直接进入桌面。

1. 首先关闭`设置` -> `账户` -> `登录选项` -> `其他设置`中的`为了提高安全性，在此设备上仅允许使用 Windows Hello 登录 Microsoft 账户(推荐)`。
2. 删除PIN码
3. 然后运行`netplwiz`，取消`要使用此设备，用户必须输入用户名和密码`。

## 计划任务

最妥当的办法还是使用任务计划程序（可使用`taskschd.msc`打开）。

创建任务，安全选项选择`不管用户是否登录都要运行`，触发器选择`启动时`，操作选择`启动程序`，程序路径选择`C:\Program Files\Docker\Docker\Docker Desktop.exe`。

注意运行任务时使用的用户账户，必须是安装`Docker Desktop`的用户，是`docker-users`用户组成员。
