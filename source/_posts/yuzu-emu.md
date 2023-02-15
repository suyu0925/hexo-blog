---
title: Nintendo Switch模拟器yuzu
date: 2023-02-15 11:02:23
tags: 善用佳软
description: 看到朋友分享才发现，原来在pc上模拟switch已经这么成熟了。 
---
说到switch模拟器，目前首推[C++写的](https://github.com/yuzu-emu/yuzu)的[yuzu](https://yuzu-emu.org/)。

[C#写的](https://github.com/Ryujinx/Ryujinx)的老大哥[Ryujinx](https://ryujinx.org/)兼容性好，但运行速度还是稍慢。

## Early Access
它提供免费版，以及付费的[Early Access版](https://yuzu-emu.org/help/early-access/)。付费版拥有更多功能。

感谢好人[Kryptuq](https://github.com/Kryptuq)，他有发行[自己编译的EA版](https://github.com/Kryptuq/Yuzu-Early-Access-files/releases)。

## 缺少组件
下载解压后直接运行`yuzu.exe`，会提示缺少组件：密钥、固件和游戏。

{% asset_img missing-component.png 缺少组件 %}

## 配置文件目录
yuzu的配置文件目录可以从`文件 -> 打开 yuzu 文件夹`进入。

{% asset_img yuzu-folder.png yuzu文件夹 %}

它的读取顺序先是与yuzu.exe同目录下的`./user`，然后再是`$Env:AppData/yuzu`。

密钥、固件、按键、显示等所有设置都是保存在配置文件目录里的，妥善保存`./user`目录就可以做到便携式。

## 密钥
密钥是用来解码游戏的，包括`Prod.keys`和`Title.keys`，需要[从switch真机上抽取转储](https://yuzu-emu.org/help/quickstart/#dumping-prodkeys-and-titlekeys)。

感谢[prod.keys](https://prodkeys.net/)，它直接提供了[yuzu密钥的下载](https://prodkeys.net/yuzu-prod-keys/)。需要注意，密钥和固件需要版本匹配，比如均为v15.0.1。

下载解压后，将两个.keys文件拷贝至`./user/keys/`目录下即可。

## 固件
虽然yuzu不要求一定要有固件，但有些游戏会要求新固件，所以最好还是装一下。

惯例，官方推荐的方式仍然是[从switch真机上抽取转储](https://yuzu-emu.org/help/quickstart/#dumping-system-update-firmware)。

再次感谢[prod.keys](https://prodkeys.net/)，它也直接提供了[yuzu固件的下载](https://prodkeys.net/yuzu-firmware/)。需要注意，密钥和固件需要版本匹配，比如均为v15.0.1。

下载解压后，将所有的.nca文件拷贝至`./user/nand/system/Contents/registered/`目录下即可。

## 获取游戏
[官方推荐的获取游戏方式](https://yuzu-emu.org/wiki/faq/#how-do-i-get-games)只有一个，就是[从自己的卡带提取转储](https://yuzu-emu.org/help/quickstart/#dumping-cartridge-games)。

但很明显这不现实，我们用模拟器玩ns不是因为想在PC上玩，而是因为没有卡带~~（其实就是因为穷）~~。

游戏下载可以去这几个地方：
- [nxbrew](https://nxbrew.com/)
- [nsw2u](https://nsw2u.com/)
- [rowspure](https://romspure.cc/roms/switch)
- [yuzuroms](http://www.yuzuroms.tk/)
- [switch618](https://www.switch618.com/)。

### rom格式
switch游戏的rom格式有两种：xci和nsp。

xci是直接从卡带提取的文件；

nsp则相当于数字版游戏，对应到真机就是从eshop里下载后的内容。

这两种格式的文件用在破解后的switch真机上会有区别，用在模拟器上基本没区别。

可能还会有一种nsz，其实就是把多个nsp打包在了一起。

## 系统设置
下载完后，默认系统设置中的语言为英语，地区为美国，我们需要改成中文和中国。

如果游戏中有时间的概念，比如早晚和四季，也可以在这里修改系统时间。

{% asset_img system-config.png 系统设置 %}

更多使用教程可以参见B站[一花の一界](https://space.bilibili.com/66958652)写的[yuzu模拟器安装使用教程(持续更新)](https://www.bilibili.com/read/cv15405863)。
