---
title: windows下的证书
date: 2022-11-25 09:35:20
tags:
- windows
description: 在发布应用时经常会碰到证书问题，将windows下证书相关的知识整理一下，从此不再惧怕。
---
数字证书本身就不用过多的解释了，参见[维基百科](https://zh.wikipedia.org/wiki/%E5%85%AC%E9%96%8B%E9%87%91%E9%91%B0%E8%AA%8D%E8%AD%89)。

数字证书最常用的格式标准是[X.509](https://zh.wikipedia.org/wiki/X.509)。windows上也是使用的X.509。

## 常见的文件格式

- der

der的全写是Distinguished Encoding Rules([唯一编码规则](https://en.wikipedia.org/wiki/X.690#DER_encoding))，是[ASN.1](https://zh.wikipedia.org/wiki/ASN.1)标准中定义的一种二进制编码方式。

- pem

pem的全写是Privacy-Enhanced Mail([隐私增强型电子邮件格式](https://zh.wikipedia.org/wiki/Pem%E6%A0%BC%E5%BC%8F))，主要在[RFC 1422](https://www.rfc-editor.org/rfc/rfc1422)定义。为了方便der通过电子邮件传输，采用了base64编码。

pem格式并不约束存放的内容，也可以用来存放私钥、根证书甚至证书签名请求(比如[这里](https://jamielinux.com/docs/openssl-certificate-authority/create-the-intermediate-pair.html))。

可以从注释中看出里面保存的是什么内容：
```pem
-----BEGIN {TYPE}-----
-----END {TYPE}-----
```
列几个常见的`TYPE`：
  1. RSA PRIVATE KEY
  2. PRIVATE KEY
  3. PUBLIC KEY
  4. NEW CERTIFICATE REQUEST

- pfx

pfx的全写是Personal Information Exchange，是微软的[个人信息交换](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/personal-information-exchange---pfx--files)文件格式。

因为太过复杂而被诟病，后被[RSA实验室](https://zh.wikipedia.org/wiki/RSA_%E5%AE%89%E5%85%A8)提出的[PKCS #12](https://zh.wikipedia.org/wiki/PKCS_12)替代。

- PKCS #12

PKCS #12是[公钥密码学标准](https://zh.wikipedia.org/wiki/%E5%85%AC%E9%92%A5%E5%AF%86%E7%A0%81%E5%AD%A6%E6%A0%87%E5%87%86)中的个人消息交换标准，用于实现存储许多加密对象在一个单独的文件中。通常用它来打包一个私钥及有关的X.509证书，或者打包信任链的全部项目。

- PKCS #7

PKCS #7是[公钥密码学标准](https://zh.wikipedia.org/wiki/%E5%85%AC%E9%92%A5%E5%AF%86%E7%A0%81%E5%AD%A6%E6%A0%87%E5%87%86)中的密码消息语法标准，在[RFC 2315](https://www.rfc-editor.org/rfc/rfc2315)中定义。规范了以[公开密钥基础设施](https://zh.wikipedia.org/wiki/%E5%85%AC%E9%96%8B%E9%87%91%E9%91%B0%E5%9F%BA%E7%A4%8E%E5%BB%BA%E8%A8%AD)（PKI）所产生之签名/密文之格式。其目的一样是为了拓展数字证书的应用，其中，包含了[S/MIME](https://zh.wikipedia.org/wiki/S/MIME)和[CMS](https://en.wikipedia.org/wiki/Cryptographic_Message_Syntax)。

java天生支持PKCS #7，通常使用.keystore扩展名。

## 常见的扩展名

- .der

使用der标准编码的二进制文件。

- .pem

通常就是base64编码的der。需要结合文件名来判断存放的内容。比如cert.pem一般是公钥，key.pem是私钥。

- .key

pem格式的私钥。

- .cer, .crt

通常是pem格式的公钥。有时候也可能是der格式的公钥。

- .pfx

保留了微软pfx格式的扩展名，但通常使用的是PKCS #12格式。

- .keystore, .p7b

PKCS #7格式的文件。其中，java天生支持.keystore。

## windows下的证书工具

### certmgr.msc（证书管理单元）

注意区分certmgr`.msc`和certmgr`.exe`。

certmgr.msc会打开**当前用户**的证书。它属于mmc（Microsoft管理控制台）的一部分。

### mmc.exe（Microsoft管理控制台）

进入mmc后，需要先添加证书管理单元。

在添加时，需要选择证书管理单元的管理账户。分为我的用户账户、服务账户和计算机账户。

如果选择我的用户账户，即和certmgr.msc完全一致。

### certmgr.exe（证书管理器工具）

[certmgr.exe](https://learn.microsoft.com/zh-cn/dotnet/framework/tools/certmgr-exe-certificate-manager-tool)在安装Visual Studio时会被顺带安装。它的路径通常在`C:\Program Files (x86)\Windows Kits\10\bin\{Version}\x64\certmgr.exe`，无运行依赖，可以单独拷贝至其它电脑上运行。

它可以用来将证书[添加到受信任的发布者](https://learn.microsoft.com/en-us/visualstudio/deployment/how-to-add-a-trusted-publisher-to-a-client-computer-for-clickonce-applications)。
**使用管理员权限**运行：
```powershell
certmgr.exe -add ExcelAddin_ProdKey.cer -c -s -r localMachine TrustedPublisher
```
即可将公钥添加到受信任的发布者。

**注意**，如果是自签证书，需要**同时添加根证书**。
```powershell
certmgr.exe -add ExcelAddin_ProdKey.cer -c -s -r localMachine Root
```

`ExcelAddin_ProdKey.cer`可为der格式也可为pem格式，`certmgr.exe`都支持。

### Powershell Cmdlet

Powershell提供了很多证书相关的Cmdlet，如
- [New-SelfSignedCertificate](https://learn.microsoft.com/en-us/powershell/module/pki/new-selfsignedcertificate)
- [Export-PfxCertificate](https://learn.microsoft.com/en-us/powershell/module/pki/export-pfxcertificate)
- [Get-PfxCertificate](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-pfxcertificate)
- [Export-Certificate](https://learn.microsoft.com/en-us/powershell/module/pki/export-certificate)

来实现新建证书、导出证书、获取证书信息等等。

### openssl

[openssl](https://www.openssl.org/docs/man3.0/man1/openssl.html)就不用多说啦，最通用的证书工具。

## 证书操作

### 创建自签证书

首先生成自签名证书，保存在windows证书存储区里。
```powershell
$cert = New-SelfSignedCertificate `
  -Type Custom `
  -Subject "CN=Tasty Pub" `
  -CertStoreLocation Cert:\CurrentUser\My `
  -KeyUsage DigitalSignature `
  -KeyAlgorithm RSA -KeyLength 2048 `
  -NotAfter (Get-Date).AddMonths(36)
```

然后将证书导出成pfx文件。
```powershell
$password = "yourpassword"
$securePassword = ConvertTo-SecureString -String $password -Force -AsPlainText
# 如果担心忘记密码，也可以将密码设成空：
$emptyPassword = New-Object System.Security.SecureString
$outname = "./tastypub.pfx"
Export-PfxCertificate `
  -Cert $cert `
  -FilePath $outname `
  -Password $emptyPassword `
  -ChainOption EndEntityCertOnly `
  -NoProperties -Verbose
```

### 从pfx里导出cer公钥

想要从pfx里导出cer公钥，可直接使用Export-Certificate：
```powershell
Get-PfxCertificate -FilePath ExcelAddin_ProdKey.pfx | 
Export-Certificate -FilePath ExcelAddin_ProdKey.cer -Type CERT
```
注意这里[Export-Certificate](https://learn.microsoft.com/en-us/powershell/module/pki/export-certificate)导出的是der格式。

也可使用[openssl](https://www.openssl.org/docs/man3.0/man1/openssl.html)：
```powershell
openssl pkcs12 -in ExcelAddin_ProdKey.pfx -out ExcelAddin_ProdKey.crt -nokeys -clcerts
```
openssl默认导出的是pem格式。

der和pem可以[用openssl任意转换](https://knowledge.digicert.com/solution/SO26449.html)：
```powershell
openssl x509 -inform der -in ExcelAddin_ProdKey.cer -out ExcelAddin_ProdKey.1.pem
openssl x509 -outform der -in ExcelAddin_ProdKey.1.pem -out ExcelAddin_ProdKey.1.cer
fc.exe ExcelAddin_ProdKey.cer ExcelAddin_ProdKey.1.cer
```

### 通过openssl创建自签证书

也可以通过openssl生成pfx。

首先要确认openssl.cnf是否存在，为了统一，我们直接创建一个：
```powershell
Invoke-WebRequest 'http://web.mit.edu/crypto/openssl.cnf' -OutFile ./openssl.cnf
```

首先使用[openssl-req](https://www.openssl.org/docs/man3.0/man1/openssl-req.html)生成一个私钥和公钥：
```powershell
openssl req `
  -config "./openssl.cnf" `
  -x509 -newkey rsa:4096 `
  -nodes `
  -keyout ExcelAddin_New.key `
  -out ExcelAddin_New.crt `
  -days 1080 `
  -subj /CN="Tasty Pub"
```

然后使用[openssl-pkcs12](https://www.openssl.org/docs/man3.0/man1/openssl-pkcs12.html)基于私钥和公钥生成pfx：
```powershell
$password = "yourpassword"
$emptyPassword = ""
openssl pkcs12 `
  -export `
  -out ExcelAddin_New.pfx `
  -inkey ExcelAddin_New.key `
  -in ExcelAddin_New.crt `
  -password pass:$emptyPassword
```
