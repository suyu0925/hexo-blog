---
title: 在vscode中关掉对一段代码的格式化
date: 2023-04-04 11:26:11
tags:
- vscode
description: 有时为了代码对齐，我们会破坏代码格式，但又想用自动化格式代码，此时可以这样做。
---
## 需求
在vscode的github项目，也有人提出了[这个需求](https://github.com/microsoft/vscode/issues/33772)。

因为vscode默认只提供ts和js的格式化工具，所以被移到了typescript项目的[issue](https://github.com/microsoft/TypeScript/issues/18261)。

最后官方也没给出解决方法，截止到目前，issue仍然是打开状态。

## 第三方代码格式化工具
众多第三方代码格式化工具都提供了保留代码格式的指令，比如[js-beautify](https://github.com/beautify-web/js-beautify#preserve-directive)、[prettier](https://prettier.io/docs/en/ignore.html)。

## 解决方案
有一个网友提供了vscode插件[TypeScript Essential Plugins](https://marketplace.visualstudio.com/items?itemName=zardoy.ts-essential-plugins)来实现这个功能。

但这个插件还掺杂着很多其它功能，有时间可以自己写一个单一功能的插件。
