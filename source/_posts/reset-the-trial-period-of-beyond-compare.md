---
title: 重置beyond compare的试用期
date: 2017-04-21 02:38:40
tags:
- beyond compare
- computer science
- 善用佳软
categories: 
- computer science
---

首先声明一点，拒绝使用盗版或破解版，并且也不要过于依赖重置试用期的trick。像这种好用经典又不贵的软件还是入个正版吧。~~又不是Adobe，BC的标准版才[35刀](https://www.scootersoftware.com/shop)~~

### mac

删除Library/Application Support/Beyond Compare/registry.dat

```bash
rm ~/Library/Application\ Support/Beyond\ Compare/registry.dat
```

### windows

在注册表中删除`计算机\HKEY_USERS\{USER_SID}\SOFTWARE\Scooter Software\Beyond Compare ${VERSION}\CacheID`。

其中`USER_SID`是用户的[Security Identifier](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers)，可以在`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList`中找到，从`ProfileImagePath`的值可以看出对应的用户名。

`VERSION`是BC的版本号，[最新版是5](https://www.scootersoftware.com/download)。

### ubuntu

```bash
rm -rf ~/.beyondcompare
```
