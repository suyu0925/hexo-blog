---
title: linux中的locale和时区设置
date: 2024-03-18 17:33:30
tags:
description: linux默认的locale是`en_US.UTF-8`，UTC时区。虽说我们绝大多数情况也是使用英文加UTF-8编码，但有时还是需要显示中文和使用中国时区。
---
比如[vnpy_ctp](https://github.com/vnpy/vnpy_ctp)库，它输出的stdout就是gbk编码，在默认环境下会是一堆乱码，这时就需要设置locale了。

修改`/etc/locale.gen`文件，取消`zh_CN.UTF-8 UTF-8`和`zh_CN.GB18030 GB18030`的注释，然后执行`locale-gen`命令。
也可以直接添加到文件末尾。

```bash
sudo apt update 
sudo apt -y install locales 
sudo echo "zh_CN.GB18030 GB18030" > /etc/locale.gen
locale-gen
```

又比如我们使用[cron](https://crontab.guru/)运行定时任务通常是使用北京时间，但默认的locale是UTC，不小心很容易出错。

安装[tzdata]()包，然后创建`/etc/localtime`软链接到`/usr/share/zoneinfo/Asia/Shanghai`。

```bash
sudo apt -y install tzdata 
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
