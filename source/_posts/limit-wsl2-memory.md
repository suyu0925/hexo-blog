---
title: 限制wsl2的最大使用内存
date: 2022-08-04 15:36:34
tags:
- docker
description: wsl2简直是内存吞噬者，还是做一下限制吧。
---
wsl2默认会吃下80%的内存（`build 20175`之前的版本，之后的版本是50%内存和8G取较小值），并且不会积极释放，所以一旦执行过重负载任务，就得重启才能恢复，实在影响体验。

可以在PowerShell中使用`[environment]::OSVersion.Version`或者CMD中使用`ver`来查看系统版本。

可是docker[推荐的后端又是wsl2](https://docs.docker.com/desktop/windows/wsl/#enabling-docker-support-in-wsl-2-distros)，性能比hyper-v好一些，所以如果系统版本早于`build 20175`就还是给wsl2做一下内存限制，手动设置最多8G吧。

在`%USERPROFILE%`下新建[.wslconfig](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#wslconfig)配置文件，添加如下内容：
```config
# Settings apply across all Linux distros running on WSL 2
[wsl2]

# Limits VM memory to use no more than 8 GB, this can be set as whole numbers using GB or MB
memory=8GB
```
然后重启即可。
