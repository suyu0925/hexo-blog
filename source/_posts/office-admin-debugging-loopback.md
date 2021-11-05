---
title: office-admin-debugging时每次都提示localhost loopback
date: 2021-05-13 14:24:02
tags: excel-add-in
description: 每次调试都要选个Y/n实在是太烦了……
---

最近在做一个[excel插件](https://docs.microsoft.com/en-us/office/dev/add-ins/excel/excel-add-ins-overview)，使用新的[office.js](https://github.com/OfficeDev/office-js)技术栈而不是[VisualStudio Tools for Office](https://docs.microsoft.com/en-us/visualstudio/vsto/create-vsto-add-ins-for-office-by-using-visual-studio?view=vs-2019)。

## 问题

开发时需要用到office-addin-debugging，

```bash
$ office-addin-debugging start manifest.xml desktop --app excel
Debugging is being started...
App type: desktop
? Allow localhost loopback for Microsoft Edge WebView? (Y/n) 
```

但每次启动都会提示而不是会记住选择。

## 查找原因

看了下源码，问题出现的原因其实出奇的简单。

我们一步步的看吧。

### office-addin-debugging命令

`office-addin-debugging`调用的是`node_modules\.bin\`下的可执行文件，在windwos下是`office-addin-debugging.cmd`

```bash
node  "%~dp0\..\office-addin-debugging\cli.js" %* 
```

[cli.ts](https://github.com/OfficeDev/Office-Addin-Scripts/blob/4ad77d7ac6e8ce8b7f5e778ad76e47749b489943/packages/office-addin-debugging/src/cli.ts#L32) ->
[commands.ts@start](https://github.com/OfficeDev/Office-Addin-Scripts/blob/4ad77d7ac6e8ce8b7f5e778ad76e47749b489943/packages/office-addin-debugging/src/commands.ts#L82) ->
[start.ts@startDebugging](https://github.com/OfficeDev/Office-Addin-Scripts/blob/4ad77d7ac6e8ce8b7f5e778ad76e47749b489943/packages/office-addin-debugging/src/start.ts#L244) ->
[office-addin-dev-settings@ensureLoopbackIsEnabled](https://github.com/OfficeDev/Office-Addin-Scripts/blob/4ad77d7ac6e8ce8b7f5e778ad76e47749b489943/packages/office-addin-debugging/src/start.ts#L300)

```typescript
        // enable loopback for Edge
        if (isWindowsPlatform && parseInt(os.release(), 10) === 10) {
            const name = isDesktopAppType ? "EdgeWebView" : "EdgeWebBrowser";
            await devSettings.ensureLoopbackIsEnabled(name); // <- 为edge开启loopback
        }
```

### office-addin-dev-settings

[appcontainer.ts@ensureLoopbackIsEnabled](https://github.com/OfficeDev/Office-Addin-Scripts/blob/4ad77d7ac6e8ce8b7f5e778ad76e47749b489943/packages/office-addin-dev-settings/src/appcontainer.ts#L123) ->
[appcontainer.ts@isLoopbackExemptionForAppcontainer](https://github.com/OfficeDev/Office-Addin-Scripts/blob/4ad77d7ac6e8ce8b7f5e778ad76e47749b489943/packages/office-addin-dev-settings/src/appcontainer.ts#L51)

```typescript
  return new Promise((resolve, reject) => {
    const command = `CheckNetIsolation.exe LoopbackExempt -s`;

    childProcess.exec(command, (error, stdout) => {
      if (error) {
        reject(stdout);
      } else {
        const expr = new RegExp(`Name: ${name}`, "i"); // <- 判断是否已经在豁免列表
        const found: boolean = expr.test(stdout);
        resolve(found);
      }
    });
  });
```

### stdout

stdout的内容会根据[console code page](https://docs.microsoft.com/en-us/windows/console/console-code-pages)变化，并不一定是英文的。

如果我们的windows显示语言为中文，活跃代码页为[936(gb2312)](https://docs.microsoft.com/en-us/windows/win32/intl/code-page-identifiers)。

```bash
$ chcp
活动代码页: 936
```

此时上面的命令行`CheckNetIsolation.exe LoopbackExempt -s`输出的stout为

```bash
$ CheckNetIsolation.exe LoopbackExempt -s

列出环回免除的 AppContainer

[1] -----------------------------------------------------------------
    名称: microsoft.win32webviewhost_cw5n1h2txyewy
    SID:  S-1-15-2-1310292540-1029022339-4008023048-2190398717-53961996-4257829345-603366646
```

注意到那个汉字`名称:`了吗？此时的匹配就会无效```RegExp(`Name: ${name}`, "i")```。

## 解决方案

### 方案一

直接改源码，只需将[```RegExp(`Name: ${name}`, "i")```](https://github.com/OfficeDev/Office-Addin-Scripts/blob/4ad77d7ac6e8ce8b7f5e778ad76e47749b489943/packages/office-addin-dev-settings/src/appcontainer.ts#L63)改为```RegExp(`${name}`, "i")```就完事。

### 方案二

不改源码，让`childProcess.exec(command,`的stdout为英文。

方案二可能会增加开发的前置工作，故直接使用方案一。只需要修改excel插件工程下的`node_modules\office-addin-dev-settings\lib\appcontainer.js`，就对当前工程一直用效。
