---
title: windows中的uac
date: 2024-01-23 22:12:54
tags:
- windows
description: 今天装了台新电脑，过程中踩了几个和Administrator相关的坑，记录一下。
---
新电脑的系统是别人装好了，因为不是自己买的，也就没有使用官方镜像重装。

系统默认使用本地Administrator登录，且没有设置密码。

## windows账号登录

第一件事是改windows账号登录，结果发现怎么也登录不上，最后一步会提示：
```
哎呀，出错了
无论出现什么问题，有可能是我们的错误。请重试。
```

网上说的什么修改DNS啦、重置网络连接啦，都是扯。其实原因很简单，完全是windows懒得换一个提示。

在使用本地账号登录windows账号后，原本地账号就消失被替换了，而Administrator账号是不能移除的，所以windows不允许使用Administrator登录windows账号。

## 默认使用管理员权限

添加一个归属于Administrators用户组的新本地账号，再登录windows账号，成功登录。

但出现了新问题：打开终端后，发现默认使用的是管理员权限。这样安装很多软件都会出现问题。

最后发现问题出在[用户账户控制（UAC）](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/)，系统默认是最低级别：从不通知，这样会导致所有应用都直接使用管理员权限运行，而不是有需求时才请求。
