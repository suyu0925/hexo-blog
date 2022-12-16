---
title: 在docker中编译vsto应用
date: 2022-12-15 11:27:19
tags: excel-add-in
description: excel插件写完了，现在想把它的编译放到docker里去，做了一系列尝试……
---
## 限定windows容器
首先，正如{% post_link dotnet-build-vs-msbuild 这里 %}所验证的，vsto的编译与调试需要使用Visual Studio的[Office build tools](https://visualstudio.microsoft.com/zh-hans/vs/features/office-tools/)。

而且[微软表示](https://developercommunity.visualstudio.com/t/please-port-visual-studio-tools-for-office-vsto-to/757925#T-N1439688)由于COM宿主（在这里是Office）[只能支持一个.NET版本](https://github.com/dotnet/runtime/issues/12018#issuecomment-551214265)（.NET Framework 4.8），所以为了兼容以前的插件，将[不会更新vsto至支持.net 5+](https://github.com/dotnet/core/issues/5156#issuecomment-853430132)，建议大家使用跨平台的[Javascript APIs](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins)。虽然大家[纷纷表示](https://developercommunity.visualstudio.com/t/please-port-visual-studio-tools-for-office-vsto-to/757925#T-N1440449)Javascript APIs就是一陀屎，但也只能被迫接受[这个现实](https://learn.microsoft.com/en-us/visualstudio/vsto/getting-started-programming-vsto-add-ins)：vsto不支持跨平台的.net core。

综上，虽然我们可以用[wine](https://www.winehq.org/)来支持msbuild(比如[msbuild-docker](https://github.com/RektInator/msbuild-docker))，但想要编译vsto应用，只能够在windows容器中。

## 极其不愿意的使用windows容器

微软有官文档指导如何[在windows容器上安装编译工具](https://learn.microsoft.com/en-us/visualstudio/install/build-tools-container)。

基于官方示例，我们有两个修改点：
- [使用Windows Server 2019](https://learn.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility)
- 添加[vsto的开发套件](https://learn.microsoft.com/en-us/visualstudio/install/workload-component-id-vs-build-tools#officesharepoint-build-tools)

注意：如果宿主是Windows Server 2022，那就改回[mcr.microsoft.com/windows/servercore:ltsc2022](https://hub.docker.com/_/microsoft-windows-servercore)。除此之外与2019别无二致。

完整的Dockerfile
```Dockerfile
# escape=`

# Use the latest Windows Server Core 2019 image.
FROM mcr.microsoft.com/windows/servercore:ltsc2019

# Restore the default Windows shell for correct batch processing.
SHELL ["cmd", "/S", "/C"]

RUN `
    # Download the Build Tools bootstrapper.
    curl -SL --output vs_buildtools.exe https://aka.ms/vs/17/release/vs_buildtools.exe `
    `
    # Install Build Tools with the Microsoft.VisualStudio.Workload.OfficeBuildTools workload, excluding workloads and components with known issues.
    && (start /w vs_buildtools.exe --quiet --wait --norestart --nocache `
        --installPath "%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools" `
        --add Microsoft.VisualStudio.Workload.OfficeBuildTools --includeRecommended `
        --add Microsoft.VisualStudio.Component.TeamOffice.BuildTools `
        --remove Microsoft.VisualStudio.Component.Windows10SDK.10240 `
        --remove Microsoft.VisualStudio.Component.Windows10SDK.10586 `
        --remove Microsoft.VisualStudio.Component.Windows10SDK.14393 `
        --remove Microsoft.VisualStudio.Component.Windows81SDK `
        || IF "%ERRORLEVEL%"=="3010" EXIT 0) `
    `
    # Cleanup
    && del /q vs_buildtools.exe

# Define the entry point for the docker container.
# This entry point starts the developer command prompt and launches the PowerShell shell.
ENTRYPOINT ["C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\BuildTools\\Common7\\Tools\\VsDevCmd.bat", "&&", "powershell.exe", "-NoLogo", "-ExecutionPolicy", "Bypass"]
```

编译docker镜像
```bash
docker build -t buildtools:latest -m 4GB --progress=plain .
```

### 使用[vsto-add-in-example](https://github.com/suyu0925/vsto-add-in-example)项目来验证
```powershell
Invoke-WebRequest -Uri https://github.com/suyu0925/vsto-add-in-example/archive/refs/heads/main.zip -OutFile vsto-add-in-example.zip
Expand-Archive vsto-add-in-example.zip -DestinationPath .
Rename-Item -Path "vsto-add-in-example-main" -NewName "vsto-add-in-example"
```

使用msbuild[还原](https://learn.microsoft.com/en-us/visualstudio/msbuild/walkthrough-using-msbuild)
```powershell
docker run -it -v ${pwd}/vsto-add-in-example:C:/app buildtools
**********************************************************************
** Visual Studio 2022 Developer Command Prompt v17.4.3
** Copyright (c) 2022 Microsoft Corporation
**********************************************************************
PS C:\> cd app; msbuild -m .\ExcelAddIn.sln -t:restore
```

修改发布网址
```powershell
PS C:\app> (Get-Content .\ExcelAddIn\ExcelAddIn.csproj).replace('http://your.domain.com', 'http://debug.yourdomain.com') | Set-Content .\ExcelAddIn\ExcelAddIn.csproj
```
也可以直接使用[xml](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-xml#examples)
```powershell
$xmlFileName = "${pwd}\ExcelAddIn\ExcelAddIn.csproj"
[xml]$xml = Get-Content $xmlFileName
$installUrl = Select-Xml -Xml $xml //ns:InstallUrl -Namespace @{ ns='http://schemas.microsoft.com/developer/msbuild/2003' }
$installUrl.Node.'#text' = 'http://debug.yourdomain.com'
$xml.Save($xmlFileName)
```

使用msbuild[发布](https://learn.microsoft.com/en-us/visualstudio/deployment/building-clickonce-applications-from-the-command-line)
```powershell
PS C:\app> msbuild -m -t:publish /p:PublishDir="${pwd}.\publish"
```

bump版本号
```powershell
$xmlFileName = "${pwd}\ExcelAddIn\ExcelAddIn.csproj"
[xml]$xml = Get-Content $xmlFileName
$appVersion = Select-Xml -Xml $xml //ns:ApplicationVersion -Namespace @{ ns='http://schemas.microsoft.com/developer/msbuild/2003' }
$appVersion.Node.'#text' = '1.0.1.0'
$xml.Save($xmlFileName)
```

验证成功。
