---
title: vsto开发随笔
date: 2022-12-01 15:12:33
tags: excel-add-in
description: 之前用office.js开发excel插件失败了，回退到了vsto，记录一下开发中踩到的坑。
---
## VSTOInstaller.exe工具

[VSTOInstaller.exe](https://learn.microsoft.com/zh-cn/visualstudio/vsto/deploying-an-office-solution-by-using-clickonce?view=vs-2022&tabs=csharp#Custom)是Office解决方案的安装程序工具，可以用它来安装和卸载Office解决方案。

安装：
```powershell
.\VSTOInstaller.exe /I http://yourdomain.com/addin.vsto
```

使用/s可静默执行：
```powershell
.\VSTOInstaller.exe /U http://yourdomain.com/addin.vsto /S
```

它的位置默认在`%commonprogramfiles%\microsoft shared\VSTO\10.0\VSTOInstaller.exe`。

**注意**，是`%commonprogramfiles%`，不是`%commonprogramfiles(x86)%`。

如果错误的使用了`%commonprogramfiles(x86)%`，会提示错误：

{% asset_img "VSTOInstall-error.png" "VSTOInstaller运行错误" %}

其实换回`%commonprogramfiles%`就可以了，但已经花了时间去查找解决方案就还是记录一下。

安装[vstor_redist.exe](https://www.microsoft.com/en-us/download/details.aspx?id=48217)就可正常运行`%commonprogramfiles(x86)%`下的VSTOInstaller。使用命令`.\vstor_redist.exe /q /norestart`可静默安装。

## 安装时的安全认证

使用`VSTOInstaller.exe`安装office解决方案时，需要解决方案通过安全认证才能安装。

最官方的安全认证方式当然是注册一个微软认证的[开发者账户](https://learn.microsoft.com/zh-cn/windows/apps/publish/partner-center/account-types-locations-and-fees)，使用开发者账户来发布应用。但咱们做的vsto插件是内部使用，所以跳过这个最麻烦的方案。

除开官方答案，还有两种方式来通过：
- 打开信任提示
- 添加签名到受信任

### 打开信任提示

我们可以让用户[开启信任提示](https://learn.microsoft.com/en-us/visualstudio/deployment/how-to-configure-the-clickonce-trust-prompt-behavior)，这样就可以安装非认证应用。

可以使用脚本来实现，不过请注意，修改注册表**需要管理员权限**。
```powershell
function Register-Registry {
  $path = "HKLM:\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\Security\TrustManager"
  $id = "PromptingLevel"
  New-Item -Path $path -Name $id -Force | Out-Null

  $registryPath = "{0}\{1}" -f $path, $id
  New-ItemProperty -Path $registryPath -Name "MyComputer" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "LocalIntranet" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "TrustedSites" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "Internet" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "UntrustedSites" -Value "Enabled" -PropertyType String -Force | Out-Null

  $path = "HKLM:\SOFTWARE\Microsoft\.NETFramework\Security\TrustManager"
  $id = "PromptingLevel"
  New-Item -Path $path -Name $id -Force | Out-Null

  $registryPath = "{0}\{1}" -f $path, $id
  New-ItemProperty -Path $registryPath -Name "MyComputer" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "LocalIntranet" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "TrustedSites" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "Internet" -Value "Enabled" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $registryPath -Name "UntrustedSites" -Value "Enabled" -PropertyType String -Force | Out-Null
}
```

### 添加签名到受信任

将应用签名证书的公钥给用户，让用户添加至受信任区域。

这个方案比上面的打开信任提示要好，打开提示后用户还是需要每次都点一下确认，而信任签名后所有操作都可以是静默无感的。

操作方式可参考<a href="{% post_path windows-certificate 'windows下的证书' %}#certmgr-exe（证书管理器工具）">certmgr.exe（证书管理器工具）</a>。

## 自更新

自更新也有两种方式，
- ClickOnce自带的更新
- 在程序中更新

### ClickOnce自带的更新

我们在发布时，新更新频率设为`每次运行自定义项时进行检查`就搞定。

不管是打开信任提示还是添加签名到受信任，都可以使用这种方式更新。

### 在程序中更新

想要在程序中更新，用`打开信任提示`的方案就行不通了，[ApplicationDeployment.CheckForUpdateAsync](https://learn.microsoft.com/en-us/dotnet/api/system.deployment.application.applicationdeployment.checkforupdateasync)会抛出异常`User has refused to grant required permissions to the application.`。只能使用添加签名到信任的方案。

但是，在使用[ApplicationDeployment.UpdateAsync]((https://learn.microsoft.com/en-us/dotnet/api/system.deployment.application.applicationdeployment.updateasync))更新后，`ApplicationDeployment.IsNetworkDeployed`变成了false。

网上有回复说要需要将vsto的网址加入**信任网站名单**。

可使用**管理员权限**运行ps脚本：
```powershell
function Add-TrustSite {
  $UserRegPath = "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains"
  $DomainName = "yourdomain.com" # 注意这里只能是一级域名
  if (-not (Test-Path -Path "$UserRegPath\$DomainName"))
  {
    $null = New-Item -Path "$UserRegPath\$DomainName"
  }

  Set-ItemProperty -Path "$UserRegPath\$DomainName" -Name http -Value 2 -Type DWord
  Set-ItemProperty -Path "$UserRegPath\$DomainName" -Name https -Value 2 -Type DWord  
}
```

然而试下并没有什么卵用，该false还是false。

终于找到一个[相同问题的提问](https://stackoverflow.com/questions/39619047/updating-clickonce-vsto-addin-from-within-the-office-itself-does-not-update-the)，里面的最佳回复指向了微软的[一个问答](https://social.msdn.microsoft.com/Forums/vstudio/en-US/5370eb94-1ed0-457c-8a39-40ff6d871c12/vsto-clickonce-and-auto-update)与[博客](https://learn.microsoft.com/zh-cn/archive/blogs/krimakey/click-once-forced-updates-in-vsto-some-things-we-dont-recommend-using-that-you-might-consider-anyway)。

长求总就是，不要在程序中使用ClickOnce Api比如`ApplicationDeployment.UpdateAsync`来进行程序中更新，但可以使用`VSTOInstaller.exe`。参见[这篇博客](https://learn.microsoft.com/zh-cn/archive/blogs/krimakey/click-once-forced-updates-in-vsto-ii-a-fuller-solution)。
