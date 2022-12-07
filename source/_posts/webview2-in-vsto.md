---
title: 在vsto中使用webview2
date: 2022-12-06 14:05:07
tags: excel-add-in
description: 想用webview2来代替winform开发复杂界面，记录一下碰到的各种问题。
---
## webview2使用本地html
为了避免多部署一个web服务器，并且要支持不同版本，将html放在本地最合适不过了。

在经历了[一系列讨论](https://github.com/MicrosoftEdge/WebView2Feedback/issues/37)后，webview2对访问本地文件的方式最终定稿在了[SetVirtualHostNameToFolderMapping](https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2_3?view=webview2-1.0.1462.37#setvirtualhostnametofoldermapping)。

[这里](https://github.com/microsoft/microsoft-ui-xaml/issues/1967#issuecomment-893621478)有C#的示例代码：
```csharp
    await myWebview.EnsureCoreWebView2Async(); // ensure the CoreWebView2 is created
    var core_wv2 = myWebview.CoreWebView2;
    if (core_wv2 != null)
    {
        core_wv2.SetVirtualHostNameToFolderMapping(
            "appassets.example", "assets",
            Microsoft.Web.WebView2.Core.CoreWebView2HostResourceAccessKind.Allow);

        myWebview.Source = new Uri("https://appassets.example/myVideo.mp4");
    }
```

## 将数据文件添加至ClickOnce应用

一般来说，要想将数据文件放至ClickOnce应用，可以点击[应用程序文件](https://learn.microsoft.com/zh-cn/previous-versions/visualstudio/visual-studio-2015/deployment/how-to-specify-which-files-are-published-by-clickonce)按钮打开应用程序对话框(Application Files Dialog Box)操作。

但vsto应用没有这个按钮。

微软推荐的解决方案是使用[Mage](#附录mage)，这里有一篇适用于vs2015的过时文档：[How to: Include a Data File in a ClickOnce Application](https://learn.microsoft.com/zh-cn/previous-versions/visualstudio/visual-studio-2015/deployment/how-to-include-a-data-file-in-a-clickonce-application?view=vs-2015&redirectedfrom=MSDN)。

长求总就是：
1. 给app manifest中的file标签添加writeableType="applicationData"属性
2. 重新签名app manifest
3. 更新deployment manifest并重新签名

在vsto中，app manifest为`Application Files\ExcelAddin_1_0_0_0\ExcelAddin.dll.manifest`，deployment manifest为`ExcelAddin.vsto`。

```powershell
# 重新签名manifest
dotnet mage -s "Application Files\ExcelAddin_1_0_0_0\ExcelAddin.dll.manifest" -certfile ExcelAddin_ProdKey.pfx -pwd yourpassword

# 重新签名vsto
dotnet mage `
  -update ExcelAddin.vsto `
  -appmanifest "Application Files\ExcelAddin_1_0_0_0\ExcelAddin.dll.manifest" `
  -certfile "ExcelAddin_ProdKey.pfx" `
  -pwd yourpassword
```

## 将数据文件添加至vsto应用

在[Office解决方案中的数据](https://learn.microsoft.com/en-us/visualstudio/vsto/data-in-office-solutions)这篇文章中，微软有介绍vsto应用中可用的数据类型，貌似只有xml和数据库文件。

想把html添加至vsto应用供webview2本地使用的计划似乎破产，先放一放，回头有空再来看。

## 使用ClickOnce部署一个vsto应用

[这里](https://learn.microsoft.com/en-us/visualstudio/vsto/deploying-an-office-solution-by-using-clickonce?view=vs-2022&tabs=csharp#Put)有一篇如何部署vsto应用的文档。

## 附录：Mage

[Mage](https://learn.microsoft.com/en-us/dotnet/framework/tools/mage-exe-manifest-generation-and-editing-tool)的全写是Manifest Generation and Editing Tool，在我们手动修改Manifest.xml后，需要用它来重新签名。

官方说Mage内置在VS中，只要打开[Visual Studio Developer Command Prompt or Visual Studio Developer PowerShell](https://learn.microsoft.com/en-us/visualstudio/ide/reference/command-prompt-powershell)就能直接使用。但我打开后却仍然提示找不到Mage命令，找找问题在哪里。

### Visual Studio Developer Prompt
顺手一提如何在Windows Terminal中使用Visual Studio Developer Prompt。

Command版本
```bash
cmd.exe /k "C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64
```

Powershell版本
```powershell
powershell.exe -NoExit -Command "&{Import-Module """C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\Tools\Microsoft.VisualStudio.DevShell.dll"""; Enter-VsDevShell 3f987db8 -SkipAutomaticLocation -DevCmdArguments """-arch=x64 -host_arch=x64"""}"
```

### Windows 10 SDK

在Visual Studio Installer中，我们可以选择安装Windows 10 SDK ($Version)。

安装完后，它的安装路径是在`C:\Program Files (x86)\Windows Kits\10\bin\$Version`，这里面有[certmgr.exe](https://learn.microsoft.com/en-us/dotnet/framework/tools/certmgr-exe-certificate-manager-tool)等工具。

### .NET Framework SDK

在Visual Studio Installer中，我们也可以选择安装.NET $Version Framework SDK。

安装完后，它的安装路径在`C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.8 Tools\`下，Mage.exe就在这里。

然而$PATH里的却是`C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.8 Tools\x64`，这里面并没有Mage.exe。

最简单的解决方法是把Mage.exe和MageUI.exe拷贝过去。

### 真正的解决方法

原来在.net 5及以后的版本里，[Mage.exe被废弃](https://learn.microsoft.com/en-us/visualstudio/deployment/clickonce-deployment-dotnet#mageexe)，改用[dotnet-mage](https://github.com/dotnet/deployment-tools/blob/main/Documentation/dotnet-mage/README.md)。

```bash
dotnet tool install --global microsoft.dotnet.mage
dotnet mage -help verbose
```
