---
title: 【转载】在远程桌面下启动MATLAB的方法
date: 2021-04-06 16:51:25
tags:
description: 此方法可以解决远程桌面下启动MATLAB时的License Manager Error -103错误。
---
本文转载自[zkw zkw](https://www.zhihu.com/people/zkw-zkw)的[知乎专栏文章](https://zhuanlan.zhihu.com/p/32228416)。

此方法可以解决远程桌面下启动MATLAB时的License Manager Error -103错误。

也能够解决远程桌面下启动modelsim的错误。

方法如下：

1. 打开C:\Program Files\MATLAB\R2015b\licenses\license*.lic
2. 在每条记录后添加“TS_OK”

之后就可以在远程桌面中正常打开matlab。

{% asset_img "lic.jpg" "lic" %}

方法思路来源：

1. [远程登录时安装MATLAB的License Manager Error -103错误](https://blog.csdn.net/yanerhao/article/details/52203394) ：Matlab出现这一出错信息，通常为远程登录所致。究其原因，大概是FLEXlm的一个bug，凡是用到FLEXlm的软件，在打开时都必须有一个本地用户登录，否则远程登录就会出错。
发现了MATLAB与FLEXlm的关系。
2. [RVCT远程登录时报错的解决办法](https://blog.csdn.net/a58220655/article/details/48996045) ：最后参考RVDS自带的文档“Macrovision FLEXlm End User Guide v9.0”里面的介绍，在licence.dat文件中相关位置加上了 TS_OK字段后远程登录就再也没问题了。
发现了TS_OK字段。
3. [为什么我的MATLAB激活成功后打开还是激活界面！](http://blog.sina.com.cn/s/blog_471e6c930102x2qv.html)
找到了TS_OK字段的具体用法样例。
