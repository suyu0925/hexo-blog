---
title: adb命令速查表
date: 2024-05-16 11:03:15
tags:
description: adb命令速查表
---

[adb](https://developer.android.com/tools/adb)是`Android Debug Bridge`的缩写，是一个用于调试 Android 设备的命令行工具。

它是一种客户端-服务器程序，包括以下三个组件：

- 客户端：用于发送命令。客户端在开发机器上运行。您可以通过发出`adb`命令从命令行终端调用客户端。
- 守护程序 (adbd)：用于在设备上运行命令。守护程序在每个设备上作为后台进程运行。
- 服务器：用于管理客户端与守护程序之间的通信。服务器在开发机器上作为后台进程运行。

相比使用[Android Studio](https://developer.android.com/studio/intro?hl=zh-cn)中的[SDK 管理器](https://developer.android.com/studio/intro/update#sdk-manager)下载，更推荐下载单独的[Android SDK 平台工具软件包](https://developer.android.com/studio/releases/platform-tools?hl=zh-cn)。

## 工作原理

当您启动某个`adb`客户端时，该客户端会先检查是否有`adb`服务器进程已在运行。如果没有，它会启动服务器进程。服务器在启动后会与本地 TCP 端口 5037 绑定，并监听`adb`客户端发出的命令。

> 注意：所有 adb 客户端均使用端口 5037 与 adb 服务器通信。

然后，服务器会与所有正在运行的设备建立连接。它通过扫描 5555 到 5585 之间（该范围供前 16 个模拟器使用）的奇数号端口查找模拟器。服务器一旦发现`adb`守护程序 (adbd)，便会与相应的端口建立连接。

每个模拟器都使用一对按顺序排列的端口：一个用于控制台连接的偶数号端口，另一个用于`adb`连接的奇数号端口。例如：

模拟器 1，控制台：5554
模拟器 1，`adb`：5555
模拟器 2，控制台：5556
模拟器 2，`adb`：5557
依此类推。

如上所示，在端口 5555 处与`adb`连接的模拟器与控制台监听端口为 5554 的模拟器是同一个。

服务器与所有设备均建立连接后，您便可以使用`adb`命令访问这些设备。由于服务器管理与设备的连接，并处理来自多个`adb`客户端的命令，因此您可以从任意客户端或从某个脚本控制任意设备。

## 查询设备

```sh
adb devices -l
```

## 连接

```sh
adb connect 127.0.0.1:16384
```

## 重启

```sh
adb kill-server
adb start-server
```

## 针对设备发出命令

```sh
adb -s serial number $command
```

## 设备端口转发

可以使用`forward`命令设置任意端口转发，将特定主机端口上的请求转发到设备上的其他端口。

以下示例设置了主机端口 6100 到设备端口 7100 的转发：

```sh
adb forward tcp:6100 tcp:7100
```

以下示例设置了主机端口 6100 到 local:logd 的转发：

```sh
adb forward tcp:6100 local:logd
```

如果您尝试确定发送到设备上指定端口的内容，上述做法可能会非常有用。系统会将收到的所有数据写入系统日志记录守护程序，并显示在设备日志中。

## 复制文件

`pull`和`push`命令可以用来复制文件。

如需从设备中复制某个文件或目录（及其子目录），请使用以下命令：

```sh
adb pull $remote $local
```

如需将某个文件或目录（及其子目录）复制到设备，请使用以下命令：

```sh
adb push $local $remote
```

### 复制目录

除了文件外，也可以直接 pull 整个目录：

```sh
adb pull /sdcard/Download
```

### 复制多个文件

如果想扁平化目录结构，可以借助[find](https://www.geeksforgeeks.org/find-command-in-linux-with-examples/)命令：

```sh
adb shell find "/sdcard" -iname "*.png"
```

这样会输出所有 png 文件的路径，然后可以遍历每一个文件，用`adb pull`命令将其下载到本地。

PowerShell

```powershell
adb shell find "/sdcard" -iname "*.png" | ForEach-Object { adb pull $_ sdcard_png_files/ }
```

Linux sh

```sh
adb shell find "/sdcard" -iname "*.png" | tr -d '\015' | while read line; do adb pull "$line" "sdcard_png_files/"; done;
```
