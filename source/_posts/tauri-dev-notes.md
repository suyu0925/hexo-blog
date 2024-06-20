---
title: tauri开发笔记
date: 2024-06-20 13:50:55
tags:
description: tauri算是桌面开发的一款利器，这里记录一些开发过程中的遇到的问题和解决方案。
---

## 自更新

tauri 的自更新实现的还是比较简单，看看[文档](https://tauri.app/zh-cn/v1/guides/distribution/updater)就基本明白怎么用了。

记录一下更新一版的流程。

1. 修改版本号

`tauri.conf.json`中的版本号和`package.json`是两个独立的配置，并不会同步。

通常只需要修改`tauri.conf.json`就可以。需要在前端中显示版本号时，使用 tauri api [getVersion](https://tauri.app/v1/api/js/app/#getversion)而不是`VITE_APP_VERSION`。

2. 编译新版本

在编译之前，记得要先在命令行中设置环境变量`TAURI_PRIVATE_KEY`和`TAURI_KEY_PASSWORD`，这样才能生成应用签名。

3. 复制安装包到文件服务器

在`tauri.conf.json`中的[tauri.updater](https://tauri.app/zh-cn/v1/guides/distribution/updater#tauri-configuration)部分，我们定义了用来检查更新的 endpoints，格式像这样`https://releases.myapp.com/{{target}}/{{arch}}/{{current_version}}`。

这里的`{{current_version}}`是当前应用的版本号，`{{target}}`是目标平台，`{{arch}}`是目标架构。

假设我们当前版本是`1.0.1`，目标平台是`windows`，架构是`x86_64`，那么我们的更新包说明文件地址应该是`https://releases.myapp.com/windows/x86_64/1.0.1`。

它的内容是一个 json 对象，包含了新版本的信息，例如：

```json
{
  "version": "1.0.1",
  "notes": "添加自动更新功能",
  "pub_date": "2024-03-21T09:25:57Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVTeWRvb2RlSElDdFlsV28vWktvM1psdlZUVUtoMUJoRTM5OSsrV0RZeTBuZk8zdFU5VlYvV2FwMU0vdmFVdHJmUThVYWhBSlFabXFXbm1tcFF0QXFPaFVJdmJwcGhPNndRPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzEwOTE5ODE4CWZpbGU6dXBsb2FkLWFzc3RfMS4wLjNfeDY0LXNldHVwLm5zaXMuemlwCk03bkRtOGV5TDJ3dmprUUc4OFFSdWdDbHZ0QWxZTE9KUmRKRkRLVUNjazV6WElsKzJsTDhoZzJ3bFhNaFJUWmlBdWJwYm5ocTBCT3pjeDB0MG9ORkR3PT0K",
      "url": "https://releases.myapp.com/packages/myapp_1.0.1_x64-setup.nsis.zip"
    }
  }
}
```

它描述了当前最新版本就是`1.0.1`，app 在启动时，会拉取这个 json 文件，根据`version`来判断是否需要更新。

在我们升级时，先不要改动这个文件，先把编译好的安装包上传到`https://releases.myapp.com/packages/myapp_1.0.2_x64-setup.nsis.zip`。`myapp_1.0.2_x64-setup.nsis.zip.sig`就是`signature`，一会儿要用到。

4. 添加新版本信息

加完安装包后，我们再修改`1.0.1`这个 json 文件，让它升级到`1.0.2`。基本上需要修改每一个字段。

```json
{
  "version": "1.0.2",
  "notes": "修复了一些bug",
  "pub_date": "2024-04-06T09:25:57Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVTeWRvb2RlSElDdGZvRlAxWi80Q0hNQ0VGblhTTjkvNHB2NFBEQkxUVHBwdUgyVjdrYThEeGcyS3VmSUQ0cU9LU3V3UnpBS1liV0YwZUtGQkdiSlpqcC90Zm1ScnBTTFFJPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNzE4ODYzMTQ5CWZpbGU6dXBsb2FkLWFzc3RfMS4wLjRfeDY0LXNldHVwLm5zaXMuemlwCnBabGNQb09JdXpKekpMUDA1NEI0WVJiNTRpZU9SUmhBK29ZbmtrL3FoWUduYmhHS25xUlU3cjByemNuaUNQNlkyaDlWamg0bEJtWWhVT0hhNnZ3RkFnPT0K",
      "url": "https://releases.myapp.com/packages/myapp_1.0.2_x64-setup.nsis.zip"
    }
  }
}
```

注意，这里我们还需要创建一个新文件，内容与上面的一样，取名为`1.0.2`。这样`1.0.2`版本才能拉取到属于它自己的更新说明文件。

## webview 的 UDF 目录

windows 的 webview2 有 [UDF 目录](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/user-data-folder)，用来存放 local storage、cookie 等数据。

我们可以通过 js api [appLocalDataDir](https://tauri.app/v1/api/js/path/#applocaldatadir)来获取这个目录。

通常情况下，这个目录是`${$env:localappdata}\${tauri.bundle.identifier}\EBWebView`。

## 环境变量

如果发现环境变量与设置的不符，请检查是否开启了 vscode 中的[Enable Persistent Sessions](https://code.visualstudio.com/docs/terminal/advanced#_persistent-sessions)。vite 会[以当前终端的环境变量为准](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)，并不会使用.env 中的环境变量覆盖掉当前终端中的环境变量。

在进行编译时，最好使用系统终端，不要使用vscode自带的终端，防止环境被污染。
