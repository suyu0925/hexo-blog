---
title: 重置beyond compare的试用期
date: 2017-04-21 02:38:40
tags:
- beyond compare
- computer science
categories: 
- computer science
---

首先声明一点，拒绝使用盗版或破解版，并且也不要过于依赖重置试用期的trick。像这种好用经典又不贵的软件还是入个正版吧。~~又不是Adobe，BC的标准版才30刀~~

### mac

删除Library/Application Support/Beyond Compare/registry.dat

```bash
rm ~/Library/Application\ Support/Beyond\ Compare/registry.dat
```

### windows

在注册表中删除HKEY_USERS/xx/SOFTWARE/Scooter Software/Beyond Compare 4/CacheID

### ubuntu

```bash
rm -rf ~/.beyondcompare
```
