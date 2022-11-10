---
title: windows下的time命令
date: 2022-11-10 17:02:02
tags:
- windows
---
linux下有一个很方便的命令可以查看任务耗时：`time docker-compose build`，其实windows下也有类似的工具：
```powershell
Measure-Command {docker-compose build | Out-Default}
```
