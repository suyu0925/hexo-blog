---
title: vscode的登录状态问题
date: 2023-04-17 14:04:45
tags:
- vscode
description: 最近vsocde老是提示未登录，登录后状态只能保持到程序关闭。
---
其实这是一个已知问题。在vscode的官方文档用户指南中，有一篇[Troubleshooting keychain issues](https://code.visualstudio.com/docs/editor/settings-sync#_troubleshooting-keychain-issues)，专门介绍了这个问题。

问题出现原因是windows的凭据已满，导致无法保存钥匙串。在[issue #130893](https://github.com/microsoft/vscode/issues/130893)中第一次被报告。

{% asset_img too-many-credentials.png Windows凭据过多 %}

解决方法是清理过期的无效凭据，可使用PowerShell命令：
```powershell
cmdkey /list | Select-String -Pattern "LegacyGeneric:target=(vscode.+)" | ForEach-Object { cmdkey.exe /delete $_.Matches.Groups[1].Value }
```
