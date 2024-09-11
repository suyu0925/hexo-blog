---
title: 在windows上使用fnm碰到的问题
date: 2024-09-11 14:03:09
tags:
description: fnm是nodejs官方推荐的windows包管理器之一，但在中文环境下使用存在问题。
---
为了兼容不同的开发环境，通常我们会使用包管理器来[安装nodejs](https://nodejs.org/zh-cn/download/package-manager)而不是直接使用安装文件。

在windows系统下nodejs官方推荐了以下几个包安装管理器：

{% asset_img package-manager.png 包管理器 %}

[fnm](https://github.com/Schniz/fnm)基于rust编写，速度最快，使用起来也方便，首先选它。

它的使用很简单，使用`fnm env`生成环境变量，再导入就完了。

然而在中文环境会遇到问题，我是发现`conda activate`失效，一路追踪下来才定位到是`fnm env`的锅。

当我们运行`fnm env | Out-String | Invoke-Expression`时，会设置一些环境变量：

```powershell
$env:PATH = "C:\Users\dev\AppData\Local\fnm_multishells\14556_1726035448343;C:\Program Files (x86)\Tencent\微信web开发者工具\dll;"
$env:FNM_RESOLVE_ENGINES = "false"
$env:FNM_DIR = "C:\Users\dev\AppData\Roaming\fnm"
$env:FNM_COREPACK_ENABLED = "false"
$env:FNM_LOGLEVEL = "info"
$env:FNM_MULTISHELL_PATH = "C:\Users\dev\AppData\Local\fnm_multishells\14556_1726035448343"
$env:FNM_NODE_DIST_MIRROR = "https://nodejs.org/dist"
$env:FNM_ARCH = "x64"
$env:FNM_VERSION_FILE_STRATEGY = "local"
```

原理很简单：`$env:APPDATA\fnm`里放着下载的各个node版本，`$env:LOCALAPPDATA\fnm_multishells\`下放着很多目录连接（Directory Junction），连接到前面具体的node版本。

但问题出在中文上。（这里骂一句[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，就你搞特殊，文件目录搞中文）

在cmd里，我们不论是直接输出`fnm env`，还是输出到文件`fnm env > env.txt`都正常。

但在powershell里，直接输出`fnm env`正常，但转成字符串`fnm env | Out-String`或者`echo '& fnm env'`，输出到文件`fnm env > env.txt`都会导致中文被错误转码。

```powershell
> echo (& fnm env)
$env:PATH = "C:\Users\dev\AppData\Local\fnm_multishells\14556_1726035448343;C:\Program Files (x86)\Tencent\寰俊web寮€鍙戣€呭伐鍏穃dll;"
```

使用[chcp](https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/chcp)可以查看到当前[活动代码页](https://learn.microsoft.com/zh-cn/windows/win32/intl/code-page-identifiers)是936，编码格式为`GB2312`。
使用`[Console]::InputEncoding`和`[Console]::OutputEncoding`可以查看到命令行输入和输出编码格式均为`GB2312`。

很明显是`fnm env`没有正确的从`GB2312`转码为`UTF-16 LE`，而是被当成了`UTF-8`，并不清楚具体是哪一步出了问题。

## 替代者

连一刻都没有为fnm的死亡哀悼，立刻赶到战场的是：

虽然没有被nodejs官方列出，但在windows上比fnm更流行的包管理器：[nvm-windows](https://github.com/coreybutler/nvm-windows)。

```sh
nvm install lts
nvm use lts
```

## 附录

### 完全移除fnm

使用`winget uninstall Schniz.fnm`卸载fnm程序后，还有几个地方要手动清除：

1. 移除$env:PATH中的`$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe;`
2. 移除`c:\Program Files\nodejs\`
3. 移除`$env:LOCALAPPDATA\fnm_multishells\`
4. 移除`$env:APPDATA\fnm`
