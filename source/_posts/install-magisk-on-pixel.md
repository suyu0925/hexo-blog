---
title: 在pixel手机上安装magisk
date: 2023-11-21 22:01:13
tags:
description: 都用pixel了，肯定得root啦。
---
## 准备工作

- 准备好adb和fastboot
- 解锁手机的bootloader
- pixel手机使用的boot.img

将boot.img放到手机的下载目录下：
```shell
adb push ./boot.img /mnt/sdcard/Download/
```

## 安装magisk并修补boot.img

打开magisk应用后，点击Magisk下的`安装`，点击`选择并修补一个文件`，选择拷贝的boot.img，magisk会修补boot.img，产生一个`magisk_patched-xxx.img`。

## 刷入修补过后的boot.img

可进入手机的recovery模式刷入，也可将magisk_patched-xxx.img拷到电脑上，使用fastboot刷入：
```shell
adb pull /mnt/sdcard/Download/magisk_patched-xxx.img ./magisk_patched.img
adb reboot bootloader
fastboot flash boot ./magisk_patched.img
fastboot reboot
```

重启后打开magisk应用，会再重启一次，再次进入magisk，就可以看到已经root成功了。

## 安装magisk模块

参考文章{% post_link unlimited-google-photos-storage Google相册无限存储空间 % }的`一些Pixel手机上的小问题`章节。
