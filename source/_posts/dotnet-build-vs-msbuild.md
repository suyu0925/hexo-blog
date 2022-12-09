---
title: dotnet build和msbuild的区别
date: 2022-12-09 15:36:36
tags: excel-add-in
description: 在vs里编译和使用命令行dotnet build经常得到不同的结果，记录一下。
---
## 问题
最近在开发vsto的excel插件，在vs里可以正常编译，但使用[dotnet build](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-build)会报下面这个错：
```output
MSBuild version 17.4.0+18d5aef85 for .NET
  正在确定要还原的项目…
  所有项目均是最新的，无法还原。
F:\ExcelAddin.csproj(333,3): error MSB4019: 找不到导入的项目“C:\Program Files\dotnet\sdk\7.0.100\Microsoft\VisualStudio\v17.0\OfficeTools\Microsoft.
VisualStudio.Tools.Office.targets”。请确认 Import 声明“C:\Program Files\dotnet\sdk\7.0.100\Microsoft\VisualStudio\v17.0\OfficeTools\Microsoft.VisualStudio.Tools.Office.targets”中的表达式正确，且文件位于磁盘上 。

生成失败。

F:\ExcelAddin.csproj(333,3): error MSB4019: 找不到导入的项目“C:\Program Files\dotnet\sdk\7.0.100\Microsoft\VisualStudio\v17.0\OfficeTools\Microsoft.
VisualStudio.Tools.Office.targets”。请确认 Import 声明“C:\Program Files\dotnet\sdk\7.0.100\Microsoft\VisualStudio\v17.0\OfficeTools\Microsoft.VisualStudio.Tools.Office.targets”中的表达式正确，且文件位于磁盘上 。
    0 个警告
    1 个错误

已用时间 00:00:00.77
```

## 猜想
检查了下csproj，发现这么一段：
```xml
  <!-- Include additional build rules for an Office application add-in. -->
  <Import Project="$(VSToolsPath)\OfficeTools\Microsoft.VisualStudio.Tools.Office.targets" Condition="'$(VSToolsPath)' != ''" />
```
`VSToolsPath`在csproj上面有定义：
```xml
  <PropertyGroup>
    <VisualStudioVersion Condition="'$(VisualStudioVersion)' == ''">10.0</VisualStudioVersion>
    <VSToolsPath Condition="'$(VSToolsPath)' == ''">$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v$(VisualStudioVersion)</VSToolsPath>
  </PropertyGroup>
```

那么问题很明显了，在dotnet build和msbuild的不同环境下，`MSBuildExtensionsPath32`变量的值不一样。
我们可以使用`Message`输出变量来验证。

## 验证
在csproj的Project根节点下添加一个`Target`：
```xml
<Project ToolsVersion="16.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <Target Name="PrintLog">
    <Message Text='MSBuildExtensionsPath="$(MSBuildExtensionsPath)"' Importance="high" />
    <Message Text='MSBuildExtensionsPath32="$(MSBuildExtensionsPath32)"' Importance="high" />
  </Target>
```

启动[Visual Studio Developer Powershell](https://learn.microsoft.com/en-us/visualstudio/ide/reference/command-prompt-powershell)，使用msbuild运行这个`Target`：
```powershell
PS > msbuild ExcelAddin.csproj /t:PrintLog
MSBuild version 17.4.0+18d5aef85 for .NET Framework
生成启动时间为 2022/12/9 15:50:26。
项目“F:\ExcelAddin.csproj”在节点 1 上(PrintLog 个目标)。
PrintLog:
  MSBuildExtensionsPath="C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild"
  MSBuildExtensionsPath32="C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild"
已完成生成项目“F:\ExcelAddin.csproj”(PrintLog 个目标)的操作。


已成功生成。
    0 个警告
    0 个错误

已用时间 00:00:00.23
```

再使用dotnet build验证一遍。
但要注意，需要先将csproj修复，最简单的办法是先注释掉`Import Project="$(VSToolsPath)\OfficeTools\Microsoft.VisualStudio.Tools.Office.targets"`。
顺带一提，`dotnet build`等效于`dotnet msbuild --restore`。
```bash
PS > dotnet msbuild --target:PrintLog
MSBuild version 17.4.0+18d5aef85 for .NET
  MSBuildExtensionsPath="C:\Program Files\dotnet\sdk\7.0.100\"
  MSBuildExtensionsPath32="C:\Program Files\dotnet\sdk\7.0.100"
```

验证了我们的猜测，在`dotnet build`和msbuild的不同环境下，属性是不相同的。

## 修改环境变量
我们试试强行修改`dotnet build`的环境变量。
```bash
PS > dotnet msbuild -property:MSBuildExtensionsPath32="C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild"
```
仍然报错，错误信息比较多，这里只列出第一个：
```text
C:\Program Files\dotnet\sdk\7.0.100\Microsoft.Common.CurrentVersion.targets(2352,5): warning MSB3245: 未能解析此引用。未能找到程序集“Microsoft.Office.Tools.v4.0.Framework, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b
03f5f7f11d50a3a, processorArchitecture=MSIL”。请检查磁盘上是否存在该程序集。 如果您的代码需要此引用，则可能出现编译错误。 
[F:\ExcelAddin.csproj]
```

很明显这个错误是`Microsoft.Office.Tools`等依赖带来的：
```xml
  <ItemGroup>
    <Reference Include="Microsoft.Office.Tools.v4.0.Framework, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL">
      <Private>False</Private>
    </Reference>
    <Reference Include="Microsoft.VisualStudio.Tools.Applications.Runtime, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL">
      <Private>False</Private>
    </Reference>
    <Reference Include="Microsoft.Office.Tools, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL">
      <Private>False</Private>
    </Reference>
    <Reference Include="Microsoft.Office.Tools.Common, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL">
      <Private>False</Private>
    </Reference>
    <Reference Include="Microsoft.Office.Tools.Excel, Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a, processorArchitecture=MSIL">
      <Private>False</Private>
    </Reference>
  </ItemGroup>
```
在Visual Studio环境下，这些包都内置了。而在dotnet build环境下，找不到这些包。

## 总结

开发vsto这种特异性的应用没办法使用通用的dotnet工具，老老实实的用msbuild吧。这里有[另一个例子](https://github.com/CZEMacLeod/MSBuild.SDK.SystemWeb/issues/1#issuecomment-809105083)。

另外，如果想使用vscode写代码，也需要特别配置一下C#插件：
```json
{
  "omnisharp.useModernNet": false
}
```
否则[OmniSharp server](https://github.com/OmniSharp/omnisharp-roslyn)会使用dotnet环境，导致无法正常工作。
