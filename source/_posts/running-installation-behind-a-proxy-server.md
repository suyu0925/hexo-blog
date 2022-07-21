---
title: 记录一下如何在命令行使用代理
date: 2022-07-19 15:24:51
tags:
- proxy
description: 即使设置了操作系统的代理，在命令行下也不会默认生效，记录一下如何在命令行使用代理。
---
在windows`系统设置`下的`代理服务器设置`可以设置操作系统级别的代理，但并不会在命令行中生效。

记录一下命令行下的常用命令要怎样使用代理：

## 通用

关于是否使用代理，民间有一个[约定](https://wiki.archlinux.org/index.php?title=Proxy_server&oldid=596484#Environment_variables)：环境变量`HTTP_RPOXY`，`HTTPS_PROXY`和`NO_PROXY`。

但它还不是[标准](https://about.gitlab.com/blog/2021/01/27/we-need-to-talk-no-proxy/)，所以并不是所有的命令行工具都支持。

powershell
```powershell
$env:http_proxy="http://127.0.0.1:10809"
$env:https_proxy="http://127.0.0.1:10809"
```

linux bash
```bash
export http_proxy="http://127.0.0.1:10809"
export https_proxy="http://127.0.0.1:10809"
```

## [npm](https://docs.npmjs.com/cli/v8/using-npm/config#proxy)和[yarn](https://classic.yarnpkg.com/en/docs/cli/config)

使用代理
```bash
npm config set proxy http://127.0.0.1:10809
yarn config set https_proxy http://127.0.0.1:10809
```

关闭代理
```bash
yarn config delete proxy
npm config delete https_proxy
```

## [pip](https://pip.pypa.io/en/stable/user_guide/#using-a-proxy-server)

```bash
pip install --proxy http://127.0.0.1:10809 -r requirements.txt
```

## [curl](https://linux.die.net/man/1/curl)和[Invoke-WebRequest](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest?view=powershell-7.2)

```bash
curl -x http://127.0.0.1:10809 https://google.com

Invoke-WebRequest -Uri https://google.com -Proxy http://127.0.0.1:10809
```

## [git](https://git-scm.com/docs/git-config)

使用代理
```bash
git config --global http.proxy http://127.0.0.1:10809
```

关闭代理
```bash
git config --global --unset http.proxy
```
