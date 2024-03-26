---
title: 在命令行快速切换目录
date: 2021-11-19 09:27:54
tags: 善用佳软
description: 每个人都有快速进入某个目录的偏好方式，比如文件夹快捷方式、Total Commander等，这里介绍一个命令行下的佳软。
---
首先介绍一下[pushd](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/pushd)和[popd](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/popd)，在Windows Command Prompt与Linux Bash中都默认支持。
```cmd
C:\TEMP>pushd .
C:\TEMP>cd "\Documents and Settings\user\Desktop"
C:\Documents and Settings\user\Desktop>popd
C:\TEMP>
```
从名称与示例中可以直接看出它的用法，同时它支持嵌套。

但pushd和popd的功能还是太简单，不能大幅提升效率。

**隆重推出本期佳软：[z](https://github.com/rupa/z)。**

z的原理非常简单，它hack了cd命令，维护记录用户cd的目录列表，以频率和访问时间排序。

原版只支持bash或zsh，下载后将z.sh放到用户目录下，然后在.bashrc或.zshrc中添加source命令即可。
```bash
echo ". ~/z.sh" >> ~/.bashrc
source ~/z.sh
```

windows下可使用PowerShell的[移植版](https://github.com/badmotorfinger/z)。
```powershell
PS C:\>Install-Module z -AllowClobber -Force
```

```powershell
PS C:\>z des(press Tab)
PS C:\>z 'C:\Users\user\Desktop'
```

如果提示脚本权限问题，需要先设置[PowerShell执行策略](https://docs.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.2)
```powershell
PS C:\>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
PS C:\>Install-Module z
```
