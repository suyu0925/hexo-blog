---
title: 在vsto中使用webview2
date: 2022-12-06 14:05:07
tags: excel-add-in
description: 想用webview2来代替winform开发复杂界面，记录一下碰到的各种问题。
---
## 用户数据文件夹(UDF)
Webview2需要使用[user data folder(UDF)](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/user-data-folder)，通常默认的UDF是在.exe同目录。

但vsto比较特殊，UDF的默认目录是`C:\Program Files (x86)\Microsoft Office\Root\Office16\EXCEL.EXE.WebView2`。vsto没有权限访问这个目录。

所以在vsto中使用webview2，必须要设定UDF，比如：
```C#
    string homeDir = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
    string userDataFolder = Path.Combine(homeDir, "ExcelAddin/UDF");
    var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
    await webView.EnsureCoreWebView2Async(env);
```

### Administrator账户
但要注意这里有个特例：Administrator账户。

如果用户是Administrator，Webview2界面会一直白屏。调试发现是`await webView.EnsureCoreWebView2Async(env);`抛出异常：
```
System.ArgumentException:
'WebView2 was already initialized with a different CoreWebView2Environment.
Check to see if the Source property was already set or EnsureCoreWebView2Async was previously called with different values.'
```

原因在[WebView2Feedback的这个issue](https://github.com/MicrosoftEdge/WebView2Feedback/issues/2435#issuecomment-1140186931)中被提及：
在Designer.cs中的InitializeComponent函数里，`this.webView.Source = new System.Uri("about:blank", System.UriKind.Absolute);`会使用默认UDF初始化CoreWebView2Environment。

而由于上面提到的原因，非Administrator账户运行的vsto没有权限访问默认目录，会初始化错误。此时反倒没有任何问题。
但如果用户是Administrator，此时初始化成功。而在后续的InitWhenLoaded时又再次使用userDataFolder来EnsureCoreWebView2Async，导致两次使用的CoreWebView2Environment不一致而报错。

解决方案：
- 【需官方解决】可在webview2控件的属性编辑器中设置Source属性为空
当在编辑器中设置Source属性为空时，不设置webView.Source，也就不会使用默认UDF初始化CoreWebView2Environment
- 在InitializeComponent中不设置webview.Source
注释掉`this.webView.Source = new System.Uri("about:blank", System.UriKind.Absolute);`。
但因为Designer.cs是编辑器生成的，所以每次修改界面后都要记得手动注释，这个方案不行。
- try/catch EnsureCoreWebView2Async，针对此情况特殊处理
```csharp
    try
    {
        var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);
        await webView.EnsureCoreWebView2Async(env);
        initWebview();
    }
    catch (Exception ex)
    {
        if (ex.Message.StartsWith("WebView2 was already initialized with a different CoreWebView2Environment."))
        {
            await webView.EnsureCoreWebView2Async();
            initWebview();
        }
        else
        {
            MessageBox.Show("EnsureCoreWebView2 error: " + ex.ToString());
        }
    }
```
这样更通用些，虽然判断Exception.Message也不是很优雅，但在官方给出解决方案之前可以先用着。

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

## 添加html文件到ClickOnce

### 普通应用

这里先拿普通桌面应用举例，vsto比较特别，放在后面再看。

首先将index.html添加进工程，这里需要修改index.html的两个属性：

- [复制到输出目录](https://social.technet.microsoft.com/wiki/contents/articles/53248.visual-studio-copying-files-to-debug-or-release-folder.aspx)

可选值是不复制，始终复制和如果较新则复制。如果选择不复制，只会影响本地调试，并不会影响ClickOnce发布。

- [生成操作(Build Action)](https://learn.microsoft.com/en-us/visualstudio/ide/build-actions#build-action-values)

当选择为“内容”时，vs会自动将文件放至[应用程序文件](https://learn.microsoft.com/zh-cn/previous-versions/visualstudio/visual-studio-2015/deployment/how-to-specify-which-files-are-published-by-clickonce)。可在工程的发布页点击`应用程序文件`按钮打开应用程序对话框(Application Files Dialog Box)查看。

{% asset_img "publish.png" "发布页" %}

注意，不要把index.html的发布状态设为`数据文件`，设为数据文件后index.html就不在安装路径(Installation Path)，导致webview2访问不到。

{% asset_img "application-files-dialog-box.png" "应用程序对话框" %}

下图是index.html分别为`数据文件`和`包括`在客户端安装后的文件树对比，ClickOnce应用的安装路径在`%LocalAppData%/Apps/2.0/`下。

{% asset_img "compare-include-and-data-file.png" "客户端的文件树对比" %}

### vsto应用

vsto应用虽然在发布页没有这个`应用程序文件`按钮，

{% asset_img "publish-vsto.png" "vsto应用的发布页" %}

但可以手动修改app manifest，再使用[Mage](#附录mage)签名。

使用方法可参考[How to: Include a Data File in a ClickOnce Application](https://learn.microsoft.com/en-us/visualstudio/deployment/how-to-include-a-data-file-in-a-clickonce-application)，顺便一提，似乎微软的最新文档[在github上有一份](https://github.com/MicrosoftDocs/visualstudio-docs/blob/main/docs/deployment/how-to-include-a-data-file-in-a-clickonce-application.md)，这样更方便查找。

长求总就是：
1. 修改app manifest（给[file标签](https://learn.microsoft.com/en-us/visualstudio/deployment/file-element-clickonce-application#elements-and-attributes)添加writeableType="applicationData"属性即为更改文件的发布状态为`数据文件`）
2. 重新签名app manifest
3. 更新deployment manifest并重新签名
4. 将deployment manifest拷贝至app manifest目录下

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

# 拷贝vsto
copy "ExcelAddin.vsto" "Application Files\ExcelAddin_1_0_0_0\ExcelAddin.vsto"
```

## 依旧无法访问

在普通应用中，`SetVirtualHostNameToFolderMapping`的起始目录就是工程的输出目录。

但在vsto应用中，这个起始目录不知道在哪。虽然`Directory.GetCurrentDirectory()`得到的是`%UserProfile%\Documents`，但把Assets放到Documents下后，webview2仍然无法访问。只能使用绝对路径的`file:///`。

在[Office解决方案中的数据](https://learn.microsoft.com/en-us/visualstudio/vsto/data-in-office-solutions)这篇文章中，微软有介绍vsto应用中可用的数据类型，貌似只有xml和数据库文件。

想把html添加至vsto应用供webview2本地使用的计划似乎破产，只能先放下了，等待机缘。

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

## 附录：在安装vsto时拷贝文件

[这里](https://learn.microsoft.com/en-us/visualstudio/vsto/deploying-an-office-solution-by-using-clickonce?view=vs-2022&tabs=csharp#Put)有一篇如何部署vsto应用的文档，里面有介绍如何在安装和更新vsto时使用[Post-deployment action](https://learn.microsoft.com/en-us/visualstudio/vsto/postactions-element-office-development-in-visual-studio#post-deployment-action-example)做文件拷贝的操作。

我们可以在安装和更新vsto时把静态网页文件拷贝到用户目录里，再使用webview2绝对路径来访问。

**注意**

1. 在webview2的使用场景里，需要把微软官方示例中的这两行代码删掉，因为我们不是`document-level customizations`。
```csharp
    ServerDocument.RemoveCustomization(destFile);
    ServerDocument.AddCustomization(destFile, deploymentManifestUri);
```

2. 如果`postAction`抛出异常，vsto会将安装出错的插件卸载，但并不会清除`%LocalAppData%/Apps/2.0/`下的文件。此时有可能需要手动清除才能恢复正常。

## 附录：客户机安装webview2运行时

Webview2运行时的[安装方式](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution#understanding-the-options-at-the-runtime-download-page)有3种，分别是在线安装，离线安装和指定版本安装。

通常使用[离线安装包](https://msedge.sf.dl.delivery.mp.microsoft.com/filestreamingservice/files/7e516d67-e834-4e72-ae7b-fe18b0ea75bb/MicrosoftEdgeWebView2RuntimeInstallerX64.exe)（安装文件存放在自己服务器上防止外网被墙），可使用命令行参数实现[静默安装](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/distribution#offline-deployment)：
```bash
MicrosoftEdgeWebView2RuntimeInstallerX64.exe /silent /install
```
